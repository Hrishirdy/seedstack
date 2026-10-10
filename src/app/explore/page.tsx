"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/auth-context";
import { demoStore } from "@/lib/store/demo-store";
import { CropListing } from "@/lib/types";
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  ArrowUpDown,
  Sparkles,
  Layers,
  ChevronRight,
  Sprout,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { VoiceAssistantButton } from "@/components/ui/VoiceAssistantButton";
import { AgroWeatherWidget } from "@/components/ui/AgroWeatherWidget";

export default function ExploreCropsPage() {
  const { t, language } = useLanguage();
  const { user, isFarmer, isBuyer } = useAuth();
  const allListings = demoStore.getListings();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<"latest" | "price_low" | "price_high" | "quantity">(
    "latest"
  );

  const filteredListings = useMemo(() => {
    return allListings
      .filter((crop) => {
        const matchesSearch =
          crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (crop.crop_name_te && crop.crop_name_te.includes(searchTerm)) ||
          crop.district.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || crop.category_id === selectedCategory;

        const matchesDistrict =
          selectedDistrict === "all" || crop.district === selectedDistrict;

        const matchesPrice = crop.asking_price_per_unit <= maxPrice;

        return matchesSearch && matchesCategory && matchesDistrict && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price_low") return a.asking_price_per_unit - b.asking_price_per_unit;
        if (sortBy === "price_high") return b.asking_price_per_unit - a.asking_price_per_unit;
        if (sortBy === "quantity") return b.available_quantity - a.available_quantity;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [allListings, searchTerm, selectedCategory, selectedDistrict, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Farm Gate Marketplace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-deep">
            {t.nav.exploreCrops}
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Discover verified farm lots across Telangana and Andhra Pradesh with transparent asking prices
          </p>
        </div>

        {/* Live Agro-Weather & Transit Safety API widget */}
        <div className="lg:w-96 flex-shrink-0">
          <AgroWeatherWidget initialDistrict="guntur" />
        </div>
      </div>

      {/* Farmer Seller Prompt Banner */}
      {isFarmer && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">
                {language === "te" ? "రైతు విక్రయాల డెస్క్" : "Farmer Produce Portal"}
              </h3>
              <p className="text-xs text-emerald-100/90">
                {language === "te"
                  ? "మీ పంటను మార్కెట్‌లో వేలమంది వ్యాపారులకు నేరుగా విక్రయించండి. 1-నిమిషంలో లిస్ట్ చేయండి."
                  : "Sell your harvest lots directly to commercial buyers across TS & AP without middlemen."}
              </p>
            </div>
          </div>
          <Link
            href="/farmer/sell"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shrink-0 text-center transition shadow"
          >
            {language === "te" ? "🌾 మీ పంటను అమ్మండి" : "🌾 Sell Your Crop"}
          </Link>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4">
        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {[
            { id: "all", label: language === "te" ? "అన్నీ (All)" : "All Crops", icon: "🌾" },
            { id: "cat-grains", label: language === "te" ? "వరి & ధాన్యాలు" : "Paddy & Grains", icon: "🌾" },
            { id: "cat-spices", label: language === "te" ? "మిర్చి & పసుపు" : "Chilli & Spices", icon: "🌶️" },
            { id: "cat-veg", label: language === "te" ? "కూరగాయలు" : "Vegetables", icon: "🍅" },
            { id: "cat-cash", label: language === "te" ? "పత్తి & వాణిజ్య" : "Cotton & Cash", icon: "🌿" },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-primary text-white font-black shadow-subtle"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input with Voice Search */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder={language === "te" ? "పంట లేదా జిల్లా పేరును వెతకండి..." : "Search crop or district..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <VoiceAssistantButton
              onTranscript={(text) => setSearchTerm(text)}
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-stone-700"
            >
              <option value="all">All Categories</option>
              <option value="cat-grains">Cereals & Paddy (వరి)</option>
              <option value="cat-spices">Spices & Mirchi (మిరప, పసుపు)</option>
              <option value="cat-veg">Vegetables (కూరగాయలు)</option>
              <option value="cat-cash">Cash Crops (పత్తి)</option>
            </select>
          </div>

          {/* District */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-stone-700"
            >
              <option value="all">All Districts (TS & AP)</option>
              <option value="Suryapet">Suryapet</option>
              <option value="Guntur">Guntur</option>
              <option value="Warangal">Warangal</option>
              <option value="Nizamabad">Nizamabad</option>
              <option value="Khammam">Khammam</option>
              <option value="Rangareddy">Rangareddy</option>
              <option value="Kurnool">Kurnool</option>
              <option value="Vijayawada">Vijayawada</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white text-stone-700"
            >
              <option value="latest">Sort: Latest Listings</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="quantity">Available Quantity</option>
            </select>
          </div>
        </div>

        {/* Price Slider Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <span>Max Price Filter:</span>
            <input
              type="range"
              min="20"
              max="300"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-40 accent-brand-primary"
            />
            <span className="font-bold text-brand-deep">₹{maxPrice}/kg</span>
          </div>
          <div>
            Showing <span className="font-bold text-brand-deep">{filteredListings.length}</span> verified lots
          </div>
        </div>
      </div>

      {/* Grid of Crops */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-brand-border p-8">
          <Layers className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800">No matching produce found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or price threshold to see more available farmer lots.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDistrict("all");
              setMaxPrice(300);
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-brand-light text-brand-deep text-xs font-semibold hover:bg-emerald-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-subtle hover:shadow-elevated transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={crop.images[0]}
                    alt={crop.crop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] font-bold text-brand-deep">
                    {crop.grade}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/80 text-white px-2 py-0.5 rounded-md text-[11px] font-medium">
                    {crop.available_quantity.toLocaleString()} kg available
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-brand-primary transition">
                      {language === "te" && crop.crop_name_te ? crop.crop_name_te : crop.crop_name}
                    </h3>
                    <p className="text-xs text-stone-500">{crop.variety}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>
                      {crop.district}, {crop.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100">
                    <span className="font-medium truncate">{crop.farmer_name}</span>
                    {crop.farmer_verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Asking Price</span>
                    <span className="text-xl font-bold text-brand-deep">
                      ₹{crop.asking_price_per_unit}
                      <span className="text-xs text-stone-500 font-normal"> / kg</span>
                    </span>
                  </div>
                  <Link
                    href={`/explore/${crop.id}`}
                    className="px-3.5 py-2 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-deep transition shadow-subtle flex items-center gap-1"
                  >
                    <span>
                      {isFarmer
                        ? crop.farmer_id === user?.id
                          ? language === "te"
                            ? "మీ సొంత పంట"
                            : "Your Lot"
                          : language === "te"
                          ? "వివరాలు & ధరలు"
                          : "View Rates"
                        : language === "te"
                        ? "కొనండి / బిడ్"
                        : "View & Bid / Buy"}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
