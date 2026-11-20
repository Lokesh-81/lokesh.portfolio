'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { getSupabaseDiagnostics, testSupabaseConnection } from '@/lib/supabase';
import { LayoutDashboard, BarChart3, User, Compass, FileText, Briefcase, History, GraduationCap, Cpu, Award, Trophy, Languages, Share2, Phone, Inbox, Image as ImageIcon, FileCheck2, Settings, LogOut, ExternalLink, Menu, X, RefreshCw, Search, ChevronRight, Database, CheckCircle2, AlertCircle, Sparkles, Command, PanelLeftClose, PanelLeftOpen, ArrowUpRight } from 'lucide-react';
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

export type StudioTabId = 'dashboard' | 'analytics' | 'profile' | 'hero' | 'about' | 'projects' | 'experience' | 'education' | 'skills' | 'certifications' | 'achievements' | 'testimonials' | 'languages' | 'social' | 'contact' | 'messages' | 'media' | 'resume' | 'settings';
interface StudioLayoutProps { onExitStudio: () => void; }

const navGroups = [
  { title: 'Workspace', items: [
    { id: 'dashboard', label: 'Overview', hint: 'Portfolio at a glance', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', hint: 'Visitors and traffic', icon: BarChart3 },
  ]},
  { title: 'Edit portfolio', items: [
    { id: 'profile', label: 'Profile & Bio', hint: 'Name, role and introduction', icon: User },
    { id: 'hero', label: 'Hero section', hint: 'Headline and first impression', icon: Compass },
    { id: 'about', label: 'About & GitHub', hint: 'Story and developer activity', icon: FileText },
    { id: 'projects', label: 'Projects', hint: 'Work, links and screenshots', icon: Briefcase },
    { id: 'experience', label: 'Experience', hint: 'Roles and recommendations', icon: History },
    { id: 'education', label: 'Education', hint: 'College and qualifications', icon: GraduationCap },
    { id: 'skills', label: 'Skills', hint: 'Technologies and proficiency', icon: Cpu },
    { id: 'certifications', label: 'Certifications', hint: 'Certificates and badges', icon: Award },
    { id: 'achievements', label: 'Achievements', hint: 'Awards and milestones', icon: Trophy },
    { id: 'testimonials', label: 'Testimonials', hint: 'Client feedback', icon: Sparkles },
    { id: 'languages', label: 'Languages', hint: 'Spoken languages', icon: Languages },
    { id: 'social', label: 'Social links', hint: 'Public profiles', icon: Share2 },
    { id: 'contact', label: 'Contact settings', hint: 'Email and contact details', icon: Phone },
  ]},
  { title: 'Manage', items: [
    { id: 'messages', label: 'Inbox', hint: 'New enquiries and messages', icon: Inbox },
    { id: 'media', label: 'Media library', hint: 'Images and uploaded assets', icon: ImageIcon },
    { id: 'resume', label: 'Resume & documents', hint: 'Manage downloadable files', icon: FileCheck2 },
    { id: 'settings', label: 'Site settings', hint: 'SEO and admin security', icon: Settings },
  ]},
] as const;

const descriptions: Record<StudioTabId, string> = {
  dashboard: 'A clear overview of your portfolio and the things that need attention.',
  analytics: 'Understand how people discover and explore your portfolio.',
  profile: 'Update your name, role, contact details and professional introduction.',
  hero: 'Control the first section visitors see when they open your portfolio.',
  about: 'Edit your story, developer profile and GitHub information.',
  projects: 'Add projects, update details, change images and manage live links.',
  experience: 'Keep your roles, responsibilities and recommendations up to date.',
  education: 'Manage your academic history and qualifications.',
  skills: 'Organise your technologies, categories and proficiency levels.',
  certifications: 'Add certificates, credential links and skill badges.',
  achievements: 'Showcase awards, milestones and recognitions.',
  testimonials: 'Manage client reviews and recommendations.',
  languages: 'Edit the languages shown on your portfolio.',
  social: 'Update your public social and developer profile links.',
  contact: 'Choose how visitors can reach you.',
  messages: 'Review and manage messages submitted through your portfolio.',
  media: 'Keep portfolio images and uploaded assets organised.',
  resume: 'Upload, replace and choose the active resume.',
  settings: 'Manage search previews, site preferences and admin security.',
};

export function StudioLayout({ onExitStudio }: StudioLayoutProps) {
  const { profile, messages, isSupabaseConnected, syncFromSupabase, logoutStudioAdmin, adminUser } = usePortfolio();
  const [activeTab, setActiveTab] = useState<StudioTabId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [checking, setChecking] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const unread = messages.filter((m) => m.status === 'new').length;
  const diagnostics = getSupabaseDiagnostics();
  const activeItem = navGroups.flatMap((g) => g.items).find((i) => i.id === activeTab);
  const filteredGroups = useMemo(() => navGroups.map((g) => ({
    ...g,
    items: g.items.filter((i) => !search.trim() || i.label.toLowerCase().includes(search.toLowerCase()) || i.hint.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.items.length), [search]);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  const checkBackend = async () => {
    setChecking(true);
    try {
      const result = await testSupabaseConnection();
      setBackendConnected(result.connected);
      setBackendMessage(result.connected ? 'Database connection verified.' : result.diagnostic || result.error || 'Connection could not be verified.');
      notify(result.connected ? 'Supabase connection verified' : 'Supabase needs attention', result.connected ? 'success' : 'error');
    } catch (error: any) {
      setBackendConnected(false);
      setBackendMessage(error?.message || 'Unexpected connection error.');
      notify('Supabase connection failed', 'error');
    } finally { setChecking(false); }
  };

  useEffect(() => { void checkBackend(); }, []);

  const sync = async () => {
    setChecking(true);
    try {
      await syncFromSupabase();
      const result = await testSupabaseConnection();
      setBackendConnected(result.connected);
      setBackendMessage(result.connected ? 'Latest portfolio data requested from Supabase.' : result.diagnostic || result.error || 'Local cached data remains active.');
      notify(result.connected ? 'Portfolio sync finished' : 'Sync checked — local data remains active', result.connected ? 'success' : 'error');
    } catch (error: any) { notify(error?.message || 'Could not sync portfolio data', 'error'); }
    finally { setChecking(false); }
  };

  const handleLogout = async () => { await logoutStudioAdmin(); notify('Signed out of Studio'); };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab onNavigateTab={(t) => setActiveTab(t as StudioTabId)} onOpenPublicSite={onExitStudio} />;
      case 'analytics': return <AnalyticsTab showToast={notify} onNavigatePublicSite={onExitStudio} />;
      case 'profile': return <ProfileTab showToast={notify} />;
      case 'hero': return <HeroTab showToast={notify} />;
      case 'about': return <AboutTab showToast={notify} />;
      case 'projects': return <ProjectsTab showToast={notify} />;
      case 'experience': return <ExperienceTab showToast={notify} />;
      case 'education': return <EducationTab showToast={notify} />;
      case 'skills': return <SkillsTab showToast={notify} />;
      case 'certifications': return <CertificationsTab showToast={notify} />;
      case 'achievements': return <AchievementsTab showToast={notify} />;
      case 'testimonials': return <TestimonialsTab showToast={notify} />;
      case 'languages': return <LanguagesTab showToast={notify} />;
      case 'social': return <SocialLinksTab showToast={notify} />;
      case 'contact': return <ContactTab showToast={notify} />;
      case 'messages': return <MessagesTab showToast={notify} />;
      case 'media': return <MediaTab showToast={notify} />;
      case 'resume': return <ResumeTab showToast={notify} />;
      case 'settings': return <SettingsTab showToast={notify} />;
      default: return <DashboardTab onNavigateTab={(t) => setActiveTab(t as StudioTabId)} onOpenPublicSite={onExitStudio} />;
    }
  };

  const sidebarContents = <>
    <div className="studio-brand"><div className="studio-brand-mark">PL</div><div className="studio-brand-copy"><b>Portfolio Studio</b><small>Personal workspace</small></div><span className="studio-brand-live" /></div>
    <label className="studio-search"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a section..." aria-label="Search Studio sections" /><kbd>/</kbd></label>
    <nav className="studio-nav">
      {filteredGroups.map((group) => <section className="studio-nav-group" key={group.title}>
        <p className="studio-nav-heading">{group.title}</p>
        {group.items.map((item) => {
          const Icon = item.icon;
          const selected = activeTab === item.id;
          const badge = item.id === 'messages' ? unread : 0;
          return <button key={item.id} type="button" title={collapsed ? item.label : item.hint} onClick={() => { setActiveTab(item.id as StudioTabId); setMobileOpen(false); }} className={'studio-nav-item' + (selected ? ' is-active' : '')}>
            <Icon size={17} strokeWidth={1.8} /><span className="studio-nav-label">{item.label}</span>
            {badge > 0 && <span className="studio-nav-badge">{badge}</span>}
            {selected && <ChevronRight size={14} className="studio-nav-chevron" />}
          </button>;
        })}
      </section>)}
    </nav>
    <div className="studio-sidebar-bottom">
      <div className={'studio-db-card ' + (isSupabaseConnected ? 'is-online' : 'is-offline')}>
        <div className="studio-db-row"><span className="studio-db-icon"><Database size={16} /></span><div className="studio-db-copy"><b>{isSupabaseConnected ? 'Supabase connected' : 'Local mode'}</b><small>{isSupabaseConnected ? 'Database responding' : 'Browser cache in use'}</small></div><i /></div>
        <button type="button" className="studio-db-action" onClick={checkBackend} disabled={checking}><RefreshCw size={13} className={checking ? 'animate-spin' : ''} />Test connection</button>
        {backendMessage && <p className="studio-db-detail">{backendMessage}</p>}
      </div>
      <div className="studio-user-row"><div className="studio-avatar">PL</div><div className="studio-user-copy"><b>{adminUser?.displayName || adminUser?.username || profile?.name || 'Lokesh'}</b><small>Administrator</small></div><button type="button" className="studio-icon-button" onClick={handleLogout} title="Sign out"><LogOut size={16} /></button></div>
    </div>
  </>;

  return <div className="studio-root">
    {toast && <div className={'studio-toast' + (toast.type === 'error' ? ' is-error' : '')}>{toast.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}<span>{toast.msg}</span><button type="button" onClick={() => setToast(null)} aria-label="Dismiss"><X size={15} /></button></div>}
    <aside className={'studio-sidebar' + (collapsed ? ' is-collapsed' : '')}>{sidebarContents}</aside>
    {mobileOpen && <div className="studio-mobile-overlay" onClick={() => setMobileOpen(false)}><aside className="studio-mobile-sidebar" onClick={(e) => e.stopPropagation()}><button className="studio-mobile-close" type="button" onClick={() => setMobileOpen(false)}><X size={18} /></button>{sidebarContents}</aside></div>}
    <div className="studio-main">
      <header className="studio-topbar">
        <div className="studio-topbar-left">
          <button type="button" className="studio-icon-button studio-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19} /></button>
          <button type="button" className="studio-icon-button studio-collapse-button" onClick={() => setCollapsed((v) => !v)} title="Toggle sidebar">{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</button>
          <div><div className="studio-breadcrumb"><span>Studio</span><ChevronRight size={13} /><strong>{activeItem?.label || 'Overview'}</strong></div><p className="studio-page-description">{descriptions[activeTab]}</p></div>
        </div>
        <div className="studio-topbar-actions">
          <span className={'studio-connection-pill ' + (isSupabaseConnected ? 'is-online' : 'is-offline')}><i />{isSupabaseConnected ? 'Database live' : 'Local fallback'}</span>
          <button type="button" className="studio-secondary-button" onClick={sync} disabled={checking}><RefreshCw size={14} className={checking ? 'animate-spin' : ''} /><span>Sync</span></button>
          <button type="button" className="studio-primary-button" onClick={onExitStudio}><ExternalLink size={14} /><span>View site</span><ArrowUpRight size={13} /></button>
        </div>
      </header>
      <main className="studio-content">
        {!isSupabaseConnected && <section className="studio-backend-alert"><div className="studio-alert-icon"><AlertCircle size={18} /></div><div className="studio-alert-copy"><b>Supabase is not connected</b><p>{backendMessage || 'The Studio is currently using browser storage. Check your deployment environment and database schema.'}</p><small>Project: {diagnostics.url || 'Not configured'} · Key: {diagnostics.hasAnonKey ? 'present' : 'missing'} · Check: {backendConnected === false ? 'failed' : 'pending'}</small></div><button type="button" onClick={checkBackend} disabled={checking}>{checking ? 'Checking…' : 'Test again'}</button></section>}
        <div className="studio-content-heading"><div><span>PORTFOLIO CONTROL CENTER</span><h1>{activeItem?.label || 'Overview'}</h1></div><div className="studio-shortcut"><Command size={13} /> Search sections to move faster</div></div>
        <div className="studio-tab-content" key={activeTab}>{renderActiveTab()}</div>
        <footer className="studio-footer">Portfolio Studio <span>·</span> Your content workspace</footer>
      </main>
    </div>
    <style>{`
      .studio-root{--ink:#1d2942;display:flex;width:100%;height:100vh;min-height:600px;overflow:hidden;background:radial-gradient(ellipse at 78% -18%,rgba(190,205,255,.58),transparent 36%),radial-gradient(ellipse at 7% 100%,rgba(246,220,235,.5),transparent 31%),#f5f7fc;color:var(--ink);font-family:Inter,'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif}
      .studio-sidebar{width:270px;flex:0 0 270px;display:flex;flex-direction:column;min-height:0;padding:21px 14px 13px;background:rgba(255,255,255,.9);border-right:1px solid #e5eaf2;backdrop-filter:blur(24px);transition:width .22s,flex-basis .22s}
      .studio-sidebar.is-collapsed{width:78px;flex-basis:78px;padding-inline:9px}
      .studio-brand{display:flex;align-items:center;gap:10px;padding:3px 8px 19px;border-bottom:1px solid #edf0f5}
      .studio-brand-mark,.studio-avatar{display:grid;place-items:center;flex:none;color:#fff;font-weight:800;background:linear-gradient(140deg,#5678e7,#9a83df 68%,#e7abc7);box-shadow:0 8px 20px #7889d52b}
      .studio-brand-mark{width:41px;height:41px;border-radius:14px;font-size:14px}
      .studio-brand-copy,.studio-user-copy,.studio-db-copy{display:flex;flex-direction:column;min-width:0}
      .studio-brand-copy b{font-size:13px;color:#25334e}.studio-brand-copy small{font-size:10px;color:#98a3b5;margin-top:3px}.studio-brand-live{margin-left:auto;width:7px;height:7px;border-radius:50%;background:#65bf98;box-shadow:0 0 0 4px #e8f7ef}
      .studio-search{height:41px;display:flex;align-items:center;gap:8px;margin:16px 2px 10px;padding:0 10px;border:1px solid #e6eaf2;border-radius:12px;background:#f9faff;color:#8b98ac}
      .studio-search input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#293752;font-size:11px}.studio-search input::placeholder{color:#a0aabd}.studio-search kbd{padding:2px 5px;border:1px solid #e2e7f0;border-radius:5px;background:#fff;color:#98a3b5;font-size:9px}
      .studio-nav{flex:1;min-height:0;overflow:auto;padding:0 1px 10px;scrollbar-width:thin;scrollbar-color:#dce2ed transparent}.studio-nav-group{margin:12px 0 17px}.studio-nav-heading{padding:0 10px 7px;color:#a0aabd;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
      .studio-nav-item{position:relative;display:flex;align-items:center;gap:10px;width:100%;margin:2px 0;padding:10px;border:0;border-radius:10px;background:transparent;color:#697891;text-align:left;font-size:11px;font-weight:600;cursor:pointer;transition:all .16s}
      .studio-nav-item:hover{background:#f2f5fc;color:#5269b0}.studio-nav-item.is-active{background:linear-gradient(105deg,#edf1ff,#f7f3ff);color:#536fd0;box-shadow:inset 0 0 0 1px #e3e8fc}.studio-nav-item.is-active:before{content:'';position:absolute;left:-1px;top:8px;bottom:8px;width:3px;border-radius:0 4px 4px 0;background:#7184e3}
      .studio-nav-label{flex:1}.studio-nav-badge{display:grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:20px;background:#fff0f2;color:#ce6276;font-size:9px;font-weight:800}.studio-nav-chevron{color:#8494dc}
      .studio-sidebar-bottom{padding-top:11px;border-top:1px solid #edf0f5}.studio-db-card{padding:10px;border:1px solid #e7ebf2;border-radius:13px;background:#fbfcff}.studio-db-row{display:flex;align-items:center;gap:8px}.studio-db-icon{display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:#edf1ff;color:#657bd7}
      .studio-db-copy b,.studio-user-copy b{font-size:10px;color:#34425e}.studio-db-copy small,.studio-user-copy small{font-size:9px;color:#99a4b5;margin-top:2px}.studio-db-row i{width:7px;height:7px;flex:none;border-radius:50%;background:#d9a45c}.studio-db-card.is-online .studio-db-row i{background:#4bb487;box-shadow:0 0 0 3px #e2f5ec}
      .studio-db-action{display:flex;align-items:center;gap:6px;margin-top:9px;color:#6379ce;font-size:10px;font-weight:700}.studio-db-detail{margin-top:7px;padding-top:7px;border-top:1px solid #e9edf4;color:#a0714d;font-size:9px;line-height:1.5;overflow-wrap:anywhere}
      .studio-user-row{display:flex;align-items:center;gap:8px;padding:12px 2px 0}.studio-avatar{width:31px;height:31px;border-radius:10px;font-size:10px}.studio-user-copy{flex:1}
      .studio-main{display:flex;flex:1;flex-direction:column;min-width:0;overflow:hidden}.studio-topbar{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:11px 30px;border-bottom:1px solid #e7ebf2;background:#ffffffa8;backdrop-filter:blur(20px)}
      .studio-topbar-left,.studio-topbar-actions{display:flex;align-items:center;gap:12px;min-width:0}.studio-breadcrumb{display:flex;align-items:center;gap:7px;color:#9ba6b7;font-size:10px}.studio-breadcrumb strong{color:#35425f;font-weight:800}.studio-page-description{margin-top:5px;color:#8d99ac;font-size:10px}
      .studio-connection-pill{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid #efdfc8;border-radius:30px;background:#fff9ef;color:#a27b44;font-size:9px;font-weight:800;white-space:nowrap}.studio-connection-pill i{width:6px;height:6px;border-radius:50%;background:#d9a45c}.studio-connection-pill.is-online{border-color:#d8eee2;background:#f0fbf5;color:#398764}.studio-connection-pill.is-online i{background:#4db487}
      .studio-secondary-button,.studio-primary-button{display:inline-flex;align-items:center;gap:7px;height:35px;padding:0 12px;border-radius:10px;font-size:10px;font-weight:800;cursor:pointer;white-space:nowrap}.studio-secondary-button{border:1px solid #e3e8f1;background:#fff;color:#687792}.studio-primary-button{background:linear-gradient(110deg,#5d78e2,#907edc);color:#fff;box-shadow:0 7px 18px #6577da30}
      .studio-icon-button{display:grid;place-items:center;width:33px;height:33px;border:1px solid #e6eaf2;border-radius:9px;background:#fff;color:#73819a;cursor:pointer}
      .studio-content{flex:1;min-height:0;overflow:auto;padding:26px clamp(16px,3vw,40px) 18px;scrollbar-width:thin;scrollbar-color:#dce2ed transparent}.studio-backend-alert{display:flex;align-items:flex-start;gap:11px;margin-bottom:20px;padding:13px 15px;border:1px solid #f0dfc8;border-radius:15px;background:#fffaf1;color:#765b37}
      .studio-alert-icon{display:grid;place-items:center;width:31px;height:31px;flex:none;border-radius:9px;background:#fff0d7;color:#b78235}.studio-alert-copy{flex:1;min-width:0}.studio-alert-copy b{font-size:11px}.studio-alert-copy p{margin-top:3px;color:#8d795d;font-size:10px;line-height:1.5}.studio-alert-copy small{display:block;margin-top:5px;color:#a28d70;font-size:9px;overflow-wrap:anywhere}.studio-backend-alert button{padding:7px 10px;border:1px solid #e9d7b9;border-radius:8px;background:#fff;color:#9a713b;font-size:9px;font-weight:800;white-space:nowrap}
      .studio-content-heading{display:flex;align-items:end;justify-content:space-between;gap:15px;margin-bottom:18px}.studio-content-heading span{color:#9b8bd7;font-size:9px;font-weight:800;letter-spacing:.15em}.studio-content-heading h1{margin-top:5px;color:#24314c;font-size:25px;font-weight:800;letter-spacing:-.05em;line-height:1.15}.studio-shortcut{display:flex;align-items:center;gap:6px;color:#9aa5b6;font-size:9px}
      .studio-tab-content{min-width:0}.studio-footer{display:flex;gap:7px;margin-top:25px;padding:13px 2px 3px;border-top:1px solid #e7ebf2;color:#a0aabc;font-size:9px}
      .studio-toast{position:fixed;z-index:100;top:17px;right:17px;display:flex;align-items:center;gap:9px;max-width:calc(100vw - 34px);padding:12px 14px;border:1px solid #dcebe2;border-radius:12px;background:#fffffff5;box-shadow:0 15px 45px #27365b24;color:#3e8a68;font-size:11px;font-weight:700}.studio-toast.is-error{border-color:#f2d8dc;color:#c45c70}.studio-toast button{margin-left:5px;color:#98a3b5}
      .studio-mobile-menu,.studio-mobile-overlay{display:none}.studio-sidebar.is-collapsed .studio-brand-copy,.studio-sidebar.is-collapsed .studio-brand-live,.studio-sidebar.is-collapsed .studio-search input,.studio-sidebar.is-collapsed .studio-search kbd,.studio-sidebar.is-collapsed .studio-nav-heading,.studio-sidebar.is-collapsed .studio-nav-label,.studio-sidebar.is-collapsed .studio-nav-badge,.studio-sidebar.is-collapsed .studio-nav-chevron,.studio-sidebar.is-collapsed .studio-db-card,.studio-sidebar.is-collapsed .studio-user-copy,.studio-sidebar.is-collapsed .studio-user-row button{display:none}
      .studio-sidebar.is-collapsed .studio-brand,.studio-sidebar.is-collapsed .studio-user-row{justify-content:center}.studio-sidebar.is-collapsed .studio-search{justify-content:center;padding:0}.studio-sidebar.is-collapsed .studio-nav-item{justify-content:center;padding:12px 4px}
      .studio-root [class*="bg-[#070D1E"],.studio-root [class*="bg-[#0B132B"],.studio-root [class*="bg-[#111827"],.studio-root [class*="bg-slate-950"]{background:#fff!important}.studio-root [class*="border-[#1F2937"]{border-color:#e7ebf3!important}
      .studio-root [class*="text-[#E0E7FF"],.studio-root [class*="text-[#CBD5E1"],.studio-root [class*="text-slate-100"]{color:#26344f!important}.studio-root [class*="text-[#94A3B8"],.studio-root [class*="text-[#64748B"],.studio-root [class*="text-slate-400"]{color:#77859c!important}
      .studio-root input:not([type=checkbox]):not([type=radio]),.studio-root textarea,.studio-root select{background-color:#fff!important;color:#26344f!important;border-color:#dfe5ef!important}.studio-root input::placeholder,.studio-root textarea::placeholder{color:#9aa5b6!important}
      .studio-root [class*="from-[#0B132B"],.studio-root [class*="via-[#0D1836"]{background:linear-gradient(115deg,#fff,#f3f5ff)!important}
      .studio-root [class*="bg-slate-900"],.studio-root [class*="bg-gray-900"],.studio-root [class*="bg-zinc-900"],.studio-root [class*="bg-neutral-900"]{background:#fff!important}
      .studio-root [class*="border-slate-700"],.studio-root [class*="border-gray-700"],.studio-root [class*="border-zinc-700"]{border-color:#e6ebf3!important}
      .studio-root [class*="text-slate-300"],.studio-root [class*="text-gray-300"],.studio-root [class*="text-zinc-300"]{color:#65748d!important}
      .studio-root [class*="from-[#0B132B"] [class*="text-white"],.studio-root [class*="via-[#0D1836"] [class*="text-white"]{color:#26344f!important}
      @media(max-width:1023px){.studio-sidebar{display:none}.studio-topbar{padding:11px 16px}.studio-mobile-menu{display:grid}.studio-collapse-button{display:none}.studio-mobile-overlay{display:block;position:fixed;inset:0;z-index:80;background:#1c274040;backdrop-filter:blur(5px)}.studio-mobile-sidebar{display:flex;position:absolute;inset:0 auto 0 0;width:min(320px,88vw);flex-direction:column;padding:14px;background:#fff;box-shadow:20px 0 60px #1e2b4829}.studio-mobile-close{align-self:flex-end;display:grid;place-items:center;width:30px;height:30px;margin-bottom:4px;border:1px solid #e5eaf2;border-radius:9px;color:#6e7d95}.studio-topbar-actions{gap:7px}.studio-connection-pill{display:none}.studio-content{padding:20px 16px}.studio-shortcut{display:none}}
      @media(max-width:640px){.studio-topbar{align-items:flex-start;min-height:68px;padding:10px}.studio-topbar-left{gap:7px}.studio-page-description{display:none}.studio-breadcrumb{padding-top:7px}.studio-topbar-actions{gap:5px}.studio-secondary-button,.studio-primary-button{height:32px;padding:0 8px;font-size:9px}.studio-primary-button svg:last-child{display:none}.studio-content-heading h1{font-size:22px}.studio-backend-alert{flex-wrap:wrap}.studio-backend-alert button{margin-left:42px}}
    `}</style>
  </div>;
}
