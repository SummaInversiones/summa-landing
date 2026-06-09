---
tags:
  - archive
  - summa
  - decisions
---
# Summa Next.js decisions (archived)

These decisions applied to the Summa Next.js landing that was deleted on 2026-06-01. Preserved for the *why* — the Palm landing makes different decisions on the same axes.

### Keep doubled env var prefix `UPSTASH_REDIS_REST_KV_REST_API_*`
**Why:** That's the exact shape Vercel's Upstash integration provisions. The `_REST_KV_REST_` is not a typo. Renaming broke prod once already (commit `86af870`).
**How to apply:** When editing `app/api/waitlist/route.ts`, leave the env var names alone. If you must rename, update the Vercel integration too.

### Whole page is `'use client'`
**Why:** The page mounts `useScrollReveal()`, which uses `IntersectionObserver`. Splitting into a server shell + client islands was deemed overkill for a one-page waitlist site.
**How to apply:** Don't introduce server components beneath `app/page.tsx` for ergonomic reasons. If you need server data, fetch it in `layout.tsx` and pass via props, or add a new route segment.

### Hardcoded "+847 personas" social-proof counter
**Why:** Showing a live `SCARD waitlist` would expose the real (small, pre-launch) number — counter-productive for social proof. The hardcoded number was an explicit copy/marketing decision, not laziness.
**How to apply:** Don't wire it to Redis. If you ever do, gate it behind a minimum threshold.

### Tailwind v4 with no `tailwind.config.ts`
**Why:** v4 moves token declaration into CSS via `@theme inline {}`. The single `globals.css` is the source of truth.
**How to apply:** Add new tokens there, not in a JS config. Don't reintroduce `tailwind.config.ts` — it would be ignored or conflict.

### No animation library at runtime
**Why:** A CSS `.reveal` class plus one IntersectionObserver hook covers every effect on the page. GSAP/Framer Motion would add bundle for nothing.
**How to apply:** Keep using `.reveal` + Tailwind delays. If a future feature genuinely needs scrubbing/pinning/timelines, propose GSAP explicitly — don't sneak it in.
The files `public/animations-preview.html` and `public/gsap-gallery.html` are exploration only; they are not linked from the site.

### Validation regex is intentionally permissive
**Why:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` catches obvious typos without rejecting valid international/edge-case addresses. Strict RFC validation in JS regex is impossible and high-effort low-value here.
**How to apply:** Don't replace with a "stricter" regex without a real reason.

### Single Redis SET, key `waitlist`
**Why:** `SADD` is naturally idempotent — duplicate signups are silently deduped. Email is normalized (`toLowerCase().trim()`) before insert so case variants don't double-count.
**How to apply:** Keep using `SADD`. If you need richer per-email metadata later, migrate to a hash; don't bolt timestamps onto the set.

### Brand green is for accents only
**Why:** `#90e24d` is high-saturation; using it as a section background looks toy-like and undercuts the trust message.
**How to apply:** Reserve it for primary CTAs and small badges. Section backgrounds use `--color-section-dark` / `--color-section-light`.
