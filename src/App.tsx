'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from '@/lib/portfolio-context';
import { PortfolioDock } from '@/components/portfolio/portfolio-dock';
import { Hero } from '@/components/portfolio/hero';
import { AboutSection } from '@/components/portfolio/about-section';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { ExperienceSection } from '@/components/portfolio/experience-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';

function PortfolioContent() {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle direct section navigation smoothly
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  };

  // Section observer to update active dock item automatically
  useEffect(() => {
    const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Find the one closest to the top of the viewport
          const topVisible = visibleEntries.reduce((prev, curr) =>
            Math.abs(curr.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top)
              ? curr
              : prev
          );
          setActiveSection(topVisible.target.id);
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 selection:bg-purple-500/20 selection:text-purple-700 dark:bg-[#0a0a0c] dark:text-zinc-100 dark:selection:bg-purple-500/30 dark:selection:text-purple-200 transition-colors duration-300">
      {/* 1. Primary Top Navigation Dock (Apple-Style, Fixed/Sticky at Top) */}
      <PortfolioDock activeSection={activeSection} onSelectSection={handleNavigate} />

      {/* Main Content Sections */}
      <main className="relative">
        {/* 1. Hero Section (Fits Viewport, Availability below Dock, Editorial Typography) */}
        <Hero onNavigate={handleNavigate} />

        {/* 2. About Section (Philosophy, Credentials, Both GitHub Profiles) */}
        <AboutSection />

        {/* 3. Work Section (Static Grid with Spotlight Follower Effect, NO InfiniteSlider on Works) */}
        <ProjectsSection />

        {/* 4. Skills Section (Dedicated InfiniteSlider ONLY for Tech Stack Logos + Categorized Toolset) */}
        <SkillsSection />

        {/* 5. Experience Section (Professional Career Timeline & Milestones) */}
        <ExperienceSection />

        {/* 6. Contact Section (Direct WhatsApp link, Both GitHubs, Clean Form, No Fake Data) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
