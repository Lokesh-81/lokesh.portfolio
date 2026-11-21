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
          className="hero-project-canvas"
          aria-label="Selected projects and product work"
          initial={{ opacity: 0, y: 30, scale: .975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .9, delay: .25, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-canvas-top"><span>SELECTED WORK / 2026</span><span><i /> 3 PRODUCTS SHIPPED</span></div>
          <a className="hero-canvas-feature" href="https://www.lumoraai.in/" target="_blank" rel="noreferrer">
            <div className="hero-canvas-feature-top"><span>01 / FLAGSHIP BUILD</span><span>OPEN PROJECT ↗</span></div>
            <div className="hero-canvas-brand"><span className="hero-canvas-brand-mark">L</span><div><strong>LUMORA<span> AI</span></strong><small>INTELLIGENCE FOR INVESTORS</small></div></div>
            <p className="hero-canvas-description">An AI-powered market research workspace connecting live data with grounded analysis.</p>
            <div className="hero-canvas-interface">
              <div className="hero-canvas-interface-head"><span>MARKET PULSE</span><span className="hero-canvas-live">LIVE DATA</span></div>
              <div className="hero-canvas-interface-grid">
                <div><small>RESEARCH</small><b>Market insights</b><span>Data-led discovery</span></div>
                <div><small>INTELLIGENCE</small><b>AI analysis</b><span>Context, not noise</span></div>
              </div>
              <div className="hero-canvas-signal"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            </div>
            <div className="hero-canvas-tags"><span>Next.js</span><span>AI APIs</span><span>Market data</span><span>Full-stack</span></div>
          </a>
          <div className="hero-canvas-secondary">
            <a href="https://oldletters.vercel.app/" target="_blank" rel="noreferrer"><span className="hero-canvas-secondary-no">02</span><span><b>Old-Letters</b><small>Messages made to arrive later</small></span><span className="hero-canvas-secondary-arrow">↗</span></a>
            <a href="https://www.foundarlybusinessworld.in/" target="_blank" rel="noreferrer"><span className="hero-canvas-secondary-no">03</span><span><b>Foundarly</b><small>Business discovery platform</small></span><span className="hero-canvas-secondary-arrow">↗</span></a>
          </div>
          <div className="hero-canvas-foot"><span>CONCEPT → PRODUCT → DEPLOYMENT</span><span>HYDERABAD, IN</span></div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
