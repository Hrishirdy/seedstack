"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { UserRole } from "@/lib/types";
import {
  Sprout,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";

function RegisterWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const { register } = useAuth();

  const queryRole = searchParams.get("role") || "";

  const [step, setStep] = useState<1 | 2 | 3>(queryRole ? 2 : 1);

  // Form Fields
  const [role, setRole] = useState<UserRole>(
    queryRole === "buyer" || queryRole === "wholesaler" ? "wholesaler" : "farmer"
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"te" | "en">("te");
  const [state, setState] = useState("Telangana");
  const [district, setDistrict] = useState("Warangal");
  const [village, setVillage] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [landAcres, setLandAcres] = useState<number>(5);
  const [agreed, setAgreed] = useState(false);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the SEEDSTACK terms & privacy policy.");
      return;
    }

    register({
      role,
      full_name: fullName || "New Registered User",
      phone: phone || "+91 98480 99999",
      preferred_language: preferredLanguage,
      state,
      district,
      mandal_or_village: village || "Mandal Hub",
      business_name: businessName,
      land_size_acres: role === "farmer" ? landAcres : undefined,
    });

    if (role === "farmer") {
      router.push("/farmer/dashboard");
    } else {
      router.push("/buyer/dashboard");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 relative">
      {/* Fixed Edge Close Cross Button */}
      <CloseEdgeButton fixed fallbackUrl="/auth/login" />

      {/* Top Dismiss Bar */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-500 hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "te" ? "లాగిన్ పేజీకి వెళ్ళండి" : "Back to Sign In"}</span>
        </Link>
        <CloseEdgeButton fallbackUrl="/auth/login" />
      </div>

      {/* Wizard Progress */}
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
        <span className={step >= 1 ? "text-brand-primary font-bold" : ""}>
          1. Role Selection
        </span>
        <span className="text-stone-300">———</span>
        <span className={step >= 2 ? "text-brand-primary font-bold" : ""}>
          2. Personal & Region
        </span>
        <span className="text-stone-300">———</span>
        <span className={step >= 3 ? "text-brand-primary font-bold" : ""}>
          3. Verification Terms
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-card space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-brand-deep">
                Join SEEDSTACK Agricultural Network
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Select your primary trading participation role:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "farmer",
                  title: "Farmer / రైతు (Crop Producer)",
                  desc: "Sell harvested crops directly to wholesale merchants with zero listing fee.",
                  icon: Sprout,
                },
                {
                  id: "wholesaler",
                  title: "Wholesale Mandi Merchant",
                  desc: "Source bulk agricultural lots directly from farm gate.",
                  icon: Building,
                },
                {
                  id: "supermarket",
                  title: "Supermarket / Retail Chain",
                  desc: "Procure verified quality produce with scheduled batch logistics.",
                  icon: Building,
                },
                {
                  id: "food_processor",
                  title: "Agro-Processing & Food Industry",
                  desc: "Contract regular commercial supply for manufacturing.",
                  icon: Building,
                },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as UserRole)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                    role === r.id
                      ? "border-brand-primary bg-brand-light/60 shadow-subtle"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <r.icon
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      role === r.id ? "text-brand-primary" : "text-stone-400"
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{r.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-deep transition flex items-center gap-1.5 shadow-subtle"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-brand-deep">
                Profile & Geographic Location
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Enter your details to coordinate local mandi logistics across Telangana and Andhra Pradesh:
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name / పూర్తి పేరు
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (for SMS & OTP updates)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98480 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {role !== "farmer" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered Business / Enterprise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Venkateshwara Commodities Pvt Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              )}

              {role === "farmer" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cultivated Land Size (Acres)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={landAcres}
                    onChange={(e) => setLandAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State / రాష్ట్రం
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
                    District / జిల్లా
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suryapet, Guntur"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mandal / Village / Farm Gate Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chivvemla Village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-deep transition flex items-center gap-1.5 shadow-subtle"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleComplete} className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-brand-deep">
                Verification Consent & Terms
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                To protect against fraudulent listings, SEEDSTACK requires identity verification before order dispatch:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Private Government Record Review</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                You will be requested to upload your Pattadar Passbook / Kisan Credit Card (for farmers) or GST / Trade License (for buyers). Your identity documents remain strictly confidential and encrypted in our private vault.
              </p>
            </div>

            <div className="flex items-start gap-2.5 pt-2">
              <input
                type="checkbox"
                id="agree"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-brand-primary"
              />
              <label htmlFor="agree" className="text-xs text-stone-700 leading-snug">
                I agree to the SEEDSTACK Agricultural Trading Terms, Quantity-Based Commission schedule, and Privacy Policy.
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-deep transition flex items-center gap-1.5 shadow-subtle"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterWizardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading registration...</div>}>
      <RegisterWizardContent />
    </Suspense>
  );
}
