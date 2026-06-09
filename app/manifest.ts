import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Palm Inversiones",
    short_name: "Palm",
    description:
      "Tu asesor financiero personal. De ahorrista a inversor, sin letra chica.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A1428",
    theme_color: "#101B3B",
    lang: "es-AR",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
    ],
  };
}
