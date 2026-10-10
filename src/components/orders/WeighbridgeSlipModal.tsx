"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { WeighbridgeSlip } from "@/lib/types";
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  X,
  Camera,
  FileText,
  Truck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { playNotificationChime } from "@/lib/notifications/notification-service";

interface WeighbridgeSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  cropName: string;
  agreedRatePerKg: number;
  initialSlip?: WeighbridgeSlip | null;
  onSlipUpdated?: (slip: WeighbridgeSlip) => void;
}

export const WeighbridgeSlipModal: React.FC<WeighbridgeSlipModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  cropName,
  agreedRatePerKg,
  initialSlip,
  onSlipUpdated,
}) => {
  const { language } = useLanguage();

  const [weighbridgeName, setWeighbridgeName] = useState(
    initialSlip?.weighbridge_name || "Sri Venkateshwara Dharma Kanta (Suryapet Bypass)"
  );
  const [receiptNo, setReceiptNo] = useState(
    initialSlip?.weighbridge_receipt_no || `VK-WB-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [truckNo, setTruckNo] = useState(initialSlip?.truck_number || "TS 08 UB 4519");
  const [grossWeight, setGrossWeight] = useState<number>(initialSlip?.gross_weight_kg || 3450);
  const [tareWeight, setTareWeight] = useState<number>(initialSlip?.tare_weight_kg || 2450);
  const [moisture, setMoisture] = useState<number>(initialSlip?.moisture_percent || 12.2);
  const [bagTare, setBagTare] = useState<number>(initialSlip?.bag_tare_deduction_kg || 0);

  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const netProduceWeight = Math.max(0, grossWeight - tareWeight);
  const finalBillableWeight = Math.max(0, netProduceWeight - bagTare);
  const finalTotalAmount = finalBillableWeight * agreedRatePerKg;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/weighbridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderNumber,
          weighbridgeName,
          weighbridgeReceiptNo: receiptNo,
          truckNumber: truckNo,
          grossWeightKg: grossWeight,
          tareWeightKg: tareWeight,
          moisturePercent: moisture,
          bagTareDeductionKg: bagTare,
          agreedRatePerKg,
          slipPhotoUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        playNotificationChime();
        setIsSuccess(true);
        if (onSlipUpdated && json.data) {
          onSlipUpdated(json.data);
        }
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 1200);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/weighbridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dispute",
          slipId: initialSlip?.id || "wb-101",
          disputeReason,
        }),
      });
      playNotificationChime();
      alert(
        language === "te"
          ? "తూకం వివాదం విజయవంతంగా నివేదించబడింది. సీడ్‌స్టాక్ మధ్యవర్తిత్వ బృందం సమీక్షిస్తుంది."
          : "Weighment dispute logged. SEEDSTACK mediation team notified."
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-emerald-500/40 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  {language === "te"
                    ? "ధర్మ కాంటా తూకం రసీదు (Weighbridge Slip)"
                    : "Digital Weighbridge Dharma Kanta Slip"}
                </h3>
              </div>
              <p className="text-xs text-emerald-100">
                {orderNumber} • {cropName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-rose-600 text-white font-extrabold text-xs transition border border-white/30 hover:border-rose-700"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">
              {language === "te" ? "రద్దు" : "Close"}
            </span>
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
            <h4 className="text-lg font-black text-emerald-950">
              {language === "te"
                ? "ధర్మ కాంటా తూకం ధృవీకరించబడింది!"
                : "Weighbridge Slip Logged & Verified!"}
            </h4>
            <p className="text-xs text-stone-600">
              {language === "te"
                ? `నికర పంట బరువు ${finalBillableWeight} kg నమోదు చేయబడింది. బిల్లింగ్ మొత్తం సర్దుబాటు చేయబడింది.`
                : `Net weight of ${finalBillableWeight} kg recorded. Order value updated.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 sm:p-7 space-y-5">
            {/* Top Info Banner */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {language === "te"
                  ? "0% తూకం మోసం గ్యారెంటీ"
                  : "Zero Weighment Fraud Guarantee"}
              </span>
              <span className="font-extrabold text-emerald-800">
                ₹{agreedRatePerKg}/kg రేటు
              </span>
            </div>

            {/* Weighbridge Name & Receipt No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "ధర్మ కాంటా పేరు" : "Weighbridge Facility"}
                </label>
                <input
                  type="text"
                  required
                  value={weighbridgeName}
                  onChange={(e) => setWeighbridgeName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "రసీదు సంఖ్య & లారీ నంబర్" : "Receipt No & Truck No"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-semibold border border-stone-300 rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs font-semibold border border-stone-300 rounded-xl uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            {/* The 3 Critical Weighment Boxes */}
            <div className="grid grid-cols-3 gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
              <div>
                <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                  {language === "te" ? "లాడెన్ బరువు (Gross)" : "Gross (Loaded)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={grossWeight}
                    onChange={(e) => setGrossWeight(Number(e.target.value))}
                    className="w-full text-center text-sm font-black border border-stone-300 rounded-xl py-1.5"
                  />
                </div>
                <span className="text-[10px] text-stone-400">ట్రక్ + పంట (kg)</span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                  {language === "te" ? "ఖాళీ బరువు (Tare)" : "Tare (Empty)"}
                </label>
                <input
                  type="number"
                  required
                  value={tareWeight}
                  onChange={(e) => setTareWeight(Number(e.target.value))}
                  className="w-full text-center text-sm font-black border border-stone-300 rounded-xl py-1.5"
                />
                <span className="text-[10px] text-stone-400">ఖాళీ లారీ (kg)</span>
              </div>

              <div className="bg-emerald-100/70 p-1.5 rounded-xl border border-emerald-300">
                <label className="text-[10px] uppercase font-black text-emerald-900 block mb-1">
                  {language === "te" ? "నికర పంట (Net)" : "Net Produce"}
                </label>
                <div className="text-base font-black text-emerald-800 py-0.5">
                  {netProduceWeight} kg
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {(netProduceWeight / 100).toFixed(1)} క్వింటాళ్లు
                </span>
              </div>
            </div>

            {/* Produce Moisture & Bag Deductions */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-bold block uppercase">
                  {language === "te" ? "తేమ శాతం (Moisture %)" : "Moisture %"}
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(Number(e.target.value))}
                  className="w-full mt-1 font-black text-sm text-stone-800 border border-stone-300 rounded-lg px-2 py-1"
                />
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                  {moisture <= 14 ? "✓ నాణ్యతా ప్రమాణం (<14%)" : "⚠️ తేమ ఎక్కువ"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-bold block uppercase">
                  {language === "te" ? "బస్తాల మినహాయింపు (kg)" : "Bag Tare Deduction (kg)"}
                </span>
                <input
                  type="number"
                  value={bagTare}
                  onChange={(e) => setBagTare(Number(e.target.value))}
                  className="w-full mt-1 font-black text-sm text-stone-800 border border-stone-300 rounded-lg px-2 py-1"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  గన్నీ బ్యాగ్ బరువు
                </span>
              </div>
            </div>

            {/* Total Payable Settlement Summary */}
            <div className="bg-stone-900 text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                  {language === "te"
                    ? "నికర తూకం ప్రకారం తుది విలువ"
                    : "Final Billable Settlement Amount"}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  ₹{finalTotalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right text-[11px] text-stone-300">
                <p>
                  <strong>{finalBillableWeight} kg</strong> @ ₹{agreedRatePerKg}/kg
                </p>
                <p className="text-emerald-400">0% కమీషన్ కట్</p>
              </div>
            </div>

            {/* Dispute Drawer */}
            {isDisputeOpen ? (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>
                    {language === "te" ? "తూకం వివాదం నమోదు" : "Report Weighment Dispute"}
                  </span>
                </div>
                <textarea
                  rows={2}
                  placeholder={
                    language === "te"
                      ? "తూకం లేదా నాణ్యత తేడా వివరాలు రాయండి (ఉదా: 50 kg తక్కువ వచ్చింది)..."
                      : "Describe discrepancy (e.g. 50 kg shortage or excess moisture)..."
                  }
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-rose-300 bg-white"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDisputeOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDispute}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Submit Dispute
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsDisputeOpen(true)}
                  className="text-stone-500 hover:text-rose-700 font-bold underline flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    {language === "te"
                      ? "తూకం తేడా ఉందా? వివాదం నమోదు చేయండి"
                      : "Weighment Discrepancy? Raise Dispute"}
                  </span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition"
              >
                {language === "te" ? "రద్దు (Cancel)" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition shadow-elevated flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>
                  {language === "te"
                    ? "తూకం రసీదును ధృవీకరించండి"
                    : "Confirm & Verify Weighbridge Slip"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
