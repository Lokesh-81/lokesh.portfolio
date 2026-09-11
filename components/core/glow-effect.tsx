'use client';

import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlowEffectProps {
  colors?: string[];
  mode?: 'rotate' | 'pulse' | 'breathe' | 'colorShift' | 'flowHorizontal' | 'static';
  blur?: 'soft' | 'medium' | 'strong' | number;
  duration?: number;
  scale?: number;
  className?: string;
}

export function GlowEffect({
  colors = ['#a855f7', '#818cf8', '#c084fc'],
  mode = 'rotate',
  blur = 'soft',
  duration = 4,
  scale = 0.95,
  className,
}: GlowEffectProps) {
  const blurClasses = {
    soft: 'blur-md',
    medium: 'blur-xl',
    strong: 'blur-2xl',
  };

  const blurStyle = typeof blur === 'number' ? { filter: `blur(${blur}px)` } : undefined;
  const blurClass = typeof blur === 'string' ? blurClasses[blur] : '';

  const gradientString = React.useMemo(() => {
    if (colors.length === 1) return colors[0];
    if (colors.length === 2) return `linear-gradient(to right, ${colors.join(', ')})`;
    return `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')}, ${colors[0]})`;
  }, [colors]);

  const animationVariants = {
    rotate: {
      rotate: [0, 360],
      transition: {
        repeat: Infinity,
        duration,
        ease: 'linear',
      } as Transition,
    },
    pulse: {
      opacity: [0.35, 0.75, 0.35],
      scale: [scale * 0.95, scale * 1.05, scale * 0.95],
      transition: {
        repeat: Infinity,
        duration,
        ease: 'easeInOut',
      } as Transition,
    },
    breathe: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        repeat: Infinity,
        duration,
        ease: 'easeInOut',
      } as Transition,
    },
    colorShift: {
      rotate: [0, 180, 360],
      opacity: [0.4, 0.7, 0.4],
      transition: {
        repeat: Infinity,
        duration,
        ease: 'easeInOut',
      } as Transition,
    },
    flowHorizontal: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        repeat: Infinity,
        duration,
        ease: 'easeInOut',
      } as Transition,
    },
    static: {},
  };

  return (
    <div
      className={cn(
        'pointer-events-none absolute -inset-1 z-0 overflow-hidden rounded-[inherit] opacity-60',
        blurClass,
        className
      )}
      style={blurStyle}
      aria-hidden="true"
    >
      <motion.div
        animate={mode !== 'static' ? animationVariants[mode] : undefined}
        style={{
          background: gradientString,
          scale,
        }}
        className="h-full w-full rounded-[inherit] will-change-transform"
      />
    </div>
  );
}
