"use client";

import Link from "next/link";
import { FileText, Twitter, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { Footer } from "@/components/footer";
import { useLanguage } from "@/lib/i18n/context";

export function LandingClient() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end gap-2 px-6 py-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_120%,hsl(var(--primary)/0.06),transparent)] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary mb-8 animate-in fade-in duration-700">
            <Sparkles className="h-4 w-4" />
            {t("landing.badge")}
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in duration-700 delay-150">
            <span className="block">{t("landing.title")}</span>
            <span className="block text-primary mt-1">{t("landing.titleHighlight")}</span>
            <span className="block text-foreground mt-1">{t("landing.titleSuffix")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-12 animate-in fade-in duration-700 delay-300">
            {t("landing.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-500">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              {t("nav.getStarted")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-border bg-background/80 backdrop-blur px-8 py-4 text-base font-medium hover:bg-accent/50 hover:border-primary/30 transition-all duration-300"
            >
              {t("nav.signIn")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-muted/20 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-medium text-primary mb-3 uppercase tracking-widest">
            {t("landing.featuresLead")}
          </p>
          <div className="grid sm:grid-cols-3 gap-12 sm:gap-16">
            {[
              { icon: FileText, labelKey: "landing.blogPost", descKey: "landing.featureBlogDesc" },
              { icon: Twitter, labelKey: "landing.tweets", descKey: "landing.featureTweetsDesc" },
              { icon: Linkedin, labelKey: "landing.linkedin", descKey: "landing.featureLinkedInDesc" },
            ].map(({ icon: Icon, labelKey, descKey }, i) => (
              <div
                key={labelKey}
                className="flex flex-col items-center text-center group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm w-full transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20 group-hover:-translate-y-0.5">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-1">{t(labelKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            {t("landing.ctaTitle")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t("landing.subtitle")}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            {t("nav.getStarted")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
      <Footer />
      <NewsletterPopup />
    </main>
  );
}
