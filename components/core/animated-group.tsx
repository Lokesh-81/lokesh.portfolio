'use client';

import React, { Children, isValidElement } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedGroupProps {
  key?: React.Key;
  children: React.ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  as?: React.ElementType;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(12px)',
    y: -60,
    rotateX: 90,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 1,
    },
  },
};

export function AnimatedGroup({
  children,
  className,
  variants,
  as: Component = 'div',
}: AnimatedGroupProps) {
  const containerVariants: Variants = {
    hidden: { ...defaultContainerVariants.hidden, ...variants?.container?.hidden },
    visible: {
      ...defaultContainerVariants.visible,
      ...variants?.container?.visible,
      transition: {
        ...(defaultContainerVariants.visible as any)?.transition,
        ...(variants?.container?.visible as any)?.transition,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { ...defaultItemVariants.hidden, ...variants?.item?.hidden },
    visible: {
      ...defaultItemVariants.visible,
      ...variants?.item?.visible,
      transition: {
        ...(defaultItemVariants.visible as any)?.transition,
        ...(variants?.item?.visible as any)?.transition,
      },
    },
  };

  const MotionComponent = motion(Component as any);

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className={cn(className)}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return (
          <motion.div variants={itemVariants} className="h-full w-full">
            {child}
          </motion.div>
        );
      })}
    </MotionComponent>
  );
}
