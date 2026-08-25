import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  type Firestore
} from "firebase/firestore"
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User
} from "firebase/auth"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage
} from "firebase/storage"
import firebaseConfigJson from "@/firebase-applet-config.json"

export interface ProfileData {
  name: string
  displayName: string
  title: string
  shortBio: string
  aboutHero: string
  aboutDescription: string
  aboutSubDescription: string
  location: string
  graduationYear: string
  education: string
  recognition: string
  languages: string[]
  photoUrl: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  period: string
  startDate?: string
  endDate?: string
  current?: boolean
  location: string
  type: string
  description: string
  responsibilities: string[]
  technologies: string[]
  link?: string
  order: number
  featured?: boolean
}

export type SkillLevel = "Core" | "Working Knowledge" | "Familiar"

export interface TechItem {
  id: string
  name: string
  level: SkillLevel
  category: string
  iconName?: string
  order: number
}

export interface ProjectItem {
  id: string
  number: string
  name: string
  category: string
  tagline: string
  shortDescription?: string
  description: string
  whatIWorkedOn: string[]
  technologies: string[]
  status: "Live" | "In Development"
  liveUrl?: string
  githubUrl?: string
  year: string
  image?: string
  accentColor: string
  gradient?: string
  featured: boolean
  visible: boolean
  order: number
}

export interface SocialProfile {
  label: string
  username: string
  url: string
}

export interface SocialData {
  githubProfiles: SocialProfile[]
  linkedinUrl: string
  instagramUrl: string
  customLinks?: { label: string; url: string }[]
}

export interface ContactData {
  email1: string
  email2: string
  phone: string
  whatsappNumber: string
  whatsappUrl: string
  locationDisplay: string
}

// Initial Authentic Defaults
export const initialProfileData: ProfileData = {
  name: "P. Lokesh",
  displayName: "P. Lokesh",
  title: "Full Stack Developer / AI Enthusiast",
  shortBio:
    "Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India. Focused on pristine craft, type safety, and real-world execution.",
  aboutHero: "Curious by nature.",
  aboutDescription:
    "I'm P. Lokesh, a Full Stack Developer and Computer Science student based in Hyderabad, India, driven by the craft of building resilient web products and AI integrations.",
  aboutSubDescription:
    "I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and AI pipelines.",
  location: "Hyderabad, India",
  graduationYear: "2027",
  education: "B.Sc. MSCS · 2027",
  recognition: "Google Student Ambassador",
  languages: ["Telugu", "English", "Hindi", "French"],
  photoUrl: ""
}

export const initialExperienceData: ExperienceItem[] = [
  {
    id: "belvo",
    company: "BELVO",
    role: "Web Development Intern",
    period: "June 2026 – September 2026",
    startDate: "June 2026",
    endDate: "September 2026",
    current: false,
    location: "Remote",
    type: "Web Development Internship",
    description:
      "Engineered scalable digital business platforms and healthcare workflow engines (including Naivaidya), leading frontend architecture, patient authentication flows with Supabase, and responsive web systems.",
    responsibilities: [
      "Led the frontend development team across sprint planning, modular design systems, and code quality standards",
      "Implemented secure OTP-based patient authentication and administrative workflow management dashboards",
      "Architected full-stack web applications and reusable UI components using React, TypeScript, and Tailwind CSS",
      "Integrated Supabase and RESTful APIs for real-time data persistence, query optimization, and RBAC access control",
      "Optimized production build performance and delivery latency"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Node.js", "REST APIs", "Vite"],
    link: "",
    order: 0,
    featured: true
  },
  {
    id: "google-ambassador",
    company: "Google Student Ambassador Program",
    role: "Google Student Ambassador",
    period: "2025",
    startDate: "2025",
    endDate: "2025",
    current: false,
    location: "Remote",
    type: "Community & Tech Leadership",
    description:
      "Representing developer technologies and student developer ecosystems, organizing technical workshops, and driving engagement around modern web and cloud technologies.",
    responsibilities: [
      "Evangelized Google developer tools, cloud infrastructure, and student developer initiatives on campus",
      "Organized and facilitated hands-on technical workshops and hackathons on modern web tooling",
      "Mentored peers in building real-world software applications and adopting best engineering practices"
    ],
    technologies: [
      "Developer Relations",
      "Cloud Technologies",
      "Technical Mentorship",
      "Web Ecosystem",
      "Community Leadership"
    ],
    link: "",
    order: 1,
    featured: true
  }
]

export const initialTechStackData: TechItem[] = [
  // Languages
  { id: "tech-js", name: "JavaScript (ES6+)", level: "Core", category: "Languages", order: 0 },
  { id: "tech-ts", name: "TypeScript", level: "Core", category: "Languages", order: 1 },
  { id: "tech-py", name: "Python", level: "Working Knowledge", category: "Languages", order: 2 },
  { id: "tech-java", name: "Java", level: "Working Knowledge", category: "Languages", order: 3 },
  { id: "tech-c", name: "C", level: "Familiar", category: "Languages", order: 4 },
  { id: "tech-cpp", name: "C++", level: "Familiar", category: "Languages", order: 5 },
  { id: "tech-html", name: "HTML5", level: "Core", category: "Languages", order: 6 },
  { id: "tech-css", name: "CSS3", level: "Core", category: "Languages", order: 7 },

  // Frontend & UI
  { id: "tech-react", name: "React", level: "Core", category: "Frontend & UI", order: 8 },
  { id: "tech-next", name: "Next.js", level: "Core", category: "Frontend & UI", order: 9 },
  { id: "tech-tailwind", name: "Tailwind CSS", level: "Core", category: "Frontend & UI", order: 10 },
  { id: "tech-vite", name: "Vite", level: "Core", category: "Frontend & UI", order: 11 },
  { id: "tech-framer", name: "Framer Motion", level: "Working Knowledge", category: "Frontend & UI", order: 12 },
  { id: "tech-gsap", name: "GSAP", level: "Working Knowledge", category: "Frontend & UI", order: 13 },
  { id: "tech-three", name: "Three.js", level: "Familiar", category: "Frontend & UI", order: 14 },

  // Backend & APIs
  { id: "tech-node", name: "Node.js", level: "Core", category: "Backend & APIs", order: 15 },
  { id: "tech-express", name: "Express.js", level: "Core", category: "Backend & APIs", order: 16 },
  { id: "tech-rest", name: "REST APIs", level: "Core", category: "Backend & APIs", order: 17 },
  { id: "tech-gemini", name: "AI / LLM APIs (Gemini)", level: "Working Knowledge", category: "Backend & APIs", order: 18 },

  // Databases & Cloud
  { id: "tech-mongo", name: "MongoDB", level: "Working Knowledge", category: "Databases & Cloud", order: 19 },
  { id: "tech-supabase", name: "Supabase", level: "Working Knowledge", category: "Databases & Cloud", order: 20 },
  { id: "tech-firebase", name: "Firebase (Firestore & Auth)", level: "Working Knowledge", category: "Databases & Cloud", order: 21 },
  { id: "tech-mysql", name: "MySQL", level: "Working Knowledge", category: "Databases & Cloud", order: 22 },
  { id: "tech-vercel", name: "Vercel", level: "Core", category: "Databases & Cloud", order: 23 },

  // Tools & Emerging
  { id: "tech-git", name: "Git", level: "Core", category: "Tools & Emerging", order: 24 },
  { id: "tech-github", name: "GitHub", level: "Core", category: "Tools & Emerging", order: 25 },
  { id: "tech-powerbi", name: "Power BI", level: "Working Knowledge", category: "Tools & Emerging", order: 26 },
  { id: "tech-fabric", name: "Microsoft Fabric", level: "Familiar", category: "Tools & Emerging", order: 27 }
]

export const initialProjectsData: ProjectItem[] = [
  {
    id: "belvo",
    number: "01",
    name: "BELVO",
    category: "Business / Startup Platform",
    tagline: "Modern business operations & digital client onboarding platform",
    shortDescription: "A high-performance business and startup platform designed to streamline client interaction.",
    description:
      "A high-performance business and startup platform designed to streamline client interaction, present service solutions, and provide a polished digital touchpoint for modern enterprise needs.",
    whatIWorkedOn: [
      "Engineered responsive full-stack frontend architecture using React, Vite, and Tailwind CSS",
      "Designed and implemented modular, reusable UI components for seamless service presentation",
      "Integrated secure client communication channels and structured API request handling",
      "Optimized production build performance, reducing initial load latency"
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Node.js", "REST APIs"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2026",
    accentColor: "#a78bfa",
    gradient: "from-purple-900/40 via-violet-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 0
  },
  {
    id: "naivaidya",
    number: "02",
    name: "Naivaidya",
    category: "Healthcare / Technology",
    tagline: "Healthcare portal & patient management workflow engine",
    shortDescription: "A comprehensive digital healthcare management platform facilitating patient coordination.",
    description:
      "A comprehensive digital healthcare management platform facilitating patient coordination, appointment authentication, and administrative hospital workflows with high reliability.",
    whatIWorkedOn: [
      "Served as Frontend Developer and Team Lead, directing UI architecture and sprint deliverables",
      "Implemented secure OTP-based authentication and user verification flows",
      "Engineered comprehensive administrative dashboards for patient records and scheduling",
      "Integrated Supabase backend services for real-time data persistence and query optimization"
    ],
    technologies: ["React", "Supabase", "Tailwind CSS", "OTP Auth", "REST APIs"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2025 - 2026",
    accentColor: "#38bdf8",
    gradient: "from-sky-900/40 via-blue-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 1
  },
  {
    id: "foundarly",
    number: "03",
    name: "Foundarly",
    category: "Startup / Digital Platform",
    tagline: "Collaborative founder ecosystem & venture builder workspace",
    shortDescription: "A centralized digital platform built to empower startup founders and early-stage innovators.",
    description:
      "A centralized digital platform built to empower startup founders and early-stage innovators with venture tracking, resource discovery, and collaborative tooling.",
    whatIWorkedOn: [
      "Developed interactive founder workspace dashboards using React and TypeScript",
      "Constructed RESTful backend endpoints utilizing Node.js, Express, and MongoDB",
      "Enforced strict TypeScript typing across shared client-server data models",
      "Crafted responsive data visualizations and venture milestone trackers"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express.js", "Tailwind CSS", "MongoDB"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2025",
    accentColor: "#34d399",
    gradient: "from-emerald-900/40 via-teal-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 2
  },
  {
    id: "antara-global",
    number: "04",
    name: "ANTARA Global",
    category: "Corporate / Business Platform",
    tagline: "Enterprise international business & corporate trade portal",
    shortDescription: "An enterprise-scale corporate platform designed for global commerce and international trade.",
    description:
      "An enterprise-scale corporate platform designed for global commerce and international trade representation, delivering high-trust corporate storytelling and global inquiry workflows.",
    whatIWorkedOn: [
      "Built modern editorial pages with Next.js App Router and server-rendered optimizations",
      "Crafted smooth scroll-driven micro-interactions and transitions with Framer Motion",
      "Constructed multi-locale corporate inquiry forms and structured lead routing",
      "Executed comprehensive Core Web Vitals optimizations and semantic SEO metadata"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2025",
    accentColor: "#f59e0b",
    gradient: "from-amber-900/40 via-orange-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 3
  },
  {
    id: "lumora-ai",
    number: "05",
    name: "Lumora AI",
    category: "AI / FinTech / Investment Research",
    tagline: "AI-driven financial research & market synthesis engine",
    shortDescription: "An intelligent investment research platform leveraging modern LLMs for market synthesis.",
    description:
      "An intelligent investment research platform leveraging modern LLMs to extract insights from financial reports, synthesize market trends, and deliver actionable executive summaries.",
    whatIWorkedOn: [
      "Integrated Gemini API and LLM endpoints for contextual financial document synthesis",
      "Built resilient caching and fast retrieval workflows using MongoDB and Redis",
      "Designed clean financial charts and high-density analytical dashboards",
      "Implemented streaming AI response components with Markdown and citation support"
    ],
    technologies: ["Next.js", "TypeScript", "Gemini AI API", "MongoDB", "Redis", "Tailwind CSS"],
    status: "In Development",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2026",
    accentColor: "#ec4899",
    gradient: "from-pink-900/40 via-rose-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 4
  },
  {
    id: "indira-thakur-photography",
    number: "06",
    name: "Indira Thakur Photography",
    category: "Photography / Creative Portfolio",
    tagline: "Editorial photography showcase & artistic client gallery",
    shortDescription: "A visual-first creative portfolio engineered for high-resolution visual storytelling.",
    description:
      "A visual-first creative portfolio engineered for high-resolution visual storytelling, featuring fluid masonry layouts, editorial lightbox experiences, and client booking inquiry flows.",
    whatIWorkedOn: [
      "Engineered fluid masonry image galleries with adaptive layout recalculations",
      "Implemented responsive image optimization and lazy-loading for heavy media assets",
      "Designed seamless full-screen photo inspection and modal transitions",
      "Integrated direct photoshoot booking and consultation inquiry forms"
    ],
    technologies: ["React", "Vite", "Tailwind CSS", "Framer Motion", "Cloudinary CDN"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2025",
    accentColor: "#c084fc",
    gradient: "from-fuchsia-900/40 via-purple-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 5
  },
  {
    id: "jv-edtech",
    number: "07",
    name: "JV EdTech",
    category: "Education / EdTech",
    tagline: "Interactive digital learning portal & student course manager",
    shortDescription: "An educational platform built to facilitate structured digital courses and learning modules.",
    description:
      "An educational platform built to facilitate structured digital courses, interactive student learning modules, progress tracking, and assessment evaluation.",
    whatIWorkedOn: [
      "Developed structured course exploration and modular lesson player interfaces",
      "Implemented client-side progress tracking and module completion persistence",
      "Engineered interactive assessment quizzes with instant scoring and feedback",
      "Structured scalable PostgreSQL / Supabase schemas for course materials and users"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase / PostgreSQL"],
    status: "Live",
    githubUrl: "https://github.com/Lokesh-81",
    year: "2025",
    accentColor: "#60a5fa",
    gradient: "from-blue-900/40 via-indigo-950/20 to-black/60",
    featured: true,
    visible: true,
    order: 6
  }
]

export const initialSocialData: SocialData = {
  githubProfiles: [
    {
      label: "GitHub — lokeshnaivaidya-max",
      username: "lokeshnaivaidya-max",
      url: "https://github.com/lokeshnaivaidya-max"
    },
    {
      label: "GitHub — Lokesh-81",
      username: "Lokesh-81",
      url: "https://github.com/Lokesh-81"
    }
  ],
  linkedinUrl: "https://www.linkedin.com/in/poosala-lokesh/",
  instagramUrl: "https://www.instagram.com/_lokesh81/"
}

export const initialContactData: ContactData = {
  email1: "poosala15@gmail.com",
  email2: "lokes81@myyahoo.com",
  phone: "+91 8885674172",
  whatsappNumber: "918885674172",
  whatsappUrl: "https://wa.me/918885674172",
  locationDisplay: "Hyderabad (IST · UTC+5:30)"
}

export const ADMIN_EMAIL = "poosala15@gmail.com"

// Resolve Firebase configuration dynamically from environment variables with defaults
export function getResolvedFirebaseConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigJson.apiKey || ""
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || "portfolio-lokesh"
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || `${projectId}.firebaseapp.com`
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || `${projectId}.firebasestorage.app`
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || ""
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigJson.appId || ""
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId || ""
  const firestoreDatabaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId || "(default)"

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    firestoreDatabaseId
  }
}

// App Initialization
let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let storage: FirebaseStorage | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null
  if (!app) {
    try {
      const config = getResolvedFirebaseConfig()
      app = getApps().length > 0 ? getApp() : initializeApp(config)
    } catch (e) {
      console.warn("Failed to initialize Firebase App:", e)
    }
  }
  return app
}

export function getFirebaseDb(): Firestore | null {
  if (typeof window === "undefined") return null
  if (!db) {
    const currentApp = getFirebaseApp()
    if (currentApp) {
      try {
        const config = getResolvedFirebaseConfig()
        db = getFirestore(currentApp, config.firestoreDatabaseId || "(default)")
      } catch (e) {
        console.warn("Failed to initialize Firestore:", e)
      }
    }
  }
  return db
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null
  if (!auth) {
    const currentApp = getFirebaseApp()
    if (currentApp) {
      try {
        auth = getAuth(currentApp)
      } catch (e) {
        console.warn("Failed to initialize Firebase Auth:", e)
      }
    }
  }
  return auth
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (typeof window === "undefined") return null
  if (!storage) {
    const currentApp = getFirebaseApp()
    if (currentApp) {
      try {
        storage = getStorage(currentApp)
      } catch (e) {
        console.warn("Failed to initialize Firebase Storage:", e)
      }
    }
  }
  return storage
}

// Firebase Auth Helpers - STRICTLY allowlist poosala15@gmail.com
export async function signInWithGoogle(): Promise<User> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) throw new Error("Firebase Auth not initialized")
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  const result = await signInWithPopup(firebaseAuth, provider)
  const user = result.user
  if (!user.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    await signOut(firebaseAuth)
    throw new Error("This Google account is not authorized for Portfolio Studio. Please use poosala15@gmail.com.")
  }
  return user
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) throw new Error("Firebase Auth not initialized")
  const cleanEmail = email.trim().toLowerCase()
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Only ${ADMIN_EMAIL} is authorized for Portfolio Studio.`)
  }
  const result = await signInWithEmailAndPassword(firebaseAuth, cleanEmail, pass)
  const user = result.user
  if (!user.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    await signOut(firebaseAuth)
    throw new Error(`Only ${ADMIN_EMAIL} is authorized for Portfolio Studio.`)
  }
  return user
}

export async function createAdminAccount(password: string): Promise<User> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) throw new Error("Firebase Auth not initialized")
  const result = await createUserWithEmailAndPassword(firebaseAuth, ADMIN_EMAIL, password)
  return result.user
}

export async function sendAdminPasswordReset(email: string = ADMIN_EMAIL): Promise<void> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) throw new Error("Firebase Auth not initialized")
  const cleanEmail = email.trim().toLowerCase()
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error(`Password reset can only be sent to ${ADMIN_EMAIL}.`)
  }
  await sendPasswordResetEmail(firebaseAuth, cleanEmail)
}

export async function signOutStudio(): Promise<void> {
  const firebaseAuth = getFirebaseAuth()
  if (firebaseAuth) {
    await signOut(firebaseAuth)
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(firebaseAuth, async (user) => {
    if (user) {
      if (!user.email || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(firebaseAuth)
        callback(null)
        return
      }
      callback(user)
    } else {
      callback(null)
    }
  })
}

// --- Firestore Data Handlers ---

// Profile
export async function fetchProfileData(): Promise<ProfileData> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "profile")
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { ...initialProfileData, ...(snap.data() as ProfileData) }
      }
    } catch (e) {
      console.warn("Firestore fetch profile error:", e)
    }
  }
  return initialProfileData
}

export async function saveProfileData(data: Partial<ProfileData>): Promise<ProfileData> {
  const firestore = getFirebaseDb()
  const updated = { ...initialProfileData, ...data }
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "profile")
      await setDoc(docRef, updated, { merge: true })
      return updated
    } catch (e) {
      console.warn("Firestore save profile error:", e)
      throw e
    }
  }
  return updated
}

// Experiences
export async function fetchExperiencesData(): Promise<ExperienceItem[]> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const colRef = collection(firestore, "portfolio_experience")
      const snap = await getDocs(colRef)
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as ExperienceItem[]
        return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }
    } catch (e) {
      console.warn("Firestore fetch experiences error:", e)
    }
  }
  return initialExperienceData
}

export async function saveExperienceItem(
  item: Omit<ExperienceItem, "id">,
  id?: string
): Promise<ExperienceItem> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")
  
  if (id) {
    const docRef = doc(firestore, "portfolio_experience", id)
    await setDoc(docRef, item, { merge: true })
    return { id, ...item }
  } else {
    const docRef = await addDoc(collection(firestore, "portfolio_experience"), item)
    return { id: docRef.id, ...item }
  }
}

export async function deleteExperienceItem(id: string): Promise<void> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")
  await deleteDoc(doc(firestore, "portfolio_experience", id))
}

// Tech Stack
export async function fetchTechStackData(): Promise<TechItem[]> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const colRef = collection(firestore, "portfolio_technologies")
      const snap = await getDocs(colRef)
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as TechItem[]
        return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }
    } catch (e) {
      console.warn("Firestore fetch technologies error:", e)
    }
  }
  return initialTechStackData
}

export async function saveTechStackItem(item: Omit<TechItem, "id">, id?: string): Promise<TechItem> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  if (id) {
    const docRef = doc(firestore, "portfolio_technologies", id)
    await setDoc(docRef, item, { merge: true })
    return { id, ...item }
  } else {
    const docRef = await addDoc(collection(firestore, "portfolio_technologies"), item)
    return { id: docRef.id, ...item }
  }
}

export async function deleteTechStackItem(id: string): Promise<void> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")
  await deleteDoc(doc(firestore, "portfolio_technologies", id))
}

// Projects
export async function fetchProjectsData(): Promise<ProjectItem[]> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const colRef = collection(firestore, "portfolio_projects")
      const snap = await getDocs(colRef)
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data()
        })) as ProjectItem[]
        return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }
    } catch (e) {
      console.warn("Firestore fetch projects error:", e)
    }
  }
  return initialProjectsData
}

export async function saveProjectItem(item: Omit<ProjectItem, "id">, id?: string): Promise<ProjectItem> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  if (id) {
    const docRef = doc(firestore, "portfolio_projects", id)
    await setDoc(docRef, item, { merge: true })
    return { id, ...item }
  } else {
    const docRef = await addDoc(collection(firestore, "portfolio_projects"), item)
    return { id: docRef.id, ...item }
  }
}

export async function deleteProjectItem(id: string): Promise<void> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")
  await deleteDoc(doc(firestore, "portfolio_projects", id))
}

// Social
export async function fetchSocialData(): Promise<SocialData> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "social")
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { ...initialSocialData, ...(snap.data() as SocialData) }
      }
    } catch (e) {
      console.warn("Firestore fetch social error:", e)
    }
  }
  return initialSocialData
}

export async function saveSocialData(data: Partial<SocialData>): Promise<SocialData> {
  const firestore = getFirebaseDb()
  const updated = { ...initialSocialData, ...data }
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "social")
      await setDoc(docRef, updated, { merge: true })
      return updated
    } catch (e) {
      console.warn("Firestore save social error:", e)
      throw e
    }
  }
  return updated
}

// Contact
export async function fetchContactData(): Promise<ContactData> {
  const firestore = getFirebaseDb()
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "contact")
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { ...initialContactData, ...(snap.data() as ContactData) }
      }
    } catch (e) {
      console.warn("Firestore fetch contact error:", e)
    }
  }
  return initialContactData
}

export async function saveContactData(data: Partial<ContactData>): Promise<ContactData> {
  const firestore = getFirebaseDb()
  const updated = { ...initialContactData, ...data }
  if (firestore) {
    try {
      const docRef = doc(firestore, "portfolio", "contact")
      await setDoc(docRef, updated, { merge: true })
      return updated
    } catch (e) {
      console.warn("Firestore save contact error:", e)
      throw e
    }
  }
  return updated
}

// Profile Photo Upload using Firebase Storage
export async function uploadProfilePhoto(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const firebaseStorage = getFirebaseStorage()
  if (!firebaseStorage) throw new Error("Firebase Storage not available")

  const fileExt = file.name.split(".").pop() || "jpg"
  const fileName = `profile-photos/avatar_${Date.now()}.${fileExt}`
  const storageRef = ref(firebaseStorage, fileName)

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type
    })

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) onProgress(Math.round(progress))
      },
      (error) => {
        console.error("Storage upload error:", error)
        reject(error)
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
          // Also persist directly to profile in Firestore
          await saveProfileData({ photoUrl: downloadUrl })
          resolve(downloadUrl)
        } catch (err) {
          reject(err)
        }
      }
    )
  })
}

// Seed default initial data into Firestore (useful for one-click initial provisioning)
export async function seedInitialDataToFirestore(): Promise<void> {
  const firestore = getFirebaseDb()
  if (!firestore) throw new Error("Firestore not available")

  // Profile
  await setDoc(doc(firestore, "portfolio", "profile"), initialProfileData, { merge: true })

  // Social
  await setDoc(doc(firestore, "portfolio", "social"), initialSocialData, { merge: true })

  // Contact
  await setDoc(doc(firestore, "portfolio", "contact"), initialContactData, { merge: true })

  // Experiences
  for (const exp of initialExperienceData) {
    const { id, ...data } = exp
    await setDoc(doc(firestore, "portfolio_experience", id), data, { merge: true })
  }

  // Technologies
  for (const tech of initialTechStackData) {
    const { id, ...data } = tech
    await setDoc(doc(firestore, "portfolio_technologies", id), data, { merge: true })
  }

  // Projects
  for (const proj of initialProjectsData) {
    const { id, ...data } = proj
    await setDoc(doc(firestore, "portfolio_projects", id), data, { merge: true })
  }
}
