-- ==============================================================================
-- Supabase Health & Keepalive Migration
-- Target Database: Supabase PostgreSQL (https://xkkwfrwamvictgrhepgg.supabase.co)
-- 
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xkkwfrwamvictgrhepgg/sql/new
-- ==============================================================================

-- 1. Create a minimal, read-only health check function
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'status', 'ok',
    'timestamp', NOW(),
    'version', '1.0.0'
  );
$$;

GRANT EXECUTE ON FUNCTION public.health_check() TO anon, authenticated;

-- 2. Optional: Ensure anon has read permissions on public portfolio tables
-- (Prevents 42501 permission denied when public visitors fetch portfolio data)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
