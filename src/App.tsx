'use client';

import React, { useEffect, useState } from 'react';
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

type SectionId = 'home' | 'about' | 'work' | 'skills' | 'certifications' | 'experience' | 'testimonials' | 'contact';
const sectionIds: SectionId[] = ['home', 'about', 'work', 'skills', 'certifications', 'experience', 'testimonials', 'contact'];

function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(() => typeof window !== 'undefined' && !window.location.pathname.startsWith('/studio') && !window.location.hash.includes('studio'));
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isStudioRoute, setIsStudioRoute] = useState(() => typeof window !== 'undefined' && (window.location.pathname.startsWith('/studio') || window.location.hash === '#studio' || window.location.hash.startsWith('#/studio')));

  useEffect(() => {
    const route = () => {
      const hash = window.location.hash.slice(1);
      const studio = window.location.pathname.startsWith('/studio') || hash === 'studio' || hash.startsWith('/studio');
      setIsStudioRoute(studio);
      if (!studio && sectionIds.includes(hash as SectionId)) {
        setActiveSection(hash as SectionId);
        window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    };
    route();
    window.addEventListener('hashchange', route);
    window.addEventListener('popstate', route);
    return () => {
      window.removeEventListener('hashchange', route);
      window.removeEventListener('popstate', route);
    };
  }, []);

  useEffect(() => {
    const nodes = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const id = visible.target.id as SectionId;
        setActiveSection(id);
        window.history.replaceState(null, '', id === 'home' ? window.location.pathname : `#${id}`);
      }
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isStudioRoute, isLoading]);

  useEffect(() => {
    if (isStudioRoute || isLoading) return;
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('.editorial-section > div'));
    revealTargets.forEach((node) => node.classList.add('editorial-reveal'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((node) => revealObserver.observe(node));
    return () => revealObserver.disconnect();
  }, [isStudioRoute, isLoading]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => { trackEvent('home', 'pageview'); }, []);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'studio') {
      trackEvent('studio', 'navigation');
      setIsStudioRoute(true);
      window.history.pushState(null, '', '#studio');
      return;
    }
    if (!sectionIds.includes(sectionId as SectionId)) return;
    const id = sectionId as SectionId;
    trackEvent(id, 'navigation');
    setIsStudioRoute(false);
    setActiveSection(id);
    window.history.pushState(null, '', id === 'home' ? window.location.pathname : `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleExitStudio = () => {
    setIsStudioRoute(false);
    window.history.pushState(null, '', '/');
    setActiveSection('home');
    window.setTimeout(() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  if (isStudioRoute) return <StudioApp onExitStudio={handleExitStudio} />;

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="editorial-site relative isolate min-h-screen w-full overflow-x-clip bg-[#100B18] text-[#F5EAF5] selection:bg-[#A77BC2]/40 selection:text-[#F5EAF5]">
        {/* Preserved original animated background: intentionally unchanged. */}
        <NightSceneBacklit
          background="#100B18"
          blossomColor="#E8B8D2"
          speed={65}
          petals={105}
          wind={24}
          scale={100}
          glow={42}
          direction="right"
          style={{ position: 'fixed', inset: 0, zIndex: 0, minWidth: 0, minHeight: 0, pointerEvents: 'none' }}
        />
        <div className="editorial-scroll-progress" aria-hidden="true"><span style={{ transform: "scaleX(" + scrollProgress + ")" }} /></div>
        <div className="editorial-content relative z-10">
          <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />
          <div className="editorial-clock fixed right-5 top-5 z-40 hidden items-center gap-2 md:flex" title="Live Indian Standard Time">
            <span className="editorial-live-dot" />
            <span>IST</span><span className="opacity-40">/</span><Clock />
          </div>
          <main className="editorial-main">
            <section id="home" className="editorial-section editorial-home"><Hero onNavigate={handleNavigate} /></section>
            <section id="about" className="editorial-section"><AboutSection /></section>
            <section id="work" className="editorial-section"><ProjectsSection /></section>
            <section id="skills" className="editorial-section"><SkillsSection /></section>
            <section id="certifications" className="editorial-section"><CertificationsSection onNavigate={handleNavigate} /></section>
            <section id="experience" className="editorial-section"><ExperienceSection onNavigate={handleNavigate} /></section>
            <section id="testimonials" className="editorial-section"><TestimonialsSection /></section>
            <section id="contact" className="editorial-section"><ContactSection /></section>
          </main>
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return <ErrorBoundary><PortfolioProvider><LanguageProvider><PortfolioContent /></LanguageProvider></PortfolioProvider></ErrorBoundary>;
}
