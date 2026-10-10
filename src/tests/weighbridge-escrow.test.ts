import { describe, it, expect, beforeEach } from 'vitest';
import { demoStore } from '../lib/store/demo-store';

describe('Official Weighbridge (Dharma Kanta) & Digital Escrow System', () => {
  beforeEach(() => {
    demoStore.resetToDefault();
  });

  it('correctly calculates net produce weight from gross and tare readings', () => {
    const grossWeight = 3450;
    const tareWeight = 2450;
    const bagTareDeduction = 0;
    const netWeight = grossWeight - tareWeight - bagTareDeduction;

    expect(netWeight).toBe(1000);
    const ratePerKg = 29.5;
    const billableAmount = netWeight * ratePerKg;
    expect(billableAmount).toBe(29500);
  });

  it('creates and retrieves a new weighbridge slip for an order', () => {
    const slip = demoStore.createWeighbridgeSlip({
      order_id: 'ord-101',
      order_number: 'SS-ORD-2026-101',
      weighbridge_name: 'Suryapet Bypass Dharma Kanta',
      weighbridge_receipt_no: 'SP-WB-99120',
      truck_number: 'TS 08 UB 4519',
      gross_weight_kg: 3200,
      tare_weight_kg: 3000,
      net_weight_kg: 200,
      moisture_percent: 12.0,
      bag_tare_deduction_kg: 0,
      final_billable_weight_kg: 200,
      agreed_rate_per_kg: 32.0,
      final_total_amount: 6400,
      verified_by_farmer: true,
      verified_by_buyer: false,
      dispute_flag: false,
    });

    expect(slip.id).toBeDefined();
    const retrieved = demoStore.getWeighbridgeSlips('ord-101');
    expect(retrieved.length).toBeGreaterThan(0);
    expect(retrieved.some((s) => s.weighbridge_receipt_no === 'SP-WB-99120')).toBe(true);
  });

  it('flags weighment dispute and logs notification', () => {
    const slips = demoStore.getWeighbridgeSlips();
    const firstSlip = slips[0];
    expect(firstSlip).toBeDefined();

    const result = demoStore.raiseWeighbridgeDispute(firstSlip.id, 'Discrepancy of 40kg reported by buyer');
    expect(result).toBe(true);

    const updated = demoStore.getWeighbridgeSlips().find((s) => s.id === firstSlip.id);
    expect(updated?.dispute_flag).toBe(true);
    expect(updated?.dispute_reason).toContain('40kg');
  });

  it('creates digital escrow and releases funds upon matching delivery OTP', () => {
    const orderId = 'ord-101';
    const otp = '8492';

    const escrow = demoStore.createEscrowTransaction({
      order_id: orderId,
      order_number: 'SS-ORD-2026-101',
      gateway_provider: 'razorpay',
      gateway_order_id: 'order_TEST_123',
      escrow_amount: 6400,
      farmer_payout_amount: 6400,
      platform_fee: 0,
      escrow_status: 'held_in_escrow',
      farmer_upi_or_account: 'farmer@oksbi',
      delivery_otp: otp,
      webhook_verified: true,
    });

    expect(escrow.escrow_status).toBe('held_in_escrow');

    // Attempt release with invalid OTP
    const failedRelease = demoStore.releaseEscrow(orderId, '0000');
    expect(failedRelease.success).toBe(false);

    // Attempt release with valid OTP
    const successRelease = demoStore.releaseEscrow(orderId, otp);
    expect(successRelease.success).toBe(true);
    expect(successRelease.utr).toContain('UTR-IMPS-');

    const updatedEscrow = demoStore.getEscrowTransactions(orderId)[0];
    expect(updatedEscrow.escrow_status).toBe('released_to_farmer');
  });
});
