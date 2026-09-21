'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { LanguageProvider } from '@/i18n';
import { PortfolioDock } from '@/components/portfolio/portfolio-dock';
import { Hero } from '@/components/portfolio/hero';
import { AboutSection } from '@/components/portfolio/about-section';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { CertificationsSection } from '@/components/portfolio/certifications-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';
import { Spotlight } from '@/components/core/spotlight';
import { Clock } from '@/components/core/sliding-number';

type SectionId = 'home' | 'about' | 'work' | 'skills' | 'certifications' | 'experience' | 'contact';

import { StudioApp } from './studio/StudioApp';

function PortfolioContent() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isStudioRoute, setIsStudioRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isPath = window.location.pathname.startsWith('/studio');
      const isHash = window.location.hash === '#studio' || window.location.hash.startsWith('#/studio');
      return isPath || isHash;
    }
    return false;
  });

  // Support direct URL hash and pathname loading on mount and popstate/hashchange
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkRoute = () => {
        const path = window.location.pathname;
        const hash = window.location.hash.replace('#', '');

        if (path.startsWith('/studio') || hash === 'studio' || hash.startsWith('/studio')) {
          setIsStudioRoute(true);
          return;
        }

        setIsStudioRoute(false);
        if (['home', 'about', 'work', 'skills', 'certifications', 'experience', 'contact'].includes(hash)) {
          setActiveSection(hash as SectionId);
        }
      };

      checkRoute();
      window.addEventListener('hashchange', checkRoute);
      window.addEventListener('popstate', checkRoute);
      return () => {
        window.removeEventListener('hashchange', checkRoute);
        window.removeEventListener('popstate', checkRoute);
      };
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'studio') {
      setIsStudioRoute(true);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '#studio');
      }
      return;
    }

    const validSection = sectionId as SectionId;
    setIsStudioRoute(false);
    setActiveSection(validSection);
    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/studio')) {
        window.history.pushState(null, '', `/#${validSection}`);
      } else {
        window.history.replaceState(null, '', `#${validSection}`);
      }
    }
  };

  const handleExitStudio = () => {
    setIsStudioRoute(false);
    setActiveSection('home');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/#home');
    }
  };

  if (isStudioRoute) {
    return <StudioApp onExitStudio={handleExitStudio} />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0B132B] text-[#E0E7FF] selection:bg-[#2563EB]/40 selection:text-[#E0E7FF] flex flex-col font-sans">
      {/* Global Mouse-Following Spotlight across whole portfolio background */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12)_0%,rgba(192,132,252,0.06)_40%,transparent_70%)] blur-3xl pointer-events-none"
        size={650}
      />

      {/* 1. Global Animated Floating Dock Navbar - Primary Navigation */}
      <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />

      {/* Prominent Live IST Clock Pill - Instantly visible on every section */}
      <div
        className="fixed top-3 sm:top-5 right-3 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-[#1F2937]/90 bg-[#0B132B]/90 px-3 sm:px-3.5 py-1.5 backdrop-blur-xl shadow-lg"
        title="Live Indian Standard Time (IST)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-semibold text-[#60A5FA] tracking-wider uppercase">
          IST
        </span>
        <span className="text-[#334155]">·</span>
        <Clock className="text-[#E0E7FF] font-medium text-[11px] sm:text-xs" />
      </div>

      {/* 2. Active Screen Viewport - Section switching strictly via navbar */}
      <main className="relative flex-1 pt-14 sm:pt-18 h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar"
          >
            <div className="flex-1 w-full flex flex-col justify-start">
              {activeSection === 'home' && <Hero onNavigate={handleNavigate} />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'work' && <ProjectsSection />}
              {activeSection === 'skills' && <SkillsSection />}
              {activeSection === 'certifications' && <CertificationsSection onNavigate={handleNavigate} />}
              {activeSection === 'experience' && <ExperienceSection />}
              {activeSection === 'contact' && <ContactSection />}
            </div>

            {/* Global Footer with Live IST Clock & Links inside the active view */}
            <Footer onNavigate={handleNavigate} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <LanguageProvider>
        <PortfolioContent />
      </LanguageProvider>
    </PortfolioProvider>
  );
}
