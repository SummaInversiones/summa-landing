---
tags:
  - landing
  - summa
  - legacy
---
# Summa Landing — Next.js (legacy)

## Status
This is the **original landing**, built under the "Summa" brand. It is still:
- **Committed** to git (the main tracked code in `app/` and `components/`).
- **Presumably still deployed** at the Vercel project tied to this repo.
- **Out of sync with the brand** — the product has been rebranded to Palm.

The current direction is [[Palm — Vanilla HTML]]. This page is preserved as institutional memory.

## Location
- App Router pages: `app/` (`layout.tsx`, `page.tsx`, `globals.css`, `api/waitlist/route.ts`).
- Components: `components/` — `Nav`, `Hero`, `ProblemSolution`, `HowItWorks`, `TrustSection`, `Benefits`, `FAQ`, `FooterCTA`, `WaitlistForm`.
- Hook: `hooks/` (likely `useScrollReveal`).
- Tests: `__tests__/`.
- Specs / plans: `docs/superpowers/specs/`, `docs/superpowers/plans/`.

## Stack
- **Next.js 16** (App Router). Breaking changes from Next.js < 16 — see `AGENTS.md`: "read `node_modules/next/dist/docs/` before writing code."
- **Tailwind v4** — tokens declared in `globals.css` via `@theme inline {}`. **No `tailwind.config.ts`.**
- **TypeScript**.
- **Jest** for tests.
- **Upstash Redis** via `@upstash/redis` (migrated from deprecated `@vercel/kv`).

## Waitlist API
`POST /api/waitlist` → `SADD waitlist <normalized email>` against Upstash.
- Env vars (from Vercel's Upstash integration): `UPSTASH_REDIS_REST_KV_REST_API_URL` and `UPSTASH_REDIS_REST_KV_REST_API_TOKEN`. **Doubled prefix is intentional.**
- Email normalized: `toLowerCase().trim()`.
- Validation regex permissive: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.

See [[../architecture/Waitlist API]] and [[../history/Decisions]] for the full reasoning.

## Page structure (8 sections)
See [[../concepts/Page Sections]]. Alternating dark/light theme, glassmorphism accents, hardcoded "+847 personas" social-proof counter.

## Design system
**Summa Modern Playful.** Brand green `#90e24d` reserved for accents only — never section backgrounds. See [[../concepts/Design Language]].

## Key files to remember
- `app/layout.tsx` — root layout, fonts, metadata.
- `app/page.tsx` — whole page is `'use client'` because `useScrollReveal` needs `IntersectionObserver`.
- `app/api/waitlist/route.ts` — the only server route.
- `app/globals.css` — Tailwind v4 token source.

## Constraints carried over
- The page is `'use client'` end-to-end on purpose. Don't split into server components without need.
- No animation library (`gsap`, `framer-motion`) at runtime. CSS `.reveal` + IntersectionObserver only.
- The "+847" counter is **hardcoded** — do not wire it to Redis.

## See also
- [[Palm — Vanilla HTML]]
- [[../brand/Rebrand from Summa]]
- [[../architecture/Overview]]
- [[../components/Component Map]]
