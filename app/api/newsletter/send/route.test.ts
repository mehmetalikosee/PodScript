import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({ select: mockSelect }));
const mockCreateClient = vi.fn(() => ({ from: mockFrom }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => mockCreateClient(...args),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(() => Promise.resolve({ ok: true })),
}));

describe("POST /api/newsletter/send", () => {
  const secret = "test-secret";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEWSLETTER_SEND_SECRET = secret;
    mockSelect.mockReturnValue({
      order: () => Promise.resolve({ data: [{ email: "sub@example.com" }], error: null }),
    });
  });

  it("returns 401 when secret is wrong", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-newsletter-secret": "wrong-secret",
        },
        body: JSON.stringify({ subject: "Hi", body: "Hello" }),
      })
    );
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when secret is missing and NEWSLETTER_SEND_SECRET is set", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "Hi", body: "Hello" }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("accepts Bearer token as secret", async () => {
    mockSelect.mockReturnValue({
      order: () => Promise.resolve({ data: [], error: null }),
    });
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secret}`,
        },
        body: JSON.stringify({ subject: "Hi", body: "Hello" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sent).toBe(0);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-newsletter-secret": secret,
        },
        body: "not json",
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON");
  });

  it("returns 400 when subject or body missing", async () => {
    const res1 = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-newsletter-secret": secret },
        body: JSON.stringify({ body: "Only body" }),
      })
    );
    expect(res1.status).toBe(400);

    const res2 = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-newsletter-secret": secret },
        body: JSON.stringify({ subject: "Only subject" }),
      })
    );
    expect(res2.status).toBe(400);
  });

  it("returns 200 and sent count when subject and body provided", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-newsletter-secret": secret,
        },
        body: JSON.stringify({ subject: "News", body: "Content" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Newsletter sent");
    expect(data.sent).toBe(1);
  });

  it("returns 503 when SUPABASE_SERVICE_ROLE_KEY is not set", async () => {
    const prev = process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "";
    const res = await POST(
      new Request("http://localhost/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-newsletter-secret": secret },
        body: JSON.stringify({ subject: "Hi", body: "Hello" }),
      })
    );
    expect(res.status).toBe(503);
    process.env.SUPABASE_SERVICE_ROLE_KEY = prev;
  });
});
