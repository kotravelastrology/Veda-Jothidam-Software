'use client';

import { useMemo, useState } from 'react';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const S = require('../../src/report/samudrika');

/**
 * The signs of the body of BPHS ch.81 (a woman's body, from the soles of the feet to the hair) and ch.82 (moles, marks and whorls), as a lookup by the feature seen.
 * Nothing here is read from the birth chart. The book's wording of the effects is kept; this is for the astrologer.
 */

const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';
const KIND_TA: Record<string, string> = { good: 'நல்லது', bad: 'தீயது', neutral: 'குறிப்பு' };
const KIND_STYLE: Record<string, string> = { good: 'text-ink', bad: 'text-rose', neutral: 'text-ink-soft' };

function loc(chapter: number, verses: string, page: string) {
  const source: any = { title: S.DATA.source.title, author: S.DATA.source.author };
  source.pageLocus = `Chapter ${chapter} v.${verses}, printed ${page.includes('-') ? 'pp.' : 'p.'}${page}`;
  return citeTa(source);
}

export default function SamudrikaView() {
  const [which, setWhich] = useState<'women' | 'marks'>('women');
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const book = S.BOOKS[which];
  const sections = useMemo(() => S.sections(which), [which]);
  const hits = useMemo(() => S.search(which, query, kind), [which, query, kind]);
  const bySection = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const h of hits) m.set(h.sectionId, [...(m.get(h.sectionId) ?? []), h]);
    return m;
  }, [hits]);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Samudrika" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">உடல் அடையாளங்கள், மச்சம் (சாமுத்திரிகா)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          பிருஹத் பராசர ஹோரா சாஸ்திரம் அத். 81 (பெண்ணின் உடல் — உள்ளங்கால் முதல் தலைமுடி வரை) மற்றும் அத். 82 (மச்சம், குறிகள், முடிச்சுழி). ஜாதகத்திலிருந்து கணிக்கப்படுவதில்லை: உடலில் காணும் அடையாளத்தைத் தேடிப் பார்க்கும் நூற்குறிப்பு.
          நூலின் சொற்கள் மாற்றப்படவில்லை; இது ஜோதிடர் பயன்பாட்டுக்கு; தீர்ப்பு அல்ல.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-3 items-end text-xs">
          <label className="text-ink-soft">அத்தியாயம்
            <select value={which} onChange={(e) => setWhich(e.target.value as 'women' | 'marks')} className={`ml-1 ${input}`}>
              <option value="women">81 — பெண்ணின் உடல் அங்கங்கள்</option>
              <option value="marks">82 — மச்சம், குறிகள், முடிச்சுழி</option>
            </select>
          </label>
          <label className="text-ink-soft">தேடு <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="எ.கா. கண், மூக்கு, விதவை" className={`ml-1 w-48 ${input}`} /></label>
          <label className="text-ink-soft">வகை
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={`ml-1 ${input}`}>
              <option value="">எல்லாம்</option>
              <option value="good">நல்லது</option>
              <option value="bad">தீயது</option>
              <option value="neutral">குறிப்பு</option>
            </select>
          </label>
          <span className="text-ink-soft">{hits.length} குறிப்புகள் / {sections.reduce((n: number, s: any) => n + s.items.length, 0)}</span>
        </div>
        <p className="text-[11px] text-ink-soft mt-2">{book.applies.ta} ({loc(book.chapter, book.applies.verses, book.applies.page)})</p>
      </section>

      {sections.filter((s: any) => bySection.has(s.id)).map((s: any) => (
        <section key={s.id} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
          <h2 className="font-semibold text-ink">{s.part} <span className="text-[11px] text-ink-soft font-normal">· {loc(s.chapter, s.verses, s.page)}</span></h2>
          <ul className="mt-2 space-y-1.5 text-xs">
            {bySection.get(s.id)!.map((h: any, i: number) => (
              <li key={i} className="flex gap-2">
                <span className={`shrink-0 w-12 ${KIND_STYLE[h.kind]}`}>{KIND_TA[h.kind]}</span>
                <span className="text-ink">{h.feature} <span className="text-ink-soft">→</span> <strong className={KIND_STYLE[h.kind]}>{h.effect}</strong></span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {hits.length === 0 && <p className="text-sm text-ink-soft">பொருந்தும் குறிப்பு இல்லை.</p>}

      <section className="bg-surface border border-line rounded-2xl p-4 mt-4 text-xs text-ink-soft">
        <p>{S.DATA.scopeTa}</p>
      </section>
    </main>
  );
}
