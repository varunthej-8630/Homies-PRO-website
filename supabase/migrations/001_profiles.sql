-- ==============================================================================
-- 001_PROFILES.SQL
-- Custom user profiles linked to auth.users with strict role enforcement
-- ==============================================================================

-- Create Custom Types
CREATE TYPE user_role_type AS ENUM ('BUYER', 'CREATOR', 'ADMIN');

-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT DEFAULT '/homies/header-logo.png',
    role user_role_type DEFAULT 'BUYER' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Creator Profiles Table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    display_name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT DEFAULT '/homies/header-logo.png',
    role_title TEXT DEFAULT 'Verified Digital Creator' NOT NULL,
    upi_id TEXT,
    bank_account_reference TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    sales_count INTEGER DEFAULT 0 NOT NULL,
    total_earnings NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    available_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    pending_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    response_time TEXT DEFAULT '< 2 hours',
    is_approved BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_handle ON public.creator_profiles(handle);

-- Trigger: Automatically Create Profile on auth.users Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Homies Member'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/homies/header-logo.png'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_type, 'BUYER'::user_role_type)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
