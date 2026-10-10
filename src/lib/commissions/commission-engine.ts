import { CommissionTier } from '../types';

/**
 * DEFAULT SEED COMMISSION TIERS
 * Note: These are initial configurable tiers for demonstration.
 * Admin can adjust fees and thresholds dynamically in the Admin Console.
 */
export const DEFAULT_COMMISSION_TIERS: CommissionTier[] = [
  {
    id: 'tier-1',
    name: 'Micro Batch (1–10 kg)',
    min_quantity_kg: 1,
    max_quantity_kg: 10,
    farmer_fee_inr: 15,
    buyer_fee_inr: 15,
    is_active: true,
    effective_from: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tier-2',
    name: 'Small Retail Batch (11–50 kg)',
    min_quantity_kg: 11,
    max_quantity_kg: 50,
    farmer_fee_inr: 40,
    buyer_fee_inr: 40,
    is_active: true,
    effective_from: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tier-3',
    name: 'Standard Commercial (51–100 kg)',
    min_quantity_kg: 51,
    max_quantity_kg: 100,
    farmer_fee_inr: 75,
    buyer_fee_inr: 75,
    is_active: true,
    effective_from: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tier-4',
    name: 'Wholesale Batch (101–150 kg)',
    min_quantity_kg: 101,
    max_quantity_kg: 150,
    farmer_fee_inr: 110,
    buyer_fee_inr: 110,
    is_active: true,
    effective_from: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tier-5',
    name: 'Bulk Commercial (> 150 kg)',
    min_quantity_kg: 151,
    max_quantity_kg: null,
    farmer_fee_inr: 160,
    buyer_fee_inr: 160,
    extra_fee_per_100kg_inr: 30, // ₹30 per additional 100kg above 150kg
    is_active: true,
    effective_from: '2026-01-01T00:00:00Z',
  },
];

export interface CommissionCalculationResult {
  fulfilledQuantityKg: number;
  tierId: string;
  tierName: string;
  farmerFee: number;
  buyerFee: number;
  totalPlatformFee: number;
  effectiveRatePctOfValue?: number;
  explanation: string;
}

/**
 * Calculates commission for both parties based strictly on actual fulfilled quantity (kg).
 * If quantity is 0 or order cancelled before fulfillment, fee is 0.
 */
export function calculateCommission(
  quantityKg: number,
  tiers: CommissionTier[] = DEFAULT_COMMISSION_TIERS,
  estimatedOrderValue?: number
): CommissionCalculationResult {
  if (quantityKg <= 0) {
    return {
      fulfilledQuantityKg: 0,
      tierId: 'none',
      tierName: 'Unfulfilled / Zero Quantity',
      farmerFee: 0,
      buyerFee: 0,
      totalPlatformFee: 0,
      explanation: 'No commission is charged for zero fulfilled quantity or unfulfilled orders.',
    };
  }

  const activeTiers = tiers.filter((t) => t.is_active);

  // Match the tier
  const matchedTier = activeTiers.find((t) => {
    if (t.max_quantity_kg === null) {
      return quantityKg >= t.min_quantity_kg;
    }
    return quantityKg >= t.min_quantity_kg && quantityKg <= t.max_quantity_kg;
  });

  if (!matchedTier) {
    // Fallback if below minimum or gaps exist
    const baseFarmer = 15;
    const baseBuyer = 15;
    return {
      fulfilledQuantityKg: quantityKg,
      tierId: 'fallback',
      tierName: 'Base Tier (Micro)',
      farmerFee: baseFarmer,
      buyerFee: baseBuyer,
      totalPlatformFee: baseFarmer + baseBuyer,
      explanation: `Calculated at minimum tier for ${quantityKg} kg.`,
    };
  }

  let farmerFee = matchedTier.farmer_fee_inr;
  let buyerFee = matchedTier.buyer_fee_inr;

  // If this is the unbounded tier and has an extra per 100kg rule
  if (matchedTier.max_quantity_kg === null && matchedTier.extra_fee_per_100kg_inr && quantityKg > 150) {
    const extraKg = quantityKg - 150;
    const additional100kgUnits = Math.ceil(extraKg / 100);
    const surcharge = additional100kgUnits * matchedTier.extra_fee_per_100kg_inr;
    farmerFee += surcharge;
    buyerFee += surcharge;
  }

  const totalFee = farmerFee + buyerFee;
  let effectiveRatePct: number | undefined;
  if (estimatedOrderValue && estimatedOrderValue > 0) {
    effectiveRatePct = Number(((totalFee / estimatedOrderValue) * 100).toFixed(2));
  }

  const explanation = `Fulfilled quantity of ${quantityKg.toLocaleString()} kg falls into "${matchedTier.name}". Farmer pays ₹${farmerFee}, Buyer pays ₹${buyerFee}.`;

  return {
    fulfilledQuantityKg: quantityKg,
    tierId: matchedTier.id,
    tierName: matchedTier.name,
    farmerFee,
    buyerFee,
    totalPlatformFee: totalFee,
    effectiveRatePctOfValue: effectiveRatePct,
    explanation,
  };
}

/**
 * Standard test benchmarks required by SEEDSTACK specifications:
 * 10 kg, 50 kg, 100 kg, 150 kg and boundary checks
 */
export function getStandardBenchmarkCalculations(tiers = DEFAULT_COMMISSION_TIERS) {
  const benchmarkQuantities = [10, 50, 100, 150, 500];
  return benchmarkQuantities.map((qty) => calculateCommission(qty, tiers));
}
