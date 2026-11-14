'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hasFinished = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setIsVisible(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(handleFinish, 2800);
    return () => window.clearTimeout(timer);
  }, [handleFinish]);

  return (
    <AnimatePresence onExitComplete={() => onComplete?.()}>
      {isVisible && (
        <motion.div
          key="initial-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0B132B] px-5 text-[#EAF0FF] select-none"
        >
          {/* Moonlit colour field, matched to the portfolio's blossom background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[min(78vw,680px)] w-[min(78vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,160,255,0.16)_0%,rgba(207,160,255,0.055)_42%,transparent_72%)] blur-2xl" />
            <div className="absolute -left-28 -top-32 h-72 w-72 rounded-full bg-[#CFA0FF]/10 blur-[100px]" />
            <div className="absolute -bottom-36 -right-24 h-80 w-80 rounded-full bg-[#E8B8D2]/10 blur-[110px]" />
            <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(234,240,255,0.55)_0.6px,transparent_0.6px)] [background-size:26px_26px]" />
          </div>

          <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-8 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-[#CFA0FF]/30 bg-[#17213D]/75 shadow-[0_0_55px_rgba(207,160,255,0.16)] backdrop-blur-xl"
            >
              <span className="bg-gradient-to-br from-[#F5E8FF] via-[#CFA0FF] to-[#E8B8D2] bg-clip-text text-2xl font-semibold tracking-[-0.08em] text-transparent">
                PL
              </span>
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0B132B] bg-[#E8B8D2] shadow-[0_0_14px_rgba(232,184,210,0.8)]" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.42em] text-[#CFA0FF]"
            >
              Welcome to my portfolio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.28, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.1rem,7vw,4.4rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-[#F3F0FF]"
            >
              Poosala <span className="bg-gradient-to-r from-[#CFA0FF] via-[#E8C8E8] to-[#E8B8D2] bg-clip-text text-transparent">Lokesh</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.6 }}
              className="mt-4 text-xs font-medium tracking-[0.16em] text-[#AAB6D3] sm:text-sm"
            >
              FULL STACK WEB DEVELOPER
            </motion.p>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'min(220px, 58vw)' }}
              transition={{ delay: 0.65, duration: 0.55 }}
              className="mt-9 h-px overflow-hidden bg-[#33415F]"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1.65, ease: [0.65, 0, 0.35, 1] }}
                className="h-full origin-left bg-gradient-to-r from-[#A98AE8] via-[#CFA0FF] to-[#E8B8D2] shadow-[0_0_12px_rgba(207,160,255,0.75)]"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#7180A2]"
            >
              Crafting digital experiences
            </motion.p>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.72, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 1, duration: 0.35 }}
              onClick={handleFinish}
              className="mt-9 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#CFA0FF]/25 bg-[#17213D]/65 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#E5DDF7] backdrop-blur-lg transition-colors hover:border-[#CFA0FF]/60 hover:bg-[#202B4A]"
            >
              Enter portfolio
              <span className="text-[#E8B8D2]">↗</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
