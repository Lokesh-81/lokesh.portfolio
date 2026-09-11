'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Home,
  Mail,
  ScrollText,
  Code2,
  SunMoon,
  User,
} from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';

export interface PortfolioDockProps {
  activeSection?: string;
  onSelectSection?: (section: string) => void;
}

const navItems = [
  {
    title: 'Home',
    sectionId: 'home',
    icon: <Home className="h-full w-full" />,
    href: '#home',
  },
  {
    title: 'About',
    sectionId: 'about',
    icon: <User className="h-full w-full" />,
    href: '#about',
  },
  {
    title: 'Work',
    sectionId: 'work',
    icon: <Briefcase className="h-full w-full" />,
    href: '#work',
  },
  {
    title: 'Skills',
    sectionId: 'skills',
    icon: <Code2 className="h-full w-full" />,
    href: '#skills',
  },
  {
    title: 'Experience',
    sectionId: 'experience',
    icon: <ScrollText className="h-full w-full" />,
    href: '#experience',
  },
  {
    title: 'Contact',
    sectionId: 'contact',
    icon: <Mail className="h-full w-full" />,
    href: '#contact',
  },
  {
    title: 'Theme',
    sectionId: 'theme',
    icon: <SunMoon className="h-full w-full" />,
    href: '#',
  },
];

export function PortfolioDock({ activeSection = 'home', onSelectSection }: PortfolioDockProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme from html class
    const isDarkInitial = document.documentElement.classList.contains('dark');
    setIsDark(isDarkInitial);
  }, []);

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

  const handleItemClick = (item: (typeof navItems)[number]) => {
    if (item.title === 'Theme') {
      toggleTheme();
      return;
    }

    if (onSelectSection && item.sectionId) {
      onSelectSection(item.sectionId);
    } else if (item.href.startsWith('#')) {
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', item.href);
      }
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-3 sm:top-5 left-1/2 z-50 max-w-[calc(100vw-20px)] -translate-x-1/2"
    >
      <Dock
        direction="top"
        magnification={50}
        distance={110}
        className="h-12 sm:h-14 items-center gap-1 sm:gap-2 rounded-full border border-zinc-200/80 bg-white/85 px-2 sm:px-3.5 shadow-lg backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/85"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.sectionId;

          return (
            <DockItem
              key={item.title}
              onClick={() => handleItemClick(item)}
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
      </Dock>
    </nav>
  );
}
