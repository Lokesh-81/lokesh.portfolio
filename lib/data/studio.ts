export interface StudioProject {
  id: string
  title: string
  description: string
  category: string
  status: "In Development" | "Prototyping" | "Alpha" | "Planning"
  technologies: string[]
  image?: string
  url?: string
  githubUrl?: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface StudioExperiment {
  id: string
  title: string
  description: string
  technology: string
  category: "AI" | "3D Web" | "APIs" | "Animations" | "Data Visualization" | "Experimental UI"
  status: "Active" | "Completed" | "WIP"
  url?: string
  githubUrl?: string
  createdAt: string
}

export interface StudioChangelog {
  id: string
  title: string
  description: string
  date: string
  category: "Release" | "Feature" | "Refactor" | "Architecture" | "Experiment"
  version?: string
}

export interface StudioLab {
  id: string
  title: string
  description: string
  status: "Exploring" | "Benchmarking" | "Prototyping"
  tags: string[]
  notes: string
}

export const initialStudioProjects: StudioProject[] = [
  {
    id: "sp-1",
    title: "Lumora AI v2 — Intelligent Research Engine",
    description: "Next-generation financial data analysis with streaming Gemini multi-modal synthesis, real-time citation graphs, and customizable investment watchlists.",
    category: "AI / FinTech",
    status: "In Development",
    technologies: ["Next.js 15", "Gemini 2.5 Flash", "MongoDB", "Redis", "TypeScript"],
    progress: 75,
    url: "https://lumora-ai.vercel.app",
    githubUrl: "https://github.com/Lokesh-81",
    createdAt: "2026-06-15",
    updatedAt: "2026-08-20"
  },
  {
    id: "sp-2",
    title: "Autonomous Workflow Orchestrator",
    description: "Lightweight node-based pipeline execution engine for chaining API actions, LLM evaluators, and scheduled background tasks in serverless edge environments.",
    category: "Developer Tools",
    status: "Prototyping",
    technologies: ["TypeScript", "Node.js", "Express", "REST APIs", "Tailwind CSS"],
    progress: 40,
    githubUrl: "https://github.com/Lokesh-81",
    createdAt: "2026-07-02",
    updatedAt: "2026-08-18"
  },
  {
    id: "sp-3",
    title: "Real-Time Canvas Collaboration Hub",
    description: "Low-latency shared infinite whiteboard supporting vector strokes, interactive sticky notes, and live cursors with state synchronization.",
    category: "Web & Realtime",
    status: "Alpha",
    technologies: ["React", "WebSockets", "Supabase Realtime", "Canvas API"],
    progress: 60,
    githubUrl: "https://github.com/Lokesh-81",
    createdAt: "2026-07-20",
    updatedAt: "2026-08-14"
  }
]

export const initialExperiments: StudioExperiment[] = [
  {
    id: "exp-1",
    title: "Mesh Shader Noise Displacements",
    description: "Web-based dynamic fragment shader with procedural noise calculations and reactive cursor magnetic fields.",
    technology: "WebGL / GLSL / React",
    category: "3D Web",
    status: "Active",
    createdAt: "2026-08-10"
  },
  {
    id: "exp-2",
    title: "Gemini Structured JSON Extraction",
    description: "Zero-shot financial ledger and invoice parsing using structured schemas and automated schema validation.",
    technology: "Google GenAI SDK / TypeScript",
    category: "AI",
    status: "Completed",
    createdAt: "2026-07-28"
  },
  {
    id: "exp-3",
    title: "Spring Physics Gesture Cards",
    description: "Fluid card deck manipulation utilizing multi-point spring damping and gesture inertia tracking.",
    technology: "Framer Motion / Tailwind",
    category: "Experimental UI",
    status: "Active",
    createdAt: "2026-07-15"
  },
  {
    id: "exp-4",
    title: "Hierarchical Time-Series Stream Graph",
    description: "Dynamic multi-metric time series stream visualizer rendering 60 FPS interpolated spline curves.",
    technology: "Canvas / D3.js Math",
    category: "Data Visualization",
    status: "Completed",
    createdAt: "2026-06-30"
  }
]

export const initialLabs: StudioLab[] = [
  {
    id: "lab-1",
    title: "WebGPU Compute Shaders in Browser",
    description: "Benchmarking client-side parallel particle simulations using native WebGPU compute pipelines vs WebGL fallback.",
    status: "Benchmarking",
    tags: ["WebGPU", "Compute Shaders", "Graphics", "Performance"],
    notes: "Testing 100k+ particle field physics simulations running at steady 60 FPS in modern Chromium."
  },
  {
    id: "lab-2",
    title: "On-Device Small Language Models (SLMs)",
    description: "Evaluating WebLLM / ONNX Runtime Web for offline contextual embedding search and privacy-preserving client tasks.",
    status: "Exploring",
    tags: ["WebLLM", "ONNX", "Wasm", "Edge AI"],
    notes: "Analyzing memory footprint and cold-start latency on mobile Safari and Chrome."
  },
  {
    id: "lab-3",
    title: "Optimistic Multi-User CRDT Synchronization",
    description: "Evaluating Conflict-free Replicated Data Types for peer-to-peer offline-first document state resolution.",
    status: "Prototyping",
    tags: ["CRDT", "Yjs", "Offline-First", "Distributed Systems"],
    notes: "Structuring lightweight state vector differentials over WebSockets and WebRTC."
  }
]

export const initialChangelog: StudioChangelog[] = [
  {
    id: "ch-1",
    title: "Studio Digital Laboratory Launch",
    description: "Launched the dedicated /studio workspace with interactive experiments, playground modules, project trackers, and Firebase sync architecture.",
    date: "August 2026",
    category: "Release",
    version: "v2.2.0"
  },
  {
    id: "ch-2",
    title: "Experience & 7-Project Editorial Upgrade",
    description: "Expanded Selected Work with all 7 flagship production projects, deep-dive case study layouts, and dedicated professional timeline experience.",
    date: "August 2026",
    category: "Feature",
    version: "v2.1.0"
  },
  {
    id: "ch-3",
    title: "Lumora AI Architecture Overhaul",
    description: "Integrated Gemini 2.5 Flash streaming APIs and optimized Redis cache layers for sub-second financial report generation.",
    date: "July 2026",
    category: "Architecture",
    version: "v2.0.0"
  },
  {
    id: "ch-4",
    title: "Naivaidya Healthcare Portal Launch",
    description: "Shipped the complete healthcare administration portal with OTP verification workflows, patient rosters, and Supabase integration.",
    date: "May 2026",
    category: "Release",
    version: "v1.4.0"
  }
]
