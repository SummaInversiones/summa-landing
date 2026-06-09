export interface GalleryCardData {
  id: string;
  eyebrow: string;
  /** Headline with the keyword marked by ‹kw›…‹/kw› (rendered as .kw). */
  headline: string;
  body: string;
  image: string;
  alt: string;
}

export const GALLERY_CARDS: GalleryCardData[] = [
  {
    id: "extracto",
    eyebrow: "Paso 01",
    headline: "Tu ‹kw›resumen bancario‹/kw›. El punto de partida.",
    body: "Subís tu extracto y Palm entiende de dónde venís, sin cargar nada a mano.",
    image: "/mockups/screen-extracto.png",
    alt: "Pantalla de Palm con el resumen bancario importado",
  },
  {
    id: "gastos",
    eyebrow: "Paso 02",
    headline: "‹kw›Cuentas claras‹/kw›, problemas claros.",
    body: "Tus gastos ordenados solos, para ver en qué se te va la plata.",
    image: "/mockups/screen-gastos.png",
    alt: "Pantalla de Palm con los gastos categorizados",
  },
  {
    id: "objetivos",
    eyebrow: "Paso 03",
    headline: "Tus ‹kw›objetivos‹/kw›, a tu alcance.",
    body: "Definís una meta y Palm te muestra el camino para llegar.",
    image: "/mockups/screen-objetivo.png",
    alt: "Pantalla de Palm con un objetivo financiero",
  },
  {
    id: "portafolio",
    eyebrow: "Paso 04",
    headline: "Tu ‹kw›portafolio‹/kw›, armado para vos.",
    body: "Una cartera pensada para tu perfil, no para el promedio.",
    image: "/mockups/screen-portfolio.png",
    alt: "Pantalla de Palm con el portafolio de inversión",
  },
  {
    id: "asesoramiento",
    eyebrow: "Palm",
    headline: "Asesoramiento ‹kw›personalizado‹/kw›.",
    body: "Un asesor financiero que te acompaña, en la palma de tu mano.",
    image: "/mockups/screen-proyeccion.png",
    alt: "Pantalla de Palm con la proyección de inversión",
  },
];
