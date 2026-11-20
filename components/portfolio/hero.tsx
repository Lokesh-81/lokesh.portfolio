'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Award, FileText, Mail } from 'lucide-react';
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
          className="hero-rebuild-side"
          initial={{ opacity: 0, x: 34, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-architecture" aria-label="Full-stack application architecture diagram">
            <svg viewBox="0 0 520 420" role="img" aria-labelledby="architecture-title">
              <title id="architecture-title">Full-stack application architecture</title>
              <defs><marker id="arch-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#355be5" strokeWidth="1.2"/></marker></defs>
              <g fill="none" stroke="#355be5" strokeWidth="2" markerEnd="url(#arch-arrow)">
                <path d="M260 90 V145 M260 195 V245 M150 170 H95 V245 M370 170 H425 V245 M150 270 H95 V330 M370 270 H425 V330"/>
              </g>
              <g stroke="#171719" strokeWidth="2">
                <rect x="172" y="28" width="176" height="62" rx="7" fill="#ffe17a"/>
                <rect x="172" y="145" width="176" height="52" rx="7" fill="#b8f0cd"/>
                <rect x="24" y="245" width="142" height="54" rx="7" fill="#cdbcf6"/>
                <rect x="189" y="245" width="142" height="54" rx="7" fill="#b9e3f8"/>
                <rect x="354" y="245" width="142" height="54" rx="7" fill="#fae1e8"/>
                <rect x="24" y="330" width="142" height="54" rx="7" fill="#fffdf5"/>
                <rect x="189" y="330" width="142" height="54" rx="7" fill="#fffdf5"/>
                <rect x="354" y="330" width="142" height="54" rx="7" fill="#fffdf5"/>
              </g>
              <g fill="#171719" fontFamily="Inter, sans-serif" textAnchor="middle">
                <text x="260" y="54" fontSize="13" fontWeight="800">PRODUCT UI</text><text x="260" y="72" fontSize="10">React · Next.js</text>
                <text x="260" y="176" fontSize="13" fontWeight="800">APPLICATION LAYER</text>
                <text x="95" y="268" fontSize="12" fontWeight="800">API SERVICES</text><text x="95" y="285" fontSize="9">Node · REST</text>
                <text x="260" y="268" fontSize="12" fontWeight="800">DATA LAYER</text><text x="260" y="285" fontSize="9">SQL · NoSQL</text>
                <text x="425" y="268" fontSize="12" fontWeight="800">AI INTEGRATION</text><text x="425" y="285" fontSize="9">LLM · APIs</text>
                <text x="95" y="362" fontSize="11" fontWeight="700">AUTH · SECURITY</text>
                <text x="260" y="362" fontSize="11" fontWeight="700">CLOUD · DEPLOY</text>
                <text x="425" y="362" fontSize="11" fontWeight="700">TEST · SHIP</text>
              </g>
              <g fill="#a94f70"><circle cx="260" cy="118" r="4"/><circle cx="150" cy="170" r="4"/><circle cx="370" cy="170" r="4"/></g>
            </svg>
            <div className="hero-architecture-caption"><span>01 — 08</span><span>FULL-STACK SYSTEM MAP</span></div>
          </div>
          <div className="hero-side-caption">
            <span className="hero-side-index">01 — 08</span>
            <span className="hero-side-rule" />
            <span>PERSONAL PORTFOLIO</span>
          </div>
          {hero?.showAvailability !== false && (
            <button type="button" className="hero-credential" onClick={() => onNavigate?.(hero?.featuredCredentialLink || 'certifications')}>
              <Award size={15} />
              <span><b>{hero?.featuredCredentialTitle || 'Google Cloud Certified Professional Cloud Architect'}</b><small>{hero?.featuredCredentialDate || 'Sep 2026'}</small></span>
              <ArrowUpRight size={15} />
            </button>
          )}
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
