import Link from "next/link";
import Image from "next/image";

export default function SignUp() {
  return (
    <main className="min-h-screen flex items-stretch bg-surface">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-7/12 relative overflow-hidden bg-surface-container-low">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDGWDF9aJmDAJczL3EzX1bs83huMnk_fHQFHN7DZXwPXR_ppwpkcr9Ye9W_YjHS7PZUE6DfmYnfV5OY2Kyhswm7K5rqS67q4GfLqg2Lug5n-vKgO24siV16ybZ8ZHtAscHtwMzArVXYe-lLK6uZ3oYOySMgHIZ-oLOhxoTqgrgFJj3fJ0Cf4O1F94NHeknGZsHYyjptG534kcy9nrBdottzb50blzj62v3BadV-f70uMgElkx4PPq12DLHn4k3GsaB6iSCGHTXCY9K"
          alt="Artisan leather crafting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(249,247,242,1) 40%, rgba(249,247,242,0) 100%)" }}></div>
        <div className="relative z-10 flex flex-col justify-center px-24 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-outline mb-4 block">The Heritage Collection</span>
            <h1 className="font-[family-name:var(--font-headline)] text-7xl font-bold tracking-tight leading-[1.1]">
              Crafting <br />
              <span className="italic font-normal">Legacy</span> <br />
              Since 1984.
            </h1>
          </div>
          <p className="text-lg text-secondary max-w-md leading-relaxed">
            Join an exclusive circle of connoisseurs. Our atelier combines centuries-old techniques with modern precision to create leather goods that age as beautifully as the stories they carry.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-5/12 flex flex-col bg-surface">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 py-12">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-12">
              <span className="hidden lg:block text-2xl font-bold tracking-widest text-primary-container font-[family-name:var(--font-headline)] mb-12">GUMES.ID</span>
              <h2 className="font-[family-name:var(--font-headline)] text-4xl font-bold mb-4">Create Account</h2>
              <p className="text-secondary text-sm">Become a Digital Curator Member and explore our bespoke collections.</p>
            </div>
            <form className="space-y-10">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-outline group-focus-within:text-primary transition-colors mb-2" htmlFor="full_name">Full Name</label>
                <input className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-3 placeholder:text-outline-variant/50 transition-all" id="full_name" placeholder="Enter your full name" type="text" />
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-outline group-focus-within:text-primary transition-colors mb-2" htmlFor="email">Email Address</label>
                <input className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-3 placeholder:text-outline-variant/50 transition-all" id="email" placeholder="hello@curator.com" type="email" />
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-outline group-focus-within:text-primary transition-colors mb-2" htmlFor="password">Security Key (Password)</label>
                <input className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-3 placeholder:text-outline-variant/50 transition-all" id="password" placeholder="••••••••••••" type="password" />
              </div>
              <div className="pt-6 space-y-6">
                <button className="burnished-gradient w-full py-5 text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit">
                  Initialize Membership
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input className="w-4 h-4 border-outline-variant text-primary focus:ring-primary" id="terms" type="checkbox" />
                    <label className="text-[10px] uppercase tracking-wider text-secondary" htmlFor="terms">Accept Terms</label>
                  </div>
                  <a href="#" className="text-[10px] uppercase tracking-wider text-primary border-b border-primary pb-0.5">Privacy Policy</a>
                </div>
              </div>
            </form>
            <div className="mt-16 pt-8 border-t border-surface-container-high flex flex-col items-center space-y-4">
              <p className="text-xs text-secondary italic">Already part of the legacy?</p>
              <Link href="/login" className="text-xs uppercase tracking-[0.15em] font-bold hover:text-primary transition-colors">
                Sign In to Atelier
              </Link>
            </div>
          </div>
        </div>
        <footer className="w-full py-8 px-8 flex justify-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-outline">&copy; 2024 GUMES.ID Leather Atelier</p>
        </footer>
      </div>
    </main>
  );
}
