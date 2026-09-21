'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Save, Plus, Trash2, RefreshCw, Github, ExternalLink } from 'lucide-react';

interface AboutTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function AboutTab({ showToast }: AboutTabProps) {
  const { about, updateAboutState } = usePortfolio();

  const [formData, setFormData] = useState({
    tag: about?.tag || 'WHO I AM',
    title: about?.title || 'Engineering Scalable Systems with',
    titleAccent: about?.titleAccent || 'Precision.',
    verifiedProfiles:
      about?.verifiedProfiles && about.verifiedProfiles.length > 0
        ? [...about.verifiedProfiles]
        : [
            { handle: 'Lokesh-81', url: 'https://github.com/Lokesh-81', label: 'github.com/Lokesh-81' },
            { handle: 'lokeshnaivaidya-max', url: 'https://github.com/lokeshnaivaidya-max', label: 'github.com/lokeshnaivaidya-max' },
          ],
  });

  const [newProfile, setNewProfile] = useState({ handle: '', url: '', label: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.verifiedProfiles];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, verifiedProfiles: updated };
    });
  };

  const handleAddProfile = () => {
    if (!newProfile.url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      verifiedProfiles: [
        ...prev.verifiedProfiles,
        {
          handle: newProfile.handle.trim() || newProfile.label.trim(),
          url: newProfile.url.trim(),
          label: newProfile.label.trim() || newProfile.url.trim().replace(/^https?:\/\//, ''),
        },
      ],
    }));
    setNewProfile({ handle: '', url: '', label: '' });
  };

  const handleRemoveProfile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      verifiedProfiles: prev.verifiedProfiles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAboutState(formData);
      showToast('About section updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save About section', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">About Section Settings</h2>
          <p className="text-xs text-[#94A3B8]">
            Configure headers, section accents, and verified GitHub developer profiles.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? 'Saving...' : 'Save About Settings'}</span>
        </button>
      </div>

      {/* Headings */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Section Headings</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Section Tag</label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="WHO I AM"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Title Text</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Engineering Scalable Systems with"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Title Accent (Italic styled word)</label>
            <input
              type="text"
              name="titleAccent"
              value={formData.titleAccent}
              onChange={handleChange}
              placeholder="Precision."
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Verified Profiles */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#E0E7FF]">Verified GitHub & Developer Profiles</h3>
          <p className="text-xs text-[#94A3B8]">
            Both of your verified developer profiles displayed on the public about section.
          </p>
        </div>

        <div className="space-y-3">
          {formData.verifiedProfiles.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 rounded-xl border border-[#1F2937] bg-[#0B132B] p-3"
            >
              <div className="flex items-center gap-2 text-[#A5B4FC]">
                <Github className="h-4 w-4" />
                <span className="text-[11px] font-mono text-[#64748B]">#{idx + 1}</span>
              </div>
              <input
                type="text"
                value={p.label || ''}
                onChange={(e) => handleProfileChange(idx, 'label', e.target.value)}
                placeholder="Display Label"
                className="flex-1 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
              <input
                type="text"
                value={p.url}
                onChange={(e) => handleProfileChange(idx, 'url', e.target.value)}
                placeholder="https://github.com/..."
                className="flex-1 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveProfile(idx)}
                className="p-1.5 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Remove profile"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new profile */}
        <div className="pt-2 border-t border-[#1F2937]">
          <h4 className="text-xs font-medium text-[#CBD5E1] mb-2">Add Another Verified Profile</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newProfile.label}
              onChange={(e) => setNewProfile((p) => ({ ...p, label: e.target.value }))}
              placeholder="Display label (e.g. github.com/username)"
              className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
            />
            <input
              type="text"
              value={newProfile.url}
              onChange={(e) => setNewProfile((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://github.com/username"
              className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddProfile}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2 text-xs font-medium text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Save About Settings</span>
        </button>
      </div>
    </form>
  );
}
