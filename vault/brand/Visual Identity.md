---
tags:
  - brand
  - design
---
# Visual Identity — Palm

## Palette (locked)
CSS custom properties defined in `index.html`:

| Token | Hex | Role |
|---|---|---|
| `--navy` | `#101B3B` | Primary background. **Whole page renders on navy.** |
| `--gold` | `#F0C14D` | Accent: primary CTA, keyword italics, step numerals, divider gradient anchor |
| `--blue` | `#26428B` | Secondary blue, brand-gradient anchor |
| `--violet` | `#9747FF` | Pillar 2 (paid tier) accents — checkmarks |
| `--cream` | `#FFFCF5` | Text on navy, soft surface |
| `--dark` | `#0A1428` | Deepest navy, used for layering |

Plus RGB triplets (`--cream-rgb`, `--gold-rgb`, `--navy-rgb`) for `rgba()` use without inline hex.

### Page Theme Lock
The **whole page renders on navy**. There is no cream/white section. If a section starts to "want" a cream background (the old Summa Security section did), that's an anti-pattern — see [[../concepts/Anti-patterns]] ("Page Theme Lock").

Exception: the hero stacks a Three.js RGB-line shader over `--brand-gradient`, with a navy-62% scrim on top so it still reads as navy.

## Typography
- **Primary**: **Neue Haas Grotesk Pro** — self-hosted at `fonts/`. Weights 150 / 200 / 400 / 500 / 700. Used for body, headings, UI.
- **Secondary**: **IBM Plex Sans italic medium gold** — Google Fonts via single `<link>`. Used **only** for keyword italics (class `.kw`).
- **No third typeface.** Playfair Display was tried in the Security section and removed for violating the 2-font rule.

## Logo
- `palm-logo.png` — gradient mark, used in navbar (with wordmark "Palm") and footer.
- Original at `PalmLogoGradient.png` and `Logo gradient gmail.png`.

## Gradients
- `--brand-gradient`: composite of navy / blue / gold / violet. Used as fallback background under the hero shader, as 3px top border on Pillars, and as short dividers (64px) under section headlines.
- **No gradient text-fill anywhere.** This is the #1 tell of AI-generated marketing pages. Headlines render in solid color; keywords get the gold italic Plex treatment instead.

## Imagery (mockups/)
- `Hero-section.png` — gold-bezeled iPhone with palm·invest UI. The hero image.
- `problem-figure.png` — editorial figure cropped into a "P" shape, with soft radial halo.
- `screen-extracto.png` / `screen-gastos.png` / `screen-objetivo.png` / `screen-portfolio.png` — the four Process step screenshots. **No CSS phone bezels** wrapping them — drop-shadow only.

## See also
- [[../concepts/Anti-patterns]] — the long list of slop tells deliberately avoided
- [[../concepts/Motion System]] — Three.js + Motion + mathjs
- [[../landings/Palm — Vanilla HTML]]
