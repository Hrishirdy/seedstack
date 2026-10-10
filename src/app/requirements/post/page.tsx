"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { PlusCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";

function PostRequirementContent() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const [cropName, setCropName] = useState("Paddy (Sona Masoori)");
  const [variety, setVariety] = useState("BPT 5204 Grade");
  const [requiredQty, setRequiredQty] = useState<number>(1000);
  const [targetPrice, setTargetPrice] = useState<number>(28);
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("Hyderabad");
  const [destination, setDestination] = useState("Bowenpally Wholesale Mandi Yard, Secunderabad");
  const [dueDate, setDueDate] = useState("2026-10-25");
  const [notes, setNotes] = useState("Requires moisture below 14%. Direct farm gate pickup arranged.");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    demoStore.createRequirement({
      buyer_id: user.id,
      buyer_name: user.business_name || user.full_name,
      buyer_business_type: user.business_type || "Business Buyer",
      buyer_verified: user.verification_status === "approved",
      category_id: "cat-grains",
      crop_name: cropName,
      variety,
      required_quantity: requiredQty,
      unit: "kg",
      target_price_per_unit: targetPrice,
      state,
      district,
      delivery_destination: destination,
      required_delivery_date: dueDate,
      status: "open",
      notes,
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push("/requirements");
    }, 1200);
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Floating edge cross button for instant exit */}
      <CloseEdgeButton fixed fallbackUrl="/requirements" />

      <div className="flex items-center justify-between">
        <Link
          href="/requirements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requirements</span>
        </Link>
        <CloseEdgeButton fallbackUrl="/requirements" />
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card space-y-6 relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
              Post Sourcing Requirement
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Broadcast procurement demand to verified farmers across Telangana and Andhra Pradesh
            </p>
          </div>
          <CloseEdgeButton fallbackUrl="/requirements" />
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-lg text-emerald-950">
              Procurement Requirement Broadcasted!
            </h3>
            <p className="text-xs text-emerald-800">
              Producers can now view your requirement and send supply offers. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Variety
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
                  Required Quantity (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requiredQty}
                  onChange={(e) => setRequiredQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Budget / kg (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

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
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Warehouse / Delivery Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Required by Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Procurement Notes / Quality Specs
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-deep transition shadow-subtle flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Broadcast Requirement</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PostRequirementPage() {
  return (
    <RoleBarrierGuard allowedRole="buyer">
      <PostRequirementContent />
    </RoleBarrierGuard>
  );
}
