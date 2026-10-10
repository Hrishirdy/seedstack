import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/store/demo-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  const slips = demoStore.getWeighbridgeSlips(orderId || undefined);
  return NextResponse.json({
    success: true,
    data: slips,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, slipId, verifiedBy, disputeReason } = body;

    if (action === 'verify') {
      const ok = demoStore.verifyWeighbridgeSlip(slipId, verifiedBy || 'farmer');
      return NextResponse.json({ success: ok });
    }

    if (action === 'dispute') {
      const ok = demoStore.raiseWeighbridgeDispute(slipId, disputeReason || 'Weight mismatch observed');
      return NextResponse.json({ success: ok });
    }

    // Create new slip
    const {
      orderId,
      orderNumber,
      weighbridgeName,
      weighbridgeReceiptNo,
      truckNumber,
      grossWeightKg,
      tareWeightKg,
      moisturePercent,
      bagTareDeductionKg,
      agreedRatePerKg,
      slipPhotoUrl,
    } = body;

    const gross = Number(grossWeightKg);
    const tare = Number(tareWeightKg);
    const net = Math.max(0, gross - tare);
    const bagDeduction = Number(bagTareDeductionKg || 0);
    const finalWeight = Math.max(0, net - bagDeduction);
    const rate = Number(agreedRatePerKg || 30);
    const finalAmount = finalWeight * rate;

    const newSlip = demoStore.createWeighbridgeSlip({
      order_id: orderId,
      order_number: orderNumber || `ORD-${Date.now().toString().slice(-4)}`,
      weighbridge_name: weighbridgeName || 'APMC Dharma Kanta Yard',
      weighbridge_receipt_no: weighbridgeReceiptNo || `WB-${Date.now().toString().slice(-6)}`,
      truck_number: truckNumber || 'TS 08 UB 4519',
      gross_weight_kg: gross,
      tare_weight_kg: tare,
      net_weight_kg: net,
      moisture_percent: Number(moisturePercent || 12.0),
      bag_tare_deduction_kg: bagDeduction,
      final_billable_weight_kg: finalWeight,
      agreed_rate_per_kg: rate,
      final_total_amount: finalAmount,
      slip_photo_url:
        slipPhotoUrl ||
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      verified_by_farmer: true,
      verified_by_buyer: false,
      dispute_flag: false,
    });

    return NextResponse.json({
      success: true,
      data: newSlip,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Weighbridge processing failed' },
      { status: 500 }
    );
  }
}
