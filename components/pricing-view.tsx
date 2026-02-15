"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/upgrade-button";
import { ArrowLeft, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

const ADMIN_EMAIL = "memetali159@gmail.com";

export function PricingView() {
  const { t } = useLanguage();

  const plans = [
    {
      id: "trial",
      name: t("pricing.trial"),
      description: "Try PodScript with limited tokens",
      price: 0,
      tokens: 3,
      features: [t("pricing.trialTokens"), "1 token per podcast", "All content types", "Email support"],
      cta: null,
      ctaHref: null,
    },
    {
      id: "pro",
      name: t("pricing.pro"),
      description: "For creators who publish regularly",
      price: 19,
      tokens: 100,
      features: ["100 tokens / month", "Blog, Twitter, LinkedIn", "SEO & headlines", "Priority support"],
      cta: `${t("pricing.upgradeTo")} ${t("pricing.pro")}`,
      ctaHref: "/dashboard/profile",
    },
    {
      id: "team",
      name: t("pricing.team"),
      description: "For teams and agencies",
      price: 49,
      tokens: 500,
      features: ["500 tokens / month", "Everything in Pro", "Team usage", "API access (coming soon)"],
      cta: t("pricing.contactTeam"),
      ctaHref: `mailto:${ADMIN_EMAIL}`,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t("nav.backToDashboard")}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{t("pricing.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("pricing.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.id === "pro" ? "border-primary shadow-md" : "border-border/80"}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground text-sm">{t("pricing.perMonth")}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {plan.tokens} {plan.price > 0 ? `${t("pricing.tokensPerMonth")}` : "tokens"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.id === "trial" ? (
                <p className="text-sm text-muted-foreground">{t("pricing.youOnTrial")}</p>
              ) : plan.id === "pro" ? (
                <UpgradeButton className="w-full" variant="default">
                  {plan.cta}
                </UpgradeButton>
              ) : plan.cta && plan.ctaHref ? (
                <Button className="w-full" variant="outline" asChild>
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {t("pricing.stripeNote")}
      </p>
    </div>
  );
}
