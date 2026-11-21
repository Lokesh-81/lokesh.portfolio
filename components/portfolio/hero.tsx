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
          className="hero-build-panel"
          aria-label="Selected projects and development workflow"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-build-panel-top">
            <span>BUILD LOG / 2026</span><span className="hero-build-live"><i /> ACTIVE</span>
          </div>
          <div className="hero-build-panel-title">From idea to <em>real products.</em></div>
          <div className="hero-build-flow">
            <div className="hero-build-step"><span>01</span><b>DESIGN</b><small>Shape the experience</small></div>
            <div className="hero-build-connector"><i /></div>
            <div className="hero-build-step"><span>02</span><b>ENGINEER</b><small>Build the system</small></div>
            <div className="hero-build-connector"><i /></div>
            <div className="hero-build-step"><span>03</span><b>SHIP</b><small>Put it to work</small></div>
          </div>
          <div className="hero-build-projects">
            <a href="https://www.lumoraai.in/" target="_blank" rel="noreferrer"><span className="hero-project-mark">L</span><span><b>Lumora AI</b><small>AI market research</small></span><ArrowUpRight size={16}/></a>
            <a href="https://oldletters.vercel.app/" target="_blank" rel="noreferrer"><span className="hero-project-mark">O</span><span><b>Old-Letters</b><small>Delayed digital letters</small></span><ArrowUpRight size={16}/></a>
            <a href="https://www.foundarlybusinessworld.in/" target="_blank" rel="noreferrer"><span className="hero-project-mark">F</span><span><b>Foundarly</b><small>Business platform</small></span><ArrowUpRight size={16}/></a>
          </div>
          <div className="hero-build-panel-foot"><span>REACT · TYPESCRIPT · AI</span><span>HYDERABAD / IN</span></div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
