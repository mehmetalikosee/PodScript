"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/upgrade-button";
import { ArrowLeft, User, CreditCard, Zap, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

type ProfileViewProps = {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  tokensRemaining: number;
  tokensLimit: number;
  plan: string;
  trialEndsAt: string | null;
};

export function ProfileView({
  userId,
  email,
  fullName,
  phone,
  avatarUrl,
  tokensRemaining,
  tokensLimit,
  plan,
  trialEndsAt,
}: ProfileViewProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const trialEnds = trialEndsAt ? new Date(trialEndsAt) : null;

  async function handleSyncSubscription() {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync-subscription", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.updated) {
        toast.success(data.message);
        router.refresh();
      } else if (res.ok) {
        toast.info(data.message || "No subscription to sync");
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSyncing(false);
    }
  }
  const isTrialActive = trialEnds ? trialEnds > new Date() : false;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          {t("nav.backToDashboard")}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{t("profile.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("profile.manageSubtitle")}
        </p>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("profile.accountDetails")}
          </CardTitle>
          <CardDescription>{t("profile.accountDetailsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm userId={userId} email={email} fullName={fullName} phone={phone} avatarUrl={avatarUrl} />
        </CardContent>
      </Card>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t("profile.usagePlan")}
          </CardTitle>
          <CardDescription>{t("profile.usagePlanDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/80 bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">{t("profile.tokensRemaining")}</p>
              <p className="text-2xl font-bold text-foreground">{tokensRemaining}</p>
              <p className="text-xs text-muted-foreground">
                {t("profile.tokenPerPodcast")}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {t("profile.plan")}: <span className="font-medium text-foreground capitalize">{plan}</span>
              {tokensLimit > 0 && (
                <span className="block">{t("profile.limitPerMonth").replace("{limit}", String(tokensLimit))}</span>
              )}
            </div>
          </div>
          {trialEnds && (
            <p className="text-sm text-muted-foreground">
              {isTrialActive
                ? t("profile.trialEndsOn").replace("{date}", trialEnds.toLocaleDateString())
                : t("profile.trialEndedOn").replace("{date}", trialEnds.toLocaleDateString())}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <UpgradeButton className="sm:w-auto" variant="default">
              <CreditCard className="h-4 w-4 mr-2" />
              {t("profile.upgradePlan")}
            </UpgradeButton>
            <Button
              type="button"
              variant="outline"
              onClick={handleSyncSubscription}
              disabled={syncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {t("profile.syncSubscription")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
