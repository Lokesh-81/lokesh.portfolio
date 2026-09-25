'use client';

import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { TextLoop } from '@/components/core/text-loop';
import { GlowEffect } from '@/components/core/glow-effect';
import { Spotlight } from '@/components/core/spotlight';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
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
  const { hero, profile } = usePortfolio();

  const greetingText = t('hero.greeting', hero?.greeting || "Hello, I'm");
  const nameText = t('hero.name', hero?.name || profile?.displayName || 'Poosala Lokesh.');
  const imAText = t('hero.imA', hero?.imA || "I'm a");
  const bioText = t('hero.bio', hero?.bio);
  const ctaWorkText = t('hero.ctaWork', hero?.ctaWork || 'View My Work');
  const ctaContactText = t('hero.ctaContact', hero?.ctaContact || "Let's Work Together");

  const rotatingWordsByLang: Record<string, string[]> = {
    en: ['Full Stack Developer', 'Google Cloud Architect', 'AI Engineer', 'Creative Problem Solver'],
    te: ['ఫుల్ స్టాక్ డెవలపర్', 'గూగుల్ క్లౌడ్ ఆర్కిటెక్ట్', 'AI ఇంజనీర్', 'సృజనాత్మక పరిష్కారకర్త'],
    hi: ['फुल स्टैक डेवलपर', 'गूगल क्लाउड आर्किटेक्ट', 'AI इंजीनियर', 'समस्या समाधानकर्ता'],
    ta: ['ஃபுல் ஸ்டாக் டெவலப்பர்', 'கூகிள் கிளவுட் ஆர்க்கிடெக்ட்', 'AI பொறியாளர்', 'தீர்வு உருவாக்குநர்'],
    kn: ['ಫುಲ್ ಸ್ಟ್ಯಾಕ್ ಡೆವಲಪರ್', 'ಗೂಗಲ್ ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಟ್', 'AI ಎಂಜಿನಿಯರ್', 'ಸಮಸ್ಯೆ ಪರಿಹಾರಕ'],
    ml: ['ഫുൾ സ്റ്റാക്ക് ഡെവലപ്പർ', 'ഗൂഗിൾ ക്ലൗഡ് ആർക്കിടെക്റ്റ്', 'AI എഞ്ചിനീയർ', 'പ്രശ്നപരിഹാരകൻ'],
    bn: ['ফুল স্ট্যাক ডেভেলপার', 'গুগল ক্লাউড আর্কিটেক্ট', 'এআই প্রকৌশলী', 'সমস্যা সমাধানকারী'],
    mr: ['फुल स्टॅक डेव्हलपर', 'गुगल क्लाउड आर्किटेक्ट', 'AI अभियंता', 'समस्या निवारक'],
    es: ['Desarrollador Full Stack', 'Arquitecto Google Cloud', 'Ingeniero de IA', 'Solucionador Creativo'],
    fr: ['Développeur Full Stack', 'Architecte Cloud Google', 'Ingénieur IA', 'Résolveur de Problèmes'],
    de: ['Full-Stack-Entwickler', 'Google Cloud-Architekt', 'KI-Ingenieur', 'Kreativer Problemlöser'],
    ja: ['フルスタックエンジニア', 'Google Cloud アーキテクト', 'AI エンジニア', '問題解決スペシャリスト'],
  };

  const rotatingWords = rotatingWordsByLang[language] || rotatingWordsByLang.en;
  const rotatingColors = ['text-[#60A5FA]', 'text-[#FDE68A]', 'text-[#C084FC]', 'text-[#2DD4BF]'];

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col justify-center px-4 sm:px-8 py-10 sm:py-16">
      {/* Spotlight on Hero Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.14)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={500}
      />

      <div className="mx-auto my-auto w-full max-w-[1400px]">
        <div className="flex flex-col justify-center max-w-4xl">
          {/* Hero Typography & Actions */}
          <div className="relative z-10 flex flex-col justify-center">
            {/* 1. Main Heading with TextEffect character-by-character animation */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#E0E7FF] leading-[1.08]">
              <span className="block text-[#A5B4FC] font-normal text-3xl sm:text-5xl md:text-6xl mb-1">
                <TextEffect
                  key={`greet-${language}-${greetingText}`}
                  per="char"
                  delay={0.1}
                  variants={textEffectVariants}
                >
                  {greetingText}
                </TextEffect>
              </span>
              <span className="block font-bold tracking-tight text-[#E0E7FF]">
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
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-lg text-[#CBD5E1] md:text-2xl font-light">
              <span className="text-[#A5B4FC]/80 font-normal">{imAText}</span>
              <TextLoop
                className="font-medium text-[#E0E7FF]"
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
                  <span className="text-xs font-semibold text-[#FDE68A] flex items-center gap-1.5">
                    {hero?.featuredCredentialTitle || 'Google Cloud Certified Professional Cloud Architect'}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#F9AB00]/20 text-[#F9AB00]">
                      {hero?.featuredCredentialDate || 'Sep 2026'}
                    </span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-[#FDE68A] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            {/* 3. Description with TextEffect */}
            <div className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
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
                  className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
                  className="relative inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827]/90 px-6 py-3.5 text-sm font-semibold text-[#E0E7FF] shadow-xs transition-all hover:border-[#60A5FA] hover:bg-[#1F2937] active:scale-[0.98] cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-[#A5B4FC]" />
                  <span>{ctaContactText}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

