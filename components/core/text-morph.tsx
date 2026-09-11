'use client';

import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextMorphProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function TextMorph({
  children,
  as: Component = 'span',
  className,
  style,
}: TextMorphProps) {
  const uniqueId = useId();

  // Create character map with unique keys based on character and count
  const characters = React.useMemo(() => {
    const charCounts: Record<string, number> = {};
    return children.split('').map((char, index) => {
      const count = (charCounts[char] || 0) + 1;
      charCounts[char] = count;
      return {
        id: `${uniqueId}-${char}-${count}`,
        label: char,
        index,
      };
    });
  }, [children, uniqueId]);

  const MotionComponent = motion[Component as keyof typeof motion] || motion.span;

  return (
    <MotionComponent
      className={cn('inline-flex items-center', className)}
      style={style}
      aria-label={children}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {characters.map((char) => (
          <motion.span
            key={char.id}
            layoutId={char.id}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(2px)' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="inline-block whitespace-pre will-change-transform"
          >
            {char.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  );
}
