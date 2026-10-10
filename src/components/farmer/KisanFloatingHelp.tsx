"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { formatWhatsAppUrl, playNotificationChime } from "@/lib/notifications/notification-service";
import {
  Phone,
  MessageCircle,
  HelpCircle,
  X,
  Volume2,
  ExternalLink,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export const KisanFloatingHelp: React.FC = () => {
  const { language } = useLanguage();
  const { isBuyer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Strictly hide farmer helpdesk when commercial buyer is logged in
  if (isBuyer) return null;

  const whatsappMessage =
    language === "te"
      ? "నమస్కారం SEEDSTACK సహాయ కేంద్రం! నాకు పంట అమ్మకం మరియు ధరల వివరాలపై సహాయం కావాలి."
      : "Hello SEEDSTACK Helpline! I need assistance with crop selling and mandi market prices.";

  const whatsappUrl = formatWhatsAppUrl("+919848012345", whatsappMessage);

  const speakHelp = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(language === "te" ? "మీ బ్రౌజర్ ఆడియోను సపోర్ట్ చేయదు." : "Your browser does not support audio speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak =
      language === "te"
        ? "నమస్కారం రైతు మిత్రమా. సీడ్‌స్టాక్ వ్యవసాయ సహాయ కేంద్రానికి స్వాగతం. మీరు మీ పంటను సులభంగా అమ్మడానికి, లేదా మీ డబ్బులు పొందడానికి వాట్సాప్ బటన్ నొక్కండి. మేము మీకు ఇరవై నాలుగు గంటలూ సహాయం చేయడానికి సిద్ధంగా ఉన్నాము."
        : "Welcome to SEEDSTACK Farmer Helpline. To sell your produce easily or to receive your payment via UPI, tap the WhatsApp button below. We are available 24/7 to assist you.";

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === "te" ? "te-IN" : "en-IN";
    utterance.rate = 0.9;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleOpen = () => {
    playNotificationChime();
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden font-sans">
      {/* Expanded Modal / Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm">
                  {language === "te" ? "రైతు సహాయ కేంద్రం" : "Kisan Sahayata Desk"}
                </h3>
                <p className="text-[11px] text-emerald-200">
                  {language === "te" ? "24/7 ఉచిత రైతు సేవ" : "24/7 Farmer Help & Guidance"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition"
              aria-label="Close Help"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Audio Voice Guide Button */}
            <button
              onClick={speakHelp}
              className={`w-full py-2.5 px-3 rounded-2xl border-2 text-xs font-black flex items-center justify-center gap-2 transition ${
                isSpeaking
                  ? "bg-amber-100 border-amber-500 text-amber-900 animate-pulse"
                  : "bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100"
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-700" />
              <span>
                {isSpeaking
                  ? language === "te"
                    ? "ఆడియో వినబడుతోంది... (ఆపడానికి నొక్కండి)"
                    : "Speaking... (Tap to stop)"
                  : language === "te"
                  ? "🔊 సహాయం తెలుగులో వినండి"
                  : "🔊 Listen to Voice Guidance"}
              </span>
            </button>

            {/* WhatsApp Direct Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-between shadow-md transition"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>
                  {language === "te" ? "వాట్సాప్‌లో మాట్లాడండి" : "WhatsApp Farmer Support"}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-200" />
            </a>

            {/* Direct Phone Call */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="text-[11px] font-bold text-stone-500 uppercase">
                {language === "te" ? "ఉచిత ఫోన్ నంబర్లు" : "Toll-Free Helplines"}
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                <span>SEEDSTACK రైతు హెల్ప్‌లైన్:</span>
                <a
                  href="tel:+919848012345"
                  className="text-emerald-700 hover:underline flex items-center gap-1 font-extrabold"
                >
                  <Phone className="w-3 h-3" />
                  +91 98480 12345
                </a>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-600">
                <span>జాతీయ కిసాన్ కాల్ సెంటర్:</span>
                <a
                  href="tel:18001801551"
                  className="text-stone-800 font-bold hover:underline"
                >
                  1800-180-1551
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === "te"
                  ? "రైతుల ఖాతాకు 100% ప్రత్యక్ష నగదు జమ"
                  : "100% Direct Farmer Bank Settlement Guarantee"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleOpen}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-2xl hover:bg-emerald-800 hover:scale-105 transition active:scale-95 border-2 border-white ring-4 ring-emerald-500/20"
        aria-label="Kisan Helpline"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
        <span>
          {language === "te" ? "రైతు సహాయం (24/7)" : "Kisan Helpline (24/7)"}
        </span>
      </button>
    </div>
  );
};
