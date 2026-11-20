'use client';

import React, { useState } from 'react';
import NightSceneBacklit from '@/components/core/night-scene-backlit';
import { usePortfolio } from '@/lib/portfolio-context';
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StudioLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export function StudioLogin({ onSuccess, onExit }: StudioLoginProps) {
  const { loginStudioAdmin } = usePortfolio();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  return (
    <>
    <NightSceneBacklit background="#100B18" blossomColor="#E8B8D2" speed={65} petals={105} wind={24} scale={100} glow={42} direction="right" style={{ position: 'fixed', inset: 0, zIndex: 0, minWidth: 0, minHeight: 0 }} />
    <div className="relative z-10 min-h-screen w-full flex items-center justify-center bg-transparent px-4 py-12 text-[#F5EAF5] overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        {/* Back to Portfolio link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#D9B6D0]/85 hover:text-[#F5DCEB] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </button>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Private Studio Auth
          </span>
        </div>

        {/* Username and password sign-in only */}
        <div className="relative rounded-3xl border border-[#76556D]/60 bg-[#211923]/88 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-[#E8B8D2]/25 to-transparent pointer-events-none" />

          <>

            <>
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8B8D2]/40 bg-[#E8B8D2]/10 text-[#E8B8D2] shadow-[0_0_24px_rgba(232,184,210,0.18)]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#F5EAF5]">
                  Lokesh Portfolio Studio
                </h1>
                <p className="mt-2 text-xs text-[#C3AEBF]">
                  Sign in with your private administrator credentials to manage portfolio content.
                </p>
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
                  <label className="block text-xs font-medium text-[#E6D7E2] mb-1.5">
                    Administrator Username
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#B39BAF]">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Lokesh"
                      className="w-full rounded-xl border border-[#634D60] bg-[#100B18]/80 pl-10 pr-4 py-2.5 text-sm text-[#F5EAF5] placeholder-[#806C7B] focus:border-[#E8B8D2] focus:ring-1 focus:ring-[#E8B8D2] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-[#E6D7E2]">
                      Password
                    </label>
n>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#B39BAF]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-[#634D60] bg-[#100B18]/80 pl-10 pr-10 py-2.5 text-sm text-[#F5EAF5] placeholder-[#806C7B] focus:border-[#E8B8D2] focus:ring-1 focus:ring-[#E8B8D2] focus:outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#B39BAF] hover:text-[#E6D7E2] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-[#E8B8D2]" />}
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
                      className="h-4 w-4 rounded border-[#634D60] bg-[#0B132B] text-[#2563EB] focus:ring-[#60A5FA] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-[#94A3B8] hover:text-[#E6D7E2] transition-colors">
                      Remember me / Save credentials
                    </span>
                  </label>

                  <span className="text-[11px] text-[#B39BAF]">
                    30-day session
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(167,123,194,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Verifying Credentials...
                      </span>
                    </>

          {/* Security footnote */}
          <div className="mt-8 border-t border-[#76556D]/50 pt-4 text-center">
            <p className="text-[11px] text-[#B39BAF]">
              Secured with bcrypt password hashing & cryptographically signed session tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
