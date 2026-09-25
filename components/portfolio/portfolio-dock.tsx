'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Languages, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  MagneticDock,
  DockIconHome,
  DockIconFolder,
  DockIconMail,
  DockIconUser,
  DockIconQuote,
  DockIconCpu,
  DockIconAward,
  DockIconBriefcase,
  type DockItemData,
} from '@/components/ui/magnetic-dock';

export interface PortfolioDockProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function PortfolioDock({
  activeSection = 'home',
  onSelectSection,
}: PortfolioDockProps) {
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const { testimonials } = usePortfolio();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publishedCount = (testimonials || []).filter((item) => item.isPublished !== false).length;

  // The 8 Main Portfolio Sections with Testimonials as the last before Contact
  const items: DockItemData[] = [
    {
      id: 'home',
      label: t('nav.home') || 'Home',
      icon: <DockIconHome />,
      isActive: activeSection === 'home',
    },
    {
      id: 'about',
      label: t('nav.about') || 'About',
      icon: <DockIconUser />,
      isActive: activeSection === 'about',
    },
    {
      id: 'work',
      label: t('nav.work') || 'Projects',
      icon: <DockIconFolder />,
      isActive: activeSection === 'work',
    },
    {
      id: 'skills',
      label: t('nav.skills') || 'Skills',
      icon: <DockIconCpu />,
      isActive: activeSection === 'skills',
    },
    {
      id: 'certifications',
      label: t('nav.certifications') || 'Certifications',
      icon: <DockIconAward />,
      isActive: activeSection === 'certifications',
    },
    {
      id: 'experience',
      label: t('nav.experience') || 'Experience',
      icon: <DockIconBriefcase />,
      isActive: activeSection === 'experience',
    },
    {
      id: 'testimonials',
      label: t('nav.testimonials') || 'Testimonials',
      icon: <DockIconQuote />,
      isActive: activeSection === 'testimonials',
    },
    {
      id: 'contact',
      label: t('nav.contact') || 'Contact',
      icon: <DockIconMail />,
      isActive: activeSection === 'contact',
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed top-3 sm:top-5 left-1/2 z-50 -translate-x-1/2 select-none max-w-[98vw]"
    >
      <div className="relative flex items-center gap-2" ref={langRef}>
        {/* Componentry Magnetic Dock Component */}
        <MagneticDock
          items={items}
          onSelect={(id) => onSelectSection?.(id)}
          baseSize={46}
          maxScale={1.38}
          distance={110}
        />

        {/* Language Switcher pill alongside the Magnetic Dock */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            title="Switch Language"
            aria-label="Switch Language"
            className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition-all cursor-pointer shadow-lg backdrop-blur-2xl ${
              isLangOpen
                ? 'border-[#60A5FA] bg-[#2563EB]/40 text-white shadow-[0_0_16px_rgba(96,165,250,0.5)]'
                : 'border-[#1F2937]/90 bg-[#0B132B]/85 text-[#60A5FA] hover:border-[#60A5FA]/60 hover:bg-[#1E293B]'
            }`}
          >
            <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Language Dropdown */}
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                role="menu"
                className="absolute right-0 top-full mt-3 w-56 max-h-72 overflow-y-auto custom-scrollbar rounded-2xl border border-[#1F2937] bg-[#111827]/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#A5B4FC]/70 border-b border-[#1F2937] mb-1">
                  {t('nav.language') || 'Select Language'}
                </div>

                <div className="space-y-0.5">
                  {supportedLanguages.map((langOpt) => {
                    const isSelected = language === langOpt.code;
                    return (
                      <button
                        key={langOpt.code}
                        role="menuitem"
                        onClick={() => {
                          setLanguage(langOpt.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB]/30 text-[#60A5FA] font-semibold'
                            : 'text-[#E0E7FF] hover:bg-[#1F2937]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{langOpt.label}</span>
                          <span className="text-[10px] text-[#A5B4FC]/70">
                            ({langOpt.englishName})
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-[#60A5FA]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default PortfolioDock;
