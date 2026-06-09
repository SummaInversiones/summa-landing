---
tags:
  - concepts
  - design
---
# Design Language — "Summa Modern Playful"

The redesign approved on 2026-03-25 (commit `431a418`) defines the visual language. Source of truth: `docs/superpowers/specs/2026-03-25-landing-redesign-design.md`.

## Pillars

1. **Alternating sections.** Dark (`#111111`) and light (`#F8F8FA`) sections alternate down the page to give rhythm.
2. **Glassmorphism on dark, clean official on light.** Translucent cards belong only on dark sections; light sections use solid surfaces with `--color-muted` borders.
3. **Pill shape language.** Buttons, nav, and overline badges are all `rounded-full`. Cards use larger radii (16/28/32px).
4. **Brand green as accent, not background.** `#90e24d` (`--color-brand-green`) is reserved for primary CTAs and small badges. Don't paint sections with it.
5. **Playful but trustworthy.** Hero gradients and floating mocks lean playful; trust section is intentionally restrained.

## Color tokens
See [[../architecture/Styling System|Styling System]] for the canonical list.

| Token | Hex | Used for |
|---|---|---|
| `--color-brand-dark` | `#030213` | Default body text on light bg |
| `--color-brand-green` | `#90e24d` | Primary CTAs, accent strokes |
| `--color-brand-white` | `#fcfcfc` | Body bg, light text on dark bg |
| `--color-section-dark` | `#111111` | Dark section bg |
| `--color-section-light` | `#F8F8FA` | Light section bg |
| `--color-muted` | `#ececf0` | Borders, dividers on light |
| `--color-muted-fg` | `#717182` | Secondary text on light |

## Type
- Family: **Inter** via `next/font/google`, weights 400/500/700.
- Hero H1: `text-[44px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.1]`.
- Body: default `text-base` / `text-lg`. On dark, prefer `text-white/60` for secondary copy.

## Micro-interactions
- Cards: `hover:translate-y-[-6px] transition-transform duration-300`.
- CTAs: `active:scale-[0.97] transition-transform duration-150`, plus `hover:scale-[1.02]`.
- Floating elements: `.animate-float` / `.animate-float-b` (out of phase).

## Reduced motion
All custom animations and the `.reveal` transition are disabled under `prefers-reduced-motion: reduce`. Always preserve this when extending.

See [[Page Sections]] for how the language applies per section.
