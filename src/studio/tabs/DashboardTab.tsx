'use client';

import React from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Inbox,
  Image,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  ShieldCheck,
  Languages,
} from 'lucide-react';

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
    mediaItems,
    activeResume,
    supabaseStatus,
  } = usePortfolio();

  const unreadMessagesCount = messages.filter((m) => m.status === 'new').length;

  const statCards = [
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

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#1F2937] bg-[#111827]/80 p-6 sm:p-8 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/40 bg-[#2563EB]/10 px-3 py-1 text-[11px] font-medium text-[#60A5FA] mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#E0E7FF] sm:text-3xl">
            Welcome to Portfolio Studio
          </h1>
          <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
            Manage your personal portfolio content, resume, projects, and incoming contact inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-[#1D4ED8] transition-all cursor-pointer"
          >
            <FolderGit2 className="h-4 w-4" />
            <span>Add Project</span>
          </button>
          <button
            onClick={onOpenPublicSite}
            className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer"
          >
            <span>View Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Database & Persistence Status Callout */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#0B132B]/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              supabaseStatus === 'connected'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
            }`}
          >
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#E0E7FF]">
                {supabaseStatus === 'connected'
                  ? 'Supabase Database Active'
                  : 'Supabase Sync Ready (Local Fallback Active)'}
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  supabaseStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              {supabaseStatus === 'connected'
                ? 'Connected directly to Supabase REST & Storage. Real-time updates active.'
                : 'Changes are safely persisted locally. You can execute the one-click SQL migration in the Database tab.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('database')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#60A5FA] hover:underline cursor-pointer shrink-0"
        >
          <span>Manage Database & SQL</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab(card.tab)}
              className="group relative cursor-pointer rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-5 transition-all hover:border-[#60A5FA]/40 hover:bg-[#111827] shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#94A3B8]">{card.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${card.bg}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-[#E0E7FF]">{card.value}</span>
                <p className="mt-0.5 text-[11px] text-[#64748B]">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Resume Card */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-[#60A5FA]" />
              <h3 className="text-sm font-semibold text-[#E0E7FF]">Active Resume Status</h3>
            </div>
            <button
              onClick={() => onNavigateTab('resume')}
              className="text-xs text-[#60A5FA] hover:underline cursor-pointer"
            >
              Manage Resumes
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] p-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/20 text-[#60A5FA]">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#E0E7FF]">
                  {activeResume?.title || 'Poosala_Lokesh_Resume_2026.pdf'}
                </p>
                <p className="text-[10px] text-[#64748B]">
                  Active public link: {activeResume?.url || '/resume.pdf'}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Live
            </span>
          </div>
        </div>

        {/* Recent Inquiries Preview Card */}
        <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Inbox className="h-5 w-5 text-[#F87171]" />
              <h3 className="text-sm font-semibold text-[#E0E7FF]">Recent Inquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs text-[#60A5FA] hover:underline cursor-pointer"
            >
              View All ({messages.length})
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1F2937] p-6 text-center text-xs text-[#64748B]">
              <Inbox className="h-8 w-8 text-[#334155] mb-2" />
              <span>No contact inquiries received yet.</span>
              <span className="text-[10px] text-[#475569] mt-1">
                Submissions from the public contact form will appear here.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => onNavigateTab('messages')}
                  className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] p-3 hover:border-[#60A5FA]/40 transition-colors cursor-pointer"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-[#E0E7FF] truncate">{msg.name}</p>
                    <p className="text-[11px] text-[#94A3B8] truncate">{msg.subject || msg.message}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full ${
                      msg.status === 'new'
                        ? 'bg-red-500/20 text-red-400 font-semibold'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
