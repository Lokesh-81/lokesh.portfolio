'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/i18n';

export interface PortfolioDockProps { activeSection?: string; onSelectSection?: (sectionId: string) => void; }

const links = [
  ['about', 'ABOUT'], ['work', 'WORK'], ['skills', 'EXPERTISE'],
  ['experience', 'EXPERIENCE'], ['contact', 'CONTACT'],
];

export function PortfolioDock({ activeSection = 'home', onSelectSection }: PortfolioDockProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <header className="editorial-nav fixed inset-x-0 top-0 z-50 px-5 py-4 sm:px-10 lg:px-16">
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between" aria-label="Main navigation">
        <button className="editorial-wordmark" onClick={() => onSelectSection?.('home')} aria-label="Go to home">P. LOKESH<span>®</span></button>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([id, label]) => <button key={id} onClick={() => onSelectSection?.(id)} className={`editorial-nav-link ${activeSection === id ? 'is-active' : ''}`}>{label}</button>)}
        </div>
        <div className="relative" ref={langRef}>
          <button className="editorial-language" onClick={() => setIsLangOpen(!isLangOpen)} aria-label="Choose language"><Languages size={15}/><span>{language.toUpperCase()}</span><ChevronDown size={12}/></button>
          <AnimatePresence>
            {isLangOpen && <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:5}} className="editorial-language-menu">
              {supportedLanguages.map((item) => <button key={item.code} onClick={() => {setLanguage(item.code);setIsLangOpen(false);}}><span>{item.label} <small>{item.englishName}</small></span>{language === item.code && <Check size={14}/>}</button>)}
            </motion.div>}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
export default PortfolioDock;
