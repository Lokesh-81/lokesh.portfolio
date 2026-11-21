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
          className="hero-architecture-board"
          aria-label="How I build full-stack products"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .85, delay: .3, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-architecture-top"><span>FROM IDEA TO LIVE PRODUCT</span><span className="hero-architecture-live"><i /> SYSTEM MAP</span></div>
          <div className="hero-architecture-intro"><span className="hero-architecture-index">01—04</span><div><strong>THE FULL-STACK FLOW</strong><p>How the pieces connect when I build a web application.</p></div></div>
          <div className="hero-architecture-flow">
            <div className="hero-architecture-layer layer-frontend"><span className="architecture-layer-number">01</span><div className="architecture-layer-copy"><small>FRONTEND · WHAT USERS SEE</small><strong>Build the interface</strong><p>React · Next.js · TypeScript · Tailwind</p></div><span className="architecture-layer-symbol">UI</span></div>
            <div className="hero-architecture-connector"><span /></div>
            <div className="hero-architecture-layer layer-backend"><span className="architecture-layer-number">02</span><div className="architecture-layer-copy"><small>BACKEND · APP LOGIC</small><strong>Power the experience</strong><p>Node.js · Express · REST APIs</p></div><span className="architecture-layer-symbol">API</span></div>
            <div className="hero-architecture-connector"><span /></div>
            <div className="hero-architecture-layer layer-data"><span className="architecture-layer-number">03</span><div className="architecture-layer-copy"><small>DATA & AI · THE ENGINE</small><strong>Store, secure and reason</strong><p>MongoDB · Supabase · Firebase · AI APIs</p></div><span className="architecture-layer-symbol">DB</span></div>
            <div className="hero-architecture-connector"><span /></div>
            <div className="hero-architecture-layer layer-ship"><span className="architecture-layer-number">04</span><div className="architecture-layer-copy"><small>DEPLOY · MAKE IT REAL</small><strong>Ship to the world</strong><p>GitHub · Vercel · Google Cloud</p></div><span className="architecture-layer-symbol">↗</span></div>
          </div>
          <div className="hero-architecture-foot"><span>DESIGN → ENGINEER → DEPLOY</span><span>ONE CONNECTED WORKFLOW</span></div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
