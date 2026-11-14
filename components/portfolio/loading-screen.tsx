'use client';

import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signature } from '@/components/ui/signature';

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

  return (
    <AnimatePresence onExitComplete={() => onComplete?.()}>
      {isVisible && (
        <motion.div
          key="initial-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.012, filter: 'blur(9px)' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#100B18] px-5 text-[#F7EFF8] select-none"
        >
          {/* Warm plum, lavender and blossom-pink light — no blue accents */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[min(82vw,720px)] w-[min(82vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,145,220,0.17)_0%,rgba(190,145,220,0.07)_42%,transparent_72%)] blur-3xl" />
            <div className="absolute -left-28 -top-32 h-80 w-80 rounded-full bg-[#B88ACF]/15 blur-[110px]" />
            <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#E6A9C0]/12 blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.10] [background-image:radial-gradient(rgba(255,235,248,0.6)_0.6px,transparent_0.6px)] [background-size:27px_27px]" />
          </div>

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.65 }}
              className="mb-5 font-mono text-[9px] font-medium uppercase tracking-[0.42em] text-[#D8B4E8] sm:text-[10px]"
            >
              Welcome to my portfolio
            </motion.p>

            {/* Original handwritten signature animation — retained */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="flex w-full items-center justify-center overflow-visible px-1"
            >
              <Signature
                text="Poosala Lokesh"
                fontSize={44}
                duration={1.4}
                color="#E8B8D2"
                fontUrl="/LastoriaBoldRegular.otf"
                onComplete={handleFinish}
                className="h-auto w-auto max-w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="mt-3 flex flex-col items-center gap-2"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D8B4E8]">
                Full Stack Web Developer
              </p>
              <p className="text-[11px] font-light tracking-wide text-[#C8B9C9] sm:text-xs">
                Google Cloud Certified Architect
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'min(210px, 56vw)' }}
              transition={{ delay: 0.8, duration: 0.55 }}
              className="mt-9 h-px overflow-hidden bg-[#453247]"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 2.1, ease: [0.65, 0, 0.35, 1] }}
                className="h-full origin-left bg-gradient-to-r from-[#A77BC2] via-[#D8B4E8] to-[#E8B8D2] shadow-[0_0_14px_rgba(216,180,232,0.65)]"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[#A995AA]"
            >
              Crafting digital experiences
            </motion.p>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.78, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 1.1, duration: 0.35 }}
              onClick={handleFinish}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D8B4E8]/30 bg-[#24182B]/75 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E5F0] backdrop-blur-lg transition-colors hover:border-[#E8B8D2]/65 hover:bg-[#302039]"
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
