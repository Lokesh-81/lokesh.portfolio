'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface SignatureProps {
  text?: string;
  fontSize?: number;
  duration?: number;
  color?: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function Signature({
  text = 'Lokesh',
  fontSize = 64,
  duration = 1.5,
  color = '#60A5FA',
  delay = 0.2,
  className = '',
  onComplete,
}: SignatureProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompleted(true);
      onComplete?.();
    }, (delay + duration) * 1000 + 400);

    return () => clearTimeout(timer);
  }, [delay, duration, onComplete]);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ minWidth: fontSize * 4.5 }}
    >
      {/* Container with relative positioning for pen sweep reveal */}
      <div className="relative inline-block overflow-hidden px-4 py-2">
        {/* Animated handwriting text using luxury script typography */}
        <motion.div
          initial={{ clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.2 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          transition={{
            clipPath: { duration, ease: [0.25, 1, 0.5, 1], delay },
            opacity: { duration: 0.2, delay },
          }}
          className="relative whitespace-nowrap"
          style={{
            fontFamily: "'Alex Brush', 'Instrument Serif', cursive, Georgia, serif",
            fontSize: `${fontSize}px`,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
          }}
        >
          <span className="bg-gradient-to-r from-sky-200 via-[#60A5FA] to-indigo-300 bg-clip-text text-transparent font-normal drop-shadow-[0_2px_18px_rgba(96,165,250,0.55)]">
            {text}
          </span>
        </motion.div>

        {/* Animated pen sparkle/ink point tracking along the writing stroke */}
        <motion.div
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
          transition={{
            left: { duration, ease: [0.25, 1, 0.5, 1], delay },
            opacity: { times: [0, 0.1, 0.88, 1], duration, delay },
          }}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{ width: 14, height: 14 }}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_12px_#60A5FA,0_0_24px_#38BDF8]" />
        </motion.div>
      </div>

      {/* Elegant cursive underline flourish drawing underneath */}
      <div className="relative -mt-2 w-full max-w-[280px] h-6 flex justify-center">
        <svg
          viewBox="0 0 280 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="signature-flourish-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="60%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 12 14 C 60 16 140 18 245 10 C 265 8 274 13 268 17 C 255 24 175 22 90 20"
            stroke="url(#signature-flourish-gradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{
              pathLength: { duration: duration * 0.45, ease: [0.22, 1, 0.36, 1], delay: delay + duration * 0.55 },
              opacity: { duration: 0.2, delay: delay + duration * 0.55 },
            }}
          />
          {/* Subtle end accent dot */}
          <motion.circle
            cx="270"
            cy="11"
            r="2"
            fill="#93C5FD"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: delay + duration * 0.9 }}
          />
        </svg>
      </div>
    </div>
  );
}

export default Signature;
