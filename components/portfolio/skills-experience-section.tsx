'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, Filter, Code2, Layers } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { SkillLevel } from '@/lib/firebase';

export function SkillsExperienceSection() {
  const { experiences, technologies } = usePortfolio();
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

  return (
    <section id="skills" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80 bg-zinc-50/40 dark:bg-black/20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-10 md:flex-row md:items-end dark:border-zinc-900/80">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-600 dark:text-purple-300 mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Professional & Platform Track Record</span>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              03 / EXPERTISE & EXPERIENCE
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              Roles & <span className="instrument italic font-normal">Expertise.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            A factual breakdown of engineering responsibilities, team leadership, architectural contributions, and active technical toolsets.
          </p>
        </div>

        {/* Professional Timeline */}
        <div className="mt-16 space-y-10" id="experience">
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-2xl font-light tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              Professional <span className="instrument italic font-normal">Timeline</span>
            </h3>
          </div>

          <div className="space-y-8">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-zinc-100 pb-5 dark:border-zinc-900">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-medium">
                      {exp.company}
                    </span>
                    <h4 className="text-2xl font-bold text-zinc-950 dark:text-white mt-0.5">
                      {exp.role}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1 font-mono rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">
                      <Calendar className="h-3 w-3 text-purple-500" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">
                      <MapPin className="h-3 w-3 text-zinc-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {exp.description}
                </p>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Key Highlights & Outcomes
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4 dark:border-zinc-900">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Technologies */}
        <div className="mt-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-2xl font-light tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                Technical <span className="instrument italic font-normal">Toolset</span>
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTechCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedTechCategory === cat
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-sm'
                      : 'border border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-purple-400/50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:border-purple-500/40"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {tech.category}
                  </span>
                  <p className="mt-1 text-xs font-semibold text-zinc-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400 transition-colors">
                    {tech.name}
                  </p>
                </div>

                <div className="mt-3">
                  <span
                    className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-mono font-medium ${getLevelBadge(
                      tech.level
                    )}`}
                  >
                    {tech.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
