---
tags:
  - concepts
  - sections
---
# Page Sections

The 8 sections composed by `app/page.tsx`, in order. Theme alternates dark/light. Each section is one component file under `components/`.

| # | Section | Theme | Component | Role |
|---|---|---|---|---|
| 1 | Nav | floats over all | `Nav.tsx` | Persistent floating pill, switches dark↔light theme via IntersectionObserver on a hero sentinel. |
| 2 | Hero | dark `#111111` | `Hero.tsx` | Headline, subhead, CTA, social-proof counter, embedded `<WaitlistForm id="waitlist-form">`, glassmorphic portfolio mock. |
| 3 | Problem & Solution | light `#F8F8FA` | `ProblemSolution.tsx` | Sets up the pain point, then the resolution. Green divider stroke. |
| 4 | ¿Cómo funciona? | dark | `HowItWorks.tsx` | 3 gradient feature cards, each with a glassmorphic mock UI. Anchor `#como-funciona`. |
| 5 | Seguridad y Transparencia | light | `TrustSection.tsx` | CNV / Allaria / IA+Humano cards. The credibility section. |
| 6 | Beneficios | dark | `Benefits.tsx` | Bento grid, varied tile sizes. Anchor `#beneficios`. |
| 7 | FAQ | light | `FAQ.tsx` | 4-item accordion, single-open. Anchor `#faq`. |
| 8 | Footer CTA | dark | `FooterCTA.tsx` | Mesh-gradient card, second `<WaitlistForm>`, footer baseline. |

## Anchor links (used by Nav)
- `#como-funciona` → HowItWorks
- `#beneficios` → Benefits
- `#faq` → FAQ
- `#waitlist-form` → the `<WaitlistForm>` instance inside Hero (CTA target)

## Why this order
The redesign spec sequences the sections as: hook → pain → mechanism → trust → upside → objections → conversion. Don't reorder without revisiting the spec at `docs/superpowers/specs/2026-03-25-landing-redesign-design.md`.

See [[Design Language]], [[../components/Component Map|Component Map]].
