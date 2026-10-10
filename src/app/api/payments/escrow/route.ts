import { NextResponse } from 'next/server';
import { demoStore } from '@/lib/store/demo-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  const transactions = demoStore.getEscrowTransactions(orderId || undefined);
  return NextResponse.json({
    success: true,
    data: transactions,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, deliveryOtp, escrowAmount, farmerPayoutAmount, farmerUpi } = body;

    if (action === 'release') {
      if (!orderId || !deliveryOtp) {
        return NextResponse.json(
          { success: false, error: 'Order ID and Delivery OTP are required' },
          { status: 400 }
        );
      }

      const releaseResult = demoStore.releaseEscrow(orderId, deliveryOtp);
      return NextResponse.json({
        success: releaseResult.success,
        message: releaseResult.message,
        utr: releaseResult.utr,
      });
    }

    if (action === 'create') {
      if (!orderId || !escrowAmount) {
        return NextResponse.json(
          { success: false, error: 'Order ID and Escrow Amount are required' },
          { status: 400 }
        );
      }

      const order = demoStore.getOrders().find((o) => o.id === orderId);
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

      const created = demoStore.createEscrowTransaction({
        order_id: orderId,
        order_number: order?.order_number || `ORD-${Date.now().toString().slice(-4)}`,
        gateway_provider: 'razorpay',
        gateway_order_id: `order_RPZ_${Date.now().toString().slice(-8)}`,
        gateway_payment_id: `pay_RPZ_${Date.now().toString().slice(-8)}`,
        escrow_amount: Number(escrowAmount),
        farmer_payout_amount: Number(farmerPayoutAmount || escrowAmount),
        platform_fee: 0,
        escrow_status: 'held_in_escrow',
        farmer_upi_or_account: farmerUpi || 'farmer@upi',
        delivery_otp: generatedOtp,
        webhook_verified: true,
      });

      return NextResponse.json({
        success: true,
        data: created,
        deliveryOtp: generatedOtp,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Supported: create, release' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Escrow operation failed' },
      { status: 500 }
    );
  }
}
