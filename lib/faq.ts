// Single source of truth for the FAQ — rendered visibly on
// /preguntas-frecuentes AND emitted as FAQPage JSON-LD on that page, so the
// structured data always matches what users see (a Google requirement).
export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Qué es Palm Inversiones?",
    a: "Palm es una fintech argentina que te ayuda a pasar de ahorrista a inversor. A partir de tu resumen bancario organiza tus gastos, identifica oportunidades de ahorro y te arma un portafolio personalizado según tus objetivos y tu perfil de riesgo.",
  },
  {
    q: "¿Palm cobra comisiones ocultas?",
    a: "No. En Palm no hay comisión de mantenimiento, costo de custodia ni cargos ocultos. Sin letra chica, sin sorpresas.",
  },
  {
    q: "¿Palm Inversiones está regulado?",
    a: "Sí. Palm opera regulado por la CNV (Comisión Nacional de Valores) y a través de su broker partner, Alfy Inversiones.",
  },
  {
    q: "¿Cuánto cuesta Palm?",
    a: "Palm tiene un plan gratuito de gestión financiera inteligente y un plan pago de asesoramiento personalizado de inversiones de $14.999 ARS por mes, con acceso por invitación.",
  },
  {
    q: "¿Para quién es Palm?",
    a: "Para ahorristas argentinos que quieren empezar a invertir sin ser expertos. Palm te guía paso a paso, sin tecnicismos y sin montos mínimos.",
  },
  {
    q: "¿En qué se diferencia Palm de otras apps de inversión?",
    a: "Palm te arma una cartera personalizada según tus objetivos, no la misma para todos. No vende tus datos, no tiene comisiones ocultas y está regulado por la CNV.",
  },
  {
    q: "¿Cómo empiezo a usar Palm?",
    a: "Bajate la app desde la App Store o Google Play, conectá tu resumen bancario y Palm te muestra tus cuentas claras y los primeros pasos para invertir.",
  },
];
