'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Save, Plus, Trash2, RefreshCw, Sparkles, Award } from 'lucide-react';

interface HeroTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function HeroTab({ showToast }: HeroTabProps) {
  const { hero, updateHeroState } = usePortfolio();

  const [formData, setFormData] = useState({
    greeting: hero?.greeting || 'Hello, I am',
    name: hero?.name || 'Poosala Lokesh.',
    imA: hero?.imA || "I'm a",
    bio: hero?.bio || '',
    ctaWork: hero?.ctaWork || 'Selected Works',
    ctaContact: hero?.ctaContact || 'Get in Touch',
    showAvailability: hero?.showAvailability !== false,
    featuredCredentialTitle: hero?.featuredCredentialTitle || 'Google Cloud Certified Professional Cloud Architect',
    featuredCredentialDate: hero?.featuredCredentialDate || 'Sep 2026',
    featuredCredentialLink: hero?.featuredCredentialLink || 'certifications',
    rotatingWords: hero?.rotatingWords && hero.rotatingWords.length > 0 ? [...hero.rotatingWords] : [
      'Full Stack Developer',
      'Google Cloud Architect',
      'AI Engineer',
      'Creative Problem Solver',
    ],
  });

  const [newWord, setNewWord] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRotatingWord = () => {
    if (!newWord.trim()) return;
    setFormData((prev) => ({
      ...prev,
      rotatingWords: [...prev.rotatingWords, newWord.trim()],
    }));
    setNewWord('');
  };

  const handleRemoveRotatingWord = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rotatingWords: prev.rotatingWords.filter((_, i) => i !== index),
    }));
  };

  const handleWordChange = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.rotatingWords];
      updated[index] = val;
      return { ...prev, rotatingWords: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateHeroState(formData);
      showToast('Hero section updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save Hero section', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Hero Section</h2>
          <p className="text-xs text-[#94A3B8]">
            Customize the landing greeting, rotating role loop, credential pill, and primary action buttons.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Hero Settings'}</span>
        </button>
      </div>

      {/* Main Headline & Greeting */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Headlines & Greeting</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Top Greeting Tag</label>
            <input
              type="text"
              name="greeting"
              value={formData.greeting}
              onChange={handleChange}
              placeholder="Hello, I am"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Hero Name Display</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Poosala Lokesh."
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Lead Bio Paragraph</label>
          <textarea
            rows={3}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Rotating Roles / Words Loop */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#E0E7FF]">Rotating Role Loop (TextLoop)</h3>
            <p className="text-xs text-[#94A3B8]">
              Words that rotate dynamically on the hero screen.
            </p>
          </div>
          <div className="w-48">
            <label className="block text-[11px] text-[#94A3B8] mb-1">Prefix Text</label>
            <input
              type="text"
              name="imA"
              value={formData.imA}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>

        {/* Existing Words */}
        <div className="space-y-2">
          {formData.rotatingWords.map((word, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#64748B] w-6">{idx + 1}.</span>
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(idx, e.target.value)}
                className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveRotatingWord(idx)}
                className="p-2 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Remove word"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Word */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRotatingWord())}
            placeholder="Add new role title..."
            className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddRotatingWord}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2 text-xs font-medium text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Featured Credential Badge Pill */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-[#FBBF24]" />
            <h3 className="text-sm font-semibold text-[#E0E7FF]">Featured Credential Pill</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#CBD5E1]">
            <input
              type="checkbox"
              name="showAvailability"
              checked={formData.showAvailability}
              onChange={handleChange}
              className="rounded border-[#1F2937] bg-[#0B132B] text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span>Show Pill in Hero</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Credential Badge Title</label>
            <input
              type="text"
              name="featuredCredentialTitle"
              value={formData.featuredCredentialTitle}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Badge Date / Tag</label>
            <input
              type="text"
              name="featuredCredentialDate"
              value={formData.featuredCredentialDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Target Navigation Section</label>
            <input
              type="text"
              name="featuredCredentialLink"
              value={formData.featuredCredentialLink}
              onChange={handleChange}
              placeholder="certifications"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Call-to-Action Buttons</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Primary CTA Button Label</label>
            <input
              type="text"
              name="ctaWork"
              value={formData.ctaWork}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Secondary CTA Button Label</label>
            <input
              type="text"
              name="ctaContact"
              value={formData.ctaContact}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
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
          <span>Save Hero Settings</span>
        </button>
      </div>
    </form>
  );
}
