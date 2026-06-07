import { describe, it, expect, vi, beforeEach } from "vitest";

const saddMock = vi.fn();

vi.mock("@upstash/redis", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Redis: vi.fn().mockImplementation(function (this: any) {
    return { sadd: saddMock };
  }),
}));

import { POST } from "./route";

function req(body: unknown): Request {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  saddMock.mockReset();
  saddMock.mockResolvedValue(1);
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL = "https://example.upstash.io";
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN = "test-token";
});

describe("POST /api/waitlist", () => {
  it("stores a normalized email and returns ok", async () => {
    const res = await POST(req({ email: "  Foo@Bar.COM " }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(saddMock).toHaveBeenCalledWith("waitlist", "foo@bar.com");
  });

  it("rejects an invalid email with 400 and does not store", async () => {
    const res = await POST(req({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(saddMock).not.toHaveBeenCalled();
  });

  it("rejects a missing email with 400", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
  });

  it("returns 500 when the store throws", async () => {
    saddMock.mockRejectedValueOnce(new Error("upstash down"));
    const res = await POST(req({ email: "ok@example.com" }));
    expect(res.status).toBe(500);
  });
});
