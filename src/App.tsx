'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { LanguageProvider } from '@/i18n';
import { PortfolioDock } from '@/components/portfolio/portfolio-dock';
import { Hero } from '@/components/portfolio/hero';
import { AboutSection } from '@/components/portfolio/about-section';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { TestimonialsSection } from '@/components/portfolio/testimonials-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { CertificationsSection } from '@/components/portfolio/certifications-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';
import { Clock } from '@/components/core/sliding-number';
import { LoadingScreen } from '@/components/portfolio/loading-screen';
import { StudioApp } from './studio/StudioApp';
import { trackEvent } from '@/lib/analytics';
import { ErrorBoundary } from '@/components/core/error-boundary';
import NightSceneBacklit from '@/components/core/night-scene-backlit';
import { NotFound } from '@/components/ui/not-found';

type SectionId =
  | 'home'
  | 'about'
  | 'work'
  | 'skills'
  | 'certifications'
  | 'experience'
  | 'testimonials'
  | 'contact';

const SECTION_IDS: SectionId[] = [
  'home',
  'about',
  'work',
  'skills',
  'certifications',
  'experience',
  'testimonials',
  'contact',
];

function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const isStudio = window.location.pathname.startsWith('/studio') || window.location.hash.includes('studio');
      return !isStudio;
    }
    return true;
  });

  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isStudioRoute, setIsStudioRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isPath = window.location.pathname.startsWith('/studio');
      const isHash = window.location.hash === '#studio' || window.location.hash.startsWith('#/studio');
      return isPath || isHash;
    }
    return false;
  });
  const [isNotFound, setIsNotFound] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (sectionId: SectionId, behavior: ScrollBehavior = 'smooth') => {
    const target = document.getElementById(sectionId);
    target?.scrollIntoView({ behavior, block: 'start' });
  };

  // Keep direct hash links, browser history, and the Studio route working.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');

      if (path.startsWith('/studio') || hash === 'studio' || hash.startsWith('/studio')) {
        setIsStudioRoute(true);
        setIsNotFound(false);
        return;
      }

      setIsStudioRoute(false);

      if (!hash) {
        setIsNotFound(false);
        setActiveSection('home');
        scrollToSection('home', 'auto');
      } else if (SECTION_IDS.includes(hash as SectionId)) {
        const sectionId = hash as SectionId;
        setIsNotFound(false);
        setActiveSection(sectionId);
        scrollToSection(sectionId, 'auto');
      } else {
        setIsNotFound(true);
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Update the dock's active item as the user scrolls through the real page.
  useEffect(() => {
    const root = mainRef.current;
    if (!root || isStudioRoute || typeof IntersectionObserver === 'undefined') return;

    const sections = root.querySelectorAll<HTMLElement>('[data-portfolio-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!current) return;
        const sectionId = (current.target as HTMLElement).dataset.portfolioSection as SectionId;
        if (!SECTION_IDS.includes(sectionId)) return;

        setActiveSection(sectionId);
        if (window.location.hash !== `#${sectionId}`) {
          window.history.replaceState(null, '', `#${sectionId}`);
        }
      },
      {
        root,
        rootMargin: '-12% 0px -58% 0px',
        threshold: [0, 0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isStudioRoute]);

  useEffect(() => {
    trackEvent(activeSection || 'home', 'pageview');
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'studio') {
      trackEvent('studio', 'navigation');
      setIsStudioRoute(true);
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '#studio');
      }
      return;
    }

    if (!SECTION_IDS.includes(sectionId as SectionId)) return;
    const validSection = sectionId as SectionId;
    trackEvent(validSection, 'navigation');
    setIsStudioRoute(false);
    setIsNotFound(false);
    setActiveSection(validSection);

    if (typeof window !== 'undefined') {
      if (window.location.pathname.startsWith('/studio')) {
        window.history.pushState(null, '', `/#${validSection}`);
      } else {
        window.history.replaceState(null, '', `#${validSection}`);
      }
    }

    scrollToSection(validSection);
  };

  const handleExitStudio = () => {
    setIsStudioRoute(false);
    setActiveSection('home');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/#home');
    }
    requestAnimationFrame(() => scrollToSection('home', 'auto'));
  };

  if (isNotFound) {
    return (
      <NotFound
        onReturnHome={() => {
          setIsNotFound(false);
          handleNavigate('home');
        }}
      />
    );
  }

  if (isStudioRoute) {
    return <StudioApp onExitStudio={handleExitStudio} />;
  }

  return (
    <>
      {/* Starting Loading Screen with Lokesh Signature handwriting animation */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className="relative isolate flex h-screen w-full flex-col overflow-hidden bg-[#100B18] text-[#F5EAF5] selection:bg-[#A77BC2]/40 selection:text-[#F5EAF5] font-sans">
        <NightSceneBacklit
          background="#100B18"
          blossomColor="#E8B8D2"
          speed={65}
          petals={105}
          wind={24}
          scale={100}
          glow={42}
          direction="right"
          style={{ position: 'absolute', inset: 0, zIndex: 0, minWidth: 0, minHeight: 0 }}
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          {/* Existing global navigation stays in place. */}
          <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />

          {/* Existing live IST clock stays in place. */}
          <div
            className="fixed top-3 sm:top-5 right-3 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-[#35263D]/90 bg-[#100B18]/90 px-3 sm:px-3.5 py-1.5 backdrop-blur-xl shadow-lg"
            title="Live Indian Standard Time (IST)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-[#E8B8D2] tracking-wider uppercase">
              IST
            </span>
            <span className="text-[#59445F]">·</span>
            <Clock className="text-[#F5EAF5] font-medium text-[11px] sm:text-xs" />
          </div>

          {/* One continuous vertical page: existing sections, original order, no new cards. */}
          <main
            ref={mainRef}
            aria-label="Portfolio sections"
            className="relative min-h-0 flex-1 w-full overflow-x-hidden overflow-y-auto custom-scrollbar scroll-smooth pt-14 sm:pt-18"
          >
            <section
              id="home"
              data-portfolio-section="home"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 1 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <Hero onNavigate={handleNavigate} />
              </div>
            </section>

            <section
              id="about"
              data-portfolio-section="about"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 2 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <AboutSection />
              </div>
            </section>

            <section
              id="work"
              data-portfolio-section="work"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 3 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <ProjectsSection />
              </div>
            </section>

            <section
              id="skills"
              data-portfolio-section="skills"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 4 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <SkillsSection />
              </div>
            </section>

            <section
              id="certifications"
              data-portfolio-section="certifications"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 6 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <CertificationsSection onNavigate={handleNavigate} />
              </div>
            </section>

            <section
              id="experience"
              data-portfolio-section="experience"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 5 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <ExperienceSection onNavigate={handleNavigate} />
              </div>
            </section>

            <section
              id="testimonials"
              data-portfolio-section="testimonials"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 7 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <TestimonialsSection />
              </div>
            </section>

            <section
              id="contact"
              data-portfolio-section="contact"
              className="sticky top-0 w-full min-h-[calc(100svh-4.5rem)]"
              style={{ zIndex: 8 }}
            >
              <div className="flex min-h-[calc(100svh-4.5rem)] w-full flex-col justify-start">
                <ContactSection />
              </div>
            </section>

            {/* Footer remains last, as it was after the active section. */}
            <div className="relative z-[9] w-full">
              <Footer onNavigate={handleNavigate} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <LanguageProvider>
          <PortfolioContent />
        </LanguageProvider>
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
