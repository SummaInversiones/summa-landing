# Palm Inversiones — landing

Production marketing site for Palm Inversiones. Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn, deployed as a **Cloudflare Worker** via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest
```

## Build & preview

```bash
npm run build    # Next build
npm run preview  # OpenNext build + local Worker preview
```

## Deploy

```bash
npm run deploy   # OpenNext build + deploy → Cloudflare Worker `palm-landing`
```

- **Host:** Cloudflare Workers (OpenNext). Worker: `palm-landing`.
- **Domain:** `palminversiones.com` (apex, served directly). DNS/zone on Cloudflare.
- **Config:** `wrangler.jsonc`.

## Waitlist env vars (Cloudflare Worker secrets)

Set as Worker secrets before deploy:

```bash
npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_URL
npx wrangler secret put UPSTASH_REDIS_REST_KV_REST_API_TOKEN
```

The doubled prefix is intentional (carried from the Vercel→Upstash integration).

## Layout

- `app/`, `components/`, `lib/`, `public/` — the application.
- `vault/` — design decisions, anti-patterns, brand voice (read before changing visible UI).
- `legacy/` — the retired static one-file landing and HTML experiments (not built or served).
- `docs/` — specs and implementation plans.
