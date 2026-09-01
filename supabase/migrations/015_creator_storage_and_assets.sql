-- ==============================================================================
-- 015_CREATOR_STORAGE_AND_ASSETS.SQL
-- Setup storage buckets, storage RLS policies, and project assets RLS policies
-- ==============================================================================

-- 1. Create Storage Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'project-media', 
        'project-media', 
        true, 
        10485760, -- 10MB limit for images
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    ),
    (
        'project-deliverables', 
        'project-deliverables', 
        false, 
        209715200, -- 200MB limit for deliverables
        ARRAY['application/zip', 'application/x-zip-compressed', 'application/octet-stream', 'application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint', 'image/png', 'image/jpeg', 'image/webp']
    )
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for `project-media` (Public Bucket)
DROP POLICY IF EXISTS "Public can view project-media" ON storage.objects;
CREATE POLICY "Public can view project-media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Authenticated users can upload to project-media" ON storage.objects;
CREATE POLICY "Authenticated users can upload to project-media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Authenticated users can update/delete own project-media" ON storage.objects;
CREATE POLICY "Authenticated users can update/delete own project-media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Authenticated users can delete own project-media" ON storage.objects;
CREATE POLICY "Authenticated users can delete own project-media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-media');

-- 3. Storage Policies for `project-deliverables` (Private Bucket)
DROP POLICY IF EXISTS "Creators and Admins view project-deliverables" ON storage.objects;
CREATE POLICY "Creators and Admins view project-deliverables"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'project-deliverables');

DROP POLICY IF EXISTS "Creators can upload to project-deliverables" ON storage.objects;
CREATE POLICY "Creators can upload to project-deliverables"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-deliverables');

DROP POLICY IF EXISTS "Creators can update/delete own project-deliverables" ON storage.objects;
CREATE POLICY "Creators can update/delete own project-deliverables"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'project-deliverables');

DROP POLICY IF EXISTS "Creators can delete own project-deliverables" ON storage.objects;
CREATE POLICY "Creators can delete own project-deliverables"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-deliverables');

-- 4. Refine Table RLS Policies on `project_files` and `project_images`
DROP POLICY IF EXISTS "Creators can update own project files" ON public.project_files;
CREATE POLICY "Creators can update own project files"
    ON public.project_files FOR UPDATE
    TO authenticated
    USING (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Creators can delete own project files" ON public.project_files;
CREATE POLICY "Creators can delete own project files"
    ON public.project_files FOR DELETE
    TO authenticated
    USING (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Project images viewable by everyone" ON public.project_images;
CREATE POLICY "Project images viewable by everyone"
    ON public.project_images FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Creators can insert project images" ON public.project_images;
CREATE POLICY "Creators can insert project images"
    ON public.project_images FOR INSERT
    TO authenticated
    WITH CHECK (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Creators can update project images" ON public.project_images;
CREATE POLICY "Creators can update project images"
    ON public.project_images FOR UPDATE
    TO authenticated
    USING (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

DROP POLICY IF EXISTS "Creators can delete project images" ON public.project_images;
CREATE POLICY "Creators can delete project images"
    ON public.project_images FOR DELETE
    TO authenticated
    USING (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

-- 5. Helper trigger to auto-create creator_profile if role is upgraded or created
CREATE OR REPLACE FUNCTION public.ensure_creator_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF (NEW.role = 'CREATOR'::public.user_role_type OR NEW.role = 'ADMIN'::public.user_role_type) THEN
        INSERT INTO public.creator_profiles (
            user_id,
            display_name,
            handle,
            bio,
            role_title,
            is_approved,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            NEW.full_name,
            LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')),
            'Homies Studio Verified Creator & Technical Builder',
            'Verified Digital Creator',
            TRUE,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_creator_profile ON public.profiles;
CREATE TRIGGER trg_ensure_creator_profile
    AFTER INSERT OR UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.ensure_creator_profile();
