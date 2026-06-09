"use client";

// Sticky stacking-cards scroll effect, adapted from utils/skiper16.tsx
// (Skiper UI — StickyCard_001). Reworked for Palm content cards instead of
// images, using this repo's `motion` package (motion/react) and native scroll
// (no Lenis dependency). As you scroll, each card pins to the top and the ones
// beneath it shrink, building a deck that tells a step-by-step story.

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Card = { chip: string; h: string; p: string };

const CARDS: Card[] = [
  { chip: "01", h: "Tu resumen", p: "Subís el resumen del banco tal cual te llega. Nada que cargar a mano." },
  { chip: "02", h: "Gastos claros", p: "Lo ordenamos por categoría, sin que muevas un dedo." },
  { chip: "03", h: "Tus objetivos", p: "Definís a dónde querés llegar y en cuánto tiempo." },
  { chip: "04", h: "Tu plan", p: "Armamos un plan concreto para cada meta tuya." },
  { chip: "05", h: "Tu cartera", p: "Una cartera a tu medida, lista para empezar a invertir." },
];

function StickyCard({
  i,
  total,
  card,
  progress,
}: {
  i: number;
  total: number;
  card: Card;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Cards deeper in the stack (lower i) end up smaller; the front card (last)
  // stays full size — that difference is what reads as depth.
  const targetScale = Math.max(0.86, 1 - (total - i - 1) * 0.04);
  // Each card holds at scale 1 until its slice of the scroll range begins,
  // then shrinks to its target as the next card slides over it.
  const range: [number, number] = [i / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="ssc-wrap">
      <motion.article
        className="ssc-card"
        style={{ scale, top: `${i * 26}px` }}
      >
        <span className="ssc-card__chip">{card.chip}</span>
        <h3>{card.h}</h3>
        <p>{card.p}</p>
      </motion.article>
    </div>
  );
}

export default function StickyStackCards() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div className="ssc" ref={container}>
      {CARDS.map((card, i) => (
        <StickyCard
          key={card.chip}
          i={i}
          total={CARDS.length}
          card={card}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}
