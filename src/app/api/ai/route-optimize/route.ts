import { NextResponse } from 'next/server';
import { optimizeLogisticsRoute, LocationPoint } from '@/lib/logistics/route-optimizer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stops: LocationPoint[] = body.stops || [];
    const capacityKg = Number(body.vehicleCapacityKg) || 1500;

    const result = optimizeLogisticsRoute(stops, capacityKg);

    return NextResponse.json({
      success: true,
      route: result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to optimize route' },
      { status: 500 }
    );
  }
}
