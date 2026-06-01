# Palm Inversiones landing — agent notes

## Stack reality
This is a **static site**. No build step, no bundler, no framework.

- `index.html` is the entire page — HTML + inline CSS + inline JS, ~2300 lines, navigable by `═════` section comments.
- External JS deps are loaded via **ESM CDN** inside `<script type="module">`:
  - `three@0.160.0` — hero shader
  - `motion@11.18.0` — element animations
  - `mathjs@13.2.0` — calculator (lazy-loaded when `.calc` is within 200px of the viewport)
- Fonts: Neue Haas Grotesk Pro self-hosted at `fonts/` (via `@font-face`), IBM Plex Sans from Google Fonts (single `<link>`).
- `mockups/`, `Card 1/`, `Card 2/` hold imagery referenced from the page.

## Local dev
`npm run dev` → `http://localhost:3000`.
The file **cannot** be opened via `file://` — relative `@font-face` URLs won't resolve.

## Deploy
- Host: **Cloudflare Pages**, git-integrated. Push to `main` auto-deploys.
- CF Pages config: framework "None", build command empty, output directory `/`, production branch `main`.
- DNS: **AWS Route53** points the apex domain at the CF Pages target.

## Before changing anything visible
Read `vault/history/Decisions.md` and `vault/concepts/Anti-patterns.md`. Most "obvious" improvements have already been tried and reverted. `CONTEXTO_PROYECTO.md` (Spanish) is the section-by-section handoff — note it's slightly out of date about the pillar content (the actual `index.html` includes additional animated cards under Pillars).

## Audience and voice
Argentine savers, rioplatense voseo. See `vault/brand/Voice.md`.
