'use client';

import { useEffect, useState } from 'react';

function formatIST(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(formatIST(new Date()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="portfolio-clock-time"
      aria-label={time ? `Indian Standard Time ${time}` : 'Indian Standard Time'}
    >
      {time || '--:--:--'}
    </span>
  );
}
