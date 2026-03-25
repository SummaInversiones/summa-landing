# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Summa landing page from a minimal dark-only layout to a rich 8-section page alternating dark/light sections with glassmorphism, playful feature cards, FAQ accordion, bento grid benefits, and updated copy.

**Architecture:** Each section is an independent `'use client'` React component. Sections are composed in `app/page.tsx`. Styling is Tailwind v4 with tokens in `app/globals.css`. No new dependencies needed.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4 (`@theme inline {}`), Inter font, `lucide-react ^1.6.0`, existing `useScrollReveal` hook, `@upstash/redis` (untouched).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Add `--color-section-dark`, `--color-section-light` tokens, `floatB` keyframe, `animate-float-b` class, `prefers-reduced-motion` guard |
| `components/WaitlistForm.tsx` | Modify | Add optional `id` prop forwarded to outermost `<div>` |
| `components/Nav.tsx` | Rewrite | Floating centered pill nav with logo, anchor links (desktop), CTA button |
| `components/Hero.tsx` | Rewrite | Dark two-column layout; glassmorphic portfolio cards replacing phone mockup; sentinel div |
| `components/ProblemSolution.tsx` | Create | Light section; problem/solution copy with green divider |
| `components/HowItWorks.tsx` | Rewrite | Dark section; 3 gradient feature cards with glassmorphic mock UI elements |
| `components/TrustSection.tsx` | Create | Light section; 3 trust cards (CNV, Allaria, IA+Humano); trust bar |
| `components/Benefits.tsx` | Create | Dark section; bento grid with 3 varied-size cards |
| `components/FAQ.tsx` | Create | Light section; 4-item accordion with single-open state |
| `components/FooterCTA.tsx` | Rewrite | Dark section; rounded CTA card with mesh gradient; footer baseline |
| `app/page.tsx` | Modify | Import all 8 new/redesigned components; remove SocialProof, ProblemCards imports |
| `components/SocialProof.tsx` | Delete | Replaced by TrustSection |
| `components/ProblemCards.tsx` | Delete | Replaced by ProblemSolution |

---

## Task 1: Update globals.css — tokens, animations, reduced-motion

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new color tokens to `@theme inline {}`**

In `app/globals.css`, extend the existing `@theme inline {}` block to add:
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
Also add the same two vars to the `:root {}` block for backwards compatibility.

- [ ] **Step 2: Add `floatB` keyframe and `.animate-float-b` class**

Below the existing `@keyframes float` and `.animate-float` definitions, add:
```css
@keyframes floatB {
  from { transform: translateY(0px); }
  to   { transform: translateY(-6px); }
}

.animate-float-b {
  animation: floatB 5s ease-in-out infinite alternate;
  animation-delay: 0.8s;
}
```
Note: `floatB` uses `-6px` travel (vs `-8px` for `float`) intentionally — the smaller notification card looks proportionate with reduced amplitude.

- [ ] **Step 3: Add `prefers-reduced-motion` guard**

At the end of `globals.css`, add:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-b {
    animation: none;
  }
  .reveal {
    transition: none;
  }
}
```

- [ ] **Step 4: Verify tests still pass**

Run: `npm test`
Expected: All 3 tests in `__tests__/api/waitlist.test.ts` pass. (globals.css changes have no effect on API tests.)

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat: add section color tokens, floatB animation, reduced-motion guard"
```

---

## Task 2: WaitlistForm — add `id` prop

**Files:**
- Modify: `components/WaitlistForm.tsx`

- [ ] **Step 1: Add `id` to Props interface and outermost div**

In `components/WaitlistForm.tsx`, update the `Props` interface and the outermost `<div>`:

```tsx
interface Props {
  variant?: Variant
  id?: string
}

export function WaitlistForm({ variant = 'dark', id }: Props) {
  // ... existing state ...

  // In the return, the outermost div on line 48:
  return (
    <div id={id} className="relative w-full max-w-md flex flex-col">
      {/* ... rest unchanged ... */}
    </div>
  )
}
```

The success state `<p>` return does not need the `id` — only the form state div does.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS (no logic change, tests don't test the id prop)

- [ ] **Step 3: Commit**

```bash
git add components/WaitlistForm.tsx
git commit -m "feat(waitlist-form): add optional id prop forwarded to wrapper div"
```

---

## Task 3: Nav — floating pill redesign

**Files:**
- Modify: `components/Nav.tsx`

- [ ] **Step 1: Rewrite Nav.tsx**

Replace the entire file with:

```tsx
'use client'

import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function scrollToWaitlist() {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      const input = document.getElementById('waitlist-form')?.querySelector('input')
      input?.focus({ preventScroll: true })
    }, 500)
  }

  const pillBase = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 flex items-center gap-6 transition-colors duration-300'
  const pillDark = 'bg-white/10 backdrop-blur-md border border-white/15'
  const pillLight = 'bg-black/5 backdrop-blur-md border border-black/10'

  const linkBase = 'text-sm font-medium transition-colors hidden md:block'
  const linkDark = 'text-white/70 hover:text-white'
  const linkLight = 'text-brand-dark/70 hover:text-brand-dark'

  return (
    <nav aria-label="Principal" className={`${pillBase} ${scrolled ? pillLight : pillDark}`}>
      <span className={`font-bold text-base tracking-tight ${scrolled ? 'text-brand-dark' : 'text-white'}`}>
        SUMMA
      </span>

      <div className="hidden md:flex items-center gap-6">
        <a href="#como-funciona" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          ¿Cómo funciona?
        </a>
        <a href="#beneficios" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          Por qué Summa
        </a>
        <a href="#faq" className={`${linkBase} ${scrolled ? linkLight : linkDark}`}>
          Preguntas Frecuentes
        </a>
      </div>

      <button
        onClick={scrollToWaitlist}
        className="bg-brand-green text-brand-dark font-bold text-sm px-5 py-2 rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150 whitespace-nowrap"
      >
        Acceso Anticipado
      </button>
    </nav>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat(nav): redesign as floating centered pill with anchor links"
```

---

## Task 4: Hero — two-column layout with glassmorphic cards

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

Replace the entire file with:

```tsx
'use client'

import { WaitlistForm } from './WaitlistForm'

function Sparkline() {
  const points = '20,60 50,45 80,50 110,30 140,35 170,15 200,20'
  return (
    <svg viewBox="0 0 220 75" className="w-full h-16" fill="none">
      <polyline points={points} stroke="#90e24d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Sentinel for Nav scroll detection — must be at bottom of section */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 w-full h-px" />

      {/* Mesh gradient background blob */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(255,100,150,0.18), transparent 55%), radial-gradient(ellipse at 85% 70%, rgba(144,226,77,0.12), transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(255,160,80,0.1), transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left column — copy */}
        <div className="flex flex-col items-start gap-6">
          <span className="bg-brand-green/15 text-brand-green border border-brand-green/30 text-xs font-medium px-3 py-1 rounded-full">
            IA para inversiones
          </span>

          <h1 className="font-bold leading-[1.1] text-[44px] sm:text-[60px] lg:text-[72px] text-white">
            Invertir debería ser para la gente, arrancá ahora por lo mismo que pagás Netflix.
          </h1>

          <p className="text-lg text-white/60 max-w-[480px] leading-relaxed">
            Summa es tu asesor financiero que realmente es tuyo. Con IA que logra manejar tus inversiones de forma inteligente, segura y adaptada a tus necesidades. Sin complicaciones, sin letra chica.
          </p>

          <button
            onClick={() => document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-green text-brand-dark font-bold text-base px-8 py-4 rounded-full hover:scale-[1.02] active:scale-[0.97] transition-transform duration-150"
          >
            Quiero mi asesor →
          </button>

          <p className="text-white/40 text-sm">
            +847 personas ya están en la lista de espera
          </p>

          <WaitlistForm id="waitlist-form" variant="dark" />
        </div>

        {/* Right column — glassmorphic visual */}
        <div className="relative flex justify-center items-center min-h-[400px]">

          {/* Main portfolio card */}
          <div
            className="animate-float rounded-3xl p-6 w-[300px] flex flex-col gap-4"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Portafolio Total</p>
              <p className="text-white font-bold text-[32px] leading-none">$12,450.00</p>
            </div>
            <span className="self-start bg-brand-green/20 text-brand-green text-xs font-semibold px-3 py-1 rounded-full">
              +18.4% este año
            </span>
            <Sparkline />
          </div>

          {/* Floating notification card */}
          <div
            className="animate-float-b absolute top-8 right-0 rounded-2xl px-4 py-3 flex items-center gap-2"
            style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="text-brand-green text-sm font-bold">✓</span>
            <span className="text-white text-sm font-medium">Portafolio optimizado</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): two-column layout with glassmorphic portfolio cards"
```

---

## Task 5: ProblemSolution — new light section

**Files:**
- Create: `components/ProblemSolution.tsx`

- [ ] **Step 1: Create ProblemSolution.tsx**

```tsx
'use client'

export function ProblemSolution() {
  return (
    <section className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-[760px] mx-auto">

        <p className="text-xs font-semibold tracking-widest text-muted-fg uppercase mb-6">
          El Problema
        </p>

        <h2 className="reveal font-bold leading-tight text-brand-dark mb-8 text-[28px] lg:text-[40px]">
          Lamentablemente, lo normal es que uno esté desesperado por saber qué hacer con su dinero.
        </h2>

        <p className="reveal text-[18px] text-brand-dark/70 leading-relaxed mb-12" style={{ transitionDelay: '100ms' }}>
          Sabemos que tenemos que invertir, pero el mundo financiero parece diseñado literalmente para confundirte. ¿Qué nos pasa? terminamos dejando la plata en el banco o saltando a opciones riesgosas por desesperación.
        </p>

        <hr className="w-16 border-t-2 border-brand-green mx-auto my-12" />

        <p className="text-xs font-semibold tracking-widest text-muted-fg uppercase mb-6">
          La Solución
        </p>

        <p className="reveal text-[18px] text-brand-dark leading-relaxed" style={{ transitionDelay: '200ms' }}>
          Ahora los argentinos tienen otra opción: democratizamos el asesoramiento que se guardaba para unos pocos. Usamos Inteligencia Artificial para darte la mejor estrategia, pero adaptada a tu bolsillo y tus objetivos. ¿Por qué? Porque la plata es tuya y elegís vos que hacer con ella.
        </p>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/ProblemSolution.tsx
git commit -m "feat(problem-solution): add light section with problem/solution copy"
```

---

## Task 6: HowItWorks — dark feature cards redesign

**Files:**
- Modify: `components/HowItWorks.tsx`

- [ ] **Step 1: Rewrite HowItWorks.tsx**

```tsx
'use client'

function RiskProfileMock() {
  return (
    <div className="flex gap-2 mt-4">
      {['Conservador', 'Moderado', 'Agresivo'].map((label) => (
        <span
          key={label}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            label === 'Moderado'
              ? 'bg-brand-green text-brand-dark'
              : 'bg-white/10 text-white/60 border border-white/15'
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  )
}

function ChartMock() {
  const points = '10,50 30,40 50,45 70,25 90,30 110,15 130,20'
  return (
    <div
      className="mt-4 rounded-2xl p-3"
      style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2">Rendimiento global</p>
      <svg viewBox="0 0 140 60" className="w-full h-10" fill="none">
        <polyline points={points} stroke="#90e24d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function ToastsMock() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {['Mercado ajustado ✓', 'Portafolio rebalanceado ✓'].map((msg) => (
        <div
          key={msg}
          className="px-4 py-2 rounded-xl text-sm text-white font-medium"
          style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {msg}
        </div>
      ))}
    </div>
  )
}

const cards = [
  {
    n: '01',
    title: 'Definimos tu situación',
    label: 'Tu perfil de riesgo y metas en 5 minutos.',
    gradient: 'linear-gradient(135deg, #1a1040, #0d2b4e)',
    Mock: RiskProfileMock,
  },
  {
    n: '02',
    title: 'Optimización Global',
    label: 'Fondos internacionales con historial probado.',
    gradient: 'linear-gradient(135deg, #0d2b1a, #0a2a2a)',
    Mock: ChartMock,
  },
  {
    n: '03',
    title: 'Piloto Automático',
    label: 'Vos solo mirás cómo crece desde la App.',
    gradient: 'linear-gradient(135deg, #2b1a0d, #2b0d1a)',
    Mock: ToastsMock,
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-6 py-32" style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <span className="bg-white/10 text-white/60 border border-white/15 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            El proceso
          </span>
          <h2 className="mt-4 font-bold text-white text-[28px] lg:text-[40px]">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ n, title, label, gradient, Mock }) => (
            <div
              key={n}
              className="reveal relative rounded-[28px] min-h-[380px] p-8 flex flex-col justify-between overflow-hidden
                         hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-default"
              style={{ background: gradient }}
            >
              {/* Background step number */}
              <span
                className="absolute bottom-4 right-4 font-bold leading-none select-none text-white/5"
                style={{ fontSize: 120 }}
              >
                {n}
              </span>

              <div className="relative z-10">
                <p className="text-brand-green font-bold text-sm mb-2">{n}</p>
                <h3 className="text-white font-bold text-xl leading-tight">{title}</h3>
                <Mock />
              </div>

              <p className="relative z-10 text-white/60 text-sm leading-relaxed mt-4">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/HowItWorks.tsx
git commit -m "feat(how-it-works): dark section with gradient feature cards and glassmorphic mock UI"
```

---

## Task 7: TrustSection — new light section

**Files:**
- Create: `components/TrustSection.tsx`

- [ ] **Step 1: Create TrustSection.tsx**

```tsx
'use client'

import { Shield, Lock, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const cards = [
  {
    Icon: Shield,
    heading: 'Regulados por la CNV',
    body: 'Operamos bajo estándares oficiales para que tu capital esté siempre protegido.',
  },
  {
    Icon: Lock,
    heading: 'Custodia Segura',
    body: 'Tus activos se mantienen en cuentas segregadas bajo las normativas vigentes junto a nuestro partner Allaria.',
  },
  {
    Icon: Sparkles,
    heading: 'IA + Expertise Humano',
    body: 'No es solo un algoritmo; es tecnología de punta supervisada por expertos en finanzas locales, porque sabemos que trabajamos en un mundo humano.',
  },
]

export function TrustSection() {
  return (
    <section className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="font-bold text-brand-dark text-[28px] lg:text-[36px]">
            Tu capital, siempre protegido.
          </h2>
          <p className="text-muted-fg text-lg mt-4 max-w-[560px] mx-auto">
            Operamos bajo los más altos estándares regulatorios del mercado argentino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ Icon, heading, body }) => (
            <div
              key={heading}
              className="reveal bg-white rounded-2xl p-8 border shadow-sm"
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                <Icon size={22} color="var(--color-brand-green, #90e24d)" />
              </div>
              <h3 className="font-bold text-brand-dark text-lg mb-3">{heading}</h3>
              <p className="text-muted-fg text-[15px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex justify-center items-center gap-10 opacity-50">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-brand-dark/60 mb-1">Regulado por</p>
            <p className="font-bold text-brand-dark text-lg">CNV</p>
          </div>
          <div className="w-px h-10 bg-brand-dark/20" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-brand-dark/60 mb-1">Partner</p>
            <p className="font-bold text-brand-dark text-lg">Allaria</p>
          </div>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/TrustSection.tsx
git commit -m "feat(trust-section): light section with CNV/Allaria/AI trust cards"
```

---

## Task 8: Benefits — new dark bento grid section

**Files:**
- Create: `components/Benefits.tsx`

- [ ] **Step 1: Create Benefits.tsx**

```tsx
'use client'

function SpreadsheetCrossedOut() {
  return (
    <div className="relative mt-4 w-fit">
      <div
        className="rounded-xl p-3 text-white/40 text-xs font-mono leading-relaxed"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>A1: rendimiento_YTD</div>
        <div>B1: volatilidad_anual</div>
        <div>C1: ={'>'} SUMPRODUCT(...)
        </div>
      </div>
      {/* Cross-out overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-brand-green text-4xl font-bold drop-shadow-lg">✓</span>
      </div>
    </div>
  )
}

function PricingMock() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {/* Good: one clear price */}
      <div
        className="rounded-xl p-4"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2">Summa</p>
        <p className="text-brand-green font-bold text-xl">$X/mes</p>
        <p className="text-white/50 text-xs mt-1">Todo incluido</p>
      </div>
      {/* Bad: hidden fees crossed out */}
      <div
        className="rounded-xl p-4"
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 line-through">Otros</p>
        <p className="text-white/30 text-xs line-through">Comisión entrada</p>
        <p className="text-white/30 text-xs line-through">Fee gestión</p>
        <p className="text-white/30 text-xs line-through">Spread oculto</p>
      </div>
    </div>
  )
}

export function Benefits() {
  return (
    <section id="beneficios" className="px-6 py-32" style={{ background: '#111111' }}>
      <div className="max-w-6xl mx-auto">

        <h2 className="text-center font-bold text-white text-[28px] lg:text-[40px] mb-12">
          La libertad de que tu plata trabaje para vos.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">

          {/* Card 1: Libertad Total — col-span-2 */}
          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px]
                       lg:col-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #1a0a40, #0d1a4e)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Libertad Total</h3>
              <p className="text-white/60 text-sm mt-1">Nosotros gestionamos, vos disfrutás.</p>
              <SpreadsheetCrossedOut />
            </div>
            <p className="text-white/50 text-sm mt-4">Olvidate de las planillas.</p>
          </div>

          {/* Card 2: Sin Mínimos — col-span-1, row-span-2 */}
          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px]
                       lg:col-span-1 lg:row-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a1a)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Inversión sin Mínimos</h3>
              <p className="text-brand-green font-bold leading-none mt-6" style={{ fontSize: 96 }}>$0</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Accedé a fondos de clase mundial sin importar cuánto capital tengas hoy.
            </p>
          </div>

          {/* Card 3: Transparencia Radical — col-span-2 */}
          <div
            className="reveal rounded-[28px] p-8 flex flex-col justify-between min-h-[220px]
                       lg:col-span-2 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a3a)' }}
          >
            <div>
              <h3 className="text-white font-bold text-2xl">Transparencia Radical</h3>
              <p className="text-white/60 text-sm mt-1">Un solo pago mensual, claro y bajo.</p>
              <PricingMock />
            </div>
            <p className="text-white/50 text-sm mt-4">Sin comisiones ocultas ni estructuras complejas.</p>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/Benefits.tsx
git commit -m "feat(benefits): dark bento grid section with 3 benefit cards"
```

---

## Task 9: FAQ — new light accordion section

**Files:**
- Create: `components/FAQ.tsx`

- [ ] **Step 1: Create FAQ.tsx**

```tsx
'use client'

import { useState } from 'react'

const items = [
  {
    q: '¿Necesito saber de finanzas?',
    a: 'No, Summa está diseñada para que no tengas que ser un experto. Te guiamos en cada paso con un lenguaje claro y simple.',
  },
  {
    q: '¿Puedo retirar mi dinero?',
    a: 'Sí, tus inversiones tienen liquidez para que dispongas de tu plata cuando la necesites.',
  },
  {
    q: '¿Es seguro?',
    a: 'Absolutamente. Tus datos están encriptados y tus fondos regulados por la Comisión Nacional de Valores.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Un solo pago mensual, sin costos ocultos ni estructuras complejas. El precio es claro desde el principio.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="px-6 py-32" style={{ background: '#F8F8FA' }}>
      <div className="max-w-[680px] mx-auto">

        <h2 className="text-center font-bold text-brand-dark text-[28px] lg:text-[36px] mb-12">
          Preguntas Frecuentes.
        </h2>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
              style={{ border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <button
                className="w-full flex justify-between items-center px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="font-semibold text-brand-dark pr-4">{item.q}</span>
                <span className="text-brand-green text-xl font-bold flex-shrink-0 leading-none">
                  {open === i ? '−' : '+'}
                </span>
              </button>

              <div
                id={`faq-answer-${i}`}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '500px' : '0px' }}
              >
                <p className="px-6 pb-5 text-muted-fg text-[15px] leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/FAQ.tsx
git commit -m "feat(faq): light section with accessible accordion component"
```

---

## Task 10: FooterCTA — rounded CTA card with mesh gradient

**Files:**
- Modify: `components/FooterCTA.tsx`

- [ ] **Step 1: Rewrite FooterCTA.tsx**

```tsx
'use client'

import { WaitlistForm } from './WaitlistForm'

export function FooterCTA() {
  return (
    <section className="px-6 py-24" style={{ background: '#111111' }}>
      <div className="max-w-[800px] mx-auto">

        {/* CTA card */}
        <div
          className="relative rounded-[32px] px-8 sm:px-12 py-16 overflow-hidden flex flex-col items-center text-center gap-8"
          style={{
            background: '#1a1a1a',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          {/* Mesh gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(144,226,77,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,100,150,0.1), transparent 50%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="font-bold text-white text-[28px] lg:text-[40px] leading-tight max-w-[600px]">
              Abrile la puerta a tu futuro, el de tus hijos y el de tus nietos.
            </h2>
            <p className="text-white/50 text-lg max-w-[480px]">
              No te quedes afuera. Sumate a la lista de espera y obtené beneficios únicos por 6 meses.
            </p>
            <WaitlistForm variant="dark" />
          </div>
        </div>

        {/* Footer baseline */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-white/40 font-bold text-base">SUMMA</span>

          <div className="flex gap-6">
            {[
              { label: 'Términos', href: '#' },
              { label: 'Privacidad', href: '#' },
              { label: 'Contacto', href: 'mailto:hola@summa.app' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/40 text-sm hover:text-white/70 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <span className="text-white/30 text-sm">
            © {new Date().getFullYear()} Summa
          </span>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/FooterCTA.tsx
git commit -m "feat(footer-cta): rounded card with mesh gradient and footer baseline"
```

---

## Task 11: Update page.tsx and delete obsolete components

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/SocialProof.tsx`
- Delete: `components/ProblemCards.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

```tsx
'use client'

import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { ProblemSolution } from '@/components/ProblemSolution'
import { HowItWorks } from '@/components/HowItWorks'
import { TrustSection } from '@/components/TrustSection'
import { Benefits } from '@/components/Benefits'
import { FAQ } from '@/components/FAQ'
import { FooterCTA } from '@/components/FooterCTA'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Home() {
  useScrollReveal()

  return (
    <main>
      <Nav />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <TrustSection />
      <Benefits />
      <FAQ />
      <FooterCTA />
    </main>
  )
}
```

- [ ] **Step 2: Delete obsolete components**

Delete `components/SocialProof.tsx` and `components/ProblemCards.tsx`. These are fully replaced and have no imports pointing to them after Step 1.

```bash
rm components/SocialProof.tsx components/ProblemCards.tsx
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: All 3 waitlist API tests pass. (Deleted components had no test coverage.)

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Build succeeds with no TypeScript or module resolution errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git add -u components/SocialProof.tsx components/ProblemCards.tsx
git commit -m "feat: wire up redesigned page — 8 sections, remove obsolete components"
```

---

## Task 12: Manual smoke test

No code changes. Verification only.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```
Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Nav pill**
- Pill is visible at top, centered
- On dark (Hero): translucent dark pill, white text
- After scrolling past Hero: translucent light pill, dark text
- "Acceso Anticipado" button smooth-scrolls to waitlist form
- Anchor links scroll to correct sections

- [ ] **Step 3: Hero**
- Two-column layout on desktop, stacked on mobile
- Glassmorphic portfolio card and notification card animate with stagger
- "Quiero mi asesor →" scrolls to waitlist form
- Waitlist form submits correctly

- [ ] **Step 4: Section alternation**
- Hero → dark ✓
- ProblemSolution → light ✓
- HowItWorks → dark ✓
- TrustSection → light ✓
- Benefits → dark ✓
- FAQ → light ✓
- FooterCTA → dark ✓

- [ ] **Step 5: Scroll reveals**
- Elements with `.reveal` class fade in as they enter viewport

- [ ] **Step 6: FAQ accordion**
- Clicking a question opens the answer
- Clicking the same question closes it
- Clicking a different question closes the previous one and opens the new one

- [ ] **Step 7: HowItWorks + Benefits cards**
- Hover on feature cards produces subtle upward translateY + shadow

- [ ] **Step 8: Mobile (375px viewport)**
- Nav shows logo + CTA only, no anchor links
- Hero stacks vertically
- All grids stack to single column
- No horizontal overflow

- [ ] **Step 9: Stop dev server**

```bash
# Ctrl+C
```
