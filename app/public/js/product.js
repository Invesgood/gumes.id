// Product detail interactions
(function () {
  "use strict";

  const COLORS = {
    hitam:  { label: "Hitam",  hex: "#1a1a1a" },
    coklat: { label: "Coklat", hex: "#5d4037" },
    tan:    { label: "Tan",    hex: "#c68642" },
  };

  const pEl = document.getElementById("product-data");
  if (!pEl) return;
  const product = JSON.parse(pEl.textContent);

  const state = {
    color: product.colors && product.colors[0] || null,
    size: null,
    image: product.image,
    added: false,
  };

  const variants = product.stockVariants || {};
  function variantKey(size, color) { return `${size}_${color || "default"}`; }
  function stockFor(size, color) { return Number(variants[variantKey(size, color)] || 0); }
  function stockForColor(color) {
    return [39, 40, 41, 42, 43].reduce((sum, s) => sum + stockFor(s, color), 0);
  }

  const mainImg = document.getElementById("main-image");
  const colorLabel = document.getElementById("color-label");
  const sizeLabel = document.getElementById("size-label");
  const stockEl = document.getElementById("stock-status");
  const addIcon = document.getElementById("add-icon");
  const addLabel = document.getElementById("add-label");
  const addBtn = document.getElementById("add-to-cart-btn");

  function paint() {
    if (mainImg) mainImg.src = state.image;
    if (colorLabel && state.color) colorLabel.textContent = (COLORS[state.color]?.label) || "";

    // Color buttons
    document.querySelectorAll(".color-btn").forEach((b) => {
      const active = b.dataset.color === state.color;
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("bg-surface-container", active);
      b.classList.toggle("scale-105", active);
      b.classList.toggle("border-outline-variant", !active);
      b.classList.toggle("text-on-surface-variant", !active);
    });

    // Size buttons
    document.querySelectorAll(".size-btn").forEach((b) => {
      const s = parseInt(b.dataset.size, 10);
      const active = s === state.size;
      const habis = stockFor(s, state.color) === 0;
      b.disabled = habis;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("scale-105", active);
      b.classList.toggle("border-outline-variant", !active);
      b.classList.toggle("text-on-surface-variant", !active && !habis);
      b.classList.toggle("opacity-40", habis);
      b.classList.toggle("line-through", habis);
      b.classList.toggle("cursor-not-allowed", habis);
    });
    if (sizeLabel) {
      sizeLabel.textContent = state.size ? `Ukuran terpilih: EU ${state.size}` : "Pilih Ukuran (EU)";
      sizeLabel.classList.remove("text-error");
    }

    // Stock status
    if (stockEl) {
      let qty, tone, text;
      if (state.size) {
        qty = stockFor(state.size, state.color);
        text = qty === 0 ? "Stok Habis" : qty < 5 ? `Sisa ${qty} (EU ${state.size})` : `Stok: ${qty} (EU ${state.size})`;
      } else {
        qty = stockForColor(state.color);
        text = qty === 0 ? "Stok Habis" : `Total stok: ${qty}`;
      }
      tone = qty === 0 ? "text-error" : qty < 5 ? "text-primary" : "text-on-surface-variant";
      stockEl.textContent = text;
      stockEl.classList.remove("text-error", "text-primary", "text-on-surface-variant");
      stockEl.classList.add(tone);
    }

    // Thumbnails
    document.querySelectorAll(".thumb").forEach((b) => {
      const active = b.dataset.thumb === state.image;
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("opacity-100", active);
      b.classList.toggle("opacity-60", !active);
      b.classList.toggle("border-outline-variant/30", !active);
    });

    // Add button
    const variantHabis = state.size ? stockFor(state.size, state.color) === 0 : false;
    if (addIcon)  addIcon.textContent  = state.added ? "check" : "shopping_bag";
    if (addLabel) addLabel.textContent = state.added ? "Ditambahkan ke Cart" : variantHabis ? "Stok Habis" : "Tambah ke Cart";
    if (addBtn) {
      addBtn.disabled = variantHabis;
      addBtn.classList.toggle("bg-on-surface", state.added);
      addBtn.classList.toggle("text-surface", state.added);
      addBtn.classList.toggle("burnished-gradient", !state.added && !variantHabis);
      addBtn.classList.toggle("text-on-primary", !state.added && !variantHabis);
      addBtn.classList.toggle("opacity-50", variantHabis);
      addBtn.classList.toggle("cursor-not-allowed", variantHabis);
    }
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const colorBtn = t.closest(".color-btn");
    if (colorBtn) {
      state.color = colorBtn.dataset.color;
      state.image = colorBtn.dataset.image || product.image;
      if (state.size && stockFor(state.size, state.color) === 0) state.size = null;
      paint();
      return;
    }

    const sizeBtn = t.closest(".size-btn");
    if (sizeBtn) {
      if (sizeBtn.disabled) return;
      state.size = parseInt(sizeBtn.dataset.size, 10);
      paint();
      return;
    }

    const thumb = t.closest(".thumb");
    if (thumb) {
      state.image = thumb.dataset.thumb;
      paint();
      return;
    }

    if (t.closest("#add-to-cart-btn")) {
      if (addBtn?.disabled) return;
      if (!state.size) {
        if (sizeLabel) {
          sizeLabel.textContent = "Pilih ukuran terlebih dahulu";
          sizeLabel.classList.add("text-error");
        }
        return;
      }
      window.GumesCart.add({
        productId: product.id,
        name: product.name,
        material: product.material,
        priceNum: product.priceNum,
        price: product.price,
        image: state.image,
        size: state.size,
        color: state.color || null,
      });
      state.added = true;
      paint();
      setTimeout(() => { state.added = false; paint(); }, 2500);
    }
  });

  paint();

  // ── Review form ────────────────────────────────────────────────
  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    const ratingInput = document.getElementById("rating-input");
    const stars = reviewForm.querySelectorAll(".rating-star");
    let selectedRating = 0;

    function paintStars(value) {
      stars.forEach((btn) => {
        const r = parseInt(btn.dataset.rating, 10);
        const icon = btn.querySelector("span");
        const filled = r <= value;
        icon.style.fontVariationSettings = filled ? "'FILL' 1" : "'FILL' 0";
        icon.style.color = filled ? "#c68642" : "var(--color-outline-variant)";
      });
    }

    stars.forEach((btn) => {
      btn.addEventListener("mouseenter", () => paintStars(parseInt(btn.dataset.rating, 10)));
      btn.addEventListener("click", () => {
        selectedRating = parseInt(btn.dataset.rating, 10);
        ratingInput.value = selectedRating;
        paintStars(selectedRating);
      });
    });
    reviewForm.querySelector("#rating-stars").addEventListener("mouseleave", () => paintStars(selectedRating));

    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = document.getElementById("review-error");
      err.classList.add("hidden");
      if (selectedRating < 1) {
        err.textContent = "Pilih rating dulu (1–5 bintang).";
        err.classList.remove("hidden");
        return;
      }
      const submitBtn = reviewForm.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      const fd = new FormData(reviewForm);
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: reviewForm.dataset.productId,
            rating: selectedRating,
            comment: fd.get("comment") || "",
            category: product.category,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          err.textContent = data.error || "Gagal mengirim ulasan.";
          err.classList.remove("hidden");
          submitBtn.disabled = false;
          return;
        }
        window.location.reload();
      } catch {
        err.textContent = "Gagal mengirim ulasan.";
        err.classList.remove("hidden");
        submitBtn.disabled = false;
      }
    });
  }
})();
