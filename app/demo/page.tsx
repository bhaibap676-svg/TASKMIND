"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, CheckCircle2 } from "lucide-react";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Set demo user in localStorage
    const demoUser = {
      id: "demo-user-id",
      email: "demo@taskmind.com",
      full_name: "Demo User",
      role: "user",
    };
    
    localStorage.setItem("demo_user", JSON.stringify(demoUser));
    localStorage.setItem("is_demo", "true");
    
    // Show success and redirect
    setTimeout(() => {
      router.push("/tasks");
    }, 1500);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-navy-900">TaskMind</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-4">
            Setting up Demo...
          </h1>
          <p className="text-gray-600">
            Please wait while we set up your demo account.
          </p>
        </div>
      </div>
    </div>
  );
}
