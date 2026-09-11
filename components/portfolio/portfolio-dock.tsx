'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  User,
  Briefcase,
  Sparkles,
  ScrollText,
  Mail,
  Languages,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n';

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
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
      icon: Home,
    },
    {
      id: 'about',
      title: t('nav.about') || 'About',
      icon: User,
    },
    {
      id: 'work',
      title: t('nav.work') || 'Work',
      icon: Briefcase,
    },
    {
      id: 'skills',
      title: t('nav.skills') || 'Skills',
      icon: Sparkles,
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
      className="fixed top-5 sm:top-6 left-1/2 z-50 -translate-x-1/2 select-none"
    >
      <div className="relative" ref={langRef}>
        {/* Floating spacious frosted glass container */}
        <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-[#1F2937]/90 bg-[#0B132B]/85 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.button
                  whileHover={{ scale: 1.14, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => onSelectSection?.(item.id)}
                  aria-label={item.title}
                  className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#60A5FA]'
                      : 'text-[#A5B4FC]/80 hover:text-[#E0E7FF]'
                  }`}
                >
                  {/* Smooth Active Indicator Gliding Pill with layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-[#2563EB]/40 to-[#1D4ED8]/25 border border-[#60A5FA]/60 shadow-[0_0_20px_rgba(96,165,250,0.45)]"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Circular Button Outline & subtle background when inactive */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full border border-[#1F2937]/60 bg-[#111827]/60 transition-colors hover:border-[#60A5FA]/50 hover:bg-[#1F2937]/80" />
                  )}

                  <Icon className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 transition-transform" />
                </motion.button>

                {/* Refined Floating Tooltip */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#1F2937] bg-[#111827]/95 px-2.5 py-1 text-[11px] font-medium text-[#E0E7FF] shadow-lg backdrop-blur-md"
                    >
                      {item.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-[1px] bg-[#1F2937]/80 mx-0.5 sm:mx-1" />

          {/* Language Selector Button */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredItem('language')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.button
              whileHover={{ scale: 1.14, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t('nav.language') || 'Language'}
              className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-colors cursor-pointer ${
                isLangOpen
                  ? 'border border-[#60A5FA] bg-[#2563EB]/30 text-[#60A5FA]'
                  : 'border border-[#1F2937]/60 bg-[#111827]/60 text-[#60A5FA] hover:border-[#60A5FA]/50 hover:bg-[#1F2937]/80'
              }`}
            >
              <Languages className="relative z-10 h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            {/* Tooltip for Language */}
            <AnimatePresence>
              {hoveredItem === 'language' && !isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#1F2937] bg-[#111827]/95 px-2.5 py-1 text-[11px] font-medium text-[#E0E7FF] shadow-lg backdrop-blur-md"
                >
                  {t('nav.language') || 'Language'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
