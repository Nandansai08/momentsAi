# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-06-03

This is the initial open-source release of MomentsAI, completely refactored with premium aesthetic redesigns, responsive interfaces, and interactive real-time previews.

### Added
- **Premium Redesign UI/UX**: Warm light-mode glassmorphic aesthetics, Google Fonts Outfit typography, smooth radial glows, and elegant hover animations.
- **Interactive Live Preview**: Split-screen live preview builder that renders changes in real time as the user configures messages, themes, music, and photos.
- **Dynamic Visual Templates**:
  - **Romantic Rosé**: Pink glassmorphic parchment with falling sakura petals and soft, romantic lettering.
  - **Cosmic Celestial**: A starry golden-gilded sky layout with stellar backdrops and custom animations.
  - **Cute Pastel**: A soft, bubbly theme with playful letters and bouncy animations.
  - **Slate Modern**: Clean, minimalist layout for elegant professional letters.
  - **Luxury Gold**: Premium gold-bordered layout with luxury font styling.
- **Wix-Style Wax Sealed Letters**: Virtual wax-seal envelopes that break open to display letter text beautifully inside parchment scroll views.
- **Creator Dashboard**: Redesigned dashboard featuring active website management, live visit analytics charts, and premium member badges.
- **OAuth Callback Error Handling**: Added client-side Suspense components in the login and signup forms to surface Supabase/Google redirection issues instead of failing silently.
- **CI/CD Workflow**: GitHub actions configuration for linting, type-checks, and automated builds.
- **Open Source Community Guidelines**: Added `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (MIT), and extensive documentation.

### Fixed
- Fixed missing `@emnapi/runtime` dependency build issue in AWS Amplify build configurations.
- Refactored Auth routing middleware to allow `/auth/callback` to process codes without session interception.
