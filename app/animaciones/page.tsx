import type { Metadata } from "next";
import "../animaciones.css";
import ScrollAnimGallery from "@/components/ScrollAnimGallery";

export const metadata: Metadata = {
  title: "Animaciones de scroll",
  description: "Galería interna de animaciones de scroll para las tarjetas.",
  robots: { index: false, follow: false }, // internal / eval page — keep out of search
};

export default function AnimacionesPage() {
  return <ScrollAnimGallery />;
}
