# Palm React Migration — Plan 2B: Interactive Modules

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Faithfully port the remaining interactive/visual modules onto the Plan 2A page shell: the Three.js hero shader, the live Calculator, the Explore scanner cards, and the Comparativa bento (with count-up).

**Architecture:** Builds on Plan 2A. The shader becomes a `'use client'` component mounting Three.js (npm, not CDN) into the `#shader-bg` container, paused offscreen via IntersectionObserver. The Calculator becomes a client component using **native `<input type="range">` + `<select>`** (the audited `.calc` CSS already styles them — faithful) wired to the existing `lib/annuity.ts`. The Explore + Comparativa sections are markup ports (their CSS is already in `sections.css`; the scanner/lupa is fully static). Count-up `[data-count]` is added to the existing `ClientEnhancements`.

**Tech Stack:** Next.js 16, React 19, `three@0.160.x` (npm), existing `lib/annuity.ts`.

**Spec:** `docs/specs/2026-06-07-palm-react-migration-design.md`
**Reference:** `/home/tron-mrs/Summa/summa-landing/index.html` (DO NOT modify). Work in `palm-app/`.

## Decisions / faithful-port deviations from the spec
- **Native range/select, not shadcn Slider/Select.** The spec named shadcn primitives for accessibility, but the audited `.calc` CSS styles native controls and a faithful pixel match is the Phase-2 priority. Swapping to shadcn Slider/Select (re-themed) is an **enrich-phase** task. Native `<input>`/`<select>` keep keyboard + ARIA anyway.
- **No mathjs.** `lib/annuity.ts` (pure `Math.log`) already produces identical output, so the calculator computes synchronously — no lazy-load/IntersectionObserver gate needed. Keep the disclaimer text in lockstep with the 0%/15% assumptions (vault-locked).
- **GradualBlur is NOT rendered.** Its CSS exists in `sections.css` but the current `index.html` injects no markup for it — so a faithful port omits it (the CSS stays dormant). Revisit in enrich if desired.
- **Decorative phone wobble (CDN motion@11) and the mobile scroll-stack are deferred to enrich** — they're unmotivated decoration; the page is fully functional without them.

## Vault-locked (do not violate)
Shader is kept but MUST pause offscreen via IntersectionObserver and skip on `prefers-reduced-motion` / no-WebGL (brand-gradient CSS fallback remains). Calculator assumptions stay disclosed in the disclaimer. Scanner lupa is a static composition — do not animate it. Source: `vault/`.

## Source line ranges (index.html)
| Module | HTML | JS |
|---|---|---|
| Hero shader | `#shader-bg` lives in Hero (2888–2933) | 4152–4243 |
| Calculator | 3181–3241 | 4070–4148 (logic; reimplemented via annuity.ts) |
| Explore scanner cards | 2971–3139 | none (static CSS) |
| Comparativa bento | 3244–3360 | count-up 3460–3491 |

---

## Task 1: Hero Three.js shader

**Files:**
- Create: `palm-app/components/HeroShader.tsx`
- Modify: `palm-app/components/Hero.tsx` (swap the stub `#shader-bg` div for `<HeroShader />`)
- Install: `three`, `@types/three`

- [ ] **Step 1: Install Three.js**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm install three@^0.160.0 && npm install -D @types/three
```

- [ ] **Step 2: Create `palm-app/components/HeroShader.tsx`** — faithful port of index.html 4152–4243 (same vertex/fragment shaders, `time += dt*3.0`, `setPixelRatio(min(dpr,2))`, resize, offscreen pause via IntersectionObserver on `.hero`, reduced-motion + WebGL guards, brand-gradient CSS fallback on failure). Full cleanup on unmount.
```tsx
"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;
    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
      }
    }
    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`;

export default function HeroShader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return (
          !!(window.WebGL2RenderingContext && c.getContext("webgl2")) ||
          !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")))
        );
      } catch {
        return false;
      }
    })();
    if (prefersReducedMotion || !supportsWebGL) return; // brand-gradient CSS fallback stays

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        if (cancelled) return;

        const camera = new THREE.Camera();
        camera.position.z = 1;
        const scene = new THREE.Scene();
        const geometry = new THREE.PlaneGeometry(2, 2);
        const uniforms = {
          time: { value: 1.0 },
          resolution: { value: new THREE.Vector2() },
        };
        const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
        scene.add(new THREE.Mesh(geometry, material));

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.appendChild(renderer.domElement);
        container.style.background = "transparent";

        const resize = () => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          renderer.setSize(w, h, false);
          uniforms.resolution.value.x = renderer.domElement.width;
          uniforms.resolution.value.y = renderer.domElement.height;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        // Pause when the hero scrolls offscreen
        let running = true;
        const hero = container.closest(".hero");
        let io: IntersectionObserver | undefined;
        if (hero && "IntersectionObserver" in window) {
          io = new IntersectionObserver(
            (entries) => {
              running = entries[0].isIntersecting;
            },
            { threshold: 0 },
          );
          io.observe(hero);
        }

        let last = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          if (!running) {
            last = now;
            return;
          }
          const dt = (now - last) / 1000;
          last = now;
          uniforms.time.value += dt * 3.0;
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(tick);

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", resize);
          io?.disconnect();
          renderer.domElement.remove();
          renderer.dispose();
          geometry.dispose();
          material.dispose();
        };
      } catch (err) {
        console.warn("Shader background failed to initialise:", err);
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <div id="shader-bg" ref={containerRef} aria-hidden />;
}
```

- [ ] **Step 3: Wire into Hero** — in `palm-app/components/Hero.tsx`, replace the stub `#shader-bg` `<div>` with `<HeroShader />` (import it). Keep the rest of the hero markup unchanged. If Hero is currently a server component, importing a `'use client'` child is fine (no `"use client"` needed on Hero).

- [ ] **Step 4: Build + verify**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit && npm run build
```
Expected: both pass.

- [ ] **Step 5: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/HeroShader.tsx palm-app/components/Hero.tsx palm-app/package.json palm-app/package-lock.json
git commit -m "feat(react): port Three.js hero shader (offscreen-paused, guarded)"
```

---

## Task 2: Calculator

**Files:**
- Create: `palm-app/components/Calculator.tsx`

Faithful port of the calc markup (index.html 3181–3241) wired to `lib/annuity.ts`. Native range + select (styled by `.calc` CSS). Computes on every input. es-AR currency formatting.

- [ ] **Step 1: Create `palm-app/components/Calculator.tsx`** (`"use client"`)
```tsx
"use client";

import { useState } from "react";
import {
  SOLO_ANNUAL_RATE,
  PALM_ANNUAL_RATE,
  yearsToTarget,
  displayYears,
} from "@/lib/annuity";

const ar = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const fmtAR = (n: number) => "AR$ " + ar.format(Math.round(n));

const TARGETS = [
  { value: 5_000_000, label: "AR$ 5M · Vacaciones" },
  { value: 14_000_000, label: "AR$ 14M · Auto 0km" },
  { value: 50_000_000, label: "AR$ 50M · Cuota inicial" },
  { value: 100_000_000, label: "AR$ 100M · Apartamento" },
];

export default function Calculator() {
  const [monthly, setMonthly] = useState(95_000);
  const [target, setTarget] = useState(14_000_000);

  const solo = displayYears(yearsToTarget(target, monthly, SOLO_ANNUAL_RATE));
  const palm = displayYears(yearsToTarget(target, monthly, PALM_ANNUAL_RATE));
  const saved = Math.max(0, solo - palm);

  return (
    <section className="calc-section section" id="calculadora" aria-labelledby="calc-section-title">
      <div className="container">
        <div className="calc-section__head">
          <p className="calc-section__eyebrow reveal">Probálo en vivo</p>
          <h2 id="calc-section-title" className="calc-section__title" data-split-words>
            {/* exact headline copy from index.html 3185-3187, with .kw spans preserved */}
          </h2>
          <p className="calc-section__lede reveal" data-delay="200">
            {/* exact lede copy from index.html 3188-3190 */}
          </p>
        </div>

        <div className="calc reveal" data-delay="300" id="vs-calc">
          <div className="calc-field">
            <div className="calc-label-row">
              <label htmlFor="calc-monthly">Aporte mensual</label>
              <output className="calc-out" id="calc-monthly-out" htmlFor="calc-monthly">
                {fmtAR(monthly)}
              </output>
            </div>
            <input
              type="range"
              id="calc-monthly"
              min={20000}
              max={500000}
              step={5000}
              value={monthly}
              onChange={(e) => setMonthly(+e.target.value)}
              aria-label="Aporte mensual en pesos"
            />
          </div>

          <div className="calc-field">
            <label htmlFor="calc-target">Tu objetivo</label>
            <select
              id="calc-target"
              value={target}
              onChange={(e) => setTarget(+e.target.value)}
              aria-label="Objetivo financiero"
            >
              {TARGETS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="calc-rule" />

          <div className="calc-results">
            <div className="calc-col">
              <span className="calc-col-label">Vos solo</span>
              <span className="calc-years num" id="calc-years-solo">{solo}</span>
              <span className="calc-col-unit">años</span>
            </div>
            <div className="calc-arrow" aria-hidden>
              {/* exact arrow markup from index.html 3220-3222 */}
            </div>
            <div className="calc-col">
              <span className="calc-col-label">Con Palm</span>
              <span className="calc-years num gold" id="calc-years-palm">{palm}</span>
              <span className="calc-col-unit">años</span>
            </div>
          </div>

          <p className="calc-savings">
            {/* match index.html 3230-3232: "Te ahorrás N años de tu vida." N in gold italic */}
            <span className="num">{saved} {saved === 1 ? "año" : "años"}</span>
          </p>
          <p className="calc-disclaimer">
            Cálculo orientativo. Asume 0% sobre el ahorro y 15% anual con Palm. Las inversiones tienen riesgo.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Fill the `{/* ... */}` slots** by reading index.html 3181–3241 and copying the exact headline (with `.kw`), lede, arrow SVG/markup, and the `.calc-savings` sentence structure. Match the disclaimer text byte-for-byte (it's already inlined above — verify against 3234–3239).

- [ ] **Step 3: Build + verify the math wiring**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit && npm run build
```
Expected: pass. (Defaults render solo=12, palm=7, saved=5 — same as `lib/annuity.test.ts`.)

- [ ] **Step 4: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Calculator.tsx
git commit -m "feat(react): live Calculator wired to annuity math (native inputs)"
```

---

## Task 3: Count-up effect in ClientEnhancements

**Files:**
- Modify: `palm-app/app/_client/ClientEnhancements.tsx`

Port index.html 3460–3491 (`[data-count]` ease-out count-up, IntersectionObserver threshold 0.4, one-shot). Used by the Comparativa bento (Task 5).

- [ ] **Step 1: Add a count-up block** inside the existing `useEffect` of `ClientEnhancements.tsx` (after the reveal block, before the return). Push its observer disconnect to `cleanups`.
```tsx
    // Count-up numbers ([data-count]) — index.html 3460-3491
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const animateCount = (el: HTMLElement) => {
      const targetVal = parseFloat(el.dataset.count ?? "0");
      const isFloat = !Number.isInteger(targetVal);
      const duration = 1400;
      const start = performance.now();
      const prefix = el.dataset.prefix ?? "+";
      const suffix = el.dataset.suffix ?? "";
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = targetVal * eased;
        el.textContent = prefix + (isFloat ? value.toFixed(2) : Math.floor(value)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isFloat ? targetVal.toFixed(2) : targetVal) + suffix;
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target as HTMLElement);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 },
      );
      counters.forEach((el) => cio.observe(el));
      cleanups.push(() => cio.disconnect());
    } else {
      counters.forEach(animateCount);
    }
```

- [ ] **Step 2: Typecheck**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit
```
Expected: clean.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/_client/ClientEnhancements.tsx
git commit -m "feat(react): port count-up [data-count] animation"
```

---

## Task 4: Explore scanner cards (static markup port)

**Files:**
- Create: `palm-app/components/Explore.tsx` (server component)

Port index.html 2971–3139 verbatim. The scanner/lupa is a STATIC CSS composition (`--scan-x/-y/-r` fixed on `.cc-canvas`) — no JS. Apply the HTML→JSX transform rules from Plan 2A.

- [ ] **Step 1: Create `palm-app/components/Explore.tsx`** — transcribe the `<section class="explore section" id="explore-wip">` block (2971–3139). Critical:
  - Preserve EVERY inline custom-property style: `style="--i:0"` → `style={{ "--i": 0 } as React.CSSProperties}`; `style="--cx:6%; --cy:38%; --rot:-28deg"` → `style={{ "--cx": "6%", "--cy": "38%", "--rot": "-28deg" } as React.CSSProperties}`.
  - Preserve `data-card`, `data-split-words`, `.kw`, `.pcard`, `.pcard--cc`, `.cc-canvas`, `.cc-doc`, `.cc-lupa`, `.pcard__blob` classes exactly.
  - Image `src` for the lupa / card art → `/Card 1/...` or `/mockups/...` (prefix `/`; the dirs exist under `public/`). Verify each path with `ls "public/Card 1"` / `ls public/mockups` — do not guess.
  - `aria-hidden` on decorative layers as in the source.

- [ ] **Step 2: Build**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit && npm run build
```
Expected: pass.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Explore.tsx
git commit -m "feat(react): port Explore scanner cards (static lupa composition)"
```

---

## Task 5: Comparativa bento

**Files:**
- Create: `palm-app/components/Comparativa.tsx` (server component)

Port index.html 3244–3360 (the `<section class="security section" id="seguridad">` — titled "Comparativa honesta", containing `.security-bento`). The bar/donut/split animations are CSS-driven on `.reveal.in`; the numbers use `[data-count]` (animated by Task 3).

- [ ] **Step 1: Create `palm-app/components/Comparativa.tsx`** — transcribe 3244–3360. Critical:
  - Preserve `.security`, `.security__eyebrow`, `.security__title` (`data-split-words`), `.security__lede`, `.security-bento`, and ALL `.bento-*` classes.
  - Preserve `[data-count]`, `data-prefix`, `data-suffix` attributes (3331, 3345, 3350) exactly — Task 3 drives them. The inner default text (e.g. `0`) stays as the child.
  - Preserve any inline `style="--bar-w: ..%"` (or similar) custom props on chart bars → React style objects.
  - Preserve inline SVG markup for the donut/charts verbatim (attributes camelCased where required: `stroke-width`→`strokeWidth`, `stroke-dasharray`→`strokeDasharray`, `stroke-linecap`→`strokeLinecap`, `viewBox` stays `viewBox`).
  - Keep `reveal`/`data-delay`.

- [ ] **Step 2: Build**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit && npm run build
```
Expected: pass.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components/Comparativa.tsx
git commit -m "feat(react): port Comparativa bento (charts + count-up)"
```

---

## Task 6: Compose into the page

**Files:**
- Modify: `palm-app/app/page.tsx`

- [ ] **Step 1: Insert the new sections in the correct vertical order** (replace the Plan-2B placeholder comments):
```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Problem from "@/components/Problem";
import Explore from "@/components/Explore";
import Pillars from "@/components/Pillars";
import Calculator from "@/components/Calculator";
import Comparativa from "@/components/Comparativa";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import { ClientEnhancements } from "@/app/_client/ClientEnhancements";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <Problem />
      <Explore />
      <Pillars />
      <Calculator />
      <Comparativa />
      <CtaFinal />
      <Footer />
      <ClientEnhancements />
    </>
  );
}
```
Match the exact section order in index.html (NAVBAR, HERO, MARQUEE, PROBLEM, EXPLORE, PILLARS, CALCULADORA, COMPARATIVA, CTA, FOOTER).

- [ ] **Step 2: Full build + OpenNext build + SSR sanity**
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build && npx opennextjs-cloudflare build
```
Both must pass. Then boot dev and confirm the new sections render:
```bash
(PORT=3137 npm run dev >/tmp/palm-dev.log 2>&1 &) ; sleep 8 ; curl -sf http://localhost:3137/ -o /tmp/r.html ; for m in 'shader-bg' 'cc-canvas' 'calc-section' 'security-bento' 'data-count'; do printf "%-16s %s\n" "$m" "$(grep -c "$m" /tmp/r.html)"; done ; pkill -f next-server
```
Expected: each marker count ≥ 1.

- [ ] **Step 3: Commit**
```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/page.tsx
git commit -m "feat(react): compose full landing page (all sections)"
```

---

## Definition of done
- `npm run build` + `npx opennextjs-cloudflare build` pass.
- Full page renders all sections in index.html order; shader runs on the hero (pauses offscreen, falls back to brand-gradient when reduced-motion/no-WebGL); calculator updates live and shows 12/7/5 at defaults; scanner cards + comparativa bento render; count-up fires on scroll.
- Root `index.html` unchanged. All work on `feat/react-migration`.
- **User visual-diff gate:** side-by-side vs `index.html` at desktop + mobile (controller cannot do this without a browser).

## Out of scope → enrich phase
shadcn Slider/Select swap for the calculator; GradualBlur (if reintroduced); decorative phone wobble; mobile scroll-stack pinning; GSAP-based richer reveals.
