"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { toast } from "sonner";

export function ConfirmEmailCard() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast.error("Sign in again to resend.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Confirmation email sent. Check your inbox.");
  }

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <CardTitle>{t("auth.confirmEmailTitle")}</CardTitle>
        <CardDescription>{t("auth.confirmEmailSent")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("auth.confirmEmailRequired")}
        </p>
        <Button variant="outline" size="sm" onClick={handleResend} disabled={loading}>
          {loading ? "..." : t("auth.resendConfirmation")}
        </Button>
      </CardContent>
    </Card>
  );
}
