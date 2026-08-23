"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import GitHubPopover from "@/components/github-popover"
import { usePortfolio } from "@/lib/portfolio-context"

export default function Footer() {
  const { profile, social, contact } = usePortfolio()

  const displayName = profile?.displayName || "P. Lokesh"
  const location = profile?.location || "Hyderabad, India"
  const linkedin = social?.linkedinUrl || "https://www.linkedin.com/in/poosala-lokesh/"
  const instagram = social?.instagramUrl || "https://www.instagram.com/_lokesh81/"
  const email = contact?.email1 || "poosala15@gmail.com"

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 py-8 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-white/50 md:flex-row md:px-10">
        <div className="flex items-center gap-3">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">{displayName}</span>
          <span className="text-white/30">/</span>
          <span>Full Stack Developer × AI Enthusiast</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <span className="text-white/40">{location}</span>
          <GitHubPopover variant="link" />
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            LinkedIn
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            Instagram
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            Email
            <ArrowUpRight className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
