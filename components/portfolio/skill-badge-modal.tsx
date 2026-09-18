'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, ExternalLink, ShieldCheck, Award, Share2 } from 'lucide-react';
import { SkillBadge } from '@/lib/data/certifications';

export interface SkillBadgeModalProps {
  badge: SkillBadge | null;
  onClose: () => void;
}

export function SkillBadgeModal({ badge, onClose }: SkillBadgeModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (badge) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [badge, onClose]);

  if (!badge) return null;

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(`Google Cloud Skill Badge: ${badge.title} (${badge.level}) - Issued ${badge.issuedDate}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
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
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl border border-[#1F2937] bg-[#111827] shadow-2xl overflow-hidden flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1F2937] px-6 py-4 bg-[#0B132B]/90">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA]">
                <Award className="h-4 w-4 text-[#F9AB00]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#E0E7FF]">
                  Google Cloud Skill Badge Certificate
                </h3>
                <p className="text-[11px] font-mono text-[#A5B4FC]/70">
                  {badge.category} · {badge.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTitle}
                className="flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors cursor-pointer"
                title="Copy Credential Details"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy Info</span>
                  </>
                )}
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

          {/* Certificate Card Container (Authentic Google Cloud certificate design) */}
          <div className="p-6 sm:p-8 bg-[#080D1A] flex justify-center">
            <div className="relative w-full max-w-lg aspect-[1.38/1] bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 sm:p-9 flex flex-col justify-between text-center select-none overflow-hidden">
              {/* Top Google Cloud Branding */}
              <div className="flex items-center justify-center pt-1">
                <span className="font-semibold text-lg sm:text-2xl tracking-tight text-[#202124] flex items-center">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC04]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#5F6368] font-normal ml-1.5">Cloud</span>
                </span>
              </div>

              {/* Title & Domain Info */}
              <div className="my-auto py-2 flex flex-col items-center justify-center space-y-3">
                <h2 className="text-xl sm:text-3xl font-light tracking-tight text-[#202124] leading-snug font-sans">
                  {badge.title}
                </h2>

                <p className="text-sm sm:text-base text-[#5F6368] font-medium">
                  {badge.category}
                </p>

                <div className="w-14 h-[1px] bg-[#DADCE0] my-1" />

                <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#5F6368] uppercase font-mono">
                  SKILL BADGE · {badge.level.toUpperCase()}
                </p>
              </div>

              {/* Recipient & Metadata Footer */}
              <div className="border-t border-[#F1F3F4] pt-3 flex items-center justify-between text-[11px] font-mono text-[#5F6368]">
                <span>Awarded to: <strong className="text-[#202124]">P. Lokesh</strong></span>
                <span>Issued: <strong className="text-[#202124]">{badge.issuedDate}</strong></span>
              </div>

              {/* Google 4-color bottom stripe */}
              <div className="absolute bottom-0 left-0 right-0 h-2 flex w-full">
                <div className="w-[30%] bg-[#EA4335]" />
                <div className="w-[40%] bg-[#4285F4]" />
                <div className="w-[10%] bg-[#34A853]" />
                <div className="w-[20%] bg-[#FBBC04]" />
              </div>
            </div>
          </div>

          {/* Details & Competencies Section */}
          <div className="px-6 py-5 border-t border-[#1F2937] bg-[#111827] space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] mb-1">
                Badge Description & Scope
              </h4>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {badge.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#64748B] mb-2">
                Demonstrated Google Cloud Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {badge.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 font-mono text-[11px] text-[#E0E7FF]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#94A3B8] border-t border-[#1F2937]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Google Cloud Skill Accreditation</span>
              </div>

              <a
                href="https://www.cloudskillsboost.google"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#60A5FA] hover:text-[#93C5FD] transition-colors"
              >
                <span>Google Cloud Skills Boost</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
