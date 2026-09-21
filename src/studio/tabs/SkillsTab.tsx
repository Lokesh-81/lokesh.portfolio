'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { TechnologyItem } from '@/lib/portfolio-types';
import { Plus, Edit2, Trash2, Cpu, Search, X, Save, RefreshCw } from 'lucide-react';

interface SkillsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const CATEGORIES = [
  'Core & Languages',
  'Frontend & UI',
  'Backend & Cloud Services',
  'Databases & State',
  'AI, Frameworks & Architecture',
  'DevOps & Tooling',
];

export function SkillsTab({ showToast }: SkillsTabProps) {
  const { technologies, saveTechnology, deleteTechnology } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTech, setEditingTech] = useState<Partial<TechnologyItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() || tech.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenNew = () => {
    setEditingTech({
      id: `tech-${Date.now()}`,
      name: '',
      category: selectedCategory === 'All' ? 'Frontend & UI' : selectedCategory,
      level: 'Core',
      icon: '',
      sortOrder: technologies.length + 1,
    });
  };

  const handleEdit = (t: TechnologyItem) => {
    setEditingTech({ ...t });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteTechnology(id);
      showToast('Skill deleted', 'success');
      if (editingTech?.id === id) setEditingTech(null);
    } catch (err: any) {
      showToast('Failed to delete skill', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTech || !editingTech.name?.trim()) {
      showToast('Skill name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveTechnology(editingTech as TechnologyItem);
      showToast(`Skill "${editingTech.name}" saved!`, 'success');
      setEditingTech(null);
    } catch (err: any) {
      showToast('Failed to save skill', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Tech Stack & Skills</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage languages, frameworks, cloud platforms, databases, and tooling displayed across your interactive tech grid.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#2563EB] text-white'
                : 'bg-[#111827] text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#E0E7FF]'
            }`}
          >
            All ({technologies.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = technologies.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-[#111827] text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#E0E7FF]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-60">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#64748B]">
            <Search className="h-3.5 w-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] pl-9 pr-3 py-1.5 text-xs text-[#E0E7FF] placeholder-[#475569] focus:border-[#60A5FA] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Skills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filteredTechnologies.map((tech) => (
          <div
            key={tech.id}
            className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827]/70 p-3 hover:border-[#60A5FA]/40 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#60A5FA]">
                <Cpu className="h-3.5 w-3.5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-[#E0E7FF] truncate">{tech.name}</p>
                <span className="text-[10px] text-[#64748B] block truncate">{tech.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => handleEdit(tech)}
                className="p-1 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tech.id, tech.name)}
                className="p-1 text-[#64748B] hover:text-red-400 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1F2937] p-8 text-center text-xs text-[#64748B]">
          No skills found matching the criteria.
        </div>
      )}

      {/* Edit / New Modal */}
      {editingTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingTech.id?.startsWith('tech-') ? 'Add New Skill' : 'Edit Skill'}
              </h3>
              <button
                onClick={() => setEditingTech(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Skill / Technology Name *</label>
                <input
                  type="text"
                  required
                  value={editingTech.name || ''}
                  onChange={(e) => setEditingTech({ ...editingTech, name: e.target.value })}
                  placeholder="e.g. Next.js, Supabase, TypeScript"
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Category</label>
                <select
                  value={editingTech.category || 'Frontend & UI'}
                  onChange={(e) => setEditingTech({ ...editingTech, category: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Proficiency Level</label>
                <select
                  value={editingTech.level || 'Core'}
                  onChange={(e) => setEditingTech({ ...editingTech, level: e.target.value as any })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                >
                  <option value="Core">Core / Primary</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingTech(null)}
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
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
