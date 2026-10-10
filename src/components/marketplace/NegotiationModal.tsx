"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useLanguage } from "@/lib/i18n/context";
import { demoStore } from "@/lib/store/demo-store";
import { calculateCommission, DEFAULT_COMMISSION_TIERS } from "@/lib/commissions/commission-engine";
import { CropListing, BuyerRequirement } from "@/lib/types";
import { Scale, ArrowRight, CheckCircle2, X } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface NegotiationModalProps {
  listing?: CropListing;
  requirement?: BuyerRequirement;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  listing,
  requirement,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isFarmer, isBuyer } = useAuth();
  const { t, language } = useLanguage();

  const defaultQty = listing ? Math.min(listing.available_quantity, 100) : requirement?.required_quantity || 100;
  const defaultPrice = listing ? listing.asking_price_per_unit : requirement?.target_price_per_unit || 30;

  const [quantity, setQuantity] = useState<number>(defaultQty);
  const [unitPrice, setUnitPrice] = useState<number>(defaultPrice);
  const [deliveryTerms, setDeliveryTerms] = useState<string>("Farm Gate pickup via SEEDSTACK Logistics");
  const [notes, setNotes] = useState<string>("");
  const [step, setStep] = useState<"negotiate" | "confirm">("negotiate");

  if (!isOpen) return null;

  const totalValue = quantity * unitPrice;
  const comm = calculateCommission(quantity, DEFAULT_COMMISSION_TIERS);

  const handleCreateNegotiationOrOrder = () => {
    if (!user) {
      alert("Please sign in to initiate negotiations or orders.");
      return;
    }

    if (listing && isFarmer) {
      alert(
        language === "te"
          ? "రైతులు పంటలను కొనుగోలు చేయలేరు. కొనుగోలు ఎంపికలు వ్యాపారులకు మాత్రమే అందుబాటులో ఉన్నాయి."
          : "Farmers cannot purchase crop listings. Purchasing is reserved for verified commercial buyers."
      );
      return;
    }

    if (requirement && isBuyer) {
      alert(
        language === "te"
          ? "వ్యాపారులు సప్లై ఆఫర్‌లను దాఖలు చేయలేరు. రైతులు మాత్రమే తమ పంటలను సరఫరా చేయగలరు."
          : "Commercial buyers cannot submit supply offers. Only farmers can fulfill procurement requirements."
      );
      return;
    }

    if (listing) {
      // Create negotiation or direct agreed order
      const neg = demoStore.createNegotiation(
        listing.id,
        undefined,
        listing.farmer_id,
        user.id,
        listing.crop_name,
        quantity,
        unitPrice,
        user.id,
        user.role,
        deliveryTerms
      );

      // Immediately agree terms if buyer accepts asking price directly, or generate order
      const order = demoStore.acceptOfferAndCreateOrder(neg.id, user.id);
      if (order) {
        onSuccess(order.order_number);
      } else {
        onClose();
      }
    } else if (requirement) {
      // Farmer responding to buyer requirement
      const neg = demoStore.createNegotiation(
        undefined,
        requirement.id,
        user.id,
        requirement.buyer_id,
        requirement.crop_name,
        quantity,
        unitPrice,
        user.id,
        user.role,
        deliveryTerms
      );
      const order = demoStore.acceptOfferAndCreateOrder(neg.id, user.id);
      if (order) {
        onSuccess(order.order_number);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-brand-border space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-brand-deep">
          <Scale className="w-5 h-5 text-brand-primary" />
          <h3 className="font-bold text-lg">
            {listing ? `Negotiate Terms for ${listing.crop_name}` : `Submit Offer for ${requirement?.crop_name}`}
          </h3>
        </div>

        <p className="text-xs text-stone-600">
          Propose your terms. Both parties must mutually agree on volume and price per kg before confirmed order dispatch.
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Batch Quantity (kg)
              </label>
              <input
                type="number"
                min="1"
                max={listing ? listing.available_quantity : 50000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {listing && (
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Available: {listing.available_quantity.toLocaleString()} kg
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Proposed Price / kg (₹)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-semibold border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {listing && (
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Farmer asking: ₹{listing.asking_price_per_unit}/kg
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Delivery Terms / Notes
            </label>
            <input
              type="text"
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g. Farm Gate pickup by Friday morning"
            />
          </div>

          {/* Breakdown Preview */}
          <div className="bg-brand-warmBg rounded-xl p-4 border border-brand-border space-y-2 text-xs">
            <div className="flex justify-between text-stone-700">
              <span>Gross Order Value ({quantity} kg × ₹{unitPrice}):</span>
              <span className="font-bold text-stone-900">{formatINR(totalValue)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Fulfilled Tier:</span>
              <span className="font-medium text-stone-800">{comm.tierName}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-stone-200 text-emerald-800 font-semibold">
              <span>Platform Fee (Payable on Delivery):</span>
              <span>
                ₹{comm.farmerFee} (Farmer) / ₹{comm.buyerFee} (Buyer)
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateNegotiationOrOrder}
            className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Terms & Place Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
