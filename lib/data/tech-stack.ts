export type SkillLevel = "Core" | "Working Knowledge" | "Familiar"

export interface TechItem {
  name: string
  level: SkillLevel
  category: "Languages" | "Frontend & UI" | "Backend & APIs" | "Databases & Cloud" | "Tools & Emerging"
  iconName?: string
}

export const techStack: TechItem[] = [
  // Languages
  { name: "JavaScript (ES6+)", level: "Core", category: "Languages" },
  { name: "TypeScript", level: "Core", category: "Languages" },
  { name: "Python", level: "Working Knowledge", category: "Languages" },
  { name: "Java", level: "Working Knowledge", category: "Languages" },
  { name: "C", level: "Familiar", category: "Languages" },
  { name: "C++", level: "Familiar", category: "Languages" },
  { name: "HTML5", level: "Core", category: "Languages" },
  { name: "CSS3", level: "Core", category: "Languages" },

  // Frontend & UI
  { name: "React", level: "Core", category: "Frontend & UI" },
  { name: "Next.js", level: "Core", category: "Frontend & UI" },
  { name: "Tailwind CSS", level: "Core", category: "Frontend & UI" },
  { name: "Vite", level: "Core", category: "Frontend & UI" },
  { name: "Framer Motion", level: "Working Knowledge", category: "Frontend & UI" },
  { name: "GSAP", level: "Working Knowledge", category: "Frontend & UI" },
  { name: "Three.js", level: "Familiar", category: "Frontend & UI" },

  // Backend & APIs
  { name: "Node.js", level: "Core", category: "Backend & APIs" },
  { name: "Express.js", level: "Core", category: "Backend & APIs" },
  { name: "REST APIs", level: "Core", category: "Backend & APIs" },
  { name: "AI / LLM APIs (Gemini)", level: "Working Knowledge", category: "Backend & APIs" },

  // Databases & Cloud
  { name: "MongoDB", level: "Working Knowledge", category: "Databases & Cloud" },
  { name: "Supabase", level: "Working Knowledge", category: "Databases & Cloud" },
  { name: "Firebase (Firestore & Auth)", level: "Working Knowledge", category: "Databases & Cloud" },
  { name: "MySQL", level: "Working Knowledge", category: "Databases & Cloud" },
  { name: "Vercel", level: "Core", category: "Databases & Cloud" },

  // Tools & Emerging
  { name: "Git", level: "Core", category: "Tools & Emerging" },
  { name: "GitHub", level: "Core", category: "Tools & Emerging" },
  { name: "Power BI", level: "Working Knowledge", category: "Tools & Emerging" },
  { name: "Microsoft Fabric", level: "Familiar", category: "Tools & Emerging" }
]

export const categories = [
  "All",
  "Languages",
  "Frontend & UI",
  "Backend & APIs",
  "Databases & Cloud",
  "Tools & Emerging"
] as const
