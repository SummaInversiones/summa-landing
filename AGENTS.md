<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Palm Inversiones landing — agent notes

## Stack reality
This **is the production marketing site**: a Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn app living at the **repo root**. It is deployed as a **Cloudflare Worker** via the OpenNext Cloudflare adapter (`@opennextjs/cloudflare`) — not Vercel, not a static export.

- `app/` — routes (`page.tsx` home, `calculadora/`, `gallery/`, `api/waitlist/`).
- `components/` — section + UI components (shadcn under `components/ui/`).
- `lib/`, `public/` — helpers and static assets (fonts, mockups, card imagery).
- Animation: `gsap` + `motion` + a `three` hero shader. Calculator uses client logic.

## Local dev / build / deploy
- `npm run dev` → `http://localhost:3000`.
- `npm test` → Vitest suite.
- `npm run build` → Next build.
- `npm run preview` → OpenNext build + local Worker preview.
- `npm run deploy` → OpenNext build + deploy to Cloudflare (Worker `palm-landing`).

## Deploy target
- Host: **Cloudflare Workers** (OpenNext). Worker name: **`palm-landing`**.
- Production custom domain: **`palminversiones.com`** (apex, served directly — no `www` redirect).
- Config: `wrangler.jsonc` (`routes` holds the custom domain; `name` must match the `WORKER_SELF_REFERENCE` service binding).
- DNS / zone: **Cloudflare**. Do **not** touch MX/SPF/DKIM (email) records.

## Waitlist API
`app/api/waitlist/route.ts` → Upstash Redis (`sadd waitlist <email>`). Credentials are **Cloudflare Worker secrets** (set per worker), read via `process.env` with a fallback to `getCloudflareContext().env`:

    npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_URL
    npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_TOKEN

The doubled `REST_KV_REST` prefix is intentional (carried from the Vercel→Upstash integration var names).

## Before changing anything visible
Read `vault/history/Decisions.md` and `vault/concepts/Anti-patterns.md` — most "obvious" improvements have already been tried and reverted. `vault/concepts/Motion System.md` documents the animation conventions.

## Legacy
The retired static one-file landing (`index.html`) and the throwaway HTML experiments live under `legacy/`. They are not built or served; keep them for reference only.

## Audience and voice
Argentine savers, rioplatense voseo. See `vault/brand/Voice.md`.
