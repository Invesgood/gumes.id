// Orders page: review modal
(function () {
  "use strict";

  const ordersDataEl = document.getElementById("orders-data");
  const orders = ordersDataEl ? JSON.parse(ordersDataEl.textContent) : [];

  const modal = document.getElementById("review-modal");
  const closeBtn = document.getElementById("modal-close");
  const form = document.getElementById("review-form");
  const ratingValue = document.getElementById("rating-value");
  const stars = document.querySelectorAll(".star-btn");
  const submitBtn = document.getElementById("review-submit");
  const titleEl = document.getElementById("modal-order-title");
  const toast = document.getElementById("toast");

  let currentOrder = null;

  function openModal(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    currentOrder = order;
    titleEl.textContent = order.itemNames || order.id;
    ratingValue.value = "0";
    paintStars(0);
    form.querySelector("textarea[name=comment]").value = "";
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    currentOrder = null;
  }

  function paintStars(value) {
    stars.forEach((btn) => {
      const v = parseInt(btn.dataset.star, 10);
      const icon = btn.querySelector(".material-symbols-outlined");
      const filled = v <= value;
      btn.classList.toggle("text-primary", filled);
      btn.classList.toggle("text-outline-variant", !filled);
      if (icon) icon.style.fontVariationSettings = filled ? "'FILL' 1" : "'FILL' 0";
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 3000);
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const opener = t.closest("[data-review-order]");
    if (opener) { openModal(opener.dataset.reviewOrder); return; }
    if (t === modal) closeModal();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  stars.forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = parseInt(btn.dataset.star, 10);
      ratingValue.value = String(v);
      paintStars(v);
    });
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentOrder) return;
      const rating = parseInt(ratingValue.value, 10);
      if (rating === 0) { showToast("Pilih rating bintang dulu."); return; }
      const fd = new FormData(form);
      const productId = currentOrder.items?.[0]?.product_id;
      if (!productId) { showToast("Order tidak punya produk."); return; }
      submitBtn.disabled = true;
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            customerName: fd.get("customerName"),
            rating,
            comment: fd.get("comment"),
          }),
        });
        if (!res.ok) {
          showToast("Gagal mengirim ulasan.");
          return;
        }
        closeModal();
        showToast("Ulasan berhasil dikirim. Terima kasih!");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
