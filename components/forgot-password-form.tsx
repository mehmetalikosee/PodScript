"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/context";

export function ForgotPasswordForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${baseUrl}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>{t("auth.checkEmailTitle")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordSent")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="w-full">{t("auth.backToSignIn")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle>{t("auth.forgotPasswordTitle")}</CardTitle>
        <CardDescription>{t("auth.forgotPasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
          )}
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("auth.sending") : t("auth.sendResetLink")}
          </Button>
        </form>
        <p className="mt-4 text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            {t("auth.backToSignIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
