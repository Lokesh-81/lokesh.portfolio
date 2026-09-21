import { createClient, type User, type Session } from '@supabase/supabase-js';
import {
  initialProfileData,
  initialExperienceData,
  initialTechStackData,
  initialProjectsData,
  initialSocialData,
  initialContactData,
  type ProfileData,
  type ExperienceItem,
  type TechItem,
  type ProjectItem,
  type SocialData,
  type ContactData
} from '@/lib/firebase';
import {
  certifications as defaultCertifications,
  skillBadges as defaultSkillBadges,
  type Certification,
  type SkillBadge
} from '@/lib/data/certifications';

// Safe client-side Supabase credentials
export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://xkkwfrwamvictgrhepgg.supabase.co';
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_2nLc2vuaV6KJQM5VODAAGg_X2NrdvH6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export const STORAGE_BUCKET = 'portfolio-media';

// Extended Entity Interfaces for Complete Studio Management
export interface HeroSettings {
  greeting: string;
  name: string;
  headline: string;
  bio: string;
  imA: string;
  rotatingWords: string[];
  ctaWork: string;
  ctaContact: string;
  availabilityBadge: string;
  showAvailability: boolean;
  featuredCredentialTitle: string;
  featuredCredentialDate: string;
  featuredCredentialLink: string;
  heroImage?: string;
}

export interface AboutSettings {
  tag: string;
  title: string;
  titleAccent: string;
  introGreeting: string;
  introSuffix: string;
  introGoal: string;
  subDescription: string;
  fullBio: string;
  philosophy: string;
  verifiedProfiles: { handle: string; url: string; label: string }[];
  highlights: { title: string; subtitle: string; icon?: string }[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  period?: string;
  grade?: string;
  description?: string;
  location?: string;
  institutionUrl?: string;
  logoUrl?: string;
  displayOrder?: number;
  display_order?: number;
  isPublished?: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  date?: string;
  year?: string;
  subtitle?: string;
  category?: string;
  description: string;
  positionOrPrize?: string;
  imageUrl?: string;
  url?: string;
  displayOrder?: number;
  display_order?: number;
  isPublished?: boolean;
}

export interface LanguageItem {
  id: string;
  language?: string;
  name?: string;
  nativeName?: string;
  code?: string;
  proficiency: string;
  percentage?: number;
  displayOrder?: number;
  display_order?: number;
  isEnabled?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  username?: string;
  icon?: string;
  active?: boolean;
  displayOrder?: number;
  display_order?: number;
  isEnabled?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  projectType?: string;
  topic?: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  path?: string;
  size?: number;
  type?: string;
  mimeType?: string;
  bucket?: string;
  createdAt: string;
}

export interface ResumeItem {
  id: string;
  title: string;
  url: string;
  path?: string;
  fileSize?: string;
  version?: string;
  updatedAt?: string;
  uploadedAt?: string;
  createdAt?: string;
  isActive: boolean;
}

export interface SiteSettings {
  siteTitle?: string;
  siteDescription?: string;
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  emailNotifications?: boolean;
  faviconUrl?: string;
  ogImageUrl?: string;
  copyrightText?: string;
  footerText?: string;
  availabilityStatus?: string;
}

// Initial Authentic Defaults for Lokesh Portfolio
export const defaultHeroSettings: HeroSettings = {
  greeting: 'Hello, I am',
  name: 'Poosala Lokesh.',
  headline: 'Full Stack Developer / AI Enthusiast',
  bio: 'Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India. Focused on pristine craft, type safety, and real-world execution.',
  imA: "I'm a",
  rotatingWords: [
    'Full Stack Developer',
    'Google Cloud Architect',
    'AI Engineer',
    'Creative Problem Solver'
  ],
  ctaWork: 'Selected Works',
  ctaContact: 'Get in Touch',
  availabilityBadge: 'Available for Summer 2026 Internships & High-Impact Roles',
  showAvailability: true,
  featuredCredentialTitle: 'Google Cloud Certified Professional Cloud Architect',
  featuredCredentialDate: 'Sep 2026',
  featuredCredentialLink: 'certifications',
  heroImage: '',
};

export const defaultAboutSettings: AboutSettings = {
  tag: 'BACKGROUND & PHILOSOPHY',
  title: 'Curious',
  titleAccent: 'by nature.',
  introGreeting: "I'm",
  introSuffix: 'a Full Stack Developer and Computer Science student based in',
  introGoal: 'driven by the craft of building resilient web products, high-throughput cloud architectures, and multimodal AI integrations.',
  subDescription:
    'I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and AI pipelines.',
  fullBio:
    "I believe in building software that delivers genuine business and human value. Whether architecting high-availability GCP topologies, fine-tuning responsive interfaces, or integrating intelligent language models, I strive for engineering clarity and robust security.",
  philosophy:
    'Every system should be mathematically sound, performant under real-world conditions, and crafted with intentional user ergonomics.',
  verifiedProfiles: [
    { handle: 'Lokesh-81', url: 'https://github.com/Lokesh-81', label: 'Primary GitHub' },
    { handle: 'lokeshnaivaidya-max', url: 'https://github.com/lokeshnaivaidya-max', label: 'Professional / Organization GitHub' }
  ],
  highlights: [
    { title: 'Degree', subtitle: 'B.Sc. MSCS (2024–2027)' },
    { title: 'Location', subtitle: 'Hyderabad, India' },
    { title: 'Accreditation', subtitle: 'Google Cloud Certified PCA' },
    { title: 'Leadership', subtitle: 'Google Student Ambassador' }
  ]
};

export const defaultEducations: EducationItem[] = [
  {
    id: 'edu-1',
    institution: "Aurora's Degree & PG College (Osmania University)",
    degree: 'Bachelor of Science (B.Sc.)',
    fieldOfStudy: 'Mathematics, Statistics, Computer Science (MSCS)',
    startYear: '2024',
    endYear: '2027',
    grade: 'First Class Distinction',
    description: 'Rigorous coursework in computational statistics, discrete mathematics, algorithmic optimization, data structures, and database systems.',
    location: 'Hyderabad, India',
    institutionUrl: 'https://aurora.edu.in',
    displayOrder: 0,
    isPublished: true,
  }
];

export const defaultAchievements: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Google Cloud Certified Professional Cloud Architect',
    organization: 'Google Cloud',
    date: 'September 2026',
    description: 'Validated mastery in multi-tier enterprise architecture, GKE cluster management, IAM zero-trust governance, and disaster recovery.',
    positionOrPrize: 'Professional Accreditation',
    url: 'https://www.credential.net/7cffa63ad06d4fda872934393093d928',
    displayOrder: 0,
    isPublished: true,
  },
  {
    id: 'ach-2',
    title: 'Google Student Ambassador',
    organization: 'Google Student Ambassador Program',
    date: '2025 – 2026',
    description: 'Selected to represent developer ecosystems and drive community engagement around Gemini AI and generative developer tools.',
    positionOrPrize: 'Campus Leadership',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'ach-3',
    title: '37 Google Cloud Skill Badges',
    organization: 'Google Cloud Skills Boost',
    date: '2025 – 2026',
    description: 'Completed 37 specialized hands-on challenge labs covering ML, Security, Smart Analytics, Infrastructure, and Kubernetes.',
    positionOrPrize: '37 Skill Badges',
    displayOrder: 2,
    isPublished: true,
  }
];

export const defaultLanguages: LanguageItem[] = [
  { id: 'lang-1', language: 'Telugu', proficiency: 'Native / Bilingual', percentage: 100, displayOrder: 0, isEnabled: true },
  { id: 'lang-2', language: 'English', proficiency: 'Professional Working Proficiency', percentage: 95, displayOrder: 1, isEnabled: true },
  { id: 'lang-3', language: 'Hindi', proficiency: 'Professional Working Proficiency', percentage: 90, displayOrder: 2, isEnabled: true },
  { id: 'lang-4', language: 'French', proficiency: 'Elementary / Conversational', percentage: 55, displayOrder: 3, isEnabled: true }
];

export const defaultSocialLinks: SocialLinkItem[] = [
  { id: 'soc-1', platform: 'GitHub (Primary)', url: 'https://github.com/Lokesh-81', username: 'Lokesh-81', displayOrder: 0, isEnabled: true },
  { id: 'soc-2', platform: 'GitHub (Work)', url: 'https://github.com/lokeshnaivaidya-max', username: 'lokeshnaivaidya-max', displayOrder: 1, isEnabled: true },
  { id: 'soc-3', platform: 'LinkedIn', url: 'https://www.linkedin.com/in/poosala-lokesh/', username: 'poosala-lokesh', displayOrder: 2, isEnabled: true },
  { id: 'soc-4', platform: 'Instagram', url: 'https://www.instagram.com/_lokesh81/', username: '_lokesh81', displayOrder: 3, isEnabled: true },
  { id: 'soc-5', platform: 'Email (Primary)', url: 'mailto:poosala15@gmail.com', username: 'poosala15@gmail.com', displayOrder: 4, isEnabled: true },
  { id: 'soc-6', platform: 'WhatsApp', url: 'https://wa.me/918885674172', username: '+91 8885674172', displayOrder: 5, isEnabled: true }
];

export const defaultSiteSettings: SiteSettings = {
  siteTitle: 'Poosala Lokesh | Full Stack Developer & GCP Cloud Architect',
  siteDescription: 'Portfolio of Poosala Lokesh - Full Stack Developer, Google Cloud Certified Professional Cloud Architect & recipient of 37 Google Cloud Skill Badges based in Hyderabad, India.',
  seoTitle: 'Poosala Lokesh Portfolio',
  seoDescription: 'Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India.',
  faviconUrl: '/icon.svg',
  ogImageUrl: '/icon.svg',
  copyrightText: `© ${new Date().getFullYear()} Poosala Lokesh. Crafted with pride.`,
  footerText: 'Available for exciting full-stack engineering and cloud architecture challenges.',
  availabilityStatus: 'Open to opportunities',
};

export const defaultResumes: ResumeItem[] = [
  {
    id: 'res-default',
    title: 'Poosala_Lokesh_Resume_2026.pdf',
    url: '/resume.pdf',
    path: 'resumes/Poosala_Lokesh_Resume_2026.pdf',
    fileSize: '1.2 MB',
    updatedAt: '2026-09-20',
    isActive: true,
  }
];

// Local Storage Safe Cache Keys (for immediate persistence and offline/pre-migration safety)
const CACHE_KEYS = {
  PROFILE: 'lokesh_cms_profile',
  HERO: 'lokesh_cms_hero',
  ABOUT: 'lokesh_cms_about',
  EXPERIENCE: 'lokesh_cms_experience',
  EDUCATION: 'lokesh_cms_education',
  PROJECTS: 'lokesh_cms_projects',
  SKILLS: 'lokesh_cms_skills',
  CERTIFICATIONS: 'lokesh_cms_certifications',
  SKILL_BADGES: 'lokesh_cms_skill_badges',
  ACHIEVEMENTS: 'lokesh_cms_achievements',
  LANGUAGES: 'lokesh_cms_languages',
  SOCIAL: 'lokesh_cms_social',
  CONTACT: 'lokesh_cms_contact',
  SITE_SETTINGS: 'lokesh_cms_settings',
  MESSAGES: 'lokesh_cms_messages',
  RESUMES: 'lokesh_cms_resumes',
  MEDIA: 'lokesh_cms_media',
};

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.warn('[Cache] Could not save to localStorage:', err);
  }
}

// STORAGE API
export async function uploadMediaToSupabase(
  file: File,
  folder = 'uploads'
): Promise<{ url: string; path: string; name: string; size: number; type: string }> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${folder}/${Date.now()}_${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('[Storage] Upload error:', error);
    throw new Error(error.message || 'File upload failed');
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  const mediaItem: MediaItem = {
    id: `media-${Date.now()}`,
    name: file.name,
    url: publicUrlData.publicUrl,
    path: data.path,
    size: file.size,
    type: file.type || 'application/octet-stream',
    createdAt: new Date().toISOString(),
  };

  // Record in local cache
  const cached = getLocal<MediaItem[]>(CACHE_KEYS.MEDIA, []);
  setLocal(CACHE_KEYS.MEDIA, [mediaItem, ...cached]);

  // Attempt database record insertion
  try {
    await supabase.from('media').insert([mediaItem]);
  } catch {
    // Ignore if table not created yet
  }

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function deleteMediaFromSupabase(path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) {
    console.warn('[Storage] Delete error:', error);
  }

  // Update local cache
  const cached = getLocal<MediaItem[]>(CACHE_KEYS.MEDIA, []);
  setLocal(
    CACHE_KEYS.MEDIA,
    cached.filter((item) => item.path !== path)
  );

  try {
    await supabase.from('media').delete().eq('path', path);
  } catch {
    // Ignore
  }

  return true;
}

export async function listMediaFromSupabase(): Promise<MediaItem[]> {
  try {
    const { data: dbData, error: dbError } = await supabase
      .from('media')
      .select('*')
      .order('createdAt', { ascending: false });

    if (!dbError && dbData && dbData.length > 0) {
      setLocal(CACHE_KEYS.MEDIA, dbData);
      return dbData;
    }
  } catch {
    // Fall back to storage list
  }

  try {
    const { data: files, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('uploads', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (!error && files && files.length > 0) {
      const items: MediaItem[] = files
        .filter((f) => f.name !== '.emptyFolderPlaceholder')
        .map((f) => {
          const path = `uploads/${f.name}`;
          const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
          return {
            id: f.id || f.name,
            name: f.name,
            url: data.publicUrl,
            path: path,
            size: f.metadata?.size || 0,
            type: f.metadata?.mimetype || 'application/octet-stream',
            createdAt: f.created_at || new Date().toISOString(),
          };
        });

      if (items.length > 0) {
        setLocal(CACHE_KEYS.MEDIA, items);
        return items;
      }
    }
  } catch {
    // Return local cache
  }

  return getLocal<MediaItem[]>(CACHE_KEYS.MEDIA, []);
}

// CONTACT INQUIRIES API
export async function submitContactInquiryToSupabase(inquiry: {
  name: string;
  email: string;
  subject?: string;
  projectType?: string;
  message: string;
}): Promise<{ success: boolean; id: string }> {
  if (!inquiry.name?.trim() || !inquiry.email?.trim() || !inquiry.message?.trim()) {
    throw new Error('Please fill in all required fields (Name, Email, and Message).');
  }

  const subjectValue = inquiry.subject || inquiry.projectType || 'Portfolio Inquiry';
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: inquiry.name.trim(),
    email: inquiry.email.trim(),
    subject: subjectValue,
    message: inquiry.message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  // Always update local cache so messages are never lost
  const existing = getLocal<ContactMessage[]>(CACHE_KEYS.MESSAGES, []);
  setLocal(CACHE_KEYS.MESSAGES, [newMsg, ...existing]);

  // Attempt write to Supabase
  try {
    const { data, error } = await supabase.from('contact_messages').insert([
      {
        id: newMsg.id,
        name: newMsg.name,
        email: newMsg.email,
        subject: newMsg.subject,
        message: newMsg.message,
        status: newMsg.status,
        created_at: newMsg.createdAt,
      },
    ]);
    if (error) {
      console.warn('[Contact] Supabase insert warning (falling back to cache):', error.message);
    }
  } catch (err) {
    console.warn('[Contact] Supabase table offline, cached locally:', err);
  }

  return { success: true, id: newMsg.id };
}

// DATA LAYER SYNC WITH LOCAL STORAGE FALLBACK
export async function loadPortfolioDataset() {
  const result = {
    profile: getLocal<ProfileData>(CACHE_KEYS.PROFILE, initialProfileData),
    hero: getLocal<HeroSettings>(CACHE_KEYS.HERO, defaultHeroSettings),
    about: getLocal<AboutSettings>(CACHE_KEYS.ABOUT, defaultAboutSettings),
    experiences: getLocal<ExperienceItem[]>(CACHE_KEYS.EXPERIENCE, initialExperienceData),
    educations: getLocal<EducationItem[]>(CACHE_KEYS.EDUCATION, defaultEducations),
    projects: getLocal<ProjectItem[]>(CACHE_KEYS.PROJECTS, initialProjectsData),
    skills: getLocal<TechItem[]>(CACHE_KEYS.SKILLS, initialTechStackData),
    certifications: getLocal<Certification[]>(CACHE_KEYS.CERTIFICATIONS, defaultCertifications),
    skillBadges: getLocal<SkillBadge[]>(CACHE_KEYS.SKILL_BADGES, defaultSkillBadges),
    achievements: getLocal<AchievementItem[]>(CACHE_KEYS.ACHIEVEMENTS, defaultAchievements),
    languages: getLocal<LanguageItem[]>(CACHE_KEYS.LANGUAGES, defaultLanguages),
    social: getLocal<SocialData>(CACHE_KEYS.SOCIAL, initialSocialData),
    socialLinks: getLocal<SocialLinkItem[]>(CACHE_KEYS.SOCIAL + '_links', defaultSocialLinks),
    contact: getLocal<ContactData>(CACHE_KEYS.CONTACT, initialContactData),
    siteSettings: getLocal<SiteSettings>(CACHE_KEYS.SITE_SETTINGS, defaultSiteSettings),
    messages: getLocal<ContactMessage[]>(CACHE_KEYS.MESSAGES, []),
    resumes: getLocal<ResumeItem[]>(CACHE_KEYS.RESUMES, defaultResumes),
  };

  // Try fetching fresh data from Supabase tables if available
  try {
    const [
      profRes,
      heroRes,
      aboutRes,
      expRes,
      eduRes,
      projRes,
      skillRes,
      certRes,
      achRes,
      langRes,
      socRes,
      setRes,
      resRes
    ] = await Promise.allSettled([
      supabase.from('profiles').select('*').limit(1).maybeSingle(),
      supabase.from('hero_settings').select('*').limit(1).maybeSingle(),
      supabase.from('about_settings').select('*').limit(1).maybeSingle(),
      supabase.from('experiences').select('*').order('display_order', { ascending: true }),
      supabase.from('educations').select('*').order('display_order', { ascending: true }),
      supabase.from('projects').select('*').order('display_order', { ascending: true }),
      supabase.from('skills').select('*').order('display_order', { ascending: true }),
      supabase.from('certifications').select('*').order('display_order', { ascending: true }),
      supabase.from('achievements').select('*').order('display_order', { ascending: true }),
      supabase.from('languages').select('*').order('display_order', { ascending: true }),
      supabase.from('social_links').select('*').order('display_order', { ascending: true }),
      supabase.from('site_settings').select('*').limit(1).maybeSingle(),
      supabase.from('resumes').select('*').order('created_at', { ascending: false }),
    ]);

    if (profRes.status === 'fulfilled' && profRes.value?.data) {
      result.profile = { ...result.profile, ...profRes.value.data };
      setLocal(CACHE_KEYS.PROFILE, result.profile);
    }
    if (heroRes.status === 'fulfilled' && heroRes.value?.data) {
      result.hero = { ...result.hero, ...heroRes.value.data };
      setLocal(CACHE_KEYS.HERO, result.hero);
    }
    if (aboutRes.status === 'fulfilled' && aboutRes.value?.data) {
      result.about = { ...result.about, ...aboutRes.value.data };
      setLocal(CACHE_KEYS.ABOUT, result.about);
    }
    if (expRes.status === 'fulfilled' && expRes.value?.data && expRes.value.data.length > 0) {
      result.experiences = expRes.value.data;
      setLocal(CACHE_KEYS.EXPERIENCE, result.experiences);
    }
    if (eduRes.status === 'fulfilled' && eduRes.value?.data && eduRes.value.data.length > 0) {
      result.educations = eduRes.value.data;
      setLocal(CACHE_KEYS.EDUCATION, result.educations);
    }
    if (projRes.status === 'fulfilled' && projRes.value?.data && projRes.value.data.length > 0) {
      result.projects = projRes.value.data;
      setLocal(CACHE_KEYS.PROJECTS, result.projects);
    }
    if (skillRes.status === 'fulfilled' && skillRes.value?.data && skillRes.value.data.length > 0) {
      result.skills = skillRes.value.data;
      setLocal(CACHE_KEYS.SKILLS, result.skills);
    }
    if (certRes.status === 'fulfilled' && certRes.value?.data && certRes.value.data.length > 0) {
      result.certifications = certRes.value.data;
      setLocal(CACHE_KEYS.CERTIFICATIONS, result.certifications);
    }
    if (achRes.status === 'fulfilled' && achRes.value?.data && achRes.value.data.length > 0) {
      result.achievements = achRes.value.data;
      setLocal(CACHE_KEYS.ACHIEVEMENTS, result.achievements);
    }
    if (langRes.status === 'fulfilled' && langRes.value?.data && langRes.value.data.length > 0) {
      result.languages = langRes.value.data;
      setLocal(CACHE_KEYS.LANGUAGES, result.languages);
    }
    if (socRes.status === 'fulfilled' && socRes.value?.data && socRes.value.data.length > 0) {
      result.socialLinks = socRes.value.data;
      setLocal(CACHE_KEYS.SOCIAL + '_links', result.socialLinks);
    }
    if (setRes.status === 'fulfilled' && setRes.value?.data) {
      result.siteSettings = { ...result.siteSettings, ...setRes.value.data };
      setLocal(CACHE_KEYS.SITE_SETTINGS, result.siteSettings);
    }
    if (resRes.status === 'fulfilled' && resRes.value?.data && resRes.value.data.length > 0) {
      result.resumes = resRes.value.data;
      setLocal(CACHE_KEYS.RESUMES, result.resumes);
    }
  } catch (err) {
    console.debug('[Supabase Sync] Active with local/fallback cache.');
  }

  return result;
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; profileCount?: number; error?: string }> {
  try {
    const { data, error, count } = await supabase.from('profiles').select('id', { count: 'exact' });
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true, profileCount: count || (data ? data.length : 0) };
  } catch (err: any) {
    return { connected: false, error: err?.message || 'Network error' };
  }
}

export { CACHE_KEYS, getLocal, setLocal };
