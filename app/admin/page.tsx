"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileCheck, 
  Settings, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronRight,
  Percent,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { Submission, SubmissionStatus, RevenueAnalytics, Task } from "@/types";

// Mock data for admin dashboard
const mockAnalytics: RevenueAnalytics = {
  totalRevenue: 12500.00,
  totalPayouts: 4500.00,
  adminProfit: 8000.00,
  pendingSubmissions: 12,
  approvedSubmissions: 156,
  rejectedSubmissions: 23,
};

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Product Image Verification",
    description: "Verify product images",
    category: "photo_verification",
    reward_amount: 5.00,
    total_client_fee: 10.00,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Voice Sample Recording",
    description: "Record voice samples",
    category: "voice_recording",
    reward_amount: 15.00,
    total_client_fee: 25.00,
    status: "active",
    created_at: new Date().toISOString(),
  },
];

const mockSubmissions: (Submission & { user_name: string; task_title: string })[] = [
  {
    id: "1",
    user_id: "user1",
    task_id: "1",
    submission_type: "image",
    submission_url: "https://example.com/image1.jpg",
    submission_text: null,
    status: "pending",
    reviewed_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user_name: "John Doe",
    task_title: "Product Image Verification",
  },
  {
    id: "2",
    user_id: "user2",
    task_id: "1",
    submission_type: "image",
    submission_url: "https://example.com/image2.jpg",
    submission_text: null,
    status: "pending",
    reviewed_by: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user_name: "Jane Smith",
    task_title: "Product Image Verification",
  },
  {
    id: "3",
    user_id: "user3",
    task_id: "2",
    submission_type: "text",
    submission_url: null,
    submission_text: "This is my transcription...",
    status: "approved",
    reviewed_by: "admin",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user_name: "Bob Wilson",
    task_title: "Voice Sample Recording",
  },
  {
    id: "4",
    user_id: "user4",
    task_id: "2",
    submission_type: "text",
    submission_url: null,
    submission_text: "Another transcription...",
    status: "rejected",
    reviewed_by: "admin",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    user_name: "Alice Brown",
    task_title: "Voice Sample Recording",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [analytics] = useState<RevenueAnalytics>(mockAnalytics);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [commissionRate, setCommissionRate] = useState(50);
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(10);

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  const handleApprove = async (submissionId: string) => {
    // Simulate approval
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: "approved" as SubmissionStatus, reviewed_by: "admin" }
          : s
      )
    );
    toast.success("Submission approved!");
  };

  const handleReject = async (submissionId: string) => {
    // Simulate rejection
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: "rejected" as SubmissionStatus, reviewed_by: "admin" }
          : s
      )
    );
    toast.error("Submission rejected");
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: "active" | "inactive" | "archived") => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    toast.success(`Task status updated to ${newStatus}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-navy-900">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Payouts</p>
          <p className="text-2xl font-bold text-navy-900">${analytics.totalPayouts.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gold-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Admin Profit</p>
          <p className="text-2xl font-bold text-navy-900">${analytics.adminProfit.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Pending Submissions</p>
          <p className="text-2xl font-bold text-navy-900">{analytics.pendingSubmissions}</p>
        </div>
      </div>

      {/* Submission Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Submission Overview</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{analytics.approvedSubmissions}</p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{analytics.rejectedSubmissions}</p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-600">{analytics.pendingSubmissions}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900">Submissions Review</h2>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
          {pendingSubmissions.length} Pending
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-navy-900">
                          {submission.user_name.charAt(0)}
                        </span>
                      </div>
                      <span className="ml-3 text-sm font-medium text-navy-900">{submission.user_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{submission.task_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{submission.submission_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(submission.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(submission.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Reviewed by {submission.reviewed_by}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {submissions.length === 0 && (
          <div className="p-12 text-center">
            <FileCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-500">Submissions will appear here for review</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-navy-900">Task Management</h2>
        <button className="bg-navy-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-800 transition-colors">
          Create New Task
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-navy-900 mb-1">{task.title}</h3>
                <p className="text-sm text-gray-500">{task.category}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {task.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{task.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  Reward: <span className="font-medium text-green-600">${task.reward_amount}</span>
                </span>
                <span className="text-sm text-gray-500">
                  Fee: <span className="font-medium text-navy-900">${task.total_client_fee}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value as "active" | "inactive" | "archived")}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-navy-900">Platform Settings</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-6">Financial Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Percentage
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-navy-900 w-16 text-right">{commissionRate}%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Platform takes {commissionRate}% of each task fee
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Withdrawal Amount ($)
            </label>
            <input
              type="number"
              value={minimumWithdrawal}
              onChange={(e) => setMinimumWithdrawal(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-transparent"
              min="1"
              step="1"
            />
            <p className="text-sm text-gray-500 mt-2">
              Users must have at least ${minimumWithdrawal} to request a payout
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button className="bg-navy-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-navy-800 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Platform Analytics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-navy-900 mb-2" />
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-navy-900">1,234</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <FileCheck className="w-8 h-8 text-navy-900 mb-2" />
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-navy-900">{tasks.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Percent className="w-8 h-8 text-navy-900 mb-2" />
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-2xl font-bold text-navy-900">87%</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "submissions":
        return renderSubmissions();
      case "tasks":
        return renderTasks();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-navy-900">TaskMind</span>
              </Link>
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
            <Link href="/" className="text-sm text-gray-600 hover:text-navy-900">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "dashboard" 
                      ? "bg-navy-900 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "submissions" 
                      ? "bg-navy-900 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                  Submissions
                  {pendingSubmissions.length > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingSubmissions.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "tasks" 
                      ? "bg-navy-900 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === "settings" 
                      ? "bg-navy-900 text-white" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
