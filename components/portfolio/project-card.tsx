'use client';

import React from 'react';
import { Spotlight } from '@/components/core/spotlight';
import { ArrowUpRight, Github, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/i18n';
import type { Project } from '@/lib/data/projects';

export interface ProjectCardProps {
  key?: React.Key;
  project: Project & {
    image?: string;
    translations?: {
      te?: { name?: string; tagline?: string; description?: string; whatIWorkedOn?: string[] };
      hi?: { name?: string; tagline?: string; description?: string; whatIWorkedOn?: string[] };
    };
  };
  onHoverStart?: (project: Project) => void;
  onHoverEnd?: () => void;
}

export function ProjectCard({ project, onHoverStart, onHoverEnd }: ProjectCardProps) {
  const { t, language } = useLanguage();

  // Support multilingual content if provided by database, otherwise gracefully fallback to original English
  const translatedContent = project.translations?.[language as 'te' | 'hi'];
  const projectName = (language !== 'en' && translatedContent?.name) || project.name;
  const projectTagline = (language !== 'en' && translatedContent?.tagline) || project.tagline;
  const projectDesc = (language !== 'en' && translatedContent?.description) || project.description;
  const contributions =
    (language !== 'en' && translatedContent?.whatIWorkedOn) || project.whatIWorkedOn;

  const isLive = project.status === 'Live';
  const statusLabel = isLive ? t('work.status.live') : t('work.status.dev');

  return (
    <div
      onMouseEnter={() => onHoverStart?.(project)}
      onMouseLeave={() => onHoverEnd?.()}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-purple-400/60 hover:shadow-xl dark:border-zinc-800/90 dark:bg-zinc-950 dark:hover:border-purple-500/50"
    >
      {/* Spotlight follower effect directly on the card canvas */}
      <Spotlight
        className="from-purple-500/35 via-violet-500/20 to-transparent blur-3xl dark:from-purple-400/28 dark:via-violet-400/18 dark:to-transparent"
        size={320}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Header with Project Number, Category, and Status */}
          <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-900">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                {project.number}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                {project.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                {project.year}
              </span>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  isLive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Optional Project Image */}
          {project.image && (
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 aspect-video dark:border-zinc-800/80 dark:bg-zinc-900">
              <img
                src={project.image}
                alt={project.name}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Project Title & Tagline */}
          <div className="mt-5">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-950 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400 transition-colors sm:text-3xl">
              {projectName}
            </h3>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {projectTagline}
            </p>
          </div>

          {/* Project Description */}
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {projectDesc}
          </p>

          {/* Key Deliverables / What I worked on */}
          {contributions && contributions.length > 0 && (
            <div className="mt-5 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {t('work.keyContributions')}
              </span>
              <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                {contributions.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-500 dark:text-purple-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: Tech stack & Links */}
        <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-2 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  title="View Source on GitHub"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('work.code')}</span>
                </a>
              )}

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-950 px-3 py-2 text-xs font-medium text-white shadow transition-colors hover:bg-purple-600 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-400 dark:hover:text-black"
                >
                  <span>{t('work.launch')}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href={project.githubUrl || 'https://github.com/Lokesh-81'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow transition-colors hover:bg-purple-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-purple-500"
                >
                  <span>{t('work.explore')}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
