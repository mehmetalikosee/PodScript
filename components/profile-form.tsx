"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/context";

export function ProfileForm({
  userId,
  email,
  fullName: initialFullName,
  phone: initialPhone,
  avatarUrl,
}: {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
}) {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, phone: phone.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("profile.failedToSave"));
      }
      toast.success(t("profile.updated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("profile.failedToSave"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("profile.email")}</Label>
        <Input id="email" type="email" value={email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">{t("profile.emailCannotChange")}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("profile.fullName")}</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t("profile.yourName")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("profile.phone")}</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 234 567 8900"
        />
      </div>
      {avatarUrl && (
        <div className="space-y-2">
          <Label>{t("profile.avatar")}</Label>
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover border border-border" />
            <p className="text-xs text-muted-foreground">{t("profile.avatarFromAuth")}</p>
          </div>
        </div>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? t("profile.saving") : t("profile.save")}
      </Button>
    </form>
  );
}
