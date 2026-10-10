"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "./english";
import { te } from "./telugu";

type Language = "en" | "te";
type TranslationDictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("seedstack_language");
      if (stored === "en" || stored === "te") {
        setLanguageState(stored);
      }
    } catch {
      // Fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("seedstack_language", lang);
    } catch {
      // ignore
    }
  };

  const t = language === "te" ? te : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
