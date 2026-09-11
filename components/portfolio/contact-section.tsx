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
  Phone,
  AlertCircle,
  Send,
} from 'lucide-react';
import { TextMorph } from '@/components/core/text-morph';
import { TextShimmer } from '@/components/core/text-shimmer';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { BorderTrail } from '@/components/core/border-trail';
import { GlowEffect } from '@/components/core/glow-effect';
import { motion } from 'framer-motion';
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
    projectType: language === 'fr' ? 'Développement Web' : 'Web Development',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isTextareaTyping, setIsTextareaTyping] = useState(false);
  const [isFormTyping, setIsFormTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingActivity = () => {
    setIsFormTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsFormTyping(false);
      setIsTextareaTyping(false);
    }, 2500);
  };

  // Custom Dark Dropdown state for Discussion Topic
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const topicRef = useRef<HTMLDivElement>(null);

  const topicOptions =
    language === 'fr'
      ? [
          'Développement Web',
          'Intégration IA / LLM',
          'Consultation Technique',
          'Poste Ingénieur Logiciel / Recrutement',
          'Autre',
        ]
      : [
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
      setErrorMessage(t('contact.errorRequired') || 'Please fill in all required fields.');
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setErrorMessage(t('contact.errorEmail') || 'Please provide a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      await submitContactInquiry({
        name: form.name,
        email: form.email,
        topic: form.projectType,
        projectType: form.projectType,
        message: form.message,
      });
      setStatus('success');
      setForm({
        name: '',
        email: '',
        projectType: 'Web Development',
        message: '',
      });
      setTimeout(() => {
        setStatus('idle');
      }, 4500);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Error submitting message. Please try again.');
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
            {/* Glow effect matching hero buttons that activates when typing in the form */}
            <motion.div
              className="pointer-events-none absolute -inset-0.5 rounded-2xl"
              animate={{
                opacity: isFormTyping || isTextareaFocused ? 1 : 0,
              }}
              transition={{
                duration: 0.25,
                ease: 'easeOut',
              }}
            >
              <GlowEffect
                colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                mode="colorShift"
                blur="soft"
                duration={3}
                scale={0.99}
              />
            </motion.div>

            <div className="relative z-10 mb-6 flex items-center justify-between border-b border-[#1F2937] pb-4">
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

            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
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
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      handleTypingActivity();
                    }}
                    onFocus={handleTypingActivity}
                    placeholder={language === 'fr' ? 'Votre Nom' : 'Your Name'}
                    disabled={status === 'submitting'}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all disabled:opacity-60"
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
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      handleTypingActivity();
                    }}
                    onFocus={handleTypingActivity}
                    placeholder={language === 'fr' ? 'votre.email@exemple.com' : 'your.email@example.com'}
                    disabled={status === 'submitting'}
                    className="w-full rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Styled Custom Dropdown */}
              <div className="relative" ref={topicRef}>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                  {t('contact.topic')}
                </label>
                <button
                  type="button"
                  disabled={status === 'submitting'}
                  onClick={() => setIsTopicOpen(!isTopicOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#1F2937] bg-[#0B132B] px-3.5 py-2.5 text-left text-xs sm:text-sm text-[#E0E7FF] focus:border-[#60A5FA] focus:outline-none transition-all cursor-pointer disabled:opacity-60"
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
                          handleTypingActivity();
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

              {/* Message Box with GlowEffect like hero buttons - No covering elements */}
              <div>
                <label className="block text-xs font-semibold text-[#E0E7FF] mb-1.5">
                  {t('contact.yourMessage')}
                </label>
                <div className="relative group">
                  {/* Glow on message box when focused or typing */}
                  <motion.div
                    className="pointer-events-none absolute -inset-0.5 rounded-xl"
                    animate={{
                      opacity: isTextareaFocused || isTextareaTyping ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeOut',
                    }}
                  >
                    <GlowEffect
                      colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                      mode="colorShift"
                      blur="soft"
                      duration={3}
                    />
                  </motion.div>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onFocus={() => {
                      setIsTextareaFocused(true);
                      handleTypingActivity();
                    }}
                    onBlur={() => {
                      setIsTextareaFocused(false);
                      setIsTextareaTyping(false);
                    }}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      setIsTextareaTyping(true);
                      handleTypingActivity();
                    }}
                    placeholder={
                      language === 'fr'
                        ? 'Parlez-moi de votre projet, de vos objectifs et de vos délais...'
                        : 'Tell me about your project, timeline, and goals...'
                    }
                    disabled={status === 'submitting'}
                    className="relative z-10 w-full resize-none rounded-xl border border-[#1F2937] bg-[#0B132B] p-3.5 text-xs sm:text-sm text-[#E0E7FF] placeholder:text-[#64748B] focus:border-[#60A5FA] focus:outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Animated Submit Button with BorderTrail + TextShimmer + TextMorph */}
              <div className="pt-2">
                <div className="relative overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827] p-1 shadow-lg">
                  {/* BorderTrail runs while submitting */}
                  {status === 'submitting' && (
                    <BorderTrail
                      className="bg-gradient-to-l from-green-300 via-green-500 to-green-300 transition-opacity duration-300 dark:from-green-700/30 dark:via-green-500 dark:to-green-700/30"
                      size={120}
                      transition={{
                        ease: [0, 0.5, 0.8, 0.5],
                        duration: 4,
                        repeat: 2,
                      }}
                    />
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={`relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all cursor-pointer ${
                      status === 'submitting'
                        ? 'bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white cursor-wait opacity-90'
                        : status === 'success'
                        ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                        : status === 'error'
                        ? 'bg-gradient-to-r from-[#BE123C] to-[#E11D48] text-white'
                        : 'bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(96,165,250,0.5)] active:scale-[0.99]'
                    }`}
                  >
                    {status === 'submitting' && (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <TextShimmer className="font-mono text-sm text-white" duration={1}>
                          Sending message...
                        </TextShimmer>
                      </div>
                    )}

                    {status === 'success' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <TextMorph className="font-mono text-sm font-semibold text-white">
                          Message Sent
                        </TextMorph>
                      </div>
                    )}

                    {status === 'error' && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-white" />
                        <TextMorph className="font-semibold text-white">
                          Failed - Click to Try Again
                        </TextMorph>
                      </div>
                    )}

                    {status === 'idle' && (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <TextMorph className="font-semibold">
                          {t('contact.btn.send') || 'Send Message'}
                        </TextMorph>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Clean Direct Channels & Verified Accounts */}
          <div className="space-y-4 lg:col-span-5">
            {/* Attractive High-End Phone Card (Clickable to WhatsApp: https://wa.me/918885674172) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#2563EB]/40 bg-[#0B132B]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#60A5FA] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] active:translate-y-0 active:scale-[0.99] cursor-pointer"
            >
              {/* Soft blue & lavender ambient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 via-[#C084FC]/15 to-[#60A5FA]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              {/* Subtle top & bottom border highlights */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#60A5FA]/70 to-transparent" />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />

              <div className="relative z-10 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB]/30 to-[#60A5FA]/20 border border-[#60A5FA]/40 text-[#60A5FA] group-hover:scale-105 group-hover:border-[#60A5FA] transition-all">
                  <Phone className="h-5 w-5 text-[#60A5FA]" />
                </div>
                <div>
                  <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors duration-300 block">
                    {phoneNumber}
                  </span>
                  <span className="text-[11px] text-[#A5B4FC]/70 block font-medium">
                    Click to chat on WhatsApp
                  </span>
                </div>
              </div>

              <ArrowUpRight className="relative z-10 h-5 w-5 text-[#64748B] group-hover:text-[#60A5FA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
