# Beginner-Friendly Issues (Good First Issues)

We have compiled a list of **30 beginner-friendly issues** to help first-time contributors get involved with MomentsAI. Each issue includes the problem description, goal, acceptance criteria, difficulty level, and recommended labels.

---

## Index of Issues

1. [Dark Mode Toggle for Dashboard](#1-dark-mode-toggle-for-dashboard)
2. [Improve Loading Skeletons for Website Cards](#2-improve-loading-skeletons-for-website-cards)
3. [Add Floating Share Button on Moment Page](#3-add-floating-share-button-on-moment-page)
4. [Improve Mobile Navbar Collapsing Menu](#4-improve-mobile-navbar-collapsing-menu)
5. [Add Analytics Chart to Dashboard](#5-add-analytics-chart-to-dashboard)
6. [Optimize Image Gallery Lazy Loading](#6-optimize-image-gallery-lazy-loading)
7. [Accessibility Improvements for Forms](#7-accessibility-improvements-for-forms)
8. [Interactive Creator Onboarding Walkthrough](#8-interactive-creator-onboarding-walkthrough)
9. [Confetti Burst on Successful Moment Creation](#9-confetti-burst-on-successful-moment-creation)
10. [Custom Icon Picker for Timeline Events](#10-custom-icon-picker-for-timeline-events)
11. [Input Character Counter in Generator Form](#11-input-character-counter-in-generator-form)
12. [Dashboard Empty State Visual Polish](#12-dashboard-empty-state-visual-polish)
13. [Volume Control Slider for Music Player](#13-volume-control-slider-for-music-player)
14. [Auto-Focus First Field in Wizard Steps](#14-auto-focus-first-field-in-wizard-steps)
15. [Copy Link to Clipboard Tooltip Feedback](#15-copy-link-to-clipboard-tooltip-feedback)
16. [Print-to-PDF CSS Stylesheet for Letters](#16-print-to-pdf-css-stylesheet-for-letters)
17. [Keyboard Escape-Key Listeners for Modals](#17-keyboard-escape-key-listeners-for-modals)
18. [Prevent Far Future Event Dates in Datepicker](#18-prevent-far-future-event-dates-in-datepicker)
19. [Confirm Delete Modal Dialog for Moments](#19-confirm-delete-modal-dialog-for-moments)
20. [Initial-based Avatar Placeholder Generator](#20-initial-based-avatar-placeholder-generator)
21. [Standardized Visual Form Errors Banners](#21-standardized-visual-form-errors-banners)
22. [Read-Time Indicator on Generated Stories](#22-read-time-indicator-on-generated-stories)
23. [Special Heart Custom Cursor on Romantic Theme](#23-special-heart-custom-cursor-on-romantic-theme)
24. [Scroll-to-Top Indicator for Long Timelines](#24-scroll-to-top-indicator-for-long-timelines)
25. [Visitor Badge Count on Guestbook Header](#25-visitor-badge-count-on-guestbook-header)
26. [Background Color Customization for Slate Template](#26-background-color-customization-for-slate-template)
27. [Template Selection Highlight Glow in Wizard](#27-template-selection-highlight-glow-in-wizard)
28. [Minimum Description Length Validation in Timeline Inputs](#28-minimum-description-length-validation-in-timeline-inputs)
29. [Disable Buttons and Show Spinner during Guestbook Submission](#29-disable-buttons-and-show-spinner-during-guestbook-submission)
30. [Custom SEO Meta Tags Fields in Generator Wizard](#30-custom-seo-meta-tags-fields-in-generator-wizard)

---

## Detailed Issues

### 1. Dark Mode Toggle for Dashboard
* **Problem**: The dashboard is light-mode first (which looks premium), but some users working late at night prefer a dark theme option to save battery and eye strain.
* **Goal**: Add a theme toggle in the dashboard header that toggles a `.dark` class on the root element.
* **Acceptance Criteria**:
  * Toggle button with Sun/Moon icons in dashboard header.
  * Theme preference persisted in `localStorage`.
  * Visual styling adjusted gracefully via CSS variables.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 2. Improve Loading Skeletons for Website Cards
* **Problem**: When loading moments on the dashboard list, the current transition is a simple text "Loading...", which causes visual layout shift.
* **Goal**: Build an elegant animated shimmer skeleton layout using CSS keyframes that mimics the size of cards.
* **Acceptance Criteria**:
  * Shimmering gradient animation.
  * Matching borders and size configurations of dashboard cards.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 3. Add Floating Share Button on Moment Page
* **Problem**: Sharing moments depends on copying the browser URL, which can be difficult on mobile devices.
* **Goal**: Add a floating quick-share button on published moments pages that triggers the native mobile navigator share sheet or copies the URL.
* **Acceptance Criteria**:
  * Sticky or floating circular button on mobile viewports.
  * Uses `navigator.share()` if supported, falling back to clipboard copy.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 4. Improve Mobile Navbar Collapsing Menu
* **Problem**: Clicking the mobile menu button in the marketing navbar toggles instantly without smooth animations.
* **Goal**: Add slide-down and fade-in transitions using Framer Motion when the mobile menu is opened.
* **Acceptance Criteria**:
  * Responsive layout is maintained.
  * Smooth entry and exit transitions.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 5. Add Analytics Chart to Dashboard
* **Problem**: The analytics page currently displays simple numerical blocks instead of visual trendlines.
* **Goal**: Add a lightweight CSS/SVG chart demonstrating visit statistics over the last 7 days.
* **Acceptance Criteria**:
  * Render an SVG line or bar chart using mock daily visit data.
  * Interactive tooltips displaying visit counts on hover.
* **Difficulty**: Medium
* **Labels**: `good first issue`, `frontend`, `performance`

---

### 6. Optimize Image Gallery Lazy Loading
* **Problem**: Moments pages with large numbers of high-resolution images load all images at once, slowing page load speed.
* **Goal**: Implement lazy loading for images using Next.js `next/image` component or native browser loading.
* **Acceptance Criteria**:
  * Images use `loading="lazy"`.
  * Add a smooth fade-in transition once loaded.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `performance`

---

### 7. Accessibility Improvements for Forms
* **Problem**: Several input fields in the stepped wizard lack descriptive labels or ARIA tags, making screen reader navigation difficult.
* **Goal**: Standardize inputs, adding clear `htmlFor` attributes, and `aria-describedby` helper IDs.
* **Acceptance Criteria**:
  * Forms pass Lighthouse accessibility audit with a score > 95.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `accessibility`

---

### 8. Interactive Creator Onboarding Walkthrough
* **Problem**: First-time dashboard creators are left to figure out the wizard stepper layout on their own.
* **Goal**: Create a lightweight guided popover tour introducing the "Create New Moment" action.
* **Acceptance Criteria**:
  * Guided tooltip explaining actions step-by-step.
  * Dismissible with a "Skip Tour" button that sets a cookie/localstorage key.
* **Difficulty**: Medium
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 9. Confetti Burst on Successful Moment Creation
* **Problem**: Completing the moment creation stepper lands on success pages with no visual celebrations.
* **Goal**: Trigger a canvas confetti shower when the user successfully publishes their website.
* **Acceptance Criteria**:
  * Uses `canvas-confetti` library.
  * Triggered immediately on redirection to the success card.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 10. Custom Icon Picker for Timeline Events
* **Problem**: All timeline items share the same default dot icon, reducing visual personalization.
* **Goal**: Add an option to select from 5 Lucide icons (Heart, Star, Camera, Gift, MapPin) for each timeline node.
* **Acceptance Criteria**:
  * Icon picker dropdown in step 3 of the generator.
  * Chosen icons saved in DB and rendered in the moment timeline.
* **Difficulty**: Medium
* **Labels**: `good first issue`, `frontend`, `database`

---

### 11. Input Character Counter in Generator Form
* **Problem**: Users sometimes input extremely long descriptions that break visual layout bounds.
* **Goal**: Add a character counter below the personal message text area showing limits (e.g. `X / 500 characters`).
* **Acceptance Criteria**:
  * Character counter changes color (e.g., to orange/red) when nearing limit.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 12. Dashboard Empty State Visual Polish
* **Problem**: New dashboard lists show a plain "No websites found" text that lacks a premium feel.
* **Goal**: Design a premium glassmorphic empty state featuring an illustration, descriptive copy, and a call-to-action button.
* **Acceptance Criteria**:
  * Clean vector SVG icon or ambient illustration.
  * Centered layout with primary "Create New Moment" button.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 13. Volume Control Slider for Music Player
* **Problem**: The soundtrack player plays audio at full volume, which can startle visitors.
* **Goal**: Add a sound volume control slider to the vinyl player layout.
* **Acceptance Criteria**:
  * Hover or click reveals volume slider.
  * Integrates with HTML5 audio element's volume API.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 14. Auto-Focus First Field in Wizard Steps
* **Problem**: Progressing to a new step in the generator wizard requires a click to begin typing, creating minor friction.
* **Goal**: Add automatic input focusing to the primary text field when steps change.
* **Acceptance Criteria**:
  * First input or textarea focused automatically upon mounting a step.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 15. Copy Link to Clipboard Tooltip Feedback
* **Problem**: Clicking the "Copy Link" button copies the URL but lacks visual confirmation feedback.
* **Goal**: Add a temporary tooltip saying "Copied!" that displays for 1.5 seconds.
* **Acceptance Criteria**:
  * Tooltip fades in/out cleanly above the button.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 16. Print-to-PDF CSS Stylesheet for Letters
* **Problem**: Users want to print their AI-generated letters to give as physical gifts, but printing pages prints site menus and headers.
* **Goal**: Add print-specific CSS rules (`@media print`) that hide headers, buttons, and players, formatting just the letter paper.
* **Acceptance Criteria**:
  * Print dialog renders only the letter text centered on standard A4 layout.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 17. Keyboard Escape-Key Listeners for Modals
* **Problem**: Modals like the media lightbox require clicking the close "X" to close, which can be annoying.
* **Goal**: Add keydown event listeners to close modals on `Escape` keypress.
* **Acceptance Criteria**:
  * Pressing `Esc` closes lightboxes or confirmation modals.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 18. Prevent Far Future Event Dates in Datepicker
* **Problem**: Creators can set event dates years in the future (e.g., Year 3000), which results in strange AI-generated messages.
* **Goal**: Enforce validation limits on date selection.
* **Acceptance Criteria**:
  * Prevents selecting dates more than 5 years in the future.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 19. Confirm Delete Modal Dialog for Moments
* **Problem**: Clicking delete on the dashboard deletes a moment immediately, risking accidental data loss.
* **Goal**: Add an elegant confirmation dialog asking if the user is sure they want to delete.
* **Acceptance Criteria**:
  * User must type the moment slug or click a "Confirm Delete" action.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 20. Initial-based Avatar Placeholder Generator
* **Problem**: Users without custom avatars display generic gray blank icons in comments/guestbooks.
* **Goal**: Fall back to displaying initials (e.g. `NS`) on a colored glassmorphic background if no avatar URL is present.
* **Acceptance Criteria**:
  * Helper function parsing first letters of names.
  * Rendered as circular CSS block.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 21. Standardized Visual Form Errors Banners
* **Problem**: API errors during moment generation display inside browser alerts, which feels unprofessional.
* **Goal**: Standardize component form error display to render inside beautiful visual error banners.
* **Acceptance Criteria**:
  * Renders inline below/above form submission button.
  * Transitions smoothly using CSS height/opacity transitions.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 22. Read-Time Indicator on Generated Stories
* **Problem**: Timelines and story narratives can be long, and readers don't know the time investment required.
* **Goal**: Calculate and display an estimated read time (e.g., `2 min read`) near the story header.
* **Acceptance Criteria**:
  * Simple word count calculator function (e.g. 200 words per minute average).
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 23. Special Heart Custom Cursor on Romantic Theme
* **Problem**: The Romantic template is beautiful but could feel even more playful and interactive.
* **Goal**: Replace the default mouse pointer cursor with a customized heart cursor on the romantic template view.
* **Acceptance Criteria**:
  * Custom cursor changes active state on click.
  * Disabled on touch screens to prevent scrolling lag.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 24. Scroll-to-Top Indicator for Long Timelines
* **Problem**: Scrolling to the bottom of a timeline with many memories requires manual scrollback.
* **Goal**: Add a scroll-to-top button that appears when the user scrolls down past 500px.
* **Acceptance Criteria**:
  * Button shows up fixed in bottom-right corner.
  * Smooth scrolls page to top on click.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 25. Visitor Badge Count on Guestbook Header
* **Problem**: The guestbook section displays cards but doesn't share how active the community greetings are.
* **Goal**: Query count of guestbook messages and show a count badge (e.g. `12 Wishes`).
* **Acceptance Criteria**:
  * Queries database counts or displays length of messages array.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `database`

---

### 26. Background Color Customization for Slate Template
* **Problem**: The minimal slate template is fixed to a light gray, which can look plain.
* **Goal**: Allow selection between 3 slate background sub-colors (Warm White, Cool Gray, Cream).
* **Acceptance Criteria**:
  * Options selectable in the generator step 4.
  * Saved in DB as custom theme configs and applied to `/m/[slug]`.
* **Difficulty**: Medium
* **Labels**: `good first issue`, `frontend`, `database`

---

### 27. Template Selection Highlight Glow in Wizard
* **Problem**: In the generator stepper, selecting a template updates the underlying form, but the visual cards don't make it clear which one is active.
* **Goal**: Add a prominent highlight border and radial glow to the selected template card.
* **Acceptance Criteria**:
  * Ring border colored to primary gradient with a checkmark badge.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`, `ui/ux`

---

### 28. Minimum Description Length Validation in Timeline Inputs
* **Problem**: Users submit timeline memories with 1-word text (e.g. "dinner"), which results in poorly worded timeline nodes.
* **Goal**: Enforce a minimum length of 5 characters for timeline description inputs.
* **Acceptance Criteria**:
  * Shows validation message if the input length is too short.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 29. Disable Buttons and Show Spinner during Guestbook Submission
* **Problem**: Visitors can double-click "Submit" on guestbook comments, inserting duplicate messages in the database.
* **Goal**: Disable the submit button and show a spinner while the API request is loading.
* **Acceptance Criteria**:
  * Button disabled on click.
  * Spinner indicator replaces label text during POST request.
* **Difficulty**: Easy
* **Labels**: `good first issue`, `frontend`

---

### 30. Custom SEO Meta Tags Fields in Generator Wizard
* **Problem**: Shared links display default platform description snippets on messaging apps instead of personalized captions.
* **Goal**: Add input fields in the advanced settings step to write custom meta titles and meta descriptions.
* **Acceptance Criteria**:
  * Custom inputs saved in the `moments` table database record.
  * Applied dynamically to `<title>` and `<meta>` tags on `/m/[slug]` pages.
* **Difficulty**: Medium
* **Labels**: `good first issue`, `frontend`, `database`
