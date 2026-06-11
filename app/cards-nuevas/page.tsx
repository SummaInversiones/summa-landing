import type { Metadata } from "next";
import "../cards-nuevas.css";
import CardsPreview from "@/components/palm-cards/CardsPreview.jsx";

export const metadata: Metadata = {
  title: "Cards nuevas",
  description: "Preview interno de las cards nuevas del diseñador.",
  robots: { index: false, follow: false }, // internal / eval page — keep out of search
};

export default function CardsNuevasPage() {
  return <CardsPreview />;
}
