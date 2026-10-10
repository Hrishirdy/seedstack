import { NextResponse } from 'next/server';
import { otpService } from '@/lib/auth/otp-service';
import { demoStore } from '@/lib/store/demo-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp, role = 'farmer' } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP code are required' },
        { status: 400 }
      );
    }

    const verification = otpService.verify(phone, otp);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 401 }
      );
    }

    // Authenticate / onboard user
    const loginResult = demoStore.loginWithPhone(phone, otp, role);

    if (!loginResult.success || !loginResult.user) {
      return NextResponse.json(
        { success: false, error: loginResult.error || 'User authentication failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      user: loginResult.user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
