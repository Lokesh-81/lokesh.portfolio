'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected application error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitized production error logging without leaking tokens or private data
    const sanitizedMsg = (error?.message || '').replace(/bearer\s+[a-zA-Z0-9_\-\.]+/gi, 'Bearer [REDACTED]');
    console.error('[Production Error Boundary]', sanitizedMsg, errorInfo.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0B132B] px-4 text-[#E0E7FF]">
          <div className="w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
              An unexpected error occurred during rendering. Your data is secure and unaffected.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#60A5FA] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-[#1F2937] bg-[#0B132B] px-4 py-2.5 text-xs font-medium text-[#CBD5E1] hover:text-white transition-colors cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
