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

-- Seed Foundarly Business World Owner (Abhishek Aggarwal) exact testimonial
INSERT INTO public.testimonials (id, name, role, company, testimonial, project_url, rating, display_order, is_published)
VALUES (
  'test-foundarly',
  'Abhishek Aggarwal',
  'Founder & Business Owner',
  'Foundarly Business World',
  'Super fast execution and very satisfying results every single time! Lokesh is highly reliable, technically solid, and always ready to tackle any challenge on the website. A pleasure to work with!',
  'https://foundarlybusinessworld.in',
  5,
  0,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    testimonial = EXCLUDED.testimonial,
    project_url = EXCLUDED.project_url,
    rating = EXCLUDED.rating,
    is_published = true;

-- Seed Indira Thakur exact testimonial
INSERT INTO public.testimonials (id, name, company, testimonial, project_url, rating, display_order, is_published)
VALUES (
  'test-indira-thakur',
  'Indira Thakur',
  'Indira Thakur Photography',
  'I was looking for a website developer to create my website and came across Lokesh through a company I had hired. I shared the colour palette, font style, and other details I wanted to match my brand, and he implemented everything as requested.

There were multiple complications during the development process, which he resolved efficiently. I would message him about any issues with the website on WhatsApp, and he would work on resolving them. He never told me that something couldn’t be done. He has a positive attitude towards his work and always tries to find a solution, which I really appreciated.

It was nice working with him. The website now looks satisfactory, and I’m happy with the overall result.',
  'https://www.indirathakur.com',
  5,
  1,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    company = EXCLUDED.company,
    testimonial = EXCLUDED.testimonial,
    project_url = EXCLUDED.project_url,
    rating = EXCLUDED.rating,
    is_published = true;

