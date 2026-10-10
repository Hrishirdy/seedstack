"use client";

import React, { useState } from "react";
import { Order } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { demoStore } from "@/lib/store/demo-store";
import {
  buildOrderUpiDetails,
  getUpiQrCodeUrl,
} from "@/lib/payments/upi-generator";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import {
  QrCode,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Smartphone,
  Receipt,
} from "lucide-react";

interface UpiQrModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirmed: (order: Order) => void;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentConfirmed,
}) => {
  const { language } = useLanguage();
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const upiDetails = buildOrderUpiDetails(order);
  const qrUrl = getUpiQrCodeUrl(upiDetails.upi_uri, 280);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(upiDetails.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2500);
  };

  const handleConfirmPayment = () => {
    setIsConfirming(true);
    try {
      const updated = demoStore.confirmOrderPayment(
        order.id,
        `UPI/UTR-${Date.now().toString().slice(-8)}`
      );
      if (updated) {
        onPaymentConfirmed(updated);
      }
    } finally {
      setIsConfirming(false);
      onClose();
    }
  };

  const farmerWhatsappMsg = `🌾 *SEEDSTACK PAYMENT CONFIRMATION*\nఆర్డర్ #${order.order_number} కొరకు ₹${order.total_order_value.toLocaleString(
    'en-IN'
  )} చెల్లింపు రసీదు ఖరారైంది.\nపంట: ${order.crop_name} (${order.ordered_quantity} kg)\nధన్యవాదాలు!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === "te" ? "నేరుగా UPI ద్వారా చెల్లింపు" : "Direct UPI QR Settlement"}
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                {language === "te"
                  ? "రైతు ఖాతాకు నేరుగా 0% బ్యాంక్ ఛార్జీలతో బదిలీ"
                  : "Direct to Farmer • Zero Middleman Deductions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Badge */}
          <div className="text-center mb-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
              {language === "te" ? "మొత్తం చెల్లించాల్సిన సొమ్ము" : "Total Produce Value"}
            </span>
            <div className="text-3xl font-black text-stone-900 tracking-tight">
              ₹{order.total_order_value.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {order.ordered_quantity} kg {order.crop_name} @ ₹{order.unit_price}/kg
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="p-3 bg-white rounded-2xl border-2 border-emerald-600/30 shadow-subtle mb-3">
              <img
                src={qrUrl}
                alt="Farmer UPI QR Code"
                className="w-48 h-48 rounded-lg object-contain"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>
                {language === "te"
                  ? "PhonePe, Google Pay, Paytm, లేదా BHIM తో స్కాన్ చేయండి"
                  : "Scan with PhonePe, Google Pay, Paytm, or BHIM"}
              </span>
            </div>
          </div>

          {/* Payee Info & VPA Copy */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-5 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-stone-600">
              <span>{language === "te" ? "రైతు పేరు (లబ్ధిదారుడు):" : "Farmer (Payee):"}</span>
              <span className="font-bold text-stone-900">{order.farmer_name}</span>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>UPI VPA:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-900">{upiDetails.vpa}</span>
                <button
                  onClick={handleCopyVpa}
                  className="p-1 hover:bg-stone-200 rounded text-stone-600 transition"
                  title="Copy UPI ID"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-stone-600">
              <span>{language === "te" ? "ఆర్డర్ సంఖ్య:" : "Order Number:"}</span>
              <span className="font-mono font-semibold text-stone-800">{order.order_number}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {/* Open UPI App Deep Link for Mobile */}
            <a
              href={upiDetails.upi_uri}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-subtle transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {language === "te"
                  ? "UPI యాప్‌తో చెల్లించండి (ఫోన్‌పే/జీపే)"
                  : "Pay via UPI App (GPay / PhonePe / BHIM)"}
              </span>
            </a>

            {/* Confirm Payment Receipt (Farmer/Buyer Confirmation) */}
            <button
              onClick={handleConfirmPayment}
              disabled={isConfirming}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {language === "te"
                  ? "చెల్లింపు పూర్తయినట్లు ధృవీకరించండి"
                  : "Confirm Direct Settlement Received"}
              </span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex items-center justify-center gap-2 text-[11px] text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>SEEDSTACK Direct Settlement Guarantee • Zero Deduction from Farmer</span>
        </div>
      </div>
    </div>
  );
};
