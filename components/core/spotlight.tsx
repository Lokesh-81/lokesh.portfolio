'use client';

import React from 'react';
import type { SpringOptions } from 'framer-motion';

export interface SpotlightProps {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
}

/**
 * Spotlight cursor tracker is disabled per design request.
 */
export function Spotlight(_props?: SpotlightProps) {
  return null;
}

export default Spotlight;
