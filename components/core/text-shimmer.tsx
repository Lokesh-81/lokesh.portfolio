'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'span',
  className,
  duration = 1.5,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%] bg-clip-text text-transparent',
        'bg-gradient-to-r from-neutral-400 via-white to-neutral-400',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${spread}`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
