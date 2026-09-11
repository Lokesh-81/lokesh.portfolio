'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  HomeIcon,
  Activity,
  Package,
  Component,
  ScrollText,
  Mail,
  SunMoon,
  Languages,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { cn } from '@/lib/utils';

export interface PortfolioDockProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export function PortfolioDock({
  activeSection = 'home',
  onSelectSection,
}: PortfolioDockProps) {
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
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

  const navItems = [
    {
      id: 'home',
      title: t('nav.home') || 'Home',
      icon: HomeIcon,
    },
    {
      id: 'about',
      title: t('nav.about') || 'About',
      icon: Activity,
    },
    {
      id: 'work',
      title: t('nav.work') || 'Projects',
      icon: Package,
    },
    {
      id: 'skills',
      title: t('nav.skills') || 'Skills',
      icon: Component,
    },
    {
      id: 'experience',
      title: t('nav.experience') || 'Experience',
      icon: ScrollText,
    },
    {
      id: 'contact',
      title: t('nav.contact') || 'Contact',
      icon: Mail,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed top-3 sm:top-5 left-1/2 z-50 -translate-x-1/2 select-none max-w-[96vw]"
    >
      <div className="relative" ref={langRef}>
        <Dock
          direction="middle"
          magnification={52}
          distance={110}
          className="h-14 sm:h-16 gap-1.5 sm:gap-2.5 rounded-full border border-[#1F2937]/90 bg-[#0B132B]/90 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <DockItem
                key={item.id}
                onClick={() => onSelectSection?.(item.id)}
                className={cn(
                  'aspect-square rounded-full transition-all',
                  isActive
                    ? 'bg-[#2563EB]/40 border border-[#60A5FA]/80 shadow-[0_0_18px_rgba(96,165,250,0.5)]'
                    : 'bg-[#111827]/70 border border-[#1F2937]/70 hover:border-[#60A5FA]/50 hover:bg-[#1F2937]'
                )}
              >
                <DockLabel position="bottom" className="border-[#1F2937] bg-[#111827]/95 text-[#E0E7FF]">
                  {item.title}
                </DockLabel>
                <DockIcon className={cn(isActive ? 'text-[#60A5FA]' : 'text-[#A5B4FC]/80 hover:text-[#E0E7FF]')}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </DockIcon>
              </DockItem>
            );
          })}

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-[1px] bg-[#1F2937]/80 mx-0.5 sm:mx-1 self-center" />

          {/* Language Selector as DockItem */}
          <DockItem
            onClick={() => setIsLangOpen(!isLangOpen)}
            className={cn(
              'aspect-square rounded-full transition-all',
              isLangOpen
                ? 'border border-[#60A5FA] bg-[#2563EB]/40 text-[#60A5FA]'
                : 'border border-[#1F2937]/70 bg-[#111827]/70 text-[#60A5FA] hover:border-[#60A5FA]/50 hover:bg-[#1F2937]'
            )}
          >
            <DockLabel position="bottom" className="border-[#1F2937] bg-[#111827]/95 text-[#E0E7FF]">
              {t('nav.language') || 'Language'}
            </DockLabel>
            <DockIcon className="text-[#60A5FA]">
              <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
            </DockIcon>
          </DockItem>
        </Dock>

        {/* Language Dropdown Menu */}
        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              role="menu"
              className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 max-h-72 overflow-y-auto custom-scrollbar rounded-2xl border border-[#1F2937] bg-[#111827]/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50"
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
    </nav>
  );
}
