# Product & Feature Roadmap

This document outlines the planned future features and development milestones for MomentsAI. We encourage contributors to select items from this roadmap to build or propose changes for!

---

## 🗺️ Release Phases

```
  Phase 1: Foundation      Phase 2: Social/Analytics      Phase 3: AI & Domains     Phase 4: Scaling
+--------------------+   +---------------------------+   +----------------------+   +------------------+
| - Stepped Creator  |   | - Live Guestbooks         |   | - Custom Domains     |   | - Mobile Apps    |
| - 5 Preset Themes  |   | - Vinyl Audio Player      |   | - AI Video Timeline  |   | - White-labeling |
| - Supabase Auth    |   | - Creator Analytics      |   | - Multi-Media Grid   |   | - Team Workspace |
+--------------------+   +---------------------------+   +----------------------+   +------------------+
```

---

## 🏁 Phase 1: Foundation & Core SaaS (Completed)
Focuses on compiling the core editing flow, visual preset layouts, and auth integrations.

* **Stepped Creation Wizard**: 5-step generator to specify occasions, dates, custom timeline memories, and visual themes.
* **Premium Design System**: Glassmorphism warm aesthetics, Outfit typefaces, radial light leak backdrops, and interactive hover feedback.
* **AI Generated Copywriting**: Connecting Next.js routes to Claude 3.5 Sonnet (Amazon Bedrock) to draft customized stories, timelines, and greeting text.
* **Core Authentication**: User registration, password resets, and Google OAuth callback setups via Supabase Auth.
* **Virtual Envelopes**: Wix-style wax-sealed animations that split open to reveal letters inside parchment scrolls.

---

## 🚀 Phase 2: Social Interactions & Analytics (In Progress)
Improving visitor engagement, visitor interactions, and creator insights.

- [ ] **Acoustic Background Music**: Custom vinyl player widget spinning in real-time while playing mp3 playlists.
- [ ] **Interactive Guestbooks**: Live guestbook panels letting visitors type wishes and see them updated instantly using Supabase Realtime replication.
- [ ] **Emoji Reaction Blasters**: Clickable heart/confetti buttons that spawn physics-based floating animations across the screen.
- [ ] **Creator Dashboard Charts**: Visual SVG/CSS charts displaying hourly visits, device classifications, and geolocation origins.
- [ ] **Guestbook Moderation Dashboard**: Let creators approve, hide, flag, or delete guestbook entries before they display.

---

## 🔮 Phase 3: AI Extensions & Custom Domain Support (Planned)
Transforming standard moment pages into fully customized web assets.

- [ ] **Custom Domain CNAME Mapping**: Hook up DNS check routes to allow creators to map their own domains (e.g. `wedding.ourname.com`) directly to their MomentsAI slug.
- [ ] **Multi-Media Image Gallery Grid**: Interactive photo masonry layout supporting lightbox transitions, zoom sweeps, and carousel slideshows.
- [ ] **AI-Assisted Video Timeline**: Generate slide transitions and short MP4 summaries from uploaded images using generative video models.
- [ ] **Password Locks & Reveal Timers**: Keep sites locked behind passcode inputs or launch scheduled countdown clocks.

---

## 👑 Phase 4: Mobile Apps & White-Label Workspaces (Long-term)
SaaS business expansion for enterprise, agencies, and event planners.

- [ ] **Native Mobile App (iOS & Android)**: Build React Native wrappers allowing creators to snap photos and instantly append them to live moment timelines.
- [ ] **White-Label Event Portals**: Allow event management companies to strip MomentsAI branding and configure custom subdomains.
- [ ] **Collaboration Workspaces**: Let multiple users edit the same moment site simultaneously (co-creators).
