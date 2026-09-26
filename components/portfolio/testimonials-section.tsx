'use client';

import React, { useState, useMemo } from 'react';
import {
  OrbitCardStack,
  type OrbitStackItem,
} from '@/components/ui/orbit-card-stack';
import { Spotlight } from '@/components/core/spotlight';
import { TextEffect } from '@/components/core/text-effect';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { FileCheck2, ShieldCheck } from 'lucide-react';
import { BelvoLorModal } from '@/components/portfolio/belvo-lor-modal';

export function TestimonialsSection() {
  const { testimonials } = usePortfolio();
  const { t, language } = useLanguage();
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);

  // Map real portfolio testimonials to OrbitStackItem
  const stackItems: OrbitStackItem[] = useMemo(() => {
    const published = (testimonials || []).filter((item) => item.isPublished !== false);

    if (!published || published.length === 0) {
      return [
        {
          name: 'Hrishikesh Mishra',
          role: 'CEO',
          company: 'Belvo Company',
          description:
            'It is my pleasure to recommend Poosala Lokesh for successfully completing a 3-month internship as a Web Developer at Belvo. During the internship, they demonstrated a strong willingness to learn, adaptability, and a professional attitude while completing assigned tasks. They gained practical exposure to website development, implementation, debugging, and improving web-based solutions. I am pleased to recommend Poosala Lokesh for future opportunities in Web Development and related areas.',
          initials: 'HM',
          stat: 'Official LOR',
          accent: '#a855f7',
          rating: 5,
          projectUrl: 'https://www.belvo.buzz/',
        },
        {
          name: 'Indira Thakur',
          role: '',
          company: 'Indira Thakur Photography',
          description:
            'I was looking for a website developer to create my website and came across Lokesh through a company I had hired. I shared the colour palette, font style, and other details I wanted to match my brand, and he implemented everything as requested.\n\nThere were multiple complications during the development process, which he resolved efficiently. I would message him about any issues with the website on WhatsApp, and he would work on resolving them. He never told me that something couldn’t be done. He has a positive attitude towards his work and always tries to find a solution, which I really appreciated.\n\nIt was nice working with him. The website now looks satisfactory, and I’m happy with the overall result.',
          initials: 'IT',
          stat: 'Photography',
          accent: '#c084fc',
          rating: 5,
          projectUrl: 'https://www.indirathakur.com',
        },
        {
          name: 'Abhishek Aggarwal',
          role: 'Founder & Business Owner',
          company: 'Foundarly Business World',
          description:
            'Super fast execution and very satisfying results every single time! Lokesh is highly reliable, technically solid, and always ready to tackle any challenge on the website. A pleasure to work with!',
          initials: 'AA',
          stat: 'Enterprise',
          accent: '#38bdf8',
          rating: 5,
          projectUrl: 'https://foundarlybusinessworld.in',
        },
      ];
    }

    return published.map((item, idx) => {
      const isBelvo =
        item.name.toLowerCase().includes('hrishikesh') ||
        item.company?.toLowerCase().includes('belvo');
      const isIndira = item.name.toLowerCase().includes('indira');
      const isFoundarly =
        item.name.toLowerCase().includes('abhishek') ||
        item.name.toLowerCase().includes('foundarly') ||
        item.company?.toLowerCase().includes('foundarly');

      let name = item.name;
      let initials = 'CL';
      if (item.name) {
        initials = item.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
      }

      let accent = idx % 2 === 0 ? '#38bdf8' : '#c084fc';
      let stat = 'Endorsement';
      let rating = item.rating;
      let projectUrl = item.projectUrl;

      if (isBelvo) {
        accent = '#a855f7';
        stat = 'Official LOR';
        name = 'Hrishikesh Mishra';
        initials = 'HM';
        rating = 5;
        projectUrl = projectUrl || 'https://www.belvo.buzz/';
      } else if (isIndira) {
        accent = '#c084fc';
        stat = 'Photography';
        initials = 'IT';
        rating = 5;
        projectUrl = projectUrl || 'https://www.indirathakur.com';
      } else if (isFoundarly) {
        accent = '#38bdf8';
        stat = 'Enterprise';
        name = 'Abhishek Aggarwal';
        initials = 'AA';
        rating = 5;
        projectUrl = projectUrl || 'https://foundarlybusinessworld.in';
      }

      return {
        id: item.id,
        name,
        role: item.role || (isBelvo ? 'CEO' : ''),
        company: item.company || (isBelvo ? 'Belvo Company' : ''),
        description: item.testimonial,
        initials,
        stat,
        accent,
        rating,
        projectUrl,
      };
    });
  }, [testimonials]);

  const defaultIndex = stackItems.findIndex((item) => item.name.includes('Hrishikesh') || item.company?.includes('Belvo')) >= 0
    ? stackItems.findIndex((item) => item.name.includes('Hrishikesh') || item.company?.includes('Belvo'))
    : 0;

  const [activeMember, setActiveMember] = useState<OrbitStackItem>(
    stackItems[defaultIndex] || stackItems[0]
  );

  const isBelvoActive =
    activeMember?.name?.includes('Hrishikesh') ||
    activeMember?.company?.includes('Belvo') ||
    activeMember?.stat === 'Official LOR';

  return (
    <div id="testimonials" className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight for Testimonials Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18)_0%,rgba(56,189,248,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header following the requested Componentry pattern */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold flex items-center gap-2">
              <TextEffect key={`tag-testimonials-${language}`} per="char" delay={0.05}>
                {t('testimonials.viewing') || 'Currently viewing'}
              </TextEffect>
              {isBelvoActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.2 text-[10px] font-mono">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Belvo CEO Recommendation Letter
                </span>
              )}
            </div>
            <h2 className="mt-1 text-2xl font-light tracking-tight text-[#E0E7FF] sm:text-4xl md:text-5xl">
              {activeMember?.name || 'Client'}{' '}
              <span className="instrument italic font-normal text-purple-400">
                {activeMember?.company ? `— ${activeMember.company}` : ''}
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
              {t('testimonials.subtitle') ||
                'Genuine endorsements, executive recommendation letters, and direct collaboration feedback from founders and business leaders.'}
            </p>

            <button
              onClick={() => setIsLorModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 px-3.5 py-2 text-xs font-semibold text-purple-200 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-purple-400" />
              <span>View Belvo LOR</span>
            </button>
          </div>
        </div>

        {/* 3D Orbit Card Stack in the requested container height */}
        <div className="mt-6 h-[580px] sm:h-[620px] w-full flex items-center justify-center">
          <OrbitCardStack
            items={stackItems}
            defaultActiveIndex={defaultIndex}
            spread={150}
            lift={40}
            onActiveChange={(item) => setActiveMember(item)}
          />
        </div>
      </div>

      {/* Belvo Letter of Recommendation Modal */}
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />
    </div>
  );
}

export default TestimonialsSection;
