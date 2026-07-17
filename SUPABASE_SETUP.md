# Supabase Database & Storage Setup Guide

Gopi Craft-Studio uses Supabase as a backend provider for PostgreSQL database, User Authentication, and File Storage.

## Automated Setup Checklist

1. **Deploy Schemas, Functions, Policies & Seeds**:
   Open the **SQL Editor** in your Supabase dashboard and execute the following SQL scripts in order:
   - Run `supabase/schema.sql` (Creates base database structure, RLS rules, and variant tables).
   - Run `supabase/functions.sql` (Stored procedures and auto-update timestamp triggers).
   - Run `supabase/policies.sql` (Compiles SELECT/WRITE RLS policies).
   - Run `supabase/indexes.sql` (Optimized indexes for slug/SKU/stock querying).
   - Run `supabase/seed.sql` (Populates categories, demo items, settings configuration, and testimonials).

2. **Bucket Provisioning & CLI Audit**:
   Execute the automated database setup script to verify connection and provision the `media` storage bucket:
   ```bash
   node scripts/setup-db.js
   ```

---

## Direct Database RLS Architecture
All 24 tables in the schema use Row Level Security (RLS) to enforce data integrity:
- **Public access** is allowed for product catalogs, category structures, blogs, and FAQ selections (`SELECT` only).
- **Public transactional operations** allow checkout insertions (`INSERT` into `orders` and `order_items`) and review reviews.
- **Admin operations** require authentication checks mapping the user `id` to `admin_users` table with roles (`super_admin`, `admin`, `editor`).
- **Wishlists** are restricted to authenticated owners.

For more technical details on the schema layouts, read the [Database Architecture Guide](DATABASE_GUIDE.md).
