"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import {
  Sprout,
  Building2,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { CloseEdgeButton } from "@/components/ui/CloseEdgeButton";
import { PhoneOtpLogin } from "@/components/auth/PhoneOtpLogin";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { login, switchUser, allDemoUsers } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "";
  const initialRole = (searchParams.get("role") as "farmer" | "buyer" | "admin") || "farmer";

  const [activeTab, setActiveTab] = useState<"farmer" | "buyer" | "admin">(initialRole);
  const [loginMode, setLoginMode] = useState<"otp" | "pin">("otp");

  // Form states
  const [farmerPhone, setFarmerPhone] = useState("+91 98480 12345");
  const [farmerPin, setFarmerPin] = useState("1234");

  const [buyerIdentifier, setBuyerIdentifier] = useState("+91 99890 87654");
  const [buyerPassword, setBuyerPassword] = useState("1234");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole]);

  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(farmerPhone, farmerPin, "farmer");
      if (res.success && res.user) {
        if (redirectUrl) router.push(redirectUrl);
        else router.push("/farmer/dashboard");
      } else {
        setErrorMsg(res.error || "లాగిన్ విఫలమైంది. దయచేసి సరైన ఫోన్ నంబర్ నమోదు చేయండి.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(buyerIdentifier, buyerPassword, "wholesaler");
      if (res.success && res.user) {
        if (redirectUrl) router.push(redirectUrl);
        else router.push("/buyer/dashboard");
      } else {
        setErrorMsg(res.error || "లాగిన్ విఫలమైంది. ఫోన్ లేదా ఇమెయిల్ తనిఖీ చేయండి.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (userId: string, role: string) => {
    switchUser(userId);
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      if (role === "farmer") router.push("/farmer/dashboard");
      else if (role === "admin") router.push("/admin/dashboard");
      else router.push("/buyer/dashboard");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 relative">
      {/* Fixed Edge Close Cross Button on Viewport Corner */}
      <CloseEdgeButton fixed fallbackUrl={redirectUrl || "/"} />

      {/* Top Dismiss Bar */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href={redirectUrl || "/"}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-500 hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "te" ? "హోమ్‌పేజీకి వెళ్ళండి" : "Back to Home"}</span>
        </Link>
        <CloseEdgeButton fallbackUrl={redirectUrl || "/"} />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center mx-auto shadow-card">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-deep">
          {language === "te" ? "సీడ్‌స్టాక్ పోర్టల్ లాగిన్" : "Sign In to SEEDSTACK"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          {language === "te"
            ? "తెలంగాణ & ఆంధ్రప్రదేశ్ వ్యవసాయ మార్కెట్‌ప్లేస్"
            : "Telangana & Andhra Pradesh Direct Agricultural Marketplace"}
        </p>
      </div>

      {/* Role Barrier Tabs */}
      <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-1 border border-stone-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab("farmer");
            setErrorMsg(null);
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === "farmer"
              ? "bg-emerald-700 text-white shadow-md"
              : "text-stone-700 hover:text-stone-900"
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{language === "te" ? "రైతు లాగిన్" : "Farmer Portal"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("buyer");
            setErrorMsg(null);
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === "buyer"
              ? "bg-sky-700 text-white shadow-md"
              : "text-stone-700 hover:text-stone-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === "te" ? "కొనుగోలుదారు లాగిన్" : "Buyer Desk"}</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mode Switcher: SMS OTP (Default) vs PIN */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setLoginMode("otp")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black transition flex items-center gap-1.5 ${
            loginMode === "otp"
              ? activeTab === "farmer"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-sky-700 text-white shadow-sm"
              : "bg-stone-200 text-stone-700 hover:bg-stone-300"
          }`}
        >
          <span>📩</span>
          <span>
            {language === "te"
              ? "తక్షణ SMS ఓటీపీ (సిఫార్సు)"
              : "Instant SMS OTP (Recommended)"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setLoginMode("pin")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
            loginMode === "pin"
              ? "bg-stone-900 text-white shadow-sm"
              : "bg-stone-200 text-stone-700 hover:bg-stone-300"
          }`}
        >
          <span>🔑</span>
          <span>{language === "te" ? "పిన్ / పాస్‌వర్డ్" : "PIN / Password"}</span>
        </button>
      </div>

      {/* FARMER LOGIN CARD */}
      {activeTab === "farmer" && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 shadow-card space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {language === "te" ? "రైతుల పోర్టల్" : "Farmer Portal Sign In"}
              </div>
              <h2 className="text-lg font-extrabold text-brand-deep">
                {loginMode === "otp"
                  ? language === "te"
                    ? "మొబైల్ నంబర్ & SMS ఓటీపీ లాగిన్"
                    : "Mobile Number & 4-Digit SMS OTP"
                  : language === "te"
                  ? "మొబైల్ & 4-అంకెల కిసాన్ పిన్"
                  : "Mobile Number & Security PIN"}
              </h2>
            </div>
            <span className="text-2xl">🌾</span>
          </div>

          {loginMode === "otp" ? (
            <PhoneOtpLogin role="farmer" onSuccessRedirect={redirectUrl} />
          ) : (
            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "రైతు మొబైల్ నంబర్" : "Farmer Registered Mobile"}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="+91 98480 12345"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {language === "te"
                    ? "మీ ఆధార్ లేదా పట్టాదారు పాస్‌బుక్‌తో లింక్ అయిన మొబైల్"
                    : "Mobile number linked to your land or Kisan ID"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "4-అంకెల కిసాన్ పిన్ / ఓటీపీ" : "4-Digit Kisan Security PIN / OTP"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={farmerPin}
                    onChange={(e) => setFarmerPin(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm font-bold tracking-widest border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="1234"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-extrabold text-sm hover:bg-emerald-800 transition shadow-card flex items-center justify-center gap-2"
              >
                <Sprout className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "ధృవీకరిస్తోంది..."
                    : language === "te"
                    ? "రైతు పోర్టల్‌లోకి ప్రవేశించండి"
                    : "Enter Farmer Portal"}
                </span>
              </button>
            </form>
          )}

          {/* Quick Demo Fill Button */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("user-farmer-1", "farmer")}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>⚡ రమేష్ రెడ్డి (రైతు) డెమో ఖాతాలో లాగిన్ అవ్వండి</span>
            </button>
            <Link
              href="/auth/register?role=farmer"
              className="text-xs font-extrabold text-brand-primary hover:underline"
            >
              {language === "te" ? "కొత్త రైతు నమోదు" : "New Farmer Register"}
            </Link>
          </div>
        </div>
      )}

      {/* BUYER LOGIN CARD */}
      {activeTab === "buyer" && (
        <div className="bg-white rounded-3xl border-2 border-sky-500 p-6 sm:p-8 shadow-card space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                {language === "te" ? "కొనుగోలుదారుల డెస్క్" : "Commercial Buyer Sign In"}
              </div>
              <h2 className="text-lg font-extrabold text-brand-deep">
                {language === "te" ? "వ్యాపార ఐడీ & పాస్‌వర్డ్" : "Business Mobile / Email & Password"}
              </h2>
            </div>
            <span className="text-2xl">🏢</span>
          </div>

          {loginMode === "otp" ? (
            <PhoneOtpLogin role="buyer" onSuccessRedirect={redirectUrl} />
          ) : (
            <form onSubmit={handleBuyerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "మొబైల్ లేదా ఇమెయిల్" : "Registered Business Mobile / Email"}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={buyerIdentifier}
                    onChange={(e) => setBuyerIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="+91 99890 87654"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  GST / Trade License associated identity
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === "te" ? "పాస్‌వర్డ్ / పిన్" : "Security Password / PIN"}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={buyerPassword}
                    onChange={(e) => setBuyerPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 text-sm font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-sky-700 text-white font-extrabold text-sm hover:bg-sky-800 transition shadow-card flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "ధృవీకరిస్తోంది..."
                    : language === "te"
                    ? "వ్యాపార డెస్క్‌లోకి ప్రవేశించండి"
                    : "Enter Buyer Procurement Desk"}
                </span>
              </button>
            </form>
          )}

          {/* Quick Demo Fill Button */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("user-buyer-1", "wholesaler")}
              className="text-xs font-bold text-sky-800 hover:underline flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>⚡ వెంకట్ రావు (హోల్‌సేల్ వ్యాపారి) డెమో లాగిన్</span>
            </button>
            <Link
              href="/auth/register?role=buyer"
              className="text-xs font-extrabold text-sky-700 hover:underline"
            >
              {language === "te" ? "కొత్త వ్యాపారి నమోదు" : "New Buyer Register"}
            </Link>
          </div>
        </div>
      )}

      {/* Sandbox Persona Quick-Select */}
      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs space-y-2">
        <div className="font-bold text-stone-700 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-brand-primary" />
          <span>తక్షణ మూల్యాంకనం (Instant Evaluation Personas)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {allDemoUsers.slice(0, 3).map((u) => (
            <button
              key={u.id}
              onClick={() => handleQuickDemoLogin(u.id, u.role)}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-brand-primary text-left transition shadow-xs"
            >
              <div className="font-bold text-stone-900 truncate">{u.full_name.split(" ")[0]}</div>
              <div className="text-[10px] text-stone-500 uppercase">{u.role}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-stone-400">Loading portal login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
