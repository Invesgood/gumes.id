// Cart page renderer
(function () {
  "use strict";

  const COLOR_HEX = { hitam: "#1a1a1a", coklat: "#5d4037", tan: "#c68642" };

  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");
  const countText = document.getElementById("cart-count-text");
  const itemsEl = document.getElementById("cart-items");
  const summaryItemsEl = document.getElementById("summary-items");
  const summaryCountEl = document.getElementById("summary-count");
  const subtotalEl = document.getElementById("sum-subtotal");
  const taxEl = document.getElementById("sum-tax");
  const totalEl = document.getElementById("sum-total");
  const summaryAsideEl = document.getElementById("cart-summary");
  const leftSectionEl = document.getElementById("cart-left");

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function itemKey(it) {
    return `${it.productId}|${it.size || ""}|${it.color || ""}`;
  }

  function itemHTML(item) {
    const colorBadge = item.color
      ? `<span class="flex items-center gap-1.5 border border-outline-variant/40 text-[10px] uppercase tracking-widest px-3 py-1 text-on-surface-variant">
           <span class="w-2.5 h-2.5 rounded-full" style="background-color:${COLOR_HEX[item.color] || '#888'}"></span>
           ${escapeHtml(item.color)}
         </span>` : "";

    const lineSubtitle = item.quantity > 1
      ? `<p class="text-[10px] text-outline uppercase tracking-widest mb-1">${window.GumesCart.formatIDR(item.priceNum)} × ${item.quantity}</p>`
      : "";

    return `<div class="group flex gap-6 md:gap-8 py-8 first:pt-0" data-key="${itemKey(item)}">
      <div class="relative w-36 md:w-52 aspect-[4/3] bg-surface-container overflow-hidden shrink-0">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}"
             class="absolute inset-0 w-full h-full object-contain" loading="lazy" />
      </div>
      <div class="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div class="flex justify-between items-start gap-4">
          <div class="min-w-0">
            <h3 class="font-[family-name:var(--font-headline)] text-xl md:text-2xl truncate">${escapeHtml(item.name)}</h3>
            <p class="text-xs text-outline mt-1 tracking-widest uppercase">${escapeHtml(item.material || '')}</p>
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              ${item.size ? `<span class="border border-outline-variant/40 text-[10px] uppercase tracking-widest px-3 py-1 text-on-surface-variant">EU ${item.size}</span>` : ''}
              ${colorBadge}
            </div>
          </div>
          <button type="button" data-action="remove" class="text-outline-variant hover:text-error transition-colors shrink-0 mt-1" aria-label="Remove item">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div class="flex flex-wrap justify-between items-end gap-4 mt-6">
          <div class="flex items-center border border-outline-variant/30">
            <button type="button" data-action="dec" ${item.quantity <= 1 ? "disabled" : ""}
              class="w-10 h-10 flex items-center justify-center text-outline hover:text-primary-container disabled:opacity-30 transition-colors" aria-label="Decrease">
              <span class="material-symbols-outlined text-base">remove</span>
            </button>
            <span class="w-10 text-center text-sm font-medium">${item.quantity}</span>
            <button type="button" data-action="inc"
              class="w-10 h-10 flex items-center justify-center text-outline hover:text-primary-container transition-colors" aria-label="Increase">
              <span class="material-symbols-outlined text-base">add</span>
            </button>
          </div>
          <div class="text-right">
            ${lineSubtitle}
            <p class="font-[family-name:var(--font-headline)] text-xl text-primary-container">${window.GumesCart.formatIDR(item.priceNum * item.quantity)}</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  function summaryItemHTML(it) {
    return `<div class="flex justify-between items-center text-sm">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-on-surface-variant truncate max-w-[160px]">${escapeHtml(it.name)}</span>
        <span class="text-outline text-xs shrink-0">×${it.quantity}</span>
      </div>
      <span class="font-medium shrink-0 ml-4">${window.GumesCart.formatIDR(it.priceNum * it.quantity)}</span>
    </div>`;
  }

  function render() {
    const items = window.GumesCart.items();
    const total = items.reduce((s, i) => s + (i.quantity || 1), 0);

    if (items.length === 0) {
      contentEl.classList.add("hidden");
      contentEl.classList.remove("grid");
      emptyEl.classList.remove("hidden");
      emptyEl.classList.add("flex");
      countText.classList.add("hidden");
      summaryAsideEl?.classList.add("hidden");
      leftSectionEl?.classList.remove("lg:w-7/12");
      leftSectionEl?.classList.add("lg:w-full");
      return;
    }
    emptyEl.classList.add("hidden");
    emptyEl.classList.remove("flex");
    contentEl.classList.remove("hidden");
    contentEl.classList.add("grid");
    countText.classList.remove("hidden");
    countText.textContent = `${total} ${total === 1 ? "item" : "items"} selected`;
    summaryAsideEl?.classList.remove("hidden");
    leftSectionEl?.classList.add("lg:w-7/12");
    leftSectionEl?.classList.remove("lg:w-full");

    itemsEl.innerHTML = items.map(itemHTML).join("");
    summaryItemsEl.innerHTML = items.map(summaryItemHTML).join("");
    if (summaryCountEl) summaryCountEl.textContent = `${total} item`;

    const subtotal = window.GumesCart.subtotal();
    const tax = Math.round(subtotal * 0.11);
    const grandTotal = subtotal + tax;
    subtotalEl.textContent = window.GumesCart.formatIDR(subtotal);
    taxEl.textContent = window.GumesCart.formatIDR(tax);
    totalEl.textContent = window.GumesCart.formatIDR(grandTotal);
  }

  itemsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const row = btn.closest("[data-key]");
    if (!row) return;
    const [productId, sizeStr, color] = row.dataset.key.split("|");
    const size = sizeStr ? parseInt(sizeStr, 10) : null;
    const actualColor = color || null;
    const items = window.GumesCart.items();
    const item = items.find((i) =>
      i.productId === productId &&
      (i.size || null) === size &&
      (i.color || null) === actualColor
    );
    if (!item) return;
    if (btn.dataset.action === "remove") window.GumesCart.remove(productId, size, actualColor);
    if (btn.dataset.action === "inc") window.GumesCart.setQty(productId, size, actualColor, item.quantity + 1);
    if (btn.dataset.action === "dec") window.GumesCart.setQty(productId, size, actualColor, Math.max(1, item.quantity - 1));
  });

  document.addEventListener("gumes:cart-changed", render);
  window.addEventListener("storage", (e) => { if (e.key === "gumes-cart") render(); });
  render();
})();
