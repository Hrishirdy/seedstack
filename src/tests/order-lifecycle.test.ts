import { describe, it, expect, beforeEach } from 'vitest';
import { demoStore } from '../lib/store/demo-store';

describe('SEEDSTACK Order Lifecycle & Inventory Protection', () => {
  beforeEach(() => {
    demoStore.resetToDefault();
  });

  it('reserves inventory and prevents overselling when direct order is created', () => {
    const listing = demoStore.getListings().find((l) => l.available_quantity >= 500);
    expect(listing).toBeDefined();
    if (!listing) return;

    const initialAvailable = listing.available_quantity;
    const initialReserved = listing.reserved_quantity;

    const order = demoStore.createDirectOrderFromListing(listing.id, 'user-buyer-1', 500);
    expect(order).toBeDefined();
    expect(order?.ordered_quantity).toBe(500);

    const updatedListing = demoStore.getListingById(listing.id);
    expect(updatedListing?.available_quantity).toBe(initialAvailable - 500);
    expect(updatedListing?.reserved_quantity).toBe(initialReserved + 500);
  });

  it('refuses order creation if requested quantity exceeds available inventory', () => {
    const listing = demoStore.getListings()[0];
    const tooMuchQty = listing.available_quantity + 99999;

    const order = demoStore.createDirectOrderFromListing(listing.id, 'user-buyer-1', tooMuchQty);
    expect(order).toBeUndefined(); // Prevented overselling
  });

  it('transitions order status and recalculates commission on partial fulfillment', () => {
    const orders = demoStore.getOrders();
    const order = orders[0];

    // If order ordered 200 kg but actual fulfilled at farm pickup was 80 kg
    const updated = demoStore.updateOrderStatus(order.id, 'delivered', 80);
    expect(updated?.fulfilled_quantity).toBe(80);
    expect(updated?.commission_tier_name).toContain('Standard Commercial (51–100 kg)');
    expect(updated?.farmer_commission).toBe(75);
    expect(updated?.buyer_commission).toBe(75);
  });

  it('records direct settlement payment and enables payee confirmation', () => {
    const order = demoStore.getOrders()[0];
    const payment = demoStore.recordPayment(order.id, 'direct_settlement', 'UPI-REF-7721');
    expect(payment?.status).toBe('reported');
    expect(payment?.payment_reference).toBe('UPI-REF-7721');

    const confirmed = demoStore.confirmPayment(payment!.id, order.farmer_id);
    expect(confirmed?.status).toBe('confirmed');
    expect(confirmed?.confirmed_by).toBe(order.farmer_id);

    const updatedOrder = demoStore.getOrderById(order.id);
    expect(updatedOrder?.payment_status).toBe('confirmed');
  });
});
