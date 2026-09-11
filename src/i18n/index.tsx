'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from './en';
import { te } from './te';
import { hi } from './hi';
import { Language, LanguageOption, SUPPORTED_LANGUAGES, TranslationDictionary } from './types';

export * from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  te,
  hi,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === 'en' || saved === 'te' || saved === 'hi')) {
        setLanguageState(saved);
      }
    } catch (e) {
      // Ignore localStorage read errors (e.g. iframe sandbox)
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Ignore localStorage write errors
    }
    // Update document lang attribute smoothly
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const currentDict = dictionaries[language];
      if (currentDict && currentDict[key] !== undefined) {
        return currentDict[key];
      }
      // Fallback to English
      const enDict = dictionaries.en;
      if (enDict && enDict[key] !== undefined) {
        return enDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
