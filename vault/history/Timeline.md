---
tags:
  - history
  - timeline
---
# Timeline

Project-level history. Section A is the Summa Next.js arc; Section B is the Palm rebrand.

---

## A. Summa Next.js arc (committed)

### 2026-03-24/25 — Initial scaffold (`3094ad7`)
**`feat: initial landing page — Next.js 16, Tailwind v4, waitlist API`**
- Bootstrap with Next.js 16 App Router and Tailwind v4 (`@theme inline {}` in `globals.css`).
- Initial layout: minimal **dark-only** single page.
- Waitlist API built against `@vercel/kv`.
- `AGENTS.md` / `CLAUDE.md` established the rule: Next 16 has breaking changes — read `node_modules/next/dist/docs/` before writing code.

### 2026-03-25 — Migrate to Upstash (`8848f4a`)
**`feat(waitlist): migrate from deprecated @vercel/kv to @upstash/redis`**
- `@vercel/kv` had been deprecated; switched to the Upstash REST client.
- Code shape unchanged — same `SADD waitlist <email>` pattern.

### 2026-03-25 — Fix env var names (`86af870`)
**`fix(waitlist): use correct Upstash env var names from Vercel integration`**
- Vercel's Upstash integration provisions `UPSTASH_REDIS_REST_KV_REST_API_URL` / `_TOKEN` (note the doubled prefix).
- Production failed until the route used those exact names. **Don't tidy them.** See [[Decisions]].

### 2026-03-25 — Full landing redesign (`431a418`) — last Summa commit
**`feat: redesign landing page — 8 sections, glassmorphism, alternating dark/light`**
- Replaced the minimal dark page with the 8-section layout.
- Established the "Summa Modern Playful" design system. Spec: `docs/superpowers/specs/2026-03-25-landing-redesign-design.md`. Plan: `docs/superpowers/plans/2026-03-25-landing-redesign.md`.
- New components: `ProblemSolution`, `TrustSection`, `Benefits`, `FAQ`. Rewrites: `Nav`, `Hero`, `HowItWorks`, `FooterCTA`. Deleted: `SocialProof`, `ProblemCards`.
- Added section bg tokens, second float keyframe, reduced-motion guard, `WaitlistForm` `id` prop for deep-linking.

---

## B. Palm rebrand arc (untracked)

### Between 2026-03-25 and 2026-05-06 — `LANDING PALM/` appears
- A new vanilla HTML/CSS/JS landing for **Palm Inversiones** is built outside the Next.js app.
- Lives at `LANDING PALM/index.html` (~2300 lines, all inline).
- Self-contained `.claude/launch.json` configuring `npx serve` on port 3000.
- Brand pivots: "Summa" → "Palm Inversiones"; "with AI" framing dropped; "Bajate la app" CTA replaces the waitlist as the conversion goal.
- Authoritative handoff: `LANDING PALM/CONTEXTO_PROYECTO.md`.

### Section-by-section evolution inside the Palm landing
Captured from `CONTEXTO_PROYECTO.md` §4. Each is a decision that took effort to validate — don't revert without reason. See [[../concepts/Anti-patterns]] for the full list.

- Hero: centered + 100vh + AI badge + welcome block → asymmetric grid + store CTAs, no badge, no welcome.
- "Hasta ahora." headline: gradient text-fill → gold italic Plex (no gradient).
- Process screenshots: CSS phone bezel → drop-shadow only.
- Pillars: each had a phone screenshot → typography-only (Pillar 1 lost screenshot; Pillar 2's calc became its own section).
- Calculator: lived inside Pillar 2 → promoted to a standalone section between Pillars and Security.
- Security: cream background + Playfair Display + 4 icon-tile cards → navy + Statement Letter `<dl>`, no third typeface.
- CTA-final: brand-gradient sandwich + centered → navy + Statement Letter, left-aligned, no 📱 emoji.

### 2026-05-06 — Vault first established
- `vault/` initialized at repo root (untracked) with `architecture/`, `components/`, `concepts/`, `history/`. Documents the Summa Next.js side.

### 2026-06-01 — Vault expanded to cover Palm + rebrand + conversations (this session)
- Added `brand/`, `landings/`, `conversations/`.
- Updated `Home.md` to surface both landings.
- Logged this session in [[../conversations/2026-06-01 — vault expansion]].

---

## Working tree (uncommitted, as of 2026-06-01)
- `M .claude/settings.json`
- `M app/layout.tsx`
- `?? LANDING PALM.zip`
- `?? LANDING PALM/`
- `?? public/animations-preview.html`
- `?? public/gsap-gallery.html`
- `?? public/images/`
- `?? vault/`

These are exploration sandboxes + the entire Palm landing — not wired into the Vercel deployment. See [[../architecture/File Map]].

---

## C. Palm migration (committed)

### 2026-06-01 — Spec landed (`0eb95ec`)
**`docs: add Palm migration design spec`** — the planning artifact at `docs/specs/2026-06-01-palm-migration-design.md`.

### 2026-06-01 — Six migration commits
1. `feat: lift Palm landing to repo root` (`bacd3ef`) — `LANDING PALM/*` moved to top level.
2. `docs: drop stale settings.local.json reference` (`0a0d801`) — small CONTEXTO_PROYECTO.md cleanup.
3. `chore: remove Next.js app and Summa scaffolding` (`e8e79fd`) — `app/`, `components/`, etc. deleted. Recoverable from `431a418`.
4. `chore: slim package.json to static-site dev deps` (`39d40a4`) — `serve` dev dep only; `npm run dev` works.
5. `chore: harden dev scripts` (`9b058bf`) — `--no-port-switching` + `npx --yes live-server`.
6. `docs: rewrite AGENTS.md and README for static-site reality` (`7b950e1`) + `docs(agents): correct index.html line count` (`63fab61`) — static-site reality documented.

After this section, the repo's tracked code IS the Palm landing. Cloudflare Pages + Route53 replaces Vercel + Upstash. Summa code lives only in git history.
