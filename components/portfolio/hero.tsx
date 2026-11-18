'use client';

import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, FileText, MoveUpRight } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
import { ResumeModal } from '@/components/portfolio/resume-modal';

export interface HeroProps { onNavigate?: (section: string) => void; }

export function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();
  const { hero, profile } = usePortfolio();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const displayName = hero?.name || profile?.displayName || profile?.name || 'P. Lokesh';
  const bio = hero?.bio || profile?.aboutSubDescription || 'I build thoughtful digital products, combining full-stack engineering with a strong eye for detail.';
  const words = displayName.trim().split(/\s+/);
  const first = words.slice(0, -1).join(' ') || words[0] || 'P.';
  const last = words.length > 1 ? words[words.length - 1] : 'Lokesh';
  const role = 'FULL-STACK DEVELOPER';

  return (
    <div className="editorial-hero mx-auto flex min-h-[min(900px,100svh)] w-full max-w-[1600px] flex-col justify-center px-5 pb-16 pt-28 sm:px-10 lg:px-16">
      <div className="editorial-hero-top"><span>{profile?.displayName || 'P. LOKESH'}</span><span>PORTFOLIO · 2026</span></div>
      <div className="editorial-hero-layout">
        <div className="editorial-hero-title" aria-label={`${displayName}, ${role}`}>
          <div className="editorial-line editorial-line-one"><span className="editorial-serif">CREATIVE</span><span className="editorial-index">01 / DIGITAL CRAFT</span></div>
          <div className="editorial-line editorial-line-two"><span className="editorial-sans">{role}</span></div>
          <div className="editorial-line editorial-line-three"><span className="editorial-serif editorial-italic">{first}</span><span className="editorial-serif">{last}</span></div>
        </div>
        <aside className="editorial-hero-aside">
          <span className="editorial-aside-mark">✳</span>
          <p>{bio}</p>
          <div className="editorial-aside-rule" />
          <span className="editorial-aside-caption">BASED IN {profile?.location || 'HYDERABAD, INDIA'}<br/>BUILDING FOR THE WEB.</span>
          <button className="editorial-text-link" onClick={() => onNavigate?.('about')}>MORE ABOUT ME <MoveUpRight size={15}/></button>
        </aside>
      </div>
      <div className="editorial-hero-bottom">
        <div className="editorial-hero-actions">
          <button className="editorial-pill editorial-pill-solid" onClick={() => onNavigate?.('work')}>EXPLORE SELECTED WORK <ArrowUpRight size={16}/></button>
          <button className="editorial-pill" onClick={() => setIsResumeModalOpen(true)}><FileText size={15}/> VIEW RESUME</button>
          <button className="editorial-pill editorial-pill-quiet" onClick={() => onNavigate?.('contact')}>LET'S TALK <ArrowUpRight size={15}/></button>
        </div>
        <button className="editorial-scroll-cue" onClick={() => onNavigate?.('about')} aria-label="Scroll to explore"><span>SCROLL TO EXPLORE · SCROLL TO EXPLORE · </span><ArrowDownRight size={19}/></button>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </div>
  );
}
