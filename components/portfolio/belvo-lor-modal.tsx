'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Copy,
  Printer,
  FileCheck2,
  Download,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  downloadDocument,
  getCleanDocDisplayName,
  dataUrlToBlob,
} from '@/lib/document-utils';

export interface BelvoLorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  title?: string;
}

export function BelvoLorModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
}: BelvoLorModalProps) {
  const { experiences } = usePortfolio();
  const [copiedText, setCopiedText] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [fitMode, setFitMode] = useState<'width' | 'page' | 'custom'>('page');
  const [blobDocUrl, setBlobDocUrl] = useState<string | null>(null);
  const [loadedPdfSource, setLoadedPdfSource] = useState<string>('');
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const belvoExp =
    experiences.find((e) => e.id === 'belvo') ||
    experiences.find((e) => e.company?.toLowerCase().includes('belvo'));

  const currentPdfUrl = pdfUrl || belvoExp?.lor?.pdfUrl || '/belvo-lor.pdf';
  const currentTitle = title || belvoExp?.lor?.title || 'Belvo Company — Letter of Recommendation';
  const currentIssuer = belvoExp?.lor?.issuer || 'Belvo Company';
  const currentSignatory = belvoExp?.lor?.issuedBy || 'Hrishikesh Mishra';
  const currentRole = belvoExp?.lor?.role || 'CEO, Belvo';

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  // Validate the actual document before rendering. Stale Studio URLs fall back
  // to the version-controlled public PDF instead of showing a blank iframe.
  useEffect(() => {
    if (!isOpen) return;
    let disposed = false;
    let objectUrl: string | null = null;
    const loadPdf = async () => {
      setIsPdfLoading(true); setPdfError(null); setBlobDocUrl(null); setLoadedPdfSource('');
      const sources = Array.from(new Set([currentPdfUrl, '/belvo-lor.pdf'].filter(Boolean)));
      let lastError: unknown = null;
      for (const source of sources) {
        try {
          let pdfBlob: Blob;
          if (source.startsWith('data:')) pdfBlob = dataUrlToBlob(source);
          else {
            const response = await fetch(source, { cache: 'no-store' });
            if (!response.ok) throw new Error(`PDF request failed with HTTP ${response.status}`);
            const contentType = response.headers.get('content-type') || '';
            if (contentType && !/(pdf|octet-stream)/i.test(contentType)) throw new Error(`Expected a PDF response, received ${contentType}`);
            pdfBlob = await response.blob();
          }
          const signature = new TextDecoder().decode(await pdfBlob.slice(0, 5).arrayBuffer());
          if (signature !== '%PDF-') throw new Error('The selected file is not a valid PDF document.');
          objectUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
          if (disposed) { URL.revokeObjectURL(objectUrl); return; }
          setBlobDocUrl(objectUrl); setLoadedPdfSource(source); setIsPdfLoading(false); return;
        } catch (error) { lastError = error; }
      }
      if (!disposed) { setPdfError(lastError instanceof Error ? lastError.message : 'The official PDF could not be loaded.'); setIsPdfLoading(false); }
    };
    void loadPdf();
    return () => { disposed = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [isOpen, currentPdfUrl, retryToken]);

  const viewerDocUrl = blobDocUrl || '';
  const pdfViewerUrl = React.useMemo(() => {
    if (!viewerDocUrl) return '';
    if (fitMode === 'page') return `${viewerDocUrl}#toolbar=1&navpanes=0&view=Fit`;
    if (fitMode === 'custom') return `${viewerDocUrl}#toolbar=1&navpanes=0&zoom=${zoomLevel}`;
    return `${viewerDocUrl}#toolbar=1&navpanes=0&view=FitH`;
  }, [viewerDocUrl, fitMode, zoomLevel]);

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
    try { iframeRef.current?.contentWindow?.print(); }
    catch { setPdfError('The browser could not open the PDF print dialog. Use Download PDF to print the document.'); }
  };

  const handleZoomIn = () => {
    setFitMode('custom');
    setZoomLevel((prev) => Math.min(prev + 15, 160));
  };

  const handleZoomOut = () => {
    setFitMode('custom');
    setZoomLevel((prev) => Math.max(prev - 15, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    setFitMode('page');
  };

  return typeof document === 'undefined' ? null : createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="portfolio-pdf-modal fixed inset-0 z-[10000] isolate flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="portfolio-pdf-backdrop fixed inset-0 z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="belvo-lor-dialog-title"
            className="portfolio-pdf-dialog relative z-10 w-full max-w-5xl h-[min(94dvh,980px)] max-h-[calc(100dvh-1rem)] rounded-xl sm:rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="portfolio-pdf-header relative flex flex-wrap items-center justify-between border-b px-4 sm:px-6 py-3.5 pr-14 gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="belvo-lor-dialog-title" className="text-sm sm:text-base font-semibold text-[#F5EAF5]">
                      Belvo Company — Letter of Recommendation
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-3 w-3" />
                      CEO Verified
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#D8B4E8]/70">
                    Official Document · Issued 22-09-2026 by Hrishikesh Mishra, CEO
                  </p>
                </div>
              </div>

              {/* Action Controls & Zoom */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Zoom Controls */}
                <div className="flex items-center flex-wrap rounded-xl border border-[#35263D] bg-[#1A1222] px-1 py-1 text-xs">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 text-[#BDA9C4] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#35263D]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-[#DCCFE0] min-w-[42px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 text-[#BDA9C4] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#35263D]"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  {zoomLevel !== 100 && (
                    <button
                      onClick={handleResetZoom}
                      className="p-1.5 text-[#BDA9C4] hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-[#35263D]"
                      title="Reset Zoom / Fit to Width"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <span className="mx-1 h-5 w-px bg-[#35263D]" />
                  <button
                    type="button"
                    onClick={() => setFitMode('width')}
                    aria-pressed={fitMode === 'width'}
                    className={`rounded-lg px-2 py-1.5 text-[10px] transition-colors ${fitMode === 'width' ? 'bg-[#35263D] text-white' : 'text-[#BDA9C4] hover:text-white'}`}
                    title="Fit PDF to viewer width"
                  >
                    Fit Width
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('page')}
                    aria-pressed={fitMode === 'page'}
                    className={`rounded-lg px-2 py-1.5 text-[10px] transition-colors ${fitMode === 'page' ? 'bg-[#35263D] text-white' : 'text-[#BDA9C4] hover:text-white'}`}
                    title="Fit the complete PDF page in the viewer"
                  >
                    Fit Page
                  </button>
                </div>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-[#35263D] bg-[#1A1222] px-3 py-1.5 text-xs font-medium text-[#DCCFE0] hover:border-purple-400 hover:text-white transition-colors cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Print</span>
                </button>

                {/* Download PDF button */}
                <button
                  type="button"
                  disabled={!blobDocUrl}
                  onClick={() => downloadDocument(blobDocUrl || '', 'Poosala_Lokesh_Belvo_LOR.pdf')}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  title="Download the official document file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>

                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => onCloseRef.current()}
                  className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-[#8B718F] bg-[#2A1C33] text-white shadow-lg hover:bg-[#49334F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B8D2] transition-colors cursor-pointer"
                  aria-label="Close PDF viewer"
                  title="Close PDF viewer (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Surface - High-Res Direct Vector or PDF Document Viewer */}
            <div className="portfolio-pdf-surface flex-1 min-h-0 overflow-hidden p-0 sm:p-2 flex justify-center items-stretch">
              {isPdfLoading ? (
                <div className="m-auto rounded-xl border border-[#35263D] bg-white p-6 text-center text-[#171719]"><span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#9b78b5] border-t-transparent" /><p className="mt-3 text-sm font-medium">Loading and verifying the official PDF…</p></div>
              ) : pdfError ? (
                <div role="alert" className="m-auto w-full max-w-[620px] rounded-xl border border-rose-300 bg-rose-50 p-6 text-center text-[#402b2b]"><p className="font-semibold">The PDF could not be displayed</p><p className="mt-2 text-sm">{pdfError}</p><button type="button" onClick={() => setRetryToken((value) => value + 1)} className="mt-4 rounded-lg border border-[#402b2b] px-4 py-2 text-sm font-semibold">Retry PDF</button></div>
              ) : blobDocUrl ? (
                <div
                  className="w-full h-full min-h-0 max-w-[1100px] flex justify-center"
                >
                  <iframe
                    ref={iframeRef}
                    src={pdfViewerUrl}
                    onError={() => setPdfError("The browser PDF viewer could not render this document.")}
                    title={currentTitle}
                    className="belvo-pdf-frame"
                    style={{ width: '100%', height: '100%' }}
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="w-full max-w-[820px] rounded-xl border border-[#35263D] bg-white p-8 text-center text-[#171719]">
                  The Belvo PDF URL is missing. Add the official PDF in Studio under Experience → Belvo → Letter of Recommendation.
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-[#35263D] bg-[#100B18]/95 text-xs text-[#DCCFE0] shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Official Document:{' '}
                  <strong className="text-white font-mono">
                    {getCleanDocDisplayName(loadedPdfSource || currentPdfUrl, 'Poosala_Lokesh_Belvo_LOR.pdf')}
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

</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default BelvoLorModal;
