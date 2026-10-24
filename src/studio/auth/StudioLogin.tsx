'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { studioAuth } from '@/lib/studio-auth';
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, KeyRound, Mail, RefreshCw } from 'lucide-react';

interface StudioLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export function StudioLogin({ onSuccess, onExit }: StudioLoginProps) {
  const { loginStudioAdmin } = usePortfolio();

  const [username, setUsername] = useState('Lokesh');
  const [password, setPassword] = useState('lokesh81*');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password Recovery / OTP State
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'email' | 'otp'>('email');
  const [recoveryEmail, setRecoveryEmail] = useState('poosala15@gmail.com');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorMessage('Please enter your administrator username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginStudioAdmin(cleanUsername, password, rememberMe);

      if (res.success) {
        setSuccessMessage('Authentication verified. Launching Studio...');
        setTimeout(() => {
          onSuccess();
        }, 350);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      console.error('[Studio Auth Error]', err);
      setErrorMessage(
        err?.message || 'Authentication error. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);
    setRecoveryLoading(true);

    try {
      const res = await studioAuth.requestPasswordResetOtp(recoveryEmail);
      if (res.success) {
        setRecoverySuccess(res.message || 'Verification code sent to your email.');
        setRecoveryStep('otp');
      } else {
        setRecoveryError(res.error || 'Failed to request verification code.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'Failed to request verification code.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    if (newPassword.length < 6) {
      setRecoveryError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError('Passwords do not match. Please re-enter.');
      return;
    }

    setRecoveryLoading(true);

    try {
      const res = await studioAuth.verifyPasswordResetOtpAndSetPassword(recoveryEmail, recoveryOtp, newPassword);
      if (res.success) {
        setRecoverySuccess('Password successfully reset! Launching Studio...');
        setTimeout(() => {
          onSuccess();
          window.location.reload();
        }, 1200);
      } else {
        setRecoveryError(res.error || 'Invalid verification code.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'Failed to reset password.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B132B] px-4 py-12 text-[#E0E7FF] overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Portfolio link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A5B4FC]/80 hover:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </button>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Private Studio Auth
          </span>
        </div>

        {/* Login or Recovery Card */}
        <div className="relative rounded-3xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-[#2563EB]/25 to-transparent pointer-events-none" />

          {!isRecoveryMode ? (
            <>
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2563EB]/40 bg-[#2563EB]/20 text-[#60A5FA] shadow-[0_0_24px_rgba(37,99,235,0.3)]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#E0E7FF]">
                  Lokesh Portfolio Studio
                </h1>
                <p className="mt-2 text-xs text-[#94A3B8]">
                  Sign in with your private administrator credentials to manage portfolio content.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono">
                  <KeyRound className="h-3 w-3 text-emerald-400" />
                  <span>Password: <strong>lokesh81*</strong></span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-200">Authentication Failed</p>
                    <p className="mt-0.5 text-[11px] text-red-300/90">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                    Administrator Username
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Lokesh"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#CBD5E1]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecoveryMode(true);
                        setRecoveryStep('email');
                        setRecoveryError(null);
                        setRecoverySuccess(null);
                      }}
                      className="text-[11px] text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-10 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] focus:outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#60A5FA]" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-[#1F2937] bg-[#0B132B] text-[#2563EB] focus:ring-[#60A5FA] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-[#94A3B8] hover:text-[#CBD5E1] transition-colors">
                      Remember me / Save credentials
                    </span>
                  </label>

                  <span className="text-[11px] text-[#64748B]">
                    30-day session
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Verifying Credentials...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Studio</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* ================================================================ */
            /* PASSWORD RECOVERY & EMAIL OTP FLOW                               */
            /* ================================================================ */
            <div>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400">
                  <KeyRound className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">
                  Verified Account Recovery
                </h2>
                <p className="mt-2 text-xs text-[#94A3B8]">
                  Reset administrator credentials using verified email ownership.
                </p>
              </div>

              {recoveryError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{recoverySuccess}</span>
                </div>
              )}

              {recoveryStep === 'email' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                      Registered Owner Email
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="poosala15@gmail.com"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-1.5">
                      Must match verified owner account (<code>poosala15@gmail.com</code>).
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRecoveryMode(false)}
                      className="w-1/2 py-2.5 px-4 rounded-xl border border-[#1F2937] bg-[#0B132B] hover:bg-[#111827] text-xs font-medium text-[#A5B4FC]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md"
                    >
                      {recoveryLoading ? 'Dispatching...' : 'Send OTP Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                      6-Digit Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2.5 text-center text-lg font-mono tracking-widest text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                      New Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New secure password"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2 text-sm font-mono text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 px-4 py-2 text-sm font-mono text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryStep('email')}
                      className="w-1/3 py-2.5 px-3 rounded-xl border border-[#1F2937] bg-[#0B132B] text-xs font-medium text-[#A5B4FC]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md"
                    >
                      {recoveryLoading ? 'Verifying...' : 'Verify OTP & Reset'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Security footnote */}
          <div className="mt-8 border-t border-[#1F2937]/70 pt-4 text-center">
            <p className="text-[11px] text-[#64748B]">
              Secured with bcrypt password hashing & cryptographically signed session tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
