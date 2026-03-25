import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    await redis.sadd('waitlist', email.toLowerCase().trim())
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 })
  }
}
