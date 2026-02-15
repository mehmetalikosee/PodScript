import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || "PodScript <onboarding@resend.dev>";

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

/**
 * Send an email via Resend.
 * Requires RESEND_API_KEY in env. From address: EMAIL_FROM or Resend onboarding.
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  const to = Array.isArray(options.to) ? options.to : [options.to];
  try {
    const payload = {
      from: FROM_EMAIL,
      to,
      subject: options.subject,
      text: options.text ?? "",
      ...(options.html ? { html: options.html } : {}),
    } as { from: string; to: string[]; subject: string; text: string; html?: string };
    const { error } = await resend.emails.send(payload);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send email";
    return { ok: false, error: message };
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
