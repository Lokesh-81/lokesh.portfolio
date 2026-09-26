'use client';

import React, { useState } from 'react';
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

  const cleanUrl = url || '';
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
          src={cleanUrl}
          alt={title}
          onError={() => {
            if (fallbackImage && cleanUrl !== fallbackImage) {
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
    <div className={`w-full flex flex-col rounded-2xl overflow-hidden border border-[#1F2937] bg-[#070B18] shadow-2xl ${className}`}>
      {/* Top Document Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0B132B] border-b border-[#1F2937]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <FileText className="h-4 w-4" />
          </div>
          <div className="truncate">
            <h4 className="text-xs font-semibold text-[#E0E7FF] truncate">{title}</h4>
            <span className="text-[10px] text-[#94A3B8] font-mono truncate block max-w-xs sm:max-w-md">
              {cleanUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-[11px] text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
            title="Copy document URL"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
          </button>

          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1.5 text-[11px] text-[#CBD5E1] hover:border-blue-400 hover:text-white transition-colors cursor-pointer"
            title="Open in standalone tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open Tab</span>
          </a>

          <a
            href={cleanUrl}
            download={title.replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf'}
            className="flex items-center gap-1 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-colors cursor-pointer"
            title="Download document file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Embedded Document Frame */}
      <div className="w-full relative bg-slate-900/90 flex flex-col items-center justify-center min-h-[500px]">
        {cleanUrl ? (
          <object
            data={`${cleanUrl}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className="w-full rounded-b-xl"
            style={{ height: typeof height === 'number' ? `${height}px` : height }}
          >
            <iframe
              src={`${cleanUrl}#toolbar=0`}
              title={title}
              className="w-full border-0 rounded-b-xl"
              style={{ height: typeof height === 'number' ? `${height}px` : height }}
            >
              {/* Fallback card if browser refuses inline iframe/object */}
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Your browser has restricted inline PDF previews. You can view or download the replaced document directly using the buttons below.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={cleanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Replaced Document</span>
                  </a>
                  <a
                    href={cleanUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </iframe>
          </object>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2 text-amber-500/60" />
            <span>No document URL has been provided or attached yet.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversalDocumentViewer;
