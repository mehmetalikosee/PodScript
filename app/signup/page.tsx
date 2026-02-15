"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n/context";

export default function SignupPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20 relative">
        <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle>{t("auth.checkEmailTitle")}</CardTitle>
            <CardDescription>
              {t("auth.checkEmailSent").replace("{email}", email)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full">{t("auth.backToSignIn")}</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20 relative">
      <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md rounded-2xl border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle>{t("auth.signUpTitle")}</CardTitle>
          <CardDescription>{t("auth.signUpDescription")}</CardDescription>
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
              <label htmlFor="password" className="text-sm font-medium mb-1.5 block">
                {t("auth.password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.creatingAccount") : t("auth.signUp")}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("auth.signIn")}
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
    </main>
  );
}
