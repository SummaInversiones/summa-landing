import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import {
  CalcClassic,
  CalcHero,
  CalcBars,
  CalcPills,
} from "@/components/CalcGallery/CalcVariants";

export const metadata: Metadata = {
  title: "Calculadora — variaciones · Palm Inversiones",
  description: "Cuatro tratamientos de diseño de la calculadora de Palm.",
};

export default function CalcGalleryPage() {
  return (
    <>
      <Navbar />
      <main className="calcgal section">
        <div className="container">
          <p className="calc-section__eyebrow reveal">Variaciones</p>
          <h1 className="calc-section__title" data-split-words>
            Elegí el estilo de la <span className="kw">calculadora</span>.
          </h1>
          <p className="calcgal__lede reveal" data-delay="150">
            Cuatro tratamientos, la misma cuenta. Probá cada uno y decime cuál te gusta.
          </p>

          <div className="calcgal__grid">
            <CalcClassic />
            <CalcHero />
            <CalcBars />
            <CalcPills />
          </div>
        </div>
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
