'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Save, RefreshCw, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ContactTab({ showToast }: ContactTabProps) {
  const { contact, updateContactState } = usePortfolio();

  const [formData, setFormData] = useState({
    tag: contact?.tag || 'GET IN TOUCH',
    title: contact?.title || 'Let’s Build Something',
    titleAccent: contact?.titleAccent || 'Together.',
    subtitle:
      contact?.subtitle ||
      'Always open to discussing full-stack engineering, cloud architecture, generative AI innovations, or high-impact software engineering opportunities.',
    email: contact?.email || 'poosala15@gmail.com',
    phone: contact?.phone || '+91 8885674172',
    location: contact?.location || 'Hyderabad, India',
    responseTime: contact?.responseTime || 'Typically responds within 24 hours',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContactState(formData);
      showToast('Contact settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save contact settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Contact Section & Channels</h2>
          <p className="text-xs text-[#94A3B8]">
            Configure headers, contact email, phone, location, and inquiry response parameters.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
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
              placeholder="GET IN TOUCH"
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
              placeholder="Let’s Build Something"
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Title Accent (Italic Accent Word)</label>
            <input
              type="text"
              name="titleAccent"
              value={formData.titleAccent}
              onChange={handleChange}
              placeholder="Together."
              className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Subtitle / Pitch Paragraph</label>
          <textarea
            rows={3}
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">Direct Communication Channels</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Inquiry Receiving Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="poosala15@gmail.com"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Phone / WhatsApp</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 8885674172"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Location</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                <MapPin className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hyderabad, India"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">Expected Response Time</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
                <Clock className="h-4 w-4" />
              </div>
              <input
                type="text"
                name="responseTime"
                value={formData.responseTime}
                onChange={handleChange}
                placeholder="Typically responds within 24 hours"
                className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
              />
            </div>
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
          <span>Save Contact Settings</span>
        </button>
      </div>
    </form>
  );
}
