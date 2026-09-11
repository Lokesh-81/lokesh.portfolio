'use client';

import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: Transition;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
}

export function BorderTrail({
  className,
  size = 100,
  transition = {
    ease: 'linear',
    duration: 3,
    repeat: Infinity,
  },
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.div
        className={cn(
          'absolute aspect-square bg-gradient-to-l from-emerald-400 via-emerald-500 to-teal-300 blur-[1px]',
          className
        )}
        style={
          {
            width: `${size}px`,
            offsetPath: 'rect(0 auto auto 0 round inherit)',
            ...style,
          } as React.CSSProperties
        }
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={transition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
