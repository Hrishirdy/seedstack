"use client";

import React, { useState } from "react";
import { ProduceBid, CropListing } from "@/lib/types";
import { useAuth } from "@/lib/auth/auth-context";
import { useLanguage } from "@/lib/i18n/context";
import { demoStore } from "@/lib/store/demo-store";
import { VoiceAssistantButton } from "../ui/VoiceAssistantButton";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import {
  Gavel,
  TrendingUp,
  Clock,
  CheckCircle2,
  Share2,
  User,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

interface BiddingEngineProps {
  listing: CropListing;
  onOrderCreated?: (orderId: string) => void;
}

export const BiddingEngine: React.FC<BiddingEngineProps> = ({
  listing,
  onOrderCreated,
}) => {
  const { user, isFarmer, isBuyer } = useAuth();
  const { language } = useLanguage();
  const [bids, setBids] = useState<ProduceBid[]>(() =>
    demoStore.getBidsForListing(listing.id)
  );

  const highestBid = bids.length > 0 ? bids[0] : null;
  const startingPrice = listing.asking_price_per_unit;
  const currentLeaderPrice = highestBid
    ? highestBid.bid_amount_per_kg
    : startingPrice;

  const [bidAmount, setBidAmount] = useState<number>(
    Math.round(currentLeaderPrice + 1)
  );
  const [bidQuantity, setBidQuantity] = useState<number>(
    Math.min(listing.available_quantity, 1000)
  );
  const [bidNote, setBidNote] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const isFarmerOwner = user ? user.id === listing.farmer_id : false;

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(
        language === "te"
          ? "బిడ్ వేయడానికి దయచేసి కొనుగోలుదారుగా లాగిన్ అవ్వండి."
          : "Please sign in as a verified commercial buyer to place bids."
      );
      return;
    }

    if (isFarmer) {
      alert(
        language === "te"
          ? "రైతులు బిడ్లు దాఖలు చేయలేరు. బిడ్డింగ్ వాణిజ్య వ్యాపారులకు మాత్రమే."
          : "Farmers cannot place purchase bids. Bidding is reserved for verified commercial buyers."
      );
      return;
    }

    if (bidAmount <= (highestBid ? highestBid.bid_amount_per_kg : 0)) {
      alert(
        language === "te"
          ? "బిడ్ మొత్తం ప్రస్తుత అత్యధిక బిడ్ కంటే ఎక్కువగా ఉండాలి."
          : "Bid amount must exceed the current highest bid."
      );
      return;
    }

    try {
      const newBid = demoStore.placeBid(
        listing.id,
        user,
        bidAmount,
        bidQuantity,
        bidNote || undefined
      );
      setBids(demoStore.getBidsForListing(listing.id));
      setSuccessMsg(
        language === "te"
          ? `₹${bidAmount}/కేజీ తో మీ బిడ్ విజయవంతంగా నమోదైంది!`
          : `Your bid of ₹${bidAmount}/kg was successfully placed!`
      );
      setBidAmount(bidAmount + 1);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to place bid");
    }
  };

  const handleAcceptBid = (bidId: string) => {
    if (
      !confirm(
        language === "te"
          ? "ఈ బిడ్‌ను ఆమోదించి ఆర్డర్‌ను ఖరారు చేయాలనుకుంటున్నారా?"
          : "Accept this bid and confirm the order?"
      )
    )
      return;

    try {
      const order = demoStore.acceptBid(bidId);
      setBids(demoStore.getBidsForListing(listing.id));
      alert(
        language === "te"
          ? `ఆర్డర్ #${order.order_number} విజయవంతంగా ఖరారైంది!`
          : `Order #${order.order_number} confirmed successfully!`
      );
      if (onOrderCreated) {
        onOrderCreated(order.id);
      }
    } catch (err: any) {
      alert(err.message || "Failed to accept bid");
    }
  };

  const shareText =
    language === "te"
      ? `🌾 *SEEDSTACK లైవ్ బిడ్డింగ్*\nపంట: *${listing.crop_name}*\nపరిమాణం: ${listing.available_quantity} ${listing.unit}\nప్రారంభ ధర: ₹${listing.asking_price_per_unit}/kg\nఅత్యధిక బిడ్: ₹${currentLeaderPrice}/kg\nబిడ్ వేయడానికి క్లిక్ చేయండి: https://seedstack.agritech/explore/${listing.id}`
      : `🌾 *SEEDSTACK LIVE BIDDING*\nProduce: *${listing.crop_name}*\nQuantity: ${listing.available_quantity} ${listing.unit}\nAsking Price: ₹${listing.asking_price_per_unit}/kg\nCurrent Lead Bid: ₹${currentLeaderPrice}/kg\nPlace your bid here: https://seedstack.agritech/explore/${listing.id}`;

  const whatsappShareUrl = formatWhatsAppUrl(
    listing.farmer_phone || "+919848012345",
    shareText
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 shadow-elevated">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-subtle">
            <Gavel className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900">
                {language === "te" ? "లైవ్ మల్టీ-పార్టీ బిడ్డింగ్ రూమ్" : "Live Produce Bidding Room"}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                ● LIVE
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {language === "te"
                ? "ధరల పోటీతో రైతులకు గరిష్ట రాబడి"
                : "Transparent price competition directly benefiting farmers"}
            </p>
          </div>
        </div>

        {/* WhatsApp Share Button for Farmer */}
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-subtle"
        >
          <Share2 className="w-4 h-4" />
          <span>{language === "te" ? "వాట్సాప్‌లో షేర్ చేయండి" : "Share on WhatsApp"}</span>
        </a>
      </div>

      {/* Highest Bid Callout Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            {language === "te" ? "రైతు కోరిన ధర" : "Base Asking Price"}
          </span>
          <div className="text-xl font-bold text-stone-800">
            ₹{startingPrice}
            <span className="text-xs font-normal text-stone-500"> / kg</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            {language === "te" ? "ప్రస్తుత అత్యధిక బిడ్" : "Current Highest Bid"}
          </span>
          <div className="text-2xl font-black text-emerald-700 flex items-center gap-1.5">
            <TrendingUp className="w-6 h-6" />
            ₹{currentLeaderPrice}
            <span className="text-xs font-medium text-stone-500"> / kg</span>
          </div>
          {highestBid && (
            <p className="text-[11px] text-emerald-900 font-medium truncate">
              {highestBid.bidder_name} ({highestBid.quantity_kg} kg)
            </p>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            {language === "te" ? "మొత్తం బిడ్లు" : "Total Active Bids"}
          </span>
          <div className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <span>{bids.length}</span>
            <span className="text-xs font-normal text-stone-500">
              ({bids.filter((b) => b.status === "active").length} active)
            </span>
          </div>
          <p className="text-[11px] text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Auction open for 24h</span>
          </p>
        </div>
      </div>

      {/* Success notification banner */}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role-Segregated Bidding Controls */}
      {isFarmerOwner ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h4 className="text-sm font-bold text-emerald-950">
              {language === "te" ? "మీ పంటపై వచ్చిన వ్యాపారుల బిడ్‌లు" : "Incoming Buyer Bids for Your Crop"}
            </h4>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {language === "te"
              ? "వాణిజ్య వ్యాపారులు మీ పంట కోసం సమర్పించిన బిడ్‌లు కింద కనిపిస్తాయి. మీకు నచ్చిన ధరను 'ఆమోదించు' పై క్లిక్ చేసి వెంటనే అమ్మకాన్ని ఖరారు చేయండి."
              : "Commercial buyers are competing for your produce below. Click 'Accept' next to your preferred bid to immediately confirm the sale."}
          </p>
        </div>
      ) : isFarmer ? (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 text-stone-700">
          <p className="text-xs leading-relaxed">
            {language === "te"
              ? "🌾 మీరు రైతు ఖాతాలో ఉన్నారు. బిడ్డింగ్ వాణిజ్య కొనుగోలుదారుల కోసం మాత్రమే. మీ స్వంత పంటను అమ్మడానికి 'పంటను అమ్మండి'ని ఉపయోగించండి."
              : "🌾 You are signed in as a farmer. Bidding is reserved for commercial buyers. To sell your produce, use 'Sell Crop'."}
          </p>
        </div>
      ) : (
        /* Bidding Form for Commercial Buyers */
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-6">
          <h4 className="text-sm font-bold text-stone-800 mb-3 flex items-center justify-between">
            <span>{language === "te" ? "కొత్త బిడ్ వేయండి (వ్యాపారుల కోసం)" : "Place a Competing Bid (Commercial Buyers)"}</span>
            <VoiceAssistantButton
              onTranscript={(text) => {
                const numMatch = text.match(/\d+(\.\d+)?/);
                if (numMatch) {
                  setBidAmount(parseFloat(numMatch[0]));
                }
              }}
            />
          </h4>

          <form onSubmit={handlePlaceBid} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === "te" ? "బిడ్ ధర (₹ / కేజీ)" : "Bid Price (₹ / kg)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    min={currentLeaderPrice + 0.5}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 text-base font-bold rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Quick increment buttons */}
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 5].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setBidAmount(Math.round(currentLeaderPrice + inc))}
                      className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition"
                    >
                      +₹{inc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === "te" ? "పరిమాణం (కేజీలు)" : "Quantity (kg)"}
                </label>
                <input
                  type="number"
                  min={10}
                  max={listing.available_quantity}
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-bold rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
                <span className="block text-[11px] text-stone-500 mt-1">
                  Max available: {listing.available_quantity} kg
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === "te" ? "గమనిక / షరతులు (ఐచ్ఛికం)" : "Note or Delivery Terms (Optional)"}
              </label>
              <input
                type="text"
                placeholder={
                  language === "te"
                    ? "ఉదా: రేపు ఉదయం లారీ పంపుతాము..."
                    : "e.g., Farm gate collection with direct UPI payment..."
                }
                value={bidNote}
                onChange={(e) => setBidNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 shadow-subtle transition"
              >
                <Send className="w-4 h-4" />
                <span>
                  {language === "te"
                    ? `₹${bidAmount}/కేజీ తో బిడ్ సమర్పించండి`
                    : `Submit Bid (₹${bidAmount}/kg)`}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Bids History */}
      <div>
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          {language === "te" ? "బిడ్ల చరిత్ర (అత్యధికం నుండి తక్కువ వరకు)" : "Recent Bids History"}
        </h4>

        {bids.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-3 text-center bg-stone-50 rounded-lg">
            {language === "te" ? "ఇంకా బిడ్లు రాలేదు. మొదటి బిడ్ వేయండి!" : "No bids yet. Be the first to place a bid!"}
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {bids.map((bid, index) => {
              const isLead = index === 0 && bid.status === "active";
              return (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition ${
                    isLead
                      ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isLead
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{bid.bidder_name}</span>
                        {bid.bidder_role === "wholesaler" && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                            Wholesaler
                          </span>
                        )}
                        {bid.bidder_role === "supermarket" && (
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-semibold">
                            Supermarket
                          </span>
                        )}
                        {isLead && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                            LEADER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        {bid.quantity_kg} kg • {new Date(bid.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {bid.note && ` • "${bid.note}"`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-base font-extrabold text-stone-900">
                        ₹{bid.bid_amount_per_kg}
                        <span className="text-xs font-normal text-stone-500">/kg</span>
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        Total: ₹{(bid.bid_amount_per_kg * bid.quantity_kg).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Farmer Action to Accept Bid */}
                    {isFarmerOwner && bid.status === "active" && (
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-subtle"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === "te" ? "ఆమోదించు" : "Accept"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
