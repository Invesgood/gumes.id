"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartProvider";

const navLinks = [
  { href: "/new-arrival", label: "New Arrival" },
  { href: "/", label: "Product" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md px-6 md:px-12 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto">
        {/* Top bar */}
        <div className="flex justify-end items-center gap-6 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-medium font-[var(--font-label)]">
              Hello Al
            </span>
            <Link href="/profile">
              <span className="material-symbols-outlined text-primary-container cursor-pointer">
                person
              </span>
            </Link>
          </div>
          <button onClick={toggleTheme} className="cursor-pointer" aria-label="Toggle dark mode">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          <Link href="/cart" className="relative">
            <span className="material-symbols-outlined cursor-pointer hover:text-primary-container transition-colors">
              shopping_bag
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 burnished-gradient text-on-primary text-[9px] font-bold flex items-center justify-center rounded-full">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="flex flex-col items-center gap-1">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}
            >
              landscape
            </span>
            <span className="text-3xl font-bold text-primary-container tracking-[0.2em] font-[family-name:var(--font-headline)]">
              GUMES.ID
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center gap-10 mt-6 uppercase tracking-[0.2em] text-[11px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-primary-container border-b border-primary-container pb-1 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
