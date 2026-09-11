'use client';

import React, { useState } from 'react';
import { ArrowRight, Mail, Send, CheckCircle2 } from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { TextLoop } from '@/components/core/text-loop';
import { GlowEffect } from '@/components/core/glow-effect';
import {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from '@/components/core/morphing-popover';
import { BorderTrail } from '@/components/core/border-trail';
import { TextMorph } from '@/components/core/text-morph';
import { Clock } from '@/components/core/sliding-number';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { submitContactInquiry } from '@/lib/inquiries';
import type { Variants } from 'framer-motion';

export interface HeroProps {
  onNavigate?: (section: string) => void;
}

const textEffectVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      rotateX: 90,
      y: 10,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  },
};

export function Hero({ onNavigate }: HeroProps) {
  const { profile } = usePortfolio();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t('contact.errorRequired'));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await submitContactInquiry(formData);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          email: '',
          projectType: 'Full-Stack Web App',
          message: '',
        });
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit inquiry.');
    } finally {
      setIsLoading(false);
    }
  };

  const greetingText = t('hero.greeting').toUpperCase();
  const nameText = language === 'en' ? 'LOKESH.' : t('hero.nameShort');
  const bioText = language === 'en' && profile?.shortBio ? profile.shortBio : t('hero.bio');

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 pt-20 pb-8 sm:pt-24 sm:pb-12"
    >
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-between">
        {/* 1. Status Indicator & IST Clock — Placed below navbar and before hero content */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/60 pb-5 dark:border-zinc-900/60">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider">
              {t('hero.status')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-mono text-[11px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              {t('hero.location')}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold text-purple-600 dark:text-purple-400">IST</span>
              <Clock />
            </div>
          </div>
        </div>

        {/* 2. Main Hero Content */}
        <div className="my-auto py-2">
          {/* Refined editorial typography with proper hierarchy */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              {t('hero.roleTag')}
            </p>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.03em] text-zinc-950 dark:text-zinc-50 leading-[1.1]">
              <span className="block text-zinc-500 dark:text-zinc-400 font-normal text-2xl sm:text-4xl md:text-5xl mb-1">
                <TextEffect
                  key={`hero-greet-${language}`}
                  per="char"
                  delay={0.08}
                  variants={textEffectVariants}
                >
                  {greetingText}
                </TextEffect>
              </span>
              <span className="block font-medium tracking-tight text-zinc-950 dark:text-white">
                <TextEffect
                  key={`hero-name-${language}`}
                  per="char"
                  delay={0.24}
                  variants={textEffectVariants}
                >
                  {nameText}
                </TextEffect>
              </span>
            </h1>
          </div>

          {/* Role animation with TextLoop */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-lg sm:text-2xl font-light text-zinc-600 dark:text-zinc-300">
            <span>{t('hero.specializingIn')}</span>
            <TextLoop
              key={`hero-loop-${language}`}
              className="font-medium text-purple-600 dark:text-purple-400"
              interval={2600}
            >
              <span>{t('hero.role.fullStack')}</span>
              <span>{t('hero.role.aiEngineer')}</span>
              <span>{t('hero.role.architect')}</span>
              <span>{t('hero.role.uiux')}</span>
            </TextLoop>
          </div>

          {/* Bio statement */}
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 font-normal">
            {bioText}
          </p>

          {/* Interactive CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary CTA with GlowEffect */}
            <div className="relative group">
              <GlowEffect
                colors={['#a855f7', '#6366f1', '#38bdf8']}
                mode="colorShift"
                blur="soft"
                duration={3.5}
                scale={0.96}
              />

              <button
                onClick={() => onNavigate?.('work')}
                className="relative z-10 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <span>{t('hero.ctaWork')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Secondary CTA: MorphingPopover for fast direct inquiry */}
            <MorphingPopover>
              <MorphingPopoverTrigger>
                <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-5 py-3 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur-md transition-colors hover:border-purple-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:bg-zinc-900 cursor-pointer">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>{t('hero.ctaContact')}</span>
                </div>
              </MorphingPopoverTrigger>

              <MorphingPopoverContent className="max-w-md">
                <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {t('hero.quickInquiry')}
                  </span>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {t('hero.modalTitle')}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {t('hero.modalSubtitle')}
                  </p>
                </div>

                {isSuccess ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-6 text-center dark:bg-emerald-950/20">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
                    <h4 className="mt-3 text-lg font-semibold text-emerald-900 dark:text-emerald-200">
                      {t('contact.successTitle')}
                    </h4>
                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                      {t('contact.successDesc')} {formData.email || 'your email'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {errorMessage && (
                      <div className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-500 dark:text-red-400">
                        {errorMessage}
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        {t('hero.yourName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('hero.namePlaceholder')}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        {t('hero.emailAddress')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('hero.emailPlaceholder')}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        {t('hero.projectScope')}
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-purple-500"
                      >
                        <option value="Full-Stack Web App">{t('contact.topic.fullstack')}</option>
                        <option value="AI / LLM Integration">{t('contact.topic.ai')}</option>
                        <option value="Frontend Architecture">{t('contact.topic.frontend')}</option>
                        <option value="Engineering Role / Hiring">{t('contact.topic.role')}</option>
                        <option value="Consulting & Advisory">{t('contact.topic.consulting')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                        {t('hero.message')} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t('hero.messagePlaceholder')}
                        className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-purple-500"
                      />
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950 mt-4">
                      {isLoading && (
                        <BorderTrail
                          className="bg-gradient-to-l from-purple-400 via-violet-500 to-indigo-400"
                          size={120}
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
                        className="relative z-10 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-75 dark:bg-white dark:text-zinc-950"
                      >
                        <TextMorph>
                          {isLoading
                            ? t('hero.sending')
                            : isSuccess
                            ? t('hero.inquirySent')
                            : t('hero.sendInquiry')}
                        </TextMorph>
                        {!isLoading && !isSuccess && <Send className="h-3.5 w-3.5 ml-1" />}
                      </button>
                    </div>
                  </form>
                )}
              </MorphingPopoverContent>
            </MorphingPopover>
          </div>
        </div>

        {/* 3. Subtle Footer Line with quick info */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200/50 pt-4 text-xs text-zinc-500 dark:border-zinc-900/50 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{t('hero.techStack')}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Lokesh-81"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              GitHub (Lokesh-81)
            </a>
            <a
              href="https://github.com/lokeshnaivaidya-max"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              GitHub (naivaidya-max)
            </a>
            <a
              href="https://wa.me/918885674172"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
