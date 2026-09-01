# 🗄️ Database Architecture & Schema — Homies Studio

## 1. Relational Entity Overview

```
                      auth.users
                          │ (1:1)
                          ▼
                       profiles
                          │ (1:1)
                          ▼
                   creator_profiles
                          │
          ┌───────────────┼───────────────┐
          │ (1:N)         │ (1:N)         │ (1:N)
          ▼               ▼               ▼
       projects    creator_earnings  withdrawals
          │
    ┌─────┴───────────────┬─────────────────┐
    │ (1:N)               │ (1:N)           │ (1:N)
    ▼                     ▼                 ▼
project_files        order_items         reviews
                          │ (N:1)
                          ▼
                       orders
                          │ (1:N)
                          ▼
                      downloads
```

---

## 2. Table Specifications

### 1. `profiles`
Stores user profile information tied directly to Supabase Auth (`auth.users`).
- `id` (UUID, PK, FK to `auth.users`)
- `full_name` (TEXT)
- `email` (TEXT, UNIQUE)
- `phone` (TEXT)
- `avatar_url` (TEXT)
- `role` (ENUM: `BUYER`, `CREATOR`, `ADMIN`)
- `is_verified` (BOOLEAN)

### 2. `creator_profiles`
Profiles and wallet balances for verified creators.
- `id` (UUID, PK)
- `user_id` (UUID, FK to `profiles.id`)
- `display_name` (TEXT)
- `handle` (TEXT, UNIQUE)
- `rating` (NUMERIC)
- `total_earnings` (NUMERIC)
- `available_balance` (NUMERIC)
- `pending_balance` (NUMERIC)
- `upi_id` (TEXT)
- `is_approved` (BOOLEAN)

### 3. `projects`
Core marketplace project entities with comprehensive technical metadata.
- `id` (UUID, PK)
- `creator_id` (UUID, FK to `creator_profiles.id`)
- `category_id` (UUID, FK to `categories.id`)
- `title` (TEXT)
- `slug` (TEXT, UNIQUE)
- `academic_price` (NUMERIC)
- `commercial_price` (NUMERIC)
- `status` (ENUM: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `CHANGES_REQUESTED`, `APPROVED`, `PUBLISHED`, `REJECTED`, `ARCHIVED`)
- `tech_stack` (TEXT[])
- `requirements` (JSONB)

### 4. `orders` & `order_items`
Financial transaction records and licensed project items.
- `orders`: `id`, `buyer_id`, `invoice_number`, `total_amount`, `currency`, `status`, `razorpay_order_id`, `razorpay_payment_id`
- `order_items`: `id`, `order_id`, `project_id`, `creator_id`, `license` (`ACADEMIC`, `COMMERCIAL`), `unit_price`

### 5. `downloads`
Secure token tracking for digital asset delivery.
- `id` (UUID, PK)
- `user_id` (UUID, FK to `profiles.id`)
- `order_id` (UUID, FK to `orders.id`)
- `project_id` (UUID, FK to `projects.id`)
- `file_id` (UUID, FK to `project_files.id`)
- `download_token` (TEXT, UNIQUE)
- `download_count` (INTEGER)
- `max_downloads` (INTEGER, DEFAULT 10)
- `token_expires_at` (TIMESTAMPTZ)

---

## 3. Database Triggers & Automations

1. **`on_auth_user_created`**: Automatically inserts a `profiles` row whenever a new user signs up in `auth.users`.
2. **`on_creator_earning_created`**: Automatically adds `net_creator_amount` to `creator_profiles.available_balance` and increments `sales_count`.
3. **`on_review_created_or_updated`**: Automatically recalculates and updates `projects.rating` and `projects.review_count`.
