"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/context";

export function ResetPasswordForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (!ready) {
    return (
      <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>{t("auth.resetPasswordTitle")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordExpired")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full">{t("auth.requestNewLink")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle>{t("auth.resetPasswordTitle")}</CardTitle>
        <CardDescription>{t("auth.resetPasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
          )}
          <div>
            <Label htmlFor="password">{t("auth.newPassword")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="mt-1.5"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : t("auth.updatePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
