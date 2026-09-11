'use client';

import { SlidingNumber } from '@/components/core/sliding-number';
import { useEffect, useState } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-0.5 font-mono tabular-nums text-xs">
      <SlidingNumber value={time.getHours()} padStart />
      <span>:</span>
      <SlidingNumber value={time.getMinutes()} padStart />
      <span>:</span>
      <SlidingNumber value={time.getSeconds()} padStart />
    </div>
  );
}
