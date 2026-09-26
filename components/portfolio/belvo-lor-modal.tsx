'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Copy,
  Printer,
  FileCheck2,
  Download,
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

export interface BelvoLorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  vectorUrl?: string;
  title?: string;
}

export function BelvoLorModal({
  isOpen,
  onClose,
  pdfUrl,
  vectorUrl,
  title,
}: BelvoLorModalProps) {
  const { experiences } = usePortfolio();
  const [copiedText, setCopiedText] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const belvoExp =
    experiences.find((e) => e.id === 'belvo') ||
    experiences.find((e) => e.company?.toLowerCase().includes('belvo')) ||
    experiences[0];

  const currentPdfUrl = pdfUrl || belvoExp?.lor?.pdfUrl || '/belvo-lor.pdf';
  const currentVectorUrl = vectorUrl || belvoExp?.lor?.vectorUrl;
  const currentDocUrl = currentPdfUrl || currentVectorUrl || '/belvo-lor-page.svg';
  const currentTitle = title || belvoExp?.lor?.title || 'Belvo Company — Letter of Recommendation';
  const currentIssuer = belvoExp?.lor?.issuer || 'Belvo Company';
  const currentSignatory = belvoExp?.lor?.issuedBy || 'Hrishikesh Mishra';
  const currentRole = belvoExp?.lor?.role || 'CEO, Belvo';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const lorFullText = `BELVO COMPANY
Date: 22-09-2026

Poosala Lokesh
Web Developer Intern
Belvo Company
Goregaon, Mumbai

Dear Poosala Lokesh,

It is my pleasure to recommend you for successfully completing a 3-month internship as a Web Developer at Belvo.

During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities. Throughout the internship period, they gained practical exposure to website development, implementation, debugging, and improving web-based solutions.

Poosala Lokesh contributed to assigned projects and responsibilities while working with the development team. They showed dedication, adaptability, and a professional attitude while completing assigned tasks and meeting project requirements. Their ability to learn new concepts and apply technical knowledge in practical situations was appreciable.

During their internship, Poosala Lokesh developed experience in areas such as:
• Web development and website implementation
• Front-end development and responsive design
• Debugging and resolving technical issues
• Understanding project requirements and development workflows
• Testing and improving web pages and features
• Collaborating with team members on development tasks

Poosala Lokesh successfully completed the 3-month internship program at Belvo and demonstrated consistent commitment throughout the internship. We appreciate their contributions and wish them continued success in their academic and professional career.

I am pleased to recommend Poosala Lokesh for future opportunities in the field of Web Development and related areas.

Sincerely,
Hrishikesh Mishra
CEO, Belvo

Contact:
Phone: +918928466820
Email: contact.belvo@gmail.com
Location: Goregaon, Mumbai`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(lorFullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 160));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B132B]/90 backdrop-blur-xl -z-10"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl h-[92vh] rounded-3xl border border-[#2A2B3D] bg-[#111827] shadow-2xl overflow-hidden flex flex-col my-auto"
          >
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#1F2937] px-4 sm:px-6 py-3.5 bg-[#0B132B]/95 gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-semibold text-[#E0E7FF]">
                      Belvo Company — Letter of Recommendation
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-3 w-3" />
                      CEO Verified
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#A5B4FC]/70">
                    Official Document · Issued 22-09-2026 by Hrishikesh Mishra, CEO
                  </p>
                </div>
              </div>

              {/* Action Controls & Zoom */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center rounded-xl border border-[#1F2937] bg-[#111827] px-1 py-1 text-xs">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-[#CBD5E1] min-w-[42px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  {zoomLevel !== 100 && (
                    <button
                      onClick={handleResetZoom}
                      className="p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#1F2937]"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Open in Standalone Tab (Direct browser unblocked PDF or Blob) */}
                <button
                  type="button"
                  onClick={() => openDocumentInNewTab(currentPdfUrl, currentTitle)}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                  title="Open raw document file in a new standalone tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open in Tab</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Print</span>
                </button>

                {/* Download PDF button */}
                <button
                  type="button"
                  onClick={() => downloadDocument(currentPdfUrl, 'Poosala_Lokesh_Belvo_LOR.pdf')}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Download the official document file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1F2937] bg-[#111827] text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors cursor-pointer ml-1"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Surface - High-Res Direct Vector or PDF Document Viewer */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#070B18] flex justify-center items-start custom-scrollbar">
              <div
                className="w-full max-w-[820px] flex justify-center transition-all duration-150 ease-out"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                }}
              >
                <UniversalDocumentViewer
                  url={currentDocUrl}
                  title={currentTitle}
                  height={800}
                  fallbackImage="/belvo-lor-page.svg"
                />
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-[#1F2937] bg-[#0B132B]/95 text-xs text-[#CBD5E1] shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Official Document:{' '}
                  <strong className="text-white font-mono">
                    {getCleanDocDisplayName(currentPdfUrl, 'Poosala_Lokesh_Belvo_LOR.pdf')}
                  </strong>{' '}
                  (Issued by {currentIssuer} · {currentSignatory}, {currentRole})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied LOR Text</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Letter Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => downloadDocument(currentPdfUrl, 'Poosala_Lokesh_Belvo_LOR.pdf')}
                  className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
                >
                  Download Direct PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default BelvoLorModal;
