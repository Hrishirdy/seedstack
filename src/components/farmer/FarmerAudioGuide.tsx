"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface FarmerAudioGuideProps {
  customTextTe?: string;
  customTextEn?: string;
  className?: string;
  labelTe?: string;
  labelEn?: string;
}

export const FarmerAudioGuide: React.FC<FarmerAudioGuideProps> = ({
  customTextTe,
  customTextEn,
  className = "",
  labelTe = "చదివి వినిపించు",
  labelEn = "Listen Audio Guide",
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const defaultTe =
    "నమస్కారం రైతు సోదరా! SEEDSTACK కి స్వాగతం. మీ పంటను సులభంగా అమ్మడానికి పచ్చని బటన్ నొక్కండి. వ్యాపారులు బిడ్లు వేస్తారు, లారీ మీ పొలం వద్దకే వస్తుంది, డబ్బులు నేరుగా మీ ఖాతాలో పడతాయి.";
  const defaultEn =
    "Welcome farmer friend! Tap the green button to sell your crop lot in 1 minute. Verified buyers will bid, trucks collect at your farm-gate, and payment is directly sent to your UPI or bank.";

  const textToSpeak =
    language === "te"
      ? customTextTe || defaultTe
      : customTextEn || defaultEn;

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Try to select Telugu voice if available, fallback to Indian English or default
    const voices = window.speechSynthesis.getVoices();
    if (language === "te") {
      const teluguVoice = voices.find(
        (v) => v.lang.includes("te") || v.lang.includes("te-IN")
      );
      if (teluguVoice) utterance.voice = teluguVoice;
      utterance.lang = "te-IN";
    } else {
      const enInVoice = voices.find((v) => v.lang.includes("en-IN"));
      if (enInVoice) utterance.voice = enInVoice;
      utterance.lang = "en-IN";
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-subtle ${
        isPlaying
          ? "bg-amber-500 text-white animate-pulse ring-4 ring-amber-200"
          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
      } ${className}`}
      aria-label="Listen Voice Guide"
      title={language === "te" ? "ధ్వని ద్వారా వినండి" : "Listen in voice"}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-white" />
          <span>{language === "te" ? "ఆపండి" : "Stop"}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-800" />
          <span>{language === "te" ? labelTe : labelEn}</span>
        </>
      )}
    </button>
  );
};
