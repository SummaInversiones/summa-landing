"use client";

// Scroll-driven deck for the Explore "resumen → plan" cards. Two behaviours,
// picked by screen width via gsap.matchMedia (swaps cleanly on resize):
//
//   • Compact (≤1080px / phone, small screens): a VERTICAL sticky-stack — cards
//     pin and pile downward, the ones beneath shrinking. Scale is driven 1:1 off
//     scroll with motion's imperative scroll().
//
//   • Wide (≥1081px / laptop): a HORIZONTAL fan-out — the cards start stacked on
//     top of the first and, as you scroll, slide out sideways into their row
//     (scrubbed with GSAP ScrollTrigger). Uses the horizontal space instead of
//     turning the section into several tall screens.
//
// Progressive enhancement: the .estack-cell wrappers are display:contents by
// default, so with no JS the cards render as the normal grid. The transforms
// live on the cell wrapper, never on .pcard, so each card's own entrance/idle
// animations (donut, ball, scanner…) stay untouched. Reduced-motion: plain grid.

import { useEffect } from "react";
import { scroll } from "motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAV_OFFSET = 92; // sticky navbar clearance (px) for the vertical pin
const PEEK = 20;       // each card pins this much lower → previous card peeks above
const VERTICAL = "(max-width: 1080px)";
const HORIZONTAL = "(min-width: 1081px)";

export default function ExploreStack() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grid = document.querySelector<HTMLElement>(".explore__grid");
    if (!grid) return;
    const cells = Array.from(grid.querySelectorAll<HTMLElement>(".estack-cell"));
    if (cells.length < 2) return;
    const total = cells.length;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // ── Compact: vertical sticky-stack (deck piles downward) ──────────────────
    mm.add(VERTICAL, () => {
      cells.forEach((cell, i) => {
        cell.style.top = `${NAV_OFFSET + i * PEEK}px`;
      });
      grid.classList.add("estack-on");

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
    });

    // ── Wide: horizontal fan-out (deck opens to the side) ─────────────────────
    mm.add(HORIZONTAL, () => {
      grid.classList.add("estack-h");
      const c0 = cells[0];
      const others = cells.slice(1);

      // Card 0 sits on top; each deeper card has a lower z-index so it stays
      // hidden BEHIND the stack until it emerges to the right — that occlusion
      // is what keeps cards solid (no see-through) while they slide across.
      cells.forEach((cell, i) =>
        gsap.set(cell, { zIndex: total - i, transformOrigin: "center center" })
      );

      // Stack the rest behind the first (offsetLeft is layout position, immune to
      // transforms), with a slight rightward peek + scale so it reads as a deck.
      const place = () =>
        others.forEach((cell, k) => {
          const i = k + 1;
          gsap.set(cell, {
            x: c0.offsetLeft - cell.offsetLeft + i * 14,
            scale: 1 - i * 0.03,
          });
        });
      place();

      // Scrub the deck open: cards slide out to their row slots, left to right.
      const tween = gsap.to(others, {
        x: 0,
        scale: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          onRefreshInit: place, // recompute the stacked offset on resize
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        grid.classList.remove("estack-h");
        gsap.set(cells, { clearProps: "all" });
      };
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return null;
}
