'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

export interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  duration = 35,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn('group relative flex overflow-hidden select-none', className)}
      style={
        {
          '--gap': `${gap}px`,
          '--duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'flex min-w-full shrink-0 items-center justify-around',
          reverse ? 'animate-infinite-slider-reverse' : 'animate-infinite-slider'
        )}
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>
      <div
        className={cn(
          'flex min-w-full shrink-0 items-center justify-around',
          reverse ? 'animate-infinite-slider-reverse' : 'animate-infinite-slider'
        )}
        style={{ gap: `${gap}px` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}
