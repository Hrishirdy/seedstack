"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { VoiceAssistantButton } from "../ui/VoiceAssistantButton";
import { FarmerAudioGuide } from "./FarmerAudioGuide";
import {
  X,
  CheckCircle2,
  Sprout,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface KisanQuickSellModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: (cropName: string) => void;
}

const POPULAR_CROPS = [
  {
    nameEn: "Paddy (Sona Masoori)",
    nameTe: "వరి (సోనా మసూరి)",
    catId: "cat-grains",
    icon: "🌾",
    defaultRatePerKg: 30,
    mandiBenchmark: 2350, // per quintal
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  },
  {
    nameEn: "Teja Red Chilli",
    nameTe: "తేజ ఎర్ర మిరప",
    catId: "cat-spices",
    icon: "🌶️",
    defaultRatePerKg: 215,
    mandiBenchmark: 21500,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  },
  {
    nameEn: "Raw Cotton (Kapas)",
    nameTe: "పత్తి (కాటన్)",
    catId: "cat-cash",
    icon: "☁️",
    defaultRatePerKg: 74,
    mandiBenchmark: 7400,
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80",
  },
  {
    nameEn: "Country Tomatoes",
    nameTe: "నాటు టమాటాలు",
    catId: "cat-veg",
    icon: "🍅",
    defaultRatePerKg: 24,
    mandiBenchmark: 2400,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    nameEn: "Yellow Maize",
    nameTe: "మొక్కజొన్న",
    catId: "cat-grains",
    icon: "🌽",
    defaultRatePerKg: 22,
    mandiBenchmark: 2200,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  },
  {
    nameEn: "Nizamabad Turmeric",
    nameTe: "పసుపు కొమ్ములు",
    catId: "cat-spices",
    icon: "🟡",
    defaultRatePerKg: 145,
    mandiBenchmark: 14500,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  },
];

const QUICK_BAG_SIZES = [
  { bags: 10, kg: 500, labelTe: "10 బస్తాలు (5 క్విం)", labelEn: "10 Bags (500 kg)" },
  { bags: 20, kg: 1000, labelTe: "20 బస్తాలు (10 క్విం)", labelEn: "20 Bags (1000 kg)" },
  { bags: 50, kg: 2500, labelTe: "50 బస్తాలు (25 క్విం)", labelEn: "50 Bags (2.5 tonnes)" },
  { bags: 100, kg: 5000, labelTe: "100 బస్తాలు (50 క్విం)", labelEn: "100 Bags (5 tonnes)" },
];

export const KisanQuickSellModal: React.FC<KisanQuickSellModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState(POPULAR_CROPS[0]);
  const [quantityKg, setQuantityKg] = useState(1000);
  const [pricePerKg, setPricePerKg] = useState(selectedCrop.defaultRatePerKg);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !user) return null;

  const handleCropSelect = (crop: typeof POPULAR_CROPS[0]) => {
    setSelectedCrop(crop);
    setPricePerKg(crop.defaultRatePerKg);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      demoStore.createListing({
        farmer_id: user.id,
        farmer_name: user.full_name,
        farmer_phone: user.phone || "+91 98480 12345",
        farmer_verified: user.verification_status === "approved",
        category_id: selectedCrop.catId,
        crop_name: selectedCrop.nameEn,
        crop_name_te: selectedCrop.nameTe,
        variety: "Regional Quality Standard",
        available_quantity: quantityKg,
        unit: "kg",
        asking_price_per_unit: pricePerKg,
        grade: "Grade A",
        harvest_date: new Date().toISOString().split("T")[0],
        state: user.state || "Telangana",
        district: user.district || "Suryapet",
        village: user.mandal_or_village || "Chivvemla Farm Gate",
        delivery_preference: "Farm Gate Truck Pickup or Mandi Logistics",
        description: `Fresh farm harvest by ${user.full_name}. Inspected moisture content under control. Ready for immediate buyer truck collection.`,
        images: [selectedCrop.image],
        status: "active",
      });

      onSuccess(language === "te" ? selectedCrop.nameTe : selectedCrop.nameEn);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpectedAmount = quantityKg * pricePerKg;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-600/30 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  {language === "te" ? "రైతు శీఘ్ర అమ్మకం (కేవలం 1 నిమిషం)" : "Kisan 1-Minute Quick Sell"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-stone-900 font-extrabold">
                  SUPER EASY
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {language === "te"
                  ? "పంటను తాకండి • బస్తాలు ఎంచుకోండి • నేరుగా అమ్మండి"
                  : "Tap Crop • Select Bags • Zero Typing Needed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FarmerAudioGuide
              customTextTe="పంటను ఎంచుకోండి, ఎన్ని బస్తాలు ఉన్నాయో నొక్కండి, మరియు పచ్చని బటన్ నొక్కి అమ్మకానికి పెట్టండి."
              customTextEn="Select your crop photo, tap how many bags you have, and tap the big green button to list."
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              title="Close modal (Escape)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-rose-600 text-white font-extrabold text-xs transition border border-white/30 hover:border-rose-700 shadow-sm"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">
                {language === "te" ? "రద్దు" : "Close"}
              </span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-5 sm:p-6 space-y-6">
          {/* STEP 1: CROP SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                  1
                </span>
                {language === "te" ? "మీ పంట ఏది? (తాకండి)" : "Step 1: Select Your Crop"}
              </span>
              <VoiceAssistantButton
                onTranscript={(text) => {
                  const match = POPULAR_CROPS.find(
                    (c) =>
                      c.nameEn.toLowerCase().includes(text.toLowerCase()) ||
                      c.nameTe.includes(text)
                  );
                  if (match) handleCropSelect(match);
                }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POPULAR_CROPS.map((crop) => {
                const isSelected = selectedCrop.nameEn === crop.nameEn;
                return (
                  <button
                    key={crop.nameEn}
                    type="button"
                    onClick={() => handleCropSelect(crop)}
                    className={`p-3 rounded-2xl border-2 text-left transition flex items-center gap-2.5 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-400"
                        : "border-stone-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-2xl">{crop.icon}</span>
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-stone-900 truncate">
                        {language === "te" ? crop.nameTe : crop.nameEn}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold">
                        Mandi: ₹{crop.defaultRatePerKg}/kg
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: QUANTITY QUICK PICKER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                  2
                </span>
                {language === "te" ? "ఎంత పరిమాణం ఉంది? (బస్తాలు)" : "Step 2: How Much Produce?"}
              </span>
              <span className="text-sm font-black text-emerald-800">
                {quantityKg.toLocaleString()} kg ({quantityKg / 50} బస్తాలు)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {QUICK_BAG_SIZES.map((item) => (
                <button
                  key={item.kg}
                  type="button"
                  onClick={() => setQuantityKg(item.kg)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    quantityKg === item.kg
                      ? "border-emerald-600 bg-emerald-700 text-white shadow-subtle"
                      : "border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  {language === "te" ? item.labelTe : item.labelEn}
                </button>
              ))}
            </div>

            {/* Custom kg stepper */}
            <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setQuantityKg(Math.max(50, quantityKg - 50))}
                className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-black text-stone-700 hover:bg-stone-100 flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="10"
                step="50"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value) || 0)}
                className="flex-1 text-center font-black text-base bg-white py-1 rounded border border-stone-300"
              />
              <span className="text-xs font-bold text-stone-500">kg</span>
              <button
                type="button"
                onClick={() => setQuantityKg(quantityKg + 50)}
                className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-black text-stone-700 hover:bg-stone-100 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* STEP 3: PRICE STEPPER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">
                  3
                </span>
                {language === "te" ? "మీరు కోరే ధర (₹ / కేజీ)" : "Step 3: Your Asking Price (₹ / kg)"}
              </span>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Mandi Benchmark: ₹{selectedCrop.defaultRatePerKg}/kg
              </span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
              <button
                type="button"
                onClick={() => setPricePerKg(Math.max(1, pricePerKg - 1))}
                className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-600 text-emerald-800 font-black text-xl hover:bg-emerald-100 flex items-center justify-center shadow-subtle"
              >
                -₹1
              </button>

              <div className="flex-1 text-center">
                <div className="text-3xl font-black text-emerald-900">
                  ₹{pricePerKg}
                  <span className="text-xs font-normal text-stone-600"> / kg</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  (₹{pricePerKg * 100} క్వింటాలుకు)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPricePerKg(pricePerKg + 1)}
                className="w-12 h-12 rounded-xl bg-white border-2 border-emerald-600 text-emerald-800 font-black text-xl hover:bg-emerald-100 flex items-center justify-center shadow-subtle"
              >
                +₹1
              </button>
            </div>
          </div>

          {/* Total Value Summary Box */}
          <div className="bg-stone-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                {language === "te" ? "అంచనా మొత్తం రాబడి" : "Expected Direct Produce Value"}
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{totalExpectedAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-right text-[11px] text-stone-300">
              <p>100% రైతు ఖాతాకు నేరుగా</p>
              <p className="text-emerald-400 font-semibold">లిస్టింగ్ ఉచితం • 0% కమీషన్ కట్</p>
            </div>
          </div>

          {/* GIANT ACTION BUTTON & CANCEL EXIT */}
          <div className="space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-base shadow-elevated transition flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
              <span>
                {language === "te"
                  ? `సరే, ${selectedCrop.nameTe} ను మార్కెట్లో పెట్టండి`
                  : `Confirm & Post ${selectedCrop.nameEn} to Marketplace`}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 font-bold text-xs transition flex items-center justify-center gap-2 border border-stone-200 hover:border-rose-300"
            >
              <X className="w-4 h-4" />
              <span>
                {language === "te"
                  ? "పొరపాటున నొక్కారా? రద్దు చేసి వెనక్కి వెళ్ళండి (Cancel & Go Back)"
                  : "Opened by mistake? Cancel & Go Back"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
