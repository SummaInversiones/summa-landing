# Palm Landing IA Reorder + Reframe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-sequence and re-copy the existing Palm landing React sections into the new funnel flow (Hero → 4-step Explore → Calculator → Comparativa → Pillars pricing close), moving the 0%-fees animation from Explore into Comparativa and adding one new screenshot step-card — no new framework or design language.

**Architecture:** Pure presentational refactor of a Next.js 16 / React 19 app. Section components stay 1:1; only `app/page.tsx` order, per-component copy/markup, and `app/sections.css` rules change. `CardAnimations.tsx` is selector/class-driven and global, so the migrated card needs **zero JS edits**. Verification is build + tsc + SSR smoke checks (this is non-logic UI; there are no unit tests to write — the existing Vitest suite must stay green).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, plain CSS (`sections.css`), `motion` (npm) for card animations, Vitest (existing suite only).

---

## Reference: current vs. target page order

`palm-app/app/page.tsx` today:
```
Hero → Marquee → Problem → Explore → Pillars → Calculator → Comparativa → CtaFinal → Footer
```
Target:
```
Hero → Marquee → Problem → Explore → Calculator → Comparativa → Pillars → CtaFinal → Footer
```
(`ClientEnhancements` and `CardAnimations` stay mounted last, unchanged.)

## Reference: Explore 4-step mapping

| Step | Headline | Card / visual |
|---|---|---|
| 1 | Conocé tus gastos en 5 minutos | **NEW** `pcard--statement` + `/mockups/screen-extracto.png` |
| 2 | Un diagnóstico: cuentas claras, problemas claros | existing `pcard--cc` (scan animation), relabel headline |
| 3 | Tus objetivos, paso por paso | existing `pcard--goals`, relabel headline |
| 4 | Tu portafolio, hecho a medida | existing `pcard--portfolio`, relabel headline |
| — | (removed) Las comisiones escondidas… | `pcard--zero` → **moves to Comparativa** |

## Reference: commands (run from `palm-app/`)

- Type-check: `npx tsc --noEmit`
- Unit tests: `npm test`
- Build: `npm run build`
- Dev server (manual visual check): `npm run dev` → http://localhost:3000

---

## Task 1: Reorder the page (Calculator up, Pillars down)

**Files:**
- Modify: `palm-app/app/page.tsx`

- [ ] **Step 1: Reorder the JSX**

Replace the `return (...)` body of `palm-app/app/page.tsx` so the section order is Hero → Marquee → Problem → Explore → Calculator → Comparativa → Pillars → CtaFinal → Footer. Imports stay as-is (order of imports is irrelevant). Final JSX:

```tsx
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Explore />
      <Calculator />
      <Comparativa />
      <Pillars />
      <CtaFinal />
      <Footer />
      <ClientEnhancements />
      <CardAnimations />
    </>
  );
```

- [ ] **Step 2: Type-check**

Run: `cd palm-app && npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Build**

Run: `cd palm-app && npm run build`
Expected: build succeeds; `/` route compiles.

- [ ] **Step 4: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/page.tsx
git commit -m "refactor(landing): reorder sections — calc after steps, pillars to close"
```

---

## Task 2: Hero — reframe subhead + swap mockup

**Files:**
- Modify: `palm-app/components/Hero.tsx`

Keep the H1 and the asymmetric layout (locked decisions). Change only the subhead text and the mockup `src`.

- [ ] **Step 1: Update the subhead**

In `palm-app/components/Hero.tsx`, replace the subhead paragraph:

```tsx
          <p className="hero-sub reveal" data-delay="150">
            Tu asesor financiero personal. Sin letra chica, sin sorpresas.
          </p>
```

with:

```tsx
          <p className="hero-sub reveal" data-delay="150">
            Todo empieza con tu resumen bancario. Sin letra chica, sin sorpresas.
          </p>
```

- [ ] **Step 2: Swap the hero mockup to the expense-tracker screen**

In the same file, change the mockup image:

```tsx
          <img className="hero-handshot hero-phone" src="/mockups/Hero-section.png" alt="Palm·invest en la app móvil" fetchPriority="high" />
```

to:

```tsx
          <img className="hero-handshot hero-phone" src="/mockups/screen-gastos.png" alt="Resumen de gastos en la app Palm, comisiones arriba" fetchPriority="high" />
```

- [ ] **Step 3: Type-check + build**

Run: `cd palm-app && npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Hero.tsx
git commit -m "feat(hero): reframe subhead to 'resumen bancario' + expense-tracker mockup"
```

---

## Task 3: CSS — add `.pcard--statement` and `.pcard__step` rules

**Files:**
- Modify: `palm-app/app/sections.css` (the `.pcard` block starts near line 2244)

These rules are needed before editing Explore markup (Task 4). `.pcard--statement` styles the new screenshot card; `.pcard__step` styles the step numeral added to all four cards.

- [ ] **Step 1: Add the new CSS rules**

Append the following to `palm-app/app/sections.css` immediately AFTER the existing `.pcard--zero { --pcard-bg: #7B8BD4; }` rule (around line 2633) so it sits with the other `.pcard` variant rules:

```css
/* ── Step numeral (shared by all 4 Explore step cards) ──────────────── */
.pcard__step {
  position: absolute;
  top: 18px;
  left: 22px;
  z-index: 3;
  font-family: var(--font-num);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--gold);
  opacity: 0.9;
}

/* ── Card 1 ("statement") — resumen screenshot, no custom animation ──── */
.pcard--statement {
  --pcard-bg: var(--card);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.pcard--statement .pcard__visual {
  margin-top: auto;
  padding: 0 8px;
}
.pcard--statement .pcard__visual img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
  filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.45));
}
```

- [ ] **Step 2: Build to confirm CSS parses**

Run: `cd palm-app && npm run build`
Expected: build succeeds (CSS is imported by the app; a parse error would fail the build).

- [ ] **Step 3: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/sections.css
git commit -m "style(explore): add pcard--statement + pcard__step rules"
```

---

## Task 4: Explore — 4 numbered steps, new step-1 card, remove zero card

**Files:**
- Modify: `palm-app/components/Explore.tsx`

Three changes: (a) rewrite the head copy, (b) insert the new step-1 `pcard--statement` card and add a `pcard__step` numeral + relabel the `cc`/`goals`/`portfolio` cards as steps 2/3/4, (c) delete the `pcard--zero` card (it moves to Comparativa in Task 5 — copy it out first).

- [ ] **Step 1: Copy the zero-card markup out for Task 5**

Before deleting, copy the entire `<article className="pcard pcard--zero" ...>…</article>` block (currently lines ~142–166 of `Explore.tsx`) into a scratch note / clipboard. Task 5 pastes it verbatim into Comparativa. The block to preserve:

```tsx
          <article className="pcard pcard--zero" data-card="zero" style={{ "--i": 3 } as React.CSSProperties}>
            <h3 className="pcard__headline">Las comisiones escondidas acá no existen.</h3>
            <div className="pcard__visual">
              <div className="g4-stage">
                <div className="g4-zero">0%</div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-7deg" } as React.CSSProperties}>comisión de mantenimiento</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "5deg" } as React.CSSProperties}>costo de custodia</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-3deg" } as React.CSSProperties}>cargo oculto</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
```

- [ ] **Step 2: Rewrite the Explore head**

Replace:

```tsx
        <div className="explore__head">
          <h2 data-split-words>Un diagnóstico real. Un plan concreto.<br />Sin vueltas.</h2>
        </div>
```

with:

```tsx
        <div className="explore__head">
          <h2 data-split-words>De tu resumen a tu plan. <span className="kw">En 5 minutos</span>.</h2>
        </div>
```

- [ ] **Step 3: Insert the new step-1 card as the FIRST child of `.explore__grid`**

Immediately after `<div className="explore__grid">`, insert the new card (it becomes the first grid item, before the existing `pcard--cc`):

```tsx
          {/* Step 1 — resumen screenshot: the starting point */}
          <article className="pcard pcard--statement" data-card="statement" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="pcard__step">01</span>
            <h3 className="pcard__headline">Conocé tus <span className="kw">gastos</span> en 5 minutos.</h3>
            <div className="pcard__visual">
              <img src="/mockups/screen-extracto.png" alt="Resumen bancario importado en Palm" />
            </div>
          </article>
```

- [ ] **Step 4: Renumber the existing cards (steps 2–4) and relabel their headlines**

In the existing `pcard--cc` article: bump `--i` to `1`, add the step numeral as the first child, and relabel the headline. Replace the opening of that article and its `<h3>`:

```tsx
          <article className="pcard pcard--cc" data-card="cc" style={{ "--i": 0 } as React.CSSProperties}>
```
becomes
```tsx
          <article className="pcard pcard--cc" data-card="cc" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="pcard__step">02</span>
```
and its headline
```tsx
            <h3 className="pcard__headline">
              Cuentas claras, problemas claros. Identificamos que es lo mejor para vos.
            </h3>
```
becomes
```tsx
            <h3 className="pcard__headline">
              Un diagnóstico: <span className="kw">cuentas claras</span>, problemas claros.
            </h3>
```

In the `pcard--goals` article: keep `--i` at `1`→ change to `2`, add numeral, relabel. Replace:
```tsx
          <article className="pcard pcard--goals" data-card="goals" style={{ "--i": 1 } as React.CSSProperties}>
            <h3 className="pcard__headline">Que tu trabaje<br />en base a tus<br />objetivos.</h3>
```
with:
```tsx
          <article className="pcard pcard--goals" data-card="goals" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="pcard__step">03</span>
            <h3 className="pcard__headline">Tus <span className="kw">objetivos</span>, paso por paso.</h3>
```

In the `pcard--portfolio` article: change `--i` from `2` to `3`, add numeral, relabel. Replace:
```tsx
          <article className="pcard pcard--portfolio" data-card="portfolio" style={{ "--i": 2 } as React.CSSProperties}>
```
with:
```tsx
          <article className="pcard pcard--portfolio" data-card="portfolio" style={{ "--i": 3 } as React.CSSProperties}>
            <span className="pcard__step">04</span>
```
and its headline
```tsx
            <h3 className="pcard__headline">Tu <span className="kw">portafolio</span>. Armado solo para vos.</h3>
```
becomes
```tsx
            <h3 className="pcard__headline">Tu <span className="kw">portafolio</span>, hecho a medida.</h3>
```

- [ ] **Step 5: Delete the `pcard--zero` article from Explore**

Remove the entire `<article className="pcard pcard--zero" ...>…</article>` block (the one copied in Step 1). The grid now has exactly 4 cards: statement, cc, goals, portfolio.

- [ ] **Step 6: Type-check + build**

Run: `cd palm-app && npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 7: Verify the four step cards render in order via SSR**

Start the dev server and grep the rendered HTML:
```bash
cd palm-app && (npm run dev >/tmp/palm-dev.log 2>&1 &) ; sleep 6 ; \
  curl -s http://localhost:3000 | grep -o 'pcard__step">0[0-9]' ; \
  curl -s http://localhost:3000 | grep -c 'pcard--zero' ; \
  pkill -f "next dev" || true
```
Expected: prints `pcard__step">01`, `02`, `03`, `04` (in order) and the `pcard--zero` count is `0` (it is no longer in Explore; it will reappear after Task 5).

- [ ] **Step 8: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Explore.tsx
git commit -m "feat(explore): 4 numbered steps, new statement step-1, remove zero card"
```

---

## Task 5: Comparativa — absorb the 0% + fee-pills card

**Files:**
- Modify: `palm-app/components/Comparativa.tsx`
- Modify: `palm-app/app/sections.css`

Paste the preserved `pcard--zero` block (from Task 4 Step 1) into Comparativa as a constrained exhibit after the bento grid. Keep the markup verbatim so `CardAnimations` keeps animating it. Add a wrapper CSS rule to constrain its width.

- [ ] **Step 1: Add the `.compare-fees` wrapper CSS**

Append to `palm-app/app/sections.css` (after the `.pcard--statement` rules from Task 3):

```css
/* ── Migrated 0%-fees exhibit inside Comparativa ────────────────────── */
.compare-fees {
  max-width: 380px;
  margin: 32px auto 0;
}
.compare-fees__lead {
  text-align: center;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 20px;
  line-height: 1.2;
  color: var(--cream);
  margin: 0 0 16px;
}
```

- [ ] **Step 2: Insert the exhibit into Comparativa**

In `palm-app/components/Comparativa.tsx`, immediately AFTER the closing `</div>` of `<div className="security-bento ...">` and BEFORE the closing `</div>` of `.container`, insert:

```tsx
        <div className="compare-fees reveal" data-delay="400">
          <p className="compare-fees__lead">Las comisiones ocultas, acá <span className="kw">no existen</span>.</p>
          <article className="pcard pcard--zero" data-card="zero" style={{ "--i": 0 } as React.CSSProperties}>
            <h3 className="pcard__headline">Las comisiones escondidas acá no existen.</h3>
            <div className="pcard__visual">
              <div className="g4-stage">
                <div className="g4-zero">0%</div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-7deg" } as React.CSSProperties}>comisión de mantenimiento</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "5deg" } as React.CSSProperties}>costo de custodia</div>
                  </div>
                </div>
                <div className="g4-pill-wrap">
                  <div className="g4-pill-bob">
                    <div className="g4-pill" style={{ "--rot": "-3deg" } as React.CSSProperties}>cargo oculto</div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
```

Note: the `pcard__headline` inside the card is visually redundant with the `.compare-fees__lead`. Keep the lead as the section copy and the card's own `<h3>` as-is (the 0% + pills animation sits below it) — OR, if it reads cleaner, remove the inner `<h3>` line. Default: keep both; this is a visual judgment to confirm in Step 4.

- [ ] **Step 3: Type-check + build**

Run: `cd palm-app && npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Verify the card renders in Comparativa AND animates**

```bash
cd palm-app && (npm run dev >/tmp/palm-dev.log 2>&1 &) ; sleep 6 ; \
  curl -s http://localhost:3000 | grep -c 'pcard--zero' ; \
  curl -s http://localhost:3000 | grep -c 'compare-fees' ; \
  pkill -f "next dev" || true
```
Expected: `pcard--zero` count is `1` and `compare-fees` count is ≥1. Then open http://localhost:3000 in a browser, scroll to "La diferencia" / Comparativa, and confirm: the `0%` pops in and the three named fee-pills drift and dissolve (same animation as before, now in this section). Confirm `prefers-reduced-motion` shows a static `0%`.

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Comparativa.tsx palm-app/app/sections.css
git commit -m "feat(comparativa): absorb 0% + fee-pills exhibit (markup-only move)"
```

---

## Task 6: Pillars — fixed ARS price + pricing-close framing

**Files:**
- Modify: `palm-app/components/Pillars.tsx`

Pillars already sits last after Task 1. Change the Asesor price from USD to a fixed ARS monthly price (placeholder until the real figure is supplied).

- [ ] **Step 1: Replace the paid badge price**

In `palm-app/components/Pillars.tsx`, replace:

```tsx
            <span className="pillar-badge paid"><span className="num">USD 12.50</span> / mes</span>
```

with (placeholder figure — see Open Input below):

```tsx
            <span className="pillar-badge paid"><span className="num">$ ___ ARS</span> / mes</span>
```

- [ ] **Step 2: Reinforce "precio fijo / sin letra chica" in the Asesor copy**

Confirm the Asesor `pillar-desc` keeps "Sin letra chica, sin sorpresas." (it already does). No change required unless the copy was edited; leave as-is.

- [ ] **Step 3: Type-check + build**

Run: `cd palm-app && npx tsc --noEmit && npm run build`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Pillars.tsx
git commit -m "feat(pillars): fixed ARS price placeholder for Asesor plan"
```

> **OPEN INPUT (blocks launch, not this task):** replace `$ ___ ARS` with the real
> monthly peso figure once provided by the user. Until then the placeholder ships
> in non-production work only.

---

## Task 7: Full-page verification

**Files:** none (verification only)

- [ ] **Step 1: Type-check, unit tests, build, Cloudflare build**

```bash
cd palm-app
npx tsc --noEmit
npm test
npm run build
npx opennextjs-cloudflare build
```
Expected: tsc clean; `npm test` shows the existing 14 tests passing (0 new failures); `npm run build` succeeds; `opennextjs-cloudflare build` completes without error.

- [ ] **Step 2: SSR order smoke check**

```bash
cd palm-app && (npm run dev >/tmp/palm-dev.log 2>&1 &) ; sleep 6 ; \
  curl -s http://localhost:3000 | grep -o 'class="[^"]*\(hero\|explore\|calc\|security\|pillars\|cta\)[^"]*"' | head -20 ; \
  pkill -f "next dev" || true
```
Expected: the section classes appear in DOM order Hero → Explore → (calc) → security(Comparativa) → pillars → cta. (Class names: hero, explore, `calc-section`/`calc`, security, pillars, cta-final.)

- [ ] **Step 3: Manual visual pass in browser**

Run `cd palm-app && npm run dev`, open http://localhost:3000, and confirm:
- Order: Hero → Marquee → Problem → Explore(4 numbered steps) → Calculator → Comparativa(with 0% exhibit) → Pillars(ARS price) → CtaFinal → Footer.
- Explore shows steps 01–04; step 1 is the resumen screenshot, steps 2–4 animate (scan / ball / donut) as before.
- The 0% + fee-pills animation runs inside Comparativa.
- Calculator still computes (move the slider).
- Hero shows the expense-tracker mockup and the new subhead.
- Toggle OS "reduce motion" and reload: all animations resolve to static end-states; nothing is invisible.

- [ ] **Step 4: Final commit (only if Step 1–3 surfaced fixes)**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add -A palm-app
git commit -m "fix(landing): verification follow-ups for IA reorder"
```
(If no fixes were needed, skip this commit.)

---

## Out of scope / do not touch

- `index.html` and the other pre-existing working-tree changes (untracked `vault/`, `utils/`, gsap/shadcn skill dirs, `showcase.html`, `bento-refined.html`) — leave them alone.
- No production deploy, no domain promotion, no secrets. Canary deploy
  (`npm run deploy`) is a separate, user-initiated step.
- `CardAnimations.tsx` — confirmed no change needed; do not refactor it.

## Spec coverage check

- Reorder (calc up / pillars down) → Task 1. ✓
- Hero reframe + mockup → Task 2. ✓
- Explore 4 numbered steps + new step-1 card + remove zero → Tasks 3, 4. ✓
- Calculator stays standalone, repositioned → Task 1 (no internal change). ✓
- Comparativa absorbs 0% card (markup-only) → Task 5. ✓
- Pillars ARS price close → Task 6. ✓
- Locks respected (navy, 2-font, .kw, asymmetric hero, drop-shadow, calc standalone, no icon-tile) → enforced in Tasks 2–6. ✓
- Open input (ARS figure) → flagged in Task 6. ✓
- Verification (tsc/test/build/cf-build/SSR/reduced-motion) → Task 7. ✓
