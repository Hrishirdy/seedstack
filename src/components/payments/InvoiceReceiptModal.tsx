"use client";

import React from "react";
import { Order, CommissionInvoice } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { generateCommissionInvoice } from "@/lib/payments/upi-generator";
import { formatWhatsAppUrl } from "@/lib/notifications/notification-service";
import {
  Printer,
  Download,
  Share2,
  X,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  QrCode,
} from "lucide-react";

interface InvoiceReceiptModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const invoice: CommissionInvoice = generateCommissionInvoice(order);

  const handlePrint = () => {
    window.print();
  };

  const invoiceShareText = `📄 *SEEDSTACK AGRICULTURAL INVOICE*\nInvoice: ${invoice.invoice_number}\nOrder: ${order.order_number}\nProduce: ${order.crop_name} (${invoice.fulfilled_quantity_kg} kg)\nAgreed Rate: ₹${invoice.agreed_rate_per_kg}/kg\nTotal Value: ₹${invoice.total_produce_value.toLocaleString(
    'en-IN'
  )}\nStatus: ${invoice.status.toUpperCase()}\nPlatform Fee: ₹${invoice.total_platform_invoice_amount} (incl. GST)`;

  const whatsappReceiptUrl = formatWhatsAppUrl(
    invoice.farmer_phone || '+919848012345',
    invoiceShareText
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8 print:border-none print:shadow-none print:m-0">
        {/* Modal Controls (Hidden in print) */}
        <div className="bg-stone-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold text-stone-300">
            {language === "te" ? "రసీదు ప్రివ్యూ & ప్రింట్" : "Official Invoice & Settlement Voucher"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === "te" ? "ప్రింట్ చేయండి" : "Print / PDF"}</span>
            </button>
            <a
              href={whatsappReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-8 print:p-6 text-stone-900 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-stone-800 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-emerald-900">SEEDSTACK</h1>
                <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider">
                  Agricultural Technologies Ltd. • TS & AP
                </p>
                <p className="text-[10px] text-stone-500">GSTIN: 36AABCS1429B1Z8 | Telangana & Andhra Pradesh</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-900 mb-1">
                {invoice.status === "settled" ? "SETTLED & CONFIRMED" : "OFFICIAL INVOICE"}
              </span>
              <p className="text-sm font-mono font-bold text-stone-900">{invoice.invoice_number}</p>
              <p className="text-xs text-stone-500">
                Date: {new Date(invoice.invoice_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                {language === "te" ? "రైతు వివరాలు (విక్రేత)" : "Producer / Farmer (Payee)"}
              </span>
              <p className="text-sm font-bold text-stone-900">{invoice.farmer_name}</p>
              <p className="text-xs text-stone-600">{invoice.farmer_location}</p>
              <p className="text-xs text-stone-500 mt-1">Phone: {invoice.farmer_phone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                {language === "te" ? "కొనుగోలుదారు వివరాలు" : "Buyer / Procuring Entity (Payer)"}
              </span>
              <p className="text-sm font-bold text-stone-900">{invoice.buyer_name}</p>
              <p className="text-xs text-stone-600">{invoice.buyer_business}</p>
              <p className="text-xs text-stone-500 mt-1">GSTIN: {invoice.buyer_gst}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-6 overflow-hidden rounded-xl border border-stone-200">
            <table className="w-full text-xs">
              <thead className="bg-emerald-800 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 text-left">Description</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Agreed Rate</th>
                  <th className="py-2.5 px-3 text-right">Produce Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                <tr>
                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-900 block">{order.crop_name}</span>
                    <span className="text-[11px] text-stone-500">Direct farm-gate produce settlement</span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold">{invoice.fulfilled_quantity_kg} kg</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">₹{invoice.agreed_rate_per_kg}/kg</td>
                  <td className="py-3 px-3 text-right font-bold text-stone-900 font-mono">
                    ₹{invoice.total_produce_value.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown & Commission Ledger */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 block mb-1">
                {language === "te" ? "ప్రత్యక్ష చెల్లింపు ధృవీకరణ" : "Direct Settlement Audit"}
              </span>
              <p className="text-stone-600 flex justify-between">
                <span>Method:</span>
                <span className="font-semibold text-stone-900">{order.payment_method.toUpperCase()}</span>
              </p>
              <p className="text-stone-600 flex justify-between">
                <span>Settlement Ref:</span>
                <span className="font-mono text-stone-900">{invoice.direct_settlement_reference}</span>
              </p>
              <p className="text-stone-600 flex justify-between">
                <span>Farmer Cut:</span>
                <span className="font-bold text-emerald-800">100% Direct (Zero Platform Cuts)</span>
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1.5">
              <span className="font-bold text-stone-900 block mb-1">
                {language === "te" ? "ప్లాట్‌ఫామ్ నామమాత్రపు రుసుము" : "Quantity-Based Platform Voucher"}
              </span>
              <div className="flex justify-between text-stone-600">
                <span>Farmer Fixed Fee ({invoice.fulfilled_quantity_kg}kg tier):</span>
                <span className="font-mono font-semibold text-stone-900">₹{invoice.farmer_platform_fee}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Buyer Fixed Fee:</span>
                <span className="font-mono font-semibold text-stone-900">₹{invoice.buyer_platform_fee}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST @ 18%:</span>
                <span className="font-mono text-stone-700">₹{invoice.platform_fee_gst_18pct}</span>
              </div>
              <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                <span>Total Platform Invoice:</span>
                <span className="font-mono text-emerald-800">₹{invoice.total_platform_invoice_amount}</span>
              </div>
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="border-t border-stone-200 pt-4 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Certified under SEEDSTACK Digital Agriculture Fair-Pricing Standard</span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-stone-700">SEEDSTACK Agritech Ltd.</p>
              <p>Hyderabad • Vijayawada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
