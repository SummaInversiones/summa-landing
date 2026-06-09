---
tags:
  - architecture
  - rendering
---
# Rendering Model

## Layout
`app/layout.tsx` is a **server component** (default).
- Sets `<html lang="es">` and `--font-inter` variable.
- Defines `metadata` (title, description, OpenGraph, locale `es_AR`).
- Imports `app/globals.css`.
- Renders only `<body>{children}</body>`.

## Page
`app/page.tsx` is `'use client'`.
- Reason: it calls the `useScrollReveal()` hook, which uses `IntersectionObserver` and must run in the browser.
- The whole component subtree is therefore client-rendered. There are no server components below `page.tsx`.

## Components
Every section component is also `'use client'`. They:
- Hold their own state if interactive (e.g. `<WaitlistForm>`, `<FAQ>` accordion).
- Hard-code copy in JSX (no MDX, no CMS).
- Use Tailwind utility classes; tokens come from `globals.css`.

## API Routes
`app/api/waitlist/route.ts` exports `POST` per Next App Router convention. It runs in the Node.js runtime (default — no `runtime = 'edge'` declared). The Upstash REST client works in either, so this is changeable if cold-start cost ever matters.

## Why the page is fully client
- One interactive page, no SEO-critical dynamic content beyond `<head>` (handled in `layout.tsx`).
- Scroll-based reveal animations require browser APIs.
- Splitting into server shell + client islands was deemed over-engineering for a pre-launch landing page. See [[../history/Decisions|Decisions]].

## SEO
Meta is set in `layout.tsx` `metadata` export. There is no sitemap, no robots, no structured data yet — appropriate for waitlist phase.
