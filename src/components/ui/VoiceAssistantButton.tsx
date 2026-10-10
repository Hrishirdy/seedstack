"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface VoiceAssistantButtonProps {
  onTranscript: (text: string) => void;
  language?: "te" | "en";
  placeholderText?: string;
  className?: string;
}

export const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({
  onTranscript,
  className = "",
}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!supported || typeof window === "undefined") {
      alert(
        language === "te"
          ? "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సపోర్ట్ లేదు. దయచేసి గూగుల్ క్రోమ్ ఉపయోగించండి."
          : "Voice recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    try {
      const SpeechRecognition =
        (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition ||
        (window as unknown as { SpeechRecognition: any }).SpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === "te" ? "te-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptPreview(
          language === "te" ? "వింటున్నాను... మాట్లాడండి" : "Listening... please speak"
        );
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscriptPreview(transcript);
        if (event.results[current].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscriptPreview("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={startListening}
        aria-label="Voice Search & Assist"
        className={`relative flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all shadow-subtle ${
          isListening
            ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5 text-white animate-bounce" />
            <span className="text-xs font-semibold">
              {language === "te" ? "వింటోంది..." : "Listening..."}
            </span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5 text-emerald-800" />
            <span className="text-xs font-semibold">
              {language === "te" ? "వాయిస్" : "Voice"}
            </span>
          </>
        )}
      </button>

      {/* Floating listening wave feedback */}
      {isListening && transcriptPreview && (
        <div className="absolute left-0 -top-12 z-50 bg-stone-900 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>{transcriptPreview}</span>
        </div>
      )}
    </div>
  );
};
