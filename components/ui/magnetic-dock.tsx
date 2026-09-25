'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

export interface DockItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: number | string;
  onClick?: () => void;
  href?: string;
}

export interface MagneticDockProps {
  items: DockItemData[];
  onSelect?: (id: string) => void;
  className?: string;
  maxScale?: number;
  distance?: number;
  baseSize?: number;
}

export function MagneticDock({
  items,
  onSelect,
  className = '',
  maxScale = 1.45,
  distance = 120,
  baseSize = 48,
}: MagneticDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`relative inline-flex items-center gap-2 rounded-full border border-[#1F2937]/90 bg-[#0B132B]/85 px-3 py-2 shadow-[0_16px_45px_rgba(0,0,0,0.65)] backdrop-blur-2xl ${className}`}
    >
      {items.map((item) => (
        <DockIconWrapper
          key={item.id}
          item={item}
          mouseX={mouseX}
          maxScale={maxScale}
          distance={distance}
          baseSize={baseSize}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface DockIconWrapperProps {
  item: DockItemData;
  mouseX: any;
  maxScale: number;
  distance: number;
  baseSize: number;
  onSelect?: (id: string) => void;
}

function DockIconWrapper({
  item,
  mouseX,
  maxScale,
  distance,
  baseSize,
  onSelect,
}: DockIconWrapperProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Compute distance from mouse to center of this icon
  const dist = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    dist,
    [-distance, 0, distance],
    [baseSize, baseSize * maxScale, baseSize]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 170, damping: 12 });

  const handleClick = () => {
    item.onClick?.();
    onSelect?.(item.id);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-10 z-50 whitespace-nowrap rounded-lg border border-[#334155] bg-[#0F172A]/95 px-2.5 py-1 text-[11px] font-medium text-[#E0E7FF] shadow-lg backdrop-blur-md"
          >
            {item.label}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-[#334155]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magnetic Animated Button */}
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        aria-label={item.label}
        className={`group relative flex items-center justify-center rounded-2xl transition-colors cursor-pointer ${
          item.isActive
            ? 'bg-[#2563EB]/25 border border-[#60A5FA]/60 text-[#60A5FA] shadow-[0_0_16px_rgba(96,165,250,0.35)]'
            : 'bg-[#111827]/70 border border-[#1F2937] text-[#94A3B8] hover:border-[#60A5FA]/40 hover:text-[#E0E7FF] hover:bg-[#1E293B]/80'
        }`}
      >
        <div className="flex h-full w-full items-center justify-center p-2.5">
          {item.icon}
        </div>

        {/* Badge indicator */}
        {item.badge !== undefined && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-xs">
            {item.badge}
          </span>
        )}
      </motion.button>

      {/* Active Dot Indicator (macOS style) */}
      <div className="h-1.5 flex items-center justify-center mt-1">
        {item.isActive && (
          <motion.span
            layoutId="active-dock-dot"
            className="h-1.5 w-1.5 rounded-full bg-[#60A5FA] shadow-[0_0_6px_#60A5FA]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Standard Dock Icons requested by Componentry spec
   ========================================================================== */

export function DockIconHome({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function DockIconSearch({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function DockIconFolder({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export function DockIconMail({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function DockIconMusic({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function DockIconSettings({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function DockIconTrash({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

/* Additional icons for portfolio sections */
export function DockIconUser({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function DockIconQuote({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    </svg>
  );
}

export function DockIconAward({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

export function DockIconCpu({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

export function DockIconBriefcase({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

export default MagneticDock;
