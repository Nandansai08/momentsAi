# Security Policy

We take security seriously at MomentsAI. We appreciate your help in keeping the application and our users safe by disclosing vulnerabilities responsibly.

## Supported Versions

Only the latest release version on the `main` branch is actively supported with security patches.

| Version | Supported |
| ------- | --------- |
| v0.1.x  | ✅ Yes    |
| < v0.1  | ❌ No     |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please report it privately to our team:

1. Send an email to **security@momentsai.dev** describing the vulnerability.
2. Provide details including:
   * A description of the issue.
   * Step-by-step instructions to reproduce the issue (proof-of-concept script/exploit).
   * The potential impact on users or the system.
   * Your name and contact information if you would like to be credited.

We will acknowledge receipt of your report within 48 hours and work with you to analyze, reproduce, and resolve the issue. We request that you do not publish details of the vulnerability until we have patched it.

## Responsible Disclosure Guidelines

If you follow these guidelines, we will work with you in a constructive manner and will not pursue legal action:

* Give us a reasonable amount of time to resolve the issue before making any information public.
* Avoid violating privacy, destroying data, or interrupting our services (e.g. performing DDoS attacks, spamming, or phishing).
* Do not access or modify data belonging to other users without authorization.

## Security Best Practices for MomentsAI

When contributing code to this repository:
1. **Never commit credentials**: Ensure all database URLs, service keys, Gemini API keys, and client secrets are handled strictly via environment variables (e.g. `.env.local`).
2. **Review Row Level Security (RLS)**: Any new tables created in Supabase must have RLS enabled with explicit SELECT, INSERT, UPDATE, and DELETE policies.
3. **Validate Inputs**: Ensure server routes and API endpoints validate input parameters to prevent injection or malicious inputs.
