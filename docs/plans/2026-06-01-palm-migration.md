# Palm Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Summa Next.js landing with the vanilla HTML Palm landing at the repo root, deployable as a static site on Cloudflare Pages with DNS via AWS Route53. Preserves the audited Palm design 1:1.

**Architecture:** Four commits at the repo root. Commit 1 lifts `LANDING PALM/*` to the top level (verifying the served page works at every step). Commit 2 deletes the Next.js scaffold. Commit 3 slims `package.json` to a `serve`-only dev dep. Commit 4 rewrites `AGENTS.md` + `README.md` to describe the new static-site reality. A fifth working-tree-only step reorganizes the (untracked) `vault/` for Palm-only context.

**Tech Stack:** Vanilla HTML + inline CSS + inline JS. ESM CDN deps (Three.js 0.160.0, Motion 11.18.0, mathjs 13.2.0). Self-hosted Neue Haas Grotesk Pro + IBM Plex Sans (Google Fonts). Local dev via `npx serve` on port 3000. Deploy to Cloudflare Pages, DNS via AWS Route53.

**Spec:** `docs/specs/2026-06-01-palm-migration-design.md` (commit `0eb95ec`)

---

## File Structure (after migration)

### Top-level files / directories that will exist
- `index.html` — the entire page (moved from `LANDING PALM/index.html`)
- `CONTEXTO_PROYECTO.md` — Spanish handoff doc (moved + path refs updated)
- `PalmLogoGradient.png`, `Logo gradient gmail.png`, `Palm Colours.png` — loose assets at root
- `fonts/` — Neue Haas Grotesk Pro × 5 weights (moved from `LANDING PALM/fonts/`)
- `mockups/` — hero, problem, and step screenshots (moved)
- `Card 1/` — animated card assets (moved, name with space preserved verbatim — HTML references it as `Card%201/`)
- `Card 2/` — animated card assets (moved, same name caveat)
- `package.json` — slimmed; only `serve` as dev dep
- `package-lock.json` — regenerated against slim `package.json`
- `.gitignore` — adds `node_modules/`, `.DS_Store`, `.wrangler/`
- `README.md` — rewritten for static-site reality
- `AGENTS.md` — rewritten; no more Next.js 16 warning
- `CLAUDE.md` — unchanged (still contains `@AGENTS.md` reference)
- `.claude/launch.json` — moved from `LANDING PALM/.claude/launch.json`
- `.claude/settings.json` — unchanged
- `docs/specs/2026-06-01-palm-migration-design.md` — already committed (this plan's source spec)
- `docs/plans/2026-06-01-palm-migration.md` — this plan
- `vault/` — reorganized (working-tree only, stays untracked)
- `skills-lock.json` — kept untouched
- `.git/`, `.gitignore`, `node_modules/` (regenerated after Commit 3)

### Files / directories that will be deleted
- Whole Next.js app: `app/`, `components/`, `hooks/`, `__tests__/`
- Next.js / Tailwind / TS / Jest config: `next.config.ts`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `jest.config.ts`
- Stale public assets: `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/`, `public/favicon.ico`. Delete `public/` if empty after.
- Pre-existing Next.js `node_modules/` and `package-lock.json`
- Source folder + archive: `LANDING PALM/`, `LANDING PALM.zip`
- Pre-existing Summa-era docs that aren't this plan: anything under `docs/` other than `docs/specs/2026-06-01-palm-migration-design.md` and `docs/plans/2026-06-01-palm-migration.md`

### Files / directories that will be **touched only in working tree** (vault stays untracked)
- `vault/Home.md` — rewritten Palm-only
- `vault/landings/Palm — Vanilla HTML.md` — path refs updated
- `vault/landings/Summa — Next.js.md` — moved to archive
- `vault/history/Timeline.md` — append "Section C: Palm migration"
- `vault/history/Decisions.md` — Summa section moved to archive
- `vault/conversations/2026-06-01 — Palm migration.md` — new session log
- `vault/_archive/summa/` — new directory containing all Summa-era notes

---

## Pre-flight (one-time check before Task 1)

- [ ] **Step 1: Confirm starting state**

Run: `cd /home/tron-mrs/Summa/summa-landing && git status --short && git log -1 --format='%h %s'`

Expected output includes:
- `?? "LANDING PALM/"` and `?? "LANDING PALM.zip"` in the status
- Tracked `app/`, `components/`, etc. directories present (`ls app components hooks __tests__` should succeed)
- Last commit is `0eb95ec docs: add Palm migration design spec`

If any of those are missing, **stop and reconcile** — the rest of the plan assumes this starting state.

- [ ] **Step 2: Confirm spec + plan files exist**

Run: `ls docs/specs/2026-06-01-palm-migration-design.md docs/plans/2026-06-01-palm-migration.md`

Expected: both files listed, no errors. These two files are the only entries that should survive in `docs/` after Task 2.

---

## Task 1: Lift Palm landing to repo root (Commit 1)

**Files:**
- Move: `LANDING PALM/index.html` → `index.html`
- Move: `LANDING PALM/fonts/` → `fonts/`
- Move: `LANDING PALM/mockups/` → `mockups/`
- Move: `LANDING PALM/Card 1/` → `Card 1/` (space preserved)
- Move: `LANDING PALM/Card 2/` → `Card 2/` (space preserved)
- Move: `LANDING PALM/PalmLogoGradient.png` → `PalmLogoGradient.png`
- Move: `LANDING PALM/Logo gradient gmail.png` → `Logo gradient gmail.png`
- Move: `LANDING PALM/Palm Colours.png` → `Palm Colours.png`
- Move: `LANDING PALM/CONTEXTO_PROYECTO.md` → `CONTEXTO_PROYECTO.md`
- Move: `LANDING PALM/.claude/launch.json` → `.claude/launch.json`
- Modify: `CONTEXTO_PROYECTO.md` line 38 (root path label)
- Delete: `LANDING PALM/.claude/settings.local.json`, then `LANDING PALM/.claude/`, then `LANDING PALM/`, then `LANDING PALM.zip`

**Why plain `mv` (not `git mv`):** `LANDING PALM/` is untracked, so there's no git history to preserve. `mv` is equivalent and avoids quoting headaches with `git mv` and spaces in paths.

- [ ] **Step 1: Move the single-file assets**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mv "LANDING PALM/index.html" index.html
mv "LANDING PALM/CONTEXTO_PROYECTO.md" CONTEXTO_PROYECTO.md
mv "LANDING PALM/PalmLogoGradient.png" PalmLogoGradient.png
mv "LANDING PALM/Logo gradient gmail.png" "Logo gradient gmail.png"
mv "LANDING PALM/Palm Colours.png" "Palm Colours.png"
```

Verify: `ls index.html CONTEXTO_PROYECTO.md PalmLogoGradient.png "Logo gradient gmail.png" "Palm Colours.png"`
Expected: all 5 listed, no errors.

- [ ] **Step 2: Move the asset directories**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mv "LANDING PALM/fonts" fonts
mv "LANDING PALM/mockups" mockups
mv "LANDING PALM/Card 1" "Card 1"
mv "LANDING PALM/Card 2" "Card 2"
```

Verify: `ls -d fonts mockups "Card 1" "Card 2"`
Expected: all 4 directories listed.

Verify font files: `ls fonts/ | wc -l` → expect `5` (`.otf` × 3 + `.ttf` × 2).

Verify Card asset files referenced by index.html resolve:
```bash
ls "Card 1/Estrellas card.png" "Card 1/Decorative circles card.png" "Card 1/Lupa pelada.png" "Card 2/Objetivos.png"
```
Expected: all 4 listed, no "No such file" errors. These are the exact paths the HTML references (after URL-decoding `%20` to space).

- [ ] **Step 3: Move the inner `.claude/launch.json` up**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mv "LANDING PALM/.claude/launch.json" .claude/launch.json
```

Verify: `ls .claude/launch.json && head -3 .claude/launch.json`
Expected: file exists, first lines show `{"version": "0.0.1", "configurations": [`

- [ ] **Step 4: Discard the inner `.claude/settings.local.json`**

It contains Windows-path permissions from when the project was developed on a different machine. Nothing to merge.

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
rm "LANDING PALM/.claude/settings.local.json"
rmdir "LANDING PALM/.claude"
```

Verify: `ls -d "LANDING PALM/.claude" 2>&1`
Expected: `ls: cannot access 'LANDING PALM/.claude': No such file or directory`

- [ ] **Step 5: Remove the empty `LANDING PALM/` and the archive zip**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
ls "LANDING PALM/"
```
Expected: empty output (or `total 0` from `ls -la`). The directory should be empty.

If empty, remove it:
```bash
rmdir "LANDING PALM"
rm "LANDING PALM.zip"
```

Verify: `ls "LANDING PALM" "LANDING PALM.zip" 2>&1`
Expected: both report "No such file or directory".

- [ ] **Step 6: Update path reference in `CONTEXTO_PROYECTO.md`**

The file has exactly one occurrence of `LANDING PALM/` at line 38, as the root of the file-tree diagram in Section 2. After the lift, that line should describe the repo root.

Use Edit tool:
- File: `CONTEXTO_PROYECTO.md`
- old_string: `LANDING PALM/`
- new_string: `summa-landing/                    ← repo root after migration`

Verify: `grep -n "LANDING PALM" CONTEXTO_PROYECTO.md`
Expected: no matches (exit code 1).

- [ ] **Step 7: Verify the page renders before committing**

Start a dev server in the background:
```bash
cd /home/tron-mrs/Summa/summa-landing
npx --yes serve -p 3000 . > /tmp/serve.log 2>&1 &
SERVE_PID=$!
sleep 3
```

Smoke-test that the server responds with HTML and the fonts/images resolve:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/fonts/NHaasGroteskDSPro-55Rg.otf
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/mockups/Hero-section.png
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/Card%201/Lupa%20pelada.png"
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/Card%202/Objetivos.png"
```

Expected: five `200` lines. Any non-200 → stop and fix before committing.

Kill the server:
```bash
kill $SERVE_PID 2>/dev/null
```

- [ ] **Step 8: Stage and commit**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
git add index.html CONTEXTO_PROYECTO.md PalmLogoGradient.png "Logo gradient gmail.png" "Palm Colours.png" fonts mockups "Card 1" "Card 2" .claude/launch.json
git status --short
```

Expected `git status --short` output contains lines like:
- `A  index.html`
- `A  CONTEXTO_PROYECTO.md`
- `A  .claude/launch.json`
- `A  fonts/...` (multiple)
- `A  mockups/...` (multiple)
- `A  Card 1/...` (multiple)
- `A  Card 2/...` (multiple)
- `A  PalmLogoGradient.png`
- `A  Logo gradient gmail.png`
- `A  Palm Colours.png`
- Unchanged pre-existing modifications (`M .claude/settings.json`, `M app/layout.tsx`)
- Untracked `vault/`, `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/` — leave those alone for now

Commit:
```bash
git commit -m "$(cat <<'EOF'
feat: lift Palm landing to repo root

Move LANDING PALM/* contents to the top level so the served file tree
mirrors the repo. Discards the inner .claude/settings.local.json
(stale Windows-path permissions). The Summa Next.js code is still
present and untouched — deleted in the next commit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Verify: `git log -1 --format='%h %s' && git ls-files | grep -E '^(index\.html|fonts/|mockups/|Card 1/|Card 2/|CONTEXTO_PROYECTO\.md)' | head -8`
Expected: commit landed, all moved files now tracked.

---

## Task 2: Delete the Next.js app and Summa scaffolding (Commit 2)

**Files to delete (all tracked or known untracked):**
- `app/` (tracked)
- `components/` (tracked)
- `hooks/` (tracked)
- `__tests__/` (tracked)
- `next.config.ts`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `jest.config.ts` (tracked)
- `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/` (untracked)
- `public/favicon.ico` (tracked, but irrelevant — Palm uses its own logo)
- `public/` itself (delete if empty after the above)
- `node_modules/` (gitignored or tracked-as-folder — verify)
- `package-lock.json` (tracked; regenerated in Task 3)
- Any pre-existing `docs/` contents *except* `docs/specs/2026-06-01-palm-migration-design.md` and `docs/plans/2026-06-01-palm-migration.md`

- [ ] **Step 1: Catalog what's actually in `docs/`**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
find docs -type f | sort
```

Note every path that is NOT one of:
- `docs/specs/2026-06-01-palm-migration-design.md`
- `docs/plans/2026-06-01-palm-migration.md`

These will be deleted in Step 2. If `find` shows ONLY those two files, skip the `docs/` deletion in Step 2.

- [ ] **Step 2: Delete the Next.js scaffold**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
rm -rf app components hooks __tests__
rm -f next.config.ts tsconfig.json tsconfig.tsbuildinfo next-env.d.ts
rm -f postcss.config.mjs eslint.config.mjs jest.config.ts
rm -rf node_modules
rm -f package-lock.json
rm -f public/animations-preview.html public/gsap-gallery.html public/favicon.ico
rm -rf public/images
```

Delete pre-existing `docs/` contents that aren't the spec or plan (from Step 1 catalog). For example, if `docs/superpowers/` exists:
```bash
rm -rf docs/superpowers
```

Then collapse `public/` if empty:
```bash
rmdir public 2>/dev/null
```

Verify:
```bash
ls app components hooks __tests__ public/animations-preview.html node_modules package-lock.json 2>&1 | head -20
```
Expected: every line says "No such file or directory".

Verify the spec + plan survived:
```bash
ls docs/specs/2026-06-01-palm-migration-design.md docs/plans/2026-06-01-palm-migration.md
```
Expected: both listed, no errors.

- [ ] **Step 3: Verify the page still renders**

Same as Task 1 Step 7 — start server, curl 5 URLs, kill server.

```bash
cd /home/tron-mrs/Summa/summa-landing
npx --yes serve -p 3000 . > /tmp/serve.log 2>&1 &
SERVE_PID=$!
sleep 3
curl -s -o /dev/null -w "/ → %{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "font → %{http_code}\n" http://localhost:3000/fonts/NHaasGroteskDSPro-55Rg.otf
curl -s -o /dev/null -w "hero → %{http_code}\n" http://localhost:3000/mockups/Hero-section.png
curl -s -o /dev/null -w "card1 → %{http_code}\n" "http://localhost:3000/Card%201/Lupa%20pelada.png"
curl -s -o /dev/null -w "card2 → %{http_code}\n" "http://localhost:3000/Card%202/Objetivos.png"
kill $SERVE_PID 2>/dev/null
```

Expected: all 5 lines show `200`. Nothing in Palm depended on the deleted Next.js code; if any URL fails, stop and find why.

- [ ] **Step 4: Stage the deletions and commit**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
git add -A
git status --short | head -40
```

Expected:
- A long list of `D` (deleted) lines for the Next.js files
- `M .claude/settings.json` and `M app/layout.tsx` from Task 1 may still appear — `app/layout.tsx` will now show as `D app/layout.tsx` (deleted with the rest of `app/`)
- No `A` (added) lines

Commit:
```bash
git commit -m "$(cat <<'EOF'
chore: remove Next.js app and Summa scaffolding

Delete the React/Tailwind/Next.js codebase. The Summa landing is
recoverable from git history (last commit before this work was
431a418). All current page content lives in index.html at the
repo root.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Verify: `git log -1 --format='%h %s'`
Expected: shows the chore commit. `ls app 2>&1` → "No such file or directory".

---

## Task 3: Slim `package.json` to static-site dev deps (Commit 3)

**Files:**
- Modify: `package.json` (full rewrite)
- Create: `.gitignore` (or modify if it already exists)
- Create: `package-lock.json` (auto-generated via `npm install`)

- [ ] **Step 1: Rewrite `package.json`**

Use Write tool to overwrite `package.json` with:

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

Verify: `cat package.json`
Expected: file matches the above exactly.

- [ ] **Step 2: Create or extend `.gitignore`**

Check existing:
```bash
cd /home/tron-mrs/Summa/summa-landing
cat .gitignore 2>/dev/null || echo "(no .gitignore)"
```

If a `.gitignore` already exists, append the missing entries; if not, create one. Required entries:

```
node_modules/
.DS_Store
.wrangler/
.vscode/
*.log
```

Use Edit tool (if file exists) or Write tool (if not). Don't duplicate entries that are already present.

Verify: `grep -c "^node_modules/$\|^\.DS_Store$\|^\.wrangler/$" .gitignore`
Expected: `3`.

- [ ] **Step 3: Install `serve`**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
npm install
```

Expected: npm creates `node_modules/` and `package-lock.json`, prints something like `added N packages in Xs`. No errors.

Verify: `ls node_modules/serve package-lock.json`
Expected: both exist.

- [ ] **Step 4: Verify `npm run dev` works**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
npm run dev > /tmp/dev.log 2>&1 &
DEV_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
kill $DEV_PID 2>/dev/null
```

Expected: prints `200`.

- [ ] **Step 5: Stage and commit**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
git add package.json package-lock.json .gitignore
git status --short | head -10
```

Expected: `M package.json`, `?? package-lock.json` (new) or `M package-lock.json`, `M .gitignore` or `?? .gitignore`. No other surprises.

Commit:
```bash
git commit -m "$(cat <<'EOF'
chore: slim package.json to static-site dev deps

Replace Next.js / React / Tailwind / Jest deps with a single dev
dep on `serve`. `npm run dev` boots http://localhost:3000.
Adds .gitignore entries for node_modules, .wrangler, etc.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Verify: `git log -1 --format='%h %s' && cat package.json | head -10`

---

## Task 4: Rewrite `AGENTS.md` and `README.md` (Commit 4)

**Files:**
- Modify: `AGENTS.md` (full rewrite)
- Modify: `README.md` (full rewrite)
- `CLAUDE.md` is **not** modified — it still says `@AGENTS.md` and that's correct.

- [ ] **Step 1: Verify CLAUDE.md still references AGENTS.md**

Run: `cat CLAUDE.md`
Expected: contents include `@AGENTS.md` (the single reference Claude Code uses to pull project notes into context).

If `CLAUDE.md` is missing or doesn't reference `@AGENTS.md`, **stop and tell the user** — this plan assumes the existing structure.

- [ ] **Step 2: Rewrite `AGENTS.md`**

Use Write tool to overwrite `AGENTS.md` with:

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

Verify: `head -5 AGENTS.md`
Expected: starts with `# Palm Inversiones landing — agent notes`.

- [ ] **Step 3: Rewrite `README.md`**

Use Write tool to overwrite `README.md` with:

````markdown
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
````

Verify: `head -5 README.md`
Expected: starts with `# Palm Inversiones — landing`.

- [ ] **Step 4: Stage and commit**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
git add AGENTS.md README.md
git status --short | head -10
```

Expected: only `M AGENTS.md` and `M README.md` (plus pre-existing `M .claude/settings.json` if you've been carrying it forward — leave alone).

Commit:
```bash
git commit -m "$(cat <<'EOF'
docs: rewrite AGENTS.md and README for static-site reality

Drop the Next.js 16 warning and the React-stack project description.
Document the vanilla HTML stack, CDN ESM deps, local dev via
`npm run dev`, Cloudflare Pages deploy, AWS Route53 DNS.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Verify: `git log --oneline -5`
Expected: shows the 4 migration commits on top of `0eb95ec` and `431a418`.

---

## Task 5: Vault reorg (working tree only — NOT a commit)

`vault/` is untracked. These changes happen on disk and are **not** committed by this plan. If the user later decides to commit the vault, that's a separate, single commit.

**Files:**
- Modify: `vault/Home.md` (rewrite for Palm-only)
- Modify: `vault/landings/Palm — Vanilla HTML.md` (path refs `LANDING PALM/...` → repo-root paths; drop "untracked" line; add CF Pages + Route53 note)
- Modify: `vault/history/Timeline.md` (append "Section C: Palm migration")
- Modify: `vault/history/Decisions.md` (extract section A "Summa decisions" into `_archive`)
- Create: `vault/conversations/2026-06-01 — Palm migration.md`
- Create: `vault/_archive/summa/README.md`
- Move: `vault/architecture/` → `vault/_archive/summa/architecture/`
- Move: `vault/components/` → `vault/_archive/summa/components/`
- Move: `vault/concepts/{Design Language,Page Sections,Copy and Voice,Glossary,Scroll Reveal}.md` → `vault/_archive/summa/concepts/`
- Move: `vault/landings/Summa — Next.js.md` → `vault/_archive/summa/landings/`
- Create: `vault/_archive/summa/decisions/Summa decisions.md` (extracted content)

- [ ] **Step 1: Verify vault is untracked**

Run: `git status vault/ 2>&1 | head -3`
Expected: vault entries appear under "Untracked files" or no output (depending on git version). The point: nothing in `vault/` should appear as `M` or `A`.

If git shows tracked vault files, **stop** — the plan assumed untracked. Ask the user how to proceed.

- [ ] **Step 2: Create the archive skeleton**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mkdir -p vault/_archive/summa/architecture vault/_archive/summa/components vault/_archive/summa/concepts vault/_archive/summa/landings vault/_archive/summa/decisions
```

Use Write tool to create `vault/_archive/summa/README.md`:

```markdown
---
tags:
  - archive
  - summa
---
# Summa-era vault snapshot

These notes describe the Summa Next.js landing that was replaced by the Palm Inversiones vanilla HTML landing on 2026-06-01. The underlying code is preserved in git history — last Summa commit is `431a418` ("feat: redesign landing page — 8 sections, glassmorphism, alternating dark/light").

The notes are kept for the *why* behind decisions (hardcoded social-proof counter, doubled env-var prefix, no animation library). Active Palm context lives at the top of `vault/`.

To recover code: `git checkout 431a418 -- app/ components/ hooks/ __tests__/`.
```

- [ ] **Step 3: Move Summa-era notes into the archive**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mv vault/architecture/* vault/_archive/summa/architecture/
rmdir vault/architecture
mv vault/components/* vault/_archive/summa/components/
rmdir vault/components
mv "vault/concepts/Design Language.md" vault/_archive/summa/concepts/
mv "vault/concepts/Page Sections.md" vault/_archive/summa/concepts/
mv "vault/concepts/Copy and Voice.md" vault/_archive/summa/concepts/
mv vault/concepts/Glossary.md vault/_archive/summa/concepts/
mv "vault/concepts/Scroll Reveal.md" vault/_archive/summa/concepts/
mv "vault/landings/Summa — Next.js.md" vault/_archive/summa/landings/
```

Verify:
```bash
ls vault/concepts/
ls vault/landings/
ls vault/_archive/summa/concepts/
```
Expected:
- `vault/concepts/` contains only `Anti-patterns.md` and `Motion System.md` (the Palm-era ones)
- `vault/landings/` contains `Palm — Vanilla HTML.md` and `Palm Section Map.md`
- `vault/_archive/summa/concepts/` contains all 5 Summa-era concept files

- [ ] **Step 4: Extract Summa decisions into the archive**

Read the current `vault/history/Decisions.md` to identify "Section A. Summa Next.js decisions" — it spans from the heading `## A. Summa Next.js decisions` through the line `--- ` separator just before `## B. Palm (LANDING PALM/) decisions`.

Use Write tool to create `vault/_archive/summa/decisions/Summa decisions.md`:

```markdown
---
tags:
  - archive
  - summa
  - decisions
---
# Summa Next.js decisions (archived)

These decisions applied to the Summa Next.js landing that was deleted on 2026-06-01. Preserved for the *why* — the Palm landing makes different decisions on the same axes.

```

Then append the body of Section A from the current `Decisions.md` (everything from `### Keep doubled env var prefix ...` through `### Brand green is for accents only` and its `How to apply` paragraph) into this file.

Use Edit tool to remove the same content from `vault/history/Decisions.md` — delete:
- The line `> Section A covers the **Summa Next.js** landing (committed code). Section B covers **Palm Inversiones** (the rebrand, in `LANDING PALM/`).`
- The line `## A. Summa Next.js decisions`
- All `### ...` blocks under section A
- The `---` separator before section B
- The `## B. Palm (LANDING PALM/) decisions` heading (change to `## Decisions`)

And update the lead paragraph at the top to read:
```markdown
Non-obvious choices that have already been made on the Palm landing. Read before "improving" them.

> Summa-era decisions are archived at `_archive/summa/decisions/Summa decisions.md`.
```

Verify: `grep -n "Summa Next.js\|## A\.\|## B\." vault/history/Decisions.md`
Expected: no matches.

- [ ] **Step 5: Update `vault/landings/Palm — Vanilla HTML.md`**

The current file says paths are under `LANDING PALM/` and the landing is "untracked, not yet wired into repo". After migration, paths are at repo root and the landing IS the repo.

Use Edit tool. Three edits:

1. Replace path references:
   - old_string: `\`LANDING PALM/\` at the repo root. **Untracked** in git. Also archived at \`LANDING PALM.zip\`.`
   - new_string: `Repo root. The repo *is* the landing as of 2026-06-01.`

2. Replace the "How to run locally" section's `cd "LANDING PALM" && npx serve` block:
   - old_string: `cd "LANDING PALM" && npx serve\n# → http://localhost:3000`
   - new_string: `npm install && npm run dev\n# → http://localhost:3000`

3. Update the directory layout block — replace `LANDING PALM/\n├── index.html` etc. with the repo-root structure. (See spec Section 3 for the exact target.)

4. Append a new "Deploy" subsection at the bottom of "Status":
   ```markdown
   ## Deploy
   - **Cloudflare Pages**, git-integrated. Push to `main` auto-deploys.
   - Config: framework "None", build command empty, output directory `/`, root directory `/`.
   - DNS: **AWS Route53** points the apex (or `palm.<domain>`) at the CF Pages target.
   ```

Verify: `grep -n "LANDING PALM" "vault/landings/Palm — Vanilla HTML.md"`
Expected: no matches.

- [ ] **Step 6: Append Timeline Section C**

Use Edit tool to append to the END of `vault/history/Timeline.md`:

```markdown

---

## C. Palm migration (committed)

### 2026-06-01 — Spec landed (`0eb95ec`)
**`docs: add Palm migration design spec`** — the planning artifact at `docs/specs/2026-06-01-palm-migration-design.md`.

### 2026-06-01 — Four migration commits
1. `feat: lift Palm landing to repo root` — `LANDING PALM/*` moved to top level.
2. `chore: remove Next.js app and Summa scaffolding` — `app/`, `components/`, etc. deleted. Recoverable from `431a418`.
3. `chore: slim package.json to static-site dev deps` — `serve` dev dep only; `npm run dev` works.
4. `docs: rewrite AGENTS.md and README for static-site reality` — describes the static-site stack and Cloudflare Pages deploy.

After this section, the repo's tracked code IS the Palm landing. Cloudflare Pages + Route53 replaces Vercel + Upstash. Summa code lives only in git history.
```

- [ ] **Step 7: Rewrite `vault/Home.md` for Palm-only**

Use Write tool to overwrite `vault/Home.md` with:

```markdown
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
```

Verify: `head -20 vault/Home.md`
Expected: starts with `# Palm Inversiones — Context Vault`; no Summa landing reference in the MOC.

- [ ] **Step 8: Add the migration session log**

Use Write tool to create `vault/conversations/2026-06-01 — Palm migration.md`:

```markdown
---
tags:
  - conversations
  - 2026-06-01
  - palm
  - migration
---
# 2026-06-01 — Palm migration

## Goal
Replace the Summa Next.js landing with the vanilla HTML Palm landing at the repo root; deploy to Cloudflare Pages with DNS via AWS Route53.

## What changed
Four committed changes:
1. `feat: lift Palm landing to repo root` — `LANDING PALM/*` lifted up; inner `.claude/settings.local.json` discarded as stale (Windows paths).
2. `chore: remove Next.js app and Summa scaffolding` — `app/`, `components/`, `hooks/`, `__tests__/`, Next/Tailwind/TS/Jest config, `public/animations-preview.html` / `gsap-gallery.html` / `images/`, `LANDING PALM.zip`.
3. `chore: slim package.json to static-site dev deps` — `serve` only; `npm run dev` on port 3000; `.gitignore` extended.
4. `docs: rewrite AGENTS.md and README for static-site reality`.

Plus a working-tree-only vault reorg: Summa notes moved to `_archive/summa/`; `Home.md` rewritten Palm-only; `Decisions.md` split, Summa half archived; Timeline appended with Section C.

## What was rejected
- Full port to React + Tailwind v4 (Option B during brainstorming) — re-implementing 2300 lines of audited CSS/JS would risk regressions on every anti-pattern decision documented in the vault. Not worth the cost for a brochure site with no plans for additional pages.
- Vite + vanilla TS (Option C) — introduces a build step for a page that doesn't need one.
- Cloudflare Pages via `wrangler` CLI or GitHub Actions — git integration is lower-friction for a brochure site.
- Long-lived `summa-legacy` git branch — drift risk; the `431a418` snapshot is recovery enough.

## Open threads
- AWS Route53 record creation — out of repo scope.
- Cloudflare Pages first deploy + custom domain — done from the CF dashboard.
- Repo / working-directory rename (`summa-landing` → `palm-landing`) — deferred.
- Dead motion code for pillar phones, residual 🇦🇷 emojis — listed in `CONTEXTO_PROYECTO.md` §6 as deferred tech debt.
- Vault still untracked — decision deferred whether to commit it.
- The `developer-kit` plugin was disabled at the project level to allow git operations from Claude Code. If you re-enable it, the prevent-destructive-commands hook will block `git add` / `git commit` again.

## Spec / plan refs
- Spec: `docs/specs/2026-06-01-palm-migration-design.md` (commit `0eb95ec`)
- Plan: `docs/plans/2026-06-01-palm-migration.md`
```

Verify: `ls "vault/conversations/2026-06-01 — Palm migration.md" "vault/_archive/summa/README.md"`
Expected: both listed.

- [ ] **Step 9: Final vault sanity check**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
find vault -type f -name "*.md" | sort
```

Expected (paths relative to repo root):
- `vault/Home.md`
- `vault/_archive/summa/README.md`
- `vault/_archive/summa/architecture/...` (6 files)
- `vault/_archive/summa/components/Component Map.md`
- `vault/_archive/summa/concepts/...` (5 files)
- `vault/_archive/summa/decisions/Summa decisions.md`
- `vault/_archive/summa/landings/Summa — Next.js.md`
- `vault/brand/...` (5 files: Audience, Palm Inversiones, Rebrand from Summa, Visual Identity, Voice)
- `vault/concepts/Anti-patterns.md`
- `vault/concepts/Motion System.md`
- `vault/conversations/...` (3 files: Index, vault expansion, Palm migration)
- `vault/history/Decisions.md`
- `vault/history/Timeline.md`
- `vault/landings/Palm — Vanilla HTML.md`
- `vault/landings/Palm Section Map.md`

Verify no Summa content leaked into the top-level:
```bash
grep -ril "Next\.js\|Tailwind\|Upstash\|Vercel\|useScrollReveal" vault/ --include="*.md" | grep -v "_archive\|brand/Rebrand\|history/Timeline\|history/Decisions" | head -10
```
Expected: no output (only the archive + the rebrand history + Timeline section A/C may legitimately mention those — verify any matches are intentional).

---

## Final acceptance (after all 4 commits + vault reorg)

- [ ] **`npm install && npm run dev` → `http://localhost:3000` renders the Palm landing in a browser.**

Open the URL manually. Visually confirm:
- All 11 sections visible (Navbar → Hero → Marquee → Problem → Process 4 steps → Pillars + Card animations → Calculator → Security → CTA-final → Footer → GradualBlur overlay)
- Three.js shader animates in the hero (RGB color lines)
- Calculator: drag the "Aporte mensual" slider and change "Objetivo" — the "años" numbers update on each change
- Fonts: body text in Neue Haas, italicized gold keywords in IBM Plex
- All mockup, Card 1, Card 2 images load (no broken images)
- No JS console errors (open DevTools → Console)

- [ ] **`git log --oneline | head -6`** shows in order (most recent first):
  - `docs: rewrite AGENTS.md and README for static-site reality`
  - `chore: slim package.json to static-site dev deps`
  - `chore: remove Next.js app and Summa scaffolding`
  - `feat: lift Palm landing to repo root`
  - `docs: add Palm migration design spec` (`0eb95ec`)
  - `feat: redesign landing page — 8 sections, glassmorphism, alternating dark/light` (`431a418`)

- [ ] **`git status --short`** shows only:
  - pre-existing carryover modifications like `M .claude/settings.json` (if user is keeping those uncommitted)
  - untracked `vault/`
  - no other surprises

- [ ] **Vault structure** matches the layout in Task 5 Step 9.

---

## Out of scope (do NOT do these as part of this plan)

- Cloudflare Pages project creation, CF custom domain attach, Route53 record creation — all done from the CF and AWS dashboards.
- Repo rename (`summa-landing` → `palm-landing`).
- Working-directory rename.
- Any visual change to the Palm landing.
- Removing dead Motion code for pillar phones.
- Removing residual 🇦🇷 emojis from marquee + footer.
- Committing the vault.
- Reconciling `CONTEXTO_PROYECTO.md` §3 with the actual current pillar content (the HTML's animated cards aren't in the handoff doc).
