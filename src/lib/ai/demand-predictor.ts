import { DemandForecast } from '../types';

export const REGIONAL_DEMAND_FORECASTS: DemandForecast[] = [
  {
    crop_name: "Chilli (Teja Variety)",
    crop_category: "Spices & Cash Crops",
    region: "Guntur / Krishna / Khammam Belt",
    forecast_month: "Upcoming Quarter",
    expected_demand_tonnes: 1450,
    change_vs_last_month_pct: 18.5,
    confidence_label: "High (Validated by Cold Storage Bookings)",
    key_driver: "Export contracts to Southeast Asia & domestic spice blenders.",
  },
  {
    crop_name: "Paddy (Sona Masoori BPT 5204)",
    crop_category: "Cereals & Grains",
    region: "Nalgonda / Suryapet / Karimnagar",
    forecast_month: "Upcoming Quarter",
    expected_demand_tonnes: 3200,
    change_vs_last_month_pct: 12.0,
    confidence_label: "High (Miller Off-take Rate)",
    key_driver: "Wholesale millers and supermarket distribution centers restocking.",
  },
  {
    crop_name: "Turmeric (Nizamabad Finger)",
    crop_category: "Spices",
    region: "Nizamabad / Jagtial / Nirmal",
    forecast_month: "Upcoming Quarter",
    expected_demand_tonnes: 820,
    change_vs_last_month_pct: 22.4,
    confidence_label: "Moderate-High (Ayurvedic & Food Extractors)",
    key_driver: "Pharma extraction facilities seeking high curcumin (>4.2%) lots.",
  },
  {
    crop_name: "Red Onion",
    crop_category: "Vegetables",
    region: "Kurnool / Kadapa / Mahabubnagar",
    forecast_month: "Next 30 Days",
    expected_demand_tonnes: 1100,
    change_vs_last_month_pct: -5.2,
    confidence_label: "Moderate (Consumer Market Supply Satiation)",
    key_driver: "Local supply inflow stabilizing Hyderabad and Vijayawada retail demand.",
  },
  {
    crop_name: "Hybrid Tomato",
    crop_category: "Vegetables",
    region: "Madanapalle / Rangareddy / Medak",
    forecast_month: "Next 30 Days",
    expected_demand_tonnes: 1850,
    change_vs_last_month_pct: 15.8,
    confidence_label: "High (Processing & Retail Consumption)",
    key_driver: "Food processing ketchup manufacturers booking wholesale lots.",
  },
  {
    crop_name: "Cotton (Long Staple)",
    crop_category: "Fibre & Cash Crops",
    region: "Warangal / Adilabad / Khammam",
    forecast_month: "Upcoming Quarter",
    expected_demand_tonnes: 2600,
    change_vs_last_month_pct: 8.7,
    confidence_label: "Moderate (Spinning Mill Operating Capacity)",
    key_driver: "Spinning mills replenishing yarn inventories ahead of seasonal textile demand.",
  },
];

export function getDemandForecasts(categoryFilter?: string): DemandForecast[] {
  if (!categoryFilter || categoryFilter === 'all') {
    return REGIONAL_DEMAND_FORECASTS;
  }
  return REGIONAL_DEMAND_FORECASTS.filter((f) =>
    f.crop_category.toLowerCase().includes(categoryFilter.toLowerCase())
  );
}
