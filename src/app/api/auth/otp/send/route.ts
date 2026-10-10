import { NextResponse } from 'next/server';
import { otpService } from '@/lib/auth/otp-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, language = 'te' } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const result = otpService.generateAndSend(phone, language);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      otp: result.otp, // Returned for realtime UI simulated SMS banner / auto-fill
      expiresInSeconds: result.expiresInSeconds,
      cooldownSeconds: result.cooldownSeconds,
      smsText: result.smsText,
      formattedPhone: result.formattedPhone,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to send OTP' },
      { status: 400 }
    );
  }
}
