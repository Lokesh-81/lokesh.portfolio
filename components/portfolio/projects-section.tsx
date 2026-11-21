'use client';

import React, { useMemo, useState } from 'react';
import { Filter, FolderOpen } from 'lucide-react';
import { CardSwap } from './card-swap';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { projects as fallbackProjects, type Project } from '@/lib/data/projects';

export function ProjectsSection() {
  const { projects: contextProjects } = usePortfolio();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const allProjects: Project[] = contextProjects?.length ? contextProjects as any : fallbackProjects;
  const categories = [
    { key: 'All', label: t('work.filter.all') },
    { key: 'AI & FinTech', label: t('work.filter.aiFintech') },
    { key: 'Healthcare', label: t('work.filter.healthcare') },
    { key: 'Business & Startups', label: t('work.filter.business') },
    { key: 'Creative & EdTech', label: t('work.filter.creative') },
  ];
  const filteredProjects = useMemo(() => allProjects.filter((project) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'AI & FinTech') return project.category.includes('AI') || project.category.includes('FinTech');
    if (selectedCategory === 'Healthcare') return project.category.includes('Healthcare');
    if (selectedCategory === 'Business & Startups') return ['Business', 'Startup', 'Corporate'].some((word) => project.category.includes(word));
    if (selectedCategory === 'Creative & EdTech') return ['Photography', 'Education', 'EdTech', 'Creative', 'Correspondence'].some((word) => project.category.includes(word));
    return true;
  }), [allProjects, selectedCategory]);

  return (
    <div className="projects-editorial">
      <header className="projects-editorial-heading">
        <div><span className="projects-overline"><FolderOpen size={14} /> SELECTED WORK / {String(filteredProjects.length).padStart(2, '0')} PROJECTS</span>
          <h2>{t('work.title')} <em>{t('work.titleAccent')}</em></h2></div>
        <p>{t('work.subtitle')}</p>
      </header>
      <div className="projects-filter-row"><span><Filter size={13}/> FILTER BY FIELD</span><div role="group" aria-label="Filter projects">{categories.map((cat) => <button type="button" key={cat.key} onClick={() => setSelectedCategory(cat.key)} className={selectedCategory === cat.key ? 'is-active' : ''}>{cat.label}</button>)}</div></div>
      {filteredProjects.length > 0
        ? <CardSwap projects={filteredProjects} />
        : <div className="projects-empty"><FolderOpen size={28}/><h3>No projects in this category</h3><p>Choose another field to explore the work.</p><button onClick={() => setSelectedCategory('All')}>Show all projects</button></div>}
    </div>
  );
}
