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
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es Palm Inversiones?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Palm es una fintech argentina que te ayuda a pasar de ahorrista a inversor. A partir de tu resumen bancario organiza tus gastos, identifica oportunidades de ahorro y te arma un portafolio personalizado según tus objetivos y tu perfil de riesgo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Palm cobra comisiones ocultas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. En Palm no hay comisión de mantenimiento, costo de custodia ni cargos ocultos. Sin letra chica, sin sorpresas.",
          },
        },
        {
          "@type": "Question",
          name: "¿Palm Inversiones está regulado?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Palm opera regulado por la CNV (Comisión Nacional de Valores) y a través de su broker partner, Alfy Inversiones.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta Palm?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Palm tiene un plan gratuito de gestión financiera inteligente y un plan pago de asesoramiento personalizado de inversiones de $14.999 ARS por mes, con acceso por invitación.",
          },
        },
        {
          "@type": "Question",
          name: "¿Para quién es Palm?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Para ahorristas argentinos que quieren empezar a invertir sin ser expertos. Palm te guía paso a paso, sin tecnicismos y sin montos mínimos.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué se diferencia Palm de otras apps de inversión?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Palm te arma una cartera personalizada según tus objetivos, no la misma para todos. No vende tus datos, no tiene comisiones ocultas y está regulado por la CNV.",
          },
        },
      ],
    },
  ],
};

// Escape "<" so the serialized JSON can never break out of the <script> tag.
const json = JSON.stringify(graph).replace(/</g, "\\u003c");

export default function StructuredData() {
  return <script type="application/ld+json">{json}</script>;
}
