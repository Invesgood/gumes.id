import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const orders = [
  { id: "#GMS-2024-0847", date: "12 Apr 2026", status: "Delivered", total: "Rp 3.163.500", items: "Caelum Sandal", color: "text-green-600" },
  { id: "#GMS-2024-0712", date: "28 Mar 2026", status: "In Transit", total: "Rp 6.500.000", items: "The Heritage High-Boot", color: "text-primary" },
  { id: "#GMS-2024-0583", date: "15 Feb 2026", status: "Delivered", total: "Rp 4.500.000", items: "Cento Loafer", color: "text-green-600" },
  { id: "#GMS-2024-0401", date: "02 Jan 2026", status: "Delivered", total: "Rp 5.650.000", items: "Ghost Chelsea", color: "text-green-600" },
];

export default function Orders() {
  return (
    <>
      <Navbar />
      <main className="pt-48 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <header className="mb-16">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl font-light tracking-tight">Order History</h1>
          <p className="mt-4 text-sm tracking-[0.2em] uppercase text-outline">Your curated acquisitions</p>
        </header>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-[family-name:var(--font-headline)] font-bold">{order.id}</span>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${order.color}`}>{order.status}</span>
                </div>
                <p className="text-sm text-outline">{order.items}</p>
                <p className="text-xs text-outline/60 mt-1">{order.date}</p>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-[family-name:var(--font-headline)] text-lg">{order.total}</span>
                <Link href="#" className="text-[10px] uppercase tracking-widest font-bold border-b border-on-surface pb-1 hover:text-primary hover:border-primary transition-all">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
