-- ==============================================================================
-- 005_ORDERS_AND_PAYMENTS.SQL
-- Transaction records, order items, Razorpay gateway verification & secure download tokens
-- ==============================================================================

CREATE TYPE order_status_type AS ENUM (
    'PENDING',
    'PROCESSING',
    'PAID',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE license_type AS ENUM (
    'ACADEMIC',
    'COMMERCIAL'
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status order_status_type DEFAULT 'PENDING' NOT NULL,
    
    -- Razorpay Transaction Audit
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order Items (Line Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE RESTRICT NOT NULL,
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE RESTRICT NOT NULL,
    license license_type DEFAULT 'ACADEMIC' NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Secure Expiring Downloads Tracking
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    file_id UUID REFERENCES public.project_files(id) ON DELETE CASCADE NOT NULL,
    
    download_token TEXT UNIQUE NOT NULL,
    download_count INTEGER DEFAULT 0 NOT NULL,
    max_downloads INTEGER DEFAULT 10 NOT NULL,
    token_expires_at TIMESTAMPTZ NOT NULL,
    last_downloaded_at TIMESTAMPTZ,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_project_id ON public.order_items(project_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON public.downloads(download_token);
