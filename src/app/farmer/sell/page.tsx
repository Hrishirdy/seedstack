"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { getPriceSuggestion } from "@/lib/ai/price-advisor";
import {
  Sprout,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { KisanQuickSellModal } from "@/components/farmer/KisanQuickSellModal";
import { VoiceAssistantButton } from "@/components/ui/VoiceAssistantButton";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";
import { AiCropQualityScanner } from "@/components/farmer/AiCropQualityScanner";

function SellCropContent() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isQuickSellOpen, setIsQuickSellOpen] = useState(false);

  if (!user) return null;

  const [cropName, setCropName] = useState("Paddy (Sona Masoori BPT 5204)");
  const [cropNameTe, setCropNameTe] = useState("సోనా మసూరి వరి (BPT 5204)");
  const [variety, setVariety] = useState("BPT 5204 Fine Grain");
  const [categoryId, setCategoryId] = useState("cat-grains");
  const [availableQty, setAvailableQty] = useState<number>(1000);
  const [askingPrice, setAskingPrice] = useState<number>(29.5);
  const [grade, setGrade] = useState<"Grade A" | "Grade B" | "Organic">("Grade A");
  const [harvestDate, setHarvestDate] = useState("2026-10-08");
  const [state, setState] = useState(user.state || "Telangana");
  const [district, setDistrict] = useState(user.district || "Suryapet");
  const [village, setVillage] = useState(user.mandal_or_village || "Chivvemla Farm Gate");
  const [deliveryPref, setDeliveryPref] = useState("Farm Gate Pickup or Platform Logistics");
  const [description, setDescription] = useState(
    "High quality sun-dried grain. Moisture content below 13.5%. Ideal for commercial milling."
  );
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"
  );
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic AI price benchmark
  const aiSuggestion = getPriceSuggestion(cropName, grade, district);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (availableQty <= 0 || askingPrice <= 0) {
      alert("Please enter a valid positive quantity and asking price.");
      return;
    }

    demoStore.createListing({
      farmer_id: user.id,
      farmer_name: user.full_name,
      farmer_verified: user.verification_status === "approved",
      category_id: categoryId,
      crop_name: cropName,
      crop_name_te: cropNameTe,
      variety,
      available_quantity: availableQty,
      unit: "kg",
      asking_price_per_unit: askingPrice,
      grade,
      harvest_date: harvestDate,
      state,
      district,
      village,
      delivery_preference: deliveryPref,
      description,
      images: [imageUrl],
      status: "active",
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push("/farmer/dashboard");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      {/* Fixed Edge Close Cross Button on Viewport Corner */}
      <CloseEdgeButton fixed fallbackUrl="/farmer/dashboard" />

      <div className="flex items-center justify-between pb-1">
        <Link
          href="/farmer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-600 hover:text-brand-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "te" ? "రైతు డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి" : "Back to Farmer Dashboard"}</span>
        </Link>
        <CloseEdgeButton fallbackUrl="/farmer/dashboard" />
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card space-y-6 relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2">
              <Sprout className="w-3.5 h-3.5" />
              <span>Post New Crop Lot / పంటను అమ్మకానికి పెట్టండి</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
              {t.farmer.createNewListing}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Publish your harvested produce directly to verified commercial buyers across Telangana and Andhra Pradesh.
            </p>
          </div>
          <CloseEdgeButton fallbackUrl="/farmer/dashboard" />
        </div>

        {/* Free listing alert */}
        <div className="p-4 rounded-xl bg-brand-light border border-emerald-200 text-xs text-brand-deep flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Zero Upfront Listing Fee: </span>
            <span>
              SEEDSTACK does not charge any fee to list your crop. Fixed quantity commission is applicable only upon successful delivery fulfillment.
            </span>
          </div>
        </div>

        {/* Kisan Easy Mode Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="font-black text-sm">
                {language === "te"
                  ? "రైతు సులభ అమ్మకం (1-నిమిషంలో అమ్మండి)"
                  : "Kisan 1-Minute Quick Sell Mode"}
              </div>
              <div className="text-xs text-emerald-100">
                {language === "te"
                  ? "పెద్ద ఫారమ్‌లు నింపకుండా, పంట ఫోటో మరియు బస్తాలు ఎంచుకుని వెంటనే అమ్మండి"
                  : "No tedious typing. Select crop picture, pick bags, and list in 60 seconds."}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQuickSellOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs hover:bg-emerald-50 transition shrink-0 shadow"
          >
            {language === "te" ? "🌾 సులభంగా అమ్మండి (Quick Sell)" : "🌾 Open Quick Sell"}
          </button>
        </div>

        {isQuickSellOpen && (
          <KisanQuickSellModal
            isOpen={isQuickSellOpen}
            onClose={() => setIsQuickSellOpen(false)}
            onSuccess={(cropName) => {
              setIsQuickSellOpen(false);
              setIsSuccess(true);
              setTimeout(() => {
                router.push("/farmer/dashboard");
              }, 1200);
            }}
          />
        )}

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold text-brand-deep">
              Listing Published Successfully!
            </h2>
            <p className="text-xs text-stone-600">
              Your produce is now visible to wholesalers and supermarkets. Redirecting...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Crop Quality, Moisture and Grade Scanner API Component */}
            <AiCropQualityScanner
              onApplyGradeAndPrice={(res) => {
                setGrade(res.grade);
                setAskingPrice(res.pricePerKg);
                if (res.cropName) {
                  setCropName(res.cropName);
                }
                setDescription((prev) =>
                  prev
                    ? `${prev} | AI Verified Moisture: ${res.moisturePercent}%`
                    : `AI Verified Produce Moisture: ${res.moisturePercent}%. Clean grain with zero infestation.`
                );
              }}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Crop Name (English)
                  </label>
                  <VoiceAssistantButton
                    onTranscript={(text) => setCropName(text)}
                  />
                </div>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    పంట పేరు (తెలుగు)
                  </label>
                  <VoiceAssistantButton
                    language="te"
                    onTranscript={(text) => setCropNameTe(text)}
                  />
                </div>
                <input
                  type="text"
                  value={cropNameTe}
                  onChange={(e) => setCropNameTe(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary font-telugu"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Variety
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
                >
                  <option value="cat-grains">Cereals & Paddy (ధాన్యాలు & వరి)</option>
                  <option value="cat-spices">Spices & Mirchi (మసాలా దినుసులు)</option>
                  <option value="cat-veg">Vegetables (కూరగాయలు)</option>
                  <option value="cat-cash">Cash Crops (వాణిజ్య పంటలు)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Available Quantity (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={availableQty}
                  onChange={(e) => setAvailableQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Asking Price per kg (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* AI Price Guidance Banner during creation */}
            <div className="p-4 rounded-xl bg-emerald-950 text-white border border-emerald-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Mandi Benchmark Suggestion</span>
                </span>
                <span className="text-[10px] text-stone-300">
                  {aiSuggestion.market_name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div>
                  Mandi Spread: <span className="font-bold text-white">₹{aiSuggestion.suggested_low_per_kg} – ₹{aiSuggestion.suggested_high_per_kg}/kg</span>
                </div>
                <div>
                  Modal Benchmark: <span className="font-bold text-emerald-400">₹{aiSuggestion.suggested_modal_per_kg}/kg</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400">
                You retain complete freedom to set your price. Buyers can negotiate or accept asking price.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Produce Quality Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Grade B">Grade B (Standard)</option>
                  <option value="Organic">Organic Certified</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  required
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Delivery Preference
                </label>
                <input
                  type="text"
                  value={deliveryPref}
                  onChange={(e) => setDeliveryPref(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Village / Farm Location
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Produce Photograph (URL)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Produce Description & Moisture Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-deep transition shadow-card flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Publish Listing to Marketplace</span>
              </button>
            </div>
          </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SellCropPage() {
  return (
    <RoleBarrierGuard allowedRole="farmer">
      <SellCropContent />
    </RoleBarrierGuard>
  );
}
