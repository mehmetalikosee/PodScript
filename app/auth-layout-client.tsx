"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
