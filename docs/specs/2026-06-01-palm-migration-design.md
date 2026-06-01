# Palm migration — design spec

**Date:** 2026-06-01
**Repo:** `summa-landing`
**Status:** approved, awaiting implementation plan

## 1. Goal

Replace the Summa Next.js landing (committed in `app/`, `components/`, etc.) with the **Palm Inversiones** vanilla HTML landing currently living untracked in `LANDING PALM/`. Deploy the result as a static site on **Cloudflare Pages** with DNS via **AWS Route53**. Preserve the audited Palm design 1:1 — this migration changes infrastructure and file layout, not visuals.

## 2. Decisions (with rationale)

| Decision | Why |
|---|---|
| Fully static, no backend | Palm's only interactive surface (calculator) runs client-side via mathjs; CTA is store buttons. Drops the Upstash waitlist, removes a layer of infra and secrets. |
| Replace Next.js stack with vanilla HTML at repo root | The Palm landing is already done, audited (`hallmark`, `design-taste-frontend`, `ui-ux-pro-max`), and working. Re-implementing 2300 lines of validated CSS/JS in React + Tailwind would burn 6–10h and risk regressions on every anti-pattern decision documented in the vault. |
| Lift `LANDING PALM/*` to repo root | Repo file tree = deployed file tree. No build config to remember. |
| Delete Summa code from working tree; rely on `git log` | A long-lived `summa-legacy` branch would drift. The frozen state at commit `431a418` is a complete recovery point. |
| Cloudflare Pages with git integration (auto-deploy on push to `main`) | Lowest-friction deploy for a brochure site. Framework "None", build command empty, output directory `/`. |
| AWS Route53 for DNS only | Apex (or `palm.<domain>` subdomain) → CF Pages target. Out of repo scope. |
| Archive Summa-era vault notes under `vault/_archive/summa/` | The notes document **why** decisions were made — institutional memory worth keeping out of the active reading path but findable. |
| Vault stays untracked | Matches its current status. Commit-or-not is a separate decision after migration. |

## 3. Final repo state

### Top-level layout after migration

```
summa-landing/
├── index.html                  ← was: LANDING PALM/index.html
├── CONTEXTO_PROYECTO.md        ← was: LANDING PALM/CONTEXTO_PROYECTO.md (path refs updated)
├── PalmLogoGradient.png
├── Logo gradient gmail.png
├── Palm Colours.png
├── fonts/                      ← Neue Haas Grotesk Pro (.otf/.ttf × 5)
├── mockups/                    ← Hero-section.png, screen-*.png, problem-figure.png, palm-logo.png
├── Card 1/                     ← active asset folder, referenced via URL-encoded paths
├── Card 2/                     ← active asset folder, referenced via URL-encoded paths
├── package.json                ← slimmed: just `serve` for local dev (dev-only)
├── package-lock.json           ← regenerated against slim package.json
├── .gitignore                  ← adds node_modules/, .DS_Store, .wrangler/
├── README.md                   ← rewritten for static-site reality
├── AGENTS.md                   ← rewritten: no more Next.js 16 warning
├── CLAUDE.md                   ← unchanged structurally (still `@AGENTS.md`)
├── .claude/                    ← merged: existing settings.json + LANDING PALM/.claude/launch.json
├── docs/
│   └── specs/
│       └── 2026-06-01-palm-migration-design.md  ← this file
└── vault/                      ← reorganized (Section 6); stays untracked
```

### Deleted from the working tree

Recoverable via git history (`git checkout 431a418 -- <path>`):

- `app/`, `components/`, `hooks/`, `__tests__/`, `docs/superpowers/` (if present), `docs/` Summa-era contents (anything other than `docs/specs/`)
- `next.config.ts`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `next-env.d.ts`
- `postcss.config.mjs`, `eslint.config.mjs`, `jest.config.ts`
- `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/`, `public/favicon.ico`
- `public/` (if now empty after the above)
- `LANDING PALM/` (after contents lifted up)
- `LANDING PALM.zip` (source is now the repo root)
- `node_modules/`, `package-lock.json` (regenerated against the new `package.json`)

### Preserved as-is

- `vault/` — reorganized but kept untracked (Section 6)
- `skills-lock.json` — tied to Claude Code skills setup, not Next.js
- `.claude/settings.json` — has uncommitted user changes; not touched by migration
- Git history — `git log` continues to show the Summa arc; no rewrites

## 4. Commit plan

Four commits, each leaving the repo in a coherent state. A fifth step ("Vault maintenance") is working-tree-only since `vault/` is untracked.

### Commit 1 — `feat: lift Palm landing to repo root`

Use `git mv` for every move so history is preserved per file.

- `git mv "LANDING PALM/index.html" index.html`
- `git mv "LANDING PALM/fonts" fonts`
- `git mv "LANDING PALM/mockups" mockups`
- `git mv "LANDING PALM/Card 1" "Card 1"`
- `git mv "LANDING PALM/Card 2" "Card 2"`
- `git mv "LANDING PALM/PalmLogoGradient.png" .`
- `git mv "LANDING PALM/Logo gradient gmail.png" .`
- `git mv "LANDING PALM/Palm Colours.png" .`
- `git mv "LANDING PALM/CONTEXTO_PROYECTO.md" .`
- Move `LANDING PALM/.claude/launch.json` into top-level `.claude/launch.json` (new file — top-level `.claude/` already exists)
- Edit `CONTEXTO_PROYECTO.md`: replace path references "LANDING PALM/" → "" (relative to repo root)
- Delete `LANDING PALM/.claude/settings.local.json` (or merge useful permissions into top-level `.claude/settings.json` — flag for user)
- Delete the now-empty `LANDING PALM/` directory
- Delete `LANDING PALM.zip`

**Verification:** `npx serve -p 3000 .` → `http://localhost:3000` renders the landing with all sections, all images load, shader animates, calculator works.

### Commit 2 — `chore: remove Next.js app and tooling`

Delete:
- `app/`, `components/`, `hooks/`, `__tests__/`
- Anything under `docs/` except the new `docs/specs/`
- `next.config.ts`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `next-env.d.ts`
- `postcss.config.mjs`, `eslint.config.mjs`, `jest.config.ts`
- `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/`, `public/favicon.ico`
- `public/` (if empty)
- `node_modules/`, `package-lock.json`

**Verification:** `npx serve -p 3000 .` still renders the landing. Nothing in Palm depended on the deleted files.

### Commit 3 — `chore: slim package.json to static-site dev deps`

Rewrite `package.json`:

```json
{
  "name": "palm-landing",
  "version": "0.1.0",
  "private": true,
  "description": "Palm Inversiones — static landing page",
  "scripts": {
    "dev": "serve -p 3000 .",
    "dev:live": "live-server --port=3000 ."
  },
  "devDependencies": {
    "serve": "^14.2.0"
  }
}
```

Add to `.gitignore` (create if missing):

```
node_modules/
.DS_Store
.wrangler/
.vscode/
*.log
```

Run `npm install` to generate the new `package-lock.json`.

**Verification:** `npm run dev` starts the server on port 3000. Page renders.

### Commit 4 — `docs: rewrite AGENTS.md and README for static-site reality`

Replace contents of `AGENTS.md` and `README.md` per Section 5.

**Verification:** `git diff` review only — no runtime impact.

### Vault maintenance (working tree only, not a commit)

`vault/` is untracked, so these changes don't produce git commits — they happen in the working tree only, after Commit 4 lands.

- Reorg per Section 6: move Summa-era notes into `vault/_archive/summa/`; promote Palm-only structure.
- Update `vault/landings/Palm — Vanilla HTML.md` file paths from `LANDING PALM/...` to repo-root paths.
- Append "Section C" to `vault/history/Timeline.md` describing the migration.
- Add `vault/conversations/2026-06-01 — Palm migration.md` session log.

If the user later decides to commit the vault, that's a separate, single commit covering all of the above.

## 5. `AGENTS.md` and `README.md` content

### `AGENTS.md`

```markdown
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
```

### `README.md`

```markdown
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

## Deploy

Pushes to `main` auto-deploy via Cloudflare Pages. DNS is managed in AWS Route53.
```

## 6. Vault treatment

### Reorg

```
vault/
├── Home.md                          ← rewritten: Palm-only as current
├── brand/                           ← unchanged
│   ├── Palm Inversiones.md
│   ├── Rebrand from Summa.md
│   ├── Audience.md
│   ├── Voice.md
│   └── Visual Identity.md
├── landings/
│   ├── Palm — Vanilla HTML.md       ← updated: paths now repo-root
│   └── Palm Section Map.md          ← unchanged
├── concepts/
│   ├── Anti-patterns.md             ← unchanged
│   └── Motion System.md             ← unchanged
├── history/
│   ├── Timeline.md                  ← appends migration as Section C
│   └── Decisions.md                 ← Summa decisions moved to _archive
├── conversations/
│   ├── Index.md
│   ├── 2026-06-01 — vault expansion.md
│   └── 2026-06-01 — Palm migration.md   ← new this session
└── _archive/
    └── summa/
        ├── README.md                ← "snapshot of Summa-era vault; recover code via commit 431a418"
        ├── architecture/            ← all 6 files moved here
        ├── components/              ← Component Map.md
        ├── concepts/
        │   ├── Design Language.md
        │   ├── Page Sections.md
        │   ├── Copy and Voice.md
        │   ├── Glossary.md
        │   └── Scroll Reveal.md
        ├── landings/
        │   └── Summa — Next.js.md
        └── decisions/
            └── Summa decisions.md   ← extracted from history/Decisions.md section A
```

### Edits to top-level files

- **`Home.md`** — drop the "two landings" table; lead with Palm; one-line pointer to `_archive/summa/` near the bottom.
- **`landings/Palm — Vanilla HTML.md`** — update file paths (`LANDING PALM/index.html` → `index.html`, etc.); drop the "untracked, not yet wired into repo" line; add CF Pages + Route53 deploy note.
- **`history/Timeline.md`** — append Section C documenting the migration.
- **`history/Decisions.md`** — move section A to `_archive/summa/decisions/Summa decisions.md`; section B promoted to top level (drop the A/B headers).

### Why archive instead of delete

Summa-era notes document the *why* behind decisions (hardcoded `+847`, doubled env-var prefix, no animation library). That reasoning has signal about brand posture even after the code is gone. `_archive/` keeps them findable without polluting the active reading path.

## 7. Acceptance

### Local

- [ ] `npm install && npm run dev` → `http://localhost:3000` renders Palm landing
- [ ] All sections visible: Navbar, Hero, Marquee, Problem, Process (4 steps), Pillars (+ Card 1/Card 2 animated cards), Calculator, Security, CTA-final, Footer, GradualBlur overlay
- [ ] Three.js shader animates in hero
- [ ] Calculator widget responds to slider + select; "años" number updates
- [ ] Fonts loaded (Neue Haas body + IBM Plex italic gold on `.kw` keywords)
- [ ] All mockup, Card 1, Card 2 images load (no broken images in DevTools)
- [ ] No console errors
- [ ] `git log --oneline | head -10` shows the planned commits in order

### Cloudflare Pages first deploy (out of repo scope)

- [ ] CF Pages project created, connected to repo
- [ ] Framework "None", build command empty, output directory `/`, root directory `/`
- [ ] `<project>.pages.dev` renders the landing
- [ ] Route53 record points the chosen domain at CF target
- [ ] Custom domain attached in CF Pages
- [ ] Production URL passes the local acceptance checklist

## 8. Out of scope

- Renaming the repo or working directory.
- Any visual change to the Palm landing. **1:1 preservation.**
- Cleaning up dead Motion code for pillar phones (`CONTEXTO_PROYECTO.md` §6).
- Removing residual 🇦🇷 emojis from marquee + footer.
- Reconciling `CONTEXTO_PROYECTO.md` with the actual current pillar content (the HTML has additional animated cards that the handoff doc doesn't describe). Flagged for a follow-up doc pass.
- Lead-capture backend (Cloudflare Worker, AWS Lambda, etc.) — deferred until there's product demand.

## 9. Open items at implementation time

1. **`LANDING PALM/.claude/settings.local.json`** — Commit 1 deletes it after extracting any useful permissions into the top-level `.claude/settings.json`. Confirm with user before discarding.
2. **`docs/superpowers/specs/2026-03-25-landing-redesign-design.md` and the plans/ counterpart** — these are Summa-era design docs. Commit 2 deletes them with the rest of the Summa scaffolding. They live in git history if needed.
3. **`.claude/settings.json` uncommitted changes** — not touched by any migration commit. If user wants them committed, that's a separate commit before or after this work.
4. **`skills-lock.json`** — kept by default. Flag if it turns out to be Next.js-era.
