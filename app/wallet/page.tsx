"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

export default function WalletPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletInfo, setWalletInfo] = useState({ balance: 0, totalEarned: 0, totalPayouts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  async function fetchWalletData() {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (txns) {
        setTransactions(txns);
        
        // Calculate totals
        const earnings = txns
          .filter(t => t.type === "earning" && t.status === "completed")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const payouts = txns
          .filter(t => t.type === "payout" && t.status === "completed")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        setWalletInfo({
          balance: earnings - payouts,
          totalEarned: earnings,
          totalPayouts: payouts
        });
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = async () => {
    if (walletInfo.balance < 10) {
      toast.error("Minimum withdrawal amount is $10.00");
      return;
    }
    setWithdrawAmount(walletInfo.balance.toFixed(2));
    setShowWithdrawModal(true);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setIsWithdrawing(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to withdraw");
        return;
      }

      // Call the withdrawal API
      const response = await fetch('/api/payment/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: walletInfo.balance,
          userId: user.id,
          upiId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Withdrawal of $${walletInfo.balance.toFixed(2)} submitted! Funds will be sent to ${upiId}`);
        
        // Create a pending transaction record
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'payout',
          amount: walletInfo.balance,
          status: 'pending',
          description: `Withdrawal to UPI: ${upiId}`
        });
        
        // Refresh wallet data
        fetchWalletData();
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (error) {
      toast.error("Failed to process withdrawal");
    } finally {
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
      setUpiId("");
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">My Wallet</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-navy-900" />
              <span className="text-gray-600">Available Balance</span>
            </div>
            <div className="text-3xl font-bold text-navy-900">${walletInfo.balance.toFixed(2)}</div>
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing || walletInfo.balance < 10}
              className="mt-4 w-full bg-navy-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-navy-800 disabled:opacity-50"
            >
              {isWithdrawing ? "Processing..." : "Withdraw"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownRight className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Total Earned</span>
            </div>
            <div className="text-3xl font-bold text-green-600">${walletInfo.totalEarned.toFixed(2)}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">Total Payouts</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">${walletInfo.totalPayouts.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-navy-900">Transaction History</h2>
          </div>
          <div className="divide-y">
            {transactions.length > 0 ? (
              transactions.map((txn) => (
                <div key={txn.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === "earning" ? "bg-green-100" : "bg-blue-100"
                    }`}>
                      {txn.type === "earning" ? (
                        <ArrowDownRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-navy-900">{txn.description}</h4>
                      <p className="text-sm text-gray-500">{formatDate(txn.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      txn.type === "earning" ? "text-green-600" : "text-navy-900"
                    }`}>
                      {txn.type === "earning" ? "+" : "-"}${Number(txn.amount).toFixed(2)}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === "completed" ? "bg-green-100 text-green-800" :
                      txn.status === "pending" ? "bg-amber-100 text-amber-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {txn.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {txn.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                      {txn.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500">Complete tasks to start earning!</p>
                <Link href="/tasks" className="inline-block mt-4 text-navy-900 hover:underline">
                  Browse Tasks
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-navy-900 mb-4">Withdraw Funds</h3>
            <p className="text-gray-600 mb-6">
              Enter your UPI ID to receive your earnings. Funds will be transferred instantly.
            </p>
            
            <form onSubmit={handleWithdrawSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Balance
                </label>
                <div className="text-2xl font-bold text-green-600">${walletInfo.balance.toFixed(2)}</div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter your UPI ID (e.g., mobilenumber@upi)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setUpiId("");
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="flex-1 bg-navy-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-navy-800 disabled:opacity-50"
                >
                  {isWithdrawing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Withdraw $${walletInfo.balance.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
