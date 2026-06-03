# Local Development Setup Guide

Follow this guide to get MomentsAI running on your local machine.

---

## 📋 Prerequisites
Before you start, make sure you have:
* **Node.js** (v18.x or higher recommended)
* **npm** (v9.x or higher)
* A free **[Supabase](https://supabase.com)** account
* A free **[Google Cloud Console](https://console.cloud.google.com)** account (if testing Google OAuth)

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Codebase
```bash
git clone https://github.com/Nandansai08/momentsAi.git
cd momentsAi
```

### 2. Install Packages
```bash
npm install
```

### 3. Setup Environment Variables
Create a copy of `.env.example` named `.env.local` in the project root:
```bash
cp .env.example .env.local
```

Open `.env.local` and configure the following variables:
```ini
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Supabase Credentials (Found under Project Settings > API in Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-reference.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-admin-key

# AWS Bedrock Access (Optional: Falls back to local simulation if empty)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
```

### 4. Import the Database Schema
1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** in the left navigation panel.
3. Click **New query**.
4. Copy the entire contents of [supabase/schema.sql](file:///c:/Users/nanda/momentsAi/supabase/schema.sql).
5. Paste it into the editor and click **Run**. This will create the required tables, triggers, and RLS policies.

---

## 🔐 Google OAuth Configuration
To allow users to login/signup using Google:

### 1. Google Cloud Console
1. Go to the [Credentials page](https://console.cloud.google.com/apis/credentials) and select/create a project.
2. Configure your **OAuth Consent Screen** (User type: *External*).
3. Under **Credentials**, click **Create Credentials** > **OAuth client ID**.
4. Select **Web application**.
5. Under **Authorized redirect URIs**, add your Supabase backend callback URL:
   ```
   https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
   ```
6. Click **Create** and copy the **Client ID** and **Client Secret**.

### 2. Supabase Dashboard
1. Go to **Authentication** > **Providers** > **Google**.
2. Enable the provider and paste the **Client ID** and **Client Secret**.
3. Go to **Authentication** > **URL Configuration**.
4. Add `http://localhost:3001/**` to the **Redirect URLs** whitelist to allow redirects back to your local development server.

---

## 🚀 Running the Project

Start the Next.js development server:
```bash
npm run dev
```

The server will start (usually on `http://localhost:3001` if port 3000 is occupied, which matches our `.env.local` config).

---

## 🔍 Troubleshooting & Common Issues

### 1. "Unsupported provider: provider is not enabled"
This means you tried to sign up or log in with Google, but Google is disabled in your Supabase Auth settings. Make sure you completed the steps under [Google OAuth Configuration](#-google-oauth-configuration).

### 2. Redirection goes to Port 3000 instead of 3001
If you log in and are redirected to `http://localhost:3000/?code=...` instead of `http://localhost:3001/auth/callback`:
* Supabase rejected the redirect URL because `http://localhost:3001/**` is missing from the **Redirect URLs** whitelist under **Authentication > URL Configuration** in the Supabase Dashboard. 

### 3. AWS Bedrock Access Denied
If you encounter AWS credential errors, verify that:
* Your AWS user has the `AmazonBedrockFullAccess` IAM policy attached.
* Your account has **granted model access** for **Claude 3.5 Sonnet** in the Bedrock console for your chosen region (e.g. `us-east-1`).
