// Top-right popup notification when an item is added to cart
(function () {
  "use strict";

  let toastEl = null;
  let hideTimer = null;

  function ensureToast() {
    if (toastEl) return toastEl;
    toastEl = document.createElement("div");
    toastEl.id = "cart-toast";
    toastEl.className = "fixed top-6 right-6 z-[100] w-[22rem] max-w-[calc(100vw-2rem)] bg-surface-container-lowest border border-outline-variant/50 shadow-2xl translate-x-[calc(100%+2rem)] opacity-0 transition-all duration-300 ease-out pointer-events-none";
    toastEl.innerHTML = `
      <div class="flex items-stretch">
        <div class="w-1 burnished-gradient shrink-0"></div>
        <div class="flex-1 p-4 flex gap-4 items-start min-w-0">
          <div class="w-16 h-16 bg-surface-container shrink-0 overflow-hidden">
            <img data-toast-image class="w-full h-full object-contain" alt="" />
          </div>
          <div class="flex-1 min-w-0 pt-0.5">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="material-symbols-outlined text-primary-container" style="font-size:14px">check_circle</span>
              <span class="text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold">Ditambahkan</span>
            </div>
            <p data-toast-name class="text-sm font-medium truncate mb-2"></p>
            <a href="/cart" class="inline-block text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary-container border-b border-outline-variant hover:border-primary-container transition-colors pb-0.5">Lihat Keranjang</a>
          </div>
          <button type="button" data-toast-close class="text-outline hover:text-on-surface transition-colors shrink-0" aria-label="Tutup">
            <span class="material-symbols-outlined" style="font-size:18px">close</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(toastEl);
    toastEl.querySelector("[data-toast-close]").addEventListener("click", hide);
    return toastEl;
  }

  function show(item) {
    const el = ensureToast();
    const img = el.querySelector("[data-toast-image]");
    img.src = item.image || "";
    img.alt = item.name || "";
    el.querySelector("[data-toast-name]").textContent = item.name || "";

    requestAnimationFrame(() => {
      el.classList.remove("translate-x-[calc(100%+2rem)]", "opacity-0", "pointer-events-none");
      el.classList.add("translate-x-0", "opacity-100");
    });

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 3500);
  }

  function hide() {
    if (!toastEl) return;
    toastEl.classList.remove("translate-x-0", "opacity-100");
    toastEl.classList.add("translate-x-[calc(100%+2rem)]", "opacity-0", "pointer-events-none");
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  document.addEventListener("gumes:cart-added", (e) => {
    if (e.detail && e.detail.item) show(e.detail.item);
  });
})();
