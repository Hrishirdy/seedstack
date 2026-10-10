import { describe, it, expect } from 'vitest';
import {
  calculateCommission,
  DEFAULT_COMMISSION_TIERS,
} from '../lib/commissions/commission-engine';

describe('SEEDSTACK Quantity-Based Commission Engine', () => {
  it('charges ₹0 for 0 kg or cancelled unfulfilled orders', () => {
    const res = calculateCommission(0, DEFAULT_COMMISSION_TIERS);
    expect(res.fulfilledQuantityKg).toBe(0);
    expect(res.farmerFee).toBe(0);
    expect(res.buyerFee).toBe(0);
    expect(res.totalPlatformFee).toBe(0);
  });

  it('calculates 10 kg boundary correctly (Tier 1)', () => {
    const res = calculateCommission(10, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-1');
    expect(res.farmerFee).toBe(15);
    expect(res.buyerFee).toBe(15);
    expect(res.totalPlatformFee).toBe(30);
  });

  it('calculates 11 kg boundary correctly (Tier 2 immediately above 10 kg)', () => {
    const res = calculateCommission(11, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-2');
    expect(res.farmerFee).toBe(40);
    expect(res.buyerFee).toBe(40);
    expect(res.totalPlatformFee).toBe(80);
  });

  it('calculates 50 kg boundary correctly (Tier 2)', () => {
    const res = calculateCommission(50, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-2');
    expect(res.farmerFee).toBe(40);
    expect(res.buyerFee).toBe(40);
    expect(res.totalPlatformFee).toBe(80);
  });

  it('calculates 51 kg boundary correctly (Tier 3 immediately above 50 kg)', () => {
    const res = calculateCommission(51, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-3');
    expect(res.farmerFee).toBe(75);
    expect(res.buyerFee).toBe(75);
    expect(res.totalPlatformFee).toBe(150);
  });

  it('calculates 100 kg boundary correctly (Tier 3)', () => {
    const res = calculateCommission(100, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-3');
    expect(res.farmerFee).toBe(75);
    expect(res.buyerFee).toBe(75);
    expect(res.totalPlatformFee).toBe(150);
  });

  it('calculates 101 kg boundary correctly (Tier 4 immediately above 100 kg)', () => {
    const res = calculateCommission(101, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-4');
    expect(res.farmerFee).toBe(110);
    expect(res.buyerFee).toBe(110);
    expect(res.totalPlatformFee).toBe(220);
  });

  it('calculates 150 kg boundary correctly (Tier 4)', () => {
    const res = calculateCommission(150, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-4');
    expect(res.farmerFee).toBe(110);
    expect(res.buyerFee).toBe(110);
    expect(res.totalPlatformFee).toBe(220);
  });

  it('calculates 151 kg boundary correctly (Tier 5 bulk commercial)', () => {
    const res = calculateCommission(151, DEFAULT_COMMISSION_TIERS);
    expect(res.tierId).toBe('tier-5');
    // Base 160 + 1 * 30 (since 151 is 1kg over 150)
    expect(res.farmerFee).toBe(190);
    expect(res.buyerFee).toBe(190);
    expect(res.totalPlatformFee).toBe(380);
  });

  it('handles partial fulfillment calculation correctly', () => {
    // If order was for 500 kg but only 40 kg was actually harvested and fulfilled:
    const partial = calculateCommission(40, DEFAULT_COMMISSION_TIERS);
    expect(partial.tierId).toBe('tier-2');
    expect(partial.farmerFee).toBe(40);
    expect(partial.buyerFee).toBe(40);
  });
});
