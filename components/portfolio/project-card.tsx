'use client';

import React from 'react';
import { Spotlight } from '@/components/core/spotlight';
import { Github, ExternalLink, CheckCircle2 } from 'lucide-react';
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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#60A5FA] hover:shadow-[0_8px_35px_rgba(37,99,235,0.25)]"
    >
      {/* Spotlight follower effect directly on the card canvas */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.38)_0%,rgba(192,132,252,0.25)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={340}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {/* Header with Category and Live Status Badge (no dates, no numbers) */}
          <div className="flex items-center justify-between gap-2 border-b border-[#1F2937] pb-3.5">
            <span className="text-[11px] uppercase tracking-wider text-[#60A5FA] font-semibold">
              {project.category}
            </span>

            <span
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                isLive
                  ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/40'
                  : 'bg-[#FDE68A]/15 text-[#FDE68A] border border-[#FDE68A]/40'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isLive ? 'bg-[#2DD4BF] animate-pulse' : 'bg-[#FDE68A]'
                }`}
              />
              {statusLabel}
            </span>
          </div>

          {/* Optional Project Image */}
          {project.image && (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B132B] aspect-video">
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
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors">
                  {projectName}
                </h3>
                <ExternalLink className="h-4 w-4 text-[#60A5FA] opacity-70 group-hover/link:opacity-100 transition-opacity" />
              </a>
            ) : (
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors">
                {projectName}
              </h3>
            )}
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#A5B4FC]">
              {projectTagline}
            </p>
          </div>

          {/* Project Description */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            {projectDesc}
          </p>

          {/* Key Deliverables / What I worked on */}
          {contributions && contributions.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A5B4FC]/70">
                {t('work.keyContributions')}
              </span>
              <ul className="space-y-1 text-xs text-[#CBD5E1]">
                {contributions.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: Tech stack & Links */}
        <div className="mt-5 border-t border-[#1F2937] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[#1F2937] bg-[#1F2937]/70 px-2 py-0.5 font-mono text-[11px] text-[#E0E7FF]"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="rounded-md bg-[#2563EB]/25 px-1.5 py-0.5 font-mono text-[10px] text-[#60A5FA] font-semibold">
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
                  className="flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#111827] px-2.5 py-1 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors"
                  title="Source Code"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>{t('work.code')}</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(96,165,250,0.5)] hover:from-[#1D4ED8] hover:to-[#3B82F6] transition-all hover:scale-[1.02]"
                  title="View Live Project"
                >
                  <span>Live Project</span>
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
