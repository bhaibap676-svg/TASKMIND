-- TaskMind Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TASKS TABLE
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('photo_verification', 'voice_recording', 'text_review', 'data_entry', 'other')),
  reward_amount NUMERIC(10, 2) NOT NULL, -- Amount user earns
  total_client_fee NUMERIC(10, 2) NOT NULL, -- Total fee from client
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBMISSIONS TABLE
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('image', 'text')),
  submission_url TEXT,
  submission_text TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earning', 'payout')),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SETTINGS TABLE
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
  ('commission_percentage', '50'),
  ('minimum_withdrawal', '10'),
  ('platform_fee', '5');

-- Insert sample tasks
INSERT INTO tasks (title, description, category, reward_amount, total_client_fee, status) VALUES
  ('Product Image Verification', 'Verify product images match the description and are of high quality. Check for clarity, correct colors, and proper lighting.', 'photo_verification', 5.00, 10.00, 'active'),
  ('Voice Sample Recording', 'Record voice samples for AI speech training. Read provided scripts clearly and with natural intonation.', 'voice_recording', 15.00, 25.00, 'active'),
  ('Text Content Review', 'Review AI-generated text for accuracy, grammar, and readability. Provide feedback on quality.', 'text_review', 3.00, 6.00, 'active'),
  ('Data Entry - Spreadsheet', 'Enter data from PDF documents into spreadsheet format. Ensure accuracy and completeness.', 'data_entry', 8.00, 15.00, 'active'),
  ('ID Document Verification', 'Verify ID documents are authentic and readable. Check for signs of tampering.', 'photo_verification', 10.00, 20.00, 'active');

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TASKS POLICIES
CREATE POLICY "Anyone can view active tasks" ON tasks
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage tasks" ON tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SUBMISSIONS POLICIES
CREATE POLICY "Users can view own submissions" ON submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions" ON submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending submissions" ON submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all submissions" ON submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all submissions" ON submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TRANSACTIONS POLICIES
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create earning transactions" ON transactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    type = 'earning' AND 
    status = 'completed'
  );

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can create all transactions" ON transactions
  FOR INSERT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SETTINGS POLICIES
CREATE POLICY "Anyone can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- FUNCTION TO AUTOMATICALLY CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER FOR NEW USER SIGNUP
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
