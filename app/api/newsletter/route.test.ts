import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: mockFrom,
    })
  ),
}));

describe("POST /api/newsletter (subscribe)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockReturnValue({ select: () => ({ single: () => Promise.resolve({ data: {}, error: null }) }) });
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid email");
  });

  it("returns 400 for empty email", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing email", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 and Subscribed for valid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Subscribed");
    expect(mockFrom).toHaveBeenCalledWith("newsletter_subscribers");
    expect(mockInsert).toHaveBeenCalledWith({ email: "user@example.com" });
  });

  it("returns Already subscribed on duplicate", async () => {
    mockInsert.mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: null, error: { code: "23505" } }) }),
    });
    const res = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "existing@example.com" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Already subscribed");
  });
});
