'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { SocialLinkItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Share2,
  ExternalLink,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface SocialLinksTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function SocialLinksTab({ showToast }: SocialLinksTabProps) {
  const { socialLinks, saveSocialLink, deleteSocialLink, reorderSocialLinks } = usePortfolio();

  const [editingSocial, setEditingSocial] = useState<Partial<SocialLinkItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingSocial({
      id: `social-${Date.now()}`,
      platform: 'GitHub',
      url: '',
      username: '',
      active: true,
      sortOrder: socialLinks.length + 1,
    });
  };

  const handleEdit = (link: SocialLinkItem) => {
    setEditingSocial({ ...link });
  };

  const handleDelete = async (id: string, platform: string) => {
    if (!window.confirm(`Delete link for "${platform}"?`)) return;
    try {
      await deleteSocialLink(id);
      showToast('Social link deleted', 'success');
      if (editingSocial?.id === id) setEditingSocial(null);
    } catch (err: any) {
      showToast('Failed to delete social link', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const list = [...socialLinks];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderSocialLinks(list);
      showToast('Link order updated', 'success');
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial || !editingSocial.platform?.trim() || !editingSocial.url?.trim()) {
      showToast('Platform and URL are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveSocialLink(editingSocial as SocialLinkItem);
      showToast(`Link for "${editingSocial.platform}" saved!`, 'success');
      setEditingSocial(null);
    } catch (err: any) {
      showToast('Failed to save social link', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Social & Profile Links</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage links to GitHub, LinkedIn, Instagram, email, and social networks rendered in footer and headers.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Social Link</span>
        </button>
      </div>

      {/* Social Links List */}
      <div className="space-y-3">
        {socialLinks.map((link, idx) => (
          <div
            key={link.id}
            className="flex items-center justify-between rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 hover:border-[#60A5FA]/40 transition-all shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              {/* Order buttons */}
              <div className="flex flex-col gap-1 text-[#64748B]">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === socialLinks.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#60A5FA]">
                <Share2 className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{link.platform}</h3>
                  {link.username && (
                    <span className="text-xs text-[#94A3B8]">({link.username})</span>
                  )}
                  {link.active !== false ? (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#1F2937] text-[#64748B] px-2 py-0.5 text-[10px] font-medium">
                      Hidden
                    </span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#60A5FA] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span className="truncate max-w-sm">{link.url}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleEdit(link)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
                title="Edit Link"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(link.id, link.platform)}
                className="p-2 text-[#64748B] hover:text-red-400 cursor-pointer"
                title="Delete Link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingSocial.id?.startsWith('social-') ? 'Add Social Link' : 'Edit Social Link'}
              </h3>
              <button
                onClick={() => setEditingSocial(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Platform Name *</label>
                <input
                  type="text"
                  required
                  value={editingSocial.platform || ''}
                  onChange={(e) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                  placeholder="GitHub, LinkedIn, Instagram, X..."
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Full URL *</label>
                <input
                  type="text"
                  required
                  value={editingSocial.url || ''}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Username / Handle</label>
                <input
                  type="text"
                  value={editingSocial.username || ''}
                  onChange={(e) => setEditingSocial({ ...editingSocial, username: e.target.value })}
                  placeholder="@handle or username"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={editingSocial.active !== false}
                    onChange={(e) => setEditingSocial({ ...editingSocial, active: e.target.checked })}
                    className="rounded border-[#1F2937] bg-[#0B132B] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Display on portfolio</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:bg-[#1F2937] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
