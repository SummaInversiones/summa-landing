---
tags:
  - conversations
  - index
---
# Conversations — Index

Per-session log of meaningful Claude Code interactions on this repo. Add a new note per session with the format `YYYY-MM-DD — short title.md`.

## Why log conversations
- Decisions made in a session often don't show up in git (rejected approaches, things tried but reverted, design rationale).
- Future sessions can read this to avoid repeating dead ends.

## Conventions
- One file per meaningful session.
- Frontmatter: `tags: [conversations, YYYY-MM-DD]` plus topical tags (`palm`, `summa`, `vault`, `brand`, `motion`, etc.).
- Sections to use when relevant:
  - **Goal** — what the user asked for, in their words if quoted.
  - **What changed** — files touched, decisions made.
  - **What was rejected** — paths tried and dropped, with why.
  - **Open threads** — things deferred to next session.
- Link to the canonical knowledge node when adding facts there (e.g. update [[../brand/Voice]] and link back from here).

## Sessions

- [[2026-06-01 — vault expansion]] — built out the brand/landings/conversations notes; documented the Summa → Palm rebrand.
- [[2026-06-11 — designer cards integration]] — designer's v2 card export integrated 4+4 (Explore / Comparativa), CtaFinal deleted, spacing unified, CardMass raster fix; Section Map + Motion System rewritten for the Next.js app.

---

## What does *not* belong here
- Code that landed in git → that's in `git log` already.
- Stable facts about the project → those belong in `brand/`, `landings/`, `architecture/`, `concepts/`. The conversation log just **points** to where you updated them.
