import type { Metadata } from "next";
import "../cards-propuestas.css";
import ProposalsPreview from "@/components/palm-cards/proposals/ProposalsPreview.jsx";

export const metadata: Metadata = {
  title: "Cards propuestas",
  description: "Preview interno: propuestas de animación alternativas para las cards.",
  robots: { index: false, follow: false }, // internal / eval page — keep out of search
};

export default function CardsPropuestasPage() {
  return <ProposalsPreview />;
}
