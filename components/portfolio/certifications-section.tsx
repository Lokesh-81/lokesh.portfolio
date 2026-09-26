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
import { Spotlight } from '@/components/core/spotlight';
import { GcpBadge } from '@/components/portfolio/gcp-badge';
import { CertificateModal } from '@/components/portfolio/certificate-modal';
import { BelvoLorModal } from '@/components/portfolio/belvo-lor-modal';
import { SkillBadgeCard } from '@/components/portfolio/skill-badge-card';
import { SkillBadgeModal } from '@/components/portfolio/skill-badge-modal';
import {
  certifications,
  skillBadges,
  SkillBadge,
  BadgeCategory,
} from '@/lib/data/certifications';
import { useLanguage } from '@/i18n';

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
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<SkillBadge | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<'All' | BadgeCategory>('All');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Introductory' | 'Intermediate' | 'Advanced'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cert = certifications[0]; // Primary GCP PCA certification

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

  // Counts for category pills
  const getCategoryCount = (cat: 'All' | BadgeCategory) => {
    if (cat === 'All') return skillBadges.length;
    return skillBadges.filter((b) => b.category === cat).length;
  };

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Certifications Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(66,133,244,0.22)_0%,rgba(249,171,0,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={500}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-[#F9AB00]" />
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('certifications.tag') || 'PROFESSIONAL CREDENTIALS'}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('certifications.title') || 'Certifications &'}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#F9AB00]">
                {t('certifications.titleAccent') || 'Google Cloud Badges.'}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('certifications.subtitle') ||
                'Official enterprise certifications and skill badges validating cloud solution architecture, generative AI, cybersecurity, Kubernetes, and smart data analytics on Google Cloud.'}
            </TextEffect>
          </div>
        </div>

        {/* Global Credentials Quick Stats Banner */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#F9AB00]/15 border border-[#F9AB00]/30 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 text-[#F9AB00]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#E0E7FF]">1</div>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                {t('certifications.stat.cert') || 'Professional Cert'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-4 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <FileCheck2 className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-purple-300">1</div>
              <div className="text-[11px] text-purple-300 font-mono">
                Official LOR (Belvo)
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#4285F4]/15 border border-[#4285F4]/30 flex items-center justify-center shrink-0">
              <Boxes className="h-5 w-5 text-[#60A5FA]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#E0E7FF]">{skillBadges.length}</div>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                {t('certifications.stat.badges') || 'Official Badges'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 flex items-center gap-3 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-[#C084FC]/15 border border-[#C084FC]/30 flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5 text-[#C084FC]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#E0E7FF]">
                {skillBadges.filter((b) => b.category === 'Machine Learning & AI').length}
              </div>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                {t('certifications.stat.focus') || 'Cloud & AI'}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4 flex items-center gap-3 shadow-xs col-span-2 sm:col-span-1">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                {t('certifications.stat.issuedBy') || 'Google & CEO Verified'}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showcase Card for Google Cloud Certified Professional Cloud Architect */}
        <div className="mt-8 rounded-3xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-[#60A5FA]/60 transition-all">
          {/* Subtle Ambient Backdrop Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(66,133,244,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,171,0,0.1),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[320px_1fr] items-start">
            {/* Left Column: Official Badge & Credential Verification Actions */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 shadow-inner">
              {/* Badge Visual */}
              <div
                onClick={() => setIsCertModalOpen(true)}
                className="cursor-pointer group/badge relative"
                title="Click to view full official certificate"
              >
                <GcpBadge size={190} className="mx-auto" />
                <span className="absolute bottom-1 right-1 rounded-full bg-[#111827] border border-[#1F2937] p-1.5 text-[#60A5FA] opacity-0 group-hover/badge:opacity-100 transition-opacity shadow-md">
                  <FileText className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Status Pill */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Credential · Valid 2026–2028</span>
              </div>

              {/* Series ID & Dates */}
              <div className="mt-4 w-full space-y-2 border-t border-[#1F2937] pt-3 text-left text-xs font-mono text-[#A5B4FC]/80">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Series ID:</span>
                  <span className="text-[#E0E7FF] font-semibold">{cert.seriesId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Issued:</span>
                  <span className="text-[#E0E7FF]">{cert.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Expires:</span>
                  <span className="text-[#E0E7FF]">{cert.expirationDate}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#64748B]">Verification ID:</span>
                  <button
                    onClick={() => handleCopy(cert.credentialId || '')}
                    className="flex items-center gap-1 text-[11px] text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer"
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
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Full Certificate (PDF)</span>
                </button>

                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors cursor-pointer"
                >
                  <span>Verify on Google Directory</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B]" />
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
                  <span className="text-xs text-[#64748B]">·</span>
                  <span className="text-xs text-[#CBD5E1] font-mono">
                    Candidate: <strong className="text-[#E0E7FF]">{cert.recipient}</strong> ({cert.certifiedAs})
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E0E7FF]">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm text-[#A5B4FC]/90">
                  {cert.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                {cert.description}
              </p>

              {/* 4 Core Architectural Competency Domains */}
              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider text-[#60A5FA] font-mono font-semibold flex items-center gap-1.5">
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
                        className="rounded-xl border border-[#1F2937] bg-[#0B132B]/60 p-3.5 hover:border-[#60A5FA]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#E0E7FF] mb-1">
                          <IconComp className="h-3.5 w-3.5 text-[#60A5FA]" />
                          <span>{dom.title}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[#CBD5E1]">
                          {dom.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technologies Tag Group */}
              <div className="border-t border-[#1F2937] pt-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] block mb-2.5">
                  Core GCP Infrastructure & Services Covered
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(cert.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[#1F2937] bg-[#111827] px-2.5 py-1 font-mono text-[11px] text-[#E0E7FF] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-colors"
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
        <div className="mt-8 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-[#111827] to-[#0B132B] p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-purple-400/60 transition-all">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.18),transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[300px_1fr] items-start">
            {/* Left Column: Belvo Badge & Quick Verification */}
            <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-purple-500/30 bg-[#0B132B]/80 shadow-inner">
              <div
                onClick={() => setIsLorModalOpen(true)}
                className="cursor-pointer group/badge relative p-4 rounded-2xl bg-white/5 border border-purple-500/20 hover:border-purple-400 transition-all w-full flex flex-col items-center"
                title="Click to view full Letter of Recommendation (PDF)"
              >
                {/* Belvo Emblem */}
                <div className="h-20 w-20 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md mb-2">
                  <FileCheck2 className="h-10 w-10 text-purple-400" />
                </div>
                <span className="font-extrabold text-sm tracking-wider text-purple-300">
                  BELVO COMPANY
                </span>
                <span className="text-[10px] text-[#A5B4FC]/70 uppercase tracking-widest font-mono">
                  Goregaon, Mumbai
                </span>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[11px] font-medium text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Executive Endorsement</span>
              </div>

              <div className="mt-4 w-full space-y-2 border-t border-[#1F2937] pt-3 text-left text-xs font-mono text-[#A5B4FC]/80">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Issued By:</span>
                  <span className="text-[#E0E7FF] font-semibold">Hrishikesh Mishra</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Title:</span>
                  <span className="text-purple-300 font-medium">CEO, Belvo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Date:</span>
                  <span className="text-[#E0E7FF]">22-09-2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Tenure:</span>
                  <span className="text-[#E0E7FF]">3-Month Internship</span>
                </div>
              </div>

              <div className="mt-5 w-full space-y-2">
                <button
                  onClick={() => setIsLorModalOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Official LOR (PDF)</span>
                </button>
              </div>
            </div>

            {/* Right Column: Letter Summary & Key Competencies Highlighted */}
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    Letter of Recommendation (LOR)
                  </span>
                  <span className="text-xs text-[#64748B]">·</span>
                  <span className="text-xs text-[#CBD5E1] font-mono">
                    Candidate: <strong className="text-white">Poosala Lokesh</strong> (Web Developer Intern)
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E0E7FF]">
                  Belvo Company — Web Development Internship Recommendation
                </h3>
                <p className="mt-1 text-sm text-[#A5B4FC]/90">
                  Formally commended by Belvo CEO Hrishikesh Mishra for exemplary engineering, adaptability, and proactive contribution.
                </p>
              </div>

              <blockquote className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-4 text-xs sm:text-sm text-[#CBD5E1] italic leading-relaxed">
                &ldquo;During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities... They showed dedication, adaptability, and a professional attitude while completing assigned tasks and meeting project requirements. Their ability to learn new concepts and apply technical knowledge in practical situations was appreciable.&rdquo;
              </blockquote>

              <div className="space-y-2.5">
                <h4 className="text-xs uppercase tracking-wider text-purple-400 font-mono font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Core Professional Competencies Verified in LOR
                </h4>

                <div className="grid gap-2.5 sm:grid-cols-2 text-xs text-[#CBD5E1]">
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
                      className="flex items-center gap-2 rounded-lg border border-[#1F2937] bg-[#0B132B]/60 px-3 py-2"
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

        {/* Google Cloud Skill Badges Section Header */}
        <div className="mt-16 pt-8 border-t border-[#1F2937]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold flex items-center gap-2">
                <Boxes className="h-4 w-4 text-[#4285F4]" />
                <span>OFFICIAL GOOGLE CLOUD SKILL BADGES</span>
              </div>
              <h3 className="mt-1 text-2xl sm:text-4xl font-light text-[#E0E7FF] tracking-tight">
                Skill Badges &{' '}
                <span className="instrument italic font-normal text-[#60A5FA]">
                  Hands-On Accreditations.
                </span>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
                Google Cloud Skill Badges demonstrate tested hands-on ability to complete interactive labs and production tasks on Google Cloud console. Click any badge to view the certificate card.
              </p>
            </div>

            <div className="text-xs font-mono text-[#A5B4FC]/80 px-3.5 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937] self-start md:self-auto shrink-0">
              Showing <strong className="text-white">{filteredBadges.length}</strong> of {skillBadges.length} Badges
            </div>
          </div>

          {/* Search Bar & Filters */}
          <div className="space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search badges (e.g. Gemini, BigQuery, Kubernetes, Security)..."
                className="w-full rounded-xl border border-[#1F2937] bg-[#111827]/80 pl-10 pr-4 py-2 text-xs sm:text-sm text-[#E0E7FF] placeholder-[#64748B] focus:outline-hidden focus:border-[#60A5FA] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider mr-1 hidden sm:inline">
                Domain:
              </span>
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat);
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'bg-[#111827] text-[#CBD5E1] border border-[#1F2937] hover:border-[#60A5FA]/40 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#1F2937] text-[#94A3B8]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Level Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider mr-1">
                Level:
              </span>
              {(['All', 'Introductory', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#1E293B] text-[#60A5FA] border border-[#60A5FA]/40 font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
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
            <div className="p-12 text-center rounded-2xl border border-dashed border-[#1F2937] bg-[#111827]/40 text-[#94A3B8]">
              <Search className="h-8 w-8 mx-auto text-[#64748B] mb-2" />
              <p className="text-sm font-medium text-[#E0E7FF]">No matching skill badges found</p>
              <p className="text-xs mt-1 text-[#64748B]">Try clearing your search query or choosing another domain.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="mt-3 text-xs text-[#60A5FA] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Context Info Cards */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3 pb-12">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
              Hands-On Validation
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#E0E7FF]">
              Challenge Lab Evaluated
            </h4>
            <p className="mt-1 text-xs text-[#CBD5E1] leading-relaxed">
              Every skill badge requires completing timed, unassisted challenge labs directly in a live Google Cloud sandbox environment.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
              Modern AI & Agentic Scope
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#E0E7FF]">
              Gemini, ADK & Multimodal RAG
            </h4>
            <p className="mt-1 text-xs text-[#CBD5E1] leading-relaxed">
              Accredited in cutting-edge Agent Development Kit (ADK), Gemini Multimodal RAG, Document AI, and BigQuery ML predictive intelligence.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
              Enterprise Ready
            </span>
            <h4 className="mt-1.5 text-sm font-bold text-[#E0E7FF]">
              Zero Trust, GKE & DevOps
            </h4>
            <p className="mt-1 text-xs text-[#CBD5E1] leading-relaxed">
              Deep competency spanning Binary Authorization, Security Command Center, VPC networks, Cloud Spanner, and Prometheus telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Official Certificate Viewer Modal */}
      <CertificateModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} />

      {/* Official Belvo Letter of Recommendation Viewer Modal */}
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />

      {/* Interactive Skill Badge Modal */}
      <SkillBadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
}

