# Studio Supabase setup

The Studio uses a custom username/password session. Browser uploads must not expose the Supabase service-role key, so file uploads are authorized through the Vercel serverless endpoint at `/api/studio-upload-url`.

## Required Vercel environment variable

1. Open the Vercel project for `lokesh-portfolio`.
2. Go to **Settings → Environment Variables**.
3. Add `SUPABASE_SERVICE_ROLE_KEY`.
4. Set its value to the Supabase project's server-side secret/service-role key from **Supabase → Project Settings → API Keys**.
5. Enable it for **Production** and **Preview** (and Development if you use Vercel dev).
6. Save and redeploy.

Do not prefix this variable with `VITE_` or `NEXT_PUBLIC_`. Never put the service-role key in frontend code, GitHub, or chat.

## Supabase SQL

- Ensure `supabase/schema.sql` has been applied to the target project.
- Ensure `supabase/studio_auth_migration.sql` has been applied so `studio_admin_verify_session` exists and Studio sessions are stored in PostgreSQL.
- Run `supabase/migrations/20261120_studio_storage_upload_policies.sql` in the Supabase SQL Editor to ensure the public `portfolio-media` bucket supports the file types and 50 MB limit used by Studio.

The Storage bucket keeps its authenticated-only write policies. The Vercel endpoint verifies the Studio session and creates a short-lived signed upload token with the server-side key.

## Verify

- Open `/api/supabase-health` on the deployed site. It should return `status: active`.
- Sign in to Studio and hover over the **Local cache** status pill. The tooltip now contains the connection diagnostic.
- Upload a small test image in Media Library. A successful upload returns a public Supabase Storage URL. If the server key or database session is missing, Studio shows the actual error instead of pretending a local-only upload succeeded.
