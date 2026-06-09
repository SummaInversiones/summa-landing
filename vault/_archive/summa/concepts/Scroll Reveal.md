---
tags:
  - concepts
  - animation
---
# Scroll Reveal

The page uses a single `IntersectionObserver`-based fade/slide-in pattern, not a third-party animation library.

## How it works

- `hooks/useScrollReveal.ts` is mounted once at the page level (in `app/page.tsx`).
- It observes every element with class `.reveal` in the DOM.
- When an element intersects the viewport, the hook adds `.is-visible`.
- CSS handles the actual transition:

```css
.reveal       { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; }
}
```

## Usage
On any section element you want animated in: add `className="reveal"`. No props, no JS-side configuration. Stagger is achieved with Tailwind `delay-*` utilities or inline `style={{ transitionDelay }}`.

## Why this approach
- **No bundle cost.** Pure CSS + a tiny hook, no Framer Motion / GSAP.
- **Predictable.** One observer, one toggle. No animation timelines to reason about.
- **Reduced-motion safe** — the media query disables the transition entirely.

If you ever need scroll-driven, scrubbed, or pinned animations (parallax, scrub timelines), this pattern won't scale and you'd reach for GSAP/ScrollTrigger. There are exploration files in `public/animations-preview.html` and `public/gsap-gallery.html` but **GSAP is not a runtime dependency of the site.**

See [[../architecture/Styling System|Styling System]].
