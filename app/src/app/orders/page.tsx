"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";

const orders = [
  { id: "#GMS-2024-0847", date: "12 Apr 2026", status: "Delivered", total: "Rp 3.163.500", items: "Caelum Sandal", productId: "2", color: "text-green-600" },
  { id: "#GMS-2024-0712", date: "28 Mar 2026", status: "In Transit", total: "Rp 6.500.000", items: "The Heritage High-Boot", productId: "1", color: "text-primary" },
  { id: "#GMS-2024-0583", date: "15 Feb 2026", status: "Delivered", total: "Rp 4.500.000", items: "Cento Loafer", productId: "3", color: "text-green-600" },
  { id: "#GMS-2024-0401", date: "02 Jan 2026", status: "Delivered", total: "Rp 5.650.000", items: "Ghost Chelsea", productId: "4", color: "text-green-600" },
];

export default function Orders() {
  const [reviewModal, setReviewModal] = useState<typeof orders[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("Alexander Vane");
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");

  function openReview(order: typeof orders[0]) {
    setReviewModal(order);
    setRating(0);
    setHoverRating(0);
    setComment("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewModal || rating === 0) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewModal.productId,
          productName: reviewModal.items,
          orderId: reviewModal.id,
          customerName: name,
          rating,
          comment,
        }),
      });
      setReviewed((prev) => new Set(prev).add(reviewModal.id));
      setReviewModal(null);
      setToast("Ulasan berhasil dikirim. Terima kasih!");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-48 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-on-surface text-surface px-6 py-4 text-sm font-medium shadow-lg">
            {toast}
          </div>
        )}

        <header className="mb-16">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl font-light tracking-tight">Order History</h1>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-outline">Your curated acquisitions</p>
        </header>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-outline-variant/30 hover:border-outline-variant/60 shadow-sm hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-[family-name:var(--font-headline)] font-bold">{order.id}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${order.color}`}>{order.status}</span>
                </div>
                <p className="text-sm text-outline">{order.items}</p>
                <p className="text-xs text-outline/60 mt-1">{order.date}</p>
              </div>
              <div className="flex items-center gap-6 flex-wrap">
                <span className="font-[family-name:var(--font-headline)] text-lg">{order.total}</span>
                {order.status === "Delivered" && (
                  reviewed.has(order.id) ? (
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-outline">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Diulas
                    </span>
                  ) : (
                    <button
                      onClick={() => openReview(order)}
                      className="text-[10px] uppercase tracking-widest font-bold text-primary-container border-b border-primary-container pb-0.5 hover:opacity-70 transition-opacity flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">rate_review</span>
                      Tulis Ulasan
                    </button>
                  )
                )}
                <Link href="#" className="text-[10px] uppercase tracking-widest font-bold border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-all">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />

      {/* Review Modal */}
      {reviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setReviewModal(null)}
        >
          <div
            className="bg-surface w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-xl">Tulis Ulasan</h3>
                <p className="text-[11px] text-outline mt-0.5 tracking-widest uppercase">{reviewModal.items}</p>
              </div>
              <button onClick={() => setReviewModal(null)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              {/* Star rating */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <span
                        className="material-symbols-outlined text-3xl transition-colors"
                        style={{
                          fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0",
                          color: (hoverRating || rating) >= star ? "#c68642" : "var(--color-outline-variant)",
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                {rating === 0 && (
                  <p className="text-[10px] text-outline mt-1">Pilih bintang di atas</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Nama *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Komentar
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary-container transition-colors resize-none"
                  placeholder="Ceritakan pengalaman kamu dengan produk ini…"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  className="flex-1 burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase py-4 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {submitting ? "Mengirim…" : "Kirim Ulasan"}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="border border-outline-variant text-[11px] font-bold tracking-widest uppercase px-6 py-4 hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
