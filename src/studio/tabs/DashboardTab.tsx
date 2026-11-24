'use client';

import React from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { computeAnalyticsSummary } from '@/lib/analytics';
import {
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Inbox,
  FileText,
  ArrowRight,
  Database,
  ExternalLink,
  Languages,
  BarChart3,
  Eye,
} from 'lucide-react';
import { openDocumentInNewTab, getCleanDocDisplayName } from '@/lib/document-utils';

interface DashboardTabProps {
  onNavigateTab: (tab: string) => void;
  onOpenPublicSite: () => void;
}

export function DashboardTab({ onNavigateTab, onOpenPublicSite }: DashboardTabProps) {
  const {
    projects,
    technologies,
    experiences,
    educations,
    certifications,
    skillBadges,
    achievements,
    languages,
    messages,
    activeResume,
    supabaseStatus,
  } = usePortfolio();

  const unreadMessagesCount = messages.filter((m) => m.status === 'new').length;

  const resumeUrl = activeResume?.url || '/resume.pdf';
  const isBase64Resume = typeof resumeUrl === 'string' && resumeUrl.startsWith('data:');
  const cleanResumeName =
    activeResume?.title && !activeResume.title.startsWith('data:')
      ? activeResume.title
      : getCleanDocDisplayName(activeResume?.path, 'P.Lokesh_resume.pdf');

  const handleOpenActiveResume = () => {
    openDocumentInNewTab(resumeUrl, cleanResumeName);
  };

  const analytics = computeAnalyticsSummary('7d');
  const totalDeviceViews = analytics.deviceBreakdown.desktop + analytics.deviceBreakdown.mobile + analytics.deviceBreakdown.tablet || 1;
  const desktopPct = Math.round((analytics.deviceBreakdown.desktop / totalDeviceViews) * 100);
  const mobilePct = Math.round((analytics.deviceBreakdown.mobile / totalDeviceViews) * 100);

  const statCards = [
    {
      id: 'analytics',
      label: 'Traffic & Visitors',
      value: `${analytics.uniqueVisitors} Visitors`,
      sub: `${analytics.totalViews} views · ${analytics.liveViewersCount} live now`,
      icon: BarChart3,
      color: 'text-[#38BDF8]',
      bg: 'bg-[#0284C7]/10 border-[#0284C7]/20',
      tab: 'analytics',
    },
    {
      id: 'projects',
      label: 'Projects',
      value: projects.length,
      sub: `${projects.filter((p) => p.status === 'Live').length} Live`,
      icon: FolderGit2,
      color: 'text-[#60A5FA]',
      bg: 'bg-[#2563EB]/10 border-[#2563EB]/20',
      tab: 'projects',
    },
    {
      id: 'skills',
      label: 'Tech Stack',
      value: technologies.length,
      sub: `${technologies.filter((t) => t.level === 'Core').length} Core skills`,
      icon: Cpu,
      color: 'text-[#38BDF8]',
      bg: 'bg-[#0284C7]/10 border-[#0284C7]/20',
      tab: 'skills',
    },
    {
      id: 'experience',
      label: 'Experiences',
      value: experiences.length,
      sub: 'Roles & leadership',
      icon: Briefcase,
      color: 'text-[#C084FC]',
      bg: 'bg-[#9333EA]/10 border-[#9333EA]/20',
      tab: 'experience',
    },
    {
      id: 'education',
      label: 'Education',
      value: educations.length,
      sub: educations[0]?.degree || 'B.Sc. MSCS',
      icon: GraduationCap,
      color: 'text-[#F472B6]',
      bg: 'bg-[#DB2777]/10 border-[#DB2777]/20',
      tab: 'education',
    },
    {
      id: 'certifications',
      label: 'Certifications',
      value: certifications.length,
      sub: `${skillBadges.length} Skill Badges`,
      icon: Award,
      color: 'text-[#FBBF24]',
      bg: 'bg-[#D97706]/10 border-[#D97706]/20',
      tab: 'certifications',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      value: achievements.length,
      sub: 'Accreditations & awards',
      icon: Trophy,
      color: 'text-[#34D399]',
      bg: 'bg-[#059669]/10 border-[#059669]/20',
      tab: 'achievements',
    },
    {
      id: 'messages',
      label: 'Inquiries',
      value: messages.length,
      sub: unreadMessagesCount > 0 ? `${unreadMessagesCount} unread` : 'Inbox up to date',
      icon: Inbox,
      color: unreadMessagesCount > 0 ? 'text-[#F87171]' : 'text-[#94A3B8]',
      bg: unreadMessagesCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-[#1F2937]/30 border-[#1F2937]',
      tab: 'messages',
    },
    {
      id: 'languages',
      label: 'Languages',
      value: languages.length,
      sub: 'Multilingual profile',
      icon: Languages,
      color: 'text-[#A78BFA]',
      bg: 'bg-[#7C3AED]/10 border-[#7C3AED]/20',
      tab: 'languages',
    },
  ];

  const quickActions = [
    { label: 'Profile & links', detail: 'Identity, bio and social profiles', tab: 'profile' },
    { label: 'Experience', detail: 'Roles, Belvo and recommendations', tab: 'experience' },
    { label: 'Testimonials', detail: 'Client words and endorsements', tab: 'testimonials' },
    { label: 'Security & settings', detail: 'Access, SEO and data tools', tab: 'settings' },
  ];

  return (
    <div className="studio-overview">
      <section className="studio-overview-hero">
        <div className="studio-overview-hero-copy">
          <span className="studio-overview-kicker">STUDIO / WORKBENCH</span>
          <h2>Make the next update count.</h2>
          <p>Your portfolio is a living body of work. Choose an area to refine, review what visitors are seeing, or open the public site.</p>
        </div>
        <div className="studio-overview-hero-actions">
          <button type="button" onClick={() => onNavigateTab('projects')} className="studio-overview-primary"><FolderGit2 size={16} /> Add a project</button>
          <button type="button" onClick={onOpenPublicSite} className="studio-overview-secondary">View live portfolio <ExternalLink size={14} /></button>
        </div>
        <span className="studio-overview-stamp" aria-hidden="true">PL / 01</span>
      </section>

      <section className="studio-overview-start" aria-labelledby="studio-quick-edits">
        <div className="studio-overview-section-heading"><span>01 / QUICK EDITS</span><h3 id="studio-quick-edits">Pick up where you left off</h3></div>
        <div className="studio-overview-quick-links">
          {quickActions.map((action, index) => (
            <button key={action.tab} type="button" onClick={() => onNavigateTab(action.tab)} className="studio-overview-quick-link">
              <span className="studio-overview-quick-index">0{index + 1}</span>
              <span className="studio-overview-quick-copy"><strong>{action.label}</strong><small>{action.detail}</small></span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </section>

      <section className="studio-overview-metrics" aria-label="Portfolio content summary">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button key={card.id} type="button" onClick={() => onNavigateTab(card.tab)} className="studio-overview-metric">
              <span className="studio-overview-metric-icon"><Icon size={16} /></span>
              <span className="studio-overview-metric-copy"><small>{card.label}</small><strong>{card.value}</strong><em>{card.sub}</em></span>
              <ArrowRight size={13} className="studio-overview-metric-arrow" />
            </button>
          );
        })}
      </section>

      <div className="studio-overview-grid">
        <article className="studio-overview-panel studio-overview-audience">
          <div className="studio-overview-panel-heading"><span>02 / LIVE SIGNALS</span><button type="button" onClick={() => onNavigateTab('analytics')}>Full analytics <ArrowRight size={13} /></button></div>
          <h3>People are finding your work.</h3>
          <p className="studio-overview-panel-description">{analytics.totalViews.toLocaleString()} page impressions from {analytics.uniqueVisitors.toLocaleString()} unique visitors over the last 7 days.</p>
          <div className="studio-overview-audience-stats">
            <div><strong>{analytics.liveViewersCount}</strong><small>Live now</small></div>
            <div><strong>{desktopPct >= mobilePct ? 'Desktop' : 'Mobile'}</strong><small>Top platform · {Math.max(desktopPct, mobilePct)}%</small></div>
            <div><strong>{analytics.topSection || '—'}</strong><small>Top section</small></div>
          </div>
        </article>

        <article className="studio-overview-panel studio-overview-datastore">
          <div className="studio-overview-panel-heading"><span>03 / DATA & SYNC</span><Database size={16} /></div>
          <div className="studio-overview-status"><span className={supabaseStatus === 'connected' ? 'is-connected' : 'is-local'} /><strong>{supabaseStatus === 'connected' ? 'Supabase connected' : 'Local cache active'}</strong></div>
          <p className="studio-overview-panel-description">{supabaseStatus === 'connected' ? 'Your edits are connected to the portfolio database and storage.' : 'Your browser has a local fallback. Review connection and backup settings before relying on a sync.'}</p>
          <button type="button" className="studio-overview-text-action" onClick={() => onNavigateTab('settings')}>Open data settings <ArrowRight size={13} /></button>
        </article>
      </div>

      <div className="studio-overview-grid studio-overview-grid-bottom">
        <article className="studio-overview-panel studio-overview-resume">
          <div className="studio-overview-panel-heading"><span>04 / DOCUMENTS</span><button type="button" onClick={() => onNavigateTab('resume')}>Manage resumes <ArrowRight size={13} /></button></div>
          <div className="studio-overview-document">
            <span className="studio-overview-document-icon"><FileText size={18} /></span>
            <span className="studio-overview-document-copy"><strong>{cleanResumeName}</strong><small>{isBase64Resume ? 'PDF stored in portfolio assets' : resumeUrl}{activeResume?.fileSize ? ` · ${activeResume.fileSize}` : ''}</small></span>
            <button type="button" onClick={handleOpenActiveResume} aria-label="View active resume"><Eye size={16} /></button>
          </div>
        </article>

        <article className="studio-overview-panel studio-overview-inbox">
          <div className="studio-overview-panel-heading"><span>05 / INBOX</span><button type="button" onClick={() => onNavigateTab('messages')}>View all ({messages.length}) <ArrowRight size={13} /></button></div>
          {messages.length === 0 ? (
            <div className="studio-overview-empty"><Inbox size={20} /><span>No visitor inquiries yet. New contact form submissions will appear here.</span></div>
          ) : (
            <div className="studio-overview-message-list">
              {messages.slice(0, 3).map((msg) => (
                <button key={msg.id} type="button" onClick={() => onNavigateTab('messages')} className="studio-overview-message">
                  <span><strong>{msg.name}</strong><small>{msg.subject || msg.message}</small></span>
                  <em className={msg.status === 'new' ? 'is-new' : ''}>{msg.status}</em>
                </button>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
