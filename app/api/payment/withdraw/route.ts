import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userId, userName, userEmail, upiId } = body;

    // Validate required fields
    if (!amount || !userId || !upiId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Minimum withdrawal amount (in rupees - convert from dollars)
    const minAmount = 10; // $10
    const amountInRupees = Math.round(amount * 83); // Approximate conversion
    const amountInPaise = amountInRupees * 100; // Razorpay uses paise

    if (amountInRupees < minAmount) {
      return NextResponse.json(
        { error: `Minimum withdrawal amount is $${minAmount}` },
        { status: 400 }
      );
    }

    // Create a payout using Razorpay Payouts API
    // Note: You'll need Razorpay Payouts enabled on your account
    
    // For demo purposes, we'll simulate a successful payout
    // In production, use actual Razorpay Payouts API
    
    /*
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      amount: amountInPaise,
      currency: 'INR',
      mode: 'UPI',
      purpose: 'refund',
      fund_account: {
        account_type: 'vpa',
        vpa: {
          address: upiId
        },
        contact: {
          name: userName || 'User',
          email: userEmail || 'user@example.com',
          contact: '9999999999'
        }
      }
    });
    */

    // Simulate successful payout for demo
    const payoutId = 'payout_' + Date.now();
    
    return NextResponse.json({
      success: true,
      payoutId,
      amount: amountInRupees,
      message: 'Withdrawal request submitted successfully!'
    });

  } catch (error: any) {
    console.error('Payout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process withdrawal' },
      { status: 500 }
    );
  }
}

// Get Razorpay key for frontend
export async function GET() {
  return NextResponse.json({
    key: process.env.RAZORPAY_KEY_ID || ''
  });
}
