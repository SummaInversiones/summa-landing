---
tags:
  - concepts
  - design
  - palm
---
# Anti-patterns

Visual / copy patterns that are **deliberately avoided** on the Palm landing. Each was either present in an earlier iteration and removed, or flagged by the `hallmark` / `design-taste-frontend` / `ui-ux-pro-max` skills as an AI-slop tell.

> Reverting one of these without a stronger reason undoes work that has already been validated.

| Anti-pattern | Why avoided | Where it was before |
|---|---|---|
| **Gradient text-fill on headlines** | Tell #1 of AI-generated marketing pages. | "Hasta ahora." used to be `background-clip: text` over brand-gradient. Now gold italic Plex. |
| **Centered hero + `min-height: 100vh`** | §4.3 ANTI-CENTER BIAS; variance > 4. | Hero was centered + 100vh. Now asymmetric 2-col grid. |
| **Country-emoji badge pill** | §9.F version-label pattern + §3.D emoji policy. | Hero had "ACCESO ANTICIPADO · ARGENTINA 🇦🇷". Removed. |
| **"Bienvenido a Palm" welcome block** | Copy register break, redundant with headline. | Sat under the headline. Removed. |
| **Icon-tile feature grid** (3–4 cards with icon-square + title + body) | Canonical SaaS template. | Security had 4 such cards. Now Statement Letter — no cards, no icons. |
| **CSS phone bezel around screenshots** | Re-drawn UI chrome anti-pattern. | Steps had bezel + notch. Now drop-shadow only. |
| **Universal hover** (`translateY` + `scale` + `shadow` on everything) | §4.5 banal. | Almost every element had it. Now: one signal per element (color or border). |
| **Sandwich brand-gradient** (hero + CTA-final both centered + gradient) | Macro-rhythm tell. | CTA-final was centered gradient, then navy Statement Letter; deleted entirely 2026-06-11 (duplicated the footer waitlist). |
| **Repeated "P" pattern at low opacity** | Unmotivated decoration. | Was in hero + process + CTA-final. Removed everywhere. |
| **Middle-dot inflation** (`·`) | §9.F max 1 per line. | Trust strip had 2 dots. Now: comma + period. Marquee keeps dots because separating ticker items is a functional use. |
| **Eyebrow in every section** | §4.7 eyebrow restraint (max 1 per 3 sections). | Process and Pillars had eyebrows. Removed. Only Security and Calculator have them. |
| **Third typeface** (Playfair Display) | Violates the 2-font rule. | Security had it briefly. Removed. |
| **Cream/white section breaking Page Theme Lock** | The whole page renders on navy. | Security was cream with Playfair. Now navy with Statement Letter. |

## Controversial decisions kept
These are not anti-patterns but were called out by the taste-skill and kept anyway, with explicit justification:

- **Three.js shader in hero** — strict reading is "unmotivated decoration". User prefers it. Kept, paused offscreen via IntersectionObserver so it doesn't burn GPU.
- **GradualBlur fixed at viewport bottom** — persists the entire scroll, crosses through content. Acts as a signature. Kept.
- **Calculator with hardcoded assumptions (0% solo / 15% Palm)** — not an invented metric because it's labeled in the disclaimer.

## See also
- [[Design Language]] (Summa-era)
- [[../brand/Visual Identity]]
- [[../landings/Palm Section Map]]
