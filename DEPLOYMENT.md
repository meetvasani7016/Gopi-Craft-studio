# Gopi Craft-Studio Production Deployment Guide

This document outlines the step-by-step procedure to deploy Gopi Craft-Studio to a production environment. 

## Deployment Checklist

- [ ] **Supabase Backend Setup**: Provision database schemas, storage buckets, RLS security policies, and seed records.
- [ ] **Environment Configuration**: Set credentials inside `.env.local` (local) and Vercel dashboard (production).
- [ ] **Admin Registration**: Run the first-time setup wizard or direct CLI scripts to register the Super Admin account.
- [ ] **Vercel Frontend Hosting**: Connect repository, configure build settings, and configure ISR caching pathways.

---

## Step 1: Set up Supabase
Follow the [Supabase Setup Guide](SUPABASE_SETUP.md) to configure your database tables, indexes, storage buckets, triggers, and seed data.

## Step 2: Configure Environment Variables
Rename `.env.local.example` to `.env.local` and configure:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

## Step 3: Initialize Database & Create Super Admin
Run verification and database initialization commands:
```bash
# 1. Verify environment configuration
node scripts/verify-setup.js

# 2. Provision storage buckets
node scripts/setup-db.js

# 3. Register your Super Admin user
node scripts/create-admin.js --email admin@gopicraftstudio.com --password YourSecretPassword123
```
*Note: You can also use the client-side setup wizard at `/admin/setup-wizard` before registering any admins.*

## Step 4: Deploy to Vercel
Follow the [Vercel Hosting Guide](VERCEL_SETUP.md) to link your git repository, configure production env parameters, and deploy.
