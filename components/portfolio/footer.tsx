'use client';

import React from 'react';
import { ArrowUp, Heart, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200/80 bg-white/50 px-6 py-12 text-xs text-zinc-500 backdrop-blur-md dark:border-zinc-900/80 dark:bg-black/50 dark:text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2 font-mono text-zinc-800 dark:text-zinc-200">
            <span className="font-semibold tracking-wider">P. LOKESH</span>
            <span>·</span>
            <span>HYDERABAD, INDIA</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            © {new Date().getFullYear()} P. Lokesh. Engineered with craft, motion, and precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-600 dark:text-zinc-400">
            <a
              href="https://github.com/Lokesh-81"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              GitHub (Lokesh-81)
            </a>
            <a
              href="https://github.com/lokeshnaivaidya-max"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              GitHub (naivaidya-max)
            </a>
            <a
              href="https://www.linkedin.com/in/poosala-lokesh/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#contact"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Contact
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 shadow-sm transition-all hover:border-purple-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-purple-500 dark:hover:text-white"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
