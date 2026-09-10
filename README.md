# 🌐 Homies Studio — Final Year Projects, Marketplace & AI Solutions

> **"Build Something. Launch Something. Grow Something. Where Ideas Become Possibilities."**

**Homies Studio** ([homiesstudio.com](https://www.homiesstudio.com)) is a premier digital engineering studio and project ecosystem empowering students, technical creators, startups, and institutions across India.

The platform provides an end-to-end bridge between academic innovation, creator monetization, and commercial technology requirements through three core pillars:
1. **Final Year Projects (FYP Guidance):** Remote, IEEE-aligned technical mentorship across IoT, Robotics, AI/ML, Embedded Systems, and Web Applications for B.Tech & M.Tech students pan-India.
2. **Homies Mart Marketplace:** A curated marketplace where creators publish verified technical builds, blueprints, and code packages to earn an 80% royalty on every sale.
3. **AI & SaaS Solutions:** Bespoke AI agents, autonomous workflow automations, and full-stack software development for Indian startups and modern enterprises.

---

## 📑 Table of Contents

- [1. Platform Pillars & Capabilities](#1-platform-pillars--capabilities)
- [2. User Roles & RBAC System](#2-user-roles--rbac-system)
- [3. Pages & Routing Architecture](#3-pages--routing-architecture)
- [4. New Platform Features](#4-new-platform-features)
  - [A. Real Working Contact Form & API](#a-real-working-contact-form--api)
  - [B. Homepage Middle Content](#b-homepage-middle-content)
  - [C. Homies Mart Honest State & Waitlist](#c-homies-mart-honest-state--waitlist)
  - [D. Global 404 Recovery Experience](#d-global-404-recovery-experience)
  - [E. Privacy Policy, Terms & Cookie Consent](#e-privacy-policy-terms--cookie-consent)
  - [F. Engineering Blog Engine](#f-engineering-blog-engine)
- [5. API Endpoints & Server-Side Pipelines](#5-api-endpoints--server-side-pipelines)
- [6. Technology Stack](#6-technology-stack)
- [7. Design System & 3-Layer Visual Engine](#7-design-system--3-layer-visual-engine)
- [8. Supabase Database & Storage Architecture](#8-supabase-database--storage-architecture)
- [9. Directory Structure](#9-directory-structure)
- [10. Environment Variables](#10-environment-variables)
- [11. Local Development & Deployment](#11-local-development--deployment)
- [12. License & Attribution](#12-license--attribution)

---

## 1. Platform Pillars & Capabilities

```
                       ┌──────────────────────────────────────┐
                       │           HOMIES STUDIO              │
                       │   homiesstudio.com · Pan-India       │
                       └──────────────────┬───────────────────┘
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       ▼                                  ▼                                  ▼
┌───────────────┐                  ┌───────────────┐                  ┌───────────────┐
│   FOR STUDENTS│                  │  FOR CREATORS │                  │  FOR STARTUPS │
│   FYP Guidance│                  │  Homies Mart  │                  │  AI Solutions │
│   IoT/Robotics│                  │  80% Royalties│                  │  Agents & SaaS│
└───────────────┘                  └───────────────┘                  └───────────────┘
```

### 🎓 For Students (Final Year Project Guidance)
- End-to-end guidance from topic selection to final viva voce defense.
- Specialized domains: IoT & Embedded Systems, Robotics & Autonomous Navigation, AI/ML & Computer Vision, Full-Stack Web.
- Deliverables: Functional Source Code, Circuit Schematics & Simulation Files, IEEE-format Project Reports/Theses, and Viva Prep Q&A decks.
- 100% remote delivery covering Hyderabad, Bangalore, Andhra Pradesh, and all Indian states.

### 🛒 For Creators (Homies Mart Marketplace)
- Engineering creators package and monetize reusable builds, hardware schematics, and software starter kits.
- Creator revenue share: **80% royalty on every verified sale**.
- Comprehensive Creator Studio with real-time earnings tracker, balance withdrawals, and project submission wizard.

### ⚡ For Startups (AI & SaaS Solutions)
- Custom autonomous AI agents with function calling, tool execution, and long-term vector memory.
- Production full-stack SaaS web applications, responsive PWAs, and edge-native IoT cloud telemetry pipelines.

### 🏛️ For Colleges & Institutions
- Institutional partnerships for capstone project mentorship, hackathon sponsorship, and faculty development programs.

---

## 2. User Roles & RBAC System

Role-Based Access Control is enforced using Supabase Auth and PostgreSQL Row Level Security (RLS) policies:

| Role | Access Level | Navigation Indicator | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **GUEST** | Public Visitors | Public navbar & action buttons | Browse site, preview Mart projects, read blog guides, submit contact/enquiry forms, join Mart waitlist |
| **BUYER** | Students & Clients | Header displays `MY PORTAL` → `/buyer/dashboard` | Access purchased source code, tokenized project downloads, invoice history, saved wishlists |
| **CREATOR** | Verified Engineers | Header displays `CREATOR STUDIO` → `/creator/dashboard` | Multi-step project submission wizard, earnings analytics (80% net cut), payout requests, draft editing |
| **ADMIN** | Governance Leads | Protected `/admin/dashboard` | Audit & approve creator applications, publish Mart project listings, review submitted inquiries, process payouts |

---

## 3. Pages & Routing Architecture

| Route | File Location | Purpose & Description |
| :--- | :--- | :--- |
| `/` | `src/pages/index.page.jsx` | Cinematic homepage with 3D physics mesh, Three Pillars, Domain Tags, and Dual CTA blocks |
| `/final-year-projects` | `src/pages/final-year-projects.page.jsx` | Comprehensive FYP mentorship hub with domain roadmaps, FAQs, and WhatsApp consultation |
| `/mart` | `src/pages/mart/index.page.jsx` | Homies Mart marketplace with Opening Soon waitlist banner, category tabs, grid/cinematic views, and DEMO badges |
| `/projects/[id]` | `src/pages/projects/[id].page.jsx` | Detailed project specification page with demo links, deliverables checklist, and licensing options |
| `/ai-solutions` | `src/pages/ai-solutions.page.jsx` | Startup AI agent engineering, SaaS architecture, and custom development wing |
| `/for-colleges` | `src/pages/for-colleges.page.jsx` | Institutional and college partnership engagement portal |
| `/become-a-creator` | `src/pages/become-a-creator.page.jsx` | Creator recruitment page with 80/20 earnings calculator and application wizard |
| `/about` | `src/pages/about/index.page.jsx` | Studio philosophy, engineering standards, team, and delivery methodology |
| `/contact` | `src/pages/contact.page.jsx` | Working contact form (with Resend integration), direct WhatsApp channel, and email support |
| `/blog` | `src/pages/blog.page.jsx` | Engineering perspectives, guides, and technical tutorial index |
| `/blog/how-to-choose-your-fyp-topic` | `src/pages/blog/how-to-choose-your-fyp-topic.page.jsx` | 2026 guide for B.Tech students on selecting high-scoring, feasible capstone topics |
| `/blog/iot-vs-robotics-for-final-year` | `src/pages/blog/iot-vs-robotics-for-final-year.page.jsx` | Side-by-side comparison of IoT vs Robotics hardware cost, complexity, and career signal |
| `/blog/what-is-an-ai-agent` | `src/pages/blog/what-is-an-ai-agent.page.jsx` | Plain explanation of autonomous AI agents, tool use, memory, and startup ROI |
| `/privacy-policy` | `src/pages/privacy-policy.page.jsx` | GDPR/India compliant data collection, Resend email processing, and user rights policy |
| `/terms` | `src/pages/terms.page.jsx` | Legal service terms, IP ownership, liability limitations, and digital purchases disclaimer |
| `/404` | `src/pages/404.page.jsx` | Dark-themed 404 recovery page with navigation pills and direct WhatsApp fallback |
| `/buyer/dashboard` | `src/pages/buyer/dashboard.page.jsx` | Buyer order management and source code download portal |
| `/creator/dashboard` | `src/pages/creator/dashboard.page.jsx` | Creator monetization hub, earnings dashboard, and project inventory |
| `/creator/submit` | `src/pages/creator/submit.page.jsx` | 4-step wizard for publishing engineering builds with Supabase storage upload |
| `/admin/dashboard` | `src/pages/admin/dashboard.page.jsx` | Platform moderation, creator verification, payout processing, and inquiry management |

---

## 4. New Platform Features

### A. Real Working Contact Form & API
- **Location:** `src/components/forms/ContactForm.jsx` (`.tsx`) on `/contact`.
- **Form Fields:** Full Name (required), Email (regex validated), Phone Number (optional), Inquiry Type (select dropdown: *Student FYP Guidance*, *College Partnership*, *AI & SaaS Solutions*, *Become a Creator*, *General*), and Message (minimum 20 characters).
- **Interactive States:**
  - Inline error validation triggered on field `onBlur` and form submission.
  - Submit button loading spinner + disabled state (`"Sending…"`).
  - Success message replacement: *"Message received. We'll reply within 24 hours."* + WhatsApp fallback link.
  - Top error banner: *"Something went wrong. Try WhatsApp instead."*
- **Backend API (`/api/contact`):**
  - Server-side validation of all fields.
  - In-memory rate limiting: **3 submissions per IP per hour**.
  - Direct email dispatch to `info@homiesstudio.com` via **Resend API** using `process.env.RESEND_API_KEY`.
  - Graceful development fallback when API key is unconfigured.

### B. Homepage Middle Content
- **Location:** `src/pages/components/home/HomeMiddleSections.jsx` on `/`.
- **Section A — Three Pillars:** 3-column responsive card grid highlighting *Final Year Projects* (For Students), *Homies Mart* (For Creators), and *AI Solutions* (For Startups).
- **Section B — Domain Tags:** `"What We Build"` section featuring 8 inline pill tags (*IoT & Robotics*, *AI & Machine Learning*, *Embedded Systems*, *Full Stack Web*, *Computer Vision*, *SaaS & Automation*, *Cybersecurity*, *Data Engineering*).
- **Section C — Dual CTA Block:** Side-by-side card with desktop vertical divider connecting students to WhatsApp and startups to email.

### C. Homies Mart Honest State & Waitlist
- **Location:** `src/components/ui/MartNotifyBanner.jsx` on `/mart`.
- **Opening Soon Banner:** Full-width dark card informing visitors that the first batch of projects is being verified, with an email signup input.
- **Notify API (`/api/notify`):** Validates email, enforces a 1 request/hr rate limit, and dispatches waitlist notifications to `info@homiesstudio.com` via Resend.
- **DEMO Badges:** Small dark badges (`bg-neutral-800 text-neutral-500`) added to every product card in both Grid and Cinematic Stack views to clearly indicate reference listings.

### D. Global 404 Recovery Experience
- **Location:** `src/pages/404.page.jsx`.
- Clean, center-aligned dark viewport with a bold `"404"` heading, descriptive subtitle, quick recovery pills (`← Back to Home`, `Explore Homies Mart`, `Contact Us`), and direct WhatsApp link.

### E. Privacy Policy, Terms & Cookie Consent
- **Privacy Policy (`/privacy-policy`):** Covers data collected, business usage, Resend processing, Vercel infrastructure, user rights, and contact details.
- **Terms of Use (`/terms`):** Detailed service agreements, digital goods non-refund policies, IP rights, and governing law (India).
- **Cookie Consent Banner (`CookieConsent.jsx`):** Fixed bottom bar checking `localStorage` key `hs_cookie_consent`, respecting `prefers-reduced-motion`, with full keyboard accessibility.
- **Footer Integration:** Links to Privacy Policy and Terms of Use added to global site footer.

### F. Engineering Blog Engine
- **Index (`/blog`):** Hero section with 2-column card grid, category tags, publish dates, 2-line excerpts, and `"Read →"` links.
- **Article 1 — How to Choose Your FYP Topic:** 400+ words covering feasibility, novelty, department alignment, 2026 hot domains (AIoT, TinyML, smart agriculture), avoiding clichés, and guide validation.
- **Article 2 — IoT vs Robotics for Final Year:** 350+ words comparing component costs, implementation risks, examiner expectations, and career leverage.
- **Article 3 — What Is an AI Agent?:** 400+ words explaining agents vs chatbots, tool use, long-term memory, customer support ops workflow, and startup ROI.
- **Prose Layout:** Centered `max-w-3xl` container, breadcrumbs, structured data `BlogPosting` schema, and bottom WhatsApp consultation CTA.

---

## 5. API Endpoints & Server-Side Pipelines

| Endpoint | Method | Rate Limit | Description |
| :--- | :--- | :--- | :--- |
| `/api/contact` | `POST` | 3 / hour / IP | Validates contact form inquiry, formats HTML payload, and sends email to `info@homiesstudio.com` via Resend. |
| `/api/notify` | `POST` | 1 / hour / IP | Registers email for Homies Mart launch waitlist and notifies team via Resend. |
| `/api/enquiry` | `POST` | Dynamic | Handles multi-sector consultation submissions with reference ID generation. |
| `/api/revalidate` | `POST` | Secret Token | Triggers Next.js On-Demand Incremental Static Regeneration (ISR) for marketplace and dynamic pages. |

---

## 6. Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (Pages Router with ISR support)
- **UI & Logic:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **3D Graphics & Physics:** [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **Animation & Motion:** [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/), [Lenis](https://lenis.darkroom.engineering/) smooth scrolling
- **Styling:** Modular SCSS ([Sass](https://sass-lang.com/)), CSS Variables design system, Fluid responsive typography
- **State Management:** [Zustand 4](https://github.com/pmndrs/zustand) with shallow selectors
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL with RLS, Auth, Realtime & Storage)
- **Transactional Email:** [Resend API](https://resend.com/)
- **Analytics & Hosting:** [Vercel](https://vercel.com/) with [@vercel/analytics](https://vercel.com/analytics)
- **SEO & Social:** [next-seo](https://github.com/garmeeh/next-seo), [next-sitemap](https://github.com/iamvishnusankar/next-sitemap), Schema.org JSON-LD

---

## 7. Design System & 3-Layer Visual Engine

Homies Studio renders a specialized 3-layer visual engine in `_app.page.jsx`:

```
┌────────────────────────────────────────────────────────┐
│  Layer 3: DOM Content & UI Components (Z-Index: 10+)   │
│  (Navbar, Pages, Modals, Forms, Cookie Consent, Footer)│
├────────────────────────────────────────────────────────┤
│  Layer 2: Noise Texture & Post-Processing Shaders      │
│  (#layout::before CSS noise overlay, Fluid difference) │
├────────────────────────────────────────────────────────┤
│  Layer 1: WebGL Canvas & Background 3D Meshes (Z: 0)   │
│  (React Three Fiber canvas, View.Port, physics items)  │
└────────────────────────────────────────────────────────┘
```

### Color Palette Tokens (`src/styles/colors.scss`)
- `--black`: `#28282b` (Deep obsidian dark)
- `--white`: `#f0f4f1` (Warm off-white background)
- `--menuColor`: `#28282b`
- `--fillColor`: `#f2ffbd` (Electric lime/gold accent)
- `--accentColor`: `#f9f9f9`

---

## 8. Supabase Database & Storage Architecture

The database is built on PostgreSQL with strict Row Level Security (RLS) across all tables:

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│     profiles     │◄──────│   creator_profiles   │       │     enquiries    │
│  (id, role, ...) │       │ (user_id, status, ..)│       │(reference_id, ..)│
└────────┬─────────┘       └──────────┬───────────┘       └──────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐       ┌──────────────────────┐
│  orders / items  │◄──────│       projects       │
│(buyer_id, status)│       │ (creator_id, status) │
└──────────────────┘       └──────────────────────┘
```

### Storage Buckets
1. `project-covers` (Public): Image thumbnails and preview media.
2. `project-deliverables` (Private / Authenticated): Downloadable source code ZIPs, circuit diagrams, and PDF report documentation accessible via signed URLs post-purchase.

---

## 9. Directory Structure

```
homies-website/
├── public/                     # Static assets (logos, icons, noise texture, robots.txt)
├── src/
│   ├── components/
│   │   ├── animationComponents/ # GSAP linkText, appearTitle, textOpacity, buttonLink
│   │   ├── canvas/             # 3D fluid shaders, physics mesh, canvas background
│   │   ├── dom/                # Navbar, Footer, CustomHead, Time, Scrollbar, Loader
│   │   ├── forms/              # ContactForm component and SCSS modules
│   │   └── ui/                 # CookieConsent, MartNotifyBanner, ProjectImagePlaceholder
│   ├── constants/              # Categories, default project datasets, navigation links
│   ├── context/                # AuthContext (Supabase authentication state)
│   ├── hooks/                  # Custom React hooks (useIsMobile, useIsomorphicLayoutEffect)
│   ├── lib/
│   │   ├── supabaseClient.js   # Supabase client initialization
│   │   └── services/           # Project, order, and creator data access services
│   ├── pages/
│   │   ├── api/                # API routes (contact.page.js, notify.page.js, enquiry.page.js)
│   │   ├── blog/               # Engineering blog article pages (.page.jsx)
│   │   ├── mart/               # Homies Mart marketplace (.page.jsx)
│   │   ├── projects/           # Project detail routes (/projects/[id].page.jsx)
│   │   ├── _app.page.jsx       # Root App with 3D Canvas, Lenis, and CookieConsent
│   │   ├── _document.page.jsx  # HTML document and font headers
│   │   ├── index.page.jsx      # Homepage
│   │   ├── contact.page.jsx    # Contact page
│   │   ├── privacy-policy.page.jsx # Privacy policy page
│   │   ├── terms.page.jsx      # Terms of use page
│   │   └── 404.page.jsx        # 404 recovery page
│   ├── store.js                # Zustand global UI & Lenis state store
│   └── styles/                 # Global SCSS, design tokens, layout mixins, typography
├── supabase/
│   └── migrations/             # SQL schema migrations (001 through 017)
├── next.config.js              # Next.js configuration with custom pageExtensions
├── package.json                # Project dependencies and npm scripts
└── README.md                   # Platform documentation
```

---

## 10. Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend Transactional Email API (Contact Form & Waitlist Notifications)
RESEND_API_KEY=re_your_resend_api_key_here

# Site URL Configuration
NEXT_PUBLIC_SITE_URL=https://www.homiesstudio.com
NEXT_PUBLIC_APP_URL=https://www.homiesstudio.com

# On-Demand Revalidation Secret
REVALIDATION_SECRET_TOKEN=your_secure_random_revalidation_token
```

---

## 11. Local Development & Deployment

### 1. Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Create Production Build & Validate
```bash
npm run build
```
Starts Next.js compilation, generates static pages, and produces optimized JavaScript bundles.

### 5. Run Production Server
```bash
npm run start
```

---

## 12. License & Attribution

Copyright © 2026 **Homies Studio**. All Rights Reserved.  
Built with passion for students, builders, and startups across India.
