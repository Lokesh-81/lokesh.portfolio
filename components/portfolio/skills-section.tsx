'use client';

import React, { useState } from 'react';
import { Filter, Code2, Layers } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import type { SkillLevel } from '@/lib/firebase';
import { TechStackSlider } from './tech-stack-slider';

export function SkillsSection() {
  const { technologies } = usePortfolio();
  const { t } = useLanguage();
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(technologies.map((t) => t.category)))];

  const filteredTech = technologies.filter((tech) => {
    if (selectedTechCategory === 'All') return true;
    return tech.category === selectedTechCategory;
  });

  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case 'Core':
        return 'border-purple-500/40 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300';
      case 'Working Knowledge':
        return 'border-sky-500/40 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
      case 'Familiar':
        return 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400';
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
    <section id="skills" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80">
      <div className="mx-auto max-w-6xl">
        {/* Header (Number removed) */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-10 md:flex-row md:items-end dark:border-zinc-900/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              {t('skills.tag')}
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              {t('skills.title')}{' '}
              <span className="instrument italic font-normal">{t('skills.titleAccent')}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('skills.subtitle')}
          </p>
        </div>

        {/* Dedicated InfiniteSlider for Tech Stack */}
        <div className="mt-8">
          <TechStackSlider />
        </div>

        {/* Categorized Technical Toolset */}
        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-100 pb-5 dark:border-zinc-900">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-2xl font-light tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                {t('skills.proficiency')}
              </h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                <Filter className="h-3 w-3" /> {t('skills.filter')}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTechCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedTechCategory === cat
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                      : 'border border-zinc-200 bg-white/60 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  {cat === 'All' ? t('work.filter.all') : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:border-purple-400/50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-950"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/60 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {tech.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                      {tech.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium font-mono ${getLevelBadge(
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
    </section>
  );
}
