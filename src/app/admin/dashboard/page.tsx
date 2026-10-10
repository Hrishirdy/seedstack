"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import {
  ShieldCheck,
  Users,
  Package,
  Coins,
  Truck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Download,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";

function AdminDashboardContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const allUsers = demoStore.getAllUsers();
  const allOrders = demoStore.getOrders();
  const allListings = demoStore.getListings();
  const verifications = demoStore.getVerifications();
  const pendingVerifs = verifications.filter((v) => v.status === "pending_verification");

  const totalGMV = allOrders.reduce((sum, o) => sum + o.total_order_value, 0);
  const totalCommission = allOrders.reduce(
    (sum, o) => sum + o.farmer_commission + o.buyer_commission,
    0
  );

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["OrderNumber,Crop,Farmer,Buyer,QuantityKg,UnitPrice,TotalValue,FarmerFee,BuyerFee,Status"]
        .concat(
          allOrders.map(
            (o) =>
              `${o.order_number},${o.crop_name},${o.farmer_name},${o.buyer_name},${o.ordered_quantity},${o.unit_price},${o.total_order_value},${o.farmer_commission},${o.buyer_commission},${o.status}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seedstack_orders_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administration & Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-deep">
            SEEDSTACK Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Regional operations oversight for Telangana and Andhra Pradesh agricultural trade
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-stone-800 text-xs font-bold hover:bg-stone-50 transition shadow-subtle"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            <span>Export CSV Audit</span>
          </button>
          <Link
            href="/admin/commissions"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 transition"
          >
            <Sliders className="w-4 h-4" />
            <span>Fee Tiers Configuration</span>
          </Link>
          <Link
            href="/admin/verification"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle"
          >
            <FileText className="w-4 h-4" />
            <span>ID Verification Queue ({pendingVerifs.length})</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Registered Participants</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {allUsers.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Farmers & Business Buyers</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Pending Verifications</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {pendingVerifs.length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            Requires Land/ID review
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Recorded Trade Value (GMV)</div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">
            {formatINR(totalGMV)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Direct settlement records</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Platform Commissions Logged</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {formatINR(totalCommission)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Fulfilled kg tier calculations</div>
        </div>
      </div>

      {/* Main Table: Platform Orders Audit */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-deep flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            <span>Master Platform Orders & Ledger Audit</span>
          </h2>
          <span className="text-xs text-stone-500">
            Total {allOrders.length} transactions recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Order Ref</th>
                <th className="pb-3 font-semibold">Produce & Batch</th>
                <th className="pb-3 font-semibold">Farmer (Seller)</th>
                <th className="pb-3 font-semibold">Buyer</th>
                <th className="pb-3 font-semibold text-right">Value</th>
                <th className="pb-3 font-semibold text-right">Commission (F+B)</th>
                <th className="pb-3 font-semibold text-center">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {allOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 font-mono font-bold text-stone-900">{ord.order_number}</td>
                  <td className="py-3">
                    <div className="font-semibold text-stone-900">{ord.crop_name}</div>
                    <div className="text-[10px] text-stone-500">
                      {ord.ordered_quantity} {ord.unit} @ ₹{ord.unit_price}/kg
                    </div>
                  </td>
                  <td className="py-3 font-medium text-stone-800">{ord.farmer_name}</td>
                  <td className="py-3 font-medium text-stone-800">{ord.buyer_name}</td>
                  <td className="py-3 text-right font-bold text-stone-900">
                    {formatINR(ord.total_order_value)}
                  </td>
                  <td className="py-3 text-right font-semibold text-brand-deep">
                    ₹{ord.farmer_commission + ord.buyer_commission}
                  </td>
                  <td className="py-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {ord.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {ord.delivery_id && (
                      <Link
                        href={`/tracking/${ord.delivery_id}`}
                        className="px-2.5 py-1 rounded bg-brand-light text-brand-deep font-bold hover:bg-emerald-100 inline-block text-[11px]"
                      >
                        Track
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RoleBarrierGuard allowedRole="admin">
      <AdminDashboardContent />
    </RoleBarrierGuard>
  );
}
