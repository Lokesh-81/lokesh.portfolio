-- Secure Studio upload support.
-- Browser clients do NOT receive the Supabase service-role key.
-- Upload authorization is performed by /api/studio-upload-url.ts after the
-- studio_admin_verify_session RPC validates the existing Studio session.
-- The Vercel function uses SUPABASE_SERVICE_ROLE_KEY to create a signed
-- upload token, so the existing authenticated-only Storage RLS policies stay
-- in place. Do not grant anon INSERT/UPDATE/DELETE on storage.objects.

update storage.buckets
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = null
where id = 'portfolio-media';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 52428800, null)
on conflict (id) do update
set public = true,
    file_size_limit = 52428800,
    allowed_mime_types = null;
