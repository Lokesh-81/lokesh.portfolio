'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { ExperienceItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Calendar,
  MapPin,
  Briefcase,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

interface ExperienceTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ExperienceTab({ showToast }: ExperienceTabProps) {
  const { experiences, saveExperience, deleteExperience, reorderExperiences } = usePortfolio();

  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [respInput, setRespInput] = useState('');

  const handleOpenNew = () => {
    setEditingExp({
      id: `exp-${Date.now()}`,
      role: '',
      company: '',
      period: '2026',
      location: 'Remote',
      description: '',
      responsibilities: [],
      sortOrder: experiences.length + 1,
    });
    setRespInput('');
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingExp({ ...exp });
    setRespInput('');
  };

  const handleDelete = async (id: string, role: string) => {
    if (!window.confirm(`Delete experience entry "${role}"?`)) return;
    try {
      await deleteExperience(id);
      showToast('Experience deleted', 'success');
      if (editingExp?.id === id) setEditingExp(null);
    } catch (err: any) {
      showToast('Failed to delete experience', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const list = [...experiences];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderExperiences(list);
      showToast('Experience order updated', 'success');
    } catch (err: any) {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleAddResp = () => {
    if (!respInput.trim() || !editingExp) return;
    const current = editingExp.responsibilities || [];
    setEditingExp({ ...editingExp, responsibilities: [...current, respInput.trim()] });
    setRespInput('');
  };

  const handleRemoveResp = (idx: number) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      responsibilities: (editingExp.responsibilities || []).filter((_, i) => i !== idx),
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.role?.trim() || !editingExp.company?.trim()) {
      showToast('Role and Company are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveExperience(editingExp as ExperienceItem);
      showToast(`Experience at ${editingExp.company} saved!`, 'success');
      setEditingExp(null);
    } catch (err: any) {
      showToast('Failed to save experience', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Work & Leadership Experience</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage professional roles, internships, student ambassador programs, and key responsibilities.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 hover:border-[#60A5FA]/40 transition-all shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              {/* Order buttons */}
              <div className="flex flex-col gap-1 text-[#64748B] pt-0.5">
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
                  disabled={idx === experiences.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C084FC]/10 border border-[#C084FC]/20 text-[#C084FC]">
                <Briefcase className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{exp.role}</h3>
                  <span className="text-xs font-medium text-[#60A5FA]">@ {exp.company}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#64748B]" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#64748B]" />
                    {exp.location}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#CBD5E1] leading-relaxed">{exp.description}</p>
                <ul className="mt-2 space-y-1">
                  {exp.responsibilities?.slice(0, 3).map((r, rIdx) => (
                    <li key={rIdx} className="text-[11px] text-[#94A3B8] flex items-start gap-1.5">
                      <span className="text-[#60A5FA] mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                  {(exp.responsibilities?.length || 0) > 3 && (
                    <li className="text-[10px] text-[#64748B] pl-3">
                      +{(exp.responsibilities?.length || 0) - 3} more responsibilities
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 self-end sm:self-start">
              <button
                type="button"
                onClick={() => handleEdit(exp)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] transition-colors cursor-pointer"
                title="Edit Experience"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(exp.id, exp.role)}
                className="p-2 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingExp.id?.startsWith('exp-') ? 'Add New Experience' : 'Edit Experience'}
              </h3>
              <button
                onClick={() => setEditingExp(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    placeholder="Web Development Intern"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    placeholder="BELVO"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Period (e.g. Jun 2026 – Sep 2026)</label>
                  <input
                    type="text"
                    value={editingExp.period || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    placeholder="Remote / Hyderabad"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Key Responsibilities / Deliverables</label>
                <div className="space-y-1.5 mb-2">
                  {(editingExp.responsibilities || []).map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-[#0B132B] px-3 py-1.5 text-xs text-[#CBD5E1]">
                      <span className="truncate">{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResp(i)}
                        className="text-[#64748B] hover:text-red-400 cursor-pointer ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResp())}
                    placeholder="Add specific responsibility bullet..."
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddResp}
                    className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#60A5FA] hover:bg-[#1F2937] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Letter of Recommendation (LOR) Section */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id="hasLorCheckbox"
                      type="checkbox"
                      checked={editingExp.lor?.hasLor ?? (editingExp.id === 'belvo')}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingExp({
                          ...editingExp,
                          lor: {
                            ...(editingExp.lor || {
                              title: 'Letter of Recommendation (LOR)',
                              issuer: editingExp.company || 'Company',
                              issuedBy: 'Hrishikesh Mishra',
                              role: 'CEO',
                              date: '22-09-2026',
                              phone: '+918928466820',
                              email: 'contact.belvo@gmail.com',
                              location: editingExp.location || 'Mumbai',
                              skillsVerified: [],
                              pdfUrl: '/belvo-lor.pdf',
                              vectorUrl: '/belvo-lor-page.svg',
                            }),
                            hasLor: checked,
                          },
                        });
                      }}
                      className="rounded border-[#1F2937] text-purple-600 focus:ring-0"
                    />
                    <label htmlFor="hasLorCheckbox" className="text-xs font-semibold text-purple-200 cursor-pointer">
                      Official Letter of Recommendation (LOR)
                    </label>
                  </div>
                  {editingExp.lor?.hasLor && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                      Attached
                    </span>
                  )}
                </div>

                {editingExp.lor?.hasLor && (
                  <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-purple-500/20">
                    <div>
                      <label className="block text-[11px] text-[#CBD5E1] mb-1">Issuer / Signatory Name</label>
                      <input
                        type="text"
                        value={editingExp.lor?.issuedBy || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            lor: { ...(editingExp.lor as any), issuedBy: e.target.value },
                          })
                        }
                        placeholder="e.g. Hrishikesh Mishra"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#CBD5E1] mb-1">Signatory Title / Role</label>
                      <input
                        type="text"
                        value={editingExp.lor?.role || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            lor: { ...(editingExp.lor as any), role: e.target.value },
                          })
                        }
                        placeholder="e.g. CEO, Belvo"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#CBD5E1] mb-1">Issue Date</label>
                      <input
                        type="text"
                        value={editingExp.lor?.date || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            lor: { ...(editingExp.lor as any), date: e.target.value },
                          })
                        }
                        placeholder="22-09-2026"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#CBD5E1] mb-1">Document PDF URL</label>
                      <input
                        type="text"
                        value={editingExp.lor?.pdfUrl || ''}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            lor: { ...(editingExp.lor as any), pdfUrl: e.target.value },
                          })
                        }
                        placeholder="/belvo-lor.pdf"
                        className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] font-mono focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
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
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
