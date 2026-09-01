-- ==============================================================================
-- 003_PROJECTS.SQL
-- Full project catalog schema with lifecycle governance and technical specs
-- ==============================================================================

CREATE TYPE project_status_type AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'CHANGES_REQUESTED',
    'APPROVED',
    'PUBLISHED',
    'REJECTED',
    'ARCHIVED'
);

CREATE TYPE project_difficulty_type AS ENUM (
    'Beginner Friendly',
    'Intermediate',
    'Advanced',
    'Industry Grade'
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    handwriting_note TEXT,
    description JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    project_type TEXT NOT NULL DEFAULT 'Full-Stack Application',
    difficulty project_difficulty_type DEFAULT 'Intermediate' NOT NULL,
    platform TEXT NOT NULL DEFAULT 'Web & Cloud Server',
    language TEXT NOT NULL DEFAULT 'Python / JavaScript',
    tech_stack TEXT[] DEFAULT '{}'::text[] NOT NULL,
    
    requirements JSONB DEFAULT '{
        "os": "Windows 10/11, macOS, Linux",
        "software": "Python 3.10+, Node.js 18+, VS Code, Git",
        "hardware": "8 GB RAM, 2 GB disk storage",
        "dependencies": "Standard package requirements",
        "installationSteps": ["Clone repository", "Install dependencies", "Run dev/build script"]
    }'::jsonb NOT NULL,
    
    -- Pricing Tiers (INR)
    academic_price NUMERIC(10, 2) NOT NULL DEFAULT 2999.00,
    commercial_price NUMERIC(10, 2) NOT NULL DEFAULT 4998.00,
    original_price NUMERIC(10, 2) DEFAULT 5999.00,
    
    -- Moderation & Lifecycle
    status project_status_type DEFAULT 'DRAFT' NOT NULL,
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Engagement & Signals
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_bestseller BOOLEAN DEFAULT FALSE NOT NULL,
    is_trending BOOLEAN DEFAULT FALSE NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    sales_count INTEGER DEFAULT 0 NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Media URLs
    cover_image_url TEXT DEFAULT '/project1/project1.webp' NOT NULL,
    live_demo_url TEXT,
    demo_video_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    published_at TIMESTAMPTZ
);

-- Indexes for high-performance discovery and sorting
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON public.projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_price ON public.projects(academic_price);
CREATE INDEX IF NOT EXISTS idx_projects_rating ON public.projects(rating DESC);
CREATE INDEX IF NOT EXISTS idx_projects_sales ON public.projects(sales_count DESC);
