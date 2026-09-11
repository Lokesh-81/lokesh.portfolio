'use client';

import React from 'react';
import { Spotlight } from '@/components/core/spotlight';
import { TechStackSlider } from '@/components/portfolio/tech-stack-slider';
import { Clock } from '@/components/core/sliding-number';
import { TextEffect } from '@/components/core/text-effect';
import { useLanguage } from '@/i18n';

export interface FooterProps {
  onNavigate?: (section: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-auto border-t border-[#1F2937] bg-[#0B132B]/95 px-4 sm:px-8 pt-8 pb-10 backdrop-blur-md overflow-hidden">
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.18)_0%,rgba(192,132,252,0.1)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={400}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* 1. AVAILABLE FOR NEW OPPORTUNITIES - Exclusively placed in Footer per requirement */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1F2937]/70 pb-5">
          <div className="flex items-center gap-2.5 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-2 text-xs font-semibold text-[#2DD4BF]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2DD4BF]" />
            </span>
            <span className="font-mono text-[11px] tracking-wider uppercase">
              {t('hero.statusBadge')}
            </span>
          </div>

          <div className="text-xs text-[#CBD5E1]">
            <span className="font-medium text-[#E0E7FF]">{t('hero.location')}</span>
          </div>
        </div>

        {/* 2. Footer Main Content & Tech Ticker */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#60A5FA]">
              <TextEffect per="word" delay={0.1}>
                {t('hero.techTicker')}
              </TextEffect>
            </span>
          </div>
          <TechStackSlider />
        </div>

        {/* 3. Footer Links, Social & Credits */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1F2937]/70 pt-5 pb-6 sm:flex-row text-xs text-[#64748B]">
          <div className="flex items-center gap-2 font-mono text-[#E0E7FF]">
            <span className="font-bold tracking-wider">POOSALA LOKESH</span>
            <span className="text-[#334155]">·</span>
            <span className="text-xs text-[#CBD5E1]">{t('footer.location')}</span>
            <span className="text-[#334155]">·</span>
            <span className="text-[11px] text-[#64748B]">
              © {new Date().getFullYear()} Poosala Lokesh
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#CBD5E1]">
            <a
              href="https://github.com/Lokesh-81"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              GitHub (Lokesh-81)
            </a>
            <span className="text-[#334155]">·</span>
            <a
              href="https://github.com/lokeshnaivaidya-max"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#60A5FA] transition-colors"
            >
              GitHub (naivaidya-max)
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
            <button
              onClick={() => onNavigate?.('contact')}
              className="hover:text-[#60A5FA] transition-colors cursor-pointer"
            >
              {t('footer.contact')}
            </button>
          </div>
        </div>

        {/* 4. Live IST Clock as the ABSOLUTE FINAL, BOTTOM-MOST ELEMENT */}
        <div className="border-t border-[#1F2937]/50 pt-5 flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#1F2937] bg-[#111827]/80 px-4 py-1.5 shadow-sm">
            <span className="font-mono text-[11px] font-semibold text-[#60A5FA] tracking-wider uppercase">
              IST Live Clock
            </span>
            <span className="text-[#334155]">·</span>
            <Clock />
          </div>
        </div>
      </div>
    </footer>
  );
}
