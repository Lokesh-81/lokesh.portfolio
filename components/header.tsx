"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import GitHubPopover from "@/components/github-popover"
import { usePortfolio } from "@/lib/portfolio-context"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { profile } = usePortfolio()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3 md:py-4" : "py-5 md:py-7"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 md:px-10">
          {/* Logo / Monogram */}
          <Link href="/" className="group flex items-center gap-3" aria-label="P. Lokesh home">
            <span className="relative flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-purple-400/50 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.displayName || "P. Lokesh"}
                  className="size-full object-cover"
                />
              ) : (
                "PL"
              )}
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-pulse z-10" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">
                {profile?.displayName?.toUpperCase() || "P. LOKESH"}
              </span>
              <span className="hidden text-[10px] tracking-wider text-white/40 sm:block">
                Full Stack · AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1.5 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] md:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white hover:text-black sm:flex sm:items-center sm:gap-1.5"
            >
              <span>Let&apos;s talk</span>
              <ArrowUpRight className="size-3.5" />
            </Link>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col justify-between bg-black/95 px-6 pt-24 pb-10 backdrop-blur-2xl md:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2">
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/40">Navigation</p>
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    isActive
                      ? "bg-white text-black font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className={`text-xs ${isActive ? "text-black/60" : "text-white/30"}`}>
                    0{idx + 1}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-white/40 mb-3">Get in touch</p>
            <a
              href="mailto:poosalalokesh@gmail.com"
              className="block text-sm font-medium text-white hover:text-purple-300 transition-colors"
            >
              poosalalokesh@gmail.com
            </a>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
              <GitHubPopover variant="link" />
              <a
                href="https://www.linkedin.com/in/poosala-lokesh/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://www.instagram.com/_lokesh81/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                Instagram ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
