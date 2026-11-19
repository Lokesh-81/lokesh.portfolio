'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { ActiveTheoryField } from '@/components/core/active-theory-field';
import { NotFound } from '@/components/ui/not-found';

type SectionId = 'home' | 'about' | 'work' | 'skills' | 'certifications' | 'experience' | 'testimonials' | 'contact';
const sectionIds: SectionId[] = ['home', 'about', 'work', 'skills', 'experience', 'certifications', 'testimonials', 'contact'];

function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !(window.location.pathname.startsWith('/studio') || window.location.hash.includes('studio'));
  });
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isStudioRoute, setIsStudioRoute] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/studio') || window.location.hash === '#studio' || window.location.hash.startsWith('#/studio');
  });
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
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
        return;
      }
      if (sectionIds.includes(hash as SectionId)) {
        setIsNotFound(false);
        setActiveSection(hash as SectionId);
        window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
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

  useEffect(() => {
    trackEvent('home', 'pageview');
  }, []);

  useEffect(() => {
    if (isStudioRoute) return;
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.38;
      let current: SectionId = 'home';
      for (const id of sectionIds) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= marker) current = id;
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [isStudioRoute]);

  const handleNavigate = useCallback((section: string) => {
    if (section === 'studio') {
      trackEvent('studio', 'navigation');
      setIsStudioRoute(true);
      window.history.pushState(null, '', '#studio');
      window.scrollTo({ top: 0 });
      return;
    }
    if (!sectionIds.includes(section as SectionId)) return;
    const id = section as SectionId;
    trackEvent(id, 'navigation');
    setIsStudioRoute(false);
    setIsNotFound(false);
    setActiveSection(id);
    window.history.replaceState(null, '', `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleExitStudio = () => {
    setIsStudioRoute(false);
    setActiveSection('home');
    window.history.pushState(null, '', '/#home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isNotFound) return <NotFound onReturnHome={() => { setIsNotFound(false); handleNavigate('home'); }} />;
  if (isStudioRoute) return <StudioApp onExitStudio={handleExitStudio} />;

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="portfolio-shell min-h-screen w-full bg-[#f5f1e9] text-[#25231f] selection:bg-[#d8b9a5]/50 selection:text-[#25231f]">
        <header className="portfolio-header">
          <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />
          <div className="portfolio-clock" title="Live Indian Standard Time">
            <span className="portfolio-clock-dot" />
            <span>IST</span><span className="portfolio-clock-divider">·</span><Clock />
          </div>
        </header>

        <main className="portfolio-main">
          <section id="home" className="portfolio-hero-stage scroll-mt-24">
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
            <ActiveTheoryField />
            <div className="portfolio-hero-content"><Hero onNavigate={handleNavigate} /></div>
            <div className="portfolio-hero-index"><span>INDEPENDENT DEVELOPER</span><span>HYDERABAD · INDIA</span></div>
          </section>

          <div className="portfolio-editorial">
            <section id="about" className="portfolio-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>01 / THE PERSON</span><span>ABOUT</span></div>
              <AboutSection />
            </section>
            <section id="work" className="portfolio-section portfolio-work-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>02 / SELECTED PROJECTS</span><span>WORK</span></div>
              <ProjectsSection />
            </section>
            <section id="skills" className="portfolio-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>03 / WHAT I DO</span><span>CAPABILITIES</span></div>
              <SkillsSection />
            </section>
            <section id="experience" className="portfolio-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>04 / WHERE I'VE BEEN</span><span>EXPERIENCE</span></div>
              <ExperienceSection onNavigate={handleNavigate} />
            </section>
            <section id="certifications" className="portfolio-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>05 / CONTINUOUS LEARNING</span><span>RECOGNITION</span></div>
              <CertificationsSection onNavigate={handleNavigate} />
            </section>
            <section id="testimonials" className="portfolio-section scroll-mt-24">
              <div className="portfolio-section-kicker"><span>06 / KIND WORDS</span><span>TESTIMONIALS</span></div>
              <TestimonialsSection />
            </section>
            <section id="contact" className="portfolio-contact-stage scroll-mt-24">
              <div className="portfolio-section-kicker"><span>07 / START A CONVERSATION</span><span>CONTACT</span></div>
              <ContactSection />
            </section>
          </div>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </>
  );
}

export default function App() {
  return <ErrorBoundary><PortfolioProvider><LanguageProvider><PortfolioContent /></LanguageProvider></PortfolioProvider></ErrorBoundary>;
}
