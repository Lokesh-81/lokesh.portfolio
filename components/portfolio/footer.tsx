'use client';

import React from 'react';
import { Spotlight } from '@/components/core/spotlight';
import { Clock } from '@/components/core/sliding-number';
import { useLanguage } from '@/i18n';

export interface FooterProps {
  onNavigate?: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-auto border-t border-[#1F2937] bg-[#0B132B]/95 px-4 sm:px-8 py-8 backdrop-blur-md overflow-hidden">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15)_0%,rgba(192,132,252,0.08)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={400}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Clean Copyright & Social Navigation Row */}
        <div className="flex flex-col items-center justify-between gap-4 pb-6 sm:flex-row text-xs text-[#64748B]">
          {/* Exact required format: POOSALA LOKESH · HYDERABAD, INDIA · © 2026 Poosala Lokesh */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[#E0E7FF] text-center sm:text-left">
            <span className="font-bold tracking-wider">POOSALA LOKESH</span>
            <span className="text-[#334155]">·</span>
            <span className="text-xs text-[#CBD5E1] tracking-wider uppercase">
              {t('footer.location') || 'HYDERABAD, INDIA'}
            </span>
            <span className="text-[#334155]">·</span>
            <span className="text-[11px] text-[#A5B4FC]/80 font-normal">
              © {new Date().getFullYear()} Poosala Lokesh · {t('footer.rights') || 'All rights reserved.'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#CBD5E1]">
            <a
              href="https://lokesh-portfolio-drab.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              Portfolio
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href="https://github.com/Lokesh-81"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              GitHub
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href="https://www.linkedin.com/in/poosala-lokesh/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href="https://www.instagram.com/_lokesh81/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F9A8D4] transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Live IST Clock & Discreet Studio entry */}
        <div className="border-t border-[#1F2937]/50 pt-5 flex items-center justify-between">
          <div className="w-16">
            <button
              onClick={() => onNavigate?.('studio')}
              className="text-[10px] text-[#334155] hover:text-[#60A5FA] transition-colors cursor-pointer flex items-center gap-1 font-mono"
              title="Admin Studio CMS"
            >
              <span>⚙ studio</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#1F2937] bg-[#111827]/80 px-4 py-1.5 shadow-sm">
            <span className="font-mono text-[11px] font-semibold text-[#60A5FA] tracking-wider uppercase">
              IST Live Clock
            </span>
            <span className="text-[#334155]">·</span>
            <Clock />
          </div>

          <div className="w-16" />
        </div>
      </div>
    </footer>
  );
}
