# Contributing to MomentsAI

Thanks for taking the time to contribute! MomentsAI is a community-driven project and every fix, theme, polish, doc tweak, or new idea is appreciated. This guide will get you from a fresh fork to a merged PR.

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Table of Contents

1. [Fork & Clone](#fork--clone)
2. [Local Development](#local-development)
3. [Branch Naming](#branch-naming)
4. [Commit Message Format](#commit-message-format)
5. [Running Tests & Linting](#running-tests--linting)
6. [Pull Request Checklist](#pull-request-checklist)
7. [Code Review Process](#code-review-process)
8. [Reporting Bugs vs Requesting Features](#reporting-bugs-vs-requesting-features)

---

## Fork & Clone

1. **Fork** this repo from the GitHub UI to your account.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/momentsAi.git
   cd momentsAi
   ```
3. **Add the upstream remote** so you can pull in latest changes:
   ```bash
   git remote add upstream https://github.com/Nandansai08/momentsAi.git
   git fetch upstream
   ```
4. **Sync your `main`** before starting:
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## Local Development

Full setup lives in [`docs/setup.md`](docs/setup.md). Quick version:

```bash
npm install
cp .env.example .env.local    # then fill in Supabase + (optional) AWS keys
npm run dev                   # http://localhost:3001
```

You'll need a Supabase project with `supabase/schema.sql` applied. AWS Bedrock is optional — without credentials the AI generator falls back to a deterministic simulator so you can still develop UI without an AWS bill.

---

## Branch Naming

Branch off `main`. Use lowercase, hyphen-separated names with one of the prefixes below:

| Prefix       | Use For                                | Example                                |
| ------------ | -------------------------------------- | -------------------------------------- |
| `feat/`      | New feature, theme, template           | `feat/wax-seal-luxury-template`        |
| `fix/`       | Bug fix                                | `fix/google-oauth-redirect`            |
| `docs/`      | Docs-only change                       | `docs/clarify-bedrock-setup`           |
| `chore/`     | Tooling, deps, config                  | `chore/update-eslint-9`                |
| `refactor/`  | Non-functional code change             | `refactor/extract-letter-builder`      |
| `test/`      | Test-only changes                      | `test/cover-moment-api-routes`         |
| `perf/`      | Performance work                       | `perf/lazy-load-vinyl-player`          |

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

<optional body — explain *why*, not *what*>

<optional footer — BREAKING CHANGE, refs #123>
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`.

**Examples:**

```
feat(generator): add luxury-gold theme preset
fix(auth): handle expired OAuth code on /auth/callback
docs(setup): document Supabase storage bucket creation
chore(deps): bump framer-motion to 12.41
```

Keep the summary under 72 characters and use the imperative mood ("add", not "added").

---

## Running Tests & Linting

Before opening a PR, run every check the CI will run:

```bash
npm run lint           # ESLint (eslint.config.mjs)
npx tsc --noEmit       # TypeScript type-check
npm run build          # Make sure production build compiles
```

If you add new code paths, please cover them with tests in the relevant `__tests__` folder when applicable. UI changes should include before/after screenshots in the PR body.

---

## Pull Request Checklist

When you open a PR, the template will ask you to confirm:

- [ ] Branch name follows the convention above
- [ ] Commits follow Conventional Commits
- [ ] `npm run lint` passes with zero warnings
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] No `console.log`, `// TODO` left behind without an issue link
- [ ] No secrets, API keys, or Supabase service-role keys committed
- [ ] Updated relevant docs (`README.md`, `docs/*`) when behavior changed
- [ ] Added screenshots / Loom for UI changes
- [ ] Self-reviewed the diff
- [ ] Linked to an issue (`Closes #123`)

PRs that touch RLS, auth, billing, or migrations require an extra reviewer.

---

## Code Review Process

- **First response:** a maintainer will triage and respond within **2 business days**.
- **Review depth:** small PRs (<200 LOC) usually get reviewed end-to-end in the first pass. Larger PRs may get a structural review first, then a detail pass.
- **Iteration:** respond to comments by pushing new commits (don't force-push during review — it makes diffs hard to follow). Squash on merge is performed by the maintainer.
- **Merging:** requires at least one approving review and all CI checks green. PRs touching `supabase/schema.sql`, `middleware.ts`, or `src/lib/bedrock/**` require two approvals.
- **Stale PRs:** PRs without activity for 30 days will be politely pinged; 60 days and they may be closed (you can always reopen).

---

## Reporting Bugs vs Requesting Features

- **Found a bug?** Open an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include reproduction steps, expected vs actual behavior, and your environment (OS, browser, Node version).
- **Have a feature idea?** Open an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Lead with the **problem**, not the solution.
- **Doc gap?** Use the [Documentation Request template](.github/ISSUE_TEMPLATE/documentation_request.md).
- **Security vulnerability?** **Do not open a public issue.** Email **security@momentsai.dev** — see [SECURITY.md](SECURITY.md).

---

Thank you for helping make MomentsAI better. 💜
