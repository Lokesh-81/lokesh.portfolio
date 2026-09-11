'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const mainRef = useRef<HTMLElement>(null);
  const isProgrammaticScroll = useRef(false);

  // Active section tracking on scroll
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const sections: SectionId[] = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

    let isTicking = false;
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (!mainEl) {
            isTicking = false;
            return;
          }
          // The dock is fixed at top (~80px height), offset check by 180px
          const scrollPosition = mainEl.scrollTop + 180;

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPosition) {
              setActiveSection(sections[i]);
              break;
            }
          }
          isTicking = false;
        });
        isTicking = true;
      }
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', handleScroll);
  }, []);

  // Support direct URL hash loading on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleHash = () => {
        const hash = window.location.hash.replace('#', '') as SectionId;
        if (['home', 'about', 'work', 'skills', 'experience', 'contact'].includes(hash)) {
          setActiveSection(hash);
          setTimeout(() => {
            const targetEl = document.getElementById(hash);
            if (targetEl && mainRef.current) {
              const topPos = targetEl.offsetTop - 80;
              mainRef.current.scrollTo({
                top: Math.max(0, topPos),
                behavior: 'smooth',
              });
            }
          }, 150);
        }
      };

      handleHash();
      window.addEventListener('hashchange', handleHash);
      return () => window.removeEventListener('hashchange', handleHash);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    const validSection = sectionId as SectionId;
    setActiveSection(validSection);
    const targetEl = document.getElementById(validSection);
    if (targetEl && mainRef.current) {
      isProgrammaticScroll.current = true;
      const topPos = targetEl.offsetTop - 80;
      mainRef.current.scrollTo({
        top: Math.max(0, topPos),
        behavior: 'smooth',
      });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${validSection}`);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-x-hidden overflow-y-hidden bg-[#0B132B] text-[#E0E7FF] selection:bg-[#2563EB]/40 selection:text-[#E0E7FF] flex flex-col font-sans">
      {/* Global Mouse-Following Spotlight across whole portfolio background */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12)_0%,rgba(192,132,252,0.06)_40%,transparent_70%)] blur-3xl pointer-events-none"
        size={650}
      />

      {/* 1. Global Animated Pill Dock Navbar */}
      <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />

      {/* 2. Main Application Viewport with Single Natural Scroll Container */}
      <main
        ref={mainRef}
        className="relative flex-1 pt-16 sm:pt-20 h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth"
      >
        <div className="flex flex-col w-full min-h-full">
          {/* Home / Hero Section */}
          <section id="home" className="w-full">
            <Hero onNavigate={handleNavigate} />
          </section>

          {/* About Section */}
          <section id="about" className="w-full">
            <AboutSection />
          </section>

          {/* Work / Projects Section */}
          <section id="work" className="w-full">
            <ProjectsSection />
          </section>

          {/* Skills Section */}
          <section id="skills" className="w-full">
            <SkillsSection />
          </section>

          {/* Experience Section */}
          <section id="experience" className="w-full">
            <ExperienceSection />
          </section>

          {/* Contact Section */}
          <section id="contact" className="w-full">
            <ContactSection />
          </section>

          {/* Shared Global Footer with Available for New Opportunities & Live IST Clock */}
          <Footer onNavigate={handleNavigate} />
        </div>
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
