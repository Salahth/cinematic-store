import { ScrollShowcase } from "@/components/ScrollShowcase";

export default function Home() {
  return (
    <main>
      <ScrollShowcase />
      {/* Footer / secondary content below the showcase */}
      <section className="relative bg-black text-white/60 text-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <div className="text-white font-display font-semibold mb-2">
              AURA.studio
            </div>
            <div>© {new Date().getFullYear()} — Tous droits réservés.</div>
          </div>
          <div className="flex gap-8">
            <a className="hover:text-white transition-colors" href="#">CGV</a>
            <a className="hover:text-white transition-colors" href="#">Livraison</a>
            <a className="hover:text-white transition-colors" href="#">Contact</a>
          </div>
        </div>
      </section>
    </main>
  );
}