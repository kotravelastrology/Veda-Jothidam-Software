'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useSettings, toDashaOptions, toEngineOptions } from '@/src/ui/SettingsPanel';
import { PageEyebrow } from '@/src/ui/PageEyebrow';
import { computeBook } from '../book/actions';
import { BlockView, groupBlocks, TONE } from '../book/blocks';
import { PLANET_TA } from '../worksheet/worksheetStyle';

/** The screen is Tamil: the planets' names, "Sign" and "Total" in the tables and headings of the book's English pages. */
const WORDS: Record<string, string> = { Sign: 'ராசி', Total: 'மொத்தம்', Lagna: 'லக்னம்', Sarva: 'சர்வம்', ...PLANET_TA };
const tamil = (text: string) => String(text).replace(/\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu|Lagna|Sign|Total|Sarva)\b/g, (w) => WORDS[w] ?? w);
function tamilize(b: any) {
  const heading = b.heading ? tamil(b.heading).replace('Bhinnashtakavarga', 'பின்னாஷ்டகவர்க்கம்').replace('(bindus)', '— பிந்துக்கள்').replace('Sarvashtakavarga', 'சர்வாஷ்டகவர்க்கம்') : b.heading;
  if (b.kind !== 'table') return { ...b, heading };
  return { ...b, heading, columns: b.columns.map((c: string) => tamil(c)), rows: b.rows.map((r: string[]) => [tamil(r[0]), ...r.slice(1)]) };
}

/** A planet's contributor table goes beside its chart of bindus. */
function arrange(blocks: any[]) {
  const out: any[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i]; const next = blocks[i + 1];
    if (b.kind === 'table' && /Bhinnashtakavarga$/.test(b.heading ?? '') && next?.kind === 'signGrid') { out.push({ pair: [tamilize(b), tamilize(next)] }); i += 1; } else out.push({ single: tamilize(b) });
  }
  return out;
}

/**
 * Ashtakavarga, as the horoscope book prints it (pages 14-17), one screen: for each planet and the Lagna a chart with the bindus of every sign and the table
 * of which contributor gave each (the Bhinnashtakavarga), then the Sarvashtakavarga with its chart and the Chancha Chakra, then the reductions. The
 * figures are the book pages' own (src/report/horoscopeBook/ashtakavargaPage.js, checked cell by cell against the Parashara's Light sample).
 */

const TABS = [
  { key: 'bav', label: 'பின்னாஷ்டகவர்க்கம்', ids: ['p14', 'p15'], note: 'ஒவ்வொரு கிரகத்துக்கும்: எந்தக் கிரகம் எந்த ராசியில் பிந்து (புள்ளி) தந்தது என்ற அட்டவணையும், ஒவ்வொரு ராசியிலும் மொத்தப் புள்ளிகளும் கட்டத்தில்.' },
  { key: 'sav', label: 'சர்வாஷ்டகவர்க்கம்', ids: ['p16'], note: 'ஏழு கிரகங்களின் புள்ளிகளும் ராசி வாரியாக (மொத்தம் 337), கட்டமும் சஞ்சார சக்கரமும்.' },
  { key: 'red', label: 'சுருக்கல்கள்', ids: ['p17'], note: 'திரிகோண, ஏகாதிபத்திய சுருக்கலுக்கு முன்னும் பின்னும் ஒவ்வொரு கிரகத்தின் கட்டம்; பிண்டங்கள்.' },
] as const;

export default function AshtakavargaView() {
  const { settings } = useSettings();
  const [party, setParty] = useState<Party | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('bav');
  const [book, setBook] = useState<Awaited<ReturnType<typeof computeBook>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setBook(null); return undefined; }
    let cancelled = false;
    setLoading(true); setError(null);
    const base = party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } }
      : { form: party.input, engine: toEngineOptions(settings) };
    computeBook({ ...base, sections: TABS.flatMap((t) => [...t.ids]), dashaOptions: toDashaOptions(settings) })
      .then((r) => { if (!cancelled) setBook(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setBook(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, settings.ayanamsha, settings.houseSystem, settings.nodeType]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = TABS.find((t) => t.key === tab) ?? TABS[0];
  const sections = (book?.sections ?? []).filter((s: any) => (current.ids as readonly string[]).includes(s.id));
  const bar = TONE.rose.bar;
  const pill = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm transition ${on ? 'border-saffron bg-saffron/20 font-semibold text-ink' : 'border-line bg-surface text-ink hover:border-saffron'}`;

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-3 sm:p-6">
      <header className="mb-4">
        <PageEyebrow fallback="Ashtakavarga" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold text-ink sm:text-3xl">அஷ்டகவர்க்கம்</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          ஒவ்வொரு கிரகத்துக்கும் தனிக் கட்டம்: எந்த ராசியில் எத்தனை பிந்துக்கள், எந்தக் கிரகம் தந்தது என்ற அட்டவணையுடன். ஜாதக நூலின் 14–17 பக்கங்களில் உள்ளபடியே.
        </p>
      </header>

      <div className="mb-4"><PartyChooser party={party} setParty={setParty} loading={loading} /></div>
      {error && <p className="mb-3 rounded-xl bg-rose-soft p-3 text-sm text-rose">⚠️ {error}</p>}
      {loading && !book && <p className="p-4 text-sm text-ink-soft">கணக்கிடப்படுகிறது…</p>}

      {book && (
        <>
          <div className="mb-2 flex flex-wrap gap-2" role="tablist">
            {TABS.map((t) => <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className={pill(tab === t.key)}>{t.label}</button>)}
          </div>
          <p className="mb-4 text-xs text-ink-soft">{current.note}</p>
          {sections.map((s: any) => (
            <section key={s.id} className="mb-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <header className="border-b border-line bg-rose/10 px-4 py-2"><h2 className="text-base font-bold text-ink">{s.ta}</h2><p className="text-[11px] text-ink-soft">{s.en} · PL9 ப. {s.page}</p></header>
              <div className="space-y-5 p-4">
                {tab === 'bav'
                  ? arrange(s.doc.blocks).map((x: any, xi: number) => (x.pair ? (
                    <div key={xi} className="grid items-start gap-4 rounded-2xl border border-line/70 p-3 lg:grid-cols-[1fr_auto]">
                      <BlockView b={x.pair[0]} bar={bar} compact />
                      <BlockView b={x.pair[1]} bar={bar} />
                    </div>
                  ) : <BlockView key={xi} b={x.single} bar={bar} />))
                  : groupBlocks(s.doc.blocks.map(tamilize)).map((g: any, gi: number) => (
                    g.grid
                      ? <div key={gi} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{g.blocks.map((b: any, i: number) => <BlockView key={i} b={b} bar={bar} compact />)}</div>
                      : <BlockView key={gi} b={g.blocks[0]} bar={bar} />
                  ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
