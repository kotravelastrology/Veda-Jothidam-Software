'use client';

import Link from 'next/link';
import { useNavigation } from './navigationContext';

export function Breadcrumb() {
  const { breadcrumb } = useNavigation();

  return (
    <nav className="bg-surface border-b border-line/30 px-4 py-2 text-sm flex items-center gap-1 sticky top-10 z-30">
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <span className="text-ink-soft/50 mx-1">/</span>}
          <span className={index === breadcrumb.length - 1 ? 'font-semibold text-ink' : 'text-ink-soft'}>
            {item}
          </span>
        </div>
      ))}
    </nav>
  );
}
