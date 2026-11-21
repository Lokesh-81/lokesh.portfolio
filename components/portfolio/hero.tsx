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
          className="hero-product-stage"
          aria-label="Animated preview of a digital product interface"
          initial={{ opacity: 0, y: 34, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-product-orbit hero-product-orbit-a" />
          <div className="hero-product-orbit hero-product-orbit-b" />
          <div className="hero-product-window">
            <div className="hero-window-bar">
              <span className="hero-window-dots"><i /><i /><i /></span>
              <span>LOKESH / DIGITAL STUDIO</span>
              <span className="hero-window-live">LIVE PREVIEW</span>
            </div>
            <div className="hero-window-content">
              <div className="hero-window-sidebar"><b>PL.</b><i /><i /><i /><i /><span /></div>
              <div className="hero-window-main">
                <div className="hero-window-overline">PRODUCT ENGINEERING / 2026</div>
                <div className="hero-window-heading">Ideas into<br /><em>interfaces.</em></div>
                <div className="hero-window-subline">Design systems · Full-stack · AI</div>
                <div className="hero-window-chart">
                  <div className="hero-chart-label"><span>BUILD PROGRESS</span><b>SHIP / 100%</b></div>
                  <svg viewBox="0 0 420 110" role="img" aria-label="Animated product progress graph">
                    <path className="hero-chart-grid" d="M0 25H420 M0 55H420 M0 85H420" />
                    <path className="hero-chart-line" d="M0 91 C38 88 48 70 82 75 S132 52 164 61 S215 29 250 44 S310 16 340 27 S390 8 420 12" />
                    <path className="hero-chart-area" d="M0 91 C38 88 48 70 82 75 S132 52 164 61 S215 29 250 44 S310 16 340 27 S390 8 420 12 L420 110 L0 110Z" />
                  </svg>
                </div>
                <div className="hero-window-tags"><span>REACT</span><span>TYPESCRIPT</span><span>AI SYSTEMS</span></div>
              </div>
            </div>
          </div>
          <div className="hero-float-card hero-float-card-top"><span className="hero-float-icon">✳</span><span><b>Thoughtful UI</b><small>Every detail has a reason</small></span></div>
          <div className="hero-float-card hero-float-card-bottom"><span className="hero-float-check">✓</span><span><b>Deployed</b><small>From concept to production</small></span><i className="hero-float-pulse" /></div>
        </motion.aside>     </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
