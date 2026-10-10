"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { AgroWeatherDistrict } from "@/app/api/ai/weather/route";
import {
  Sun,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  ShieldCheck,
  Volume2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface AgroWeatherWidgetProps {
  initialDistrict?: string;
  className?: string;
}

export const AgroWeatherWidget: React.FC<AgroWeatherWidgetProps> = ({
  initialDistrict = "suryapet",
  className = "",
}) => {
  const { language } = useLanguage();
  const [districtKey, setDistrictKey] = useState(initialDistrict);
  const [weather, setWeather] = useState<AgroWeatherDistrict | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ai/weather?district=${districtKey}`);
        if (res.ok) {
          const json = await res.json();
          setWeather(json.data);
        }
      } catch (e) {
        console.error("Failed to load weather data", e);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [districtKey]);

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

  if (!weather && loading) {
    return (
      <div className={`p-4 rounded-2xl bg-white border border-stone-200 animate-pulse ${className}`}>
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-stone-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div
      className={`bg-white rounded-3xl border border-brand-border p-4 sm:p-5 shadow-card hover:shadow-elevated transition ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            {weather.rainProbabilityPercent > 40 ? (
              <CloudRain className="w-5 h-5 text-blue-600" />
            ) : weather.condition === "Sunny" ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <CloudSun className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {language === "te" ? "వాతావరణ సలహా" : "Agro-Weather"}
              </span>
              <span className="text-[10px] text-stone-500 font-semibold">
                {weather.state}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={districtKey}
                onChange={(e) => setDistrictKey(e.target.value)}
                className="font-extrabold text-sm sm:text-base text-stone-900 bg-transparent border-none cursor-pointer focus:outline-none pr-1"
              >
                <option value="suryapet">Suryapet (సూర్యాపేట)</option>
                <option value="guntur">Guntur (గుంటూరు)</option>
                <option value="warangal">Warangal (వరంగల్)</option>
                <option value="nizamabad">Nizamabad (నిజామాబాద్)</option>
                <option value="kurnool">Kurnool (కర్నూలు)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>
        </div>

        {/* Temperature & Condition */}
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {weather.tempC}°C
          </div>
          <span className="text-[11px] text-stone-500 font-semibold">
            {language === "te" ? weather.conditionTe : weather.condition}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-center mb-3">
        <div>
          <span className="text-[10px] text-stone-400 uppercase block font-semibold">
            {language === "te" ? "వర్ష సూచన" : "Rain Risk"}
          </span>
          <span className="text-xs font-black text-stone-800 flex items-center justify-center gap-0.5">
            <CloudRain className="w-3 h-3 text-blue-500" />
            {weather.rainProbabilityPercent}%
          </span>
        </div>
        <div className="border-x border-stone-200">
          <span className="text-[10px] text-stone-400 uppercase block font-semibold">
            {language === "te" ? "తేమ" : "Humidity"}
          </span>
          <span className="text-xs font-black text-stone-800 flex items-center justify-center gap-0.5">
            <Droplets className="w-3 h-3 text-emerald-600" />
            {weather.humidityPercent}%
          </span>
        </div>
        <div>
          <span className="text-[10px] text-stone-400 uppercase block font-semibold">
            {language === "te" ? "గాలి వేగం" : "Wind"}
          </span>
          <span className="text-xs font-black text-stone-800 flex items-center justify-center gap-0.5">
            <Wind className="w-3 h-3 text-teal-600" />
            {weather.windSpeedKmh} km/h
          </span>
        </div>
      </div>

      {/* Drying Safety Badge */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs mb-3">
        <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>
            {language === "te" ? weather.dryingSafetyTe : weather.dryingSafety}
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
          {language === "te" ? "రవాణా సురక్షితం" : "Transit Safe"}
        </span>
      </div>

      {/* Advisory Text with Voice Readout */}
      <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
        <button
          type="button"
          onClick={() =>
            handleSpeak(
              language === "te" ? weather.advisoryTe : weather.advisoryEn
            )
          }
          className={`p-1.5 rounded-lg transition flex-shrink-0 ${
            isSpeaking
              ? "bg-amber-500 text-stone-900 animate-pulse"
              : "bg-stone-200 hover:bg-stone-300 text-stone-700"
          }`}
          title="Play advisory"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
        <p className="leading-snug text-stone-700">
          {language === "te" ? weather.advisoryTe : weather.advisoryEn}
        </p>
      </div>
    </div>
  );
};
