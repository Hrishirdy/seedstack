import {
  UserProfile,
  CropListing,
  BuyerRequirement,
  Negotiation,
  Order,
  Delivery,
  PaymentRecord,
  CommissionTier,
  MarketPriceObservation,
  VerificationDocument,
  ProduceBid,
  AppNotification,
  CommissionInvoice,
  WeighbridgeSlip,
  EscrowTransaction,
} from '../types';
import { DEFAULT_COMMISSION_TIERS, calculateCommission } from '../commissions/commission-engine';
import { generateCommissionInvoice } from '../payments/upi-generator';
import { playNotificationChime, formatWhatsAppUrl } from '../notifications/notification-service';

// Initial Personas
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-farmer-1',
    role: 'farmer',
    full_name: 'Ramesh Reddy (రమేష్ రెడ్డి)',
    phone: '+91 98480 12345',
    email: 'ramesh.farmer@seedstack.demo',
    state: 'Telangana',
    district: 'Suryapet',
    mandal_or_village: 'Chivvemla Village',
    preferred_language: 'te',
    verification_status: 'approved',
    land_size_acres: 8.5,
    primary_crops: ['Paddy (Sona Masoori)', 'Cotton'],
    bank_account_last4: '4892',
    upi_id: 'ramesh.reddy@sbi',
    created_at: '2026-08-15T10:00:00Z',
  },
  {
    id: 'user-farmer-2',
    role: 'farmer',
    full_name: 'Anjaiah Varma (అంజయ్య వర్మ)',
    phone: '+91 94401 54321',
    email: 'anjaiah.farmer@seedstack.demo',
    state: 'Telangana',
    district: 'Warangal',
    mandal_or_village: 'Geesugonda',
    preferred_language: 'te',
    verification_status: 'pending_verification',
    land_size_acres: 5.0,
    primary_crops: ['Chilli', 'Turmeric'],
    created_at: '2026-09-01T11:00:00Z',
  },
  {
    id: 'user-buyer-1',
    role: 'wholesaler',
    full_name: 'Venkat Rao (వెంకట్ రావు)',
    phone: '+91 99890 87654',
    email: 'venkat.traders@seedstack.demo',
    business_name: 'Sri Venkateshwara Agri Commodities',
    business_type: 'Wholesale Mandi Commission Merchant',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal_or_village: 'Bowenpally Wholesale Market',
    preferred_language: 'en',
    verification_status: 'approved',
    gst_number: '36AABCS1429B1Z8',
    created_at: '2026-08-10T09:30:00Z',
  },
  {
    id: 'user-buyer-2',
    role: 'supermarket',
    full_name: 'FreshKart Procurement Hub',
    phone: '+91 98765 43210',
    email: 'procurement@freshkart.demo',
    business_name: 'FreshKart Retail Outlets Ltd',
    business_type: 'Multi-outlet Supermarket Retail Chain',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    mandal_or_village: 'Autonagar Logistics Yard',
    preferred_language: 'en',
    verification_status: 'approved',
    gst_number: '37AAACF8812K1Z4',
    created_at: '2026-07-20T08:00:00Z',
  },
  {
    id: 'user-admin-1',
    role: 'admin',
    full_name: 'K. Srinivas Rao (అడ్మిన్ శ్రీనివాస్)',
    phone: '+91 94900 11223',
    email: 'admin@seedstack.agritech',
    state: 'Telangana',
    district: 'Hyderabad',
    mandal_or_village: 'Hitec City Agritech Hub',
    preferred_language: 'en',
    verification_status: 'approved',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_VERIFICATIONS: VerificationDocument[] = [
  {
    id: 'verif-1',
    profile_id: 'user-farmer-2',
    document_type: 'Pattadar Passbook / Dharani Record',
    document_storage_path: 'secure-vault/dharani-passbook-7482.pdf',
    status: 'pending_verification',
    submitted_at: '2026-09-01T11:15:00Z',
  },
  {
    id: 'verif-2',
    profile_id: 'user-farmer-1',
    document_type: 'Kisan Credit Card & Land Record',
    document_storage_path: 'secure-vault/kcc-ramesh-suryapet.pdf',
    status: 'approved',
    reviewer_id: 'user-admin-1',
    review_notes: 'Land ownership verified against Suryapet mandal revenue registry.',
    submitted_at: '2026-08-15T10:10:00Z',
    reviewed_at: '2026-08-16T14:00:00Z',
  },
];

export const INITIAL_LISTINGS: CropListing[] = [
  {
    id: 'list-1',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    farmer_verified: true,
    category_id: 'cat-grains',
    crop_name: 'Paddy (Sona Masoori BPT 5204)',
    crop_name_te: 'సోనా మసూరి వరి (BPT 5204)',
    variety: 'BPT 5204 Fine Grain',
    available_quantity: 4500,
    reserved_quantity: 500,
    unit: 'kg',
    asking_price_per_unit: 29.5,
    grade: 'Grade A',
    harvest_date: '2026-10-02',
    state: 'Telangana',
    district: 'Suryapet',
    village: 'Chivvemla Farm Gate',
    delivery_preference: 'Platform Logistics or Buyer Pickup',
    description: 'Freshly harvested, sun-dried Sona Masoori with moisture content under 13.5%. Ideal for wholesale milling.',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    status: 'active',
    created_at: '2026-10-03T09:00:00Z',
    updated_at: '2026-10-03T09:00:00Z',
  },
  {
    id: 'list-2',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    farmer_verified: true,
    category_id: 'cat-spices',
    crop_name: 'Red Chilli (Teja Variety)',
    crop_name_te: 'తేజా ఎర్ర మిరపకాయలు',
    variety: 'Teja Stemless Grade',
    available_quantity: 750,
    reserved_quantity: 0,
    unit: 'kg',
    asking_price_per_unit: 205.0,
    grade: 'Grade A',
    harvest_date: '2026-09-28',
    state: 'Telangana',
    district: 'Khammam',
    village: 'Kusumanchi Farm Gate',
    delivery_preference: 'Platform Logistics',
    description: 'Deep red color, high pungency SHU rating > 65,000. Stored in climate-controlled sacks.',
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'],
    status: 'active',
    created_at: '2026-10-04T10:30:00Z',
    updated_at: '2026-10-04T10:30:00Z',
  },
  {
    id: 'list-3',
    farmer_id: 'user-farmer-2',
    farmer_name: 'Anjaiah Varma',
    farmer_verified: false,
    category_id: 'cat-spices',
    crop_name: 'Turmeric (Nizamabad Finger)',
    crop_name_te: 'నిజామాబాద్ పసుపు కొమ్ములు',
    variety: 'Salem Curcumin Rich',
    available_quantity: 1200,
    reserved_quantity: 0,
    unit: 'kg',
    asking_price_per_unit: 145.0,
    grade: 'Grade A',
    harvest_date: '2026-09-20',
    state: 'Telangana',
    district: 'Nizamabad',
    village: 'Armoor Mandi Cluster',
    delivery_preference: 'Farm Gate Pickup',
    description: 'High curcumin finger turmeric (>4.5%). Cured and machine polished.',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'],
    status: 'active',
    created_at: '2026-10-05T08:15:00Z',
    updated_at: '2026-10-05T08:15:00Z',
  },
  {
    id: 'list-4',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    farmer_verified: true,
    category_id: 'cat-veg',
    crop_name: 'Hybrid Tomato (Saaho Variety)',
    crop_name_te: 'హైబ్రిడ్ టమోటా',
    variety: 'Firm Round Table & Sauce Grade',
    available_quantity: 1800,
    reserved_quantity: 200,
    unit: 'kg',
    asking_price_per_unit: 34.0,
    grade: 'Grade A',
    harvest_date: '2026-10-07',
    state: 'Telangana',
    district: 'Rangareddy',
    village: 'Chevella Greenhouses',
    delivery_preference: 'SEEDSTACK Cold Van Delivery',
    description: 'Crisp, thick-walled tomatoes harvested early morning. Ready for supermarket shelves.',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'],
    status: 'active',
    created_at: '2026-10-07T06:30:00Z',
    updated_at: '2026-10-07T06:30:00Z',
  },
];

export const INITIAL_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-1',
    buyer_id: 'user-buyer-2',
    buyer_name: 'FreshKart Procurement Hub',
    buyer_business_type: 'Supermarket Retail Chain',
    buyer_verified: true,
    category_id: 'cat-grains',
    crop_name: 'Paddy (Sona Masoori BPT 5204)',
    variety: 'Aged 1 Year or Current Kharif Prime',
    required_quantity: 2000,
    unit: 'kg',
    target_price_per_unit: 28.5,
    grade_requirement: 'Grade A (<14% moisture)',
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    delivery_destination: 'FreshKart Central DC, Autonagar, Vijayawada',
    required_delivery_date: '2026-10-20',
    status: 'open',
    notes: 'Direct farm lot preferred. Prompt settlement upon quality testing.',
    created_at: '2026-10-05T14:00:00Z',
  },
  {
    id: 'req-2',
    buyer_id: 'user-buyer-1',
    buyer_name: 'Sri Venkateshwara Agri Commodities',
    buyer_business_type: 'Wholesale Mandi Commission Merchant',
    buyer_verified: true,
    category_id: 'cat-spices',
    crop_name: 'Red Chilli (Teja Variety)',
    variety: 'Guntur / Khammam Teja',
    required_quantity: 500,
    unit: 'kg',
    target_price_per_unit: 198.0,
    grade_requirement: 'Grade A Stemless',
    state: 'Telangana',
    district: 'Hyderabad',
    delivery_destination: 'Bowenpally Wholesale Yard, Gate No. 3',
    required_delivery_date: '2026-10-18',
    status: 'open',
    notes: 'Immediate payment upon weighing at Bowenpally scale.',
    created_at: '2026-10-06T10:00:00Z',
  },
];

export const INITIAL_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'neg-1',
    listing_id: 'list-1',
    crop_name: 'Paddy (Sona Masoori BPT 5204)',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    buyer_id: 'user-buyer-1',
    buyer_name: 'Sri Venkateshwara Agri Commodities',
    initiated_by: 'user-buyer-1',
    current_status: 'in_progress',
    latest_offer_quantity: 500,
    latest_offer_unit_price: 28.0,
    messages: [
      {
        id: 'msg-1',
        negotiation_id: 'neg-1',
        sender_id: 'user-buyer-1',
        sender_name: 'Venkat Rao',
        sender_role: 'wholesaler',
        offered_quantity: 500,
        offered_unit_price: 27.5,
        delivery_terms: 'Buyer arranges truck from Chivvemla',
        notes: 'Asking price is ₹29.5. We offer ₹27.5 for immediate pickup of 500 kg lot.',
        action_type: 'offer',
        created_at: '2026-10-07T11:00:00Z',
      },
      {
        id: 'msg-2',
        negotiation_id: 'neg-1',
        sender_id: 'user-farmer-1',
        sender_name: 'Ramesh Reddy',
        sender_role: 'farmer',
        offered_quantity: 500,
        offered_unit_price: 28.5,
        delivery_terms: 'Farm Gate pickup confirmed',
        notes: 'This is premium 5204 variety. Minimum I can do is ₹28.50 per kg.',
        action_type: 'counter',
        created_at: '2026-10-07T12:30:00Z',
      },
      {
        id: 'msg-3',
        negotiation_id: 'neg-1',
        sender_id: 'user-buyer-1',
        sender_name: 'Venkat Rao',
        sender_role: 'wholesaler',
        offered_quantity: 500,
        offered_unit_price: 28.0,
        delivery_terms: 'Farm Gate pickup by Saturday morning',
        notes: 'Let us meet in the middle at ₹28.00 per kg. We can take 500 kg immediately.',
        action_type: 'counter',
        created_at: '2026-10-08T09:00:00Z',
      },
    ],
    created_at: '2026-10-07T11:00:00Z',
    updated_at: '2026-10-08T09:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'SS-ORD-2026-101',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    buyer_id: 'user-buyer-2',
    buyer_name: 'FreshKart Procurement Hub',
    buyer_business_name: 'FreshKart Supermarkets Ltd',
    crop_name: 'Hybrid Tomato (Saaho Variety)',
    ordered_quantity: 200,
    fulfilled_quantity: 200,
    unit: 'kg',
    unit_price: 33.0,
    total_order_value: 6600,
    status: 'in_transit',
    payment_method: 'direct_settlement',
    payment_status: 'reported',
    farmer_commission: 160,
    buyer_commission: 160,
    commission_tier_name: 'Bulk Commercial (> 150 kg)',
    pickup_address: 'Chevella Greenhouse Yard, Rangareddy Dist, Telangana',
    delivery_address: 'FreshKart Autonagar Central DC, Vijayawada, AP',
    delivery_id: 'del-101',
    created_at: '2026-10-08T06:00:00Z',
    updated_at: '2026-10-08T14:00:00Z',
  },
  {
    id: 'ord-102',
    order_number: 'SS-ORD-2026-102',
    farmer_id: 'user-farmer-1',
    farmer_name: 'Ramesh Reddy',
    buyer_id: 'user-buyer-1',
    buyer_name: 'Sri Venkateshwara Agri Commodities',
    crop_name: 'Red Chilli (Teja Variety)',
    ordered_quantity: 100,
    fulfilled_quantity: 100,
    unit: 'kg',
    unit_price: 200.0,
    total_order_value: 20000,
    status: 'completed',
    payment_method: 'direct_settlement',
    payment_status: 'confirmed',
    farmer_commission: 75,
    buyer_commission: 75,
    commission_tier_name: 'Standard Commercial (51–100 kg)',
    pickup_address: 'Kusumanchi Farm Gate, Khammam, Telangana',
    delivery_address: 'Bowenpally Wholesale Yard, Secunderabad, Telangana',
    delivery_id: 'del-102',
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-06T16:00:00Z',
  },
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del-101',
    order_id: 'ord-101',
    order_number: 'SS-ORD-2026-101',
    crop_name: 'Hybrid Tomato (Saaho Variety)',
    quantity_kg: 200,
    tracking_code: 'TRK-SS-99214',
    operator_name: 'SEEDSTACK AgroLogistics',
    vehicle_type: 'Refrigerated Mini Van (Tata Ace Gold)',
    vehicle_number: 'TS 08 UB 4519',
    driver_name: 'B. Mahesh Kumar',
    driver_phone: '+91 97000 88991',
    current_status: 'in_transit',
    pickup_lat: 17.3075,
    pickup_lng: 78.1362,
    pickup_location_name: 'Chevella Greenhouse Yard, Rangareddy',
    drop_lat: 16.5062,
    drop_lng: 80.648,
    drop_location_name: 'FreshKart Autonagar DC, Vijayawada',
    current_lat: 17.1439,
    current_lng: 79.6239, // At Suryapet Bypass on NH65 en route to Vijayawada
    estimated_arrival: '2026-10-09T22:30:00Z',
    actual_pickup_at: '2026-10-09T14:15:00Z',
    tracking_events: [
      {
        id: 'trk-1',
        delivery_id: 'del-101',
        latitude: 17.3075,
        longitude: 78.1362,
        speed_kmh: 0,
        location_label: 'Produce loaded at Chevella Greenhouse & weighed (200 kg verified)',
        status: 'picked_up',
        recorded_at: '2026-10-09T14:15:00Z',
      },
      {
        id: 'trk-2',
        delivery_id: 'del-101',
        latitude: 17.2682,
        longitude: 78.8924,
        speed_kmh: 52.4,
        location_label: 'Hyderabad Outer Ring Road Exit toward Vijayawada NH65',
        status: 'in_transit',
        recorded_at: '2026-10-09T16:00:00Z',
      },
      {
        id: 'trk-3',
        delivery_id: 'del-101',
        latitude: 17.1439,
        longitude: 79.6239,
        speed_kmh: 48.0,
        location_label: 'Suryapet Highway Toll point. Temperature logged: 14°C',
        status: 'in_transit',
        recorded_at: '2026-10-09T18:45:00Z',
      },
    ],
    created_at: '2026-10-08T06:30:00Z',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    order_id: 'ord-101',
    order_number: 'SS-ORD-2026-101',
    payer_id: 'user-buyer-2',
    payer_name: 'FreshKart Procurement Hub',
    payee_id: 'user-farmer-1',
    payee_name: 'Ramesh Reddy',
    amount: 6600,
    method: 'direct_settlement',
    status: 'reported',
    payment_reference: 'UPI/UTR-20261009-88371',
    created_at: '2026-10-09T15:00:00Z',
  },
  {
    id: 'pay-2',
    order_id: 'ord-102',
    order_number: 'SS-ORD-2026-102',
    payer_id: 'user-buyer-1',
    payer_name: 'Venkat Rao',
    payee_id: 'user-farmer-1',
    payee_name: 'Ramesh Reddy',
    amount: 20000,
    method: 'direct_settlement',
    status: 'confirmed',
    payment_reference: 'NEFT-AXIS-9920145',
    confirmed_by: 'user-farmer-1',
    confirmed_at: '2026-10-06T16:00:00Z',
    created_at: '2026-10-06T15:30:00Z',
  },
];

export const INITIAL_BIDS: ProduceBid[] = [
  {
    id: 'bid-1',
    listing_id: 'list-1',
    bidder_id: 'user-buyer-1',
    bidder_name: 'Venkat Rao (వెంకట్ రావు)',
    bidder_role: 'wholesaler',
    bidder_business_name: 'Sri Venkateshwara Agri Commodities',
    bid_amount_per_kg: 34.5,
    quantity_kg: 2500,
    status: 'active',
    placed_at: '2026-10-09T18:30:00Z',
    note: 'Ready for prompt truck pickup at farm-gate Suryapet.',
  },
  {
    id: 'bid-2',
    listing_id: 'list-1',
    bidder_id: 'user-buyer-2',
    bidder_name: 'FreshKart Procurement Hub',
    bidder_role: 'supermarket',
    bidder_business_name: 'FreshKart Retail Outlets Ltd',
    bid_amount_per_kg: 33.0,
    quantity_kg: 2000,
    status: 'outbid',
    placed_at: '2026-10-09T17:15:00Z',
    note: 'Procuring for regional retail hypermarkets.',
  },
  {
    id: 'bid-3',
    listing_id: 'list-2',
    bidder_id: 'user-buyer-1',
    bidder_name: 'Venkat Rao (వెంకట్ రావు)',
    bidder_role: 'wholesaler',
    bidder_business_name: 'Sri Venkateshwara Agri Commodities',
    bid_amount_per_kg: 220,
    quantity_kg: 400,
    status: 'active',
    placed_at: '2026-10-09T19:00:00Z',
    note: 'Premium export grade inspection required at Guntur.',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipient_id: 'user-farmer-1',
    type: 'bid',
    title_en: 'New High Bid: Sona Masoori Paddy (₹34.50/kg)',
    title_te: 'సోనా మసూరి వరి పై అత్యధిక బిడ్: ₹34.50/కేజీ',
    message_en: 'Venkat Rao (Wholesaler) placed a verified bid of ₹34.50/kg for 2,500 kg.',
    message_te: 'వెంకట్ రావు గారు 2,500 కేజీలకు ₹34.50/కేజీ చొప్పున బిడ్ వేశారు.',
    read: false,
    whatsapp_ready: true,
    whatsapp_phone: '+91 98480 12345',
    whatsapp_text: '🌾 *SEEDSTACK ALERT*\nనమస్కారం రమేష్ రెడ్డి గారు!\nమీ సోనా మసూరి వరి పై వెంకట్ రావు గారు ₹34.50/kg బిడ్ వేశారు (2500 kg).\nవెంటనే యాప్ లో చూడండి: https://seedstack.agritech/explore/list-1',
    sms_ready: true,
    sms_text: 'SEEDSTACK: Ramesh garu, Venkat Rao bid Rs.34.50/kg for 2500kg Sona Masoori Paddy. Check app.',
    action_url: '/explore/list-1',
    created_at: '2026-10-09T18:30:00Z',
  },
  {
    id: 'notif-2',
    recipient_id: 'user-farmer-1',
    type: 'mandi_price',
    title_en: 'Guntur & Suryapet Mandi Price Rise (+₹15/q)',
    title_te: 'సూర్యాపేట & గుంటూరు మార్కెట్ ధర పెరుగుదల (+₹15/క్విం)',
    message_en: 'Modal paddy price increased by ₹150/tonne at Suryapet APMC yard today.',
    message_te: 'నేడు సూర్యాపేట మార్కెట్ లో వరి ధర టన్నుకు ₹150 పెరిగింది.',
    read: false,
    whatsapp_ready: true,
    whatsapp_phone: '+91 98480 12345',
    whatsapp_text: '📈 *SEEDSTACK MANDI UPDATE*\nసూర్యాపేట మార్కెట్ లో నేటి ధర క్వింటాలుకు ₹2,350 (+15). మీ పంటను మంచి ధరకు అమ్మండి.',
    sms_ready: true,
    sms_text: 'SEEDSTACK APMC: Suryapet modal paddy rate Rs.2350/q (+15).',
    action_url: '/ai-insights',
    created_at: '2026-10-09T16:00:00Z',
  },
  {
    id: 'notif-3',
    recipient_id: 'user-buyer-1',
    type: 'payment',
    title_en: 'Direct Settlement Ready: Order #SS-ORD-2026-101',
    title_te: 'ఆర్డర్ #SS-ORD-2026-101 చెల్లింపు సిద్ధంగా ఉంది',
    message_en: 'UPI QR code generated for ₹35,000 direct payment to Ramesh Reddy.',
    message_te: 'రమేష్ రెడ్డి గారికి ₹35,000 నేరుగా చెల్లించడానికి UPI QR సిద్ధమైంది.',
    read: true,
    whatsapp_ready: true,
    whatsapp_phone: '+91 99890 87654',
    whatsapp_text: '💰 *SEEDSTACK PAYMENT*\nOrder #SS-ORD-2026-101: UPI settlement for Rs.35,000 ready. Complete payment in app.',
    sms_ready: true,
    sms_text: 'SEEDSTACK: UPI payment Rs.35000 ready for Order #101.',
    action_url: '/farmer/orders',
    created_at: '2026-10-09T15:05:00Z',
  },
];

export const INITIAL_WEIGHBRIDGE_SLIPS: WeighbridgeSlip[] = [
  {
    id: 'wb-101',
    order_id: 'ord-101',
    order_number: 'SS-ORD-2026-101',
    weighbridge_name: 'Sri Venkateshwara Dharma Kanta (Chevella NH Bypass)',
    weighbridge_receipt_no: 'VK-WB-88412',
    truck_number: 'TS 08 UB 4519',
    gross_weight_kg: 3200,
    tare_weight_kg: 3000,
    net_weight_kg: 200,
    moisture_percent: 11.8,
    bag_tare_deduction_kg: 0,
    final_billable_weight_kg: 200,
    agreed_rate_per_kg: 32.0,
    final_total_amount: 6400,
    slip_photo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    verified_by_farmer: true,
    verified_by_buyer: true,
    dispute_flag: false,
    created_at: '2026-10-09T14:15:00Z',
  },
];

export const INITIAL_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'esc-101',
    order_id: 'ord-101',
    order_number: 'SS-ORD-2026-101',
    gateway_provider: 'razorpay',
    gateway_order_id: 'order_SEDESCR_99412',
    gateway_payment_id: 'pay_RPZ_8829141',
    escrow_amount: 6400,
    farmer_payout_amount: 6400,
    platform_fee: 0,
    escrow_status: 'held_in_escrow',
    payout_utr: 'UTR-YESB-99824151',
    farmer_upi_or_account: 'rameshreddy@oksbi',
    delivery_otp: '7412',
    webhook_verified: true,
    created_at: '2026-10-08T07:00:00Z',
  },
];

/**
 * Stateful Demo Store with LocalStorage synchronization
 */
class DemoStore {
  private users: UserProfile[] = DEMO_USERS;
  private currentUser: UserProfile | null = DEMO_USERS[0]; // Default loaded account; supports logout to null
  private listings: CropListing[] = INITIAL_LISTINGS;
  private requirements: BuyerRequirement[] = INITIAL_REQUIREMENTS;
  private negotiations: Negotiation[] = INITIAL_NEGOTIATIONS;
  private orders: Order[] = INITIAL_ORDERS;
  private deliveries: Delivery[] = INITIAL_DELIVERIES;
  private payments: PaymentRecord[] = INITIAL_PAYMENTS;
  private tiers: CommissionTier[] = DEFAULT_COMMISSION_TIERS;
  private verifications: VerificationDocument[] = INITIAL_VERIFICATIONS;
  private bids: ProduceBid[] = INITIAL_BIDS;
  private notifications: AppNotification[] = INITIAL_NOTIFICATIONS;
  private weighbridgeSlips: WeighbridgeSlip[] = INITIAL_WEIGHBRIDGE_SLIPS;
  private escrowTransactions: EscrowTransaction[] = INITIAL_ESCROW_TRANSACTIONS;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('seedstack_demo_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.listings) this.listings = parsed.listings;
        if (parsed.requirements) this.requirements = parsed.requirements;
        if (parsed.negotiations) this.negotiations = parsed.negotiations;
        if (parsed.orders) this.orders = parsed.orders;
        if (parsed.deliveries) this.deliveries = parsed.deliveries;
        if (parsed.payments) this.payments = parsed.payments;
        if (parsed.tiers) this.tiers = parsed.tiers;
        if (parsed.verifications) this.verifications = parsed.verifications;
        if (parsed.users) this.users = parsed.users;
        if (parsed.bids) this.bids = parsed.bids;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.weighbridgeSlips) this.weighbridgeSlips = parsed.weighbridgeSlips;
        if (parsed.escrowTransactions) this.escrowTransactions = parsed.escrowTransactions;
      }
      const currentUserId = localStorage.getItem('seedstack_current_user_id');
      if (currentUserId === 'guest_logged_out') {
        this.currentUser = null;
      } else if (currentUserId) {
        const u = this.users.find((x) => x.id === currentUserId);
        if (u) this.currentUser = u;
      }
    } catch {
      // Ignore parse errors and use initial
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        listings: this.listings,
        requirements: this.requirements,
        negotiations: this.negotiations,
        orders: this.orders,
        deliveries: this.deliveries,
        payments: this.payments,
        tiers: this.tiers,
        verifications: this.verifications,
        users: this.users,
        bids: this.bids,
        notifications: this.notifications,
        weighbridgeSlips: this.weighbridgeSlips,
        escrowTransactions: this.escrowTransactions,
      };
      localStorage.setItem('seedstack_demo_state', JSON.stringify(payload));
      if (this.currentUser) {
        localStorage.setItem('seedstack_current_user_id', this.currentUser.id);
      } else {
        localStorage.setItem('seedstack_current_user_id', 'guest_logged_out');
      }
    } catch {
      // Storage quota or privacy mode
    }
  }

  // User & Auth Management
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  setCurrentUser(userId: string | null): UserProfile | null {
    if (!userId) {
      this.currentUser = null;
      this.persist();
      return null;
    }
    const found = this.users.find((u) => u.id === userId);
    if (found) {
      this.currentUser = found;
      this.persist();
      return found;
    }
    return this.currentUser;
  }

  loginWithPhone(phone: string, pin: string, preferredRole?: string): { success: boolean; user?: UserProfile; error?: string } {
    const cleanPhone = phone.replace(/[\s\-\+]/g, '');
    let found = this.users.find((u) => {
      const uClean = u.phone.replace(/[\s\-\+]/g, '');
      return uClean.includes(cleanPhone) || cleanPhone.includes(uClean);
    });

    if (found) {
      this.currentUser = found;
      this.persist();
      return { success: true, user: found };
    }

    // Auto-onboard if valid 10-digit number & PIN
    if (cleanPhone.length >= 10) {
      const isBuyer = preferredRole && ['wholesaler', 'retail_vendor', 'supermarket', 'food_processor'].includes(preferredRole);
      const newUser = this.registerUser({
        role: (preferredRole as any) || 'farmer',
        full_name: isBuyer ? `Buyer Merchant (${phone.slice(-4)})` : `Farmer (${phone.slice(-4)})`,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        state: 'Telangana',
        district: 'Suryapet',
        mandal_or_village: isBuyer ? 'Market Yard' : 'Farm Gate',
        preferred_language: isBuyer ? 'en' : 'te',
        business_name: isBuyer ? 'Agri Trading Co.' : undefined,
      });
      return { success: true, user: newUser };
    }

    return { success: false, error: 'Invalid mobile number. Please enter a valid 10-digit number.' };
  }

  loginWithCredentials(identifier: string, passwordOrPin: string): { success: boolean; user?: UserProfile; error?: string } {
    const clean = identifier.trim().toLowerCase();
    const found = this.users.find((u) => {
      const cleanPhone = u.phone.replace(/[\s\-\+]/g, '');
      const targetPhone = clean.replace(/[\s\-\+]/g, '');
      return (
        (u.email && u.email.toLowerCase() === clean) ||
        cleanPhone.includes(targetPhone) ||
        targetPhone.includes(cleanPhone)
      );
    });

    if (found) {
      this.currentUser = found;
      this.persist();
      return { success: true, user: found };
    }

    return { success: false, error: 'Account not found with provided phone or email.' };
  }

  logout(): void {
    this.currentUser = null;
    this.persist();
  }

  getAllUsers(): UserProfile[] {
    return [...this.users];
  }

  registerUser(profile: Omit<UserProfile, 'id' | 'created_at' | 'verification_status'>): UserProfile {
    const newUser: UserProfile = {
      ...profile,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
      verification_status: 'pending_verification',
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.verifications.push({
      id: `verif-${Date.now()}`,
      profile_id: newUser.id,
      document_type: profile.role === 'farmer' ? 'Kisan Passbook / Land Record' : 'Trade License / GST',
      document_storage_path: `secure-vault/doc-${newUser.id}.pdf`,
      status: 'pending_verification',
      submitted_at: new Date().toISOString(),
    });
    this.persist();
    return newUser;
  }

  // Listings
  getListings(): CropListing[] {
    return [...this.listings];
  }

  getListingById(id: string): CropListing | undefined {
    return this.listings.find((l) => l.id === id);
  }

  createListing(listingData: Omit<CropListing, 'id' | 'created_at' | 'updated_at' | 'reserved_quantity'>): CropListing {
    const newListing: CropListing = {
      ...listingData,
      id: `list-${Date.now()}`,
      reserved_quantity: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.listings.unshift(newListing);
    this.persist();
    return newListing;
  }

  updateListingStatus(listingId: string, status: CropListing['status']) {
    const l = this.listings.find((x) => x.id === listingId);
    if (l) {
      l.status = status;
      l.updated_at = new Date().toISOString();
      this.persist();
    }
  }

  // Requirements
  getRequirements(): BuyerRequirement[] {
    return [...this.requirements];
  }

  createRequirement(reqData: Omit<BuyerRequirement, 'id' | 'created_at'>): BuyerRequirement {
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.requirements.unshift(newReq);
    this.persist();
    return newReq;
  }

  // Two-Way Negotiation Engine
  getNegotiations(): Negotiation[] {
    return [...this.negotiations];
  }

  getNegotiationById(id: string): Negotiation | undefined {
    return this.negotiations.find((n) => n.id === id);
  }

  createNegotiation(
    listingId: string | undefined,
    requirementId: string | undefined,
    farmerId: string,
    buyerId: string,
    cropName: string,
    initialQuantity: number,
    initialPrice: number,
    initiatingUserId: string,
    initiatingRole: UserProfile['role'],
    deliveryTerms?: string
  ): Negotiation {
    const farmer = this.users.find((u) => u.id === farmerId);
    const buyer = this.users.find((u) => u.id === buyerId);
    const initiator = this.users.find((u) => u.id === initiatingUserId);

    const newNeg: Negotiation = {
      id: `neg-${Date.now()}`,
      listing_id: listingId,
      requirement_id: requirementId,
      crop_name: cropName,
      farmer_id: farmerId,
      farmer_name: farmer ? farmer.full_name : 'Farmer',
      buyer_id: buyerId,
      buyer_name: buyer ? (buyer.business_name || buyer.full_name) : 'Buyer',
      initiated_by: initiatingUserId,
      current_status: 'in_progress',
      latest_offer_quantity: initialQuantity,
      latest_offer_unit_price: initialPrice,
      messages: [
        {
          id: `msg-${Date.now()}`,
          negotiation_id: `neg-${Date.now()}`,
          sender_id: initiatingUserId,
          sender_name: initiator ? initiator.full_name : 'User',
          sender_role: initiatingRole,
          offered_quantity: initialQuantity,
          offered_unit_price: initialPrice,
          delivery_terms: deliveryTerms || 'Standard logistics delivery terms',
          action_type: 'offer',
          created_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.negotiations.unshift(newNeg);
    this.persist();
    return newNeg;
  }

  submitCounterOffer(
    negotiationId: string,
    senderId: string,
    offeredQuantity: number,
    offeredUnitPrice: number,
    deliveryTerms: string,
    notes?: string
  ): Negotiation | undefined {
    const neg = this.negotiations.find((n) => n.id === negotiationId);
    if (!neg || neg.current_status !== 'in_progress') return undefined;

    const sender = this.users.find((u) => u.id === senderId);

    neg.latest_offer_quantity = offeredQuantity;
    neg.latest_offer_unit_price = offeredUnitPrice;
    neg.updated_at = new Date().toISOString();

    neg.messages.push({
      id: `msg-${Date.now()}`,
      negotiation_id: neg.id,
      sender_id: senderId,
      sender_name: sender ? sender.full_name : 'Party',
      sender_role: sender?.role || 'wholesaler',
      offered_quantity: offeredQuantity,
      offered_unit_price: offeredUnitPrice,
      delivery_terms: deliveryTerms,
      notes,
      action_type: 'counter',
      created_at: new Date().toISOString(),
    });

    this.persist();
    return neg;
  }

  acceptOfferAndCreateOrder(negotiationId: string, acceptingUserId: string): Order | undefined {
    const neg = this.negotiations.find((n) => n.id === negotiationId);
    if (!neg || neg.current_status !== 'in_progress') return undefined;

    neg.current_status = 'agreed';
    neg.agreed_quantity = neg.latest_offer_quantity;
    neg.agreed_unit_price = neg.latest_offer_unit_price;
    neg.updated_at = new Date().toISOString();

    const agreeingParty = this.users.find((u) => u.id === acceptingUserId);
    neg.messages.push({
      id: `msg-${Date.now()}`,
      negotiation_id: neg.id,
      sender_id: acceptingUserId,
      sender_name: agreeingParty ? agreeingParty.full_name : 'Party',
      sender_role: agreeingParty?.role || 'farmer',
      offered_quantity: neg.agreed_quantity,
      offered_unit_price: neg.agreed_unit_price,
      action_type: 'accept',
      notes: 'Terms mutually accepted. Confirmed order generated.',
      created_at: new Date().toISOString(),
    });

    // Reserve Inventory to prevent overselling
    if (neg.listing_id) {
      const listing = this.listings.find((l) => l.id === neg.listing_id);
      if (listing) {
        listing.reserved_quantity += neg.agreed_quantity;
        listing.available_quantity = Math.max(0, listing.available_quantity - neg.agreed_quantity);
        if (listing.available_quantity <= 0) {
          listing.status = 'sold_out';
        }
      }
    }

    // Calculate commission
    const comm = calculateCommission(neg.agreed_quantity, this.tiers);
    const totalValue = neg.agreed_quantity * neg.agreed_unit_price;
    const orderNumber = `SS-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      negotiation_id: neg.id,
      listing_id: neg.listing_id,
      requirement_id: neg.requirement_id,
      farmer_id: neg.farmer_id,
      farmer_name: neg.farmer_name,
      buyer_id: neg.buyer_id,
      buyer_name: neg.buyer_name,
      crop_name: neg.crop_name,
      ordered_quantity: neg.agreed_quantity,
      fulfilled_quantity: neg.agreed_quantity,
      unit: 'kg',
      unit_price: neg.agreed_unit_price,
      total_order_value: totalValue,
      status: 'confirmed',
      payment_method: 'direct_settlement',
      payment_status: 'pending',
      farmer_commission: comm.farmerFee,
      buyer_commission: comm.buyerFee,
      commission_tier_name: comm.tierName,
      pickup_address: 'Farm Gate / Mandi Collection Point, Telangana/AP',
      delivery_address: 'Buyer Warehouse / Mandi Hub, Telangana/AP',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  // Direct buy from listing without prior negotiation
  createDirectOrderFromListing(listingId: string, buyerId: string, quantityKg: number): Order | undefined {
    const listing = this.listings.find((l) => l.id === listingId);
    if (!listing || listing.available_quantity < quantityKg) return undefined;

    const buyer = this.users.find((u) => u.id === buyerId);

    // Reserve inventory
    listing.reserved_quantity += quantityKg;
    listing.available_quantity = Math.max(0, listing.available_quantity - quantityKg);
    if (listing.available_quantity <= 0) listing.status = 'sold_out';

    const comm = calculateCommission(quantityKg, this.tiers);
    const totalValue = quantityKg * listing.asking_price_per_unit;
    const orderNumber = `SS-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      listing_id: listing.id,
      farmer_id: listing.farmer_id,
      farmer_name: listing.farmer_name,
      buyer_id: buyerId,
      buyer_name: buyer ? (buyer.business_name || buyer.full_name) : 'Buyer',
      crop_name: listing.crop_name,
      ordered_quantity: quantityKg,
      fulfilled_quantity: quantityKg,
      unit: 'kg',
      unit_price: listing.asking_price_per_unit,
      total_order_value: totalValue,
      status: 'confirmed',
      payment_method: 'direct_settlement',
      payment_status: 'pending',
      farmer_commission: comm.farmerFee,
      buyer_commission: comm.buyerFee,
      commission_tier_name: comm.tierName,
      pickup_address: `${listing.village}, ${listing.district}, ${listing.state}`,
      delivery_address: 'Buyer Central Warehouse, Hyderabad / Vijayawada',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.orders];
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  updateOrderStatus(orderId: string, newStatus: Order['status'], fulfilledQty?: number): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.status = newStatus;
    if (fulfilledQty !== undefined && fulfilledQty >= 0) {
      order.fulfilled_quantity = fulfilledQty;
      // Recalculate commissions using actual fulfilled quantity
      const comm = calculateCommission(fulfilledQty, this.tiers);
      order.farmer_commission = comm.farmerFee;
      order.buyer_commission = comm.buyerFee;
      order.commission_tier_name = comm.tierName;
      order.total_order_value = fulfilledQty * order.unit_price;
    }
    order.updated_at = new Date().toISOString();
    this.persist();
    return order;
  }

  // Deliveries
  getDeliveries(): Delivery[] {
    return [...this.deliveries];
  }

  getDeliveryByOrderId(orderId: string): Delivery | undefined {
    return this.deliveries.find((d) => d.order_id === orderId);
  }

  // Payments
  getPayments(): PaymentRecord[] {
    return [...this.payments];
  }

  recordPayment(orderId: string, method: PaymentRecord['method'], refCode: string): PaymentRecord | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      order_id: order.id,
      order_number: order.order_number,
      payer_id: order.buyer_id,
      payer_name: order.buyer_name,
      payee_id: order.farmer_id,
      payee_name: order.farmer_name,
      amount: order.total_order_value,
      method,
      status: 'reported',
      payment_reference: refCode || `TXN-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    order.payment_status = 'reported';
    this.payments.unshift(newPayment);
    this.persist();
    return newPayment;
  }

  confirmPayment(paymentId: string, confirmingUserId: string): PaymentRecord | undefined {
    const pay = this.payments.find((p) => p.id === paymentId);
    if (!pay) return undefined;

    pay.status = 'confirmed';
    pay.confirmed_by = confirmingUserId;
    pay.confirmed_at = new Date().toISOString();

    const order = this.orders.find((o) => o.id === pay.order_id);
    if (order) {
      order.payment_status = 'confirmed';
    }

    this.persist();
    return pay;
  }

  confirmOrderPayment(orderId: string, refCode?: string): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;

    order.payment_status = 'confirmed';
    const pay = this.payments.find((p) => p.order_id === orderId);
    if (pay) {
      pay.status = 'confirmed';
      pay.confirmed_at = new Date().toISOString();
      if (refCode) pay.payment_reference = refCode;
    } else {
      this.payments.unshift({
        id: `pay-${Date.now()}`,
        order_id: order.id,
        order_number: order.order_number,
        payer_id: order.buyer_id,
        payer_name: order.buyer_name,
        payee_id: order.farmer_id,
        payee_name: order.farmer_name,
        amount: order.total_order_value,
        method: 'upi_online',
        status: 'confirmed',
        payment_reference: refCode || `UPI-${Date.now()}`,
        confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }

    this.persist();
    return order;
  }

  // Commission Tiers Admin
  getTiers(): CommissionTier[] {
    return [...this.tiers];
  }

  updateTier(tierId: string, farmerFee: number, buyerFee: number) {
    const t = this.tiers.find((x) => x.id === tierId);
    if (t) {
      t.farmer_fee_inr = farmerFee;
      t.buyer_fee_inr = buyerFee;
      this.persist();
    }
  }

  // Verifications Admin
  getVerifications(): VerificationDocument[] {
    return [...this.verifications];
  }

  reviewVerification(verificationId: string, status: 'approved' | 'rejected', notes: string, reviewerId: string) {
    const v = this.verifications.find((x) => x.id === verificationId);
    if (v) {
      v.status = status;
      v.review_notes = notes;
      v.reviewer_id = reviewerId;
      v.reviewed_at = new Date().toISOString();

      const user = this.users.find((u) => u.id === v.profile_id);
      if (user) {
        user.verification_status = status;
      }
      this.persist();
    }
  }

  // Multi-Party Bidding Engine
  getBidsForListing(listingId: string): ProduceBid[] {
    return this.bids
      .filter((b) => b.listing_id === listingId)
      .sort((a, b) => b.bid_amount_per_kg - a.bid_amount_per_kg);
  }

  getAllBids(): ProduceBid[] {
    return [...this.bids];
  }

  placeBid(
    listingId: string,
    bidder: UserProfile,
    bidAmountPerKg: number,
    quantityKg: number,
    note?: string
  ): ProduceBid {
    const listing = this.listings.find((l) => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    // Mark previous bids as outbid if this is higher
    this.bids.forEach((b) => {
      if (b.listing_id === listingId && b.bid_amount_per_kg < bidAmountPerKg && b.status === 'active') {
        b.status = 'outbid';
      }
    });

    const newBid: ProduceBid = {
      id: `bid-${Date.now()}`,
      listing_id: listingId,
      bidder_id: bidder.id,
      bidder_name: bidder.full_name,
      bidder_role: bidder.role,
      bidder_business_name: bidder.business_name,
      bid_amount_per_kg: bidAmountPerKg,
      quantity_kg: quantityKg,
      status: 'active',
      placed_at: new Date().toISOString(),
      note,
    };

    this.bids.unshift(newBid);

    // Trigger agricultural audio chime & notification for the farmer
    playNotificationChime();
    this.addNotification({
      recipient_id: listing.farmer_id,
      type: 'bid',
      title_en: `New High Bid: ₹${bidAmountPerKg}/kg for ${listing.crop_name}`,
      title_te: `${listing.crop_name} పై కొత్త బిడ్: ₹${bidAmountPerKg}/కేజీ`,
      message_en: `${bidder.full_name} bid ₹${bidAmountPerKg}/kg for ${quantityKg} kg.`,
      message_te: `${bidder.full_name} గారు ${quantityKg} కేజీలకు ₹${bidAmountPerKg}/కేజీ బిడ్ వేశారు.`,
      whatsapp_ready: true,
      whatsapp_phone: listing.farmer_phone || '+91 98480 12345',
      whatsapp_text: `🌾 *SEEDSTACK ALERT*\nనమస్కారం ${listing.farmer_name} గారు!\nమీ *${listing.crop_name}* పై ${bidder.full_name} గారు ₹${bidAmountPerKg}/kg బిడ్ వేశారు (${quantityKg} kg).\nపరిశీలించండి: https://seedstack.agritech/explore/${listingId}`,
      sms_ready: true,
      sms_text: `SEEDSTACK: New bid of Rs.${bidAmountPerKg}/kg for ${listing.crop_name} by ${bidder.full_name}.`,
      action_url: `/explore/${listingId}`,
    });

    this.persist();
    return newBid;
  }

  acceptBid(bidId: string): Order {
    const bid = this.bids.find((b) => b.id === bidId);
    if (!bid) throw new Error('Bid not found');
    const listing = this.listings.find((l) => l.id === bid.listing_id);
    if (!listing) throw new Error('Listing not found');

    bid.status = 'accepted';

    // Reserve inventory
    listing.reserved_quantity += bid.quantity_kg;
    listing.available_quantity = Math.max(0, listing.available_quantity - bid.quantity_kg);
    if (listing.available_quantity <= 0) listing.status = 'sold_out';

    const comm = calculateCommission(bid.quantity_kg, this.tiers);
    const totalValue = bid.quantity_kg * bid.bid_amount_per_kg;
    const orderNumber = `SS-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;

    const order: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      listing_id: listing.id,
      farmer_id: listing.farmer_id,
      farmer_name: listing.farmer_name,
      buyer_id: bid.bidder_id,
      buyer_name: bid.bidder_name,
      buyer_business_name: bid.bidder_business_name,
      crop_name: listing.crop_name,
      ordered_quantity: bid.quantity_kg,
      fulfilled_quantity: bid.quantity_kg,
      unit: 'kg',
      unit_price: bid.bid_amount_per_kg,
      total_order_value: totalValue,
      status: 'confirmed',
      payment_method: 'upi_online',
      payment_status: 'pending',
      farmer_commission: comm.farmerFee,
      buyer_commission: comm.buyerFee,
      commission_tier_name: comm.tierName,
      pickup_address: `Farm gate pickup: ${listing.village}, ${listing.district}`,
      delivery_address: `Buyer hub: ${bid.bidder_business_name || bid.bidder_name}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.orders.unshift(order);

    // Notify buyer
    this.addNotification({
      recipient_id: bid.bidder_id,
      type: 'order',
      title_en: `Bid Accepted! Order #${order.order_number}`,
      title_te: `బిడ్ ఆమోదించబడింది! ఆర్డర్ #${order.order_number}`,
      message_en: `Farmer accepted your bid of ₹${bid.bid_amount_per_kg}/kg for ${bid.quantity_kg}kg ${listing.crop_name}.`,
      message_te: `${listing.crop_name} పై మీ బిడ్ ఆమోదించబడింది.`,
      whatsapp_ready: true,
      whatsapp_text: `✅ *SEEDSTACK*\nYour bid on ${listing.crop_name} was accepted! Order #${order.order_number} confirmed.`,
      sms_ready: true,
      sms_text: `SEEDSTACK: Bid accepted for ${listing.crop_name}. Order #${order.order_number}.`,
      action_url: '/buyer/dashboard',
    });

    this.persist();
    return order;
  }

  // Notifications
  getNotifications(recipientId?: string): AppNotification[] {
    const id = recipientId || (this.currentUser ? this.currentUser.id : '');
    if (!id) return [];
    return this.notifications.filter((n) => n.recipient_id === id);
  }

  markNotificationRead(notificationId: string) {
    const n = this.notifications.find((x) => x.id === notificationId);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'created_at' | 'read'>): AppNotification {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  // Official Invoicing
  getInvoices(): CommissionInvoice[] {
    return this.orders.map((o) => generateCommissionInvoice(o));
  }

  // 23. Official Weighbridge (ధర్మ కాంటా / Dharma Kanta) Management
  getWeighbridgeSlips(orderId?: string): WeighbridgeSlip[] {
    if (orderId) {
      return this.weighbridgeSlips.filter((s) => s.order_id === orderId);
    }
    return this.weighbridgeSlips;
  }

  createWeighbridgeSlip(slip: Omit<WeighbridgeSlip, 'id' | 'created_at'>): WeighbridgeSlip {
    const newSlip: WeighbridgeSlip = {
      ...slip,
      id: `wb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.weighbridgeSlips.unshift(newSlip);

    // Update corresponding order with fulfilled net weight if matched
    const matchedOrder = this.orders.find((o) => o.id === slip.order_id);
    if (matchedOrder) {
      matchedOrder.fulfilled_quantity = slip.final_billable_weight_kg;
      matchedOrder.total_order_value = slip.final_total_amount;
    }

    this.persist();
    return newSlip;
  }

  verifyWeighbridgeSlip(slipId: string, verifiedBy: 'farmer' | 'buyer'): boolean {
    const slip = this.weighbridgeSlips.find((s) => s.id === slipId);
    if (!slip) return false;
    if (verifiedBy === 'farmer') slip.verified_by_farmer = true;
    if (verifiedBy === 'buyer') slip.verified_by_buyer = true;
    this.persist();
    return true;
  }

  raiseWeighbridgeDispute(slipId: string, reason: string): boolean {
    const slip = this.weighbridgeSlips.find((s) => s.id === slipId);
    if (!slip) return false;
    slip.dispute_flag = true;
    slip.dispute_reason = reason;

    // Trigger alert notification
    this.addNotification({
      recipient_id: 'user-admin-1',
      type: 'order',
      title_en: `Weighment Dispute: ${slip.order_number}`,
      title_te: `తూకం వివాదం: ${slip.order_number}`,
      message_en: `Weighment mismatch reported at ${slip.weighbridge_name}: ${reason}`,
      message_te: `${slip.weighbridge_name} వద్ద తూకం తేడా నివేదించబడింది: ${reason}`,
      whatsapp_ready: true,
      sms_ready: true,
    });

    this.persist();
    return true;
  }

  // 24. Digital Escrow Management
  getEscrowTransactions(orderId?: string): EscrowTransaction[] {
    if (orderId) {
      return this.escrowTransactions.filter((e) => e.order_id === orderId);
    }
    return this.escrowTransactions;
  }

  createEscrowTransaction(tx: Omit<EscrowTransaction, 'id' | 'created_at'>): EscrowTransaction {
    const newTx: EscrowTransaction = {
      ...tx,
      id: `esc-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.escrowTransactions.unshift(newTx);
    this.persist();
    return newTx;
  }

  releaseEscrow(orderId: string, deliveryOtp: string): { success: boolean; message: string; utr?: string } {
    const escrow = this.escrowTransactions.find((e) => e.order_id === orderId);
    if (!escrow) {
      return { success: false, message: 'No escrow record found for this order.' };
    }

    if (escrow.delivery_otp && escrow.delivery_otp !== deliveryOtp) {
      return { success: false, message: 'Invalid delivery verification OTP.' };
    }

    const utr = `UTR-IMPS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    escrow.escrow_status = 'released_to_farmer';
    escrow.payout_utr = utr;
    escrow.released_at = new Date().toISOString();

    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'completed';
      order.payment_status = 'confirmed';
    }

    this.persist();
    return {
      success: true,
      message: `Escrow released! ₹${escrow.farmer_payout_amount.toLocaleString('en-IN')} transferred to farmer account via ${utr}.`,
      utr,
    };
  }

  resetToDefault() {
    this.users = DEMO_USERS;
    this.currentUser = DEMO_USERS[0];
    this.listings = INITIAL_LISTINGS;
    this.requirements = INITIAL_REQUIREMENTS;
    this.negotiations = INITIAL_NEGOTIATIONS;
    this.orders = INITIAL_ORDERS;
    this.deliveries = INITIAL_DELIVERIES;
    this.payments = INITIAL_PAYMENTS;
    this.tiers = DEFAULT_COMMISSION_TIERS;
    this.verifications = INITIAL_VERIFICATIONS;
    this.persist();
  }
}

export const demoStore = new DemoStore();
