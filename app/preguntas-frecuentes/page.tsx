import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre Palm Inversiones: qué es, cuánto cuesta, regulación (CNV), comisiones, para quién es y cómo empezar a invertir en Argentina.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

// FAQPage structured data lives here — on the page where the FAQ is visible.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://palminversiones.com/preguntas-frecuentes#faq",
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
const json = JSON.stringify(faqJsonLd).replace(/</g, "\\u003c");

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <script type="application/ld+json">{json}</script>
      <Navbar />
      <main className="section faq-page">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 data-split-words>
              Todo lo que querés saber sobre <span className="kw">Palm</span>.
            </h2>
          </div>

          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <details key={item.q} className="faq-item" open={i === 0}>
                <summary className="faq-q">{item.q}</summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
