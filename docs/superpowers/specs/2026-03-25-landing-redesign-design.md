# Summa Landing Page — Full Redesign Spec

**Date:** 2026-03-25
**Status:** Approved by user
**Repo:** `/home/tron-mrs/Summa/summa-landing`

---

## Overview

Full redesign of the Summa landing page. Replaces the current minimal dark-only layout with a richer, multi-section page following the **Summa Modern Playful Design System** — alternating dark/light sections, glassmorphism on dark sections, clean official treatment on light sections.

### Content additions vs. current site

| Section | Status |
|---|---|
| Nav | Redesign |
| Hero | Redesign |
| Problem & Solution | New (replaces ProblemCards) |
| ¿Cómo funciona? | Redesign |
| Seguridad y Transparencia | New (replaces SocialProof) |
| Beneficios | New |
| FAQ | New |
| Footer CTA | Redesign |

---

## Design System Constraints

- **Framework:** Next.js 16 App Router — read `node_modules/next/dist/docs/` before writing code
- **Styling:** Tailwind CSS v4 — `@theme inline {}` in `globals.css`, no `tailwind.config.ts`
- **Font:** Inter via `next/font/google`, CSS var `--font-inter`
- **Language:** Spanish (Argentine)
- **Animations:** CSS keyframes + `IntersectionObserver` (existing `useScrollReveal` hook + `.reveal` class)
- **Existing tokens:** `--color-brand-dark: #030213`, `--color-brand-green: #90e24d`, `--color-brand-white: #fcfcfc`, `--color-muted: #ececf0`, `--color-muted-fg: #717182`

### New tokens to add to `globals.css`

```css
@theme inline {
  /* Section backgrounds */
  --color-section-dark: #111111;
  --color-section-light: #F8F8FA;
}
```

### Shape language
- Buttons: `border-radius: 9999px` (pill)
- Feature cards: `border-radius: 28px`
- Trust/FAQ cards: `border-radius: 16px`
- Footer CTA container: `border-radius: 32px`

### Micro-interactions
- Feature cards: `hover:translate-y-[-6px] transition-transform duration-300` + expanded shadow
- CTA buttons: `active:scale-[0.97] transition-transform duration-150`
- Glassmorphism: `backdrop-blur-md bg-white/10 border border-white/15`

---

## Page Structure

```
<Nav />                  — fixed floating pill, z-50
<Hero />                 — DARK  #111111
<ProblemSolution />      — LIGHT #F8F8FA
<HowItWorks />           — DARK  #111111
<TrustSection />         — LIGHT #F8F8FA
<Benefits />             — DARK  #111111
<FAQ />                  — LIGHT #F8F8FA
<FooterCTA />            — DARK  #111111
```

`page.tsx` imports and renders all 8 components in order. Keeps `useScrollReveal()` at page level.

---

## Section Designs

### 1. Nav

**Component:** `components/Nav.tsx` (redesign)
**Behavior:** Fixed, floating, centered pill. Uses existing IntersectionObserver on `#hero-sentinel`.

- Pill container: `fixed top-4 left-1/2 -translate-x-1/2 z-50`
- Pill styles: `rounded-full px-6 py-3 flex items-center gap-8`
- On dark (default): `bg-white/10 backdrop-blur-md border border-white/15`
- On light (scrolled): `bg-black/5 backdrop-blur-md border border-black/10`
- **Left:** `SUMMA` logotype, `font-bold`, white on dark / dark on light
- **Center (desktop only):** 3 anchor links — `¿Cómo funciona?` → `#como-funciona`, `Por qué Summa` → `#beneficios`, `Preguntas Frecuentes` → `#faq`. Hidden on mobile (`hidden md:flex`).
- **Right:** Pill CTA button `Acceso Anticipado` — `bg-brand-green text-brand-dark font-bold text-sm px-5 py-2 rounded-full`. Smooth-scrolls to `#waitlist-form`.
- Mobile: logo + CTA only. No hamburger.

---

### 2. Hero

**Component:** `components/Hero.tsx` (redesign)
**Background:** `#111111`
**Layout:** Two-column on desktop (`lg:grid lg:grid-cols-2`), stacked on mobile. `min-h-screen`, `py-32 px-6`.

**Left column — copy:**
- Overline badge: `IA para inversiones` — small pill, `bg-brand-green/15 text-brand-green border border-brand-green/30 text-xs font-medium px-3 py-1 rounded-full`
- H1 (`text-[44px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.1] text-white`):
  *"Invertir debería ser para la gente, arrancá ahora por lo mismo que pagás Netflix."*
- Subheading (`text-lg text-white/60 max-w-[480px] leading-relaxed`):
  *"Summa es tu asesor financiero que realmente es tuyo. Con IA que logra manejar tus inversiones de forma inteligente, segura y adaptada a tus necesidades. Sin complicaciones, sin letra chica."*
- CTA pill button: `bg-brand-green text-brand-dark font-bold text-base px-8 py-4 rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform`
  Text: `Quiero mi asesor →`
  Smooth-scrolls to `#waitlist-form`
- Social proof counter (below button): `+847 personas ya están en la lista de espera` — `text-white/40 text-sm`. Static number hardcoded (not live from Redis — keep it simple).
- `<WaitlistForm id="waitlist-form" variant="dark" />` — below social proof counter

**Right column — visual:**
Replaces phone mockup. Pure CSS composition, no images.

- Background blob: absolute positioned `radial-gradient` — pinks, oranges, greens bleeding into `#111111`. `opacity-60`, `blur-3xl`, `pointer-events-none`.
- Main glassmorphic card (`rounded-3xl p-6 backdrop-blur-md bg-white/10 border border-white/15 w-[300px]`):
  - Header row: `Portafolio Total` label + mock balance `$12,450.00` in white bold large type
  - Growth badge: `+18.4% este año` in brand-green pill
  - Sparkline: SVG polyline, white, simple upward trend, no axis labels
- Secondary floating notification card (overlapping, offset `translate-x-8 -translate-y-4`):
  - `rounded-2xl p-3 backdrop-blur-md bg-white/10 border border-white/15`
  - `✓ Portafolio optimizado` — small white text
- Main card uses `animate-float`. Notification card uses `animate-float-b` (defined in globals.css with 0.8s delay built in)

**`id="hero-sentinel"`** sentinel div at bottom of section for Nav scroll detection.

---

### 3. ProblemSolution

**Component:** `components/ProblemSolution.tsx` (new, `'use client'`)
**Background:** `#F8F8FA`
**Layout:** Single-column, centered, `max-w-[760px] mx-auto py-32 px-6`

- Section label: `EL PROBLEMA` — `text-xs font-semibold tracking-widest text-muted-fg uppercase mb-6`
- H2 (`text-[28px] lg:text-[40px] font-bold text-brand-dark leading-tight mb-8`):
  *"Lamentablemente, lo normal es que uno esté desesperado por saber qué hacer con su dinero."*
- Problem body (`text-[18px] text-brand-dark/70 leading-relaxed mb-12`):
  *"Sabemos que tenemos que invertir, pero el mundo financiero parece diseñado literalmente para confundirte. ¿Qué nos pasa? terminamos dejando la plata en el banco o saltando a opciones riesgosas por desesperación."*
- Divider: `<hr>` — `w-16 border-t-2 border-brand-green mx-auto my-12`
- Section label: `LA SOLUCIÓN` — same style as above
- Solution body (`text-[18px] text-brand-dark leading-relaxed`):
  *"Ahora los argentinos tienen otra opción: democratizamos el asesoramiento que se guardaba para unos pocos. Usamos Inteligencia Artificial para darte la mejor estrategia, pero adaptada a tu bolsillo y tus objetivos. ¿Por qué? Porque la plata es tuya y elegís vos que hacer con ella."*

Both body paragraphs get `.reveal` class for scroll-reveal stagger.

---

### 4. HowItWorks

**Component:** `components/HowItWorks.tsx` (redesign)
**Background:** `#111111`
**Layout:** `py-32 px-6`. H2 centered, then 3-card row.
**Section id:** `id="como-funciona"`

- Section label pill + H2 (white): *"¿Cómo funciona?"*

**3 feature cards** (`rounded-[28px] min-h-[380px] p-8 flex flex-col justify-between`):

| Card | Gradient bg | Mock UI element | Label |
|---|---|---|---|
| 01 Definimos tu situación | `from-[#1a1040] to-[#0d2b4e]` (violet→blue) | Glassmorphic pill group: Conservador / Moderado / Agresivo, Moderado highlighted in green | *"Tu perfil de riesgo y metas en 5 minutos."* |
| 02 Optimización Global | `from-[#0d2b1a] to-[#0a2a2a]` (green→teal) | Glassmorphic mini chart card with SVG rising line + world map dot cluster | *"Fondos internacionales con historial probado."* |
| 03 Piloto Automático | `from-[#2b1a0d] to-[#2b0d1a]` (orange→pink) | Two stacked glassmorphic toast notifications | *"Vos solo mirás cómo crece desde la App."* |

- Step numbers (`01`, `02`, `03`) as large (`text-[120px]`) background text, `text-white/5`, absolute positioned, bottom-right of each card
- Hover: `hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300`
- Cards get `.reveal` class

---

### 5. TrustSection

**Component:** `components/TrustSection.tsx` (new, `'use client'`, replaces SocialProof)
**Background:** `#F8F8FA`
**Layout:** `py-32 px-6`

- H2 centered (`text-[28px] lg:text-[36px] font-bold text-brand-dark`): *"Tu capital, siempre protegido."*
- Subline (`text-muted-fg text-lg text-center mb-16`): *"Operamos bajo los más altos estándares regulatorios del mercado argentino."*

**3 trust cards** (white bg, `rounded-2xl p-8 border border-black/[0.06] shadow-sm`):

| Card | Icon | Heading | Body |
|---|---|---|---|
| CNV | `Shield` (Lucide, brand-green) | Regulados por la CNV | Operamos bajo estándares oficiales para que tu capital esté siempre protegido. |
| Allaria | `Lock` (Lucide, brand-green) | Custodia Segura | Tus activos se mantienen en cuentas segregadas bajo las normativas vigentes junto a nuestro partner Allaria. |
| IA + Humano | `Sparkles` (Lucide, brand-green) | IA + Expertise Humano | No es solo un algoritmo; es tecnología de punta supervisada por expertos en finanzas locales, porque sabemos que trabajamos en un mundo humano. |

- Icon container: `w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-6`
- Below cards: trust bar — `CNV` and `Allaria` as grayscale text wordmarks with `Regulado por` / `Partner` labels. `opacity-50`, centered, `mt-16`.

---

### 6. Benefits

**Component:** `components/Benefits.tsx` (new, `'use client'`)
**Background:** `#111111`
**Layout:** `py-32 px-6`. Bento grid.
**Section id:** `id="beneficios"`

- H2 centered (white): *"La libertad de que tu plata trabaje para vos."*

**Bento grid** (`grid grid-cols-1 lg:grid-cols-3 gap-6`):

| Card | Grid span | Gradient | Visual element | Heading | Body |
|---|---|---|---|---|---|
| Libertad Total | `lg:col-span-2` | deep purple→dark blue | Glassmorphic spreadsheet icon crossed out with green checkmark overlay | *"Olvidate de las planillas."* | *"Nosotros gestionamos, vos disfrutás."* |
| Sin Mínimos | `lg:col-span-1 lg:row-span-2` | dark green→emerald | `$0` in massive bold white type (`text-[96px]`) | *"Inversión sin Mínimos"* | *"Accedé a fondos de clase mundial sin importar cuánto capital tengas hoy."* |
| Transparencia Radical | `lg:col-span-2` | dark charcoal→slate | Split: left = mock pricing card (one line item, green price); right = crossed-out fee list | *"Sin comisiones ocultas."* | *"Un solo pago mensual, claro y bajo."* |

- All cards: `rounded-[28px] p-8`, same hover micro-interaction as HowItWorks
- Cards get `.reveal` class

---

### 7. FAQ

**Component:** `components/FAQ.tsx` (new, `'use client'`)
**Background:** `#F8F8FA`
**Layout:** `py-32 px-6`. Single-column, `max-w-[680px] mx-auto`.
**Section id:** `id="faq"`

- H2 centered: *"Preguntas Frecuentes."*

**Accordion state:** `const [open, setOpen] = useState<number | null>(null)` — single item open at a time.

**4 items** (white bg card `rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden`):

1. *¿Necesito saber de finanzas?* → No, Summa está diseñada para que no tengas que ser un experto.
2. *¿Puedo retirar mi dinero?* → Sí, tus inversiones tienen liquidez para que dispongas de tu plata cuando la necesites.
3. *¿Es seguro?* → Absolutamente. Tus datos están encriptados y tus fondos regulados por la Comisión Nacional de Valores.
4. *¿Cuánto cuesta?* → Un solo pago mensual, sin costos ocultos ni estructuras complejas.

**Each item:**
- Trigger row: `flex justify-between items-center px-6 py-5 cursor-pointer`
- Question: `font-semibold text-brand-dark`
- Toggle icon: `+` / `−` in brand-green, `text-xl`
- Answer: `px-6 pb-5 text-muted-fg text-[15px] leading-relaxed` — animated with `max-height` CSS transition (`max-h-0 overflow-hidden` → `max-h-[500px]`). Use a generous value to avoid content clipping if copy grows.

---

### 8. FooterCTA

**Component:** `components/FooterCTA.tsx` (redesign)
**Background:** `#111111`
**Layout:** `py-24 px-6`

**CTA container card** (`rounded-[32px] max-w-[800px] mx-auto px-12 py-16 relative overflow-hidden`):
- Background: radial mesh gradient — `radial-gradient(ellipse at 30% 50%, rgba(144,226,77,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,100,150,0.1), transparent 50%)` over `#1a1a1a`
- H2 (white, `text-[28px] lg:text-[40px] font-bold`): *"Abrile la puerta a tu futuro, el de tus hijos y el de tus nietos."*
- Subline (`text-white/50 text-lg mb-8`): *"No te quedes afuera. Sumate a la lista de espera y obtené beneficios únicos por 6 meses."*
- `<WaitlistForm variant="dark" />` — existing component, no changes

**Footer baseline** (below card, `mt-16 flex justify-between items-center max-w-[800px] mx-auto`):
- Left: `SUMMA` logotype, `text-white/40 font-bold`
- Center: `Términos` · `Privacidad` · `Contacto` links, `text-white/40 text-sm hover:text-white/70`
- Right: `© 2026 Summa`, `text-white/30 text-sm` (use `new Date().getFullYear()` for a dynamic value)

---

## WaitlistForm changes

- Add `id` prop support: `<WaitlistForm id="waitlist-form" variant="dark" />` — the `id` is applied to `WaitlistForm`'s outermost `<div>` (currently line 48). The existing wrapper `<div id="waitlist-form">` in the current `Hero.tsx` must be removed to avoid duplicate ids.
- No other changes to form logic

## globals.css additions

```css
@theme inline {
  --color-section-dark: #111111;
  --color-section-light: #F8F8FA;
}

@keyframes floatB {
  from { transform: translateY(0px); }
  to   { transform: translateY(-6px); }
}

.animate-float-b {
  animation: floatB 5s ease-in-out infinite alternate;
  animation-delay: 0.8s;
}
```

## Files to create

- `components/ProblemSolution.tsx`
- `components/TrustSection.tsx`
- `components/Benefits.tsx`
- `components/FAQ.tsx`

## Files to modify

- `components/Nav.tsx`
- `components/Hero.tsx`
- `components/HowItWorks.tsx`
- `components/FooterCTA.tsx`
- `components/WaitlistForm.tsx` (minor — add `id` prop)
- `app/page.tsx` (import new components, remove SocialProof/ProblemCards)
- `app/globals.css` (add tokens + floatB keyframe)

## Files to delete

- `components/SocialProof.tsx`
- `components/ProblemCards.tsx`

---

## Accessibility

- All sections have `id` anchors for nav links
- `<nav aria-label="Principal">` maintained
- Nav anchor links have **no active/scroll-spy state** — this is intentional. The nav is for quick navigation, not progress indication.
- Accordion triggers are `<button>` elements with `aria-expanded` and `aria-controls`
- Color contrast: white on `#111111` passes WCAG AA; dark text on `#F8F8FA` passes WCAG AA
- `<WaitlistForm>` label/input association via `useId()` unchanged
- Add `@media (prefers-reduced-motion: reduce)` guard in `globals.css` to disable `animate-float`, `animate-float-b`, and `.reveal` transitions for users who prefer reduced motion

## Implementation notes

### useScrollReveal timing constraint
`useScrollReveal` snapshots `.reveal` elements once on mount via `querySelectorAll`. All components using `.reveal` must render synchronously on first paint — no lazy loading, no Suspense boundaries wrapping reveal-containing components. All new `'use client'` components satisfy this since they render inline.

### hero-sentinel placement
The `<div id="hero-sentinel">` must be placed at the **bottom** of the Hero section (as an `absolute bottom-0` positioned element within the section). This is the Nav's trigger point for switching between dark/light pill styles. The two-column Hero layout must preserve this placement.

### Bento grid row height (Benefits section)
The `grid` must include `grid-rows` or `auto-rows` to ensure the `lg:row-span-2` card on "Sin Mínimos" spans correctly. Use `grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6`. The `lg:` prefix on `grid-rows-2` is required — without it, mobile layout (single column) will be constrained to exactly 2 rows instead of flowing to 3. Add `min-h-[200px]` per row on desktop to prevent collapsed rows. The `floatB` keyframe uses `-6px` travel (vs `-8px` for `float`) intentionally — the notification card is smaller and the reduced amplitude looks proportionate.

### lucide-react
Already in `package.json` at `^1.6.0`. No install needed.

### 'use client' directives summary
| Component | Directive |
|---|---|
| Nav.tsx | `'use client'` (uses useState, useEffect) |
| Hero.tsx | `'use client'` (uses WaitlistForm) |
| ProblemSolution.tsx | `'use client'` (uses .reveal scroll animations) |
| HowItWorks.tsx | `'use client'` (uses .reveal scroll animations) |
| TrustSection.tsx | `'use client'` (uses .reveal scroll animations) |
| Benefits.tsx | `'use client'` (uses .reveal scroll animations) |
| FAQ.tsx | `'use client'` (uses useState for accordion) |
| FooterCTA.tsx | `'use client'` (uses WaitlistForm) |
| WaitlistForm.tsx | `'use client'` (uses useState, useId) |

## Testing

- Existing Jest tests (`npm test`) must still pass — no changes to `/api/waitlist/route.ts`
- Manual smoke test: nav scroll-spy, waitlist form submission, FAQ accordion open/close, scroll reveals
