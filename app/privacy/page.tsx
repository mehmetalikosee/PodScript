import Link from "next/link";
import { SITE_NAME, SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_LINK } from "@/lib/site-config";

export const metadata = {
  title: `Privacy Policy – ${SITE_NAME}`,
  description: "Privacy policy for PodScript.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: February 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              website and services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-2">We may collect:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li><strong>Account data:</strong> email address, name, and password (hashed) when you register</li>
              <li><strong>Usage data:</strong> how you use the Service (e.g. uploads, generated content)</li>
              <li><strong>Payment data:</strong> processed by our payment provider (e.g. Stripe); we do not store full card numbers</li>
              <li><strong>Newsletter:</strong> email address if you subscribe to our newsletter</li>
              <li><strong>Communications:</strong> when you contact us via email or WhatsApp</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information to provide, maintain, and improve the Service; to process
              payments; to send you service-related communications; to respond to your inquiries;
              to send marketing (e.g. newsletter) if you have opted in; and to comply with legal
              obligations. We use third-party services (e.g. Supabase, OpenAI, Stripe) that process
              data on our behalf under their respective privacy terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your account and content data for as long as your account is active. After
              account deletion, we may retain certain data as required by law or for legitimate
              business purposes (e.g. fraud prevention). You may request deletion of your personal
              data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal data. We may share data with: service providers (hosting,
              analytics, payment, AI processing) who assist in operating the Service; legal or
              regulatory authorities when required; or in connection with a merger, sale, or
              acquisition. We require providers to protect your data consistent with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Security</h2>
            <p className="text-muted-foreground">
              We implement technical and organizational measures to protect your data (e.g. encryption,
              access controls). No method of transmission or storage is 100% secure; we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
            <p className="text-muted-foreground">
              Depending on your location, you may have the right to access, correct, delete, or
              port your personal data, or to object to or restrict certain processing. You can
              update account details in your profile. To exercise other rights or for questions,
              contact us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Cookies and Similar Technologies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies for authentication, preferences, and to
              improve the Service. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Children</h2>
            <p className="text-muted-foreground">
              The Service is not intended for users under the age of 13 (or higher where required
              by law). We do not knowingly collect data from children. If you believe we have
              collected such data, please contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">10. International Transfers</h2>
            <p className="text-muted-foreground">
              Your data may be processed in countries other than your own. We ensure appropriate
              safeguards are in place where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will post the updated
              policy on this page and update the &quot;Last updated&quot; date. Continued use of the
              Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related questions or requests:
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
