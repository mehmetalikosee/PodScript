import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { AuthLayoutClient } from "../auth-layout-client";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20 relative">
      <AuthLayoutClient>
        <Suspense fallback={<div className="w-full max-w-md h-64 rounded-2xl border border-border/80 bg-card shadow-sm animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </AuthLayoutClient>
    </main>
  );
}
