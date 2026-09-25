'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { TestimonialItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Quote,
  Star,
  ExternalLink,
  X,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TestimonialsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function TestimonialsTab({ showToast }: TestimonialsTabProps) {
  const { testimonials, saveTestimonial, deleteTestimonial, reorderTestimonials } = usePortfolio();

  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenNew = () => {
    setEditingItem({
      id: `test-${Date.now()}`,
      name: '',
      role: 'Client / Business Owner',
      company: '',
      testimonial: '',
      projectUrl: '',
      rating: 5,
      isPublished: true,
      displayOrder: (testimonials?.length || 0) + 1,
    });
  };

  const handleEdit = (item: TestimonialItem) => {
    setEditingItem({ ...item });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"?`)) return;
    try {
      await deleteTestimonial(id);
      showToast('Testimonial removed', 'success');
      if (editingItem?.id === id) setEditingItem(null);
    } catch {
      showToast('Failed to delete testimonial', 'error');
    }
  };

  const handleTogglePublish = async (item: TestimonialItem) => {
    const updated: TestimonialItem = {
      ...item,
      isPublished: !item.isPublished,
    };
    try {
      await saveTestimonial(updated);
      showToast(`Testimonial ${updated.isPublished ? 'published' : 'hidden'}`, 'success');
    } catch {
      showToast('Failed to update publication status', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const list = [...testimonials];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    try {
      await reorderTestimonials(list);
      showToast('Testimonial order updated', 'success');
    } catch {
      showToast('Failed to reorder', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name?.trim() || !editingItem.testimonial?.trim()) {
      showToast('Client name and testimonial quote are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveTestimonial(editingItem as TestimonialItem);
      showToast(`Testimonial from "${editingItem.name}" saved!`, 'success');
      setEditingItem(null);
    } catch {
      showToast('Failed to save testimonial', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Client Testimonials & Endorsements</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage client reviews and feedback. Real-time synchronized with Supabase database.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="space-y-3">
        {(!testimonials || testimonials.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-[#1F2937] p-8 text-center text-xs text-[#64748B]">
            No testimonials recorded yet. Click &quot;Add Testimonial&quot; to create one.
          </div>
        ) : (
          testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#1F2937] bg-[#0F172A]/70 p-4 transition-all hover:border-[#38BDF8]/40 hover:bg-[#0F172A]"
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E293B] text-[#38BDF8] border border-[#334155]/60">
                  <Quote className="h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-[#F1F5F9] truncate">{t.name}</h4>
                    {t.company && (
                      <span className="rounded-full bg-[#1E293B] px-2.5 py-0.5 text-[10px] font-medium text-[#94A3B8] border border-[#334155]/50">
                        {t.company}
                      </span>
                    )}
                    {t.role && (
                      <span className="text-xs text-[#64748B]">· {t.role}</span>
                    )}
                    {t.isPublished !== false ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-800/40">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/60 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-800/40">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94A3B8] italic line-clamp-2">
                    &ldquo;{t.testimonial}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    {t.rating ? (
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    ) : null}
                    {t.projectUrl && (
                      <a
                        href={t.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#38BDF8] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleTogglePublish(t)}
                  title={t.isPublished ? 'Hide from public view' : 'Publish to live website'}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E0E7FF] hover:bg-[#1E293B] transition-colors"
                >
                  {t.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E0E7FF] hover:bg-[#1E293B] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === testimonials.length - 1}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E0E7FF] hover:bg-[#1E293B] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(t)}
                  className="p-1.5 rounded-lg text-[#38BDF8] hover:bg-[#1E293B] transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#1F2937] bg-[#0B0F17] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {testimonials.some((x) => x.id === editingItem.id) ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#64748B] hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94A3B8] font-medium">Client / Reviewer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Foundarly Business World Owner"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94A3B8] font-medium">Company / Organization</label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Foundarly Business World"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#94A3B8] font-medium">Role / Title</label>
                  <input
                    type="text"
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Founder & Business Owner"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#94A3B8] font-medium">Project Website URL</label>
                  <input
                    type="url"
                    value={editingItem.projectUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, projectUrl: e.target.value })}
                    placeholder="https://www.foundarlybusinessworld.in/"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#94A3B8] font-medium">Testimonial Quote / Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={editingItem.testimonial || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, testimonial: e.target.value })}
                  placeholder="Super fast execution and very satisfying results every single time! Lokesh is highly reliable..."
                  className="w-full rounded-xl border border-[#1F2937] bg-[#111827] p-3 text-[#F1F5F9] focus:border-[#38BDF8] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-[#94A3B8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="rounded border-[#1F2937] bg-[#111827] text-[#2563EB] focus:ring-0"
                  />
                  <span>Publish to live portfolio</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:bg-[#1E293B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save Testimonial'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
