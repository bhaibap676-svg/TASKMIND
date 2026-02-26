"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Zap, Crown, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Access to basic tasks',
      'Earn up to $50/month',
      'Standard payout speed',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    popular: true,
    features: [
      'Access to all tasks',
      'Earn up to $500/month',
      'Priority payout (24h)',
      'Priority support',
      'Task filtering',
      'Analytics dashboard'
    ]
  },
  {
    id: 'enterprise',
    name: 'Business',
    price: 29.99,
    interval: 'month',
    features: [
      'Unlimited earnings',
      'Instant payouts',
      'Dedicated account manager',
      'API access',
      'Custom task requests',
      'White-label options'
    ]
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState('free');
  const supabase = createClient();

  useEffect(() => {
    checkUserPlan();
  }, []);

  async function checkUserPlan() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user subscription from database
        const { data } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single();
        
        if (data?.subscription_plan) {
          setUserPlan(data.subscription_plan);
        }
      }
    } catch (error) {
      console.error('Error checking plan:', error);
    }
  }

  async function handleSubscribe(planId: string) {
    if (planId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    setLoading(planId);

    try {
      // Call API to create subscription
      const response = await fetch('/api/payment/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to payment gateway
        window.location.href = data.url;
      } else {
        toast.success('Subscription activated! (Demo mode)');
        setUserPlan(planId);
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-900">TaskMind</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-navy-900 font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-navy-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-800">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Upgrade Your <span className="text-gold-500">Earnings</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you. Unlock more tasks, faster payouts, and higher earning limits.
          </p>
        </div>

        {/* Current Plan Banner */}
        {userPlan !== 'free' && (
          <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-r from-gold-500 to-amber-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Plan</p>
                <h3 className="text-2xl font-bold capitalize">{userPlan} Plan Active</h3>
              </div>
              <Crown className="w-12 h-12 opacity-50" />
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                plan.popular ? 'border-gold-500' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  {plan.id === 'enterprise' ? (
                    <Building2 className="w-6 h-6 text-navy-900" />
                  ) : plan.id === 'pro' ? (
                    <Crown className="w-6 h-6 text-gold-500" />
                  ) : (
                    <Zap className="w-6 h-6 text-navy-900" />
                  )}
                  <h3 className="text-xl font-bold text-navy-900">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-navy-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id || userPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                    userPlan === plan.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-navy-900 text-white hover:bg-navy-800'
                      : 'bg-gray-100 text-navy-900 hover:bg-gray-200'
                  }`}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : userPlan === plan.id ? (
                    'Current Plan'
                  ) : (
                    `Subscribe`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-navy-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-navy-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, UPI, and popular digital wallets through our secure payment partner Razorpay.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-navy-900 mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee. If you're not satisfied, contact support for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
