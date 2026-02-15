import Link from "next/link";
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_LINK } from "@/lib/site-config";

export const metadata = {
  title: `Terms & Conditions – ${SITE_NAME}`,
  description: "Terms and conditions of use for PodScript.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: February 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using {SITE_NAME} (&quot;Service&quot;), you agree to be bound by these Terms and Conditions.
              If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
            <p className="text-muted-foreground">
              {SITE_NAME} provides an AI-powered platform that transcribes audio (e.g. podcasts) and generates
              content such as blog posts, social media posts, and related materials. The Service is offered
              on a subscription and/or token-based basis as described on our pricing page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Account and Registration</h2>
            <p className="text-muted-foreground">
              You must create an account and provide accurate information. You are responsible for
              maintaining the confidentiality of your account and password. You agree to accept
              responsibility for all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-2">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe intellectual property or other rights of third parties</li>
              <li>Upload content that is illegal, harmful, defamatory, or otherwise objectionable</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Use the Service for any purpose that could damage, disable, or overburden the Service</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Payment and Subscriptions</h2>
            <p className="text-muted-foreground">
              Paid plans are billed according to the pricing in effect at the time of purchase.
              Payments are processed by third-party providers (e.g. Stripe). By subscribing, you
              authorize us to charge your payment method until you cancel. Refund policy is as
              stated at the time of purchase or on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service, including its design, code, and branding, is owned by us or our
              licensors. You retain ownership of content you upload. By uploading content, you
              grant us a license to process it solely to provide the Service. Output generated
              for you is yours to use subject to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              express or implied. We do not warrant that the Service will be uninterrupted, error-free,
              or that generated content will meet your requirements. You use the Service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, we shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits,
              data, or use, arising from your use of the Service. Our total liability shall not
              exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access to the Service at any time for breach of
              these Terms or for any other reason. You may cancel your account at any time.
              Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">10. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. We will notify you of material changes
              by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your
              continued use of the Service after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable law.
              Any disputes shall be resolved in the courts of the jurisdiction in which we operate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, contact us:
            </p>
            <ul className="list-none mt-2 text-muted-foreground">
              <li>
                Email: <a href={SUPPORT_EMAIL_LINK} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>
              </li>
              <li>
                WhatsApp: <a href={SUPPORT_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{SUPPORT_WHATSAPP}</a>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
