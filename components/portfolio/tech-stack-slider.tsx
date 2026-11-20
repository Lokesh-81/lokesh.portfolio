'use client';

import React from 'react';
import { InfiniteSlider } from '@/components/core/infinite-slider';

type Technology = { name: string; category: string; slug: string; color: string };

const firstRow: Technology[] = [
  { name: 'React', category: 'Frontend', slug: 'react', color: '61DAFB' },
  { name: 'Next.js', category: 'Framework', slug: 'nextdotjs', color: '000000' },
  { name: 'TypeScript', category: 'Language', slug: 'typescript', color: '3178C6' },
  { name: 'Node.js', category: 'Runtime', slug: 'nodedotjs', color: '5FA04E' },
  { name: 'Tailwind CSS', category: 'Styling', slug: 'tailwindcss', color: '06B6D4' },
  { name: 'Supabase', category: 'Database & Auth', slug: 'supabase', color: '3FCF8E' },
  { name: 'Python', category: 'Language & AI', slug: 'python', color: '3776AB' },
  { name: 'Git', category: 'Version Control', slug: 'git', color: 'F05032' },
  { name: 'Vite', category: 'Build Tool', slug: 'vite', color: '646CFF' },
];
const secondRow: Technology[] = [
  { name: 'Express.js', category: 'Backend', slug: 'express', color: '000000' },
  { name: 'Firebase', category: 'Cloud & Auth', slug: 'firebase', color: 'DD2C00' },
  { name: 'MongoDB', category: 'Database', slug: 'mongodb', color: '47A248' },
  { name: 'JavaScript', category: 'Language', slug: 'javascript', color: 'F7DF1E' },
  { name: 'Framer Motion', category: 'Animation', slug: 'framer', color: '0055FF' },
  { name: 'GitHub', category: 'DevOps', slug: 'github', color: '181717' },
  { name: 'Gemini AI', category: 'AI / LLMs', slug: 'googlegemini', color: '8E75B2' },
  { name: 'Vercel', category: 'Deployment', slug: 'vercel', color: '000000' },
];

function TechnologyCard({ tech }: { tech: Technology }) {
  return (
    <div className="tech-stack-logo-card group flex h-[66px] w-[190px] shrink-0 items-center gap-3 rounded-xl border border-[#29251f] bg-[#fffdf7] px-3.5 shadow-[2px_2px_0_#29251f] transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_#29251f]">
      <span className="tech-stack-logo-frame flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#ded8cc] bg-white p-1.5">
        <img
          src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
          alt={`${tech.name} logo`}
          width={30}
          height={30}
          loading="lazy"
          decoding="async"
          className="tech-stack-logo block h-[30px] w-[30px] object-contain"
        />
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[13px] font-bold leading-5 text-[#24221f]">{tech.name}</span>
        <span className="block truncate text-[10px] font-mono uppercase tracking-wide text-[#696257]">{tech.category}</span>
      </span>
    </div>
  );
}

export function TechStackSlider() {
  return (
    <div className="tech-stack-slider w-full min-w-0 overflow-hidden py-3">
      <InfiniteSlider gap={14} duration={32}>
        {firstRow.map((tech) => <TechnologyCard key={tech.name} tech={tech} />)}
      </InfiniteSlider>
      <div className="mt-3">
        <InfiniteSlider gap={14} reverse duration={34}>
          {secondRow.map((tech) => <TechnologyCard key={tech.name} tech={tech} />)}
        </InfiniteSlider>
      </div>
    </div>
  );
}
