"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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

const SIZES = [39, 40, 41, 42, 43];

export default function NewArrival() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products?newArrival=true")
      .then((r) => r.json())
      .then((data) => { setNewArrivals(data); setLoading(false); });
  }, []);

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

  const quickViewProduct = newArrivals.find((p) => p.id === quickViewId);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">

        {/* ── Hero ── */}
        <section className="relative h-[80vh] flex items-end pb-20 px-8 md:px-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNaYDcFiEcOVCNK5vcPicdonq7dU5XRo0t9kYh5s7OtoqoqSI-mUmu9-pcsZWNEsd1My-Iqy6dd5GZssi_YQJ0VSzwZT1sUVXRZBmV5JSxw4LD63XMQNJZJDsE27MsyFG3XiKjNaG1RjxoqhbC4K1TzJIEvvouD-Tqj_9J0KjKErj4VURo4YzL6Bvvmdyh58pEUDpk_e9ZtGHNwKF1pywmYRRSIapyThcnb0tpgpHuMc6qqKHz1i9wKJ0FPONhVviVOlLvQ7RjoUmO"
              alt="New arrivals hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-[#e9c176] text-xs tracking-[0.35em] uppercase mb-4">
                The Artisan Collection — SS 2025
              </p>
              <h1 className="font-[family-name:var(--font-headline)] text-white text-5xl md:text-7xl leading-none mb-2">
                New<br />
                <span className="italic text-[#e9c176]">Arrivals</span>
              </h1>
              <p className="text-white/60 text-sm mt-4 max-w-xs leading-relaxed">
                Three new pieces. Each crafted from a single continuous hide, shaped over 120 hours.
              </p>
            </div>
            <a
              href="#collection"
              className="inline-flex items-center gap-3 burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase px-10 py-5 hover:brightness-110 transition-all self-end md:self-auto"
            >
              Discover Collection
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </a>
          </div>
        </section>

        {/* ── Intro strip ── */}
        <div className="bg-surface-container border-y border-outline-variant/20 py-6">
          <div className="max-w-screen-2xl mx-auto px-8 md:px-16 flex flex-wrap gap-8 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">verified</span>
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Hand-crafted in Indonesia</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">schedule</span>
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">120+ Hours per Pair</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">local_shipping</span>
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">Complimentary Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">replay</span>
              <span className="text-xs tracking-widest uppercase text-on-surface-variant">30-Day Free Returns</span>
            </div>
          </div>
        </div>

        {/* ── Product Grid ── */}
        <section id="collection" className="max-w-screen-2xl mx-auto px-8 md:px-16 pt-24 pb-32">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Just Landed</p>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl">
                The New Legacy
              </h2>
            </div>
            <p className="hidden md:block text-outline text-sm">
              {loading ? "Loading…" : `${newArrivals.length} new pieces`}
            </p>
          </div>

          {loading && (
            <div className="text-center py-20 text-outline text-sm tracking-widest uppercase">Loading collection…</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {newArrivals.map((product) => (
              <article key={product.id} className="group flex flex-col">
                {/* Image + hover actions */}
                <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-5 left-5 bg-surface-container-lowest px-4 py-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick view button */}
                  <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => setQuickViewId(product.id)}
                      className="w-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[11px] font-bold tracking-widest uppercase py-4 border-t border-outline-variant/30 hover:bg-surface-container transition-colors"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-[family-name:var(--font-headline)] text-2xl">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-outline text-[11px] uppercase tracking-widest mb-4">
                    {product.material}
                  </p>

                  {/* Sizes */}
                  <div className="mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
                      Size (EU) {selectedSizes[product.id] ? `— ${selectedSizes[product.id]}` : ""}
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))
                          }
                          className={`w-9 h-9 text-[11px] border transition-colors ${
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
                    <span className="font-[family-name:var(--font-headline)] text-xl text-primary-container">
                      {product.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-6 py-3 transition-all ${
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
        </section>

        {/* ── Editorial ── */}
        <section className="bg-surface-container py-24 md:py-32">
          <div className="max-w-screen-xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative aspect-square">
              <div className="absolute -top-8 -left-8 w-40 h-40 burnished-gradient opacity-10 blur-3xl" />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1FoPjTjHt4Kbpcg8DrEf2UqksJ6WIuTN4Wp_KyxhnJhII94grr155mhv3C5E6w1eg2oA--GXy8HO3F-PjNKPs9oGToSByqXVe7OeiZGrFQhmotmWUDjR151UoYGo2xoA8oybCbOatqhPj0FQt3zDMjQtPRaCS6_0fafcW49W4F92aiepU-N2SE0-Q1KRHSUisDIBXahoaaIG_NCYsC-hCCPpjfoHOBaqR4P7g48rbVAFLK9K6iR2c7P-oxdJdnPwBwfOkqvJbrUFt"
                alt="Leather texture detail"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">
                The Philosophy of Form
              </p>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl mb-6 leading-tight">
                Unrivaled<br />
                <span className="italic">Materiality</span>
              </h2>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Every GUMES creation begins with a single piece of premium hide sourced from
                family-owned tanneries. Our burnishing process — layers of wax and pigment
                applied entirely by hand — achieves a tonal depth that no machine can replicate.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-10">
                As time passes, the leather develops a patina unique to your journey. It is
                the signature of the Digital Curator, and it is yours alone.
              </p>
              <div className="flex gap-12 mb-10">
                <div>
                  <p className="font-[family-name:var(--font-headline)] text-primary text-3xl mb-1">120+</p>
                  <p className="text-[10px] tracking-widest text-outline uppercase">Hours per pair</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-headline)] text-primary text-3xl mb-1">100%</p>
                  <p className="text-[10px] tracking-widest text-outline uppercase">Hand-cut leather</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-headline)] text-primary text-3xl mb-1">1 of 1</p>
                  <p className="text-[10px] tracking-widest text-outline uppercase">Unique patina</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-colors"
              >
                Talk to our artisans
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Atelier CTA ── */}
        <section className="py-24 md:py-40 px-8 md:px-16 text-center">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Visit the Atelier</p>
          <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl mb-12">
            Where Tradition <span className="italic">Breaks</span> Ground
          </h2>
          <div className="max-w-4xl mx-auto h-[420px] relative overflow-hidden group">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC5exXRYz6sFZ5IXHGky-U0Q9wtAREZXspEd-7FvERZQpVIi6t9rUGgivBt8ywODtzOoFfnnHZa4LNZywqQbZFwKRPSmBmsCZJW3k1nyVBgKIwoERMOTppRlnQxbGD_SmiXCfkSTuPGl66gCDDzl6ArlZF6uj50QX3psBSCGxRO8UypC4HkPKsQv7yxiLkk2K7VWGDQqyrDsII-McnDIesgAosBbWQ30P9GCC9J8JfaTGxxezpO4M8WieQj3gZKyziv3uSO1MCy2kv"
              alt="Luxury boutique interior"
              fill
              className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-surface-container-lowest/90 backdrop-blur-md p-10 max-w-sm w-full mx-4">
                <p className="font-[family-name:var(--font-headline)] text-2xl mb-1">Grand Atelier, Jakarta</p>
                <p className="text-xs tracking-widest text-outline uppercase mb-2">Jl. Kemang Raya No. 15</p>
                <p className="text-xs text-on-surface-variant mb-6">Open daily · 10.00 – 20.00 WIB</p>
                <Link
                  href="/location"
                  className="block w-full burnished-gradient text-on-primary text-center text-[11px] font-bold tracking-[0.2em] uppercase py-4 hover:brightness-110 transition-all mb-3"
                >
                  Get Directions
                </Link>
                <Link
                  href="/contact"
                  className="block w-full border border-outline-variant py-4 text-[11px] tracking-[0.2em] uppercase text-center hover:bg-on-surface hover:text-surface hover:border-on-surface transition-colors"
                >
                  Book a Private View
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Quick View Modal ── */}
      {quickViewId && quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-8 bg-black/60 backdrop-blur-sm"
          onClick={() => setQuickViewId(null)}
        >
          <div
            className="bg-surface w-full md:max-w-3xl max-h-[90vh] overflow-y-auto md:rounded-none shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-primary text-[10px] tracking-widest uppercase mb-1">
                      {quickViewProduct.badge}
                    </p>
                    <h3 className="font-[family-name:var(--font-headline)] text-3xl">
                      {quickViewProduct.name}
                    </h3>
                    <p className="text-outline text-xs uppercase tracking-widest mt-1">
                      {quickViewProduct.material}
                    </p>
                  </div>
                  <button
                    onClick={() => setQuickViewId(null)}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <p className="font-[family-name:var(--font-headline)] text-2xl text-primary-container mb-8">
                  {quickViewProduct.price}
                </p>

                <div className="mb-6">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-3">
                    Select Size (EU)
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [quickViewProduct.id]: size,
                          }))
                        }
                        className={`w-11 h-11 text-xs border transition-colors ${
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
                    onClick={() => {
                      handleAddToCart(quickViewProduct);
                      setQuickViewId(null);
                    }}
                    className="w-full burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase py-4 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">shopping_bag</span>
                    Add to Cart
                  </button>
                  <Link
                    href="/cart"
                    className="w-full border border-outline-variant text-[11px] font-bold tracking-widest uppercase py-4 text-center hover:bg-surface-container transition-colors"
                  >
                    View Cart
                  </Link>
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
