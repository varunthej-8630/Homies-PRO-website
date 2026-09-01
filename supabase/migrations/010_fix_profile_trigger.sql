-- ==============================================================================
-- 010_FIX_PROFILE_TRIGGER.SQL
-- Fix auth trigger search_path, permissions, and safe enum casting
-- ==============================================================================

-- 1. Grant necessary permissions to auth admin & service role
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

-- 2. Ensure profiles INSERT policy exists for RLS
DROP POLICY IF EXISTS "Enable insert for users and triggers" ON public.profiles;
CREATE POLICY "Enable insert for users and triggers" 
    ON public.profiles FOR INSERT 
    WITH CHECK (true);

-- 3. Robust, security-definer trigger with explicit search_path = public
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role public.user_role_type;
    raw_role_text TEXT;
BEGIN
    -- Safely extract and validate role from user metadata
    raw_role_text := NEW.raw_user_meta_data->>'role';
    
    IF raw_role_text = 'CREATOR' THEN
        user_role := 'CREATOR'::public.user_role_type;
    ELSIF raw_role_text = 'ADMIN' THEN
        user_role := 'ADMIN'::public.user_role_type;
    ELSE
        user_role := 'BUYER'::public.user_role_type;
    END IF;

    -- Insert into public.profiles with upsert safety
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
        user_role,
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
        -- Log warning in Postgres logs and allow auth.users insertion to proceed safely
        RAISE WARNING 'handle_new_user trigger error for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- 4. Re-bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
