# Contributing to MomentsAI

Thank you for your interest in contributing to MomentsAI! We welcome and appreciate contributions of all kinds, including bug fixes, new templates, feature proposals, documentation improvements, and UI/UX polish.

Following these guidelines helps ensure a smooth, efficient, and welcoming contribution process for everyone.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any violations or inappropriate behavior to **security@momentsai.dev**.

---

## Contribution Workflow

We follow a standard fork-and-pull-request workflow:

1. **Fork** the repository to your own GitHub account.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/momentsAi.git
   cd momentsAi
   ```
3. **Configure the upstream remote**:
   ```bash
   git remote add upstream https://github.com/Nandansai08/momentsAi.git
   ```
4. **Create a feature branch** off `main` (see branch naming conventions below):
   ```bash
   git checkout -b feat/my-new-feature
   ```
5. **Make your changes** and commit them using [Conventional Commits](#commit-message-conventions).
6. **Ensure build & checks pass**:
   ```bash
   npm run lint
   npx tsc --noEmit
   ```
7. **Push** your branch to your fork:
   ```bash
   git push origin feat/my-new-feature
   ```
8. **Open a Pull Request (PR)** against the `main` branch of the upstream repository, and fill out the Pull Request Template.

---

## Local Development Setup

To set up the project locally, please read our detailed [Setup Guide](docs/setup.md). Below is a quick summary:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your local environment file:
   Copy `.env.example` to `.env.local` and fill in the required variables (Supabase URL, Anon Key, service role key, and Gemini API key).
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) (or whichever port Next.js boots on) to see your app running.

---

## Coding Standards & Conventions

### Frontend & Styling
* **Tailwind CSS & CSS**: We use Tailwind CSS v4 alongside Vanilla CSS variables for custom styling. Make sure to keep the theme warm, clean, and Light-Mode compatible. Avoid introducing direct inline styles; use Tailwind utility classes instead.
* **Icons**: Use `lucide-react` for icons.
* **Animations**: Use `framer-motion` for page transitions, interactive hover effects, and micro-animations to maintain a premium feel.
* **Responsive Layouts**: Design mobile-first. Ensure all screens are fully responsive and look stunning on mobile displays.

### Next.js Conventions
* We use the **Next.js App Router** with nested directories.
* Client components must include the `"use client";` directive at the top.
* Ensure data-fetching is handled via server components where possible, or via standard client-side fetches interacting with `/api` routes.

---

## Branch Naming Conventions

Use lowercase, hyphen-separated branch names prefixed by the type of change:

| Prefix | Description | Example |
| ------ | ----------- | ------- |
| `feat/` | A new feature or template | `feat/wax-seal-cosmic-template` |
| `fix/` | A bug fix | `fix/google-oauth-redirect` |
| `docs/` | Documentation changes | `docs/update-contributing` |
| `refactor/` | Code refactoring (no functional changes) | `refactor/optimize-moment-rendering` |
| `test/` | Adding or fixing tests | `test/add-generator-specs` |
| `chore/` | Maintenance tasks (dependency updates, configuration) | `chore/update-postcss` |

---

## Commit Message Conventions

We follow the [Conventional Commits specification](https://www.conventionalcommits.org/):

Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Allowed Types:
* **`feat`**: A new feature (e.g., `feat(templates): add luxury gold template for anniversaries`)
* **`fix`**: A bug fix (e.g., `fix(auth): parse oauth callback errors in login form`)
* **`docs`**: Documentation only changes (e.g., `docs(setup): update Supabase setup guide`)
* **`style`**: Changes that do not affect the meaning of the code (formatting, white-space, semi-colons, etc.)
* **`refactor`**: A code change that neither fixes a bug nor adds a feature (e.g., `refactor(utils): extract moment parser`)
* **`perf`**: A code change that improves performance
* **`test`**: Adding missing tests or correcting existing tests
* **`chore`**: Changes to the build process or auxiliary tools and libraries (e.g., `chore(deps): update framer-motion`)

---

## Pull Request Checklist

Before submitting a PR, make sure it satisfies the following:

- [ ] Code compiles without errors or warnings.
- [ ] No hydration mismatch warnings are introduced in Next.js.
- [ ] Responsive design works properly on mobile viewport dimensions.
- [ ] The change does not introduce any breaking changes to current website templates.
- [ ] You have run `npm run lint` and all lint rules pass.
- [ ] Description and screenshots (if applicable) are included in the PR template.
