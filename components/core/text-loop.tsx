'use client';

import React, { useState, useEffect, Children } from 'react';
import { motion, AnimatePresence, type Transition, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextLoopProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
}

const defaultVariants: Variants = {
  initial: {
    y: 20,
    rotateX: 90,
    opacity: 0,
    filter: 'blur(4px)',
  },
  animate: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    y: -20,
    rotateX: -90,
    opacity: 0,
    filter: 'blur(4px)',
  },
};

const defaultTransition: Transition = {
  type: 'spring',
  stiffness: 900,
  damping: 80,
  mass: 10,
};

export function TextLoop({
  children,
  className,
  interval = 2800,
  transition = defaultTransition,
  variants = defaultVariants,
  onIndexChange,
}: TextLoopProps) {
  const items = Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange]);

  if (!items.length) return null;

  return (
    <span
      className={cn('relative inline-flex overflow-hidden py-0.5', className)}
      style={{ perspective: 1000 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          className="inline-block whitespace-nowrap will-change-transform"
        >
          {items[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
