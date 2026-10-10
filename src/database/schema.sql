-- ==============================================================================
-- SEEDSTACK AGRICULTURAL MARKETPLACE — POSTGRESQL & SUPABASE DATABASE SCHEMA
-- Target Region: Telangana & Andhra Pradesh, India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
    'farmer',
    'retail_vendor',
    'wholesaler',
    'supermarket',
    'food_processor',
    'admin',
    'logistics_operator'
);

CREATE TYPE verification_status AS ENUM (
    'incomplete',
    'pending_verification',
    'approved',
    'rejected',
    'suspended'
);

CREATE TYPE listing_status AS ENUM (
    'active',
    'paused',
    'reserved',
    'sold_out',
    'closed'
);

CREATE TYPE order_status AS ENUM (
    'requested',
    'negotiating',
    'confirmed',
    'awaiting_pickup',
    'picked_up',
    'in_transit',
    'delivered',
    'completed',
    'cancelled',
    'disputed'
);

CREATE TYPE payment_method AS ENUM (
    'cash_on_delivery',
    'bank_transfer',
    'upi_online',
    'direct_settlement'
);

CREATE TYPE payment_status AS ENUM (
    'pending',
    'reported',
    'confirmed',
    'failed',
    'refunded'
);

CREATE TYPE delivery_status AS ENUM (
    'pending_assignment',
    'assigned',
    'picked_up',
    'in_transit',
    'delivered',
    'failed',
    'returned'
);

-- 2. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    role user_role NOT NULL DEFAULT 'farmer',
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    state VARCHAR(50) NOT NULL DEFAULT 'Telangana', -- 'Telangana' or 'Andhra Pradesh'
    district VARCHAR(100) NOT NULL,
    mandal_or_village VARCHAR(150),
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'te', -- 'te' or 'en'
    business_name VARCHAR(200),
    verification_status verification_status NOT NULL DEFAULT 'incomplete',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FARMER PROFILES
CREATE TABLE farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    land_size_acres NUMERIC(6,2),
    primary_crops TEXT[] DEFAULT '{}',
    bank_account_last4 VARCHAR(4),
    upi_id VARCHAR(100),
    organic_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BUYER PROFILES
CREATE TABLE buyer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_type VARCHAR(100), -- Retailer, Wholesaler, Supermarket Chain, Agro-Processor
    gst_number VARCHAR(20),
    trade_license_number VARCHAR(50),
    monthly_procurement_target_kg NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VERIFICATION RECORDS (Private Document Review)
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'kisan_credit_card', 'pattadar_passbook', 'trade_license', 'gst_cert', 'voter_id'
    document_storage_path TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending_verification',
    reviewer_id UUID REFERENCES profiles(id),
    review_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 6. CROP CATEGORIES
CREATE TABLE crop_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(100) NOT NULL,
    name_te VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CROP LISTINGS (Farmer Selling)
CREATE TABLE crop_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES crop_categories(id),
    crop_name VARCHAR(150) NOT NULL,
    crop_name_te VARCHAR(150),
    variety VARCHAR(100),
    available_quantity NUMERIC(10,2) NOT NULL CHECK (available_quantity >= 0),
    reserved_quantity NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    unit VARCHAR(20) NOT NULL DEFAULT 'kg', -- 'kg' or 'tonnes'
    asking_price_per_unit NUMERIC(10,2) NOT NULL CHECK (asking_price_per_unit > 0),
    grade VARCHAR(20) DEFAULT 'Grade A', -- Grade A, Grade B, Organic, Fair
    harvest_date DATE,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(150) NOT NULL,
    delivery_preference VARCHAR(100) DEFAULT 'Farm Gate Pickup or Platform Logistics',
    description TEXT,
    images TEXT[] DEFAULT '{}',
    status listing_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BUYER REQUIREMENTS (Buyer Sourcing)
CREATE TABLE buyer_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES crop_categories(id),
    crop_name VARCHAR(150) NOT NULL,
    variety VARCHAR(100),
    required_quantity NUMERIC(10,2) NOT NULL CHECK (required_quantity > 0),
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    target_price_per_unit NUMERIC(10,2),
    grade_requirement VARCHAR(50),
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    delivery_destination TEXT NOT NULL,
    required_delivery_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'fulfilled', 'closed'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NEGOTIATIONS (Two-Way Negotiation Engine)
CREATE TABLE negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES crop_listings(id) ON DELETE SET NULL,
    requirement_id UUID REFERENCES buyer_requirements(id) ON DELETE SET NULL,
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    initiated_by UUID NOT NULL REFERENCES profiles(id),
    current_status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'agreed', 'rejected', 'expired'
    agreed_quantity NUMERIC(10,2),
    agreed_unit_price NUMERIC(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_negotiation_parties CHECK (farmer_id <> buyer_id)
);

-- 10. NEGOTIATION MESSAGES / OFFER HISTORY
CREATE TABLE negotiation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    negotiation_id UUID NOT NULL REFERENCES negotiations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    offered_quantity NUMERIC(10,2) NOT NULL CHECK (offered_quantity > 0),
    offered_unit_price NUMERIC(10,2) NOT NULL CHECK (offered_unit_price > 0),
    delivery_terms TEXT,
    notes TEXT,
    is_counter BOOLEAN NOT NULL DEFAULT FALSE,
    action_type VARCHAR(50) NOT NULL DEFAULT 'offer', -- 'offer', 'counter', 'accept', 'reject'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. COMMISSION TIERS (Configurable fixed fee by fulfilled kg)
CREATE TABLE commission_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    min_quantity_kg NUMERIC(10,2) NOT NULL,
    max_quantity_kg NUMERIC(10,2), -- NULL for above threshold
    farmer_fee_inr NUMERIC(10,2) NOT NULL CHECK (farmer_fee_inr >= 0),
    buyer_fee_inr NUMERIC(10,2) NOT NULL CHECK (buyer_fee_inr >= 0),
    extra_fee_per_100kg_inr NUMERIC(10,2) DEFAULT 0, -- Used for tier above max
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDERS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    negotiation_id UUID REFERENCES negotiations(id),
    listing_id UUID REFERENCES crop_listings(id),
    requirement_id UUID REFERENCES buyer_requirements(id),
    farmer_id UUID NOT NULL REFERENCES profiles(id),
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    crop_name VARCHAR(150) NOT NULL,
    ordered_quantity NUMERIC(10,2) NOT NULL CHECK (ordered_quantity > 0),
    fulfilled_quantity NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (fulfilled_quantity >= 0),
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    total_order_value NUMERIC(12,2) NOT NULL CHECK (total_order_value >= 0),
    status order_status NOT NULL DEFAULT 'confirmed',
    payment_method payment_method NOT NULL DEFAULT 'direct_settlement',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    farmer_commission NUMERIC(10,2) NOT NULL DEFAULT 0,
    buyer_commission NUMERIC(10,2) NOT NULL DEFAULT 0,
    commission_tier_id UUID REFERENCES commission_tiers(id),
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. ORDER STATUS HISTORY (Audit trail of transitions)
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    from_status order_status,
    to_status order_status NOT NULL,
    changed_by UUID NOT NULL REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. DELIVERIES & LOGISTICS COORDINATION
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    operator_name VARCHAR(100) DEFAULT 'SEEDSTACK AgroLogistics',
    vehicle_type VARCHAR(50) DEFAULT 'Mini Truck (Tata Ace)',
    vehicle_number VARCHAR(30),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    current_status delivery_status NOT NULL DEFAULT 'pending_assignment',
    pickup_lat NUMERIC(9,6) NOT NULL,
    pickup_lng NUMERIC(9,6) NOT NULL,
    pickup_location_name VARCHAR(200) NOT NULL,
    drop_lat NUMERIC(9,6) NOT NULL,
    drop_lng NUMERIC(9,6) NOT NULL,
    drop_location_name VARCHAR(200) NOT NULL,
    current_lat NUMERIC(9,6),
    current_lng NUMERIC(9,6),
    estimated_arrival TIMESTAMPTZ,
    actual_pickup_at TIMESTAMPTZ,
    actual_delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. TRACKING EVENTS (GPS breadcrumbs)
CREATE TABLE tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    speed_kmh NUMERIC(5,2),
    location_label VARCHAR(150),
    status delivery_status NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PAYMENTS LEDGER (Direct Settlement + Confirmation)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES profiles(id),
    payee_id UUID NOT NULL REFERENCES profiles(id),
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    payment_reference VARCHAR(100),
    confirmed_by UUID REFERENCES profiles(id),
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. COMMISSIONS LEDGER (Payable to SEEDSTACK based on fulfilled quantity)
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payer_id UUID NOT NULL REFERENCES profiles(id),
    payer_role user_role NOT NULL,
    tier_id UUID REFERENCES commission_tiers(id),
    fulfilled_quantity_kg NUMERIC(10,2) NOT NULL,
    fee_inr NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'payable', -- 'payable', 'paid', 'waived'
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. MARKET PRICES (Historical & Daily Mandi Observations from Telangana/AP)
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(150) NOT NULL,
    variety VARCHAR(100),
    market_name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    min_price_per_quintal NUMERIC(10,2) NOT NULL,
    max_price_per_quintal NUMERIC(10,2) NOT NULL,
    modal_price_per_quintal NUMERIC(10,2) NOT NULL,
    observation_date DATE NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'AGMARKNET / data.gov.in',
    unit VARCHAR(20) NOT NULL DEFAULT 'quintal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. AUDIT LOGS (Compliance & Security)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. MULTI-PARTY PRODUCE BIDS
CREATE TABLE produce_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES profiles(id),
    bidder_name VARCHAR(255) NOT NULL,
    bidder_role user_role NOT NULL,
    bidder_business_name VARCHAR(255),
    bid_amount_per_kg NUMERIC(10,2) NOT NULL CHECK (bid_amount_per_kg > 0),
    quantity_kg NUMERIC(12,2) NOT NULL CHECK (quantity_kg > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, accepted, outbid, withdrawn
    placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note TEXT
);

-- 21. NOTIFICATIONS (In-App, SMS, WhatsApp)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- bid, negotiation, order, payment, mandi_price, delivery
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    message_en TEXT NOT NULL,
    message_te TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    whatsapp_ready BOOLEAN NOT NULL DEFAULT false,
    whatsapp_phone VARCHAR(50),
    whatsapp_text TEXT,
    sms_ready BOOLEAN NOT NULL DEFAULT false,
    sms_text TEXT,
    action_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view verified basic info; users can update own profile
CREATE POLICY "Public profile view" ON profiles FOR SELECT USING (true);
CREATE POLICY "Self profile update" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Crop Listings: Public can view active listings; Farmers manage their own
CREATE POLICY "Public can view active crop listings" ON crop_listings FOR SELECT USING (status = 'active' OR auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = farmer_id));
CREATE POLICY "Farmers can insert listings" ON crop_listings FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = farmer_id AND verification_status = 'approved'));
CREATE POLICY "Farmers can update own listings" ON crop_listings FOR UPDATE USING (auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = farmer_id));

-- Negotiations: Only participating farmer, buyer, or admin can access
CREATE POLICY "Participants view negotiation" ON negotiations FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id IN (farmer_id, buyer_id)) OR
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Orders: Only participating farmer, buyer, or admin can access
CREATE POLICY "Participants view order" ON orders FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id IN (farmer_id, buyer_id)) OR
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Produce Bids: Anyone can view active bids on a listing; Bidders can place bids
CREATE POLICY "View bids on listings" ON produce_bids FOR SELECT USING (true);
CREATE POLICY "Place bids" ON produce_bids FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = bidder_id));

-- Notifications: Only recipient can view/update own notifications
CREATE POLICY "Recipient view notifications" ON notifications FOR SELECT USING (auth.uid() IN (SELECT auth_user_id FROM profiles WHERE id = recipient_id));

-- 23. WEIGHBRIDGE (ధర్మ కాంటా / DHARMA KANTA) RECEIPT SLIPS
CREATE TABLE weighbridge_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    weighbridge_name VARCHAR(150) NOT NULL,
    weighbridge_receipt_no VARCHAR(50) NOT NULL,
    truck_number VARCHAR(30) NOT NULL,
    gross_weight_kg NUMERIC(10,2) NOT NULL,
    tare_weight_kg NUMERIC(10,2) NOT NULL,
    net_weight_kg NUMERIC(10,2) GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
    moisture_percent NUMERIC(4,2) DEFAULT 12.0,
    bag_tare_deduction_kg NUMERIC(6,2) DEFAULT 0.0,
    final_billable_weight_kg NUMERIC(10,2) NOT NULL,
    slip_photo_url TEXT,
    verified_by_farmer BOOLEAN NOT NULL DEFAULT false,
    verified_by_buyer BOOLEAN NOT NULL DEFAULT false,
    dispute_flag BOOLEAN NOT NULL DEFAULT false,
    dispute_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. DIGITAL ESCROW TRANSACTIONS & WEBHOOK LOGS
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    gateway_provider VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    gateway_order_id VARCHAR(100) NOT NULL,
    gateway_payment_id VARCHAR(100),
    escrow_amount NUMERIC(12,2) NOT NULL,
    farmer_payout_amount NUMERIC(12,2) NOT NULL,
    platform_fee NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    escrow_status VARCHAR(50) NOT NULL DEFAULT 'held_in_escrow', -- 'held_in_escrow', 'released_to_farmer', 'refunded', 'disputed'
    payout_utr VARCHAR(100),
    farmer_upi_or_account VARCHAR(100),
    webhook_verified BOOLEAN NOT NULL DEFAULT false,
    released_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE weighbridge_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view weighbridge slips" ON weighbridge_slips FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o JOIN profiles p ON p.id IN (o.farmer_id, o.buyer_id) WHERE o.id = weighbridge_slips.order_id AND p.auth_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Participants view escrow" ON escrow_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o JOIN profiles p ON p.id IN (o.farmer_id, o.buyer_id) WHERE o.id = escrow_transactions.order_id AND p.auth_user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid() AND role = 'admin')
);


