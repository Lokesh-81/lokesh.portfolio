'use client';

import React from 'react';
import { InfiniteSlider } from '@/components/core/infinite-slider';

export interface TechLogoItem {
  name: string;
  category: string;
  icon: React.ReactNode;
}

// Crisp, recognizable technology SVG logos
const row1Technologies: TechLogoItem[] = [
  {
    name: 'React',
    category: 'Frontend',
    icon: (
      <svg className="h-6 w-6 text-[#60A5FA]" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
        <circle cx="0" cy="0" r="2.05" fill="#60A5FA" />
        <g stroke="#60A5FA" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Next.js',
    category: 'Framework',
    icon: (
      <svg className="h-6 w-6 fill-current text-[#E0E7FF]" viewBox="0 0 180 180">
        <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#mask0_next)">
          <circle cx="90" cy="90" data-circle="true" fill="currentColor" r="90" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="#0B132B" />
          <rect fill="#0B132B" height="72" width="12" x="115" y="54" />
        </g>
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'Language',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#2563EB" />
        <path d="M68.5 73.5h16.2c3.2 0 5.6-.8 7.3-2.4 1.7-1.6 2.5-3.8 2.5-6.6 0-3-.9-5.3-2.6-6.9-1.7-1.6-4.2-2.4-7.5-2.4h-16v18.3zm-13.7-32.9H90c7.8 0 13.8 2 18 6.1 4.2 4.1 6.3 9.7 6.3 16.9 0 4.8-1 9-3.1 12.6-2 3.6-5 6.4-8.8 8.4l15 23.3H98.9L86.2 86H68.5v28.4H54.8V40.6zm-17.7 12.5H23v-12.5h48v12.5h-14.1v61.3H37.1V53.1z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    category: 'Runtime',
    icon: (
      <svg className="h-6 w-6 text-[#2DD4BF]" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 1.5L2.5 9.3v15.6L16 32.7l13.5-7.8V9.3L16 1.5zm0 3.2l10.8 6.2v12.5L16 29.7 5.2 23.4V10.9L16 4.7z" />
        <circle cx="16" cy="17" r="4.5" />
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: (
      <svg className="h-6 w-6 text-[#38bdf8]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
  },
  {
    name: 'Supabase',
    category: 'Database & Auth',
    icon: (
      <svg className="h-6 w-6 text-[#3ecf8e]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.412 13.914a.792.792 0 0 0 .616 1.282H12v8.958a.396.396 0 0 0 .716.233l10.872-13.75a.792.792 0 0 0-.226-1.283z" />
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'Language & AI',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 110 110">
        <path d="M54.5 3c-14.7 0-24 6.5-24 15.3v11.4h24.5v3.4H21.2c-9 0-16.7 5.4-19 15.6-2.6 11.6-2.7 18.9 0 30.5 2.1 9.2 7.3 15.6 16.3 15.6h9.7V83.6c0-9.8 8.4-18.4 18.4-18.4h24.5c8.2 0 15-6.8 15-15V22.8c0-8.2-6.8-15-15-15h-16.6zm-8.8 9.5c2.7 0 4.8 2.2 4.8 4.8s-2.2 4.8-4.8 4.8-4.8-2.2-4.8-4.8 2.2-4.8 4.8-4.8z" fill="#38bdf8" />
        <path d="M55.5 107c14.7 0 24-6.5 24-15.3V80.3H55v-3.4h33.8c9 0 16.7-5.4 19-15.6 2.6-11.6 2.7-18.9 0-30.5-2.1-9.2-7.3-15.6-16.3-15.6h-9.7v11.2c0 9.8-8.4 18.4-18.4 18.4H38.9c-8.2 0-15 6.8-15 15v27.4c0 8.2 6.8 15 15 15h16.6zm8.8-9.5c-2.7 0-4.8-2.2-4.8-4.8s2.2-4.8 4.8-4.8 4.8 2.2 4.8 4.8-2.2 4.8-4.8 4.8z" fill="#FDE68A" />
      </svg>
    ),
  },
  {
    name: 'Git',
    category: 'VCS',
    icon: (
      <svg className="h-6 w-6 text-[#FB7185]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.62 10.38l-8-8a2.29 2.29 0 0 0-3.24 0l-1.6 1.6 2.53 2.53a2.72 2.72 0 0 1 3.45 3.45l2.44 2.44a2.71 2.71 0 1 1-1.62 1.62l-2.28-2.28v5.1a2.71 2.71 0 1 1-2.29 0v-5.4a2.68 2.68 0 0 1-1.46-1.46L6.82 12l-.44.44a2.29 2.29 0 0 0 0 3.24l8 8a2.29 2.29 0 0 0 3.24 0l4-4a2.29 2.29 0 0 0 0-3.3z" />
      </svg>
    ),
  },
  {
    name: 'Vite',
    category: 'Build Tool',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 32 32">
        <path d="M29.8 5.4L16.9 29.5a1 1 0 0 1-1.8 0L2.2 5.4a1 1 0 0 1 1.3-1.4l12.5 5.8 12.5-5.8a1 1 0 0 1 1.3 1.4z" fill="#C084FC" />
        <path d="M20.5 3.5L16 11.8l-4.5-8.3a1 1 0 0 1 1.2-1.4l3.3 1.5 3.3-1.5a1 1 0 0 1 1.2 1.4z" fill="#FDE68A" />
      </svg>
    ),
  },
];

const row2Technologies: TechLogoItem[] = [
  {
    name: 'Express.js',
    category: 'Backend',
    icon: (
      <svg className="h-6 w-6 fill-current text-[#CBD5E1]" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
  {
    name: 'Firebase',
    category: 'Cloud & Auth',
    icon: (
      <svg className="h-6 w-6 text-[#FDE68A]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.89 15.672L6.255.945a.777.777 0 0 1 1.436-.254l3.292 6.188L3.89 15.672zm16.488-.135L17.712 2.87a.778.778 0 0 0-1.455-.078L13.1 8.878l7.278 6.66zM4.685 17.07l7.03 3.974a.776.776 0 0 0 .762 0l7.04-3.974-7.42-6.79-7.412 6.79z" />
      </svg>
    ),
  },
  {
    name: 'MongoDB',
    category: 'Database',
    icon: (
      <svg className="h-6 w-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C12 0 6 5.5 6 12.8c0 4.2 2.8 7.8 6 9.2 3.2-1.4 6-5 6-9.2C18 5.5 12 0 12 0zm.6 20.3c-.4.2-.8.3-1.2.3-.4 0-.8-.1-1.2-.3l-.2-.1v-7.8c0-.3.2-.5.5-.5s.5.2.5.5v6.5l.6.4c.5.3 1.1.2 1.4-.3.2-.3.2-.7 0-1l-1.4-2.1v-6.9c0-.3.2-.5.5-.5s.5.2.5.5v5.3l1.8 2.7c.9 1.4.7 3.3-.5 4.4-.6.5-1.3.8-2 .8z" />
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    category: 'Language',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="16" fill="#FDE68A" />
        <path d="M67.3 100.5c3.2 5.2 7.7 8.5 14.8 8.5 6.2 0 10.2-3.1 10.2-7.4 0-5.1-4.1-7-11-9.9l-3.8-1.6c-10.9-4.7-18.1-10.5-18.1-22.9 0-11.4 8.7-20 22.3-20 9.7 0 16.7 3.4 21.4 11.6l-11.3 7.2c-2.4-4.3-5-6-10.1-6-4.4 0-7.3 2.8-7.3 6.3 0 4.4 2.8 6.2 9.2 9l3.8 1.6c12.7 5.5 20.1 11.1 20.1 23.9 0 13.7-10.7 21.6-24.8 21.6-13.8 0-22.8-6.9-27.1-15.6l11.7-6.3zm-39.7 1.8c2.4 3.9 5.5 6.4 10.7 6.4 5.5 0 9.1-2.2 9.1-10.7V48.5h14.5v49.5c0 16.2-9.5 23.5-23.3 23.5-12.4 0-20-6.7-23.7-14.8l12.7-4.4z" fill="#0B132B" />
      </svg>
    ),
  },
  {
    name: 'Framer Motion',
    category: 'Animation',
    icon: (
      <svg className="h-6 w-6 text-[#C084FC]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    category: 'DevOps',
    icon: (
      <svg className="h-6 w-6 fill-current text-[#CBD5E1]" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Gemini AI API',
    category: 'AI / LLMs',
    icon: (
      <svg className="h-6 w-6 text-[#A5B4FC]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
      </svg>
    ),
  },
  {
    name: 'REST APIs',
    category: 'Architecture',
    icon: (
      <svg className="h-6 w-6 text-[#60A5FA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    category: 'Deployment',
    icon: (
      <svg className="h-6 w-6 fill-current text-[#E0E7FF]" viewBox="0 0 24 24">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    ),
  },
];

export function TechStackSlider() {
  return (
    <div className="w-full overflow-hidden py-1">
      {/* Single compact forward Infinite Scroll line for footer */}
      <InfiniteSlider gap={12} duration={28}>
        {row1Technologies.map((tech) => (
          <div
            key={tech.name}
            className="group flex h-11 w-44 shrink-0 items-center gap-2.5 rounded-xl border border-[#1F2937] bg-[#111827]/90 px-3 shadow-xs backdrop-blur-md transition-all hover:border-[#60A5FA]"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1F2937]/70 p-1 group-hover:scale-105 transition-transform">
              {tech.icon}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#E0E7FF] group-hover:text-[#60A5FA] transition-colors">
                {tech.name}
              </span>
              <span className="block truncate text-[9px] font-mono uppercase text-[#64748B]">
                {tech.category}
              </span>
            </div>
          </div>
        ))}
      </InfiniteSlider>

      <div className="mt-2">
        <InfiniteSlider gap={12} reverse duration={30}>
          {row2Technologies.map((tech) => (
            <div
              key={tech.name}
              className="group flex h-11 w-44 shrink-0 items-center gap-2.5 rounded-xl border border-[#1F2937] bg-[#111827]/90 px-3 shadow-xs backdrop-blur-md transition-all hover:border-[#C084FC]"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1F2937]/70 p-1 group-hover:scale-105 transition-transform">
                {tech.icon}
              </div>
              <div className="min-w-0">
                <span className="block truncate text-xs font-semibold text-[#E0E7FF] group-hover:text-[#C084FC] transition-colors">
                  {tech.name}
                </span>
                <span className="block truncate text-[9px] font-mono uppercase text-[#64748B]">
                  {tech.category}
                </span>
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
