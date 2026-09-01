# 🌐 Homies Studio — Build, Launch & Grow Digital Products

> **"Build Something. Launch Something. Grow Something. Where Ideas Become Possibilities."**

**Homies Studio** is a premier digital product and engineering studio empowering students, creators, startups, and businesses to build, launch, and scale exceptional digital products and engineering solutions.

The platform provides a unified hub where technical creators can package, monetize, and distribute production-grade software and engineering projects, while educational institutions, startups, individual students, and enterprises can discover verified solutions or submit custom requirements via an interactive multi-sector consultation pipeline.

---

## Table of Contents

- [1. Platform Overview](#1-platform-overview)
- [2. Key Platform Capabilities](#2-key-platform-capabilities)
  - [Public Experience](#public-experience)
  - [Project Marketplace](#project-marketplace)
- [3. User Roles & RBAC](#3-user-roles--rbac)
- [4. Creator Studio](#4-creator-studio)
- [5. Project Submission Wizard](#5-project-submission-wizard)
- [6. Admin Moderation & Governance Console](#6-admin-moderation--governance-console)
- [7. Multi-Sector "Start a Conversation" System](#7-multi-sector-start-a-conversation-system)
- [8. WhatsApp Integration Architecture](#8-whatsapp-integration-architecture)
- [9. Supabase Database & Backend Architecture](#9-supabase-database--backend-architecture)
- [10. Supabase Storage Architecture & File Management](#10-supabase-storage-architecture--file-management)
- [11. Realtime Subscriptions](#11-realtime-subscriptions)
- [12. Authentication & Route Security](#12-authentication--route-security)
- [13. Design System & 3-Layer Visual Engine](#13-design-system--3-layer-visual-engine)
- [14. Technology Stack](#14-technology-stack)
- [15. Project Structure](#15-project-structure)
- [16. Environment Variables](#16-environment-variables)
- [17. Local Development Setup](#17-local-development-setup)
- [18. Database Setup & Migrations](#18-database-setup--migrations)
- [19. Build & Production Deployment](#19-build--production-deployment)
- [20. Troubleshooting Guide](#20-troubleshooting-guide)
- [21. Security Posture](#21-security-posture)
- [22. Business & Interaction Workflows](#22-business--interaction-workflows)
- [23. Verification & Testing Checklist](#23-verification--testing-checklist)
- [24. License](#24-license)

---

## 1. Platform Overview

Homies Studio bridges the gap between academic innovation, creator monetization, and commercial technology requirements. 

- **For Creators:** A dedicated portal to package code, architecture diagrams, research thesis documentation, and video demonstrations, earning an **80% royalty split** on every verified purchase.
- **For Buyers & Students:** Instant access to verified, deployable source code, complete with IEEE-format documentation, circuit diagrams, presentation decks, and viva preparation materials.
- **For Institutions & Enterprises:** A direct engagement funnel for academic capstones, corporate prototyping, EdTech cohort licenses, and custom digital software development.

---

## 2. Key Platform Capabilities

### Public Experience
- **Cinematic Homepage (`/`)**: Hero branding, interactive 3D physics meshes, fluid simulation overlay, audience category navigation, and featured engineering projects.
- **About Homies (`/about`)**: Company vision, core technical capabilities, delivery processes, and ecosystem pillars.
- **Become a Creator (`/become-a-creator`)**: Interactive 80/20 earnings calculator, creator journey milestones (*Build → Package → Price → Review → Publish → Earn*), and application submission.
- **Adaptive Navigation**: Persistent navbar with dynamic action buttons (`CREATOR STUDIO`, `MY PORTAL`, `START A CONVERSATION`), fullscreen animated menu drawer with dynamic links, and global footer.

### Project Marketplace (`/projects`)
- **Dual Viewing Modes**:
  - *Cinematic Stacking Cards*: ScrollTrigger-pinned card view for immersive browsing.
  - *Marketplace Grid View*: Multi-column cards with responsive layout.
- **Live Search & Taxonomy Filtering**: Real-time search across titles, descriptions, categories, creators, and technology stacks.
- **Sorting Options**: Trending & Popular, Highest Rated, Most Purchased, Price: Low to High, Price: High to Low.
- **Comprehensive Project Detail View (`/projects/[id]`)**:
  - Live demo link (`🌐 LIVE DEMO ↗`) and demo video walkthrough (`▶ DEMO VIDEO ↗`).
  - Pricing display with academic and commercial licensing tiers.
  - Digital deliverables checklist (Source Code ZIP, Thesis PDF, PPT Deck, Circuit Diagrams).
  - Target environment specifications (OS, software dependencies, hardware requirements).
  - Verified creator card with rating, sales count, and response time metrics.
  - Verified buyer reviews and feedback.

---

## 3. User Roles & RBAC

The platform implements Role-Based Access Control (RBAC) via Supabase Auth and PostgreSQL Row Level Security:

| Role | Target Persona | Navigation Access | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **GUEST** | Public Visitors | Public website, `/auth/login`, `/auth/signup`, Start a Conversation | Browse marketplace, preview builds, submit multi-sector requirements |
| **BUYER** | Students, Clients, Buyers | Header displays `MY PORTAL`, menu links to `/buyer/dashboard` | Access purchased source code, tokenized downloads, invoice history, saved wishlist |
| **CREATOR** | Verified Engineers & Authors | Header displays `CREATOR STUDIO`, menu links to `/creator/dashboard` | Project submission wizard, live draft editing, real earnings metrics, withdrawal requests |
| **ADMIN** | Platform Moderators & Governance | Protected `/admin/dashboard`, menu links to `ADMIN CONSOLE →` | Moderate creator applications, audit/publish project submissions, manage payouts, review enquiry leads |

---

## 4. Creator Studio

Located at `/creator/dashboard`, the Creator Studio delivers a dashboard driven by Supabase data:

```
┌─────────────────┬────────────────────┬─────────────────┬─────────────────┐
│ Total Earnings  │ Available Balance  │   Total Sales   │ Creator Rating  │
│     ₹0          │       ₹0           │        0        │        —        │
│ 80% Net Royalty │ Ready for Payout   │ Total Purchases │ Verified Reviews│
└─────────────────┴────────────────────┴─────────────────┴─────────────────┘
```

- **Zero Mock Metrics**: All values reflect queries against `creator_profiles`, `projects`, `withdrawals`, `creator_earnings`, and `reviews`. When a creator has no historical transactions, clean zero-states (`₹0`, `0`, `—`) are rendered.
- **My Projects Tab**: Displays all builds owned by the creator with cover thumbnails, status badges (`PUBLISHED`, `UNDER_REVIEW`, `DRAFT`, `CHANGES_REQUESTED`, `REJECTED`), price tags, and sales counts. Includes a zero-state CTA linking to `/creator/submit`.
- **Wallet & Payouts Tab**: Displays available balance with a **"Request Payout →"** modal supporting instant UPI ID and Bank Transfer (NEFT/IMPS) payout requests.
- **Performance & Inquiries Tab**: Displays direct client inquiries and pre-sales leads recorded in the `enquiries` table.

---

## 5. Project Submission Wizard

Located at `/creator/submit`, the 6-step wizard allows creators to package their builds:

```
[ Step 1: Details ] ➔ [ Step 2: Media ] ➔ [ Step 3: Deliverables ] ➔ [ Step 4: Pricing ] ➔ [ Step 5: Setup ] ➔ [ Step 6: Review ]
```

1. **Step 1 — General Information**: Title, one-line tagline, category selector, project type, difficulty level, target platform, tech stack comma-separated input, and comprehensive architecture description.
2. **Step 2 — Media & Live Demos**:
   - Cover image upload (JPG, PNG, WEBP up to 10MB) stored in Supabase `project-media` bucket with progress bar, preview thumbnail, and replace/remove controls.
   - Showcase gallery screenshot uploader (multiple image attachments).
   - Validated `Live Demo URL` and `Demo Video URL` inputs (YouTube, Loom, Google Drive).
3. **Step 3 — Project Files & Digital Deliverables**:
   - Primary Source Code ZIP upload stored in private, encrypted `project-deliverables` bucket.
   - Deliverables checklist: Source Code, Installation Guide, Thesis/Research Report PDF, PPT Presentation, Circuit/Schematic Diagrams, Database Seed SQL, Pre-trained Model Weights.
4. **Step 4 — Pricing & Commercials**: Academic price, commercial price, original benchmark price, with a live calculator previewing the **80% creator payout**.
5. **Step 5 — Requirements & Environment**: Target operating system, software dependencies, hardware prerequisites, and step-by-step terminal installation instructions.
6. **Step 6 — Review & Moderation Dispatch**: Final review card with terms agreement, dispatching the project to `SUBMITTED` status for administrative moderation.
7. **Draft Persistence**: Creators can click **"Save Draft"** at any step. Draft projects persist in Supabase and can be resumed anytime via `/creator/submit?projectId=[id]`.

---

## 6. Admin Moderation & Governance Console

Located at `/admin/dashboard` (protected by `RouteGuard` for `role === 'ADMIN'`):

- **Real Platform Analytics**:
  - `Total Platform GMV`: Aggregated from completed `orders.total_amount`.
  - `Platform Commission (20%)`: Derived net platform revenue.
  - `Pending Moderation`: Combined count of pending creator applications and pending project submissions.
  - `Platform Community`: Live count of registered `BUYER` and `CREATOR` accounts.
- **Creator Applications Tab**: Review incoming creator applications with full bio, portfolio links, and skills. Includes **"Approve as Creator ✓"** (automatically upgrades user profile to `CREATOR` role) and **"Reject ✕"** actions.
- **Project Submissions Tab**: Moderation queue displaying project titles, creator handles, tech stacks, cover thumbnails, and pricing. Actions include:
  - **✓ Publish**: Instantly transitions status to `PUBLISHED`, making the project visible on the public marketplace.
  - **Feedback**: Opens a modal to send structured change request notes (`CHANGES_REQUESTED`) to the creator.
  - **Reject**: Rejects non-compliant submissions (`REJECTED`).
- **Client Enquiries Tab**: View real-time leads from the multi-sector enquiry modal with one-click **"WhatsApp Reply ↗"** routing.
- **Commission Rules & Payouts**: Overview of platform rules and total pending withdrawal amounts.

---

## 7. Multi-Sector "Start a Conversation" System

The "Start a Conversation" modal provides 5 distinct sector enquiry flows with custom field architectures:

```
┌─────────────────────────────────────────────────────────────┐
│ 01 — Colleges & Universities (Institutions & Capstones)     │
│ 02 — EdTech Institutes (Curriculum & Bulk Licensing)       │
│ 03 — Individual Projects (Student & Developer Builds)       │
│ 04 — Businesses & Startups (Commercial MVPs & Prototypes)   │
│ 05 — Other (Custom Consultations)                           │
└─────────────────────────────────────────────────────────────┘
```

### Form Fields by Sector

| Sector | Dynamic Form Fields |
| :--- | :--- |
| **01 — Colleges & Universities** | Institution Name, Contact Person, Designation, Official Email, Phone/WhatsApp, Requirement Type (Final Year Projects, Lab Setup, Faculty Training, Research Setup), Student Count, Timeline, Budget Range, Detailed Scope. |
| **02 — EdTech Institutes** | Institute / Platform Name, Contact Person, Designation, Business Email, Phone, Service Required (Curriculum Design, Cohort Projects, White-Label Solutions), Learner Count, Timeline, Budget, Message. |
| **03 — Individual Projects** | Full Name, Email, Phone / WhatsApp, Project Type (AI/ML, Full-Stack, IoT, Embedded, Mobile App), Tech Domain, Academic Level (B.Tech, M.Tech, PhD, Independent), Project Stage, Deadline, Budget Range, Requirements. |
| **04 — Businesses & Startups** | Company / Startup Name, Contact Person, Work Email, Phone, Business Stage (Idea, Seed, Growth, Enterprise), Service Required (MVP Development, UI/UX, AI Integration, Cloud Architecture), Timeline, Budget, Scope. |
| **05 — Other** | Full Name, Email, Phone Number, Subject / Topic, Detailed Message. |

---

## 8. WhatsApp Integration Architecture

Every conversation submission executes a dual persistence and routing flow:

```
User Submits Modal Form
         │
         ├──► 1. POST to /api/enquiry & Supabase public.enquiries (Generates Ref ID: HS-XXXX-XXXX)
         │
         └──► 2. Generates URI-encoded structured payload targeting https://wa.me/917416636417
                     │
                     └──► Direct WhatsApp routing to Homies Studio Engineering Desk
```

### Official WhatsApp Endpoint
- **Destination Number:** `+91 7416636417`
- **URL Scheme:** `https://wa.me/917416636417?text=[EncodedMessage]`

---

## 9. Supabase Database & Backend Architecture

The database is built on PostgreSQL with Row Level Security (RLS) policies across 16 migrations:

```
supabase/migrations/
├── 001_profiles.sql                             # User profiles linked to auth.users with RBAC roles
├── 002_categories.sql                           # Marketplace taxonomies and category slugs
├── 003_projects.sql                             # Project catalog with pricing, metadata, requirements JSONB
├── 004_project_files_and_images.sql             # Deliverables file registry and project gallery images
├── 005_orders_and_payments.sql                  # Buyer orders, licenses, and payment transactions
├── 006_creator_earnings_and_withdrawals.sql     # 80/20 royalty ledger and payout withdrawal records
├── 007_reviews_and_wishlists.sql                # Buyer verified reviews and saved wishlist items
├── 008_moderation_and_notifications.sql         # Admin audit log and user notification triggers
├── 009_row_level_security.sql                   # RLS policies enforcing tenant isolation
├── 010_fix_profile_trigger.sql                  # Automated profile generation on auth.users signup
├── 011_creator_applications_and_rbac.sql        # Creator application submissions and role transitions
├── 012_grant_creator_applications_permissions.sql # Explicit grants for creator onboarding
├── 013_grant_anon_and_authenticated_permissions.sql # Schema access rules for client roles
├── 014_grant_schema_permissions.sql             # Public schema sequences and table execution grants
├── 015_creator_storage_and_assets.sql           # Storage bucket policies for media & deliverables
└── 016_enquiries_table.sql                      # Multi-sector enquiry lead persistence & RLS
```

### Key Database Tables

| Table | Description |
| :--- | :--- |
| `public.profiles` | User profiles with `id` (UUID foreign key to `auth.users`), `role` (`BUYER`, `CREATOR`, `ADMIN`), `full_name`, `email`. |
| `public.creator_profiles` | Creator metadata with `user_id`, `display_name`, `handle`, `bio`, `total_earnings`, `available_balance`, `sales_count`, `rating`, `review_count`, `is_approved`. |
| `public.projects` | Core project metadata with `creator_id`, `category_id`, `title`, `slug`, `tagline`, `description` (JSONB), `project_type`, `difficulty`, `platform`, `tech_stack` (text array), `requirements` (JSONB containing OS, dependencies, and deliverables list), `academic_price`, `commercial_price`, `status`, `cover_image_url`, `live_demo_url`, `demo_video_url`, `views_count`, `sales_count`. |
| `public.project_files` | Physical deliverables storage registry with `project_id`, `file_type` (`SOURCE_CODE_ZIP`, `THESIS_REPORT_PDF`, `CIRCUIT_DIAGRAM`, `PRESENTATION_PPTX`), `file_name`, `storage_path`, `file_size_bytes`, `mime_type`. |
| `public.project_images` | Showcase screenshot gallery with `project_id`, `image_url`, `storage_path`, `sort_order`, `is_cover`. |
| `public.orders` | Purchase orders with `buyer_id`, `invoice_number`, `total_amount`, `status` (`PENDING`, `PAID`, `CANCELLED`). |
| `public.creator_earnings` | Royalty accounting with `creator_id`, `order_id`, `gross_amount`, `platform_fee_amount`, `net_creator_amount`, `status`. |
| `public.withdrawals` | Payout requests with `creator_id`, `amount`, `method` (`UPI`, `BANK_TRANSFER`), `payout_details` (JSONB), `status` (`PENDING`, `COMPLETED`, `FAILED`), `requested_at`. |
| `public.creator_applications` | Creator onboarding submissions with `user_id`, `full_name`, `email`, `handle`, `portfolio_url`, `skills`, `bio`, `status` (`PENDING`, `APPROVED`, `REJECTED`). |
| `public.enquiries` | Multi-sector leads with `reference_id`, `name`, `email`, `phone`, `sector`, `service_type`, `institution_or_company`, `budget_range`, `timeline`, `message`, `status`. |

---

## 10. Supabase Storage Architecture & File Management

The application separates public marketing visuals from protected deliverables using two distinct buckets:

```
Supabase Storage
├── 🪣 project-media (Public Bucket)
│   └── creators/{creatorId}/projects/{projectId}/cover/{timestamp}_{filename}
│   └── creators/{creatorId}/projects/{projectId}/gallery/{timestamp}_{filename}
│
└── 🔒 project-deliverables (Private Encrypted Bucket)
    └── creators/{creatorId}/projects/{projectId}/source/{timestamp}_{filename}.zip
    └── creators/{creatorId}/projects/{projectId}/documents/{timestamp}_{filename}.pdf
```

### Next.js Image Optimization
Remote image hostnames are configured in `next.config.js` via `remotePatterns`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'qzbmctgbyinwyqxemzod.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

---

## 11. Realtime Subscriptions

Realtime events keep creator and admin dashboards synchronized without manual page reloads:

- **Creator Studio (`/creator/dashboard`)**:
  - Listens to `creator_profiles`, `projects`, `withdrawals`, and `creator_earnings` filtered by the creator's ID.
  - Automatically cleans up channels via `supabase.removeChannel(channel)` on component unmount.
- **Admin Moderation Console (`/admin/dashboard`)**:
  - Listens to `creator_applications`, `projects`, `enquiries`, `orders`, and `withdrawals`.
  - Automatically updates review counts and KPI cards when new submissions or purchases occur.

---

## 12. Authentication & Route Security

- **Client Provider (`src/context/AuthContext.jsx`)**: Exposes `user`, `session`, `profile`, `role`, `isAdmin`, `isCreator`, `isBuyer`, `signIn`, `signUp`, and `signOut`.
- **Route Protection (`src/components/auth/RouteGuard.jsx`)**: Restricts protected routes (`/creator/*`, `/admin/*`, `/buyer/*`) and redirects unauthorized personas to `/auth/login`.

---

## 13. Design System & 3-Layer Visual Engine

Homies Studio employs an editorial aesthetic paired with WebGL graphics:

```
┌─────────────────────────────────────────────────────────────┐
│ 3. Interactive WebGL Fluid Overlay (Cursor Physics Brush)   │
├─────────────────────────────────────────────────────────────┤
│ 2. DOM Content Layer (Responsive SCSS Modules + Typography) │
├─────────────────────────────────────────────────────────────┤
│ 1. 3D Canvas Background (React Three Fiber Geometries)      │
└─────────────────────────────────────────────────────────────┘
```

- **Color Tokens**: Pure monochrome palette (`--white: #ffffff`, `--black: #111111`, `--fillColor: #e5ece5`).
- **Typography Hierarchy**:
  - Display Titles: `Syne` (Bold, geometric)
  - Body & Form Controls: `Epilogue` (Technical readability)
  - Editorial Accents: `Reenie Beanie` (Handwritten annotations)
- **Fluid & Motion**: Lenis smooth scroll combined with GSAP ScrollTrigger and WebGL GLSL shaders.

---

## 14. Technology Stack

### Core Framework & UI
- **Next.js**: `14.0.3` (Pages Router with `*.page.jsx` extension mapping)
- **React & React DOM**: `18.2.0`
- **Sass (SCSS Modules)**: `1.69.4`
- **Zustand**: `4.5.4` (State store for cart, wishlist, and modal states)

### 3D, WebGL & Animation
- **Three.js**: `0.167.0`
- **@react-three/fiber**: `8.16.8`
- **@react-three/drei**: `9.108.3`
- **@react-three/postprocessing**: `2.16.2`
- **GSAP (GreenSock)**: `3.12.5`
- **Lenis**: `1.1.6` (Smooth scrolling)
- **GLSLify & Raw Loader**: Custom fragment and vertex shader compilation

### Backend, Database & Storage
- **@supabase/supabase-js**: `2.112.4`
- **PostgreSQL**: Supabase cloud database with RLS policies

### Tooling & Build
- **next-sitemap**: `4.2.3`
- **ESLint & Prettier**: Code formatting and styling standards
- **Sharp**: `0.33.4` (Server image optimization)

---

## 15. Project Structure

```text
homies-website/
├── public/                               # Static media, brand assets, and fonts
│   ├── fonts/                            # Syne, Epilogue, Reenie Beanie font files
│   ├── homies/                           # Homies Studio brand marks and logos
│   └── project1/ ... project5/           # Marketplace project preview banners
│
├── src/
│   ├── components/                       # Reusable UI, auth, and canvas modules
│   │   ├── animationComponents/          # GSAP text reveal, perspective roll, button hover
│   │   ├── auth/                         # RouteGuard role-based access controller
│   │   ├── canvas/                       # React Three Fiber background and WebGL fluid simulation
│   │   ├── dom/                          # Layout shells, conversationModal, navbar, prefooter
│   │   │   ├── conversationModal/        # 5-sector enquiry modal with WhatsApp routing
│   │   │   ├── navbar/                   # Responsive navigation, MenuLinks, MenuButton
│   │   │   ├── CustomHead.jsx            # Dynamic SEO head meta manager
│   │   │   ├── Footer.jsx                # Global responsive footer
│   │   │   └── Layout.jsx                # Application shell wrapping Lenis & Canvas
│   │   └── imageComponents/              # Custom SVG vectors and graphic icons
│   │
│   ├── constants/                        # Marketplace categories and seeded project data
│   │   ├── marketplace.js                # Taxonomy definitions and default fee splits
│   │   └── projects.js                   # Seed project schemas with deliverables & specs
│   │
│   ├── context/                          # React contexts
│   │   └── AuthContext.jsx               # Supabase session, profile, and role provider
│   │
│   ├── hooks/                            # Custom utility hooks (useIsMobile, useScroll, useOpts)
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.js                 # Supabase browser client instance
│   │       └── server.js                 # Supabase server-side helper
│   │
│   ├── pages/                            # Next.js Pages Router (Extension: *.page.jsx)
│   │   ├── _app.page.jsx                 # Application root, providers, and layout wrapper
│   │   ├── _document.page.jsx            # HTML document shell with custom fonts
│   │   ├── 404.page.jsx                  # Custom 404 error page
│   │   ├── index.page.jsx                # Homepage (Hero, Pillars, Featured Projects)
│   │   ├── about/index.page.jsx          # About page (Services, Process, Capabilities)
│   │   ├── admin/dashboard.page.jsx      # Admin Moderation Console & Platform Analytics
│   │   ├── api/enquiry.js                # Multi-sector enquiry API endpoint
│   │   ├── auth/login.page.jsx           # User Sign In
│   │   ├── auth/signup.page.jsx          # User Sign Up with role onboarding
│   │   ├── become-a-creator.page.jsx     # Creator landing & 80/20 royalty calculator
│   │   ├── buyer/dashboard.page.jsx      # Buyer Portal & Download Center
│   │   ├── checkout/[id].page.jsx        # Project checkout & license tier selection
│   │   ├── creator/dashboard.page.jsx    # Creator Studio, Wallet & Inquiries
│   │   ├── creator/submit.page.jsx       # 6-step project submission wizard
│   │   ├── projects/index.page.jsx       # Marketplace discovery (Stacking vs Grid view)
│   │   └── projects/[id].page.jsx        # Dynamic Project Details Page
│   │
│   ├── store.js                          # Zustand global client state
│   └── styles/                           # Global SCSS architecture & Design Tokens
│       ├── colors.scss                   # CSS variables (--white, --black, --fillColor)
│       ├── fonts.scss                    # Font family definitions
│       ├── fontStyle.scss                # Responsive typography classes (h1..h6, p-l)
│       ├── functions.scss                # Breakpoint mixins (@include mobile, @include tablet)
│       └── global.scss                   # Global resets and smooth scrolling rules
│
├── supabase/
│   └── migrations/                       # 16 SQL migration files for tables, RLS, and storage
│
├── next.config.js                        # Next.js config with remotePatterns & shader rules
├── next-sitemap.config.js                # Dynamic sitemap generator
├── package.json                          # Scripts and dependencies
└── README.md                             # Platform documentation
```

---

## 16. Environment Variables

Create a `.env.local` file in the root directory:

```env
# ==============================================================================
# HOMIES STUDIO — ENVIRONMENT CONFIGURATION (.env.local)
# ==============================================================================

# 1. Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# 2. Supabase Publishable / Anon Key (Safe for browser client)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# (Optional fallback key name for older client setups)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 3. Supabase Service Role Key (SERVER-ONLY — Never expose to client)
SUPABASE_SERVICE_ROLE_KEY=

# 4. Payment Gateway (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

> **Security Note:** Never commit `.env.local` or private service-role keys to source control.

---

## 17. Local Development Setup

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm**: `v9.x` or higher

### Installation & Execution
```bash
# 1. Clone the repository
git clone <repository-url>
cd homies-website

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# (Populate .env.local with your Supabase credentials)

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 18. Database Setup & Migrations

If deploying to a fresh Supabase project, execute the migrations in order:

```bash
# Using Supabase CLI:
supabase db push

# Or run the SQL scripts sequentially in the Supabase SQL Editor:
# supabase/migrations/001_profiles.sql through 016_enquiries_table.sql
```

### Storage Buckets Setup
Ensure the following two buckets exist in your Supabase Storage dashboard:
1. `project-media` — **Public bucket** (Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`).
2. `project-deliverables` — **Private bucket** (Allowed MIME types: `application/zip`, `application/pdf`, `application/octet-stream`).

---

## 19. Build & Production Deployment

### Production Build
```bash
# Compile and validate production bundle
npm run build

# Start production server
npm start
```

### Deployment on Vercel
1. Connect your Git repository to Vercel.
2. In Project Settings, add all environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Set the build command to `npm run build` and output directory to `.next`.
4. Deploy.

---

## 20. Troubleshooting Guide

### 1. Next.js Remote Image Hostname Error
- **Symptom:** `Error: Invalid src prop ... hostname "...supabase.co" is not configured under images in your next.config.js`.
- **Solution:** Verify `next.config.js` contains your Supabase hostname in `images.remotePatterns`.

### 2. Missing Deliverables Column Schema Error
- **Symptom:** `Could not find the 'deliverables' column of 'projects' in the schema cache`.
- **Solution:** The `projects` table stores deliverables in the `requirements` JSONB column (`requirements.deliverables`). Physical file binaries are tracked in `public.project_files`.

### 3. File Upload 403 Forbidden
- **Symptom:** Uploads to `project-media` or `project-deliverables` fail with permission errors.
- **Solution:** Run migration `015_creator_storage_and_assets.sql` to apply storage bucket RLS policies.

---

## 21. Security Posture

- **Row Level Security (RLS):** Enabled on all tables. Creators can only modify their own projects; buyers can only view their purchased downloads; admins have moderation capabilities.
- **Client Key Isolation:** Only the `anon` / publishable key is exposed via `NEXT_PUBLIC_`.
- **Sanitized Uploads:** Storage paths and file names are sanitized to prevent directory traversal attacks.

---

## 22. Business & Interaction Workflows

### Client Requirement / Consultation Flow
```text
Visitor
  │
  ├──► Clicks "Start a Conversation"
  │
  ├──► Selects Sector (Colleges / EdTech / Individual / Business / Other)
  │
  ├──► Fills Dynamic Form & Submits
  │
  ├──► Saved to Supabase public.enquiries (Ref ID: HS-XXXX-XXXX)
  │
  └──► Redirects to WhatsApp (+91 7416636417) with structured payload
```

### Creator Onboarding & Monetization Flow
```text
Creator
  │
  ├──► Signs up at /auth/signup (Selects CREATOR role)
  │
  ├──► Submits application at /become-a-creator
  │
  ├──► Admin approves application at /admin/dashboard (Upgrades role to CREATOR)
  │
  ├──► Creator builds & submits project at /creator/submit
  │
  ├──► Admin audits code & publishes submission
  │
  └──► Project appears on /projects marketplace; sales earn 80% royalty split
```

---

## 23. Verification & Testing Checklist

- [x] **Public Experience**: Home, About, Become a Creator, and Marketplace pages load cleanly.
- [x] **Navigation**: Header dynamically hides "ADMIN CONSOLE" on public views and displays user-specific portals.
- [x] **Authentication**: Sign in, Sign up, Session persistence, and Logout operate across page refreshes.
- [x] **Creator Studio**: Financial KPIs reflect database values; wallet payout modal validates available balance.
- [x] **Project Submission**: Multi-step wizard uploads cover images to `project-media` and code ZIPs to `project-deliverables`.
- [x] **Admin Moderation**: Platform GMV analytics, creator application approvals, and project publishing controls function.
- [x] **Start a Conversation**: All 5 sector forms persist leads to `public.enquiries` and route to WhatsApp (`+91 7416636417`).
- [x] **Image Optimization**: Supabase storage URLs render through `next/image` without hostname runtime errors.
- [x] **Production Compilation**: `npm run build` completes with exit code 0 across all 18 routes.

---

## 24. License

All original platform architecture, 3D shader systems, and brand designs are proprietary to **Homies Studio** © 2026. All rights reserved.
