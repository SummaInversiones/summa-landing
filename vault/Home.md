---
tags:
  - index
  - moc
---
# Palm Inversiones — Context Vault

Knowledge graph for the Palm Inversiones landing (repo: `summa-landing` — name preserved for historical reasons after the Summa→Palm rebrand).

> If you are a future Claude Code session reading this: start here, then jump into whichever node is relevant. Backlinks are wired with `[[Wiki Links]]`.

## What is Palm Inversiones?

Palm is an **Argentine fintech**: a mobile app for personal investing + portfolio tracking + financial advice. Audience: Argentine savers (25–45) with savings habits but no investment knowledge. See [[brand/Palm Inversiones]].

## Map of Content

### Brand
- [[brand/Palm Inversiones]] — product, market, positioning
- [[brand/Rebrand from Summa]] — why and how the name changed
- [[brand/Audience]] — Argentine saver-to-investor
- [[brand/Voice]] — rioplatense voseo, "amigo que entiende de plata"
- [[brand/Visual Identity]] — palette, typography, logo

### Landing
- [[landings/Palm — Vanilla HTML]] — current; the repo *is* the landing
- [[landings/Palm Section Map]] — 11 vertical sections in `index.html`

### Concepts
- [[concepts/Anti-patterns]] — visual tells of AI-generated design to avoid
- [[concepts/Motion System]] — Three.js shader, Motion, mathjs

### History
- [[history/Timeline]] — commit-level history with context
- [[history/Decisions]] — non-obvious choices and why
- [[conversations/Index|Conversations]] — session-by-session log

## Quick facts
- Repo root: `/home/tron-mrs/Summa/summa-landing`
- Locale: `es_AR` (rioplatense, voseo)
- Hosting: **Cloudflare Pages** (git-integrated, auto-deploy on push to `main`)
- DNS: **AWS Route53**
- Local dev: `npm run dev` → `http://localhost:3000`
- Stage: pre-launch — store-button CTAs, no backend

> Summa-era notes preserved at `vault/_archive/summa/` — read if you need to recover anything from the deleted Next.js landing (`git log` for code).
