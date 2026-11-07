'use client';

import { useEffect, useMemo, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useSettings, toDashaOptions, toEngineOptions } from '@/src/ui/SettingsPanel';
import { PageEyebrow } from '@/src/ui/PageEyebrow';
import { bookCatalogue, computeBook } from './actions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaultSelection } = require('../../src/report/horoscopeBook/bookSelection');
import { BlockView, TONE, groupBlocks, type Tone } from './blocks';

/**
 * The horoscope book (PL9's 88-page print, aniruddha_HC4, and the pages after it): every page of that book is listed in its family; click the pages
 * wanted and make the book. Pages this software already builds can be picked; the rest are listed as coming, with their
 * page numbers in the sample. The book has a cover, a contents page and one page group for each chosen page, in a new design:
 * the page printed is the page shown (Ctrl+P, and "save as PDF" from the print dialog).
 */

type Catalogue = Awaited<ReturnType<typeof bookCatalogue>>;
type Book = Awaited<ReturnType<typeof computeBook>>;

const dmy = (date: string) => { const [y, m, d] = date.split('-'); return `${d}-${m}-${y}`; };
const RASI_NAMES = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

function Cover({ book }: { book: Book }) {
  const p = book.particulars;
  const facts: [string, string][] = [
    ['கிழமை', p.weekdayTa],
    ['நட்சத்திரம்', `${p.nakshatra.name} · ${p.nakshatra.pada}-ஆம் பாதம்`],
    ['ராசி', p.moon.rasiTa],
    ['லக்னம்', p.lagna.rasiTa],
    ['திதி', `${p.tithi.paksha} ${p.tithi.name}`],
    ['பிறந்த தசை', `${p.dasha.lordTa} (${p.dasha.balance.years} ஆ ${p.dasha.balance.months} மா ${p.dasha.balance.days} நா இருப்பு)`],
  ];
  return (
    <section className="relative flex min-h-[34rem] flex-col items-center justify-center overflow-hidden rounded-3xl border border-saffron/40 bg-gradient-to-br from-[#fff4df] via-[#fde3b8] to-[#f6c783] p-8 text-center shadow-lg print:min-h-[250mm] print:rounded-none print:shadow-none dark:from-[#2d2013] dark:via-[#3a2916] dark:to-[#4a3219]">
      <svg viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] opacity-25" fill="none" stroke="#c96a12" strokeWidth="1.5" aria-hidden>
        <circle cx="200" cy="200" r="190" /><circle cx="200" cy="200" r="160" /><circle cx="200" cy="200" r="110" />
        {Array.from({ length: 12 }, (_, i) => { const a = (i * 30 * Math.PI) / 180; return <line key={i} x1={200 + 110 * Math.cos(a)} y1={200 + 110 * Math.sin(a)} x2={200 + 190 * Math.cos(a)} y2={200 + 190 * Math.sin(a)} />; })}
      </svg>
      <svg viewBox="0 0 400 400" className="pointer-events-none absolute -bottom-28 -left-24 h-[24rem] w-[24rem] opacity-20" fill="none" stroke="#c96a12" strokeWidth="2" aria-hidden>
        <rect x="20" y="20" width="360" height="360" /><rect x="110" y="110" width="180" height="180" />
        <path d="M20 20 L110 110 M380 20 L290 110 M20 380 L110 290 M380 380 L290 290 M200 20 L200 110 M200 290 L200 380 M20 200 L110 200 M290 200 L380 200" />
      </svg>
      <p className="relative text-4xl" aria-hidden>🕉️</p>
      <p className="relative mt-2 text-sm font-semibold tracking-[0.3em] text-ink-soft">ஜாதக நூல்</p>
      <h2 className="relative mt-3 font-[family-name:var(--font-tamil-serif)] text-5xl font-bold text-ink sm:text-6xl">{book.name || 'ஜாதகம்'}</h2>
      <p className="relative mt-4 text-base text-ink tabular-nums">{dmy(p.birth.date)} · {p.birth.time}</p>
      <p className="relative text-base text-ink">{p.birth.place ?? ''}</p>
      <dl className="relative mt-8 grid w-full max-w-xl grid-cols-2 gap-2 text-left sm:grid-cols-3">
        {facts.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/60 px-3 py-2 backdrop-blur-0 dark:bg-black/20 print:bg-white/70">
            <dt className="text-[11px] font-semibold text-ink-soft">{k}</dt>
            <dd className="text-sm font-bold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="relative mt-8 text-xs text-ink-soft">Kotravel Vedic Astrology · {p.ayanamsha.name} அயனாம்சம்</p>
    </section>
  );
}

function Contents({ book }: { book: Book }) {
  return (
    <section className="break-before-page rounded-3xl border border-line bg-surface p-6 shadow-sm print:rounded-none print:border-0 print:shadow-none">
      <h2 className="mb-4 font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">பொருளடக்கம்</h2>
      <ol className="space-y-1.5">
        {book.sections.map((s: any, i: number) => (
          <li key={s.id}>
            <a href={`#book-${s.id}`} className="flex items-baseline gap-3 rounded-lg px-2 py-1.5 hover:bg-saffron/10">
              <span className="w-8 shrink-0 text-right text-sm font-bold tabular-nums text-saffron">{s.page}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">{s.ta}</span>
                <span className="block text-[11px] text-ink-soft">{s.en} · {s.page > 88 ? 'கூடுதல் ப.' : 'PL9 ப.'} {s.page}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Page({ s, n, tone }: { s: any; n: number; tone: Tone }) {
  const t = TONE[tone];
  return (
    <section id={`book-${s.id}`} className="break-before-page scroll-mt-4 overflow-hidden rounded-3xl border border-line bg-surface shadow-sm print:rounded-none print:border-0 print:shadow-none">
      <header className={`flex items-center gap-3 border-b border-line px-5 py-3 ${t.soft} print:bg-gray-100`}>
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${t.bar} text-lg font-bold text-white print:text-black`}>{n}</span>
        <div className="min-w-0">
          <p className={`text-[11px] font-bold tracking-wide ${t.text}`}>{s.family}</p>
          <h3 className="font-[family-name:var(--font-tamil-serif)] text-xl font-bold leading-tight text-ink print:text-black">{s.ta}</h3>
          <p className="text-[11px] text-ink-soft print:text-black">{s.en}</p>
          {s.audience === 'astrologer' && <p className="mt-0.5 text-[11px] font-semibold text-rose print:text-black">ஜோதிடர் பயன்பாட்டுக்கு — நூலின் சொற்கள்; வாடிக்கையாளருக்கு அப்படியே தர வேண்டாம்</p>}
        </div>
      </header>
      <div className="space-y-5 p-5">
        {groupBlocks(s.doc.blocks).map((group: any, gi: number) => (
          group.grid ? (
            <div key={gi} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
              {group.blocks.map((b: any, i: number) => <BlockView key={i} b={b} bar={t.bar} compact />)}
            </div>
          ) : <BlockView key={gi} b={group.blocks[0]} bar={t.bar} />
        ))}
      </div>
    </section>
  );
}

export default function BookView() {
  const { settings } = useSettings();
  const [party, setParty] = useState<Party | null>(null);
  const [catalogue, setCatalogue] = useState<Catalogue>([]);
  const [selected, setSelected] = useState<string[]>([]);
  /** whether the pages for the astrologer (the female horoscopy, the curses) are in the "all" buttons and the choice */
  const [withAstrologer, setWithAstrologer] = useState(false);
  /** the signs of the father's Ascendant and Moon ('' = not given), for the page that reads the native against the father's chart */
  const [fatherLagna, setFatherLagna] = useState('');
  const [fatherMoon, setFatherMoon] = useState('');
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookCatalogue().then((c) => {
      setCatalogue(c);
      setSelected(defaultSelection(c));
    }).catch(() => setCatalogue([]));
  }, []);

  const allChosen = useMemo(() => defaultSelection(catalogue, { withAstrologer }) as string[], [catalogue, withAstrologer]);
  const astrologerIds = useMemo(() => catalogue.flatMap((f: any) => f.items.filter((i: any) => i.built && i.audience === 'astrologer').map((i: any) => i.id)) as string[], [catalogue]);
  const setWithAstrologerPages = (on: boolean) => {
    setWithAstrologer(on);
    setSelected((cur) => (on ? [...new Set([...cur, ...astrologerIds])] : cur.filter((x) => !astrologerIds.includes(x))));
  };
  const totals = useMemo(() => {
    const all = catalogue.flatMap((f: any) => f.items);
    return { pages: all.reduce((n: number, i: any) => n + i.pages, 0), builtPages: all.reduce((n: number, i: any) => n + i.sections.length, 0) };
  }, [catalogue]);
  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleFamily = (family: any) => {
    const ids = family.items.filter((i: any) => i.built && (withAstrologer || i.audience !== 'astrologer')).map((i: any) => i.id);
    const all = ids.every((id: string) => selected.includes(id));
    setSelected((cur) => (all ? cur.filter((x) => !ids.includes(x)) : [...new Set([...cur, ...ids])]));
  };
  const toneOf = useMemo(() => Object.fromEntries(catalogue.flatMap((f: any) => f.items.map((i: any) => [i.id, f.tone]))) as Record<string, Tone>, [catalogue]);

  const make = async () => {
    if (!party) return;
    setLoading(true); setError(null); setBook(null);
    try {
      const base = party.kind === 'profile'
        ? { profile: { profileId: party.profileId, revision: party.revision } }
        : { form: party.input, engine: toEngineOptions(settings) };
      const father = fatherLagna !== '' && fatherMoon !== '' ? { lagnaSign: Number(fatherLagna), moonSign: Number(fatherMoon) } : undefined;
      setBook(await computeBook({ ...base, sections: selected, dashaOptions: toDashaOptions(settings), ...(father ? { father } : {}) }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); }
  };

  const pill = 'rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink transition hover:border-saffron hover:bg-saffron/10';
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-3 sm:p-6">
      <div className="print:hidden">
        <header className="mb-4">
          <PageEyebrow fallback="Horoscope book" />
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold text-ink sm:text-3xl">ஜாதக நூல்</h1>
          <p className="mt-1 max-w-3xl text-sm text-ink-soft">
            PL9-இன் முழுமையான ஜாதக நூலின் ஒவ்வொரு பகுதியும் இங்கே. வேண்டிய பக்கங்களைத் தொட்டுத் தேர்ந்து, ஒரே நூலாக உருவாக்கலாம்: அட்டை, பொருளடக்கம், பக்கங்கள். ஆரம்பிக்கும் முன் யாருடைய ஜாதகம் என்று தேர்ந்தெடுங்கள்.
            {totals.pages > 0 && <> இப்போது {totals.pages} பக்கங்களில் {totals.builtPages} கட்டப்பட்டுள்ளன; மீதம் பட்டியலில் "விரைவில்" என்று உள்ளன.</>}
          </p>
        </header>

        <div className="mb-4"><PartyChooser party={party} setParty={(x) => { setParty(x); setBook(null); }} loading={loading} /></div>

        <section className="mb-4 rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-4" aria-label="பக்கங்களைத் தேர்வு செய்">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-2 font-[family-name:var(--font-tamil-serif)] text-base font-bold text-ink">நூலில் எவை வேண்டும்?</h2>
            <button type="button" className={pill} onClick={() => setSelected(allChosen)}>அனைத்தும்</button>
            <button type="button" className={pill} onClick={() => setSelected([])}>எதுவுமில்லை</button>
            {astrologerIds.length > 0 && (
              <label className="flex items-center gap-1 text-xs text-ink-soft" title="பெண் ஜாதகம், முன்பிறப்புச் சாபங்கள்: நூலின் கடுமையான சொற்கள்; ஜோதிடரின் வாசிப்புக்கு, வாடிக்கையாளருக்கு அப்படியே தர வேண்டாம்">
                <input type="checkbox" checked={withAstrologer} onChange={(e) => setWithAstrologerPages(e.target.checked)} />
                ஜோதிடர் பயன்பாட்டுப் பக்கங்களையும் சேர் ({astrologerIds.length})
              </label>
            )}
            <span className="ml-auto text-xs text-ink-soft">{selected.length} பகுதிகள் தேர்வு</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {catalogue.map((f: any) => {
              const t = TONE[f.tone as Tone];
              const ids = f.items.filter((i: any) => i.built && (withAstrologer || i.audience !== 'astrologer')).map((i: any) => i.id);
              const allOn = ids.length > 0 && ids.every((id: string) => selected.includes(id));
              return (
                <div key={f.key} className="relative overflow-hidden rounded-xl border border-line bg-surface-2/30 p-3 pl-4">
                  <span className={`absolute inset-y-0 left-0 w-1.5 ${t.bar}`} aria-hidden />
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`icon-chip ${t.chip} size-8 text-base`} aria-hidden><span>{f.icon}</span></span>
                    <h3 className="text-sm font-bold text-ink">{f.ta}</h3>
                    {ids.length > 0 && <button type="button" onClick={() => toggleFamily(f)} className="ml-auto text-[11px] text-saffron hover:underline">{allOn ? 'நீக்கு' : 'அனைத்தும்'}</button>}
                  </div>
                  <ul className="space-y-1">
                    {f.items.map((i: any) => {
                      const on = selected.includes(i.id);
                      return (
                        <li key={i.id}>
                          <button
                            type="button"
                            disabled={!i.built}
                            aria-pressed={i.built ? on : undefined}
                            onClick={() => toggle(i.id)}
                            className={`flex w-full items-start gap-2 rounded-lg border px-2 py-1.5 text-left text-xs transition ${i.built ? (on ? 'border-saffron bg-saffron/15' : 'border-line bg-surface hover:border-saffron/60') : 'cursor-not-allowed border-dashed border-line/70 bg-transparent opacity-60'}`}
                          >
                            <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border text-[10px] ${i.built && on ? 'border-saffron bg-saffron text-white' : 'border-line'}`} aria-hidden>{i.built && on ? '✓' : ''}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold text-ink">{i.ta}</span>
                              <span className="block text-[10px] text-ink-soft">{i.from > 88 ? 'கூடுதல் ப.' : 'PL9 ப.'} {i.from}{i.to !== i.from ? `–${i.to}` : ''}{i.pages > 1 ? ` (${i.pages} பக்கங்கள்)` : ''}</span>
                            </span>
                            {i.built && i.audience === 'astrologer' && <span className="shrink-0 rounded-full bg-rose-soft px-2 py-0.5 text-[10px] text-rose">ஜோதிடருக்கு</span>}
                            {!i.built && <span className="shrink-0 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-ink-soft">விரைவில்</span>}
                            {i.built && !i.complete && <span className="shrink-0 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-ink-soft">{i.sections.length}/{i.pages}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={make} disabled={!party || loading || selected.length === 0} className="rounded-full bg-saffron px-5 py-2 text-sm font-bold text-ink shadow-sm disabled:opacity-50">
              {loading ? 'நூல் உருவாகிறது…' : '📖 நூலை உருவாக்கு'}
            </button>
            {book && <button type="button" onClick={() => window.print()} className={pill}>🖨 அச்சிடு / PDF (Ctrl+P)</button>}
            {!party && <span className="text-xs text-ink-soft">முதலில் மேலே ஜாதகத்தைத் தேர்ந்தெடுங்கள்.</span>}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
            <span className="font-semibold text-ink">தந்தையின் ஜாதகம் (விருப்பம் — பக்கம் 141-இன் தந்தை பற்றிய கூற்றுகளுக்கு):</span>
            <label>லக்னம்
              <select value={fatherLagna} onChange={(e) => setFatherLagna(e.target.value)} className="ml-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-ink">
                <option value="">—</option>
                {RASI_NAMES.map((r, i) => <option key={r} value={String(i)}>{r}</option>)}
              </select>
            </label>
            <label>சந்திர ராசி
              <select value={fatherMoon} onChange={(e) => setFatherMoon(e.target.value)} className="ml-1 rounded border border-line bg-surface-2 px-1 py-0.5 text-ink">
                <option value="">—</option>
                {RASI_NAMES.map((r, i) => <option key={r} value={String(i)}>{r}</option>)}
              </select>
            </label>
            {((fatherLagna === '') !== (fatherMoon === '')) && <span className="text-rose">இரண்டையும் தேர்ந்தால் மட்டுமே பயன்படும்.</span>}
          </div>
          {error && <p className="mt-2 text-sm text-rose">⚠️ {error}</p>}
        </section>
      </div>

      {book && (
        <article className="print-area space-y-6 print:space-y-0">
          <Cover book={book} />
          <Contents book={book} />
          {book.sections.map((s: any, i: number) => <Page key={s.id} s={s} n={s.page} tone={toneOf[s.id] ?? 'saffron'} />)}
        </article>
      )}
    </main>
  );
}
