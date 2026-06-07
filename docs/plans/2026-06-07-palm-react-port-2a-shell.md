# Palm React Migration — Plan 2A: Page Shell & Static Sections

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faithfully reproduce the Palm landing's structure, styling, and entrance/scroll behaviors in React — every section EXCEPT the heavy interactive modules (those are Plan 2B).

**Architecture:** Bring the audited CSS over verbatim into a single `app/sections.css` (class names, keyframes, and `@property` rules unchanged — lowest regression). Translate each section's HTML to a JSX component. Replicate the original global `<script>` behaviors (scroll-compress navbar, IntersectionObserver reveals, 3D tilt, word-split headings) inside one mounted `'use client'` component. The burger menu becomes a shadcn `Sheet`. The Three.js shader, calculator, scanner, bento charts, and GradualBlur are deliberately stubbed/omitted here and built in Plan 2B.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 (tokens already mapped), shadcn/ui (Sheet), React 19.

**Spec:** `docs/specs/2026-06-07-palm-react-migration-design.md`
**Reference source:** `/home/tron-mrs/Summa/summa-landing/index.html` (the live page; DO NOT modify it). Work in `palm-app/`.

**Next.js 16 warning:** This is Next 16 — read `node_modules/next/dist/docs/01-app/` before using Next-specific APIs (`next/image`, metadata, etc.). See `palm-app/AGENTS.md`.

---

## Vault-locked constraints (do not violate)
Palette + 2 fonts only; navy-only page theme; asymmetric hero (copy left, phone right); NO gradient-text headlines; `.kw` keyword = IBM Plex italic medium gold; marquee keeps middle-dots; drop-shadow screenshots (no CSS phone bezel). Source: `vault/concepts/Anti-patterns.md`, `vault/history/Decisions.md`. The port must reproduce `index.html` exactly — if a behavior seems wrong, it's intentional; preserve it.

## HTML→JSX transform rules (apply in every section task)
- `class=` → `className=`; `for=` → `htmlFor=`; `<!-- x -->` → `{/* x */}`.
- Self-close void elements (`<img ... />`, `<hr />`, `<br />`, `<input ... />`).
- `style="--foo: 1"` inline custom props → `style={{ ["--foo" as string]: "1" }}`.
- Image `src="mockups/x.png"` → `src="/mockups/x.png"` (assets are in `public/`). Keep plain `<img>` for a faithful port; add `{/* eslint-disable-next-line @next/next/no-img-element */}` above each `<img>` (or set that rule off — see Task 1 Step 4).
- Keep every class name and `data-*` attribute byte-for-byte (the CSS and the client effects key off them).
- `aria-hidden="true"` stays as `aria-hidden`. Boolean-ish attrs: `fetchpriority="high"` → `fetchPriority="high"`.

## Source line ranges (from index.html)
| Region | CSS lines | HTML lines |
|---|---|---|
| Navbar | 181–311 | 2863–2884 |
| Hero | 312–382 (+ shader bg styles) | 2888–2933 |
| GradualBlur (Plan 2B) | 383–440 | — |
| Marquee | 1112–1150 | 2937–2953 |
| Problem | (search `.problem`) | 2957–2967 |
| Explore/scanner (Plan 2B) | 1934–2650 | 2971–3139 |
| Pillars | (search `.pillars`,`.pcard`) | 3142–3178 |
| Calculator (Plan 2B for JS) | (search `.calc`) | 3181–3241 |
| Comparativa bento (Plan 2B) | 1934–2205 | 3244–3360 |
| CTA-final | (search `.cta-final`) | 3363–3388 |
| Footer | (search `.footer`) | 3391–3406 |
| Reveal / split-words | 2313–2328, 2834–2855 | — |
| Global JS (navbar/reveal/tilt) | — | 3407–3527 |

---

## Task 1: Relocate the audited CSS into `app/sections.css`

**Files:**
- Create: `palm-app/app/sections.css`
- Modify: `palm-app/app/layout.tsx` (import it), `palm-app/eslint.config.mjs`

- [ ] **Step 1: Create `palm-app/app/sections.css`** by copying, from `index.html`, all CSS **between** the `:root`/token blocks already ported (i.e., everything after the `RESET` at line ~130) and the closing `</style>` (line ~2856) **EXCEPT**: the `@font-face` blocks (lines 18–67, already in globals.css), the two `:root` token blocks (78–125), and the `@property --scan-x/--scan-y` blocks (lines ~103–112). Concretely: copy lines ~130–2856, then delete any duplicate `:root{}` / `@font-face` fragments. Keep ALL other rules verbatim — `.navbar`, `.hero`, `.marquee`, `.problem`, `.pillars`, `.pcard`, `.calc*`, `.security*`, `.bento*`, `.cc-canvas`, `.gradual-blur`, `.reveal`, `[data-split-words]`, and every `@keyframes` and `@media` block.

  Also copy the `@property --scan-x` and `@property --scan-y` blocks (index.html lines ~103–112) to the TOP of `sections.css` (they must be registered for the Plan 2B scanner; harmless now).

- [ ] **Step 2: Import it once** — add to `palm-app/app/layout.tsx`, immediately after `import "./globals.css";`:
```tsx
import "./sections.css";
```

- [ ] **Step 3: Verify the build compiles the CSS**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build
```
Expected: compiles with no CSS parse errors. (Visual correctness is checked per-section later.)

- [ ] **Step 4: Allow plain `<img>`** — in `palm-app/eslint.config.mjs`, add a rule turning off `@next/next/no-img-element` (faithful port uses `<img>`; revisit in enrich). Add a config object:
```js
{
  rules: { "@next/next/no-img-element": "off" },
}
```
Run `npx eslint .` → no `no-img-element` errors.

- [ ] **Step 5: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/sections.css palm-app/app/layout.tsx palm-app/eslint.config.mjs
git commit -m "feat(react): relocate audited section CSS verbatim"
```

---

## Task 2: Client enhancements — reveals, navbar scroll, tilt, split-words

Ports the global `<script>` (index.html 3407–3527) and the `[data-split-words]` splitter into one mounted client component. These use `document.querySelectorAll` on purpose — it is the most faithful 1:1 port. (The burger menu is NOT here; it becomes a Sheet in Task 3.)

**Files:**
- Create: `palm-app/app/_client/ClientEnhancements.tsx`

- [ ] **Step 1: Create `palm-app/app/_client/ClientEnhancements.tsx`**
```tsx
"use client";

import { useEffect } from "react";

/**
 * Faithful port of the global <script> in index.html (navbar scroll-compress,
 * IntersectionObserver scroll-reveal, 3D pillar tilt) plus the data-split-words
 * heading splitter. Runs once on mount; mirrors the original vanilla behavior.
 */
export function ClientEnhancements() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Navbar pill compress past 200px
    const navbar = document.querySelector(".navbar");
    const onScroll = () => navbar?.classList.toggle("scrolled", window.scrollY > 200);
    if (navbar) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Split words: wrap each word of [data-split-words] in <span class="split-word">
    const splitEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-split-words]:not(.split-ready)"),
    );
    splitEls.forEach((el) => {
      const text = el.textContent ?? "";
      el.textContent = "";
      text.split(/(\s+)/).forEach((token) => {
        if (token.trim() === "") {
          el.appendChild(document.createTextNode(token));
        } else {
          const span = document.createElement("span");
          span.className = "split-word";
          span.textContent = token;
          el.appendChild(span);
        }
      });
      el.classList.add("split-ready");
    });

    // Scroll reveal
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      reveals.forEach((el) => io!.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    // 3D tilt + sheen on [data-tilt] (skipped when reduced-motion)
    const tiltCleanups: Array<() => void> = [];
    if (!reduced) {
      const max = 6;
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        let raf = 0;
        let pending: { x: number; y: number } | null = null;
        const apply = () => {
          raf = 0;
          if (!pending) return;
          const { x, y } = pending;
          el.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
          el.style.setProperty("--sheen-angle", `${90 + x * 60}deg`);
        };
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          pending = {
            x: (e.clientX - r.left) / r.width - 0.5,
            y: (e.clientY - r.top) / r.height - 0.5,
          };
          if (!raf) raf = requestAnimationFrame(apply);
          el.classList.add("is-tilting");
        };
        const onLeave = () => {
          el.classList.remove("is-tilting");
          el.style.transform = "";
          pending = null;
        };
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        tiltCleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      if (navbar) window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      tiltCleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
```

- [ ] **Step 2: Verify the split-words logic matches index.html.** Open `index.html`, find the `[data-split-words]` splitter script (search `split-word`), and confirm: it wraps each whitespace-separated word in `<span class="split-word">`, preserves whitespace nodes, and adds `split-ready` to the element. If index.html does anything extra (e.g., per-word transition-delay via inline style or `--i` index), replicate it exactly. Adjust the code above to match.

- [ ] **Step 3: Typecheck**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit
```
Expected: clean. (It renders nothing yet; wired in Task 10.)

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/_client/ClientEnhancements.tsx
git commit -m "feat(react): port reveal/navbar-scroll/tilt/split-words client effects"
```

---

## Task 3: Navbar component (scroll-compress + burger Sheet)

The navbar scroll-compress is handled by `ClientEnhancements` (it toggles `.scrolled`). This task is the markup + the burger menu, which becomes a shadcn `Sheet` (accessible, focus-trapped) replacing the hand-rolled `#mobileMenu`.

**Files:**
- Create: `palm-app/components/Navbar.tsx`
- Add shadcn Sheet: `palm-app/components/ui/sheet.tsx`

- [ ] **Step 1: Add the Sheet primitive**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx shadcn@latest add sheet
```
Read `components/ui/sheet.tsx` after; confirm it exports `Sheet`, `SheetTrigger`, `SheetContent`, `SheetTitle`.

- [ ] **Step 2: Create `palm-app/components/Navbar.tsx`** (`"use client"` — it owns Sheet open state). Port the markup from index.html lines 2863–2884 for the pill (logo + wordmark + gold CTA + burger). Move the contents of `#mobileMenu` (the menu links/sheet) into `<SheetContent>`. Requirements:
  - Keep classes `.navbar`, `.nav-inner`, the logo/wordmark, and the gold CTA exactly (the CSS styles them).
  - The burger `<button class="nav-burger">` becomes the `<SheetTrigger asChild>`.
  - `<SheetContent>` MUST include a `<SheetTitle className="sr-only">Menú</SheetTitle>` (a11y).
  - Each menu link closes the sheet on click (Sheet does this if links are inside; for in-page anchors, also call the Sheet's `onOpenChange`).
  - Use the gradient logo image from `/mockups/` (match index.html's logo `src`).

```tsx
"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* left: logo + wordmark — copy exact markup/classes from index.html 2863–2884 */}
        {/* right: gold CTA "Bajate la app" + burger trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="nav-burger" aria-label="Abrir menú">
              <span /><span /><span />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            {/* menu links from #mobileMenu; each: onClick={() => setOpen(false)} */}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```
Fill in the exact markup by reading index.html 2863–2884 (and the `#mobileMenu` block — search `id="mobileMenu"`).

- [ ] **Step 3: Build + typecheck**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build
```
Expected: succeeds.

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Navbar.tsx palm-app/components/ui/sheet.tsx palm-app/package.json palm-app/package-lock.json
git commit -m "feat(react): Navbar with scroll-compress and shadcn Sheet menu"
```

---

## Tasks 4–9: Static sections (one component each)

For EACH section below, follow the same recipe:
1. Create `palm-app/components/<Name>.tsx` (server component unless it needs interactivity — none of these do; the reveals/tilt are handled globally by `ClientEnhancements`).
2. Port the HTML from the given `index.html` line range to JSX using the transform rules above. Keep all classes and `data-*` attributes (`reveal`, `data-delay`, `data-split-words`, `data-tilt`, `kw`).
3. Build (`npm run build`) → must succeed.
4. Commit `git add palm-app/components/<Name>.tsx && git commit -m "feat(react): port <Name> section"`.

- [ ] **Task 4: `Hero.tsx`** — index.html 2888–2933. Asymmetric 2-col: `.hero-copy` (headline with `.kw` on "inversor", subhead, `.store-row` with App Store + Google Play buttons) left; `.hero-handshot-wrap` (img `/mockups/Hero-section.png`) right. **Shader stub:** include the `#shader-bg` container div exactly as in index.html (the CSS gives it the brand-gradient + scrim fallback), but DO NOT add Three.js — Plan 2B fills it. Keep `reveal`/`data-delay` attrs.

- [ ] **Task 5: `Marquee.tsx`** — index.html 2937–2953. The `.marquee` band with `.marquee-track` repeated 3× for the seamless loop (the CSS `@keyframes marquee` animates it; no JS). Keep middle-dots (`·`) between items — vault-locked. `aria-hidden`.

- [ ] **Task 6: `Problem.tsx`** — index.html 2957–2967. 2-col text/figure. Headline with `.kw` on "mirar de lejos", gradient divider, "Hasta ahora." resolution line (gold italic Plex — NOT gradient text), figure img. Keep `reveal`/`data-delay`.

- [ ] **Task 7: `Pillars.tsx`** — index.html 3142–3178. `.pillars-grid` with two `.pcard` (Gratuita / Pago). Typography-only, gold/violet checkmarks, CTAs, USD badge + "Acceso por invitación" footnote on pillar 2. Keep `data-tilt` on the cards (the global tilt effect drives them) and the 3px brand-gradient top border (CSS). No screenshots, no calculator (vault-locked).

- [ ] **Task 8: `CtaFinal.tsx`** — index.html 3363–3388. Left-aligned Statement-Letter: headline with `.kw` on "hoy", body, gradient rule, two store buttons (App Store solid + Play ghost), "Seguinos en @palm.inversiones" (no emoji). Keep `reveal`/`data-delay`.

- [ ] **Task 9: `Footer.tsx`** — index.html 3391–3406. Single line: logo + wordmark (60% opacity), © line, términos/privacidad. Brand-gradient top border (CSS).

---

## Task 10: Compose the page

**Files:**
- Modify: `palm-app/app/page.tsx`

Sections still in Plan 2B (Explore scanner, Calculator, Comparativa bento, GradualBlur) are omitted here — leave clearly marked placeholders so the vertical order is correct.

- [ ] **Step 1: Replace `palm-app/app/page.tsx`**
```tsx
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Problem } from "@/components/Problem";
import { Pillars } from "@/components/Pillars";
import { CtaFinal } from "@/components/CtaFinal";
import { Footer } from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      {/* Plan 2B: <Explore /> scanner cards */}
      <Pillars />
      {/* Plan 2B: <Calculator /> */}
      {/* Plan 2B: <Comparativa /> bento */}
      <CtaFinal />
      <Footer />
      {/* Plan 2B: <GradualBlur /> */}
      <ClientEnhancements />
    </>
  );
}
```
Remove the `min-h-full flex flex-col` wrapper assumptions if they conflict — the sections use their own `.section` CSS.

- [ ] **Step 2: Full build + OpenNext build**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build && npx opennextjs-cloudflare build
```
Expected: both succeed.

- [ ] **Step 3: Visual diff (manual gate)** — run the React app and the original side by side:
  - Terminal A: `cd palm-app && npm run dev` (Next, port 3000 or next free).
  - Terminal B: original — `cd .. && npx serve -p 4000 .` then open `http://localhost:4000/index.html`.
  - Compare each ported section at desktop (≥1120px) and mobile (375px): navbar pill + compress-on-scroll, hero 2-col→stack, marquee scroll, problem, pillars tilt, CTA, footer. Reveals fire on scroll. Note any mismatch and fix in the relevant component (markup/class) before sign-off. The Plan-2B sections will be visibly missing — that's expected.

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/page.tsx
git commit -m "feat(react): compose landing page shell (static sections)"
```

---

## Definition of done
- `npm run build` and `npx opennextjs-cloudflare build` succeed.
- The page renders Navbar, Hero, Marquee, Problem, Pillars, CTA-final, Footer with the audited styling; reveals and tilt work; navbar compresses past 200px; burger opens an accessible Sheet.
- Visual diff against `index.html` matches for the ported sections at desktop + mobile.
- Root `index.html` unchanged. All work committed on `feat/react-migration`.

## Out of scope → Plan 2B
Three.js hero shader; Calculator (Slider/Select + annuity wiring + lazy + es-AR formatting, using `lib/annuity.ts`); Explore scanner/lupa cards (`--scan-x/-y` tracking); Comparativa bento (charts, donut, count-up `[data-count]`, animated bars on `.reveal.in`); GradualBlur overlay; the decorative `motion@11` phone wobble (reimplement with GSAP or drop).
