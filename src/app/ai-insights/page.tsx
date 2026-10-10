"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { getPriceSuggestion, TELANGANA_AP_MANDI_BENCHMARKS } from "@/lib/ai/price-advisor";
import { generatePriceTrendForecast } from "@/lib/ai/trend-forecaster";
import { getDemandForecasts } from "@/lib/ai/demand-predictor";
import { optimizeLogisticsRoute, LocationPoint } from "@/lib/logistics/route-optimizer";
import {
  Sparkles,
  TrendingUp,
  Scale,
  Truck,
  Layers,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function AIInsightsPage() {
  const { t, language } = useLanguage();

  // Tab State
  const [activeTab, setActiveTab] = useState<"pricing" | "trends" | "demand" | "routes">("pricing");

  // Price Guidance State
  const cropList = Object.keys(TELANGANA_AP_MANDI_BENCHMARKS);
  const [selectedCrop, setSelectedCrop] = useState<string>(cropList[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>("Grade A");
  const priceAdvisorResult = getPriceSuggestion(selectedCrop, selectedGrade);

  // Trend Forecaster State
  const trendData = generatePriceTrendForecast(selectedCrop);

  // Demand Forecasts
  const demandForecasts = getDemandForecasts();

  // Route Optimizer State
  const sampleStops: LocationPoint[] = [
    {
      id: "stop-1",
      name: "Chevella Greenhouse (Farmer Ramesh)",
      lat: 17.3075,
      lng: 78.1362,
      type: "pickup",
      cropName: "Tomato",
      quantityKg: 300,
    },
    {
      id: "stop-2",
      name: "Chivvemla Farm Gate (Farmer Anjaiah)",
      lat: 17.1439,
      lng: 79.6239,
      type: "pickup",
      cropName: "Paddy",
      quantityKg: 500,
    },
    {
      id: "stop-3",
      name: "Bowenpally Wholesale Yard (Merchant Venkat)",
      lat: 17.4735,
      lng: 78.4728,
      type: "dropoff",
      cropName: "Consolidated Batch",
      quantityKg: 800,
    },
  ];
  const [vehicleCapacity, setVehicleCapacity] = useState<number>(1500);
  const routeResult = optimizeLogisticsRoute(sampleStops, vehicleCapacity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable Agricultural Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-deep">
          Agricultural AI Insights & Optimization
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl">
          Statistical mandi price benchmarks, moving-average trend projections, regional commodity demand, and multi-stop logistics route planning
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border space-x-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("pricing")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "pricing"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Fair-Price Benchmarking</span>
        </button>

        <button
          onClick={() => setActiveTab("trends")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "trends"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>14-Day Mandi Price Trends</span>
        </button>

        <button
          onClick={() => setActiveTab("demand")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "demand"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Regional Demand Forecasting</span>
        </button>

        <button
          onClick={() => setActiveTab("routes")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === "routes"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-stone-500 hover:text-stone-900"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Route Optimization Engine</span>
        </button>
      </div>

      {/* TAB 1: FAIR-PRICE BENCHMARKING */}
      {activeTab === "pricing" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-deep">Select Commodity</h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Crop Name
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
              >
                {cropList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Grade / Quality
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
              >
                <option value="Grade A">Grade A (Premium / Clean)</option>
                <option value="Grade B">Grade B (Standard)</option>
                <option value="Organic">Organic Certified</option>
              </select>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 space-y-1">
              <span className="font-semibold text-stone-800">Methodology:</span>
              <p className="text-[11px] leading-relaxed">
                Calculated from regional APMC Mandi daily arrivals, grade multipliers, and seasonal trade momentum.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-brand-deep">
                  {priceAdvisorResult.crop_name}
                </h2>
                <p className="text-xs text-stone-500">
                  Primary Mandi Yard: {priceAdvisorResult.market_name} ({priceAdvisorResult.district}, {priceAdvisorResult.state})
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {priceAdvisorResult.data_quality_label}
              </span>
            </div>

            {/* Triad */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 uppercase font-semibold block">
                  Observed Mandi Low
                </span>
                <span className="text-2xl font-bold text-stone-800 mt-1 block">
                  ₹{priceAdvisorResult.suggested_low_per_kg}
                </span>
                <span className="text-[10px] text-stone-400">per kg</span>
              </div>

              <div className="p-4 rounded-2xl bg-brand-light border border-emerald-300 shadow-subtle">
                <span className="text-xs text-brand-deep uppercase font-bold block">
                  Modal Benchmark
                </span>
                <span className="text-3xl font-extrabold text-brand-deep mt-1 block">
                  ₹{priceAdvisorResult.suggested_modal_per_kg}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">fair reference price</span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 uppercase font-semibold block">
                  Observed Mandi High
                </span>
                <span className="text-2xl font-bold text-stone-800 mt-1 block">
                  ₹{priceAdvisorResult.suggested_high_per_kg}
                </span>
                <span className="text-[10px] text-stone-400">per kg</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                Key Influencing Observations
              </h4>
              <ul className="space-y-1.5 text-stone-600">
                {priceAdvisorResult.influencing_factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-stone-500 italic pt-3 border-t border-stone-100">
              {priceAdvisorResult.disclaimer}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: 14-DAY PRICE TREND FORECASTS */}
      {activeTab === "trends" && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-brand-deep">
                {selectedCrop} — 30-Day Mandi History & 14-Day Forecast
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Baseline exponential smoothing with upper and lower volatility bounds
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Commodity:</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg bg-white"
              >
                {cropList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-light border border-emerald-200 text-xs text-brand-deep flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Forecast Direction: </span>
              <span>{trendData.explanation}</span>
            </div>
          </div>

          {/* Recharts Line / Area Chart */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.points}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B45" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#176B45" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${value}/kg`, "Price"]}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                />
                <Area
                  type="monotone"
                  dataKey="predicted_modal_per_kg"
                  stroke="#176B45"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                  name="Modal Price (₹/kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-stone-400 italic text-center">
            Historical observations are benchmarked to Telangana & AP Mandi records. 14-day projections utilize moving average slope.
          </p>
        </div>
      )}

      {/* TAB 3: REGIONAL DEMAND FORECASTING */}
      {activeTab === "demand" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandForecasts.map((df, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {df.crop_category}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      df.change_vs_last_month_pct >= 0 ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {df.change_vs_last_month_pct >= 0 ? "+" : ""}
                    {df.change_vs_last_month_pct}% vs last month
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-stone-900">{df.crop_name}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">{df.region}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Projected Demand:</span>
                    <span className="font-bold text-brand-deep">
                      {df.expected_demand_tonnes.toLocaleString()} MT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Confidence:</span>
                    <span className="font-medium text-stone-800">{df.confidence_label}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed italic">
                  Key driver: {df.key_driver}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ROUTE OPTIMIZATION ENGINE */}
      {activeTab === "routes" && (
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-brand-deep">
                Multi-Stop Agricultural Route Sequencing
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Haversine road algorithms optimizing farm-gate collection and terminal delivery
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Vehicle Capacity:</span>
              <select
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(Number(e.target.value))}
                className="px-3 py-1.5 text-xs font-bold border border-stone-300 rounded-lg bg-white"
              >
                <option value="750">Tata Ace (750 kg)</option>
                <option value="1500">Ashok Leyland Dost (1,500 kg)</option>
                <option value="3500">Eicher 14-ft (3,500 kg)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-light border border-emerald-200 text-xs text-brand-deep">
            <span className="font-bold">Optimizer Plan: </span>
            <span>{routeResult.summaryNote}</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
              Generated Waypoint Sequence
            </h4>

            <div className="space-y-3">
              {routeResult.orderedStops.map((stop) => (
                <div
                  key={stop.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {stop.stopSequence}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{stop.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {stop.type === "pickup" ? "Farm Gate Pickup" : "Terminal Warehouse Dropoff"} • {stop.cropName} ({stop.quantityKg} kg)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-stone-600 sm:text-right">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Segment</span>
                      <span className="font-bold">{stop.distanceFromPreviousKm} km</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Cumulative</span>
                      <span className="font-bold">{stop.cumulativeDistanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Payload</span>
                      <span className="font-bold text-emerald-800">{stop.cumulativePayloadKg} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
