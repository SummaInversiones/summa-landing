---
tags:
  - landing
  - palm
  - sections
---
# Palm — Section Map

Vertical order of the Palm landing (`LANDING PALM/index.html`). Numbering mirrors `CONTEXTO_PROYECTO.md` §3.

## 3.1 Navbar — floating pill
- Archetype: N5 floating pill, blur backdrop, 20px from viewport top, max-width 720px centered, compresses to 640px past 200px scroll.
- Left: gradient logo + "Palm" wordmark. Right: gold CTA "Bajate la app" + burger.
- **No inline nav-links on desktop.** All links live in the burger sheet-menu (same nav mobile + desktop).
- JS: toggle `.scrolled` past 200px; toggle `.open` on burger overlay.

## 3.2 Hero — asymmetric
- Desktop (≥880px): 2-col grid `1.1fr / 1fr`. Copy left, iPhone mockup right.
- Mobile: stack — copy top, iPhone bottom.
- Background: Three.js RGB-line shader over `--brand-gradient`, navy-62% scrim on top.
- Headline: "Todo argentino bien asesorado puede pasar de ahorrista a `inversor`." (kw on "inversor")
- Subhead: "Tu asesor financiero personal. Sin letra chica, sin sorpresas."
- Two store buttons (App Store + Google Play), inline desktop / stack mobile.
- **Deliberately not present**: country-emoji badge pill, "Bienvenido a Palm" welcome block, "con IA" framing. See [[../concepts/Anti-patterns]].

## 3.3 Marquee ticker
- Thin band between hero and problem.
- Infinite horizontal scroll via CSS keyframe `marquee` (25s linear).
- Content: "Regulado por CNV · Broker partner: Alfy Inversiones · Hecho en Argentina 🇦🇷 · Tu capital, siempre protegido" — repeated 3× for seamless loop.
- Top/bottom borders: `var(--brand-gradient)` at 25% opacity.

## 3.4 Problem
- Desktop (≥860px): 2-col `1.1fr / minmax(280px, 1fr)`. Text left, figure right.
- Mobile: stack — text top, figure bottom (order was changed at user request).
- Headline: "Siempre tuvimos que `mirar de lejos` al mundo financiero."
- Short 64px gradient divider.
- "Hasta ahora." in gold italic Plex (**not** gradient text-fill).
- Figure: `mockups/problem-figure.png` — editorial portrait cropped into a P, soft radial halo behind.

## 3.5 Process — 4 letter-format steps
- `<ol class="steps">` with 4 `<li class="step">`.
- Each step: huge gold numeral (margin) + screenshot + heading + body.
- Desktop: 3-col `80px / minmax(280px, 1fr) / minmax(280px, 1.1fr)`; screenshot side alternates by step parity (odd = left, even = right).
- Mobile: vertical stack.
- Hairlines between steps. No cards, no borders, no backgrounds.
- Screenshots have **drop-shadow only** — no CSS phone bezel chrome.
- Steps:
  1. "Tu `resumen bancario`. El punto de partida." → `screen-extracto.png`
  2. "`Cuentas claras`, problemas claros." → `screen-gastos.png`
  3. "Tus `objetivos`, a tu alcance." → `screen-objetivo.png`
  4. "Tu `portafolio`. Armado solo para vos." → `screen-portfolio.png`

## 3.6 Pillars
- Two cards side-by-side desktop, stack mobile.
- **Pillar 1 (Gratuita)**: "Gestión financiera `inteligente`" — typography-only, 3 features with gold checkmark, CTA "Descargar gratis →". **No screenshot** (was removed at user request).
- **Pillar 2 (Pago)**: "Asesoramiento `personalizado` de inversiones" badge "USD 12.50 / mes" — typography-only, 3 features with violet checkmark, CTA "Quiero invertir →" + footnote "Acceso por invitación". **No calculator, no screenshot** — calc was promoted to its own section.
- Both pillars have a 3px brand-gradient top border.
- Resulting layout is visually symmetric (typography-only). Asymmetry now comes from the calculator section below.

## 3.7 Calculator — standalone section
- **New section** between Pillars and Security.
- Centered head + centered calc widget, max-width 560px.
- Head:
  - Eyebrow gold caps: "Probálo en vivo"
  - Headline: "Hacé el `cálculo`."
  - Lede: "Movés el aporte mensual y elegís un objetivo. Te mostramos en cuántos años llegás solo y cuántos te ahorrás con Palm."
- Widget:
  - Range input "Aporte mensual" (20k–500k ARS, step 5k, default 95k).
  - Select "Objetivo" (5M / 14M / 50M / 100M ARS).
  - Hairline divider.
  - Result: Vos solo (cream) → arrow → Con Palm (gold), large tabular-nums number.
  - "Te ahorrás N años de tu vida." — N in gold italic Plex.
  - Disclaimer: "Cálculo orientativo. Asume 0% sobre el ahorro y 15% anual con Palm. Las inversiones tienen riesgo."
- Math: mathjs `compile('log(1 + FV * r / PMT) / log(1 + r)')` — time-to-target compound annuity. Lazy-loaded on viewport entry.

## 3.8 Security — Statement Letter
- On navy (**not** cream/white). Page Theme Lock honored.
- Eyebrow: "REGULADO POR CNV"
- Headline: "Tu seguridad es nuestra `prioridad`."
- Lede + short brand-gradient rule.
- Four trust signals as `<dl>` with `<dt class="signal-lead">` (cream weight 500) + `<dd class="signal-body">` (cream-62% weight 400). Hairlines between.
- Partner strip: "Regulado por CNV, con Alfy Inversiones como broker partner. / Hecho en Argentina." (no middle-dot separators — dot-dieting).
- Hover: hairline above signal goes cream-8% → gold-25%. **One signal per element.**

## 3.9 CTA-final — Statement Letter (navy)
- Previously sandwich-gradient (centered, brand-gradient background) — broken at the taste-skill audit's request.
- Now: navy + Statement Letter, **left-aligned**.
- Headline: "Tu futuro comienza `hoy`."
- Body: "El primer paso es saber dónde estás parado. Cuanto antes empieces, antes llegás a tu objetivo."
- Short gradient rule.
- Two store buttons (App Store solid + Play Store ghost).
- Close: "Seguinos en `@palm.inversiones`" — no 📱 emoji (removed).

## 3.10 Footer
- Single line: logo + "Palm" wordmark (60% opacity), "© 2025 Palm · Regulado por CNV · Hecho en Argentina 🇦🇷", "Términos de uso · Política de privacidad".
- Top border: brand-gradient at 25%.

## 3.11 GradualBlur — fixed overlay
- `<div class="gradual-blur gradual-blur--bottom">` outside section flow.
- `position: fixed`, anchored to `bottom: 0` of viewport.
- 5 stacked layers, exponentially increasing `backdrop-filter: blur()` (0.5 → 1.5 → 3 → 6 → 12 px), each with its own `mask-image: linear-gradient()` for soft fades between levels.
- `z-index: 50` (below navbar pill, above content).
- Honors `prefers-reduced-transparency: reduce` (disabled when set).
- Persists across the entire scroll of the page.

## See also
- [[Palm — Vanilla HTML]] — stack and run instructions
- [[../concepts/Anti-patterns]] — what was deliberately removed
- [[../concepts/Motion System]] — how the animations work
- [[../brand/Visual Identity]]
