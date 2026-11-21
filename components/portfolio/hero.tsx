'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Award, FileText, Mail } from 'lucide-react';
import { certifications, skillBadges } from '@/lib/data/certifications';
import { CardSwap } from '@/components/portfolio/card-swap';
import { projects as fallbackProjects, type Project } from '@/lib/data/projects';
import { useLanguage } from '@/i18n';
import { usePortfolio } from '@/lib/portfolio-context';
import { ResumeModal } from '@/components/portfolio/resume-modal';

export interface HeroProps {
  onNavigate?: (section: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t } = useLanguage();
  const { hero, profile, projects: contextProjects } = usePortfolio();
  const heroProjects: Project[] = contextProjects?.length ? contextProjects as Project[] : fallbackProjects;
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const greeting = t('hero.greeting', hero?.greeting || "Hello, I'm");
  const name = t('hero.name', hero?.name || profile?.displayName || 'P. Lokesh');
  const role = t('hero.imA', hero?.imA || "I'm a");
  const bio = t('hero.bio', hero?.bio || profile?.shortBio || '');
  const workLabel = t('hero.ctaWork', hero?.ctaWork || 'Explore selected work');
  const contactLabel = t('hero.ctaContact', hero?.ctaContact || "Let's talk");
  const primaryCredential = certifications[0];
  const ambassadorCredential = certifications.find((item) => item.id === 'google-student-ambassador-2026');

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
          <div className="hero-selected-work">
            <CardSwap projects={heroProjects.slice(0, 4)} />
          </div>
          <motion.div variants={entrance} className="hero-rebuild-bottomline">
            <span>DESIGNING · BUILDING · ITERATING</span>
            <button type="button" onClick={() => onNavigate?.('about')}>SCROLL TO EXPLORE <ArrowDownRight size={15} /></button>
          </motion.div>
        </motion.div>

        <motion.aside
          className="hero-credentials-panel"
          aria-label="Professional credentials"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .85, delay: .3, ease: [0.2, 0.75, 0.25, 1] }}
        >
          <div className="hero-credentials-top">
            <span><Award size={14} /> PROFESSIONAL CREDENTIALS</span>
            <span className="hero-credentials-count">{skillBadges.length} GOOGLE CLOUD BADGES</span>
          </div>
          <div className="hero-credentials-feature">
            <div className="hero-credentials-mark">G</div>
            <div className="hero-credentials-main">
              <span className="hero-credentials-issuer">{primaryCredential.issuer} · PROFESSIONAL CERTIFICATION</span>
              <h2>{primaryCredential.badgeTitle || 'Professional Cloud Architect'}</h2>
              <p>Enterprise cloud architecture, security, scalability and reliability.</p>
              <div className="hero-credentials-meta">
                <span className="hero-credentials-active"><i /> ACTIVE CREDENTIAL</span>
                <span>{primaryCredential.issueDate} — {primaryCredential.expirationDate}</span>
              </div>
              <a href={primaryCredential.verificationUrl} target="_blank" rel="noreferrer">
                Verify credential <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          {ambassadorCredential && (
            <div className="hero-credentials-secondary">
              <span className="hero-credentials-secondary-mark">G</span>
              <span><small>RECOGNITION</small><strong>Google Student Ambassador</strong><em>Semester 1 · 2026</em></span>
              <Award size={17} />
            </div>
          )}
          <div className="hero-credentials-foot">
            <span>LEARN · CERTIFY · BUILD</span>
            <span>VERIFIED LEARNING</span>
          </div>
        </motion.aside>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  );
}
