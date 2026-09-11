'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Linkedin,
  Instagram,
  Github,
  CheckCircle2,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { TextMorph } from '@/components/core/text-morph';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { BorderTrail } from '@/components/core/border-trail';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { submitContactInquiry } from '@/lib/inquiries';

export function ContactSection() {
  const { contact, social } = usePortfolio();
  const { t, language } = useLanguage();

  const email1 = contact?.email1 || 'poosala15@gmail.com';
  const email2 = contact?.email2 || 'lokes81@myyahoo.com';
  const phoneNumber = '+91 8885674172';
  const whatsappUrl = 'https://wa.me/918885674172';
  const linkedinUrl = social?.linkedinUrl || 'https://www.linkedin.com/in/poosala-lokesh/';
  const instagramUrl = social?.instagramUrl || 'https://www.instagram.com/_lokesh81/';

  // Two distinct GitHub accounts
  const githubAccounts = [
    {
      handle: 'Lokesh-81',
      label: t('contact.githubPrimary'),
      url: 'https://github.com/Lokesh-81',
    },
    {
      handle: 'lokeshnaivaidya-max',
      label: t('contact.githubSecondary'),
      url: 'https://github.com/lokeshnaivaidya-max',
    },
  ];

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Web Development',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom Dark Dropdown state for Discussion Topic
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);

  const topicOptions = [
    'Web Development',
    'AI Integration',
    'Technical Consultation',
    'Software Engineer Role / Hiring',
    'Other',
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (topicRef.current && !topicRef.current.contains(event.target as Node)) {
        setIsTopicOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage(t('contact.errorRequired'));
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
          projectType: 'Web Development',
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
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Contact Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('contact.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('contact.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('contact.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('contact.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* 2-Column Split: Production Contact Form & Direct Verified Channels */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start pb-12">
          {/* Production Inquiry Form */}
          <div className="relative rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-8 shadow-xs lg:col-span-7">
            <div className="mb-6 flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#E0E7FF]">
                  {t('contact.formTitle')}
                </h3>
                <div className="text-xs text-[#CBD5E1] mt-0.5">
                  {t('contact.formDesc')}
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#2563EB]/25 px-3 py-1 font-mono text-[11px] font-semibold text-[#60A5FA] border border-[#2563EB]/40">
                {t('contact.responseBadge')}
              </span>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2DD4BF]/20 text-[#2DD4BF] mb-3">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-bold text-[#E0E7FF]">
                  {t('contact.successTitle')}
                </h4>
                <div className="text-xs text-[#CBD5E1] max-w-sm mt-1">
                  {t('contact.successDesc')}{' '}
                  <span className="font-mono text-[#60A5FA] font-medium">
                    {form.email || 'your email'}
                  </span>
                  .
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                      {t('contact.yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                      {t('contact.emailAddress')}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Styled, Non-broken Custom Dropdown */}
                <div className="relative" ref={topicRef}>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                    {t('contact.topic')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTopicOpen(!isTopicOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-left text-xs sm:text-sm text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none transition-all cursor-pointer"
                  >
                    <span>{form.projectType}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#A5B4FC] transition-transform ${
                        isTopicOpen ? 'rotate-180 text-[#60A5FA]' : ''
                      }`}
                    />
                  </button>

                  {isTopicOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 overflow-hidden rounded-xl border border-[#1F2937] bg-[#0B132B] p-1 shadow-2xl backdrop-blur-xl">
                      {topicOptions.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, projectType: topic });
                            setIsTopicOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
                            form.projectType === topic
                              ? 'bg-[#2563EB]/25 text-[#60A5FA] font-medium'
                              : 'text-[#CBD5E1] hover:bg-[#111827] hover:text-[#E0E7FF]'
                          }`}
                        >
                          <span>{topic}</span>
                          {form.projectType === topic && (
                            <Check className="h-3.5 w-3.5 text-[#60A5FA]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                    {t('contact.yourMessage')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] p-3.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all resize-none"
                  />
                </div>

                {/* BorderTrail & TextMorph Button for Submission */}
                <div className="pt-2">
                  <div className="relative overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827] p-1">
                    {isLoading && (
                      <BorderTrail
                        className="bg-gradient-to-l from-[#2563EB] via-[#60A5FA] to-[#2DD4BF]"
                        size={120}
                        transition={{
                          ease: [0, 0.5, 0.8, 0.5],
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_6px_25px_rgba(96,165,250,0.5)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                    >
                      <TextMorph>
                        {isLoading
                          ? t('contact.btn.sending')
                          : isSuccess
                          ? t('contact.btn.sent')
                          : t('contact.btn.send')}
                      </TextMorph>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Clean Direct Channels & Verified Accounts */}
          <div className="space-y-4 lg:col-span-5">
            {/* Attractive High-End Phone Card (Visible content = ONLY the phone number, clickable to WhatsApp) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#2563EB]/40 bg-gradient-to-r from-[#111827]/95 via-[#1E293B]/90 to-[#111827]/95 p-5 sm:p-6 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#60A5FA] hover:shadow-[0_10px_35px_rgba(37,99,235,0.35)] active:translate-y-0 active:scale-[0.99] cursor-pointer"
            >
              {/* Soft blue & lavender ambient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/15 via-[#C084FC]/10 to-[#60A5FA]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              {/* Subtle border gradients */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#60A5FA]/60 to-transparent" />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#2563EB]/40 to-transparent" />

              <span className="relative z-10 font-mono text-base sm:text-lg md:text-xl font-bold tracking-widest text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors duration-300">
                {phoneNumber}
              </span>
            </a>

            {/* Direct Email Addresses */}
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5B4FC]/70 block mb-2.5">
                {t('contact.emailSection')}
              </span>
              <div className="space-y-2">
                {[email1, email2].map((em) => (
                  <div
                    key={em}
                    className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] p-2.5"
                  >
                    <a
                      href={`mailto:${em}`}
                      className="font-mono text-xs font-medium text-[#E0E7FF] hover:text-[#60A5FA] transition-colors truncate mr-2"
                    >
                      {em}
                    </a>
                    <button
                      onClick={() => copyToClipboard(em)}
                      className="rounded-lg p-1.5 text-[#A5B4FC]/70 hover:bg-[#1F2937] hover:text-[#E0E7FF] transition-colors cursor-pointer"
                      title={t('contact.copyEmail')}
                    >
                      {copiedText === em ? (
                        <Check className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Profiles: BOTH Accounts Displayed Separately */}
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A5B4FC]/70 block mb-2.5">
                {t('contact.githubSection')}
              </span>
              <div className="space-y-2">
                {githubAccounts.map((account) => (
                  <a
                    key={account.handle}
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] p-2.5 text-xs transition-all hover:border-[#60A5FA] group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-[#A5B4FC] group-hover:text-[#60A5FA]" />
                      <div>
                        <span className="font-mono font-bold text-[#E0E7FF] group-hover:text-[#60A5FA]">
                          github.com/{account.handle}
                        </span>
                        <span className="block text-[10px] text-[#A5B4FC]/70">
                          {account.label}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#64748B] group-hover:text-[#60A5FA] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                className="flex items-center justify-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827]/90 p-3 text-xs font-semibold text-[#E0E7FF] shadow-xs transition-all hover:border-[#60A5FA] hover:text-[#60A5FA]"
              >
                <Linkedin className="h-4 w-4 text-[#60A5FA]" />
                <span>{t('contact.linkedin')}</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#1F2937] bg-[#111827]/90 p-3 text-xs font-semibold text-[#E0E7FF] shadow-xs transition-all hover:border-[#F9A8D4] hover:text-[#F9A8D4]"
              >
                <Instagram className="h-4 w-4 text-[#F9A8D4]" />
                <span>{t('contact.instagram')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
