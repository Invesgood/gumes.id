import Link from "next/link";

export default function Login() {
  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-surface-container-lowest">
        {/* Background glow */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary-container/10 blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md z-10 space-y-12">
          {/* Branding */}
          <div className="flex flex-col items-center text-center space-y-6">
            <span className="material-symbols-outlined text-primary text-6xl">filter_hdr</span>
            <div className="space-y-2">
              <h1 className="font-[family-name:var(--font-headline)] text-4xl font-bold tracking-widest text-primary">GUMES.ID</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-outline">Leather Atelier &amp; Curators</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-surface-container p-8 md:p-12 shadow-[40px_0_100px_-20px_rgba(0,0,0,0.1)]">
            <form className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary placeholder:text-outline/30 transition-all" id="email" placeholder="artisan@gumes.id" type="email" />
                </div>
                <div className="group">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest text-outline group-focus-within:text-primary transition-colors" htmlFor="password">Password</label>
                    <a href="#" className="text-[10px] uppercase tracking-widest text-outline/50 hover:text-primary transition-colors">Forgot?</a>
                  </div>
                  <input className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 focus:ring-0 focus:border-primary placeholder:text-outline/30 transition-all" id="password" placeholder="••••••••" type="password" />
                </div>
              </div>
              <div className="pt-4 space-y-6">
                <button className="w-full burnished-gradient py-4 text-on-primary-container text-xs font-extrabold uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all" type="submit">
                  Sign In to Atelier
                </button>
                <div className="flex items-center space-x-4">
                  <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
                  <span className="text-[9px] uppercase tracking-widest text-outline">or authenticate with</span>
                  <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 py-3 border border-outline-variant hover:bg-surface-variant transition-colors group" type="button">
                    <span className="material-symbols-outlined text-sm group-hover:text-primary">fingerprint</span>
                    <span className="text-[10px] uppercase tracking-widest">Biometric</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 border border-outline-variant hover:bg-surface-variant transition-colors group" type="button">
                    <span className="material-symbols-outlined text-sm group-hover:text-primary">key</span>
                    <span className="text-[10px] uppercase tracking-widest">Passkey</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs tracking-wider text-outline">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-bold ml-2 underline underline-offset-8 decoration-primary/30 hover:decoration-primary transition-all">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="w-full py-8 px-8 flex justify-center items-center border-t border-outline-variant/10 bg-surface-container-lowest">
        <p className="text-[10px] uppercase tracking-[0.2em] text-outline">&copy; 2024 GUMES.ID Leather Atelier</p>
      </footer>
    </>
  );
}
