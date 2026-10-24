'use client';

import React from 'react';
import { X, Shield, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              {type === 'privacy' ? <Shield className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className="text-[11px] text-slate-400">Poosala Lokesh Portfolio & Developer Studio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed custom-scrollbar">
          {type === 'privacy' ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">1. Overview & Data Philosophy</h3>
                <p>
                  This Privacy Policy outlines how Poosala Lokesh (&quot;I&quot;, &quot;we&quot;, or &quot;the portfolio&quot;) handles your information. We value privacy and ensure data collection is transparent, minimal, and secure.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">2. Information We Collect</h3>
                <p className="mb-2">We collect only necessary information that you voluntarily provide:</p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                  <li><strong>Contact Inquiries:</strong> When submitting an inquiry via the Contact form, we collect your name, email address, topic, and message content solely to reply to your inquiry.</li>
                  <li><strong>Telemetry & Analytics:</strong> Privacy-conscious, anonymized interaction metrics (such as section views or project link clicks). We do not collect precise geolocation, IP addresses, or cross-site tracking cookies.</li>
                  <li><strong>Studio CMS Authentication:</strong> For authorized administrative sessions, cryptographically salted password hashes and signed session tokens are processed securely via Supabase PostgreSQL / Firebase Auth.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">3. Data Storage & Security</h3>
                <p>
                  Data is securely stored using Supabase (PostgreSQL with Row Level Security enabled) and Google Cloud Firestore. We employ bcrypt cryptographic hashing, TLS 1.3 encryption in transit, and defensive rate limiting to prevent unauthorized access.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">4. Data Retention & Your Rights</h3>
                <p>
                  You have the right to request access, correction, or deletion of any personal information provided via contact inquiries. To request data erasure, reach out directly at <strong className="text-cyan-400 font-mono">poosala15@gmail.com</strong>.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">1. Acceptance of Terms</h3>
                <p>
                  By accessing and using this portfolio website and associated engineering showcases, you agree to comply with and be bound by these Terms of Service.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">2. Intellectual Property & Code Samples</h3>
                <p>
                  All project demonstrations, open-source repositories, design systems, and architecture documentation are authored by Poosala Lokesh, unless otherwise attributed. Open-source repositories referenced herein are governed by their respective licenses (e.g. MIT, Apache 2.0).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">3. Recommendations & Credentials</h3>
                <p>
                  Official recommendation letters (including the Belvo Company executive endorsement signed by CEO Hrishikesh Mishra) and Google Cloud certification credentials represent authentic, verifiable professional records.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">4. Disclaimer & Limitation of Liability</h3>
                <p>
                  This portfolio and its interactive demonstrations are provided &quot;as is&quot; without warranties of any kind. While every effort is made to maintain 99.99% uptime, no guarantee of continuous service is made.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Updated & Active for 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
