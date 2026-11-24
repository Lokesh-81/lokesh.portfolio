'use client';

import React, { useState, useMemo } from 'react';
import {
  type OrbitStackItem,
} from '@/components/ui/orbit-card-stack';
import { TextEffect } from '@/components/core/text-effect';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { FileCheck2 } from 'lucide-react';
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
            'I had the pleasure of working with Lokesh at Belvo, where he played an important role as a Web Developer. He took ownership of client website projects and helped manage the technical workload, making my responsibilities as a founder much more manageable.\n\nHis willingness to take responsibility, handle client requirements, and focus on delivering quality work made him a dependable part of the team. I particularly appreciated his contribution to keeping projects moving forward and reducing the pressure of day-to-day client work.\n\nI highly recommend Lokesh to any organization looking for a dedicated web developer who values responsibility, teamwork, and execution. I wish him continued success in his career!',
          initials: 'HM',
          stat: '',
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
        stat = '';
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

  return (
    <div className="testimonials-editorial">
      <header className="testimonials-editorial-heading">
        <div><h2>Testimonials</h2></div>
        <div><p>{t('testimonials.subtitle') || 'A few words from the people and teams I have had the chance to work with.'}</p><button type="button" onClick={() => setIsLorModalOpen(true)}><FileCheck2 size={15}/> View Belvo LOR <span>↗</span></button></div>
      </header>
      <div className="testimonials-ledger">
        {stackItems.map((item) => {
          const tone = item.name.includes('Abhishek') ? 'testimonial-tone--foundarly' : item.name.includes('Indira') ? 'testimonial-tone--indira' : 'testimonial-tone--belvo';
          return <article className={`testimonial-ledger-card portfolio-card ${tone}`} key={item.id || item.name}>
          <blockquote>“{item.description}”</blockquote>
          <footer><div className="testimonial-avatar">{item.initials}</div><div><strong>{item.name}</strong><span>{[item.role, item.company].filter(Boolean).join(' · ')}</span></div><span className="testimonial-ledger-arrow">↗</span></footer>
        </article>;
        })}
      </div>
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />
    </div>
  );
}

export default TestimonialsSection;
