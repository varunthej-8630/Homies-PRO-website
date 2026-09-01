-- ==============================================================================
-- 008_MODERATION_AND_NOTIFICATIONS.SQL
-- Quality control audit trail, system activity logs, and real-time in-app notifications
-- ==============================================================================

CREATE TYPE moderation_action_type AS ENUM (
    'APPROVE',
    'REQUEST_CHANGES',
    'REJECT',
    'ARCHIVE'
);

CREATE TYPE notification_type AS ENUM (
    'PROJECT_SUBMITTED',
    'PROJECT_APPROVED',
    'CHANGES_REQUESTED',
    'PROJECT_REJECTED',
    'ORDER_PAID',
    'DOWNLOAD_READY',
    'WITHDRAWAL_REQUESTED',
    'WITHDRAWAL_PROCESSED',
    'SYSTEM_ALERT'
);

-- Admin Moderation Action Audit Trail
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action moderation_action_type NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'SYSTEM_ALERT' NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Immutable Security Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moderation_project_id ON public.moderation_actions(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
