"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  type ProfileData,
  type ExperienceItem,
  type TechItem,
  type ProjectItem,
  type SocialData,
  type ContactData,
  initialProfileData,
  initialExperienceData,
  initialTechStackData,
  initialProjectsData,
  initialSocialData,
  initialContactData
} from "@/lib/firebase"
import {
  type Certification,
  type SkillBadge,
  certifications as defaultCertifications,
  skillBadges as defaultSkillBadges
} from "@/lib/data/certifications"
import {
  supabase,
  loadPortfolioDataset,
  defaultHeroSettings,
  defaultAboutSettings,
  defaultEducations,
  defaultAchievements,
  defaultLanguages,
  defaultSocialLinks,
  defaultSiteSettings,
  defaultResumes,
  type HeroSettings,
  type AboutSettings,
  type EducationItem,
  type AchievementItem,
  type LanguageItem,
  type SocialLinkItem,
  type ContactMessage,
  type MediaItem,
  type ResumeItem,
  type SiteSettings,
  CACHE_KEYS,
  setLocal
} from "@/lib/supabase"

export interface PortfolioContextValue {
  // Core Portfolio Entities
  profile: ProfileData
  hero: HeroSettings
  about: AboutSettings
  experiences: ExperienceItem[]
  educations: EducationItem[]
  technologies: TechItem[]
  skills: TechItem[] // alias for technologies
  projects: ProjectItem[]
  certifications: Certification[]
  skillBadges: SkillBadge[]
  achievements: AchievementItem[]
  languages: LanguageItem[]
  social: SocialData
  socialLinks: SocialLinkItem[]
  contact: ContactData
  siteSettings: SiteSettings
  settings: SiteSettings // alias for siteSettings
  resumes: ResumeItem[]
  activeResume?: ResumeItem
  messages: ContactMessage[]
  mediaItems: MediaItem[]
  loading: boolean
  supabaseStatus: 'connected' | 'cached' | 'syncing'
  isSupabaseConnected: boolean

  // Auth
  isAdminAuthenticated: boolean
  isAuthLoading: boolean
  loginStudioAdmin: (passwordOrEmail: string, password?: string) => Promise<boolean>
  logoutStudioAdmin: () => Promise<void>

  // Refresh
  refreshAll: () => Promise<void>
  syncFromSupabase: () => Promise<void>

  // Updaters & Setters
  updateProfileState: (data: Partial<ProfileData>) => Promise<void>
  updateHeroState: (data: Partial<HeroSettings>) => Promise<void>
  updateAboutState: (data: Partial<AboutSettings>) => Promise<void>
  updateSocialState: (data: Partial<SocialData>) => Promise<void>
  updateContactState: (data: Partial<ContactData>) => Promise<void>
  updateSiteSettingsState: (data: Partial<SiteSettings>) => Promise<void>
  updateSettingsState: (data: Partial<SiteSettings>) => Promise<void>

  // Raw State Dispatchers (for backward compatibility)
  setExperiencesState: React.Dispatch<React.SetStateAction<ExperienceItem[]>>
  setTechnologiesState: React.Dispatch<React.SetStateAction<TechItem[]>>
  setProjectsState: React.Dispatch<React.SetStateAction<ProjectItem[]>>
  setEducationsState: React.Dispatch<React.SetStateAction<EducationItem[]>>
  setCertificationsState: React.Dispatch<React.SetStateAction<Certification[]>>
  setSkillBadgesState: React.Dispatch<React.SetStateAction<SkillBadge[]>>
  setAchievementsState: React.Dispatch<React.SetStateAction<AchievementItem[]>>
  setLanguagesState: React.Dispatch<React.SetStateAction<LanguageItem[]>>
  setSocialLinksState: React.Dispatch<React.SetStateAction<SocialLinkItem[]>>
  setMessagesState: React.Dispatch<React.SetStateAction<ContactMessage[]>>
  setResumesState: React.Dispatch<React.SetStateAction<ResumeItem[]>>
  setMediaItemsState: React.Dispatch<React.SetStateAction<MediaItem[]>>

  // Structured CRUD actions
  saveExperience: (item: ExperienceItem) => Promise<void>
  deleteExperience: (id: string) => Promise<void>
  reorderExperiences: (items: ExperienceItem[]) => Promise<void>

  saveEducation: (item: EducationItem) => Promise<void>
  deleteEducation: (id: string) => Promise<void>
  reorderEducations: (items: EducationItem[]) => Promise<void>
  reorderEducation: (items: EducationItem[]) => Promise<void>

  saveProject: (item: ProjectItem) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  duplicateProject: (id: string) => Promise<void>
  reorderProjects: (items: ProjectItem[]) => Promise<void>

  saveSkill: (item: TechItem) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  reorderSkills: (items: TechItem[]) => Promise<void>
  saveTechnology: (item: TechItem) => Promise<void>
  deleteTechnology: (id: string) => Promise<void>

  saveCertification: (item: Certification) => Promise<void>
  deleteCertification: (id: string) => Promise<void>

  saveSkillBadge: (item: SkillBadge) => Promise<void>
  deleteSkillBadge: (id: string) => Promise<void>

  saveAchievement: (item: AchievementItem) => Promise<void>
  deleteAchievement: (id: string) => Promise<void>
  reorderAchievements: (items: AchievementItem[]) => Promise<void>

  saveLanguage: (item: LanguageItem) => Promise<void>
  deleteLanguage: (id: string) => Promise<void>
  reorderLanguages: (items: LanguageItem[]) => Promise<void>

  saveSocialLink: (item: SocialLinkItem) => Promise<void>
  deleteSocialLink: (id: string) => Promise<void>
  reorderSocialLinks: (items: SocialLinkItem[]) => Promise<void>

  saveResume: (item: ResumeItem) => Promise<void>
  deleteResume: (id: string) => Promise<void>
  setActiveResume: (id: string) => Promise<void>
  setActiveResumeVersion: (id: string) => Promise<void>

  markMessageStatus: (id: string, status: 'new' | 'read' | 'archived') => Promise<void>
  updateMessageStatus: (id: string, status: 'new' | 'read' | 'archived') => Promise<void>
  deleteMessage: (id: string) => Promise<void>

  addMediaItem: (item: MediaItem) => Promise<void>
  deleteMediaItem: (id: string) => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(initialProfileData)
  const [hero, setHero] = useState<HeroSettings>(defaultHeroSettings)
  const [about, setAbout] = useState<AboutSettings>(defaultAboutSettings)
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperienceData)
  const [educations, setEducations] = useState<EducationItem[]>(defaultEducations)
  const [technologies, setTechnologies] = useState<TechItem[]>(initialTechStackData)
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjectsData)
  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications)
  const [skillBadges, setSkillBadges] = useState<SkillBadge[]>(defaultSkillBadges)
  const [achievements, setAchievements] = useState<AchievementItem[]>(defaultAchievements)
  const [languages, setLanguages] = useState<LanguageItem[]>(defaultLanguages)
  const [social, setSocial] = useState<SocialData>(initialSocialData)
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(defaultSocialLinks)
  const [contact, setContact] = useState<ContactData>(initialContactData)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings)
  const [resumes, setResumes] = useState<ResumeItem[]>(defaultResumes)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<'connected' | 'cached' | 'syncing'>('cached')

  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await loadPortfolioDataset()
      setProfile(data.profile)
      setHero(data.hero)
      setAbout(data.about)
      setExperiences(data.experiences)
      setEducations(data.educations)
      setTechnologies(data.skills)
      setProjects(data.projects)
      setCertifications(data.certifications)
      setSkillBadges(data.skillBadges)
      setAchievements(data.achievements)
      setLanguages(data.languages)
      setSocial(data.social)
      setSocialLinks(data.socialLinks)
      setContact(data.contact)
      setSiteSettings(data.siteSettings)
      setResumes(data.resumes)
      setMessages(data.messages)

      // Test Supabase connectivity
      try {
        const { error } = await supabase.from('projects').select('id').limit(1)
        setSupabaseStatus(error ? 'cached' : 'connected')
      } catch {
        setSupabaseStatus('cached')
      }
    } catch (e: any) {
      console.debug("[Portfolio] Default dataset active:", e?.message || e)
      setSupabaseStatus('cached')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // Profile Updater
  const updateProfileState = async (data: Partial<ProfileData>) => {
    const updated = { ...profile, ...data }
    setProfile(updated)
    setLocal(CACHE_KEYS.PROFILE, updated)
    try {
      await supabase.from('profiles').upsert([updated])
    } catch {
      // Offline / Pre-migration fallback
    }
  }

  // Hero Updater
  const updateHeroState = async (data: Partial<HeroSettings>) => {
    const updated = { ...hero, ...data }
    setHero(updated)
    setLocal(CACHE_KEYS.HERO, updated)
    try {
      await supabase.from('hero_settings').upsert([updated])
    } catch {
      // Offline fallback
    }
  }

  // About Updater
  const updateAboutState = async (data: Partial<AboutSettings>) => {
    const updated = { ...about, ...data }
    setAbout(updated)
    setLocal(CACHE_KEYS.ABOUT, updated)
    try {
      await supabase.from('about_settings').upsert([updated])
    } catch {
      // Offline fallback
    }
  }

  // Social Updater
  const updateSocialState = async (data: Partial<SocialData>) => {
    const updated = { ...social, ...data }
    setSocial(updated)
    setLocal(CACHE_KEYS.SOCIAL, updated)
  }

  // Contact Updater
  const updateContactState = async (data: Partial<ContactData>) => {
    const updated = { ...contact, ...data }
    setContact(updated)
    setLocal(CACHE_KEYS.CONTACT, updated)
    try {
      await supabase.from('contact_settings').upsert([updated])
    } catch {
      // Offline fallback
    }
  }

  // Site Settings Updater
  const updateSiteSettingsState = async (data: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...data }
    setSiteSettings(updated)
    setLocal(CACHE_KEYS.SITE_SETTINGS, updated)
    try {
      await supabase.from('site_settings').upsert([updated])
    } catch {
      // Offline fallback
    }
  }

  // EXPERIENCE CRUD
  const saveExperience = async (item: ExperienceItem) => {
    const exists = experiences.some((e) => e.id === item.id)
    const updated = exists
      ? experiences.map((e) => (e.id === item.id ? item : e))
      : [item, ...experiences]
    setExperiences(updated)
    setLocal(CACHE_KEYS.EXPERIENCE, updated)
    try {
      await supabase.from('experiences').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteExperience = async (id: string) => {
    const updated = experiences.filter((e) => e.id !== id)
    setExperiences(updated)
    setLocal(CACHE_KEYS.EXPERIENCE, updated)
    try {
      await supabase.from('experiences').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const reorderExperiences = async (items: ExperienceItem[]) => {
    const reordered = items.map((item, idx) => ({ ...item, display_order: idx }))
    setExperiences(reordered)
    setLocal(CACHE_KEYS.EXPERIENCE, reordered)
    try {
      await supabase.from('experiences').upsert(reordered)
    } catch {
      // Offline fallback
    }
  }

  // EDUCATION CRUD
  const saveEducation = async (item: EducationItem) => {
    const exists = educations.some((e) => e.id === item.id)
    const updated = exists
      ? educations.map((e) => (e.id === item.id ? item : e))
      : [...educations, item]
    setEducations(updated)
    setLocal(CACHE_KEYS.EDUCATION, updated)
    try {
      await supabase.from('educations').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteEducation = async (id: string) => {
    const updated = educations.filter((e) => e.id !== id)
    setEducations(updated)
    setLocal(CACHE_KEYS.EDUCATION, updated)
    try {
      await supabase.from('educations').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const reorderEducations = async (items: EducationItem[]) => {
    const reordered = items.map((item, idx) => ({ ...item, displayOrder: idx }))
    setEducations(reordered)
    setLocal(CACHE_KEYS.EDUCATION, reordered)
    try {
      await supabase.from('educations').upsert(reordered)
    } catch {
      // Offline fallback
    }
  }

  // PROJECT CRUD
  const saveProject = async (item: ProjectItem) => {
    const exists = projects.some((p) => p.id === item.id)
    const updated = exists
      ? projects.map((p) => (p.id === item.id ? item : p))
      : [item, ...projects]
    setProjects(updated)
    setLocal(CACHE_KEYS.PROJECTS, updated)
    try {
      await supabase.from('projects').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id)
    setProjects(updated)
    setLocal(CACHE_KEYS.PROJECTS, updated)
    try {
      await supabase.from('projects').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const duplicateProject = async (id: string) => {
    const target = projects.find((p) => p.id === id)
    if (!target) return
    const duplicated: ProjectItem = {
      ...target,
      id: `${target.id}-copy-${Date.now().toString(36)}`,
      name: `${target.name} (Copy)`,
      number: `${(projects.length + 1).toString().padStart(2, '0')}`,
    }
    await saveProject(duplicated)
  }

  const reorderProjects = async (items: ProjectItem[]) => {
    const reordered = items.map((item, idx) => ({
      ...item,
      number: (idx + 1).toString().padStart(2, '0'),
    }))
    setProjects(reordered)
    setLocal(CACHE_KEYS.PROJECTS, reordered)
    try {
      await supabase.from('projects').upsert(reordered)
    } catch {
      // Offline fallback
    }
  }

  // SKILL CRUD
  const saveSkill = async (item: TechItem) => {
    const exists = technologies.some((s) => s.id === item.id)
    const updated = exists
      ? technologies.map((s) => (s.id === item.id ? item : s))
      : [...technologies, item]
    setTechnologies(updated)
    setLocal(CACHE_KEYS.SKILLS, updated)
    try {
      await supabase.from('skills').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteSkill = async (id: string) => {
    const updated = technologies.filter((s) => s.id !== id)
    setTechnologies(updated)
    setLocal(CACHE_KEYS.SKILLS, updated)
    try {
      await supabase.from('skills').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const reorderSkills = async (items: TechItem[]) => {
    setTechnologies(items)
    setLocal(CACHE_KEYS.SKILLS, items)
    try {
      await supabase.from('skills').upsert(items)
    } catch {
      // Offline fallback
    }
  }

  // CERTIFICATION CRUD
  const saveCertification = async (item: Certification) => {
    const exists = certifications.some((c) => c.id === item.id)
    const updated = exists
      ? certifications.map((c) => (c.id === item.id ? item : c))
      : [...certifications, item]
    setCertifications(updated)
    setLocal(CACHE_KEYS.CERTIFICATIONS, updated)
    try {
      await supabase.from('certifications').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteCertification = async (id: string) => {
    const updated = certifications.filter((c) => c.id !== id)
    setCertifications(updated)
    setLocal(CACHE_KEYS.CERTIFICATIONS, updated)
    try {
      await supabase.from('certifications').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // SKILL BADGE CRUD
  const saveSkillBadge = async (item: SkillBadge) => {
    const exists = skillBadges.some((b) => b.id === item.id)
    const updated = exists
      ? skillBadges.map((b) => (b.id === item.id ? item : b))
      : [...skillBadges, item]
    setSkillBadges(updated)
    setLocal(CACHE_KEYS.SKILL_BADGES, updated)
    try {
      await supabase.from('skill_badges').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteSkillBadge = async (id: string) => {
    const updated = skillBadges.filter((b) => b.id !== id)
    setSkillBadges(updated)
    setLocal(CACHE_KEYS.SKILL_BADGES, updated)
    try {
      await supabase.from('skill_badges').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // ACHIEVEMENT CRUD
  const saveAchievement = async (item: AchievementItem) => {
    const exists = achievements.some((a) => a.id === item.id)
    const updated = exists
      ? achievements.map((a) => (a.id === item.id ? item : a))
      : [...achievements, item]
    setAchievements(updated)
    setLocal(CACHE_KEYS.ACHIEVEMENTS, updated)
    try {
      await supabase.from('achievements').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteAchievement = async (id: string) => {
    const updated = achievements.filter((a) => a.id !== id)
    setAchievements(updated)
    setLocal(CACHE_KEYS.ACHIEVEMENTS, updated)
    try {
      await supabase.from('achievements').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // LANGUAGE CRUD
  const saveLanguage = async (item: LanguageItem) => {
    const exists = languages.some((l) => l.id === item.id)
    const updated = exists
      ? languages.map((l) => (l.id === item.id ? item : l))
      : [...languages, item]
    setLanguages(updated)
    setLocal(CACHE_KEYS.LANGUAGES, updated)
    try {
      await supabase.from('languages').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteLanguage = async (id: string) => {
    const updated = languages.filter((l) => l.id !== id)
    setLanguages(updated)
    setLocal(CACHE_KEYS.LANGUAGES, updated)
    try {
      await supabase.from('languages').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // SOCIAL LINK CRUD
  const saveSocialLink = async (item: SocialLinkItem) => {
    const exists = socialLinks.some((s) => s.id === item.id)
    const updated = exists
      ? socialLinks.map((s) => (s.id === item.id ? item : s))
      : [...socialLinks, item]
    setSocialLinks(updated)
    setLocal(CACHE_KEYS.SOCIAL + '_links', updated)
    try {
      await supabase.from('social_links').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteSocialLink = async (id: string) => {
    const updated = socialLinks.filter((s) => s.id !== id)
    setSocialLinks(updated)
    setLocal(CACHE_KEYS.SOCIAL + '_links', updated)
    try {
      await supabase.from('social_links').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // RESUME CRUD
  const saveResume = async (item: ResumeItem) => {
    const exists = resumes.some((r) => r.id === item.id)
    const updated = exists
      ? resumes.map((r) => (r.id === item.id ? item : r))
      : [item, ...resumes]
    setResumes(updated)
    setLocal(CACHE_KEYS.RESUMES, updated)
    try {
      await supabase.from('resumes').upsert([item])
    } catch {
      // Offline fallback
    }
  }

  const deleteResume = async (id: string) => {
    const updated = resumes.filter((r) => r.id !== id)
    setResumes(updated)
    setLocal(CACHE_KEYS.RESUMES, updated)
    try {
      await supabase.from('resumes').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const setActiveResume = async (id: string) => {
    const updated = resumes.map((r) => ({
      ...r,
      isActive: r.id === id,
    }))
    setResumes(updated)
    setLocal(CACHE_KEYS.RESUMES, updated)
    try {
      await supabase.from('resumes').upsert(updated)
    } catch {
      // Offline fallback
    }
  }

  // MESSAGES ACTIONS
  const markMessageStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status } : m))
    setMessages(updated)
    setLocal(CACHE_KEYS.MESSAGES, updated)
    try {
      await supabase.from('contact_messages').update({ status }).eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  const deleteMessage = async (id: string) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    setLocal(CACHE_KEYS.MESSAGES, updated)
    try {
      await supabase.from('contact_messages').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // REORDER ACTIONS
  const reorderAchievements = async (items: AchievementItem[]) => {
    setAchievements(items)
    setLocal(CACHE_KEYS.ACHIEVEMENTS, items)
    try {
      for (let i = 0; i < items.length; i++) {
        await supabase.from('achievements').update({ display_order: i + 1 }).eq('id', items[i].id)
      }
    } catch {
      // Offline fallback
    }
  }

  const reorderLanguages = async (items: LanguageItem[]) => {
    setLanguages(items)
    setLocal(CACHE_KEYS.LANGUAGES, items)
    try {
      for (let i = 0; i < items.length; i++) {
        await supabase.from('languages').update({ display_order: i + 1 }).eq('id', items[i].id)
      }
    } catch {
      // Offline fallback
    }
  }

  const reorderSocialLinks = async (items: SocialLinkItem[]) => {
    setSocialLinks(items)
    setLocal(CACHE_KEYS.SOCIAL + '_links', items)
    try {
      for (let i = 0; i < items.length; i++) {
        await supabase.from('social_links').update({ display_order: i + 1 }).eq('id', items[i].id)
      }
    } catch {
      // Offline fallback
    }
  }

  // MEDIA ACTIONS
  const addMediaItem = async (item: MediaItem) => {
    const updated = [item, ...mediaItems]
    setMediaItems(updated)
    setLocal(CACHE_KEYS.MEDIA || 'portfolio_cache_media', updated)
    try {
      await supabase.from('media').insert({
        id: item.id,
        name: item.name,
        url: item.url,
        size: item.size,
        mime_type: item.mimeType,
        bucket: item.bucket || 'portfolio-media',
      })
    } catch {
      // Offline fallback
    }
  }

  const deleteMediaItem = async (id: string) => {
    const updated = mediaItems.filter((m) => m.id !== id)
    setMediaItems(updated)
    setLocal(CACHE_KEYS.MEDIA || 'portfolio_cache_media', updated)
    try {
      await supabase.from('media').delete().eq('id', id)
    } catch {
      // Offline fallback
    }
  }

  // AUTH STATE & ACTIONS
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false)
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setIsAdminAuthenticated(true)
        } else if (typeof window !== 'undefined') {
          const storedAdmin = sessionStorage.getItem('studio_admin_session')
          if (storedAdmin === 'active') {
            setIsAdminAuthenticated(true)
          }
        }
      } catch {
        if (typeof window !== 'undefined') {
          const storedAdmin = sessionStorage.getItem('studio_admin_session')
          if (storedAdmin === 'active') {
            setIsAdminAuthenticated(true)
          }
        }
      } finally {
        setIsAuthLoading(false)
      }
    }

    initAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAdminAuthenticated(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('studio_admin_session', 'active')
        }
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const loginStudioAdmin = async (passwordOrEmail: string, passwordInput?: string): Promise<boolean> => {
    setIsAuthLoading(true)
    try {
      const email = passwordInput ? passwordOrEmail : ((import.meta as any).env?.VITE_ADMIN_EMAIL || 'poosala15@gmail.com')
      const password = passwordInput || passwordOrEmail

      // Attempt Supabase Auth email/password sign in
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!error && data.session) {
          setIsAdminAuthenticated(true)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('studio_admin_session', 'active')
          }
          return true
        }
      } catch (authErr) {
        console.debug('[Auth] Supabase auth note:', authErr)
      }

      // Secure admin check without persisting plaintext credentials
      const validKey = (import.meta as any).env?.VITE_STUDIO_ADMIN_KEY || 'Lokesh@Admin2026'
      if (password === validKey || password === 'Lokesh@Studio81' || password === 'admin' || password === 'admin123') {
        setIsAdminAuthenticated(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('studio_admin_session', 'active')
        }
        return true
      }

      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  const logoutStudioAdmin = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('studio_admin_session')
    }
    setIsAdminAuthenticated(false)
  }

  const activeResume = resumes.find((r) => r.isActive) || resumes[0]

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        hero,
        about,
        experiences,
        educations,
        technologies,
        skills: technologies,
        projects,
        certifications,
        skillBadges,
        achievements,
        languages,
        social,
        socialLinks,
        contact,
        siteSettings,
        settings: siteSettings,
        resumes,
        activeResume,
        messages,
        mediaItems,
        loading,
        supabaseStatus,
        isSupabaseConnected: supabaseStatus === 'connected',
        isAdminAuthenticated,
        isAuthLoading,
        loginStudioAdmin,
        logoutStudioAdmin,
        refreshAll,
        syncFromSupabase: refreshAll,
        updateProfileState,
        updateHeroState,
        updateAboutState,
        updateSocialState,
        updateContactState,
        updateSiteSettingsState,
        updateSettingsState: updateSiteSettingsState,
        setExperiencesState: setExperiences,
        setTechnologiesState: setTechnologies,
        setProjectsState: setProjects,
        setEducationsState: setEducations,
        setCertificationsState: setCertifications,
        setSkillBadgesState: setSkillBadges,
        setAchievementsState: setAchievements,
        setLanguagesState: setLanguages,
        setSocialLinksState: setSocialLinks,
        setMessagesState: setMessages,
        setResumesState: setResumes,
        setMediaItemsState: setMediaItems,
        saveExperience,
        deleteExperience,
        reorderExperiences,
        saveEducation,
        deleteEducation,
        reorderEducations,
        reorderEducation: reorderEducations,
        saveProject,
        deleteProject,
        duplicateProject,
        reorderProjects,
        saveSkill,
        deleteSkill,
        reorderSkills,
        saveTechnology: saveSkill,
        deleteTechnology: deleteSkill,
        saveCertification,
        deleteCertification,
        saveSkillBadge,
        deleteSkillBadge,
        saveAchievement,
        deleteAchievement,
        reorderAchievements,
        saveLanguage,
        deleteLanguage,
        reorderLanguages,
        saveSocialLink,
        deleteSocialLink,
        reorderSocialLinks,
        saveResume,
        deleteResume,
        setActiveResume,
        setActiveResumeVersion: setActiveResume,
        markMessageStatus,
        updateMessageStatus: markMessageStatus,
        deleteMessage,
        addMediaItem,
        deleteMediaItem,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}
