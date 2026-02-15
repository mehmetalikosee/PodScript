import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";
import { FeedbackClient } from "@/components/feedback-client";

export const metadata = {
  title: `Bug report & Feature request – ${SITE_NAME}`,
  description: "Report a bug or request a new feature for PodScript.",
};

export default function FeedbackPage() {
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
        <FeedbackClient />
      </main>
    </div>
  );
}
