---
tags:
  - concepts
  - glossary
---
# Glossary

## Product / domain

- **Summa** — the product. AI-driven personal investment advisor for Argentina. Pitched as "tu asesor financiero que realmente es tuyo."
- **Acceso anticipado** — early access / waitlist. The CTA copy used in `<Nav>`.
- **Asesor** — adviser; how the product refers to itself in copy.
- **CNV** — Comisión Nacional de Valores, Argentina's securities regulator. Cited in `<TrustSection>` for legitimacy.
- **Allaria** — local brokerage, infrastructure partner referenced in `<TrustSection>`.
- **IA + Humano** — "AI + human" trust pillar; emphasis that the system is supervised, not autonomous.

## Repo / code

- **Section** — one of the 8 top-level components composed by `app/page.tsx`. See [[Page Sections]].
- **Pill** — `rounded-full` element. Pattern shared by Nav container, CTA buttons, and overline badges.
- **Glassmorphism** — `backdrop-blur-md bg-white/10 border border-white/15`. Used only on dark sections.
- **Reveal** — element animated in by `useScrollReveal`. Has `.reveal` class; gets `.is-visible` toggled. See [[Scroll Reveal]].
- **Sentinel** — invisible div Nav observes via IntersectionObserver to switch its theme dark↔light.
- **Variant** — `'dark' | 'light'` prop accepted by `WaitlistForm`. Switches input chrome.
- **Token** — design value declared in `@theme inline {}` in `globals.css`. Drives Tailwind utility generation. See [[../architecture/Styling System|Styling System]].
