import Link from "next/link";
import { MessageCircle, Mail, Bug } from "lucide-react";
import { SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_LINK, SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, SITE_NAME } from "@/lib/site-config";

export const metadata = {
  title: `Contact – ${SITE_NAME}`,
  description: "Get in touch with PodScript support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Contact us
        </h1>
        <p className="text-muted-foreground mb-10">
          Have a question or need help? Reach out via WhatsApp or email.
        </p>

        <div className="space-y-6">
          <a
            href={SUPPORT_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-accent/30 transition-colors"
          >
            <div className="rounded-xl bg-green-500/10 p-3">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">WhatsApp</h2>
              <p className="text-muted-foreground">{SUPPORT_WHATSAPP}</p>
              <p className="text-sm text-primary mt-1">Click to start a chat →</p>
            </div>
          </a>
          <a
            href={SUPPORT_EMAIL_LINK}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-accent/30 transition-colors"
          >
            <div className="rounded-xl bg-primary/10 p-3">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Email</h2>
              <p className="text-muted-foreground">{SUPPORT_EMAIL}</p>
              <p className="text-sm text-primary mt-1">Click to send an email →</p>
            </div>
          </a>
          <Link
            href="/feedback"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-accent/30 transition-colors"
          >
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Bug className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Bug report & Feature request</h2>
              <p className="text-muted-foreground">Report a bug or suggest a new function</p>
              <p className="text-sm text-primary mt-1">Go to feedback page →</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
