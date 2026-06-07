# Palm Production Cutover — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans for the AGENT tasks. Steps use checkbox (`- [ ]`) syntax. **Steps tagged `[USER]` are outward-facing (live DNS / Cloudflare dashboard / secrets) and are run by the user, not the agent.**

**Goal:** Make the Next.js app the production marketing site at `www.palminversiones.com` (canary first), lift `palm-app/` to the repo root, retire `index.html`, and decommission the old static Cloudflare Pages site — with rollback at every step.

**Architecture:** Approach A — (1) canary the OpenNext Worker (renamed `palm-landing`) on `new.palminversiones.com`; (2) lift the app to the repo root and retire the static files; (3) promote to `www` (apex 301→www) and decommission Pages. The zone is already on Cloudflare, so Worker custom domains are available.

**Tech Stack:** Next.js 16, OpenNext Cloudflare adapter, `wrangler`, Cloudflare dashboard, Upstash Redis.

**Spec:** `docs/specs/2026-06-07-palm-prod-cutover-design.md`
**Branch:** work on `feat/prod-cutover`. All paths below are repo-relative to `/home/tron-mrs/Summa/summa-landing`.

**No automated tests change here** — verification is the existing suite (`npm test`, 10/10) plus `npm run build` and `npx opennextjs-cloudflare build`. There is no new logic to TDD; the gates are green builds + a clean working tree + the user's production validation.

---

## PHASE 1 — Canary on `new.palminversiones.com`

### Task 1: Rename the Worker to `palm-landing` [AGENT]

**Files:** Modify `palm-app/wrangler.jsonc`

- [ ] **Step 1: Update the worker name and self-reference binding** (both must match). In `palm-app/wrangler.jsonc` set:
```jsonc
"name": "palm-landing",
```
and in the `services` array:
```jsonc
"service": "palm-landing"
```

- [ ] **Step 2: Validate config parses**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx wrangler deploy --dry-run 2>&1 | head -20
```
Expected: dry-run summary naming `palm-landing`, no parse error (auth errors are fine).

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/wrangler.jsonc
git commit -m "chore(cutover): rename worker to palm-landing"
```

### Task 2: Add the canary custom domain [AGENT config; USER deploy]

**Files:** Modify `palm-app/wrangler.jsonc`

- [ ] **Step 1: Add the canary route** to `palm-app/wrangler.jsonc` (top level, sibling of `name`):
```jsonc
"routes": [
  { "pattern": "new.palminversiones.com", "custom_domain": true }
]
```

- [ ] **Step 2: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/wrangler.jsonc
git commit -m "chore(cutover): canary custom domain new.palminversiones.com"
```

- [ ] **Step 3: `[USER]` Set the Upstash secrets on the new worker name** (secrets are per-worker; the rename creates a new worker, so `palm-landing` needs its own). From `palm-app/`:
```bash
npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_URL
npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_TOKEN
```
(Paste the real values when prompted.)

- [ ] **Step 4: `[USER]` Deploy — provisions `new.palminversiones.com` + deploys**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run deploy
```
Expected: deploy succeeds; output shows the custom domain `new.palminversiones.com` provisioned. (If `wrangler` lacks zone permission to provision, add the domain in the dashboard: Workers & Pages → `palm-landing` → Settings → Domains & Routes → Add → `new.palminversiones.com`.)

### Task 3: Validate the canary [USER]

- [ ] **Step 1: `[USER]` Verify the site in production** at `https://new.palminversiones.com` on desktop and mobile: all sections render, hero shader runs, calculator updates live, card animations play, scroll reveals fire.

- [ ] **Step 2: `[USER]` Verify the waitlist persists** — submit a real email on the canary and confirm it lands in Upstash (`SMEMBERS waitlist` via the Upstash console, or the app returns `{ok:true}` / 200).

**Phase 1 exit criteria:** canary behaves identically to the preview and the waitlist stores. Do NOT proceed to Phase 2 until the user confirms.

---

## PHASE 2 — Lift `palm-app/` to the repo root [AGENT]

> Goal of this phase: the Next.js app becomes the root project; retired static files are preserved (untracked experiments are user-created — preserve, don't delete). Verify green builds, then redeploy to the canary to confirm the lifted tree still serves.

### Task 4: Preserve retired root files into `legacy/`

**Files:** Create `legacy/`; move `index.html` + experimental `*.html` + loose brand images into it.

- [ ] **Step 1: Create legacy/ and move the tracked static landing + loose brand PNGs**
```bash
cd /home/tron-mrs/Summa/summa-landing
mkdir -p legacy
git mv index.html legacy/index.html
git mv "Logo gradient gmail.png" "legacy/Logo gradient gmail.png"
git mv "Palm Colours.png" "legacy/Palm Colours.png"
git mv PalmLogoGradient.png legacy/PalmLogoGradient.png
```

- [ ] **Step 2: Move the UNTRACKED experimental pages into legacy/ and track them** (preserve user-created work; don't delete)
```bash
cd /home/tron-mrs/Summa/summa-landing
for f in assets.html bento-refined.html bento-variants.html charts.html concepts.html constellations.html gallery.html index_copy.html showcase.html; do
  [ -e "$f" ] && git mv -f "$f" "legacy/$f" 2>/dev/null || { [ -e "$f" ] && mv "$f" "legacy/$f"; }
done
git add legacy/
```
(`git mv` works for tracked files; the `||` branch handles untracked ones via plain `mv`, then `git add legacy/` stages them all.)

- [ ] **Step 3: Commit the archive**
```bash
cd /home/tron-mrs/Summa/summa-landing
git commit -m "chore(cutover): archive static landing + experiments into legacy/"
```

### Task 5: Remove duplicated asset dirs and the obsolete static package files

**Files:** Remove root `fonts/ mockups/ Card 1/ Card 2/` (now duplicated in `palm-app/public/`) and the static-site `package.json`/`package-lock.json`.

- [ ] **Step 1: Remove the duplicated asset directories** (content is preserved in `palm-app/public/` and git history)
```bash
cd /home/tron-mrs/Summa/summa-landing
git rm -r fonts mockups "Card 1" "Card 2"
```

- [ ] **Step 2: Remove the obsolete static-site package files** (the app's own will move into root next)
```bash
cd /home/tron-mrs/Summa/summa-landing
git rm package.json package-lock.json
```

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git commit -m "chore(cutover): drop duplicated root assets and static package files"
```

### Task 6: Lift the app from `palm-app/` to the repo root

**Files:** Move every `palm-app/` entry to root; remove the empty `palm-app/`.

- [ ] **Step 1: Move tracked app dirs and files to root**
```bash
cd /home/tron-mrs/Summa/summa-landing
for entry in app components lib public components.json eslint.config.mjs next.config.ts open-next.config.ts package.json package-lock.json postcss.config.mjs tsconfig.json vitest.config.ts wrangler.jsonc; do
  git mv "palm-app/$entry" "$entry"
done
```

- [ ] **Step 2: Move the app's `.gitignore` to root** (replaces nothing critical; merged in Task 7)
```bash
cd /home/tron-mrs/Summa/summa-landing
git mv palm-app/.gitignore .gitignore.app
```
(Temporary name to avoid clobbering the root `.gitignore`; merged in Task 7.)

- [ ] **Step 3: Move the app's docs over the root ones** (force — these get rewritten in Task 8)
```bash
cd /home/tron-mrs/Summa/summa-landing
git rm AGENTS.md README.md CLAUDE.md
git mv palm-app/AGENTS.md AGENTS.md
git mv palm-app/README.md README.md
git mv palm-app/CLAUDE.md CLAUDE.md
```

- [ ] **Step 4: Move the gitignored dev-only files (not tracked) and drop build cruft**
```bash
cd /home/tron-mrs/Summa/summa-landing
[ -e palm-app/.dev.vars ] && mv palm-app/.dev.vars .dev.vars
[ -e palm-app/next-env.d.ts ] && mv palm-app/next-env.d.ts next-env.d.ts
rm -rf palm-app/.next palm-app/.open-next palm-app/.wrangler palm-app/node_modules palm-app/tsconfig.tsbuildinfo
```

- [ ] **Step 5: Confirm `palm-app/` is empty, then remove it**
```bash
cd /home/tron-mrs/Summa/summa-landing
ls -a palm-app
rmdir palm-app
```
Expected: `ls` shows only `.` and `..`; `rmdir` succeeds. If anything remains, inspect and move/remove it deliberately before `rmdir`.

- [ ] **Step 6: Commit the lift**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add -A
git commit -m "feat(cutover): lift Next.js app from palm-app/ to repo root"
```

### Task 7: Reconcile `.gitignore` at root

**Files:** Modify `.gitignore` (merge root + app), remove `.gitignore.app`.

- [ ] **Step 1: Write the merged root `.gitignore`** — base it on the app's `.gitignore.app` (Next/OpenNext/wrangler ignores) plus keep ignoring the editor/OS cruft the old root ignored. Ensure it includes at least:
```gitignore
# dependencies
/node_modules
# next / opennext / wrangler
/.next/
/out/
/.open-next/
/.wrangler/
next-env.d.ts
*.tsbuildinfo
# env / secrets
.env*
.dev.vars*
!.dev.vars.example
# vercel (legacy, harmless)
.vercel
# OS
.DS_Store
```

- [ ] **Step 2: Remove the temporary app gitignore**
```bash
cd /home/tron-mrs/Summa/summa-landing
git rm .gitignore.app
git add .gitignore
```

- [ ] **Step 3: Verify nothing important is now ignored/untracked unexpectedly**
```bash
cd /home/tron-mrs/Summa/summa-landing
git status --short | head -30
git check-ignore node_modules .next .open-next .dev.vars && echo "build/secret dirs correctly ignored"
```

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git commit -m "chore(cutover): merge .gitignore at repo root"
```

### Task 8: Rewrite `AGENTS.md`, `README.md`, `CLAUDE.md` for the app-at-root reality

**Files:** Modify `AGENTS.md`, `README.md` (keep `CLAUDE.md` as the `@AGENTS.md` include).

- [ ] **Step 1: Rewrite `AGENTS.md`** to describe: Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn app at the repo root; deployed as a Cloudflare Worker via `@opennextjs/cloudflare` (`npm run dev` / `build` / `preview` / `deploy`); worker `palm-landing` on `www.palminversiones.com`; the waitlist API (`app/api/waitlist/route.ts` → Upstash, doubled-prefix env vars); the **Next 16 breaking-changes warning** ("read `node_modules/next/dist/docs/01-app/` before writing Next code"); vault design-lock pointers (`vault/concepts/Anti-patterns.md`, `vault/history/Decisions.md`); and that `legacy/` holds the retired static landing. Remove all stale "static site / CF Pages / output `/` / Route53" statements.

- [ ] **Step 2: Rewrite `README.md`** to match (stack, dev/build/deploy commands, deploy target = Cloudflare Worker, DNS = Cloudflare).

- [ ] **Step 3: Verify `CLAUDE.md`** still contains only `@AGENTS.md` (the include). Leave as-is if so.

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add AGENTS.md README.md CLAUDE.md
git commit -m "docs(cutover): rewrite AGENTS/README for Next.js app at root"
```

### Task 9: Verify the lifted tree builds, tests, and bundles

- [ ] **Step 1: Clean install at root**
```bash
cd /home/tron-mrs/Summa/summa-landing && npm install
```
Expected: installs with no errors.

- [ ] **Step 2: Tests**
```bash
cd /home/tron-mrs/Summa/summa-landing && npm test
```
Expected: 10/10 pass.

- [ ] **Step 3: Next build**
```bash
cd /home/tron-mrs/Summa/summa-landing && npm run build
```
Expected: compiles; `/` static, `/api/waitlist` dynamic.

- [ ] **Step 4: OpenNext build**
```bash
cd /home/tron-mrs/Summa/summa-landing && npx opennextjs-cloudflare build
```
Expected: `.open-next/worker.js` produced.

- [ ] **Step 5: Commit any lockfile/regenerated changes**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add package-lock.json
git commit -m "chore(cutover): refresh lockfile after root install" || echo "nothing to commit"
```

### Task 10: Redeploy the canary from the lifted tree [USER deploy]

- [ ] **Step 1: `[USER]` Deploy from root and confirm the canary still serves**
```bash
cd /home/tron-mrs/Summa/summa-landing && npm run deploy
```
Expected: deploys `palm-landing`; `https://new.palminversiones.com` still renders correctly (now built from the root tree).

**Phase 2 exit criteria:** clean root tree; `npm test` + both builds green; canary healthy from the lifted tree. Merge `feat/prod-cutover` → `main` here (use superpowers:finishing-a-development-branch) before Phase 3, or after — user's call.

---

## PHASE 3 — Promote to `www` + decommission [USER drives; AGENT preps]

### Task 11: Point the Worker at `www` [AGENT config; USER deploy]

**Files:** Modify `wrangler.jsonc` (now at root)

- [ ] **Step 1: Replace the canary route with `www`** in `wrangler.jsonc`:
```jsonc
"routes": [
  { "pattern": "www.palminversiones.com", "custom_domain": true }
]
```

- [ ] **Step 2: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add wrangler.jsonc
git commit -m "chore(cutover): point worker at www.palminversiones.com"
```

- [ ] **Step 3: `[USER]` Deploy to provision `www`**
```bash
cd /home/tron-mrs/Summa/summa-landing && npm run deploy
```
Expected: `www.palminversiones.com` provisioned and serving the Worker. (Dashboard fallback as in Task 2 Step 4 if needed.)

### Task 12: Apex → www redirect [USER]

- [ ] **Step 1: `[USER]` Create a Cloudflare Redirect Rule** (dashboard → the `palminversiones.com` zone → Rules → Redirect Rules → Create):
  - When incoming requests match: hostname equals `palminversiones.com`
  - Then: Static/Dynamic redirect to `https://www.palminversiones.com/${http.request.uri.path}` (or concatenated path+query), status **301**, preserve query string.

- [ ] **Step 2: `[USER]` Verify** `https://palminversiones.com` 301-redirects to `https://www.palminversiones.com`, and `www` serves the app. Check desktop + mobile.

### Task 13: Validate, retire canary, decommission Pages [USER]

- [ ] **Step 1: `[USER]` Full production validation** on `www`: every section, shader, calculator, card animations, a real waitlist submission (persists to Upstash).

- [ ] **Step 2: `[USER]` Remove the `new.palminversiones.com` custom domain** (dashboard → `palm-landing` → Domains & Routes → remove `new.`). Optionally delete the old `palm-app-preview` worker.

- [ ] **Step 3: `[USER]` Decommission the old static site** — disable the old Cloudflare **Pages** project first (keep it for a cool-off as rollback), then delete it once `www` is proven over a day or two.

- [ ] **Step 4: `[USER]` Verify email still flows** — send to and from `dev@palminversiones.com`; confirm MX/SPF/DKIM records were never touched.

**Rollback (any time in Phase 3):** in the dashboard, remove the Worker's `www` custom domain and re-point `www`/apex DNS at the still-present Pages project; the static `legacy/index.html` site returns.

---

## Definition of done
- `www.palminversiones.com` serves the React app (Worker `palm-landing`); apex 301→www; `new.` removed.
- Repo root *is* the Next.js app; `index.html` + experiments preserved under `legacy/`; `npm test` + `npm run build` + OpenNext build all green from root.
- Old CF Pages project decommissioned; email unaffected.
- Work merged to `main`.

## Out of scope
- `app.palminversiones.com` (future product).
- Enrich-phase visual work.
- Renaming the git repo / working directory.
- Any change to non-web DNS records (MX/SPF/DKIM/etc.).
