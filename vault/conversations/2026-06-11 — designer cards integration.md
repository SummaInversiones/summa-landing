---
tags:
  - conversations
  - 2026-06-11
  - palm
  - motion
  - cards
---
# 2026-06-11 — Designer cards integration

## Goal
Integrate the designer's new card export (`utils/palm-react/cards-export/`, React 19 + Framer Motion 12) into the production landing, iterating with the founder: preview page first, then home integration, then layout/polish rounds.

## What changed
- `components/palm-cards/` — the 8 cards + `PCard` shell copied from the export with two mechanical adaptations: `framer-motion` → `motion/react` imports, and a **`pv-` prefix on every class family** (the legacy `.pcard`/`.cc-`/`.g2-4` names coexisted in `sections.css` at the time).
- `/cards-nuevas` — internal noindex preview (kept; mirrors exactly what home mounts).
- Home: Explore = 4 producto cards (`CardsGrid`), Comparativa = 4 confianza cards (`BentoCards`), **same structure** (4-up row, 1400px container, mobile sticky-stack).
- Deleted: `CtaFinal` ("Tu futuro comienza hoy") + `Waitlist.tsx` (duplicated the footer waitlist; `#download` re-anchored to the footer card), `ExploreStack` deck, all legacy card CSS, the old bento tiles.
- Spacing: `--pad-y` 96→64px (mobile 48px), per-section padding special-cases removed.
- CardMass: palm circle re-based at 72px scaled DOWN (was 12px scaled up → pixelated), label matched to standard headline metrics.
- Vault: [[../history/Decisions]] (2 new entries + mathjs entry marked superseded), [[../history/Timeline]] (arcs D & E), [[../landings/Palm Section Map]] + [[../concepts/Motion System]] rewritten for the Next.js app, [[../concepts/Anti-patterns]] rows refreshed, [[../Home]] map fixed.

## What was rejected / corrected along the way
- **7-card single grid (3-col)** — first integration mounted all designer-mounted cards in Explore; founder split them 4+4 by theme instead.
- **2×2 bento in the 760px column** — founder wanted the second group structurally identical to the first (aligned 4-up row).
- **Gradient border on the card shell** (from the export) — removed; flat variant bg.
- **CardZero initially left unmounted** (the designer's own App.jsx omits it) — founder wanted it in the bento as "0 comisiones".
- Old bento content (+$4,2M hero chart, donut 73%, carteras split) — dropped in favor of the confianza cards, which retell the same messages. CSS for those tiles still exists in `sections.css` if a revival is ever wanted.

## Gotchas worth remembering
- `npm start` doesn't fail loudly if port 3000 is taken (EADDRINUSE buried in the log) — a verification curl can silently hit a **stale server**. Check the listener before trusting the response. Same with prod: Cloudflare edge caches the HTML briefly; cache-bust when verifying a deploy.
- Designer exports ship `framer-motion` imports; this repo only has `motion`.
- The raster rule for scaled visuals is recorded in [[../concepts/Motion System]].

## Open threads
- `utils/palm-react/` (designer export, includes `node_modules/`) and the dotmatrix experiments remain untracked — founder's call whether to commit/clean.
- Footer "Bajate la app" links now scroll to the waitlist form — fine pre-launch; revisit when store links exist.
- Nothing pushed to GitHub this session (deploys are manual via wrangler).
