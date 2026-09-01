# 🚀 Deployment Guide — Homies Studio Production

## 1. Prerequisites

1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com).
2. **Razorpay Account**: Set up merchant credentials at [razorpay.com](https://razorpay.com).
3. **Vercel Account**: For Next.js continuous deployment.

---

## 2. Database Migration Steps

Run the migrations in sequential order using the Supabase SQL Editor or Supabase CLI:

```bash
# Using Supabase CLI:
supabase link --project-ref your-project-ref
supabase db push

# Or run files in order in Supabase SQL editor:
# 1. supabase/migrations/001_profiles.sql
# 2. supabase/migrations/002_categories.sql
# 3. supabase/migrations/003_projects.sql
# 4. supabase/migrations/004_project_files_and_images.sql
# 5. supabase/migrations/005_orders_and_payments.sql
# 6. supabase/migrations/006_creator_earnings_and_withdrawals.sql
# 7. supabase/migrations/007_reviews_and_wishlists.sql
# 8. supabase/migrations/008_moderation_and_notifications.sql
# 9. supabase/migrations/009_row_level_security.sql
```

---

## 3. Storage Bucket Configuration

In the Supabase Storage Dashboard:
1. Create bucket `project-media` -> **Public Bucket** = ON.
2. Create bucket `project-deliverables` -> **Public Bucket** = OFF (Private).

---

## 4. Vercel Environment Variables

Set the following variables in your Vercel Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_live_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=https://homiesstudio.com
```

---

## 5. Verification Checklist

- [x] All 9 SQL migrations executed cleanly without syntax errors.
- [x] Row Level Security (RLS) active on all 16 tables.
- [x] Private files bucket verified as non-public.
- [x] `npm run build` completes with exit code 0.
