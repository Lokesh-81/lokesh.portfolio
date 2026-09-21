'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import type { ResumeItem } from '@/lib/portfolio-types';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Star,
  Download,
  Eye,
  X,
  Database,
  ShieldCheck,
} from 'lucide-react';

interface ResumeTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ResumeTab({ showToast }: ResumeTabProps) {
  const { resumes, activeResume, saveResume, setActiveResumeVersion, deleteResume } = usePortfolio();

  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [showPolicyGuide, setShowPolicyGuide] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a PDF document for your resume', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'resume');
      const newResume: ResumeItem = {
        id: `resume-${Date.now()}`,
        title: file.name,
        url: res.url,
        version: `v${(resumes.length + 1).toFixed(1)}`,
        uploadedAt: new Date().toISOString(),
        isActive: resumes.length === 0, // auto-activate if first
      };
      await saveResume(newResume);
      showToast('New resume PDF uploaded and saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Resume upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetActive = async (id: string, title: string) => {
    try {
      await setActiveResumeVersion(id);
      showToast(`"${title}" is now the active public resume!`, 'success');
    } catch (err: any) {
      showToast('Failed to set active resume', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete resume "${title}"?`)) return;
    try {
      await deleteResume(id);
      showToast('Resume version deleted', 'success');
    } catch (err: any) {
      showToast('Failed to delete resume', 'error');
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Resume link copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyStoragePolicySql = () => {
    const sql = `-- Supabase Storage Bucket & RLS Policy for Resumes and Media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to portfolio files
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

-- Allow authenticated/admin insert
CREATE POLICY "Admin Insert Media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

-- Allow authenticated/admin update and delete
CREATE POLICY "Admin Update Media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin Delete Media"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');`;

    navigator.clipboard.writeText(sql);
    showToast('Storage Policy SQL copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">Resume Management</h2>
          <p className="text-xs text-[#94A3B8]">
            Upload new PDF revisions, preview live documents, and dynamically switch the active resume.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPolicyGuide(!showPolicyGuide)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-medium text-[#A5B4FC] hover:border-[#60A5FA] transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#60A5FA]" />
            <span>Storage Policy</span>
          </button>
          <label className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>{isUploading ? 'Uploading PDF...' : 'Upload New Resume PDF'}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Storage Policy Guide Drawer (Collapsible) */}
      {showPolicyGuide && (
        <div className="rounded-2xl border border-[#3B82F6]/40 bg-[#0B132B]/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#60A5FA]">
              <Database className="h-4 w-4" />
              <span>Supabase Storage Bucket & Policies</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPolicyGuide(false)}
              className="text-[#64748B] hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            The studio uploads PDFs directly to Supabase Storage bucket <code className="text-[#60A5FA] bg-[#111827] px-1 py-0.5 rounded font-mono">portfolio-media</code>.
            If public downloads or uploads ever return 403 or Failed to Fetch, execute the SQL below in your Supabase SQL Editor.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyStoragePolicySql}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E293B] border border-[#334155] px-3 py-1.5 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Storage Policy SQL</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Resume Showcase Card */}
      <div className="rounded-2xl border border-[#2563EB]/40 bg-gradient-to-r from-[#2563EB]/15 to-[#0B132B] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB]/30 text-[#60A5FA]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  Currently Live Resume
                </span>
                {activeResume?.version && (
                  <span className="text-[10px] font-mono text-[#A5B4FC]">
                    {activeResume.version}
                  </span>
                )}
              </div>
              <h3 className="mt-1 text-sm font-bold text-[#E0E7FF]">
                {activeResume?.title || 'Poosala_Lokesh_Resume_2026.pdf'}
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono truncate max-w-md mt-0.5">
                {activeResume?.url || '/resume.pdf'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeResume?.url && (
              <>
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(activeResume.url)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>Preview PDF</span>
                </button>
                <a
                  href={activeResume.url}
                  download={activeResume.title || 'Poosala_Lokesh_Resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(activeResume.url, 'active')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#E0E7FF] cursor-pointer"
                  title="Copy link"
                >
                  {copiedId === 'active' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resume Version History List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#E0E7FF]">All Resume Versions</h3>

        {resumes.map((r) => {
          const isCurrentActive = r.isActive;
          const uploadDate = r.uploadedAt || (r as any).createdAt || (r as any).created_at;
          const displayDate = uploadDate ? new Date(uploadDate).toLocaleDateString() : 'Recent';

          return (
            <div
              key={r.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                isCurrentActive
                  ? 'border-[#2563EB]/60 bg-[#111827]/90'
                  : 'border-[#1F2937] bg-[#111827]/60 hover:border-[#60A5FA]/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isCurrentActive
                      ? 'bg-[#2563EB]/20 text-[#60A5FA]'
                      : 'bg-[#1F2937] text-[#64748B]'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#E0E7FF]">{r.title}</h4>
                    {isCurrentActive ? (
                      <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetActive(r.id, r.title)}
                        className="rounded-full bg-[#1F2937] hover:bg-[#2563EB]/30 hover:text-[#60A5FA] text-[#94A3B8] px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                    <span>Uploaded: {displayDate}</span>
                    {r.version && <span>• {r.version}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(r.url)}
                  className="p-1.5 text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
                  title="Preview PDF"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <a
                  href={r.url}
                  download={r.title || 'Poosala_Lokesh_Resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-[#64748B] hover:text-[#60A5FA]"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(r.url, r.id)}
                  className="p-1.5 text-[#64748B] hover:text-[#CBD5E1] cursor-pointer"
                  title="Copy link"
                >
                  {copiedId === r.id ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  disabled={isCurrentActive && resumes.length > 1}
                  onClick={() => handleDelete(r.id, r.title)}
                  className="p-1.5 text-[#64748B] hover:text-red-400 disabled:opacity-20 cursor-pointer"
                  title={isCurrentActive ? 'Cannot delete the active resume' : 'Delete resume version'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded PDF Preview Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative flex flex-col w-full max-w-5xl h-[85vh] rounded-2xl border border-[#1F2937] bg-[#0B132B] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1F2937] px-6 py-3 bg-[#111827]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#60A5FA]" />
                <span className="text-xs font-semibold text-[#E0E7FF]">Resume Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  download="Poosala_Lokesh_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#0B132B] px-3 py-1 text-xs text-[#CBD5E1] hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#0B132B] px-3 py-1 text-xs text-[#CBD5E1] hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open in New Tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewPdfUrl(null)}
                  className="rounded-lg p-1 text-[#64748B] hover:text-white hover:bg-[#1F2937] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-[#111827]">
              <iframe
                src={previewPdfUrl}
                title="Resume Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
