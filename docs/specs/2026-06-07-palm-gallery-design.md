# Palm — feature gallery (`/gallery`) design

**Date:** 2026-06-07
**Status:** Approved (design)
**Branch:** `feat/prod-cutover` (app lives in `palm-app/`; moves to root with the cutover's Phase 2).

## Context

Enrich-phase work on the Next.js Palm landing. The user wants a **standalone
`/gallery` page** presenting **feature-highlight cards** in a **draggable
coverflow carousel** — modern, in the Palm visual language, built with shadcn/ui,
GSAP, and a 21st-dev (magic MCP) generated starting point, validated against the
ui-ux-pro-max UX/accessibility checklist.

### Vault-locked constraints (still apply)
Palette + 2-font rule; navy-only theme; `.kw` = IBM Plex italic gold keyword; **no
gradient-text headlines**; **no invented icon tiles** (use the real app screenshots
as visuals); **screenshots are drop-shadow only, no CSS bezel**. Source:
`vault/concepts/Anti-patterns.md`, `vault/history/Decisions.md`.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Carousel mechanics | **shadcn `Carousel` (Embla)** | User-requested shadcn/ui; Embla gives robust drag/touch/keyboard/a11y for free. |
| Coverflow visuals | **GSAP**, driven off Embla's `scroll`/`select` events | User-requested GSAP; tween each slide's scale/opacity/rotateY by distance from center; entrance reveal. |
| Starting component | **21st dev MCP (`magic`)** generates a coverflow/card base, re-themed to Palm | User-requested; speeds the polished baseline. |
| UX/a11y gate | **ui-ux-pro-max checklist** | Focus rings, ≥44px arrow targets, contrast ≥4.5:1, `prefers-reduced-motion`, no hover-only affordances. |
| Placement | **Standalone `/gallery` route** + nav link | User-chosen; not in the main landing scroll. |
| Content | **5 feature cards** derived from existing landing copy | On-message; reuses owned mockups. |
| GSAP dependency | Add `gsap` (npm) to the app | Required for the coverflow; coexists with the existing `motion` dep. |

### Rejected
- **GSAP Draggable + InertiaPlugin without Embla** — re-implements keyboard/a11y Embla already provides.
- Putting the gallery in the main landing scroll — user chose a standalone route.

## Card data (`galleryData.ts`)

Five cards; each `{ id, eyebrow, headline, keyword, body, image, alt }`. The headline
renders with the `keyword` wrapped in `.kw` (gold italic Plex). Visuals are existing
`public/mockups/` screenshots (drop-shadow only).

1. **eyebrow** "Paso 01" · **headline** "Tu `resumen bancario`. El punto de partida." · `screen-extracto.png`
2. "Paso 02" · "`Cuentas claras`, problemas claros." · `screen-gastos.png`
3. "Paso 03" · "Tus `objetivos`, a tu alcance." · `screen-objetivo.png`
4. "Paso 04" · "Tu `portafolio`, armado para vos." · `screen-portfolio.png`
5. "Palm" · "Asesoramiento `personalizado`." · `screen-proyeccion.png`

(Body copy: one short sentence each, lifted/adapted from the landing's Process/Pillars
sections. Final strings fixed in the plan. The set is data-driven so it's trivial to
add/remove/reorder cards.)

## Architecture

```
app/gallery/page.tsx          Server component: <section> shell, head copy, <Coverflow/>
components/Gallery/
  Coverflow.tsx               "use client" — shadcn Carousel (Embla) + GSAP coverflow
  GalleryCard.tsx             One feature card (visual + eyebrow + headline.kw + body)
  galleryData.ts              The 5 cards (typed array)
  transforms.ts                Pure helper: distanceFromCenter → { scale, opacity, rotateY }
components/ui/carousel.tsx    shadcn primitive (added via CLI)
```

### Coverflow behavior
- Embla owns slide layout, drag/swipe, keyboard (←/→), looping, and the selected index.
- On Embla `scroll` + `select`, compute each slide's signed distance from the centered
  slide and apply via GSAP `gsap.set`/`gsap.to`:
  - center: `scale 1`, `opacity 1`, `rotateY 0`, no blur;
  - neighbors: `scale ≈ 0.82`, `opacity ≈ 0.55`, `rotateY ≈ ±18°`, slight blur — falling
    off with distance (clamped via `transforms.ts`).
- Controls: shadcn `‹ ›` arrow buttons (≥44px, visible focus, `aria-label`) + a dot
  indicator row (clickable, `aria-current` on active). Embla exposes `scrollPrev`/
  `scrollNext`/`scrollTo`/`selectedScrollSnap`.
- **Reduced motion** (`prefers-reduced-motion: reduce`): skip all GSAP transforms; render
  a static, equal-size horizontal scroll-snap row (Embla still drags; no depth effect).
- GSAP cleanup: use `useGSAP` (or a `useEffect` returning `gsap.context().revert()`),
  and remove Embla listeners on unmount.

### Palm styling
- Section on `--navy`; container max-width; head = eyebrow (gold caps Plex) + `data-split-words`
  headline + lede, reusing existing classes/CSS where possible.
- Card surface `--card` (#0D1830), 3px brand-gradient top border (existing card language),
  cream text, gold `.kw`, NHaas headline / Plex body. Screenshot with the existing
  drop-shadow treatment (no bezel).
- New styles live in `app/gallery.css` (imported by the route) using the Palm tokens
  already in `globals.css`; reuse `sections.css` classes where they fit.

### Nav
Add a "Galería" link (`/gallery`) to the Navbar burger `Sheet` (closes on click, like the
other links).

## Accessibility (ui-ux-pro-max gate)
- Arrows ≥44px, `aria-label`s; visible focus rings on arrows/dots/cards.
- Keyboard: ← / → move slides (Embla); Tab order matches visual order.
- Dots: `role`/`aria-current`; not color-only (active dot also scales).
- `prefers-reduced-motion` respected (static fallback above).
- Images have meaningful `alt`; the carousel region has an `aria-roledescription="carousel"`
  + label (shadcn provides this).
- Contrast: dimmed neighbors stay ≥ the WCAG threshold for any text shown, or text is only
  shown on the focused card.

## Testing & verification
- **`transforms.ts`** — unit test the pure distance→transform mapping (center = identity;
  symmetric falloff; clamps at far distances).
- **Build**: `npm run build` + `tsc --noEmit` green; `/gallery` shows as a route.
- **Manual**: drag/keyboard/arrows/dots on desktop + mobile; reduced-motion fallback;
  visual check against Palm tokens.

## Risks & mitigations
- **GSAP + Embla event sync jank** → drive transforms in Embla's `scroll` handler with
  `gsap.set` (no per-frame tween storms); `gsap.ticker` only if needed; keep transforms to
  `scale/opacity/rotateY` (GPU-friendly).
- **21st-magic output off-brand** → treat it as a starting scaffold only; re-theme to Palm
  tokens and strip any non-brand fonts/colors/icons before committing.
- **A third animation lib** (gsap alongside motion) → acceptable per user request; scoped to
  the gallery. Enrich-phase may later consolidate.
- **Anti-pattern drift** (icon tiles / gradient text) → cards use real screenshots + `.kw`;
  reviewed against the anti-patterns list.

## Out of scope
- Replacing the landing's Explore/Process sections (gallery is standalone).
- The `app.palminversiones.com` product.
- Consolidating `motion` → `gsap` across the whole app.
- The production cutover Phases 2–3 (separate, paused).
