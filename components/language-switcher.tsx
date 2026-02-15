"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/translations";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.value === locale) ?? LOCALES[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="rounded-lg min-w-[100px] justify-between gap-1"
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute top-full right-0 mt-1 py-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[140px] max-h-[280px] overflow-y-auto">
            {LOCALES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center justify-between gap-2"
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {locale === opt.value && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
