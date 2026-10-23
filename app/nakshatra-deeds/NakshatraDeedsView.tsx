'use client';

import { useEffect, useState } from 'react';
import { computeNakshatraDeedsTable, searchNakshatraDeeds } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * The deeds each nakshatra suits (Kalyanraman, Muhoortha Sangraha vol. 1 ch. 9): pick a star to read its two
 * lists as the book prints them (in English), or search a deed — Tamil or English — to see which stars list it.
 */

const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';
const KIND_ORDER = ['STHIRA', 'CHARA', 'MISRA', 'UGRA', 'KSHIPRA', 'MRIDU', 'TEEKSHNA'];

export default function NakshatraDeedsView() {
  const [table, setTable] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sel, setSel] = useState<number>(0);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => { computeNakshatraDeedsTable().then(setTable).catch((e) => setError(String(e))); }, []);

  const search = (q: string) => {
    if (!q.trim()) { setFound(null); return; }
    setSearching(true);
    searchNakshatraDeeds(q).then(setFound).catch((e) => setError(String(e))).finally(() => setSearching(false));
  };

  const star = table?.stars.find((s: any) => s.index === sel);
  const cls = star ? table.classes[star.classKey] : null;
  const mk = star?.mukhaKey ? table.mukha[star.mukhaKey] : null;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Nakshatras and Suitable Deeds</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நட்சத்திரமும் காரியமும்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          கல்யாணராமன் (முகூர்த்த சங்கிரகம், தொகுதி 1, அத்தியாயம் 9): ஒவ்வொரு நட்சத்திரமும் எந்தக் காரியங்களுக்கு ஏற்றது. மற்ற நூல்கள் காரியத்துக்கு நட்சத்திரம் தருகின்றன; இது நட்சத்திரத்துக்குக் காரியம் தருகிறது — அதே பொருள் தலைகீழாக.
          காரியங்கள் நூலின் ஆங்கிலச் சொற்களிலேயே; தலைப்புகளும் குறிப்புகளும் தமிழில்.
        </p>
      </header>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <h2 className="text-sm font-semibold text-ink mb-2">காரியத்திலிருந்து நட்சத்திரம்</h2>
        <form className="flex flex-wrap gap-2 items-center" onSubmit={(e) => { e.preventDefault(); search(query); }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="திருமணம், கிரகப்பிரவேசம், loan, vehicles …" className={`w-72 ${input}`} />
          <button type="submit" disabled={searching || !query.trim()} className="px-3 py-1.5 rounded bg-ink text-surface font-semibold disabled:opacity-50">{searching ? 'தேடுகிறது…' : 'தேடு'}</button>
          {found && <button type="button" onClick={() => { setQuery(''); setFound(null); }} className="px-2 py-1 text-xs text-ink-soft underline">அழி</button>}
        </form>
        <p className="text-[11px] text-ink-soft mt-1">தமிழிலும் ஆங்கிலத்திலும்; பல சொல் கொடுத்தால் எல்லாம் உள்ள காரியங்கள் மட்டும். திருமணம், கிரகப்பிரவேசம், உபநயனம், கடன், வாகனம், கட்டுமானம், மருந்து, பயணம், வழக்கு, விதை, வேலை … அறிந்த தமிழ்ச் சொற்கள்.</p>
        {found && (
          <div className="mt-3">
            {found.unknown.length > 0 && <p className="text-[11px] text-rose mb-1">தேடலில் சேராத சொற்கள்: {found.unknown.join(', ')}</p>}
            {found.stars.length === 0 ? <p className="text-xs text-ink-soft">இந்தச் சொற்களுடன் எந்த நட்சத்திரத்திலும் காரியம் இல்லை.</p> : (
              <ul className="text-xs space-y-2">
                {found.stars.map((s: any) => (
                  <li key={s.index} className="border-b border-line/40 pb-1.5">
                    <button type="button" onClick={() => { setSel(s.index); window.scrollTo({ top: document.getElementById('star-detail')?.offsetTop ?? 0, behavior: 'smooth' }); }} className="font-semibold text-ink underline">{s.nameTa}</button>
                    <span className="text-ink-soft"> · {table?.classes[s.classKey].nameTa} · {s.count} இடம்</span>
                    <span className="block text-ink-soft">{[...s.good, ...s.also].slice(0, 6).join(' · ')}{s.count > 6 ? ' …' : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {table && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நட்சத்திரம்</h2>
            <div className="flex flex-wrap gap-1.5">
              {table.stars.map((s: any) => (
                <button key={s.index} type="button" onClick={() => setSel(s.index)}
                  className={`px-2 py-1 rounded border text-xs ${sel === s.index ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>{s.nameTa}</button>
              ))}
            </div>
          </section>

          {star && cls && (
            <section id="star-detail" className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-bold text-ink">{star.nameTa} <span className="text-sm font-normal text-ink-soft">({star.nameEn})</span></h2>
              <p className="text-xs text-ink mt-1">
                <strong>{cls.nameTa}</strong> · கிழமை: {cls.vara}{mk && <> · <strong>{mk.nameTa}</strong></>}{star.kula && <> · {table.kulaTa[star.kula]}</>}
              </p>
              <p className="text-[11px] text-ink-soft mt-1">{cls.suitsTa}{cls.borrowsTa ? ` இந்த வகை ${cls.borrowsTa}.` : ''}</p>
              {mk && <p className="text-[11px] text-ink-soft mt-1">{mk.nameTa}: {mk.suitsTa}</p>}

              <h3 className="text-sm font-semibold text-ink mt-4 mb-1">செய்ய ஏற்றது ({star.good.length})</h3>
              <ul className="text-xs list-disc ml-5 columns-1 md:columns-2 gap-6 space-y-0.5">
                {star.good.map((d: string, i: number) => <li key={i} className="text-ink break-inside-avoid">{d}</li>)}
              </ul>
              <h3 className="text-sm font-semibold text-ink mt-4 mb-1">இவற்றுக்கும் தேர்ந்தெடுக்கலாம் ({star.also.length})</h3>
              <ul className="text-xs list-disc ml-5 columns-1 md:columns-2 gap-6 space-y-0.5">
                {star.also.map((d: string, i: number) => <li key={i} className="text-ink break-inside-avoid">{d}</li>)}
              </ul>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-ink-soft">நூலின் அறிமுக உரை (ஆங்கிலம்)</summary>
                <p className="text-[11px] text-ink-soft mt-1">{star.introEn}</p>
              </details>
              <p className="text-[11px] text-ink-soft mt-2">{citeTa(star.source)}</p>
            </section>
          )}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">ஏழு வகைகள்</h2>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ minWidth: 640 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">வகை</th><th className="py-1 pr-2">கிழமை</th><th className="py-1 pr-2">நட்சத்திரங்கள்</th><th className="py-1">ஏற்றவை</th></tr></thead>
                <tbody className="align-top">
                  {KIND_ORDER.map((k) => (
                    <tr key={k} className="border-b border-line/40">
                      <td className="py-1.5 pr-2 font-semibold text-ink">{table.classes[k].nameTa}</td>
                      <td className="py-1.5 pr-2 text-ink">{table.classes[k].vara}</td>
                      <td className="py-1.5 pr-2 text-ink">{table.classes[k].stars.map((i: number) => table.stars[i].nameTa).join(', ')}{k === 'KSHIPRA' ? ', அபிஜித்' : ''}</td>
                      <td className="py-1.5 text-ink-soft">{table.classes[k].suitsTa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2 className="text-sm font-semibold text-ink mt-4 mb-2">மூன்று முகக் குழுக்கள் (ஒவ்வொன்றிலும் ஒன்பது)</h2>
            <ul className="space-y-1.5">
              {Object.values(table.mukha).map((m: any) => (
                <li key={m.nameTa} className="text-ink"><strong>{m.nameTa}:</strong> {m.stars.map((i: number) => table.stars[i].nameTa).join(', ')}<span className="block text-ink-soft">{m.suitsTa}</span></li>
              ))}
            </ul>
            <p className="text-[11px] text-ink-soft mt-3">{citeTa(table.source)} · மொத்தம் {table.counts.good} + {table.counts.also} காரியப் பதிவுகள், 28 பிரிவுகள் (27 நட்சத்திரம் + அபிஜித்).</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-2">வேறுபாடுகள், வாசிப்புகள்</h2>
            <ul className="list-disc ml-5 space-y-1">{table.differences.map((d: any) => <li key={d.id} className="text-ink">{d.textTa}</li>)}</ul>
            <p className="font-semibold text-ink mt-3">இந்தப் பக்கத்தின் வாசிப்புகள்</p>
            <ul className="list-disc ml-5 space-y-1 text-ink-soft">{table.ourReadingsTa.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
          </section>
        </>
      )}
    </main>
  );
}
