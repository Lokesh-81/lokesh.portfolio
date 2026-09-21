'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import { Save, Upload, User, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ProfileTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ProfileTab({ showToast }: ProfileTabProps) {
  const { profile, updateProfileState } = usePortfolio();

  const [formData, setFormData] = useState({
    name: profile?.name || 'Poosala Lokesh',
    displayName: profile?.displayName || 'Poosala Lokesh',
    title: profile?.title || 'Full Stack Developer / AI Enthusiast',
    location: profile?.location || 'Hyderabad, India',
    education: profile?.education || 'B.Sc. MSCS · 2027',
    graduationYear: profile?.graduationYear || '2027',
    recognition: profile?.recognition || 'Google Cloud Certified Professional Cloud Architect',
    email: profile?.email || 'poosala15@gmail.com',
    phone: profile?.phone || '+91 8885674172',
    availability: profile?.availability || 'Available for Summer 2026 Internships & High-Impact Roles',
    shortBio: profile?.shortBio || '',
    aboutDescription: profile?.aboutDescription || '',
    aboutSubDescription: profile?.aboutSubDescription || '',
    photoUrl: profile?.photoUrl || '',
    heroImage: profile?.heroImage || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'photoUrl' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'profile');
      setFormData((prev) => ({ ...prev, [field]: res.url }));
      showToast(`${field === 'photoUrl' ? 'Profile photo' : 'Hero banner'} uploaded!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfileState(formData);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save profile changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Personal Profile</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage your personal identity, bio, contact details, and credentials displayed across the portfolio.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Avatar & Photo Card */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Profile & Visual Assets</h3>
        <p className="text-xs text-[#94A3B8]">
          Upload an authentic photo. If no photo is uploaded, your personalized placeholder badge will be used safely.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
          {/* Avatar Preview */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2563EB]/40 bg-[#0B132B]">
            {formData.photoUrl ? (
              <img
                src={formData.photoUrl}
                alt="Profile Preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2">
                <User className="h-8 w-8 text-[#60A5FA]" />
                <span className="text-[9px] font-mono text-[#64748B] mt-1">PL Badge</span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <label className="block text-xs font-medium text-[#CBD5E1]">Profile Photo (Supabase Storage)</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] cursor-pointer transition-all">
                <Upload className="h-3.5 w-3.5" />
                <span>{isUploading ? 'Uploading to Supabase...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'photoUrl')}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {formData.photoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, photoUrl: '' }))}
                  className="text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Remove & Use Placeholder
                </button>
              )}
            </div>
            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Or paste public image URL..."
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Basic Identity Information */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Core Identity</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Full Legal Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Professional Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Phone / WhatsApp</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Education Line (e.g. B.Sc. MSCS · 2027)</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Key Recognition</label>
            <input
              type="text"
              name="recognition"
              value={formData.recognition}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Current Availability Status</label>
          <input
            type="text"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="Available for Summer 2026 Internships & High-Impact Roles"
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Bio & Narratives */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Bio & Narratives</h3>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">About Description (Lead intro)</label>
          <textarea
            rows={3}
            name="aboutDescription"
            value={formData.aboutDescription}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">About Sub-Description (Technical lifecycle)</label>
          <textarea
            rows={3}
            name="aboutSubDescription"
            value={formData.aboutSubDescription}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
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
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
}
