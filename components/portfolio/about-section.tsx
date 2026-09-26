'use client';

import React, { useState } from 'react';
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
import { Spotlight } from '@/components/core/spotlight';
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
              <TextEffect key={`tag-${language}-${tagText}`} per="char" delay={0.05}>
                {tagText}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}-${titleText}`} per="word" delay={0.15}>
                {titleText}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {titleAccentText}
              </span>
            </h2>

            {/* Both GitHub profiles display */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5B4FC]/70">
                {t('about.verifiedProfiles')}
              </span>
              <div className="space-y-2 max-w-md">
                {verifiedProfiles.map((p, idx) => (
                  <a
                    key={idx}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2.5 text-xs font-medium text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] shadow-xs transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-[#A5B4FC]" />
                      <span>{p.label || p.url.replace(/^https?:\/\//, '')}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Handcrafted Opentype Signature */}
            <div className="mt-8 pt-6 border-t border-[#1F2937]/80">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5B4FC]/70 block mb-2">
                Signature
              </span>
              <div className="overflow-visible py-1">
                <Signature
                  text="Poosala Lokesh"
                  fontSize={28}
                  duration={1.5}
                  color="#60A5FA"
                  fontUrl="/LastoriaBoldRegular.otf"
                  inView={true}
                  once={true}
                />
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

            {/* Active Google Cloud Certification Callout */}
            <div className="rounded-2xl border border-[#F9AB00]/40 bg-[#F9AB00]/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src="/professional-cloud-architect-certification.svg"
                  alt="Google Cloud Certified Professional Cloud Architect"
                  className="h-11 w-11 shrink-0 object-contain drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#E0E7FF]">
                      Google Cloud Certified — Professional Cloud Architect
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A5B4FC]/80 font-mono mt-0.5">
                    Series #128554 · ID: 7cffa63a... · Valid Sep 2026 – Sep 2028 · 37 Google Cloud Skill Badges
                  </p>
                </div>
              </div>
              <a
                href="#certifications"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] hover:text-white transition-colors cursor-pointer shrink-0 rounded-xl bg-[#F9AB00]/20 border border-[#F9AB00]/40 px-3 py-1.5"
              >
                <span>View Cert & 37 Badges</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Official Letter of Recommendation (Belvo Company) Callout */}
            {hasLor && (
              <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
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
                    <p className="text-[11px] text-[#CBD5E1] mt-0.5 font-mono">
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
            <div className="rounded-2xl border border-blue-500/40 bg-blue-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-white">
                      {activeResume?.title || 'Official Curriculum Vitae (ATS Resume)'}
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {activeResume?.version || 'Active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#CBD5E1] mt-0.5 font-mono">
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

      {/* Official Belvo Letter of Recommendation Viewer Modal */}
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />

      {/* Official ATS Resume Viewer Modal */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  );
}
