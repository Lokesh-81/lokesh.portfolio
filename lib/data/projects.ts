export interface Project {
  id: string
  number: string
  name: string
  category: string
  tagline: string
  description: string
  whatIWorkedOn: string[]
  technologies: string[]
  status: "Live" | "In Development"
  liveUrl?: string
  githubUrl?: string
  year: string
  accentColor: string
  gradient: string
}

export const projects: Project[] = [
  {
    id: "belvo",
    number: "01",
    name: "BELVO",
    category: "Business / Startup Platform",
    tagline: "Modern business operations & digital client onboarding platform",
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
    gradient: "from-purple-900/40 via-violet-950/20 to-black/60"
  },
  {
    id: "naivaidya",
    number: "02",
    name: "Naivaidya",
    category: "Healthcare / Technology",
    tagline: "Healthcare portal & patient management workflow engine",
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
    gradient: "from-sky-900/40 via-blue-950/20 to-black/60"
  },
  {
    id: "foundarly",
    number: "03",
    name: "Foundarly",
    category: "Startup / Digital Platform",
    tagline: "Collaborative founder ecosystem & venture builder workspace",
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
    gradient: "from-emerald-900/40 via-teal-950/20 to-black/60"
  },
  {
    id: "antara-global",
    number: "04",
    name: "ANTARA Global",
    category: "Corporate / Business Platform",
    tagline: "Enterprise international business & corporate trade portal",
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
    gradient: "from-amber-900/40 via-orange-950/20 to-black/60"
  },
  {
    id: "lumora-ai",
    number: "05",
    name: "Lumora AI",
    category: "AI / FinTech / Investment Research",
    tagline: "AI-driven financial research & market synthesis engine",
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
    gradient: "from-pink-900/40 via-rose-950/20 to-black/60"
  },
  {
    id: "indira-thakur-photography",
    number: "06",
    name: "Indira Thakur Photography",
    category: "Photography / Creative Portfolio",
    tagline: "Editorial photography showcase & artistic client gallery",
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
    gradient: "from-fuchsia-900/40 via-purple-950/20 to-black/60"
  },
  {
    id: "jv-edtech",
    number: "07",
    name: "JV EdTech",
    category: "Education / EdTech",
    tagline: "Interactive digital learning portal & student course manager",
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
    gradient: "from-blue-900/40 via-indigo-950/20 to-black/60"
  }
]
