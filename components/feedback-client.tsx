"use client";

import { MessageCircle, Mail, Bug, Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import {
  BUG_REPORT_EMAIL_LINK,
  BUG_REPORT_WHATSAPP_LINK,
  FEATURE_REQUEST_EMAIL_LINK,
  FEATURE_REQUEST_WHATSAPP_LINK,
} from "@/lib/site-config";

export function FeedbackClient() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {t("feedback.title")}
        </h1>
        <p className="text-muted-foreground">{t("feedback.subtitle")}</p>
      </div>
      {/* Bug report */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 text-destructive/90 mb-2">
          <Bug className="h-7 w-7" />
          <h2 className="text-xl font-semibold text-foreground">{t("feedback.bugTitle")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t("feedback.bugDesc")}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={BUG_REPORT_EMAIL_LINK}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            {t("feedback.reportViaEmail")}
          </a>
          <a
            href={BUG_REPORT_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {t("feedback.reportViaWhatsApp")}
          </a>
        </div>
      </section>

      {/* Feature request */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Lightbulb className="h-7 w-7" />
          <h2 className="text-xl font-semibold text-foreground">{t("feedback.featureTitle")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t("feedback.featureDesc")}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={FEATURE_REQUEST_EMAIL_LINK}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
          >
            <Mail className="h-4 w-4" />
            {t("feedback.requestViaEmail")}
          </a>
          <a
            href={FEATURE_REQUEST_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {t("feedback.requestViaWhatsApp")}
          </a>
        </div>
      </section>
    </div>
  );
}
