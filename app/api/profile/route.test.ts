import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "./route";

const mockUser = { id: "user-1", email: "u@example.com" };
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn(() => ({
  update: mockUpdate,
  eq: mockEq,
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

describe("PATCH /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate.mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
  });

  it("returns 401 when not authenticated", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    (createClient as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
      from: mockFrom,
    });
    const res = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: "Test" }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("returns 200 and updates full_name", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: "Jane Doe" }),
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "Jane Doe",
      })
    );
  });

  it("updates phone when provided", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: "Jane", phone: "+1234567890" }),
      })
    );
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: "+1234567890",
      })
    );
  });

  it("clears phone when sent as null", async () => {
    const res = await PATCH(
      new Request("http://localhost/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: null }),
      })
    );
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: null,
      })
    );
  });
});
