---
tags:
  - architecture
  - stack
---
# Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js | **16.2.1** | App Router. **Breaking from older Next.js — read `node_modules/next/dist/docs/` before writing code.** Heed deprecation notices. |
| Runtime | React / ReactDOM | 19.2.4 | Server Components available but unused; whole page is client. |
| Styling | Tailwind CSS | **v4** | No `tailwind.config.ts`. Tokens declared via `@theme inline {}` in `app/globals.css`. PostCSS plugin: `@tailwindcss/postcss`. |
| Font | Inter (next/font/google) | — | CSS var `--font-inter`; weights 400/500/700; `display: swap`. |
| Icons | `lucide-react` | ^1.6.0 | Used sparingly in section components. |
| Data plane | `@upstash/redis` | ^1.37.0 | Migrated **from** deprecated `@vercel/kv`. |
| Tests | Jest + ts-jest | 30 / 29 | Node env. Only `__tests__/api/waitlist.test.ts` exists. |
| Lint | ESLint 9 + `eslint-config-next` | — | `eslint.config.mjs` (flat config). |
| TypeScript | 5.x | — | `tsconfig.json` with path alias `@/*`. |
| Hosting | Vercel | — | `.vercel/` linked. Upstash provided via Vercel integration. |

## Env vars (server-only)
- `UPSTASH_REDIS_REST_KV_REST_API_URL`
- `UPSTASH_REDIS_REST_KV_REST_API_TOKEN`

These exact names come from the Vercel→Upstash integration; renaming will break the API route. See [[../history/Decisions|Decisions]].

## Why these choices
- **Next 16 + Tailwind v4** — chosen at project init (commit `3094ad7`). Both are bleeding-edge; Claude's prior knowledge of either is unreliable, so the AGENTS.md file forces consultation of `node_modules/next/dist/docs/`.
- **Upstash Redis over `@vercel/kv`** — `@vercel/kv` was deprecated; migrated in `8848f4a`.
- **No CMS / no DB** — pre-launch waitlist only; over-engineering avoided.
