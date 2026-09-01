-- ==============================================================================
-- 012_GRANT_CREATOR_APPLICATIONS_PERMISSIONS.SQL
-- Grant PostgreSQL permissions and refine strict RLS policies on creator_applications
-- ==============================================================================

-- 1. Grant table and sequence permissions to authenticated and service_role
GRANT ALL ON TABLE public.creator_applications TO authenticated, service_role, postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role, postgres;

-- 2. Ensure RLS is active
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

-- 3. SELECT Policy: Authenticated users can view their own applications, Admins view all
DROP POLICY IF EXISTS "Users can view own creator applications" ON public.creator_applications;
CREATE POLICY "Users can view own creator applications"
    ON public.creator_applications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

-- 4. INSERT Policy: Authenticated users can insert their own application with PENDING status
DROP POLICY IF EXISTS "Users can submit own creator application" ON public.creator_applications;
CREATE POLICY "Users can submit own creator application"
    ON public.creator_applications FOR INSERT
    TO authenticated
    WITH CHECK (
        user_id = auth.uid() AND
        status = 'PENDING'::public.application_status_type
    );

-- 5. UPDATE Policy: Admins can update applications (status, notes, reviewed_by)
DROP POLICY IF EXISTS "Admins can update creator applications" ON public.creator_applications;
CREATE POLICY "Admins can update creator applications"
    ON public.creator_applications FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. DELETE Policy: Admins can delete applications if required
DROP POLICY IF EXISTS "Admins can delete creator applications" ON public.creator_applications;
CREATE POLICY "Admins can delete creator applications"
    ON public.creator_applications FOR DELETE
    TO authenticated
    USING (public.is_admin());
