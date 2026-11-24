'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  ExternalLink,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { UniversalDocumentViewer } from '@/components/ui/universal-document-viewer';
import {
  openDocumentInNewTab,
  downloadDocument,
  getCleanDocDisplayName,
} from '@/lib/document-utils';
import { trackEvent } from '@/lib/analytics';

export interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { profile, activeResume, experiences, skills, educations, certifications } = usePortfolio();
  const [copiedText, setCopiedText] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const resumeUrl = activeResume?.url || '/resume.pdf';
  const resumeTitle = activeResume?.title || 'Poosala_Lokesh_Resume.pdf';

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    trackEvent('resume', 'resume_view');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  const handleCopyText = () => {
    const text = `${profile.name || 'Poosala Lokesh'}
${profile.title || 'Full Stack Engineer & Cloud Developer'}
Email: ${profile.email || 'poosala15@gmail.com'} | Location: ${profile.location || 'Telangana, India'}
GitHub: https://github.com/Lokesh-81 | LinkedIn: https://linkedin.com/in/poosala-lokesh

=== SUMMARY ===
${profile.bio || profile.aboutDescription || 'Results-driven Full Stack Engineer and Google Cloud Certified Professional with expertise in React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments.'}

=== EXPERIENCE ===
${experiences.map((exp) => `• ${exp.role} at ${exp.company} (${exp.period})\n  ${exp.description || ''}`).join('\n\n')}

=== SKILLS ===
${skills.map((s) => `• ${s.name} (${s.category})`).join('\n')}

=== CERTIFICATIONS ===
${certifications.map((c) => `• ${c.title} — ${c.issuer}`).join('\n')}

=== EDUCATION ===
${educations.map((e) => `• ${e.degree} — ${e.institution} (${e.period || e.endYear || ''})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return typeof document === 'undefined' ? null : createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="portfolio-pdf-modal fixed inset-0 z-[10000] isolate flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="portfolio-pdf-backdrop absolute inset-0 z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="portfolio-pdf-dialog relative z-10 flex flex-col w-full max-w-5xl h-[min(94dvh,980px)] max-h-[calc(100dvh-1rem)] rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="portfolio-pdf-header relative flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 pr-14 border-b shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8D5D8] text-[#9B6876]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#302925] tracking-tight">
                      {resumeTitle}
                    </h3>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                      Active Resume
                    </span>
                  </div>
                  <p className="text-[11px] text-[#62534D]">
                    Official ATS-formatted curriculum vitae · Poosala Lokesh
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center rounded-xl border border-[#D8C8C0] bg-[#F0E8E2] px-1 py-0.5 text-xs">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                    className="p-1.5 text-[#887A72] hover:text-[#302925] transition-colors cursor-pointer rounded-lg hover:bg-[#E8D5D8]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-[#62534D] min-w-[42px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                    className="p-1.5 text-[#887A72] hover:text-[#302925] transition-colors cursor-pointer rounded-lg hover:bg-[#E8D5D8]"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  {zoomLevel !== 100 && (
                    <button
                      onClick={() => setZoomLevel(100)}
                      className="p-1.5 text-[#887A72] hover:text-[#302925] transition-colors cursor-pointer rounded-lg hover:bg-[#E8D5D8]"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openDocumentInNewTab(resumeUrl, resumeTitle)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#D8C8C0] bg-[#F0E8E2] px-3 py-1.5 text-xs font-medium text-[#62534D] hover:border-[#B78391] hover:text-[#302925] transition-colors cursor-pointer"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open in Tab</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-[#D8C8C0] bg-[#F0E8E2] px-3 py-1.5 text-xs font-medium text-[#62534D] hover:border-[#B78391] hover:text-[#302925] transition-colors cursor-pointer"
                  title="Print document"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadDocument(resumeUrl, resumeTitle);
                    trackEvent('resume', 'resume_download');
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#9B6876] hover:bg-[#865765] px-3.5 py-1.5 text-xs font-semibold text-[#302925] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Download the official resume PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => onCloseRef.current()}
                  className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-[#B9A69B] bg-[#F7F2EE] text-[#302925] shadow-md hover:bg-[#E8D5D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B6876] transition-colors cursor-pointer"
                  aria-label="Close resume viewer"
                  title="Close resume viewer (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="portfolio-pdf-surface flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 flex justify-center items-start custom-scrollbar">
              <div
                className="w-full max-w-[820px] flex justify-center transition-all duration-150 ease-out"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <UniversalDocumentViewer
                  url={resumeUrl}
                  title={resumeTitle}
                  height={800}
                />
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-[#D8C8C0] bg-[#F7F2EE]/95 text-xs text-[#62534D] shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Active Resume File: <strong className="text-[#302925] font-mono">{getCleanDocDisplayName(resumeUrl, resumeTitle)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 text-xs text-[#62534D] hover:text-[#302925] transition-colors cursor-pointer"
                  title="Copy plain text formatted for job portals"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Formatted Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ResumeModal;
