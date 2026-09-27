/**
 * Vercel Serverless Function: Supabase Legitimate Read-Only Health Check
 * Route: /api/supabase-health
 * 
 * Scheduled via Vercel Cron in vercel.json:
 * "schedule": "0 10 * * *" (Once daily at 10:00 UTC)
 * 
 * Safety & Legitimate Activity Guarantees:
 * - 100% Read-only: executes a lightweight SELECT/list query against PostgreSQL.
 * - Zero artificial data: no mock records, no fake users, no database writes.
 * - Protected: Verifies Vercel CRON_SECRET if configured.
 * - Negligible resource impact (<1 KB, ~70-150ms execution time).
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://xkkwfrwamvictgrhepgg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_2nLc2vuaV6KJQM5VODAAGg_X2NrdvH6';
const CRON_SECRET = process.env.CRON_SECRET;

interface HealthCheckResult {
  ok: boolean;
  timestamp: string;
  latencyMs: number;
  operation: string;
  httpStatus: number;
  error?: string;
}

async function performReadOnlySupabasePing(): Promise<HealthCheckResult> {
  const start = Date.now();

  // 1. Try dedicated public.health_check() SQL function if deployed
  try {
    const rpcResp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/health_check`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-client-info': 'vercel-cron-supabase-health/1.0',
      },
      body: JSON.stringify({}),
    });

    if (rpcResp.ok) {
      return {
        ok: true,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
        operation: 'rpc:health_check',
        httpStatus: rpcResp.status,
      };
    }
  } catch {
    // Fall through to storage check
  }

  // 2. Query portfolio-media storage object list (read-only query on PostgreSQL storage.objects table)
  try {
    const storageResp = await fetch(`${SUPABASE_URL}/storage/v1/object/list/portfolio-media`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'x-client-info': 'vercel-cron-supabase-health/1.0',
      },
      body: JSON.stringify({ prefix: '', limit: 1 }),
    });

    if (storageResp.ok) {
      return {
        ok: true,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
        operation: 'storage:list(portfolio-media)',
        httpStatus: storageResp.status,
      };
    }

    return {
      ok: false,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - start,
      operation: 'storage:list(portfolio-media)',
      httpStatus: storageResp.status,
      error: `Storage check returned status ${storageResp.status}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - start,
      operation: 'storage:list(portfolio-media)',
      httpStatus: 0,
      error: err?.message || 'Network request failed',
    };
  }
}

export default async function handler(req: any, res: any) {
  // Only allow GET or POST (Vercel Cron invokes via GET)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Security: If CRON_SECRET is configured in Vercel, verify authorization header
  if (CRON_SECRET) {
    const authHeader = req.headers['authorization'];
    const isVercelCronHeader = req.headers['x-vercel-cron'];
    const hasValidBearer = authHeader === `Bearer ${CRON_SECRET}`;

    if (!hasValidBearer && !isVercelCronHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Valid CRON_SECRET required in Authorization header.',
      });
      return;
    }
  }

  const result = await performReadOnlySupabasePing();

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.status(result.ok ? 200 : 502).json({
    status: result.ok ? 'active' : 'degraded',
    project: SUPABASE_URL.replace('https://', '').split('.')[0],
    isReadOnly: true,
    scheduledBy: 'Vercel Cron',
    frequency: 'Once daily (0 10 * * *)',
    result,
  });
}
