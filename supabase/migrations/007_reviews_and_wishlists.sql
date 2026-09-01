-- ==============================================================================
-- 007_REVIEWS_AND_WISHLISTS.SQL
-- Verified buyer reviews with automatic rating rollups & user wishlist
-- ==============================================================================

-- Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Wishlists Table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, project_id)
);

-- Trigger: Automatically recalculate average rating on new review
CREATE OR REPLACE FUNCTION public.recalculate_project_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.projects
    SET 
        rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE project_id = NEW.project_id), 5.00),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE project_id = NEW.project_id),
        updated_at = NOW()
    WHERE id = NEW.project_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_created_or_updated ON public.reviews;
CREATE TRIGGER on_review_created_or_updated
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_project_rating();

CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON public.reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
