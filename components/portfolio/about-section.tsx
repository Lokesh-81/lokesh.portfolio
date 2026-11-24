'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  Languages,
  GraduationCap,
  Award,
  Github,
  ArrowUpRight,
  FileCheck2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Signature } from '@/components/ui/signature';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { BelvoLorModal } from '@/components/portfolio/belvo-lor-modal';
import { ResumeModal } from '@/components/portfolio/resume-modal';
import { downloadDocument } from '@/lib/document-utils';

export function AboutSection() {
  const { profile, about, experiences, activeResume } = usePortfolio();
  const { t, language } = useLanguage();
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const factsRef = useRef<HTMLDivElement>(null);
  const factsInView = useInView(factsRef, { once: true, amount: 0.32 });
  const reduceMotion = useReducedMotion();
  const [activeFact, setActiveFact] = useState<string | null>(null);
  const timelinePath = 'M 125 30 C 190 2 300 2 375 30 S 550 58 625 30 S 800 2 875 30';
  const factVariants = { hidden: { opacity: 0, y: 22 }, visible: (index: number) => ({ opacity: 1, y: 0, transition: { duration: 0.58, delay: index * 0.19, ease: 'easeOut' } }) };

  const belvoExp =
    experiences.find((e) => e.id === 'belvo') ||
    experiences.find((e) => e.company?.toLowerCase().includes('belvo')) ||
    experiences[0];
  const hasLor = belvoExp?.lor?.hasLor !== false && !!belvoExp?.lor;

  const displayName = profile?.displayName || profile?.name || 'Poosala Lokesh';
  const location = profile?.location || 'Hyderabad, India';
  const languagesList = t('about.languagesList') || 'Telugu · English · Hindi · French';
  const education = profile?.education || 'B.Sc. MSCS · 2027';
  const recognition = profile?.recognition || 'Google Student Ambassador';

  const verifiedProfiles =
    about?.verifiedProfiles && about.verifiedProfiles.length > 0
      ? about.verifiedProfiles
      : [
          { handle: 'Lokesh-81', url: 'https://github.com/Lokesh-81', label: 'github.com/Lokesh-81' },
          { handle: 'lokeshnaivaidya-max', url: 'https://github.com/lokeshnaivaidya-max', label: 'github.com/lokeshnaivaidya-max' },
        ];

  const tagText = t('about.tag', about?.tag || 'ABOUT ME');
  const titleText = t('about.title', about?.title || 'Curious by');
  const titleAccentText = t('about.titleAccent', about?.titleAccent || 'nature.');


  return (
    <div className="about-section-content relative w-full px-2 sm:px-4 py-5 sm:py-6">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-start border-b border-[#35263D] pb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#E8B8D2] font-semibold">
              <TextEffect key={`tag-${language}-${tagText}`} per="char" delay={0.05}>
                {tagText}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#F5EAF5] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}-${titleText}`} per="word" delay={0.15}>
                {titleText}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#E8B8D2]">
                {titleAccentText}
              </span>
            </h2>

            {/* Both GitHub profiles display */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B4E8]/70">
                {t('about.verifiedProfiles')}
              </span>
              <div className="space-y-2 max-w-md">
                {verifiedProfiles.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#35263D] bg-[#1A1222] px-4 py-2.5 text-xs font-medium text-[#F5EAF5] hover:border-[#E8B8D2] hover:text-[#E8B8D2] shadow-xs transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-[#D8B4E8]" />
                      <span>{p.label || p.url.replace(/^https?:\/\//, '')}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#A78BAF]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Handcrafted Opentype Signature */}
            <div className="mt-8 pt-6 border-t border-[#35263D]/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D8B4E8]/70 block mb-2">
                Signature
              </span>
              <div className="w-full max-w-full overflow-visible py-1">
                <Signature
                  text="Poosala Lokesh"
                  fontSize={28}
                  duration={1.5}
                  color="#E8B8D2"
                  className="block max-w-full"
                  fontUrl="/LastoriaBoldRegular.otf"
                  inView={true}
                  once={true}
                />
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="text-lg leading-relaxed text-[#F5EAF5] md:text-xl font-light">
              <TextEffect key={`intro-${language}`} per="word" delay={0.25}>
                {`${t('about.introGreeting')} ${displayName}, ${t('about.introSuffix')} ${location}, ${t('about.introGoal')}`}
              </TextEffect>
            </div>

            <div className="text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
              <TextEffect key={`subdesc-${language}`} per="word" delay={0.4}>
                {language === 'en' && profile?.aboutSubDescription
                  ? profile.aboutSubDescription
                  : t('about.subDescription')}
              </TextEffect>
            </div>

            {/* Living timeline: scroll reveal, continuous SVG motion, and per-fact interaction */}
            <div
              ref={factsRef}
              className="about-facts-grid pt-1"
              aria-label="Personal details"
              data-active={activeFact || ''}
            >
              <span className="about-facts-orb about-facts-orb-one" aria-hidden="true" />
              <span className="about-facts-orb about-facts-orb-two" aria-hidden="true" />
              <span className="about-facts-orb about-facts-orb-three" aria-hidden="true" />
              <motion.svg className="about-facts-path" viewBox="0 0 1000 64" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="about-facts-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e9c5a6" />
                    <stop offset="48%" stopColor="#c9b5e7" />
                    <stop offset="100%" stopColor="#e9b9ca" />
                  </linearGradient>
                  <filter id="about-facts-dot-glow" x="-300%" y="-300%" width="600%" height="600%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <motion.path
                  id="about-facts-route"
                  d={timelinePath}
                  fill="none"
                  stroke="#aa9a86"
                  strokeWidth="1.8"
                  strokeDasharray="4 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={reduceMotion ? { pathLength: 1, opacity: 0.55 } : factsInView ? { pathLength: 1, opacity: 0.72 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  className="about-facts-segment about-facts-segment-1"
                  d="M 125 30 C 190 2 300 2 375 30"
                  fill="none" stroke="#d6a9b8" strokeWidth="3.2" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={factsInView ? { pathLength: 1, opacity: 0.12 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.35 }}
                />
                <motion.path
                  className="about-facts-segment about-facts-segment-2"
                  d="M 375 30 C 450 58 550 58 625 30"
                  fill="none" stroke="#b9a8db" strokeWidth="3.2" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={factsInView ? { pathLength: 1, opacity: 0.12 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.55 }}
                />
                <motion.path
                  className="about-facts-segment about-facts-segment-3"
                  d="M 625 30 C 700 2 800 2 875 30"
                  fill="none" stroke="#a9cbb4" strokeWidth="3.2" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={factsInView ? { pathLength: 1, opacity: 0.12 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.1, delay: 0.75 }}
                />
                {!reduceMotion && factsInView && (
                  <>
                    <motion.path
                      d={timelinePath}
                      pathLength={1}
                      fill="none"
                      stroke="url(#about-facts-gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="0.12 0.88"
                      initial={{ strokeDashoffset: 1, opacity: 0 }}
                      animate={{ strokeDashoffset: [1, 0], opacity: [0.35, 0.9, 0.35] }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                    />
                    <circle r="6.5" fill="#fff9e9" stroke="#d8a9c6" strokeWidth="2" filter="url(#about-facts-dot-glow)">
                      <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={timelinePath} />
                    </circle>
                  </>
                )}
              </motion.svg>

              <motion.div
                custom={0} variants={factVariants} initial={reduceMotion ? false : 'hidden'}
                animate={reduceMotion || factsInView ? 'visible' : 'hidden'}
                className="about-fact about-fact-location" data-active={activeFact === 'location'}
                tabIndex={0} role="group" aria-label={`${t('about.location')}: ${location}`}
                onPointerEnter={() => setActiveFact('location')} onPointerLeave={() => setActiveFact((v) => v === 'location' ? null : v)}
                onPointerDown={() => setActiveFact('location')} onFocus={() => setActiveFact('location')}
                onBlur={() => setActiveFact((v) => v === 'location' ? null : v)}
              >
                <motion.span className="about-fact-icon" animate={factsInView && !reduceMotion ? { y: [0, -5, 0], rotate: [0, -2, 0] } : undefined} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }} whileHover={reduceMotion ? undefined : { y: -5, rotate: 12, scale: 1.1, boxShadow: '0 0 22px rgba(255, 224, 160, .7)' }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}><MapPin aria-hidden="true" /></motion.span>
                <motion.div className="about-fact-copy" initial={false} animate={reduceMotion || factsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: 0.45, delay: 0.08 }}>
                  <span className="about-fact-label">{t('about.location')}</span><p>{language === 'en' ? location : t('hero.location')}</p>
                </motion.div>
              </motion.div>

              <motion.div
                custom={1} variants={factVariants} initial={reduceMotion ? false : 'hidden'}
                animate={reduceMotion || factsInView ? 'visible' : 'hidden'}
                className="about-fact about-fact-languages" data-active={activeFact === 'languages'}
                tabIndex={0} role="group" aria-label={`${t('about.languages')}: ${languagesList}`}
                onPointerEnter={() => setActiveFact('languages')} onPointerLeave={() => setActiveFact((v) => v === 'languages' ? null : v)}
                onPointerDown={() => setActiveFact('languages')} onFocus={() => setActiveFact('languages')}
                onBlur={() => setActiveFact((v) => v === 'languages' ? null : v)}
              >
                <motion.span className="about-fact-icon" animate={factsInView && !reduceMotion ? { y: [0, -5, 0], rotate: [0, 3, 0] } : undefined} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }} whileHover={reduceMotion ? undefined : { y: -5, rotate: -12, scale: 1.1, boxShadow: '0 0 22px rgba(217, 239, 223, .8)' }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}><Languages aria-hidden="true" /></motion.span>
                <motion.div className="about-fact-copy" initial={false} animate={reduceMotion || factsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: 0.45, delay: 0.27 }}>
                  <span className="about-fact-label">{t('about.languages')}</span><p>{languagesList}</p>
                </motion.div>
              </motion.div>

              <motion.div
                custom={2} variants={factVariants} initial={reduceMotion ? false : 'hidden'}
                animate={reduceMotion || factsInView ? 'visible' : 'hidden'}
                className="about-fact about-fact-education" data-active={activeFact === 'education'}
                tabIndex={0} role="group" aria-label={`${t('about.education')}: ${education}`}
                onPointerEnter={() => setActiveFact('education')} onPointerLeave={() => setActiveFact((v) => v === 'education' ? null : v)}
                onPointerDown={() => setActiveFact('education')} onFocus={() => setActiveFact('education')}
                onBlur={() => setActiveFact((v) => v === 'education' ? null : v)}
              >
                <motion.span className="about-fact-icon" animate={factsInView && !reduceMotion ? { y: [0, -4, 0], rotate: [0, -2, 0] } : undefined} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }} whileHover={reduceMotion ? undefined : { y: -5, rotate: 10, scale: 1.1, boxShadow: '0 0 22px rgba(231, 221, 247, .85)' }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}><GraduationCap aria-hidden="true" /></motion.span>
                <motion.div className="about-fact-copy" initial={false} animate={reduceMotion || factsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: 0.45, delay: 0.46 }}>
                  <span className="about-fact-label">{t('about.education')}</span><p>{education}</p>
                </motion.div>
              </motion.div>

              <motion.div
                custom={3} variants={factVariants} initial={reduceMotion ? false : 'hidden'}
                animate={reduceMotion || factsInView ? 'visible' : 'hidden'}
                className="about-fact about-fact-recognition" data-active={activeFact === 'recognition'}
                tabIndex={0} role="group" aria-label={`${t('about.recognition')}: ${recognition}`}
                onPointerEnter={() => setActiveFact('recognition')} onPointerLeave={() => setActiveFact((v) => v === 'recognition' ? null : v)}
                onPointerDown={() => setActiveFact('recognition')} onFocus={() => setActiveFact('recognition')}
                onBlur={() => setActiveFact((v) => v === 'recognition' ? null : v)}
              >
                <motion.span className="about-fact-icon" animate={factsInView && !reduceMotion ? { y: [0, -5, 0], rotate: [0, 3, 0] } : undefined} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.65 }} whileHover={reduceMotion ? undefined : { y: -5, rotate: -10, scale: 1.1, boxShadow: '0 0 22px rgba(246, 220, 232, .85)' }} whileTap={reduceMotion ? undefined : { scale: 0.96 }}><Award aria-hidden="true" /></motion.span>
                <motion.div className="about-fact-copy" initial={false} animate={reduceMotion || factsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: 0.45, delay: 0.65 }}>
                  <span className="about-fact-label">{t('about.recognition')}</span><p>{recognition}</p>
                </motion.div>
              </motion.div>
            </div>
            {/* Active Google Cloud Certification Callout */}
            <div className="about-credential-card about-credential-card--certificate rounded-2xl border border-[#F9AB00]/40 bg-[#F9AB00]/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src="/professional-cloud-architect-certification.svg"
                  alt="Google Cloud Certified Professional Cloud Architect"
                  className="h-11 w-11 shrink-0 object-contain drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#F5EAF5]">
                      Google Cloud Certified — Professional Cloud Architect
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D8B4E8]/80 font-mono mt-0.5">
                    Series #128554 · ID: 7cffa63a... · Valid Sep 2026 – Sep 2028
                  </p>
                </div>
              </div>
              <a
                href="#certifications"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8B8D2] hover:text-white transition-colors cursor-pointer shrink-0 rounded-xl bg-[#F9AB00]/20 border border-[#F9AB00]/40 px-3 py-1.5"
              >
                <span>View Certificate & Skill Badges</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Official Letter of Recommendation (Belvo Company) Callout */}
            {hasLor && (
              <div className="about-credential-card about-credential-card--lor rounded-2xl border border-purple-500/40 bg-purple-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <FileCheck2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white">
                        {belvoExp?.lor?.issuer || 'Belvo Company'} — {belvoExp?.lor?.title || 'Letter of Recommendation (LOR)'}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        {belvoExp?.lor?.role || 'CEO Commendation'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#DCCFE0] mt-0.5 font-mono">
                      Issued {belvoExp?.lor?.date || '22-09-2026'} by {belvoExp?.lor?.issuedBy || 'Hrishikesh Mishra'} ({belvoExp?.lor?.role || 'CEO, Belvo'}) · {belvoExp?.lor?.location || 'Goregaon, Mumbai'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-200 hover:text-white transition-colors cursor-pointer shrink-0 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 px-3 py-1.5 shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Official LOR (PDF)</span>
                </button>
              </div>
            )}

            {/* Official Curriculum Vitae / ATS Resume Callout */}
            <div className="about-credential-card about-credential-card--resume rounded-2xl border border-blue-500/40 bg-blue-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {activeResume?.title || 'Official Curriculum Vitae (ATS Resume)'}
                    </span>
                    
                  </div>
                  <p className="text-[11px] text-[#DCCFE0] mt-0.5 font-mono">
                    Full Stack Engineer · Google Cloud Certified · Verified Experience &amp; Tech Stack
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors cursor-pointer rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 px-3 py-1.5 shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadDocument(
                      activeResume?.url || '/resume.pdf',
                      activeResume?.title || 'Poosala_Lokesh_Resume.pdf'
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition-colors cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 shadow-sm"
                >
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Philosophy Cards (No numbers) */}
        <div className="about-philosophy-grid mt-8 grid gap-4 md:grid-cols-3 pb-0">
          <div className="about-philosophy-card rounded-2xl border border-[#35263D] bg-[#1A1222]/80 p-4 shadow-xs hover:border-[#E8B8D2] transition-colors">
            <h3 className="text-base font-bold text-[#F5EAF5]">
              <TextEffect key={`phil1-title-${language}`} per="word" delay={0.5}>
                {t('about.philosophy1.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
              {t('about.philosophy1.desc')}
            </p>
          </div>

          <div className="about-philosophy-card rounded-2xl border border-[#35263D] bg-[#1A1222]/80 p-4 shadow-xs hover:border-[#E8B8D2] transition-colors">
            <h3 className="text-base font-bold text-[#F5EAF5]">
              <TextEffect key={`phil2-title-${language}`} per="word" delay={0.55}>
                {t('about.philosophy2.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
              {t('about.philosophy2.desc')}
            </p>
          </div>

          <div className="about-philosophy-card rounded-2xl border border-[#35263D] bg-[#1A1222]/80 p-4 shadow-xs hover:border-[#E8B8D2] transition-colors">
            <h3 className="text-base font-bold text-[#F5EAF5]">
              <TextEffect key={`phil3-title-${language}`} per="word" delay={0.6}>
                {t('about.philosophy3.title')}
              </TextEffect>
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
              {t('about.philosophy3.desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Official Belvo Letter of Recommendation Viewer Modal */}
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />

      {/* Official ATS Resume Viewer Modal */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  );
}
