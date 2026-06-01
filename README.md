# Palm Inversiones — landing

Static marketing site for **Palm Inversiones**, an Argentine fintech app. Deployed on Cloudflare Pages with DNS via AWS Route53.

## Run locally

```sh
npm install
npm run dev   # → http://localhost:3000
```

`npm run dev:live` uses `live-server` for auto-reload.

## Editing the page

All page content lives in `index.html` (HTML + inline CSS + inline JS). Section comments (`═════`) make it navigable. Imagery is in `mockups/`, `Card 1/`, `Card 2/`. Self-hosted fonts are in `fonts/`.

## Project context

- `CONTEXTO_PROYECTO.md` — section-by-section handoff (Spanish)
- `vault/` — Obsidian-style context graph: brand, design decisions, anti-patterns, history
- `AGENTS.md` — notes for AI coding agents
- `docs/specs/` — design specs for past changes
- `docs/plans/` — implementation plans

## Deploy

Pushes to `main` auto-deploy via Cloudflare Pages. DNS is managed in AWS Route53.
