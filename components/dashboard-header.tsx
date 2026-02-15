"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NotificationBell } from "@/components/notification-bell";
import { useLanguage } from "@/lib/i18n/context";

export function DashboardHeader({ userEmail }: { userEmail: string | undefined }) {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-xl tracking-tight text-foreground">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-sm font-medium">Pro</span>
          PodScript
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/profile">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {t("nav.profile")}
            </Button>
          </Link>
          <Link href="/dashboard/pricing">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {t("nav.pricing")}
            </Button>
          </Link>
          <NotificationBell />
          <LanguageSwitcher />
          <ThemeToggle />
          <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              {t("nav.signOut")}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
