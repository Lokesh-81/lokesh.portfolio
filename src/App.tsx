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
import { StudioApp } from './studio/StudioApp';
import { trackEvent } from '@/lib/analytics';
import { ErrorBoundary } from '@/components/core/error-boundary';
import { NotFound } from '@/components/ui/not-found';

type SectionId = 'home' | 'about' | 'work' | 'skills' | 'certifications' | 'experience' | 'testimonials' | 'contact';
const sectionIds: SectionId[] = ['home', 'about', 'work', 'skills', 'experience', 'certifications', 'testimonials', 'contact'];

function PortfolioContent() {
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
    const sections = Array.from(document.querySelectorAll<HTMLElement>(
      '.portfolio-editorial > section, .portfolio-contact-stage'
    ));
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(
      '.portfolio-section :is(article,.projects-featured-card,.editorial-project-card,.skills-directory-item,.experience-card,.testimonial-ledger-card,.belvo-certification-showcase), .portfolio-contact-stage .contact-form-panel, .portfolio-contact-stage .contact-direct-panel'
    ));
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sk-scroll-in');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sk-card-in');
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
    revealTargets.forEach((target) => cardObserver.observe(target));
    return () => {
      sectionObserver.disconnect();
      cardObserver.disconnect();
      sections.forEach((section) => section.classList.remove('sk-scroll-in'));
      revealTargets.forEach((target) => target.classList.remove('sk-card-in'));
    };
  }, [isStudioRoute]);

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
      <div className="portfolio-shell min-h-screen w-full bg-[#f5f1e9] text-[#25231f] selection:bg-[#d8b9a5]/50 selection:text-[#25231f]">
        <header className="portfolio-header">
          <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />
        </header>

        <main className="portfolio-main">
          <section id="home" className="portfolio-hero-stage scroll-mt-24">
            <div className="portfolio-hero-content"><Hero onNavigate={handleNavigate} /></div>
            <div className="portfolio-hero-index"><span>INDEPENDENT DEVELOPER</span><span>HYDERABAD · INDIA</span></div>
          </section>

          <div className="portfolio-editorial">
            <section id="about" className="portfolio-section scroll-mt-24">
<AboutSection />
            </section>
            <section id="work" className="portfolio-section portfolio-work-section scroll-mt-24">
<ProjectsSection />
            </section>
            <section id="skills" className="portfolio-section scroll-mt-24">
<SkillsSection />
            </section>
            <section id="experience" className="portfolio-section scroll-mt-24">
<ExperienceSection onNavigate={handleNavigate} />
            </section>
            <section id="certifications" className="portfolio-section scroll-mt-24">
<CertificationsSection onNavigate={handleNavigate} />
            </section>
            <section id="testimonials" className="portfolio-section scroll-mt-24">
<TestimonialsSection />
            </section>
            <section id="contact" className="portfolio-contact-stage scroll-mt-24">
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
