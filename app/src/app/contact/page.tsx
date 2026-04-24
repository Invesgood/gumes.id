import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="flex-grow max-w-screen-2xl mx-auto px-6 md:px-12 py-24 pt-48 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          {/* Editorial Intro */}
          <div className="md:col-span-5 space-y-12">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Inquiry &amp; Dialogue</h2>
              <h1 className="font-[family-name:var(--font-headline)] text-6xl leading-[1.1] text-on-surface -ml-1">
                The Art of Bespoke Connection.
              </h1>
            </div>
            <p className="text-lg leading-relaxed opacity-80 max-w-md">
              Whether you are seeking a singular commission or have questions regarding our current collection, our curators are here to assist with professional precision.
            </p>
            <div className="space-y-8 pt-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest opacity-40">Direct Communication</span>
                <span className="font-[family-name:var(--font-headline)] text-xl">concierge@gumes.id</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest opacity-40">The Atelier</span>
                <span className="font-[family-name:var(--font-headline)] text-xl">
                  Jl. Kemang Raya No. 15<br />Jakarta Selatan, Indonesia
                </span>
              </div>
              <div className="flex gap-6 pt-4">
                <a href="#" className="text-primary hover:opacity-70 transition-opacity">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                </a>
                <a href="#" className="text-primary hover:opacity-70 transition-opacity">
                  <span className="material-symbols-outlined text-2xl">movie</span>
                </a>
                <a href="#" className="text-primary hover:opacity-70 transition-opacity">
                  <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                </a>
              </div>
            </div>
            <div className="w-full h-80 bg-secondary-container overflow-hidden relative">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHwyAm2eE7gn5MPuXh5g0vB99VPRihi6AluBWIgYwsO-GyT_08Je52Vrl2TCcRIOHC4JxCjLV7bCOBp_sUb2AqGbFv9rO3a4M9GtXwrQmymGs0HSlQTkamlxGw2p-53ePtTh9Q5mhIaOWj54qQ7OsTfLEWybLyK503nZypzsd_GC7ve8lU5zx1KB8M-DpodNGpucrue7SikP2lLUOHSreeK83urUoSKooDg2olRY8FmKNcga1Gjx6A6WCIFt-AmfR_8YsX1WUyq-jQ"
                alt="Leather workshop"
                fill
                className="object-cover mix-blend-multiply opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-surface-container-high p-12 lg:p-20 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-primary opacity-30"></div>
            <form className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary mb-2">Full Identity</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary py-2 px-0 transition-colors placeholder:opacity-30" placeholder="YOUR NAME" type="text" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary mb-2">Electronic Mail</label>
                  <input className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary py-2 px-0 transition-colors placeholder:opacity-30" placeholder="EMAIL@EXAMPLE.COM" type="email" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-primary mb-2">Nature of Inquiry</label>
                <select className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary py-2 px-0 transition-colors appearance-none cursor-pointer">
                  <option>Bespoke Leather Commission</option>
                  <option>Order Acquisition Inquiry</option>
                  <option>Press &amp; Editorial</option>
                  <option>Architectural Collaboration</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-primary mb-2">Your Message</label>
                <textarea className="w-full bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-primary py-2 px-0 transition-colors resize-none placeholder:opacity-30" placeholder="DESCRIBE YOUR VISION OR REQUIREMENTS..." rows={4}></textarea>
              </div>
              <div className="pt-8">
                <button className="burnished-gradient w-full py-5 text-white text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                  Initiate Correspondence
                  <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
