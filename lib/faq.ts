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
    q: "¿Qué pasa con mi plata si Palm cierra?",
    a: "Tu plata no queda en Palm. Las inversiones se compran y se mantienen a través de Alfy Inversiones, el broker partner regulado por la CNV, en una cuenta a tu nombre. Si Palm dejara de operar, tus instrumentos siguen siendo tuyos en el broker: podés mantenerlos, venderlos o transferirlos.",
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
    q: "¿Qué gano usando Palm en vez de abrir una cuenta en un broker yo solo?",
    a: "Un broker te da el lugar para operar; Palm te dice por dónde empezar y por qué. Abrir la cuenta es la parte fácil — lo difícil es decidir en qué invertir. Palm toma esa decisión con vos: analiza tu situación a partir de tu resumen bancario, te arma un portafolio según tus objetivos y tu perfil de riesgo, y lo sigue y rebalancea con el tiempo. Como además opera a través de un broker regulado, no resignás nada de lo que un broker te da.",
  },
  {
    q: "¿Las recomendaciones de Palm son confiables o son respuestas de un chatbot?",
    a: "Palm no es un chatbot genérico. Sus recomendaciones se construyen con una arquitectura de inteligencia artificial de última generación que razona sobre tus datos financieros reales y sobre el mercado, no sobre suposiciones. A diferencia de un modelo de lenguaje que puede 'alucinar' una respuesta, Palm parte de tu situación concreta y opera dentro de un marco regulado por la CNV: el resultado es un plan fundamentado y trazable, no una respuesta inventada.",
  },
  {
    q: "¿Cómo empiezo a usar Palm?",
    a: "Palm está por lanzarse. Anotate en la lista de espera en palminversiones.com y te avisamos apenas abramos. Cuando la app esté disponible en la App Store y Google Play, la bajás, conectás tu resumen bancario y Palm te muestra tus cuentas claras y los primeros pasos para invertir.",
  },
];
