# Palm landing — IA reorder + reframe

**Date:** 2026-06-08
**Status:** Approved
**Scope:** Re-sequence and re-copy existing React sections to match a new reading-order sketch. No new framework, no new design language. One net-new card; one animation relocated.

## Goal

Rework the landing's information architecture so the page reads as a guided
funnel: *your bank statement (the starting point) → a 4-step value flow →
proof (calculator) → why Palm (the difference) → choose where to start
(pricing) → close*. The user sketched this flow; ~80% of it already exists as
built components. This is a reorder + rewrite, not a rebuild.

## Non-goals

- No new fonts, palette tokens, or design language. All vault locks hold (see
  "Respected locks").
- No hero layout redesign — it stays the locked asymmetric 2-col iPhone layout.
- No rebuild of the animated cards, calculator math, or bento charts.

## Current vs. target order

`palm-app/app/page.tsx` today:

```
Hero → Marquee → Problem → Explore → Pillars → Calculator → Comparativa → CtaFinal → Footer
```

Target:

```
Hero → Marquee → Problem → Explore(4 steps) → Calculator → Comparativa → Pillars → CtaFinal → Footer
```

Only two components move: **Calculator** moves up (to follow the steps), and
**Pillars** moves down (to the end, as the pricing close). All other components
keep their slot. `CardAnimations` and `ClientEnhancements` stay mounted once at
the end.

## Per-section changes

### 1. Hero (`components/Hero.tsx`)
- Reframe copy around "tu resumen bancario, el punto de partida."
- The iPhone mockup should show the expense-tracker screen with commissions at
  the top (the "comisiones en la parte de arriba" note). If the asset isn't
  already the expense-tracker view, swap the `src` to the resumen/expense
  screenshot; do not redraw chrome (drop-shadow only).
- Layout unchanged — asymmetric grid, copy left / phone right (locked).

### 2. Explore → "4 pasos" (`components/Explore.tsx`)
Becomes an explicit numbered 4-step flow under a "Todo esto en 5 minutos"
frame. Mapping of step → animation:

1. **Conocé tus gastos en 5 minutos** — reuse the existing scan-statement
   (`pcard--cc`) magnifying-glass animation. Pair with the resumen screenshot
   per the "pantalla resumen → conocé tus gastos en 5 minutos" note.
2. **Un diagnóstico: cuentas claras, problemas claros** — **one net-new small
   card.** This is the only new visual in the whole effort. Keep it simple and
   on-brand (navy `--card`, gold accent, no icon-tile grid). It can be a
   typography-forward "diagnosis result" card; no heavy custom animation
   required.
3. **Tus objetivos, paso por paso** — existing `pcard--goals` (ball + dot
   trail to mountain) animation, unchanged.
4. **Tu portafolio, hecho a medida** — existing `pcard--portfolio` donut
   animation, unchanged. Its "cómo llegar / cálculo de tiempos" promise is paid
   off by the Calculator immediately below.

Step numbering: add a visible step index (1–4) per card, in the locked type
system (IBM Plex tabular numerals or Neue Haas — match existing numeral usage,
e.g. the process numerals). No new font.

**Removed from Explore:** the `pcard--zero` (0% + dissolving fee-pills) card —
it migrates to Comparativa (see §4).

### 3. Calculator (`components/Calculator.tsx`)
- No internal change. Stays a standalone section (locked decision — do not fold
  into a pillar). Simply moves up in `page.tsx` to sit directly after Explore so
  it reads as step 4's payoff.
- mathjs lazy-load / IntersectionObserver gate preserved.

### 4. Comparativa "La diferencia / ¿Por qué Palm?" (`components/Comparativa.tsx`)
- Absorbs the migrated **0% + fee-pills** visual as the "comisiones ocultas /
  aprovechan hasta la última gota" differentiator.
- Resulting pain-point set across the bento:
  - **Si es gratis, alguien lo paga** → existing "Si es gratis, sos el
    producto" bento (kept).
  - **Las comisiones ocultas / aprovechan hasta la última gota** → the migrated
    0% + fee-pills animation (`comisión de mantenimiento / costo de custodia /
    cargo oculto`), integrated into the bento grid alongside the existing
    fees-vs-growth hero chart.
  - **Sos un número más** → existing "Tu cartera, no la de todos" bento (kept).
- Keep the section on navy; keep the bento card shells and shine treatment.

### 5. Pillars — closing pricing section (`components/Pillars.tsx`)
- Moves to the end (just before CtaFinal) as the "Elegí por dónde empezar"
  decision/pricing close. Heading already reads "Elegí por dónde empezar."
- **Gratuito** pillar (gestión financiera gratis) — kept; reinforces the
  "Precio ARS → gestión financiera" contrast.
- **Asesor** pillar — change the price from `USD 12.50 / mes` to a **fixed ARS
  monthly price**. Use placeholder `$____ ARS / mes` until the real figure is
  supplied (see Open inputs). Keep "Sin letra chica, sin sorpresas" and the
  "un precio fijo mensual" framing.

### 6. CtaFinal / Footer
- Unchanged.

## JS / animation surgery (the one real risk)

`components/CardAnimations.tsx` drives the card animations by selector
(`[data-card="zero"]`, `.g4-pill`, `.g4-pill-bob`, `.g4-zero`, etc.) with a
teardown array and a `cancelled` flag. Moving the 0% + fee-pills visual from
Explore into Comparativa requires:

- Repointing those selectors / observers to wherever the markup now lives.
- Ensuring the IntersectionObserver that triggers the pill bob/dissolve fires on
  the Comparativa instance.
- Verifying cleanup still runs (no leaked intervals/listeners) when the section
  unmounts.

If the markup keeps the same class names inside Comparativa, the JS may need
only a container-scope change rather than selector rewrites — confirm during
implementation.

## Respected locks (from `vault/history/Decisions.md` + `Anti-patterns.md`)

- Whole page renders on `--navy` (Page Theme Lock).
- Palette + 2-font system locked; `.kw` = IBM Plex italic medium gold for
  keyword italics; no third typeface.
- No "con IA" / "powered by AI" framing.
- Hero stays asymmetric (no centered/100vh hero).
- Calculator stays its own section; not folded into a pillar.
- Screenshots ship drop-shadow only — no CSS phone bezel.
- No icon-tile feature grid (relevant to the new step-2 card — keep it
  typography-forward).
- Eyebrow restraint — don't add an eyebrow to every section.

## Open inputs (required before launch)

- **Asesor ARS price** — the actual peso figure for the fixed monthly price.
  Spec ships with `$____ ARS / mes` placeholder until provided.

## Verification

- `tsc` clean, `npm test` green (existing 14 tests), `npm run build` succeeds
  with the new order.
- `npx opennextjs-cloudflare build` clean.
- SSR / dev check: page renders in the new order; the 4 steps are numbered 1–4;
  the 0% + fee-pills animation runs inside Comparativa (not Explore); the
  scan-statement, goals, and portfolio animations still run; Pillars renders as
  the closing section with the ARS price; Calculator still computes.
- `prefers-reduced-motion` still resolves all moved animations to a static
  end-state.

## Files touched

- `palm-app/app/page.tsx` — reorder imports/JSX.
- `palm-app/components/Hero.tsx` — copy + mockup.
- `palm-app/components/Explore.tsx` — 4-step relabel, numbering, remove zero card.
- `palm-app/components/Comparativa.tsx` — absorb 0% + fee-pills card.
- `palm-app/components/Pillars.tsx` — ARS price + framing.
- `palm-app/components/CardAnimations.tsx` — repoint the zero-card animation.
- `palm-app/app/sections.css` — any rule moves for the migrated card / new step-2 card.
```
