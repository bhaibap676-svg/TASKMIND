import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan prices in rupees (converted from dollars)
const PLAN_PRICES: Record<string, number> = {
  'pro': 799, // $9.99
  'enterprise': 2499, // $29.99
};

const PLAN_NAMES: Record<string, string> = {
  'pro': 'Pro Plan',
  'enterprise': 'Business Plan',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, userId, userEmail } = body;

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Free plan - no payment needed
    if (planId === 'free') {
      return NextResponse.json({
        success: true,
        message: 'Free plan activated'
      });
    }

    const amount = PLAN_PRICES[planId];
    if (!amount) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Create Razorpay order (simulated for demo)
    // In production, uncomment the actual Razorpay API call
    
    /*
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `subscription_${userId}_${Date.now()}`,
      notes: {
        planId,
        userId
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      plan: PLAN_NAMES[planId]
    });
    */

    // Demo mode - simulate success
    return NextResponse.json({
      success: true,
      message: 'Subscription activated (Demo mode)',
      plan: PLAN_NAMES[planId]
    });

  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// Get available plans
export async function GET() {
  return NextResponse.json({
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 799 },
      { id: 'enterprise', name: 'Business', price: 2499 }
    ]
  });
}
