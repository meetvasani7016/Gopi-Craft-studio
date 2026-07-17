# Vercel Hosting & Production Setup Guide

Gopi Craft-Studio is built with Next.js and is optimized for hosting on **Vercel** to support Incremental Static Regeneration (ISR) and edge functions.

## Step-by-Step Vercel Deployment

1. **Create Vercel Project**:
   - Log in to Vercel and click **Add New** -> **Project**.
   - Import your Gopi Craft-Studio repository.

2. **Configure Build Settings**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (Root folder)
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Configure Environment Variables**:
   Add the following variables in the **Environment Variables** tab:
   - `NEXT_PUBLIC_SUPABASE_URL` (Your Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Your public anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (Your private service role key)

4. **Deploy**:
   - Click **Deploy**. Vercel will build the project and compile the serverless APIs.

---

## Caching & Incremental Static Regeneration (ISR)
To combine lightning-fast load times with dynamic content flexibility:
- Pages representing content lists (Home page, category layouts, product detail views, blogs, FAQs) use Next.js ISR:
  ```typescript
  export const revalidate = 3600; // Rebuild static page in the background once per hour
  ```
- This serves cached HTML to visitors instantly, and triggers automated background updates as you edit products or write blogs inside the admin panel!
- The `/admin` dashboard and first-time setup wizard bypass caching routes completely:
  ```typescript
  export const revalidate = 0; // Forced dynamic rendering
  ```
