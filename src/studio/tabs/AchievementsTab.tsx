'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { AchievementItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Trophy,
  Calendar,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface AchievementsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function AchievementsTab({ showToast }: AchievementsTabProps) {
  const { achievements, saveAchievement, deleteAchievement, reorderAchievements } = usePortfolio();

  const [editingAch, setEditingAch] = useState<Partial<AchievementItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingAch({
      id: `ach-${Date.now()}`,
      title: '',
      subtitle: '',
      year: '2025',
      category: 'Community & Leadership',
      description: '',
      sortOrder: achievements.length + 1,
    });
  };

  const handleEdit = (ach: AchievementItem) => {
    setEditingAch({ ...ach });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete achievement "${title}"?`)) return;
    try {
      await deleteAchievement(id);
      showToast('Achievement deleted', 'success');
      if (editingAch?.id === id) setEditingAch(null);
    } catch (err: any) {
      showToast('Failed to delete achievement', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= achievements.length) return;

    const list = [...achievements];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderAchievements(list);
      showToast('Achievement order updated', 'success');
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch || !editingAch.title?.trim()) {
      showToast('Achievement title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveAchievement(editingAch as AchievementItem);
      showToast(`Achievement "${editingAch.title}" saved!`, 'success');
      setEditingAch(null);
    } catch (err: any) {
      showToast('Failed to save achievement', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Honors & Achievements</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage student ambassadorships, competitive hackathon recognitions, and community accolades.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Achievement</span>
        </button>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {achievements.map((ach, idx) => (
          <div
            key={ach.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 hover:border-[#60A5FA]/40 transition-all shadow-xs"
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
                  disabled={idx === achievements.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399]">
                <Trophy className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{ach.title}</h3>
                  <span className="rounded-full bg-[#34D399]/20 text-[#34D399] px-2 py-0.5 text-[10px] font-medium">
                    {ach.year}
                  </span>
                </div>
                {ach.subtitle && <p className="text-xs text-[#60A5FA] mt-0.5">{ach.subtitle}</p>}
                {ach.description && <p className="text-[11px] text-[#94A3B8] mt-1">{ach.description}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleEdit(ach)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] transition-colors cursor-pointer"
                title="Edit Achievement"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(ach.id, ach.title)}
                className="p-2 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Achievement"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingAch.id?.startsWith('ach-') ? 'Add Achievement' : 'Edit Achievement'}
              </h3>
              <button
                onClick={() => setEditingAch(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={editingAch.title || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="Google Student Ambassador"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingAch.subtitle || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, subtitle: e.target.value })}
                    placeholder="Selected into Ambassador Cohort 2025"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Year</label>
                  <input
                    type="text"
                    value={editingAch.year || ''}
                    onChange={(e) => setEditingAch({ ...editingAch, year: e.target.value })}
                    placeholder="2025"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Category</label>
                <input
                  type="text"
                  value={editingAch.category || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value })}
                  placeholder="Community & Leadership"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAch.description || ''}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingAch(null)}
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
                  <span>Save Achievement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
