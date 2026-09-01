-- ==============================================================================
-- 013_GRANT_ANON_AND_AUTHENTICATED_PERMISSIONS.SQL
-- Grant base table permissions to anon and authenticated roles with RLS governance
-- ==============================================================================

-- 1. Grant table privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.creator_applications TO anon;
GRANT ALL ON TABLE public.creator_applications TO authenticated, service_role;

-- 2. Refine SELECT RLS policy on creator_applications
DROP POLICY IF EXISTS "Users can view own creator applications" ON public.creator_applications;
CREATE POLICY "Users can view own creator applications"
    ON public.creator_applications FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
        public.is_admin()
    );

-- 3. Refine INSERT RLS policy on creator_applications
DROP POLICY IF EXISTS "Users can submit own creator application" ON public.creator_applications;
CREATE POLICY "Users can submit own creator application"
    ON public.creator_applications FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        user_id = auth.uid() AND
        status = 'PENDING'::public.application_status_type
    );
