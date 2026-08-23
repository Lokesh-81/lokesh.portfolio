import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import GitHubPopover from "@/components/github-popover"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/40 py-8 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-white/50 md:flex-row md:px-10">
        <div className="flex items-center gap-3">
          <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium">P. Lokesh</span>
          <span className="text-white/30">/</span>
          <span>Full Stack Developer × AI Enthusiast</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <span className="text-white/40">Hyderabad, India</span>
          <GitHubPopover variant="link" />
          <a
            href="https://www.linkedin.com/in/poosala-lokesh/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            LinkedIn
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href="https://www.instagram.com/_lokesh81/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white"
          >
            Instagram
            <ArrowUpRight className="size-3" />
          </a>
          <a
            href="mailto:poosalalokesh@gmail.com"
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
