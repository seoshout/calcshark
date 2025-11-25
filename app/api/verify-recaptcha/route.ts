import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No reCAPTCHA token provided' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('[reCAPTCHA] Missing RECAPTCHA_SECRET_KEY env.');
      return NextResponse.json(
        { success: false, message: 'Server misconfiguration: missing reCAPTCHA secret' },
        { status: 500 }
      );
    }

    // Verify token with Google reCAPTCHA API
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verificationUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        message: 'reCAPTCHA verification successful',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'reCAPTCHA verification failed',
          errors: data['error-codes'],
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during verification' },
      { status: 500 }
    );
  }
}
