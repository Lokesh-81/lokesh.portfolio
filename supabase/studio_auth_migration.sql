-- ==============================================================================
-- LOKESH PORTFOLIO STUDIO - PRIVATE ADMIN AUTHENTICATION MIGRATION
-- Target Database: Supabase PostgreSQL (https://xkkwfrwamvictgrhepgg.supabase.co)
-- Authentication Model: Username + Password (NO Email required)
-- Security: bcrypt (pgcrypto), secure cryptographic session tokens, RLS enforcement
-- Initial Admin Credentials:
--   Username: Lokesh
--   Password: lokesh81* (stored ONLY as bcrypt hash)
-- ==============================================================================

-- 1. Enable pgcrypto extension for crypt() and gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Admin Users Table (Stores only hashed credentials)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Lokesh',
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Admin Sessions Table (Stores cryptographic random session tokens)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  remember_me BOOLEAN NOT NULL DEFAULT FALSE,
  user_agent TEXT,
  ip_address TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- 5. Seed Initial Admin Account
-- Password 'lokesh81*' is hashed with bcrypt inside PostgreSQL
INSERT INTO public.admin_users (username, password_hash, display_name, role)
VALUES (
  'Lokesh',
  crypt('lokesh81*', gen_salt('bf', 10)),
  'Lokesh',
  'admin'
)
ON CONFLICT (username) DO UPDATE
SET password_hash = crypt('lokesh81*', gen_salt('bf', 10)),
    updated_at = NOW();

-- 6. RPC: Authenticate Admin via Username + Password
CREATE OR REPLACE FUNCTION public.studio_admin_login(
  p_username TEXT,
  p_password TEXT,
  p_remember_me BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user RECORD;
  v_token TEXT;
  v_expires TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_user
  FROM public.admin_users
  WHERE LOWER(username) = LOWER(TRIM(p_username));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid username or password');
  END IF;

  -- Verify password with crypt()
  IF v_user.password_hash != crypt(p_password, v_user.password_hash) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid username or password');
  END IF;

  -- Generate secure 64-character random hex token
  v_token := encode(gen_random_bytes(32), 'hex');

  IF p_remember_me THEN
    v_expires := NOW() + INTERVAL '30 days';
  ELSE
    v_expires := NOW() + INTERVAL '1 day';
  END IF;

  -- Insert session
  INSERT INTO public.admin_sessions (user_id, session_token, remember_me, expires_at)
  VALUES (v_user.id, v_token, p_remember_me, v_expires);

  RETURN jsonb_build_object(
    'success', true,
    'session_token', v_token,
    'expires_at', v_expires,
    'user', jsonb_build_object(
      'id', v_user.id,
      'username', v_user.username,
      'display_name', v_user.display_name,
      'role', v_user.role
    )
  );
END;
$$;

-- 7. RPC: Verify Session Token
CREATE OR REPLACE FUNCTION public.studio_admin_verify_session(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_session RECORD;
BEGIN
  IF p_session_token IS NULL OR TRIM(p_session_token) = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'No session token provided');
  END IF;

  SELECT s.*, u.username, u.display_name, u.role
  INTO v_session
  FROM public.admin_sessions s
  JOIN public.admin_users u ON s.user_id = u.id
  WHERE s.session_token = p_session_token
    AND s.expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Session expired or invalid');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'user', jsonb_build_object(
      'id', v_session.user_id,
      'username', v_session.username,
      'display_name', v_session.display_name,
      'role', v_session.role
    )
  );
END;
$$;

-- 8. RPC: Logout (Invalidate current session)
CREATE OR REPLACE FUNCTION public.studio_admin_logout(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM public.admin_sessions
  WHERE session_token = p_session_token;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 9. RPC: Logout All Sessions
CREATE OR REPLACE FUNCTION public.studio_admin_logout_all(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id
  FROM public.admin_sessions
  WHERE session_token = p_session_token;

  IF FOUND THEN
    DELETE FROM public.admin_sessions
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 10. RPC: Change Password
CREATE OR REPLACE FUNCTION public.studio_admin_change_password(
  p_session_token TEXT,
  p_current_password TEXT,
  p_new_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_session RECORD;
  v_user RECORD;
BEGIN
  SELECT * INTO v_session
  FROM public.admin_sessions
  WHERE session_token = p_session_token
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Session invalid or expired');
  END IF;

  SELECT * INTO v_user
  FROM public.admin_users
  WHERE id = v_session.user_id;

  IF v_user.password_hash != crypt(p_current_password, v_user.password_hash) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Current password is incorrect');
  END IF;

  IF LENGTH(p_new_password) < 6 THEN
    RETURN jsonb_build_object('success', false, 'error', 'New password must be at least 6 characters');
  END IF;

  UPDATE public.admin_users
  SET password_hash = crypt(p_new_password, gen_salt('bf', 10)),
      updated_at = NOW()
  WHERE id = v_user.id;

  RETURN jsonb_build_object('success', true, 'message', 'Password updated successfully');
END;
$$;

-- 11. Helper function for RLS checking custom studio session header
CREATE OR REPLACE FUNCTION public.is_valid_admin_session()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_token TEXT;
BEGIN
  BEGIN
    v_token := current_setting('request.headers', true)::json->>'x-studio-token';
  EXCEPTION WHEN OTHERS THEN
    v_token := NULL;
  END;

  IF v_token IS NULL OR v_token = '' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_sessions
    WHERE session_token = v_token
      AND expires_at > NOW()
  );
END;
$$;

-- 12. Update Table RLS Policies to allow valid Studio Admin Sessions
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
      'profiles', 'hero_settings', 'about_settings', 'experiences', 'educations',
      'projects', 'skills', 'certifications', 'skill_badges', 'achievements',
      'languages', 'social_links', 'contact_messages', 'media', 'resumes', 'site_settings'
    )
  LOOP
    -- Add policy for Studio session token
    EXECUTE format('
      DROP POLICY IF EXISTS "Studio Admin Session All %1$I" ON public.%1$I;
      CREATE POLICY "Studio Admin Session All %1$I" ON public.%1$I
      FOR ALL TO anon, authenticated
      USING (public.is_valid_admin_session() OR auth.role() = ''authenticated'')
      WITH CHECK (public.is_valid_admin_session() OR auth.role() = ''authenticated'');
    ', t);
  END LOOP;
END $$;

-- 13. Grant Execute Permissions
GRANT EXECUTE ON FUNCTION public.studio_admin_login(TEXT, TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.studio_admin_verify_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.studio_admin_logout(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.studio_admin_logout_all(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.studio_admin_change_password(TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_admin_session() TO anon, authenticated;
