/**
 * Supabase Health & Legitimate Activity Monitor
 * 
 * Provides production-safe, low-frequency health checks to prevent Supabase free-tier project pausing.
 * - Client-side: Throttled to max 1 lightweight read check every 24 hours per browser/client.
 * - 100% Read-only: executes a lightweight query against PostgreSQL.
 * - Zero artificial writes, zero fake records, and zero auth session calls.
 */

import { supabase } from '@/lib/supabase';

const HEALTH_STORAGE_KEY = 'supabase_last_health_ping_v2';
const HEALTH_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface SupabaseHealthResult {
  success: boolean;
  timestamp: string;
  latencyMs: number;
  error?: string;
  source: 'database_rpc' | 'storage' | 'skipped_throttled';
}

/**
 * Executes a minimal read-only database query or RPC to verify connectivity.
 * This runs against PostgreSQL directly, registering genuine application traffic on Supabase.
 */
export async function performSupabaseReadCheck(): Promise<SupabaseHealthResult> {
  const start = Date.now();

  try {
    // 1. Attempt dedicated public.health_check() SQL function if deployed
    const { error: rpcError } = await supabase.rpc('health_check');
    if (!rpcError) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
        source: 'database_rpc',
      };
    }

    // 2. Fallback to Storage list operation (queries storage.objects table in PostgreSQL)
    const { error: storageError } = await supabase.storage.from('portfolio-media').list('', { limit: 1 });
    if (!storageError) {
      return {
        success: true,
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
        source: 'storage',
      };
    }

    return {
      success: false,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - start,
      error: rpcError?.message || storageError?.message || 'Check failed',
      source: 'database_rpc',
    };
  } catch (err: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - start,
      error: err?.message || 'Network error',
      source: 'database_rpc',
    };
  }
}

/**
 * Client-Side Throttled Health Check
 * Safe for production: avoids duplicate requests across multiple tabs or page reloads.
 * Executes at most once every 24 hours per client.
 */
export async function runClientThrottledHealthCheck(): Promise<SupabaseHealthResult> {
  if (typeof window === 'undefined') {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      latencyMs: 0,
      source: 'skipped_throttled',
    };
  }

  try {
    const lastPingStr = localStorage.getItem(HEALTH_STORAGE_KEY);
    const lastPing = lastPingStr ? parseInt(lastPingStr, 10) : 0;
    const now = Date.now();

    // If already checked within the last 24 hours, skip
    if (lastPing && now - lastPing < HEALTH_INTERVAL_MS) {
      return {
        success: true,
        timestamp: new Date(lastPing).toISOString(),
        latencyMs: 0,
        source: 'skipped_throttled',
      };
    }

    // Mark attempt timestamp immediately to avoid race conditions between tabs
    localStorage.setItem(HEALTH_STORAGE_KEY, now.toString());

    // Execute minimal legitimate read-only query
    const result = await performSupabaseReadCheck();

    // If failed, allow retry in 1 hour rather than locking for full 24h
    if (!result.success) {
      localStorage.setItem(HEALTH_STORAGE_KEY, (now - HEALTH_INTERVAL_MS + 60 * 60 * 1000).toString());
    }

    return result;
  } catch {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      latencyMs: 0,
      error: 'Storage unavailable',
      source: 'skipped_throttled',
    };
  }
}
