---
tags:
  - architecture
  - styling
  - tailwind
---
# Styling System

## Tailwind v4

**No `tailwind.config.ts`.** All design tokens live in `app/globals.css` inside `@theme inline {}`. Adding a new color/font token here makes Tailwind generate the corresponding utility class (e.g. `--color-brand-green` → `bg-brand-green`, `text-brand-green`).

```css
@theme inline {
  --color-brand-dark:    #030213;
  --color-brand-green:   #90e24d;
  --color-brand-white:   #fcfcfc;
  --color-muted:         #ececf0;
  --color-muted-fg:      #717182;
  --color-section-dark:  #111111;
  --color-section-light: #F8F8FA;
  --font-sans: var(--font-inter), sans-serif;
}
```

The same vars are duplicated in `:root {}` (without the `--color-` prefix for some) for backwards compatibility / direct CSS use.

## Animations

Defined in `globals.css`, not via Tailwind plugins:
- `@keyframes float` + `.animate-float` — 4s alternating, used on hero floating elements.
- `@keyframes floatB` + `.animate-float-b` — 5s alternating, 0.8s delay (out of phase with `float`).
- `@keyframes fadeInUp` — declared but utility class not currently applied; reveal uses `.reveal` CSS transition instead.
- `.reveal` / `.reveal.is-visible` — opacity + translateY transition driven by `useScrollReveal`. See [[../concepts/Scroll Reveal|Scroll Reveal]].

## Reduced motion
A `@media (prefers-reduced-motion: reduce)` block disables `.animate-float*` and `.reveal` transitions. Always preserve this when adding new animations.

## Shape language (from design system)
- Pills (CTAs, nav): `rounded-full`
- Feature cards: `rounded-3xl` (28px)
- Trust/FAQ cards: `rounded-2xl` (16px)
- FooterCTA container: `rounded-[32px]`
- Glassmorphism: `backdrop-blur-md bg-white/10 border border-white/15`

## Section rhythm
The page alternates `--color-section-dark` and `--color-section-light`. See [[../concepts/Page Sections|Page Sections]].
