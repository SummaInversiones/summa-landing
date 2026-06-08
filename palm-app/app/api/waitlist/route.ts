import { Redis } from "@upstash/redis";

// Permissive on purpose — parity with the legacy Summa route.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200): Response =>
  Response.json(body, { status });

// Doubled prefix is intentional (Vercel→Upstash integration var names).
const URL_KEY = "UPSTASH_REDIS_REST_KV_REST_API_URL";
const TOKEN_KEY = "UPSTASH_REDIS_REST_KV_REST_API_TOKEN";

/**
 * Resolve the Upstash credentials. On the OpenNext Cloudflare worker the
 * secrets are NOT surfaced on `process.env` inside a route handler — they live
 * on the Cloudflare context `env`. Prefer `process.env` (covers tests and any
 * populated case), and fall back to `getCloudflareContext().env` via a guarded
 * dynamic import so the test path never has to load the adapter.
 */
async function resolveRedisCreds(): Promise<{ url?: string; token?: string }> {
  let url = process.env[URL_KEY];
  let token = process.env[TOKEN_KEY];
  if (!url || !token) {
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const env = getCloudflareContext().env as unknown as Record<string, string | undefined>;
      url = url || env[URL_KEY];
      token = token || env[TOKEN_KEY];
    } catch {
      // Not running inside a Cloudflare worker context (tests / plain next dev).
    }
  }
  return { url, token };
}

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
    const { url, token } = await resolveRedisCreds();
    const redis = new Redis({ url: url!, token: token! });
    await redis.sadd("waitlist", normalized);
    return json({ ok: true });
  } catch {
    return json({ error: "store error" }, 500);
  }
}
