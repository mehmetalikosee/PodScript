"use client";

import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_LINK, SUPPORT_EMAIL, SUPPORT_EMAIL_LINK, SITE_NAME } from "@/lib/site-config";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              {t("footer.contact")}
            </Link>
            <Link href="/feedback" className="hover:text-foreground transition-colors">
              {t("footer.feedback")}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={SUPPORT_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp {SUPPORT_WHATSAPP}
            </a>
            <a
              href={SUPPORT_EMAIL_LINK}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()} {SITE_NAME}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
