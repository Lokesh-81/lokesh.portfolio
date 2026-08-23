"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Instagram
} from "lucide-react"
import PortfolioShell from "@/components/portfolio-shell"
import GitHubPopover from "@/components/github-popover"

export default function ContactPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "", subject: "Project Inquiry" })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setFormSubmitted(true)
  }

  const phoneNumber = "+91 88856 74172"
  const whatsappUrl = "https://wa.me/918885674172"

  return (
    <PortfolioShell className="pt-6 md:pt-12">
      <div className="w-full space-y-16">
        {/* Header section */}
        <section className="grid w-full items-end gap-10 lg:grid-cols-[1fr_0.9fr] border-b border-white/10 pb-12">
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
                    href="mailto:poosalalokesh@gmail.com"
                    className="text-xs font-mono text-white hover:text-purple-300 transition-colors"
                  >
                    poosalalokesh@gmail.com
                  </a>
                  <button
                    onClick={() => copyToClipboard("poosalalokesh@gmail.com")}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedText === "poosalalokesh@gmail.com" ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <a
                    href="mailto:lokeshpoosala@gmail.com"
                    className="text-xs font-mono text-white hover:text-purple-300 transition-colors"
                  >
                    lokeshpoosala@gmail.com
                  </a>
                  <button
                    onClick={() => copyToClipboard("lokeshpoosala@gmail.com")}
                    className="p-1 text-white/50 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedText === "lokeshpoosala@gmail.com" ? (
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
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-mono text-white hover:text-emerald-300 transition-colors"
                >
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>{phoneNumber}</span>
                  <ArrowUpRight className="size-3 text-white/40" />
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
                href="https://www.linkedin.com/in/poosala-lokesh/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
              >
                <Linkedin className="size-3.5" />
                <span>LinkedIn ↗</span>
              </a>
              <a
                href="https://www.instagram.com/_lokesh81/"
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

        {/* Interactive Contact Form */}
        <section className="mx-auto max-w-3xl rounded-3xl border border-white/15 bg-black/50 p-6 md:p-10 backdrop-blur-2xl shadow-2xl">
          {formSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-400">
                <Check className="size-6" />
              </div>
              <h3 className="text-2xl font-light text-white">Message Received</h3>
              <p className="mx-auto max-w-md text-xs text-white/65 leading-relaxed">
                Thank you for reaching out, {formData.name}. I have received your note and will reply directly to {formData.email} shortly.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false)
                  setFormData({ name: "", email: "", message: "", subject: "Project Inquiry" })
                }}
                className="mt-4 rounded-full border border-white/20 px-6 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-medium text-white">Send a Direct Message</h3>
                  <p className="text-xs text-white/50">Fill out this quick form or connect directly</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1.5 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1.5 font-medium">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1.5 font-medium">
                  Subject / Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Project Inquiry">Full Stack Project Inquiry</option>
                  <option value="Full-Time Engineering Role">Full-Time / Contract Role</option>
                  <option value="AI / LLM Integration">AI / LLM System Architecture</option>
                  <option value="General Collaboration">General Collaboration & Mentorship</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-white/50 block mb-1.5 font-medium">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your product requirements, timeline, or open engineering opportunity..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center pt-2">
                <span className="text-[11px] text-white/40 font-mono">
                  Location: Hyderabad (IST · UTC+5:30)
                </span>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-semibold text-black transition-all hover:bg-white/85"
                >
                  <span>Transmit Message</span>
                  <Send className="size-3.5" />
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </PortfolioShell>
  )
}
