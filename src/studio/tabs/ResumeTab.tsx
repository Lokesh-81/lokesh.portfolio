'use client';

import React, { useState, useRef } from 'react';
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
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
} from 'lucide-react';

interface ResumeTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export function ResumeTab({ showToast }: ResumeTabProps) {
  const {
    profile,
    experiences,
    skills,
    projects,
    certifications,
    educations,
    resumes,
    activeResume,
    saveResume,
    setActiveResumeVersion,
    deleteResume,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'lor' | 'uploads'>('sheet');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewModalDoc, setPreviewModalDoc] = useState<{
    title: string;
    pdfUrl: string;
    vectorUrl?: string;
  } | null>(null);
  const [showPolicyGuide, setShowPolicyGuide] = useState(false);

  // Resume plain-text generation for job portals
  const generatePlainTextResume = () => {
    const lines = [
      `${profile.name || 'Poosala Lokesh'}`,
      `${profile.title || 'Full Stack Engineer & Cloud Developer'}`,
      `Email: ${profile.email || 'poosala15@gmail.com'} | Location: ${profile.location || 'Telangana, India'}`,
      `GitHub: https://github.com/Lokesh-81 | LinkedIn: https://linkedin.com/in/poosala-lokesh`,
      '',
      '=== PROFESSIONAL SUMMARY ===',
      profile.bio ||
        profile.aboutDescription ||
        'Results-driven Full Stack Engineer and Google Cloud Certified Professional with expertise in React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments.',
      '',
      '=== WORK EXPERIENCE ===',
      ...experiences.map(
        (exp) =>
          `• ${exp.role} at ${exp.company} (${exp.period} | ${exp.location})\n  ${
            exp.description || ''
          }\n  ${(exp.responsibilities || []).map((r) => `  - ${r}`).join('\n')}`
      ),
      '',
      '=== TECHNICAL SKILLS ===',
      skills.map((s) => `• ${s.category}: ${s.name}`).join('\n'),
      '',
      '=== CERTIFICATIONS ===',
      ...certifications.map((c) => `• ${c.title} — ${c.issuer} (${c.issueDate || ''})`),
      '',
      '=== EDUCATION ===',
      ...educations.map(
        (e) => `• ${e.degree} — ${e.institution} (${e.period || e.endYear || ''}) | ${e.location || ''}`
      ),
    ];
    return lines.join('\n');
  };

  const handleCopyResumeText = () => {
    const text = generatePlainTextResume();
    navigator.clipboard.writeText(text);
    setCopiedId('resume-text');
    showToast('Formatted resume text copied for ATS / job portals!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyLorText = () => {
    const lorText = `BELVO COMPANY
Date: 22-09-2026

Poosala Lokesh
Web Developer Intern
Belvo Company
Goregaon, Mumbai

Dear Poosala Lokesh,
It is my pleasure to recommend you for successfully completing a 3-month internship as a Web Developer at Belvo.
During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities...

Hrishikesh Mishra
CEO, Belvo`;
    navigator.clipboard.writeText(lorText);
    setCopiedId('lor-text');
    showToast('Belvo recommendation letter copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

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
        isActive: resumes.length === 0,
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
    } catch {
      showToast('Failed to set active resume', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete resume "${title}"?`)) return;
    try {
      await deleteResume(id);
      showToast('Resume version deleted', 'success');
    } catch {
      showToast('Failed to delete resume', 'error');
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Document link copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">
              Documents &amp; Resume Studio
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" />
              Unblocked Native View
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Interactive ATS Resume Sheet, official recommendation letters (Belvo LOR), and download manager.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] p-1 text-xs">
          <button
            onClick={() => setActiveSubTab('sheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'sheet'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#E0E7FF]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Live Resume Sheet</span>
          </button>
          <button
            onClick={() => setActiveSubTab('lor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'lor'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#E0E7FF]'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Belvo LOR Letter</span>
          </button>
          <button
            onClick={() => setActiveSubTab('uploads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'uploads'
                ? 'bg-[#1F2937] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#E0E7FF]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>PDF Uploads ({resumes.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE RESUME SHEET */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-[#1F2937] bg-[#0B132B]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#E0E7FF] flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-[#60A5FA]" />
                ATS-Optimized Live Document
              </span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-[#1F2937]" />
              <span className="text-[11px] text-[#94A3B8] hidden sm:inline">
                Synced with your portfolio profile, experience, skills, and certifications
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] px-1 py-0.5 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                  className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-[#CBD5E1] min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                  className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Print Document */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
                title="Print this sheet or save as PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>

              {/* Copy Plain Text for ATS */}
              <button
                onClick={handleCopyResumeText}
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
                title="Copy structured text for job portals"
              >
                {copiedId === 'resume-text' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Text</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {/* Open in Standalone Tab */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
                title="Open PDF file in a new standalone browser tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </a>

              {/* Download Official PDF */}
              <a
                href="/resume.pdf"
                download="Poosala_Lokesh_Resume.pdf"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Download the official PDF file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {/* Interactive Document Sheet Surface (Clean Native Vector - Immune to Chrome iframe blocks) */}
          <div className="w-full overflow-x-auto rounded-3xl border border-[#1F2937] bg-[#070B18] p-4 sm:p-8 flex justify-center items-start min-h-[780px] custom-scrollbar">
            <div
              className="w-full flex justify-center transition-all duration-150 ease-out"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <div className="max-w-[760px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <img
                  src="/resume-page.svg"
                  alt="Poosala Lokesh - Professional Resume"
                  className="w-full h-auto object-contain select-text"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BELVO LOR LETTER */}
      {activeSubTab === 'lor' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-[#1F2937] bg-[#0B132B]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#E0E7FF] flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-400" />
                Belvo Company — Letter of Recommendation
              </span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-[#1F2937]" />
              <span className="text-[11px] text-[#A5B4FC]/80 hidden sm:inline">
                Issued 22-09-2026 by Hrishikesh Mishra (CEO, Belvo)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] px-1 py-0.5 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                  className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] text-[#CBD5E1] min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                  className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Print Document */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                title="Print this letter"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print</span>
              </button>

              {/* Copy Letter Text */}
              <button
                onClick={handleCopyLorText}
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                title="Copy LOR content"
              >
                {copiedId === 'lor-text' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {/* Open in Standalone Tab */}
              <a
                href="/belvo-lor.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                title="Open PDF file in a new standalone browser tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </a>

              {/* Download Official LOR PDF */}
              <a
                href="/belvo-lor.pdf"
                download="Poosala_Lokesh_Belvo_LOR.pdf"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Download the official Belvo LOR PDF"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download LOR PDF</span>
              </a>
            </div>
          </div>

          {/* Direct Vector Sheet View */}
          <div className="w-full overflow-x-auto rounded-3xl border border-[#1F2937] bg-[#070B18] p-4 sm:p-8 flex justify-center items-start min-h-[780px] custom-scrollbar">
            <div
              className="w-full flex justify-center transition-all duration-150 ease-out"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <div className="max-w-[760px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <img
                  src="/belvo-lor-page.svg"
                  alt="Belvo Letter of Recommendation - Poosala Lokesh"
                  className="w-full h-auto object-contain select-text"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: UPLOADED RESUME VERSIONS */}
      {activeSubTab === 'uploads' && (
        <div className="space-y-6">
          {/* Active Public Resume Card */}
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
                      Currently Live Public Resume
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

              <div className="flex items-center gap-2 flex-wrap">
                {/* Visual Unblocked Preview */}
                <button
                  type="button"
                  onClick={() =>
                    setPreviewModalDoc({
                      title: activeResume?.title || 'Active Resume',
                      pdfUrl: activeResume?.url || '/resume.pdf',
                      vectorUrl: '/resume-page.svg',
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>Preview</span>
                </button>

                <a
                  href={activeResume?.url || '/resume.pdf'}
                  download={activeResume?.title || 'Poosala_Lokesh_Resume.pdf'}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyLink(activeResume?.url || '/resume.pdf', 'active')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-medium text-[#CBD5E1] hover:text-[#E0E7FF] cursor-pointer"
                  title="Copy link"
                >
                  {copiedId === 'active' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Upload New Resume Box */}
          <div className="rounded-2xl border border-dashed border-[#1F2937] bg-[#0B132B]/50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-[#60A5FA] mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#E0E7FF]">Upload New Resume File</h4>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-1 mb-4">
              Upload a new version to automatically store it in Supabase Storage with instant public CDN links.
            </p>

            <label className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading to Supabase...' : 'Select PDF File'}</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
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
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                    isCurrentActive
                      ? 'border-[#2563EB]/50 bg-[#2563EB]/10'
                      : 'border-[#1F2937] bg-[#0B132B] hover:border-[#1F2937]/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-mono font-bold ${
                        isCurrentActive
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#111827] text-[#94A3B8] border border-[#1F2937]'
                      }`}
                    >
                      {r.version || 'v1.0'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#E0E7FF]">{r.title}</span>
                        {isCurrentActive && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.2 text-[9px] font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono">Added {displayDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCurrentActive && (
                      <button
                        type="button"
                        onClick={() => handleSetActive(r.id, r.title)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs text-[#CBD5E1] hover:text-white hover:border-[#60A5FA] transition-colors cursor-pointer"
                      >
                        <Star className="h-3 w-3 text-amber-400" />
                        <span>Set Active</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setPreviewModalDoc({
                          title: r.title,
                          pdfUrl: r.url,
                          vectorUrl: '/resume-page.svg',
                        })
                      }
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Preview Document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <a
                      href={r.url}
                      download={r.title}
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(r.url, r.id)}
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-white hover:bg-[#1F2937] transition-colors cursor-pointer"
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
                      disabled={isCurrentActive}
                      onClick={() => handleDelete(r.id, r.title)}
                      className={`rounded-lg p-2 transition-colors ${
                        isCurrentActive
                          ? 'opacity-30 cursor-not-allowed text-[#64748B]'
                          : 'text-[#64748B] hover:text-red-400 hover:bg-[#1F2937] cursor-pointer'
                      }`}
                      title={isCurrentActive ? 'Cannot delete the active resume' : 'Delete version'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SMART UNBLOCKED DOCUMENT PREVIEW MODAL */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
          <div className="relative flex flex-col w-full max-w-5xl h-[90vh] rounded-3xl border border-[#2A2B3D] bg-[#111827] shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#1F2937] px-6 py-3.5 bg-[#0B132B]/95 gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">{previewModalDoc.title}</h3>
                  <p className="text-[11px] font-mono text-[#A5B4FC]/70">
                    Native Unblocked Document Preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Open in Standalone Tab */}
                <a
                  href={previewModalDoc.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3 py-1.5 text-xs text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open in Tab</span>
                </a>

                {/* Download */}
                <a
                  href={previewModalDoc.pdfUrl}
                  download={previewModalDoc.title}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setPreviewModalDoc(null)}
                  className="rounded-xl p-1.5 text-[#64748B] hover:text-white hover:bg-[#1F2937] transition-colors cursor-pointer ml-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body - Direct Vector Document Sheet (Immune to Chrome's iframe PDF block) */}
            <div className="flex-1 w-full overflow-y-auto bg-[#070B18] p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
              <div className="max-w-[760px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <img
                  src={previewModalDoc.vectorUrl || '/resume-page.svg'}
                  alt={previewModalDoc.title}
                  className="w-full h-auto object-contain select-text"
                />
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[#1F2937] bg-[#0B132B] text-xs text-[#94A3B8]">
              <span>
                Document Source: <strong className="text-white font-mono">{previewModalDoc.pdfUrl}</strong>
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Rendered with zero browser restrictions
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTab;
