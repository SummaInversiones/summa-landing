# Palm `/gallery` Coverflow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A standalone `/gallery` page showing 5 feature-highlight cards in a draggable coverflow carousel — shadcn `Carousel` (Embla) for mechanics/a11y, GSAP for the coverflow depth, Palm-themed.

**Architecture:** shadcn Carousel owns layout/drag/keyboard/loop and exposes the Embla API; a `'use client'` `Coverflow` component listens to Embla's `scroll`/`select` and applies per-slide `scale`/`opacity`/`rotateY` via GSAP using a pure `slideTransform(distance)` helper; reduced-motion renders a static scroll-snap row. Cards are data-driven.

**Tech Stack:** Next.js 16, React 19, shadcn/ui `Carousel` (+ `embla-carousel-react`), `gsap`, Tailwind v4 (existing Palm tokens).

**Spec:** `docs/specs/2026-06-07-palm-gallery-design.md`
**Work in:** `palm-app/` (branch `feat/prod-cutover`). All paths repo-relative to `/home/tron-mrs/Summa/summa-landing`.

**Vault-locked:** no gradient-text headlines; `.kw` = gold italic Plex keyword; screenshots drop-shadow only (no bezel); no invented icon tiles. Source `vault/concepts/Anti-patterns.md`.

---

## Task 1: Dependencies — gsap + shadcn Carousel

**Files:** `palm-app/package.json`, `palm-app/components/ui/carousel.tsx`

- [ ] **Step 1: Install gsap and add the shadcn Carousel primitive**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app
npm install gsap
npx shadcn@latest add carousel
```
Expected: `gsap` in `dependencies`; `components/ui/carousel.tsx` created; `embla-carousel-react` pulled in.

- [ ] **Step 2: Verify it compiles**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit
```
Expected: clean.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/package.json palm-app/package-lock.json palm-app/components/ui/carousel.tsx
git commit -m "chore(gallery): add gsap + shadcn carousel"
```

---

## Task 2: Coverflow transform helper (pure) — TDD

**Files:** Create `palm-app/components/Gallery/transforms.ts`, `palm-app/components/Gallery/transforms.test.ts`

- [ ] **Step 1: Write the failing test** `palm-app/components/Gallery/transforms.test.ts`
```typescript
import { describe, it, expect } from "vitest";
import { slideTransform } from "./transforms";

describe("slideTransform", () => {
  it("is the identity at the center (distance 0)", () => {
    expect(slideTransform(0)).toEqual({ scale: 1, opacity: 1, rotateY: 0 });
  });

  it("shrinks and dims with distance", () => {
    const near = slideTransform(1);
    expect(near.scale).toBeCloseTo(0.82, 5);
    expect(near.opacity).toBeCloseTo(0.55, 5);
    expect(Math.abs(near.rotateY)).toBeCloseTo(18, 5);
  });

  it("is symmetric in scale/opacity and opposite in rotateY", () => {
    const l = slideTransform(-1);
    const r = slideTransform(1);
    expect(l.scale).toBeCloseTo(r.scale, 5);
    expect(l.opacity).toBeCloseTo(r.opacity, 5);
    expect(l.rotateY).toBeCloseTo(-r.rotateY, 5);
  });

  it("clamps beyond 2 slides away (no runaway shrink)", () => {
    expect(slideTransform(5)).toEqual(slideTransform(2));
  });
});
```

- [ ] **Step 2: Run it, confirm it FAILS**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run components/Gallery/transforms.test.ts
```
Expected: FAIL — cannot resolve `./transforms`.

- [ ] **Step 3: Implement** `palm-app/components/Gallery/transforms.ts`
```typescript
export interface SlideTransform {
  scale: number;
  opacity: number;
  rotateY: number;
}

/**
 * Map a slide's signed distance from the focused slide (in slide units —
 * 0 = centered, ±1 = one slide away) to a coverflow transform.
 * Symmetric falloff, clamped at 2 slides so far cards don't vanish/invert.
 */
export function slideTransform(distance: number): SlideTransform {
  const ad = Math.min(Math.abs(distance), 2);
  const scale = 1 - 0.18 * ad; // 1 → 0.82 (±1) → 0.64 (±2)
  const opacity = 1 - 0.45 * ad; // 1 → 0.55 (±1) → 0.10 (±2)
  const rotateY = -Math.sign(distance) * Math.min(ad, 1) * 18; // 0 → ∓18°
  return { scale, opacity, rotateY };
}
```

- [ ] **Step 4: Run it, confirm it PASSES**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run components/Gallery/transforms.test.ts
```
Expected: PASS (4 cases).

- [ ] **Step 5: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Gallery/transforms.ts palm-app/components/Gallery/transforms.test.ts
git commit -m "feat(gallery): coverflow transform helper with tests"
```

---

## Task 3: Card data

**Files:** Create `palm-app/components/Gallery/galleryData.ts`

- [ ] **Step 1: Create the data module**
```typescript
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
```

- [ ] **Step 2: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Gallery/galleryData.ts
git commit -m "feat(gallery): feature card data"
```

---

## Task 4: GalleryCard component

**Files:** Create `palm-app/components/Gallery/GalleryCard.tsx`

> Design seed: the controller generates a polished feature-card baseline via the 21st-dev magic MCP (`21st_magic_component_builder`, prompt: "fintech feature card, app screenshot on top, eyebrow + headline + one-line body, dark navy surface, gold accent") and hands it to the implementer. Re-theme it to the Palm tokens/classes below — strip any non-brand fonts, colors, or icons. The implementation below is the canonical target if the seed is unusable.

- [ ] **Step 1: Create the component** (renders the `‹kw›` marker as a `.kw` span)
```tsx
import type { GalleryCardData } from "./galleryData";

function renderHeadline(headline: string) {
  // Split on the ‹kw›…‹/kw› marker; wrap the keyword in <span class="kw">.
  const parts = headline.split(/‹kw›(.*?)‹\/kw›/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="kw">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function GalleryCard({ card }: { card: GalleryCardData }) {
  return (
    <article className="gallery-card">
      <div className="gallery-card__visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.alt} loading="lazy" />
      </div>
      <div className="gallery-card__body">
        <p className="gallery-card__eyebrow">{card.eyebrow}</p>
        <h3 className="gallery-card__headline">{renderHeadline(card.headline)}</h3>
        <p className="gallery-card__copy">{card.body}</p>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Typecheck**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit
```
Expected: clean.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Gallery/GalleryCard.tsx
git commit -m "feat(gallery): GalleryCard component"
```

---

## Task 5: Coverflow component (shadcn Carousel + GSAP)

**Files:** Create `palm-app/components/Gallery/Coverflow.tsx`

- [ ] **Step 1: Create the client component**
```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { GALLERY_CARDS } from "./galleryData";
import GalleryCard from "./GalleryCard";
import { slideTransform } from "./transforms";

export default function Coverflow() {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Apply coverflow transforms based on each slide's distance from scroll center.
  const applyTransforms = useCallback(
    (embla: NonNullable<CarouselApi>) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // static fallback: CSS handles layout, no transforms
      const snaps = embla.scrollSnapList();
      const progress = embla.scrollProgress();
      const engine = embla.internalEngine();
      const step = snaps.length > 1 ? Math.abs(snaps[1] - snaps[0]) : 1;

      snaps.forEach((snap, index) => {
        let diff = snap - progress;
        // Loop-aware wrap (Embla docs pattern) so edge cards transform correctly.
        engine.slideLooper.loopPoints.forEach((lp) => {
          const target = lp.target();
          if (index === lp.index && target !== 0) {
            if (Math.sign(target) === -1) diff = snap - (1 + progress);
            if (Math.sign(target) === 1) diff = snap + (1 - progress);
          }
        });
        const distance = step ? diff / step : diff; // in slide units
        const t = slideTransform(distance);
        const node = slideRefs.current[index];
        if (node) {
          gsap.set(node, {
            scale: t.scale,
            opacity: t.opacity,
            rotateY: t.rotateY,
            transformPerspective: 1000,
          });
        }
      });
    },
    [],
  );

  useEffect(() => {
    if (!api) return;
    const onScroll = () => applyTransforms(api);
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onScroll();
    onSelect();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    api.on("select", onSelect);
    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
      api.off("select", onSelect);
      gsap.set(slideRefs.current.filter(Boolean), { clearProps: "all" });
    };
  }, [api, applyTransforms]);

  return (
    <div className="coverflow">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="coverflow__carousel"
      >
        <CarouselContent className="coverflow__content">
          {GALLERY_CARDS.map((card, i) => (
            <CarouselItem key={card.id} className="coverflow__item">
              <div
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className="coverflow__slide"
              >
                <GalleryCard card={card} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="coverflow__arrow" aria-label="Anterior" />
        <CarouselNext className="coverflow__arrow" aria-label="Siguiente" />
      </Carousel>

      <div className="coverflow__dots" role="tablist" aria-label="Ir a la tarjeta">
        {GALLERY_CARDS.map((card, i) => (
          <button
            key={card.id}
            type="button"
            className="coverflow__dot"
            aria-label={`Tarjeta ${i + 1}`}
            aria-current={selected === i}
            data-active={selected === i}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + build** (catches the Embla API surface)
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit && npm run build
```
Expected: both pass. If `internalEngine`/`slideLooper` typings complain, narrow with a local type or `// @ts-expect-error` on that one line (documented Embla internal).

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Gallery/Coverflow.tsx
git commit -m "feat(gallery): coverflow carousel (shadcn Embla + GSAP)"
```

---

## Task 6: Palm styling

**Files:** Create `palm-app/app/gallery.css`

- [ ] **Step 1: Create `palm-app/app/gallery.css`** using the existing Palm tokens (defined in `globals.css`). Required rules:
```css
.gallery-section { background: var(--navy); padding: var(--pad-y) 0; overflow: hidden; }
.gallery-section .container { max-width: var(--container); margin: 0 auto; padding: 0 var(--pad-x); }

.coverflow { position: relative; }
.coverflow__content { padding: 48px 0; }
/* Card width: ~one focused card + peeks of neighbors */
.coverflow__item { flex: 0 0 78%; max-width: 420px; }
@media (min-width: 768px) { .coverflow__item { flex: 0 0 42%; } }
@media (min-width: 1120px) { .coverflow__item { flex: 0 0 30%; } }
.coverflow__slide { will-change: transform, opacity; }

.gallery-card {
  background: var(--card);
  border-radius: 16px;
  border-top: 3px solid transparent;
  background-image: linear-gradient(var(--card), var(--card)), var(--brand-gradient);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  overflow: hidden;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.55);
}
.gallery-card__visual { padding: 20px 20px 0; }
.gallery-card__visual img { width: 100%; height: auto; display: block; filter: drop-shadow(0 12px 28px rgba(0,0,0,.45)); }
.gallery-card__body { padding: 20px 24px 28px; }
.gallery-card__eyebrow { font-family: var(--font-num); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin: 0 0 8px; }
.gallery-card__headline { font-family: var(--font-display); font-weight: 500; font-size: 22px; line-height: 1.15; color: var(--cream); margin: 0 0 10px; }
.gallery-card__copy { font-family: var(--font-num); font-size: 15px; line-height: 1.5; color: rgba(var(--cream-rgb), .62); margin: 0; }

.coverflow__arrow { color: var(--cream); }
.coverflow__dots { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
.coverflow__dot { width: 8px; height: 8px; border-radius: 999px; border: 0; background: rgba(var(--cream-rgb), .25); cursor: pointer; transition: transform .2s, background .2s; padding: 0; }
.coverflow__dot[data-active="true"] { background: var(--gold); transform: scale(1.4); }
/* ≥44px hit area without changing the visual dot size */
.coverflow__dot::before { content: ""; position: absolute; inset: -18px; }
.coverflow__dot { position: relative; }

@media (prefers-reduced-motion: reduce) {
  .coverflow__slide { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 2: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/gallery.css
git commit -m "feat(gallery): Palm-themed coverflow styles"
```

---

## Task 7: The `/gallery` route

**Files:** Create `palm-app/app/gallery/page.tsx`

- [ ] **Step 1: Create the route** (server component shell; imports the client Coverflow + the css; reuses `ClientEnhancements` for the head reveal/split-words)
```tsx
import type { Metadata } from "next";
import Coverflow from "@/components/Gallery/Coverflow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";
import "../gallery.css";

export const metadata: Metadata = {
  title: "Galería — Palm Inversiones",
  description: "Conocé Palm: de tu resumen bancario a un portafolio armado para vos.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="gallery-section">
        <div className="container">
          <p className="calc-section__eyebrow reveal">Conocé Palm</p>
          <h1 className="calc-section__title" data-split-words>
            Todo tu dinero, <span className="kw">en una sola app</span>.
          </h1>
        </div>
        <Coverflow />
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
```
(Reuses the `calc-section__eyebrow`/`__title` classes from `sections.css` for the head so typography matches the landing. Adjust class names if a cleaner fit exists.)

- [ ] **Step 2: Build + confirm the route**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build
```
Expected: build lists `/gallery` as a route.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/gallery/page.tsx
git commit -m "feat(gallery): /gallery route"
```

---

## Task 8: Nav link

**Files:** Modify `palm-app/components/Navbar.tsx`

- [ ] **Step 1: Add a "Galería" link** in the `SheetContent`, next to the existing `menu-link`s (use `next/link` for the route; close the sheet on click). Add the import `import Link from "next/link";` and insert before the "Bajate la app" link:
```tsx
<Link href="/gallery" className="menu-link" onClick={() => setOpen(false)}>Galería</Link>
```

- [ ] **Step 2: Build**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build
```
Expected: passes.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Navbar.tsx
git commit -m "feat(gallery): nav link to /gallery"
```

---

## Task 9: Verify + preview

- [ ] **Step 1: Full verification**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm test && npm run build && npx opennextjs-cloudflare build
```
Expected: tests green (incl. `transforms.test.ts`); both builds succeed; `/gallery` present.

- [ ] **Step 2: Local manual a11y/visual check** — `npm run dev`, open `/gallery`:
  - drag/swipe moves slides; center card focused, neighbors scaled/dimmed/rotated;
  - `‹ ›` arrows + dots work; keyboard ←/→ work; visible focus rings; arrows ≥44px;
  - `prefers-reduced-motion` (devtools) → static row, no transforms;
  - Palm look: navy, gold `.kw`, brand-gradient card border, drop-shadow screenshots.

- [ ] **Step 3: `[USER]` Preview on the canary** (optional)
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run deploy
```
Then open `https://new.palminversiones.com/gallery`.

---

## Definition of done
- `/gallery` renders the 5 feature cards in a working coverflow (drag/keyboard/arrows/dots); GSAP depth on center/neighbors; reduced-motion static fallback.
- `transforms.test.ts` + the suite green; `npm run build` + OpenNext build pass.
- Palm-styled (tokens, `.kw`, brand-gradient border, drop-shadow); no anti-patterns; nav links to it.
- Work committed on `feat/prod-cutover`.

## Out of scope
- Changing the landing's existing sections.
- Consolidating `motion` → `gsap` app-wide.
- Cutover Phases 2–3.
