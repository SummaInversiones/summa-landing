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
          <h1 className="faq-page__title">Preguntas frecuentes</h1>

          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary className="faq-q">
                  <span>{item.q}</span>
                </summary>
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
