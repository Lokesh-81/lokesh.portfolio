'use client';

import React, { useState } from 'react';
import { Filter, Code2, Layers } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { TechStackSlider } from '@/components/portfolio/tech-stack-slider';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import type { SkillLevel } from '@/lib/firebase';

export function SkillsSection() {
  const { technologies } = usePortfolio();
  const { t, language } = useLanguage();
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(technologies.map((t) => t.category)))];

  const filteredTech = technologies.filter((tech) => {
    if (selectedTechCategory === 'All') return true;
    return tech.category === selectedTechCategory;
  });

  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case 'Core':
        return 'border-[#2563EB]/40 bg-[#2563EB]/20 text-[#60A5FA] font-semibold';
      case 'Working Knowledge':
        return 'border-[#2DD4BF]/40 bg-[#2DD4BF]/15 text-[#2DD4BF] font-medium';
      case 'Familiar':
        return 'border-[#1F2937] bg-[#1F2937]/60 text-[#CBD5E1] font-normal';
    }
  };

  const getLevelText = (level: SkillLevel) => {
    switch (level) {
      case 'Core':
        return t('skills.level.core');
      case 'Working Knowledge':
        return t('skills.level.working');
      case 'Familiar':
        return t('skills.level.familiar');
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Skills Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('skills.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('skills.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('skills.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('skills.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* 1. RESTORED: Continuous Horizontal Scrolling Tech Stack Slider */}
        <div className="mt-8 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 sm:p-6 backdrop-blur-md shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-[#1F2937] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#60A5FA] font-semibold">
              Interactive Tech Radar & Tooling
            </span>
            <span className="rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 px-2.5 py-0.5 font-mono text-[10px] text-[#60A5FA]">
              Continuous Loop
            </span>
          </div>
          <TechStackSlider />
        </div>

        {/* 2. Categorized Technical Toolset Grid */}
        <div className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#1F2937] pb-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#60A5FA]" />
              <h3 className="text-xl font-bold tracking-tight text-[#E0E7FF]">
                {t('skills.proficiency')}
              </h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#A5B4FC]/80 flex items-center gap-1.5 font-medium">
                <Filter className="h-3 w-3 text-[#60A5FA]" /> {t('skills.filter')}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTechCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    selectedTechCategory === cat
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-xs'
                      : 'border border-[#1F2937] bg-[#111827] text-[#A5B4FC]/80 hover:border-[#60A5FA] hover:text-[#E0E7FF]'
                  }`}
                >
                  {cat === 'All' ? t('work.filter.all') : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 pb-12">
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                className="group flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827]/90 p-3.5 shadow-xs transition-all hover:border-[#60A5FA] hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1F2937] bg-[#0B132B] group-hover:border-[#60A5FA]/40 transition-colors">
                    <Layers className="h-4 w-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors">
                      {tech.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#A5B4FC]/70">
                      {tech.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] ${getLevelBadge(
                    tech.level
                  )}`}
                >
                  {getLevelText(tech.level)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
