import { describe, it, expect, beforeEach } from "vitest";
import { demoStore } from "@/lib/store/demo-store";
import { UserProfile, CropListing, BuyerRequirement } from "@/lib/types";

describe("Strict Role Barrier Isolation Tests", () => {
  const farmerUser: UserProfile = {
    id: "user-farmer-1",
    role: "farmer",
    full_name: "Ramesh Reddy",
    phone: "+919848012345",
    preferred_language: "te",
    state: "Telangana",
    district: "Suryapet",
    mandal_or_village: "Chivvemla",
    verification_status: "approved",
    created_at: new Date().toISOString(),
  };

  const buyerUser: UserProfile = {
    id: "user-buyer-1",
    role: "wholesaler",
    full_name: "Venkat Rao",
    business_name: "Sri Lakshmi Wholesalers",
    business_type: "Wholesale Merchant",
    gst_number: "36AABCS1429B1Z8",
    phone: "+919848098765",
    preferred_language: "te",
    state: "Telangana",
    district: "Hyderabad",
    mandal_or_village: "Bowenpally Wholesale Yard",
    verification_status: "approved",
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    demoStore.resetToDefault();
  });

  it("Farmer can list produce, but Buyer cannot create farmer listings", () => {
    // Farmer creates listing
    const farmerListing = demoStore.createListing({
      farmer_id: farmerUser.id,
      farmer_name: farmerUser.full_name,
      farmer_phone: farmerUser.phone,
      farmer_verified: true,
      crop_name: "Chilli (Teja)",
      crop_name_te: "తేజ ఎండు మిర్చి",
      variety: "Teja Super Hot",
      category_id: "cat-spices",
      grade: "Grade A",
      available_quantity: 500,
      unit: "kg",
      asking_price_per_unit: 180,
      harvest_date: "2026-10-10",
      state: farmerUser.state || "Telangana",
      district: farmerUser.district || "Suryapet",
      village: "Chivvemla Farm Gate",
      delivery_preference: "Farm Gate Pickup",
      description: "Sun-dried red chilli lots",
      images: ["https://images.unsplash.com/photo-1588252303782-cb80119abd6d"],
      status: "active",
    });

    expect(farmerListing.id).toBeDefined();
    expect(farmerListing.farmer_id).toBe(farmerUser.id);

    // Verify listing is visible in marketplace store
    const found = demoStore.getListingById(farmerListing.id);
    expect(found).toBeDefined();
    expect(found?.crop_name).toBe("Chilli (Teja)");
  });

  it("Buyer can place bids and negotiate produce, while Farmer owner accepts bids", () => {
    const listings = demoStore.getListings();
    const targetListing = listings[0];
    expect(targetListing).toBeDefined();

    // Buyer places competitive bid
    const bidAmount = targetListing.asking_price_per_unit + 5;
    const bid = demoStore.placeBid(
      targetListing.id,
      buyerUser,
      bidAmount,
      200,
      "Direct farm pickup via express truck"
    );

    expect(bid.id).toBeDefined();
    expect(bid.bidder_id).toBe(buyerUser.id);
    expect(bid.bid_amount_per_kg).toBe(bidAmount);

    // Only the farmer owner can accept the bid to create confirmed order
    const order = demoStore.acceptBid(bid.id);
    expect(order).toBeDefined();
    expect(order.buyer_id).toBe(buyerUser.id);
    expect(order.farmer_id).toBe(targetListing.farmer_id);
    expect(order.unit_price).toBe(bidAmount);
    expect(order.status).toBe("confirmed");
  });

  it("Buyer posts procurement requirement, and Farmer fulfills supply offer", () => {
    // Buyer creates procurement requirement
    const req = demoStore.createRequirement({
      buyer_id: buyerUser.id,
      buyer_name: buyerUser.business_name || buyerUser.full_name,
      buyer_business_type: "Wholesaler",
      buyer_verified: true,
      category_id: "cat-grains",
      crop_name: "Paddy (Sona Masoori)",
      required_quantity: 2000,
      unit: "kg",
      target_price_per_unit: 30,
      state: "Telangana",
      district: "Hyderabad",
      delivery_destination: "Bowenpally Mandi Yard",
      required_delivery_date: "2026-10-30",
      status: "open",
    });

    expect(req.id).toBeDefined();
    expect(req.buyer_id).toBe(buyerUser.id);

    // Farmer creates negotiation to supply the buyer's requirement
    const negotiation = demoStore.createNegotiation(
      undefined,
      req.id,
      farmerUser.id,
      buyerUser.id,
      req.crop_name,
      1500,
      31,
      farmerUser.id,
      farmerUser.role,
      "Farm Gate pickup"
    );

    expect(negotiation.id).toBeDefined();
    expect(negotiation.farmer_id).toBe(farmerUser.id);
    expect(negotiation.buyer_id).toBe(buyerUser.id);
    expect(negotiation.current_status).toBe("in_progress");

    // Acceptance locks into order
    const order = demoStore.acceptOfferAndCreateOrder(negotiation.id, buyerUser.id);
    expect(order).toBeDefined();
    expect(order?.ordered_quantity).toBe(1500);
    expect(order?.unit_price).toBe(31);
    expect(order?.buyer_id).toBe(buyerUser.id);
    expect(order?.farmer_id).toBe(farmerUser.id);
    expect(order?.status).toBe("confirmed");
  });
});
