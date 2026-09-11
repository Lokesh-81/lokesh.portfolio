'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function MoonVisual() {
  const [isClient, setIsClient] = useState(false);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt & shift
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const shiftX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const shiftY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) - 0.5;
      const normalizedY = (e.clientY / innerHeight) - 0.5;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none">
      {/* Outer Soft Atmospheric Glow */}
      <div className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(165,180,252,0.18)_0%,rgba(96,165,250,0.1)_40%,transparent_70%)] blur-2xl" />
      <div className="absolute h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(224,231,255,0.22)_0%,rgba(96,165,250,0.12)_35%,transparent_70%)] blur-xl" />

      {/* Floating 3D Moon Container */}
      <motion.div
        animate={
          isClient
            ? {
                y: [-6, 8, -6],
              }
            : undefined
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          rotateX,
          rotateY,
          x: shiftX,
          y: shiftY,
          perspective: 1000,
        }}
        className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72"
      >
        {/* Crisp Stylized 3D Moon SVG */}
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-[0_0_35px_rgba(165,180,252,0.35)] filter"
        >
          <defs>
            {/* Base Spherical Gradient (Light from upper-left) */}
            <radialGradient id="moonSphereGrad" cx="35%" cy="32%" r="68%" fx="30%" fy="28%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="55%" stopColor="#94A3B8" />
              <stop offset="80%" stopColor="#334155" />
              <stop offset="96%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#0B132B" />
            </radialGradient>

            {/* Inner Rim Light / Corona */}
            <radialGradient id="coronaGlow" cx="35%" cy="32%" r="50%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="92%" stopColor="rgba(224,231,255,0.35)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0.6)" />
            </radialGradient>

            {/* Terminator Line / Shadow Curve */}
            <linearGradient id="terminatorShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="45%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(11,19,43,0.75)" />
              <stop offset="100%" stopColor="rgba(11,19,43,0.95)" />
            </linearGradient>

            {/* Crater 3D Shadow/Highlight Gradients */}
            <radialGradient id="craterDark" cx="45%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#334155" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Ray System for Tycho Crater */}
            <radialGradient id="tychoRays" cx="48%" cy="78%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="15%" stopColor="#E0E7FF" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#A5B4FC" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <clipPath id="moonClip">
              <circle cx="100" cy="100" r="90" />
            </clipPath>
          </defs>

          {/* Spherical Base */}
          <circle cx="100" cy="100" r="90" fill="url(#moonSphereGrad)" />

          {/* Surface Details (Clipped to Moon Sphere) */}
          <g clipPath="url(#moonClip)">
            {/* Lunar Maria (Dark Basaltic Plains) */}
            {/* Oceanus Procellarum / Mare Imbrium (North-West) */}
            <path
              d="M38 52 C50 40, 75 42, 85 58 C92 70, 84 88, 70 94 C54 100, 36 88, 32 72 Z"
              fill="#1E293B"
              fillOpacity="0.52"
            />
            {/* Mare Serenitatis & Tranquillitatis (North-East) */}
            <path
              d="M92 48 C108 42, 126 50, 130 64 C134 76, 120 86, 108 88 C98 89, 88 80, 86 66 Z"
              fill="#1E293B"
              fillOpacity="0.58"
            />
            <path
              d="M110 82 C126 82, 142 94, 140 108 C138 120, 122 126, 108 122 C96 118, 98 94, 110 82 Z"
              fill="#1E293B"
              fillOpacity="0.55"
            />
            {/* Mare Nubium & Humorum (South-West) */}
            <path
              d="M48 106 C62 100, 78 108, 76 124 C74 136, 58 144, 46 138 C38 132, 38 116, 48 106 Z"
              fill="#1E293B"
              fillOpacity="0.48"
            />
            {/* Mare Crisium (Isolated East) */}
            <ellipse
              cx="150"
              cy="74"
              rx="13"
              ry="10"
              fill="#1E293B"
              fillOpacity="0.6"
              transform="rotate(-15 150 74)"
            />

            {/* Tycho Crater Ejecta Rays (Southern Highlands) */}
            <circle cx="96" cy="156" r="42" fill="url(#tychoRays)" />

            {/* Iconic Craters with Sunlight Rim and Internal Shadow */}
            {/* Copernicus */}
            <g transform="translate(68, 88)">
              <ellipse cx="0" cy="0" rx="8" ry="7" fill="url(#craterDark)" />
              {/* Sunlit Rim */}
              <path
                d="M -7 1 A 8 7 0 0 1 6 -4"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Shadow Rim */}
              <path
                d="M 6 -4 A 8 7 0 0 1 -7 1"
                stroke="#0F172A"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="1.5" fill="#E2E8F0" opacity="0.9" />
            </g>

            {/* Kepler */}
            <g transform="translate(42, 84)">
              <ellipse cx="0" cy="0" rx="5" ry="4.5" fill="url(#craterDark)" />
              <path
                d="M -4 1 A 5 4.5 0 0 1 4 -2"
                stroke="#FFFFFF"
                strokeWidth="1"
                fill="none"
                opacity="0.75"
              />
              <path
                d="M 4 -2 A 5 4.5 0 0 1 -4 1"
                stroke="#0F172A"
                strokeWidth="1"
                fill="none"
                opacity="0.85"
              />
            </g>

            {/* Aristarchus (Bright Peak) */}
            <g transform="translate(40, 56)">
              <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#FFFFFF" opacity="0.85" />
              <ellipse cx="0.5" cy="0.5" rx="3" ry="2.5" fill="#334155" opacity="0.6" />
            </g>

            {/* Tycho (Southern Bright Center) */}
            <g transform="translate(96, 156)">
              <ellipse cx="0" cy="0" rx="7" ry="6" fill="#1E293B" opacity="0.7" />
              <path
                d="M -6 1 A 7 6 0 0 1 6 -3"
                stroke="#FFFFFF"
                strokeWidth="1.4"
                fill="none"
                opacity="0.95"
              />
              <path
                d="M 6 -3 A 7 6 0 0 1 -6 1"
                stroke="#0F172A"
                strokeWidth="1.4"
                fill="none"
                opacity="0.9"
              />
              <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" opacity="0.95" />
            </g>

            {/* Clavius & Southern Crater Arc */}
            <g transform="translate(82, 172)">
              <ellipse cx="0" cy="0" rx="11" ry="8" fill="url(#craterDark)" />
              <path
                d="M -10 1 A 11 8 0 0 1 9 -4"
                stroke="#CBD5E1"
                strokeWidth="1.2"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 9 -4 A 11 8 0 0 1 -10 1"
                stroke="#020617"
                strokeWidth="1.2"
                fill="none"
                opacity="0.95"
              />
            </g>

            {/* Micro Craters & Highland Texture */}
            <circle cx="118" cy="144" r="3.2" fill="#0F172A" opacity="0.7" />
            <circle cx="117" cy="143" r="3.2" stroke="#E2E8F0" strokeWidth="0.7" fill="none" opacity="0.6" />

            <circle cx="138" cy="130" r="4.5" fill="#0F172A" opacity="0.75" />
            <circle cx="137" cy="129" r="4.5" stroke="#CBD5E1" strokeWidth="0.8" fill="none" opacity="0.5" />

            <circle cx="142" cy="102" r="3" fill="#0F172A" opacity="0.8" />
            <circle cx="78" cy="38" r="3.5" fill="#0F172A" opacity="0.6" />
            <circle cx="77" cy="37" r="3.5" stroke="#F1F5F9" strokeWidth="0.7" fill="none" opacity="0.7" />

            <circle cx="62" cy="142" r="4" fill="#0F172A" opacity="0.6" />

            {/* Spherical Terminator Shadow Overlay to give true 3D roundness */}
            <rect width="200" height="200" fill="url(#terminatorShadow)" />

            {/* Edge Rim Corona Glow */}
            <circle cx="100" cy="100" r="90" fill="url(#coronaGlow)" />
          </g>

          {/* Crisp illuminated crescent edge */}
          <path
            d="M 28 65 A 90 90 0 0 1 145 28"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
