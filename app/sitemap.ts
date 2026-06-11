import type { MetadataRoute } from "next";

const SITE_URL = "https://palminversiones.com";

// Fechas reales de último cambio de contenido por página — actualizar a mano
// cuando una página cambie. (Antes era `new Date()`: cada deploy marcaba todo
// como recién modificado y le enseñaba a los crawlers que el campo era ruido.)
const LAST_MODIFIED = {
  home: new Date("2026-06-11"),
  faq: new Date("2026-06-11"),
  terminos: new Date("2026-06-11"),
  privacidad: new Date("2026-06-11"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/preguntas-frecuentes`,
      lastModified: LAST_MODIFIED.faq,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: LAST_MODIFIED.terminos,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: LAST_MODIFIED.privacidad,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
