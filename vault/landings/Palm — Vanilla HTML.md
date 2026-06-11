---
tags:
  - landing
  - palm
  - legacy
---
# Palm Landing — Vanilla HTML (retired)

> **Legacy since 2026-06-09**: the cutover lifted the Next.js app (`palm-app/`) to the repo root and archived this static landing under `legacy/`. It is not built or served. Current landing: [[Palm Section Map]].

## Location
`legacy/index.html` (was repo root between 2026-06-01 and 2026-06-09).

## Stack
- **Vanilla HTML/CSS/JS** in a single `index.html` (~3700 lines, navigable by `═════` section comments).
- **No** bundler, **no** React/Vue/Svelte, **no** Tailwind, **no** TypeScript.
- External dependencies via **ESM CDN** inside `<script type="module">`:
  - `three@0.160.0` — hero shader
  - `motion@11.18.0` — element animations
  - `mathjs@13.2.0` — calculator
- Fonts:
  - **Neue Haas Grotesk Pro** self-hosted at `fonts/` (5 weights, via `@font-face`).
  - **IBM Plex Sans** from Google Fonts (single `<link>`).

## How to run locally
The project uses `npm run dev` (`serve` on port **3000**). Config lives at `.claude/launch.json` with `npx live-server` as alternate.

```
npm install && npm run dev
# → http://localhost:3000
```

**Cannot be opened with `file://`** — relative `@font-face` paths won't resolve without an HTTP server.

## Directory layout
```
summa-landing/
├── index.html                  ← the entire page
├── CONTEXTO_PROYECTO.md        ← Spanish handoff
├── PalmLogoGradient.png
├── Logo gradient gmail.png
├── Palm Colours.png
├── fonts/                      ← Neue Haas Grotesk Pro × 5 weights
├── mockups/                    ← hero, problem, step screenshots
├── Card 1/                     ← animated card assets
├── Card 2/                     ← animated card assets
├── package.json                ← `serve` dev dep only
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .claude/launch.json
├── docs/
│   ├── specs/                  ← design specs
│   └── plans/                  ← implementation plans
└── vault/                      ← Obsidian context graph (this folder)
```

## Sections (top → bottom)
See [[Palm Section Map]] for details. Eleven rendered blocks:
1. Navbar (floating pill)
2. Hero (asymmetric, Three.js shader)
3. Marquee ticker
4. Problem
5. Process (4 letter-format steps)
6. Pillars (free vs paid)
7. Calculator (standalone section)
8. Security (Statement Letter on navy)
9. CTA-final (Statement Letter on navy)
10. Footer
11. GradualBlur (fixed bottom overlay, persists across scroll)

## Authoritative source
The canonical handoff document is **`CONTEXTO_PROYECTO.md`** (Spanish, ~330 lines). When in doubt, read that — it documents every section, every design decision, every motion script, and every piece of tech debt.

## Deploy
- **Cloudflare Pages**, git-integrated. Push to `main` auto-deploys.
- Config: framework "None", build command empty, output directory `/`, root directory `/`.
- DNS: **AWS Route53** points the apex (or `palm.<domain>`) at the CF Pages target.

## See also
- [[Palm Section Map]]
- [[../brand/Palm Inversiones]]
- [[../brand/Visual Identity]]
- [[../concepts/Anti-patterns]]
- [[../concepts/Motion System]]
