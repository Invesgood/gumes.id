import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

const locations = [
  {
    id: 1,
    name: "Jakarta",
    label: "Flagship Atelier",
    address: "Jl. Kemang Raya No. 15, Jakarta Selatan 12730",
    hours: "Mon — Sat: 10:00 - 21:00\nSun: 11:00 - 20:00",
    description: "Located in the heart of Kemang, our Jakarta flagship serves as both a showroom and a live workshop where artisans demonstrate traditional burnishing techniques.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv7562cmDWZnJ9txF_pcqiH0fSeb77hcGrY2S9DPvNJtLkS0tLMJ_4C1FvldO9eS8gHCv7UHLF_DO8PKU6BWL-95VWx5gzLo_tHWe7iNaW9IKi0_kERzwaHBByQQC_03VnzX9k9wlydfTUHFC1Yt41pahIzi8SeVjGG4-aTeSvsY3P4fF0NXxtF1qAKMxOMfHbClbNDk7-YC7cCJvFXgDyR9R7teboRyj_9Vcys0_JkfpzGcpxLk6LbvaZHMaG5M5vgTBxMmchiMcC",
    layout: "row",
  },
  {
    id: 2,
    name: "Bandung",
    label: "Creative Hub",
    address: "Jl. Dago No. 88, Bandung 40135",
    description: "A serene sanctuary dedicated to the fusion of Sundanese textile heritage and contemporary leather craftsmanship.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0anjaYrgBAin5b_GiRf-HgIg8yl9d4TRTotuyHB7QHbGkAs-Vscio9Fl8qf4viVrbnMR3pdOkLzkzWTbLywx3L2MdO1YVX-63rQdJ93F2lOXJ22hLgQVBV0aP7SuyPw8BMXn4qzfR6H0OQr5PfDc0ftuBlWkx_ZCx1YTkyf9h3H46jtcXU3vSmY02bQQaszpIuOgqakJ1PlX-NDaHkqozb-i5pRSmo-JvFeGkxSgrek8cRIr1MmWJY5i5fcd_jFLTWahLolnY4jtL",
    layout: "card",
  },
  {
    id: 3,
    name: "Surabaya",
    label: "East Java Outpost",
    address: "Jl. Tunjungan No. 42, Surabaya 60271",
    description: "Tucked away in the historic Tunjungan area, our Surabaya outpost offers bespoke tailoring services for our exclusive heritage collection.",
    phone: "+62 31 5678 9012",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWplC-_TvcdmaG8oQQ3rDaOYkDemDfOGLYHenma35lQup7PF1zq5z6Xo7Elgmvi9H1Jh0zHHwR_jdLWuboJzk4KYsn34Fi0pOokmW8fUsTIkuqOL4YPhlSzkueu2yruTZ5QGR0XV0gxD5rMEMYUL2kj9kmeN1WP8QF38oyd_qfk-Q2-IghvdzahjflVJdUqQ6_NkG80dd3D-Uas2y6_GM7d0JOX-kQ6IWY_66_NjhTACRuflcTOx17s64l2T8-h2aiJZCBfI0gYPaF",
    layout: "row-reverse",
  },
];

export default function Location() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-48">
        {/* Hero */}
        <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col items-center text-center">
          <h1 className="font-[family-name:var(--font-headline)] text-6xl md:text-8xl mb-8 tracking-tighter leading-none">
            Our Ateliers
          </h1>
          <p className="text-lg max-w-2xl opacity-70 leading-relaxed">
            Experience the tactile journey of GUMES.ID across our curated physical spaces. Each location is an architectural dialogue between heritage craft and contemporary minimalism.
          </p>
        </section>

        {/* Locations Grid */}
        <section className="px-6 md:px-12 pb-32 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {locations.map((loc) => (
              <div key={loc.id} className={`${loc.layout === "card" ? "md:col-span-4" : "md:col-span-8"} bg-surface-container-lowest overflow-hidden flex ${loc.layout === "card" ? "flex-col" : "flex-col md:flex-row"} ${loc.layout === "row-reverse" ? "md:flex-row-reverse" : ""} group transition-all duration-700 hover:bg-surface-container`}>
                <div className={`${loc.layout === "card" ? "h-64" : "w-full md:w-1/2 h-[500px]"} overflow-hidden relative`}>
                  <Image src={loc.image} alt={`${loc.name} Atelier`} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
                <div className={`${loc.layout === "card" ? "" : "w-full md:w-1/2"} p-12 flex flex-col justify-between`}>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary mb-4 block">{loc.label}</span>
                    <h2 className="font-[family-name:var(--font-headline)] text-4xl mb-6">{loc.name}</h2>
                    {loc.description && (
                      <p className="text-sm leading-loose opacity-60 mb-8">{loc.description}</p>
                    )}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <span className="text-xs tracking-wide">{loc.address}</span>
                      </div>
                      {loc.hours && (
                        <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-primary">schedule</span>
                          <span className="text-xs tracking-wide whitespace-pre-line">{loc.hours}</span>
                        </div>
                      )}
                      {loc.phone && (
                        <div className="flex items-start gap-4">
                          <span className="material-symbols-outlined text-primary">call</span>
                          <span className="text-xs tracking-wide">{loc.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="mt-12 self-start text-[10px] uppercase tracking-widest font-bold border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-all">
                    View Map
                  </button>
                </div>
              </div>
            ))}

            {/* Map Widget */}
            <div className="md:col-span-4 bg-surface-container flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[300px]">
              <div className="relative z-10 text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl mb-2">Indonesia Roots</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-50">3 Locations Across Java</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-container py-32">
          <div className="max-w-screen-xl mx-auto px-12 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-headline)] text-5xl mb-8 leading-tight">
                Can&apos;t visit in person?<br />
                <span className="text-primary">Connect with our Curators.</span>
              </h2>
              <p className="text-lg opacity-70 mb-12">Our digital atelier is always open. Speak with a product specialist to guide your tactile journey from anywhere in the world.</p>
              <div className="flex gap-8">
                <a href="/contact" className="burnished-gradient px-10 py-5 text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl">Contact Us</a>
                <a href="#" className="px-10 py-5 border border-on-surface/20 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-surface-container-lowest transition-colors">Book a Private Call</a>
              </div>
            </div>
            <div className="flex-1 w-full aspect-square bg-surface-container-lowest relative p-1">
              <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK9Izj8qlqQLIz2u-PHPZzeu-4F2dzbUfMSFL9FJZWUWGzI0jFwtlEhC0QwEbFEUj5z0zMyisO6YpnD2Y2yT9WJxl5JwBeCzO559InfCZIhu8z_DjXsb-1_6RN20LMiDmY-QK_YaR80JXWlzkznk5hLfRQAr8jSzfbicJ06mI5gzZyFzKP0epoEhu0jFQvs-WQpARuQNwIIZayNK-jl6zAk7Uo32txxGpXqKqolEKW1enqUaiMxqoyf9qhGVgmRiJ32q1T_YYFy64p" alt="Artisan hands" fill className="object-cover grayscale" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
