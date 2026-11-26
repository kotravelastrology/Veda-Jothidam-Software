'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HOME_SECTIONS } from '@/src/navigation/homeSections';

/** The tone of each home-page section, as the home page colours it. */
const TONE = {
  saffron: 'bg-saffron/15 text-saffron border-saffron/30',
  indigo: 'bg-indigo/15 text-indigo border-indigo/30',
  teal: 'bg-teal/15 text-teal border-teal/30',
  rose: 'bg-rose/15 text-rose border-rose/30',
} as const;

/**
 * The small label above a page's title: the section of the program the page belongs to (src/navigation/homeSections.js), in that
 * section's colour, and the page's English name, so every page says where it is the same way. `fallback` is shown for a page the
 * home page does not list.
 */
export function PageEyebrow({ fallback }: { fallback?: string }) {
  const pathname = usePathname() ?? '';
  const section = HOME_SECTIONS.find((s) => s.links.some((l) => l.route === pathname));
  const link = section?.links.find((l) => l.route === pathname);
  if (!section || !link) {
    return fallback ? <p className="mb-1 text-xs uppercase tracking-widest text-ink-soft">{fallback}</p> : null;
  }
  return (
    <p className="mb-2 flex flex-wrap items-center gap-2 text-xs">
      <Link href={`/#${section.key}`} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold ${TONE[section.tone]}`}>
        <span aria-hidden>{section.icon}</span>{section.ta}
      </Link>
      <span className="uppercase tracking-widest text-ink-soft">{link.en}</span>
    </p>
  );
}
