# D.I.STUDIO - Video Generation App Plan

## Task Overview
Build D.I.STUDIO - a video generation app that lets users create videos using their own image and a reference/sample video. Features include:
- Free tier: 7 video generations
- Pro subscription via Razorpay
- User-friendly interface

## Implementation Plan

### 1. Update Main Landing Page (app/page.tsx)
- [ ] Change branding from TaskMind to D.I.STUDIO
- [ ] Update hero section for video generation
- [ ] Add features section for D.I.STUDIO
- [ ] Add pricing section
- [ ] Update navigation

### 2. Create Video Generation Page (app/create/page.tsx)
- [ ] Upload user image section
- [ ] Upload sample video section
- [ ] Video preview section
- [ ] Generate button with loading state
- [ ] Download generated video option
- [ ] Video counter (7 free limit)

### 3. Create Pricing/Subscription Page (app/pricing/page.tsx)
- [ ] Free tier display (7 videos)
- [ ] Pro tier display with Razorpay integration
- [ ] Pricing cards with features

### 4. Create User Dashboard (app/dashboard/page.tsx)
- [ ] Display video generation count
- [ ] Show remaining free videos
- [ ] Pro subscription status
- [ ] Generated videos history

### 5. Create API Routes
- [ ] /api/video/generate - Video generation (simulated)
- [ ] /api/payment/razorpay - Razorpay payment integration
- [ ] /api/user/usage - Track video usage

### 6. Update Authentication
- [ ] Update login page for D.I.STUDIO
- [ ] Update signup page for D.I.STUDIO

### 7. Update Layout and Navigation
- [ ] Update app/layout.tsx metadata
- [ ] Update navigation in all pages

## Dependencies Needed
- razorpay (for payment processing)
- Additional UI components as needed
