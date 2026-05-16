// gumes-cart — localStorage-backed cart, exposed as window.GumesCart
(function () {
  "use strict";

  const KEY = "gumes-cart";

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    publish();
  }

  function publish() {
    document.dispatchEvent(new CustomEvent("gumes:cart-changed", { detail: { items: read() } }));
  }

  function sameLine(a, b) {
    return a.productId === b.productId && a.size === b.size && (a.color || null) === (b.color || null);
  }

  const Cart = {
    items() { return read(); },

    totalItems() {
      return read().reduce((sum, i) => sum + (i.quantity || 1), 0);
    },

    subtotal() {
      return read().reduce((sum, i) => sum + (i.priceNum || 0) * (i.quantity || 1), 0);
    },

    add(item) {
      const items = read();
      const existing = items.find((i) => sameLine(i, item));
      if (existing) existing.quantity = (existing.quantity || 1) + 1;
      else items.push({ ...item, quantity: 1 });
      write(items);
      document.dispatchEvent(new CustomEvent("gumes:cart-added", { detail: { item } }));
    },

    setQty(productId, size, color, qty) {
      const items = read().map((i) => {
        if (sameLine(i, { productId, size, color })) {
          return { ...i, quantity: Math.max(1, qty) };
        }
        return i;
      });
      write(items);
    },

    remove(productId, size, color) {
      const items = read().filter((i) => !sameLine(i, { productId, size, color }));
      write(items);
    },

    clear() { write([]); },

    formatIDR(n) { return "Rp " + Number(n || 0).toLocaleString("id-ID"); },
  };

  function updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const total = Cart.totalItems();
    if (total > 0) {
      badge.textContent = total > 9 ? "9+" : String(total);
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  document.addEventListener("DOMContentLoaded", updateBadge);
  document.addEventListener("gumes:cart-changed", updateBadge);
  window.addEventListener("storage", (e) => { if (e.key === KEY) updateBadge(); });

  window.GumesCart = Cart;
})();
