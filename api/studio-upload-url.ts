/**
 * Vercel serverless endpoint for secure Studio uploads.
 * The service-role key stays server-side. Browser uploads use short-lived
 * signed upload tokens after the Studio session is verified by Supabase RPC.
 */
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://xkkwfrwamvictgrhepgg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2nLc2vuaV6KJQM5VODAAGg_X2NrdvH6';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables.' });
  }

  const sessionToken = String(req.body?.sessionToken || '');
  const filename = String(req.body?.filename || '').trim();
  const contentType = String(req.body?.contentType || 'application/octet-stream');
  const size = Number(req.body?.size || 0);
  const folder = String(req.body?.folder || 'uploads').replace(/[^a-zA-Z0-9_-]/g, '');

  if (!sessionToken || sessionToken.length < 32) {
    return res.status(401).json({ error: 'Studio session is missing. Sign in again.' });
  }
  if (!filename || !size || size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'Choose a file smaller than 50 MB.' });
  }

  try {
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/studio_admin_verify_session`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_session_token: sessionToken }),
    });
    if (!verifyResponse.ok) {
      const details = await verifyResponse.text();
      return res.status(401).json({ error: `Could not verify Studio session with Supabase: ${details.slice(0, 240)}` });
    }
    const session = await verifyResponse.json();
    if (!session?.valid) {
      return res.status(401).json({ error: 'Studio session is invalid or expired. Sign in again.' });
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${Date.now()}_${safeName}`;
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    const signedResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/portfolio-media/${encodedPath}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upsert: true }),
    });
    const signedPayload = await signedResponse.json().catch(() => ({}));
    if (!signedResponse.ok || !signedPayload.token) {
      return res.status(502).json({ error: signedPayload.message || signedPayload.error || 'Supabase could not create a signed upload URL.' });
    }

    return res.status(200).json({
      bucket: 'portfolio-media',
      path,
      token: signedPayload.token,
      publicUrl: `${SUPABASE_URL}/storage/v1/object/public/portfolio-media/${path.split('/').map(encodeURIComponent).join('/')}`,
      contentType,
    });
  } catch (error: any) {
    return res.status(502).json({ error: error?.message || 'Could not prepare a secure Supabase upload.' });
  }
}
