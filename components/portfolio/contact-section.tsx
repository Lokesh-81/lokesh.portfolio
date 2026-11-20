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
import { BorderTrail } from '@/components/core/border-trail';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { submitContactInquiry } from '@/lib/inquiries';
import { rateLimiter } from '@/lib/rate-limiter';

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
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setIsTyping(false), 850);
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: language === 'fr' ? 'Développement Web' : 'Web Development',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

    const rlCheck = rateLimiter.check('contact_form');
    if (!rlCheck.allowed) {
      setErrorMessage(`Rate limit reached: Please wait ${rlCheck.retryAfterSeconds} seconds before sending another inquiry.`);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      trackEvent('contact', 'contact_click');
      rateLimiter.recordAttempt('contact_form');
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
    <div className="contact-sketchbook relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Section Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#35263D] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#E8B8D2] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('contact.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#F5EAF5] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('contact.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#E8B8D2]">
                {t('contact.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#DCCFE0]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('contact.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* 2-Column Split: Production Contact Form & Direct Verified Channels */}
        <div className="mt-10 grid grid-cols-1 items-start gap-10 pb-16 lg:grid-cols-12">
          {/* Production Inquiry Form */}
          <div className={`contact-form-panel relative min-w-0 w-full rounded-xl border border-[#29251f] bg-[#fffdf7] p-7 sm:p-9 lg:col-span-8${isTyping ? " is-typing" : ""}`}
            <div className="relative z-10 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#d8d0c2] pb-5">
              <div>
                <h3 className="text-lg font-bold text-[#24221f]">
                  {t('contact.formTitle')}
                </h3>
                <div className="text-xs text-[#696257] mt-0.5">
                  {t('contact.formDesc')}
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#f0eafa] px-3 py-1 font-mono text-[11px] font-semibold text-[#514d45] border border-[#29251f]/30">
                {t('contact.responseBadge')}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-7">
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#29251f] mb-1.5">
                    {t('contact.yourName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      handleTyping();
                    }}
                    placeholder={language === 'fr' ? 'Votre Nom' : 'Your Name'}
                    disabled={status === 'submitting'}
                    className="contact-input w-full min-h-[62px] rounded-[20px] border-2 border-[#b8ad9e] bg-white px-5 py-4 text-[15px] leading-6 text-[#24221f] placeholder:text-[#777064] focus:border-[#5c4b79] focus:outline-none focus:ring-4 focus:ring-[#d9cdf8]/70 transition-all disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#29251f] mb-1.5">
                    {t('contact.emailAddress')}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      handleTyping();
                    }}
                    placeholder={language === 'fr' ? 'votre.email@exemple.com' : 'your.email@example.com'}
                    disabled={status === 'submitting'}
                    className="contact-input w-full min-h-[62px] rounded-[20px] border-2 border-[#b8ad9e] bg-white px-5 py-4 text-[15px] leading-6 text-[#24221f] placeholder:text-[#777064] focus:border-[#5c4b79] focus:outline-none focus:ring-4 focus:ring-[#d9cdf8]/70 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Styled Custom Dropdown */}
              <div className="contact-topic-field relative w-full" ref={topicRef}>
                <label className="block text-xs font-semibold text-[#F5EAF5] mb-1.5">
                  {t('contact.topic')}
                </label>
                <button
                  type="button"
                  disabled={status === 'submitting'}
                  onClick={() => setIsTopicOpen(!isTopicOpen)}
                  className="contact-input flex min-h-[62px] w-full items-center justify-between rounded-[20px] border-2 border-[#b8ad9e] bg-white px-5 py-4 text-left text-[15px] leading-6 text-[#24221f] focus:border-[#5c4b79] focus:outline-none focus:ring-4 focus:ring-[#d9cdf8]/70 transition-all cursor-pointer disabled:opacity-60"
                >
                  <span>{form.projectType}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#D8B4E8] transition-transform ${
                      isTopicOpen ? 'rotate-180 text-[#E8B8D2]' : ''
                    }`}
                  />
                </button>

                {isTopicOpen && (
                  <div className="contact-topic-menu absolute left-0 right-0 top-full z-30 mt-2 w-full overflow-hidden rounded-lg border border-[#29251f] bg-white p-2 shadow-[4px_4px_0_#29251f]">
                    {topicOptions.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, projectType: topic });
                          setIsTopicOpen(false);
                        }}
                        className={`flex min-h-11 w-full items-center justify-between rounded-md px-4 py-3 text-sm transition-colors cursor-pointer ${
                          form.projectType === topic
                            ? 'bg-[#A77BC2]/25 text-[#E8B8D2] font-medium'
                            : 'text-[#DCCFE0] hover:bg-[#1A1222] hover:text-[#F5EAF5]'
                        }`}
                      >
                        <span>{topic}</span>
                        {form.projectType === topic && (
                          <Check className="h-3.5 w-3.5 text-[#E8B8D2]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-semibold text-[#F5EAF5] mb-1.5">
                  {t('contact.yourMessage')}
                </label>
                <div className="relative group">
                  <textarea
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      handleTyping();
                    }}
                    placeholder={
                      language === 'fr'
                        ? 'Parlez-moi de votre projet, de vos objectifs et de vos délais...'
                        : 'Tell me about your project, timeline, and goals...'
                    }
                    disabled={status === 'submitting'}
                    className="contact-input relative z-10 w-full min-h-[200px] resize-y rounded-2xl border-2 border-[#b8ad9e] bg-white p-5 text-sm leading-7 text-[#24221f] placeholder:text-[#777064] focus:border-[#5c4b79] focus:outline-none focus:ring-4 focus:ring-[#d9cdf8]/70 transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Animated Submit Button with BorderTrail + TextShimmer + TextMorph */}
              <div className="pt-2">
                <div className="relative overflow-hidden rounded-xl border border-[#35263D] bg-[#1A1222] p-1 shadow-lg">
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
                        ? 'bg-gradient-to-r from-[#1D4ED8] to-[#A77BC2] text-white cursor-wait opacity-90'
                        : status === 'success'
                        ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                        : status === 'error'
                        ? 'bg-gradient-to-r from-[#BE123C] to-[#E11D48] text-white'
                        : 'bg-gradient-to-r from-[#A77BC2] to-[#E8B8D2] text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(96,165,250,0.5)] active:scale-[0.99]'
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
          <div className="contact-direct-panel min-w-0 space-y-5 lg:col-span-4">
            {/* Attractive High-End Phone Card (Clickable to WhatsApp: https://wa.me/918885674172) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#A77BC2]/40 bg-[#100B18]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#E8B8D2] hover:shadow-[0_12px_40px_rgba(37,99,235,0.4)] active:translate-y-0 active:scale-[0.99] cursor-pointer"
            >
              {/* Soft blue & lavender ambient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#A77BC2]/20 via-[#D8B4E8]/15 to-[#E8B8D2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              {/* Subtle top & bottom border highlights */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#E8B8D2]/70 to-transparent" />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#A77BC2]/50 to-transparent" />

              <div className="relative z-10 flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#A77BC2]/30 to-[#E8B8D2]/20 border border-[#E8B8D2]/40 text-[#E8B8D2] group-hover:scale-105 group-hover:border-[#E8B8D2] transition-all">
                  <Phone className="h-5 w-5 text-[#E8B8D2]" />
                </div>
                <div>
                  <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[#F5EAF5] group-hover:text-[#E8B8D2] transition-colors duration-300 block">
                    {phoneNumber}
                  </span>
                  <span className="text-[11px] text-[#D8B4E8]/70 block font-medium">
                    Click to chat on WhatsApp
                  </span>
                </div>
              </div>

              <ArrowUpRight className="relative z-10 h-5 w-5 text-[#A78BAF] group-hover:text-[#E8B8D2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Direct Email Addresses */}
            <div className="rounded-2xl border border-[#35263D] bg-[#1A1222]/90 p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8B4E8]/70 block mb-2.5">
                {t('contact.emailSection')}
              </span>
              <div className="space-y-2">
                {[email1, email2].map((em) => (
                  <div
                    key={em}
                    className="flex items-center justify-between rounded-xl border border-[#35263D] bg-[#100B18] p-2.5"
                  >
                    <a
                      href={`mailto:${em}`}
                      className="font-mono text-xs font-medium text-[#F5EAF5] hover:text-[#E8B8D2] transition-colors truncate mr-2"
                    >
                      {em}
                    </a>
                    <button
                      onClick={() => copyToClipboard(em)}
                      className="rounded-lg p-1.5 text-[#D8B4E8]/70 hover:bg-[#35263D] hover:text-[#F5EAF5] transition-colors cursor-pointer"
                      title={t('contact.copyEmail')}
                    >
                      {copiedText === em ? (
                        <Check className="h-3.5 w-3.5 text-[#A77BC2]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Profiles: BOTH Accounts Displayed Separately */}
            <div className="rounded-2xl border border-[#35263D] bg-[#1A1222]/90 p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8B4E8]/70 block mb-2.5">
                {t('contact.githubSection')}
              </span>
              <div className="space-y-2">
                {githubAccounts.map((account) => (
                  <a
                    key={account.handle}
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#35263D] bg-[#100B18] p-2.5 text-xs transition-all hover:border-[#E8B8D2] group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Github className="h-4 w-4 text-[#D8B4E8] group-hover:text-[#E8B8D2]" />
                      <div>
                        <span className="font-mono font-bold text-[#F5EAF5] group-hover:text-[#E8B8D2]">
                          github.com/{account.handle}
                        </span>
                        <span className="block text-[10px] text-[#D8B4E8]/70">
                          {account.label}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#A78BAF] group-hover:text-[#E8B8D2] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                className="flex items-center justify-center gap-2 rounded-xl border border-[#35263D] bg-[#1A1222]/90 p-3 text-xs font-semibold text-[#F5EAF5] shadow-xs transition-all hover:border-[#E8B8D2] hover:text-[#E8B8D2]"
              >
                <Linkedin className="h-4 w-4 text-[#E8B8D2]" />
                <span>{t('contact.linkedin')}</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#35263D] bg-[#1A1222]/90 p-3 text-xs font-semibold text-[#F5EAF5] shadow-xs transition-all hover:border-[#F9A8D4] hover:text-[#F9A8D4]"
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
