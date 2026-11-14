'use client';

import React, { useState } from 'react';
import { ArrowRight, Mail, FileText } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { TextLoop } from '@/components/core/text-loop';
import { GlowEffect } from '@/components/core/glow-effect';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
import { ResumeModal } from '@/components/portfolio/resume-modal';
import type { Variants } from 'framer-motion';

export interface HeroProps {
  onNavigate?: (section: string) => void;
}

const textEffectVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 16,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  },
};

export function Hero({ onNavigate }: HeroProps) {
  const { t, language } = useLanguage();
  const { hero, profile, activeResume } = usePortfolio();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const greetingText = t('hero.greeting', hero?.greeting || "Hello, I'm");
  const nameText = t('hero.name', hero?.name || profile?.displayName || 'Poosala Lokesh.');
  const imAText = t('hero.imA', hero?.imA || "I'm a");
  const bioText = t('hero.bio', hero?.bio);
  const ctaWorkText = t('hero.ctaWork', hero?.ctaWork || 'View My Work');
  const ctaContactText = t('hero.ctaContact', hero?.ctaContact || "Let's Work Together");

  const rotatingWordsByLang: Record<string, string[]> = {
    en: ['Full Stack Web Developer'],
    te: ['Full Stack Web Developer'],
    hi: ['Full Stack Web Developer'],
    ta: ['Full Stack Web Developer'],
    kn: ['Full Stack Web Developer'],
    ml: ['Full Stack Web Developer'],
    bn: ['Full Stack Web Developer'],
    mr: ['Full Stack Web Developer'],
    es: ['Full Stack Web Developer'],
    fr: ['Full Stack Web Developer'],
    de: ['Full Stack Web Developer'],
    ja: ['Full Stack Web Developer'],
  };

  const rotatingWords = rotatingWordsByLang[language] || rotatingWordsByLang.en;
  const rotatingColors = ['text-[#E8B8D2]', 'text-[#E8B8D2]', 'text-[#D8B4E8]', 'text-[#A77BC2]'];

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col justify-center px-4 sm:px-8 py-10 sm:py-16">
      <div className="mx-auto my-auto w-full max-w-[1400px]">
        <div className="flex flex-col justify-center max-w-4xl">
          {/* Hero Typography & Actions */}
          <div className="relative z-10 flex flex-col justify-center">
            {/* 1. Main Heading with TextEffect character-by-character animation */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#F5EAF5] leading-[1.08]">
              <span className="block text-[#D8B4E8] font-normal text-3xl sm:text-5xl md:text-6xl mb-1">
                <TextEffect
                  key={`greet-${language}-${greetingText}`}
                  per="char"
                  delay={0.1}
                  variants={textEffectVariants}
                >
                  {greetingText}
                </TextEffect>
              </span>
              <span className="block font-bold tracking-tight text-[#F5EAF5]">
                <TextEffect
                  key={`name-${language}-${nameText}`}
                  per="char"
                  delay={0.25}
                  variants={textEffectVariants}
                >
                  {nameText}
                </TextEffect>
              </span>
            </h1>

            {/* 2. Rotating / Changing Text Loop */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-lg text-[#DCCFE0] md:text-2xl font-light">
              <span className="text-[#D8B4E8]/80 font-normal">{imAText}</span>
              <TextLoop
                className="font-medium text-[#F5EAF5]"
                interval={2600}
                variants={{
                  initial: {
                    y: 20,
                    rotateX: 90,
                    opacity: 0,
                    filter: 'blur(4px)',
                  },
                  animate: {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                  },
                  exit: {
                    y: -20,
                    rotateX: -90,
                    opacity: 0,
                    filter: 'blur(4px)',
                  },
                }}
              >
                {rotatingWords.map((word, index) => (
                  <span key={index} className={rotatingColors[index % rotatingColors.length]}>
                    {word}
                  </span>
                ))}
              </TextLoop>
            </div>

            {/* Featured Credential Pill */}
            {(hero?.showAvailability !== false) && (
              <div className="mt-4">
                <button
                  onClick={() => onNavigate?.(hero?.featuredCredentialLink || 'certifications')}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-[#F9AB00]/40 bg-[#F9AB00]/10 hover:bg-[#F9AB00]/20 px-3.5 py-1.5 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_16px_rgba(249,171,0,0.15)]"
                  title="View Google Cloud Certified Professional Cloud Architect Credential"
                >
                  <img
                    src="/professional-cloud-architect-certification.svg"
                    alt="GCP Badge"
                    className="h-5 w-5 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-semibold text-[#E8B8D2] flex items-center gap-1.5">
                    {hero?.featuredCredentialTitle || 'Google Cloud Certified Professional Cloud Architect'}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#F9AB00]/20 text-[#F9AB00]">
                      {hero?.featuredCredentialDate || 'Sep 2026'}
                    </span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-[#E8B8D2] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* 3. Description with TextEffect */}
            <div className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#DCCFE0]">
              <TextEffect
                key={`bio-${language}-${bioText.slice(0, 20)}`}
                per="word"
                delay={0.4}
              >
                {bioText}
              </TextEffect>
            </div>

            {/* 4. CTA Buttons with Glow Effect on both primary actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="relative group">
                <GlowEffect
                  colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                  mode="colorShift"
                  blur="soft"
                  duration={3}
                  scale={0.9}
                />
                <button
                  onClick={() => onNavigate?.('work')}
                  className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>{ctaWorkText}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="relative group">
                <GlowEffect
                  colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                  mode="colorShift"
                  blur="soft"
                  duration={3}
                  scale={0.9}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <button
                  onClick={() => onNavigate?.('contact')}
                  className="relative inline-flex items-center gap-2 rounded-xl border border-[#35263D] bg-[#1A1222]/90 px-6 py-3.5 text-sm font-semibold text-[#F5EAF5] shadow-xs transition-all hover:border-[#E8B8D2] hover:bg-[#35263D] active:scale-[0.98] cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-[#D8B4E8]" />
                  <span>{ctaContactText}</span>
                </button>
              </div>

              {/* View / Download Official Resume Button */}
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-950/40 px-5 py-3.5 text-sm font-semibold text-blue-200 shadow-xs transition-all hover:border-blue-400 hover:text-white hover:bg-blue-900/40 active:scale-[0.98] cursor-pointer"
                title="View & Download Official ATS Resume"
              >
                <FileText className="h-4 w-4 text-blue-400" />
                <span>Resume (CV)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official ATS Resume Modal */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  );
}

