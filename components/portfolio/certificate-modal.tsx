'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Download, ExternalLink, ShieldCheck, Printer } from 'lucide-react';
import { GcpBadge } from '@/components/portfolio/gcp-badge';

export interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ isOpen, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  const credentialId = '7cffa63ad06d4fda872934393093d928';
  const seriesId = '128554';
  const issueDate = 'Sep 17, 2026';
  const expirationDate = 'Sep 17, 2028';
  const candidateName = 'P. Lokesh';
  const certifiedAs = 'Poosala Lokesh';

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(credentialId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B132B]/85 backdrop-blur-xl -z-10"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl rounded-3xl border border-[#1F2937] bg-[#111827] shadow-2xl overflow-hidden flex flex-col my-auto"
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-[#1F2937] px-6 py-4 bg-[#0B132B]/90">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#E0E7FF]">
                    Official Google Cloud Certificate
                  </h3>
                  <p className="text-[11px] font-mono text-[#A5B4FC]/70">
                    Series #{seriesId} · ID: {credentialId.slice(0, 8)}...
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors cursor-pointer"
                  title="Copy Certificate ID"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Copy ID</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors cursor-pointer"
                  title="Print or Save Certificate PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1F2937] bg-[#111827] text-[#CBD5E1] hover:bg-[#1F2937] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Certificate Preview Surface (Styled to match the official Google Cloud PDF) */}
            <div className="p-4 sm:p-8 bg-[#080D1A] overflow-x-auto flex justify-center">
              <div
                id="printable-certificate"
                className="relative w-full max-w-[760px] aspect-[1.33/1] bg-white text-[#202124] p-8 sm:p-12 rounded-xl shadow-2xl flex flex-col justify-between border border-[#E2E8F0] select-none"
              >
                {/* Certificate Decorative Top Border Line */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] rounded-t-xl" />

                {/* Header: Google Cloud Logo */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="font-bold text-2xl sm:text-3xl tracking-tight text-[#202124] flex items-center gap-1">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC04]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                    <span className="text-[#5F6368] font-normal ml-1">Cloud</span>
                  </span>
                </div>

                {/* Certificate Core Statement */}
                <div className="text-center space-y-3 sm:space-y-4 my-auto py-4">
                  <p className="text-xs sm:text-sm font-medium text-[#5F6368] tracking-wide">
                    This acknowledges that
                  </p>

                  <h2 className="text-3xl sm:text-5xl font-light text-[#202124] tracking-tight font-serif">
                    {candidateName}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5F6368] max-w-md mx-auto leading-relaxed">
                    has successfully completed all the requirements to be recognized as a
                  </p>

                  <div className="space-y-1">
                    <p className="text-base sm:text-xl font-normal text-[#5F6368]">
                      Google Cloud Certified
                    </p>
                    <h3 className="text-2xl sm:text-4xl font-bold text-[#202124] tracking-tight">
                      Professional Cloud Architect
                    </h3>
                  </div>
                </div>

                {/* Footer: Metadata + Signature + Official Seal Badge */}
                <div className="grid grid-cols-3 items-end pt-6 border-t border-[#E8EAED]">
                  {/* Left Column: Credentials Info */}
                  <div className="text-left text-[10px] sm:text-xs text-[#5F6368] space-y-0.5 font-mono">
                    <p>
                      <span className="font-semibold text-[#202124]">Series ID:</span> {seriesId}
                    </p>
                    <p>
                      <span className="font-semibold text-[#202124]">Issued Date:</span> {issueDate}
                    </p>
                    <p>
                      <span className="font-semibold text-[#202124]">Expiration Date:</span> {expirationDate}
                    </p>
                    <p className="truncate max-w-[200px]" title={credentialId}>
                      <span className="font-semibold text-[#202124]">ID:</span> {credentialId}
                    </p>
                    <p>
                      <span className="font-semibold text-[#202124]">Certified As:</span> {certifiedAs}
                    </p>
                  </div>

                  {/* Center Column: Signature */}
                  <div className="text-center flex flex-col items-center justify-end pb-1">
                    {/* Authentic Styled Thomas Kurian Signature SVG */}
                    <div className="h-10 sm:h-12 w-28 sm:w-36 flex items-center justify-center">
                      <svg viewBox="0 0 160 50" className="w-full h-full stroke-[#202124] fill-none">
                        <path
                          d="M 15 28 Q 28 8, 38 18 T 50 35 M 42 12 Q 58 6, 75 22 T 90 28 M 70 20 Q 88 12, 102 32 M 95 18 L 135 24 M 110 36 Q 125 15, 145 28"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="border-t border-[#9AA0A6] w-28 sm:w-36 pt-1">
                      <p className="text-[11px] sm:text-xs font-semibold text-[#202124]">Thomas Kurian</p>
                      <p className="text-[9px] sm:text-[10px] text-[#5F6368]">CEO, Google Cloud</p>
                    </div>
                  </div>

                  {/* Right Column: Google Cloud Architect Emblem Badge */}
                  <div className="flex justify-end items-end">
                    <div className="w-20 h-20 sm:w-28 sm:h-28">
                      <GcpBadge size={110} showGlow={false} interactive={false} className="w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#1F2937] bg-[#0B132B]/90 text-xs">
              <div className="flex items-center gap-2 text-[#CBD5E1]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified credential status: <strong className="text-emerald-400 font-semibold">Active</strong> (Valid through Sep 17, 2028)</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://www.credential.net/${credentialId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Verify on Google Directory</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
