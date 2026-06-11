---
tags:
  - history
  - decisions
---
# Decisions

Non-obvious choices that have already been made on the Palm landing. Read before "improving" them.

> Summa-era decisions are archived at `_archive/summa/decisions/Summa decisions.md`.

## Decisions

### Palette and typography are locked
**Why:** Two design audits (`hallmark`, `design-taste-frontend`) validated the navy + gold + brand-gradient combination and the Neue Haas + IBM Plex Sans pairing. Adding a third typeface (Playfair) was tried in the Security section and removed — it broke the 2-font rule.
**How to apply:** Don't introduce new fonts. Don't change palette tokens. Keyword italics always use the `.kw` class (IBM Plex italic medium gold).

### Page Theme Lock — entire page renders on navy
**Why:** Sections that flip to cream/white (e.g., the original Security section) read as anti-pattern (Hallmark Page Theme Lock).
**How to apply:** All sections render on `--navy`. The hero is the only place a shader sits over a brand-gradient, but a navy-62% scrim keeps it reading as navy.

### Drop the "with AI" / "con IA" framing
**Why:** AI hype as a sales hook is both a slop tell and a credibility risk for a fintech in Argentina, where regulatory trust matters more than novelty.
**How to apply:** Don't reintroduce "AI", "powered by AI", "con IA", "IA-driven" in hero or pillar copy. The product is "tu asesor financiero personal."
**Scoped exception (2026-06-09, founder request):** ONE FAQ answer on `/preguntas-frecuentes` mentions a "arquitectura de inteligencia artificial de última generación" — but only to answer the reliability concern *"is this just a hallucinating chatbot?"* (inspired by vertus.ai). It frames AI as trustworthy/grounded (real data + CNV-regulated, not invented), never as a hype hook, and the method is deliberately unspecified. Keep AI mentions confined to that reliability context; do NOT bleed it into hero/pillars.

### Hero is asymmetric, not centered
**Why:** Centered hero + 100vh + "Get started" pattern is the canonical SaaS landing template — flagged by §4.3 ANTI-CENTER BIAS.
**How to apply:** Hero stays as a 2-col grid with copy left, iPhone right. Mobile stacks copy-then-phone.

### Calculator lives in its own section
**Why:** Previously nested inside Pillar 2. Promoting it gives the page asymmetry (pillars symmetric → calc asymmetric) and gives the interactive widget the prominence it earns.
**How to apply:** Don't fold the calculator back into a pillar. Pillars stay typography-only.

### `mathjs` is lazy-loaded and pre-fallbacks to `Math.log`
**Why:** Calculator must show correct values on first paint, but the CDN import shouldn't block the page. Native `Math.log` covers the case before mathjs lands; mathjs takes over once `.calc` is within 200px of viewport.
**How to apply:** Don't move the import to the top of the module. Keep the IntersectionObserver gate.

### Three.js shader and GradualBlur are decorative — and kept
**Why:** Strict reading by taste-skill: both are unmotivated decoration (don't communicate hierarchy, storytelling, or feedback). User explicitly prefers them.
**How to apply:** Shader pauses offscreen via IntersectionObserver — don't remove that. GradualBlur honors `prefers-reduced-transparency: reduce` — don't remove that either. Otherwise, leave them.

### Calculator assumptions (0% solo / 15% with Palm) are disclosed, not invented
**Why:** Hardcoded numbers in marketing pages are a tell **unless** they're labeled. The disclaimer "Cálculo orientativo. Asume 0% sobre el ahorro y 15% anual con Palm." converts them from invention to assumption.
**How to apply:** If you change the assumptions, update the disclaimer in lockstep.

### Marquee keeps its middle dots; trust strip does not
**Why:** `·` between items in a scrolling ticker is functional separation. `·` in a static line is decorative inflation (§9.F max 1 per line). The trust strip was rewritten with comma + period.
**How to apply:** Don't add dots to the trust strip. Don't remove them from the marquee.

### Phone screenshots use drop-shadow only — no CSS bezel
**Why:** Re-drawing UI chrome around real screenshots is an anti-pattern (the chrome ends up looking redrawn and wrong).
**How to apply:** When adding new screenshots to the page, ship them with a subtle drop-shadow. Do not wrap them in a faux iPhone frame.

### Repo not renamed despite rebrand
**Why:** The repo (`summa-landing`) and the working directory (`/home/tron-mrs/Summa/summa-landing`) still carry the old brand. Renaming touches Vercel project linkage, git remote URLs, and editor histories — deferred.
**How to apply:** Don't auto-rename paths to match Palm. Use "the Palm landing" / "the Summa landing" in conversation to disambiguate.

### Burger menu links to main-page sections only
**Why:** The throwaway test routes `/gallery` and `/calculadora` were dropped (users shouldn't reach them). The founder asked the menu to scroll to home sections, not navigate to other pages.
**How to apply:** Menu items are **root-relative** anchors (`/#explore-wip`, `/#calculadora`, `/#pilares`, `/#download`) so they work from any page (e.g. `/preguntas-frecuentes`), not just home. On `/` they're a same-document fragment scroll; elsewhere they navigate home then scroll (sections carry `scroll-margin-top` to clear the sticky navbar). The logo links to `/`. New standalone pages (e.g. the FAQ) go in the **footer**, not the burger menu.

### The designer's v2 card export is split 4 + 4 across two sections (components/palm-cards, `pv-` prefix)
**Why (2026-06-11, founder layout):** The designer shipped an 8-card set (`utils/palm-react/cards-export/`, framer-motion async/await loops). The founder split them by theme: **Explore** gets the 4 "producto" cards (gastos, cc, goals, portfolio) as a single aligned 4-up row; **Comparativa ("¿Por qué Palm?")** gets the 4 "confianza" cards (mass, privacy, drain, zero) as a 2×2 bento — replacing the old bento tiles (hero +$4,2M chart, donut 73%, split de carteras, legacy `.pcard--zero`), whose messages the new cards retell. The old `.pcard`/`.cc-`/`.g2/3/4-`/`gastos-` CSS was deleted from `sections.css` once nothing used it; the `pv-` prefix on the new classes is historical (it kept them from colliding while both generations coexisted) — keep it.
**How to apply:** Edit cards in `components/palm-cards/` (single source: home `CardsGrid` + `BentoCards`, and `/cards-nuevas` preview renders both). `.explore .container` is widened to 1400px so the 4-up row reads big on laptop — don't shrink it back to `--container`, and don't re-add columns/breakpoints to `pv-explore__grid` beyond the export's 2-col/1-col mobile ones. The old ExploreStack deck and CardAnimations' `.pcard` branch are retired/no-op; mobile uses the export's own sticky-stack (`useScrollStack`). CardMass renders its palm circle at 72px base and scales DOWN (blurry when it was 12px scaled up ×6) — keep new circle-like visuals raster-safe the same way.

### CtaFinal ("Tu futuro comienza hoy") deleted — footer waitlist is the only signup
**Why (2026-06-11, founder request):** It duplicated the footer's waitlist form right above it — two identical email captures one viewport apart.
**How to apply:** Don't reintroduce a pre-footer CTA section with another waitlist. The `#download` anchor (navbar + burger "Bajate la app") now points at the footer card. `Waitlist.tsx` and its `.waitlist__*` CSS were removed with it; `FooterNewsletter` (`.fnl__*`) is the surviving form.

### FAQPage schema lives on /preguntas-frecuentes, not home
**Why:** Google requires FAQ structured data to match a visible FAQ on the same URL; the home page has no visible FAQ.
**How to apply:** Keep `FAQPage` JSON-LD on the FAQ page; home keeps only `FinancialService` + `WebSite`. Edit FAQ content in `lib/faq.ts` (one source for both the visible page and the JSON-LD). See [[../concepts/SEO]].

## See also
- [[../concepts/Anti-patterns]]
- [[../concepts/SEO]]
- [[../brand/Rebrand from Summa]]
- [[../brand/Visual Identity]]
