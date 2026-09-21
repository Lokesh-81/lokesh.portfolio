// Comprehensive and unified TypeScript types for Poosala Lokesh's Portfolio & Studio CMS

export interface ProfileData {
  name: string;
  displayName?: string;
  title: string;
  shortBio?: string;
  aboutHero?: string;
  aboutDescription?: string;
  aboutSubDescription?: string;
  bio?: string;
  location: string;
  graduationYear?: string;
  education?: string;
  recognition?: string;
  languages?: string[];
  photoUrl?: string;
  avatarUrl?: string;
  heroImage?: string;
  email?: string;
  phone?: string;
  availability?: string;
  tagline?: string;
}

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

export interface ProjectItem {
  id: string;
  number?: string;
  name: string;
  title?: string;
  category: string;
  tagline?: string;
  shortDescription?: string;
  description: string;
  whatIWorkedOn?: string[];
  keyHighlights?: string[];
  role?: string;
  metrics?: string;
  technologies: string[];
  status?: 'Live' | 'In Development' | string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  coverImageUrl?: string;
  imageUrl?: string;
  year?: string;
  image?: string;
  galleryImages?: string[];
  accentColor?: string;
  gradient?: string;
  order?: number;
  sortOrder?: number;
  display_order?: number;
  displayOrder?: number;
  featured?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  visible?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  location: string;
  type?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  link?: string;
  order?: number;
  sortOrder?: number;
  display_order?: number;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  period?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
  description?: string;
  location?: string;
  institutionUrl?: string;
  logoUrl?: string;
  display_order?: number;
  displayOrder?: number;
  sortOrder?: number;
  order?: number;
  isPublished?: boolean;
}

export interface TechnologyItem {
  id: string;
  name: string;
  category: string;
  level: 'Core' | 'Working Knowledge' | 'Familiar' | 'Proficient' | string;
  icon?: string;
  iconName?: string;
  order?: number;
  sortOrder?: number;
  display_order?: number;
  displayOrder?: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  badgeTitle?: string;
  subtitle?: string;
  recipient?: string;
  certifiedAs?: string;
  issuer: string;
  issueDate?: string;
  date?: string;
  expiryDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  badgeUrl?: string;
  badgeImage?: string;
  skills?: string[];
  featured?: boolean;
  display_order?: number;
  displayOrder?: number;
  order?: number;
  sortOrder?: number;
}

export interface SkillBadgeItem {
  id: string;
  title: string;
  issuer: string;
  category?: string;
  date?: string;
  issuedDate?: string;
  url?: string;
  level?: string;
  description?: string;
  skills?: string[];
  display_order?: number;
  displayOrder?: number;
  order?: number;
  sortOrder?: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  subtitle?: string;
  year?: string;
  date?: string;
  category?: string;
  description: string;
  icon?: string;
  link?: string;
  url?: string;
  display_order?: number;
  displayOrder?: number;
  order?: number;
  sortOrder?: number;
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
  sortOrder?: number;
  order?: number;
  isEnabled?: boolean;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  username?: string;
  displayOrder?: number;
  display_order?: number;
  sortOrder?: number;
  order?: number;
  isEnabled?: boolean;
  active?: boolean;
}

export interface ContactData {
  tag?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  email?: string;
  email1?: string;
  email2?: string;
  phone?: string;
  location?: string;
  locationDisplay?: string;
  whatsappNumber?: string;
  whatsappUrl?: string;
  responseTime?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    githubPrimary?: string;
    githubSecondary?: string;
  };
  githubAccounts?: { handle: string; label: string; url: string }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  topic?: string;
  projectType?: string;
  message: string;
  phone?: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
  created_at?: string;
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
  created_at?: string;
}

export interface ResumeItem {
  id: string;
  title: string;
  url: string;
  path?: string;
  fileSize?: string;
  version?: string;
  isActive: boolean;
  createdAt?: string;
  uploadedAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  company?: string;
  testimonial: string;
  rating?: number;
  projectUrl?: string;
  project_url?: string;
  avatarUrl?: string;
  avatar_url?: string;
  displayOrder?: number;
  display_order?: number;
  isPublished?: boolean;
  is_published?: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface SiteSettings {
  siteTitle?: string;
  title?: string;
  siteDescription?: string;
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
