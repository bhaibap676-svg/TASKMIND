"use client";

import Link from "next/link";
import { 
  Wallet, 
  CheckCircle2, 
  TrendingUp, 
  Shield, 
  Zap, 
  ChevronRight,
  DollarSign,
  Users,
  FileCheck
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy-900">TaskMind</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-navy-900 font-medium"
              >
                Pricing
              </Link>
              <Link 
                href="/tasks" 
                className="text-gray-600 hover:text-navy-900 font-medium"
              >
                Browse Tasks
              </Link>
              <Link 
                href="/wallet" 
                className="text-gray-600 hover:text-navy-900 font-medium"
              >
                Wallet
              </Link>
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-navy-900 font-medium"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-navy-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6">
              Earn Money with
              <span className="text-gold-500"> Micro-Tasks</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Complete AI-training tasks from anywhere. Photo verification, voice recording review -, 
              text simple tasks with real rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tasks" 
                className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy-800 transition-colors"
              >
                Start Earning
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/admin" 
                className="inline-flex items-center justify-center gap-2 border-2 border-navy-900 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy-50 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900">$50K+</div>
              <div className="text-gray-600">Paid to Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900">10K+</div>
              <div className="text-gray-600">Active Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900">5K+</div>
              <div className="text-gray-600">Earning Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy-900">99%</div>
              <div className="text-gray-600">Approval Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900">Why Choose TaskMind?</h2>
            <p className="text-gray-600 mt-2">Simple, secure, and rewarding</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-gold-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Real Money Rewards</h3>
              <p className="text-gray-600">
                Earn competitive rates for every task completed. Withdraw your earnings anytime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Quick Approvals</h3>
              <p className="text-gray-600">
                Get your submissions reviewed quickly. Track status in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security. Transparent transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Task Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900">Types of Tasks</h2>
            <p className="text-gray-600 mt-2">Choose tasks that match your skills</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Photo Verification</h3>
              <p className="text-gray-600 text-sm mb-4">
                Verify product images, ID photos, and visual content.
              </p>
              <span className="text-gold-500 font-semibold">$2 - $10 per task</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Voice Recording</h3>
              <p className="text-gray-600 text-sm mb-4">
                Record voice samples for AI training datasets.
              </p>
              <span className="text-gold-500 font-semibold">$5 - $20 per task</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Text Review</h3>
              <p className="text-gray-600 text-sm mb-4">
                Review and improve AI-generated text content.
              </p>
              <span className="text-gold-500 font-semibold">$1 - $5 per task</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Data Entry</h3>
              <p className="text-gray-600 text-sm mb-4">
                Input and organize data from various sources.
              </p>
              <span className="text-gold-500 font-semibold">$3 - $15 per task</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-navy-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users earning money with TaskMind. It takes less than 2 minutes to sign up.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 bg-gold-500 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-400 transition-colors"
          >
            Create Free Account
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-navy-900" />
                </div>
                <span className="text-xl font-bold">TaskMind</span>
              </div>
              <p className="text-gray-400">
                Earn money with micro-tasks. Simple, secure, and rewarding.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/tasks" className="hover:text-white">Browse Tasks</Link></li>
                <li><Link href="/wallet" className="hover:text-white">Wallet</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Admin</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/admin/submissions" className="hover:text-white">Submissions</Link></li>
                <li><Link href="/admin/settings" className="hover:text-white">Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
