'use client';

import React, { useState } from 'react';
import {
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
import { useLanguage } from '@/i18n';
import { submitContactInquiry } from '@/lib/inquiries';

export function ContactSection() {
  const { contact, social } = usePortfolio();
  const { t } = useLanguage();

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
        {/* Section Header (Number removed) */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
            {t('contact.tag')}
          </p>
          <div className="mt-2 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              {t('contact.title')}{' '}
              <span className="instrument italic font-normal">{t('contact.titleAccent')}</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>

        {/* 2-Column Split: Production Contact Form & Direct Verified Channels */}
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Production Inquiry Form with BorderTrail effect */}
          <div className="relative rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-sm dark:border-zinc-800/90 dark:bg-zinc-950 lg:col-span-7">
            <BorderTrail
              className="bg-gradient-to-l from-purple-500 via-violet-500 to-transparent"
              size={120}
            />

            <div className="mb-8 flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-900">
              <div>
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {t('contact.formTitle')}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {t('contact.formDesc')}
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 font-mono text-[11px] font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                {t('contact.responseBadge')}
              </span>
            </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-zinc-950 dark:text-white">
                  {t('contact.successTitle')}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mt-1">
                  {t('contact.successDesc')} <span className="font-mono text-purple-600 dark:text-purple-400">{form.email || 'your email'}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-50/70 p-3 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t('contact.yourName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t('contact.namePlaceholder')}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-400 dark:focus:bg-zinc-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t('contact.emailAddress')}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t('contact.emailPlaceholder')}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-400 dark:focus:bg-zinc-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    {t('contact.topic')}
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-purple-400 dark:focus:bg-zinc-900 transition-all"
                  >
                    <option value="Full-Stack Web App">{t('contact.topic.fullstack')}</option>
                    <option value="AI / LLM Integration">{t('contact.topic.ai')}</option>
                    <option value="Frontend Architecture">{t('contact.topic.frontend')}</option>
                    <option value="Software Engineer Role / Hiring">{t('contact.topic.role')}</option>
                    <option value="Consulting & Advisory">{t('contact.topic.consulting')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    {t('contact.yourMessage')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-400 dark:focus:bg-zinc-900 transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-600 active:scale-[0.99] disabled:opacity-70 dark:bg-white dark:text-zinc-950 dark:hover:bg-purple-400 dark:hover:text-black cursor-pointer"
                  >
                    <TextMorph>
                      {isLoading
                        ? t('contact.btn.sending')
                        : isSuccess
                        ? t('contact.btn.sent')
                        : t('contact.btn.send')}
                    </TextMorph>
                    {!isLoading && !isSuccess && <Send className="h-4 w-4 ml-1" />}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Clean Direct Channels & Verified Accounts */}
          <div className="space-y-6 lg:col-span-5">
            {/* Direct Email Addresses */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
                {t('contact.emailSection')}
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
                      title={t('contact.copyEmail')}
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
                {t('contact.whatsappCall')}
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
                    {t('contact.clickToChat')}
                  </span>
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 rounded-lg border border-emerald-600/30 bg-white px-2.5 py-1 text-xs text-emerald-700 shadow-xs hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300"
                    title={t('contact.callDirect')}
                  >
                    <Phone className="h-3 w-3" />
                    <span>{t('contact.callDirect')}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(phoneNumber)}
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    title={t('contact.copyPhone')}
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
                {t('contact.githubSection')}
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
                <span>{t('contact.linkedin')}</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-purple-400 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-purple-500/50 dark:hover:text-white"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                <span>{t('contact.instagram')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
