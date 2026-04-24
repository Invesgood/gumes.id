import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface px-6">
      <div className="max-w-lg w-full text-center space-y-12">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 burnished-gradient flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-headline)] text-4xl font-bold mb-4">Payment Confirmed</h1>
            <p className="text-outline text-sm leading-relaxed max-w-sm mx-auto">
              Your order has been placed successfully. A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 text-left space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-outline uppercase tracking-widest text-xs">Order Number</span>
            <span className="font-[family-name:var(--font-headline)] font-bold">#GMS-2024-0847</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-outline uppercase tracking-widest text-xs">Date</span>
            <span>12 April 2026</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-outline uppercase tracking-widest text-xs">Total</span>
            <span className="font-[family-name:var(--font-headline)] text-primary-container font-bold">Rp 3.163.500</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-outline uppercase tracking-widest text-xs">Est. Delivery</span>
            <span>3-5 Business Days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders" className="burnished-gradient px-10 py-4 text-white text-xs uppercase tracking-[0.2em] font-bold text-center">
            Track Order
          </Link>
          <Link href="/" className="px-10 py-4 border border-on-surface/20 text-xs uppercase tracking-[0.2em] font-bold text-center hover:bg-surface-container transition-colors">
            Continue Shopping
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-outline">&copy; 2024 GUMES.ID Leather Atelier</p>
        </div>
      </div>
    </main>
  );
}
