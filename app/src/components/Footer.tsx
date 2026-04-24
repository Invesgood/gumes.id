import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-16 px-6 md:px-12 border-t border-outline-variant/10 bg-surface mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        <div className="text-[10px] tracking-[0.3em] uppercase text-outline">
          &copy; 2024 GUMES.ID - THE TACTILE ATELIER
        </div>
        <div className="flex gap-8 items-center">
          <Link
            href="#"
            className="text-[10px] tracking-[0.3em] uppercase text-outline hover:text-primary-container transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[10px] tracking-[0.3em] uppercase text-outline hover:text-primary-container transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-[10px] tracking-[0.3em] uppercase text-outline hover:text-primary-container transition-colors"
          >
            Shipping &amp; Returns
          </Link>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary-container">
            language
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-outline">
            EN / IDR
          </span>
        </div>
      </div>
    </footer>
  );
}
