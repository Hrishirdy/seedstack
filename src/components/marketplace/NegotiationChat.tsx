"use client";

import React, { useState } from "react";
import { Negotiation, UserProfile } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { VoiceAssistantButton } from "../ui/VoiceAssistantButton";
import { formatWhatsAppUrl, playNotificationChime } from "@/lib/notifications/notification-service";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Share2,
  TrendingUp,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface NegotiationChatProps {
  negotiation: Negotiation;
  onUpdate?: () => void;
  onOrderConfirmed?: (orderId: string) => void;
}

export const NegotiationChat: React.FC<NegotiationChatProps> = ({
  negotiation,
  onUpdate,
  onOrderConfirmed,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [counterPrice, setCounterPrice] = useState<number>(
    negotiation.latest_offer_unit_price
  );
  const [counterQty, setCounterQty] = useState<number>(
    negotiation.latest_offer_quantity
  );
  const [chatMessage, setChatMessage] = useState<string>("");

  const otherPartyName =
    user?.role === "farmer" ? negotiation.buyer_name : negotiation.farmer_name;

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit counteroffers.");
      return;
    }
    try {
      demoStore.submitCounterOffer(
        negotiation.id,
        user.id,
        counterQty,
        counterPrice,
        "Direct Farm Gate Pickup Terms",
        chatMessage || undefined
      );
      playNotificationChime();
      setChatMessage("");
      if (onUpdate) onUpdate();
    } catch (err: any) {
      alert(err.message || "Failed to submit counteroffer");
    }
  };

  const handleAccept = () => {
    if (!user) {
      alert("Please sign in to accept offers.");
      return;
    }
    if (
      !confirm(
        language === "te"
          ? "ఈ ఆఫర్ నిబంధనలను ఆమోదించి ఆర్డర్‌ను ఖరారు చేయాలనుకుంటున్నారా?"
          : "Accept this offer and confirm the order?"
      )
    )
      return;

    try {
      const order = demoStore.acceptOfferAndCreateOrder(
        negotiation.id,
        user.id
      );
      if (order) {
        playNotificationChime();
        alert(
          language === "te"
            ? `ఆర్డర్ #${order.order_number} విజయవంతంగా ఖరారైంది!`
            : `Order #${order.order_number} confirmed!`
        );
        if (onOrderConfirmed) onOrderConfirmed(order.id);
        if (onUpdate) onUpdate();
      }
    } catch (err: any) {
      alert(err.message || "Failed to accept offer");
    }
  };

  const whatsappChatText = `🌾 *SEEDSTACK NEGOTIATION*\nCrop: *${negotiation.crop_name}*\nLatest Offer: ₹${negotiation.latest_offer_unit_price}/kg for ${negotiation.latest_offer_quantity}kg.\nLet's finalize terms!`;
  const whatsappUrl = formatWhatsAppUrl("+919848012345", whatsappChatText);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span>{negotiation.crop_name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700 font-medium">
                {negotiation.current_status.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-emerald-200">
              {language === "te" ? "చర్చా భాగస్వామి: " : "Negotiating with: "}
              <span className="font-semibold text-white">{otherPartyName}</span>
            </p>
          </div>
        </div>

        {/* 1-Click WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-subtle"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp Chat</span>
        </a>
      </div>

      {/* Messages Feed */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3 bg-stone-50/50">
        {negotiation.messages.map((msg) => {
          const isMe = user ? msg.sender_id === user.id : false;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-md p-3 rounded-2xl text-xs shadow-subtle ${
                  isMe
                    ? "bg-emerald-800 text-white rounded-br-xs"
                    : "bg-white text-stone-900 border border-stone-200 rounded-bl-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1 border-b border-white/20 pb-1">
                  <span className="font-bold">{msg.sender_name}</span>
                  <span className="text-[10px] opacity-75">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Offer Metric Card */}
                <div
                  className={`my-1 p-2 rounded-xl text-center font-bold ${
                    isMe ? "bg-emerald-950/40" : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  }`}
                >
                  <span className="text-base font-black">
                    ₹{msg.offered_unit_price} / kg
                  </span>
                  <span className="block text-[11px] opacity-90 font-normal">
                    {msg.offered_quantity} kg (Total: ₹{(msg.offered_unit_price * msg.offered_quantity).toLocaleString("en-IN")})
                  </span>
                </div>

                {msg.notes && <p className="mt-1 italic leading-relaxed">"{msg.notes}"</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Accept & Action Bar */}
      {negotiation.current_status === "in_progress" && (
        <div className="p-4 border-t border-stone-200 bg-white space-y-3">
          <div className="flex items-center justify-between gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                {language === "te" ? "ప్రస్తుత ఆఫర్ ధర" : "Current Agreed Rate"}
              </span>
              <span className="text-lg font-black text-stone-900">
                ₹{negotiation.latest_offer_unit_price}/kg • {negotiation.latest_offer_quantity}kg
              </span>
            </div>

            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-subtle transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === "te" ? "ఈ ధరను ఆమోదించు" : "Accept Offer"}</span>
            </button>
          </div>

          {/* Counteroffer Form */}
          <form onSubmit={handleSendCounter} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">
                {language === "te" ? "కౌంటర్ ఆఫర్ పంపండి" : "Submit Counter Proposal"}
              </span>
              <VoiceAssistantButton
                onTranscript={(text) => {
                  setChatMessage(text);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                  Price (₹/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-stone-500 block mb-0.5">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={counterQty}
                  onChange={(e) => setCounterQty(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-stone-300"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={
                  language === "te"
                    ? "సందేశం లేదా షరతులు రాయండి..."
                    : "Add message or delivery requirement..."
                }
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300"
              />

              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === "te" ? "పంపు" : "Counter"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
