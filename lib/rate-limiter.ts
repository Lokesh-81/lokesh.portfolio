/**
 * Client-Side Defensive Rate Limiter
 * Protects authentication, contact inquiries, and password reset endpoints from brute force and automated spam.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // time window in milliseconds
}

const LIMITS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 mins
  password_reset: { maxAttempts: 3, windowMs: 15 * 60 * 1000 }, // 3 attempts per 15 mins
  contact_form: { maxAttempts: 4, windowMs: 10 * 60 * 1000 }, // 4 messages per 10 mins
  otp_verify: { maxAttempts: 5, windowMs: 10 * 60 * 1000 }, // 5 attempts per 10 mins
};

interface AttemptRecord {
  timestamps: number[];
}

function getStorageKey(action: string): string {
  return `rl_attempts_${action}`;
}

export const rateLimiter = {
  check(action: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
    if (typeof window === 'undefined') return { allowed: true, remainingAttempts: 99, retryAfterSeconds: 0 };

    const config = LIMITS[action] || { maxAttempts: 10, windowMs: 60 * 1000 };
    const key = getStorageKey(action);
    const now = Date.now();

    let record: AttemptRecord = { timestamps: [] };
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        record = JSON.parse(raw);
      }
    } catch {
      record = { timestamps: [] };
    }

    // Filter out attempts outside the sliding window
    const validTimestamps = record.timestamps.filter((t) => now - t < config.windowMs);

    if (validTimestamps.length >= config.maxAttempts) {
      const oldestValid = validTimestamps[0];
      const retryAfterMs = config.windowMs - (now - oldestValid);
      const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

      return {
        allowed: false,
        remainingAttempts: 0,
        retryAfterSeconds,
      };
    }

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - validTimestamps.length,
      retryAfterSeconds: 0,
    };
  },

  recordAttempt(action: string): void {
    if (typeof window === 'undefined') return;

    const config = LIMITS[action] || { maxAttempts: 10, windowMs: 60 * 1000 };
    const key = getStorageKey(action);
    const now = Date.now();

    let record: AttemptRecord = { timestamps: [] };
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        record = JSON.parse(raw);
      }
    } catch {
      record = { timestamps: [] };
    }

    const validTimestamps = record.timestamps.filter((t) => now - t < config.windowMs);
    validTimestamps.push(now);

    try {
      localStorage.setItem(key, JSON.stringify({ timestamps: validTimestamps }));
    } catch {
      // Storage unavailable or quota exceeded
    }
  },

  reset(action: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(getStorageKey(action));
    } catch {}
  },
};
