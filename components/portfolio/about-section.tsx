'use client';

import React from 'react';
import { MapPin, Languages, GraduationCap, Award, Github, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';

export function AboutSection() {
  const { profile } = usePortfolio();
  const { t, language } = useLanguage();

  const displayName = profile?.displayName || 'P. Lokesh';
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
    <section id="about" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start border-b border-zinc-200/80 pb-16 dark:border-zinc-900/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              {t('about.tag')}
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              {t('about.title')}{' '}
              <span className="instrument italic font-normal">{t('about.titleAccent')}</span>
            </h2>

            {/* Both GitHub profiles display */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {t('about.verifiedProfiles')}
              </span>
              <div className="space-y-1.5">
                <a
                  href="https://github.com/Lokesh-81"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3.5 py-2 text-xs font-medium text-zinc-800 hover:border-purple-400 hover:text-purple-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5" />
                    <span>github.com/Lokesh-81</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </a>

                <a
                  href="https://github.com/lokeshnaivaidya-max"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3.5 py-2 text-xs font-medium text-zinc-800 hover:border-purple-400 hover:text-purple-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5" />
                    <span>github.com/lokeshnaivaidya-max</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-2xl font-light">
              {t('about.introGreeting')}{' '}
              <span className="font-semibold text-zinc-950 dark:text-white">{displayName}</span>,{' '}
              {t('about.introSuffix')} {location},{' '}
              {t('about.introGoal')}
            </p>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {language === 'en' && profile?.aboutSubDescription
                ? profile.aboutSubDescription
                : t('about.subDescription')}
            </p>

            {/* Fact Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('about.location')}</span>
                </div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">
                  {language === 'en' ? location : t('hero.location')}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <Languages className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('about.languages')}</span>
                </div>
                <p className="font-semibold text-[11px] text-zinc-900 dark:text-white leading-tight">
                  {languagesList}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('about.education')}</span>
                </div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">{education}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <Award className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>{t('about.recognition')}</span>
                </div>
                <p className="font-semibold text-[11px] text-zinc-900 dark:text-white leading-tight">
                  {recognition}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Philosophy Cards (Numbers removed as requested) */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              {t('about.philosophy1.title')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('about.philosophy1.desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              {t('about.philosophy2.title')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('about.philosophy2.desc')}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              {t('about.philosophy3.title')}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('about.philosophy3.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
