export interface Experience {
  id: string
  company: string
  role: string
  period: string
  location: string
  type: string
  description: string
  responsibilities: string[]
  technologies: string[]
  featured: boolean
}

export const experiences: Experience[] = [
  {
    id: "belvo",
    company: "BELVO",
    role: "Web Development Intern",
    period: "June 2026 – September 2026",
    location: "Remote",
    type: "Web Development Internship",
    description:
      "Engineered scalable digital business platforms and healthcare workflow engines (including Naivaidya), leading frontend architecture, patient authentication flows with Supabase, and responsive web systems.",
    responsibilities: [
      "Led the frontend development team across sprint planning, modular design systems, and code quality standards",
      "Implemented secure OTP-based patient authentication and administrative workflow management dashboards",
      "Architected full-stack web applications and reusable UI components using React, TypeScript, and Tailwind CSS",
      "Integrated Supabase and RESTful APIs for real-time data persistence, query optimization, and RBAC access control",
      "Optimized production build performance and delivery latency on Vercel edge networks"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Node.js", "REST APIs", "Vite", "Vercel"],
    featured: true
  },
  {
    id: "google-ambassador",
    company: "Google Student Ambassador Program",
    role: "Google Student Ambassador",
    period: "2025",
    location: "Remote",
    type: "Community & Tech Leadership",
    description:
      "Representing developer technologies and student developer ecosystems, organizing technical workshops, and driving engagement around modern web and cloud technologies.",
    responsibilities: [
      "Evangelized Google developer tools, cloud infrastructure, and student developer initiatives on campus",
      "Organized and facilitated hands-on technical workshops and hackathons on modern web tooling",
      "Mentored peers in building real-world software applications and adopting best engineering practices"
    ],
    technologies: ["Developer Relations", "Cloud Technologies", "Technical Mentorship", "Web Ecosystem", "Community Leadership"],
    featured: true
  }
]

