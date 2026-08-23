"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, Filter } from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import { usePortfolio } from "@/lib/portfolio-context"

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const { projects } = usePortfolio()

  const visibleProjects = projects.filter((p) => p.visible !== false)

  const categories = ["All", "AI & FinTech", "Healthcare", "Business & Startups", "Creative & EdTech"]

  const filteredProjects = visibleProjects.filter((project) => {
    if (selectedCategory === "All") return true
    if (selectedCategory === "AI & FinTech") return project.category.includes("AI") || project.category.includes("FinTech")
    if (selectedCategory === "Healthcare") return project.category.includes("Healthcare")
    if (selectedCategory === "Business & Startups") return project.category.includes("Business") || project.category.includes("Startup") || project.category.includes("Corporate")
    if (selectedCategory === "Creative & EdTech") return project.category.includes("Photography") || project.category.includes("Education")
    return true
  })

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-16">
        {/* Page Header */}
        <section className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">02 / Selected Work</p>
            <h1 className="mt-3 text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
              Things I&apos;ve <span className="instrument italic font-normal">built.</span>
            </h1>
          </div>
          <div className="max-w-md space-y-3">
            <p className="text-sm leading-relaxed text-white/65">
              A curated catalog of production platforms, healthcare workflow engines, AI-powered financial tools, and enterprise web solutions engineered with modern web standards.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs text-white/40 flex items-center gap-1">
            <Filter className="size-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-white text-black font-semibold shadow-md"
                  : "border border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Large Editorial / Case Study Project Stream */}
        <div className="space-y-16 md:space-y-24">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl border border-white/15 bg-black/40 p-6 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/30"
              >
                {/* Top Accent bar */}
                <div
                  className="absolute inset-x-8 top-0 h-[2px] opacity-60"
                  style={{ backgroundColor: project.accentColor }}
                />

                <div className="space-y-6">
                  {/* Header meta */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-purple-300">{project.number}</span>
                      <span className="text-white/30">/</span>
                      <span className="text-xs uppercase tracking-wider text-white/60 font-medium">{project.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${
                          project.status === "Live" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[11px] text-white/50">{project.status}</span>
                    </div>
                  </div>

                  {/* Project Title & Tagline */}
                  <div>
                    <h2 className="text-3xl font-light text-white md:text-4xl tracking-tight">
                      {project.name}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-purple-200/90">{project.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70 max-w-4xl">{project.description}</p>
                  </div>

                  {/* What I Worked On */}
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      What I Engineered & Delivered
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.whatIWorkedOn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/80">
                          <CheckCircle2 className="size-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Badges */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Technologies Used</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-all duration-200 hover:bg-white/85 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      >
                        <span>Live Website</span>
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
                      >
                        <Github className="size-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <span>Discuss this project →</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <section className="rounded-3xl border border-white/15 bg-gradient-to-r from-purple-950/40 via-black/60 to-black p-8 md:p-12 text-center backdrop-blur-xl space-y-6">
          <h3 className="text-3xl font-light text-white md:text-4xl">
            Interested in building something <span className="instrument italic">together?</span>
          </h3>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/65">
            Whether you need a modern full-stack web application, an AI-powered system, or a technical leader for your engineering team, let&apos;s connect.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-7 py-3 text-xs font-semibold text-black transition-all hover:bg-white/85"
            >
              Start a Conversation
            </Link>
            <Link
              href="/experience"
              className="rounded-full border border-white/20 px-6 py-3 text-xs font-medium text-white transition-all hover:bg-white/10"
            >
              View Experience Timeline
            </Link>
          </div>
        </section>
      </div>
    </PortfolioShell>
  )
}
