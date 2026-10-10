"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { KisanSimpleView } from "@/components/farmer/KisanSimpleView";
import {
  Sprout,
  PlusCircle,
  Package,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Truck,
  Coins,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";
import { formatINR } from "@/lib/utils";

function FarmerDashboardContent() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [isKisanMode, setIsKisanMode] = useState(true);

  if (!user) return null;

  const listings = demoStore.getListings().filter((l) => l.farmer_id === user.id);
  const orders = demoStore.getOrders().filter((o) => o.farmer_id === user.id);

  const activeListingsCount = listings.filter((l) => l.status === "active").length;
  const pendingOrders = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const totalSales = orders
    .filter((o) => o.status === "completed" || o.status === "delivered")
    .reduce((acc, curr) => acc + curr.total_order_value, 0);

  const commissionPayable = orders
    .filter((o) => o.status === "completed")
    .reduce((acc, curr) => acc + curr.farmer_commission, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* View Switcher: Kisan Simple Mode (Default) vs Advanced Analytics */}
      <div className="bg-white rounded-2xl border border-brand-border p-3 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {language === "te" ? "మోడ్ ఎంపిక:" : "View Mode:"}
          </span>
          <div className="inline-flex rounded-xl p-1 bg-stone-100 border border-stone-200">
            <button
              onClick={() => setIsKisanMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                isKisanMode
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <span>🌾</span>
              <span>{language === "te" ? "రైతు సులభ మోడ్ (సిఫార్సు)" : "Kisan Simple Mode (Recommended)"}</span>
            </button>
            <button
              onClick={() => setIsKisanMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                !isKisanMode
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{language === "te" ? "పూర్తి విశ్లేషణ పట్టిక" : "Full Analytics"}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-stone-600 font-medium">
            {language === "te" ? "వ్యవసాయ మార్కెట్ ప్రత్యక్ష ప్రసారం" : "Live Agri Market Active"}
          </span>
        </div>
      </div>

      {/* Render Kisan Simple Mode if active, else render the advanced analytics view */}
      {isKisanMode ? (
        <KisanSimpleView />
      ) : (
        <div className="space-y-8">
      {/* Top Banner / Verification status */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-deep flex items-center justify-center font-bold text-xl">
            {user.full_name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-deep">
                {user.full_name}
              </h1>
              {user.verification_status === "approved" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Producer</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verification Pending</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {user.mandal_or_village}, {user.district}, {user.state} • {user.land_size_acres || 5} Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/farmer/sell"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.farmer.createNewListing}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Active Produce Lots</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {activeListingsCount}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Ready for buyer offers</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Active / In-Transit Orders</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Logistics coordinated
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Fulfilled Sales Value</div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">
            {formatINR(totalSales)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Direct buyer settlements</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Fulfilled Commission Fee</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {formatINR(commissionPayable)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Quantity tier basis only</div>
        </div>
      </div>

      {/* Active Orders & Shipments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-deep flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-primary" />
              <span>Recent Farmer Orders & Negotiations</span>
            </h2>
            <Link
              href="/farmer/orders"
              className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-10 text-center text-xs text-stone-400">
              No orders received yet. Make sure your produce is listed!
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {ord.crop_name}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      Buyer: <span className="font-medium text-stone-700">{ord.buyer_name}</span> • {ord.ordered_quantity} {ord.unit} @ ₹{ord.unit_price}/kg
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Order: {ord.order_number} • Fee: ₹{ord.farmer_commission} ({ord.commission_tier_name})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-stone-900">
                        {formatINR(ord.total_order_value)}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Payment: {ord.payment_status}
                      </div>
                    </div>
                    {ord.delivery_id && (
                      <Link
                        href={`/tracking/${ord.delivery_id}`}
                        className="px-3 py-1.5 rounded-lg bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links & Mandi Price Watch */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-deep flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              <span>Today&apos;s Mandi Price Benchmarks</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Sona Masoori Paddy</div>
                  <div className="text-[11px] text-stone-500">Suryapet / Miryalaguda</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-800 text-sm">₹28.50/kg</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Steady (+1.2%)</div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Teja Red Chilli</div>
                  <div className="text-[11px] text-stone-500">Guntur Mirchi Yard</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-800 text-sm">₹195.00/kg</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Strong export demand</div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Nizamabad Turmeric</div>
                  <div className="text-[11px] text-stone-500">Armoor Mandi</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-800 text-sm">₹142.00/kg</div>
                  <div className="text-[10px] text-stone-500 font-medium">Curcumin &gt;4.2%</div>
                </div>
              </div>
            </div>

            <Link
              href="/ai-insights"
              className="w-full py-2 rounded-xl bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition block text-center"
            >
              <span>View Full AI Price Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-brand-warmBg border border-brand-border space-y-2 text-xs">
            <div className="font-bold text-brand-deep flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-brand-primary" />
              <span>Zero Listing Fee Guarantee</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              SEEDSTACK never charges a fee to post your crops. A small quantity tier charge applies only when produce is delivered and payment is confirmed.
            </p>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <RoleBarrierGuard allowedRole="farmer">
      <FarmerDashboardContent />
    </RoleBarrierGuard>
  );
}
