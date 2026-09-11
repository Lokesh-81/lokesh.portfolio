'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function ExperienceSection() {
  const { experiences } = usePortfolio();

  return (
    <section id="experience" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-10 md:flex-row md:items-end dark:border-zinc-900/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              04 / CAREER TRACK RECORD
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              Roles & <span className="instrument italic font-normal">Experience.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            A chronological breakdown of leadership roles, development responsibilities, and delivered milestones across startups and technology organizations.
          </p>
        </div>

        {/* Timeline List */}
        <div className="mt-14 space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-purple-400/50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-950 dark:hover:border-purple-500/40"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-zinc-100 pb-5 dark:border-zinc-900">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-medium">
                    {exp.company}
                  </span>
                  <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mt-0.5">
                    {exp.role}
                  </h3>
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
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
