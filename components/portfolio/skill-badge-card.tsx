import React from 'react';
import { cn } from '@/lib/utils';
import { SkillBadge } from '@/lib/data/certifications';

export interface SkillBadgeCardProps {
  badge: SkillBadge;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillBadgeCard({
  badge,
  onClick,
  className,
  size = 'md',
}: SkillBadgeCardProps) {
  const getLevelLabel = (level: string) => {
    return level ? `SKILL BADGE · ${level.toUpperCase()}` : 'GOOGLE CLOUD SKILL BADGE';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'skill-badge-card group relative bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none text-center',
        size === 'sm' && 'p-3',
        size === 'md' && 'p-3.5 sm:p-4',
        size === 'lg' && 'p-4 sm:p-5',
        'hover:-translate-y-1 hover:border-[#4285F4]/50',
        className
      )}
      title={`${badge.title} — Google Cloud Skill Badge`}
    >
      {/* Top Google Cloud Header */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="font-semibold text-sm sm:text-base tracking-tight text-[#202124] flex items-center">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC04]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          <span className="text-[#5F6368] font-normal ml-1">Cloud</span>
        </span>
      </div>

      {/* Middle Content: Title, Category, Divider, and Level */}
      <div className="my-3 py-1 flex flex-col items-center justify-center">
        {/* Title */}
        <h3
          className={cn(
            'text-[#202124] font-normal tracking-tight leading-snug px-1 line-clamp-2 group-hover:text-[#1A73E8] transition-colors',
            size === 'sm' ? 'text-xs sm:text-sm font-medium' : 'text-sm sm:text-base font-medium'
          )}
        >
          {badge.title}
        </h3>

        {/* Category */}
        <p className="mt-1 text-xs sm:text-sm text-[#5F6368] font-normal">
          {badge.category}
        </p>

        {/* Subtle Horizontal Divider Line */}
        <div className="my-2 w-10 h-[1px] bg-[#DADCE0]" />

        {/* Level Tag */}
        <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.14em] text-[#5F6368] uppercase font-mono">
          {getLevelLabel(badge.level || '')}
        </p>
      </div>

      {/* Footer Info: Issued Date */}
      <div className="pb-0 text-xs font-mono text-[#9AA0A6] flex items-center justify-between px-1">
        <span>Google Cloud Skill Badge</span>
        <span className="text-[#1A73E8] opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold">
          View &rarr;
        </span>
      </div>

      {/* Iconic Google 4-Color Bottom Bar: Red, Blue, Green, Yellow */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flex w-full">
        <div className="w-[30%] bg-[#EA4335]" />
        <div className="w-[40%] bg-[#4285F4]" />
        <div className="w-[10%] bg-[#34A853]" />
        <div className="w-[20%] bg-[#FBBC04]" />
      </div>
    </div>
  );
}
