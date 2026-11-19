'use client';

import React, { useMemo, useState } from 'react';
import { Code2, Layers3, Filter, ArrowUpRight } from 'lucide-react';
import { TechStackSlider } from '@/components/portfolio/tech-stack-slider';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import type { SkillLevel } from '@/lib/firebase';

export function SkillsSection() {
  const { technologies } = usePortfolio();
  const { t, language } = useLanguage();
  const [selectedTechCategory, setSelectedTechCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(technologies.map((tech) => tech.category)))];
  const filteredTech = useMemo(() => technologies.filter((tech) => selectedTechCategory === 'All' || tech.category === selectedTechCategory), [technologies, selectedTechCategory]);
  const label = (cat: string) => {
    if (cat === 'All') return t('work.filter.all');
    const translations: Record<string, Record<string, string>> = {
      te: { Frontend: 'ఫ్రంటెండ్', Backend: 'బ్యాకెండ్', Database: 'డేటాబేస్', 'DevOps & Cloud': 'డెవ్ఆప్స్ & క్లౌడ్' },
      hi: { Frontend: 'फ्रंटएंड', Backend: 'बैकएंड', Database: 'डेटाबेस', 'DevOps & Cloud': 'डेवऑप्स एवं क्लाउड' },
      fr: { Frontend: 'Frontend & UI', Backend: 'Backend & API', Database: 'Bases de données', 'DevOps & Cloud': 'DevOps & Cloud' },
    };
    return translations[language]?.[cat] || cat;
  };
  const levelLabel = (level: SkillLevel) => level === 'Core' ? t('skills.level.core') : level === 'Working Knowledge' ? t('skills.level.working') : t('skills.level.familiar');
  const levelClass = (level: SkillLevel) => level === 'Core' ? 'skill-level-core' : level === 'Working Knowledge' ? 'skill-level-working' : 'skill-level-familiar';
  const coreCount = technologies.filter((tech) => tech.level === 'Core').length;

  return (
    <div className="skills-editorial">
      <header className="skills-editorial-heading"><div><span className="skills-overline"><Code2 size={14}/> CAPABILITIES / TOOLKIT</span><h2>{t('skills.title')} <em>{t('skills.titleAccent')}</em></h2></div><p>{t('skills.subtitle')}</p></header>
      <div className="skills-summary-strip"><div><strong>{technologies.length.toString().padStart(2, '0')}</strong><span>TOOLS & TECHNOLOGIES</span></div><div><strong>{coreCount.toString().padStart(2, '0')}</strong><span>CORE SKILLS</span></div><div><strong>{categories.length - 1}</strong><span>DISCIPLINES</span></div></div>
      <section className="skills-marquee-panel"><div className="skills-panel-heading"><span>01 / TECH IN MOTION</span><span>CONTINUOUS TOOLKIT</span></div><TechStackSlider /></section>
      <section className="skills-library"><div className="skills-library-heading"><div><span>02 / SKILL LIBRARY</span><h3><Layers3 size={18}/> {t('skills.proficiency')}</h3></div><div className="skills-filter-label"><Filter size={13}/> FILTER</div></div>
        <div className="skills-category-tabs">{categories.map((cat) => <button key={cat} type="button" onClick={() => setSelectedTechCategory(cat)} className={selectedTechCategory === cat ? 'is-active' : ''}>{label(cat)}<small>{cat === 'All' ? technologies.length : technologies.filter((tech) => tech.category === cat).length}</small></button>)}</div>
        <div className="skills-directory">{filteredTech.map((tech, index) => <article className="skills-directory-item" key={tech.id}><span className="skills-item-number">{String(index + 1).padStart(2, '0')}</span><div className="skills-item-main"><h4>{tech.name}</h4><span>{label(tech.category)}</span></div><span className={`skills-level ${levelClass(tech.level as SkillLevel)}`}>{levelLabel(tech.level as SkillLevel)}</span><ArrowUpRight className="skills-item-arrow" size={15}/></article>)}</div>
      </section>
    </div>
  );
}
