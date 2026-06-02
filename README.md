# MomentsAI - Turn Memories Into Beautiful Websites

MomentsAI is a production-ready, premium SaaS platform that allows users to create deeply personal, emotional, and stunning websites for special life moments like birthdays, anniversaries, proposals, friendships, graduations, and other milestones in minutes.

Built inspired by premium designs like **Apple, Stripe, Linear, and Airbnb**, the platform leverages **Next.js 15 (App Router)**, **Supabase**, **Amazon Bedrock (Claude 3.5 Sonnet)**, and **Framer Motion** to assemble ultra-premium responsive web showcases.

---

## 🚀 Key Features

* **Stepped Website Generator**: A highly interactive, fully animated 5-step wizard to guide users through compiling occasions, entering personal highlights, and selecting themes.
* **Claude 3.5 Sonnet AI Engine**: Direct connection to Amazon Bedrock which writes emotional personal letters, timelines, quotes, poems, and creative captions.
* **Dynamic Theme Preset Cards**: Beautifully styled cards matching *Romantic Rose, Cosmic Dream, Modern Minimal, Luxury Gold, and Cute Pastel* theme configurations.
* **Music Vinyl Player**: A vintage custom-styled vinyl disc that spins in real-time as background acoustic soundtracks play!
* **Memory Journey Timeline**: An interactive vertical connector line showing beautiful scroll reveal animations.
* **Guestbooks & Emoji Reactions**: Let visitors write well-wishes and click floating emojis (hearts, likes, confetti) that animate live.
* **Password Locks & Timers**: Add password protections or scheduled reveal timers to keep moments intimate until the big day.
* **Admin Moderation & Analytics Panel**: Monitor views, unique visitors, devices, traffic origins, and ban/flag websites violating terms.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion
* **Backend**: Supabase (PostgreSQL, Auth, RLS, Real-time triggers)
* **AI Engine**: AWS Bedrock Client (Claude 3.5 Sonnet)
* **Payments**: Razorpay (Pre-wired subscription hooks, unlocked as free sandbox for local testing)

---

## 📂 Project Structure

```
/momentsAi
├── /src
│   ├── /app                     # Next.js App Router folders
│   │   ├── (auth)               # LoginPage, SignupPage, ResetPassword
│   │   ├── (dashboard)          # My Websites, Analytics, Billing, Settings, Admin Panel
│   │   ├── (generator)          # Stepper Wizard Moment Creator Studio
│   │   ├── /m                   # Dynamic Render Engine (/m/[slug])
│   │   ├── /api                 # Backend Server API endpoints
│   │   └── layout.tsx           # SEO Metadata & Geist variables
│   ├── /components              # Shared components
│   │   └── /marketing           # Navbar, Footer, LivePreviewMockup
│   ├── /lib                     # Utilities & Service Wrappers
│   │   ├── /supabase            # Browser/Server Supabase cookie handlers
│   │   ├── /bedrock             # AWS Bedrock invoking Claude 3.5 Sonnet
│   │   ├── /razorpay            # Payment verification signatures
│   │   └── utils.ts             # Tailwind-merging & formatters
│   ├── /types                   # TypeScript Interfaces for database rows
│   └── /styles                  # Styles and custom theme colors
├── /supabase                    # Local migrations
│   └── schema.sql               # PostgreSQL tables, security policies, triggers
├── .env.example                 # Configuration guidance
├── tailwind.config.ts           # CSS config
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone the project and install packages:
```bash
npm install
```

### 2. Configure Environment variables:
Copy `.env.example` to `.env.local` and input your keys:
```bash
# Add your local or production URLs:
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your Supabase parameters:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anonymous-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Add AWS credentials with Bedrock access (Optional - falls back to realistic developer simulation if empty!):
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
```

### 3. Deploy Database Schema in Supabase:
Go to your **Supabase Project $\rightarrow$ SQL Editor** and copy-paste the complete contents of `supabase/schema.sql`. Run it to set up:
* Profiles, moments, themes, media, guestbooks, analytics, and subscriptions tables.
* Row Level Security (RLS) policies securing details for creators while permitting public visitors to sign guestbooks.
* PostgreSQL triggers synchronizing profile signups and plans automatically.
* Visual preset theme rows.

### 4. Boot Up the Sandbox Studio:
Run the development build server locally:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience MomentsAI!

---

## 🔒 Row Level Security (RLS) & Security Policies

* **Profiles**: Users can read all public profiles, but can only mutate their own.
* **Moments**: Public visitors can read a moment only if it has `is_published = true`. Creators have full CRUD permissions over their own created slug entries.
* **Guestbooks**: Any public user can insert a guestbook entry into a moment, provided the moment is published. Only the moment owner can moderate (delete/approve) entries.
* **Analytics**: Views can be incremented via safe PostgreSQL Remote Procedure Calls (`increment_moment_views`), preventing direct table alterations from browsers.
