'use client';

import React from 'react';
import { MapPin, Languages, GraduationCap, Award, Github, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

export function AboutSection() {
  const { profile } = usePortfolio();

  const displayName = profile?.displayName || 'P. Lokesh';
  const location = profile?.location || 'Hyderabad, India';
  const languages = profile?.languages?.length
    ? profile.languages.join(' · ')
    : 'Telugu · English · Hindi · French';
  const education = profile?.education || 'B.Sc. MSCS · 2027';
  const recognition = profile?.recognition || 'Google Student Ambassador';

  return (
    <section id="about" className="py-24 px-6 border-t border-zinc-200/80 dark:border-zinc-900/80">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] items-start border-b border-zinc-200/80 pb-16 dark:border-zinc-900/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-600 font-semibold dark:text-purple-400">
              01 / ABOUT ME
            </p>
            <h2 className="mt-2 text-4xl font-light tracking-tight text-zinc-950 sm:text-6xl md:text-7xl dark:text-white">
              Curious by <span className="instrument italic font-normal">nature.</span>
            </h2>

            {/* Both GitHub profiles display */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Verified GitHub Profiles
              </span>
              <div className="space-y-1.5">
                <a
                  href="https://github.com/Lokesh-81"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3.5 py-2 text-xs font-medium text-zinc-800 hover:border-purple-400 hover:text-purple-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5" />
                    <span>github.com/Lokesh-81</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </a>

                <a
                  href="https://github.com/lokeshnaivaidya-max"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3.5 py-2 text-xs font-medium text-zinc-800 hover:border-purple-400 hover:text-purple-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-purple-500/50 dark:hover:text-purple-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5" />
                    <span>github.com/lokeshnaivaidya-max</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-2xl font-light">
              I'm <span className="font-semibold text-zinc-950 dark:text-white">{displayName}</span>, a Full Stack Developer and Computer Science student based in {location}, driven by the craft of building resilient web platforms and AI-powered products.
            </p>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {profile?.aboutSubDescription ||
                'I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and modern AI pipelines.'}
            </p>

            {/* Fact Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Location</span>
                </div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">{location}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <Languages className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Languages</span>
                </div>
                <p className="font-semibold text-[11px] text-zinc-900 dark:text-white leading-tight">
                  {languages}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Education</span>
                </div>
                <p className="font-semibold text-xs text-zinc-900 dark:text-white">{education}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
                <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 mb-1.5 text-[10px] uppercase tracking-wider font-medium">
                  <Award className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Recognition</span>
                </div>
                <p className="font-semibold text-[11px] text-zinc-900 dark:text-white leading-tight">
                  {recognition}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Engineering Philosophy Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">01</span>
            <h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">Pristine Craft</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Interfaces engineered with optical precision, fluid animations, mathematical spacing, and strict adherence to modern accessibility and performance criteria.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">02</span>
            <h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">Scalable Architecture</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              End-to-end type safety, resilient API design, normalized database schemas, and clean state handling that maintains velocity as platforms grow.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">03</span>
            <h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">AI-Native Systems</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Designing contextual AI experiences with streaming LLMs, retrieval pipelines, semantic caching, and intelligent tools that solve practical user problems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
