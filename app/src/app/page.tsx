"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

interface Product {
  id: string;
  name: string;
  material: string;
  price: string;
  priceNum: number;
  image: string;
  colorImages?: Record<string, string>;
  category: string;
  colors: string[];
  isNewArrival: boolean;
  bestSeller: boolean;
  badge?: string;
  featured?: boolean;
}

const CATEGORIES = ["Semua", "Sendal", "Sepatu"];
const COLORS = [
  { id: "hitam", label: "Hitam", hex: "#1a1a1a" },
  { id: "coklat", label: "Coklat", hex: "#5d4037" },
  { id: "tan",    label: "Tan",    hex: "#c68642" },
];
const SORTS = [
  { id: "default",   label: "Default" },
  { id: "low-high",  label: "Harga: Terendah" },
  { id: "high-low",  label: "Harga: Tertinggi" },
  { id: "bestseller",label: "Best Seller" },
];
export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState("default");
  const [cardColors, setCardColors] = useState<Record<string, string>>({});
  const [sizePickerId, setSizePickerId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const SIZES = [39, 40, 41, 42, 43];

  function handleAddToCart(e: React.MouseEvent, product: Product, size: number) {
    e.stopPropagation();
    const activeCid = cardColors[product.id] || product.colors?.[0];
    const displayImage = (activeCid && product.colorImages?.[activeCid]) || product.image;
    addItem({
      productId: product.id,
      name: product.name,
      material: product.material,
      priceNum: product.priceNum,
      price: product.price,
      image: displayImage,
      size,
      color: activeCid || undefined,
    });
    setSizePickerId(null);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  }

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
        const init: Record<string, string> = {};
        data.forEach((p: Product) => { if (p.colors?.length) init[p.id] = p.colors[0]; });
        setCardColors(init);
      });
  }, []);

  const filtered = (() => {
    let result = [...products];
    if (activeCategory !== "Semua") result = result.filter((p) => p.category === activeCategory);
    if (activeColor) result = result.filter((p) => p.colors?.includes(activeColor));
    if (activeSort === "low-high")   result.sort((a, b) => a.priceNum - b.priceNum);
    if (activeSort === "high-low")   result.sort((a, b) => b.priceNum - a.priceNum);
    if (activeSort === "bestseller") result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    return result;
  })();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface flex-grow pt-48">
        {/* Header */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 mb-16 flex flex-col items-center text-center">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-3">Handcrafted in Indonesia</p>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl text-on-surface mb-4 tracking-tighter">
            The Footwear Collection
          </h1>
          <p className="text-outline max-w-lg mx-auto text-lg">
            Curated leather goods, meticulously handcrafted for the discerning aesthetic. Every stitch tells a story of heritage and precision.
          </p>
        </div>

        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex gap-16">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-48">
              {/* Kategori */}
              <div className="mb-8">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                  Kategori
                </h3>
                <ul className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`text-sm text-left w-full transition-colors ${
                          activeCategory === cat
                            ? "text-primary-container font-bold"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warna */}
              <div className="mb-8">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                  Warna
                </h3>
                <div className="space-y-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveColor(activeColor === c.id ? null : c.id)}
                      className="flex items-center gap-3 w-full group"
                    >
                      <span
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          activeColor === c.id
                            ? "border-primary-container scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className={`text-sm transition-colors ${
                        activeColor === c.id
                          ? "text-primary-container font-bold"
                          : "text-on-surface-variant group-hover:text-primary"
                      }`}>
                        {c.label}
                      </span>
                      {activeColor === c.id && (
                        <span className="material-symbols-outlined text-primary-container text-base ml-auto">check</span>
                      )}
                    </button>
                  ))}
                  {activeColor && (
                    <button
                      onClick={() => setActiveColor(null)}
                      className="text-[10px] uppercase tracking-widest text-outline hover:text-error transition-colors mt-1"
                    >
                      Hapus filter
                    </button>
                  )}
                </div>
              </div>

              {/* Urutkan */}
              <div className="mb-8">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-4">
                  Urutkan
                </h3>
                <ul className="space-y-3">
                  {SORTS.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => setActiveSort(s.id)}
                        className={`text-sm text-left w-full transition-colors ${
                          activeSort === s.id
                            ? "text-primary-container font-bold"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-outline-variant/20">
                <p className="text-xs leading-relaxed text-outline">
                  {loading ? "Loading..." : `${filtered.length} produk ditemukan`}
                </p>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <section className="flex-grow pb-32">
            {/* Mobile filters */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 lg:hidden">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 text-[10px] font-bold tracking-widest uppercase px-4 py-2 border transition-colors ${
                    activeCategory === cat
                      ? "bg-on-surface text-surface border-on-surface"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 lg:hidden">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveColor(activeColor === c.id ? null : c.id)}
                  className={`shrink-0 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-3 py-2 border transition-colors ${
                    activeColor === c.id
                      ? "bg-on-surface text-surface border-on-surface"
                      : "border-outline-variant text-on-surface-variant"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort bar (desktop top + mobile) */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <p className="text-xs text-outline uppercase tracking-widest">
                {loading ? "" : `${filtered.length} produk`}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {SORTS.filter((s) => s.id !== "default").map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSort(activeSort === s.id ? "default" : s.id)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 border transition-colors flex items-center gap-1.5 ${
                      activeSort === s.id
                        ? "bg-on-surface text-surface border-on-surface"
                        : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                    }`}
                  >
                    {s.id === "bestseller" && (
                      <span className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: activeSort === s.id ? "'FILL' 1" : "'FILL' 0" }}>
                        star
                      </span>
                    )}
                    {s.id === "low-high" && <span className="material-symbols-outlined text-base">arrow_upward</span>}
                    {s.id === "high-low" && <span className="material-symbols-outlined text-base">arrow_downward</span>}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-40 text-outline text-sm tracking-widest uppercase">
                Loading collection…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: "48px" }}>search_off</span>
                <p className="text-on-surface-variant mb-2">Tidak ada produk ditemukan</p>
                <button
                  onClick={() => { setActiveCategory("Semua"); setActiveColor(null); setActiveSort("default"); }}
                  className="text-[11px] uppercase tracking-widest text-primary-container border-b border-primary-container mt-2"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-20">
                {filtered.map((product) => {
                  const activeCid = cardColors[product.id] || product.colors?.[0];
                  const displayImage = (activeCid && product.colorImages?.[activeCid]) || product.image;
                  return (
                  <article
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="group flex flex-col border border-outline-variant/30 hover:border-outline-variant/60 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square bg-surface-container-lowest overflow-hidden">
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={displayImage.startsWith("/")}
                      />
                      {/* Badges kiri */}
                      <div className="absolute top-5 left-5 flex flex-col gap-1.5">
                        {product.badge && (
                          <div className="bg-surface-container px-3 py-1">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        {product.bestSeller && (
                          <div className="bg-on-surface px-3 py-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-surface text-[11px]" style={{ fontVariationSettings: "'FILL' 1", fontSize: "11px" }}>star</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-surface">Best Seller</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col px-4 pt-4 pb-4">
                      <h2 className="font-[family-name:var(--font-headline)] mb-0.5 text-sm md:text-xl leading-tight">
                        {product.name}
                      </h2>
                      <p className="text-[10px] md:text-xs text-outline uppercase tracking-widest mb-3">
                        {product.material}
                      </p>

                      {/* Color swatches */}
                      {product.colors?.length > 0 && (
                        <div className="flex items-center gap-3 mb-4" onClick={(e) => e.stopPropagation()}>
                          {product.colors.map((cid) => {
                            const c = COLORS.find((x) => x.id === cid);
                            if (!c) return null;
                            const isActive = activeCid === cid;
                            return (
                              <button
                                key={cid}
                                title={c.label}
                                onClick={(e) => { e.stopPropagation(); setCardColors((prev) => ({ ...prev, [product.id]: cid })); }}
                                className={`w-5 h-5 rounded-full transition-all ${isActive ? "ring-2 ring-offset-2 ring-on-surface scale-110" : "opacity-60 hover:opacity-100 hover:scale-110"}`}
                                style={{ backgroundColor: c.hex }}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* Size picker */}
                      {sizePickerId === product.id ? (
                        <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-outline">Pilih Ukuran</span>
                            <button onClick={(e) => { e.stopPropagation(); setSizePickerId(null); }} className="text-outline hover:text-on-surface">
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {SIZES.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => handleAddToCart(e, product, s)}
                                className="w-9 h-9 text-xs border border-outline-variant hover:bg-on-surface hover:text-surface hover:border-on-surface transition-all font-medium"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-auto gap-2">
                          <span className="font-[family-name:var(--font-headline)] text-sm md:text-lg text-primary-container leading-tight">
                            {product.price}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); if (addedId === product.id) return; setSizePickerId(product.id); }}
                            className={`flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-3 py-2.5 transition-all shrink-0 ${
                              addedId === product.id
                                ? "bg-on-surface text-surface"
                                : "burnished-gradient text-on-primary hover:brightness-110"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: addedId === product.id ? "'FILL' 1" : "'FILL' 0" }}>
                              {addedId === product.id ? "check" : "shopping_bag"}
                            </span>
                            <span className="hidden sm:inline">{addedId === product.id ? "Added" : "Cart"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                  );
                })}
              </div>
            )}

            {/* Editorial block */}
            {!loading && filtered.length > 0 && (
              <div className="flex items-center gap-0 mt-20 md:mt-28">
                <div className="w-2/3 h-[420px] bg-surface-container overflow-hidden relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZxEgnEkTwz3XFLi2GNoZgD61X-IzPJw9ntup7ggSo8uSdkmaGiij8-DKePA68PJ1Rdd9-EQd6ZVqCo7HouzB3Md1_gWX8snxBxLMrf8UEMF4VwSc6uu4baVFgvIAkTFoi0Y7grODVJh_VjZrmWDqyAvI4JK4gzcr9KNCggqaq0rMTfw-c7Shk9lMrPnL9Yu4GmrlBFZGKHAOXvfrl2ZwoBDoIWrjQ2yH2W9pgR2N-LY45zjFUZLsYxKncnOW98y6DZOUj5F5yWN8_"
                    alt="Craftsmanship"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <div className="w-1/3 -ml-20 z-10 bg-surface-container-lowest p-12 shadow-sm">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary block mb-5">The Atelier Process</span>
                  <h3 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl mb-5 leading-tight">
                    Every piece is an heirloom in waiting.
                  </h3>
                  <p className="text-sm text-on-surface-variant mb-7 leading-relaxed">
                    Our leather is sourced from small, family-owned tanneries, ensuring our environmental impact is as minimal as our aesthetic.
                  </p>
                  <a
                    href="/contact"
                    className="inline-block border-b border-on-surface pb-1 text-xs uppercase tracking-widest font-bold hover:text-primary hover:border-primary transition-all"
                  >
                    Discover Our Story
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
