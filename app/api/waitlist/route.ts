import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    await kv.sadd('waitlist', email.toLowerCase().trim())
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 })
  }
}
