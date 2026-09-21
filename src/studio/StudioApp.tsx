'use client';

import React from 'react';
import { usePortfolio } from '@/lib/portfolio-context';
import { StudioLogin } from './auth/StudioLogin';
import { StudioLayout } from './StudioLayout';
import { RefreshCw } from 'lucide-react';

interface StudioAppProps {
  onExitStudio: () => void;
}

export function StudioApp({ onExitStudio }: StudioAppProps) {
  const { isAdminAuthenticated, isAuthLoading } = usePortfolio();

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070D1E] text-[#E0E7FF]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#2563EB]" />
          <p className="text-xs font-mono text-[#94A3B8]">Verifying Admin Studio Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <StudioLogin onSuccess={() => {}} onExit={onExitStudio} />;
  }

  return <StudioLayout onExitStudio={onExitStudio} />;
}
