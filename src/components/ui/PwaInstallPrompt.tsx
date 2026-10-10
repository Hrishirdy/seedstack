"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Download, X, Smartphone, Sparkles } from "lucide-react";

export const PwaInstallPrompt: React.FC = () => {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered successfully", reg.scope))
        .catch((err) => console.error("Service Worker registration failed", err));
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show after 2 seconds if on mobile device
    const timer = setTimeout(() => {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile && !isDismissed) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, [isDismissed]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      alert(
        language === "te"
          ? "మీ బ్రౌజర్ మెనూ (⋮) నొక్కి 'Add to Home Screen' లేదా 'Install App' ఎంచుకోండి."
          : "Tap browser menu (⋮) and select 'Add to Home Screen' or 'Install App'."
      );
      setIsVisible(false);
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 print:hidden animate-bounce-in">
      <div className="bg-stone-900 text-white p-4 rounded-3xl shadow-2xl border-2 border-emerald-500 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-subtle">
            <Smartphone className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-stone-950 px-1.5 py-0.2 rounded">
                PWA APP
              </span>
              <h4 className="text-xs font-black">SEEDSTACK Mobile App</h4>
            </div>
            <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
              {language === "te"
                ? "పొలంలో ఇంటర్నెట్ లేకపోయినా పనిచేస్తుంది"
                : "Install on phone • Works offline in remote fields"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs transition shadow-xs flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === "te" ? "ఇన్‌స్టాల్" : "Install"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setIsDismissed(true);
            }}
            className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
