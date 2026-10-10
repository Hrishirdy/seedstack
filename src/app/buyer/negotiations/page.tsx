"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { Negotiation } from "@/lib/types";
import { VoiceAssistantButton } from "@/components/ui/VoiceAssistantButton";
import {
  formatWhatsAppUrl,
  playNotificationChime,
} from "@/lib/notifications/notification-service";
import {
  Scale,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  Send,
  XCircle,
  Share2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";

function NegotiationsContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const [negotiations, setNegotiations] = useState<Negotiation[]>(demoStore.getNegotiations());
  const [selectedNegId, setSelectedNegId] = useState<string>(negotiations[0]?.id || "");

  const activeNeg = negotiations.find((n) => n.id === selectedNegId);

  // Counteroffer form state
  const [counterPrice, setCounterPrice] = useState<number>(
    activeNeg?.latest_offer_unit_price || 28
  );
  const [counterQty, setCounterQty] = useState<number>(
    activeNeg?.latest_offer_quantity || 500
  );
  const [counterNotes, setCounterNotes] = useState<string>("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNeg) return;

    const updated = demoStore.submitCounterOffer(
      activeNeg.id,
      user.id,
      counterQty,
      counterPrice,
      "Direct Farm Gate Pickup Terms",
      counterNotes
    );

    if (updated) {
      setNegotiations(demoStore.getNegotiations());
      setActionMsg("Counteroffer successfully submitted!");
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  const handleAcceptTerms = () => {
    if (!activeNeg) return;
    const order = demoStore.acceptOfferAndCreateOrder(activeNeg.id, user.id);
    if (order) {
      setNegotiations(demoStore.getNegotiations());
      setActionMsg(`Order ${order.order_number} confirmed! Proceed to tracking.`);
      setTimeout(() => setActionMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      <CloseEdgeButton fixed fallbackUrl="/buyer/dashboard" />
      <div>
        <Link
          href="/buyer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
          Two-Way Price & Quantity Negotiations
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Direct bilateral negotiations between farmers and commercial buyers with complete auditable history
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Negotiation Threads List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-stone-800 text-xs uppercase tracking-wider">
            Active Negotiation Threads
          </h3>
          <div className="space-y-2">
            {negotiations.map((neg) => {
              const isSelected = neg.id === selectedNegId;
              return (
                <button
                  key={neg.id}
                  onClick={() => {
                    setSelectedNegId(neg.id);
                    setCounterPrice(neg.latest_offer_unit_price);
                    setCounterQty(neg.latest_offer_quantity);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isSelected
                      ? "bg-brand-light border-brand-primary shadow-subtle"
                      : "bg-white border-brand-border hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-900 text-sm">
                      {neg.crop_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        neg.current_status === "agreed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {neg.current_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Farmer: {neg.farmer_name} • Buyer: {neg.buyer_name}
                  </div>
                  <div className="text-xs font-semibold text-brand-deep mt-2">
                    Current Offer: {neg.latest_offer_quantity} kg @ ₹{neg.latest_offer_unit_price}/kg
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Negotiation Thread Details & Action */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-6">
          {activeNeg ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-brand-deep">
                    {activeNeg.crop_name}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Negotiation ID: {activeNeg.id} • Initiated by {activeNeg.farmer_name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Latest Proposal</span>
                  <span className="text-lg font-extrabold text-brand-primary">
                    ₹{activeNeg.latest_offer_unit_price} / kg
                  </span>
                  <span className="text-xs text-stone-600 font-medium block">
                    ({activeNeg.latest_offer_quantity} kg lot)
                  </span>
                </div>
              </div>

              {/* Message History Timeline */}
              <div className="space-y-4">
                <h3 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                  <span>Proposals & Counteroffers History</span>
                </h3>

                <div className="space-y-3">
                  {activeNeg.messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                          isCurrentUser
                            ? "bg-brand-light/60 border-emerald-200 ml-6"
                            : "bg-stone-50 border-stone-200 mr-6"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-brand-deep">
                            {msg.sender_name} ({msg.sender_role})
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 text-sm">
                          Offered: {msg.offered_quantity} kg @ ₹{msg.offered_unit_price}/kg (Value: {formatINR(msg.offered_quantity * msg.offered_unit_price)})
                        </div>
                        {msg.delivery_terms && (
                          <div className="text-stone-600">Terms: {msg.delivery_terms}</div>
                        )}
                        {msg.notes && (
                          <div className="text-stone-500 italic">&ldquo;{msg.notes}&rdquo;</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Area */}
              {activeNeg.current_status === "in_progress" ? (
                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                        Submit Your Response
                      </span>
                      <a
                        href={formatWhatsAppUrl(
                          "+919848012345",
                          `🌾 SEEDSTACK Negotiation: Offer for ${activeNeg.crop_name} (${activeNeg.latest_offer_quantity}kg @ ₹${activeNeg.latest_offer_unit_price}/kg). Let's finalize!`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition shadow-subtle"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp Chat</span>
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleAcceptTerms}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-subtle"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Current Terms & Confirm Order</span>
                    </button>
                  </div>

                  <form onSubmit={handleSendCounter} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">Proposal Adjustments</span>
                      <VoiceAssistantButton
                        onTranscript={(text) => setCounterNotes(text)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Counter Quantity (kg)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={counterQty}
                          onChange={(e) => setCounterQty(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-bold border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Counter Price / kg (₹)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-bold border border-stone-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Counter Note / Negotiation Rationale
                      </label>
                      <input
                        type="text"
                        value={counterNotes}
                        onChange={(e) => setCounterNotes(e.target.value)}
                        placeholder="e.g. Can purchase immediately if price is ₹28/kg"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition flex items-center gap-1.5 shadow-subtle"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Counterproposal</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
                  <span>Terms agreed and locked. Confirmed order has been generated!</span>
                  <Link
                    href="/buyer/dashboard"
                    className="underline text-emerald-800"
                  >
                    View in Dashboard
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center text-xs text-stone-400">
              No active negotiation selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NegotiationsPage() {
  return (
    <RoleBarrierGuard allowedRole="buyer">
      <NegotiationsContent />
    </RoleBarrierGuard>
  );
}
