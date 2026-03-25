import { POST } from '@/app/api/waitlist/route'
import { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

jest.mock('@upstash/redis', () => {
  const sadd = jest.fn().mockResolvedValue(1)
  return {
    Redis: jest.fn().mockImplementation(() => ({ sadd })),
  }
})

function getSadd() {
  const instance = (Redis as jest.Mock).mock.results[0]?.value
  return instance?.sadd as jest.Mock
}

describe('POST /api/waitlist', () => {
  beforeEach(() => getSadd()?.mockClear())

  it('returns success for valid email', async () => {
    const req = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    })
    const res = await POST(req)
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(getSadd()).toHaveBeenCalledWith('waitlist', 'test@example.com')
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
