---
tags:
  - conversations
  - 2026-06-01
  - vault
  - palm
  - summa
---
# 2026-06-01 — Vault expansion

## Goal
> "Create an obsidian vault that will work as your context graph, it will have information about what Palm Inversiones (previously summa) is, the structure of the landing page, the history of conversations, etc."

The user already had a partial `vault/` (Summa-era, built 2026-05-06) covering the Next.js landing's architecture and concepts. The ask was to expand it to a true context graph rooted around the **Palm Inversiones** rebrand.

## Starting state
- Existing `vault/`: `Home.md` (Summa-only MOC) + `architecture/`, `components/`, `concepts/`, `history/`.
- Untracked at repo root: `LANDING PALM/` (vanilla HTML Palm landing) and `LANDING PALM.zip`.
- Authoritative Palm doc: `LANDING PALM/CONTEXTO_PROYECTO.md` (Spanish, ~330 lines).
- Repo still committed under the Summa brand (last commit `431a418`).

## What changed
Created three new directories and one rewritten file:

### `brand/`
- [[../brand/Palm Inversiones]] — what the product is, positioning, tiers, regulator, partners.
- [[../brand/Rebrand from Summa]] — the name change, what stayed, what dropped (notably "AI" framing), repo-not-renamed caveat.
- [[../brand/Audience]] — Argentine savers 25–45, mobile-first, what they need / don't want.
- [[../brand/Voice]] — voseo, "amigo que entiende de plata", keyword italicization rules, anti-patterns.
- [[../brand/Visual Identity]] — palette tokens, Neue Haas + IBM Plex pairing, Page Theme Lock, no gradient text-fill.

### `landings/`
- [[../landings/Palm — Vanilla HTML]] — stack, run instructions, directory layout, current status.
- [[../landings/Summa — Next.js]] — legacy framing, what still applies, what to remember.
- [[../landings/Palm Section Map]] — all 11 sections of `LANDING PALM/index.html`, distilled from `CONTEXTO_PROYECTO.md` §3.

### `concepts/` (additions)
- [[../concepts/Anti-patterns]] — every slop tell deliberately removed from the Palm landing, plus the 3 controversial decisions kept.
- [[../concepts/Motion System]] — Three.js shader, Motion, mathjs, IntersectionObserver, marquee, GradualBlur.

### `conversations/`
- [[Index]] — log conventions.
- This file.

### Updated
- `Home.md` — now dual-landing aware; "What is Palm Inversiones" lead; Palm vs Summa landing table; expanded MOC with brand + landings sections.
- [[../history/Timeline]] — split into A (Summa committed arc) and B (Palm untracked arc); added section-by-section evolution log; updated working-tree snapshot to 2026-06-01.
- [[../history/Decisions]] — split into A (Summa) and B (Palm) decision blocks; added 10 Palm-era decisions with **Why** + **How to apply** discipline.

## What was deliberately *not* changed
- Existing Summa-era notes in `architecture/`, `components/`, and `concepts/` (Design Language, Page Sections, Scroll Reveal, Copy and Voice, Glossary) were left intact. They still describe the committed Next.js landing accurately; superseding them with Palm-only content would have erased valid institutional memory of the deployed app.
- Did not rename `Home.md`, the vault folder, or anything in the repo to match the Palm brand.
- Did not commit anything. `vault/` is still untracked.

## Open threads / next sessions could
- Add a `concepts/Calculator Math.md` page if anyone needs to re-derive the time-to-target formula in `mathjs`.
- Write a `landings/Migration to React.md` brainstorm if/when Palm needs server-side concerns (form persistence, dashboard, etc.) — `CONTEXTO_PROYECTO.md` §7 already sketches this.
- When/if the Palm landing is committed and deployed, add a "Palm — Hosting" architecture note and update `Home.md`'s Quick facts.
- Decide whether to delete the dead Motion code for pillar phones (currently iterates empty NodeLists). Tradeoff doc: `CONTEXTO_PROYECTO.md` §6.

## How to use this vault going forward
1. **Always start from `Home.md`.** It's the MOC.
2. **Disambiguate which landing.** Palm = vanilla HTML in `LANDING PALM/`. Summa = Next.js in `app/`.
3. **Before "improving" anything visible, read `Decisions.md` and `Anti-patterns.md`.** Many of the obvious-looking changes were tried and reverted.
4. **Add a new conversation note per session.** Link to the canonical pages you updated; keep ephemeral "what I tried" in the conversation note.
