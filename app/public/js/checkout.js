// Checkout page
(function () {
  "use strict";

  const form = document.getElementById("checkout-form");
  const emptyRedirect = document.getElementById("empty-cart-redirect");
  const errorEl = document.getElementById("checkout-error");
  const submitBtn = document.getElementById("co-submit");
  const submitLabel = document.getElementById("co-submit-label");
  const coItems = document.getElementById("co-items");
  const coSubtotal = document.getElementById("co-subtotal");
  const coTax = document.getElementById("co-tax");
  const coTotal = document.getElementById("co-total");

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function renderSummary() {
    const items = window.GumesCart.items();
    if (items.length === 0) {
      form.classList.add("hidden");
      emptyRedirect.classList.remove("hidden");
      return;
    }
    coItems.innerHTML = items.map((it) => `
      <div class="flex justify-between text-sm">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-on-surface-variant truncate max-w-[180px]">${escapeHtml(it.name)}</span>
          <span class="text-outline text-xs shrink-0">×${it.quantity}</span>
        </div>
        <span class="font-medium shrink-0 ml-4">${window.GumesCart.formatIDR(it.priceNum * it.quantity)}</span>
      </div>`).join("");
    const subtotal = window.GumesCart.subtotal();
    const tax = Math.round(subtotal * 0.11);
    coSubtotal.textContent = window.GumesCart.formatIDR(subtotal);
    coTax.textContent = window.GumesCart.formatIDR(tax);
    coTotal.textContent = window.GumesCart.formatIDR(subtotal + tax);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    const items = window.GumesCart.items();
    if (items.length === 0) {
      window.location.href = "/cart";
      return;
    }
    const fd = new FormData(form);
    const subtotal = window.GumesCart.subtotal();
    const tax = Math.round(subtotal * 0.11);
    submitBtn.disabled = true;
    submitLabel.textContent = "Memproses...";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: fd.get("name"),
            email: fd.get("email"),
            address: fd.get("address"),
            city: fd.get("city"),
            postal: fd.get("postal"),
          },
          items, subtotal, tax, total: subtotal + tax,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.error || "Gagal membuat order.";
        errorEl.classList.remove("hidden");
        return;
      }
      window.GumesCart.clear();
      window.location.href = data.redirect_url || `/checkout/success?order=${data.order_id}`;
    } catch {
      errorEl.textContent = "Terjadi kesalahan jaringan. Coba lagi.";
      errorEl.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Place Order";
    }
  });

  renderSummary();
})();
