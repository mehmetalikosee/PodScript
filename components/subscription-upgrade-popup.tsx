"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

const STORAGE_KEY = "podscript-upgrade-popup-dismissed";

export function SubscriptionUpgradePopup() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && data.plan === "trial" && (data.tokens_remaining <= 1 || data.tokens_remaining === 0)) {
          setPlan(data.plan);
          setTokens(data.tokens_remaining ?? 0);
          const dismissed = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY);
          if (!dismissed) setOpen(true);
        }
      })
      .catch(() => {});
  }, []);

  function handleClose() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }

  if (!open || plan !== "trial") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 text-primary mb-2">
          <Zap className="h-8 w-8" />
          <h3 className="text-xl font-semibold text-foreground">{t("upgradePopup.title")}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {tokens !== null && tokens <= 0
            ? t("upgradePopup.noTokens")
            : t("upgradePopup.lowTokens")}
        </p>
        <div className="mt-4 flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/dashboard/pricing">{t("profile.upgradePlan")}</Link>
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("upgradePopup.later")}
          </Button>
        </div>
      </div>
    </div>
  );
}
