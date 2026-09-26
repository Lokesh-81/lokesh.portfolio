'use client';

import React, { useEffect, useId, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import opentype from 'opentype.js';
import { cn } from '@/lib/utils';
import { PRECOMPUTED_SIGNATURE, LASTORIA_FONT_BASE64 } from '@/lib/signature-font';

export interface SignatureProps {
  /** Text to generate signature for */
  text?: string;
  /** Color of the signature path */
  color?: string;
  /** Font size of the signature */
  fontSize?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
  /** Only animate when in view */
  inView?: boolean;
  /** Only animate once */
  once?: boolean;
  /** Custom font URL to load */
  fontUrl?: string;
  /** Optional callback fired when animation sequence finishes */
  onComplete?: () => void;
}

// Module-level font cache so it only parses once across the entire application lifecycle
let cachedFont: opentype.Font | null = null;

function getEmbeddedFont(): opentype.Font | null {
  if (cachedFont) return cachedFont;
  try {
    if (typeof window !== 'undefined' && LASTORIA_FONT_BASE64) {
      const binaryString = window.atob(LASTORIA_FONT_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      cachedFont = opentype.parse(bytes.buffer) as opentype.Font;
      return cachedFont;
    }
  } catch (err) {
    console.warn('Signature: Fallback to precomputed vectors; font parse note:', err);
  }
  return null;
}

export function Signature({
  text = 'Poosala Lokesh',
  color = 'currentColor',
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl,
  onComplete,
}: SignatureProps) {
  // Pre-calculate scale factor if using precomputed signature
  const isDefaultText = text === PRECOMPUTED_SIGNATURE.text;
  const initialScale = fontSize / PRECOMPUTED_SIGNATURE.fontSize;

  // Initialize with precomputed paths for "Poosala Lokesh" so there is zero layout shift or wait
  const [paths, setPaths] = useState<string[]>(() => {
    if (isDefaultText) {
      return PRECOMPUTED_SIGNATURE.paths;
    }
    return [];
  });

  const [width, setWidth] = useState<number>(() => {
    if (isDefaultText) {
      return PRECOMPUTED_SIGNATURE.width * initialScale;
    }
    return text.length * fontSize * 0.6;
  });

  const height = fontSize * 3.8; // Vertical space for ascenders/descenders
  const horizontalPadding = fontSize * 0.2;
  const topMargin = fontSize * 2.2; // Baseline offset to prevent clipping top loops
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    let isCancelled = false;

    async function generateGlyphs() {
      try {
        let font: opentype.Font | null = cachedFont;

        // 1. If custom fontUrl is provided, attempt to fetch it
        if (fontUrl && !font) {
          try {
            const res = await fetch(fontUrl);
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              font = opentype.parse(buffer) as opentype.Font;
              if (font) cachedFont = font;
            }
          } catch {
            // Ignore custom fontUrl error and proceed to embedded font
          }
        }

        // 2. Fall back to embedded Lastoria font in memory
        if (!font) {
          font = getEmbeddedFont();
        }

        // 3. If font is available, generate exact SVG paths for the given text
        if (font) {
          let x = horizontalPadding;
          const newPaths: string[] = [];

          for (const char of text) {
            const glyph = font.charToGlyph(char);
            const path = glyph.getPath(x, baseline, fontSize);
            newPaths.push(path.toPathData(3));

            const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
            x += advanceWidth * (fontSize / font.unitsPerEm);
          }

          if (!isCancelled) {
            setPaths(newPaths);
            setWidth(x + horizontalPadding);
          }
          return;
        }

        // 4. If font still not parsed, use precomputed paths for default text
        if (isDefaultText && !isCancelled) {
          setPaths(PRECOMPUTED_SIGNATURE.paths);
          setWidth(PRECOMPUTED_SIGNATURE.width * initialScale);
        }
      } catch (err) {
        console.warn('Signature rendering warning:', err);
        if (isDefaultText && !isCancelled) {
          setPaths(PRECOMPUTED_SIGNATURE.paths);
          setWidth(PRECOMPUTED_SIGNATURE.width * initialScale);
        }
      }
    }

    generateGlyphs();

    return () => {
      isCancelled = true;
    };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl, isDefaultText, initialScale]);

  // Handle animation completion callback safely
  useEffect(() => {
    if (!onComplete) return;
    const pathsCount = paths.length > 0 ? paths.length : text.length;
    const totalTime = (delay + duration + (pathsCount - 1) * 0.15 + 0.5) * 1000;
    const timer = setTimeout(() => {
      onComplete();
    }, totalTime);
    return () => clearTimeout(timer);
  }, [delay, duration, paths.length, text.length, onComplete]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  // If paths is still empty, generate a graceful fallback
  const renderPaths = paths.length > 0 ? paths : (isDefaultText ? PRECOMPUTED_SIGNATURE.paths : []);

  return (
    <motion.svg
      key={`${renderPaths.length}-${fontSize}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={cn('text-foreground overflow-visible max-w-full h-auto', className)}
      initial="hidden"
      whileInView={inView ? 'visible' : undefined}
      animate={inView ? undefined : 'visible'}
      viewport={{ once }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {renderPaths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.35}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.15,
                  duration,
                  ease: 'easeInOut',
                },
                opacity: {
                  delay: delay + i * 0.15 + 0.01,
                  duration: 0.01,
                },
              }}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>

      {renderPaths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.15,
              duration,
              ease: 'easeInOut',
            },
            opacity: {
              delay: delay + i * 0.15 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {renderPaths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}

export default Signature;
