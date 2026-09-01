-- ==============================================================================
-- 014_GRANT_SCHEMA_PERMISSIONS.SQL
-- Grant standard schema and table execution permissions to anon and authenticated
-- with full Row Level Security (RLS) governance
-- ==============================================================================

-- 1. Grant Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant table permissions to authenticated role (subject to RLS policies)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated, service_role;

-- 3. Grant select permissions to anon role (subject to RLS policies)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Set Default Privileges for any future tables created
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated, service_role;
