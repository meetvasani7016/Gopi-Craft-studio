# Gopi Craft-Studio Environment Variables Setup

This guide details the environment variables required to run Gopi Craft-Studio locally or in production.

## Required Variables List

Create a `.env.local` file in the root of the project (for local development) or configure these keys in your hosting provider's dashboard (for production deployment e.g. Vercel).

```env
# ------------------------------------------------------------------------------
# 1. Supabase Connection Keys (Client-Side)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ------------------------------------------------------------------------------
# 2. Supabase Service Role Key (Server-Side Operations Only)
# ------------------------------------------------------------------------------
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Detailed Variable Specifications

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: The REST endpoint of your Supabase project instance.
- **Where to find**: Go to **Project Settings** -> **API** in the Supabase Dashboard.
- **Security Scope**: Safe to expose client-side. Exposed to the browser with the `NEXT_PUBLIC_` prefix.

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: The anonymous public API key. It bypasses auth checks but respects Row Level Security (RLS) policies.
- **Where to find**: Go to **Project Settings** -> **API** in the Supabase Dashboard.
- **Security Scope**: Safe to expose client-side. Used by client components to query public products and categories.

### 3. `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: The administrative secret service key. It bypasses Row Level Security (RLS) entirely.
- **Where to find**: Go to **Project Settings** -> **API** in the Supabase Dashboard.
- **Security Scope**: **CRITICAL SECRET**. Never expose this key in client-side code, commit it to GitHub, or use the `NEXT_PUBLIC_` prefix. It is read strictly by Next.js Server Actions and CLI scripts to run admin tasks.
