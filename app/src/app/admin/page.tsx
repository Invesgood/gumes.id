"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  material: string;
  price: string;
  priceNum: number;
  image: string;
  gallery?: string[];
  colorImages?: Record<string, string>;
  category: string;
  colors: string[];
  isNewArrival: boolean;
  bestSeller: boolean;
  badge?: string;
  featured?: boolean;
  description?: string;
}

const CATEGORIES = ["Sendal", "Sepatu"];
const COLORS = [
  { id: "hitam", label: "Hitam", hex: "#1a1a1a" },
  { id: "coklat", label: "Coklat", hex: "#5d4037" },
  { id: "tan",    label: "Tan",    hex: "#c68642" },
];

const ADMIN_PASSWORD = "gumes2025";

const emptyForm = (): Omit<Product, "id"> => ({
  name: "",
  material: "",
  price: "",
  priceNum: 0,
  image: "",
  gallery: [],
  colorImages: {},
  category: CATEGORIES[0],
  colors: [],
  isNewArrival: false,
  bestSeller: false,
  badge: "",
  featured: false,
  description: "",
});

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [colorImageFiles, setColorImageFiles] = useState<Record<string, File>>({});
  const [colorImagePreviews, setColorImagePreviews] = useState<Record<string, string>>({});
  const [galleryFiles, setGalleryFiles] = useState<{ file: File; preview: string }[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("gumes_admin") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) { fetchProducts(); fetchReviews(); }
  }, [authed]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function fetchReviews() {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(data);
  }

  async function handleDeleteReview(id: string) {
    setDeletingReviewId(id);
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setToast({ msg: "Ulasan dihapus.", type: "success" });
    } catch {
      setToast({ msg: "Gagal menghapus.", type: "error" });
    } finally {
      setDeletingReviewId(null);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("gumes_admin", "1");
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setColorImageFiles({});
    setColorImagePreviews({});
    setGalleryFiles([]);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    const num = p.priceNum || Number(p.price.replace(/\D/g, ""));
    const formatted = num ? "Rp " + num.toLocaleString("id-ID") : p.price;
    setForm({
      name: p.name,
      material: p.material,
      price: formatted,
      priceNum: num,
      image: p.image,
      gallery: p.gallery || [],
      colorImages: p.colorImages || {},
      category: p.category,
      colors: p.colors || [],
      isNewArrival: p.isNewArrival,
      bestSeller: p.bestSeller || false,
      badge: p.badge || "",
      featured: p.featured || false,
      description: p.description || "",
    });
    setImageFile(null);
    setImagePreview(p.image);
    setColorImageFiles({});
    setColorImagePreviews(p.colorImages || {});
    setGalleryFiles([]);
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let imagePath = form.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("Upload failed");
        imagePath = (await uploadRes.json()).url;
      }

      const updatedColorImages: Record<string, string> = { ...(form.colorImages || {}) };
      for (const [colorId, file] of Object.entries(colorImageFiles)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        updatedColorImages[colorId] = (await res.json()).url;
      }

      const updatedGallery = [...(form.gallery || [])];
      for (const { file } of galleryFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
        updatedGallery.push((await res.json()).url);
      }

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imagePath, gallery: updatedGallery, colorImages: updatedColorImages }),
      });
      if (!res.ok) throw new Error("Failed");
      await fetchProducts();
      setShowForm(false);
      setToast({ msg: editingId ? "Product updated!" : "Product added!", type: "success" });
    } catch {
      setToast({ msg: "Something went wrong.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      await fetchProducts();
      setDeleteId(null);
      setToast({ msg: "Product deleted.", type: "success" });
    } catch {
      setToast({ msg: "Failed to delete.", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  // ── Login Screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <span
              className="material-symbols-outlined text-primary-container mb-3 block"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "40px" }}
            >
              landscape
            </span>
            <h1 className="font-[family-name:var(--font-headline)] text-3xl tracking-widest text-primary-container mb-1">
              GUMES.ID
            </h1>
            <p className="text-xs tracking-[0.25em] uppercase text-outline">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="bg-surface-container p-8 shadow-sm">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Password
            </label>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              className={`w-full bg-surface-container-lowest border px-4 py-3 text-sm text-on-surface mb-1 outline-none focus:border-primary-container transition-colors ${
                pwError ? "border-error" : "border-outline-variant"
              }`}
              placeholder="Enter admin password"
              autoFocus
            />
            {pwError && (
              <p className="text-error text-xs mb-4">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="w-full burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase py-4 mt-4 hover:brightness-110 transition-all"
            >
              Enter
            </button>
          </form>

          <p className="text-center text-[10px] text-outline mt-6 tracking-widest uppercase">
            Default: gumes2025
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-4 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-on-surface text-surface"
              : "bg-error text-on-error"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-surface-container border-b border-outline-variant/20 px-6 md:px-10 py-4 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}
            >
              landscape
            </span>
            <div>
              <span className="font-[family-name:var(--font-headline)] text-xl text-primary-container tracking-widest">
                GUMES.ID
              </span>
              <span className="text-outline text-xs ml-3 tracking-widest uppercase">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              View Store
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem("gumes_admin"); setAuthed(false); }}
              className="text-[11px] uppercase tracking-widest text-outline hover:text-error transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: "Total Products", value: products.length, icon: "inventory_2" },
            { label: "New Arrivals", value: products.filter((p) => p.isNewArrival).length, icon: "new_releases" },
            { label: "Featured", value: products.filter((p) => p.featured).length, icon: "star" },
            { label: "Categories", value: [...new Set(products.map((p) => p.category))].length, icon: "category" },
            { label: "Ulasan", value: reviews.length, icon: "rate_review" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container p-6 border border-outline-variant/30 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary-container text-xl">{stat.icon}</span>
                <span className="text-[10px] uppercase tracking-widest text-outline">{stat.label}</span>
              </div>
              <p className="font-[family-name:var(--font-headline)] text-3xl text-on-surface">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="bg-surface-container border border-outline-variant/30 shadow-md">
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
            <h2 className="font-[family-name:var(--font-headline)] text-xl">Products</h2>
            <button
              onClick={openAdd}
              className="burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase px-6 py-3 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Add Product
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-outline text-sm tracking-widest uppercase">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline w-16">Image</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Name</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline hidden md:table-cell">Price</th>
                    <th className="text-center px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-outline hidden lg:table-cell">New</th>
                    <th className="text-center px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-outline hidden lg:table-cell">Featured</th>
                    <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative w-12 h-12 bg-surface-container-low overflow-hidden">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-on-surface">{product.name}</p>
                        <p className="text-xs text-outline mt-0.5 truncate max-w-[200px]">{product.material}</p>
                        {product.badge && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-surface-container-highest text-primary-container px-2 py-0.5">
                            {product.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-on-surface-variant text-xs">{product.category}</td>
                      <td className="px-6 py-4 hidden md:table-cell font-[family-name:var(--font-headline)] text-primary-container text-sm">{product.price}</td>
                      <td className="px-4 py-4 hidden lg:table-cell text-center">
                        <span className={`material-symbols-outlined text-base ${product.isNewArrival ? "text-primary-container" : "text-outline-variant"}`}>
                          {product.isNewArrival ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-center">
                        <span className={`material-symbols-outlined text-base ${product.featured ? "text-primary-container" : "text-outline-variant"}`}
                          style={{ fontVariationSettings: product.featured ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          star
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-on-surface-variant hover:text-primary-container transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="text-on-surface-variant hover:text-error transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-20 text-outline text-sm">No products yet. Add your first one!</div>
              )}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-surface-container border border-outline-variant/30 shadow-md mt-10">
          <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
            <h2 className="font-[family-name:var(--font-headline)] text-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">rate_review</span>
              Ulasan Pembeli
            </h2>
            <span className="text-[11px] uppercase tracking-widest text-outline">{reviews.length} ulasan</span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-20 text-outline text-sm">Belum ada ulasan.</div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {reviews.map((review) => (
                <div key={review.id} className="px-6 py-5 flex items-start gap-5 hover:bg-surface-container-high transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-medium text-sm text-on-surface">{review.customerName}</span>
                      <span className="text-[10px] uppercase tracking-widest text-outline">{review.productName}</span>
                      <span className="text-[10px] text-outline/60">{review.orderId}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-base" style={{ fontVariationSettings: review.rating >= s ? "'FILL' 1" : "'FILL' 0", color: review.rating >= s ? "#c68642" : "var(--color-outline-variant)" }}>star</span>
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-on-surface-variant">{review.comment}</p>
                    )}
                    <p className="text-[10px] text-outline mt-2">{review.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deletingReviewId === review.id}
                    className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40 shrink-0"
                    title="Hapus ulasan"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
              <h3 className="font-[family-name:var(--font-headline)] text-2xl">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                    placeholder="e.g. Aurelius Oxford"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Material / Variant *
                  </label>
                  <input
                    required
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                    placeholder="e.g. Nero Black / Polished"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Harga *
                  </label>
                  <input
                    required
                    value={form.price}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      const num = Number(digits);
                      const formatted = digits ? "Rp " + num.toLocaleString("id-ID") : "";
                      setForm({ ...form, price: formatted, priceNum: num });
                    }}
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                    placeholder="e.g. Rp 12.600.000"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Kategori *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Warna (pilih semua yang tersedia)
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {COLORS.map((c) => {
                      const checked = form.colors.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            const next = checked
                              ? form.colors.filter((x) => x !== c.id)
                              : [...form.colors, c.id];
                            setForm({ ...form, colors: next });
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 border-2 transition-all text-[11px] font-bold uppercase tracking-widest ${
                            checked
                              ? "border-on-surface bg-surface-container scale-105"
                              : "border-outline-variant text-on-surface-variant"
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                          {c.label}
                          {checked && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                        </button>
                      );
                    })}
                  </div>
                  {form.colors.length === 0 && (
                    <p className="text-[10px] text-outline mt-1.5">Pilih minimal satu warna</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Badge Label
                  </label>
                  <input
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                    placeholder="e.g. New, Limited"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Foto Produk {!editingId && "*"}
                </label>
                <label className="flex items-center gap-3 cursor-pointer w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 hover:border-primary-container transition-colors">
                  <span className="material-symbols-outlined text-outline text-xl">upload_file</span>
                  <span className="text-sm text-on-surface-variant truncate">
                    {imageFile ? imageFile.name : "Pilih foto dari komputer…"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    required={!editingId && !form.image}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {imagePreview && (
                  <div className="mt-3 relative w-24 h-24 bg-surface-container-low overflow-hidden border border-outline-variant/20">
                    <Image src={imagePreview} alt="preview" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              {/* Per-color images */}
              {form.colors.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Foto Per Warna <span className="text-outline font-normal">(opsional)</span>
                  </label>
                  <div className="space-y-2">
                    {form.colors.map((colorId) => {
                      const colorDef = COLORS.find((c) => c.id === colorId);
                      const hasFile = !!colorImageFiles[colorId];
                      const hasExisting = !!(form.colorImages?.[colorId] || colorImagePreviews[colorId]);
                      return (
                        <div key={colorId} className="flex items-center gap-3">
                          <span className="w-4 h-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: colorDef?.hex }} />
                          <span className="text-xs text-on-surface-variant w-14 shrink-0">{colorDef?.label}</span>
                          <label className="flex-1 flex items-center gap-2 cursor-pointer border border-outline-variant bg-surface-container-lowest px-3 py-2 hover:border-primary-container transition-colors">
                            <span className="material-symbols-outlined text-outline text-base">upload_file</span>
                            <span className="text-xs text-on-surface-variant truncate">
                              {hasFile ? colorImageFiles[colorId].name : hasExisting ? "Sudah ada — klik untuk ganti" : "Pilih foto…"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setColorImageFiles((prev) => ({ ...prev, [colorId]: file }));
                                setColorImagePreviews((prev) => ({ ...prev, [colorId]: URL.createObjectURL(file) }));
                              }}
                            />
                          </label>
                          {colorImagePreviews[colorId] && (
                            <div className="relative w-10 h-10 bg-surface-container-low overflow-hidden border border-outline-variant/20 shrink-0">
                              <Image src={colorImagePreviews[colorId]} alt={colorDef?.label || ""} fill className="object-cover" unoptimized />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gallery tambahan */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Foto Galeri Tambahan <span className="text-outline font-normal">(opsional, bisa lebih dari 1)</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {/* Existing gallery */}
                  {(form.gallery || []).map((url, i) => (
                    <div key={url} className="relative w-20 h-20 border border-outline-variant/30 overflow-hidden group">
                      <Image src={url} alt={`gallery-${i}`} fill className="object-cover" unoptimized={url.startsWith("/")} />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, gallery: (form.gallery || []).filter((_, idx) => idx !== i) })}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-white text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                  {/* New files preview */}
                  {galleryFiles.map((g, i) => (
                    <div key={i} className="relative w-20 h-20 border border-primary-container/40 overflow-hidden group">
                      <Image src={g.preview} alt="" fill className="object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-white text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                  {/* Add button */}
                  <label className="w-20 h-20 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary-container transition-colors">
                    <span className="material-symbols-outlined text-outline text-xl">add_photo_alternate</span>
                    <span className="text-[9px] text-outline mt-1">Tambah</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const newEntries = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
                        setGalleryFiles((prev) => [...prev, ...newEntries]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors resize-none"
                  placeholder="Jelaskan bahan, proses pembuatan, keunggulan produk..."
                />
                <p className="text-[10px] text-outline mt-1">{(form.description || "").length} karakter</p>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { key: "isNewArrival" as const, label: "New Arrival" },
                  { key: "bestSeller" as const,   label: "Best Seller" },
                  { key: "featured" as const,     label: "Featured (card besar)" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setForm({ ...form, [key]: !form[key] })}
                      className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                        form[key] ? "bg-primary-container border-primary-container" : "border-outline-variant"
                      }`}
                    >
                      {form[key] && (
                        <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: "13px" }}>check</span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-on-surface transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="submit"
                  disabled={saving}
                  className="burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-outline-variant text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-surface w-full max-w-sm p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-error text-3xl mb-4 block">delete_forever</span>
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-2">Delete Product?</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-error text-on-error text-[11px] font-bold tracking-widest uppercase py-4 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-outline-variant text-[11px] font-bold tracking-widest uppercase py-4 hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
