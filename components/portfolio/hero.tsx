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
  const bio = t('hero.bio', hero?.bio || '');
  const workLabel = t('hero.ctaWork', hero?.ctaWork || 'Explore selected work');
  const contactLabel = t('hero.ctaContact', hero?.ctaContact || "Let's talk");

  const reveal = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.2, 0.75, 0.25, 1] } },
  };

  return (
    <>
      <div className="hero-rebuild hero-editorial-v2">
        <motion.div
          className="hero-rebuild-copy hero-editorial-copy"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.16 } } }}
        >
          <motion.div variants={reveal} className="hero-rebuild-eyebrow">
            <span className="hero-editorial-index">PORTFOLIO / 2026</span>
            <span className="hero-editorial-location">HYDERABAD, INDIA</span>
          </motion.div>

          <motion.p variants={reveal} className="hero-rebuild-greeting">{greeting}</motion.p>
          <motion.h1 variants={reveal} className="hero-rebuild-name">
            {name.replace(/[.]+$/, '')}<span className="hero-rebuild-period">.</span>
          </motion.h1>

          <motion.div variants={reveal} className="hero-rebuild-role">
            <span>{role}</span>
            <strong>{profile?.title || 'Full Stack Web Developer'}</strong>
          </motion.div>

          {bio && <motion.p variants={reveal} className="hero-rebuild-bio">{bio}</motion.p>}

          <motion.div variants={reveal} className="hero-rebuild-actions">
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

          <motion.button variants={reveal} type="button" className="hero-editorial-scroll" onClick={() => onNavigate?.('about')}>
            SCROLL TO EXPLORE <ArrowDownRight size={15} />
          </motion.button>
        </motion.div>

        <motion.aside
          className="hero-editorial-work"
          aria-label="Selected projects"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-editorial-work-head">
            <span>SELECTED WORK</span>
            <span>01 — 03</span>
          </div>
          <a className="hero-editorial-feature" href="https://www.lumoraai.in/" target="_blank" rel="noreferrer">
            <div className="hero-editorial-feature-meta"><span>01 / FEATURED PROJECT</span><ArrowUpRight size={17} /></div>
            <div className="hero-editorial-feature-title">Lumora <em>AI</em></div>
            <p>AI-powered investment research, bringing live market data and contextual analysis into one workspace.</p>
            <div className="hero-editorial-feature-tags"><span>Next.js</span><span>AI integration</span><span>Market data</span></div>
          </a>
          <div className="hero-editorial-project-list">
            <a href="https://oldletters.vercel.app/" target="_blank" rel="noreferrer">
              <span className="hero-editorial-project-number">02</span>
              <span className="hero-editorial-project-copy"><strong>Old-Letters</strong><small>Digital letters, delivered in time</small></span>
              <ArrowUpRight size={16} />
            </a>
            <a href="https://www.foundarlybusinessworld.in/" target="_blank" rel="noreferrer">
              <span className="hero-editorial-project-number">03</span>
              <span className="hero-editorial-project-copy"><strong>Foundarly</strong><small>A platform for business discovery</small></span>
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-editorial-work-foot"><span>IDEA TO DEPLOYMENT</span><span>FULL-STACK DEVELOPMENT</span></div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
