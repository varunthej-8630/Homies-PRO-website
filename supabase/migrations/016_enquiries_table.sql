-- ==============================================================================
-- 016_ENQUIRIES_TABLE.SQL
-- Storage for multi-sector "Start a Conversation" enquiries with metadata & audit
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    sector TEXT NOT NULL,
    service_type TEXT,
    institution_or_company TEXT,
    contact_person TEXT,
    designation TEXT,
    student_count TEXT,
    budget_range TEXT,
    timeline TEXT,
    project_type TEXT,
    technology TEXT,
    academic_level TEXT,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'NEW' NOT NULL, -- 'NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED'
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated users to insert an enquiry
CREATE POLICY "Allow public insert to enquiries"
    ON public.enquiries
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated Admins to view all enquiries
CREATE POLICY "Allow admin to read all enquiries"
    ON public.enquiries
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

-- Allow authenticated Admins to update enquiries
CREATE POLICY "Allow admin to update enquiries"
    ON public.enquiries
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'ADMIN'
        )
    );

CREATE INDEX IF NOT EXISTS idx_enquiries_sector ON public.enquiries(sector);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
