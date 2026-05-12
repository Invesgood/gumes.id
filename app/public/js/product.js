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

  const mainImg = document.getElementById("main-image");
  const colorLabel = document.getElementById("color-label");
  const sizeLabel = document.getElementById("size-label");
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
      const active = parseInt(b.dataset.size, 10) === state.size;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("scale-105", active);
      b.classList.toggle("border-outline-variant", !active);
      b.classList.toggle("text-on-surface-variant", !active);
    });
    if (sizeLabel) {
      sizeLabel.textContent = state.size ? `Ukuran terpilih: EU ${state.size}` : "Pilih Ukuran (EU)";
      sizeLabel.classList.remove("text-error");
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
    if (addIcon)  addIcon.textContent  = state.added ? "check" : "shopping_bag";
    if (addLabel) addLabel.textContent = state.added ? "Ditambahkan ke Cart" : "Tambah ke Cart";
    if (addBtn) {
      addBtn.classList.toggle("bg-on-surface", state.added);
      addBtn.classList.toggle("text-surface", state.added);
      addBtn.classList.toggle("burnished-gradient", !state.added);
      addBtn.classList.toggle("text-on-primary", !state.added);
    }
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const colorBtn = t.closest(".color-btn");
    if (colorBtn) {
      state.color = colorBtn.dataset.color;
      state.image = colorBtn.dataset.image || product.image;
      paint();
      return;
    }

    const sizeBtn = t.closest(".size-btn");
    if (sizeBtn) {
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
})();
