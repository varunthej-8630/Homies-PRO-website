# 🏗️ System Architecture — Homies Studio Platform

## 1. System Overview

**Homies Studio** is architected as a high-performance, visually immersive web application with a robust, zero-trust backend infrastructure:

```
                                  CLIENT BROWSERS
                                        │
                         ┌──────────────┴──────────────┐
                         │   Next.js 14 Frontend Layer │
                         │ (R3F 3D + GSAP + Lenis UX)  │
                         └──────────────┬──────────────┘
                                        │ (HTTPS / REST / WS)
                                        ▼
                         ┌─────────────────────────────┐
                         │  Next.js Server API Routes  │
                         │ (/api/projects, /api/orders)│
                         └──────────────┬──────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
   ┌───────────────┐           ┌─────────────────┐           ┌──────────────┐
   │ Supabase Auth │           │ PostgreSQL (DB) │           │   Razorpay   │
   │ JWT & RBAC    │           │ Row Level Sec.  │           │   Gateway    │
   └───────────────┘           └────────┬────────┘           └──────────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │Private Storage  │
                               │(Expiring Tokens)│
                               └─────────────────┘
```

---

## 2. Multi-Layer Visual Engine

The frontend strictly enforces a 3-layer compositional structure:

1. **Background Canvas (`src/components/canvas/background/`)**:
   - Built on `@react-three/fiber` and `@react-three/rapier`.
   - Simulates floating mesh physical bodies and procedural vertex/fragment shaders.
2. **Interactive Content Layer (`src/pages/`)**:
   - Next.js Pages router with SCSS Modules and GSAP ScrollTrigger timeline management.
   - Utilizes SVG cut-out windows that let the 3D world bleed through without compromising text legibility.
3. **Interactive Fluid Brush Overlay (`src/components/canvas/fluid/`)**:
   - Custom WebGL fluid dynamic shader responsive to cursor and touch velocity using `mix-blend-mode`.

---

## 3. Data Flow & Security Model

- **Public Access**: Visitors can browse published projects, search, filter by taxonomy, and view public profile previews.
- **Client Side State**: Zustand (`src/store.js`) manages UI state only (modals, filters, active search terms, temporary form inputs).
- **Backend as Single Source of Truth**: All critical data (users, balances, orders, licenses, payouts, moderation) lives in PostgreSQL and is governed by Row Level Security (RLS).
