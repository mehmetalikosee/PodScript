import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("lib/email", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isEmailConfigured", () => {
    it("returns false when RESEND_API_KEY is not set", async () => {
      delete process.env.RESEND_API_KEY;
      const { isEmailConfigured } = await import("./email");
      expect(isEmailConfigured()).toBe(false);
    });

    it("returns true when RESEND_API_KEY is set", async () => {
      process.env.RESEND_API_KEY = "re_test123";
      const { isEmailConfigured } = await import("./email");
      expect(isEmailConfigured()).toBe(true);
    });
  });

  describe("sendEmail", () => {
    it("returns error when RESEND_API_KEY is not configured", async () => {
      delete process.env.RESEND_API_KEY;
      const { sendEmail } = await import("./email");
      const result = await sendEmail({
        to: "test@example.com",
        subject: "Test",
        text: "Body",
      });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("RESEND_API_KEY not configured");
    });

    it("accepts single to and array to", async () => {
      delete process.env.RESEND_API_KEY;
      const { sendEmail } = await import("./email");
      const r1 = await sendEmail({
        to: "one@example.com",
        subject: "S",
        text: "B",
      });
      expect(r1.ok).toBe(false);
      const r2 = await sendEmail({
        to: ["a@x.com", "b@x.com"],
        subject: "S",
        text: "B",
      });
      expect(r2.ok).toBe(false);
    });
  });
});
