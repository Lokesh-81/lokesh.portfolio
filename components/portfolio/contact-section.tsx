'use client';

import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Phone,
  MessageCircle,
  Linkedin,
  Instagram,
  Github,
  Send,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { BorderTrail } from '@/components/core/border-trail';
import { TextMorph } from '@/components/core/text-morph';
import { usePortfolio } from '@/lib/portfolio-context';
import { submitContactInquiry } from '@/lib/inquiries';

export function ContactSection() {
  const { contact, social } = usePortfolio();

  const email1 = contact?.email1 || 'poosala15@gmail.com';
  const email2 = contact?.email2 || 'lokes81@myyahoo.com';
  const phoneNumber = contact?.phone || '+91 88856 74172';
  const whatsappUrl = 'https://wa.me/918885674172';
  const linkedinUrl = social?.linkedinUrl || 'https://www.linkedin.com/in/poosala-lokesh/';
  const instagramUrl = social?.instagramUrl || 'https://www.instagram.com/_lokesh81/';

  // Two distinct GitHub accounts per requirement
  const githubAccounts = [
    {
      handle: 'Lokesh-81',
      label: 'Primary / Main Repository',
      url: 'https://github.com/Lokesh-81',
    },
    {
      handle: 'lokeshnaivaidya-max',
      label: 'Organization / Secondary',
      url: 'https://github.com/lokeshnaivaidya-max',
    },
  ];

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage('Please provide your name, email, and message.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await submitContactInquiry(form);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setForm({
          name: '',
          email: '',
          projectType: 'Full-Stack Web App',
          message: '',
        });
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error submitting message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
            05 / CONTACT & INQUIRIES
          </p>
          <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
            Let's build <span className="instrument italic font-normal">together.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Available for full-time software engineering roles, high-impact product contracts, and technical advisory. Reach out directly or send a message below.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Contact Form */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
                Send Direct Inquiry
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                Avg Response &lt; 12 hrs
              </span>
            </div>

            {isSuccess ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-8 text-center dark:bg-emerald-950/20">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h4 className="mt-3 text-xl font-semibold text-emerald-900 dark:text-emerald-200">
                  Message Sent Successfully
                </h4>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  Thank you for reaching out. I'll get back to you promptly at {form.email || 'your email'}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-500/10 p-3 text-xs text-red-500 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your.email@company.com"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Discussion Topic
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500"
                  >
                    <option value="Full-Stack Web App">Full-Stack Web App</option>
                    <option value="AI / LLM Integration">AI / LLM Integration</option>
                    <option value="Frontend Architecture">Frontend Architecture</option>
                    <option value="Software Engineer Role">Software Engineer Role</option>
                    <option value="Technical Consulting">Technical Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, budget, or engineering role..."
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                  />
                </div>

                {/* Submit button with BorderTrail and TextMorph */}
                <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950 mt-2">
                  {isLoading && (
                    <BorderTrail
                      className="bg-gradient-to-l from-purple-400 via-violet-500 to-indigo-400"
                      size={140}
                      transition={{
                        ease: 'linear',
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative z-10 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-75 dark:bg-white dark:text-zinc-950"
                  >
                    <TextMorph>
                      {isLoading ? 'Sending...' : isSuccess ? 'Message Sent ✓' : 'Send Message'}
                    </TextMorph>
                    {!isLoading && !isSuccess && <Send className="h-4 w-4 ml-1" />}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Clean Direct Channels & Verified Accounts */}
          <div className="space-y-6">
            {/* Direct Email Addresses */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
                Email Addresses
              </span>
              <div className="space-y-2">
                {[email1, email2].map((em) => (
                  <div
                    key={em}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-900 dark:bg-zinc-900/60"
                  >
                    <a
                      href={`mailto:${em}`}
                      className="font-mono text-xs font-medium text-zinc-900 hover:text-purple-600 dark:text-zinc-200 dark:hover:text-purple-400 transition-colors truncate mr-2"
                    >
                      {em}
                    </a>
                    <button
                      onClick={() => copyToClipboard(em)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                      title="Copy email address"
                    >
                      {copiedText === em ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp & Phone Link (Click to Chat directly) */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
                Direct WhatsApp & Call
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{phoneNumber}</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium font-sans">
                    Click to Chat
                  </span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 rounded-lg border border-emerald-600/30 bg-white px-2.5 py-1 text-xs text-emerald-700 shadow-xs hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300"
                    title="Call directly"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(phoneNumber)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    title="Copy phone number"
                  >
                    {copiedText === phoneNumber ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* GitHub Profiles: BOTH Accounts Displayed Separately */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
                GitHub Profiles (Both Accounts)
              </span>
              <div className="space-y-2.5">
                {githubAccounts.map((account) => (
                  <a
                    key={account.handle}
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3 text-xs transition-all hover:border-purple-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-purple-500/50 dark:hover:bg-zinc-900 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-zinc-700 dark:text-zinc-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      <div>
                        <span className="font-mono font-semibold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          github.com/{account.handle}
                        </span>
                        <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">
                          {account.label}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Professional & Social Links */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-purple-400 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/50 dark:hover:text-white"
              >
                <Linkedin className="h-4 w-4 text-blue-500" />
                <span>LinkedIn Profile ↗</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-purple-400 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/50 dark:hover:text-white"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                <span>Instagram Profile ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
