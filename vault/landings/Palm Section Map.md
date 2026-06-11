---
tags:
  - landing
  - palm
  - sections
---
# Palm — Section Map

Vertical order of the Palm landing as shipped by the **Next.js app at repo root** (`app/page.tsx`). Rewritten 2026-06-11; the old map of the vanilla `index.html` (now `legacy/`) survives in git history of this note.

## 0. StructuredData
`components/StructuredData.tsx` — `FinancialService` + `WebSite` JSON-LD. `FAQPage` schema lives only on `/preguntas-frecuentes` (see [[../concepts/SEO]]).

## 1. Navbar — floating pill
`components/Navbar.tsx`. N5 floating pill, burger sheet-menu (no inline desktop links). Menu anchors are **root-relative** (`/#explore-wip`, `/#calculadora`, `/#pilares`) so they work from any page. CTA "Bajate la app" → `/#download`, which since 2026-06-11 anchors the **footer card** (the CtaFinal section was deleted — see [[../history/Decisions]]).

## 2. Hero — asymmetric
`components/Hero.tsx` + `components/HeroShader.tsx`. 2-col copy-left / phone-right. h1: "Todo argentino bien asesorado puede pasar de ahorrista a `inversor`." Three.js RGB-line shader over `--brand-gradient` with navy scrim; pauses offscreen.

## 3. Marquee ticker
`components/Marquee.tsx`. Thin CSS-keyframe band (regulación / partner / hecho en Argentina). Keeps its middle dots (functional separators — see [[../concepts/Anti-patterns]]).

## 4. Problem
`components/Problem.tsx`. h2: "No es lo mismo invertir `sin rumbo`, que invertir `con un plan`." Flex-centered content, `min-height: 60vh`. Since 2026-06-11 it uses the uniform `.section` padding (no bottom crop).

## 5. Explore — 4 producto cards (`#explore-wip`)
`components/Explore.tsx` → `components/palm-cards/CardsGrid.jsx`. h2: "Las herramientas que te `acompañan`."
Cards (designer v2 export, in order): **gastos** (Conocé tus gastos), **cc** (Cuentas claras), **goals** (Que tu dinero trabaje), **portfolio** (Tu portfolio hecho a medida). One aligned 4-up row >1080px inside a **1400px container**; 2-col tablet; ≤768px sticky-stack via `useScrollStack`. Flat card bg (gradient border removed).

## 6. Calculator — standalone (`#calculadora`)
`components/Calculator.tsx`. h2: "Hacé el `cálculo`." Bars variant promoted from the `/calculadora` gallery (2026-06-08). Math is **native** `lib/annuity.ts` (`yearsToTarget`, vitest-covered) — the mathjs CDN approach died with the vanilla landing. Assumptions (0% solo / 15% Palm) disclosed in the disclaimer.

## 7. Comparativa — 4 confianza cards (`#seguridad`)
`components/Comparativa.tsx` → `components/palm-cards/BentoCards.jsx`. h2: "¿Por qué `Palm`?"
Same structure as Explore (same `pv-explore__grid`, same 1400px container). Cards in order: **mass** (Para ellos, sos uno más), **privacy** (Si es gratis, alguien lo paga), **drain** (Las comisiones ocultas que te drenan), **zero** (Las comisiones escondidas acá no existen). Replaced the old bento tiles (hero +$4,2M chart, donut 73%, split de carteras, legacy `.pcard--zero`) on 2026-06-11.

## 8. Pillars (`#pilares`)
`components/Pillars.tsx`. Eyebrow "Dos herramientas. Un solo lugar." + h2 "Elegí por dónde `empezar`." Two typography-only cards (Gratuita / Asesor $14.999 ARS/mes), brand-gradient top borders, shiny CTA.

## 9. Footer (`#download` lives here)
`components/Footer.tsx` + `components/FooterNewsletter.tsx`. Card-in-background: logo aside + **waitlist form** (`.fnl__*`, Upstash — the only signup on the page) + 4-col nav matrix + legal line. The footer card carries `id="download"` for the navbar/burger CTAs.

## 10. Overlays / enhancements
- `app/_client/ClientEnhancements.tsx` — `.reveal` IO, `[data-split-words]`, `[data-count]`, `[data-tilt]`.
- `components/CardAnimations.tsx` — Motion port from the vanilla landing; animates pillars + hero hand. Its `.pcard` branch matches nothing since 2026-06-11 (kept harmless).
- GradualBlur — fixed viewport-bottom blur stack (kept deliberately; honors `prefers-reduced-transparency`).

## Other routes
- `/preguntas-frecuentes` — FAQ accordion + FAQPage JSON-LD (`lib/faq.ts` is the single source).
- `/cards-nuevas` — internal noindex preview of both card groups (renders the same `CardsGrid` + `BentoCards` as home).
- `/animaciones` — internal noindex GSAP scroll-treatment gallery (predates the v2 cards).

## See also
- [[Palm — Vanilla HTML]] — the retired static landing (now `legacy/`)
- [[../concepts/Anti-patterns]] — what was deliberately removed
- [[../concepts/Motion System]] — how the animations work
- [[../history/Decisions]]
