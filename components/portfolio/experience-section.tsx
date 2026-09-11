'use client';

import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';

const experienceTranslations: Record<
  string,
  Record<
    string,
    {
      company?: string;
      role?: string;
      period?: string;
      location?: string;
      description?: string;
      responsibilities?: string[];
    }
  >
> = {
  fr: {
    belvo: {
      company: 'BELVO',
      role: 'Stagiaire Développeur Web',
      period: 'Juin 2026 – Septembre 2026',
      location: 'À distance',
      description:
        'Conception de plateformes numériques d’entreprise et de moteurs de flux cliniques (notamment Naivaidya), direction de l’architecture frontend, flux d’authentification des patients avec Supabase et systèmes web réactifs.',
      responsibilities: [
        'Direction de l’équipe de développement frontend sur la planification des sprints et les systèmes de conception modulaires',
        'Implémentation de l’authentification sécurisée des patients par OTP et tableaux de bord d’administration',
        'Architecture d’applications web full-stack et de composants réutilisables avec React, TypeScript et Tailwind CSS',
        'Intégration de Supabase et d’API REST pour la persistance temps réel et le contrôle d’accès RBAC',
        'Optimisation des performances de build en production sur les réseaux périphériques Vercel',
      ],
    },
    'google-ambassador': {
      company: 'Programme des Ambassadeurs Étudiants Google',
      role: 'Ambassadeur Étudiant Google',
      period: '2025',
      location: 'À distance',
      description:
        'Représentation des écosystèmes de développeurs et de la communauté étudiante, organisation d’ateliers techniques et promotion de l’alphabétisation autour de Gemini AI et des outils génératifs.',
      responsibilities: [
        'Animation d’ateliers pratiques axés sur les API Gemini AI, l’ingénierie de prompts et les applications GenAI',
        'Développement de la communauté étudiante via des sessions d’IA et des hackathons collaboratifs',
        'Mentorat d’étudiants pour concevoir des applications concrètes et adopter les meilleures pratiques logicielles',
      ],
    },
  },
};

export function ExperienceSection() {
  const { experiences } = usePortfolio();
  const { t, language } = useLanguage();

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Experience Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header with TextEffect (No numbers) */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('experience.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('experience.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('experience.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('experience.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* Timeline List */}
        <div className="mt-8 space-y-6 pb-12">
          {experiences.map((exp) => {
            const tr = experienceTranslations[language]?.[exp.id];
            const company = tr?.company || exp.company;
            const role = tr?.role || exp.role;
            const period = tr?.period || exp.period;
            const location = tr?.location || exp.location;
            const description = tr?.description || exp.description;
            const responsibilities = tr?.responsibilities || exp.responsibilities;

            return (
              <div
                key={exp.id}
                className="group relative rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-7 shadow-xs transition-all hover:border-[#60A5FA] hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#1F2937] pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
                      {company}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#E0E7FF] mt-0.5">
                      {role}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#CBD5E1]">
                    <span className="flex items-center gap-1 font-mono rounded-full bg-[#0B132B] px-3 py-1 border border-[#1F2937] text-[#A5B4FC]">
                      <Calendar className="h-3 w-3 text-[#60A5FA]" />
                      {period}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-[#0B132B] px-3 py-1 border border-[#1F2937] text-[#CBD5E1]">
                      <MapPin className="h-3 w-3 text-[#A5B4FC]/80" />
                      {location}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                  {description}
                </p>

                {responsibilities && responsibilities.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]/70">
                      {t('experience.highlights')}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                      {responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#1F2937] pt-4">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#1F2937] bg-[#1F2937]/70 px-2.5 py-0.5 font-mono text-[11px] text-[#E0E7FF]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
