"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { demoStore } from "@/lib/store/demo-store";
import { CommissionTier } from "@/lib/types";
import {
  Coins,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Save,
  HelpCircle,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function AdminCommissionTiersPage() {
  const { t } = useLanguage();
  const [tiers, setTiers] = useState<CommissionTier[]>(demoStore.getTiers());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdateFee = (tierId: string, farmerFee: number, buyerFee: number) => {
    demoStore.updateTier(tierId, farmerFee, buyerFee);
    setTiers([...demoStore.getTiers()]);
  };

  const handleSaveAll = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
          Manage Quantity-Based Commission Tiers
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Configure the platform fee structure charged to farmers and buyers on actual fulfilled deliveries
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Commission tier updates successfully saved and active platform-wide!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2 text-brand-deep font-bold text-sm">
            <Coins className="w-5 h-5 text-brand-primary" />
            <span>Active Quantity-Based Fee Tiers</span>
          </div>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-deep transition shadow-subtle flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Tier Changes</span>
          </button>
        </div>

        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{tier.name}</h3>
                  <div className="text-xs text-stone-500">
                    Range: {tier.min_quantity_kg} kg to {tier.max_quantity_kg ? `${tier.max_quantity_kg} kg` : "Above"}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">
                      Farmer Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tier.farmer_fee_inr}
                      onChange={(e) =>
                        handleUpdateFee(tier.id, Number(e.target.value), tier.buyer_fee_inr)
                      }
                      className="w-24 px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-0.5">
                      Buyer Fee (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={tier.buyer_fee_inr}
                      onChange={(e) =>
                        handleUpdateFee(tier.id, tier.farmer_fee_inr, Number(e.target.value))
                      }
                      className="w-24 px-2.5 py-1.5 text-xs font-bold border border-stone-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="text-right pl-2">
                    <span className="block text-[10px] text-stone-400 uppercase">Total Fee</span>
                    <span className="text-sm font-extrabold text-brand-deep">
                      ₹{tier.farmer_fee_inr + tier.buyer_fee_inr}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-brand-light border border-emerald-200 text-xs text-stone-700 space-y-1">
          <div className="font-bold text-brand-deep flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span>Economic Commission Philosophy:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            SEEDSTACK charges small fixed fees rather than percentage markups. For example, a 100 kg lot of red chilli worth ₹20,000 incurs only ₹75 farmer fee (0.375% effective rate), protecting agrarian income against predatory commission agents.
          </p>
        </div>
      </div>
    </div>
  );
}
