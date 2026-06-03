# Production Deployment Guide

This document describes how to deploy the MomentsAI Next.js application to **AWS Amplify** and link it with a production-grade **Supabase** instance.

---

## 🚀 Deployment to AWS Amplify

AWS Amplify is the recommended hosting provider for this Next.js App Router application.

### 1. Link Your Git Repository
1. Go to the [AWS Management Console](https://console.aws.amazon.com/) and navigate to **AWS Amplify**.
2. Click **New app** > **Host web app**.
3. Select **GitHub** and connect your repository (`Nandansai08/momentsAi`).
4. Select the `main` branch.

### 2. Configure Build Settings
Amplify automatically detects the Next.js framework. Make sure the build configuration matches this pattern:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .npm/**/*
      - .next/cache/**/*
```

> [!IMPORTANT]
> To prevent Amplify build failures, ensure `@emnapi/runtime` and `@emnapi/core` are defined in your `devDependencies` (which they are in the current codebase), so npm can resolve lockfiles successfully in the container.

### 3. Add Environment Secrets
In the AWS Amplify dashboard under **App Settings** > **Environment variables**, define your production keys:

* `NEXT_PUBLIC_APP_URL`: Set to your Amplify URL (e.g. `https://main.d1b1qnz53c4sbl.amplifyapp.com`).
* `NEXT_PUBLIC_SUPABASE_URL`: Your production Supabase project URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your production Supabase anonymous client key.
* `SUPABASE_SERVICE_ROLE_KEY`: Your production Supabase admin service key (required for admin endpoints).
* `AWS_ACCESS_KEY_ID`: IAM user access key.
* `AWS_SECRET_ACCESS_KEY`: IAM user secret.
* `AWS_REGION`: Set to `us-east-1` (or whichever region holds your Amazon Bedrock models).

---

## 🗄️ Supabase Production Setup

When deploying to a production Supabase instance:

### 1. Run Migrations
Import the database schema by executing [supabase/schema.sql](file:///c:/Users/nanda/momentsAi/supabase/schema.sql) in the Supabase SQL editor.

### 2. Verify Row Level Security (RLS)
Ensure RLS is enabled on all tables:
* Profiles table RLS checked.
* Moments table RLS checked.
* Guestbook entries RLS checked.
Run this query in your Supabase SQL editor to confirm RLS is active:
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```
All rows should return `true` for `rowsecurity`.

### 3. Update Redirect Whitelists
Under **Authentication** > **URL Configuration**:
* Change **Site URL** to `https://main.d1b1qnz53c4sbl.amplifyapp.com/`.
* Under **Redirect URLs**, add `https://main.d1b1qnz53c4sbl.amplifyapp.com/**` to allow secure redirects.

---

## 🎨 Google Cloud Console Production Transition

When transitioning Google OAuth credentials to production:

1. Open the **[Google Cloud Console](https://console.cloud.google.com)**.
2. Navigate to **APIs & Services** > **OAuth consent screen**.
3. Under "Publishing status", click **Publish App** to move it out of Sandbox testing. This allows any Google user to sign in, rather than only whitelisted test email accounts.
4. Update the **Authorized redirect URIs** in your client credential:
   ```
   https://YOUR_PRODUCTION_SUPABASE_REF.supabase.co/auth/v1/callback
   ```
5. Update your client ID and client secret inside the Supabase provider settings.
