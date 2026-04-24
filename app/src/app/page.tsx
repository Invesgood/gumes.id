"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "@/components/CartProvider";

interface Product {
  id: string;
  name: string;
  material: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  isNewArrival: boolean;
  badge?: string;
  featured?: boolean;
}

const CATEGORIES = [
  "All Collections",
  "Burnished Boots",
  "Artisan Sandals",
  "Minimalist Loafers",
  "Studio Slippers",
  "Oxford",
];

const SIZES = [39, 40, 41, 42, 43];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = activeCategory === "All Collections"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = useCallback((product: Product) => {
    const size = selectedSizes[product.id] || 40;
    addItem({
      productId: product.id,
      name: product.name,
      material: product.material,
      priceNum: product.priceNum,
      price: product.price,
      image: product.image,
      size,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  }, [addItem, selectedSizes]);

  const quickViewProduct = products.find((p) => p.id === quickViewId);

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
              <div className="mb-10">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-5">
                  Category
                </h3>
                <ul className="space-y-3 text-sm">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`text-left transition-colors ${
                          activeCategory === cat
                            ? "text-primary-container font-bold"
                            : "text-on-surface-variant hover:text-primary transition-colors"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-10">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant mb-5">
                  Tonal Palette
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button className="w-8 h-8 bg-black ring-1 ring-offset-4 ring-primary" />
                  <button className="w-8 h-8 bg-[#5d4037]" />
                  <button className="w-8 h-8 bg-[#c68642]" />
                  <button className="w-8 h-8 bg-surface-container-highest border border-outline-variant" />
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/20">
                <p className="text-xs leading-relaxed text-outline">
                  {loading ? "Loading..." : `Showing ${filtered.length} refined pieces.`}
                </p>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <section className="flex-grow pb-32">
            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 lg:hidden">
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

            {loading ? (
              <div className="flex items-center justify-center py-40 text-outline text-sm tracking-widest uppercase">
                Loading collection…
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                {filtered.map((product) => (
                  <article
                    key={product.id}
                    className={`group flex flex-col ${product.featured ? "md:col-span-2" : ""}`}
                  >
                    <div
                      className={`relative bg-surface-container-lowest overflow-hidden mb-5 ${
                        product.featured ? "aspect-[16/9]" : "aspect-[4/5]"
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={product.featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      />
                      {product.badge && (
                        <div className="absolute top-5 left-5 bg-surface-container px-3 py-1">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      {product.isNewArrival && (
                        <div className="absolute top-5 right-5 bg-primary-container px-3 py-1">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-on-primary">New</span>
                        </div>
                      )}
                      {/* Quick view on hover */}
                      <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={() => setQuickViewId(product.id)}
                          className="w-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-bold tracking-widest uppercase py-4 border-t border-outline-variant/30 hover:bg-surface-container transition-colors"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h2 className={`font-[family-name:var(--font-headline)] ${product.featured ? "text-2xl" : "text-xl"}`}>
                          {product.name}
                        </h2>
                      </div>
                      <p className="text-xs text-outline uppercase tracking-widest mb-4">
                        {product.material}
                      </p>

                      {/* Sizes */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
                          Size (EU) {selectedSizes[product.id] ? `— ${selectedSizes[product.id]}` : ""}
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                              className={`w-8 h-8 text-[11px] border transition-colors ${
                                selectedSizes[product.id] === size
                                  ? "bg-on-surface text-surface border-on-surface"
                                  : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-[family-name:var(--font-headline)] text-lg text-primary-container">
                          {product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-5 py-3 transition-all ${
                            addedIds.has(product.id)
                              ? "bg-on-surface text-surface"
                              : "burnished-gradient text-on-primary hover:brightness-110"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {addedIds.has(product.id) ? "check" : "shopping_bag"}
                          </span>
                          {addedIds.has(product.id) ? "Added" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
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

      {/* Quick View Modal */}
      {quickViewId && quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8 bg-black/60 backdrop-blur-sm"
          onClick={() => setQuickViewId(null)}
        >
          <div
            className="bg-surface w-full md:max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square">
                <Image src={quickViewProduct.image} alt={quickViewProduct.name} fill className="object-cover" />
              </div>
              <div className="p-8 md:p-10 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {quickViewProduct.badge && (
                      <p className="text-primary text-[10px] tracking-widest uppercase mb-1">{quickViewProduct.badge}</p>
                    )}
                    <h3 className="font-[family-name:var(--font-headline)] text-3xl">{quickViewProduct.name}</h3>
                    <p className="text-outline text-xs uppercase tracking-widest mt-1">{quickViewProduct.material}</p>
                  </div>
                  <button onClick={() => setQuickViewId(null)} className="text-outline hover:text-on-surface">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <p className="font-[family-name:var(--font-headline)] text-2xl text-primary-container mb-6">
                  {quickViewProduct.price}
                </p>
                <div className="mb-6">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-3">Select Size (EU)</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [quickViewProduct.id]: size }))}
                        className={`w-10 h-10 text-xs border transition-colors ${
                          selectedSizes[quickViewProduct.id] === size
                            ? "bg-on-surface text-surface border-on-surface"
                            : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={() => { handleAddToCart(quickViewProduct); setQuickViewId(null); }}
                    className="w-full burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase py-4 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                    Add to Cart
                  </button>
                  <a href="/cart" className="w-full border border-outline-variant text-[11px] font-bold tracking-widest uppercase py-4 text-center hover:bg-surface-container transition-colors block">
                    View Cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
