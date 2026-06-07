# Palm landing — production cutover to the Next.js app (design)

**Date:** 2026-06-07
**Status:** Approved (design)
**Builds on:** `docs/specs/2026-06-07-palm-react-migration-design.md` (the React migration, now merged to `main` in `palm-app/`).

## Context

The faithful React/Next.js 16 port of the Palm landing lives in `palm-app/` and is
deployed as an OpenNext **Cloudflare Worker** (`palm-app-preview`, on `*.workers.dev`).
Production today is the **static `index.html` on Cloudflare Pages**, served at
`palminversiones.com` (apex) with DNS managed **in Cloudflare** (the zone is on
Cloudflare, not external).

Goal: make the React app the production marketing site at **`www.palminversiones.com`**
(canonical), retire the static site, and lift the app to the repo root — without
disrupting the live site or email, and with a clean rollback at every step.

### Key facts / constraints
- The zone `palminversiones.com` is **already managed by Cloudflare** → Worker custom
  domains/routes are available with no registrar/nameserver migration.
- The app is an OpenNext **Worker**, not Pages. Pages custom domains tolerate external
  DNS; Worker custom domains require the Cloudflare-managed zone (satisfied here).
- `www` is the marketing site; **`app.` is reserved** for the future product application
  and is out of scope.
- Email (`dev@palminversiones.com`, MX records) lives in the same Cloudflare zone and
  **must not be touched**.
- Some actions are outward-facing infra (live DNS, CF dashboard, deleting the Pages
  project). Those are **executed by the user**; the agent prepares exact commands and
  config but does not run production domain promotions.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Sequencing | **Canary → repo lift → promote** (Approach A) | Validate the running app in production on a throwaway subdomain before the big repo move or touching `www`; isolate each risky step. |
| Canary host | **`new.palminversiones.com`** | Temporary real-production validation host; removed after promotion. |
| Canonical host | **`www.palminversiones.com`** | User-chosen; `app.` reserved for the product. |
| Apex behavior | **`palminversiones.com` 301 → `www`** via a Cloudflare Redirect Rule | Single canonical host; avoids serving the app on two hostnames. |
| Worker name | **`palm-landing`** (rename from `palm-app-preview`) | Production-appropriate; self-reference service binding updated in lockstep. |
| Repo layout | **Lift `palm-app/` → repo root; remove `index.html`, experimental `*.html`, duplicate asset dirs** | User-chosen clean end state; the React app becomes the root project. Old files remain in git history. |
| Old Pages project | **Keep during canary + initial promotion, then decommission** | Instant rollback target until the Worker is proven on `www`. |
| Custom-domain provisioning | **Declare in `wrangler.jsonc` `routes` (`custom_domain: true`)** where possible; dashboard fallback | Lets `wrangler deploy` provision the domain; user runs/approves the production ones. |

### Rejected alternatives
- **Lift repo first, then canary** — couples the large file move with cutover debugging.
- **Skip the lift / keep subdir** — user wants the app at root.
- **Serve the app on both apex and www** — redundant; canonical `www` + apex redirect is cleaner.

## End state

```
repo root/
  app/  components/  lib/  public/        # the Next.js app (lifted from palm-app/)
  next.config.ts  open-next.config.ts  wrangler.jsonc  tsconfig.json
  components.json  eslint.config.mjs  postcss.config.mjs  package.json
  vitest.config.ts  worker-configuration.d.ts
  docs/  vault/                            # unchanged
  AGENTS.md  README.md  CLAUDE.md          # rewritten for the Next.js reality
  (no index.html, no bento-*.html/charts.html/etc., no root fonts/ mockups/ Card 1/2)
```
- Worker `palm-landing` serving `www.palminversiones.com`; apex 301→www; `new.` removed.
- CF Pages project deleted/disabled. Email MX untouched.

## Phases

### Phase 1 — Canary (agent prepares; user approves the domain step)
1. Rename the Worker: `wrangler.jsonc` `name` → `palm-landing` **and** the
   `WORKER_SELF_REFERENCE` `service` → `palm-landing` (must match).
2. Re-set the Upstash secrets on the new worker name (secrets are per-worker; renaming
   creates a new worker): `wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_URL` /
   `..._TOKEN` (user runs, with their values).
3. Add the canary custom domain in `wrangler.jsonc`:
   ```jsonc
   "routes": [{ "pattern": "new.palminversiones.com", "custom_domain": true }]
   ```
4. `npm run deploy` → provisions `new.palminversiones.com` and deploys the Worker.
5. **User validates** the full site + waitlist at `https://new.palminversiones.com`
   (desktop + mobile): all sections, shader, calculator, card animations, and a real
   waitlist submission storing to Upstash.

**Exit criteria:** canary renders and behaves identically to the preview; waitlist
persists; no console/runtime errors the user notices.

### Phase 2 — Repo lift (agent)
1. Move every app file from `palm-app/` to the repo root (`app/`, `components/`, `lib/`,
   `public/`, all configs, `package.json`/`package-lock.json`, `tsconfig.json`,
   `components.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`,
   `open-next.config.ts`, `wrangler.jsonc`, `vitest.config.ts`,
   `worker-configuration.d.ts`, the app's `README.md`/`AGENTS.md`/`CLAUDE.md`). Do not
   move `.dev.vars` content values; keep it gitignored.
2. Delete the obsolete root files: `index.html`; the experimental pages
   (`assets.html`, `bento-refined.html`, `bento-variants.html`, `charts.html`,
   `concepts.html`, `constellations.html`, `gallery.html`, `index_copy.html`,
   `showcase.html`); the now-duplicated `fonts/`, `mockups/`, `Card 1/`, `Card 2/`,
   and loose root images already copied into `public/`; the obsolete static-site
   `package.json`/`package-lock.json` (replaced by the app's); stale build dirs
   (`.next/`, `.vercel/`, `.sixth/`, root `node_modules/`) per `.gitignore`.
3. Merge `.gitignore` (root + app) into one at the root covering Next/OpenNext/wrangler.
4. Rewrite `AGENTS.md`, `README.md`, `CLAUDE.md` for the Next.js-app-at-root reality
   (stack, `npm run dev`/`build`/`preview`/`deploy`, Cloudflare Worker + OpenNext, the
   waitlist env vars, the Next 16 "read node_modules/next/dist/docs" warning, and the
   vault design-lock pointers).
5. Fix any path assumptions broken by the move (none expected — paths are app-relative).
6. Verify: `npm install` (clean), `npm test` (10/10), `npm run build`,
   `npx opennextjs-cloudflare build` — all green from the root.
7. Redeploy to the canary (`npm run deploy`) and confirm `new.palminversiones.com`
   still serves correctly from the lifted tree.

**Exit criteria:** clean root tree; all builds/tests green; canary still healthy.

### Phase 3 — Promote + decommission (user drives; agent preps commands)
1. Add production custom domains to the Worker (swap the canary route for):
   ```jsonc
   "routes": [
     { "pattern": "www.palminversiones.com", "custom_domain": true }
   ]
   ```
   `npm run deploy` provisions `www`. (User runs/approves.)
2. Apex redirect: create a Cloudflare **Redirect Rule** `palminversiones.com/*` →
   `https://www.palminversiones.com/$1` (301). (User, dashboard.)
3. Validate `https://www.palminversiones.com` + apex redirect in production.
4. Remove the `new.palminversiones.com` custom domain.
5. **Decommission** the old CF Pages project (disable, then delete after a cool-off).
6. Verify email still flows (send/receive `dev@palminversiones.com`) — MX untouched.

**Rollback (any point in Phase 3):** remove the Worker's `www` custom domain and
re-point `www`/apex to the still-present Pages project; the static site returns.

## Division of labor
- **Agent:** all repo/code/doc/`wrangler.jsonc` changes; build/test verification; exact
  `wrangler`/dashboard command lists; non-production canary deploy config.
- **User (outward-facing):** `wrangler login`/secrets with real values; approving/running
  the production domain provisions; the CF Redirect Rule; deleting the Pages project;
  final DNS/email verification.

## Risks & mitigations
- **Repo lift breaks the build.** → Phase 2 gate: full build + tests + OpenNext build
  green before any promotion; canary redeploy confirms.
- **Worker rename loses Upstash secrets.** → Phase 1 step 2 re-sets them on `palm-landing`.
- **Custom-domain provisioning perms.** → If `wrangler` can't provision, fall back to
  adding the custom domain in the CF dashboard (Workers → the worker → Domains).
- **Apex redirect misfires / loop.** → Use a single Redirect Rule apex→www only; verify
  before deleting Pages.
- **Email disruption.** → Never edit MX/TXT(SPF/DKIM) records; only add the web
  Worker-domain records. Verify mail post-cutover.
- **Premature Pages deletion.** → Keep Pages alive through canary + initial `www`
  validation; delete only after the cool-off.

## Out of scope
- The `app.palminversiones.com` product application.
- The enrich phase (richer visuals beyond the faithful port).
- Renaming the git repo / working directory (`summa-landing`).
- Any change to email/DNS records other than the web host.
