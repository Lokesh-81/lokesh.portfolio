'use client';

import React, { useMemo, useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import {
  LayoutDashboard, User, Compass, FileText, Briefcase, History, GraduationCap, Cpu,
  Award, Trophy, Languages, Share2, Phone, Inbox, Image as ImageIcon, FileCheck2,
  Settings, LogOut, ExternalLink, Menu, X, RefreshCw, Database, CheckCircle,
  AlertCircle, Quote, BarChart3, Search, ChevronRight, PanelLeftClose, Command,
} from 'lucide-react';

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
import { AnalyticsTab } from './tabs/AnalyticsTab';

export type StudioTabId =
  | 'dashboard' | 'analytics' | 'profile' | 'hero' | 'about' | 'projects'
  | 'experience' | 'education' | 'skills' | 'certifications' | 'achievements'
  | 'testimonials' | 'languages' | 'social' | 'contact' | 'messages' | 'media'
  | 'resume' | 'settings';

interface StudioLayoutProps { onExitStudio: () => void; }

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, description: 'Your portfolio at a glance' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Traffic and engagement' },
      { id: 'messages', label: 'Inbox', icon: Inbox, description: 'Visitor messages' },
    ],
  },
  {
    label: 'Build your portfolio',
    items: [
      { id: 'profile', label: 'Profile', icon: User, description: 'Identity and biography' },
      { id: 'hero', label: 'Homepage', icon: Compass, description: 'Hero content and introduction' },
      { id: 'about', label: 'About', icon: FileText, description: 'Story and profile details' },
      { id: 'projects', label: 'Projects', icon: Briefcase, description: 'Case studies and links' },
      { id: 'experience', label: 'Experience', icon: History, description: 'Roles and work history' },
      { id: 'education', label: 'Education', icon: GraduationCap, description: 'Academic background' },
      { id: 'skills', label: 'Skills', icon: Cpu, description: 'Tools and capabilities' },
      { id: 'certifications', label: 'Certifications', icon: Award, description: 'Credentials and badges' },
      { id: 'achievements', label: 'Achievements', icon: Trophy, description: 'Awards and milestones' },
      { id: 'testimonials', label: 'Testimonials', icon: Quote, description: 'Recommendations' },
      { id: 'languages', label: 'Languages', icon: Languages, description: 'Spoken languages' },
      { id: 'social', label: 'Social links', icon: Share2, description: 'External profiles' },
      { id: 'contact', label: 'Contact details', icon: Phone, description: 'Ways to reach you' },
    ],
  },
  {
    label: 'Assets & settings',
    items: [
      { id: 'media', label: 'Media library', icon: ImageIcon, description: 'Images and uploaded assets' },
      { id: 'resume', label: 'Resume & documents', icon: FileCheck2, description: 'Manage downloadable files' },
      { id: 'settings', label: 'Settings', icon: Settings, description: 'SEO, security and data' },
    ],
  },
] as const;

export function StudioLayout({ onExitStudio }: StudioLayoutProps) {
  const { profile, messages, isSupabaseConnected, syncFromSupabase, logoutStudioAdmin, adminUser } = usePortfolio();
  const [activeTab, setActiveTab] = useState<StudioTabId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const unreadMessagesCount = messages.filter((m) => m.status === 'new').length;
  const activeItem = navGroups.flatMap<(typeof navGroups)[number]['items'][number]>((group) => group.items).find((item) => item.id === activeTab);
  const filteredGroups = useMemo(() => navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      const q = search.trim().toLowerCase();
      return !q || item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }),
  })).filter((group) => group.items.length), [search]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const chooseTab = (id: string) => {
    setActiveTab(id as StudioTabId);
    setIsMobileMenuOpen(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncFromSupabase();
      showToast('Sync request completed. Refresh the page if updated content is not visible.', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not sync with Supabase.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutStudioAdmin();
      showToast('You have been signed out.');
    } catch {
      showToast('Unable to sign out. Please try again.', 'error');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab onNavigateTab={chooseTab} onOpenPublicSite={onExitStudio} />;
      case 'analytics': return <AnalyticsTab showToast={showToast} onNavigatePublicSite={onExitStudio} />;
      case 'profile': return <ProfileTab showToast={showToast} />;
      case 'hero': return <HeroTab showToast={showToast} />;
      case 'about': return <AboutTab showToast={showToast} />;
      case 'projects': return <ProjectsTab showToast={showToast} />;
      case 'experience': return <ExperienceTab showToast={showToast} />;
      case 'education': return <EducationTab showToast={showToast} />;
      case 'skills': return <SkillsTab showToast={showToast} />;
      case 'certifications': return <CertificationsTab showToast={showToast} />;
      case 'achievements': return <AchievementsTab showToast={showToast} />;
      case 'testimonials': return <TestimonialsTab showToast={showToast} />;
      case 'languages': return <LanguagesTab showToast={showToast} />;
      case 'social': return <SocialLinksTab showToast={showToast} />;
      case 'contact': return <ContactTab showToast={showToast} />;
      case 'messages': return <MessagesTab showToast={showToast} />;
      case 'media': return <MediaTab showToast={showToast} />;
      case 'resume': return <ResumeTab showToast={showToast} />;
      case 'settings': return <SettingsTab showToast={showToast} />;
      default: return <DashboardTab onNavigateTab={chooseTab} onOpenPublicSite={onExitStudio} />;
    }
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <div className="studio-brand">
        <div className="studio-brand-mark">PL</div>
        <div className="min-w-0">
          <div className="studio-brand-title">LOKESH / STUDIO</div>
          <div className="studio-brand-subtitle">Portfolio control room</div>
        </div>
        {mobile && <button className="studio-icon-button ml-auto" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>}
      </div>
      <div className="studio-sidebar-search">
        <Search size={15} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a setting or page..." aria-label="Search Studio pages" />
        <kbd>/</kbd>
      </div>
      <nav className="studio-nav">
        {filteredGroups.map((group) => (
          <div className="studio-nav-group" key={group.label}>
            <div className="studio-nav-heading">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const selected = activeTab === item.id;
              const badge = item.id === 'messages' ? unreadMessagesCount : 0;
              return (
                <button key={item.id} type="button" onClick={() => chooseTab(item.id)} className={`studio-nav-item ${selected ? 'is-active' : ''}`} title={item.description}>
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {badge > 0 && <b>{badge}</b>}
                  {selected && <ChevronRight className="studio-nav-chevron" size={15} />}
                </button>
              );
            })}
          </div>
        ))}
        {filteredGroups.length === 0 && <p className="studio-empty-search">No matching pages. Try another term.</p>}
      </nav>
      <div className="studio-sidebar-bottom">
        <div className="studio-account">
          <div className="studio-avatar">{(adminUser?.username || 'L').slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1"><div className="studio-account-name">{adminUser?.username || 'Administrator'}</div><div className="studio-account-role">Administrator access</div></div>
          <button className="studio-icon-button" onClick={handleLogout} title="Sign out" aria-label="Sign out"><LogOut size={16} /></button>
        </div>
      </div>
    </>
  );

  return (
    <div className={`studio-workspace ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {toast && <div className={`studio-toast ${toast.type}`}>{toast.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle size={17} />}<span>{toast.msg}</span></div>}
      <aside className="studio-sidebar hidden lg:flex"><SidebarContent /></aside>
      {isMobileMenuOpen && <div className="studio-mobile-overlay lg:hidden" onClick={() => setIsMobileMenuOpen(false)}><aside className="studio-sidebar studio-mobile-sidebar" onClick={(e) => e.stopPropagation()}><SidebarContent mobile /></aside></div>}

      <div className="studio-main">
        <header className="studio-topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button className="studio-icon-button lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
            <button className="studio-icon-button hidden lg:inline-flex" onClick={() => setIsSidebarCollapsed((v) => !v)} aria-label="Toggle sidebar"><PanelLeftClose size={18} /></button>
            <div className="studio-breadcrumb"><span>Studio</span><ChevronRight size={14} /><strong>{activeItem?.label || 'Overview'}</strong></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`studio-connection-pill ${isSupabaseConnected ? 'connected' : 'offline'}`}><i />{isSupabaseConnected ? 'Database connected' : 'Local cache'}</span>
            <button className="studio-top-action" onClick={handleSync} disabled={isSyncing}><RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} /><span>{isSyncing ? 'Syncing' : 'Sync data'}</span></button>
            <button className="studio-top-action primary" onClick={onExitStudio}><ExternalLink size={15} /><span>View site</span></button>
          </div>
        </header>

        <main className="studio-content">
          <div className="studio-page-heading">
            <div><div className="studio-eyebrow">CONTENT MANAGEMENT</div><h1>{activeItem?.label || 'Overview'}</h1><p>{activeItem?.description || 'Manage your portfolio and keep everything up to date.'}</p></div>
            <div className="studio-page-context"><span>EDITING AS</span><strong>{profile?.name || adminUser?.username || 'Lokesh'}</strong></div>
          </div>
          <div className="studio-tab-surface">{renderActiveTab()}</div>
          <footer className="studio-footer"><span>LOKESH / STUDIO</span><span>Changes are saved through your connected portfolio data store.</span></footer>
        </main>
      </div>
    </div>
  );
}
