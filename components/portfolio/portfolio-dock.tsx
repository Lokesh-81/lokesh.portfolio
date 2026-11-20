'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/i18n';

export interface PortfolioDockProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Recognition' },
  { id: 'testimonials', label: 'Kind words' },
];

export function PortfolioDock({ activeSection = 'home', onSelectSection }: PortfolioDockProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const navigate = (id: string) => {
    onSelectSection?.(id);
    setIsMobileOpen(false);
  };

  return (
    <nav aria-label="Main Navigation" className="portfolio-nav">
      <button className="portfolio-wordmark" onClick={() => navigate('home')} aria-label="Go to homepage">
        <span className="portfolio-monogram">PL</span>
        <span><strong>POOSALA LOKESH</strong><small>FULL-STACK DEVELOPER</small></span>
      </button>
      <div className="portfolio-nav-links">
        {navItems.map((item) => (
          <button key={item.id} type="button" onClick={() => navigate(item.id)} className={activeSection === item.id ? 'active' : ''}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => navigate('contact')} className={`portfolio-nav-contact ${activeSection === 'contact' ? 'active' : ''}`}>Contact <span>↗</span></button>
      </div>
      <div className="portfolio-nav-actions" ref={langRef}>
        <button type="button" className="portfolio-language-button" onClick={() => setIsLangOpen((v) => !v)} aria-label="Choose language" aria-expanded={isLangOpen}>
          <Languages size={15} /><span>{language.toUpperCase()}</span><ChevronDown size={13} />
        </button>
        <AnimatePresence>
          {isLangOpen && (
            <motion.div className="portfolio-language-menu" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: .16 }}>
              {supportedLanguages.map((item) => (
                <button type="button" key={item.code} onClick={() => { setLanguage(item.code); setIsLangOpen(false); }}>
                  <span>{item.label} <small>{item.englishName}</small></span>{language === item.code && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button className="portfolio-mobile-toggle" type="button" onClick={() => setIsMobileOpen((v) => !v)} aria-label="Toggle navigation">{isMobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div className="portfolio-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {[{ id: 'home', label: 'Home' }, ...navItems, { id: 'contact', label: 'Contact' }].map((item) => (
              <button key={item.id} type="button" onClick={() => navigate(item.id)} className={activeSection === item.id ? 'active' : ''}>{item.label}<span>↗</span></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default PortfolioDock;
