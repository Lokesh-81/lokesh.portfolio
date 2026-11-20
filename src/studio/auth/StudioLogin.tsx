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
    if (!cleanUsername || !password) {
      setErrorMessage('Please enter both your administrator username and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginStudioAdmin(cleanUsername, password, rememberMe);
      if (res.success) {
        setSuccessMessage('Authentication verified. Launching Studio...');
        setTimeout(onSuccess, 350);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please check your username and password.');
      }
    } catch (err: any) {
      console.error('[Studio Auth Error]', err);
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NightSceneBacklit
        background="#100B18"
        blossomColor="#E8B8D2"
        speed={65}
        petals={105}
        wind={24}
        scale={100}
        glow={42}
        direction="right"
        style={{ position: 'fixed', inset: 0, zIndex: 0, minWidth: 0, minHeight: 0 }}
      />
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-4 py-12 text-[#F5EAF5]">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={onExit} className="inline-flex items-center gap-2 text-xs font-medium text-[#D9B6D0]/85 transition-colors hover:text-[#F5DCEB]">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Portfolio</span>
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Private Studio
            </span>
          </div>

          <section className="rounded-3xl border border-[#76556D]/60 bg-[#211923]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <header className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8B8D2]/40 bg-[#E8B8D2]/10 text-[#E8B8D2]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[#F5EAF5]">Lokesh Portfolio Studio</h1>
              <p className="mt-2 text-xs leading-relaxed text-[#C3AEBF]">Sign in with your administrator credentials to manage your portfolio.</p>
            </header>

            {errorMessage && (
              <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3.5 text-xs text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                <div><p className="font-semibold">Sign-in failed</p><p className="mt-0.5">{errorMessage}</p></div>
              </div>
            )}
            {successMessage && (
              <div role="status" className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="studio-username" className="mb-1.5 block text-xs font-medium text-[#E6D7E2]">Administrator Username</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B39BAF]" />
                  <input id="studio-username" type="text" required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full rounded-xl border border-[#634D60] bg-[#100B18]/85 py-3 pl-10 pr-4 text-sm text-[#F5EAF5] outline-none transition focus:border-[#E8B8D2] focus:ring-1 focus:ring-[#E8B8D2] placeholder:text-[#806C7B]" />
                </div>
              </div>

              <div>
                <label htmlFor="studio-password" className="mb-1.5 block text-xs font-medium text-[#E6D7E2]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B39BAF]" />
                  <input id="studio-password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-[#634D60] bg-[#100B18]/85 py-3 pl-10 pr-11 font-mono text-sm text-[#F5EAF5] outline-none transition focus:border-[#E8B8D2] focus:ring-1 focus:ring-[#E8B8D2] placeholder:text-[#806C7B]" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B39BAF] transition hover:text-[#F5EAF5]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer select-none items-center gap-2 pt-1 text-xs text-[#C3AEBF]">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-[#634D60] bg-[#100B18] text-[#E8B8D2] focus:ring-[#E8B8D2] focus:ring-offset-0" />
                Remember me
              </label>

              <button type="submit" disabled={loading} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] px-6 py-3 text-sm font-semibold text-[#211923] shadow-lg shadow-[#A77BC2]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#211923] border-t-transparent" />Verifying credentials...</> : <>Sign In to Studio<ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <footer className="mt-7 border-t border-[#76556D]/50 pt-4 text-center text-[11px] text-[#B39BAF]">
              Private administrator access
            </footer>
          </section>
        </div>
      </main>
    </>
  );
}
