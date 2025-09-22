import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    // Validate input
    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // For testing purposes, always return success
    // In production, this would send an actual SMS via Twilio
    console.log(`OTP request for phone: ${phone}`);
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully (use 000000 for testing)'
    });

  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

