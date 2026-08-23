"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GraduationCap, Award, MapPin, Languages, ArrowUpRight, Code2, Heart } from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import { usePortfolio } from "@/lib/portfolio-context"

export default function AboutPage() {
  const { profile, projects } = usePortfolio()

  const displayName = profile?.displayName || "P. Lokesh"
  const location = profile?.location || "Hyderabad, India"
  const languages = profile?.languages?.length ? profile.languages.join(" · ") : "Telugu · English · Hindi · French"
  const education = profile?.education || "B.Sc. MSCS · 2027"
  const recognition = profile?.recognition || "Google Student Ambassador"
  const projectCount = projects?.filter((p) => p.visible !== false)?.length || 7

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-16">
        {/* Header section */}
        <section className="grid w-full gap-10 lg:grid-cols-[0.8fr_1.2fr] border-b border-white/10 pb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">01 / About</p>
            <h1 className="mt-3 text-5xl font-light tracking-[-0.05em] text-white md:text-7xl">
              Curious by <span className="instrument italic font-normal">nature.</span>
            </h1>
          </div>

          <div className="max-w-2xl self-end space-y-6">
            <p className="text-xl leading-relaxed text-white/90 md:text-2xl font-light">
              I&apos;m <span className="font-medium text-white">{displayName}</span>, a Full Stack Developer and Computer Science student based in {location}, driven by the craft of building resilient web products and AI integrations.
            </p>

            <p className="text-sm leading-relaxed text-white/65">
              {profile?.aboutSubDescription || "I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and AI pipelines."}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-6 text-xs text-white/70 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white/40 mb-1 text-[10px] uppercase tracking-wider">
                  <MapPin className="size-3 text-purple-400" />
                  <span>Location</span>
                </div>
                <p className="font-medium text-white">{location}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white/40 mb-1 text-[10px] uppercase tracking-wider">
                  <Languages className="size-3 text-purple-400" />
                  <span>Languages</span>
                </div>
                <p className="font-medium text-white text-[11px] leading-tight">{languages}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white/40 mb-1 text-[10px] uppercase tracking-wider">
                  <GraduationCap className="size-3 text-purple-400" />
                  <span>Education</span>
                </div>
                <p className="font-medium text-white">{education}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white/40 mb-1 text-[10px] uppercase tracking-wider">
                  <Award className="size-3 text-purple-400" />
                  <span>Recognition</span>
                </div>
                <p className="font-medium text-white">{recognition}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/work"
                className="rounded-full bg-white px-6 py-3 text-xs font-semibold text-black transition-all hover:bg-white/85"
              >
                View {projectCount} Shipped Projects
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-3 text-xs font-medium text-white transition-all hover:bg-white/10"
              >
                Start a Conversation →
              </Link>
            </div>
          </div>
        </section>

        {/* Philosophy / Technical Approach */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-3">
            <span className="font-mono text-xs text-purple-300 font-semibold">01 / DISCIPLINE</span>
            <h3 className="text-xl font-medium text-white">Type Safety & Robust Architecture</h3>
            <p className="text-xs leading-relaxed text-white/60">
              I prioritize TypeScript across the stack, clean data contracts, well-defined state boundaries, and defensive programming to deliver reliable, production-ready applications.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-3">
            <span className="font-mono text-xs text-sky-300 font-semibold">02 / INTERFACE</span>
            <h3 className="text-xl font-medium text-white">Editorial Polish & Performance</h3>
            <p className="text-xs leading-relaxed text-white/60">
              User experience is paramount. I craft fluid interactions, responsive typography, subtle animations with Framer Motion, and sub-second load times on Vercel edge networks.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-black/40 p-6 md:p-8 backdrop-blur-xl space-y-3">
            <span className="font-mono text-xs text-pink-300 font-semibold">03 / EXPANSION</span>
            <h3 className="text-xl font-medium text-white">AI & Emerging Technologies</h3>
            <p className="text-xs leading-relaxed text-white/60">
              From integrating Gemini API multi-modal pipelines in Lumora AI to exploring WebGPU compute shaders in the Studio laboratory, I actively experiment on the frontier of software engineering.
            </p>
          </div>
        </section>
      </div>
    </PortfolioShell>
  )
}
