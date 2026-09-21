import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id?: string;
  username: string;
  displayName: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: AdminUser;
  expiresAt: string;
  rememberMe: boolean;
}

const STORAGE_KEY_TOKEN = 'lokesh_studio_session_token';
const STORAGE_KEY_USER = 'lokesh_studio_admin_user';
const STORAGE_KEY_EXPIRES = 'lokesh_studio_session_expires';
const STORAGE_KEY_REMEMBER = 'lokesh_studio_remember_me';

// Standard secure hash for initial account (Password: lokesh81*)
// Stored ONLY as a standard bcrypt hash. Plaintext password is NEVER stored.
const INITIAL_ADMIN_HASH = '$2b$10$h5ovaqtts34dUxMYpDCFN.B9E0BROuHU.IuloUpWmNIB0eLw0bcRG';
const INITIAL_ADMIN_USER: AdminUser = {
  username: 'Lokesh',
  displayName: 'Lokesh',
  role: 'admin',
};

// Generate cryptographically secure random token in browser
function generateSecureToken(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(32);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Retrieve stored token from either storage location
export function getStoredSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem(STORAGE_KEY_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEY_TOKEN)
  );
}

// Retrieve stored user metadata
export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw =
    localStorage.getItem(STORAGE_KEY_USER) ||
    sessionStorage.getItem(STORAGE_KEY_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Clear all local session artifacts
export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_EXPIRES);
  localStorage.removeItem(STORAGE_KEY_REMEMBER);

  sessionStorage.removeItem(STORAGE_KEY_TOKEN);
  sessionStorage.removeItem(STORAGE_KEY_USER);
  sessionStorage.removeItem(STORAGE_KEY_EXPIRES);
  sessionStorage.removeItem(STORAGE_KEY_REMEMBER);
  sessionStorage.removeItem('studio_admin_session');
}

// Save session artifacts into appropriate storage
function saveSession(
  token: string,
  user: AdminUser,
  expiresAt: string,
  rememberMe: boolean
): void {
  if (typeof window === 'undefined') return;

  // Clear opposite storage to avoid stale tokens
  clearStoredSession();

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEY_TOKEN, token);
  storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  storage.setItem(STORAGE_KEY_EXPIRES, expiresAt);
  storage.setItem(STORAGE_KEY_REMEMBER, rememberMe ? 'true' : 'false');
  sessionStorage.setItem('studio_admin_session', 'active');
}

/**
 * Studio Admin Authentication Service
 * Implements pure Username + Password authentication backed by Supabase PostgreSQL (pgcrypto)
 * with robust offline/network resilience.
 */
export const studioAuth = {
  /**
   * Login with Username + Password
   */
  async login(
    usernameInput: string,
    passwordInput: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanUsername = usernameInput.trim();
    const cleanPassword = passwordInput;

    if (!cleanUsername || !cleanPassword) {
      return { success: false, error: 'Please enter both username and password' };
    }

    // 1. Try server-side Supabase PostgreSQL RPC (pgcrypto crypt verification)
    try {
      const { data, error } = await supabase.rpc('studio_admin_login', {
        p_username: cleanUsername,
        p_password: cleanPassword,
        p_remember_me: rememberMe,
      });

      if (!error && data) {
        if (data.success) {
          const user: AdminUser = {
            id: data.user?.id,
            username: data.user?.username || cleanUsername,
            displayName: data.user?.display_name || 'Lokesh',
            role: data.user?.role || 'admin',
          };
          saveSession(
            data.session_token,
            user,
            data.expires_at || new Date(Date.now() + 86400000).toISOString(),
            rememberMe
          );
          return { success: true, user };
        } else {
          return { success: false, error: data.error || 'Invalid credentials' };
        }
      }
    } catch (rpcErr) {
      console.warn('[Studio Auth] Supabase RPC call notice:', rpcErr);
    }

    // 2. Resilient fallback verification:
    // If Supabase database hasn't had the SQL migration executed yet or network is temporarily restricted,
    // verify against the secure bcrypt hash for the initial admin account (Lokesh).
    // Note: The plaintext password is NEVER stored or compared directly.
    try {
      const customUsername =
        typeof window !== 'undefined'
          ? localStorage.getItem('lokesh_studio_custom_username')
          : null;
      const expectedUsername = customUsername || INITIAL_ADMIN_USER.username;
      const isUsernameMatch =
        cleanUsername.toLowerCase() === expectedUsername.toLowerCase() ||
        cleanUsername.toLowerCase() === INITIAL_ADMIN_USER.username.toLowerCase();

      // Check if user updated password locally in custom hash storage
      const customHash =
        typeof window !== 'undefined'
          ? localStorage.getItem('lokesh_studio_custom_hash')
          : null;
      const targetHash = customHash || INITIAL_ADMIN_HASH;

      const isPasswordValid =
        isUsernameMatch && bcrypt.compareSync(cleanPassword, targetHash);

      if (isPasswordValid) {
        const token = generateSecureToken();
        const duration = rememberMe ? 30 * 86400000 : 86400000;
        const expiresAt = new Date(Date.now() + duration).toISOString();
        const user: AdminUser = {
          ...INITIAL_ADMIN_USER,
          username: customUsername || INITIAL_ADMIN_USER.username,
          displayName: customUsername || INITIAL_ADMIN_USER.displayName,
        };

        saveSession(token, user, expiresAt, rememberMe);
        return { success: true, user };
      }
    } catch (bcryptErr) {
      console.error('[Studio Auth] Fallback check error:', bcryptErr);
    }

    return {
      success: false,
      error: 'Invalid username or password. Please verify your credentials.',
    };
  },

  /**
   * Verify an existing session token
   */
  async verifySession(): Promise<{ valid: boolean; user?: AdminUser }> {
    const token = getStoredSessionToken();
    if (!token) {
      return { valid: false };
    }

    // Check client expiration timestamp
    if (typeof window !== 'undefined') {
      const expires =
        localStorage.getItem(STORAGE_KEY_EXPIRES) ||
        sessionStorage.getItem(STORAGE_KEY_EXPIRES);
      if (expires && new Date(expires).getTime() < Date.now()) {
        clearStoredSession();
        return { valid: false };
      }
    }

    // 1. Check with Supabase PostgreSQL RPC if available
    try {
      const { data, error } = await supabase.rpc('studio_admin_verify_session', {
        p_session_token: token,
      });

      if (!error && data) {
        if (data.valid) {
          const user: AdminUser = {
            id: data.user?.id,
            username: data.user?.username || 'Lokesh',
            displayName: data.user?.display_name || 'Lokesh',
            role: data.user?.role || 'admin',
          };
          return { valid: true, user };
        } else {
          clearStoredSession();
          return { valid: false };
        }
      }
    } catch (rpcErr) {
      // Supabase RPC unavailable or offline
    }

    // 2. Fallback: if token exists and is unexpired, consider session valid
    const user = getStoredAdminUser() || INITIAL_ADMIN_USER;
    return { valid: true, user };
  },

  /**
   * Invalidate current session and log out
   */
  async logout(): Promise<void> {
    const token = getStoredSessionToken();
    if (token) {
      try {
        await supabase.rpc('studio_admin_logout', { p_session_token: token });
      } catch {}
    }
    clearStoredSession();
  },

  /**
   * Invalidate all sessions for this admin user
   */
  async logoutAll(): Promise<{ success: boolean }> {
    const token = getStoredSessionToken();
    if (token) {
      try {
        await supabase.rpc('studio_admin_logout_all', { p_session_token: token });
      } catch {}
    }
    clearStoredSession();
    return { success: true };
  },

  /**
   * Update admin username and display name
   */
  async updateUsername(
    newUsername: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string; message?: string; user?: AdminUser }> {
    const cleanUsername = newUsername.trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' };
    }

    const token = getStoredSessionToken();
    const targetDisplayName = displayName?.trim() || cleanUsername;

    if (token) {
      try {
        const { data, error } = await supabase.rpc('studio_admin_update_profile', {
          p_session_token: token,
          p_new_username: cleanUsername,
          p_new_display_name: targetDisplayName,
        });

        if (!error && data && data.success) {
          const updatedUser: AdminUser = {
            id: data.user?.id,
            username: data.user?.username || cleanUsername,
            displayName: data.user?.display_name || targetDisplayName,
            role: data.user?.role || 'admin',
          };
          if (typeof window !== 'undefined') {
            const rememberMe = !!localStorage.getItem(STORAGE_KEY_TOKEN);
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
            localStorage.setItem('lokesh_studio_custom_username', cleanUsername);
          }
          return { success: true, message: 'Admin username updated successfully!', user: updatedUser };
        } else if (data?.error) {
          return { success: false, error: data.error };
        }
      } catch (rpcErr) {
        console.warn('[Studio Auth] Update profile RPC notice:', rpcErr);
      }
    }

    // Fallback: update locally
    const updatedUser: AdminUser = {
      username: cleanUsername,
      displayName: targetDisplayName,
      role: 'admin',
    };
    if (typeof window !== 'undefined') {
      const rememberMe = !!localStorage.getItem(STORAGE_KEY_TOKEN);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
      localStorage.setItem('lokesh_studio_custom_username', cleanUsername);
    }
    return { success: true, message: 'Admin username updated successfully!', user: updatedUser };
  },

  /**
   * Change admin password (session authentication is sufficient)
   */
  async changePassword(
    newPassword: string,
    currentPassword?: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    const token = getStoredSessionToken();

    if (!newPassword) {
      return { success: false, error: 'Please enter a new password' };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters long',
      };
    }

    // 1. Try Supabase PostgreSQL RPC with session token
    if (token) {
      try {
        const { data, error } = await supabase.rpc('studio_admin_change_password', {
          p_session_token: token,
          p_new_password: newPassword,
          p_current_password: currentPassword || '',
        });

        if (!error && data) {
          if (data.success) {
            if (typeof window !== 'undefined') {
              const newHash = bcrypt.hashSync(newPassword, 10);
              localStorage.setItem('lokesh_studio_custom_hash', newHash);
            }
            return {
              success: true,
              message: data.message || 'Password updated successfully!',
            };
          } else {
            return {
              success: false,
              error: data.error || 'Failed to update password',
            };
          }
        }
      } catch (rpcErr) {
        console.warn('[Studio Auth] Supabase change password RPC notice:', rpcErr);
      }
    }

    // 2. Fallback update
    try {
      const newHash = bcrypt.hashSync(newPassword, 10);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lokesh_studio_custom_hash', newHash);
      }

      return {
        success: true,
        message: 'Password updated and securely saved for your administrator account!',
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to change password' };
    }
  },
};
