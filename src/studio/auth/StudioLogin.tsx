'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlowEffect } from '@/components/core/glow-effect';
import { Spotlight } from '@/components/core/spotlight';

interface StudioLoginProps {
  onSuccess: () => void;
  onExit: () => void;
}

export function StudioLogin({ onSuccess, onExit }: StudioLoginProps) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('lokesharcade@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSuccessMessage('Authentication successful. Opening Studio...');
        setTimeout(() => {
          onSuccess();
        }, 400);
      }
    } catch (err: any) {
      console.error('[Auth Error]', err);
      setErrorMessage(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#/studio`,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Password reset email sent! Check your inbox for instructions.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0B132B] px-4 py-12 text-[#E0E7FF] overflow-hidden">
      {/* Dynamic Ambient Spotlights */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.25)_0%,rgba(192,132,252,0.15)_40%,transparent_70%)] blur-3xl pointer-events-none"
        size={600}
      />

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
          <span className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider">
            Private Admin
          </span>
        </div>

        {/* Login Card */}
        <div className="relative rounded-3xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {/* Subtle Glow */}
          <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-[#2563EB]/20 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2563EB]/40 bg-[#2563EB]/20 text-[#60A5FA] shadow-[0_0_24px_rgba(37,99,235,0.3)]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#E0E7FF]">
              Lokesh Portfolio Studio
            </h1>
            <p className="mt-2 text-xs text-[#94A3B8]">
              {mode === 'login'
                ? 'Sign in with your administrative credentials to manage portfolio content.'
                : 'Enter your administrator email to receive a password recovery link.'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lokesharcade@gmail.com"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#CBD5E1]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#60A5FA] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-10 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Authenticating...
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
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#64748B]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lokesharcade@gmail.com"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B]/80 pl-10 pr-4 py-2.5 text-sm text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-1/2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:bg-[#1F2937] transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          )}

          {/* Security footnote */}
          <div className="mt-8 border-t border-[#1F2937]/70 pt-4 text-center">
            <p className="text-[11px] text-[#64748B]">
              Protected with Supabase Auth RBAC & JWT encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
