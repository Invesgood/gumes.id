// Admin panel: products CRUD + reviews moderation
(function () {
  "use strict";

  const COLORS = {
    hitam:  { label: "Hitam",  hex: "#1a1a1a" },
    coklat: { label: "Coklat", hex: "#5d4037" },
    tan:    { label: "Tan",    hex: "#c68642" },
  };

  let products = JSON.parse(document.getElementById("products-data").textContent);
  let reviews = JSON.parse(document.getElementById("reviews-data").textContent);

  const state = {
    tab: "products",
    editingId: null,
    selectedColors: [],
    colorImages: {},        // colorId -> url (already uploaded)
    mainImageUrl: "",
    reviewFilter: "Semua",
    deleteTarget: null,     // { type: 'product'|'review', id, name }
  };

  // ── Helpers ──────────────────────────────────────────────────────
  function $(s, root = document) { return root.querySelector(s); }
  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  }
  function formatIDR(n) { return "Rp " + Number(n || 0).toLocaleString("id-ID"); }

  function toast(msg, type = "success") {
    const el = $("#toast");
    el.textContent = msg;
    el.className = `fixed top-6 right-6 z-50 px-6 py-4 text-sm font-medium shadow-lg ${
      type === "error" ? "bg-error text-on-error" : "bg-on-surface text-surface"
    }`;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), 3000);
  }

  async function api(url, options = {}) {
    const res = await fetch(url, {
      headers: options.body && typeof options.body === "string" ? { "Content-Type": "application/json" } : undefined,
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  // ── Tabs ─────────────────────────────────────────────────────────
  function switchTab(name) {
    state.tab = name;
    $("#tab-products").className = `admin-tab px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
      name === "products" ? "bg-on-surface text-surface border border-on-surface" : "border border-outline-variant text-on-surface-variant hover:border-on-surface"
    }`;
    $("#tab-reviews").className = `admin-tab px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
      name === "reviews" ? "bg-on-surface text-surface border border-on-surface" : "border border-outline-variant text-on-surface-variant hover:border-on-surface"
    }`;
    $("#panel-products").classList.toggle("hidden", name !== "products");
    $("#panel-reviews").classList.toggle("hidden", name !== "reviews");
  }
  $("#tab-products").addEventListener("click", () => switchTab("products"));
  $("#tab-reviews").addEventListener("click", () => { switchTab("reviews"); renderReviews(); });

  // ── Product list render ─────────────────────────────────────────
  function renderProducts() {
    const list = $("#product-list");
    if (products.length === 0) {
      list.innerHTML = `<p class="text-outline text-sm py-12 text-center">Belum ada produk.</p>`;
      return;
    }
    list.innerHTML = products.map((p) => `
      <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 flex flex-wrap items-center gap-4">
        <img src="${escapeHtml(p.image || '/images/placeholder.webp')}" alt="" class="w-16 h-16 object-cover border border-outline-variant/30" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="font-[family-name:var(--font-headline)] font-bold">${escapeHtml(p.name)}</span>
            <span class="text-[10px] uppercase tracking-widest text-outline">${escapeHtml(p.category)}</span>
            ${p.bestSeller ? '<span class="text-[10px] uppercase tracking-widest font-bold text-primary">Best</span>' : ''}
            ${p.isNewArrival ? '<span class="text-[10px] uppercase tracking-widest font-bold text-primary">New</span>' : ''}
          </div>
          <p class="text-sm text-on-surface-variant">${escapeHtml(p.material || '')}</p>
          <p class="text-sm font-[family-name:var(--font-headline)] text-primary-container">${formatIDR(p.priceNum)}</p>
        </div>
        <div class="flex gap-2">
          <button type="button" data-edit="${p.id}" class="p-2 border border-outline-variant hover:border-on-surface text-on-surface-variant hover:text-on-surface transition-all" aria-label="Edit">
            <span class="material-symbols-outlined text-xl">edit</span>
          </button>
          <button type="button" data-delete-product="${p.id}" data-name="${escapeHtml(p.name)}" class="p-2 border border-outline-variant hover:border-error text-on-surface-variant hover:text-error transition-all" aria-label="Hapus">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>`).join("");
  }

  // ── Reviews render ───────────────────────────────────────────────
  function renderReviews() {
    let list = reviews;
    if (state.reviewFilter !== "Semua") list = reviews.filter((r) => r.category === state.reviewFilter);

    $$(".review-filter-btn").forEach((b) => {
      const active = b.dataset.cat === state.reviewFilter;
      b.classList.toggle("bg-on-surface", active);
      b.classList.toggle("text-surface", active);
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("text-on-surface-variant", !active);
    });

    const el = $("#review-list");
    if (list.length === 0) {
      el.innerHTML = `<p class="text-outline text-sm py-12 text-center">Tidak ada ulasan.</p>`;
      return;
    }
    el.innerHTML = list.map((r) => `
      <div class="bg-surface-container-lowest border border-outline-variant/30 p-5 flex flex-wrap items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2 flex-wrap">
            <span class="font-medium text-sm">${escapeHtml(r.customerName)}</span>
            <span class="text-[10px] uppercase tracking-widest text-outline">${escapeHtml(r.productName || '—')}</span>
            <span class="text-[10px] uppercase tracking-widest text-outline/60">${escapeHtml(r.date)}</span>
          </div>
          <div class="flex gap-0.5 mb-2">
            ${[1,2,3,4,5].map((s) => `<span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' ${r.rating >= s ? 1 : 0};color:${r.rating >= s ? '#c68642' : 'var(--color-outline-variant)'}">star</span>`).join("")}
          </div>
          ${r.comment ? `<p class="text-sm text-on-surface-variant">${escapeHtml(r.comment)}</p>` : ''}
        </div>
        <button type="button" data-delete-review="${r.id}" data-name="ulasan dari ${escapeHtml(r.customerName)}"
          class="p-2 border border-outline-variant hover:border-error text-on-surface-variant hover:text-error transition-all">
          <span class="material-symbols-outlined text-xl">delete</span>
        </button>
      </div>`).join("");
  }

  function $$(sel) { return document.querySelectorAll(sel); }

  // ── Form modal ──────────────────────────────────────────────────
  function openForm(product = null) {
    state.editingId = product?.id || null;
    state.selectedColors = product?.colors ? [...product.colors] : [];
    state.colorImages = product?.colorImages ? { ...product.colorImages } : {};
    state.mainImageUrl = product?.image || "";

    $("#form-title-tag").textContent = product ? "Edit Produk" : "Produk Baru";
    $("#form-title").textContent = product ? product.name : "Tambah Produk";
    $("#form-save-label").textContent = product ? "Update" : "Simpan";
    $("#form-id").value = product?.id || "";

    const f = $("#product-form");
    f.name.value = product?.name || "";
    f.material.value = product?.material || "";
    f.priceNum.value = product?.priceNum || "";
    f.category.value = product?.category || "Sendal";
    f.description.value = product?.description || "";
    f.badge.value = product?.badge || "";
    f.isNewArrival.checked = !!product?.isNewArrival;
    f.bestSeller.checked = !!product?.bestSeller;
    f.featured.checked = !!product?.featured;

    $("#main-image-url").value = state.mainImageUrl;
    const preview = $("#main-image-preview");
    if (state.mainImageUrl) {
      preview.src = state.mainImageUrl;
      preview.classList.remove("hidden");
      $("#main-img-label").textContent = "Ganti gambar";
    } else {
      preview.classList.add("hidden");
      $("#main-img-label").textContent = "Pilih file…";
    }

    renderColorChips();
    renderColorImageInputs();

    $("#form-error").classList.add("hidden");
    $("#product-modal").classList.remove("hidden");
  }

  function closeForm() { $("#product-modal").classList.add("hidden"); }

  function renderColorChips() {
    $$(".color-chip").forEach((b) => {
      const active = state.selectedColors.includes(b.dataset.color);
      b.classList.toggle("border-on-surface", active);
      b.classList.toggle("bg-surface-container", active);
      b.classList.toggle("border-outline-variant", !active);
      b.classList.toggle("text-on-surface-variant", !active);
    });
    renderColorImageInputs();
  }

  function renderColorImageInputs() {
    const section = $("#color-image-section");
    const list = $("#color-image-list");
    if (state.selectedColors.length === 0) {
      section.classList.add("hidden");
      list.innerHTML = "";
      return;
    }
    section.classList.remove("hidden");
    list.innerHTML = state.selectedColors.map((cid) => {
      const c = COLORS[cid] || { label: cid, hex: "#888" };
      const url = state.colorImages[cid] || "";
      return `<div class="flex items-center gap-4">
        <span class="w-5 h-5 rounded-full shrink-0" style="background-color:${c.hex}"></span>
        <span class="text-xs uppercase tracking-widest w-16 shrink-0">${escapeHtml(c.label)}</span>
        <label class="cursor-pointer border border-dashed border-outline-variant px-3 py-2 hover:border-primary transition-colors flex items-center gap-2 text-xs flex-1">
          <span class="material-symbols-outlined text-base">upload_file</span>
          <span>${url ? "Ganti" : "Pilih file"}</span>
          <input type="file" accept="image/*" data-color-upload="${cid}" class="hidden" />
        </label>
        ${url ? `<img src="${escapeHtml(url)}" class="w-12 h-12 object-cover border border-outline-variant/30" />` : ""}
      </div>`;
    }).join("");
  }

  // ── Image uploads ───────────────────────────────────────────────
  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return (await res.json()).url;
  }

  // ── Save product ────────────────────────────────────────────────
  async function saveProduct(e) {
    e.preventDefault();
    const f = $("#product-form");
    const errEl = $("#form-error");
    errEl.classList.add("hidden");

    if (!state.mainImageUrl) {
      errEl.textContent = "Upload gambar utama dulu.";
      errEl.classList.remove("hidden");
      return;
    }

    const payload = {
      name: f.name.value.trim(),
      material: f.material.value.trim(),
      priceNum: parseInt(f.priceNum.value, 10) || 0,
      image: state.mainImageUrl,
      category: f.category.value,
      colors: state.selectedColors,
      colorImages: state.colorImages,
      gallery: [],
      description: f.description.value.trim(),
      badge: f.badge.value.trim(),
      isNewArrival: f.isNewArrival.checked,
      bestSeller: f.bestSeller.checked,
      featured: f.featured.checked,
    };

    const btn = $("#form-save");
    btn.disabled = true;
    $("#form-save-label").textContent = "Saving…";
    try {
      const url = state.editingId ? `/api/products/${state.editingId}` : "/api/products";
      const method = state.editingId ? "PUT" : "POST";
      const { ok, data } = await api(url, { method, body: JSON.stringify(payload) });
      if (!ok) {
        errEl.textContent = data.error || "Gagal menyimpan.";
        errEl.classList.remove("hidden");
        return;
      }
      await refresh();
      toast(state.editingId ? "Produk diupdate." : "Produk ditambah.");
      closeForm();
    } finally {
      btn.disabled = false;
      $("#form-save-label").textContent = state.editingId ? "Update" : "Simpan";
    }
  }

  async function refresh() {
    const { data } = await api("/api/products");
    if (Array.isArray(data)) products = data;
    renderProducts();
  }

  // ── Delete flow ─────────────────────────────────────────────────
  function openDelete(type, id, name) {
    state.deleteTarget = { type, id, name };
    $("#delete-msg").textContent = `Yakin hapus "${name}"? Aksi ini tidak bisa di-undo.`;
    $("#delete-modal").classList.remove("hidden");
  }
  function closeDelete() { $("#delete-modal").classList.add("hidden"); state.deleteTarget = null; }

  async function confirmDelete() {
    if (!state.deleteTarget) return;
    const { type, id } = state.deleteTarget;
    const url = type === "product" ? `/api/products/${id}` : `/api/reviews/${id}`;
    const { ok, data } = await api(url, { method: "DELETE" });
    if (!ok) { toast(data.error || "Gagal menghapus.", "error"); return; }
    if (type === "product") {
      products = products.filter((p) => p.id !== id);
      renderProducts();
    } else {
      reviews = reviews.filter((r) => r.id !== id);
      renderReviews();
    }
    toast("Berhasil dihapus.");
    closeDelete();
  }

  // ── Event delegation ─────────────────────────────────────────────
  document.addEventListener("click", async (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    if (t.closest("#add-product")) { openForm(); return; }

    const editBtn = t.closest("[data-edit]");
    if (editBtn) { const p = products.find((x) => x.id === editBtn.dataset.edit); if (p) openForm(p); return; }

    const delProd = t.closest("[data-delete-product]");
    if (delProd) { openDelete("product", delProd.dataset.deleteProduct, delProd.dataset.name); return; }

    const delRev = t.closest("[data-delete-review]");
    if (delRev) { openDelete("review", delRev.dataset.deleteReview, delRev.dataset.name); return; }

    if (t.closest("#delete-cancel")) { closeDelete(); return; }
    if (t.closest("#delete-confirm")) { await confirmDelete(); return; }
    if (t.closest("#form-close") || t.closest("#form-cancel")) { closeForm(); return; }

    const chip = t.closest(".color-chip");
    if (chip) {
      const cid = chip.dataset.color;
      const idx = state.selectedColors.indexOf(cid);
      if (idx >= 0) {
        state.selectedColors.splice(idx, 1);
        delete state.colorImages[cid];
      } else {
        state.selectedColors.push(cid);
      }
      renderColorChips();
      return;
    }

    const filterBtn = t.closest(".review-filter-btn");
    if (filterBtn) { state.reviewFilter = filterBtn.dataset.cat; renderReviews(); return; }
  });

  // File input listeners (delegated)
  document.addEventListener("change", async (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.id === "main-image-input" && t.files?.[0]) {
      try {
        $("#main-img-label").textContent = "Uploading...";
        const url = await uploadFile(t.files[0]);
        state.mainImageUrl = url;
        $("#main-image-url").value = url;
        const preview = $("#main-image-preview");
        preview.src = url;
        preview.classList.remove("hidden");
        $("#main-img-label").textContent = "Ganti gambar";
      } catch {
        toast("Upload gagal.", "error");
        $("#main-img-label").textContent = "Pilih file…";
      }
    }
    if (t.dataset.colorUpload && t.files?.[0]) {
      const cid = t.dataset.colorUpload;
      try {
        const url = await uploadFile(t.files[0]);
        state.colorImages[cid] = url;
        renderColorImageInputs();
      } catch {
        toast("Upload gagal.", "error");
      }
    }
  });

  $("#product-form").addEventListener("submit", saveProduct);

  // Init
  renderProducts();
})();
