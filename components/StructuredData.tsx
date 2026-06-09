// JSON-LD structured data. Helps Google and AI assistants (ChatGPT, Claude,
// Perplexity, Gemini) understand what Palm is, who it's for, and how it differs
// — every claim here is also stated on the page itself.
const SITE_URL = "https://palminversiones.com";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FinancialService",
      "@id": `${SITE_URL}/#organization`,
      name: "Palm Inversiones",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      image: `${SITE_URL}/icon.png`,
      slogan: "Tu asesor financiero personal. Sin letra chica, sin sorpresas.",
      description:
        "Fintech argentina que ayuda a ahorristas a convertirse en inversores: organiza tus gastos, arma un portafolio personalizado según tus objetivos y perfil de riesgo, y te acompaña para invertir. Sin comisiones ocultas. Regulado por la CNV, con Alfy Inversiones como broker partner.",
      areaServed: { "@type": "Country", name: "Argentina" },
      address: { "@type": "PostalAddress", addressCountry: "AR" },
      knowsAbout: [
        "inversiones",
        "ETFs",
        "gestión financiera personal",
        "ahorro",
        "portafolio de inversión",
        "asesoramiento financiero",
      ],
      sameAs: ["https://www.instagram.com/palm.inversiones"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Palm Inversiones",
      inLanguage: "es-AR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

// Escape "<" so the serialized JSON can never break out of the <script> tag.
const json = JSON.stringify(graph).replace(/</g, "\\u003c");

export default function StructuredData() {
  return <script type="application/ld+json">{json}</script>;
}
