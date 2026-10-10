"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  Layers,
  Scale,
  Truck,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileText,
  MapPin,
} from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Marketplace Architecture Walkthrough
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-deep">
          How SEEDSTACK Works
        </h1>
        <p className="text-stone-600 text-base leading-relaxed">
          From farm gate to wholesale distribution: a transparent, disintermediated agricultural marketplace built for Telangana and Andhra Pradesh.
        </p>
      </div>

      {/* The Two Workflows Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workflow A */}
        <div className="bg-white rounded-3xl border border-brand-border p-8 shadow-card space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span>Workflow A</span>
            <span className="text-stone-400">•</span>
            <span>Farmer-to-Buyer</span>
          </div>

          <h2 className="text-2xl font-bold text-brand-deep">
            Farmer Lists Produce → Buyer Discovers & Negotiates
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Farmer Posts Produce</h4>
                <p className="text-stone-600 mt-0.5">
                  Farmer publishes crop name, grade, available quantity in kg, and asking price. Zero listing fee.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Buyer Browses & Offers</h4>
                <p className="text-stone-600 mt-0.5">
                  Supermarket or wholesaler discovers the crop and submits an offer or counterproposal.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Bilateral Agreement</h4>
                <p className="text-stone-600 mt-0.5">
                  Both sides agree on quantity, unit price, and collection window. Confirmed order is locked.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Logistics & Direct Settlement</h4>
                <p className="text-stone-600 mt-0.5">
                  SEEDSTACK coordinates farm-gate collection. Buyer pays farmer directly. Fixed quantity fee recorded.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow B */}
        <div className="bg-white rounded-3xl border border-brand-border p-8 shadow-card space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span>Workflow B</span>
            <span className="text-stone-400">•</span>
            <span>Buyer-to-Farmer</span>
          </div>

          <h2 className="text-2xl font-bold text-brand-deep">
            Buyer Broadcasts Demand → Farmers Submit Supply Offers
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Buyer Broadcasts Requirement</h4>
                <p className="text-stone-600 mt-0.5">
                  Buyer specifies required commodity, batch size (e.g. 2,000 kg), target price, and due date.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Farmers Review & Quote</h4>
                <p className="text-stone-600 mt-0.5">
                  Producers with matching harvests review specifications and respond with supply offers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Buyer Accepts Best Fit</h4>
                <p className="text-stone-600 mt-0.5">
                  Buyer compares producer quotes, negotiates terms, and confirms the contract terms.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-deep text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Delivery & Commission Ledger</h4>
                <p className="text-stone-600 mt-0.5">
                  Logistics vehicle collects harvest lot, weight is verified, and commission is calculated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Verification Pillars */}
      <div className="bg-brand-warmBg rounded-3xl border border-brand-border p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-bold text-brand-deep">
            Three Core Guarantees of the SEEDSTACK Protocol
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Engineered to eliminate predatory brokerage and arbitrary weight deductions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-deep flex items-center justify-center font-bold">
              <Coins className="w-5 h-5 text-brand-primary" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">Fulfilled Quantity Only</h4>
            <p className="text-stone-600 leading-relaxed">
              No percentage cuts on market price. Both parties pay a small fixed fee based on actual kilograms fulfilled at delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-deep flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-brand-primary" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">End-to-End Coordinated Logistics</h4>
            <p className="text-stone-600 leading-relaxed">
              SEEDSTACK coordinates farm-gate vehicle dispatch, temperature recording, and route navigation to eliminate transport hassles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-deep flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">Verified Land & Trade Credentials</h4>
            <p className="text-stone-600 leading-relaxed">
              All accounts undergo private document verification before entering active commercial trade, protecting both parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
