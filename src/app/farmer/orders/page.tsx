"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { Order } from "@/lib/types";
import { UpiQrModal } from "@/components/payments/UpiQrModal";
import { InvoiceReceiptModal } from "@/components/payments/InvoiceReceiptModal";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  QrCode,
  Receipt,
  Share2,
  Scale,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { RoleBarrierGuard } from "@/components/auth/RoleBarrierGuard";
import { WeighbridgeSlipModal } from "@/components/orders/WeighbridgeSlipModal";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";

function FarmerOrdersContent() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  if (!user) return null;

  const [orders, setOrders] = useState<Order[]>(
    demoStore.getOrders().filter((o) => o.farmer_id === user.id)
  );
  const [selectedUpiOrder, setSelectedUpiOrder] = useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedWeighbridgeOrder, setSelectedWeighbridgeOrder] = useState<Order | null>(null);

  const handleConfirmPayment = (orderId: string) => {
    const updated = demoStore.updateOrderStatus(orderId, "completed");
    if (updated) {
      setOrders(demoStore.getOrders().filter((o) => o.farmer_id === user.id));
    }
  };

  const handleUpdateDelivery = (orderId: string, status: Order["status"]) => {
    const updated = demoStore.updateOrderStatus(orderId, status);
    if (updated) {
      setOrders(demoStore.getOrders().filter((o) => o.farmer_id === user.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative">
      <CloseEdgeButton fixed fallbackUrl="/farmer/dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/farmer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "te" ? "రైతు డ్యాష్‌బోర్డుకు తిరిగి వెళ్ళండి" : "Back to Farmer Dashboard"}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-deep">
            {language === "te" ? "రైతు ఆర్డర్లు & రవాణా వివరాలు" : "Farmer Orders & Fulfillment Management"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {language === "te"
              ? "కొనుగోలుదారుల ఒప్పందాలు, పొలం వద్ద సరుకు సేకరణ, లారీ ట్రాకింగ్ మరియు చెల్లింపు రశీదులు"
              : "Track buyer contracts, farm gate collections, delivery progress, and payment confirmations"}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-brand-border p-8">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800">No orders currently active</h3>
          <p className="text-xs text-stone-500 mt-1">
            When buyers place orders or accept counteroffers, they appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-brand-deep text-base">
                    {ord.order_number}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {ord.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  Confirmed: {new Date(ord.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Produce & Buyer Info */}
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <div className="text-stone-500 font-semibold uppercase text-[10px]">
                    Produce & Buyer
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{ord.crop_name}</div>
                  <div>Buyer: <span className="font-semibold">{ord.buyer_name}</span></div>
                  <div>Quantity: <span className="font-semibold">{ord.ordered_quantity} {ord.unit}</span></div>
                  <div>Agreed Price: <span className="font-semibold">₹{ord.unit_price} / kg</span></div>
                </div>

                {/* Logistics */}
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <div className="text-stone-500 font-semibold uppercase text-[10px]">
                    Logistics & Route
                  </div>
                  <div className="text-stone-700">Pickup: <span className="font-medium">{ord.pickup_address}</span></div>
                  <div className="text-stone-700">Destination: <span className="font-medium">{ord.delivery_address}</span></div>
                  {ord.delivery_id && (
                    <div className="pt-1">
                      <Link
                        href={`/tracking/${ord.delivery_id}`}
                        className="inline-flex items-center gap-1 font-bold text-brand-primary hover:underline"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live GPS Tracking Screen</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Financials & Commission */}
                <div className="p-3 bg-brand-warmBg rounded-xl space-y-1 border border-brand-border">
                  <div className="text-stone-500 font-semibold uppercase text-[10px]">
                    Settlement & Commission
                  </div>
                  <div className="text-base font-extrabold text-stone-900">
                    {formatINR(ord.total_order_value)}
                  </div>
                  <div className="text-stone-600">
                    Payment Method: <span className="font-semibold">{ord.payment_method}</span>
                  </div>
                  <div className="text-stone-600">
                    Payment Status:{" "}
                    <span
                      className={`font-bold ${
                        ord.payment_status === "confirmed"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {ord.payment_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-stone-200 text-stone-700">
                    Farmer Fee: <span className="font-bold text-brand-primary">₹{ord.farmer_commission}</span> ({ord.commission_tier_name})
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {ord.status === "confirmed" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateDelivery(ord.id, "picked_up")}
                      className="px-3 py-1.5 rounded-lg bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      {language === "te" ? "🚛 సరుకు లారీకి ఎక్కించాం" : "Mark Produce Picked Up by Truck"}
                    </button>
                  )}
                  {ord.status === "picked_up" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateDelivery(ord.id, "in_transit")}
                      className="px-3 py-1.5 rounded-lg bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      {language === "te" ? "🛣️ లారీ ప్రయాణంలో ఉంది" : "Update: In Transit on Highway"}
                    </button>
                  )}
                  {ord.status === "in_transit" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateDelivery(ord.id, "delivered")}
                      className="px-3 py-1.5 rounded-lg bg-brand-light text-brand-deep text-xs font-bold hover:bg-emerald-100 transition"
                    >
                      {language === "te" ? "🏢 సరుకు చేరింది" : "Mark Delivered at Buyer Warehouse"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUpiOrder(ord)}
                    className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{language === "te" ? "UPI క్యూఆర్ చెల్లింపు" : "UPI QR Pay"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition flex items-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{language === "te" ? "రశీదు పత్రం" : "Official Voucher"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedWeighbridgeOrder(ord)}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === "te" ? "ధర్మ కాంటా తూకం" : "Weighbridge Slip"}</span>
                  </button>

                  {ord.payment_status !== "confirmed" && (
                    <button
                      type="button"
                      onClick={() => handleConfirmPayment(ord.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-subtle"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === "te" ? "డబ్బులు అందాయి" : "Confirm Payment Received"}</span>
                    </button>
                  )}
                  {ord.payment_status === "confirmed" && (
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <Check className="w-4 h-4" />
                      <span>{language === "te" ? "ఖాతాలో జమ పూర్తయింది" : "Direct Payment Settled"}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUpiOrder && (
        <UpiQrModal
          order={selectedUpiOrder}
          isOpen={Boolean(selectedUpiOrder)}
          onClose={() => setSelectedUpiOrder(null)}
          onPaymentConfirmed={(updated) => {
            setOrders(demoStore.getOrders().filter((o) => o.farmer_id === user.id));
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

      {selectedWeighbridgeOrder && (
        <WeighbridgeSlipModal
          orderId={selectedWeighbridgeOrder.id}
          orderNumber={selectedWeighbridgeOrder.order_number}
          cropName={selectedWeighbridgeOrder.crop_name}
          agreedRatePerKg={selectedWeighbridgeOrder.unit_price}
          isOpen={Boolean(selectedWeighbridgeOrder)}
          onClose={() => setSelectedWeighbridgeOrder(null)}
          onSlipUpdated={(slip) => {
            setOrders(demoStore.getOrders().filter((o) => o.farmer_id === user.id));
          }}
        />
      )}
    </div>
  );
}

export default function FarmerOrdersPage() {
  return (
    <RoleBarrierGuard allowedRole="farmer">
      <FarmerOrdersContent />
    </RoleBarrierGuard>
  );
}
