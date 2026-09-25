'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { testSupabaseConnection } from '@/lib/supabase';
import {
  Save,
  RefreshCw,
  Database,
  Globe,
  Shield,
  Download,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  User,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

interface SettingsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function SettingsTab({ showToast }: SettingsTabProps) {
  const portfolio = usePortfolio();
  const {
    settings,
    updateSettingsState,
    isSupabaseConnected,
    syncFromSupabase,
    adminUser,
    changeAdminPassword,
    logoutAllAdminSessions,
    logoutStudioAdmin,
  } = portfolio;

  const [formData, setFormData] = useState({
    title: settings?.title || 'Poosala Lokesh | Full Stack Developer & AI Engineer',
    description:
      settings?.description ||
      'Portfolio of Poosala Lokesh – Full Stack Developer, Generative AI Engineer, and Google Cloud Certified Professional Cloud Architect.',
    keywords:
      settings?.keywords ||
      'Poosala Lokesh, Full Stack Developer, Next.js, React, Supabase, Google Cloud, AI Engineer, Hyderabad',
    canonicalUrl: settings?.canonicalUrl || '',
    emailNotifications: settings?.emailNotifications ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbHealth, setDbHealth] = useState<any>(null);

  // Security / Admin Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettingsState(formData);
      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter a new password.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({
        type: 'error',
        message: 'New password must be at least 6 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        message: 'New passwords do not match. Please verify and retry.',
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await changeAdminPassword(newPassword);
      if (res.success) {
        setPasswordStatus({
          type: 'success',
          message: res.message || 'Password successfully updated!',
        });
        showToast('Admin password updated successfully!', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({
          type: 'error',
          message: res.error || 'Failed to update password.',
        });
        showToast(res.error || 'Password update failed', 'error');
      }
    } catch (err: any) {
      setPasswordStatus({
        type: 'error',
        message: err?.message || 'Unexpected error occurred while changing password.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    if (
      window.confirm(
        'Are you sure you want to invalidate all active administrator sessions across all devices?'
      )
    ) {
      await logoutAllAdminSessions();
      showToast('All administrator sessions have been revoked.');
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      setDbHealth(res);
      if (res.connected) {
        showToast('Supabase PostgreSQL connected successfully!', 'success');
      } else {
        showToast(`Connection diagnostic: ${res.error}`, 'error');
      }
    } catch (err: any) {
      showToast('Failed to reach Supabase', 'error');
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleExportBackup = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      profile: portfolio.profile,
      hero: portfolio.hero,
      about: portfolio.about,
      projects: portfolio.projects,
      experiences: portfolio.experiences,
      educations: portfolio.educations,
      technologies: portfolio.technologies,
      certifications: portfolio.certifications,
      skillBadges: portfolio.skillBadges,
      achievements: portfolio.achievements,
      languages: portfolio.languages,
      socialLinks: portfolio.socialLinks,
      contact: portfolio.contact,
      resumes: portfolio.resumes,
      settings: portfolio.settings,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lokesh-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full portfolio backup JSON exported!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Portfolio Settings & SEO</h2>
          <p className="text-xs text-[#94A3B8]">
            Configure administrative security, search engine crawl tags, database synchronization, and backup exports.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* ADMIN ACCOUNT & SECURITY */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#60A5FA]" />
            <h3 className="text-sm font-semibold text-[#E0E7FF]">Admin Account & Security</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Username/Password Auth
          </span>
        </div>

        {/* Current Account Profile Card */}
        <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-[#1F2937] bg-[#0B132B] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#64748B] uppercase tracking-wider font-semibold">
                Administrator Username
              </p>
              <p className="text-sm font-bold text-[#E0E7FF]">
                {adminUser?.username || 'Lokesh'}
              </p>
              <span className="inline-block mt-0.5 rounded-md bg-[#2563EB]/20 px-2 py-0.5 text-[10px] font-semibold text-[#60A5FA]">
                Full Studio Access (Role: {adminUser?.role || 'admin'})
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center sm:border-l sm:border-[#1F2937] sm:pl-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Auth Mechanism:</span>
              <span className="font-mono text-[#E0E7FF]">bcrypt + pgcrypto</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Session Security:</span>
              <span className="font-mono text-emerald-400">Cryptographic Token</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1F2937]">
              <button
                type="button"
                onClick={handleLogoutAll}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Revoke All Active Sessions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Sub-card */}
        <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#60A5FA]" />
            <h4 className="text-xs font-semibold text-[#E0E7FF] uppercase tracking-wider">
              Change Studio Password
            </h4>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Update the administrator password. The new password will be hashed with bcrypt in the PostgreSQL database.
          </p>

          {passwordStatus && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                passwordStatus.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-red-500/30 bg-red-500/10 text-red-300'
              }`}
            >
              {passwordStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] pl-9 pr-10 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] pl-9 pr-10 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isUpdatingPassword ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SEO & Meta Tags */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#60A5FA]" />
          <h3 className="text-sm font-semibold text-[#E0E7FF]">Search Engine Optimization (SEO)</h3>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Page Title (&lt;title&gt;)</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Poosala Lokesh | Full Stack Developer & AI Engineer"
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Meta Description</label>
          <textarea
            rows={2}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">SEO Keywords (comma separated)</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Canonical URL</label>
            <input
              type="text"
              name="canonicalUrl"
              value={formData.canonicalUrl}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Database & Persistence */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#60A5FA]" />
            <h3 className="text-sm font-semibold text-[#E0E7FF]">Supabase PostgreSQL Connection</h3>
          </div>
          <button
            type="button"
            onClick={handleTestDatabase}
            disabled={isTestingDb}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer disabled:opacity-50"
          >
            {isTestingDb ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
            <span>Test Connection</span>
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] p-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <div>
              <p className="text-xs font-semibold text-[#E0E7FF]">
                {isSupabaseConnected ? 'Supabase PostgreSQL Online' : 'Local Storage Cache Active'}
              </p>
              <p className="text-[11px] text-[#64748B]">
                Endpoint: https://xkkwfrwamvictgrhepgg.supabase.co
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              syncFromSupabase();
              showToast('Sync triggered with Supabase!', 'success');
            }}
            className="text-xs text-[#60A5FA] hover:underline cursor-pointer"
          >
            Force Sync
          </button>
        </div>

        {dbHealth && (
          <div className="rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#CBD5E1]">
            <p className="font-semibold text-[#E0E7FF] mb-1">Health Check Results:</p>
            <p>Connected: {dbHealth.connected ? 'Yes' : 'No'}</p>
            {dbHealth.profileCount !== undefined && (
              <p>Profiles in database: {dbHealth.profileCount}</p>
            )}
            {dbHealth.diagnostic && <p className="text-amber-300 mt-1">{dbHealth.diagnostic}</p>}
            {dbHealth.error && <p className="text-red-400 mt-0.5">Error: {dbHealth.error}</p>}
          </div>
        )}
      </div>

      {/* Backup & Export */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#60A5FA]" />
          <h3 className="text-sm font-semibold text-[#E0E7FF]">Data Backup & Export</h3>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Export a complete single JSON snapshot containing all profile details, projects, skills, certificates, and media records.
        </p>

        <div>
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-semibold text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] cursor-pointer transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Full Portfolio JSON Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
