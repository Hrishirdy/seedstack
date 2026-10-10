"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { calculateCommission, DEFAULT_COMMISSION_TIERS } from "@/lib/commissions/commission-engine";
import {
  Sprout,
  ArrowRight,
  Search,
  ShieldCheck,
  TrendingUp,
  Truck,
  Scale,
  Users,
  Coins,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Calculator,
  Building2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function HomePage() {
  const { t, language } = useLanguage();
  const { user, isFarmer, isBuyer } = useAuth();
  const listings = demoStore.getListings().slice(0, 4);

  // Commission Calculator State
  const [calcQuantity, setCalcQuantity] = useState<number>(100);
  const calcResult = calculateCommission(calcQuantity, DEFAULT_COMMISSION_TIERS);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    {
      id: "cat-grains",
      nameEn: "Cereals & Paddy",
      nameTe: "ధాన్యాలు & వరి",
      desc: "Sona Masoori, BPT, Maize, Millets",
      icon: "🌾",
    },
    {
      id: "cat-spices",
      nameEn: "Spices & Condiments",
      nameTe: "మసాలా దినుసులు",
      desc: "Guntur Teja Chilli, Nizamabad Turmeric",
      icon: "🌶️",
    },
    {
      id: "cat-veg",
      nameEn: "Fresh Vegetables",
      nameTe: "తాజా కూరగాయలు",
      desc: "Tomatoes, Kurnool Onions, Green Chillies",
      icon: "🍅",
    },
    {
      id: "cat-cash",
      nameEn: "Cash Crops & Fibre",
      nameTe: "వాణిజ్య పంటలు",
      desc: "Adilabad Cotton, Castor, Soyabean",
      icon: "🌱",
    },
    {
      id: "cat-pulses",
      nameEn: "Pulses & Legumes",
      nameTe: "పప్పుధాన్యాలు",
      desc: "Tandur Red Gram, Bengal Gram",
      icon: "🥣",
    },
  ];

  const faqs = [
    {
      q: language === "te" ? "సీడ్‌స్టాక్ లో లిస్టింగ్ వేయడానికి రుసుము ఎంత?" : "Is there any fee to publish a crop listing?",
      a: language === "te"
        ? "ఖచ్చితంగా ఉచితం! సీడ్‌స్టాక్ లో పంటను లిస్ట్ చేయడానికి ఎలాంటి రుసుము ఉండదు. ఆర్డర్ విజయవంతంగా డెలివరీ అయి, మీరు నగదు అందుకున్న తర్వాత మాత్రమే సరఫరా చేసిన పరిమాణాన్ని బట్టి స్వల్ప నిర్ణీత కమీషన్ ఉంటుంది."
        : "Listing is completely free. SEEDSTACK charges zero upfront fees to list produce. A modest fixed fee is charged only upon successful order fulfillment based on the actual quantity delivered.",
    },
    {
      q: language === "te" ? "కొనుగోలుదారుల నుండి రైతుకు చెల్లింపు ఎలా జరుగుతుంది?" : "How does direct payment settlement work between buyer and farmer?",
      a: language === "te"
        ? "కొనుగోలుదారులు నేరుగా రైతు బ్యాంకు ఖాతాకు లేదా UPI/నగదు ద్వారా చెల్లిస్తారు. సీడ్‌స్టాక్ చెల్లింపు రికార్డులను పారదర్శకంగా నమోదు చేస్తుంది మరియు కమీషన్ వేరుగా ట్రాక్ చేయబడుతుంది."
        : "Buyers settle payments directly with farmers via Bank Transfer, UPI, or Cash-on-Delivery. SEEDSTACK records the settlement terms and tracks commissions separately without silent deductions.",
    },
    {
      q: language === "te" ? "రవాణా మరియు జీపీఎస్ ట్రాకింగ్ ఎలా పనిచేస్తుంది?" : "How is delivery coordinated and tracked?",
      a: language === "te"
        ? "రైతు పొలం నుండి కొనుగోలుదారు గిడ్డంగి వరకు సీడ్‌స్టాక్ లాజిస్టిక్స్ వాహనాలు సమన్వయం చేయబడతాయి. లైవ్ జీపీఎస్ ట్రాకింగ్ స్క్రీన్ ద్వారా ప్రయాణ దూరం మరియు చేరే సమయాన్ని లైవ్‌గా చూడవచ్చు."
        : "SEEDSTACK coordinates farm-gate collection and transit to buyer warehouses. Both parties receive a live GPS tracking link with temperature and route progress.",
    },
    {
      q: language === "te" ? "రైతులు మరియు వ్యాపారుల గుర్తింపు ఎలా ధృవీకరించబడుతుంది?" : "What is required for government ID verification?",
      a: language === "te"
        ? "రైతులు తమ పట్టాదారు పాస్‌బుక్ లేదా కిసాన్ క్రెడిట్ కార్డును, వ్యాపారులు తమ ట్రేడ్ లైసెన్స్ లేదా జీఎస్టీ పత్రాన్ని ప్రైవేట్ వాల్ట్‌లో అప్‌లోడ్ చేస్తారు. అడ్మిన్ పరిశీలించి ఆమోదించిన తర్వాత మాత్రమే ఆర్డర్లు ప్రారంభమవుతాయి."
        : "Farmers submit Pattadar Passbook or Kisan Credit Card; business buyers submit Trade License or GST certificate to our secure document vault. Platform administrators review and approve before active trading.",
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-light/60 via-brand-warmBg to-brand-warmBg border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-emerald-300 text-xs font-semibold text-brand-deep shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
                <span>{t.hero.badge}</span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-600 font-normal">Telangana & Andhra Pradesh</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-deep leading-tight">
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-brand-textSecondary leading-relaxed max-w-2xl">
                {t.hero.subheadline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                {isBuyer ? (
                  <>
                    <Link
                      href="/explore"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-deep transition shadow-card gap-2"
                    >
                      <Search className="w-5 h-5" />
                      <span>{language === "te" ? "పంటలను బ్రౌజ్ చేయండి & కొనండి" : "Explore & Buy Crops"}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>

                    <Link
                      href="/requirements/post"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-brand-border text-brand-textPrimary font-semibold text-base hover:bg-stone-50 transition shadow-subtle gap-2"
                    >
                      <Building2 className="w-5 h-5 text-sky-700" />
                      <span>{language === "te" ? "కొనుగోలు అవసరాన్ని పోస్ట్ చేయండి" : "Post Sourcing Requirement"}</span>
                    </Link>

                    <Link
                      href="/buyer/negotiations"
                      className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-stone-100 text-stone-800 font-semibold text-sm hover:bg-stone-200 transition gap-2"
                    >
                      <Scale className="w-4 h-4" />
                      <span>{language === "te" ? "నా చర్చలు & ఆర్డర్లు" : "My Negotiations"}</span>
                    </Link>
                  </>
                ) : isFarmer ? (
                  <>
                    <Link
                      href="/farmer/sell"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-deep transition shadow-card gap-2"
                    >
                      <Sprout className="w-5 h-5" />
                      <span>{t.hero.ctaFarmer}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>

                    <Link
                      href="/farmer/dashboard"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-brand-border text-brand-textPrimary font-semibold text-base hover:bg-stone-50 transition shadow-subtle gap-2"
                    >
                      <span>{language === "te" ? "🌾 రైతు పోర్టల్ & ఆర్డర్లు" : "🌾 Farmer Portal & Orders"}</span>
                    </Link>

                    <Link
                      href="/requirements"
                      className="inline-flex items-center justify-center px-4 py-3.5 rounded-xl bg-stone-100 text-stone-800 font-semibold text-sm hover:bg-stone-200 transition gap-2"
                    >
                      <span>{language === "te" ? "కొనుగోలుదారుల డిమాండ్లు" : "Buyer Demands"}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/farmer/sell"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-base hover:bg-brand-deep transition shadow-card gap-2"
                    >
                      <Sprout className="w-5 h-5" />
                      <span>{t.hero.ctaFarmer}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>

                    <Link
                      href="/explore"
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border border-brand-border text-brand-textPrimary font-semibold text-base hover:bg-stone-50 transition shadow-subtle gap-2"
                    >
                      <Search className="w-5 h-5 text-brand-primary" />
                      <span>{t.hero.ctaBuyer}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold border border-emerald-300">
                  <span className="text-emerald-700">⚡</span>
                  <span>{language === "te" ? "1-నిమిషం కిసాన్ విక్రయం" : "1-Minute Quick Sell"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">
                  <span>⚖️</span>
                  <span>{language === "te" ? "ధర్మ కాంటా స్లిప్పులు" : "Dharma Kanta Slips"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-950 font-bold border border-sky-300">
                  <span>🛡️</span>
                  <span>{language === "te" ? "100% ఎస్క్రో & బ్యాంక్ సెటిల్మెంట్" : "100% Escrow Protected"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-bold border border-stone-200">
                  <span>🚛</span>
                  <span>{language === "te" ? "పొలం వద్దే లారీ పికప్" : "Farm-Gate Truck Logistics"}</span>
                </span>
              </div>

              {/* Stat Badges */}
              <div className="pt-6 border-t border-brand-border/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-brand-deep">18+</div>
                  <div className="text-xs text-stone-600">Major Mandis Monitored</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-brand-deep">₹15 – ₹160</div>
                  <div className="text-xs text-stone-600">Fair Quantity Fee Tiers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-brand-deep">100% Direct</div>
                  <div className="text-xs text-stone-600">Zero Middleman Surcharge</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Order Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-elevated border border-brand-border p-6 space-y-5 relative">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-deep">
                      Live Trade Sample
                    </span>
                  </div>
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium border border-emerald-200">
                    Terms Confirmed
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center text-3xl">
                    🌾
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-base">
                      Sona Masoori Paddy (BPT 5204)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Suryapet Farm Gate → Bowenpally Hyderabad
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ₹28.50 / kg
                      </span>
                      <span className="text-xs text-stone-600 font-medium">500 kg batch</span>
                    </div>
                  </div>
                </div>

                {/* Two-Way Agreement Details */}
                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 border border-stone-100">
                  <div className="flex justify-between text-stone-600">
                    <span>Seller:</span>
                    <span className="font-semibold text-stone-900">Ramesh Reddy (Verified Farmer)</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Buyer:</span>
                    <span className="font-semibold text-stone-900">Sri Venkateshwara Commodities</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Total Deal Value:</span>
                    <span className="font-bold text-emerald-800">₹14,250</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-500">
                    <span>SEEDSTACK Commission:</span>
                    <span className="font-semibold text-stone-800">₹160 (Farmer) / ₹160 (Buyer)</span>
                  </div>
                </div>

                {/* 4-Step Trade Lifecycle Track */}
                <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="block text-[10px] text-emerald-700 font-bold">1. ఆఫర్ ఖరారు</span>
                    <span className="text-[11px] font-extrabold text-emerald-950">Agreed</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="block text-[10px] text-emerald-700 font-bold">2. లారీ పికప్</span>
                    <span className="text-[11px] font-extrabold text-emerald-950">Dispatched</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="block text-[10px] text-emerald-700 font-bold">3. కాంటా స్లిప్</span>
                    <span className="text-[11px] font-extrabold text-emerald-950">500 kg Net</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <span className="block text-[10px] text-emerald-200 font-bold">4. చెల్లింపు</span>
                    <span className="text-[11px] font-extrabold">₹14,250 UPI</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Truck className="w-4 h-4 text-brand-primary" />
                    <span>Dispatched in Mini Van TS 08 UB 4519</span>
                  </div>
                  <Link
                    href="/tracking/del-101"
                    className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: DUAL ROLE GATEWAYS (రైతు & కొనుగోలుదారుల ప్రత్యేక ద్వారాలు) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farmer Portal Gateway Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col justify-between border-2 border-emerald-500/40 relative overflow-hidden group">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>రైతు పోర్టల్ (FARMER PORTAL)</span>
                </span>
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {language === "te"
                  ? "రైతుల కోసం సులభమైన అమ్మకాలు"
                  : "Dedicated Farmer Gateway"}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {language === "te"
                  ? "ఉచితంగా మీ పంటను లిస్ట్ చేయండి. ఫోన్‌పే, జీపే ద్వారా 100% నేరుగా మీ ఖాతాకు పూర్తి నగదు పొందండి. దళారీల ప్రమేయం మరియు కమీషన్ కోతలు లేవు."
                  : "List crops with zero upfront fees. Receive 100% direct bank and UPI payouts with zero broker cuts. Track farm-gate pickup trucks in real-time."}
              </p>
              <ul className="text-xs space-y-1.5 text-emerald-200 font-medium">
                <li className="flex items-center gap-2">✓ 1-నిమిషంలో ఫోటోలు & బస్తాలతో సులభ అమ్మకం (Kisan Simple Mode)</li>
                <li className="flex items-center gap-2">✓ తెలుగు వాయిస్ అసిస్టెంట్ & ఆడియో గైడ్ సదుపాయం</li>
                <li className="flex items-center gap-2">✓ 24/7 ఉచిత కిసాన్ వాట్సాప్ & కాల్ హెల్ప్‌లైన్</li>
              </ul>
            </div>
            <div className="pt-6 relative z-10">
              <Link
                href="/farmer/dashboard"
                className="w-full py-3.5 px-6 rounded-2xl bg-white text-emerald-950 font-black text-sm hover:bg-emerald-50 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{language === "te" ? "🌾 రైతు పోర్టల్‌లోకి ప్రవేశించండి" : "Enter Farmer Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Buyer Procurement Desk Gateway Card */}
          <div className="bg-gradient-to-br from-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col justify-between border-2 border-sky-500/40 relative overflow-hidden group">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>కొనుగోలుదారుల డెస్క్ (BUYER DESK)</span>
                </span>
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {language === "te"
                  ? "వాణిజ్య కొనుగోలుదారుల డెస్క్"
                  : "Commercial Buyer Procurement"}
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                {language === "te"
                  ? "తెలంగాణ & ఏపీ రైతుల నుండి నేరుగా నాణ్యమైన ధాన్యాలు, మిరప, పత్తి మరియు వాణిజ్య పంటల సేకరణ. లైవ్ బిడ్డింగ్ రూమ్ మరియు జీఎస్టీ ఇన్వాయిస్లు."
                  : "Procure verified quality paddy, chilli, cotton, and vegetables directly from verified farmers across Telangana & AP with live bidding and official GST invoices."}
              </p>
              <ul className="text-xs space-y-1.5 text-sky-200 font-medium">
                <li className="flex items-center gap-2">✓ లైవ్ మల్టీ-పార్టీ బిడ్డింగ్ రూమ్ & నెగోషియేషన్ చార్ట్</li>
                <li className="flex items-center gap-2">✓ ప్రభుత్వ ధృవీకృత నాణ్యతా రికార్డులు & గ్రేడింగ్</li>
                <li className="flex items-center gap-2">✓ అధికారిక జీఎస్టీ కమిషన్ వోచర్లు & బిల్లింగ్</li>
              </ul>
            </div>
            <div className="pt-6 relative z-10">
              <Link
                href="/buyer/dashboard"
                className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 text-white font-black text-sm hover:bg-sky-400 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{language === "te" ? "🏢 వ్యాపార డెస్క్‌లోకి ప్రవేశించండి" : "Enter Buyer Desk"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MARKETPLACE SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-elevated border border-brand-border p-4 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/explore";
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"
          >
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Crop Name / పంట పేరు
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Chilli, Paddy, Turmeric..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                Category / వర్గం
              </label>
              <select className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white">
                <option value="">All Categories</option>
                <option value="grains">Cereals & Grains (వరి & ధాన్యాలు)</option>
                <option value="spices">Spices (మిరప, పసుపు)</option>
                <option value="veg">Vegetables (కూరగాయలు)</option>
                <option value="cash">Cash Crops (పత్తి)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                District / జిల్లా
              </label>
              <select className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white">
                <option value="">All Districts (TS & AP)</option>
                <option value="Warangal">Warangal (వరంగల్)</option>
                <option value="Guntur">Guntur (గుంటూరు)</option>
                <option value="Suryapet">Suryapet (సూర్యాపేట)</option>
                <option value="Nizamabad">Nizamabad (నిజామాబాద్)</option>
                <option value="Khammam">Khammam (ఖమ్మం)</option>
                <option value="Vijayawada">Vijayawada (విజయవాడ)</option>
                <option value="Kurnool">Kurnool (కర్నూలు)</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 pt-4 sm:pt-0">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-deep transition flex items-center justify-center gap-2 shadow-subtle"
              >
                <Search className="w-4 h-4" />
                <span>Search Produce</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 3: BROWSE BY CROP CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deep">
              Browse by Agricultural Category
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Direct sourcing across staple grains, spices, vegetables, and commercial crops
            </p>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="bg-white rounded-xl p-5 border border-brand-border hover:border-brand-primary hover:shadow-card transition text-center group"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition">
                {cat.icon}
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-brand-primary transition">
                {language === "te" ? cat.nameTe : cat.nameEn}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURED CROP LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Farm Gate Supply</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-deep">
              Featured Verified Produce Listings
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>Explore All Crops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle hover:shadow-elevated transition flex flex-col"
            >
              <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                <img
                  src={crop.images[0]}
                  alt={crop.crop_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] font-bold text-brand-deep">
                  {crop.grade}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                  {crop.available_quantity.toLocaleString()} kg left
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {language === "te" && crop.crop_name_te ? crop.crop_name_te : crop.crop_name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {crop.district}, {crop.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                    <span>Farmer: {crop.farmer_name}</span>
                    {crop.farmer_verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Asking Price</span>
                    <span className="text-lg font-bold text-brand-deep">
                      ₹{crop.asking_price_per_unit}
                      <span className="text-xs text-stone-500 font-normal"> / kg</span>
                    </span>
                  </div>
                  <Link
                    href={`/explore/${crop.id}`}
                    className="px-3 py-1.5 rounded-lg bg-brand-light text-brand-deep text-xs font-semibold hover:bg-emerald-100 transition"
                  >
                    View & Offer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: HOW SEEDSTACK WORKS */}
      <section className="bg-white py-16 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-brand-deep mt-2">
              How SEEDSTACK Works
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Empowering farmers with direct commercial access while giving business buyers verified quality produce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Publish Listing or Requirement",
                desc: "Farmers post their harvested produce with quantity and asking price. Business buyers post specific sourcing requirements.",
                icon: Layers,
              },
              {
                step: "02",
                title: "Two-Way Price Negotiation",
                desc: "Either side submits offers and counters. Transparently agree on price per kg, batch volume, and farm-gate pickup conditions.",
                icon: Scale,
              },
              {
                step: "03",
                title: "Confirmed Order & Logistics",
                desc: "SEEDSTACK coordinates vehicle dispatch, temperature management, and live GPS route optimization across AP & Telangana.",
                icon: Truck,
              },
              {
                step: "04",
                title: "Direct Settlement & Low Fee",
                desc: "Buyer pays the farmer directly. SEEDSTACK bills a transparent, quantity-based commission tier only after successful delivery.",
                icon: Coins,
              },
            ].map((item, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-brand-warmBg border border-stone-200">
                <div className="text-2xl font-black text-emerald-200 mb-2">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-stone-900 text-base mb-2">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: FARMER & BUYER BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-brand-deep text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-card">
            <div className="relative z-10 space-y-5">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                For Farmers / రైతుల కొరకు
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold">
                Retain Your Hard-Earned Profit
              </h3>
              <p className="text-emerald-100/90 text-sm leading-relaxed">
                No middleman cartels. No arbitrary weight deductions. Direct access to wholesale merchants, food processing companies, and supermarket chains.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-emerald-50">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Free Produce Listings (zero listing fees)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Fair Price guidance benchmarking 18+ APMC mandis</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Farm-gate vehicle pickup coordinated by SEEDSTACK</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct payment settlement via Cash or Bank / UPI</span>
                </li>
              </ul>

              <div className="pt-3">
                <Link
                  href={isBuyer ? "/explore" : "/farmer/sell"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-deep font-semibold text-sm hover:bg-emerald-50 transition"
                >
                  <span>
                    {isBuyer
                      ? language === "te"
                        ? "రైతుల పంటల మార్కెట్ చూడండి"
                        : "Browse Farmer Lots"
                      : language === "te"
                      ? "పంటను ఇప్పుడే నమోదు చేయండి"
                      : "Post Your Crop Now"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-border shadow-card space-y-5">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              For Business Buyers / వ్యాపారుల కొరకు
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-deep">
              Reliable Direct Agricultural Sourcing
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Wholesalers, retail chains, supermarkets, and food processing plants can source authenticated harvest lots with verified quality and live delivery tracking.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Verified farmer profiles with government land records</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Two-way price negotiation with counteroffer logs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Multi-stop route optimization and live GPS vehicle tracking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0" />
                <span>Broadcast procurement requirements directly to producers</span>
              </li>
            </ul>

            <div className="pt-3">
              <Link
                href={isFarmer ? "/requirements" : "/requirements/post"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-deep transition shadow-subtle"
              >
                <span>
                  {isFarmer
                    ? language === "te"
                      ? "కొనుగోలుదారుల డిమాండ్లను చూడండి"
                      : "View Buyer Demands"
                    : language === "te"
                    ? "కొనుగోలు అవసరాన్ని పోస్ట్ చేయండి"
                    : "Post Sourcing Requirement"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: AI-POWERED AGRICULTURAL INSIGHTS */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explainable Baseline AI Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                AI Built for Agricultural Realities
              </h2>
              <p className="text-stone-400 text-sm sm:text-base max-w-2xl mt-2">
                We believe in transparent, honest AI. Our models provide explainable price benchmarks and demand forecasts without inventing arbitrary predictions.
              </p>
            </div>
            <Link
              href="/ai-insights"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>Explore AI Insights Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">AI Fair-Price Suggestions</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Calculates suggested low, modal, and high price ranges from Telangana and AP mandi arrivals, grade adjustments, and rainfall history.
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">14-Day Price Trend Forecasts</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Uses moving average drift and exponential smoothing to forecast modal price directions with transparent uncertainty bounds.
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Regional Demand Prediction</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Identifies upcoming commercial procurement surges across Hyderabad, Vijayawada, Guntur, and Nizamabad processing hubs.
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Route Optimization Engine</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Sequences multi-stop farm gate pickups and warehouse drop-offs using Haversine road algorithms and vehicle payload limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 & 10: TRANSPARENT QUANTITY-BASED COMMISSION ENGINE & INTERACTIVE CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-brand-border p-8 sm:p-12 shadow-card">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              No Hidden Charges • Strictly Fulfilled Quantity
            </span>
            <h2 className="text-3xl font-extrabold text-brand-deep mt-2">
              Transparent Quantity-Based Commission
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              SEEDSTACK charges a fair, transparent fixed fee based strictly on the actual fulfilled quantity at delivery. Publishing a listing is completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Table of Tiers */}
            <div className="lg:col-span-7 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase text-[11px]">
                    <th className="pb-3 font-semibold">Quantity Tier</th>
                    <th className="pb-3 font-semibold text-center">Farmer Fee (₹)</th>
                    <th className="pb-3 font-semibold text-center">Buyer Fee (₹)</th>
                    <th className="pb-3 font-semibold text-right">Total Platform Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {DEFAULT_COMMISSION_TIERS.map((tier) => (
                    <tr key={tier.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 font-medium text-stone-900">{tier.name}</td>
                      <td className="py-3 text-center font-bold text-brand-primary">
                        ₹{tier.farmer_fee_inr}
                      </td>
                      <td className="py-3 text-center font-bold text-brand-deep">
                        ₹{tier.buyer_fee_inr}
                      </td>
                      <td className="py-3 text-right font-bold text-stone-900">
                        ₹{tier.farmer_fee_inr + tier.buyer_fee_inr}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-stone-500 mt-3 italic">
                * For bulk commercial orders &gt;150 kg, a small ₹30 surcharge applies per additional 100 kg batch.
              </p>
            </div>

            {/* Interactive Calculator */}
            <div className="lg:col-span-5 bg-brand-warmBg rounded-2xl p-6 border border-brand-border space-y-4">
              <div className="flex items-center gap-2 text-brand-deep font-bold text-sm">
                <Calculator className="w-4 h-4 text-brand-primary" />
                <span>Interactive Commission Calculator</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fulfilled Order Quantity (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-base font-bold text-brand-deep border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                {[10, 50, 100, 150, 500].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setCalcQuantity(q)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      calcQuantity === q
                        ? "bg-brand-primary text-white font-bold"
                        : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {q} kg
                  </button>
                ))}
              </div>

              {/* Fee Results */}
              <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-600">Matched Tier:</span>
                  <span className="font-bold text-stone-900">{calcResult.tierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Farmer Payable Fee:</span>
                  <span className="font-bold text-brand-primary">₹{calcResult.farmerFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Buyer Payable Fee:</span>
                  <span className="font-bold text-brand-deep">₹{calcResult.buyerFee}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-stone-900 font-bold">
                  <span>Total SEEDSTACK Fee:</span>
                  <span className="text-emerald-700 text-sm">₹{calcResult.totalPlatformFee}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-normal">
                {calcResult.explanation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: TELUGU-FIRST DESIGN SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              తెలుగు భాష ప్రాధాన్యత • Farmer First Usability
            </span>
            <h2 className="text-3xl font-extrabold font-telugu leading-snug">
              రైతులకు అత్యంత సులభమైన సాంకేతిక వేదిక
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-telugu">
              డిజిటల్ పరిజ్ఞానం తక్కువగా ఉన్న రైతులకు కూడా అర్థమయ్యే విధంగా స్పష్టమైన తెలుగు పదాలు, పెద్ద బటన్లు మరియు ఫోన్ లో సులభంగా వాడగలిగే సరళమైన డిజైన్.
            </p>
            <div className="pt-2">
              <Link
                href={isBuyer ? "/buyer/dashboard" : "/farmer/sell"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 transition"
              >
                <span>
                  {isBuyer
                    ? language === "te"
                      ? "కొనుగోలుదారుల డెస్క్‌కు వెళ్లండి"
                      : "Go to Buyer Desk"
                    : language === "te"
                    ? "పంటను నమోదు చేయండి"
                    : "Post Your Crop"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-brand-deep">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Answers regarding trading terms, commission billing, logistics, and verification
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-sm sm:text-base font-bold text-brand-deep hover:bg-stone-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
