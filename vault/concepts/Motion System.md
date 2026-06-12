---
tags:
  - concepts
  - motion
  - palm
---
# Motion System — Palm

How animation works in the **Next.js app** (rewritten 2026-06-11; the CDN/vanilla description of the old `index.html` survives in git history of this note). Everything is npm-bundled: `motion` (framer-motion v12 API via `motion/react`), `gsap`, `three`.

## palm-cards — the designer's card system (`components/palm-cards/`)
The dominant motion surface since 2026-06-11. Pattern per card:

- **`PCard.jsx` shell**: entrance fade+lift on `useInView` (once, `-80px` margin), stagger `index * 0.1s`, then idle blob drift (only on navy-bg cards). Calls `onReveal()` when the entrance lands.
- **Each card** (`CardGastos`, `CardCC`, `CardGoals`, `CardPortfolio`, `CardMass`, `CardPrivacy`, `CardDrain`, `CardZero`): `onReveal` starts an **imperative async/await phase loop** — `animate()` from `motion/react`, `await anim.finished`, `while (!cancelled)`, explicit cleanup stopping every tracked animation. No `<motion.*>` props.
- **Reduce-motion contract**: `useReducedMotion()` → entrance skipped, loops never start, the DOM defaults to the final visible state.
- **Raster rule** (CardMass lesson): never scale a small element UP with `transform` for a persistent visual — the browser rasterizes it at layout size and it blurs. Render at the largest size it will reach and scale DOWN (palm circle: 72px base, `pScale()`; box-shadows multiplied accordingly).
- Classes are `pv-`-prefixed; CSS is imported per component file.

### Propuestas alternativas (`components/palm-cards/proposals/`, 2026-06-11)
8 animaciones alternativas para los mismos títulos — una metáfora causa→efecto por card, mismo sistema (PCard shell, `pv-p*-` classes, loops `animate()`, contrato reduce-motion), iteradas con el founder en la página interna **`/cards-propuestas`** (noindex). **5 fueron promovidas a producción** (ver [[../history/Decisions]]): CC + las 4 de confianza reemplazaron el contenido de sus archivos en `palm-cards/`. En `proposals/` quedan las pendientes (GastosV2 caos→orden, GoalsV2 objetivo que se llena, PortfolioV2 sliders→mezcla, ToallaV2 extra). Para promover otra: mover el componente al nivel de `palm-cards/` y cablearla en `CardsGrid`.
**Lección SVG (fix de los cables, 2026-06-11):** motion anima `opacity` de elementos SVG escribiendo el **atributo**, y cualquier `opacity` del stylesheet le gana al atributo — la animación corre invisible. Para paths SVG cuya opacidad vive en CSS, animar SIEMPRE vía driver que escriba `el.style.opacity` (ver `fadeLine` en CardPrivacy).

## useScrollStack — mobile sticky-stack (`components/palm-cards/useScrollStack.js`)
≤768px only, not under reduce-motion. CSS `position: sticky` pins each card; JS writes standalone `style.scale` per frame (depth-based) so the deck compresses as it stacks. Gated by a `pv-scroll-stack-on` body class. Used by both `CardsGrid` (Explore) and `BentoCards` (Comparativa).

## CardAnimations (`components/CardAnimations.tsx`)
Faithful port of the vanilla landing's Motion script. Still alive for: **pillar phone wraps** (entrance + idle + cursor tilt) and **hero hand** float. Its `.pcard` per-card branch matches nothing since the legacy cards were deleted — kept harmless (selectors hit empty NodeLists), same policy as the original.

## ClientEnhancements (`app/_client/ClientEnhancements.tsx`)
Vanilla IO ports: `.reveal` (+ `data-delay`), `[data-split-words]` word-by-word heading entrance (`.split-ready` gate prevents FOUC), `[data-count]` count-ups, `[data-tilt]`. All selector-driven — removing markup never breaks them.

## Three.js — hero shader (`components/HeroShader.tsx`)
RGB-line fragment shader over `--brand-gradient`, navy scrim. Pauses offscreen via IO; honors reduce-motion; falls back to the gradient. Kept deliberately (see [[Anti-patterns]] "controversial decisions kept").

## GSAP
Only on the internal `/animaciones` gallery (`ScrollAnimGallery` + `StickyStackCards`, ScrollTrigger scrubs). The home's GSAP fan-out deck (`ExploreStack`) was retired 2026-06-11 with the card swap.

## Pure CSS
- Marquee ticker — keyframe loop, content ×3.
- GradualBlur — 5 stacked `backdrop-filter` layers with gradient masks, fixed at viewport bottom; honors `prefers-reduced-transparency`.

## Calculator math (not motion, but lives here historically)
Native `lib/annuity.ts` (`Math.log` annuity), vitest-covered. The mathjs CDN lazy-load belonged to the vanilla landing only.

## See also
- [[../landings/Palm Section Map]]
- [[../history/Decisions]]
