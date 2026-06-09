---
tags:
  - architecture
  - filemap
---
# File Map

```
app/
├── layout.tsx                  Server. Metadata, Inter font, html lang="es".
├── page.tsx                    Client. Composes 8 sections; mounts useScrollReveal.
├── globals.css                 Tailwind v4 entry, tokens, keyframes, reduced-motion.
└── api/
    └── waitlist/route.ts       POST. Upstash SADD into 'waitlist' set.

components/
├── Nav.tsx                     Floating pill nav, theme switches via IntersectionObserver.
├── Hero.tsx                    Dark hero, two-column, CSS portfolio mock.
├── ProblemSolution.tsx         Light. Problem/solution copy w/ green divider.
├── HowItWorks.tsx              Dark. 3 gradient feature cards w/ glassmorphic mocks.
├── TrustSection.tsx            Light. CNV / Allaria / IA+Humano cards.
├── Benefits.tsx                Dark. Bento grid, varied tile sizes.
├── FAQ.tsx                     Light. Accordion, single-open state.
├── FooterCTA.tsx               Dark. Mesh-gradient CTA card; embeds WaitlistForm.
└── WaitlistForm.tsx            Email input + button; dark|light variant; calls /api/waitlist.

hooks/
└── useScrollReveal.ts          IntersectionObserver → toggles .is-visible on .reveal.

__tests__/
└── api/waitlist.test.ts        API contract test.

docs/
└── superpowers/
    ├── specs/2026-03-25-landing-redesign-design.md
    └── plans/2026-03-25-landing-redesign.md

public/                         Static assets (incl. animations-preview.html, gsap-gallery.html — exploration artifacts, not linked from the site).
```

## Path alias
`@/*` maps to repo root (see `tsconfig.json`). Components import each other with `@/components/...` and the hook with `@/hooks/...`.

## Files NOT to "clean up"
- `public/animations-preview.html`, `public/gsap-gallery.html`, `public/images/` — exploration sandboxes; harmless and may be referenced.
- The duplicated env-var prefix (`UPSTASH_REDIS_REST_KV_REST_API_URL`). See [[Waitlist API]].
