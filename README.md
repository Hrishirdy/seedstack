# SEEDSTACK — AI-Powered Agricultural Marketplace (Telangana & Andhra Pradesh)

> **"From Farm to Market. Fair Prices. Smarter Agriculture."**  
> *Empowering Farmers. Connecting Markets. Growing Together.*

---

## 🌾 1. Overview & Geographic Scope

**SEEDSTACK** is a complete, mobile-first agricultural technology marketplace designed to disintermediate the supply chain between crop producers (farmers) and commercial buyers (wholesale merchants, retail supermarkets, and agro-processing plants) across **Telangana and Andhra Pradesh, India**.

### Core Problem Solved:
Smallholder and commercial farmers frequently suffer from arbitrary middleman cuts, unverified deductions, opaque commission structures, and lack of real-time market price discovery. SEEDSTACK introduces:
1. **Two-Way Marketplace**: Both **Farmer-to-Buyer** (Crop Listings) and **Buyer-to-Farmer** (Procurement Requirements) workflows.
2. **Interactive Two-Way Negotiation Engine**: Bilateral proposals and counteroffers before order terms are locked.
3. **Quantity-Based Commission Tiers**: A transparent, fixed platform fee calculated **strictly on actual fulfilled kilograms at delivery**, with **zero upfront listing fee**.
4. **End-to-End Logistics & Live GPS Tracking**: Farm-gate collection coordinated via OpenStreetMap / Leaflet navigation and temperature monitoring.
5. **Explainable Agricultural AI**:
   - **AI Fair-Price Guidance**: Benchmarked against 18+ regional APMC mandis (Guntur, Suryapet, Warangal, Bowenpally, Nizamabad).
   - **14-Day Mandi Price Trend Predictions**: Moving average drift and exponential smoothing with confidence bounds.
   - **Regional Demand Forecasting**: Upcoming metric tonne procurement trends.
   - **Multi-Stop Route Optimization**: Haversine road algorithms with vehicle payload constraints.
6. **Telugu-First Accessibility (తెలుగు)**: Genuine bilingual localization throughout navigation, forms, dashboards, and error messages.

---

## 🛠️ 2. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS with custom SEEDSTACK agricultural design tokens
- **Icons**: Lucide React
- **Data Visualization**: Recharts (price trends and area charts)
- **Mapping & Routing**: Leaflet with OpenStreetMap tiles (keyless for development)
- **Validation & Forms**: React Hook Form and Zod schemas
- **Database & Auth**: Supabase PostgreSQL schema, RLS policies, migrations, and a stateful in-memory/localStorage demo store for zero-config local evaluation
- **Unit Testing**: Vitest (17 tests covering commission tiers, boundary quantities, overselling prevention, and routing heuristics)

---

## 🚀 3. Quick Start & Execution

### Prerequisites:
- Node.js (v18+ or v20+)
- npm

### 1. Install Dependencies:
```bash
npm install
```

### 2. Run the Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Unit Tests:
```bash
npm test
```
Executes all 17 automated tests for the commission engine, order lifecycle, and route optimization.

### 4. Build for Production:
```bash
npm run build
npm start
```

---

## 👥 4. Testing User Personas in Evaluation Mode

SEEDSTACK includes a built-in **Evaluation Mode Persona Switcher** located in the top navigation bar. You can instantly switch between the following pre-configured personas without having to log in and out:

| Persona Name | Role | Region | Verification Status | Features to Test |
| :--- | :--- | :--- | :--- | :--- |
| **Ramesh Reddy** | Farmer (రైతు) | Suryapet, TS | Approved | Post new crop lots, review buyer offers, confirm payment receipt, view delivery progress |
| **Anjaiah Varma** | Farmer (రైతు) | Warangal, TS | Pending Review | Simulated pending state; document review required before public listing |
| **Venkat Rao** | Wholesaler | Hyderabad, TS | Approved | Browse marketplace, negotiate prices, submit counteroffers, track delivery |
| **FreshKart** | Supermarket | Vijayawada, AP | Approved | Broadcast procurement requirements, accept farmer quotes, monitor refrigerated logistics |
| **K. Srinivas Rao** | Platform Admin | Hyderabad, TS | Approved | Review ID verification queue, configure commission tiers, view audit logs, export CSV |

---

## 💰 5. Quantity-Based Commission Fee Structure

Unlike traditional marketplaces that charge unpredictable percentage cuts on market prices, SEEDSTACK charges a **fair fixed fee based strictly on actual fulfilled delivery weight**:

| Fulfilled Quantity Tier | Farmer Fee (₹) | Buyer Fee (₹) | Total Platform Fee (₹) | Effective Rate on ₹15,000 Order |
| :--- | :---: | :---: | :---: | :---: |
| **1–10 kg** (Micro Batch) | ₹15 | ₹15 | ₹30 | ~0.2% |
| **11–50 kg** (Small Retail) | ₹40 | ₹40 | ₹80 | ~0.5% |
| **51–100 kg** (Standard Commercial) | ₹75 | ₹75 | ₹150 | ~1.0% |
| **101–150 kg** (Wholesale Batch) | ₹110 | ₹110 | ₹220 | ~1.4% |
| **&gt; 150 kg** (Bulk Commercial) | ₹160 + ₹30/100kg | ₹160 + ₹30/100kg | ₹320 + ₹60/100kg | ~2.1% |

*Listing produce is always 100% free.*

---

## 🤖 6. Honest AI & Integration Disclosures

| Module | Implementation Status | Data Source / Algorithm |
| :--- | :--- | :--- |
| **AI Price Guidance** | Fully functional | Explainable statistical benchmark derived from AGMARKNET & e-NAM modal records for TS/AP |
| **14-Day Price Trends** | Fully functional | 30-day historical moving average drift with exponential smoothing and uncertainty bounds |
| **Demand Prediction** | Fully functional | Regional commodity volume models across Hyderabad, Guntur, and Vijayawada industrial corridors |
| **Route Optimization** | Fully functional | Multi-stop Haversine road sequencing with vehicle load capacity heuristics |
| **GPS Vehicle Tracking** | Fully functional (Simulated stream) | Active highway simulation from Chevella to Vijayawada; connects to driver mobile client |
| **Government ID Review** | Fully functional (Simulated vault) | Private document review queue; connects to Dharani / Meeseva API when credentials are provided |
| **Direct Settlement** | Fully functional | Buyer-to-farmer direct payment recording with confirmation audit; commission logged separately |

---

## 📁 7. Project Structure

```
src/
├── app/
│   ├── page.tsx                     # 13-section responsive public landing page
│   ├── explore/                     # Crop discovery marketplace & detail view
│   ├── requirements/                # Buyer requirements discovery & posting form
│   ├── farmer/                      # Farmer dashboard, sell crop form, order manager
│   ├── buyer/                       # Buyer dashboard & two-way negotiation thread
│   ├── tracking/                    # Interactive Leaflet live GPS delivery map
│   ├── admin/                       # Administration console, ID review queue, fee tier editor
│   ├── ai-insights/                 # AI Price benchmark, trend charts, demand forecast, route optimizer
│   ├── auth/                        # Multi-step registration wizard & login switcher
│   └── api/                         # Backend Next.js REST API endpoints
├── components/                      # UI, layout, marketplace modals, and map wrappers
├── lib/
│   ├── store/demo-store.ts          # Stateful, reactive in-memory & LocalStorage store
│   ├── commissions/                 # Quantity-based commission calculation engine
│   ├── ai/                          # Explainable price advisor, trend forecaster, demand predictor
│   ├── logistics/                   # Haversine route optimizer & vehicle payload checker
│   ├── i18n/                        # Telugu (తెలుగు) & English localization dictionaries
│   └── types.ts                     # TypeScript domain models
├── tests/                           # Vitest automated test suites
└── database/
    ├── schema.sql                   # Complete PostgreSQL Supabase database schema with RLS
    └── seeds.sql                    # Initial seed data for mandis, categories, and tiers
```

---

## 📄 License
Academic and Prototype License — Developed for SEEDSTACK Agricultural Technologies Ltd.
