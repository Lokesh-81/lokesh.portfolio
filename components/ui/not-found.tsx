'use client';

import React from 'react';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

interface NotFoundProps {
  onReturnHome: () => void;
}

export function NotFound({ onReturnHome }: NotFoundProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B132B] px-4 text-[#E0E7FF]">
      <div className="w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <span className="font-mono text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          404
        </span>

        <h1 className="text-xl font-bold text-white mt-2 mb-2">Section or Route Not Found</h1>
        <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
          The requested portfolio section or resource could not be located.
        </p>

        <button
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Return to Portfolio</span>
        </button>
      </div>
    </div>
  );
}
