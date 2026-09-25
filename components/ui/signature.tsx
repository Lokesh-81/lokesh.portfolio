'use client';

import React, { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import opentype from 'opentype.js';
import { cn } from '@/lib/utils';

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

export function Signature({
  text = 'Signature',
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
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState<number>(300);
  const height = fontSize * 3.8; // Vertical space for ascenders/descenders
  const horizontalPadding = fontSize * 0.2;
  const topMargin = fontSize * 2.2; // Baseline offset to prevent clipping top loops
  const baseline = topMargin;
  const maskId = `signature-reveal-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        let font: opentype.Font | null = null;
        const fontPaths = fontUrl
          ? [fontUrl]
          : [
              '/LastoriaBoldRegular.otf',
              './LastoriaBoldRegular.otf',
              'https://componentry.dev/LastoriaBoldRegular.otf',
              'https://www.componentry.fun/LastoriaBoldRegular.otf',
            ];

        for (const path of fontPaths) {
          try {
            // Modern opentype.js v1.3+ requires opentype.parse(ArrayBuffer)
            // fetch works reliably across all browsers and local dev servers
            const res = await fetch(path as string);
            if (res.ok) {
              const buffer = await res.arrayBuffer();
              font = opentype.parse(buffer) as opentype.Font;
              if (font) break;
            }
          } catch {
            // Try next candidate
          }
        }

        // Secondary fallback to opentype.load with callback in environments supporting it
        if (!font) {
          for (const path of fontPaths) {
            try {
              font = await new Promise<opentype.Font>((resolve, reject) => {
                try {
                  (opentype as any).load(path, (err: any, f: any) => {
                    if (err || !f) reject(err || new Error('Failed to load font'));
                    else resolve(f);
                  });
                } catch (e) {
                  reject(e);
                }
              });
              if (font) break;
            } catch {
              // Try next candidate
            }
          }
        }

        if (!font) {
          throw new Error('Font could not be loaded from any path');
        }

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
      } catch (error) {
        console.error('Signature component font load error:', error);
        if (!isCancelled) {
          setPaths([]);
          setWidth(text.length * fontSize * 0.6);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [text, fontSize, baseline, horizontalPadding, fontUrl]);

  // Handle animation completion callback
  useEffect(() => {
    if (!onComplete || paths.length === 0) return;
    const totalTime = (delay + duration + (paths.length - 1) * 0.2 + 0.8) * 1000;
    const timer = setTimeout(() => {
      onComplete();
    }, totalTime);
    return () => clearTimeout(timer);
  }, [delay, duration, paths.length, onComplete]);

  const variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <motion.svg
      key={paths.length}
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
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="white"
              strokeWidth={fontSize * 0.35}
              fill="none"
              variants={variants}
              transition={{
                pathLength: {
                  delay: delay + i * 0.2,
                  duration,
                  ease: 'easeInOut',
                },
                opacity: {
                  delay: delay + i * 0.2 + 0.01,
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

      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          variants={variants}
          transition={{
            pathLength: {
              delay: delay + i * 0.2,
              duration,
              ease: 'easeInOut',
            },
            opacity: {
              delay: delay + i * 0.2 + 0.01,
              duration: 0.01,
            },
          }}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      ))}

      <g mask={`url(#${maskId})`}>
        {paths.map((d, i) => (
          <path key={i} d={d} fill={color} />
        ))}
      </g>
    </motion.svg>
  );
}

export default Signature;
