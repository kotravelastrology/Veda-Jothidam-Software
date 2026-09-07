'use client';

import { useState, useEffect } from 'react';

export function StatusBar() {
  const [time, setTime] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink text-surface border-t border-ink-soft/20 px-4 py-1 flex items-center justify-between text-xs h-8 fixed bottom-0 left-0 right-0">
      <div className="flex items-center gap-4">
        <span className="text-ink-soft/70">{status}</span>
        <span className="text-ink-soft/50">v1.0.0</span>
      </div>
      <div className="text-ink-soft/70">{time || '--:--:--'}</div>
    </div>
  );
}
