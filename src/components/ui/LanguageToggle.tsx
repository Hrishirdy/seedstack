"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center bg-stone-100 rounded-lg p-0.5 border border-brand-border text-xs font-medium",
        className
      )}
    >
      <div className="flex items-center px-1.5 text-stone-500">
        <Globe className="w-3.5 h-3.5 mr-1" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all font-medium",
          language === "en"
            ? "bg-white text-brand-deep shadow-xs font-semibold"
            : "text-stone-600 hover:text-stone-900"
        )}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("te")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all font-telugu",
          language === "te"
            ? "bg-white text-brand-deep shadow-xs font-semibold"
            : "text-stone-600 hover:text-stone-900"
        )}
      >
        తెలుగు
      </button>
    </div>
  );
};
