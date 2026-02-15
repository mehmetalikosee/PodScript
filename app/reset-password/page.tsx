import { AuthLayoutClient } from "@/app/auth-layout-client";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata = {
  title: "Set new password – PodScript",
  description: "Choose a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20 relative">
      <AuthLayoutClient>
        <ResetPasswordForm />
      </AuthLayoutClient>
    </main>
  );
}
