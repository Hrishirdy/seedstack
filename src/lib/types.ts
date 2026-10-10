export type UserRole =
  | 'farmer'
  | 'retail_vendor'
  | 'wholesaler'
  | 'supermarket'
  | 'food_processor'
  | 'admin'
  | 'logistics_operator';

export type VerificationStatus =
  | 'incomplete'
  | 'pending_verification'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type ListingStatus = 'active' | 'paused' | 'reserved' | 'sold_out' | 'closed';

export type OrderStatus =
  | 'requested'
  | 'negotiating'
  | 'confirmed'
  | 'awaiting_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'bank_transfer'
  | 'upi_online'
  | 'direct_settlement';

export type PaymentStatus = 'pending' | 'reported' | 'confirmed' | 'failed' | 'refunded';

export type DeliveryStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed'
  | 'returned';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email?: string;
  state: string; // 'Telangana' | 'Andhra Pradesh'
  district: string;
  mandal_or_village: string;
  preferred_language: 'te' | 'en';
  business_name?: string;
  verification_status: VerificationStatus;
  avatar_url?: string;
  created_at: string;
  // Role-specific extensions
  land_size_acres?: number;
  primary_crops?: string[];
  bank_account_last4?: string;
  upi_id?: string;
  business_type?: string;
  gst_number?: string;
}

export interface VerificationDocument {
  id: string;
  profile_id: string;
  document_type: string;
  document_storage_path: string;
  status: VerificationStatus;
  reviewer_id?: string;
  review_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface CropCategory {
  id: string;
  name_en: string;
  name_te: string;
  slug: string;
  icon_name: string;
  description: string;
}

export interface CropListing {
  id: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone?: string;
  farmer_verified: boolean;
  category_id: string;
  crop_name: string;
  crop_name_te: string;
  variety?: string;
  available_quantity: number;
  reserved_quantity: number;
  unit: 'kg' | 'tonnes';
  asking_price_per_unit: number; // in INR
  grade: 'Grade A' | 'Grade B' | 'Organic' | 'Standard';
  harvest_date: string;
  state: string;
  district: string;
  village: string;
  delivery_preference: string;
  description: string;
  images: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface BuyerRequirement {
  id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_business_type: string;
  buyer_verified: boolean;
  category_id: string;
  crop_name: string;
  variety?: string;
  required_quantity: number;
  unit: 'kg' | 'tonnes';
  target_price_per_unit?: number;
  grade_requirement?: string;
  state: string;
  district: string;
  delivery_destination: string;
  required_delivery_date: string;
  status: 'open' | 'fulfilled' | 'closed';
  notes?: string;
  created_at: string;
}

export interface NegotiationMessage {
  id: string;
  negotiation_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: UserRole;
  offered_quantity: number;
  offered_unit_price: number;
  delivery_terms?: string;
  notes?: string;
  action_type: 'offer' | 'counter' | 'accept' | 'reject';
  created_at: string;
}

export interface Negotiation {
  id: string;
  listing_id?: string;
  requirement_id?: string;
  crop_name: string;
  farmer_id: string;
  farmer_name: string;
  buyer_id: string;
  buyer_name: string;
  initiated_by: string;
  current_status: 'in_progress' | 'agreed' | 'rejected' | 'expired';
  agreed_quantity?: number;
  agreed_unit_price?: number;
  latest_offer_quantity: number;
  latest_offer_unit_price: number;
  messages: NegotiationMessage[];
  created_at: string;
  updated_at: string;
}

export interface CommissionTier {
  id: string;
  name: string;
  min_quantity_kg: number;
  max_quantity_kg: number | null; // null means unbounded above
  farmer_fee_inr: number;
  buyer_fee_inr: number;
  extra_fee_per_100kg_inr?: number;
  is_active: boolean;
  effective_from: string;
}

export interface Order {
  id: string;
  order_number: string;
  negotiation_id?: string;
  listing_id?: string;
  requirement_id?: string;
  farmer_id: string;
  farmer_name: string;
  buyer_id: string;
  buyer_name: string;
  buyer_business_name?: string;
  crop_name: string;
  ordered_quantity: number;
  fulfilled_quantity: number;
  unit: 'kg' | 'tonnes';
  unit_price: number;
  total_order_value: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  farmer_commission: number;
  buyer_commission: number;
  commission_tier_name: string;
  pickup_address: string;
  delivery_address: string;
  delivery_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  delivery_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  location_label: string;
  status: DeliveryStatus;
  recorded_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  order_number: string;
  crop_name: string;
  quantity_kg: number;
  tracking_code: string;
  operator_name: string;
  vehicle_type: string;
  vehicle_number: string;
  driver_name: string;
  driver_phone: string;
  current_status: DeliveryStatus;
  pickup_lat: number;
  pickup_lng: number;
  pickup_location_name: string;
  drop_lat: number;
  drop_lng: number;
  drop_location_name: string;
  current_lat: number;
  current_lng: number;
  estimated_arrival: string;
  actual_pickup_at?: string;
  actual_delivered_at?: string;
  tracking_events: TrackingEvent[];
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  order_number: string;
  payer_id: string;
  payer_name: string;
  payee_id: string;
  payee_name: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  payment_reference?: string;
  confirmed_by?: string;
  confirmed_at?: string;
  created_at: string;
}

export interface MarketPriceObservation {
  id: string;
  crop_name: string;
  variety: string;
  market_name: string; // e.g. "Bowenpally (Hyderabad)", "Guntur Mandi", "Warangal Enamamula"
  district: string;
  state: string;
  min_price_per_quintal: number;
  max_price_per_quintal: number;
  modal_price_per_quintal: number;
  modal_price_per_kg: number;
  observation_date: string;
  source: string;
}

export interface PriceSuggestion {
  crop_name: string;
  market_name: string;
  district: string;
  state: string;
  suggested_low_per_kg: number;
  suggested_modal_per_kg: number;
  suggested_high_per_kg: number;
  confidence_score: number; // 0 to 1
  sample_size: number;
  influencing_factors: string[];
  data_quality_label: 'High Confidence' | 'Moderate Confidence' | 'Limited Baseline Data';
  disclaimer: string;
}

export interface PriceTrendPoint {
  date: string;
  actual_modal_per_kg?: number;
  predicted_modal_per_kg?: number;
  upper_bound?: number;
  lower_bound?: number;
}

export interface DemandForecast {
  crop_name: string;
  crop_category: string;
  region: string;
  forecast_month: string;
  expected_demand_tonnes: number;
  change_vs_last_month_pct: number;
  confidence_label: string;
  key_driver: string;
}

// Multi-Party Bidding Engine
export interface ProduceBid {
  id: string;
  listing_id: string;
  bidder_id: string;
  bidder_name: string;
  bidder_role: UserRole;
  bidder_business_name?: string;
  bid_amount_per_kg: number;
  quantity_kg: number;
  status: 'active' | 'accepted' | 'outbid' | 'withdrawn';
  placed_at: string;
  note?: string;
}

export interface BiddingRoom {
  listing_id: string;
  crop_name: string;
  farmer_id: string;
  starting_price_per_kg: number;
  current_highest_bid_per_kg: number;
  highest_bidder_id?: string;
  highest_bidder_name?: string;
  min_increment_per_kg: number;
  ends_at: string;
  total_bids_count: number;
  bids: ProduceBid[];
}

// Notifications System (In-App, SMS, WhatsApp)
export interface AppNotification {
  id: string;
  recipient_id: string;
  type: 'bid' | 'negotiation' | 'order' | 'payment' | 'mandi_price' | 'delivery';
  title_en: string;
  title_te: string;
  message_en: string;
  message_te: string;
  read: boolean;
  whatsapp_ready: boolean;
  whatsapp_phone?: string;
  whatsapp_text?: string;
  sms_ready: boolean;
  sms_text?: string;
  action_url?: string;
  created_at: string;
}

// UPI Payment & Direct Settlement
export interface UpiPaymentDetails {
  vpa: string;
  payee_name: string;
  amount: number;
  order_number: string;
  note: string;
  upi_uri: string;
  qr_svg_data?: string;
}

// Formal Platform Invoicing
export interface CommissionInvoice {
  invoice_number: string;
  order_id: string;
  order_number: string;
  invoice_date: string;
  farmer_name: string;
  farmer_phone?: string;
  farmer_location: string;
  buyer_name: string;
  buyer_business?: string;
  buyer_gst?: string;
  crop_name: string;
  fulfilled_quantity_kg: number;
  agreed_rate_per_kg: number;
  total_produce_value: number;
  farmer_platform_fee: number;
  buyer_platform_fee: number;
  platform_fee_gst_18pct: number;
  total_platform_invoice_amount: number;
  status: 'generated' | 'settled';
  direct_settlement_reference?: string;
}

// 23. Official Weighbridge (ధర్మ కాంటా / Dharma Kanta) Receipt
export interface WeighbridgeSlip {
  id: string;
  order_id: string;
  order_number: string;
  weighbridge_name: string;
  weighbridge_receipt_no: string;
  truck_number: string;
  gross_weight_kg: number;
  tare_weight_kg: number;
  net_weight_kg: number;
  moisture_percent: number;
  bag_tare_deduction_kg: number;
  final_billable_weight_kg: number;
  agreed_rate_per_kg: number;
  final_total_amount: number;
  slip_photo_url?: string;
  verified_by_farmer: boolean;
  verified_by_buyer: boolean;
  dispute_flag: boolean;
  dispute_reason?: string;
  created_at: string;
}

// 24. Digital Escrow & Payment Webhook Transaction
export interface EscrowTransaction {
  id: string;
  order_id: string;
  order_number: string;
  gateway_provider: 'razorpay' | 'cashfree' | 'upi_direct';
  gateway_order_id: string;
  gateway_payment_id?: string;
  escrow_amount: number;
  farmer_payout_amount: number;
  platform_fee: number;
  escrow_status: 'held_in_escrow' | 'released_to_farmer' | 'refunded' | 'disputed';
  payout_utr?: string;
  farmer_upi_or_account?: string;
  delivery_otp?: string;
  webhook_verified: boolean;
  released_at?: string;
  created_at: string;
}


