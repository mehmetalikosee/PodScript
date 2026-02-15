"use client";

import Link from "next/link";
import { UploadZone } from "@/components/upload-zone";
import { SubscriptionUpgradePopup } from "@/components/subscription-upgrade-popup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  processing: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  failed: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
};

type Podcast = { id: string; title: string | null; status: string; created_at: string };

export function DashboardView({ podcasts }: { podcasts: Podcast[] }) {
  const { t, dateLocale } = useLanguage();

  return (
    <div className="space-y-10">
      <SubscriptionUpgradePopup />
      <div className="relative rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8 shadow-sm">
        <div className="relative">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">{t("dashboard.aiBadge")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("dashboard.title")}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </div>

      <UploadZone />

      {podcasts && podcasts.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t("dashboard.recentPodcasts")}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {podcasts.map((p) => (
              <li key={p.id}>
                <Card className="overflow-hidden transition-shadow hover:shadow-md border-border/80">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 min-w-0">
                        <FileAudio className="h-4 w-4 shrink-0 text-primary/80" />
                        <span className="truncate">{p.title || t("dashboard.untitled")}</span>
                      </CardTitle>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium",
                          statusStyles[p.status] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {p.status === "completed"
                          ? t("dashboard.statusCompleted")
                          : p.status === "processing"
                            ? t("dashboard.statusProcessing")
                            : p.status === "failed"
                              ? t("dashboard.statusFailed")
                              : p.status}
                      </span>
                    </div>
                    <CardDescription className="text-xs">
                      {new Date(p.created_at).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/${p.id}`}>
                      <Button variant="outline" size="sm" className="w-full rounded-lg">
                        {t("dashboard.viewContent")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileAudio className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="font-medium text-foreground">{t("dashboard.noPodcasts")}</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {t("dashboard.noPodcastsHint")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
