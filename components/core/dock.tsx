'use client';

import React, { createContext, useContext, useRef, useState, useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface DockContextType {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
}

const DockContext = createContext<DockContextType | null>(null);

export interface DockProps {
  className?: string;
  children: React.ReactNode;
  magnification?: number;
  distance?: number;
  direction?: 'top' | 'middle' | 'bottom';
}

const DEFAULT_MAGNIFICATION = 56;
const DEFAULT_DISTANCE = 140;

export function Dock({
  className,
  children,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  direction = 'bottom',
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const containerRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo(
    () => ({
      mouseX,
      magnification,
      distance,
    }),
    [mouseX, magnification, distance]
  );

  return (
    <DockContext.Provider value={contextValue}>
      <motion.div
        ref={containerRef}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'flex h-16 w-max items-end gap-3 rounded-full border border-zinc-200/60 bg-white/80 px-3 pb-2.5 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80',
          direction === 'top' && 'items-start pt-2.5',
          direction === 'middle' && 'items-center',
          direction === 'bottom' && 'items-end pb-2.5',
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export interface DockItemProps {
  key?: React.Key;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  spring?: SpringOptions;
}

export function DockItem({
  className,
  children,
  onClick,
  spring = { mass: 0.1, stiffness: 160, damping: 13 },
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<{ x: number; width: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dockContext = useContext(DockContext);
  const fallbackMouseX = useMotionValue(Infinity);

  const mouseX = dockContext?.mouseX ?? fallbackMouseX;
  const magnification = dockContext?.magnification ?? DEFAULT_MAGNIFICATION;
  const distance = dockContext?.distance ?? DEFAULT_DISTANCE;

  const measure = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      bounds.current = { x: rect.x, width: rect.width };
    }
  };

  React.useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    if (!bounds.current && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      bounds.current = { x: rect.x, width: rect.width };
    }
    const b = bounds.current;
    if (!b || val === Infinity) return distance;
    return val - (b.x + b.width / 2);
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthSync, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      onMouseEnter={() => {
        measure();
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'relative flex aspect-square cursor-pointer items-center justify-center rounded-full will-change-[width,height,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
    >
      <DockHoverContext.Provider value={{ isHovered }}>
        {children}
      </DockHoverContext.Provider>
    </motion.div>
  );
}

const DockHoverContext = createContext<{ isHovered: boolean }>({ isHovered: false });

export function DockIcon({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center p-2 text-zinc-700 transition-colors dark:text-zinc-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DockLabel({
  className,
  position = 'bottom',
  children,
}: {
  className?: string;
  position?: 'top' | 'bottom';
  children: React.ReactNode;
}) {
  const { isHovered } = useContext(DockHoverContext);

  const isTop = position === 'top';

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: isTop ? 8 : -8, scale: 0.85 }}
          animate={{ opacity: 1, y: isTop ? -4 : 4, scale: 1 }}
          exit={{ opacity: 0, y: isTop ? 6 : -6, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white/95 px-2 py-0.5 text-[11px] font-medium tracking-tight text-zinc-900 shadow-md backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-100',
            isTop ? '-top-8' : 'top-full mt-2',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
