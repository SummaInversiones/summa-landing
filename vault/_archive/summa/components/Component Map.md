---
tags:
  - components
  - map
---
# Component Map

Every component is `'use client'`. All copy is hard-coded in JSX.

## Composition
Imported and rendered in order by `app/page.tsx`:
`Nav → Hero → ProblemSolution → HowItWorks → TrustSection → Benefits → FAQ → FooterCTA`.
See [[../concepts/Page Sections|Page Sections]] for theme/role of each.

## Components

### `Nav.tsx`
Fixed floating pill at `top-4`, centered. Theme switches via `IntersectionObserver` on a sentinel inside `<Hero>`:
- On dark hero in view → translucent-white pill (`bg-white/10`).
- After scrolling past sentinel → translucent-dark pill (`bg-black/5`).
Desktop shows three anchor links; mobile shows logo + CTA only. CTA scrolls to `#waitlist-form`.

### `Hero.tsx`
Two-column on `lg`, stacked below.
- Left: overline pill, H1, subhead, primary CTA, social-proof counter (hardcoded "+847"), embedded `<WaitlistForm id="waitlist-form" variant="dark" />`.
- Right: pure-CSS portfolio mock — radial-gradient blob (`opacity-60 blur-3xl`) + glassmorphic cards with mock balance, growth pill, SVG sparkline. No images.
- Contains the **theme sentinel** Nav observes.

### `ProblemSolution.tsx`
Light section. Two-column copy: pain on the left, resolution on the right, separated by a green divider stroke.

### `HowItWorks.tsx`
Anchor `#como-funciona`. Three gradient feature cards in a row (stack on mobile). Each card has a glassmorphic mock UI element representing the step. Hover: `translate-y-[-6px]`.

### `TrustSection.tsx`
Light. Three trust cards: **CNV** (regulator), **Allaria** (broker partner), **IA + Humano** (supervised AI). Plus a small "trust bar" of small institutional marks. Tone is intentionally restrained.

### `Benefits.tsx`
Anchor `#beneficios`. Bento grid — 3 tiles of varied sizes. Dark glassmorphic surfaces.

### `FAQ.tsx`
Anchor `#faq`. 4-item accordion with **single-open** state (opening one closes the others). Pure React state, no library.

### `FooterCTA.tsx`
Final dark section. Rounded card (`rounded-[32px]`) with mesh-gradient bg, headline + second `<WaitlistForm variant="dark">`. Footer baseline (legal/contact) sits below.

### `WaitlistForm.tsx`
The only component used in two places. Props:
```ts
{ variant?: 'dark' | 'light'; id?: string }
```
- Local state machine: `'idle' | 'loading' | 'success' | 'error'`.
- `POST`s `{ email }` to `/api/waitlist`. On 2xx → renders just *"Ya estás en la lista."*; on error → inline red message.
- Uses `useId()` for the input/label association.
- The `id` prop is forwarded to the outermost `<div>` so the Nav CTA and Hero CTA can deep-link to `#waitlist-form`.
See [[../architecture/Waitlist API|Waitlist API]].

## Hooks

### `useScrollReveal()` (`hooks/useScrollReveal.ts`)
Mounted once in `app/page.tsx`. Observes all `.reveal` elements and toggles `.is-visible` when they intersect. See [[../concepts/Scroll Reveal|Scroll Reveal]].
