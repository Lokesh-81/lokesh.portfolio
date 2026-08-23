"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin, CheckCircle2, Code2, Database, Wrench, Layers } from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import { usePortfolio } from "@/lib/portfolio-context"
import { type SkillLevel } from "@/lib/firebase"

export default function ExperiencePage() {
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>("All")
  const { experiences, technologies } = usePortfolio()

  const categories = ["All", ...Array.from(new Set(technologies.map((t) => t.category)))]

  const filteredTech = technologies.filter((tech) => {
    if (selectedTechCategory === "All") return true
    return tech.category === selectedTechCategory
  })

  const getLevelBadge = (level: SkillLevel) => {
    switch (level) {
      case "Core":
        return "border-purple-500/40 bg-purple-500/10 text-purple-300"
      case "Working Knowledge":
        return "border-sky-500/40 bg-sky-500/10 text-sky-300"
      case "Familiar":
        return "border-white/10 bg-white/5 text-white/50"
    }
  }

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-20">
        {/* Page Header */}
        <section className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-purple-300 backdrop-blur-md mb-4">
              <Briefcase className="size-3" />
              <span>Professional & Platform Track Record</span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">03 / Experience & Skills</p>
            <h1 className="mt-3 text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
              Roles & <span className="instrument italic font-normal">Expertise.</span>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/65">
            A factual breakdown of engineering responsibilities, team leadership, architectural contributions, and active technical toolsets.
          </p>
        </section>

        {/* Experience Timeline */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Briefcase className="size-5 text-purple-400" />
            <h2 className="text-2xl font-light text-white tracking-tight md:text-3xl">
              Professional <span className="instrument italic font-normal">Timeline</span>
            </h2>
          </div>

          <div className="relative border-l border-white/15 pl-6 md:pl-10 space-y-12 ml-3">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Node Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 flex size-4 items-center justify-center rounded-full border-2 border-purple-400 bg-black">
                  <div className="size-1.5 rounded-full bg-purple-400" />
                </div>

                <div className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-6 transition-all duration-300 hover:border-white/30">
                  {/* Header info */}
                  <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-2xl font-medium text-white">{exp.company}</h3>
                        <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-medium text-purple-300">
                          {exp.type}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-purple-200">{exp.role}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="size-3.5 text-white/40" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-white/40" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/75">{exp.description}</p>

                  {/* Key Responsibilities */}
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Key Responsibilities & Deliverables
                    </p>
                    <ul className="space-y-2.5">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2.5 text-xs leading-relaxed text-white/80">
                          <CheckCircle2 className="size-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies Used */}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Technologies & Tools</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Matrix Section */}
        <section className="space-y-8 rounded-3xl border border-white/15 bg-black/40 p-6 md:p-10 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-purple-300 text-xs font-medium mb-1">
                <Code2 className="size-4" />
                <span>Technical Repertoire</span>
              </div>
              <h2 className="text-3xl font-light text-white tracking-tight md:text-4xl">
                Tech Stack & <span className="instrument italic font-normal">Technologies</span>
              </h2>
            </div>

            {/* Proficiency Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="text-white/40">Proficiency:</span>
              <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2.5 py-0.5 text-purple-300">
                Core
              </span>
              <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-0.5 text-sky-300">
                Working Knowledge
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-white/50">
                Familiar
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTechCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedTechCategory === cat
                    ? "bg-white text-black font-semibold shadow-md"
                    : "border border-white/10 bg-black/50 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredTech.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05]"
              >
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{tech.category}</span>
                  <p className="mt-1 text-sm font-medium text-white">{tech.name}</p>
                </div>
                <div className="mt-3">
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-medium ${getLevelBadge(tech.level)}`}>
                    {tech.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortfolioShell>
  )
}
