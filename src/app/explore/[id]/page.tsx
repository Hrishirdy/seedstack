"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { getPriceSuggestion } from "@/lib/ai/price-advisor";
import { NegotiationModal } from "@/components/marketplace/NegotiationModal";
import { BiddingEngine } from "@/components/marketplace/BiddingEngine";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Truck,
  Sparkles,
  Scale,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Share2,
  MessageCircle,
  Sprout,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";

export default function CropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isFarmer, isBuyer } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const crop = demoStore.getListingById(id || "");

  const [isNegOpen, setIsNegOpen] = useState(false);
  const [orderCreatedMsg, setOrderCreatedMsg] = useState<string | null>(null);

  if (!crop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Crop Listing Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested listing may have expired or been fulfilled.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  // AI Price Guidance Benchmark
  const priceGuidance = getPriceSuggestion(crop.crop_name, crop.grade, crop.district);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Floating edge cross button for instant 1-tap exit */}
      <CloseEdgeButton fixed fallbackUrl="/explore" />

      {/* Back button */}
      <div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>
      </div>

      {orderCreatedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold">
              Order {orderCreatedMsg} successfully confirmed!
            </span>
          </div>
          <Link
            href="/buyer/orders"
            className="text-xs font-bold text-emerald-700 underline"
          >
            Go to My Orders
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Images & Farmer Profile */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-subtle">
            <div className="relative h-80 sm:h-96 w-full bg-stone-100">
              <img
                src={crop.images[0]}
                alt={crop.crop_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-deep">
                {crop.grade}
              </div>
              <div className="absolute top-4 right-4 bg-emerald-900/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                {crop.available_quantity.toLocaleString()} kg In Stock
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
                  {language === "te" && crop.crop_name_te ? crop.crop_name_te : crop.crop_name}
                </h1>
                <p className="text-sm text-stone-500 mt-1">{crop.variety}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="text-stone-500">Location</div>
                  <div className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{crop.district}, {crop.state}</span>
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div className="text-stone-500">Harvest Date</div>
                  <div className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{crop.harvest_date}</span>
                  </div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 col-span-2 sm:col-span-1">
                  <div className="text-stone-500">Logistics Preference</div>
                  <div className="font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{crop.delivery_preference}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-stone-800 text-sm mb-1">Produce Description</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{crop.description}</p>
              </div>
            </div>
          </div>

          {/* Farmer Profile Card */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
            <h3 className="font-bold text-brand-deep text-sm">Producer & Verification Profile</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-light text-brand-deep flex items-center justify-center font-bold text-base">
                  {crop.farmer_name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span>{crop.farmer_name}</span>
                    {crop.farmer_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Producer</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500">
                    {crop.village}, {crop.district}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-stone-500">
                Member since 2026
              </div>
            </div>
            <p className="text-[11px] text-stone-500 border-t border-stone-100 pt-2">
              Privacy protected: Detailed contact and farm gate coordinates are disclosed upon confirmed order agreement.
            </p>
          </div>
        </div>

        {/* Right: Price & AI Guidance & Order Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Purchase Box */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-card space-y-5">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                Farmer Asking Price
              </span>
              <div className="text-3xl font-extrabold text-brand-deep mt-0.5">
                ₹{crop.asking_price_per_unit}
                <span className="text-sm font-normal text-stone-500"> / kg</span>
              </div>
              <div className="text-xs text-stone-600 mt-1">
                Available Stock: <span className="font-bold">{crop.available_quantity.toLocaleString()} kg</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {isFarmer ? (
                crop.farmer_id === user?.id ? (
                  /* Own crop listing */
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-950 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                        {language === "te" ? "🌾 మీ సొంత పంట లాట్ (సక్రియ విక్రయం)" : "🌾 Your Active Farm Lot"}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {language === "te"
                        ? "ఈ పంట మీ రైతు ఖాతా నుండి మార్కెట్‌లో ప్రత్యక్షంగా ఉంది. వ్యాపారులు క్రింద బిడ్‌లు సమర్పిస్తున్నారు."
                        : "This lot is listed from your farm account. Live buyer bids and procurement offers appear below."}
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Link
                        href="/farmer/dashboard"
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs text-center shadow-subtle"
                      >
                        {language === "te" ? "రైతు డ్యాష్‌బోర్డ్‌లో నిర్వహించండి" : "Manage in Farmer Portal"}
                      </Link>
                      <Link
                        href="/farmer/sell"
                        className="w-full py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-xs text-center hover:bg-emerald-100"
                      >
                        {language === "te" ? "మరొక పంటను అమ్మండి" : "List Another Crop"}
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Other farmer's listing */
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-950 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                        {language === "te" ? "రైతు ఖాతా (విక్రయదారుల మోడ్)" : "Farmer Seller Portal"}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {language === "te"
                        ? "కొనుగోలు మరియు చర్చల ఎంపికలు వాణిజ్య వ్యాపారులకు (Buyers) మాత్రమే అందుబాటులో ఉంటాయి. మీ పంటను విక్రయించడానికి క్రింది బటన్ నొక్కండి."
                        : "Purchasing and live price negotiations are exclusive to verified commercial buyers. As a farmer, you can list and sell your own produce."}
                    </p>
                    <Link
                      href="/farmer/sell"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-subtle"
                    >
                      <Sprout className="w-4 h-4" />
                      <span>{language === "te" ? "🌾 మీ సొంత పంటను అమ్మండి" : "🌾 Sell Your Own Crop"}</span>
                    </Link>
                  </div>
                )
              ) : (
                /* Commercial Buyer or Guest */
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        router.push(`/auth/login?role=buyer&redirect=${encodeURIComponent(`/explore/${crop.id}`)}`);
                        return;
                      }
                      setIsNegOpen(true);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-deep transition shadow-subtle flex items-center justify-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>{language === "te" ? "ధరపై చర్చించండి / కొనండి" : "Negotiate Terms / Buy"}</span>
                  </button>

                  {/* Direct WhatsApp Contact Button */}
                  <a
                    href={formatWhatsAppUrl(
                      crop.farmer_phone || "+919848012345",
                      language === "te"
                        ? `నమస్కారం ${crop.farmer_name} గారు! నేను SEEDSTACK లో మీ ${crop.crop_name} చూశాను. కొనుగోలు చేయడానికి ఆసక్తిగా ఉన్నాను.`
                        : `Hello ${crop.farmer_name}, I saw your ${crop.crop_name} listing on SEEDSTACK and would like to buy.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition shadow-subtle flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{language === "te" ? "రైతుతో వాట్సాప్‌లో మాట్లాడండి" : "Message Farmer on WhatsApp"}</span>
                  </a>

                  <p className="text-[11px] text-center text-stone-500">
                    SEEDSTACK quantity-based commission applies only on confirmed delivery.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Multi-Party Live Bidding Room */}
          <BiddingEngine
            listing={crop}
            onOrderCreated={(orderNum) => {
              setOrderCreatedMsg(orderNum);
            }}
          />

          {/* AI Feature 1: Price Guidance Module */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-emerald-200">
                  AI Fair-Price Benchmark
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-900 border border-emerald-700 px-2 py-0.5 rounded-full text-emerald-300">
                {priceGuidance.data_quality_label}
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Advisory range calculated from {priceGuidance.market_name} mandi observations ({priceGuidance.sample_size} recent transactions).
            </p>

            {/* Price Triad */}
            <div className="grid grid-cols-3 gap-2 bg-emerald-900/50 p-3 rounded-2xl border border-emerald-800/80 text-center">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Mandi Low</span>
                <span className="font-bold text-stone-200 text-sm">
                  ₹{priceGuidance.suggested_low_per_kg}
                </span>
              </div>
              <div className="border-x border-emerald-800">
                <span className="text-[10px] text-emerald-300 block uppercase font-bold">
                  Modal Ref
                </span>
                <span className="font-extrabold text-white text-base">
                  ₹{priceGuidance.suggested_modal_per_kg}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Mandi High</span>
                <span className="font-bold text-stone-200 text-sm">
                  ₹{priceGuidance.suggested_high_per_kg}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-emerald-100/90 pt-1">
              <div className="font-semibold text-emerald-300">Influencing Factors:</div>
              {priceGuidance.influencing_factors.map((f, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-stone-400 italic pt-2 border-t border-emerald-800/60">
              {priceGuidance.disclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Negotiation Modal */}
      <NegotiationModal
        listing={crop}
        isOpen={isNegOpen}
        onClose={() => setIsNegOpen(false)}
        onSuccess={(orderNum) => {
          setIsNegOpen(false);
          setOrderCreatedMsg(orderNum);
        }}
      />
    </div>
  );
}
