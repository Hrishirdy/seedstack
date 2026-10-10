"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import {
  Building,
  Search,
  PlusCircle,
  Truck,
  Scale,
  ShieldCheck,
  Package,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { UpiQrModal } from "@/components/payments/UpiQrModal";
import { InvoiceReceiptModal } from "@/components/payments/InvoiceReceiptModal";
import { QrCode, Receipt } from "lucide-react";
import { Order } from "@/lib/types";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";

function BuyerDashboardContent() {
  const { t } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const buyerOrders = demoStore.getOrders().filter((o) => o.buyer_id === user.id);
  const requirements = demoStore.getRequirements().filter((r) => r.buyer_id === user.id);
  const activeNegotiations = demoStore.getNegotiations().filter((n) => n.buyer_id === user.id);

  const [orders, setOrders] = useState<Order[]>(buyerOrders);
  const [selectedUpiOrder, setSelectedUpiOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const totalProcurementSpend = orders
    .filter((o) => o.status === "completed" || o.status === "delivered")
    .reduce((acc, curr) => acc + curr.total_order_value, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-deep flex items-center justify-center font-bold text-xl">
            <Building className="w-7 h-7 text-brand-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-brand-deep">
                {user.business_name || user.full_name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Buyer</span>
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {user.business_type || "Wholesale Merchant"} • GST: {user.gst_number || "36AABCS1429B1Z8"} • {user.district}, {user.state}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/requirements/post"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.buyer.postRequirement}</span>
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition"
          >
            <Search className="w-4 h-4" />
            <span>Browse Lots</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Active Procurement Orders</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {buyerOrders.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Tracked in logistics</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Broadcast Requirements</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {requirements.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Open for producer offers
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Active Price Negotiations</div>
          <div className="text-2xl font-extrabold text-brand-deep mt-1">
            {activeNegotiations.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Counteroffers pending</div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle">
          <div className="text-xs text-stone-500 font-medium">Total Procurement Volume</div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">
            {formatINR(totalProcurementSpend)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Direct farmer contracts</div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-deep flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            <span>Procurement Orders & In-Transit Shipments</span>
          </h2>
          <Link
            href="/explore"
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>Source More Produce</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {buyerOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400">
            No procurement orders placed yet. Explore available produce lots to purchase directly.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {buyerOrders.map((ord) => (
              <div
                key={ord.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 text-sm">
                      {ord.crop_name}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {ord.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Producer: <span className="font-semibold text-stone-700">{ord.farmer_name}</span> • {ord.ordered_quantity} {ord.unit} @ ₹{ord.unit_price}/kg
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    Order Ref: {ord.order_number} • Buyer Fee: ₹{ord.buyer_commission} ({ord.commission_tier_name})
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-right mr-2">
                    <div className="text-sm font-bold text-stone-900">
                      {formatINR(ord.total_order_value)}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      Payment: {ord.payment_status}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiOrder(ord)}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pay Farmer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition flex items-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </button>

                  {ord.delivery_id && (
                    <Link
                      href={`/tracking/${ord.delivery_id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>GPS Track</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUpiOrder && (
        <UpiQrModal
          order={selectedUpiOrder}
          isOpen={Boolean(selectedUpiOrder)}
          onClose={() => setSelectedUpiOrder(null)}
          onPaymentConfirmed={() => {
            setOrders(demoStore.getOrders().filter((o) => o.buyer_id === user.id));
          }}
        />
      )}

      {selectedInvoiceOrder && (
        <InvoiceReceiptModal
          order={selectedInvoiceOrder}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <RoleBarrierGuard allowedRole="buyer">
      <BuyerDashboardContent />
    </RoleBarrierGuard>
  );
}
