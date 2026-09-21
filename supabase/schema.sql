-- ==============================================================================
-- LOKESH PERSONAL PORTFOLIO - SUPABASE CMS DATABASE SCHEMA
-- Target Project: https://xkkwfrwamvictgrhepgg.supabase.co
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Storage Bucket for Portfolio Media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Storage Security Policies
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Upload Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Update Media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated Delete Media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media');

-- 4. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Poosala Lokesh',
  display_name TEXT NOT NULL DEFAULT 'Poosala Lokesh',
  title TEXT DEFAULT 'Full Stack Developer / AI Enthusiast',
  short_bio TEXT,
  about_hero TEXT DEFAULT 'Curious by nature.',
  about_description TEXT,
  about_sub_description TEXT,
  location TEXT DEFAULT 'Hyderabad, India',
  graduation_year TEXT DEFAULT '2027',
  education TEXT DEFAULT 'B.Sc. MSCS · 2027',
  recognition TEXT DEFAULT 'Google Cloud Certified Professional Cloud Architect',
  languages JSONB DEFAULT '["Telugu", "English", "Hindi", "French"]'::jsonb,
  photo_url TEXT,
  hero_image TEXT,
  email TEXT DEFAULT 'poosala15@gmail.com',
  phone TEXT DEFAULT '+91 8885674172',
  availability TEXT DEFAULT 'Available for high-impact roles and internships',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Hero Settings Table
CREATE TABLE IF NOT EXISTS public.hero_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  greeting TEXT DEFAULT 'Hello, I am',
  name TEXT DEFAULT 'Poosala Lokesh.',
  headline TEXT DEFAULT 'Full Stack Developer / AI Enthusiast',
  bio TEXT,
  im_a TEXT DEFAULT 'I''m a',
  rotating_words JSONB DEFAULT '["Full Stack Developer", "Google Cloud Architect", "AI Engineer", "Creative Problem Solver"]'::jsonb,
  cta_work TEXT DEFAULT 'Selected Works',
  cta_contact TEXT DEFAULT 'Get in Touch',
  availability_badge TEXT DEFAULT 'Available for Summer 2026 Internships & High-Impact Roles',
  show_availability BOOLEAN DEFAULT true,
  featured_credential_title TEXT DEFAULT 'Google Cloud Certified Professional Cloud Architect',
  featured_credential_date TEXT DEFAULT 'Sep 2026',
  featured_credential_link TEXT DEFAULT 'certifications',
  hero_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. About Settings Table
CREATE TABLE IF NOT EXISTS public.about_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag TEXT DEFAULT 'BACKGROUND & PHILOSOPHY',
  title TEXT DEFAULT 'Curious',
  title_accent TEXT DEFAULT 'by nature.',
  intro_greeting TEXT DEFAULT 'I''m',
  intro_suffix TEXT DEFAULT 'a Full Stack Developer and Computer Science student based in',
  intro_goal TEXT DEFAULT 'driven by the craft of building resilient web products and AI integrations.',
  sub_description TEXT,
  full_bio TEXT,
  philosophy TEXT,
  verified_profiles JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Internship',
  description TEXT,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  link TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Educations Table
CREATE TABLE IF NOT EXISTS public.educations (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_year TEXT NOT NULL,
  grade TEXT,
  description TEXT,
  location TEXT DEFAULT 'Hyderabad, India',
  institution_url TEXT,
  logo_url TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  short_description TEXT,
  description TEXT,
  what_i_worked_on JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Live',
  live_url TEXT,
  github_url TEXT,
  case_study_url TEXT,
  year TEXT DEFAULT '2026',
  image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  accent_color TEXT DEFAULT '#2563EB',
  gradient TEXT DEFAULT 'from-blue-900/40 via-indigo-950/20 to-black/60',
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Core',
  category TEXT NOT NULL DEFAULT 'Languages',
  icon_name TEXT,
  display_order INT DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  show_in_slider BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  badge_title TEXT,
  subtitle TEXT,
  recipient TEXT,
  certified_as TEXT,
  issuer TEXT DEFAULT 'Google Cloud',
  issuer_logo TEXT,
  series_id TEXT,
  issue_date TEXT,
  expiration_date TEXT,
  credential_id TEXT,
  verification_url TEXT,
  signatory JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'Active',
  badge_image TEXT,
  is_featured BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  description TEXT,
  domains JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  exam_scope JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Skill Badges Table
CREATE TABLE IF NOT EXISTS public.skill_badges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Intermediate',
  issuer TEXT DEFAULT 'Google Cloud',
  issued_date TEXT,
  description TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT,
  date TEXT,
  description TEXT,
  position_or_prize TEXT,
  image_url TEXT,
  url TEXT,
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Languages Table
CREATE TABLE IF NOT EXISTS public.languages (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  percentage INT DEFAULT 100,
  display_order INT DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Social Links Table
CREATE TABLE IF NOT EXISTS public.social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  username TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Contact Messages / Inbox Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Media Library Table
CREATE TABLE IF NOT EXISTS public.media (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  size BIGINT DEFAULT 0,
  type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  file_size TEXT,
  is_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT NOT NULL,
  site_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  favicon_url TEXT,
  og_image_url TEXT,
  copyright_text TEXT,
  footer_text TEXT,
  availability_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

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
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-- Public READ for portfolio display
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Hero" ON public.hero_settings FOR SELECT USING (true);
CREATE POLICY "Public Read About" ON public.about_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Educations" ON public.educations FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Skill Badges" ON public.skill_badges FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Achievements" ON public.achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Languages" ON public.languages FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public Read Resumes" ON public.resumes FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Public INSERT for Contact Form
CREATE POLICY "Public Insert Contact Messages"
ON public.contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated Admin FULL ACCESS on all tables
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Hero" ON public.hero_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All About" ON public.about_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Educations" ON public.educations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Skill Badges" ON public.skill_badges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Achievements" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Social Links" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Contact Messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Media" ON public.media FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Resumes" ON public.resumes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Index optimization
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects (display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences (display_order);
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills (display_order);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages (created_at DESC);
