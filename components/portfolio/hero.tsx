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
          className="hero-work-stack"
          aria-label="Selected products"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .9, delay: .25, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-work-stack-heading"><span>SELECTED BUILDS</span><span>01 — 03</span></div>
          <a className="hero-work-card hero-work-card-lumora" href="https://www.lumoraai.in/" target="_blank" rel="noreferrer">
            <span className="hero-work-card-index">01</span>
            <span className="hero-work-card-copy"><small>AI / FINANCIAL INTELLIGENCE</small><b>Lumora <em>AI</em></b><span>Research made more insightful.</span></span>
            <span className="hero-work-card-arrow">↗</span>
            <span className="hero-work-card-orb" />
          </a>
          <a className="hero-work-card hero-work-card-letters" href="https://oldletters.vercel.app/" target="_blank" rel="noreferrer">
            <span className="hero-work-card-index">02</span>
            <span className="hero-work-card-copy"><small>DIGITAL EXPERIENCE</small><b>Old—Letters</b><span>Some things are worth waiting for.</span></span>
            <span className="hero-work-card-arrow">↗</span>
            <span className="hero-work-card-orb" />
          </a>
          <a className="hero-work-card hero-work-card-foundarly" href="https://www.foundarlybusinessworld.in/" target="_blank" rel="noreferrer">
            <span className="hero-work-card-index">03</span>
            <span className="hero-work-card-copy"><small>BUSINESS PLATFORM</small><b>Foundarly</b><span>Ideas, people and opportunity.</span></span>
            <span className="hero-work-card-arrow">↗</span>
            <span className="hero-work-card-orb" />
          </a>
          <div className="hero-work-stack-foot"><span>CONCEPT → PRODUCT → LIVE</span><span className="hero-work-pulse">● BUILDING WITH PURPOSE</span></div>
        </motion.aside>   </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
