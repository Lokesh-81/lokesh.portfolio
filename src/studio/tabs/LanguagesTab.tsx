'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { LanguageItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Languages,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface LanguagesTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function LanguagesTab({ showToast }: LanguagesTabProps) {
  const { languages, saveLanguage, deleteLanguage, reorderLanguages } = usePortfolio();

  const [editingLang, setEditingLang] = useState<Partial<LanguageItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingLang({
      id: `lang-${Date.now()}`,
      name: '',
      code: '',
      nativeName: '',
      proficiency: 'Professional Working',
      sortOrder: languages.length + 1,
    });
  };

  const handleEdit = (lang: LanguageItem) => {
    setEditingLang({ ...lang });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete language "${name}"?`)) return;
    try {
      await deleteLanguage(id);
      showToast('Language deleted', 'success');
      if (editingLang?.id === id) setEditingLang(null);
    } catch (err: any) {
      showToast('Failed to delete language', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= languages.length) return;

    const list = [...languages];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderLanguages(list);
      showToast('Language order updated', 'success');
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLang || !editingLang.name?.trim()) {
      showToast('Language name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveLanguage(editingLang as LanguageItem);
      showToast(`Language "${editingLang.name}" saved!`, 'success');
      setEditingLang(null);
    } catch (err: any) {
      showToast('Failed to save language', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Spoken Languages</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage linguistic capabilities and fluency levels displayed on your profile.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Language</span>
        </button>
      </div>

      {/* Languages List */}
      <div className="space-y-3">
        {languages.map((lang, idx) => (
          <div
            key={lang.id}
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
                  disabled={idx === languages.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 text-[#A78BFA]">
                <Languages className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{lang.name}</h3>
                  {lang.nativeName && (
                    <span className="text-xs text-[#60A5FA]">({lang.nativeName})</span>
                  )}
                  {lang.code && (
                    <span className="rounded bg-[#1F2937] px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8]">
                      {lang.code.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">{lang.proficiency}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleEdit(lang)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
                title="Edit Language"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(lang.id, lang.name)}
                className="p-2 text-[#64748B] hover:text-red-400 cursor-pointer"
                title="Delete Language"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingLang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingLang.id?.startsWith('lang-') ? 'Add Language' : 'Edit Language'}
              </h3>
              <button
                onClick={() => setEditingLang(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Language Name *</label>
                <input
                  type="text"
                  required
                  value={editingLang.name || ''}
                  onChange={(e) => setEditingLang({ ...editingLang, name: e.target.value })}
                  placeholder="Telugu, English, Hindi, French"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Native Name</label>
                  <input
                    type="text"
                    value={editingLang.nativeName || ''}
                    onChange={(e) => setEditingLang({ ...editingLang, nativeName: e.target.value })}
                    placeholder="తెలుగు, Français..."
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Code (2 letters)</label>
                  <input
                    type="text"
                    value={editingLang.code || ''}
                    onChange={(e) => setEditingLang({ ...editingLang, code: e.target.value })}
                    placeholder="en, fr, te, hi"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Fluency Level</label>
                <select
                  value={editingLang.proficiency || 'Professional Working'}
                  onChange={(e) => setEditingLang({ ...editingLang, proficiency: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                >
                  <option value="Native / Bilingual">Native / Bilingual</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Full Professional">Full Professional</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Elementary">Elementary</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingLang(null)}
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
                  <span>Save Language</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
