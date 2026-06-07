# Palm landing → Next.js (React) migration — design

**Date:** 2026-06-07
**Status:** Approved (design)
**Supersedes direction of:** `docs/specs/2026-06-01-palm-migration-design.md` (which migrated *from* Next.js to vanilla HTML)

## Context

On 2026-06-01 the team deliberately removed a Next.js + React + Tailwind v4 app
(brand "Summa") and replaced it with a single-file vanilla `index.html` (brand
"Palm"). A full React port was considered and rejected at the time because the
site was "a brochure with no plans for additional pages" and re-implementing the
audited CSS/JS risked regressions on documented anti-pattern decisions.

That calculus has changed. The user now wants:

1. **A foundation for a future Palm product/app** — this landing is step one
   toward a real web app (auth, dashboard) later.
2. **Access to the React component ecosystem** — richer animation, 3D, charts,
   shadcn — to build more visually detailed sections than are comfortable to
   hand-write as inline JS in one 4,400-line file.
3. **A real waitlist backend.**

The current `index.html` has grown to ~4,425 lines (~2,800 of CSS, 10 main
sections plus richer "bento"/scanner modules that have outgrown the vault's
section map).

### Hard constraints (vault-locked design decisions)

These are NOT up for relitigation during this migration. Sources:
`vault/history/Decisions.md`, `vault/concepts/Anti-patterns.md`,
`vault/landings/Palm Section Map.md`.

- Palette is locked: navy `#101B3B`, gold `#F0C14D`, blue `#26428B`,
  violet `#9747FF`, cream `#FFFCF5`, dark `#0A1428`, card `#0D1830`,
  alert `#E5484D` (alert is a declared exception, scanner `$` only).
- Two-font rule: Neue Haas Grotesk Pro (display, self-hosted) + IBM Plex Sans
  (numerics/italic keywords). No third typeface.
- Keyword italics always use the `.kw` treatment (IBM Plex italic medium gold).
- **Page Theme Lock**: every section renders on `--navy`. No cream/white sections.
- Hero is asymmetric 2-col (copy left, iPhone right), never centered + 100vh.
- No gradient text-fill on headlines.
- No icon-tile feature grids; no CSS phone bezels (drop-shadow screenshots only).
- No "con IA" / "with AI" framing.
- Calculator stays its own section; disclaimer stays in lockstep with the
  0%-solo / 15%-Palm assumptions.
- Marquee keeps its middle-dots; the trust strip does not.
- Three.js hero shader and the GradualBlur overlay are kept; shader pauses
  offscreen via IntersectionObserver; GradualBlur honors
  `prefers-reduced-transparency: reduce`.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Scales to the future app; gives API routes for the waitlist; same family as the proven archived Summa stack. |
| Styling | **Tailwind v4 `@theme`** (no `tailwind.config.ts`) | Matches old `globals.css`; tokens map cleanly from `:root`. |
| CSS strategy | **Keep audited hand-authored CSS**; Tailwind handles tokens, layout scaffolding, and new work | Lowest-regression path; the intricate scanner/bento/shader CSS is audited and survives best as authored CSS. |
| Hosting | **Cloudflare via `@opennextjs/cloudflare`** | Keeps the existing Route53 → Cloudflare DNS unchanged. (Exact adapter version/config to be confirmed against live docs in the plan.) |
| Animation lib | **GSAP + `useGSAP`** for the enrich phase | GSAP skills already installed in this repo; stronger scroll/timeline control for the "visual richness" goal. Faithful pass first reproduces current `motion@11` reveals. |
| Calculator math | **`mathjs`** as a real dependency, still lazy-loaded | Parity with current behavior; keep `Math.log` pre-fallback. |
| Waitlist store | **Upstash Redis** (`SADD waitlist <email>`) | REST-based, runs on Cloudflare Workers; reuses documented env var names and the permissive regex; parity with old Summa route. |
| Fidelity | **Faithful port first, enrich second** | Lower regression risk against vault anti-patterns; user-approved sequencing. |

### Rejected alternatives

- **Vite + React SPA + separate CF function** — lighter, stays on Cloudflare
  trivially, but no built-in SSR/routing/API; weakens the "future app" story.
- **Astro + React islands** — best landing perf, but it is a content-site
  framework that fights the "foundation for a product app" goal.

## Architecture

### Project layout

```
app/
  layout.tsx          self-hosted fonts (@font-face), metadata, <body> navy
  page.tsx            section composition (server component where possible)
  globals.css         Tailwind v4 @theme tokens + reset + @property + keyframes
  api/waitlist/route.ts   POST → Upstash SADD
components/
  Navbar.tsx          floating pill, .scrolled compress past 200px, burger sheet
  Hero.tsx            asymmetric 2-col grid, shader background, store buttons
  Marquee.tsx         CSS keyframe ticker (keeps middle-dots)
  Problem.tsx         2-col text/figure, "Hasta ahora." gold italic Plex
  Process.tsx         <ol> of 4 letter-format steps, side alternates by parity
  Pillars.tsx         2 typography-only cards (+ bento cards that grew in)
  Calculator.tsx      range + select + annuity result, lazy mathjs
  Security.tsx        Statement Letter <dl> trust signals, one-signal hover
  CtaFinal.tsx        left-aligned Statement Letter + store buttons
  Footer.tsx          single line, brand-gradient top border
  GradualBlur.tsx     fixed 5-layer backdrop-blur overlay
  scanner/            Card-1 lupa / bento interactive modules
lib/
  shader.ts           Three.js hero RGB-line shader + offscreen-pause hook
  annuity.ts          time-to-target compound-annuity math
public/
  mockups/  Card 1/  Card 2/  fonts/   (assets moved from repo root)
```

Each vault section maps to exactly one component file. Components are
`'use client'` only where interactivity requires it; no premature server/client
splitting.

### Styling migration

- Port the two `:root` blocks verbatim into Tailwind v4 `@theme`: the 8 palette
  tokens, the RGB triplets (`--cream-rgb` etc.), `--brand-gradient`, the two
  font stacks (`--font-display`, `--font-num`), and the layout tokens
  (`--container`, `--pad-x`, `--pad-y`).
- The `@property --scan-x` / `@property --scan-y` registrations and all keyframes
  move into `globals.css` unchanged (the scanner masks depend on them being
  registered animatable inherited custom properties).
- Tailwind utilities cover layout scaffolding and any new work; the audited
  scanner/bento/shader/calculator CSS is carried over as authored CSS, not
  rewritten utility-by-utility.

### Interactive modules

- **Hero shader** (`lib/shader.ts`): Three.js `0.160` RGB-line shader rendered to
  a canvas ref inside a `useEffect`-style hook; **must** keep the
  IntersectionObserver that pauses rendering when offscreen.
- **Reveals**: faithful pass reproduces the current `motion@11` `inView` reveals
  using the npm `motion` package; enrich pass migrates to GSAP + ScrollTrigger.
- **Calculator** (`Calculator.tsx` + `lib/annuity.ts`): `compile('log(1 + FV * r / PMT) / log(1 + r)')`
  time-to-target annuity, `mathjs` dynamically imported on viewport entry,
  `Math.log` fallback for first paint. Disclaimer text stays paired with the
  0%/15% assumptions.
- **Scanner/lupa + bento**: client components driven by the same `--scan-x/-y`
  CSS variables and `@property` registrations.

### Waitlist backend

`POST /api/waitlist`:

- Parse `{ email }`, normalize `toLowerCase().trim()`.
- Validate with the permissive regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- `SADD waitlist <email>` against Upstash Redis via `@upstash/redis`.
- Env vars: `UPSTASH_REDIS_REST_KV_REST_API_URL` and
  `UPSTASH_REDIS_REST_KV_REST_API_TOKEN` (doubled prefix is intentional, from
  Vercel's Upstash integration; re-provision for Cloudflare in the plan).
- Returns `{ ok: true }` on success; `400` on invalid email; `500` on store error.

## Migration phases

1. **Scaffold** — Next.js + TS + Tailwind v4 + `@opennextjs/cloudflare`; move
   fonts and image assets into `public/`; port `:root` tokens into `@theme`;
   confirm an empty/placeholder page builds and deploys to Cloudflare.
2. **Faithful port** — implement each section component top-to-bottom,
   reproducing current markup/CSS/behavior 1:1. Visual-diff against `index.html`
   served on `:3000`. No design changes in this phase.
3. **Backend** — implement and test `api/waitlist/route.ts`; wire any form UI.
4. **Enrich** (only after Phase 2 sign-off) — add the richer visuals, one
   section at a time, each checked against the vault anti-patterns.

`index.html` remains in the repo untouched as the visual reference until Phase 2
is signed off.

## Testing & verification

Scaled to a brochure site:

- **`lib/annuity.ts`** — unit tests (it has real logic; exercise the
  fallback and the mathjs path agree, and edge inputs).
- **`api/waitlist/route.ts`** — route tests with a mocked Upstash client:
  valid email stored, invalid email rejected, store error → 500.
- **Components** — smoke render (no crash, key copy present).
- **Primary gate** — manual visual diff of each ported section against the
  current `index.html`.

## Risks & mitigations

- **Regressing a vault anti-pattern.** Mitigation: faithful-first sequencing;
  the "What stays locked" list is the checklist; enrich phase reviews each
  section against `vault/concepts/Anti-patterns.md`.
- **`@opennextjs/cloudflare` config drift.** My training may lag the current
  adapter API. Mitigation: confirm against live Cloudflare/OpenNext docs in the
  plan before scaffolding; keep code host-agnostic where practical.
- **Self-hosted font paths.** `file://` won't resolve `@font-face`; ensure fonts
  live under `public/fonts/` with correct `@font-face` URLs and preload.
- **Repo still named `summa-landing`.** Out of scope; do not auto-rename paths.

## Out of scope

- Renaming the repo / working directory.
- AWS Route53 record changes (none needed — staying on Cloudflare).
- Building the future product app itself (this is only its foundation).
- Deleting or modifying `index.html` before Phase 2 sign-off.
