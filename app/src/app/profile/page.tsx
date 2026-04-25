import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Profile() {
  return (
    <>
      <Navbar />
      <main className="pt-48 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl font-light tracking-tight">Your Profile</h1>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-outline">Digital Curator Member</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 text-center border border-outline-variant/30 shadow-md">
              <div className="w-20 h-20 burnished-gradient mx-auto flex items-center justify-center mb-4">
                <span className="text-white font-[family-name:var(--font-headline)] text-2xl font-bold">AV</span>
              </div>
              <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold">Alexander Vane</h2>
              <p className="text-xs text-outline mt-1">al@gumes.id</p>
              <div className="mt-6 pt-6 border-t border-outline-variant/10">
                <p className="text-[10px] uppercase tracking-widest text-primary mb-1">Artisan Tier</p>
                <p className="text-2xl font-[family-name:var(--font-headline)] text-primary-container font-bold">1,450</p>
                <p className="text-[10px] uppercase tracking-widest text-outline">Curation Points</p>
              </div>
            </div>
            <nav className="space-y-2">
              {[
                { label: "Order History", href: "/orders", icon: "receipt_long" },
                { label: "Settings", href: "/settings", icon: "settings" },
                { label: "Sign Out", href: "/login", icon: "logout" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-4 p-4 hover:bg-surface-container transition-colors group">
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{item.icon}</span>
                  <span className="text-sm uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Personal Info */}
            <section className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/30 shadow-md">
              <h3 className="font-[family-name:var(--font-headline)] text-xl mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">person</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Full Name</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Alexander Vane" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Email</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="al@gumes.id" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Phone</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="+62 812 3456 7890" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Date of Birth</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="15 March 1990" />
                </div>
              </div>
              <button className="mt-8 burnished-gradient px-8 py-3 text-white text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all">
                Update Profile
              </button>
            </section>

            {/* Shipping Address */}
            <section className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/30 shadow-md">
              <h3 className="font-[family-name:var(--font-headline)] text-xl mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">home</span>
                Default Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Address</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Jl. Kemang Raya No. 15, Jakarta Selatan 12730" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">City</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="Jakarta Selatan" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-outline mb-2">Province</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-3 px-0" defaultValue="DKI Jakarta" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
