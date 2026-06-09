import type { Metadata } from "next";
import Coverflow from "@/components/Gallery/Coverflow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import "../gallery.css";

export const metadata: Metadata = {
  title: "Galería — Palm Inversiones",
  description: "Conocé Palm: de tu resumen bancario a un portafolio armado para vos.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="gallery-section">
        <div className="container">
          <p className="calc-section__eyebrow reveal">Conocé Palm</p>
          <h1 className="calc-section__title" data-split-words>
            Todo tu dinero, <span className="kw">en una sola app</span>.
          </h1>
        </div>
        <Coverflow />
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
