'use client';

import React, { useState, useMemo } from 'react';
import {
  Award,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  FileText,
  FileCheck2,
  Building2,
  Server,
  Lock,
  Zap,
  Layers,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Database,
  Cpu,
  Boxes,
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { GcpBadge } from '@/components/portfolio/gcp-badge';
import { BelvoLorModal } from '@/components/portfolio/belvo-lor-modal';
import { SkillBadgeCard } from '@/components/portfolio/skill-badge-card';
import { SkillBadgeModal } from '@/components/portfolio/skill-badge-modal';
import {
  certifications as fallbackCertifications,
  skillBadges,
  SkillBadge,
  BadgeCategory,
} from '@/lib/data/certifications';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';

export interface CertificationsSectionProps {
  onNavigate?: (section: string) => void;
}

const CATEGORIES: Array<'All' | BadgeCategory> = [
  'All',
  'Machine Learning & AI',
  'Security',
  'Smart Analytics',
  'Infrastructure & Networking',
  'Serverless & Apps',
  'Kubernetes & DevOps',
  'Databases & Storage',
];

export function CertificationsSection({ onNavigate }: CertificationsSectionProps) {
  const { t, language } = useLanguage();
  const { experiences, certifications: studioCertifications } = usePortfolio();
  const belvoExperience = experiences.find((item) => item.id === 'belvo' || item.company?.toLowerCase().includes('belvo'));
  const belvoPdfUrl = belvoExperience?.lor?.pdfUrl || '';
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<SkillBadge | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<'All' | BadgeCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Introductory' | 'Intermediate' | 'Advanced'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep bundled credentials visible even when Studio only contains a partial
  // set of database rows. Studio values override defaults by ID.
  const studioCertificationsById = new Map(studioCertifications.map((item) => [item.id, item]));
  const certifications = [
    ...fallbackCertifications.map((fallback) => {
      const item = studioCertificationsById.get(fallback.id);
      if (!item) return fallback;
      return {
        ...fallback,
        ...item,
        credentialUrl: item.credentialUrl || fallback.credentialUrl || '',
        verificationUrl: item.verificationUrl || fallback.verificationUrl || '',
      };
    }),
    ...studioCertifications.filter(
      (item) => !fallbackCertifications.some((fallback) => fallback.id === item.id),
    ),
  ];
  const cert = certifications.find((item) => item.id === 'gcp-pca') || certifications[0];
  const ambassadorCert = certifications.find((item) => item.id === 'google-student-ambassador-2026');

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtered badges list
  const filteredBadges = useMemo(() => {
    return skillBadges.filter((badge) => {
      const matchesCategory =
        selectedCategory === 'All' || badge.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'All' || badge.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        badge.title.toLowerCase().includes(q) ||
        (badge.category && badge.category.toLowerCase().includes(q)) ||
        (badge.description && badge.description.toLowerCase().includes(q)) ||
        (badge.skills && badge.skills.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  return (
    <div className="certifications-sketchbook relative w-full px-4 sm:px-8 py-8 sm:py-12">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#35263D] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#E8B8D2] font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-[#F9AB00]" />
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('certifications.tag') || 'PROFESSIONAL CREDENTIALS'}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#F5EAF5] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('certifications.title') || 'Certifications &'}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#F9AB00]">
                {t('certifications.titleAccent') || 'Google Cloud Badges.'}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('certifications.subtitle') ||
                'Official enterprise certifications and skill badges validating cloud solution architecture, generative AI, cybersecurity, Kubernetes, and smart data analytics on Google Cloud.'}
            </TextEffect>
          </div>
        </div>

        {/* Featured Showcase Card for Google Cloud Certified Professional Cloud Architect */}
        <div className="belvo-certification-showcase mt-8 rounded-3xl border border-[#35263D] bg-[#1A1222]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-[#E8B8D2]/60 transition-all">
          {/* Subtle Ambient Backdrop Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(66,133,244,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,171,0,0.1),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[320px_1fr] items-start">
            {/* Left Column: Official Badge & Credential Verification Actions */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-[#35263D] bg-[#100B18]/80 shadow-inner">
              {/* Badge Visual */}
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="group/badge relative block"
                title="Open the official Google Cloud credential verification page"
                aria-label="Open official Google Cloud Professional Cloud Architect credential"
              >
                <GcpBadge size={190} className="mx-auto" />
                <span className="absolute bottom-1 right-1 rounded-full bg-[#1A1222] border border-[#35263D] p-1.5 text-[#E8B8D2] opacity-0 group-hover/badge:opacity-100 transition-opacity shadow-md">
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>

              {/* Status Pill */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Credential · Valid 2026–2028</span>
              </div>

              {/* Series ID & Dates */}
              <div className="mt-4 w-full space-y-2 border-t border-[#35263D] pt-3 text-left text-xs font-mono text-[#D8B4E8]/80">
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Series ID:</span>
                  <span className="text-[#F5EAF5] font-semibold">{cert.seriesId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Issued:</span>
                  <span className="text-[#F5EAF5]">{cert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Expires:</span>
                  <span className="text-[#F5EAF5]">{cert.expirationDate}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#A78BAF]">Verification ID:</span>
                  <button
                    onClick={() => handleCopy(cert.credentialId || '')}
                    className="flex items-center gap-1 text-[11px] text-[#E8B8D2] hover:text-[#E8B8D2] transition-colors cursor-pointer"
                    title="Click to copy full ID"
                  >
                    {copiedId === cert.credentialId ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{(cert.credentialId || '').slice(0, 8)}...</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Interactive Actions */}
              <div className="mt-5 w-full space-y-2">
                <a
                  href={cert.credentialUrl || cert.verificationUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!cert.credentialUrl && !cert.verificationUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Official Google Cloud Credential</span>
                </a>

                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#35263D] bg-[#1A1222] px-4 py-2 text-xs font-medium text-[#DCCFE0] hover:border-[#E8B8D2] hover:text-[#E8B8D2] transition-colors cursor-pointer"
                >
                  <span>Verify on Google Directory</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#A78BAF]" />
                </a>
              </div>
            </div>

            {/* Right Column: Deep Certification Content & Architecture Competencies */}
            <div className="space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F9AB00] font-semibold bg-[#F9AB00]/10 border border-[#F9AB00]/30 px-2.5 py-0.5 rounded-full">
                    {cert.issuer}
                  </span>
                  <span className="text-xs text-[#A78BAF]">·</span>
                  <span className="text-xs text-[#DCCFE0] font-mono">
                    Candidate: <strong className="text-[#F5EAF5]">{cert.recipient}</strong> ({cert.certifiedAs})
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5EAF5]">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-[#D8B4E8]/90">
                  {cert.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
                {cert.description}
              </p>

              {/* 4 Core Architectural Competency Domains */}
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider text-[#E8B8D2] font-mono font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Architectural Competency Domains
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(cert.domains || []).map((dom, idx) => {
                    const icons = [Server, Layers, Lock, Zap];
                    const IconComp = icons[idx % icons.length];
                    return (
                      <div
                        key={dom.title}
                        className="rounded-xl border border-[#35263D] bg-[#100B18]/60 p-3.5 hover:border-[#E8B8D2]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#F5EAF5] mb-1">
                          <IconComp className="h-3.5 w-3.5 text-[#E8B8D2]" />
                          <span>{dom.title}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#DCCFE0]">
                          {dom.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technologies Tag Group */}
              <div className="border-t border-[#35263D] pt-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BAF] block mb-2.5">
                  Core GCP Infrastructure & Services Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(cert.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#35263D] bg-[#1A1222] px-2.5 py-1 font-mono text-[11px] text-[#F5EAF5] hover:border-[#E8B8D2] hover:text-[#E8B8D2] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showcase Card for Belvo Company Official Letter of Recommendation (LOR) */}
        <div className="belvo-lor-showcase mt-8 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-[#1A1222] to-[#100B18] p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-purple-400/60 transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.18),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] items-start">
            {/* Left column groups preview and verification to prevent an empty grid row. */}
            <div className="min-w-0 space-y-4">
            <div className="belvo-lor-thumbnail" role="button" tabIndex={0} onClick={() => setIsLorModalOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setIsLorModalOpen(true); }} aria-label="Open official Belvo Letter of Recommendation">
              {belvoPdfUrl ? (
                <>
                  <iframe src={belvoPdfUrl + "#page=1&toolbar=0&navpanes=0&scrollbar=0"} title="Belvo Letter of Recommendation preview" loading="lazy" tabIndex={-1} />
                  <a href={belvoPdfUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>OPEN ORIGINAL BELVO PDF ↗</a>
                </>
              ) : (
                <p className="p-5 text-sm text-center">Add the official LOR PDF in Studio to display it here.</p>
              )}
            </div>

            <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-purple-500/30 bg-[#100B18]/80 shadow-inner">
              <div
                onClick={() => setIsLorModalOpen(true)}
                className="cursor-pointer group/badge relative p-4 rounded-2xl bg-white/5 border border-purple-500/20 hover:border-purple-400 transition-all w-full flex flex-col items-center"
                title="Click to view full Letter of Recommendation (PDF)"
              >
                {/* Belvo Emblem */}
                <div className="belvo-wordmark-mark" aria-hidden="true">B</div>
                <span className="belvo-wordmark">BELVO</span>
                <span className="belvo-wordmark-sub">COMPANY</span>
                <span className="text-[10px] text-[#D8B4E8]/70 uppercase tracking-widest font-mono">
                  Goregaon, Mumbai
                </span>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Executive Endorsement</span>
              </div>

              <div className="mt-4 w-full space-y-2 border-t border-[#35263D] pt-3 text-left text-xs font-mono text-[#D8B4E8]/80">
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Issued By:</span>
                  <span className="text-[#F5EAF5] font-semibold">Hrishikesh Mishra</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Title:</span>
                  <span className="text-purple-300 font-medium">CEO, Belvo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Date:</span>
                  <span className="text-[#F5EAF5]">22-09-2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A78BAF]">Tenure:</span>
                  <span className="text-[#F5EAF5]">3-Month Internship</span>
                </div>
              </div>

              <div className="mt-5 w-full space-y-2">
                <a
                  href={belvoPdfUrl || undefined}
                  aria-disabled={!belvoPdfUrl}
                  target={belvoPdfUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Official LOR (PDF)</span>
                </a>
              </div>
            </div>
            </div>

            {/* Right Column: Letter Summary & Key Competencies Highlighted */}
            <div className="min-w-0 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    Letter of Recommendation (LOR)
                  </span>
                  <span className="text-xs text-[#A78BAF]">·</span>
                  <span className="text-xs text-[#DCCFE0] font-mono">
                    Candidate: <strong className="text-white">Poosala Lokesh</strong> (Web Developer Intern)
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5EAF5]">
                  Belvo Company — Web Development Internship Recommendation
                </h3>
                <p className="mt-1 text-sm text-[#D8B4E8]/90">
                  Formally commended by Belvo CEO Hrishikesh Mishra for exemplary engineering, adaptability, and proactive contribution.
                </p>
              </div>

              <blockquote className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs sm:text-sm text-[#DCCFE0] italic leading-relaxed">
                &ldquo;During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities... They showed dedication, adaptability, and a professional attitude while completing assigned tasks and meeting project requirements. Their ability to learn new concepts and apply technical knowledge in practical situations was appreciable.&rdquo;
              </blockquote>

              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider text-purple-400 font-mono font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Core Professional Competencies Verified in LOR
                </h4>

                <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-[#DCCFE0]">
                  {[
                    'Web development and website implementation',
                    'Front-end development and responsive design',
                    'Debugging and resolving technical issues',
                    'Understanding project requirements and workflows',
                    'Testing and improving web pages and features',
                    'Collaborating with team members on development tasks',
                  ].map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-[#35263D] bg-[#100B18]/60 px-3 py-2"
                    >
                      <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Student Ambassador Program 2026 — Semester 1 */}
        {ambassadorCert && (
          <section className="gsa-certificate-card mt-8 overflow-hidden rounded-2xl border border-[#19191b] bg-[#fffdf5] shadow-[5px_5px_0_#19191b]">
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-center">
              <a
                href={ambassadorCert.credentialUrl || ambassadorCert.verificationUrl || '#'}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!ambassadorCert.credentialUrl && !ambassadorCert.verificationUrl}
                title="Open the certificate PDF selected in Studio"
                className="gsa-certificate-thumbnail group block overflow-hidden rounded-xl border-2 border-[#19191b] bg-[#f8f6e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b596f]"
                aria-label="Open Google Student Ambassador 2026 Semester 1 certificate PDF"
              >
                <img
                  src="/certificates/download.png"
                  alt="Google Student Ambassador Program 2026 Semester 1 Certificate of Recognition for P. Lokesh"
                  className="block h-auto w-full object-contain p-0 transition-transform duration-500 group-hover:scale-[1.015]"
                  loading="eager"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              </a>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#19191b] bg-[#ffe17a] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#171719]">
                  <Award className="h-3.5 w-3.5" />
                  Certificate of Recognition
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#171719] sm:text-3xl">
                  Google Student Ambassador Program 2026
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#8d596c]">Semester 1 · P. Lokesh · Wesley Degree College</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#403d37]">
                  Recognized for successfully completing Semester 1 and for outstanding performance and exceptional contribution as a Google Student Ambassador.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#625f57]">
                  <span className="rounded-full border border-[#b9b1a2] px-3 py-1.5">Issued November 04, 2026</span>
                  <span className="rounded-full border border-[#b9b1a2] px-3 py-1.5">Issued by Google Student Ambassador Program</span>
                </div>
                <a
                  href={ambassadorCert.credentialUrl || ambassadorCert.verificationUrl || '/certificates/GSA_Semester1_Certificate_P.Lokesh.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  title="Open the original uploaded certificate PDF"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-[#171719] bg-[#ffe17a] px-4 py-2.5 text-sm font-bold text-[#171719] shadow-[3px_3px_0_#171719] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#171719]"
                >
                  <FileText className="h-4 w-4" />
                  View certificate PDF
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Google Cloud Skill Badges Section Header */}
        <div className="mt-16 pt-8 border-t border-[#35263D]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#E8B8D2] font-semibold flex items-center gap-2">
                <Boxes className="h-4 w-4 text-[#4285F4]" />
                <span>OFFICIAL GOOGLE CLOUD SKILL BADGES</span>
              </div>
              <h3 className="mt-1 text-2xl sm:text-4xl font-light text-[#F5EAF5] tracking-tight">
                Skill Badges &{' '}
                <span className="instrument italic font-normal text-[#E8B8D2]">
                  Hands-On Accreditations.
                </span>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#BDA9C4] max-w-2xl">
                Google Cloud Skill Badges demonstrate tested hands-on ability to complete interactive labs and production tasks on Google Cloud console. Click any badge to view the certificate card.
              </p>
            </div>

          </div>

          {/* Search Bar & Filters */}
          <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A78BAF]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search badges (e.g. Gemini, BigQuery, Kubernetes, Security)..."
                className="w-full rounded-xl border border-[#35263D] bg-[#1A1222]/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-[#F5EAF5] placeholder-[#A78BAF] focus:outline-hidden focus:border-[#E8B8D2] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A78BAF] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="certification-category-tabs flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-[#A78BAF] uppercase tracking-wider mr-1 hidden sm:inline">
                Domain:
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#A77BC2] text-white shadow-md'
                        : 'bg-[#1A1222] text-[#DCCFE0] border border-[#35263D] hover:border-[#E8B8D2]/40 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Level Filter Pills */}
            <div className="certification-level-tabs flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-[#A78BAF] uppercase tracking-wider mr-1">
                Level:
              </span>
              {(['All', 'Introductory', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#2A1C33] text-[#E8B8D2] border border-[#E8B8D2]/40 font-semibold'
                      : 'text-[#BDA9C4] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Badges Certificate Cards Grid */}
          {filteredBadges.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBadges.map((badge) => (
                <SkillBadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={() => setSelectedBadge(badge)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-[#35263D] bg-[#1A1222]/40 text-[#BDA9C4]">
              <Search className="h-8 w-8 mx-auto text-[#A78BAF] mb-2" />
              <p className="text-sm font-medium text-[#F5EAF5]">No matching skill badges found</p>
              <p className="text-xs mt-1 text-[#A78BAF]">Try clearing your search query or choosing another domain.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="mt-3 text-xs text-[#E8B8D2] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Context Info Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3 pb-12">
          <div className="rounded-2xl border border-[#35263D] bg-[#1A1222]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8B8D2] font-semibold">
              Hands-On Validation
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#F5EAF5]">
              Challenge Lab Evaluated
            </h4>
            <p className="mt-1 text-xs text-[#DCCFE0] leading-relaxed">
              Every skill badge requires completing timed, unassisted challenge labs directly in a live Google Cloud sandbox environment.
            </p>
          </div>

          <div className="rounded-2xl border border-[#35263D] bg-[#1A1222]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8B8D2] font-semibold">
              Modern AI & Agentic Scope
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#F5EAF5]">
              Gemini, ADK & Multimodal RAG
            </h4>
            <p className="mt-1 text-xs text-[#DCCFE0] leading-relaxed">
              Accredited in cutting-edge Agent Development Kit (ADK), Gemini Multimodal RAG, Document AI, and BigQuery ML predictive intelligence.
            </p>
          </div>

          <div className="rounded-2xl border border-[#35263D] bg-[#1A1222]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8B8D2] font-semibold">
              Enterprise Ready
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#F5EAF5]">
              Zero Trust, GKE & DevOps
            </h4>
            <p className="mt-1 text-xs text-[#DCCFE0] leading-relaxed">
              Deep competency spanning Binary Authorization, Security Command Center, VPC networks, Cloud Spanner, and Prometheus telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Official Belvo Letter of Recommendation Viewer Modal */}
      {belvoPdfUrl && <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} pdfUrl={belvoPdfUrl} title={belvoExperience?.lor?.title || "Belvo Company — Letter of Recommendation"} />}

      {/* Interactive Skill Badge Modal */}
      <SkillBadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
}

