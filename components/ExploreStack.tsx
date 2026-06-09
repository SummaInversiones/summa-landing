"use client";

// Scroll-driven sticky-stack for the Explore "resumen → plan" cards — the same
// treatment as /animaciones "08 · Apilado", applied to the real home cards.
//
// Progressive enhancement: the cards render as the normal grid (the .estack-cell
// wrappers are display:contents, so they're invisible to layout). On mount this
// adds `.estack-on` to the grid, which flips it into a vertical sticky stack, and
// drives each cell's scale from scroll position so cards pin and pile up, the
// ones beneath shrinking into a deck. Reduced-motion keeps the plain grid.
//
// The scale lives on the .estack-cell wrapper, NOT the .pcard — so the cards'
// own entrance/idle transforms (donut, ball, scanner…) stay untouched.

import { useEffect } from "react";
import { scroll } from "motion";

const NAV_OFFSET = 92; // sticky navbar clearance (px)
const PEEK = 20;       // each card pins this much lower → previous card peeks above

export default function ExploreStack() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grid = document.querySelector<HTMLElement>(".explore__grid");
    if (!grid) return;
    const cells = Array.from(grid.querySelectorAll<HTMLElement>(".estack-cell"));
    if (cells.length < 2) return;

    const total = cells.length;
    cells.forEach((cell, i) => {
      cell.style.top = `${NAV_OFFSET + i * PEEK}px`;
    });
    grid.classList.add("estack-on");

    // scroll() reports 0→1 across the grid (start at top of viewport → bottom at
    // bottom). Each card holds at scale 1 until its slice begins, then shrinks to
    // its target as the next card slides over it — 1:1 with scroll, no autoplay.
    const cancel = scroll(
      (progress: number) => {
        for (let i = 0; i < total; i++) {
          const targetScale = Math.max(0.86, 1 - (total - i - 1) * 0.04);
          const start = i / total;
          const t = Math.min(1, Math.max(0, (progress - start) / (1 - start || 1)));
          cells[i].style.transform = `scale(${(1 + (targetScale - 1) * t).toFixed(4)})`;
        }
      },
      { target: grid, offset: ["start start", "end end"] }
    );

    return () => {
      cancel?.();
      grid.classList.remove("estack-on");
      cells.forEach((cell) => {
        cell.style.transform = "";
        cell.style.top = "";
      });
    };
  }, []);

  return null;
}
