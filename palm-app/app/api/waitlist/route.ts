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
