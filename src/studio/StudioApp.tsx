'use client';

import React from 'react';
import NightSceneBacklit from '@/components/core/night-scene-backlit';
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
      <>
      <NightSceneBacklit background="#100B18" blossomColor="#E8B8D2" speed={65} petals={105} wind={24} scale={100} glow={42} direction="right" style={{ position: 'fixed', inset: 0, zIndex: 0, minWidth: 0, minHeight: 0 }} />
      <div className="relative z-10 flex h-screen w-full items-center justify-center bg-transparent text-[#F5EAF5]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#E8B8D2]" />
          <p className="text-xs font-mono text-[#D9B6D0]">Verifying Admin Studio Credentials...</p>
        </div>
      </div>
      </>
    );
  }

  if (!isAdminAuthenticated) {
    return <StudioLogin onSuccess={() => {}} onExit={onExitStudio} />;
  }

  return <StudioLayout onExitStudio={onExitStudio} />;
}
