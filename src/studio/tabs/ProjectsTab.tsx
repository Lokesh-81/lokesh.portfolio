'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import type { ProjectItem } from '@/lib/portfolio-types';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Github,
  Upload,
  CheckCircle2,
  X,
  Save,
  RefreshCw,
  FolderGit2,
  Star,
} from 'lucide-react';

interface ProjectsTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ProjectsTab({ showToast }: ProjectsTabProps) {
  const { projects, saveProject, deleteProject, reorderProjects } = usePortfolio();

  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  const handleOpenNew = () => {
    setEditingProject({
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      role: 'Full Stack Architect & Lead Developer',
      category: 'Full Stack Applications',
      status: 'Live',
      liveUrl: '',
      githubUrl: '',
      technologies: [],
      keyHighlights: [],
      featured: false,
      sortOrder: projects.length + 1,
    });
    setTechInput('');
    setHighlightInput('');
  };

  const handleEdit = (p: ProjectItem) => {
    setEditingProject({ ...p });
    setTechInput('');
    setHighlightInput('');
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) return;
    try {
      await deleteProject(id);
      showToast('Project deleted successfully', 'success');
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
    } catch (err: any) {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const [moved] = newProjects.splice(index, 1);
    newProjects.splice(targetIndex, 0, moved);

    try {
      await reorderProjects(newProjects);
      showToast('Project order updated', 'success');
    } catch (err: any) {
      showToast('Failed to update project order', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'projects');
      setEditingProject((prev) => ({ ...prev!, imageUrl: res.url }));
      showToast('Project preview image uploaded!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingProject) return;
    const current = editingProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingProject({ ...editingProject, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      technologies: (editingProject.technologies || []).filter((t) => t !== tech),
    });
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim() || !editingProject) return;
    const current = editingProject.keyHighlights || [];
    setEditingProject({ ...editingProject, keyHighlights: [...current, highlightInput.trim()] });
    setHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      keyHighlights: (editingProject.keyHighlights || []).filter((_, i) => i !== idx),
    });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title?.trim()) {
      showToast('Please provide a project title', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await saveProject(editingProject as ProjectItem);
      showToast(`Project "${editingProject.title}" saved!`, 'success');
      setEditingProject(null);
    } catch (err: any) {
      showToast('Failed to save project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Portfolio Projects</h2>
          <p className="text-xs text-[#94A3B8]">
            Manage featured software systems, clinical platforms, repositories, and live deployment links.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 hover:border-[#60A5FA]/40 transition-all shadow-xs"
          >
            <div className="flex items-start sm:items-center gap-3">
              {/* Reorder Buttons */}
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
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="hover:text-[#60A5FA] disabled:opacity-20 cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B132B]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FolderGit2 className="h-5 w-5 text-[#60A5FA]" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{project.title}</h3>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 text-amber-400 px-2 py-0.5 text-[10px] font-medium">
                      <Star className="h-3 w-3 fill-amber-400" /> Featured
                    </span>
                  )}
                  <span className="rounded-full bg-[#2563EB]/20 text-[#60A5FA] px-2 py-0.5 text-[10px] font-medium">
                    {project.status || 'Live'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#94A3B8] line-clamp-1">{project.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {project.technologies?.slice(0, 4).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[10px] text-[#A5B4FC]/70 font-mono">
                      #{tech}
                    </span>
                  ))}
                  {(project.technologies?.length || 0) > 4 && (
                    <span className="text-[10px] text-[#64748B]">
                      +{(project.technologies?.length || 0) - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#64748B] hover:text-[#60A5FA] transition-colors"
                  title="Visit Live Site"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-[#64748B] hover:text-[#E0E7FF] transition-colors"
                  title="View Repository"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => handleEdit(project)}
                className="p-2 text-[#64748B] hover:text-[#60A5FA] transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id, project.title || project.name || 'Project')}
                className="p-2 text-[#64748B] hover:text-red-400 transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <h3 className="text-base font-bold text-[#E0E7FF]">
                {editingProject.id?.startsWith('project-') ? 'Create New Project' : 'Edit Project'}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Category</label>
                  <select
                    value={editingProject.category || 'Full Stack Applications'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  >
                    <option value="Enterprise Web Platforms">Enterprise Web Platforms</option>
                    <option value="Full Stack Applications">Full Stack Applications</option>
                    <option value="Cloud Infrastructure & AI Tools">Cloud Infrastructure & AI Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Status</label>
                  <select
                    value={editingProject.status || 'Live'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  >
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="In Development">In Development</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Role Title</label>
                  <input
                    type="text"
                    value={editingProject.role || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    placeholder="Full Stack Architect"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Live URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">GitHub Repo URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Project Preview Image</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] cursor-pointer transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <input
                    type="text"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    placeholder="Or paste image URL"
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              {/* Technologies Tagging */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Tech Stack Badges</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(editingProject.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB]/20 text-[#60A5FA] px-2 py-1 text-xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    placeholder="e.g. Next.js, Supabase, Tailwind CSS"
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#60A5FA] hover:bg-[#1F2937] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">Key Feature Highlights</label>
                <div className="space-y-1.5 mb-2">
                  {(editingProject.keyHighlights || []).map((h, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-[#0B132B] px-3 py-1.5 text-xs text-[#CBD5E1]">
                      <span className="truncate">{h}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
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
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                    placeholder="e.g. Built automated OTP verification system..."
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#60A5FA] hover:bg-[#1F2937] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Featured toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#CBD5E1]">
                  <input
                    type="checkbox"
                    checked={editingProject.featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-[#1F2937] bg-[#0B132B] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Feature on Hero / Highlights</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
