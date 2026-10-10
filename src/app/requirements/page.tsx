"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { BuyerRequirement } from "@/lib/types";
import { NegotiationModal } from "@/components/marketplace/NegotiationModal";
import {
  PlusCircle,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  Sprout,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function RequirementsDiscoveryPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, isFarmer, isBuyer } = useAuth();
  const requirements = demoStore.getRequirements();

  const [selectedReq, setSelectedReq] = useState<BuyerRequirement | null>(null);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workflow B: Buyer-to-Farmer Procurement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-deep">
            {isFarmer
              ? language === "te"
                ? "కొనుగోలుదారుల డిమాండ్లు (రైతు సరఫరా బోర్డు)"
                : "Buyer Demands (Farmer Supply Board)"
              : t.buyer.postRequirement}
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            {isFarmer
              ? language === "te"
                ? "ధృవీకరించబడిన వ్యాపారులు కోరుతున్న వ్యవసాయ ఉత్పత్తులను పరిశీలించి మీ పంటను సరఫరా చేయండి"
                : "Supermarkets and wholesalers seeking farm-gate harvest lots. Submit supply offers directly from your farm."
              : "Supermarkets, wholesalers, and processors actively seeking agricultural lots in Telangana & AP"}
          </p>
        </div>

        {isFarmer ? (
          <Link
            href="/farmer/sell"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm hover:bg-emerald-800 transition shadow-subtle shrink-0"
          >
            <Sprout className="w-4 h-4" />
            <span>{language === "te" ? "🌾 మీ పంటను అమ్మండి" : "🌾 List Your Crop"}</span>
          </Link>
        ) : (
          <Link
            href="/requirements/post"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-700 text-white font-bold text-sm hover:bg-sky-800 transition shadow-subtle shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === "te" ? "కొత్త కొనుగోలు అవసరాన్ని పోస్ట్ చేయండి" : "Post Procurement Requirement"}</span>
          </Link>
        )}
      </div>

      {successOrder && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold">
          Order {successOrder} confirmed! Check your farmer dashboard to view logistics and delivery coordination.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle hover:shadow-elevated transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {req.status.toUpperCase()}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Needed by {req.required_delivery_date}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-stone-900">{req.crop_name}</h3>
                <p className="text-xs text-stone-500">{req.variety || "Standard commercial variety"}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs border border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">Required Quantity:</span>
                  <span className="font-bold text-stone-900">
                    {req.required_quantity.toLocaleString()} {req.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Budget / kg:</span>
                  <span className="font-bold text-emerald-800">
                    ₹{req.target_price_per_unit || "Open to Offer"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Destination:</span>
                  <span className="font-medium text-stone-800 truncate max-w-[180px]">
                    {req.district}, {req.state}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Building className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium truncate">{req.buyer_name}</span>
                {req.buyer_verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </div>

              {req.notes && (
                <p className="text-[11px] text-stone-500 italic bg-stone-50/50 p-2 rounded">
                  &ldquo;{req.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100">
              {isBuyer ? (
                req.buyer_id === user?.id ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                      {language === "te" ? "💼 మీ అవసరం (సక్రియం)" : "💼 Your Post (Active)"}
                    </span>
                    <Link
                      href="/buyer/negotiations"
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 underline"
                    >
                      {language === "te" ? "రైతు ఆఫర్లు చూడండి" : "View Farmer Offers"}
                    </Link>
                  </div>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 text-center font-medium">
                    {language === "te"
                      ? "🏢 ఇతర వ్యాపారి డిమాండ్ (రైతులు మాత్రమే సరఫరా చేయగలరు)"
                      : "🏢 Trader Requirement (Fulfillable by Farmers)"}
                  </div>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      router.push(
                        `/auth/login?role=farmer&redirect=${encodeURIComponent(
                          "/requirements"
                        )}`
                      );
                      return;
                    }
                    setSelectedReq(req);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-light text-brand-deep font-bold text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-4 h-4" />
                  <span>
                    {language === "te"
                      ? "రైతు సరఫరా ఆఫర్ పంపండి"
                      : "Submit Supply Offer to Buyer"}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedReq && (
        <NegotiationModal
          requirement={selectedReq}
          isOpen={Boolean(selectedReq)}
          onClose={() => setSelectedReq(null)}
          onSuccess={(ord) => {
            setSelectedReq(null);
            setSuccessOrder(ord);
          }}
        />
      )}
    </div>
  );
}
