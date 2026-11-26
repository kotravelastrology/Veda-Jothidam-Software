'use client';

import { useEffect, useState } from 'react';
import { readLang, switchLang, type Lang } from './lang';

/** The top bar's language button: EN switches to English, த back to Tamil (src/i18n/lang.ts). */
export function LangToggle() {
  const [lang, setLang] = useState<Lang>('ta');
  useEffect(() => { setLang(readLang()); }, []);
  const next: Lang = lang === 'en' ? 'ta' : 'en';
  return (
    <button
      onClick={() => switchLang(next)}
      className="grid place-items-center size-9 rounded-lg hover:bg-bar-ink/10 text-xs font-bold"
      // fixed in both languages, so the way back is always readable
      aria-label={next === 'en' ? 'Switch to English' : 'தமிழுக்கு மாறு'}
      title={next === 'en' ? 'Switch to English' : 'தமிழுக்கு மாறு'}
      data-no-translate
      data-testid="lang-toggle"
    >
      {next === 'en' ? 'EN' : 'த'}
    </button>
  );
}
