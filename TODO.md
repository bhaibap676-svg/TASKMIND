# TaskMind - Implementation TODO

## Phase 1: Project Setup
- [x] Create Next.js project with App Router in D:/Projects/taskmind
- [x] Install dependencies: @supabase/supabase-js, @supabase/ssr, sonner, stripe, lucide-react
- [x] Configure Tailwind CSS with "Trust & Growth" theme (Navy Blue #1e3a8a, White, Gold #f59e0b)

## Phase 2: Database Schema (Supabase)
- [x] **profiles** - User profiles (extends auth.users): id, full_name, avatar_url, role, created_at
- [x] **tasks** - Available tasks: id, title, description, category, reward_amount, total_client_fee, status, created_at
- [x] **submissions** - User submissions: id, user_id, task_id, submission_type, submission_url, status (pending/approved/rejected), reviewed_by, created_at
- [x] **transactions** - Financial transactions: id, user_id, type (earning/payout), amount, status, created_at
- [x] **settings** - Admin settings: id, key, value (for commission %)

## Phase 3: Frontend Pages
- [x] **/** - Landing page with login/signup
- [x] **/tasks** - Task feed with filtering by category (using mock data)
- [x] **/tasks/[id]** - Task details with upload form (using mock data)
- [x] **/wallet** - User wallet showing balance and transaction history (using mock data)
- [x] **/admin** - Admin dashboard (protected, owner only) (using mock data)

## Phase 4: Connect to Supabase
- [ ] Create Supabase server client (lib/supabase/server.ts)
- [ ] Create auth middleware (lib/supabase/middleware.ts)
- [ ] Create /login page
- [ ] Create /signup page
- [ ] Connect /tasks page to Supabase
- [ ] Connect /tasks/[id] page to Supabase
- [ ] Connect /wallet page to Supabase
- [ ] Connect /admin page to Supabase
- [ ] Add auth protection to routes

## Phase 5: Security & Payments
- [x] RLS policies for data security
- [ ] Stripe Connect / PayPal payout integration logic
- [x] TypeScript interfaces for financial transactions

## Phase 6: UI/UX
- [x] Sonner toasts for feedback
- [x] Card-based task layout
- [x] Mobile-first responsive design
