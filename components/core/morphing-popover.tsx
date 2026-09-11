'use client';

import React, { createContext, useContext, useState, useId, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MorphingPopoverContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
}

const MorphingPopoverContext = createContext<MorphingPopoverContextType | null>(null);

export function useMorphingPopover() {
  const context = useContext(MorphingPopoverContext);
  if (!context) {
    throw new Error('useMorphingPopover must be used within a MorphingPopover');
  }
  return context;
}

export interface MorphingPopoverProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MorphingPopover({
  children,
  className,
  open: controlledOpen,
  onOpenChange,
}: MorphingPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const uniqueId = useId();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <MorphingPopoverContext.Provider value={{ isOpen, setIsOpen, uniqueId }}>
      <div className={cn('relative inline-block', className)}>{children}</div>
    </MorphingPopoverContext.Provider>
  );
}

export interface MorphingPopoverTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function MorphingPopoverTrigger({
  children,
  className,
}: MorphingPopoverTriggerProps) {
  const { isOpen, setIsOpen, uniqueId } = useMorphingPopover();

  if (isOpen) {
    return null;
  }

  return (
    <motion.div
      layoutId={`popover-container-${uniqueId}`}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
      onClick={() => setIsOpen(true)}
      className={cn('inline-block cursor-pointer', className)}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingPopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MorphingPopoverContent({
  children,
  className,
}: MorphingPopoverContentProps) {
  const { isOpen, setIsOpen, uniqueId } = useMorphingPopover();
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on Escape or Outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Morphing Modal Content */}
          <motion.div
            ref={contentRef}
            layoutId={`popover-container-${uniqueId}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
            }}
            className={cn(
              'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950',
              className
            )}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              aria-label="Close popover"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
