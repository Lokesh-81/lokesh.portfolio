'use client';

import React, { useState } from 'react';
import { ProjectCard } from './project-card';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { projects as fallbackProjects, type Project } from '@/lib/data/projects';
import { Filter } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { AnimatedGroup } from '@/components/core/animated-group';

export function ProjectsSection() {
  const { projects: contextProjects } = usePortfolio();
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const allProjects: Project[] =
    contextProjects && contextProjects.length > 0
      ? (contextProjects as any)
      : fallbackProjects;

  const categories = [
    { key: 'All', label: t('work.filter.all') },
    { key: 'AI & FinTech', label: t('work.filter.aiFintech') },
    { key: 'Healthcare', label: t('work.filter.healthcare') },
    { key: 'Business & Startups', label: t('work.filter.business') },
    { key: 'Creative & EdTech', label: t('work.filter.creative') },
  ];

  const filteredProjects = allProjects.filter((project) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'AI & FinTech')
      return project.category.includes('AI') || project.category.includes('FinTech');
    if (selectedCategory === 'Healthcare')
      return project.category.includes('Healthcare');
    if (selectedCategory === 'Business & Startups')
      return (
        project.category.includes('Business') ||
        project.category.includes('Startup') ||
        project.category.includes('Corporate')
      );
    if (selectedCategory === 'Creative & EdTech')
      return (
        project.category.includes('Photography') ||
        project.category.includes('Education') ||
        project.category.includes('EdTech')
      );
    return true;
  });

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Projects Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header with TextEffect (No dates, no numbers) */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('work.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('work.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('work.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('work.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-[#A5B4FC]/80 flex items-center gap-1.5 font-medium">
            <Filter className="h-3 w-3 text-[#60A5FA]" /> {t('work.filter')}
          </span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-xs'
                  : 'border border-[#1F2937] bg-[#111827] text-[#A5B4FC]/80 hover:border-[#60A5FA] hover:text-[#E0E7FF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid with AnimatedGroup custom variants */}
        <AnimatedGroup
          key={selectedCategory}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12"
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            },
            item: {
              hidden: {
                opacity: 0,
                filter: 'blur(12px)',
                y: -60,
                rotateX: 90,
              },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
                rotateX: 0,
                transition: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: 1,
                },
              },
            },
          }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id || project.name} project={project} />
          ))}
        </AnimatedGroup>
      </div>
    </div>
  );
}
