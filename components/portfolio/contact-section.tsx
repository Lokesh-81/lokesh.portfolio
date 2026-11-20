'use client';

import React, { useState } from 'react';
import { Copy, Check, Github, Linkedin, Instagram, Phone, ArrowUpRight, Mail } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';

export function ContactSection() {
  const { contact, social } = usePortfolio();
  const { t } = useLanguage();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const email1 = contact?.email1 || 'poosala15@gmail.com';
  const email2 = contact?.email2 || 'lokesh81@myyahoo.com';
  const linkedinUrl = social?.linkedinUrl || 'https://www.linkedin.com/in/poosala-lokesh/';
  const instagramUrl = social?.instagramUrl || 'https://www.instagram.com/_lokesh81/';
  const githubAccounts = [
    { handle: 'Lokesh-81', url: 'https://github.com/Lokesh-81' },
    { handle: 'lokeshnaivaidya-max', url: 'https://github.com/lokeshnaivaidya-max' },
  ];

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedText(email);
      window.setTimeout(() => setCopiedText(null), 1800);
    } catch {
      setCopiedText(null);
    }
  };

  return (
    <section className="contact-sketchbook w-full px-4 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#d8d0c2] pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8d596c]">{t('contact.tag')}</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-[#24221f] sm:text-5xl">
              {t('contact.title')} <span className="instrument font-normal italic text-[#a45b78]">{t('contact.titleAccent')}</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#696257]">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-[#29251f] bg-[#fffdf7] p-6 shadow-[4px_4px_0_#29251f] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#a45b78]" />
              <h3 className="text-lg font-bold text-[#24221f]">{t('contact.emailSection')}</h3>
            </div>
            <div className="space-y-3">
              {[email1, email2].map((email) => (
                <div key={email} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#d8d0c2] bg-white p-3">
                  <a href={`mailto:${email}`} className="min-w-0 break-all text-sm font-semibold text-[#24221f] hover:text-[#a45b78]">{email}</a>
                  <button type="button" onClick={() => copyEmail(email)} aria-label={t('contact.copyEmail')} className="shrink-0 rounded-lg border border-[#d8d0c2] p-2 text-[#6d6270] hover:bg-[#f1eaf7]">
                    {copiedText === email ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <a href="https://wa.me/918885674172" target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-2xl border-2 border-[#29251f] bg-[#fffdf7] p-6 shadow-[4px_4px_0_#29251f] transition-transform hover:-translate-y-1 sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f4e9] text-[#21834a]"><Phone className="h-6 w-6" /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#777064]">WhatsApp</p>
                <p className="mt-1 text-lg font-bold text-[#24221f]">+91 8885674172</p>
                <p className="mt-1 text-sm text-[#696257]">Message me directly</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#a45b78] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>

          <div className="rounded-2xl border-2 border-[#29251f] bg-[#fffdf7] p-6 shadow-[4px_4px_0_#29251f] sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <Github className="h-5 w-5 text-[#a45b78]" />
              <h3 className="text-lg font-bold text-[#24221f]">{t('contact.githubSection')}</h3>
            </div>
            <div className="space-y-3">
              {githubAccounts.map((account) => (
                <a key={account.handle} href={account.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-xl border border-[#d8d0c2] bg-white p-3 text-sm font-semibold text-[#24221f] hover:border-[#a45b78]">
                  <span className="break-all">github.com/{account.handle}</span><ArrowUpRight className="h-4 w-4 shrink-0 text-[#a45b78]" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#29251f] bg-[#fffdf7] p-6 shadow-[4px_4px_0_#29251f] sm:p-7">
            <h3 className="mb-5 text-lg font-bold text-[#24221f]">Find me online</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#d8d0c2] bg-white px-3 text-sm font-semibold text-[#24221f] hover:border-[#a45b78]"><Linkedin className="h-4 w-4 text-[#a45b78]" />LinkedIn</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#d8d0c2] bg-white px-3 text-sm font-semibold text-[#24221f] hover:border-[#a45b78]"><Instagram className="h-4 w-4 text-[#a45b78]" />Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
