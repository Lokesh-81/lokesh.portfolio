'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  LayoutDashboard,
  User,
  Compass,
  FileText,
  Briefcase,
  History,
  GraduationCap,
  Cpu,
  Award,
  Trophy,
  Languages,
  Share2,
  Phone,
  Inbox,
  Image as ImageIcon,
  FileCheck2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// Tabs
import { DashboardTab } from './tabs/DashboardTab';
import { ProfileTab } from './tabs/ProfileTab';
import { HeroTab } from './tabs/HeroTab';
import { AboutTab } from './tabs/AboutTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { EducationTab } from './tabs/EducationTab';
import { SkillsTab } from './tabs/SkillsTab';
import { CertificationsTab } from './tabs/CertificationsTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { LanguagesTab } from './tabs/LanguagesTab';
import { SocialLinksTab } from './tabs/SocialLinksTab';
import { ContactTab } from './tabs/ContactTab';
import { MessagesTab } from './tabs/MessagesTab';
import { MediaTab } from './tabs/MediaTab';
import { ResumeTab } from './tabs/ResumeTab';
import { SettingsTab } from './tabs/SettingsTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { Quote } from 'lucide-react';

export type StudioTabId =
  | 'dashboard'
  | 'profile'
  | 'hero'
  | 'about'
  | 'projects'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'testimonials'
  | 'languages'
  | 'social'
  | 'contact'
  | 'messages'
  | 'media'
  | 'resume'
  | 'settings';

interface StudioLayoutProps {
  onExitStudio: () => void;
}

export function StudioLayout({ onExitStudio }: StudioLayoutProps) {
  const {
    profile,
    messages,
    isSupabaseConnected,
    syncFromSupabase,
    logoutStudioAdmin,
    adminUser,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<StudioTabId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const unreadMessagesCount = messages.filter((m) => m.status === 'new').length;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navItems: Array<{
    id: StudioTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    category?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },

    { id: 'profile', label: 'Profile & Bio', icon: User, category: 'Portfolio Content' },
    { id: 'hero', label: 'Hero Section', icon: Compass, category: 'Portfolio Content' },
    { id: 'about', label: 'About & GitHub', icon: FileText, category: 'Portfolio Content' },
    { id: 'projects', label: 'Projects', icon: Briefcase, category: 'Portfolio Content' },
    { id: 'experience', label: 'Work Experience', icon: History, category: 'Portfolio Content' },
    { id: 'education', label: 'Education', icon: GraduationCap, category: 'Portfolio Content' },
    { id: 'skills', label: 'Tech Stack & Skills', icon: Cpu, category: 'Portfolio Content' },
    { id: 'certifications', label: 'Certifications', icon: Award, category: 'Portfolio Content' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, category: 'Portfolio Content' },
    { id: 'testimonials', label: 'Testimonials', icon: Quote, category: 'Portfolio Content' },
    { id: 'languages', label: 'Languages', icon: Languages, category: 'Portfolio Content' },
    { id: 'social', label: 'Social Links', icon: Share2, category: 'Portfolio Content' },
    { id: 'contact', label: 'Contact Settings', icon: Phone, category: 'Portfolio Content' },

    { id: 'messages', label: 'Inquiries & Inbox', icon: Inbox, badge: unreadMessagesCount, category: 'Operations' },
    { id: 'media', label: 'Media Library', icon: ImageIcon, category: 'Operations' },
    { id: 'resume', label: 'Documents & Resumes', icon: FileCheck2, category: 'Operations' },
    { id: 'settings', label: 'Settings & SEO', icon: Settings, category: 'Operations' },
  ];

  const handleLogout = async () => {
    await logoutStudioAdmin();
    showToast('Logged out of Admin Studio');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            onNavigateTab={(t) => setActiveTab(t as StudioTabId)}
            onOpenPublicSite={onExitStudio}
          />
        );
      case 'profile':
        return <ProfileTab showToast={showToast} />;
      case 'hero':
        return <HeroTab showToast={showToast} />;
      case 'about':
        return <AboutTab showToast={showToast} />;
      case 'projects':
        return <ProjectsTab showToast={showToast} />;
      case 'experience':
        return <ExperienceTab showToast={showToast} />;
      case 'education':
        return <EducationTab showToast={showToast} />;
      case 'skills':
        return <SkillsTab showToast={showToast} />;
      case 'certifications':
        return <CertificationsTab showToast={showToast} />;
      case 'achievements':
        return <AchievementsTab showToast={showToast} />;
      case 'testimonials':
        return <TestimonialsTab showToast={showToast} />;
      case 'languages':
        return <LanguagesTab showToast={showToast} />;
      case 'social':
        return <SocialLinksTab showToast={showToast} />;
      case 'contact':
        return <ContactTab showToast={showToast} />;
      case 'messages':
        return <MessagesTab showToast={showToast} />;
      case 'media':
        return <MediaTab showToast={showToast} />;
      case 'resume':
        return <ResumeTab showToast={showToast} />;
      case 'settings':
        return <SettingsTab showToast={showToast} />;
      default:
        return (
          <DashboardTab
            onNavigateTab={(t) => setActiveTab(t as StudioTabId)}
            onOpenPublicSite={onExitStudio}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#070D1E] text-[#E0E7FF] font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl border transition-all ${
            toast.type === 'error'
              ? 'bg-red-500/90 border-red-400 text-white'
              : 'bg-emerald-600/90 border-emerald-400 text-white'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-[#1F2937] bg-[#0B132B]/95 backdrop-blur-xl">
        {/* Studio Branding */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] shadow-md font-bold text-white text-sm">
              PL
            </div>
            <div>
              <h1 className="text-xs font-bold tracking-wider text-[#E0E7FF] uppercase">
                Studio CMS
              </h1>
              <p className="text-[10px] text-[#60A5FA] font-mono">Poosala Lokesh</p>
            </div>
          </div>
          <span className="rounded-md bg-[#2563EB]/20 px-1.5 py-0.5 text-[9px] font-mono text-[#60A5FA] border border-[#2563EB]/30">
            PRO
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {['Overview', 'Portfolio Content', 'Operations'].map((category) => {
            const items = navItems.filter((i) => i.category === category);
            return (
              <div key={category} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                  {category}
                </p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md'
                          : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#E0E7FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#60A5FA]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-[#1F2937] p-3 space-y-2">
          {/* Supabase status */}
          <div className="flex items-center justify-between rounded-xl bg-[#070D1E] px-3 py-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-[#94A3B8]">
                {isSupabaseConnected ? 'Supabase Connected' : 'Local Storage'}
              </span>
            </div>
            <button
              onClick={() => {
                syncFromSupabase();
                showToast('Sync completed');
              }}
              title="Force sync"
              className="text-[#64748B] hover:text-[#60A5FA] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onExitStudio}
              className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#60A5FA] cursor-pointer px-2 py-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 cursor-pointer px-2 py-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="relative flex w-72 flex-col bg-[#0B132B] p-4 border-r border-[#1F2937]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-xs">
                  PL
                </div>
                <span className="font-bold text-xs uppercase text-[#E0E7FF]">Studio CMS</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium ${
                      isActive ? 'bg-[#2563EB] text-white' : 'text-[#94A3B8] hover:bg-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="rounded-full bg-red-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[#1F2937] pt-3 flex justify-between">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onExitStudio();
                }}
                className="text-xs text-[#60A5FA]"
              >
                View Public Site
              </button>
              <button onClick={handleLogout} className="text-xs text-red-400">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-[#1F2937] bg-[#0B132B]/80 px-4 sm:px-8 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[#94A3B8] hover:text-white lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#E0E7FF] capitalize">
                {navItems.find((i) => i.id === activeTab)?.label || 'Studio'}
              </h2>
              <p className="text-[11px] text-[#64748B] hidden sm:block">
                Poosala Lokesh · Personal Portfolio Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitStudio}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2 text-xs font-medium text-[#CBD5E1] hover:border-[#60A5FA] hover:text-[#60A5FA] transition-all cursor-pointer shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
              <span className="sm:hidden">Site</span>
            </button>

            <div className="flex items-center gap-2 border-l border-[#1F2937] pl-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center font-bold text-xs text-white shadow-xs">
                PL
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#E0E7FF]">
                  {adminUser?.displayName || adminUser?.username || 'Lokesh'}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono">Admin Verified</p>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
