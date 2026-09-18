import React from 'react';
import { cn } from '@/lib/utils';

export interface GcpBadgeProps {
  className?: string;
  size?: number;
  interactive?: boolean;
  showGlow?: boolean;
}

export function GcpBadge({
  className,
  size = 180,
  interactive = true,
  showGlow = true,
}: GcpBadgeProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        interactive && 'transition-transform duration-300 hover:scale-105',
        className
      )}
      style={{ width: size, height: size }}
      title="Google Cloud Certified Professional Cloud Architect"
    >
      {/* Outer subtle aura glow */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EA4335]/20 via-[#FBBC04]/25 to-[#4285F4]/20 blur-xl -z-10 animate-pulse"
          style={{ animationDuration: '4s' }}
        />
      )}

      <img
        src="/professional-cloud-architect-certification.svg"
        alt="Google Cloud Certified Professional Cloud Architect Badge"
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
