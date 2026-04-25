"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatIDR } from "@/lib/cart";

interface Review {
  id: string;
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

const SIZES = [39, 40, 41, 42, 43];

const COLOR_MAP: Record<string, { label: string; hex: string }> = {
  hitam: { label: "Hitam", hex: "#1a1a1a" },
  coklat: { label: "Coklat", hex: "#5d4037" },
  tan:    { label: "Tan",    hex: "#c68642" },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayImage, setDisplayImage] = useState<string>("");
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === id);
        setProduct(found || null);
        if (found?.colors?.length) setSelectedColor(found.colors[0]);
        setDisplayImage(found?.image || "");
        setLoading(false);
      });
    fetch(`/api/reviews?productId=${id}`)
      .then((r) => r.json())
      .then(setReviews);
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      material: product.material,
      priceNum: product.priceNum,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }, [product, selectedSize, selectedColor, addItem]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-48">
          <p className="text-outline text-sm tracking-widest uppercase">Loading…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center pt-48 gap-4">
          <p className="text-on-surface-variant">Produk tidak ditemukan.</p>
          <Link href="/" className="text-[11px] uppercase tracking-widest text-primary-container border-b border-primary-container">
            Kembali ke Koleksi
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-48 pb-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-outline mb-10">
            <Link href="/" className="hover:text-primary-container transition-colors">Koleksi</Link>
            <span>/</span>
            <span className="text-on-surface-variant">{product.category}</span>
            <span>/</span>
            <span className="text-on-surface">{product.name}</span>
          </nav>

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

            {/* Image + thumbnails */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square bg-surface-container-low overflow-hidden border border-outline-variant/30 shadow-md">
                <Image
                  src={displayImage || product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                  unoptimized={(displayImage || product.image).startsWith("/")}
                />
                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  {product.badge && (
                    <div className="bg-surface-container-lowest px-3 py-1">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  {product.bestSeller && (
                    <div className="bg-on-surface px-3 py-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-surface" style={{ fontVariationSettings: "'FILL' 1", fontSize: "11px" }}>star</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-surface">Best Seller</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {(product.gallery?.length ?? 0) > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[product.image, ...(product.gallery || [])].map((img, i) => {
                    const isActive = (displayImage || product.image) === img;
                    return (
                      <button
                        key={i}
                        onClick={() => setDisplayImage(img)}
                        className={`relative w-16 h-16 shrink-0 overflow-hidden border-2 transition-all ${isActive ? "border-on-surface" : "border-outline-variant/30 opacity-60 hover:opacity-100"}`}
                      >
                        <Image src={img} alt="" fill className="object-cover" unoptimized={img.startsWith("/")} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-outline-variant/20">
                <p className="text-primary text-[11px] tracking-[0.3em] uppercase mb-2">
                  {product.category} · {product.isNewArrival ? "New Arrival" : "Koleksi"}
                </p>
                <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl mb-2">
                  {product.name}
                </h1>
                <p className="text-outline text-xs uppercase tracking-widest">{product.material}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl text-primary-container">
                  {product.price}
                </span>
              </div>

              {/* Color selector */}
              {product.colors?.length > 0 && (
                <div className="mb-8">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                    Warna:{" "}
                    {selectedColor && COLOR_MAP[selectedColor] && (
                      <span className="text-on-surface">{COLOR_MAP[selectedColor].label}</span>
                    )}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((cid) => {
                      const c = COLOR_MAP[cid];
                      if (!c) return null;
                      return (
                        <button
                          key={cid}
                          onClick={() => {
                            setSelectedColor(cid);
                            setDisplayImage(product.colorImages?.[cid] || product.image);
                          }}
                          title={c.label}
                          className={`flex items-center gap-2 px-3 py-2 border-2 transition-all text-[11px] font-bold uppercase tracking-widest ${
                            selectedColor === cid
                              ? "border-on-surface bg-surface-container scale-105"
                              : "border-outline-variant text-on-surface-variant hover:border-on-surface"
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${sizeError ? "text-error" : "text-on-surface-variant"}`}>
                    {sizeError ? "Pilih ukuran terlebih dahulu" : selectedSize ? `Ukuran terpilih: EU ${selectedSize}` : "Pilih Ukuran (EU)"}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`w-12 h-12 text-sm border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "bg-on-surface text-surface border-on-surface scale-105"
                          : sizeError
                          ? "border-error text-error"
                          : "border-outline-variant text-on-surface-variant hover:border-on-surface hover:text-on-surface"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-bold tracking-widest uppercase transition-all ${
                    added
                      ? "bg-on-surface text-surface"
                      : "burnished-gradient text-on-primary hover:brightness-110"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {added ? "check" : "shopping_bag"}
                  </span>
                  {added ? "Ditambahkan ke Cart" : "Tambah ke Cart"}
                </button>
                <Link
                  href="/cart"
                  className="px-6 py-4 border border-outline-variant text-[11px] font-bold tracking-widest uppercase hover:bg-surface-container transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">shopping_cart</span>
                </Link>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8 pb-8 border-b border-outline-variant/20">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                    Deskripsi Produk
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                {[
                  { icon: "verified", text: "100% kulit asli pilihan" },
                  { icon: "handyman", text: "Dikerjakan manual oleh pengrajin berpengalaman" },
                  { icon: "local_shipping", text: "Gratis ongkir seluruh Indonesia" },
                  { icon: "replay", text: "Garansi 30 hari, free return" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-container text-base">{item.icon}</span>
                    <span className="text-xs text-on-surface-variant">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-20 border-t border-outline-variant/20 pt-16">
              <div className="flex items-end gap-6 mb-10">
                <h2 className="font-[family-name:var(--font-headline)] text-3xl">Ulasan Pembeli</h2>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => {
                      const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
                      return (
                        <span key={s} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: avg >= s ? "'FILL' 1" : "'FILL' 0", color: avg >= s ? "#c68642" : "var(--color-outline-variant)" }}>star</span>
                      );
                    })}
                  </div>
                  <span className="text-sm text-outline">{(reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1)} · {reviews.length} ulasan</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-surface-container-lowest p-6 border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm text-on-surface">{review.customerName}</span>
                      <span className="text-[10px] text-outline uppercase tracking-widest">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className="material-symbols-outlined text-base" style={{ fontVariationSettings: review.rating >= s ? "'FILL' 1" : "'FILL' 0", color: review.rating >= s ? "#c68642" : "var(--color-outline-variant)" }}>star</span>
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-on-surface-variant leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
