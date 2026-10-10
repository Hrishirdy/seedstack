import { NextResponse } from 'next/server';
import { calculateCommission, DEFAULT_COMMISSION_TIERS } from '@/lib/commissions/commission-engine';

export async function GET() {
  return NextResponse.json({
    success: true,
    tiers: DEFAULT_COMMISSION_TIERS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quantityKg = Number(body.quantityKg);

    if (isNaN(quantityKg) || quantityKg < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid positive quantity in kg is required' },
        { status: 400 }
      );
    }

    const result = calculateCommission(
      quantityKg,
      DEFAULT_COMMISSION_TIERS,
      body.estimatedOrderValue
    );

    return NextResponse.json({
      success: true,
      calculation: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error calculating commission' },
      { status: 500 }
    );
  }
}
