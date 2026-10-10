"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { Order, CropListing, ProduceBid } from "@/lib/types";
import { KisanQuickSellModal } from "./KisanQuickSellModal";
import { FarmerAudioGuide } from "./FarmerAudioGuide";
import { UpiQrModal } from "../payments/UpiQrModal";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import { AgroWeatherWidget } from "../ui/AgroWeatherWidget";
import {
  Sprout,
  PlusCircle,
  Truck,
  Phone,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  QrCode,
  ShieldCheck,
  Sparkles,
  Volume2,
  Clock,
  ArrowRight,
  Gavel,
} from "lucide-react";

export const KisanSimpleView: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [isQuickSellOpen, setIsQuickSellOpen] = useState(false);
  const [selectedUpiOrder, setSelectedUpiOrder] = useState<Order | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!user) return null;

  const listings = demoStore.getListings().filter((l) => l.farmer_id === user.id);
  const orders = demoStore.getOrders().filter((o) => o.farmer_id === user.id);
  const allBids = demoStore.getAllBids().filter((b) =>
    listings.some((l) => l.id === b.listing_id && b.status === "active")
  );

  const totalEarnings = orders
    .filter((o) => o.status === "completed" || o.status === "delivered")
    .reduce((acc, curr) => acc + curr.total_order_value, 0);

  const pendingPayments = orders.filter((o) => o.payment_status !== "confirmed");

  const latestDeliveryOrder = orders.find(
    (o) => o.status === "picked_up" || o.status === "in_transit" || o.status === "confirmed"
  );

  const helplineWhatsAppUrl = formatWhatsAppUrl(
    "+919848012345",
    language === "te"
      ? `నమస్కారం SEEDSTACK సహాయ కేంద్రం! నేను రైతు ${user.full_name} (${user.district}). నాకు సహాయం కావాలి.`
      : `Hello SEEDSTACK Helpline! I am farmer ${user.full_name} from ${user.district}. I need assistance.`
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-black text-sm flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs font-bold text-emerald-800 underline"
          >
            సరే (OK)
          </button>
        </div>
      )}

      {/* Greeting Banner with Audio Guide */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-3xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌾</span>
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              {language === "te" ? "రైతు సులభ మోడ్" : "Kisan Simple View"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-900 text-emerald-300 font-extrabold">
              VERIFIED PRODUCER
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {language === "te"
              ? `నమస్కారం, ${user.full_name.split(" ")[0]} గారు!`
              : `Welcome, ${user.full_name}!`}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {user.mandal_or_village}, {user.district} • {user.land_size_acres || 5} ఎకరాల పొలం
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FarmerAudioGuide
            labelTe="ధ్వని ద్వారా వినండి"
            labelEn="Listen Voice Guide"
            className="bg-white/20 text-white hover:bg-white/30 border-white/30"
          />
          <a
            href="tel:18004251234"
            className="px-4 py-2 rounded-2xl bg-amber-400 text-stone-900 font-black text-xs flex items-center gap-1.5 shadow-subtle hover:bg-amber-300 transition"
          >
            <Phone className="w-4 h-4" />
            <span>{language === "te" ? "టోల్-ఫ్రీ కాల్" : "Helpline"}</span>
          </a>
        </div>
      </div>

      {/* 4 GIANT TACTILE ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: SELL PRODUCE IN 1-MINUTE */}
        <button
          type="button"
          onClick={() => setIsQuickSellOpen(true)}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white text-left shadow-elevated hover:scale-[1.01] active:scale-98 transition flex items-center justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-3 shadow-subtle group-hover:bg-white/30 transition">
              🌾
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === "te" ? "కొత్త పంటను అమ్మండి" : "Sell Crop in 1-Min"}
            </h3>
            <p className="text-xs text-emerald-100 mt-1">
              {language === "te"
                ? "వరి, మిర్చి, పత్తి, టమాట — ఫోటో తాకి వెంటనే అమ్మండి"
                : "Paddy, Chilli, Cotton, Tomatoes — Tap to list instantly"}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center font-black text-xl shrink-0 ml-3 shadow-md group-hover:translate-x-1 transition">
            +
          </div>
        </button>

        {/* CARD 2: MY MONEY & DIRECT UPI */}
        <div className="p-6 rounded-3xl bg-white border-2 border-emerald-500/30 text-stone-900 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💰</span>
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  {language === "te" ? "నా పైకం / నా డబ్బు" : "My Produce Earnings"}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {pendingPayments.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUpiOrder(pendingPayments[0])}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1 border border-emerald-300 hover:bg-emerald-200 transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI QR</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
            <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% రైతు ఖాతాకే ప్రత్యక్షంగా</span>
            </span>
            <Link
              href="/farmer/orders"
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              <span>{language === "te" ? "రసీదులు చూడండి" : "View Receipts"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CARD 3: PICKUP TRUCK STATUS */}
        <div className="p-6 rounded-3xl bg-white border-2 border-stone-200 text-stone-900 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  {language === "te" ? "లారీ డెలివరీ స్థితి" : "Farm Gate Pickup"}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                {latestDeliveryOrder ? latestDeliveryOrder.status.replace("_", " ").toUpperCase() : "NO PENDING TRUCK"}
              </span>
            </div>

            {latestDeliveryOrder ? (
              <div className="space-y-1">
                <p className="text-sm font-black text-stone-900">
                  {latestDeliveryOrder.ordered_quantity} kg {latestDeliveryOrder.crop_name}
                </p>
                <p className="text-xs text-stone-600">
                  లారీ మీ పొలం వద్దకు వస్తోంది • డ్రైవర్: సురేష్ యాదవ్ (AP 16 TX 4402)
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-1">
                ప్రస్తుతం ఏ లారీ పెండింగ్‌లో లేదు. పంటను అమ్మినప్పుడు ఇక్కడ లారీ కదలికలు కనిపిస్తాయి.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
            {latestDeliveryOrder ? (
              <a
                href="tel:9876543210"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>డ్రైవర్‌కు ఫోన్ చేయండి</span>
              </a>
            ) : (
              <span className="text-xs text-stone-400">ఆటోమేటిక్ లారీ కేటాయింపు</span>
            )}

            {latestDeliveryOrder?.delivery_id && (
              <Link
                href={`/tracking/${latestDeliveryOrder.delivery_id}`}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>మ్యాప్‌లో చూడండి</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* CARD 4: TODAY'S APMC MANDI RATES */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-stone-900 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  {language === "te" ? "నేటి మార్కెట్ ధరలు (Mandi)" : "Today's APMC Mandi Rates"}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] text-stone-500 block truncate">సూర్యాపేట వరి</span>
                <span className="text-sm font-black text-emerald-800">₹23.50/kg</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] text-stone-500 block truncate">గుంటూరు మిర్చి</span>
                <span className="text-sm font-black text-emerald-800">₹215/kg</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="text-[10px] text-stone-500 block truncate">వరంగల్ పత్తి</span>
                <span className="text-sm font-black text-emerald-800">₹74/kg</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200 mt-3 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">e-NAM & AGMARKNET ధృవీకరించిన ధరలు</span>
            <Link
              href="/ai-insights"
              className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
            >
              <span>14 రోజుల అంచనా</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AGRO-CLIMATIC WEATHER & DRYING SAFETY ADVISORY API */}
      <AgroWeatherWidget initialDistrict={user.district?.toLowerCase() || "suryapet"} />

      {/* INCOMING BUYER BIDS NOTIFICATION STRIP */}
      {allBids.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 p-5 shadow-elevated">
          <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Gavel className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {language === "te" ? "మీ పంట పై వచ్చిన తాజా బిడ్లు" : "New Bids on Your Lots"}
                </h4>
                <p className="text-[11px] text-stone-500">
                  వ్యాపారులు మంచి ధర ప్రతిపాదించారు. ఆమోదిస్తే వెంటనే లారీ వస్తుంది.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {allBids.slice(0, 2).map((bid) => (
              <div
                key={bid.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{bid.bidder_name}</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                      ₹{bid.bid_amount_per_kg}/kg
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    పరిమాణం: {bid.quantity_kg} kg • మొత్తం విలువ: ₹{(bid.bid_amount_per_kg * bid.quantity_kg).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const ord = demoStore.acceptBid(bid.id);
                    setSuccessToast(`ఆర్డర్ #${ord.order_number} ఖరారైంది! లారీ సిద్ధమవుతోంది.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-subtle flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ఆమోదించండి (Accept)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY ACTIVE CROPS (రైతు పెట్టిన పంటలు) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{language === "te" ? "నా యాక్టివ్ పంటలు" : "My Active Produce Lots"}</span>
            <span className="text-xs text-stone-400">({listings.length})</span>
          </h4>
          <button
            type="button"
            onClick={() => setIsQuickSellOpen(true)}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            + మరో పంటను చేర్చండి
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            ఇంకా పంటలు పెట్టలేదు. పైన ఉన్న "కొత్త పంటను అమ్మండి" బటన్ నొక్కండి.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center gap-3.5"
              >
                <img
                  src={item.images[0]}
                  alt={item.crop_name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm truncate">
                      {item.crop_name_te || item.crop_name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ₹{item.asking_price_per_unit}/kg
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    స్టాక్: {item.available_quantity.toLocaleString()} kg ({item.available_quantity / 50} బస్తాలు)
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={`/explore/${item.id}`}
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>బిడ్డింగ్ రూమ్ చూడండి</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PERSISTENT KISAN HELPLINE BAR */}
      <div className="bg-emerald-950 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
            📞
          </div>
          <div>
            <h4 className="font-black text-sm text-emerald-200">
              {language === "te" ? "రైతు సహాయ కేంద్రం (Kisan Sahayata Helpline)" : "Farmer Direct Assistance Helpline"}
            </h4>
            <p className="text-xs text-stone-300 mt-0.5">
              యాప్ వాడటం లేదా ఆర్డర్ల విషయంలో ఏ సందేహం ఉన్నా మాట్లాడండి • ఉచితం
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={helplineWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-subtle transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>వాట్సాప్‌లో సహాయం</span>
          </a>
          <a
            href="tel:18004251234"
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-white text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow-subtle hover:bg-stone-100 transition"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>1800-425-1234</span>
          </a>
        </div>
      </div>

      {/* QUICK SELL MODAL */}
      <KisanQuickSellModal
        isOpen={isQuickSellOpen}
        onClose={() => setIsQuickSellOpen(false)}
        onSuccess={(cropName) => {
          setSuccessToast(`మీ ${cropName} విజయవంతంగా మార్కెట్లో చేర్చబడింది!`);
        }}
      />

      {/* UPI QR MODAL */}
      {selectedUpiOrder && (
        <UpiQrModal
          order={selectedUpiOrder}
          isOpen={Boolean(selectedUpiOrder)}
          onClose={() => setSelectedUpiOrder(null)}
          onPaymentConfirmed={() => {
            setSuccessToast("చెల్లింపు రసీదు విజయవంతంగా ఖరారైంది!");
          }}
        />
      )}
    </div>
  );
};
