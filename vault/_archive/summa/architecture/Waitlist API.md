---
tags:
  - architecture
  - api
  - waitlist
---
# Waitlist API

**File:** `app/api/waitlist/route.ts`
**Endpoint:** `POST /api/waitlist`

## Contract

**Request**
```json
{ "email": "user@example.com" }
```

**Responses**
- `200` — `{ "success": true }`
- `400` — `{ "error": "Email inválido." }` — fails the regex or wrong type
- `500` — `{ "error": "Error interno." }` — Redis or JSON parse error

## Implementation

```ts
const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

await redis.sadd('waitlist', email.toLowerCase().trim())
```

- Validation: simple regex (`EMAIL_RE`). Not RFC-compliant, intentional — keeps obvious typos out without rejecting valid edge cases.
- Storage: a single Redis **set** keyed `waitlist`. `SADD` is idempotent — duplicates are silently deduped, which is the desired behavior.
- Normalization: `toLowerCase().trim()` before storing. Prevents case-only duplicates.

## Reading the waitlist
There is no admin UI. To pull the list:
- Upstash console → run `SMEMBERS waitlist`
- Or `redis-cli` against the REST endpoint.

## Tests
`__tests__/api/waitlist.test.ts` exercises this route. Jest runs in `jest-environment-node`.

## Gotchas
- Env var names are **`UPSTASH_REDIS_REST_KV_REST_API_*`** — the doubled prefix is what Vercel's Upstash integration provisions. Don't "tidy" these; renaming breaks prod. See [[../history/Decisions|Decisions]] (`86af870`).
- Prior implementation used `@vercel/kv`. Migrated to `@upstash/redis` in commit `8848f4a` because `@vercel/kv` was deprecated.

See [[../components/Component Map|Component Map]] for `<WaitlistForm>`, the only caller.
