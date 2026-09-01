-- ==============================================================================
-- 009_ROW_LEVEL_SECURITY.SQL
-- Strict data isolation, role-based access control, and zero-trust storage policies
-- ==============================================================================

-- Helper Function: Check if caller is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CREATOR PROFILES POLICIES
CREATE POLICY "Approved creator profiles are viewable by everyone" 
    ON public.creator_profiles FOR SELECT USING (true);

CREATE POLICY "Creators can update own profile" 
    ON public.creator_profiles FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create creator profile" 
    ON public.creator_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- 3. CATEGORIES POLICIES
CREATE POLICY "Categories viewable by everyone" 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admin manage categories" 
    ON public.categories FOR ALL USING (public.is_admin());

-- 4. PROJECTS POLICIES
CREATE POLICY "Published projects viewable by everyone" 
    ON public.projects FOR SELECT USING (
        status = 'PUBLISHED' OR 
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()) OR
        public.is_admin()
    );

CREATE POLICY "Creators can create projects" 
    ON public.projects FOR INSERT WITH CHECK (
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Creators can update own non-published projects" 
    ON public.projects FOR UPDATE USING (
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()) OR
        public.is_admin()
    );

CREATE POLICY "Admins full access to projects" 
    ON public.projects FOR ALL USING (public.is_admin());

-- 5. PROJECT FILES (PRIVATE DELIVERABLES - ZERO PUBLIC ACCESS)
CREATE POLICY "Creators can view their own project files"
    ON public.project_files FOR SELECT USING (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())) OR
        public.is_admin()
    );

CREATE POLICY "Creators can insert files to their projects"
    ON public.project_files FOR INSERT WITH CHECK (
        project_id IN (SELECT id FROM public.projects WHERE creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()))
    );

-- 6. ORDERS POLICIES
CREATE POLICY "Buyers can view their own orders" 
    ON public.orders FOR SELECT USING (buyer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Order items viewable by buyer or creator or admin" 
    ON public.order_items FOR SELECT USING (
        order_id IN (SELECT id FROM public.orders WHERE buyer_id = auth.uid()) OR
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()) OR
        public.is_admin()
    );

-- 7. DOWNLOADS POLICIES
CREATE POLICY "Users can view their own downloads" 
    ON public.downloads FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

-- 8. CREATOR EARNINGS POLICIES
CREATE POLICY "Creators view own earnings" 
    ON public.creator_earnings FOR SELECT USING (
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()) OR
        public.is_admin()
    );

-- 9. WITHDRAWALS POLICIES
CREATE POLICY "Creators view and request own withdrawals" 
    ON public.withdrawals FOR SELECT USING (
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()) OR
        public.is_admin()
    );

CREATE POLICY "Creators insert withdrawal requests" 
    ON public.withdrawals FOR INSERT WITH CHECK (
        creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Admins manage all withdrawals" 
    ON public.withdrawals FOR ALL USING (public.is_admin());

-- 10. REVIEWS POLICIES
CREATE POLICY "Reviews viewable by everyone" 
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
    ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" 
    ON public.reviews FOR UPDATE USING (user_id = auth.uid());

-- 11. WISHLISTS POLICIES
CREATE POLICY "Users manage own wishlist" 
    ON public.wishlists FOR ALL USING (user_id = auth.uid());

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users view and update own notifications" 
    ON public.notifications FOR ALL USING (user_id = auth.uid());

-- 13. AUDIT LOGS & MODERATION POLICIES
CREATE POLICY "Admins view audit and moderation logs" 
    ON public.audit_logs FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins manage moderation actions" 
    ON public.moderation_actions FOR ALL USING (public.is_admin());
