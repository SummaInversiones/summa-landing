---
tags:
  - architecture
---
# Architecture Overview

A single-page Next.js 16 marketing site. The page is a client component that composes 8 section components. The only server surface is one API route handling waitlist signups, backed by Upstash Redis.

## Shape

```
app/layout.tsx (RootLayout)
└── app/page.tsx ('use client', mounts useScrollReveal)
    ├── <Nav>              — fixed floating pill, switches theme on scroll
    ├── <Hero>             — dark; two-column; embeds <WaitlistForm id="waitlist-form">
    ├── <ProblemSolution>  — light
    ├── <HowItWorks>       — dark; 3 feature cards w/ glassmorphic mocks
    ├── <TrustSection>     — light; CNV / Allaria / IA+Humano cards
    ├── <Benefits>         — dark; bento grid
    ├── <FAQ>              — light; accordion (single-open)
    └── <FooterCTA>        — dark; embeds another <WaitlistForm>

         POST /api/waitlist
              │
              ▼
        Upstash Redis  (SADD waitlist <email>)
```

## Boundaries
- **Client:** every component is `'use client'`. The whole page hydrates as one tree.
- **Server:** only `app/api/waitlist/route.ts`. It reads env vars at module load and writes to Redis.
- **No DB, no auth, no CMS.** All copy is hard-coded in component JSX.
- **No images for product visuals** — the "phone mockup" is pure CSS/SVG glassmorphism.

See [[Stack]], [[Rendering Model]], [[Waitlist API]], [[../components/Component Map|Component Map]].
