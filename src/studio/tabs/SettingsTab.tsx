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
  Upload,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function SettingsTab({ showToast }: SettingsTabProps) {
  const portfolio = usePortfolio();
  const { settings, updateSettingsState, isSupabaseConnected, syncFromSupabase } = portfolio;

  const [formData, setFormData] = useState({
    title: settings?.title || 'Poosala Lokesh | Full Stack Developer & AI Engineer',
    description:
      settings?.description ||
      'Portfolio of Poosala Lokesh – Full Stack Developer, Generative AI Engineer, and Google Cloud Certified Professional Cloud Architect.',
    keywords:
      settings?.keywords ||
      'Poosala Lokesh, Full Stack Developer, Next.js, React, Supabase, Google Cloud, AI Engineer, Hyderabad',
    canonicalUrl: settings?.canonicalUrl || 'https://lokesh-portfolio.dev',
    emailNotifications: settings?.emailNotifications ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbHealth, setDbHealth] = useState<any>(null);

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

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      setDbHealth(res);
      if (res.connected) {
        showToast('Supabase PostgreSQL connected successfully!', 'success');
      } else {
        showToast(`Connection issue: ${res.error}`, 'error');
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
            Configure metadata, search engine crawl tags, database synchronization, and backup exports.
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
              placeholder="https://lokesh-portfolio.dev"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Database & Cloud State */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-[#60A5FA]" />
            <h3 className="text-sm font-semibold text-[#E0E7FF]">Supabase Cloud Database</h3>
          </div>
          <button
            type="button"
            onClick={handleTestDatabase}
            disabled={isTestingDb}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#CBD5E1] hover:text-[#60A5FA] cursor-pointer"
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
            {dbHealth.error && <p className="text-red-400">Error: {dbHealth.error}</p>}
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
