'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SlidingNumberProps {
  value: number;
  padStart?: boolean;
  decimalPlaces?: number;
  className?: string;
}

const NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ digit }: { digit: string; key?: React.Key }) {
  const num = parseInt(digit, 10);

  if (isNaN(num)) {
    return <span className="inline-block">{digit}</span>;
  }

  return (
    <span className="relative inline-block h-[1em] w-[0.6em] overflow-hidden leading-[1em]">
      <motion.span
        initial={false}
        animate={{ y: `-${num * 10}%` }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 35,
          mass: 0.8,
        }}
        className="absolute left-0 top-0 flex flex-col will-change-transform"
      >
        {NUMBERS.map((n) => (
          <span key={n} className="flex h-[1em] items-center justify-center">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function SlidingNumber({
  value,
  padStart = false,
  decimalPlaces = 0,
  className,
}: SlidingNumberProps) {
  const formattedString = React.useMemo(() => {
    let str = decimalPlaces > 0 ? value.toFixed(decimalPlaces) : Math.floor(value).toString();
    if (padStart && str.length < 2) {
      str = '0' + str;
    }
    return str;
  }, [value, padStart, decimalPlaces]);

  return (
    <span className={cn('inline-flex items-center font-mono tabular-nums', className)}>
      {formattedString.split('').map((char, i) => (
        <Digit key={i} digit={char} />
      ))}
    </span>
  );
}

export function Clock({ className }: { className?: string }) {
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <span className={cn('font-mono text-xs tabular-nums', className)}>--:--:--</span>;
  }

  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <span className={cn('font-mono text-xs tabular-nums', className)}>
      {istFormatter.format(time)}
    </span>
  );
}
