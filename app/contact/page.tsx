"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Phone,
  MessageCircle,
  Linkedin,
  Instagram
} from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import GitHubPopover from "@/components/github-popover"
import { usePortfolio } from "@/lib/portfolio-context"

export default function ContactPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { contact, social } = usePortfolio()

  const email1 = contact?.email1 || "poosala15@gmail.com"
  const email2 = contact?.email2 || "lokes81@myyahoo.com"
  const phoneNumber = contact?.phone || "+91 88856 74172"
  const whatsappUrl = contact?.whatsappUrl || "https://wa.me/918885674172"
  const linkedinUrl = social?.linkedinUrl || "https://www.linkedin.com/in/poosala-lokesh/"
  const instagramUrl = social?.instagramUrl || "https://www.instagram.com/_lokesh81/"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2500)
  }

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-12">
        {/* Header and Main Contact Section */}
        <section className="grid w-full items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">04 / Contact</p>
            <h1 className="mt-3 text-6xl font-light leading-[0.92] tracking-[-0.06em] text-white md:text-8xl">
              Let&apos;s make <br />
              <span className="instrument italic font-normal">something.</span>
            </h1>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-white/65">
              Have an open role, an exciting platform to engineer, or want to discuss AI systems? My inbox and WhatsApp are always open.
            </p>
          </div>

          <div className="space-y-4 text-sm lg:justify-self-end w-full max-w-md">
            {/* Primary Email Card */}
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-purple-400" />
                  <span>Direct Inboxes</span>
                </span>
                <span className="text-emerald-400 text-[10px]">Avg response &lt; 12 hrs</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <a
                    href={`mailto:${email1}`}
                    className="text-xs font-mono text-white hover:text-purple-300 transition-colors"
                  >
                    {email1}
                  </a>
                  <button
                    onClick={() => copyToClipboard(email1)}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedText === email1 ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <a
                    href={`mailto:${email2}`}
                    className="text-xs font-mono text-white hover:text-purple-300 transition-colors"
                  >
                    {email2}
                  </a>
                  <button
                    onClick={() => copyToClipboard(email2)}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedText === email2 ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* WhatsApp & Phone Card */}
            <div className="rounded-2xl border border-white/15 bg-black/40 p-5 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-emerald-400" />
                  <span>WhatsApp & Direct Call</span>
                </span>
                <span className="text-emerald-400 text-[10px]">Instant Connect</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                <a
                  href="tel:+918885674172"
                  className="flex items-center gap-2 text-xs font-mono text-white hover:text-emerald-300 transition-colors"
                >
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>{phoneNumber}</span>
                  <Phone className="size-3 text-white/40 ml-0.5" />
                </a>

                <div className="flex items-center gap-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <button
                    onClick={() => copyToClipboard(phoneNumber)}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                    title="Copy phone number"
                  >
                    {copiedText === phoneNumber ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="grid grid-cols-3 gap-2">
              <GitHubPopover />
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
              >
                <Linkedin className="size-3.5" />
                <span>LinkedIn ↗</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
              >
                <Instagram className="size-3.5" />
                <span>Instagram ↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </PortfolioShell>
  )
}
