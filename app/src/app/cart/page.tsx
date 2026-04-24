"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatIDR } from "@/lib/cart";

export default function Cart() {
  const { items, totalItems, subtotal, removeItem, updateQty } = useCart();

  const shipping = 0;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <main className="pt-48 pb-32 px-6 md:px-12 max-w-screen-xl mx-auto min-h-screen">
        <header className="mb-14">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-3">Your Selection</p>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl font-light tracking-tight">
            Shopping Cart
          </h1>
          {totalItems > 0 && (
            <p className="mt-3 text-sm tracking-[0.2em] uppercase text-outline">
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </p>
          )}
        </header>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span
              className="material-symbols-outlined text-outline-variant mb-6"
              style={{ fontSize: "64px", fontVariationSettings: "'FILL' 0, 'wght' 100" }}
            >
              shopping_bag
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-3">Your cart is empty</h2>
            <p className="text-on-surface-variant text-sm mb-10 max-w-xs">
              Explore our collection and add a piece to your selection.
            </p>
            <Link
              href="/"
              className="burnished-gradient text-on-primary text-[11px] font-bold tracking-widest uppercase px-10 py-4 hover:brightness-110 transition-all"
            >
              Browse Collection
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="divide-y divide-outline-variant/10">
                {items.map((item) => (
                  <div key={item.cartId} className="group flex gap-6 md:gap-8 py-8 first:pt-0">
                    {/* Image */}
                    <div className="relative w-28 md:w-36 aspect-[3/4] bg-surface-container overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h3 className="font-[family-name:var(--font-headline)] text-xl md:text-2xl truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-outline mt-1 tracking-widest uppercase">
                            {item.material}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="border border-outline-variant/40 text-[10px] uppercase tracking-widest px-3 py-1 text-on-surface-variant">
                              EU {item.size}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          className="text-outline-variant hover:text-error transition-colors shrink-0 mt-1"
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap justify-between items-end gap-4 mt-6">
                        {/* Qty control */}
                        <div className="flex items-center border border-outline-variant/30">
                          <button
                            onClick={() => updateQty(item.cartId, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary-container disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined text-base">remove</span>
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.cartId, item.qty + 1)}
                            className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary-container transition-colors"
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined text-base">add</span>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.qty > 1 && (
                            <p className="text-[10px] text-outline uppercase tracking-widest mb-1">
                              {formatIDR(item.priceNum)} × {item.qty}
                            </p>
                          )}
                          <p className="font-[family-name:var(--font-headline)] text-xl text-primary-container">
                            {formatIDR(item.priceNum * item.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 gap-4 border-t border-outline-variant/10">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-outline hover:text-primary-container transition-all group"
                >
                  <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em]">
                  <span className="text-outline">Need assistance?</span>
                  <Link
                    href="/contact"
                    className="text-on-surface border-b border-outline-variant hover:border-primary-container hover:text-primary-container transition-all"
                  >
                    Contact Atelier
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Order Summary ── */}
            <aside className="lg:col-span-5 xl:col-span-4 sticky top-48">
              <div className="bg-surface-container-lowest shadow-[0_2px_40px_rgba(0,0,0,0.06)]">
                <div className="px-8 pt-8 pb-6 border-b border-outline-variant/10">
                  <h2 className="font-[family-name:var(--font-headline)] text-2xl">Order Summary</h2>
                </div>

                <div className="px-8 py-6 space-y-4">
                  {/* Item breakdown */}
                  <div className="space-y-3 pb-4 border-b border-outline-variant/10">
                    {items.map((item) => (
                      <div key={item.cartId} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-on-surface-variant truncate max-w-[160px]">{item.name}</span>
                          <span className="text-outline text-xs shrink-0">×{item.qty}</span>
                        </div>
                        <span className="font-medium shrink-0 ml-4">{formatIDR(item.priceNum * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 py-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-outline uppercase tracking-widest text-xs">Subtotal</span>
                      <span className="font-[family-name:var(--font-headline)]">{formatIDR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-outline uppercase tracking-widest text-xs">Shipping</span>
                      <span className="text-xs font-medium text-on-surface">Complimentary</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-outline uppercase tracking-widest text-xs">PPN (11%)</span>
                      <span className="font-[family-name:var(--font-headline)]">{formatIDR(tax)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center border-t border-outline-variant/10 pt-5">
                    <span className="text-sm uppercase tracking-[0.2em] font-medium">Total</span>
                    <span className="font-[family-name:var(--font-headline)] text-2xl text-primary-container">
                      {formatIDR(total)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-8 pb-8 space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full burnished-gradient text-on-primary py-5 text-[11px] uppercase tracking-[0.3em] font-bold text-center hover:brightness-110 transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] text-outline uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base text-primary-container">verified_user</span>
                      Secure payment processing
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-outline uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base text-primary-container">local_shipping</span>
                      Free shipping across Indonesia
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-outline uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base text-primary-container">replay</span>
                      30-day hassle-free returns
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
