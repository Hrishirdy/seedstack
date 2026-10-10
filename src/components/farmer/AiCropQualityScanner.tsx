"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { CropInspectionResult } from "@/app/api/ai/crop-inspect/route";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Volume2,
  Droplets,
  ShieldCheck,
  TrendingUp,
  X,
  RefreshCw,
  Award,
  Sliders,
} from "lucide-react";

interface AiCropQualityScannerProps {
  onApplyGradeAndPrice?: (result: {
    grade: "Grade A" | "Grade B" | "Organic";
    pricePerKg: number;
    moisturePercent: number;
    cropName?: string;
  }) => void;
  className?: string;
}

const SAMPLE_CROPS = [
  {
    key: "paddy",
    labelTe: "వరి (Paddy)",
    labelEn: "Paddy Grain",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
  },
  {
    key: "chilli",
    labelTe: "మిరప (Chilli)",
    labelEn: "Red Chilli",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  },
  {
    key: "cotton",
    labelTe: "పత్తి (Cotton)",
    labelEn: "Raw Cotton",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80",
  },
  {
    key: "tomato",
    labelTe: "టమాటా (Tomato)",
    labelEn: "Tomatoes",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
  },
];

export const AiCropQualityScanner: React.FC<AiCropQualityScannerProps> = ({
  onApplyGradeAndPrice,
  className = "",
}) => {
  const { language } = useLanguage();
  const [selectedSample, setSelectedSample] = useState(SAMPLE_CROPS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<CropInspectionResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const runScan = async (cropKey: string) => {
    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/crop-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropHint: cropKey }),
      });

      if (response.ok) {
        const data = await response.json();
        // Wait 900ms for realistic scanning animation
        setTimeout(() => {
          setResult(data.data);
          setIsScanning(false);
        }, 900);
      } else {
        setIsScanning(false);
      }
    } catch (err) {
      console.error("AI Scan failed", err);
      setIsScanning(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "te" ? "te-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          {language === "te"
            ? "AI పంట నాణ్యత & తేమ పరీక్ష స్కానర్ తెరవండి"
            : "Open AI Crop Quality & Moisture Scanner"}
        </span>
        <span className="text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
          + AI Advisor
        </span>
      </button>
    );
  }

  return (
    <div
      className={`relative bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 text-white rounded-3xl p-5 sm:p-7 shadow-card border-2 border-emerald-500/40 overflow-hidden ${className}`}
    >
      {/* Top Banner and Close Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                {language === "te"
                  ? "AI పంట నాణ్యత & తేమ స్కానర్"
                  : "AI Crop Quality & Moisture Inspector"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-stone-950 font-black">
                SMART API
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              {language === "te"
                ? "కంప్యూటర్ విజన్ ద్వారా నాణ్యత, తేమ శాతం మరియు సరసమైన మార్కెట్ ధరను సెకన్లలో కనుగొనండి"
                : "Instant AI analysis of moisture %, grain grade, and MSP price guidance"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 rounded-full bg-stone-800 hover:bg-rose-600 text-stone-300 hover:text-white flex items-center justify-center transition border border-stone-700 flex-shrink-0"
          title="Minimize scanner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sample Crop Selection Bar */}
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
          {language === "te"
            ? "నమూనా పంటను ఎంచుకోండి లేదా కెమెరాతో స్కాన్ చేయండి:"
            : "Select Sample Crop or Scan with Camera:"}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_CROPS.map((crop) => (
            <button
              key={crop.key}
              type="button"
              onClick={() => {
                setSelectedSample(crop);
                runScan(crop.key);
              }}
              className={`p-2 rounded-xl border text-left transition flex items-center gap-2.5 ${
                selectedSample.key === crop.key
                  ? "bg-emerald-800/60 border-emerald-400 ring-2 ring-emerald-500/50"
                  : "bg-stone-800/60 border-stone-700 hover:bg-stone-700/60"
              }`}
            >
              <img
                src={crop.image}
                alt={crop.labelEn}
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-xs font-bold truncate text-white">
                {language === "te" ? crop.labelTe : crop.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scan Trigger Box */}
      <div className="relative rounded-2xl bg-stone-800/80 border border-stone-700 p-4 sm:p-5 overflow-hidden">
        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 bg-emerald-950/90 z-20 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-16 h-16">
              <RefreshCw className="w-16 h-16 text-emerald-400 animate-spin" />
              <Droplets className="w-6 h-6 text-emerald-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-black text-emerald-300 animate-pulse">
              {language === "te"
                ? "AI తేమ & గింజ నాణ్యతను విశ్లేషిస్తోంది..."
                : "Scanning Produce Moisture & Grade Parameters..."}
            </p>
          </div>
        )}

        {/* Not yet scanned state */}
        {!result && !isScanning && (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">
                {language === "te"
                  ? `${selectedSample.labelTe} నాణ్యతను తక్షణమే పరీక్షించండి`
                  : `Analyze ${selectedSample.labelEn} Quality Now`}
              </h4>
              <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                {language === "te"
                  ? "పంట తేమ శాతం మరియు నాణ్యతను గుర్తించి వ్యాపారులతో బేరసారాలకు సరైన ధరను సూచిస్తుంది"
                  : "Provides lab-level moisture %, trash estimation, and fair direct price"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => runScan(selectedSample.key)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs transition shadow-elevated"
            >
              {language === "te" ? "స్కాన్ ప్రారంభించండి" : "Start AI Inspection"}
            </button>
          </div>
        )}

        {/* Scan Results Display */}
        {result && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header Result Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-700/80 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  CERTIFICATE ID: {result.inspectionCertificateId}
                </span>
                <h4 className="text-base font-extrabold text-white">
                  {language === "te" ? result.cropNameTe : result.cropName}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {result.grade}
                </span>
                <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-stone-700 text-stone-300">
                  {result.confidence}% Match
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Metric 1: Moisture */}
              <div className="bg-stone-900/90 border border-stone-700/80 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{language === "te" ? "తేమ శాతం" : "Moisture %"}</span>
                </div>
                <div className="text-xl font-black text-white">
                  {result.moisturePercent}%
                </div>
                <span className="text-[10px] text-emerald-300 block font-semibold">
                  {result.moistureStatus}
                </span>
              </div>

              {/* Metric 2: Foreign Matter */}
              <div className="bg-stone-900/90 border border-stone-700/80 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-bold mb-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{language === "te" ? "మలినాలు" : "Foreign Matter"}</span>
                </div>
                <div className="text-xl font-black text-white">
                  {result.foreignMatterPercent}%
                </div>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  Clean / FAQ Passed
                </span>
              </div>

              {/* Metric 3: Pest & Damage */}
              <div className="bg-stone-900/90 border border-stone-700/80 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-stone-400 text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === "te" ? "పురుగు / ఫంగస్" : "Pest / Infest"}</span>
                </div>
                <div className="text-sm font-black text-white mt-1">
                  {result.pestDamage}
                </div>
                <span className="text-[10px] text-stone-400 block">
                  {result.colorLuster}
                </span>
              </div>

              {/* Metric 4: AI Suggested Rate */}
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{language === "te" ? "సిఫార్సు ధర" : "AI Direct Rate"}</span>
                </div>
                <div className="text-xl font-black text-emerald-300">
                  ₹{result.recommendedPricePerKg}/kg
                </div>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  +₹{((result.recommendedPricePerKg - result.mandiBenchmarkPerQtl / 100)).toFixed(1)} vs Mandi
                </span>
              </div>
            </div>

            {/* Audio Voice Readout Advisory */}
            <div className="bg-stone-900/90 border border-stone-700 p-3.5 rounded-xl flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeak(
                      language === "te" ? result.voiceAdvisoryTe : result.voiceAdvisoryEn
                    )
                  }
                  className={`p-2 rounded-lg transition flex-shrink-0 ${
                    isSpeaking
                      ? "bg-amber-500 text-stone-950 animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                  title="Play Voice Advisory"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {language === "te" ? "ఆడియో సూచన (Voice Advisory)" : "AI Agro Advisory"}
                  </span>
                  <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">
                    {language === "te" ? result.voiceAdvisoryTe : result.voiceAdvisoryEn}
                  </p>
                </div>
              </div>

              {/* Retest button */}
              <button
                type="button"
                onClick={() => runScan(selectedSample.key)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition flex-shrink-0"
                title="Scan again"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Action Button: Auto-apply to Sell Form */}
            {onApplyGradeAndPrice && (
              <button
                type="button"
                onClick={() => {
                  onApplyGradeAndPrice({
                    grade: result.grade.includes("Grade-A")
                      ? "Grade A"
                      : "Grade B",
                    pricePerKg: result.recommendedPricePerKg,
                    moisturePercent: result.moisturePercent,
                    cropName: result.cropName,
                  });
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-elevated"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>
                  {language === "te"
                    ? `ఈ ఫలితాన్ని ఫారమ్‌లో నమోదు చేయండి (₹${result.recommendedPricePerKg}/kg & ${result.grade})`
                    : `Apply AI Grade & Price to Listing Form (₹${result.recommendedPricePerKg}/kg)`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
