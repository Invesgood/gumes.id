import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Checkout() {
  return (
    <>
      <Navbar />
      <main className="pt-48 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Shipping & Payment */}
          <div className="lg:col-span-7 space-y-16">
            {/* Shipping */}
            <section>
              <h2 className="font-[family-name:var(--font-headline)] text-2xl mb-8 flex items-center gap-4">
                <span className="text-primary italic text-4xl">01</span>
                <span className="uppercase tracking-[0.2em]">Shipping Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Full Name</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Alexander Vane" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Email Address</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="al@gumes.id" />
                </div>
              </div>
              <div className="mt-8">
                <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Delivery Address</label>
                <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Jl. Kemang Raya No. 15" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">City</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Jakarta Selatan" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Postal Code</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="12730" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-[family-name:var(--font-headline)] text-2xl mb-8 flex items-center gap-4">
                <span className="text-primary italic text-4xl">02</span>
                <span className="uppercase tracking-[0.2em]">Payment Method</span>
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-6 bg-surface-container-lowest border border-primary cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <span className="font-medium">Card Payment</span>
                    <p className="text-xs text-outline mt-1">Visa, Mastercard, AMEX</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">credit_card</span>
                </label>
                <label className="flex items-center gap-4 p-6 bg-surface-container-lowest border border-outline-variant/20 cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <span className="font-medium">Bank Transfer</span>
                    <p className="text-xs text-outline mt-1">BCA, Mandiri, BNI, BRI</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">account_balance</span>
                </label>
                <label className="flex items-center gap-4 p-6 bg-surface-container-lowest border border-outline-variant/20 cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                  <div className="flex-1">
                    <span className="font-medium">Digital Wallets</span>
                    <p className="text-xs text-outline mt-1">GoPay, OVO, DANA, ShopeePay</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">wallet</span>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-5 bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/30 shadow-md sticky top-48">
            <h2 className="font-[family-name:var(--font-headline)] text-xl uppercase tracking-[0.2em] mb-8">Order Summary</h2>
            <div className="flex gap-6 mb-8 pb-8 border-b border-outline-variant/10">
              <div className="w-24 h-28 bg-surface-container overflow-hidden relative">
                <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM1NuPUctpMWnYvef9NjjB8aI-2kYgNSnh3kKv6cU_uDd9kaXahAR-5xDMKcekujnTbNDYF5vRXrSSDeTaCLCen4LJwtEbS8MEVjyLVG-_E_NFWsTYxVCyh4hDXrqatJZN-0QDdxelEJMGo9XewhekRvr5t98S7Hk8Ey8g0VeViOb9I6jdrS5ZXpEhKNX1wncGm4ukqlWUK_StXMNE6QCX20KCghiaqM3oFTpC9jlme-Rcq8nhkVbn_0M2yUqxIgfYk_ioEToD7oa8" alt="Caelum Sandal" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-lg italic">Caelum Sandal</h3>
                <p className="text-xs text-outline mt-1">#GMS-1502 Size 42</p>
                <p className="mt-4 font-[family-name:var(--font-headline)]">Rp 2.850.000</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-outline uppercase tracking-widest">Subtotal</span>
                <span>Rp 2.850.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-outline uppercase tracking-widest">Shipping</span>
                <span className="text-xs">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-outline uppercase tracking-widest">PPN (11%)</span>
                <span>Rp 313.500</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-outline-variant/10 pt-6 mb-8">
              <span className="uppercase tracking-[0.2em]">Total</span>
              <span className="text-3xl font-[family-name:var(--font-headline)] text-primary-container">Rp 3.163.500</span>
            </div>
            <button className="w-full burnished-gradient text-white py-5 text-sm uppercase tracking-[0.2em] font-bold hover:brightness-110 active:scale-[0.98] transition-all">
              Initiate Secure Payment
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-outline uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">lock</span>
              Encrypted Transaction
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
