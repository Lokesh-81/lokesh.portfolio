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
      "Represented developer ecosystems and the student community, organizing technical workshops and driving engagement and hands-on literacy around Gemini AI and generative tools.",
    responsibilities: [
      "Conducted hands-on technical workshops focused on Gemini AI APIs, prompt engineering, and GenAI applications",
      "Fostered student community growth through AI literacy sessions and collaborative developer hackathons",
      "Mentored student peers in building real-world software applications and adopting best engineering practices"
    ],
    technologies: [
      "Gemini AI",
      "Technical Workshops",
      "Student Community",
      "AI Literacy",
      "GenAI"
    ],
    featured: true
  }
]
