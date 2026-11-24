'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  ExternalLink,
  Download,
  AlertCircle,
  Copy,
  Check,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  openDocumentInNewTab,
  downloadDocument,
  getCleanDocDisplayName,
  dataUrlToBlob,
} from '@/lib/document-utils';
import { getCacheBustedUrl, getActiveResumeDocument, subscribeToPortfolioSync } from '@/lib/document-storage';

export interface UniversalDocumentViewerProps {
  url: string;
  title?: string;
  className?: string;
  height?: string | number;
  fallbackImage?: string;
}

export function UniversalDocumentViewer({
  url,
  title = 'Document',
  className = '',
  height = 800,
  fallbackImage,
}: UniversalDocumentViewerProps) {
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [activeDocName, setActiveDocName] = useState<string | null>(null);

  const cleanUrl = url || '';
  const documentUrl = useMemo(() => {
    if (!cleanUrl) return '';
    try {
      const parsed = new URL(cleanUrl, window.location.origin);
      if (parsed.hostname.endsWith('drive.google.com')) {
        const match = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const id = match?.[1] || parsed.searchParams.get('id');
        if (id) return 'https://drive.google.com/file/d/' + id + '/preview';
      }
    } catch {
      // Keep relative, data, and blob URLs unchanged.
    }
    return cleanUrl;
  }, [cleanUrl]);

  // Check IndexedDB for any uploaded active resume document
  useEffect(() => {
    let createdUrl: string | null = null;
    let isMounted = true;

    async function resolveDocument() {
      // 1. If explicit Data URL, convert directly to Blob URL
      if (cleanUrl.startsWith('data:')) {
        try {
          const blob = dataUrlToBlob(cleanUrl);
          createdUrl = URL.createObjectURL(blob);
          if (isMounted) setBlobUrl(createdUrl);
          return;
        } catch (err) {
          console.warn('[DocViewer] Could not convert dataUrl to Blob:', err);
        }
      }

      // 2. Use the IndexedDB backup only for local fallback paths.
      // Remote Studio URLs are authoritative and must never be replaced by a stale local PDF.
      const isLocalResumeFallback =
        cleanUrl === '/resume.pdf' ||
        cleanUrl.startsWith('/resume.pdf?') ||
        cleanUrl.startsWith('/uploads/');
      if (isLocalResumeFallback) {
        try {
          const stored = await getActiveResumeDocument();
          if (stored && stored.dataUrl && isMounted) {
            const blob = dataUrlToBlob(stored.dataUrl);
            createdUrl = URL.createObjectURL(blob);
            setBlobUrl(createdUrl);
            setActiveDocName(stored.name);
            return;
          }
        } catch (err) {
          console.warn('[DocViewer] Error resolving stored document:', err);
        }
      }

      if (isMounted) {
        setBlobUrl(null);
      }
    }

    resolveDocument();

    // Listen to real-time resume sync
    const unsubscribe = subscribeToPortfolioSync((ev) => {
      if (ev.action === 'resume_replaced' || ev.action === 'resume_updated') {
        resolveDocument();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [cleanUrl]);

  // Determine effective rendering URL with cache-busting for local assets
  const effectiveUrl = useMemo(() => {
    if (!cleanUrl) return '';
    if (blobUrl) return blobUrl;
    if (cleanUrl.startsWith('/resume.pdf') && !cleanUrl.includes('cb=') && !cleanUrl.includes('t=')) {
      return getCacheBustedUrl(cleanUrl);
    }
    return cleanUrl;
  }, [cleanUrl, blobUrl]);

  const isImageOrSvg =
    cleanUrl.endsWith('.svg') ||
    cleanUrl.endsWith('.png') ||
    cleanUrl.endsWith('.jpg') ||
    cleanUrl.endsWith('.jpeg') ||
    cleanUrl.endsWith('.webp') ||
    cleanUrl.startsWith('data:image/');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If it's an image or SVG file
  if (isImageOrSvg && !loadError) {
    return (
      <div className={`w-full flex flex-col items-center justify-center ${className}`}>
        <img
          src={effectiveUrl}
          alt={title}
          onError={() => {
            if (fallbackImage && effectiveUrl !== fallbackImage) {
              setLoadError(true);
            }
          }}
          className="w-full h-auto object-contain rounded-xl shadow-lg border border-slate-200/40 select-text"
        />
      </div>
    );
  }

  // If it's a PDF or other document format
  return (
    <div className={`w-full flex flex-col rounded-2xl overflow-hidden border border-[#D8C8C0] bg-[#F7F2EE] shadow-xl ${className}`}>
      {/* Top Document Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#F0E8E2] border-b border-[#D8C8C0]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8D5D8] text-[#9B6876]">
            <FileText className="h-4 w-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-semibold text-[#302925] truncate">
              {activeDocName || title}
            </h4>
            <span className="text-[10px] text-[#887A72] font-mono truncate block max-w-xs sm:max-w-md">
              {activeDocName
                ? `Uploaded File: ${activeDocName}`
                : cleanUrl.startsWith('data:')
                ? 'Active Uploaded Document (Ready)'
                : cleanUrl.startsWith('blob:')
                ? 'Active Document Stream'
                : cleanUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg border border-[#D8C8C0] bg-[#FBF8F5] px-2.5 py-1.5 text-[11px] text-[#62534D] hover:text-[#9B6876] transition-colors cursor-pointer"
            title="Copy document URL"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => openDocumentInNewTab(documentUrl || effectiveUrl || cleanUrl, activeDocName || title)}
            className="flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-[11px] text-[#CBD5E1] hover:border-[#B78391] hover:text-[#9B6876] transition-colors cursor-pointer"
            title="Open in standalone tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open Tab</span>
          </button>

          <button
            type="button"
            onClick={() => downloadDocument(effectiveUrl || cleanUrl, activeDocName || title)}
            className="flex items-center gap-1 rounded-lg bg-[#9B6876] hover:bg-[#865765] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-colors cursor-pointer"
            title="Download document file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Direct PDF iframe: browser-native viewer, with standalone actions above. */}
      <div className="w-full relative bg-[#EDE5DE] flex flex-col items-center justify-center min-h-[500px]">
        {effectiveUrl ? (
          <iframe
            src={`${(effectiveUrl.startsWith("blob:") || effectiveUrl.startsWith("data:") ? effectiveUrl : documentUrl) }#toolbar=1&navpanes=0&view=Fit`}
            title={title}
            className="w-full border-0 bg-[#FBF8F5]"
            style={{ height: typeof height === 'number' ? `${height}px` : height }}
            loading="eager"
          />
        ) : (
          <div className="p-12 text-center text-stone-600 text-xs">Document URL is unavailable.</div>
        )}
      </div>
    </div>
  );
}

export default UniversalDocumentViewer;
