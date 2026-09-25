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

export function TestimonialsSection() {
  const { testimonials } = usePortfolio();
  const { t, language } = useLanguage();

  // Map real portfolio testimonials to OrbitStackItem
  const stackItems: OrbitStackItem[] = useMemo(() => {
    const published = (testimonials || []).filter((item) => item.isPublished !== false);

    if (!published || published.length === 0) {
      return [
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

      if (isIndira) {
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
        role: item.role || '',
        company: item.company || '',
        description: item.testimonial,
        initials,
        stat,
        accent,
        rating,
        projectUrl,
      };
    });
  }, [testimonials]);

  const defaultIndex = stackItems.findIndex((item) => item.name.includes('Indira')) >= 0
    ? stackItems.findIndex((item) => item.name.includes('Indira'))
    : 0;

  const [activeMember, setActiveMember] = useState<OrbitStackItem>(
    stackItems[defaultIndex] || stackItems[0]
  );

  return (
    <div id="testimonials" className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight for Testimonials Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header following the requested Componentry pattern */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-testimonials-${language}`} per="char" delay={0.05}>
                {t('testimonials.viewing') || 'Currently viewing'}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-2xl font-light tracking-tight text-[#E0E7FF] sm:text-4xl md:text-5xl">
              {activeMember?.name || 'Client'}{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {activeMember?.company ? `— ${activeMember.company}` : ''}
              </span>
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
            {t('testimonials.subtitle') ||
              'Genuine endorsements, client reviews, and direct collaboration feedback from founders and business partners.'}
          </p>
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
    </div>
  );
}

export default TestimonialsSection;
