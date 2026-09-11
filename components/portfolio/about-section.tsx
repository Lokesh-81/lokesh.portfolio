'use client';

import React from 'react';
import { MapPin, Languages, GraduationCap, Award, Github, ArrowUpRight } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';

export function AboutSection() {
  const { profile } = usePortfolio();
  const { t, language } = useLanguage();

  const displayName = 'Poosala Lokesh';
  const location = profile?.location || 'Hyderabad, India';
  const languagesList =
    language === 'en'
      ? profile?.languages?.length
        ? profile.languages.join(' · ')
        : 'Telugu · English · Hindi · French'
      : t('about.languagesList');
  const education = profile?.education || 'B.Sc. MSCS · 2027';
  const recognition = profile?.recognition || 'Google Student Ambassador';

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on About Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Main Grid */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start border-b border-[#1F2937] pb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('about.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('about.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('about.titleAccent')}
              </span>
            </h2>

            {/* Both GitHub profiles display */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5B4FC]/70">
                {t('about.verifiedProfiles')}
              </span>
              <div className="space-y-2 max-w-md">
                <a
                  href="https://github.com/Lokesh-81"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2.5 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] shadow-xs transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="h-4 w-4 text-[#A5B4FC]" />
                    <span>github.com/Lokesh-81</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B]" />
                </a>

                <a
                  href="https://github.com/lokeshnaivaidya-max"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2.5 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] shadow-xs transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="h-4 w-4 text-[#A5B4FC]" />
                    <span>github.com/lokeshnaivaidya-max</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B]" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-lg leading-relaxed text-[#E0E7FF] md:text-xl font-light">
              <TextEffect key={`intro-${language}`} per="word" delay={0.25}>
                {`${t('about.introGreeting')} ${displayName}, ${t('about.introSuffix')} ${location}, ${t('about.introGoal')}`}
              </TextEffect>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
              <TextEffect key={`subdesc-${language}`} per="word" delay={0.4}>
                {language === 'en' && profile?.aboutSubDescription
                  ? profile.aboutSubDescription
                  : t('about.subDescription')}
              </TextEffect>
            </div>

            {/* Fact Cards */}
            <div className="grid grid-cols-2 gap-3.5 pt-2 sm:grid-cols-4">
              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-[#A5B4FC]/80 mb-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>{t('about.location')}</span>
                </div>
                <p className="font-semibold text-xs text-[#E0E7FF]">
                  {language === 'en' ? location : t('hero.location')}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-[#A5B4FC]/80 mb-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <Languages className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>{t('about.languages')}</span>
                </div>
                <p className="font-semibold text-[11px] text-[#E0E7FF] leading-tight">
                  {languagesList}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-[#A5B4FC]/80 mb-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <GraduationCap className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>{t('about.education')}</span>
                </div>
                <p className="font-semibold text-xs text-[#E0E7FF]">{education}</p>
              </div>

              <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-[#A5B4FC]/80 mb-1.5 text-[10px] uppercase tracking-wider font-semibold">
                  <Award className="h-3.5 w-3.5 text-[#60A5FA]" />
                  <span>{t('about.recognition')}</span>
                </div>
                <p className="font-semibold text-[11px] text-[#E0E7FF] leading-tight">
                  {recognition}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Philosophy Cards (No numbers) */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 pb-12">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 shadow-xs hover:border-[#60A5FA] transition-colors">
            <h3 className="text-base font-bold text-[#E0E7FF]">
              <TextEffect key={`phil1-title-${language}`} per="word" delay={0.5}>
                {t('about.philosophy1.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
              {t('about.philosophy1.desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 shadow-xs hover:border-[#60A5FA] transition-colors">
            <h3 className="text-base font-bold text-[#E0E7FF]">
              <TextEffect key={`phil2-title-${language}`} per="word" delay={0.55}>
                {t('about.philosophy2.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
              {t('about.philosophy2.desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6 shadow-xs hover:border-[#60A5FA] transition-colors">
            <h3 className="text-base font-bold text-[#E0E7FF]">
              <TextEffect key={`phil3-title-${language}`} per="word" delay={0.6}>
                {t('about.philosophy3.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
              {t('about.philosophy3.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
