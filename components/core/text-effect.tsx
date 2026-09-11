'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextEffectProps {
  key?: React.Key;
  children: string;
  per?: 'char' | 'word' | 'line';
  as?: React.ElementType;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  delay?: number;
  onAnimationComplete?: () => void;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
    y: 16,
    rotateX: 45,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.45,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

export function TextEffect({
  children,
  per = 'word',
  as: Component = 'span',
  variants,
  className,
  delay = 0,
  onAnimationComplete,
}: TextEffectProps) {
  const containerVariants: Variants = variants?.container
    ? {
        ...variants.container,
        visible: {
          ...variants.container.visible,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.035,
            ...(variants.container.visible as any)?.transition,
          },
        },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: per === 'char' ? 0.035 : 0.08,
          },
        },
      };

  const itemVariants: Variants = variants?.item || defaultItemVariants;

  const segments = React.useMemo(() => {
    if (per === 'line') {
      return children.split('\n');
    }
    if (per === 'word') {
      return children.split(/(\s+)/);
    }
    // per === 'char'
    // Split into characters, keeping spaces identifiable
    return children.split('');
  }, [children, per]);

  const MotionComponent = motion[Component as keyof typeof motion] || motion.span;

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn('inline-block', className)}
      onAnimationComplete={onAnimationComplete}
      style={{ perspective: 1000 }}
    >
      {segments.map((segment, index) => {
        if (per === 'char' && segment === ' ') {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }

        if (per === 'word' && /^\s+$/.test(segment)) {
          return (
            <span key={index} className="inline-block">
              &nbsp;
            </span>
          );
        }

        return (
          <motion.span
            key={index}
            variants={itemVariants}
            className="inline-block will-change-transform"
          >
            {segment}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}
