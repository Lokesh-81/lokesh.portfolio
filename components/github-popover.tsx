"use client"

import { useState, useRef, useEffect } from "react"
import { Github, ArrowUpRight, ChevronDown } from "lucide-react"

interface GitHubPopoverProps {
  variant?: "button" | "card" | "link"
  className?: string
}

export default function GitHubPopover({ variant = "card", className = "" }: GitHubPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const profiles = [
    {
      label: "GitHub — lokeshnaivaidya-max",
      username: "lokeshnaivaidya-max",
      url: "https://github.com/lokeshnaivaidya-max",
    },
    {
      label: "GitHub — Lokesh-81",
      username: "Lokesh-81",
      url: "https://github.com/Lokesh-81",
    },
  ]

  if (variant === "link") {
    return (
      <div ref={menuRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 transition-colors hover:text-white text-xs text-white/50"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Github className="size-3" />
          <span>GitHub</span>
          <ChevronDown className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 left-0 sm:left-auto sm:right-0 z-50 min-w-[240px] rounded-xl border border-white/15 bg-black/90 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 border-b border-white/10 mb-1">
              Select Profile
            </div>
            {profiles.map((profile) => (
              <a
                key={profile.url}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <span>{profile.label}</span>
                <ArrowUpRight className="size-3 text-white/40" />
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Github className="size-3.5" />
        <span>GitHub</span>
        <ChevronDown className={`size-3 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl border border-white/15 bg-black/95 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 border-b border-white/10 mb-1">
            GitHub Profiles
          </div>
          {profiles.map((profile) => (
            <a
              key={profile.url}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span className="truncate">{profile.label}</span>
              <ArrowUpRight className="size-3 text-white/40 shrink-0 ml-1.5" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
