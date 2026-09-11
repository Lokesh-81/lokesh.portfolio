'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { LanguageProvider } from '@/i18n';
import { PortfolioDock } from '@/components/portfolio/portfolio-dock';
import { Hero } from '@/components/portfolio/hero';
import { AboutSection } from '@/components/portfolio/about-section';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';
import { Spotlight } from '@/components/core/spotlight';

type SectionId = 'home' | 'about' | 'work' | 'skills' | 'experience' | 'contact';

function PortfolioContent() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // Support direct URL hash loading on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as SectionId;
      if (['home', 'about', 'work', 'skills', 'experience', 'contact'].includes(hash)) {
        setActiveSection(hash);
      }
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    const validSection = sectionId as SectionId;
    setActiveSection(validSection);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${validSection}`);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0B132B] text-[#E0E7FF] selection:bg-[#2563EB]/40 selection:text-[#E0E7FF] flex flex-col font-sans">
      {/* Global Mouse-Following Spotlight across whole portfolio background */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12)_0%,rgba(192,132,252,0.06)_40%,transparent_70%)] blur-3xl pointer-events-none"
        size={650}
      />

      {/* 1. Global Animated Pill Dock Navbar */}
      <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />

      {/* 2. Main Application Viewport with Single Natural Scroll Container */}
      <main className="relative flex-1 pt-20 h-full w-full overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-full justify-between"
          >
            <div className="flex-1">
              {activeSection === 'home' && <Hero onNavigate={handleNavigate} />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'work' && <ProjectsSection />}
              {activeSection === 'skills' && <SkillsSection />}
              {activeSection === 'experience' && <ExperienceSection />}
              {activeSection === 'contact' && <ContactSection />}
            </div>

            {/* Shared Global Footer with Available for New Opportunities & Live IST Clock */}
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
