"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { useLanguage } from "@/lib/i18n/context";
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Sprout,
  Building2,
  LogOut,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface RoleBarrierGuardProps {
  allowedRole: "farmer" | "buyer" | "admin";
  children: React.ReactNode;
}

export const RoleBarrierGuard: React.FC<RoleBarrierGuardProps> = ({
  allowedRole,
  children,
}) => {
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, switchUser, logout } =
    useAuth();
  const { language } = useLanguage();
  const pathname = usePathname();

  // 1. Unauthenticated Guest Barrier
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border-2 border-amber-200 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {language === "te" ? "భద్రతా అడ్డంకి" : "Security Gate"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-deep">
            {language === "te"
              ? "ఈ పేజీని చూడటానికి లాగిన్ అవసరం"
              : "Authentication Required to Access Portal"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            {language === "te"
              ? "రైతుల ప్రైవేట్ ఖాతా వివరాలు, పంట విక్రయాలు మరియు వ్యాపార ధరల రక్షణ కోసం ప్రామాణీకరణ తప్పనిసరి."
              : "To protect farmer account details, crop trade negotiations, and commercial contracts, please sign in."}
          </p>
        </div>

        {/* Dual Role Sign In Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <Link
            href={`/auth/login?role=farmer&redirect=${encodeURIComponent(pathname)}`}
            className="p-5 rounded-2xl bg-white border-2 border-emerald-500 hover:bg-emerald-50/50 shadow-subtle transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-brand-deep">
                {language === "te" ? "🌾 రైతు లాగిన్" : "🌾 Farmer Sign In"}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === "te"
                  ? "పంట అమ్మకాలు & ప్రత్యక్ష చెల్లింపులు"
                  : "Sell crops & direct UPI payments"}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
              <span>{language === "te" ? "ప్రవేశించండి" : "Enter Portal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            href={`/auth/login?role=buyer&redirect=${encodeURIComponent(pathname)}`}
            className="p-5 rounded-2xl bg-white border-2 border-sky-500 hover:bg-sky-50/50 shadow-subtle transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-brand-deep">
                {language === "te" ? "🏢 వ్యాపారి లాగిన్" : "🏢 Buyer Sign In"}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1">
                {language === "te"
                  ? "హోల్‌సేల్ సేకరణ & బిడ్డింగ్ డెస్క్"
                  : "Wholesale procurement & bidding"}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-700 group-hover:translate-x-1 transition">
              <span>{language === "te" ? "ప్రవేశించండి" : "Enter Portal"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* 1-Tap Quick Evaluation Mode for Testing */}
        <div className="pt-4 border-t border-stone-200">
          <div className="text-[11px] font-bold text-stone-500 mb-2 uppercase tracking-wider">
            {language === "te" ? "తక్షణ టెస్టింగ్ మోడ్:" : "Instant Demo Access:"}
          </div>
          <button
            onClick={() => {
              if (allowedRole === "farmer") switchUser("user-farmer-1");
              else if (allowedRole === "buyer") switchUser("user-buyer-1");
              else switchUser("user-admin-1");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-black transition shadow"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {allowedRole === "farmer"
                ? "రమేష్ రెడ్డి (రైతు) గా తక్షణ లాగిన్"
                : allowedRole === "buyer"
                ? "వెంకట్ రావు (హోల్‌సేలర్) గా తక్షణ లాగిన్"
                : "అడ్మిన్ శ్రీనివాస్ గా తక్షణ లాగిన్"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Role Barrier Mismatch Check
  const hasAccess =
    (allowedRole === "farmer" && isFarmer) ||
    (allowedRole === "buyer" && isBuyer) ||
    (allowedRole === "admin" && isAdmin);

  if (!hasAccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-700 border-2 border-rose-200 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            {language === "te" ? "⛔ పాత్ర అడ్డంకి" : "⛔ Strict Role Barrier Active"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-deep">
            {allowedRole === "farmer"
              ? language === "te"
                ? "రైతు పోర్టల్ — అనుమతి పరిమితం"
                : "Farmer Portal — Access Restricted"
              : allowedRole === "buyer"
              ? language === "te"
                ? "వ్యాపార డెస్క్ — అనుమతి పరిమితం"
                : "Commercial Buyer Desk — Access Restricted"
              : language === "te"
              ? "అడ్మిన్ కన్సోల్ — అనుమతి పరిమితం"
              : "Admin Console — Access Restricted"}
          </h2>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-500">ప్రస్తుత పాత్ర / Logged in as:</span>
              <span className="font-bold text-stone-900 uppercase">
                {user.role} ({user.full_name})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-500">అవసరమైన పాత్ర / Required:</span>
              <span className="font-bold text-rose-800 uppercase font-black">
                {allowedRole}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
              {allowedRole === "farmer"
                ? "రైతుల ప్రైవేట్ ఖాతా వివరాలు, లారీ సేకరణ వివరాలు మరియు ప్రత్యక్ష బ్యాంక్ సెటిల్మెంట్ల భద్రత కోసం కొనుగోలుదారులకు ఈ పేజీ అనుమతించబడదు."
                : "హోల్‌సేల్ సరుకు సేకరణ, మార్కెట్ బిడ్డింగ్ మరియు జీఎస్టీ ఇన్వాయిస్ నిర్వహణ కొనుగోలుదారులకు మాత్రమే పరిమితం."}
            </p>
          </div>
        </div>

        {/* Barrier Bypass / Account Switch Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {allowedRole === "farmer" && (
            <button
              onClick={() => switchUser("user-farmer-1")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center justify-center gap-2 shadow"
            >
              <Sprout className="w-4 h-4" />
              <span>{language === "te" ? "రైతు ఖాతాకు మారండి (Switch to Farmer)" : "Switch to Farmer Account"}</span>
            </button>
          )}

          {allowedRole === "buyer" && (
            <button
              onClick={() => switchUser("user-buyer-1")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-700 text-white text-xs font-bold hover:bg-sky-800 transition flex items-center justify-center gap-2 shadow"
            >
              <Building2 className="w-4 h-4" />
              <span>{language === "te" ? "కొనుగోలుదారు ఖాతాకు మారండి (Switch to Buyer)" : "Switch to Buyer Account"}</span>
            </button>
          )}

          <Link
            href={isFarmer ? "/farmer/dashboard" : isBuyer ? "/buyer/dashboard" : "/admin/dashboard"}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold hover:bg-stone-200 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "te" ? "మీ సొంత డ్యాష్‌బోర్డుకు వెళ్ళండి" : "Back to Your Authorized Desk"}</span>
          </Link>

          <button
            onClick={logout}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-stone-500" />
            <span>{language === "te" ? "లాగౌట్" : "Log Out"}</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Authorized - Render Portal Content
  return <>{children}</>;
};
