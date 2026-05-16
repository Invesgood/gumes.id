// Home page catalog — filter, sort, render, add-to-cart
(function () {
  "use strict";

  const COLORS = [
    { id: "hitam",  label: "Hitam",  hex: "#1a1a1a" },
    { id: "coklat", label: "Coklat", hex: "#5d4037" },
    { id: "tan",    label: "Tan",    hex: "#c68642" },
  ];
  const SIZES = [39, 40, 41, 42, 43];

  const dataEl = document.getElementById("products-data");
  const products = dataEl ? JSON.parse(dataEl.textContent) : [];

  const grid = document.getElementById("product-grid");
  const emptyEl = document.getElementById("empty-state");
  const countEl = document.getElementById("result-count");
  const countTop = document.getElementById("result-count-top");

  const state = {
    category: "Semua",
    color: null,
    sort: "default",
    cardColors: {},   // productId -> selected colorId
    cardSizes: {},    // productId -> selected size
    addedId: null,
    sizeErrorId: null,
  };

  // init default color per product
  products.forEach((p) => {
    if (p.colors && p.colors.length) state.cardColors[p.id] = p.colors[0];
  });

  function applyFilters() {
    let out = [...products];
    if (state.category !== "Semua") out = out.filter((p) => p.category === state.category);
    if (state.color) out = out.filter((p) => (p.colors || []).includes(state.color));
    if (state.sort === "low-high")   out.sort((a, b) => a.priceNum - b.priceNum);
    if (state.sort === "high-low")   out.sort((a, b) => b.priceNum - a.priceNum);
    if (state.sort === "bestseller") out.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    return out;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function cardHTML(p) {
    const activeCid = state.cardColors[p.id] || (p.colors && p.colors[0]);
    const displayImage = (activeCid && p.colorImages && p.colorImages[activeCid]) || p.image;
    const added = state.addedId === p.id;

    const badgeHTML = p.badge
      ? `<div class="bg-surface-container px-3 py-1">
           <span class="text-[10px] uppercase tracking-widest font-bold text-primary-container">${escapeHtml(p.badge)}</span>
         </div>` : "";

    const bestHTML = p.bestSeller
      ? `<div class="bg-on-surface px-3 py-1 flex items-center gap-1">
           <span class="material-symbols-outlined text-surface" style="font-variation-settings:'FILL' 1;font-size:11px">star</span>
           <span class="text-[10px] uppercase tracking-widest font-bold text-surface">Best Seller</span>
         </div>` : "";

    const activeSize = state.cardSizes[p.id] || null;
    const sizeError = state.sizeErrorId === p.id;

    const swatchesHTML = (p.colors && p.colors.length)
      ? p.colors.map((cid) => {
          const c = COLORS.find((x) => x.id === cid);
          if (!c) return "";
          const isActive = activeCid === cid;
          return `<button type="button" data-card-color="${cid}" data-product="${p.id}"
            class="w-5 h-5 border transition-all ${isActive ? "border-on-surface ring-2 ring-offset-2 ring-offset-surface-container-low ring-on-surface scale-110" : "border-outline-variant/70 opacity-70 hover:opacity-100 hover:scale-110"}"
            style="background-color:${c.hex}" title="${c.label}"></button>`;
        }).join("")
      : "";

    const priceRow = `<div class="flex items-center justify-between mb-3">
        <span class="font-[family-name:var(--font-headline)] text-sm md:text-lg text-primary-container leading-tight">${escapeHtml(p.price)}</span>
      </div>`;

    const sizeRow = `<div data-stop class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] uppercase tracking-widest ${sizeError ? "text-error font-bold" : "text-outline"}">${sizeError ? "Pilih ukuran dulu" : "Ukuran (EU)"}</span>
          ${activeSize ? `<span class="text-[10px] uppercase tracking-widest text-on-surface font-bold">EU ${activeSize}</span>` : ""}
        </div>
        <div class="grid grid-cols-5 gap-1.5">
          ${SIZES.map((s) => {
            const isActive = activeSize === s;
            return `<button type="button" data-pick-size="${s}" data-product="${p.id}"
              class="aspect-square flex items-center justify-center text-[11px] md:text-xs border transition-all font-medium ${isActive ? "bg-on-surface text-surface border-on-surface" : "border-outline-variant hover:border-on-surface"}">${s}</button>`;
          }).join("")}
        </div>
      </div>`;

    const colorCartRow = `<div class="flex items-center justify-between gap-2 mt-auto" data-stop>
        <div class="flex items-center gap-3">${swatchesHTML}</div>
        <button type="button" data-add-cart data-product="${p.id}"
          class="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-3 py-2.5 transition-all shrink-0 ${added ? "bg-on-surface text-surface" : "burnished-gradient text-on-primary hover:brightness-110"}">
          <span class="material-symbols-outlined text-sm" style="font-variation-settings:'FILL' ${added ? 1 : 0}">${added ? "check" : "shopping_bag"}</span>
          <span class="hidden sm:inline">${added ? "Added" : "Cart"}</span>
        </button>
      </div>`;

    return `<article data-product-card="${p.id}"
        class="group flex flex-col bg-surface-container-low border border-outline-variant/60 hover:border-outline-variant shadow-sm hover:shadow-lg transition-all cursor-pointer">
        <div class="relative aspect-square bg-surface-container overflow-hidden">
          <img src="${escapeHtml(displayImage)}" alt="${escapeHtml(p.name)}" loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute top-5 left-5 flex flex-col gap-1.5">${badgeHTML}${bestHTML}</div>
        </div>
        <div class="flex-1 flex flex-col px-4 pt-4 pb-4">
          <h2 class="font-[family-name:var(--font-headline)] mb-0.5 text-sm md:text-xl leading-tight">${escapeHtml(p.name)}</h2>
          <p class="text-[10px] md:text-xs text-outline uppercase tracking-widest mb-3">${escapeHtml(p.material)}</p>
          ${priceRow}
          ${sizeRow}
          ${colorCartRow}
        </div>
      </article>`;
  }

  function render() {
    const list = applyFilters();
    if (countEl) countEl.textContent = list.length;
    if (countTop) countTop.textContent = list.length;

    if (list.length === 0) {
      grid.innerHTML = "";
      grid.classList.add("hidden");
      emptyEl.classList.remove("hidden");
      emptyEl.classList.add("flex");
    } else {
      emptyEl.classList.add("hidden");
      emptyEl.classList.remove("flex");
      grid.classList.remove("hidden");
      grid.innerHTML = list.map(cardHTML).join("");
    }

    syncFilterButtons();
  }

  function syncFilterButtons() {
    // Desktop category
    document.querySelectorAll(".filter-cat").forEach((b) => {
      const active = b.dataset.value === state.category;
      b.classList.toggle("text-primary-container", active);
      b.classList.toggle("font-bold", active);
      b.classList.toggle("text-on-surface-variant", !active);
    });
    document.querySelectorAll(".filter-cat-m").forEach((b) => {
      const active = b.dataset.value === state.category;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("text-on-surface-variant", !active);
    });

    // Desktop color
    document.querySelectorAll(".filter-color").forEach((b) => {
      const active = b.dataset.value === state.color;
      const dot = b.querySelector(".filter-color-dot");
      const label = b.querySelector(".filter-color-label");
      const check = b.querySelector(".filter-color-check");
      if (dot) {
        dot.classList.toggle("border-primary-container", active);
        dot.classList.toggle("border-transparent", !active);
        dot.classList.toggle("scale-110", active);
      }
      if (label) {
        label.classList.toggle("text-primary-container", active);
        label.classList.toggle("font-bold", active);
        label.classList.toggle("text-on-surface-variant", !active);
      }
      if (check) check.classList.toggle("hidden", !active);
    });
    const clear = document.getElementById("filter-color-clear");
    if (clear) clear.classList.toggle("hidden", !state.color);
    // Mobile color
    document.querySelectorAll(".filter-color-m").forEach((b) => {
      const active = b.dataset.value === state.color;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
    });

    // Sort
    document.querySelectorAll(".filter-sort").forEach((b) => {
      const active = b.dataset.value === state.sort;
      b.classList.toggle("text-primary-container", active);
      b.classList.toggle("font-bold", active);
      b.classList.toggle("text-on-surface-variant", !active);
    });
    document.querySelectorAll(".filter-sort-pill").forEach((b) => {
      const active = b.dataset.value === state.sort;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
    });
  }

  // --- Event delegation ---
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    // Filter clicks
    const cat = t.closest(".filter-cat, .filter-cat-m");
    if (cat) { state.category = cat.dataset.value; render(); return; }

    const color = t.closest(".filter-color, .filter-color-m");
    if (color) {
      const v = color.dataset.value;
      state.color = state.color === v ? null : v;
      render();
      return;
    }
    if (t.closest("#filter-color-clear")) { state.color = null; render(); return; }

    const sort = t.closest(".filter-sort, .filter-sort-pill");
    if (sort) {
      const v = sort.dataset.value;
      state.sort = state.sort === v && v !== "default" ? "default" : v;
      render();
      return;
    }

    if (t.closest("#reset-filters")) {
      state.category = "Semua"; state.color = null; state.sort = "default"; render(); return;
    }

    // Inside card — color swatch
    const swatch = t.closest("[data-card-color]");
    if (swatch) {
      e.stopPropagation();
      state.cardColors[swatch.dataset.product] = swatch.dataset.cardColor;
      render();
      return;
    }

    // Pick size → just select (no add)
    const pickSize = t.closest("[data-pick-size]");
    if (pickSize) {
      e.stopPropagation();
      const productId = pickSize.dataset.product;
      state.cardSizes[productId] = parseInt(pickSize.dataset.pickSize, 10);
      if (state.sizeErrorId === productId) state.sizeErrorId = null;
      render();
      return;
    }

    // Add to cart button
    const addCart = t.closest("[data-add-cart]");
    if (addCart) {
      e.stopPropagation();
      const productId = addCart.dataset.product;
      const p = products.find((x) => x.id === productId);
      if (!p) return;
      const size = state.cardSizes[productId];
      if (!size) {
        state.sizeErrorId = productId;
        render();
        setTimeout(() => {
          if (state.sizeErrorId === productId) { state.sizeErrorId = null; render(); }
        }, 2000);
        return;
      }
      const activeCid = state.cardColors[p.id] || (p.colors && p.colors[0]);
      const displayImage = (activeCid && p.colorImages && p.colorImages[activeCid]) || p.image;
      window.GumesCart.add({
        productId: p.id,
        name: p.name,
        material: p.material,
        priceNum: p.priceNum,
        price: p.price,
        image: displayImage,
        size,
        color: activeCid || null,
      });
      state.addedId = p.id;
      render();
      setTimeout(() => { state.addedId = null; render(); }, 2000);
      return;
    }

    // Anywhere else on a card → navigate
    const card = t.closest("[data-product-card]");
    if (card && !t.closest("[data-stop]")) {
      window.location.href = `/product/${card.dataset.productCard}`;
    }
  });

  render();
})();
