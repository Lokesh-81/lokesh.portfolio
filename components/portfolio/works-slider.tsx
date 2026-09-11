'use client';

import React from 'react';
import { InfiniteSlider } from '@/components/core/infinite-slider';

export type Work = {
  id: string | number;
  title?: string;
  brand_name?: string;
  image_url: string;
  category?: string;
  accentColor?: string;
};

interface WorksSliderProps {
  works: Work[];
}

export function WorksSlider({ works }: WorksSliderProps) {
  if (!works || works.length === 0) return null;

  return (
    <section id="brands" className="overflow-hidden py-20 border-y border-zinc-200/60 dark:border-zinc-900/80 bg-zinc-50/50 dark:bg-black/40">
      <div className="mx-auto mb-10 max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
          SELECTED COLLABORATIONS & PLATFORMS
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 md:text-5xl dark:text-white">
          Brands & Systems I've Built
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
          High-performance production platforms, healthcare workflows, startup ecosystems, and enterprise portals engineered for scale.
        </p>
      </div>

      {/* Row 1 - Forward infinite slider */}
      <InfiniteSlider gap={24} duration={35}>
        {works.map((work) => (
          <div
            key={`first-${work.id}`}
            className="group flex h-28 w-60 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:border-purple-400/50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-purple-500/40"
          >
            {work.image_url && !work.image_url.includes('placeholder-empty') ? (
              <img
                src={work.image_url}
                alt={work.brand_name || work.title || 'Selected work'}
                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  // Fallback to text badge if image not found
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).parentElement?.querySelector('.fallback-badge');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}

            <div
              className={`fallback-badge ${
                work.image_url && !work.image_url.includes('placeholder-empty') ? 'hidden' : 'flex'
              } flex-col items-center justify-center text-center`}
            >
              <span className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400 transition-colors">
                {work.brand_name || work.title}
              </span>
              {work.category && (
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {work.category.split('/')[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </InfiniteSlider>

      {/* Row 2 - Reverse infinite slider */}
      <div className="mt-5">
        <InfiniteSlider gap={24} reverse duration={35}>
          {works.map((work) => (
            <div
              key={`second-${work.id}`}
              className="group flex h-28 w-60 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:border-purple-400/50 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:hover:border-purple-500/40"
            >
              {work.image_url && !work.image_url.includes('placeholder-empty') ? (
                <img
                  src={work.image_url}
                  alt={work.brand_name || work.title || 'Selected work'}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = (e.target as HTMLElement).parentElement?.querySelector('.fallback-badge');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}

              <div
                className={`fallback-badge ${
                  work.image_url && !work.image_url.includes('placeholder-empty') ? 'hidden' : 'flex'
                } flex-col items-center justify-center text-center`}
              >
                <span className="text-base font-bold tracking-tight text-zinc-900 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400 transition-colors">
                  {work.brand_name || work.title}
                </span>
                {work.category && (
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {work.category.split('/')[0]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
