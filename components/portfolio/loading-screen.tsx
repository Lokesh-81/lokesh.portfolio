'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Signature } from '@/components/ui/signature';

export interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="initial-loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070D1E] text-[#E0E7FF] select-none"
        >
          {/* Subtle Ambient Background Radial Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18)_0%,rgba(167,139,250,0.08)_50%,transparent_75%)] blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            {/* The opentype SVG Signature Component */}
            <div className="scale-90 sm:scale-100 md:scale-110 transition-transform">
              <Signature
                text="Poosala Lokesh"
                fontSize={42}
                duration={1.5}
                color="#60A5FA"
                fontUrl="/LastoriaBoldRegular.otf"
                onComplete={handleFinish}
              />
            </div>

            {/* Subtitle Fade In */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 flex flex-col items-center gap-1.5"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#60A5FA] font-mono">
                Poosala Lokesh
              </p>
              <p className="text-[11px] text-[#94A3B8] font-light">
                Full Stack Developer · Google Cloud Certified Architect
              </p>
            </motion.div>

            {/* Quick Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              onClick={handleFinish}
              className="mt-8 text-[11px] font-mono text-[#64748B] hover:text-[#93C5FD] transition-colors cursor-pointer px-3 py-1 rounded-full border border-[#1F2937]/60 hover:border-[#60A5FA]/40"
            >
              Skip Intro →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
