# MomentsAI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://github.com/Nandansai08/momentsAi/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nandansai08/momentsAi/actions)
[![Version](https://img.shields.io/badge/version-0.1.0-blueviolet.svg)](CHANGELOG.md)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6.svg)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Turn life's most meaningful moments into beautiful, AI-generated tribute websites in minutes.

MomentsAI is a premium SaaS platform that solves a real problem: people want to celebrate birthdays, anniversaries, proposals, graduations and friendships in a way that feels personal — but a card feels small, a slideshow feels stale, and building a custom site takes days. MomentsAI compresses that into a guided 5-step wizard that produces a shareable, animated, themed micro-site backed by AI-written letters, timelines, music, guestbooks and reactions.

---

## 🌐 Live Demo

**Production:** https://main.d1b1qnz53c4sbl.amplifyapp.com/

*Replace with your own deployment URL after forking.*

---

## ✨ Feature Highlights

- **5-Step Generator Wizard** — pick occasion → enter highlights → choose theme → preview → publish.
- **Live Side-by-Side Preview** — every text, theme, image, or music change rerenders instantly.
- **Claude 3.5 Sonnet via AWS Bedrock** — AI-written letters, timelines, captions, and quotes.
- **Five Premium Themes** — Romantic Rosé, Cosmic Celestial, Cute Pastel, Slate Modern, Luxury Gold.
- **Wax-Sealed Letters** — envelopes with animated seal-breaking reveal.
- **Vinyl Music Player** — spinning vintage disc that syncs with the audio track.
- **Scroll-Reveal Timeline** — vertical animated memory journey.
- **Guestbook & Floating Reactions** — visitors leave messages and tap emoji that animate live.
- **Password Locks & Scheduled Reveals** — keep the moment intimate until the big day.
- **Creator Dashboard & Analytics** — views, unique visitors, devices, traffic origins.
- **Razorpay Subscription Hooks** — pre-wired, sandbox-friendly for local testing.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                         |
| ------------ | ------------------------------------------------------------------ |
| Framework    | Next.js 16 (App Router), React 19, TypeScript 6                    |
| Styling      | Tailwind CSS v4, CSS variables, Framer Motion, Lucide Icons        |
| Auth & DB    | Supabase (Postgres, Auth, Storage, Realtime, RLS)                  |
| AI Engine    | AWS Bedrock — Anthropic Claude 3.5 Sonnet                          |
| Payments     | Razorpay                                                           |
| Tooling      | ESLint 9, PostCSS, GitHub Actions CI                               |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.18 (Node 20 LTS recommended)
- **npm** ≥ 9 (or pnpm/yarn — examples below use npm)
- A **Supabase** project (free tier works)
- *(Optional)* **AWS Bedrock** access with Claude 3.5 Sonnet model enabled — without it, the generator falls back to a deterministic simulation
- *(Optional)* **Razorpay** test keys for payment flows

### Installation

```bash
git clone https://github.com/Nandansai08/momentsAi.git
cd momentsAi
npm install
```

### Environment Setup

Create a `.env.local` at the project root:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# AWS Bedrock (optional — falls back to simulator if blank)
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1

# Razorpay (optional)
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>
```

### Database Schema

In your Supabase project SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). This creates the `profiles`, `moments`, `themes`, `guestbook_entries`, `analytics_events` tables plus all RLS policies and triggers.

### Run Locally

```bash
npm run dev      # http://localhost:3001
npm run lint     # ESLint
npm run build    # production build
npm run start    # serve production build
```

---

## 📁 Project Structure

```
momentsAi/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, signup, OAuth callback
│   │   ├── (dashboard)/     # Creator dashboard & admin panel
│   │   ├── (generator)/     # 5-step wizard
│   │   ├── m/[slug]/        # Public moment pages
│   │   ├── api/moments/     # REST endpoints for CRUD + AI generation
│   │   ├── auth/            # Supabase auth callback handlers
│   │   ├── layout.tsx
│   │   └── page.tsx         # Marketing landing
│   ├── components/
│   │   ├── marketing/       # Navbar, footer, live preview, hero
│   │   ├── AnalyticsChart.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── bedrock/         # Claude prompt builders & invokers
│   │   ├── supabase/        # Browser/server/admin clients
│   │   ├── razorpay/        # Subscription helpers
│   │   └── utils.ts
│   ├── middleware.ts        # Auth-aware route protection
│   └── types/
├── supabase/
│   └── schema.sql           # Postgres schema + RLS policies
├── docs/                    # Architecture, setup, deployment, API
├── public/
└── .github/                 # CI, issue & PR templates
```

---

## 📸 Screenshots / Demo

> Screenshots will be added once the v0.2 visual pass lands. PRs welcome — drop them in `docs/screenshots/` and reference them here.

| Landing                              | Generator Wizard                  | Live Moment Page                  |
| ------------------------------------ | --------------------------------- | --------------------------------- |
| `docs/screenshots/landing.png`       | `docs/screenshots/generator.png`  | `docs/screenshots/moment.png`     |

A short demo video / GIF will live at `docs/demo.gif`.

---

## 🗺️ Roadmap

- **Phase 1 — Foundation** ✅ Stepped wizard, themes, auth, public moment pages
- **Phase 2 — Social & Customization** 🚧 Guestbook moderation, audio upload, analytics polish
- **Phase 3 — AI Extensions** 🔜 AI timeline generator, custom domains, multi-language letters
- **Phase 4 — Scale** 🔜 Mobile apps, collaborative editing, white-label workspaces

See the full roadmap in [`docs/roadmap.md`](docs/roadmap.md).

---

## 🤝 Contributing

We love contributions of every size — bug fixes, new themes, polish, docs. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch naming, commit conventions, and the PR checklist. Looking for somewhere to start? Browse issues labeled [`good-first-issue`](https://github.com/Nandansai08/momentsAi/labels/good-first-issue).

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 📄 License

Released under the [MIT License](LICENSE). © 2026 MomentsAI contributors.
