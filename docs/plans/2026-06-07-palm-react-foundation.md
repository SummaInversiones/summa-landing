# Palm React Migration — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable Next.js (App Router) + Tailwind v4 + shadcn/ui skeleton for the Palm landing on Cloudflare, including the two pieces with real testable logic — the calculator annuity math and the waitlist API.

**Architecture:** A new Next.js app is scaffolded in a `palm-app/` subdirectory (the existing root `index.html` stays untouched as the visual reference until the faithful-port plan is signed off). The app is configured for Cloudflare Workers via `@opennextjs/cloudflare`. Design tokens, self-hosted fonts, and assets are ported verbatim from `index.html`. shadcn/ui is initialized with the Palm palette mapped onto its semantic tokens. Tests use Vitest.

**Tech Stack:** Next.js 15+ (App Router, TypeScript), Tailwind CSS v4, `@opennextjs/cloudflare`, shadcn/ui (base/radix), `@upstash/redis`, Vitest.

**Spec:** `docs/specs/2026-06-07-palm-react-migration-design.md`

**Scope note:** This plan covers spec Phase 1 (Scaffold) + the testable slices of Phase 3 (waitlist API) and the Calculator's math (`lib/annuity.ts`). The section-by-section faithful port (Phase 2) and the enrich pass (Phase 4) are separate later plans. The visual `index.html` is NOT modified or deleted by this plan.

---

## File structure

Created in this plan (all under `palm-app/` unless noted):

| File | Responsibility |
|---|---|
| `palm-app/` | New Next-on-Cloudflare app (scaffolded by C3). |
| `palm-app/next.config.ts` | Next config + `initOpenNextCloudflareForDev()`. |
| `palm-app/wrangler.jsonc` | Cloudflare Worker config (created by C3; edited for name/vars). |
| `palm-app/open-next.config.ts` | OpenNext build config (created by C3). |
| `palm-app/app/globals.css` | Tailwind v4 import, `@font-face`, Palm `:root` tokens, shadcn semantic-token mapping, `@theme inline`. |
| `palm-app/app/layout.tsx` | Root layout: fonts, metadata, `<body>` on navy. |
| `palm-app/app/page.tsx` | Placeholder landing page (replaced in Phase 2). |
| `palm-app/public/fonts/*` | Self-hosted Neue Haas Grotesk faces (copied from root `fonts/`). |
| `palm-app/public/mockups/`, `public/Card 1/`, `public/Card 2/` | Imagery (copied from root). |
| `palm-app/lib/annuity.ts` | Pure compound-annuity time-to-target math. |
| `palm-app/lib/utils.ts` | `cn()` helper (created by shadcn init). |
| `palm-app/app/api/waitlist/route.ts` | `POST` waitlist handler → Upstash `SADD`. |
| `palm-app/vitest.config.ts` | Vitest config. |
| `palm-app/lib/annuity.test.ts` | Annuity unit tests. |
| `palm-app/app/api/waitlist/route.test.ts` | Waitlist route tests (mocked Upstash). |

---

## Task 1: Scaffold the Next-on-Cloudflare app

**Files:**
- Create: `palm-app/` (entire scaffold)

- [ ] **Step 1: Confirm you are on the migration branch and at the repo root**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing && git branch --show-current && ls index.html
```
Expected: prints `feat/react-migration` and `index.html`.

- [ ] **Step 2: Scaffold via Cloudflare's C3 (creates a Next app pre-wired for Workers + OpenNext)**

Run:
```bash
npm create cloudflare@latest -- palm-app --framework=next --platform=workers
```
When prompted by the underlying `create-next-app`, answer:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **No**
- App Router: **Yes**
- Turbopack: **Yes** (default)
- Import alias: **No** (keep default `@/*`)
- C3 "Do you want to deploy?": **No**

Expected: a new `palm-app/` directory containing `app/`, `next.config.ts`, `wrangler.jsonc`, `open-next.config.ts`, and `package.json` with `opennextjs-cloudflare` scripts.

- [ ] **Step 3: Verify the OpenNext scripts exist**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && grep -E '"(preview|deploy|cf-typegen)"' package.json
```
Expected: lines for `preview`, `deploy`, and `cf-typegen` referencing `opennextjs-cloudflare`. If `preview`/`deploy` are missing, add them to `package.json`:
```json
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
```

- [ ] **Step 4: Verify `initOpenNextCloudflareForDev` is wired in `next.config.ts`**

Run:
```bash
grep -n "initOpenNextCloudflareForDev" /home/tron-mrs/Summa/summa-landing/palm-app/next.config.ts
```
Expected: a match. If absent, append to `palm-app/next.config.ts`:
```typescript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
```

- [ ] **Step 5: Confirm dev server boots**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && timeout 25 npm run dev || true
```
Expected: Next prints "Ready" / a local URL within the timeout (the `timeout` kills it; we only need the boot confirmation). No compile errors.

- [ ] **Step 6: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app
git commit -m "feat(react): scaffold Next-on-Cloudflare app in palm-app/"
```

---

## Task 2: Set the Cloudflare Worker name to a non-production preview

**Files:**
- Modify: `palm-app/wrangler.jsonc`

We deploy to a separate preview Worker so the live static site on Cloudflare Pages is untouched during migration.

- [ ] **Step 1: Set a distinct Worker name**

In `palm-app/wrangler.jsonc`, set the `name` field:
```jsonc
{
  "name": "palm-app-preview",
  // ...rest of the C3-generated config unchanged
}
```

- [ ] **Step 2: Verify the file still parses**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx wrangler deploy --dry-run 2>&1 | head -20
```
Expected: a dry-run summary naming `palm-app-preview`, no parse error. (Authentication errors are fine here — we only want config validation.)

- [ ] **Step 3: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/wrangler.jsonc
git commit -m "chore(react): name preview worker palm-app-preview"
```

---

## Task 3: Self-host fonts and port the Palm design tokens

**Files:**
- Create: `palm-app/public/fonts/` (copied faces)
- Modify: `palm-app/app/globals.css`

- [ ] **Step 1: Copy the font files**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
mkdir -p palm-app/public/fonts
cp fonts/NHaasGroteskDSPro-15UltTh.otf fonts/NHaasGroteskDSPro-25Th.otf fonts/NHaasGroteskDSPro-55Rg.otf fonts/NHaasGroteskTXPro-65Md.ttf fonts/NHaasGroteskTXPro-75Bd.ttf palm-app/public/fonts/
ls palm-app/public/fonts/
```
Expected: the five font files listed.

- [ ] **Step 2: Replace `palm-app/app/globals.css` with the Palm token base**

Set the file to exactly:
```css
@import "tailwindcss";

/* ─────────────────────────────────────────
   Self-hosted Neue Haas Grotesk Pro
   Paths are absolute from /public.
   ───────────────────────────────────────── */
@font-face { font-family: 'NHaasGrotesk'; src: url('/fonts/NHaasGroteskDSPro-15UltTh.otf') format('opentype'); font-weight: 150; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGrotesk'; src: url('/fonts/NHaasGroteskDSPro-25Th.otf') format('opentype'); font-weight: 200; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGrotesk'; src: url('/fonts/NHaasGroteskDSPro-55Rg.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGrotesk'; src: url('/fonts/NHaasGroteskTXPro-65Md.ttf') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGrotesk'; src: url('/fonts/NHaasGroteskTXPro-75Bd.ttf') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGroteskDS'; src: url('/fonts/NHaasGroteskDSPro-55Rg.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'NHaasGroteskDS'; src: url('/fonts/NHaasGroteskDSPro-25Th.otf') format('opentype'); font-weight: 200; font-style: normal; font-display: swap; }

:root {
  /* Palm palette — vault-locked, do not change (see vault/history/Decisions.md) */
  --navy: #101B3B;
  --gold: #F0C14D;
  --blue: #26428B;
  --violet: #9747FF;
  --cream: #FFFCF5;
  --dark: #0A1428;
  --card: #0D1830;
  --alert: #E5484D;

  --cream-rgb: 255, 252, 245;
  --gold-rgb: 240, 193, 77;
  --navy-rgb: 16, 27, 59;
  --alert-rgb: 229, 72, 77;

  --brand-gradient: linear-gradient(135deg, #26428B 0%, #9747FF 50%, #F0C14D 100%);

  --font-display: 'NHaasGrotesk', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-num: 'IBM Plex Sans', system-ui, sans-serif;

  --container: 1120px;
  --pad-x: 24px;
  --pad-y: 96px;

  /* shadcn/ui semantic tokens mapped onto the Palm palette.
     Single navy theme — no light/dark split. */
  --background: var(--navy);
  --foreground: var(--cream);
  --card-foreground: var(--cream);
  --popover: var(--card);
  --popover-foreground: var(--cream);
  --primary: var(--gold);
  --primary-foreground: var(--navy);
  --secondary: var(--blue);
  --secondary-foreground: var(--cream);
  --muted: var(--card);
  --muted-foreground: rgba(var(--cream-rgb), 0.62);
  --accent: var(--violet);
  --accent-foreground: var(--cream);
  --destructive: var(--alert);
  --destructive-foreground: var(--cream);
  --border: rgba(var(--cream-rgb), 0.08);
  --input: rgba(var(--cream-rgb), 0.12);
  --ring: var(--gold);
  --radius: 0.5rem;
}

@theme inline {
  --color-navy: var(--navy);
  --color-gold: var(--gold);
  --color-blue: var(--blue);
  --color-violet: var(--violet);
  --color-cream: var(--cream);
  --color-card: var(--card);
  --color-alert: var(--alert);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --font-display: var(--font-display);
  --font-num: var(--font-num);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  background: var(--navy);
  color: var(--cream);
}
```

- [ ] **Step 3: Add IBM Plex Sans + font preconnect in `palm-app/app/layout.tsx`**

In `palm-app/app/layout.tsx`, ensure `globals.css` is imported and add the Google Fonts link + metadata. Replace the file body's `<html>`/`<head>` area so it includes:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palm Inversiones",
  description: "Tu asesor financiero personal. Sin letra chica, sin sorpresas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify it compiles**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && timeout 25 npm run dev || true
```
Expected: boots with no CSS/TS errors.

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/public/fonts palm-app/app/globals.css palm-app/app/layout.tsx
git commit -m "feat(react): self-host fonts and port Palm design tokens"
```

---

## Task 4: Initialize shadcn/ui against the Palm tokens

**Files:**
- Create: `palm-app/components.json`, `palm-app/lib/utils.ts`
- Modify: `palm-app/app/globals.css` (shadcn init may append; reconcile)

- [ ] **Step 1: Run shadcn init**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx shadcn@latest init
```
When prompted: base color **Neutral** (we override with Palm tokens anyway), and accept the detected Tailwind v4 + App Router setup. This creates `components.json` and `lib/utils.ts`.

- [ ] **Step 2: Re-assert the Palm semantic tokens**

If `shadcn init` overwrote or appended conflicting `:root`/`@theme` blocks in `globals.css`, restore the Palm token block from Task 3 Step 2 as the source of truth (keep shadcn's `@import "tailwindcss"` and any `tw-animate-css`/plugin imports it added at the top). Verify:
```bash
grep -n -- "--primary: var(--gold)" /home/tron-mrs/Summa/summa-landing/palm-app/app/globals.css
```
Expected: a match (the Palm mapping survived).

- [ ] **Step 3: Add one primitive to prove theming works**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx shadcn@latest add button
```
Expected: `components/ui/button.tsx` created.

- [ ] **Step 4: Verify compile**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx tsc --noEmit
```
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/components.json palm-app/lib/utils.ts palm-app/components/ui/button.tsx palm-app/app/globals.css palm-app/package.json palm-app/package-lock.json
git commit -m "feat(react): init shadcn/ui mapped to Palm semantic tokens"
```

---

## Task 5: Copy image assets into the app's public dir

**Files:**
- Create: `palm-app/public/mockups/`, `palm-app/public/Card 1/`, `palm-app/public/Card 2/`

- [ ] **Step 1: Copy the asset directories verbatim**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing
cp -r mockups "palm-app/public/mockups"
cp -r "Card 1" "palm-app/public/Card 1"
cp -r "Card 2" "palm-app/public/Card 2"
ls palm-app/public/mockups | wc -l
```
Expected: a non-zero file count for `mockups` (the page references `screen-*.png`, `problem-figure.png`, etc.).

- [ ] **Step 2: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add "palm-app/public/mockups" "palm-app/public/Card 1" "palm-app/public/Card 2"
git commit -m "chore(react): copy landing imagery into palm-app/public"
```

---

## Task 6: Set up Vitest

**Files:**
- Create: `palm-app/vitest.config.ts`
- Modify: `palm-app/package.json` (add `test` script)

- [ ] **Step 1: Install Vitest**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm install -D vitest
```
Expected: installs without error.

- [ ] **Step 2: Create `palm-app/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Add the test script to `package.json`**

Add to the `"scripts"` block:
```json
"test": "vitest run"
```

- [ ] **Step 4: Verify the runner starts (no tests yet)**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run
```
Expected: "No test files found" (exit is fine) — confirms Vitest is wired.

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/vitest.config.ts palm-app/package.json palm-app/package-lock.json
git commit -m "chore(react): set up Vitest"
```

---

## Task 7: Calculator annuity math (`lib/annuity.ts`) — TDD

**Files:**
- Test: `palm-app/lib/annuity.test.ts`
- Create: `palm-app/lib/annuity.ts`

The formula matches `index.html` exactly. The mathjs path and the native `Math.log` fallback in the original are mathematically identical, so this is implemented as a pure `Math.log` function with **no mathjs dependency** (a YAGNI win — mathjs added ~500KB for one `log`). Defaults below come from the section map (aporte 95k, objetivo 14M).

- [ ] **Step 1: Write the failing tests**

Create `palm-app/lib/annuity.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import {
  SOLO_ANNUAL_RATE,
  PALM_ANNUAL_RATE,
  yearsToTarget,
  displayYears,
} from "./annuity";

describe("annuity rates", () => {
  it("locks the disclosed assumptions", () => {
    expect(SOLO_ANNUAL_RATE).toBe(0);
    expect(PALM_ANNUAL_RATE).toBe(0.15);
  });
});

describe("yearsToTarget", () => {
  it("uses linear division when the rate is 0", () => {
    // 12,000,000 / 100,000 = 120 months = exactly 10 years
    expect(yearsToTarget(12_000_000, 100_000, 0)).toBe(10);
  });

  it("uses the compound-annuity formula when the rate is positive", () => {
    // ln(1 + FV*r/PMT)/ln(1+r), r = 0.15/12, then /12 → ~7.0 years
    const years = yearsToTarget(14_000_000, 95_000, PALM_ANNUAL_RATE);
    expect(years).toBeGreaterThan(6.8);
    expect(years).toBeLessThan(7.2);
  });
});

describe("displayYears", () => {
  it("rounds to a whole number", () => {
    expect(displayYears(7.0082)).toBe(7);
  });

  it("never returns less than 1", () => {
    expect(displayYears(0.3)).toBe(1);
  });

  it("reproduces the section-map default: solo 12, Palm 7, saved 5", () => {
    const solo = displayYears(yearsToTarget(14_000_000, 95_000, SOLO_ANNUAL_RATE));
    const palm = displayYears(yearsToTarget(14_000_000, 95_000, PALM_ANNUAL_RATE));
    expect(solo).toBe(12);
    expect(palm).toBe(7);
    expect(Math.max(0, solo - palm)).toBe(5);
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run lib/annuity.test.ts
```
Expected: FAIL — cannot resolve `./annuity` / exports undefined.

- [ ] **Step 3: Implement `palm-app/lib/annuity.ts`**

```typescript
/**
 * Compound-annuity time-to-target math for the calculator.
 * Ported verbatim from index.html (the mathjs and Math.log paths there are
 * mathematically identical, so no mathjs dependency is needed).
 *
 * Assumptions are disclosed in the calculator disclaimer and locked here:
 * vault/history/Decisions.md — "Calculator assumptions are disclosed, not invented".
 */

export const SOLO_ANNUAL_RATE = 0; // pure savings, no real return
export const PALM_ANNUAL_RATE = 0.15; // implied advisory product return

/** Years for monthly contributions PMT to reach future value FV at an annual rate. */
export function yearsToTarget(
  futureValue: number,
  monthlyContribution: number,
  annualRate: number,
): number {
  if (annualRate === 0) {
    return futureValue / monthlyContribution / 12;
  }
  const r = annualRate / 12;
  const months =
    Math.log(1 + (futureValue * r) / monthlyContribution) / Math.log(1 + r);
  return months / 12;
}

/** What the UI shows: whole years, never below 1 (matches index.html). */
export function displayYears(years: number): number {
  return Math.max(1, Math.round(years));
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run lib/annuity.test.ts
```
Expected: PASS (all cases green).

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/lib/annuity.ts palm-app/lib/annuity.test.ts
git commit -m "feat(react): add calculator annuity math with tests"
```

---

## Task 8: Waitlist API route — TDD

**Files:**
- Test: `palm-app/app/api/waitlist/route.test.ts`
- Create: `palm-app/app/api/waitlist/route.ts`

Behavior mirrors the legacy Summa route (`vault/_archive/summa/architecture/Waitlist API.md`): normalize, validate with the permissive regex, `SADD waitlist <email>`. The doubled-prefix env var names are intentional.

- [ ] **Step 1: Install the Upstash client**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm install @upstash/redis
```
Expected: installs without error.

- [ ] **Step 2: Write the failing tests**

Create `palm-app/app/api/waitlist/route.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

const saddMock = vi.fn();

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(() => ({ sadd: saddMock })),
}));

import { POST } from "./route";

function req(body: unknown): Request {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  saddMock.mockReset();
  saddMock.mockResolvedValue(1);
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL = "https://example.upstash.io";
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN = "test-token";
});

describe("POST /api/waitlist", () => {
  it("stores a normalized email and returns ok", async () => {
    const res = await POST(req({ email: "  Foo@Bar.COM " }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(saddMock).toHaveBeenCalledWith("waitlist", "foo@bar.com");
  });

  it("rejects an invalid email with 400 and does not store", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(saddMock).not.toHaveBeenCalled();
  });

  it("rejects a missing email with 400", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
  });

  it("returns 500 when the store throws", async () => {
    saddMock.mockRejectedValueOnce(new Error("upstash down"));
    const res = await POST(req({ email: "ok@example.com" }));
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 3: Run the tests to confirm they fail**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run app/api/waitlist/route.test.ts
```
Expected: FAIL — cannot resolve `./route` / `POST` undefined.

- [ ] **Step 4: Implement `palm-app/app/api/waitlist/route.ts`**

```typescript
import { Redis } from "@upstash/redis";

// Permissive on purpose — parity with the legacy Summa route.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200): Response =>
  Response.json(body, { status });

export async function POST(request: Request): Promise<Response> {
  let email: unknown;
  try {
    ({ email } = (await request.json()) as { email?: unknown });
  } catch {
    return json({ error: "invalid body" }, 400);
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return json({ error: "invalid email" }, 400);
  }
  const normalized = email.toLowerCase().trim();

  try {
    // Doubled prefix is intentional (Vercel→Upstash integration var names).
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
      token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
    });
    await redis.sadd("waitlist", normalized);
    return json({ ok: true });
  } catch {
    return json({ error: "store error" }, 500);
  }
}
```

- [ ] **Step 5: Run the tests to confirm they pass**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx vitest run app/api/waitlist/route.test.ts
```
Expected: PASS (4 cases green).

- [ ] **Step 6: Document the Cloudflare env binding (no secret values in git)**

Append to `palm-app/README.md` (create if absent):
```markdown
## Waitlist env vars (Cloudflare)

Set as Worker secrets before deploy:

    npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_URL
    npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_TOKEN

The doubled prefix is intentional (carried from the Vercel→Upstash integration).
```

- [ ] **Step 7: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/api/waitlist/route.ts palm-app/app/api/waitlist/route.test.ts palm-app/package.json palm-app/package-lock.json palm-app/README.md
git commit -m "feat(react): add waitlist API route with tests"
```

---

## Task 9: Placeholder landing page + full build verification

**Files:**
- Modify: `palm-app/app/page.tsx`

This proves the toolchain end-to-end (tokens, fonts, shadcn Button, OpenNext build) before Phase 2 fills in real sections. It is a placeholder, not the real hero.

- [ ] **Step 1: Replace `palm-app/app/page.tsx`**

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-num text-sm uppercase tracking-widest text-primary">
        Acceso anticipado
      </p>
      <h1 className="max-w-2xl text-4xl font-medium text-foreground sm:text-5xl">
        Palm Inversiones
      </h1>
      <p className="max-w-md text-muted-foreground">
        Fundación React lista. Las secciones se portan en la próxima etapa.
      </p>
      <Button>Bajate la app</Button>
    </main>
  );
}
```

- [ ] **Step 2: Run the full Next build**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run build
```
Expected: build completes; `/api/waitlist` listed as a route; no type/lint errors.

- [ ] **Step 3: Run the unit suite**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm test
```
Expected: all tests in `annuity.test.ts` and `route.test.ts` PASS.

- [ ] **Step 4: Run the OpenNext Cloudflare build (proves the adapter works)**

Run:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npx opennextjs-cloudflare build
```
Expected: produces `.open-next/` output with no errors. (This step does not deploy.)

- [ ] **Step 5: Commit**

```bash
cd /home/tron-mrs/Summa/summa-landing
git add palm-app/app/page.tsx
git commit -m "feat(react): placeholder landing page; verify full + OpenNext build"
```

- [ ] **Step 6 (optional, requires Cloudflare auth): deploy the preview Worker**

Only if the user wants a live preview now. Set the two Upstash secrets (Task 8 Step 6), then:
```bash
cd /home/tron-mrs/Summa/summa-landing/palm-app && npm run deploy
```
Expected: deploys to the `palm-app-preview` Worker and prints a `*.workers.dev` URL. Production (the static `index.html` on Cloudflare Pages) is unaffected.

---

## Definition of done

- `npm run build` and `npx opennextjs-cloudflare build` both succeed in `palm-app/`.
- `npm test` is green (annuity + waitlist).
- shadcn Button renders on the placeholder page using Palm tokens (gold primary on navy).
- Root `index.html` is byte-for-byte unchanged.
- All work committed on `feat/react-migration`.

## Out of scope (later plans)

- Phase 2: faithful port of the 11 sections (Navbar … GradualBlur) against `index.html`.
- Phase 4: the enrich pass (GSAP, richer scanner/bento).
- Lifting `palm-app/` to the repo root and retiring `index.html`.
- Production DNS cutover.
