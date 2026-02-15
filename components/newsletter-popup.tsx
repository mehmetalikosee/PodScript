"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

const STORAGE_KEY = "podscript-newsletter-dismissed";
const SHOW_AFTER_MS = 4000;

export function NewsletterPopup() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dismissed = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(data.message === "Already subscribed" ? t("newsletter.alreadySubscribed") : t("newsletter.subscribed"));
        handleClose();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-semibold text-foreground pr-8">{t("newsletter.title")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("newsletter.description")}</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Input
            type="email"
            placeholder={t("newsletter.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "..." : t("newsletter.subscribe")}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("newsletter.later")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
