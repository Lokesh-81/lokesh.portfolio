-- ==============================================================================
-- Testimonials Table & Real Database Persistence Migration
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  testimonial TEXT NOT NULL,
  project_url TEXT,
  avatar_url TEXT,
  rating INTEGER DEFAULT 5,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_order ON public.testimonials (display_order);

-- Permissions
GRANT ALL ON TABLE public.testimonials TO anon, authenticated, service_role;

-- Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Testimonials" ON public.testimonials;
CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin All Testimonials" ON public.testimonials;
CREATE POLICY "Admin All Testimonials" ON public.testimonials FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed Foundarly Business World Owner exact testimonial
INSERT INTO public.testimonials (id, name, role, company, testimonial, project_url, display_order, is_published)
VALUES (
  'test-foundarly',
  'Foundarly Business World Owner',
  'Founder & Business Owner',
  'Foundarly Business World',
  'Super fast execution and very satisfying results every single time! Lokesh is highly reliable, technically solid, and always ready to tackle any challenge on the website. A pleasure to work with!',
  'https://foundarlybusinessworld.in',
  0,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    testimonial = EXCLUDED.testimonial,
    project_url = EXCLUDED.project_url,
    is_published = true;
