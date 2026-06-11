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

### Explore cards are the designer's v2 export (components/palm-cards, `pv-` prefix)
**Why (2026-06-11):** The designer shipped a new 8-card set (`utils/palm-react/cards-export/`, framer-motion async/await loops). They replaced the original 4 scroll-deck cards on home. Classes carry a `pv-` prefix because the old `.pcard`/`.explore__grid`/`.cc-`/`.g2/3/4-` names still live in `sections.css` — the old shell is **still used** by the "0% comisiones" tile in the Comparativa bento, so it can't be deleted.
**How to apply:** Edit cards in `components/palm-cards/` (single source for home + `/cards-nuevas` preview). `CardZero` is in the folder but unmounted (CardDrain covers the message — the designer's own App.jsx also omitted it). Grid is 3-col >1080px (founder asked for bigger cards on laptop; the export's 4-col read too small). The old ExploreStack deck (vertical pin / horizontal fan-out) was retired with the swap; mobile uses the export's own sticky-stack (`useScrollStack`).

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
