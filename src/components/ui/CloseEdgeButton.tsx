"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { playNotificationChime } from "@/lib/notifications/notification-service";
import { X, ArrowLeft } from "lucide-react";

interface CloseEdgeButtonProps {
  fallbackUrl?: string;
  label?: string;
  className?: string;
  fixed?: boolean;
}

export const CloseEdgeButton: React.FC<CloseEdgeButtonProps> = ({
  fallbackUrl = "/",
  label,
  className = "",
  fixed = false,
}) => {
  const router = useRouter();
  const { language } = useLanguage();

  const handleBack = () => {
    try {
      playNotificationChime();
    } catch {
      // Audio optional
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  // Keyboard shortcut: Press Escape to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const defaultLabel =
    label ||
    (language === "te"
      ? "రద్దు చేసి వెనక్కి వెళ్ళండి"
      : "Close & Go Back");

  if (fixed) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 print:hidden">
        <button
          type="button"
          onClick={handleBack}
          aria-label={defaultLabel}
          title={defaultLabel}
          className={`group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-stone-300 hover:border-emerald-600 shadow-elevated text-stone-700 hover:text-emerald-900 transition-all transform hover:scale-105 active:scale-95 ${className}`}
        >
          <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-emerald-100 flex items-center justify-center text-stone-600 group-hover:text-emerald-800 transition">
            <X className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-black tracking-tight hidden sm:inline">
            {language === "te" ? "✕ వెనక్కి" : "✕ Close (Back)"}
          </span>
          <span className="text-[10px] text-stone-400 font-semibold hidden md:inline bg-stone-100 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={defaultLabel}
      title={defaultLabel}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-stone-600 hover:text-rose-800 text-xs font-bold transition shadow-xs ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-stone-200 group-hover:bg-rose-200 flex items-center justify-center transition">
        <X className="w-3.5 h-3.5 stroke-[2.5] text-stone-700 group-hover:text-rose-900" />
      </div>
      <span className="hidden sm:inline">
        {language === "te" ? "రద్దు (Close)" : "Close (Back)"}
      </span>
    </button>
  );
};
