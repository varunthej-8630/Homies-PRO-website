-- ==============================================================================
-- 011_CREATOR_APPLICATIONS_AND_RBAC.SQL
-- Complete Role-Based Access Control, Immutable Role Protection, and Creator Application Flow
-- ==============================================================================

-- 1. Create Application Status Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status_type') THEN
        CREATE TYPE application_status_type AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
END $$;

-- 2. Create Creator Applications Table
CREATE TABLE IF NOT EXISTS public.creator_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    handle TEXT NOT NULL,
    role_title TEXT DEFAULT 'Digital Creator',
    bio TEXT,
    portfolio_url TEXT,
    experience TEXT,
    skills TEXT[],
    status application_status_type DEFAULT 'PENDING' NOT NULL,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_applications_user ON public.creator_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_applications_status ON public.creator_applications(status);

-- 3. Enable RLS on creator_applications
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own creator applications" ON public.creator_applications;
CREATE POLICY "Users can view own creator applications"
    ON public.creator_applications FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can submit own creator application" ON public.creator_applications;
CREATE POLICY "Users can submit own creator application"
    ON public.creator_applications FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update creator applications" ON public.creator_applications;
CREATE POLICY "Admins can update creator applications"
    ON public.creator_applications FOR UPDATE
    USING (public.is_admin());

-- 4. Hardened Security Function: Check Admin Status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'::public.user_role_type
    );
END;
$$;

-- 5. Strict Default Role Enforcement for Public Signups
-- CRITICAL SECURITY RULE: Public signups ALWAYS default to BUYER.
-- Even if client sends metadata role = 'ADMIN', it is ignored.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        avatar_url,
        role,
        is_verified,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), 'Homies Member'),
        NEW.email,
        COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''), '/homies/header-logo.png'),
        'BUYER'::public.user_role_type, -- Strictly force BUYER for all public signups
        FALSE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Role Tamper Protection Trigger on public.profiles
-- Prevents non-admins from changing their own role via client update queries.
CREATE OR REPLACE FUNCTION public.prevent_role_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If role is changing and user is not an admin, revert role to OLD.role
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
        IF NOT public.is_admin() THEN
            NEW.role := OLD.role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_tampering ON public.profiles;
CREATE TRIGGER trg_prevent_role_tampering
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_tampering();

-- 7. Automated Application Approval Trigger
-- When an Admin approves a Creator Application, automatically upgrade user role and create creator profile
CREATE OR REPLACE FUNCTION public.on_creator_application_reviewed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF (NEW.status = 'APPROVED' AND (OLD.status IS DISTINCT FROM 'APPROVED')) THEN
        -- 1. Upgrade profile role to CREATOR
        UPDATE public.profiles
        SET role = 'CREATOR'::public.user_role_type,
            updated_at = NOW()
        WHERE id = NEW.user_id;

        -- 2. Create or activate creator_profile
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
            NEW.user_id,
            NEW.full_name,
            NEW.handle,
            NEW.bio,
            COALESCE(NEW.role_title, 'Verified Digital Creator'),
            TRUE,
            NOW(),
            NOW()
        )
        ON CONFLICT (user_id) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            handle = EXCLUDED.handle,
            bio = EXCLUDED.bio,
            is_approved = TRUE,
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_creator_application_reviewed ON public.creator_applications;
CREATE TRIGGER trg_creator_application_reviewed
    AFTER UPDATE ON public.creator_applications
    FOR EACH ROW EXECUTE FUNCTION public.on_creator_application_reviewed();
