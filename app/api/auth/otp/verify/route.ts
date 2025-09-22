import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    // Validate input
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone and code are required' },
        { status: 400 }
      );
    }

    // For testing purposes, accept "000000" as a valid OTP
    if (code === '000000') {
      return NextResponse.json({
        success: true,
        needsPasskey: false, // Skip passkey setup for testing
        user: {
          id: 'test-user-1',
          phone: phone,
          name: 'Test User',
          role: 'provider'
        }
      });
    }

    // For any other code, return invalid
    return NextResponse.json(
      { success: false, error: 'Invalid verification code' },
      { status: 400 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

