"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <Navbar />
      <main className="pt-48 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl font-light tracking-tight">Settings</h1>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-outline">Account preferences &amp; security</p>
        </header>

        <div className="space-y-12">
          {/* Personal Identity */}
          <section className="bg-surface-container-lowest p-8 md:p-12">
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">badge</span>
              Personal Identity
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
          </section>

          {/* Security */}
          <section className="bg-surface-container-lowest p-8 md:p-12">
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">shield</span>
              Security &amp; Access
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-outline mt-1">Add an extra layer of security</p>
                </div>
                <button className="relative w-12 h-6 bg-outline-variant/30 rounded-full transition-colors">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"></span>
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                <div>
                  <p className="font-medium">Update Password</p>
                  <p className="text-xs text-outline mt-1">Last changed 3 months ago</p>
                </div>
                <button className="text-[10px] uppercase tracking-widest font-bold border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-all">
                  Change
                </button>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-surface-container-lowest p-8 md:p-12">
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">tune</span>
              Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-xs text-outline mt-1">Switch to dark theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-outline-variant/30"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${theme === "dark" ? "left-7" : "left-1"}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-outline mt-1">New arrivals &amp; exclusive offers</p>
                </div>
                <button className="relative w-12 h-6 bg-primary rounded-full transition-colors">
                  <span className="absolute left-7 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"></span>
                </button>
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-xs text-outline mt-1">Display language preference</p>
                </div>
                <select className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary py-2 px-0 text-sm">
                  <option>English</option>
                  <option>Bahasa Indonesia</option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button className="burnished-gradient px-10 py-4 text-white text-xs uppercase tracking-[0.2em] font-bold hover:brightness-110 active:scale-[0.98] transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
