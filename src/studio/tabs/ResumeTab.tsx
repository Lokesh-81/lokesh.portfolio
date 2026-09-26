'use client';

import React, { useState, useRef } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { uploadMediaToSupabase } from '@/lib/supabase';
import type { ResumeItem, ExperienceItem } from '@/lib/portfolio-types';
import { UniversalDocumentViewer } from '@/components/ui/universal-document-viewer';
import {
  openDocumentInNewTab,
  downloadDocument,
  getCleanDocDisplayName,
} from '@/lib/document-utils';
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
  ShieldCheck,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Award,
  Layers,
  Edit2,
  RefreshCw,
  Plus,
  AlertTriangle,
  FolderSync,
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
    saveExperience,
  } = usePortfolio();

  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'lor' | 'uploads'>('sheet');
  const [resumeViewMode, setResumeViewMode] = useState<'activeFile' | 'atsSheet'>('activeFile');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Resume file input refs
  const replaceActiveResumeFileRef = useRef<HTMLInputElement>(null);
  const uploadNewResumeFileRef = useRef<HTMLInputElement>(null);
  const replaceVersionFileRef = useRef<HTMLInputElement>(null);
  const replaceLorFileRef = useRef<HTMLInputElement>(null);

  const [replacingVersionId, setReplacingVersionId] = useState<string | null>(null);

  // Resume editing modal
  const [editingResume, setEditingResume] = useState<ResumeItem | null>(null);

  // Belvo LOR editing modal
  const [isEditingLor, setIsEditingLor] = useState(false);

  // Preview modal
  const [previewModalDoc, setPreviewModalDoc] = useState<{
    title: string;
    pdfUrl: string;
    vectorUrl?: string;
  } | null>(null);

  // Find Belvo experience
  const belvoExp =
    experiences.find((e) => e.id === 'belvo') ||
    experiences.find((e) => e.company?.toLowerCase().includes('belvo')) ||
    experiences[0];

  const hasLor = belvoExp?.lor?.hasLor !== false && !!belvoExp?.lor;

  // State for LOR edit form
  const [lorFormData, setLorFormData] = useState({
    title: belvoExp?.lor?.title || 'Letter of Recommendation (LOR)',
    issuer: belvoExp?.lor?.issuer || 'Belvo Company',
    issuedBy: belvoExp?.lor?.issuedBy || 'Hrishikesh Mishra',
    role: belvoExp?.lor?.role || 'CEO, Belvo',
    date: belvoExp?.lor?.date || '22-09-2026',
    phone: belvoExp?.lor?.phone || '+918928466820',
    email: belvoExp?.lor?.email || 'contact.belvo@gmail.com',
    location: belvoExp?.lor?.location || 'Goregaon, Mumbai',
    pdfUrl: belvoExp?.lor?.pdfUrl || '/belvo-lor.pdf',
    vectorUrl: belvoExp?.lor?.vectorUrl || '/belvo-lor-page.svg',
    skillsVerified: (belvoExp?.lor?.skillsVerified || [
      'Web development and website implementation',
      'Front-end development and responsive design',
      'Debugging and resolving technical issues',
      'Understanding project requirements and development workflows',
      'Testing and improving web pages and features',
      'Collaborating with team members on development tasks',
    ]).join('\n'),
  });

  // Keep lorFormData synced whenever experiences or belvoExp updates
  React.useEffect(() => {
    if (belvoExp?.lor) {
      setLorFormData((prev) => ({
        ...prev,
        title: belvoExp.lor?.title || prev.title,
        issuer: belvoExp.lor?.issuer || prev.issuer,
        issuedBy: belvoExp.lor?.issuedBy || prev.issuedBy,
        role: belvoExp.lor?.role || prev.role,
        date: belvoExp.lor?.date || prev.date,
        phone: belvoExp.lor?.phone || prev.phone,
        email: belvoExp.lor?.email || prev.email,
        location: belvoExp.lor?.location || prev.location,
        pdfUrl: belvoExp.lor?.pdfUrl || prev.pdfUrl,
        vectorUrl: belvoExp.lor?.vectorUrl || prev.vectorUrl,
        skillsVerified: (belvoExp.lor?.skillsVerified || prev.skillsVerified.split('\n')).join('\n'),
      }));
    }
  }, [belvoExp?.lor]);

  // Open LOR edit modal and sync fields
  const handleOpenEditLor = () => {
    if (belvoExp?.lor) {
      setLorFormData({
        title: belvoExp.lor.title || 'Letter of Recommendation (LOR)',
        issuer: belvoExp.lor.issuer || 'Belvo Company',
        issuedBy: belvoExp.lor.issuedBy || 'Hrishikesh Mishra',
        role: belvoExp.lor.role || 'CEO, Belvo',
        date: belvoExp.lor.date || '22-09-2026',
        phone: belvoExp.lor.phone || '+918928466820',
        email: belvoExp.lor.email || 'contact.belvo@gmail.com',
        location: belvoExp.lor.location || 'Goregaon, Mumbai',
        pdfUrl: belvoExp.lor.pdfUrl || '/belvo-lor.pdf',
        vectorUrl: belvoExp.lor.vectorUrl || '/belvo-lor-page.svg',
        skillsVerified: (belvoExp.lor.skillsVerified || []).join('\n'),
      });
    }
    setIsEditingLor(true);
  };

  // Save LOR changes
  const handleSaveLor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!belvoExp) return;

    try {
      const updatedLor = {
        hasLor: true,
        title: lorFormData.title.trim() || 'Letter of Recommendation (LOR)',
        issuer: lorFormData.issuer.trim() || 'Belvo Company',
        issuedBy: lorFormData.issuedBy.trim() || 'Hrishikesh Mishra',
        role: lorFormData.role.trim() || 'CEO, Belvo',
        date: lorFormData.date.trim() || '22-09-2026',
        phone: lorFormData.phone.trim() || '+918928466820',
        email: lorFormData.email.trim() || 'contact.belvo@gmail.com',
        location: lorFormData.location.trim() || 'Goregaon, Mumbai',
        pdfUrl: lorFormData.pdfUrl.trim() || '/belvo-lor.pdf',
        vectorUrl: lorFormData.vectorUrl.trim() || '/belvo-lor-page.svg',
        skillsVerified: lorFormData.skillsVerified
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const updatedExp: ExperienceItem = {
        ...belvoExp,
        lor: updatedLor,
      };

      await saveExperience(updatedExp);
      setIsEditingLor(false);
      showToast('Letter of Recommendation updated successfully!', 'success');
    } catch {
      showToast('Failed to update Letter of Recommendation', 'error');
    }
  };

  // Delete / Remove LOR
  const handleDeleteLor = async () => {
    if (!belvoExp) return;
    if (
      !window.confirm(
        'Are you sure you want to delete / remove the Letter of Recommendation from your portfolio? It can be restored or re-uploaded anytime.'
      )
    ) {
      return;
    }

    try {
      const updatedExp: ExperienceItem = {
        ...belvoExp,
        lor: {
          ...(belvoExp.lor || {}),
          hasLor: false,
          title: belvoExp.lor?.title || 'Letter of Recommendation (LOR)',
          issuer: belvoExp.lor?.issuer || 'Belvo Company',
          issuedBy: belvoExp.lor?.issuedBy || 'Hrishikesh Mishra',
          role: belvoExp.lor?.role || 'CEO, Belvo',
          date: belvoExp.lor?.date || '22-09-2026',
          phone: belvoExp.lor?.phone || '',
          email: belvoExp.lor?.email || '',
          location: belvoExp.lor?.location || '',
          skillsVerified: belvoExp.lor?.skillsVerified || [],
        },
      };

      await saveExperience(updatedExp);
      showToast('Letter of Recommendation has been removed from portfolio view', 'success');
    } catch {
      showToast('Failed to remove Letter of Recommendation', 'error');
    }
  };

  // Restore / Attach LOR
  const handleRestoreLor = async () => {
    if (!belvoExp) return;

    try {
      const updatedExp: ExperienceItem = {
        ...belvoExp,
        lor: {
          hasLor: true,
          title: 'Letter of Recommendation (LOR)',
          issuer: 'Belvo Company',
          issuedBy: 'Hrishikesh Mishra',
          role: 'CEO, Belvo',
          date: '22-09-2026',
          phone: '+918928466820',
          email: 'contact.belvo@gmail.com',
          location: 'Goregaon, Mumbai',
          pdfUrl: '/belvo-lor.pdf',
          vectorUrl: '/belvo-lor-page.svg',
          skillsVerified: [
            'Web development and website implementation',
            'Front-end development and responsive design',
            'Debugging and resolving technical issues',
            'Understanding project requirements and development workflows',
            'Testing and improving web pages and features',
            'Collaborating with team members on development tasks',
          ],
        },
      };

      await saveExperience(updatedExp);
      showToast('Letter of Recommendation restored and published!', 'success');
    } catch {
      showToast('Failed to restore Letter of Recommendation', 'error');
    }
  };

  // Upload replacement LOR PDF
  const handleReplaceLorFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !belvoExp) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a valid PDF document for the LOR', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'resume');
      const updatedExp: ExperienceItem = {
        ...belvoExp,
        lor: {
          ...(belvoExp.lor || {}),
          hasLor: true,
          title: belvoExp.lor?.title || 'Letter of Recommendation (LOR)',
          issuer: belvoExp.lor?.issuer || 'Belvo Company',
          issuedBy: belvoExp.lor?.issuedBy || 'Hrishikesh Mishra',
          role: belvoExp.lor?.role || 'CEO, Belvo',
          date: belvoExp.lor?.date || '22-09-2026',
          phone: belvoExp.lor?.phone || '',
          email: belvoExp.lor?.email || '',
          location: belvoExp.lor?.location || '',
          pdfUrl: res.url,
          vectorUrl: res.url,
        },
      };

      setLorFormData((prev) => ({
        ...prev,
        pdfUrl: res.url,
        vectorUrl: res.url,
      }));

      await saveExperience(updatedExp);
      showToast(`LOR document replaced with "${file.name}"!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload replacement LOR PDF', 'error');
    } finally {
      setIsUploading(false);
      if (replaceLorFileRef.current) replaceLorFileRef.current.value = '';
    }
  };

  // Upload or replace active resume directly
  const handleUploadOrReplaceResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a valid PDF document', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'resume');
      const newVersionNum = (resumes.length + 1).toFixed(1);
      const newResume: ResumeItem = {
        id: `resume-${Date.now()}`,
        title: file.name,
        url: res.url,
        version: `v${newVersionNum}`,
        uploadedAt: new Date().toISOString(),
        isActive: true,
      };

      // Set current ones inactive and save new active version
      await saveResume(newResume);
      await setActiveResumeVersion(newResume.id);
      showToast(`Resume replaced with "${file.name}" and set as active!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Resume upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (replaceActiveResumeFileRef.current) replaceActiveResumeFileRef.current.value = '';
      if (uploadNewResumeFileRef.current) uploadNewResumeFileRef.current.value = '';
    }
  };

  // Replace file for a specific resume version
  const handleReplaceVersionFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingVersionId) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a valid PDF document', 'error');
      return;
    }

    const targetResume = resumes.find((r) => r.id === replacingVersionId);
    if (!targetResume) return;

    setIsUploading(true);
    try {
      const res = await uploadMediaToSupabase(file, 'resume');
      const updatedResume: ResumeItem = {
        ...targetResume,
        title: file.name,
        url: res.url,
        updatedAt: new Date().toISOString(),
      };
      await saveResume(updatedResume);
      showToast(`Updated file for version ${targetResume.version || ''}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Replacement failed', 'error');
    } finally {
      setIsUploading(false);
      setReplacingVersionId(null);
      if (replaceVersionFileRef.current) replaceVersionFileRef.current.value = '';
    }
  };

  // Save manual edit for a resume
  const handleSaveResumeEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResume) return;

    try {
      await saveResume(editingResume);
      showToast('Resume metadata updated!', 'success');
      setEditingResume(null);
    } catch {
      showToast('Failed to update resume', 'error');
    }
  };

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
    const lorText = `${lorFormData.issuer.toUpperCase()}
Date: ${lorFormData.date}

Poosala Lokesh
Web Developer Intern
${lorFormData.issuer}
${lorFormData.location}

Dear Poosala Lokesh,
It is my pleasure to recommend you for successfully completing your internship at ${lorFormData.issuer}.
During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities...

${lorFormData.issuedBy}
${lorFormData.role}`;
    navigator.clipboard.writeText(lorText);
    setCopiedId('lor-text');
    showToast('Recommendation letter copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
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
      {/* Hidden File Inputs for quick replacements */}
      <input
        ref={replaceActiveResumeFileRef}
        type="file"
        accept="application/pdf"
        onChange={handleUploadOrReplaceResume}
        disabled={isUploading}
        className="hidden"
      />
      <input
        ref={uploadNewResumeFileRef}
        type="file"
        accept="application/pdf"
        onChange={handleUploadOrReplaceResume}
        disabled={isUploading}
        className="hidden"
      />
      <input
        ref={replaceVersionFileRef}
        type="file"
        accept="application/pdf"
        onChange={handleReplaceVersionFile}
        disabled={isUploading}
        className="hidden"
      />
      <input
        ref={replaceLorFileRef}
        type="file"
        accept="application/pdf"
        onChange={handleReplaceLorFile}
        disabled={isUploading}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#1F2937] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#E0E7FF]">
              Documents &amp; Resume Studio
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" />
              Replace, Change &amp; Delete Enabled
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Full management controls for your ATS Resume, Belvo Letter of Recommendation (LOR), and PDF archives.
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
            {!hasLor && (
              <span className="rounded-full bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.2">
                Off
              </span>
            )}
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
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#1F2937] bg-[#0B132B]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#E0E7FF] flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-[#60A5FA]" />
                Active Document View
              </span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-[#1F2937]" />
              <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#111827] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setResumeViewMode('activeFile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    resumeViewMode === 'activeFile'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#E0E7FF]'
                  }`}
                >
                  Uploaded PDF File
                </button>
                <button
                  type="button"
                  onClick={() => setResumeViewMode('atsSheet')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    resumeViewMode === 'atsSheet'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#E0E7FF]'
                  }`}
                >
                  Live ATS Sheet
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Replace / Change Active Resume Button */}
              <button
                type="button"
                onClick={() => replaceActiveResumeFileRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                title="Upload a new PDF to replace the current active resume"
              >
                {isUploading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FolderSync className="h-3.5 w-3.5" />
                )}
                <span>Replace / Change Resume</span>
              </button>

              {/* Edit Details */}
              {activeResume && (
                <button
                  type="button"
                  onClick={() => setEditingResume({ ...activeResume })}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-white transition-colors cursor-pointer"
                  title="Edit Resume Title or Version"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Info</span>
                </button>
              )}

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
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              {/* Download Official PDF */}
              <button
                type="button"
                onClick={() => downloadDocument(activeResume?.url || '/resume.pdf', activeResume?.title || 'Poosala_Lokesh_Resume.pdf')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                title="Download the official PDF file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Interactive Document Sheet Surface */}
          <div className="w-full overflow-x-auto rounded-3xl border border-[#1F2937] bg-[#070B18] p-4 sm:p-8 flex justify-center items-start min-h-[780px] custom-scrollbar">
            <div
              className="w-full flex justify-center transition-all duration-150 ease-out"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {resumeViewMode === 'activeFile' ? (
                <div className="max-w-[820px] w-full">
                  <UniversalDocumentViewer
                    url={activeResume?.url || '/resume.pdf'}
                    title={activeResume?.title || 'Poosala Lokesh - Active Resume'}
                    height={820}
                    fallbackImage="/resume-page.svg"
                  />
                </div>
              ) : (
                <div className="max-w-[760px] w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                  <img
                    src="/resume-page.svg"
                    alt="Poosala Lokesh - Professional Resume"
                    className="w-full h-auto object-contain select-text"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BELVO LOR LETTER */}
      {activeSubTab === 'lor' && (
        <div className="space-y-4">
          {/* If LOR is removed / deleted, show Empty State with restore/create button */}
          {!hasLor ? (
            <div className="rounded-3xl border border-dashed border-[#1F2937] bg-[#0B132B]/80 p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-4">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-white">
                Letter of Recommendation is Currently Removed
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-1 mb-6 leading-relaxed">
                The Letter of Recommendation has been detached from your public Belvo experience.
                You can restore the official Belvo letterhead, upload a replacement PDF, or customize details at any time.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestoreLor}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Award className="h-4 w-4" />
                  <span>Restore Official Belvo LOR</span>
                </button>

                <button
                  type="button"
                  onClick={() => replaceLorFileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2.5 text-xs font-medium text-[#E0E7FF] hover:border-purple-400 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-purple-400" />
                  <span>Upload Custom LOR PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* LOR Action Toolbar with Replace, Change, and Delete */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#1F2937] bg-[#0B132B]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#E0E7FF] flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-purple-400" />
                    {lorFormData.issuer} — {lorFormData.title}
                  </span>
                  <span className="hidden sm:inline-block h-3.5 w-px bg-[#1F2937]" />
                  <span className="text-[11px] text-[#A5B4FC]/80 hidden sm:inline">
                    Issued by <strong className="text-white">{lorFormData.issuedBy}</strong> ({lorFormData.role})
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Replace LOR File */}
                  <button
                    type="button"
                    onClick={() => replaceLorFileRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/40 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-xs"
                    title="Upload a new PDF to replace this Letter of Recommendation"
                  >
                    {isUploading ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>Replace PDF</span>
                  </button>

                  {/* Change / Edit LOR Details */}
                  <button
                    type="button"
                    onClick={handleOpenEditLor}
                    className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                    title="Change Issuer, Date, Company, or Verified Skills"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>Change Details</span>
                  </button>

                  {/* Delete LOR */}
                  <button
                    type="button"
                    onClick={handleDeleteLor}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                    title="Delete / Remove this Letter of Recommendation from your portfolio"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete LOR</span>
                  </button>

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

                  {/* Download Official LOR PDF */}
                  <button
                    type="button"
                    onClick={() => downloadDocument(lorFormData.pdfUrl, 'Poosala_Lokesh_Belvo_LOR.pdf')}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    title="Download the official Belvo LOR PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download LOR PDF</span>
                  </button>
                </div>
              </div>

              {/* Direct Document Sheet / PDF View */}
              <div className="w-full overflow-x-auto rounded-3xl border border-[#1F2937] bg-[#070B18] p-4 sm:p-8 flex justify-center items-start min-h-[780px] custom-scrollbar">
                <div
                  className="w-full flex justify-center transition-all duration-150 ease-out"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                  }}
                >
                  <div className="max-w-[820px] w-full">
                    <UniversalDocumentViewer
                      url={lorFormData.pdfUrl || lorFormData.vectorUrl || '/belvo-lor-page.svg'}
                      title={lorFormData.title || 'Belvo Letter of Recommendation'}
                      height={800}
                      fallbackImage="/belvo-lor-page.svg"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
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
                    {activeResume?.url?.startsWith('data:')
                      ? 'Attached Document (PDF Format)'
                      : activeResume?.url || '/resume.pdf'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Replace File Button */}
                <button
                  type="button"
                  onClick={() => replaceActiveResumeFileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-600/20 px-3.5 py-2 text-xs font-medium text-blue-300 hover:bg-blue-600/30 transition-all cursor-pointer"
                  title="Replace with a new PDF"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Replace File</span>
                </button>

                {/* Edit metadata */}
                {activeResume && (
                  <button
                    type="button"
                    onClick={() => setEditingResume({ ...activeResume })}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Change Info</span>
                  </button>
                )}

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

                <button
                  type="button"
                  onClick={() =>
                    downloadDocument(
                      activeResume?.url || '/resume.pdf',
                      activeResume?.title || 'Poosala_Lokesh_Resume.pdf'
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>

                {/* Delete active resume (with confirmation) */}
                {activeResume && (
                  <button
                    type="button"
                    onClick={() => handleDelete(activeResume.id, activeResume.title)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Delete this resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                )}
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

            <button
              type="button"
              onClick={() => uploadNewResumeFileRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading to Supabase...' : 'Select PDF File'}</span>
            </button>
          </div>

          {/* Resume Version History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#E0E7FF]">All Resume Versions</h3>
              <span className="text-xs text-[#64748B] font-mono">{resumes.length} stored</span>
            </div>

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

                  <div className="flex items-center gap-1.5 flex-wrap">
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

                    {/* Replace File for this version */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingVersionId(r.id);
                        replaceVersionFileRef.current?.click();
                      }}
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-blue-400 hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Replace file for this version"
                    >
                      <Upload className="h-4 w-4" />
                    </button>

                    {/* Change / Edit metadata */}
                    <button
                      type="button"
                      onClick={() => setEditingResume({ ...r })}
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Change title, version, or URL"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Preview */}
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

                    {/* Download */}
                    <button
                      type="button"
                      onClick={() => downloadDocument(r.url, r.title)}
                      className="rounded-lg p-2 text-[#CBD5E1] hover:text-[#60A5FA] hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {/* Copy Link */}
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

                    {/* Delete version */}
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id, r.title)}
                      className="rounded-lg p-2 text-[#64748B] hover:text-red-400 hover:bg-[#1F2937] transition-colors cursor-pointer"
                      title="Delete version"
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

      {/* MODAL 1: EDIT / CHANGE LOR DETAILS */}
      {isEditingLor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Change Letter of Recommendation</h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Attached to your Belvo Company experience
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingLor(false)}
                className="p-1.5 text-[#64748B] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLor} className="space-y-4">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lorFormData.title}
                    onChange={(e) => setLorFormData({ ...lorFormData, title: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={lorFormData.issuer}
                    onChange={(e) => setLorFormData({ ...lorFormData, issuer: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Signatory Name (Issued By)
                  </label>
                  <input
                    type="text"
                    required
                    value={lorFormData.issuedBy}
                    onChange={(e) => setLorFormData({ ...lorFormData, issuedBy: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Signatory Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lorFormData.role}
                    onChange={(e) => setLorFormData({ ...lorFormData, role: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={lorFormData.date}
                    onChange={(e) => setLorFormData({ ...lorFormData, date: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={lorFormData.location}
                    onChange={(e) => setLorFormData({ ...lorFormData, location: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={lorFormData.phone}
                    onChange={(e) => setLorFormData({ ...lorFormData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={lorFormData.email}
                    onChange={(e) => setLorFormData({ ...lorFormData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  PDF Download URL / Supabase Asset Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={lorFormData.pdfUrl}
                    onChange={(e) => setLorFormData({ ...lorFormData, pdfUrl: e.target.value })}
                    className="flex-1 rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] font-mono focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => replaceLorFileRef.current?.click()}
                    className="rounded-xl border border-purple-500/40 bg-purple-600/20 px-3 py-2 text-xs text-purple-300 hover:bg-purple-600/30 transition-colors cursor-pointer"
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Verified Skills &amp; Highlights (one per line)
                </label>
                <textarea
                  rows={4}
                  value={lorFormData.skillsVerified}
                  onChange={(e) =>
                    setLorFormData({ ...lorFormData, skillsVerified: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 text-xs text-[#E0E7FF] focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={handleDeleteLor}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete LOR</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingLor(false)}
                    className="rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-xs text-[#CBD5E1] hover:bg-[#1F2937] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT / CHANGE RESUME VERSION DETAILS */}
      {editingResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-[#60A5FA]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Change Resume Info</h3>
                  <p className="text-[11px] text-[#94A3B8]">Edit version and document metadata</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingResume(null)}
                className="p-1.5 text-[#64748B] hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResumeEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={editingResume.title}
                  onChange={(e) =>
                    setEditingResume({ ...editingResume, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    Version Tag (e.g. v2.0)
                  </label>
                  <input
                    type="text"
                    value={editingResume.version || ''}
                    onChange={(e) =>
                      setEditingResume({ ...editingResume, version: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                    File Size Label
                  </label>
                  <input
                    type="text"
                    value={editingResume.fileSize || ''}
                    onChange={(e) =>
                      setEditingResume({ ...editingResume, fileSize: e.target.value })
                    }
                    placeholder="1.2 MB"
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
                  File URL / Supabase Asset Path
                </label>
                <input
                  type="text"
                  required
                  value={editingResume.url}
                  onChange={(e) => setEditingResume({ ...editingResume, url: e.target.value })}
                  className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2 text-xs text-[#E0E7FF] font-mono focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="activeResumeCheckbox"
                  type="checkbox"
                  checked={editingResume.isActive}
                  onChange={(e) =>
                    setEditingResume({ ...editingResume, isActive: e.target.checked })
                  }
                  className="rounded border-[#1F2937] text-blue-600 focus:ring-0"
                />
                <label
                  htmlFor="activeResumeCheckbox"
                  className="text-xs text-[#CBD5E1] cursor-pointer"
                >
                  Set as Active Public Resume
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(editingResume.id, editingResume.title);
                    setEditingResume(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingResume(null)}
                    className="rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-xs text-[#CBD5E1] hover:bg-[#1F2937] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] px-5 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SMART UNBLOCKED PREVIEW MODAL */}
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

            {/* Modal Body */}
            <div className="flex-1 w-full overflow-y-auto bg-[#070B18] p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
              <div className="max-w-[820px] w-full">
                <UniversalDocumentViewer
                  url={previewModalDoc.pdfUrl || previewModalDoc.vectorUrl || '/resume.pdf'}
                  title={previewModalDoc.title}
                  height={780}
                  fallbackImage="/resume-page.svg"
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
