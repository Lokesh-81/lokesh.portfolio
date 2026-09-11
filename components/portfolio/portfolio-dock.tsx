'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Home,
  Mail,
  ScrollText,
  Code2,
  SunMoon,
  User,
  Languages,
  Check,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { useLanguage, SUPPORTED_LANGUAGES, Language } from '@/i18n';

export interface PortfolioDockProps {
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

export function PortfolioDock({ activeSection = 'home', onSelectSection }: PortfolioDockProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isDark, setIsDark] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check initial theme from html class
    const isDarkInitial = document.documentElement.classList.contains('dark');
    setIsDark(isDarkInitial);
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLangOpen]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    }
  };

  const navItems = [
    {
      title: t('nav.home'),
      sectionId: 'home',
      icon: <Home className="h-full w-full" />,
      href: '#home',
    },
    {
      title: t('nav.about'),
      sectionId: 'about',
      icon: <User className="h-full w-full" />,
      href: '#about',
    },
    {
      title: t('nav.work'),
      sectionId: 'work',
      icon: <Briefcase className="h-full w-full" />,
      href: '#work',
    },
    {
      title: t('nav.skills'),
      sectionId: 'skills',
      icon: <Code2 className="h-full w-full" />,
      href: '#skills',
    },
    {
      title: t('nav.experience'),
      sectionId: 'experience',
      icon: <ScrollText className="h-full w-full" />,
      href: '#experience',
    },
    {
      title: t('nav.contact'),
      sectionId: 'contact',
      icon: <Mail className="h-full w-full" />,
      href: '#contact',
    },
    {
      title: t('nav.theme'),
      sectionId: 'theme',
      icon: <SunMoon className="h-full w-full" />,
      href: '#',
      onClick: toggleTheme,
    },
  ];

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-3 sm:top-5 left-1/2 z-50 max-w-[calc(100vw-20px)] -translate-x-1/2"
      ref={langRef}
    >
      <div className="relative">
        <Dock
          direction="top"
          magnification={48}
          distance={100}
          className="h-12 sm:h-14 items-center gap-1 sm:gap-2 rounded-full border border-zinc-200/80 bg-white/85 px-2 sm:px-3.5 shadow-lg backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/85"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.sectionId;

            return (
              <DockItem
                key={item.sectionId}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (onSelectSection && item.sectionId) {
                    onSelectSection(item.sectionId);
                  } else if (item.href.startsWith('#')) {
                    const target = document.querySelector(item.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', item.href);
                    }
                  }
                }}
                className={`aspect-square rounded-full border transition-all ${
                  isActive
                    ? 'border-purple-500/80 bg-purple-500/15 text-purple-600 shadow-sm dark:border-purple-400/80 dark:bg-purple-500/25 dark:text-purple-300 ring-2 ring-purple-500/20'
                    : 'border-transparent bg-transparent hover:border-zinc-200 hover:bg-zinc-100/80 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <DockLabel position="bottom">{item.title}</DockLabel>

                <DockIcon className="p-2 sm:p-2.5">
                  <span
                    className={
                      isActive
                        ? 'text-purple-600 dark:text-purple-300'
                        : 'text-zinc-600 dark:text-zinc-300'
                    }
                  >
                    {item.icon}
                  </span>
                </DockIcon>
              </DockItem>
            );
          })}

          {/* Clean Language Selector Dock Item */}
          <DockItem
            onClick={() => setIsLangOpen(!isLangOpen)}
            aria-label="Change language"
            aria-expanded={isLangOpen}
            aria-haspopup="true"
            className={`aspect-square rounded-full border transition-all ${
              isLangOpen
                ? 'border-purple-500/80 bg-purple-500/20 text-purple-600 dark:border-purple-400/80 dark:bg-purple-500/30 dark:text-purple-300 shadow-sm'
                : 'border-transparent bg-transparent hover:border-zinc-200 hover:bg-zinc-100/80 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300'
            }`}
          >
            <DockLabel position="bottom">{t('nav.language')}</DockLabel>

            <DockIcon className="p-2 sm:p-2.5">
              <span className="text-zinc-600 dark:text-zinc-300">
                <Languages className="h-full w-full" />
              </span>
            </DockIcon>
          </DockItem>
        </Dock>

        {/* Small, Premium Floating Language Dropdown */}
        {isLangOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-2 top-full mt-2.5 w-44 rounded-2xl border border-zinc-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-900 mb-1">
              {t('nav.language')}
            </div>

            <div className="space-y-0.5">
              {SUPPORTED_LANGUAGES.map((langOpt) => {
                const isSelected = language === langOpt.code;
                return (
                  <button
                    key={langOpt.code}
                    role="menuitem"
                    onClick={() => handleSelectLanguage(langOpt.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{langOpt.label}</span>
                      {langOpt.code !== 'en' && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                          ({langOpt.englishName})
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
