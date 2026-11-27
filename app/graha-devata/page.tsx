import type { Metadata } from 'next';
import { PageEyebrow } from '@/src/ui/PageEyebrow';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PLANETS, grahaDevataBooks } = require('@/src/report/grahaDevata');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PLANET_TA } = require('@/src/sources/tamilNames');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { citeTa } = require('@/src/sources/citeTa');

export const metadata: Metadata = {
  title: 'கிரக தேவதைகள் (Planetary deities) — Kotravel Vedic Astrology',
  description: 'The deities of the nine planets, as each book gives them, side by side: Annamalai University\'s course book (three deities each), BPHS 3.18 and Hora Ratnam 1.115.',
};

interface Name { ta: string; en: string }
interface Level { key: string; ta: string; en: string }
interface Book {
  id: string;
  source: { title: string; author: string; pageLocus: string };
  levels: Level[];
  rows: ({ planet: string; section?: string; page?: number } & Record<string, Name | string | number | undefined>)[];
  note?: Name;
}

/**
 * PL9's "Planetary deities" (Charts menu): a reference table, one table a book, in the order most explained first. Each book's names are
 * as it prints them; nothing is merged and no deity is recommended for a chart.
 */
export default function GrahaDevataPage() {
  const books: Book[] = grahaDevataBooks();
  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Planetary deities" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கிரக தேவதைகள்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒவ்வொரு கிரகத்துக்கும் நூல்கள் சொல்லும் தேவதைகள், நூல் வாரியாகத் தனித்தனியே. அதிகம் விளக்கும் நூல் முதலில். இது ஒரு குறிப்பு அட்டவணை; எந்த ஜாதகத்துக்கும் எந்தத் தேவதையையும் பரிந்துரைக்கவில்லை.
        </p>
      </header>

      {books.map((b) => (
        <section key={b.id} className="bg-surface border border-line rounded-2xl p-4 mb-4">
          <h2 className="font-semibold text-ink">{citeTa(b.source)}</h2>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-ink-soft border-b border-line">
                  <th className="py-1 pr-3 font-semibold">கிரகம்</th>
                  {b.levels.map((l) => <th key={l.key} className="py-1 pr-3 font-semibold">{l.ta}</th>)}
                  {b.id === 'annamalai' && <th className="py-1 pr-3 font-semibold">பக்கம்</th>}
                </tr>
              </thead>
              <tbody>
                {PLANETS.map((p: string) => {
                  const r = b.rows.find((x) => x.planet === p);
                  return (
                    <tr key={p} className="border-t border-line/40">
                      <td className="py-1 pr-3 text-ink">{PLANET_TA[p]}</td>
                      {b.levels.map((l) => {
                        const n = r?.[l.key] as Name | undefined;
                        return <td key={l.key} className="py-1 pr-3 text-ink">{n ? n.ta : <span className="text-ink-soft">—</span>}</td>;
                      })}
                      {b.id === 'annamalai' && <td className="py-1 pr-3 text-ink-soft tabular-nums">{r ? `${r.section}, ப.${r.page}` : ''}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {b.note && <p className="text-xs text-ink-soft mt-2">{b.note.ta}</p>}
        </section>
      ))}

      <p className="text-xs text-ink-soft">
        பிருஹத் பராசரரும் ஹோரா ரத்னமும் சூரியன் முதல் சனி வரை ஏழு கிரகங்களுக்கு ஒரே தேவதைகளைச் சொல்கின்றன. அண்ணாமலை நூலின் "அதி தேவதை" நிரல் சூரியன், சந்திரன், புதன், குரு, சுக்கிரன் ஆகிய ஐந்துக்கும் அவற்றோடு ஒத்துப்போகிறது. சனிக்கு அது பிரஜாபதி என்கிறது (பராசரர்: பிரம்மா). செவ்வாய்க்கு அது பூமி என்கிறது; பராசரரின் சுப்பிரமணியர் அந்நூலின் "தேவதை" நிரலில் உள்ளார்.
      </p>
    </div>
  );
}
