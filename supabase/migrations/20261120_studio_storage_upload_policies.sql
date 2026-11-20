-- Apply once in Supabase SQL Editor for the existing Studio deployment.
-- Studio uses its own username/password session, not Supabase Auth. The current
-- client therefore connects as the anon role; authenticated-only Storage
-- policies reject every browser upload and the old code silently fell back to
-- IndexedDB/localStorage.
--
-- NOTE: This matches the repository's existing anon-write RLS model. For a
-- hardened production setup, move mutations behind an authenticated Edge Function.

drop policy if exists "Authenticated Upload Media" on storage.objects;
drop policy if exists "Authenticated Update Media" on storage.objects;
drop policy if exists "Authenticated Delete Media" on storage.objects;
drop policy if exists "Studio Upload Portfolio Media" on storage.objects;
drop policy if exists "Studio Update Portfolio Media" on storage.objects;
drop policy if exists "Studio Delete Portfolio Media" on storage.objects;

create policy "Studio Upload Portfolio Media"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'portfolio-media');

create policy "Studio Update Portfolio Media"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'portfolio-media')
with check (bucket_id = 'portfolio-media');

create policy "Studio Delete Portfolio Media"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'portfolio-media');

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
