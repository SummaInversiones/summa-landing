---
tags:
  - brand
  - history
---
# Rebrand: Summa → Palm Inversiones

## What changed
- **Product name**: "Summa" → "Palm Inversiones" (wordmark: "Palm").
- **Product framing**: "AI-driven personal investment advisor" → "asesor financiero personal" + investment app. The "with AI" / "con IA" framing was **removed deliberately** from the hero.
- **Social handle**: `@palm.inversiones`.

## What stayed
- Same audience (Argentine savers 25–45).
- Same locale (`es_AR`, voseo).
- Same regulator anchor (CNV) and same broker partner mention (Alfy Inversiones).
- Same waitlist-driven pre-launch posture, although Palm pivots from "join waitlist" to "download the app" CTAs.

## Why
Not explicitly documented in commits, but inferable from the Palm landing copy:
- Drops the AI framing (a slop tell, and arguably a credibility risk for a Series-A-stage fintech in Argentina).
- "Palm" is shorter, brandable, easier to say in Spanish, and pairs with a logo gradient mark.
- "Inversiones" anchors the category clearly — the original "Summa" was opaque about what was being summed.

## Repository state
- The **repo is still named `summa-landing`** and the project directory is `/home/tron-mrs/Summa/summa-landing` — neither has been renamed.
- The **Summa Next.js landing** (`app/`, `components/`) is still committed and presumably still deployed at the Vercel project (last commit `431a418`, 2026-03-25).
- The **Palm landing** lives **untracked** in `LANDING PALM/` (also zipped at `LANDING PALM.zip` at repo root). It has its own self-contained `.claude/` config inside it.
- There is no commit yet that integrates Palm into the repo's main deployment.

## Implications for future sessions
- When a user says "the landing", **ask which one** unless context makes it obvious. Default to Palm if the user mentions Palm, mockups, screenshots, hero shader, calculator, or vanilla HTML. Default to Summa if they mention React, components, Tailwind, or the waitlist API.
- Don't "fix" the repo name or directory paths to match Palm — that's a deferred decision.
- The two landings have **different design systems** (see [[../concepts/Design Language]] for Summa and [[Visual Identity]] for Palm).

## See also
- [[Palm Inversiones]]
- [[../history/Timeline]]
- [[../landings/Summa — Next.js]]
- [[../landings/Palm — Vanilla HTML]]
