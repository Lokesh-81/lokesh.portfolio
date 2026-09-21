'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { EducationItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  GraduationCap,
  Calendar,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface EducationTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function EducationTab({ showToast }: EducationTabProps) {
  const { educations, saveEducation, deleteEducation, reorderEducation } = usePortfolio();

  const [editingEdu, setEditingEdu] = useState<Partial<EducationItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingEdu({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      period: '2024 – 2027',
      grade: '',
      description: '',
      sortOrder: educations.length + 1,
    });
  };

  const handleEdit = (edu: EducationItem) => {
    setEditingEdu({ ...edu });
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!window.confirm(`Delete education record "${degree}"?`)) return;
    try {
      await deleteEducation(id);
      showToast('Education deleted', 'success');
      if (editingEdu?.id === id) setEditingEdu(null);
    } catch (err: any) {
      showToast('Failed to delete education', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= educations.length) return;

    const list = [...educations];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderEducation(list);
      showToast('Education order updated', 'success');
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu || !editingEdu.degree?.trim() || !editingEdu.institution?.trim()) {
      showToast('Degree and Institution are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveEducation(editingEdu as EducationItem);
      showToast(`Education record saved!`, 'success');
      setEditingEdu(null);
    } catch (err: any) {
      showToast('Failed to save education', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Academic Education</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage degrees, colleges, graduation timelines, and coursework.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education List */}
      <div className="space-y-3">
        {educations.map((edu, idx) => (
          <div
            key={edu.id}
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
                  disabled={idx === educations.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F472B6]/10 border border-[#F472B6]/20 text-[#F472B6]">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#E0E7FF]">{edu.degree}</h3>
                <p className="text-xs text-[#60A5FA]">{edu.institution}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#64748B]" />
                    {edu.period}
                  </span>
                  {edu.grade && <span>• Grade/CGPA: {edu.grade}</span>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleEdit(edu)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] transition-colors cursor-pointer"
                title="Edit Education"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(edu.id, edu.degree)}
                className="p-2 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingEdu.id?.startsWith('edu-') ? 'Add Education' : 'Edit Education'}
              </h3>
              <button
                onClick={() => setEditingEdu(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Degree / Program *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="B.Sc. in Mathematics, Statistics & Computer Science"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Institution / College *</label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  placeholder="Bhavan's Vivekananda College"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Timeline</label>
                  <input
                    type="text"
                    value={editingEdu.period || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    placeholder="2024 – 2027"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Grade / CGPA</label>
                  <input
                    type="text"
                    value={editingEdu.grade || ''}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder="e.g. 9.2 CGPA"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Description / Coursework</label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ''}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
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
                  <span>Save Education</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
