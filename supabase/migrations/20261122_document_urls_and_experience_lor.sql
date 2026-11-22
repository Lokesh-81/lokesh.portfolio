-- migration
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS credential_url TEXT;
ALTER TABLE public.experiences ADD COLUMN IF NOT EXISTS lor JSONB DEFAULT NULL;
