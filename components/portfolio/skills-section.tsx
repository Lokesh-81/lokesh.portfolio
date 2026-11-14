'use client';

import React, { useState } from 'react';
import { Filter, Code2, Layers } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
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

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('work.filter.all');

    const categoryTranslations: Record<string, Record<string, string>> = {
      te: {
        Frontend: 'ఫ్రంటెండ్',
        Backend: 'బ్యాకెండ్',
        'AI & ML': 'AI & ML',
        Database: 'డేటాబేస్',
        'DevOps & Cloud': 'డెవ్ఆప్స్ & క్లౌడ్',
      },
      hi: {
        Frontend: 'फ्रंटएंड',
        Backend: 'बैकएंड',
        'AI & ML': 'AI एवं मशीन लर्निंग',
        Database: 'डेटाबेस',
        'DevOps & Cloud': 'डेवऑप्स एवं क्लाउड',
      },
      fr: {
        Frontend: 'Frontend & UI',
        Backend: 'Backend & API',
        'AI & ML': 'IA & Machine Learning',
        Database: 'Bases de données',
        'DevOps & Cloud': 'DevOps & Cloud',
      },
      es: {
        Frontend: 'Frontend & UI',
        Backend: 'Backend & API',
        'AI & ML': 'IA y Machine Learning',
        Database: 'Bases de datos',
        'DevOps & Cloud': 'DevOps y Cloud',
      },
      de: {
        Frontend: 'Frontend & UI',
        Backend: 'Backend & API',
        'AI & ML': 'KI & Maschinelles Lernen',
        Database: 'Datenbanken',
        'DevOps & Cloud': 'DevOps & Cloud',
      },
      ja: {
        Frontend: 'フロントエンド',
        Backend: 'バックエンド',
        'AI & ML': 'AI & 機械学習',
        Database: 'データベース',
        'DevOps & Cloud': 'DevOps & クラウド',
      },
      ta: {
        Frontend: 'முன்பகுதி (Frontend)',
        Backend: 'பின்தள (Backend)',
        'AI & ML': 'AI & இயந்திர கற்றல்',
        Database: 'தரவுத்தளம்',
        'DevOps & Cloud': 'DevOps & கிளவுட்',
      },
      kn: {
        Frontend: 'ಫ್ರಂಟ್‌ಎಂಡ್',
        Backend: 'ಬ್ಯಾಕ್‌ಎಂಡ್',
        'AI & ML': 'AI & ML',
        Database: 'ಡೇಟಾಬೇಸ್',
        'DevOps & Cloud': 'ಡೆವ್ಆಪ್ಸ್ & ಕ್ಲೌಡ್',
      },
      ml: {
        Frontend: 'ഫ്രണ്ട്‌എൻഡ്',
        Backend: 'ബാക്കെൻഡ്',
        'AI & ML': 'AI & ML',
        Database: 'ഡാറ്റാബേസ്',
        'DevOps & Cloud': 'ഡെവ്ഓപ്സ് & ക്ലൗഡ്',
      },
      bn: {
        Frontend: 'ফ্রন্টএন্ড',
        Backend: 'ব্যাকএন্ড',
        'AI & ML': 'এআই ও মেশিন লার্নিং',
        Database: 'ডাটাবেস',
        'DevOps & Cloud': 'ডেভঅপ্স ও ক্লাউড',
      },
      mr: {
        Frontend: 'फ्रंटएंड',
        Backend: 'बॅकएंड',
        'AI & ML': 'AI व मशीन लर्निंग',
        Database: 'डेटाबेस',
        'DevOps & Cloud': 'डेव्हऑप्स व क्लाउड',
      },
    };

    return categoryTranslations[language]?.[cat] || cat;
  };

  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case 'Core':
        return 'border-[#A77BC2]/40 bg-[#A77BC2]/20 text-[#E8B8D2] font-semibold';
      case 'Working Knowledge':
        return 'border-[#A77BC2]/40 bg-[#A77BC2]/15 text-[#A77BC2] font-medium';
      case 'Familiar':
        return 'border-[#35263D] bg-[#35263D]/60 text-[#DCCFE0] font-normal';
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
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#35263D] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#E8B8D2] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('skills.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#F5EAF5] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('skills.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#E8B8D2]">
                {t('skills.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('skills.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* 1. RESTORED: Continuous Horizontal Scrolling Tech Stack Slider */}
        <div className="mt-8 rounded-2xl border border-[#35263D] bg-[#1A1222]/70 p-5 sm:p-6 backdrop-blur-md shadow-xs">
          <div className="mb-4 flex items-center justify-between border-b border-[#35263D] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#E8B8D2] font-semibold">
              {language === 'fr' ? 'Radar Technologique & Outils' : 'Interactive Tech Radar & Tooling'}
            </span>
            <span className="rounded-full bg-[#A77BC2]/20 border border-[#A77BC2]/40 px-2.5 py-0.5 font-mono text-[10px] text-[#E8B8D2]">
              {language === 'fr' ? 'Boucle Continue' : 'Continuous Loop'}
            </span>
          </div>
          <TechStackSlider />
        </div>

        {/* 2. Categorized Technical Toolset Grid */}
        <div className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-[#35263D] pb-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#E8B8D2]" />
              <h3 className="text-xl font-bold tracking-tight text-[#F5EAF5]">
                {t('skills.proficiency')}
              </h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#D8B4E8]/80 flex items-center gap-1.5 font-medium">
                <Filter className="h-3 w-3 text-[#E8B8D2]" /> {t('skills.filter')}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTechCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    selectedTechCategory === cat
                      ? 'bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] text-white shadow-xs'
                      : 'border border-[#35263D] bg-[#1A1222] text-[#D8B4E8]/80 hover:border-[#E8B8D2] hover:text-[#F5EAF5]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 pb-12">
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                className="group flex items-center justify-between rounded-xl border border-[#35263D] bg-[#1A1222]/90 p-3.5 shadow-xs transition-all hover:border-[#E8B8D2] hover:shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#35263D] bg-[#100B18] group-hover:border-[#E8B8D2]/40 transition-colors">
                    <Layers className="h-4 w-4 text-[#E8B8D2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5EAF5] group-hover:text-[#E8B8D2] transition-colors">
                      {tech.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#D8B4E8]/70">
                      {getCategoryLabel(tech.category)}
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] ${getLevelBadge(
                    tech.level as any
                  )}`}
                >
                  {getLevelText(tech.level as any)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
