'use client';

import React from 'react';
import { GlowEffect } from '@/components/core/glow-effect';
import { ExternalLink, CheckCircle2, Github } from 'lucide-react';
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

  const translatedContent = (project.translations as any)?.[language];
  const projectName = (language !== 'en' && translatedContent?.name) || project.title || project.name;
  const projectTagline = (language !== 'en' && translatedContent?.tagline) || project.tagline;
  const projectDesc = (language !== 'en' && translatedContent?.description) || project.description;
  const contributions =
    (language !== 'en' && translatedContent?.whatIWorkedOn) || project.whatIWorkedOn;

  const isLive = project.status === 'Live';
  const statusLabel = isLive ? t('work.status.live') : t('work.status.dev');

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (project.liveUrl && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`relative group h-full ${project.liveUrl ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={project.liveUrl ? 'link' : undefined}
      tabIndex={project.liveUrl ? 0 : undefined}
      aria-label={project.liveUrl ? `Open ${projectName} live application in a new tab` : undefined}
    >
      {/* Project Card Glow Effect with static mode and medium blur */}
      <GlowEffect
        colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
        mode="static"
        blur="medium"
        className="opacity-40 group-hover:opacity-85 transition-opacity duration-300 rounded-2xl pointer-events-none"
      />

      <div
        onMouseEnter={() => onHoverStart?.(project)}
        onMouseLeave={() => onHoverEnd?.()}
        className="project-card-content relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#35263D] bg-[#1A1222]/95 p-6 sm:p-7 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#E8B8D2]/60 group-hover:shadow-[0_8px_35px_rgba(37,99,235,0.25)]"
      >
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            {/* Header with Category and Live Status Badge (no dates, no numbers) */}
            <div className="flex items-center justify-between gap-2 border-b border-[#35263D] pb-3.5">
              <span className="text-[11px] uppercase tracking-wider text-[#E8B8D2] font-semibold">
                {project.category}
              </span>

              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  isLive
                    ? 'bg-[#A77BC2]/15 text-[#A77BC2] border border-[#A77BC2]/40'
                    : 'bg-[#E8B8D2]/15 text-[#E8B8D2] border border-[#E8B8D2]/40'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isLive ? 'bg-[#A77BC2] animate-pulse' : 'bg-[#E8B8D2]'
                  }`}
                />
                {statusLabel}
              </span>
            </div>

            {/* Optional Project Image */}
            {project.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#35263D] bg-[#100B18] aspect-video">
                <img
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* Project Title & Tagline */}
            <div className="mt-4">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-2 hover:underline"
                >
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5EAF5] group-hover:text-[#E8B8D2] transition-colors">
                    {projectName}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-[#E8B8D2] opacity-70 group-hover/link:opacity-100 transition-opacity" />
                </a>
              ) : (
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5EAF5] group-hover:text-[#E8B8D2] transition-colors">
                  {projectName}
                </h3>
              )}
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#D8B4E8]">
                {projectTagline}
              </p>
            </div>

            {/* Project Description */}
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
              {projectDesc}
            </p>

            {/* Key Deliverables / What I worked on */}
            {contributions && contributions.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D8B4E8]/70">
                  {t('work.keyContributions')}
                </span>
                <ul className="space-y-1 text-xs text-[#DCCFE0]">
                  {contributions.slice(0, 3).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E8B8D2]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer: Tech stack & Direct Live Project Link ONLY */}
          <div className="mt-5 border-t border-[#35263D] pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="project-tech-chip rounded-md border border-[#35263D] bg-[#35263D]/70 px-2 py-0.5 font-mono text-[11px] text-[#F5EAF5]"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="project-tech-chip project-tech-more rounded-md bg-[#A77BC2]/25 px-1.5 py-0.5 font-mono text-[10px] text-[#E8B8D2] font-semibold">
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
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center rounded-lg border border-[#35263D] bg-[#100B18] p-2 text-[#BDA9C4] hover:text-[#E8B8D2] hover:border-[#E8B8D2] transition-all cursor-pointer"
                    title="View GitHub Repository"
                    aria-label={`View ${projectName} GitHub repository`}
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(96,165,250,0.5)] hover:from-[#1D4ED8] hover:to-[#3B82F6] transition-all hover:scale-[1.02] cursor-pointer"
                    title={t('work.viewLive')}
                  >
                    <span>{t('work.viewLive')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
