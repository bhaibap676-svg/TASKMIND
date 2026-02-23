// Database Types for TaskMind

export type UserRole = 'user' | 'admin';

export type TaskCategory = 'photo_verification' | 'voice_recording' | 'text_review' | 'data_entry' | 'other';

export type TaskStatus = 'active' | 'inactive' | 'archived';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type TransactionType = 'earning' | 'payout';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  reward_amount: number; // Amount user earns
  total_client_fee: number; // Total fee from client
  status: TaskStatus;
  created_at: string;
  updated_at?: string;
}

export interface Submission {
  id: string;
  user_id: string;
  task_id: string;
  submission_type: 'image' | 'text';
  submission_url: string | null;
  submission_text: string | null;
  status: SubmissionStatus;
  reviewed_by: string | null;
  created_at: string;
  updated_at?: string;
  // Joined fields
  task?: Task;
  reviewer?: Profile;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
}

// Wallet calculation interfaces
export interface WalletInfo {
  balance: number;
  totalEarned: number;
  totalPayouts: number;
  pendingApprovals: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalPayouts: number;
  adminProfit: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
}

// Financial calculation types
export interface FinancialCalculation {
  userBalance: number;
  adminProfit: number;
  commissionPercentage: number;
}

// Category display names
export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  photo_verification: 'Photo Verification',
  voice_recording: 'Voice Recording',
  text_review: 'Text Review',
  data_entry: 'Data Entry',
  other: 'Other',
};

// Category icons (using lucide-react icon names as strings)
export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  photo_verification: 'Camera',
  voice_recording: 'Mic',
  text_review: 'FileText',
  data_entry: 'Database',
  other: 'MoreHorizontal',
};
