import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "./route";

const mockUser = { id: "user-1", email: "u@example.com" };
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
  eq: mockEq,
  order: mockOrder,
  limit: mockLimit,
  update: mockUpdate,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: () => Promise.resolve({ data: { user: mockUser }, error: null }),
      },
      from: mockFrom,
    })
  ),
}));

describe("GET /api/notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    });
  });

  it("returns 401 when not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
      from: mockFrom,
    });
    const res = await GET(new Request("http://localhost/api/notifications"));
    expect(res.status).toBe(401);
  });

  it("returns notifications for authenticated user", async () => {
    const res = await GET(new Request("http://localhost/api/notifications"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("honors limit and unread params", async () => {
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    });
    const res = await GET(new Request("http://localhost/api/notifications?limit=5&unread=true"));
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith("notifications");
  });
});

describe("PATCH /api/notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });
  });

  it("returns 401 when not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
      from: mockFrom,
    });
    const res = await PATCH(
      new Request("http://localhost/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "n-1", read: true }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when neither id nor read:true provided", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Provide id or read: true");
  });

  it("returns 200 when marking one as read", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "n-1", read: true }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("returns 200 when marking all as read", async () => {
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    const res = await PATCH(
      new Request("http://localhost/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
    );
    expect(res.status).toBe(200);
  });
});
