#!/usr/bin/env node
/**
 * Bulk-creates the MomentsAI starter issue set via the GitHub REST API.
 * Safe to re-run: skips any issue whose title already exists (open or closed).
 *
 * Usage:
 *   GITHUB_TOKEN=xxx REPO_OWNER=Nandansai08 REPO_NAME=momentsAi node scripts/create-issues.mjs
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DELAY_MS = 500;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required env vars. Need GITHUB_TOKEN, REPO_OWNER, REPO_NAME.');
  process.exit(1);
}

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

const issues = [
  // ---------- Good First Issues ----------
  {
    title: 'Add volume control slider to the vinyl music player',
    body: `## Description
The vinyl music player (used on published moment pages) currently only supports play/pause — there's no way to adjust volume.

## Where to look
\`src/components\` — search for the vinyl/music player component used on \`src/app/m/[slug]\`.

## Proposed Change
Add a horizontal volume slider (0–100) next to the play/pause control. Persist the last-used volume in \`localStorage\` so it's remembered across page loads.

## Acceptance Criteria
- [ ] Slider renders next to the vinyl player controls
- [ ] Dragging the slider adjusts the \`<audio>\` element's \`volume\` property in real time
- [ ] Last volume is restored from \`localStorage\` on mount
- [ ] Fully keyboard accessible (arrow keys adjust volume)
- [ ] No layout shift on mobile viewports`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Show a read-time estimate on generated letters using calculateReadTime',
    body: `## Description
\`src/lib/utils.ts\` already exports a \`calculateReadTime(text)\` helper that estimates reading time in minutes, but it isn't wired up anywhere in the UI yet.

## Where to look
- \`src/lib/utils.ts\` (the helper, already implemented)
- The moment/letter rendering component under \`src/app/m/[slug]\`

## Proposed Change
Display a small "~X min read" badge near the wax-sealed letter once it's opened, using \`calculateReadTime\`.

## Acceptance Criteria
- [ ] Badge appears only after the letter envelope is opened
- [ ] Shows "< 1 min read" when the computed value is 1
- [ ] Styled consistently with the active theme (Romantic, Cosmic, Slate, Luxury, Cute)
- [ ] No badge rendered when there's no letter text`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Add a copy-to-clipboard tooltip confirmation for moment share links',
    body: `## Description
When a creator copies their published moment's share link from the dashboard, there's no visual confirmation that the copy succeeded beyond a generic state — it's easy to click twice or be unsure if it worked.

## Where to look
The dashboard "share" action — search \`src/app/(dashboard)/dashboard\` for the share/copy link button.

## Proposed Change
Show a small tooltip or inline label reading "Copied!" for ~1.5s after a successful \`navigator.clipboard.writeText\` call, then revert to the default "Copy link" state.

## Acceptance Criteria
- [ ] Tooltip/label appears immediately after copy succeeds
- [ ] Automatically reverts after ~1.5 seconds
- [ ] Works on touch devices (tap, not just hover)
- [ ] Gracefully handles \`navigator.clipboard\` being unavailable (e.g. insecure context)`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Generate initials-based avatar fallback in the dashboard navbar',
    body: `## Description
\`src/lib/avatar.ts\` already exports \`getInitials\` and \`getAvatarColorClass\`, used in some places, but the dashboard top navbar still doesn't show a user avatar fallback when no profile photo is set.

## Where to look
- \`src/lib/avatar.ts\` (helpers already implemented, no changes needed here)
- \`src/app/(dashboard)/layout.tsx\` or the dashboard navbar component

## Proposed Change
Render a circular avatar using \`getInitials(displayName)\` and \`getAvatarColorClass(displayName)\` in the dashboard navbar whenever the user has no avatar URL.

## Acceptance Criteria
- [ ] Shows initials + consistent color for users without an avatar
- [ ] Falls back to "U" when display name is missing
- [ ] Avatar circle matches existing sizing used elsewhere (e.g. guestbook avatars, if present)`,
    labels: ['good-first-issue', 'good-first-issue'],
    assignees: [],
  },

  // ---------- Bug Reports ----------
  {
    title: 'AI generator simulation ignores favoriteMemories beyond the 4th entry',
    body: `## Description
In \`src/lib/bedrock/*.ts\`, \`generateMockAIData\` builds a 4-item \`defaultTimeline\` array and overwrites entries by index when \`favoriteMemories\` is provided — but it silently drops any memories beyond index 3 instead of extending the timeline.

## Steps to Reproduce
1. Run the app without AWS Bedrock credentials configured (so the mock generator is used).
2. In the generator wizard, add 6 "favorite memories" in the timeline step.
3. Complete generation and view the resulting timeline on the published moment.

## Expected Behavior
All 6 memories should appear in the timeline (or the UI should clearly cap input at 4 with a hint).

## Actual Behavior
Only the first 4 memories are used; memories 5 and 6 are silently discarded with no warning to the user.

## Environment
- Node: any
- Deployment: local dev (mock AI path)

## Additional Context
Relevant code lives in the bedrock client file under \`src/lib/bedrock/\`, in the block that does:
\`\`\`js
if (params.favoriteMemories && params.favoriteMemories.length > 0) {
  params.favoriteMemories.forEach((mem, index) => {
    if (index < 4) { ... }
  });
}
\`\`\``,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },
  {
    title: 'formatDate returns empty string for valid ISO dates with timezone offsets on Safari',
    body: `## Description
\`formatDate\` in \`src/lib/utils.ts\` does \`new Date(dateString)\` then checks \`isNaN(date.getTime())\`. Certain ISO strings with timezone offsets (e.g. produced by some date pickers as \`2026-06-22T00:00:00+05:30\`) parse correctly in Chrome but have been reported to return an empty string on older Safari/WebKit due to stricter date parsing.

## Steps to Reproduce
1. Create a moment with an event date that includes a non-UTC timezone offset.
2. View the published moment timeline on Safari (or WebKit-based browser).
3. Observe the date label.

## Expected Behavior
Date renders as "June 22, 2026" regardless of browser.

## Actual Behavior
Date label is blank on affected WebKit versions.

## Environment
| Field | Value |
|---|---|
| OS | macOS |
| Browser | Safari 16/17 |
| Node version | n/a (client-side bug) |

## Additional Context
Consider normalizing the date string (e.g. stripping/handling offsets explicitly, or using a small date library) before passing to \`new Date()\`.`,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },
  {
    title: 'Guestbook entries can be submitted multiple times by rapid double-click',
    body: `## Description
The guestbook submit button on published moment pages does not appear to disable itself while the insert request is in flight, which can let an impatient visitor double-click and create duplicate guestbook entries.

## Steps to Reproduce
1. Open a published moment with guestbook enabled.
2. Fill in a guestbook message.
3. Double-click "Submit" rapidly on a slow network (throttle to "Slow 3G" in DevTools).
4. Refresh and check the guestbook list.

## Expected Behavior
Only one entry is created; the button is disabled/shows a loading state during submission.

## Actual Behavior
Two (or more) identical guestbook entries appear.

## Environment
| Field | Value |
|---|---|
| Browser | Any (Chrome DevTools network throttling used to reproduce) |
| Deployment | local / production |

## Additional Context
This is also a data-integrity / RLS concern — see \`supabase/schema.sql\` guestbook insert policy and SECURITY.md's "Validate Inputs" guidance.`,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },

  // ---------- Feature Requests ----------
  {
    title: 'Add an AI-generated timeline expansion feature (Phase 3 roadmap item)',
    body: `## Problem Statement
Users who only provide a couple of memory bullet points get a sparse, generic timeline from the mock generator. The roadmap (\`docs/roadmap.md\`, Phase 3: "AI Timeline Generator") already calls for richer AI-assisted timelines but it isn't implemented yet.

## Proposed Solution
When AWS Bedrock credentials are configured, add a "Expand with AI" button in the generator's timeline step that calls Claude 3.5 Sonnet (via \`src/lib/bedrock\`) to suggest 2-3 additional timeline entries based on the occasion, relationship, and existing entries the user already typed.

## Alternatives Considered
- Fully auto-generating the timeline with no user input — rejected, removes personalization which is the product's core value.
- Client-side template filling with no AI call — simpler but lower quality output.

## Additional Context
Builds directly on the existing \`generateMockAIData\` fallback behavior in \`src/lib/bedrock\` so it degrades gracefully without AWS credentials.

## Priority
- [x] priority:medium`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Support custom domain mapping for published moments',
    body: `## Problem Statement
Moments are currently only reachable at \`/m/[slug]\` on the shared domain. The roadmap's Phase 3 calls out "custom domain mappings," which several premium users have asked about so they can share a branded link (e.g. \`ourstory.love\`).

## Proposed Solution
Add a \`custom_domain\` column to the \`moments\` table (via a new Supabase migration), a verification flow (TXT record or meta-tag check), and Next.js middleware (\`src/middleware.ts\`) rewrite logic to route a verified custom domain to the corresponding moment slug.

## Alternatives Considered
- Subdomain-per-moment on the MomentsAI domain (e.g. \`name.momentsai.dev\`) — simpler to ship first, could be a stepping stone before full custom domains.

## Additional Context
This is a substantial feature touching DNS verification, middleware, and billing (likely a paid-tier gate via Razorpay). Should be scoped into smaller sub-issues before implementation.

## Priority
- [x] priority:medium`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Add password-protected moment preview link for creators before publishing',
    body: `## Problem Statement
Creators can add a password lock to a published moment, but there's no way to preview exactly what the password-gated experience looks like before sharing the link with the recipient — they currently have to publish first and test live.

## Proposed Solution
Add a "Preview as visitor" button in the generator's final step that opens the moment in a new tab using a signed, creator-only preview token, rendering the password-gate screen exactly as a real visitor would see it (without requiring the moment to be published yet).

## Alternatives Considered
- Inline modal simulation within the wizard — less accurate, doesn't catch real rendering issues (fonts, animations, password gate styling).

## Additional Context
Should reuse the existing password-lock UI component rather than duplicating it.

## Priority
- [x] priority:low`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Add CSV export for guestbook entries and analytics from the creator dashboard',
    body: `## Problem Statement
Creators with milestone moments (e.g. weddings, large birthday celebrations) often want to keep guestbook messages and visit analytics outside the platform — currently there is no export option in the dashboard or admin analytics panel.

## Proposed Solution
Add an "Export CSV" button in \`src/app/(dashboard)/dashboard\` (guestbook view) and in \`src/components/AnalyticsChart.tsx\`'s parent view, generating a downloadable CSV client-side from the already-fetched data.

## Alternatives Considered
- Server-side export endpoint — more scalable for very large guestbooks, but adds API surface; client-side CSV generation is sufficient for current data volumes.

## Additional Context
No new dependency should be required — a CSV string can be built manually and downloaded via a Blob URL.

## Priority
- [x] priority:low`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },

  // ---------- Documentation Issues ----------
  {
    title: 'Document how to enable AWS Bedrock Claude access in regions other than us-east-1',
    body: `## Which doc is missing or unclear?
\`docs/setup.md\` and the README's "Environment Setup" section only show \`AWS_REGION=us-east-1\` with no guidance for other regions, but Claude 3.5 Sonnet model availability on Bedrock varies by region and requires explicit model access requests in the AWS console.

## What should it cover?
- Which AWS regions currently support Claude 3.5 Sonnet on Bedrock
- Steps to request model access in the Bedrock console (this is a manual approval step many contributors miss)
- What error message/behavior to expect if the model isn't enabled (so it's debuggable instead of silently falling back to the mock generator)

## Who would benefit?
Contributors outside \`us-east-1\`-adjacent regions, and anyone confused why their AI generation "works" but always returns the same mock content despite having AWS keys set.`,
    labels: ['documentation'],
    assignees: [],
  },
  {
    title: 'Document the Supabase storage bucket setup required for moment image uploads',
    body: `## Which doc is missing or unclear?
\`supabase/schema.sql\` sets up database tables and RLS policies, but neither \`docs/setup.md\` nor the README mention creating a Supabase **Storage bucket** (and its own RLS policies) for moment photo uploads — this is a separate manual step in the Supabase dashboard.

## What should it cover?
- Bucket name expected by the app (check \`src/lib/supabase\` for the bucket reference)
- Whether the bucket should be public or private, and the recommended storage RLS policy
- File size / type restrictions enforced (if any) and where to configure them

## Who would benefit?
New contributors following \`docs/setup.md\` who get stuck with image upload failures because the storage bucket was never mentioned as a setup step.`,
    labels: ['documentation'],
    assignees: [],
  },

  // ---------- Refactor / Tech Debt ----------
  {
    title: 'Extract repeated theme-preview gradient maps into a single shared config',
    body: `## Description
\`SLATE_BACKGROUNDS\` in \`src/lib/utils.ts\` defines gradient class strings for one theme, but similar ad-hoc gradient/color maps for the other four themes (Romantic Rosé, Cosmic Celestial, Cute Pastel, Luxury Gold) appear to be duplicated inline across multiple theme-rendering components instead of living in one shared theme config module.

## Motivation
Duplicated style maps make it easy for themes to drift out of sync (e.g. updating the preview card but not the live renderer) and harder to add a 6th theme cleanly.

## Proposed Change
- Audit theme-related components under \`src/components\` and \`src/app/(generator)\`
- Consolidate all theme gradient/color definitions into a single \`src/lib/themes.ts\` (or similar) exporting a typed map keyed by theme id
- Update consuming components to import from the shared module

## Acceptance Criteria
- [ ] No visual regression in any of the 5 existing themes
- [ ] Single source of truth for theme color tokens
- [ ] TypeScript types prevent referencing a non-existent theme id`,
    labels: ['chore'],
    assignees: [],
  },
  {
    title: 'Replace hand-rolled mock AI data generator with a fixture-based test double',
    body: `## Description
\`generateMockAIData\` in \`src/lib/bedrock\` mixes "developer fallback when AWS isn't configured" concerns with what is effectively test fixture data (hardcoded quotes, poem, timeline structure) baked directly into application code that ships to production.

## Motivation
This makes the production bundle larger than necessary and conflates "graceful degradation for local dev" with "demo content," making it harder to reason about what real users actually see if Bedrock briefly errors out versus what a developer sees with no credentials configured.

## Proposed Change
- Split the simulation into a clearly-named \`devFallbackGenerator\` used only when \`NODE_ENV !== 'production'\` or credentials are absent
- For production Bedrock failures, return a typed error instead of silently substituting demo poetry/quotes
- Add unit tests covering both paths

## Acceptance Criteria
- [ ] Production Bedrock invocation failures surface a clear error/toast instead of mock content
- [ ] Local dev without AWS credentials still works exactly as before
- [ ] Mock content is colocated with test fixtures, not shipped as a runtime fallback in production builds`,
    labels: ['chore'],
    assignees: [],
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchExistingTitles() {
  const titles = new Set();
  let page = 1;

  while (true) {
    const res = await fetch(
      `${API_BASE}/issues?state=all&per_page=100&page=${page}`,
      { headers: HEADERS }
    );

    if (!res.ok) {
      throw new Error(`Failed to list existing issues: ${res.status} ${await res.text()}`);
    }

    const batch = await res.json();
    if (batch.length === 0) break;

    for (const issue of batch) {
      titles.add(issue.title);
    }

    if (batch.length < 100) break;
    page += 1;
  }

  return titles;
}

async function createIssue(issue) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      assignees: issue.assignees,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

async function main() {
  console.log(`Fetching existing issues for ${REPO_OWNER}/${REPO_NAME}...`);
  const existingTitles = await fetchExistingTitles();
  console.log(`Found ${existingTitles.size} existing issue(s).`);

  for (const issue of issues) {
    if (existingTitles.has(issue.title)) {
      console.log(`SKIP (duplicate): "${issue.title}"`);
      continue;
    }

    try {
      const created = await createIssue(issue);
      console.log(`CREATED #${created.number}: ${created.html_url}`);
    } catch (err) {
      console.error(`FAILED: "${issue.title}" — ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
