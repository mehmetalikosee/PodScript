"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";

type Notification = { id: string; title: string; message: string | null; read: boolean; created_at: string };

export function NotificationBell() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/notifications?limit=10")
        .then((res) => (res.ok ? res.json() : []))
        .then(setNotifications)
        .catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function formatDate(s: string) {
    const d = new Date(s);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString();
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={panelRef}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)} type="button">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border border-border bg-card shadow-lg z-50 max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">{t("notifications.empty")}</p>
          ) : (
            <>
              {unreadCount > 0 && (
                <div className="sticky top-0 border-b border-border bg-muted/50 px-3 py-2">
                  <button type="button" className="text-xs text-primary hover:underline" onClick={markAllRead}>
                    {t("notifications.markAllRead")}
                  </button>
                </div>
              )}
              {notifications.map((n) => (
                <div key={n.id} className={`border-b border-border/50 px-3 py-2 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  {n.message && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(n.created_at)}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
