'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export interface OrbitStackItem {
  name: string;
  role: string;
  description: string;
  initials?: string;
  stat?: string;
  accent?: string;
  image?: string;
  id?: string;
  company?: string;
  projectUrl?: string;
  rating?: number;
}

export interface OrbitCardStackProps {
  items: OrbitStackItem[];
  defaultActiveIndex?: number;
  spread?: number;
  lift?: number;
  onActiveChange?: (item: OrbitStackItem) => void;
  className?: string;
}

export function OrbitCardStack({
  items,
  defaultActiveIndex = 0,
  spread = 150,
  lift = 40,
  onActiveChange,
  className = '',
}: OrbitCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(0, defaultActiveIndex), items.length - 1)
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    if (items[idx]) {
      onActiveChange?.(items[idx]);
    }
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + items.length) % items.length;
    handleSelect(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % items.length;
    handleSelect(nextIdx);
  };

  // Adjust spread for mobile to prevent overflow
  const effectiveSpread = isMobile ? Math.min(spread * 0.45, 60) : spread;

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Orbit Stage */}
      <div
        className="relative flex h-[500px] sm:h-[540px] w-full items-center justify-center overflow-visible"
        style={{ perspective: 1200 }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, idx) => {
            const offset = idx - activeIndex;
            const isActive = idx === activeIndex;
            const accentColor = item.accent || '#60A5FA';

            return (
              <motion.div
                key={item.id || item.name || idx}
                onClick={() => handleSelect(idx)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: offset * effectiveSpread,
                  y: isActive ? -lift : 0,
                  z: isActive ? 60 : -Math.abs(offset) * 40,
                  scale: isActive ? 1 : Math.max(0.88, 1 - Math.abs(offset) * 0.06),
                  rotateZ: offset * 3,
                  rotateY: offset * -4,
                  opacity: Math.max(0.4, 1 - Math.abs(offset) * 0.22),
                  zIndex: 20 - Math.abs(offset),
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 26,
                  mass: 0.8,
                }}
                whileHover={
                  !isActive
                    ? {
                        scale: 0.94,
                        opacity: 0.9,
                        y: -10,
                        transition: { duration: 0.2 },
                      }
                    : {
                        scale: 1.02,
                        y: -lift - 8,
                        transition: { duration: 0.2 },
                      }
                }
                className={`absolute w-[90vw] max-w-[340px] sm:max-w-[420px] md:max-w-[460px] cursor-pointer rounded-3xl border p-6 sm:p-7 backdrop-blur-2xl transition-shadow ${
                  isActive
                    ? 'border-[#38BDF8]/60 bg-[#111827]/95 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.18)]'
                    : 'border-[#1F2937] bg-[#0F172A]/85 shadow-[0_12px_35px_rgba(0,0,0,0.6)]'
                }`}
                style={{
                  maxHeight: '480px',
                }}
              >
                {/* Active Card Subtle Accent Glow Line at top */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] rounded-full transition-opacity duration-300"
                  style={{
                    backgroundColor: accentColor,
                    opacity: isActive ? 0.9 : 0.25,
                    boxShadow: isActive ? `0 0 16px ${accentColor}` : 'none',
                  }}
                />

                <div className="flex h-full flex-col justify-between">
                  {/* Card Header: Initials Avatar + Stat Pill + Quote Icon */}
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-[#1F2937]/80 pb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar / Initials */}
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold text-sm tracking-wider shadow-inner"
                          style={{
                            backgroundColor: `${accentColor}22`,
                            color: accentColor,
                            border: `1.5px solid ${accentColor}66`,
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full rounded-2xl object-cover"
                              onError={(e) => {
                                // Fallback to initials
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span className={item.image ? 'hidden' : 'block'}>
                            {item.initials ||
                              item.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-[#E0E7FF] leading-snug">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-[#94A3B8]">
                            {item.role && item.company
                              ? `${item.role} · ${item.company}`
                              : item.company || item.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.stat && (
                          <span
                            className="hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${accentColor}18`,
                              color: accentColor,
                              border: `1px solid ${accentColor}40`,
                            }}
                          >
                            {item.stat}
                          </span>
                        )}
                        <Quote
                          className="h-5 w-5 transition-colors"
                          style={{ color: isActive ? accentColor : '#64748B' }}
                        />
                      </div>
                    </div>

                    {/* Testimonial Quote Content with whitespace-pre-line */}
                    <div className="mt-4 max-h-[220px] sm:max-h-[240px] overflow-y-auto custom-scrollbar pr-1">
                      <p className="text-xs sm:text-sm leading-relaxed text-[#CBD5E1] italic whitespace-pre-line">
                        &ldquo;{item.description}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom / Meta */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#1F2937]/80 pt-3.5">
                    {/* Optional Rating */}
                    {item.rating ? (
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] font-mono text-[#64748B]">
                        Verified Feedback
                      </span>
                    )}

                    {/* Optional Project Link */}
                    {item.projectUrl ? (
                      <a
                        href={
                          item.projectUrl.startsWith('http')
                            ? item.projectUrl
                            : `https://${item.projectUrl}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1F2937] bg-[#0B132B] px-2.5 py-1 text-[11px] font-medium text-[#60A5FA] hover:border-[#60A5FA] hover:text-white transition-colors"
                        title={item.projectUrl}
                      >
                        <span className="font-mono">
                          {item.projectUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span
                        className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${accentColor}12`,
                          color: accentColor,
                        }}
                      >
                        Client Review
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Orbit Navigation Controls: Arrows and Indicator Dots */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F2937] bg-[#111827]/80 text-[#CBD5E1] transition-all hover:border-[#60A5FA] hover:text-[#60A5FA] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 bg-[#60A5FA] shadow-[0_0_8px_#60A5FA]'
                  : 'w-2 bg-[#334155] hover:bg-[#64748B]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1F2937] bg-[#111827]/80 text-[#CBD5E1] transition-all hover:border-[#60A5FA] hover:text-[#60A5FA] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default OrbitCardStack;
