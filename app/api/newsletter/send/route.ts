import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/newsletter/send
 * Sends a newsletter to all subscribers. Protected by NEWSLETTER_SEND_SECRET.
 * Body: { subject: string, body: string } (body can be plain text or HTML if you add html field)
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-newsletter-secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (process.env.NEWSLETTER_SEND_SECRET && secret !== process.env.NEWSLETTER_SEND_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 503 });
  }

  let body: { subject?: string; body?: string; html?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const text = typeof body.body === "string" ? body.body.trim() : "";
  const html = typeof body.html === "string" ? body.html : undefined;
  if (!subject || (!text && !html)) {
    return NextResponse.json({ error: "subject and body (or html) required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  );
  const { data: subscribers, error: fetchError } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .order("created_at", { ascending: true });

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!subscribers?.length) {
    return NextResponse.json({ message: "No subscribers", sent: 0 });
  }

  const emails = subscribers.map((s) => s.email).filter(Boolean) as string[];
  const result = await sendEmail({
    to: emails,
    subject,
    text: text || undefined,
    html,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Failed to send" }, { status: 500 });
  }
  return NextResponse.json({ message: "Newsletter sent", sent: emails.length });
}
