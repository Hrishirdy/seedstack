"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  X,
  Search,
  MapPin,
  RefreshCw,
  Building2,
  ExternalLink,
} from "lucide-react";
import { MandiTickerItem } from "@/app/api/market/ticker/route";

export const LiveMandiTicker: React.FC = () => {
  const { language } = useLanguage();
  const [quotes, setQuotes] = useState<MandiTickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<"ALL" | "Telangana" | "Andhra Pradesh">("ALL");

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch("/api/market/ticker");
        if (res.ok) {
          const data = await res.json();
          setQuotes(data.quotes || []);
        }
      } catch (err) {
        console.error("Failed to load mandi quotes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter((q) => {
    if (stateFilter !== "ALL" && q.state !== stateFilter) return false;
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return (
      q.crop.toLowerCase().includes(term) ||
      q.cropTe.toLowerCase().includes(term) ||
      q.mandi.toLowerCase().includes(term) ||
      q.district.toLowerCase().includes(term)
    );
  });

  return (
    <>
      {/* Ticker Strip */}
      <div className="bg-stone-900 border-b border-stone-800 text-stone-200 py-1.5 px-3 sm:px-4 text-xs select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Header Tag with Live Pulse */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-emerald-400">
              {language === "te" ? "లైవ్ మార్కెట్ ధరలు" : "APMC Mandi Live"}
            </span>
            <span className="hidden md:inline text-[10px] text-stone-400 border-l border-stone-700 pl-2">
              {language === "te" ? "తెలంగాణ & ఆంధ్రప్రదేశ్" : "TS & AP Yards"}
            </span>
          </div>

          {/* Scrolling / Flex Items */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3 py-0.5">
            {loading && quotes.length === 0 ? (
              <span className="text-stone-400 text-[11px] animate-pulse">
                {language === "te" ? "ధరల వివరాలు లోడ్ అవుతున్నాయి..." : "Fetching APMC Mandi rates..."}
              </span>
            ) : (
              quotes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 hover:border-emerald-500/50 transition-all flex-shrink-0 text-left cursor-pointer group"
                >
                  <span className="font-bold text-stone-100 text-[11px] group-hover:text-emerald-300 transition">
                    {language === "te" ? q.cropTe : q.crop.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {q.district}:
                  </span>
                  <span className="font-black text-white text-[11px]">
                    ₹{q.modalPricePerQtl.toLocaleString("en-IN")}/క్విం
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1 rounded ${
                      q.delta24h >= 0
                        ? "text-emerald-400 bg-emerald-950/60"
                        : "text-rose-400 bg-rose-950/60"
                    }`}
                  >
                    {q.delta24h >= 0 ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {q.delta24h > 0 ? `+${q.delta24h}%` : `${q.delta24h}%`}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Open Full Market Board Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline px-2 py-0.5 rounded bg-stone-800 border border-stone-700 transition"
          >
            <span>{language === "te" ? "పూర్తి మార్కెట్ బోర్డు" : "All Mandi Rates"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Full APMC Mandi Modal */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    {language === "te"
                      ? "నేటి APMC మార్కెట్ యార్డ్ ధరలు (లైవ్)"
                      : "Live APMC Mandi Market Rates"}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      e-NAM SYNC
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    {language === "te"
                      ? "తెలంగాణ & ఆంధ్రప్రదేశ్ ప్రభుత్వ నియంత్రిత మార్కెట్ కమిటీల అధికారిక ధరలు"
                      : "Official wholesale modal, minimum, and maximum prices from Telangana & AP yards"}
                  </p>
                </div>
              </div>

              {/* Prominent Cross Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 hover:bg-rose-600 text-stone-300 hover:text-white text-xs font-bold transition border border-stone-700 hover:border-rose-700 shadow-sm"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">
                  {language === "te" ? "రద్దు" : "Close"}
                </span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="p-4 sm:p-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    language === "te"
                      ? "పంట లేదా మార్కెట్ యార్డ్ వెతకండి..."
                      : "Search crop or mandi yard..."
                  }
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* State Filter Pills */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setStateFilter("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    stateFilter === "ALL"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  {language === "te" ? "అన్ని మార్కెట్లు" : "All Yards"}
                </button>
                <button
                  onClick={() => setStateFilter("Telangana")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    stateFilter === "Telangana"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  Telangana
                </button>
                <button
                  onClick={() => setStateFilter("Andhra Pradesh")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    stateFilter === "Andhra Pradesh"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-100"
                  }`}
                >
                  Andhra Pradesh
                </button>
              </div>
            </div>

            {/* Mandi Cards List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-sm">
                  {language === "te"
                    ? "ఫలితాలు ఏవీ దొరకలేదు"
                    : "No matching mandi price observations found"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filteredQuotes.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-200 hover:border-emerald-400 rounded-2xl p-4 shadow-xs hover:shadow-card transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1 border border-emerald-100">
                              {item.category} • {item.grade}
                            </span>
                            <h4 className="font-extrabold text-sm sm:text-base text-stone-900 leading-tight">
                              {language === "te" ? item.cropTe : item.crop}
                            </h4>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${
                              item.delta24h >= 0
                                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                : "text-rose-700 bg-rose-50 border border-rose-200"
                            }`}
                          >
                            {item.delta24h >= 0 ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {item.delta24h > 0 ? `+${item.delta24h}%` : `${item.delta24h}%`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                          <span className="font-semibold text-stone-700">
                            {language === "te" ? item.mandiTe : item.mandi}
                          </span>
                          <span className="text-stone-400 font-normal">
                            ({item.district}, {item.state})
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center bg-stone-50/80 p-2.5 rounded-xl">
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                            {language === "te" ? "కనీస ధర" : "Min Rate"}
                          </span>
                          <span className="text-xs font-bold text-stone-700">
                            ₹{item.minPricePerQtl.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="border-x border-stone-200">
                          <span className="text-[10px] text-emerald-800 uppercase block font-black">
                            {language === "te" ? "ప్రధాన మోడల్ ధర" : "Modal Rate"}
                          </span>
                          <span className="text-sm font-black text-emerald-700">
                            ₹{item.modalPricePerQtl.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            ₹{item.pricePerKg}/kg
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-500 uppercase block font-semibold">
                            {language === "te" ? "గరిష్ట ధర" : "Max Rate"}
                          </span>
                          <span className="text-xs font-bold text-stone-700">
                            ₹{item.maxPricePerQtl.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500 px-1">
                        <span>
                          {language === "te" ? "నేటి రాక:" : "Arrivals:"}{" "}
                          <strong className="text-stone-700">{item.arrivalsTons} టన్నులు</strong>
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 flex-shrink-0">
              <span>
                {language === "te"
                  ? "గమనిక: ఈ ధరలు రైతుల రిఫరెన్స్ కోసం మాత్రమే. సీడ్‌స్టాక్‌లో మీరు ఎలాంటి కమీషన్ లేకుండా మీ సొంత ధరను నిర్ణయించవచ్చు."
                  : "Note: APMC rates are advisory benchmarks. You can set your own farm asking price with 0% middleman commission on SeedStack."}
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition flex-shrink-0 ml-4"
              >
                {language === "te" ? "ముగించు (Close)" : "Close Market Board"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
