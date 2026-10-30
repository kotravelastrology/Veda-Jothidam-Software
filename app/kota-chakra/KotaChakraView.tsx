'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeKotaSanghatta } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * The Kota Chakra (fort) and the Nakshatra Sanghatta Chakra of Narapati's Svarodaya, with the planets of a chosen moment
 * (the classical use — war, a siege, the day's weather) or of a birth chart (a modern use that this book does not give)
 * placed in them. A rule is listed when its placements hold; no rule is chosen over another and no verdict is made.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const KIND_CLASS: Record<string, string> = { fall: 'text-rose', bad: 'text-rose', war: 'text-rose', hold: 'text-teal', calm: 'text-teal', mixed: 'text-ink', planet: 'text-ink', weather: 'text-ink' };

function localNow(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function KotaChakraView() {
  const [mode, setMode] = useState<'transit' | 'birth'>('transit');
  const [when, setWhen] = useState<string>('');
  const [party, setParty] = useState<Party | null>(null);
  const [focus, setFocus] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setWhen(localNow()); }, []);
  useEffect(() => {
    if (mode === 'birth' && !party) { setResult(null); return; }
    if (mode === 'transit' && !when) return;
    let cancelled = false;
    setLoading(true); setError(null);
    const req = mode === 'transit'
      ? { mode, whenIso: new Date(when).toISOString(), focusStar: focus || null }
      : { mode, ...(party!.kind === 'profile' ? { profile: { profileId: party!.profileId, revision: party!.revision } } : { form: party!.input }), focusStar: focus || null };
    computeKotaSanghatta(req as any)
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [mode, when, party, focus]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Kota Chakra · Sanghatta Chakra</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">கோட்டா சக்கரம், சங்கட்ட சக்கரம் — நரபதி ஜயாசார்யர்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          நரபதியின் ஸ்வரோதயம் இவற்றைப் போர், முற்றுகை, அன்றைய வானிலை ஆகியவற்றுக்காகச் சொல்கிறது. அதனால் இயல்பான பயன்பாடு ஒரு குறிப்பிட்ட நேரத்தின் கிரக நிலை. பிறப்பு ஜாதகத்தில் வைத்துப் பார்ப்பது நவீன பயன்பாடு — இந்த நூலில் இல்லை; தேர்ந்தெடுத்தால் அப்படியே குறிக்கப்படும்.
          நூல் எந்த விதியையும் மற்றதைவிட மேலானது என்று சொல்லவில்லை; பொருந்தும் விதிகள் அனைத்தும் பாடல் எண்ணுடன் காட்டப்படுகின்றன, தீர்ப்பு சொல்லப்படவில்லை.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" onClick={() => setMode('transit')} className={`px-2 py-1 rounded border text-xs ${mode === 'transit' ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>ஒரு நேரத்தின் கிரக நிலை (நூலின் பயன்பாடு)</button>
          <button type="button" onClick={() => setMode('birth')} className={`px-2 py-1 rounded border text-xs ${mode === 'birth' ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>பிறப்பு ஜாதகம் (நவீன பயன்பாடு)</button>
        </div>
        {mode === 'transit' && (
          <label className="text-xs text-ink-soft block mb-2">தேதி-நேரம் (உங்கள் உலாவி நேரம்):{' '}
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="px-2 py-1 bg-surface-2 border border-line rounded text-ink" />
          </label>
        )}
        {result && (
          <label className="text-xs text-ink-soft block">சங்கட்ட சக்கரத்தில் வேதம் பார்க்க வேண்டிய நட்சத்திரம் (அரசனின் பெயர் நட்சத்திரம் — நூல் பா.4-6):{' '}
            <select value={focus} onChange={(e) => setFocus(e.target.value)} className="px-2 py-1 bg-surface-2 border border-line rounded text-ink">
              <option value="">— தேர்வு இல்லை —</option>
              {result.stars.map((s: any) => <option key={s.id} value={s.id}>{s.ta}</option>)}
            </select>
          </label>
        )}
      </section>

      {mode === 'birth' && <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />}
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <p className="text-xs text-ink-soft mb-3">
            {result.mode === 'transit' ? `கிரக நிலை: ${result.when}` : `${result.native?.name ?? '(பெயர் இல்லை)'} · ${result.native?.date} ${result.native?.time} · ${result.native?.placeName ?? '—'}`}
          </p>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">கோட்டா சக்கரம் (கோட்டை)</h2>
            <p className="text-[11px] text-ink-soft mb-2">{citeTa(result.kota.source)}</p>
            <table className="w-full text-xs">
              <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">நட்சத்திரம்</th><th className="py-1 pr-2">கோட்டையின் பகுதி</th><th className="py-1">வாயில்/தூண்</th></tr></thead>
              <tbody>
                {result.kota.placed.map((p: any) => (
                  <tr key={p.planet} className="border-b border-line/40" style={num}>
                    <td className="py-1.5 pr-2 font-semibold text-ink">{p.planetTa} <span className="text-ink-soft font-normal">{p.nature === 'benefic' ? '(சுபம்)' : '(தீயது)'}</span></td>
                    <td className="py-1.5 pr-2">{p.starTa}</td><td className="py-1.5 pr-2">{p.zoneTa}</td><td className="py-1.5 text-ink-soft">{p.gateTa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xs font-semibold text-ink mt-3 mb-1">பொருந்தும் விதிகள்</h3>
            {result.kota.matches.length === 0 && <p className="text-xs text-ink-soft">இந்த நிலைக்குப் பொருந்தும் விதி இல்லை.</p>}
            <ul className="space-y-1">
              {result.kota.matches.map((r: any) => (
                <li key={r.id} className={`text-[13px] ${KIND_CLASS[r.kind] ?? 'text-ink'}`}>{r.ta} <span className="text-[11px] text-ink-soft">(பாடல் {r.verses}, ப.{r.page})</span></li>
              ))}
            </ul>
            <p className="text-[11px] text-ink-soft mt-2">{result.kota.scope}</p>
            <p className="text-[11px] text-ink-soft mt-1">கட்டப்படாதவை: {result.kota.notNeeded}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">நட்சத்திர சங்கட்ட சக்கரம்</h2>
            <p className="text-[11px] text-ink-soft mb-2">{citeTa(result.sanghatta.source)}</p>
            <p className="text-xs text-ink mb-1">கிரகங்கள்: {result.sanghatta.placed.map((p: any) => `${p.planetTa} ${p.starTa}`).join(' · ')}</p>
            <h3 className="text-xs font-semibold text-ink mt-2 mb-1">வேதித்த இணைகள் (இரு நட்சத்திரங்களிலும் கிரகம் உள்ளவை)</h3>
            {result.sanghatta.vedha.length === 0 && <p className="text-xs text-ink-soft">இல்லை.</p>}
            <ul className="text-[13px] space-y-0.5">
              {result.sanghatta.vedha.map((v: any, i: number) => <li key={i}>{v.aTa} ({v.planetsATa.join(', ')}) ↔ {v.bTa} ({v.planetsBTa.join(', ')})</li>)}
            </ul>
            {result.focusStarTa && (
              <p className="text-xs text-ink mt-2">{result.focusStarTa} நட்சத்திரத்தை வேதிக்கும் கிரகங்கள்: {result.sanghatta.strikers.length ? result.sanghatta.strikers.map((s: any) => `${s.planetTa} (${s.starTa})`).join(', ') : 'இல்லை'}</p>
            )}
            <h3 className="text-xs font-semibold text-ink mt-3 mb-1">பொருந்தும் விதிகள்</h3>
            {result.sanghatta.matches.length === 0 && <p className="text-xs text-ink-soft">இந்த நிலைக்குப் பொருந்தும் விதி இல்லை.</p>}
            <ul className="space-y-1">
              {result.sanghatta.matches.map((r: any) => (
                <li key={r.id} className={`text-[13px] ${KIND_CLASS[r.kind] ?? 'text-ink'}`}>{r.ta} <span className="text-[11px] text-ink-soft">(பாடல் {r.verses}, ப.{r.page})</span></li>
              ))}
            </ul>
            <p className="text-[11px] text-ink-soft mt-2">{result.sanghatta.scope}</p>
            <p className="text-[11px] text-ink-soft mt-1">கட்டப்படாதவை: {result.sanghatta.notBuilt}</p>
          </section>
        </>
      )}
    </main>
  );
}
