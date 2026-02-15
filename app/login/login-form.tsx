"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/context";

export function LoginForm() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle>{t("auth.signInTitle")}</CardTitle>
        <CardDescription>{t("auth.credentialsHint")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                {t("auth.password")}
              </label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                {t("auth.forgotPassword")}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link href="/signup" className="text-primary hover:underline">
            {t("auth.signUp")}
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Link href="/terms" className="hover:underline">Terms</Link>
          {" · "}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          {" · "}
          <Link href="/contact" className="hover:underline">Contact</Link>
          {" · "}
          <Link href="/feedback" className="hover:underline">Bug report & Features</Link>
        </p>
      </CardContent>
    </Card>
  );
}
