// Multi-step checkout page
(function () {
  "use strict";

  const form = document.getElementById("checkout-form");
  const emptyRedirect = document.getElementById("empty-cart-redirect");
  const errorEl = document.getElementById("checkout-error");
  const submitBtn = document.getElementById("co-submit");
  const submitLabel = document.getElementById("co-submit-label");
  const coItems = document.getElementById("co-items");
  const coSubtotal = document.getElementById("co-subtotal");
  const coShipping = document.getElementById("co-shipping");
  const coTax = document.getElementById("co-tax");
  const coTotal = document.getElementById("co-total");

  const panels = Array.from(form.querySelectorAll("[data-step-panel]"));
  const stepperEl = document.querySelector("[data-stepper]");
  const stepOrder = ["info", "shipping", "payment"];
  let currentStep = "info";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }

  function selectedShippingCost() {
    const r = form.querySelector('input[name="shipping_method"]:checked');
    return r ? Number(r.dataset.cost || 0) : 0;
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
    const shipping = selectedShippingCost();
    const tax = Math.round(subtotal * 0.11);
    coSubtotal.textContent = window.GumesCart.formatIDR(subtotal);
    coShipping.textContent = shipping > 0 ? window.GumesCart.formatIDR(shipping) : "Gratis";
    coShipping.classList.toggle("text-primary-container", shipping === 0);
    coTax.textContent = window.GumesCart.formatIDR(tax);
    coTotal.textContent = window.GumesCart.formatIDR(subtotal + shipping + tax);
  }

  function updateStepper(activeKey) {
    if (!stepperEl) return;
    const activeIdx = stepOrder.indexOf(activeKey);
    stepperEl.querySelectorAll("[data-step]").forEach((el) => {
      const idx = stepOrder.indexOf(el.dataset.step);
      el.classList.remove("text-on-surface", "font-bold", "text-on-surface-variant", "text-outline");
      if (el.dataset.step === "cart") {
        el.classList.add("text-on-surface-variant");
        return;
      }
      if (idx === activeIdx) el.classList.add("text-on-surface", "font-bold");
      else if (idx < activeIdx) el.classList.add("text-on-surface-variant");
      else el.classList.add("text-outline");
    });
  }

  function validateInfoStep() {
    const required = ["email", "first_name", "address", "district", "city", "province", "postal", "phone"];
    for (const f of required) {
      const el = form.elements[f];
      if (!el) continue;
      if (!el.value.trim()) {
        el.focus();
        el.reportValidity();
        return false;
      }
      if (f === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value)) {
        el.focus();
        el.reportValidity();
        return false;
      }
      if (f === "postal" && !/^\d{5}$/.test(el.value.trim())) {
        el.focus();
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function showStep(key) {
    if (key === "payment" && currentStep === "info" && !validateInfoStep()) return;
    if (key === "shipping" && currentStep === "info" && !validateInfoStep()) return;

    currentStep = key;
    panels.forEach((p) => p.classList.toggle("hidden", p.dataset.stepPanel !== key));
    updateStepper(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  form.addEventListener("click", (e) => {
    const next = e.target.closest("[data-next-step]");
    if (next) { showStep(next.dataset.nextStep); return; }
    const prev = e.target.closest("[data-prev-step]");
    if (prev) { showStep(prev.dataset.prevStep); return; }
  });

  form.addEventListener("change", (e) => {
    if (e.target.name === "shipping_method") renderSummary();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl?.classList.add("hidden");

    const items = window.GumesCart.items();
    if (items.length === 0) { window.location.href = "/cart"; return; }
    if (!validateInfoStep()) { showStep("info"); return; }

    const fd = new FormData(form);
    const subtotal = window.GumesCart.subtotal();
    const shipping = selectedShippingCost();
    const tax = Math.round(subtotal * 0.11);
    submitBtn.disabled = true;
    submitLabel.textContent = "Memproses...";

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: [fd.get("first_name"), fd.get("last_name")].filter(Boolean).join(" ").trim(),
            email: fd.get("email"),
            phone: fd.get("phone"),
            address: fd.get("address"),
            district: fd.get("district"),
            city: fd.get("city"),
            province: fd.get("province"),
            postal: fd.get("postal"),
          },
          shipping_method: fd.get("shipping_method"),
          payment_method: fd.get("payment_method"),
          items, subtotal, tax, shipping, total: subtotal + shipping + tax,
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
      if (errorEl) {
        errorEl.textContent = "Terjadi kesalahan jaringan. Coba lagi.";
        errorEl.classList.remove("hidden");
      }
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Bayar Sekarang";
    }
  });

  renderSummary();
  updateStepper("info");
})();
