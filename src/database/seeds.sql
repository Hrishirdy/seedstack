-- ==============================================================================
-- SEEDSTACK AGRICULTURAL MARKETPLACE — SEED DATA SCRIPT
-- Region: Telangana and Andhra Pradesh, India
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO crop_categories (id, name_en, name_te, slug, icon_name, description) VALUES
('11111111-1111-1111-1111-111111111101', 'Cereals & Paddy', 'ధాన్యాలు & వరి', 'cereals-paddy', 'wheat', 'Staple grains including Sona Masoori, BPT, Maize, and Millets'),
('11111111-1111-1111-1111-111111111102', 'Spices & Condiments', 'మసాలా దినుసులు', 'spices-condiments', 'flame', 'Export-grade Guntur Teja Chilli, Nizamabad Turmeric'),
('11111111-1111-1111-1111-111111111103', 'Fresh Vegetables', 'తాజా కూరగాయలు', 'fresh-vegetables', 'carrot', 'Hybrid Tomatoes, Kurnool Red Onions, Chillies'),
('11111111-1111-1111-1111-111111111104', 'Cash Crops & Fibre', 'వాణిజ్య పంటలు', 'cash-crops', 'feather', 'Adilabad Cotton, Soyabean, Castor'),
('11111111-1111-1111-1111-111111111105', 'Pulses & Legumes', 'పప్పుధాన్యాలు', 'pulses-legumes', 'circle-dot', 'Tandur Red Gram, Bengal Gram (Chana)')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Commission Tiers
INSERT INTO commission_tiers (id, name, min_quantity_kg, max_quantity_kg, farmer_fee_inr, buyer_fee_inr, extra_fee_per_100kg_inr, is_active) VALUES
('22222222-2222-2222-2222-222222222201', 'Micro Batch (1–10 kg)', 1, 10, 15.00, 15.00, 0, TRUE),
('22222222-2222-2222-2222-222222222202', 'Small Retail Batch (11–50 kg)', 11, 50, 40.00, 40.00, 0, TRUE),
('22222222-2222-2222-2222-222222222203', 'Standard Commercial (51–100 kg)', 51, 100, 75.00, 75.00, 0, TRUE),
('22222222-2222-2222-2222-222222222204', 'Wholesale Batch (101–150 kg)', 101, 150, 110.00, 110.00, 0, TRUE),
('22222222-2222-2222-2222-222222222205', 'Bulk Commercial (> 150 kg)', 151, NULL, 160.00, 160.00, 30.00, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Historical Mandi Prices
INSERT INTO market_prices (crop_name, variety, market_name, district, state, min_price_per_quintal, max_price_per_quintal, modal_price_per_quintal, observation_date, source) VALUES
('Paddy (Sona Masoori BPT 5204)', 'BPT 5204 Fine', 'Miryalaguda Mandi', 'Nalgonda', 'Telangana', 2650.00, 3050.00, 2850.00, CURRENT_DATE - INTERVAL '1 day', 'AGMARKNET / e-NAM'),
('Chilli (Teja)', 'Stemless Export Grade', 'Guntur Mirchi Yard', 'Guntur', 'Andhra Pradesh', 18200.00, 21500.00, 19500.00, CURRENT_DATE - INTERVAL '1 day', 'e-NAM Guntur'),
('Turmeric (Finger)', 'Nizamabad Finger', 'Nizamabad Market Yard', 'Nizamabad', 'Telangana', 13200.00, 15400.00, 14200.00, CURRENT_DATE - INTERVAL '1 day', 'AGMARKNET Nizamabad'),
('Cotton (Kapas)', 'Long Staple', 'Adilabad Cotton Yard', 'Adilabad', 'Telangana', 7100.00, 7800.00, 7400.00, CURRENT_DATE - INTERVAL '1 day', 'CCI / e-NAM'),
('Tomato', 'Hybrid Round', 'Bowenpally Wholesale', 'Hyderabad', 'Telangana', 2200.00, 3800.00, 3200.00, CURRENT_DATE, 'Marketing Dept TS'),
('Red Onion', 'Kurnool Bellary', 'Kurnool Market Committee', 'Kurnool', 'Andhra Pradesh', 2300.00, 3100.00, 2800.00, CURRENT_DATE, 'e-NAM Kurnool');
