'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence, type SpringOptions } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CursorProps {
  children: React.ReactNode;
  className?: string;
  springConfig?: SpringOptions;
  attachToParent?: boolean;
  variants?: any;
  transition?: any;
}

export function Cursor({
  children,
  className,
  springConfig = { stiffness: 450, damping: 30, mass: 0.5 },
  attachToParent = false,
  variants,
  transition,
}: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if pointer is fine (desktop mouse) vs coarse (mobile/touch)
    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    setIsFinePointer(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    if (attachToParent && cursorRef.current?.parentElement) {
      const parent = cursorRef.current.parentElement;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        setIsVisible(true);
      };

      const handleMouseEnter = () => {
        setIsVisible(true);
      };
      const handleMouseLeave = () => {
        setIsVisible(false);
      };

      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      };
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isFinePointer, attachToParent, mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <div ref={cursorRef} className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            variants={variants}
            initial={variants ? 'initial' : { opacity: 0, scale: 0.8 }}
            animate={variants ? 'animate' : { opacity: 1, scale: 1 }}
            exit={variants ? 'exit' : { opacity: 0, scale: 0.8 }}
            transition={transition ?? { duration: 0.2 }}
            className={cn('pointer-events-none fixed top-0 left-0 will-change-transform', className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
