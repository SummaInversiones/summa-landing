---
tags:
  - concepts
  - motion
  - palm
---
# Motion System — Palm

Three external libraries, plus vanilla CSS and one IntersectionObserver. **All external libs are loaded via ESM CDN** inside `<script type="module">` at the end of `<body>` — no npm, no bundler.

## Three.js — hero shader
- CDN: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js`
- Lazy import inside the first `<script type="module">`.
- Renders a fragment shader full-viewport into `#shader-bg` — animated RGB color lines.
- Paused when `.hero` exits viewport (IntersectionObserver).
- `pixelRatio` capped to 2.
- Honors `prefers-reduced-motion` and WebGL feature detection — falls back to the `--brand-gradient` background.

## Motion (Motion One) — element animations
- CDN: `https://cdn.jsdelivr.net/npm/motion@11.18.0/+esm`
- Imports: `animate`, `inView`.
- What it currently animates:
  - **Pillar phone wrappers** (`.pillar-phone-wrap`): entrance fade + scale + rotateX (`y: 28→0, scale: 0.92→1, rotateX: -18°→0°`), then infinite idle (`y` float + `rotateY` wobble). **Pillar 1 lost its phone and Pillar 2's phone became the calculator** — this code currently iterates over an empty NodeList. Dead but not broken.
  - **Inner phone-mockup** (`.pillar-phone-wrap .phone-mockup`): 3D tilt following the cursor (rotateX/rotateY mapped from mouse, capped at ±10°), scale 1.04 on hover, soft reset on leave. `@media (hover: hover) and (pointer: fine)` only. Same dead-code caveat.
  - **Hero hand-mockup** (`.hero-handshot`): replaces the CSS `float` keyframe with Motion-driven `y: [0, -10, 0]` + `rotate: [0, 0.6°, 0, -0.6°, 0]` infinite 6s. The CSS keyframe is disabled by setting `style.animation = 'none'`.
- Honors `prefers-reduced-motion`.

## mathjs — calculator
- CDN: `https://cdn.jsdelivr.net/npm/mathjs@13.2.0/+esm`
- **Lazy-loaded**: only imported when `.calc` enters within 200px of the viewport (IntersectionObserver `rootMargin`).
- Pre-fallback uses native `Math.log` so the first paint shows correct values even before mathjs loads.
- Compiles the expression once: `log(1 + FV * r / PMT) / log(1 + r)`. Re-evaluates with `{FV, PMT, r}` on each input event.
- Number formatting via `Intl.NumberFormat('es-AR')` — **not** mathjs, since that's the locale tool.

## IntersectionObserver scroll-reveal (vanilla)
- Class `.reveal` with optional `data-delay="100/200/300/400/500"` (ms).
- One global IO observes all `.reveal` nodes; adds `.in` on viewport entry, threshold 0.15.
- Stagger per section via the `data-delay` attributes.

## Marquee ticker (pure CSS)
- `@keyframes marquee` translateX(-50%), 25s linear infinite.
- Content duplicated 3× for a seamless loop.

## GradualBlur (pure CSS)
- 5 stacked layers, `backdrop-filter: blur()` exponentially increasing.
- Each layer has a `mask-image: linear-gradient()` for soft fade between blur tiers.
- No JS.

## Dead-code note
The Motion script for pillar phones (animate entrance + 3D tilt) iterates over empty NodeLists because the phone elements were removed. Doesn't throw; just doesn't do anything. Whether to delete depends on whether phone mockups might return — currently parked as a tradeoff in `CONTEXTO_PROYECTO.md` §6.

## See also
- [[../landings/Palm Section Map]]
- [[../landings/Palm — Vanilla HTML]]
