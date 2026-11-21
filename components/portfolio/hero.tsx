'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, FileText, Mail } from 'lucide-react';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
import { ResumeModal } from '@/components/portfolio/resume-modal';

export interface HeroProps {
  onNavigate?: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();
  const { hero, profile } = usePortfolio();
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const greeting = t('hero.greeting', hero?.greeting || "Hello, I'm");
  const name = t('hero.name', hero?.name || profile?.displayName || 'P. Lokesh');
  const role = t('hero.imA', hero?.imA || "I'm a");
  const bio = t('hero.bio', hero?.bio || profile?.shortBio || '');
  const workLabel = t('hero.ctaWork', hero?.ctaWork || 'Explore selected work');
  const contactLabel = t('hero.ctaContact', hero?.ctaContact || "Let's talk");

  const entrance = {
    hidden: { opacity: 0, y: 34, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.2, 0.75, 0.25, 1] } },
  };

  return (
    <>
      <div className="hero-rebuild">
        <div className="hero-rebuild-grain" aria-hidden="true" />
        <motion.div
          className="hero-rebuild-copy"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.13, delayChildren: 0.28 } } }}
        >
          <motion.div variants={entrance} className="hero-rebuild-eyebrow">
            <span className="hero-rebuild-status"><span /> OPEN TO MEANINGFUL BUILDS</span>
            <span className="hero-rebuild-location">HYDERABAD, INDIA · IST</span>
          </motion.div>

          <motion.p variants={entrance} className="hero-rebuild-greeting">{greeting}</motion.p>
          <motion.h1 variants={entrance} className="hero-rebuild-name">
            {name.replace(/[.]+$/, '')}
            <span className="hero-rebuild-period">.</span>
          </motion.h1>

          <motion.div variants={entrance} className="hero-rebuild-role">
            <span>{role}</span>
            <strong>{profile?.title || 'Full Stack Web Developer'}</strong>
          </motion.div>

          {bio && (
            <motion.p variants={entrance} className="hero-rebuild-bio">{bio}</motion.p>
          )}

          <motion.div variants={entrance} className="hero-rebuild-actions">
            <button type="button" onClick={() => onNavigate?.('work')} className="hero-rebuild-primary">
              {workLabel}<ArrowUpRight size={17} />
            </button>
            <button type="button" onClick={() => onNavigate?.('contact')} className="hero-rebuild-secondary">
              <Mail size={16} />{contactLabel}
            </button>
            <button type="button" onClick={() => setIsResumeModalOpen(true)} className="hero-rebuild-resume">
              <FileText size={16} /> Resume
            </button>
          </motion.div>
          <motion.div variants={entrance} className="hero-rebuild-bottomline">
            <span>DESIGNING · BUILDING · ITERATING</span>
            <button type="button" onClick={() => onNavigate?.('about')}>SCROLL TO EXPLORE <ArrowDownRight size={15} /></button>
          </motion.div>
        </motion.div>

        <motion.aside
          className="hero-orbit-system"
          aria-label="Featured projects and technology orbit"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="orbit-system-heading">
            <span>SELECTED BUILDS</span>
            <span className="orbit-system-live"><i /> LIVE PROJECTS</span>
          </div>
          <div className="orbit-system-stage">
            <div className="orbit-track orbit-track-outer" />
            <div className="orbit-track orbit-track-middle" />
            <div className="orbit-track orbit-track-inner" />
            <div className="orbit-satellite orbit-satellite-lumora">
              <a href="https://www.lumoraai.in/" target="_blank" rel="noopener noreferrer" aria-label="Open Lumora AI">
                <span className="orbit-satellite-index">01 / AI RESEARCH</span>
                <strong>LUMORA AI <ArrowUpRight size={13} /></strong>
                <small>Market intelligence</small>
              </a>
            </div>
            <div className="orbit-satellite orbit-satellite-letters">
              <a href="https://oldletters.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Open Old-Letters">
                <span className="orbit-satellite-index">02 / PRODUCT</span>
                <strong>OLD-LETTERS <ArrowUpRight size={13} /></strong>
                <small>Time-delayed letters</small>
              </a>
            </div>
            <div className="orbit-satellite orbit-satellite-foundarly">
              <a href="https://www.foundarlybusinessworld.in/" target="_blank" rel="noopener noreferrer" aria-label="Open Foundarly">
                <span className="orbit-satellite-index">03 / WEB PLATFORM</span>
                <strong>FOUNDARLY <ArrowUpRight size={13} /></strong>
                <small>Business ecosystem</small>
              </a>
            </div>
            <div className="orbit-system-core">
              <span className="orbit-core-monogram">PL<span>.</span></span>
              <span className="orbit-core-caption">IDEA → INTERFACE → IMPACT</span>
            </div>
            <span className="orbit-tech orbit-tech-react">REACT</span>
            <span className="orbit-tech orbit-tech-ts">TYPESCRIPT</span>
            <span className="orbit-tech orbit-tech-ai">AI / API</span>
            <span className="orbit-tech orbit-tech-db">SUPABASE</span>
          </div>
          <div className="orbit-system-footer">
            <span>BUILDING USEFUL THINGS</span>
            <span>HYDERABAD · INDIA</span>
          </div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
