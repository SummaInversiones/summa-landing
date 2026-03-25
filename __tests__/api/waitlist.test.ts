import { POST } from '@/app/api/waitlist/route'
import { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

// Mock @vercel/kv
jest.mock('@vercel/kv', () => ({
  kv: { sadd: jest.fn().mockResolvedValue(1) },
}))

describe('POST /api/waitlist', () => {
  it('returns success for valid email', async () => {
    const req = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    const res = await POST(req)
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(kv.sadd).toHaveBeenCalledWith('waitlist', 'test@example.com')
  })

  it('returns error for invalid email', async () => {
    const req = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
    })
    const res = await POST(req)
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error).toBeDefined()
  })

  it('returns error for missing email', async () => {
    const req = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
