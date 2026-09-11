'use client';

import React, { useState } from 'react';
import { ProjectCard } from './project-card';
import { Cursor } from '@/components/core/cursor';
import { usePortfolio } from '@/lib/portfolio-context';
import { projects as fallbackProjects, type Project } from '@/lib/data/projects';
import { Filter, ArrowUpRight, Github } from 'lucide-react';

export function ProjectsSection() {
  const { projects: contextProjects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // Map context projects or fallback projects
  const allProjects: Project[] =
    contextProjects && contextProjects.length > 0
      ? (contextProjects as any)
      : fallbackProjects;

  const categories = [
    'All',
    'AI & FinTech',
    'Healthcare',
    'Business & Startups',
    'Creative & EdTech',
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
    <section id="work" className="py-24 px-6 relative">
      {/* Floating cursor preview for active project */}
      {hoveredProject && (
        <Cursor>
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/95 px-4 py-2.5 shadow-2xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/95">
            <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
              {hoveredProject.number}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                {hoveredProject.name}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {hoveredProject.category}
              </span>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </div>
        </Cursor>
      )}

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-200/80 pb-10 md:flex-row md:items-end dark:border-zinc-900/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              02 / SELECTED WORK & SYSTEMS
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              Things I've <span className="instrument italic font-normal">built.</span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              A curated catalog of production platforms, healthcare workflow engines, AI-powered financial tools, and enterprise web solutions engineered with modern standards.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950 font-semibold'
                  : 'border border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid with Spotlight Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onHoverStart={(proj) => setHoveredProject(proj)}
              onHoverEnd={() => setHoveredProject(null)}
            />
          ))}
        </div>

        {/* Bottom GitHub CTA */}
        <div className="mt-14 flex items-center justify-center">
          <a
            href="https://github.com/Lokesh-81"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-medium text-zinc-800 shadow-sm transition-all hover:border-purple-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:bg-zinc-800"
          >
            <Github className="h-4 w-4" />
            <span>Explore More Open Source Code on GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
