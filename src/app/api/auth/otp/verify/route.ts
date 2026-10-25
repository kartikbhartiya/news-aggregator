import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and 6-digit code are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = String(code).trim();

    const result = verifyOtpCode(cleanEmail, cleanCode);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.reason || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    // OTP verified successfully
    return NextResponse.json({
      success: true,
      verified: true,
      email: cleanEmail,
      message: 'Email successfully verified.',
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error during OTP verification.' },
      { status: 500 }
    );
  }
}
