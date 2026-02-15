"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Locale, translations } from "./translations";

/** BCP 47 locale for Intl (e.g. date formatting). */
export const localeToBCP47: Record<Locale, string> = {
  en: "en",
  tr: "tr",
  es: "es",
  de: "de",
  fr: "fr",
  pt: "pt-BR",
  ja: "ja",
  zh: "zh-CN",
};

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dateLocale: string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "podscript-locale";
const VALID_LOCALES: Locale[] = ["en", "tr", "es", "de", "fr", "pt", "ja", "zh"];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && VALID_LOCALES.includes(stored)) setLocaleState(stored);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      if (!mounted) return key;
      return translations[locale][key] ?? translations.en[key] ?? key;
    },
    [locale, mounted]
  );

  const dateLocale = localeToBCP47[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "en" as Locale,
      setLocale: (_: Locale) => {},
      t: (key: string) => (translations.en as Record<string, string>)[key] ?? key,
      dateLocale: "en",
    };
  }
  return ctx;
}
