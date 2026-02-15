import { AuthLayoutClient } from "@/app/auth-layout-client";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata = {
  title: "Forgot password – PodScript",
  description: "Reset your PodScript password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20 relative">
      <AuthLayoutClient>
        <ForgotPasswordForm />
      </AuthLayoutClient>
    </main>
  );
}
