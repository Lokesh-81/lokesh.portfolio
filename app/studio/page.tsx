"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles,
  Layers,
  FlaskConical,
  Terminal,
  Clock,
  ArrowUpRight,
  Github,
  Database,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Settings
} from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import StudioPlayground from "@/components/studio-playground"
import {
  fetchStudioProjects,
  fetchStudioExperiments,
  fetchStudioChangelog,
  isFirebaseConfigured
} from "@/lib/firebase"
import {
  initialLabs,
  type StudioProject,
  type StudioExperiment,
  type StudioChangelog,
  type StudioLab
} from "@/lib/data/studio"

export default function StudioPage() {
  const [projects, setProjects] = useState<StudioProject[]>([])
  const [experiments, setExperiments] = useState<StudioExperiment[]>([])
  const [changelog, setChangelog] = useState<StudioChangelog[]>([])
  const [labs] = useState<StudioLab[]>(initialLabs)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [experimentFilter, setExperimentFilter] = useState<string>("All")

  const loadData = async () => {
    try {
      const [projData, expData, changeData] = await Promise.all([
        fetchStudioProjects(),
        fetchStudioExperiments(),
        fetchStudioChangelog()
      ])
      setProjects(projData)
      setExperiments(expData)
      setChangelog(changeData)
    } catch (e) {
      console.error("Failed to load studio data:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const experimentCategories = ["All", "AI", "3D Web", "Experimental UI", "Data Visualization"]

  const filteredExperiments = experiments.filter((exp) => {
    if (experimentFilter === "All") return true
    return exp.category === experimentFilter
  })

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-20">
        {/* Studio Hero Header */}
        <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-b from-purple-950/30 via-black/80 to-black/90 p-8 md:p-14 backdrop-blur-2xl shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 size-96 rounded-full bg-sky-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 backdrop-blur-md">
                <FlaskConical className="size-3.5 text-purple-400" />
                <span>DIGITAL LABORATORY & WORKSPACE</span>
              </div>

              <h1 className="text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
                LOKESH <span className="instrument italic font-normal text-purple-300">STUDIO.</span>
              </h1>

              <p className="text-base leading-relaxed text-white/75 md:text-lg">
                Digital experiments, products, ideas and things I&apos;m currently building. A private workspace for exploring emerging AI workflows, compute shaders, distributed CRDTs, and experimental interfaces.
              </p>
            </div>

            {/* Sync & Admin Quick Access */}
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl md:items-end">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`size-2 rounded-full ${
                    isFirebaseConfigured ? "bg-emerald-400" : "bg-purple-400 animate-pulse"
                  }`}
                />
                <span className="font-mono text-white/70">
                  {isFirebaseConfigured ? "Firebase Firestore: Live" : "Studio State: Active"}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="ml-2 text-white/50 hover:text-white transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>

              <Link
                href="/studio/admin"
                className="group flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-900/20 px-3.5 py-1.5 text-xs font-medium text-purple-200 transition-all hover:bg-purple-800/40 hover:text-white"
              >
                <Settings className="size-3 text-purple-400" />
                <span>Studio Admin CMS</span>
                <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 1. Currently Building Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-5 text-purple-400" />
              <h2 className="text-2xl font-light text-white tracking-tight md:text-3xl">
                Currently <span className="instrument italic font-normal">Building</span>
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono">{projects.length} Active Tracks</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/50 hover:bg-white/[0.04]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-medium text-purple-300">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-white/50 text-[11px]">
                        <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-white group-hover:text-purple-200 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-white/65">{item.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] text-white/50 font-mono">
                        <span>Sprint Completion</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-400"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/50">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] text-white/40">
                          {t}
                        </span>
                      ))}
                    </div>
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors text-[11px]"
                      >
                        <span>Repo</span>
                        <ArrowUpRight className="size-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Interactive Playground Section */}
        <section>
          <StudioPlayground />
        </section>

        {/* 3. Experiments Section */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-1">
                <Terminal className="size-4 text-purple-400" />
                <span>MICRO-PROTOTYPES</span>
              </div>
              <h2 className="text-2xl font-light text-white tracking-tight md:text-3xl">
                Active <span className="instrument italic font-normal">Experiments</span>
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {experimentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setExperimentFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    experimentFilter === cat
                      ? "bg-purple-600 text-white shadow-sm"
                      : "border border-white/10 bg-black/40 text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredExperiments.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col justify-between rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-xl transition-all duration-200 hover:border-white/30 hover:bg-white/[0.03]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-purple-300 font-mono">{exp.category}</span>
                    <span className="text-emerald-400">{exp.status}</span>
                  </div>
                  <h4 className="text-base font-medium text-white">{exp.title}</h4>
                  <p className="text-xs leading-relaxed text-white/60">{exp.description}</p>
                </div>
                <div className="mt-4 border-t border-white/10 pt-3 text-[10px] text-white/40 font-mono">
                  Stack: {exp.technology}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Labs & Exploration Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="size-5 text-purple-400" />
              <h2 className="text-2xl font-light text-white tracking-tight md:text-3xl">
                Research <span className="instrument italic font-normal">Labs</span>
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono">Architectural Explorations</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="rounded-2xl border border-white/15 bg-black/40 p-6 backdrop-blur-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-300 font-semibold">{lab.status}</span>
                  <span className="size-2 rounded-full bg-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white">{lab.title}</h3>
                <p className="text-xs leading-relaxed text-white/70">{lab.description}</p>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] text-white/60 leading-relaxed font-mono">
                  &gt; {lab.notes}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Changelog Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Clock className="size-5 text-purple-400" />
              <h2 className="text-2xl font-light text-white tracking-tight md:text-3xl">
                Studio <span className="instrument italic font-normal">Changelog</span>
              </h2>
            </div>
            <span className="text-xs text-white/40 font-mono">Version History</span>
          </div>

          <div className="space-y-4">
            {changelog.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl md:flex-row md:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold font-mono text-purple-300">{entry.version || "v2.0"}</span>
                    <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-white/60">{entry.category}</span>
                    <span className="text-xs text-white/40">{entry.date}</span>
                  </div>
                  <h4 className="text-base font-medium text-white">{entry.title}</h4>
                  <p className="text-xs text-white/65 leading-relaxed">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortfolioShell>
  )
}
