'use client';

import { Fragment, useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeBphsDasha, loadBphsDashaSystems } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * The nakshatra dashas of BPHS chapter 46 beside Vimshottari: Ashtottari, Shodashottari, Dwadashottari, Panchottari,
 * Shatabdika, Chaturashiti-sama, Dwisaptati-sama and Shat-trimshat-sama. Each is shown with the condition the verse
 * says it suits, checked against the chart — Parashara adds that Vimshottari is the main dasha for everyone and the
 * others are for special circumstances. The coverage label (`/dasha-methods`) travels with the table.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';
const LEVEL_CLASS: Record<string, string> = { VERIFIED: 'bg-teal-soft text-teal', SOURCED: 'bg-amber-100 text-amber-800', STRUCTURE_ONLY: 'bg-orange-100 text-orange-800', DECLARED: 'bg-ink-soft/10 text-ink-soft' };
const yrs = (y: number) => (y >= 1 ? `${Math.round(y * 100) / 100} ஆண்டு` : `${Math.round(y * 365.25)} நாள்`);

export default function BphsDashasView() {
  const [systems, setSystems] = useState<any[]>([]);
  const [system, setSystem] = useState('ashtottari');
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => { loadBphsDashaSystems().then(setSystems).catch((e) => setError(String(e))); }, []);
  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeBphsDasha({ ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }), system })
      .then((r) => { if (!cancelled) { setResult(r); setOpen(null); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, system]);

  const sys = systems.find((s) => s.id === system);
  const today = new Date().toISOString().slice(0, 10);
  const running = (p: any) => p.startDate <= today && today < p.endDate;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">BPHS chapter 46 dashas</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">தசைகள் — பராசரர் (BPHS அத்.46)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          விம்சோத்தரி தவிர்த்து, பராசரர் நட்சத்திரத்தின்படி சொல்லும் எட்டு தசைகள். ஒவ்வொன்றும் யாருக்குப் பொருந்தும் என்று ஸ்லோகம் சொல்லும் நிபந்தனையை உங்கள் ஜாதகத்துடன் சரிபார்க்கிறது.
          "விம்சோத்தரியே எல்லாருக்கும் முதன்மை; மற்றவை சிறப்புச் சூழ்நிலைகளுக்கு" என்று பராசரரே சொல்கிறார். நூலின் முறை — முன்கணிப்பு அல்ல.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {systems.map((s) => (
            <button key={s.id} type="button" onClick={() => setSystem(s.id)}
              className={`px-2 py-1 rounded border text-xs ${system === s.id ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>{s.nameTa}</button>
          ))}
        </div>
        {sys && (
          <div className="text-xs">
            <p><strong className="text-ink">{sys.nameTa}</strong> · {sys.totalYears} ஆண்டு <span className={`ml-2 px-1.5 py-0.5 rounded ${LEVEL_CLASS[sys.level]}`}>{sys.levelTa}</span></p>
            <p className="text-ink-soft mt-1">வரிசை: {sys.cycle.map((l: string) => `${l} ${sys.years[l]}`).join(' · ')}</p>
            <p className="text-ink mt-1">பொருந்தும் நிலை: {sys.whenTa}</p>
            <p className="text-ink-soft mt-1">{sys.notes}</p>
            <p className="text-[11px] text-ink-soft mt-1">{citeTa(sys.source)}</p>
          </div>
        )}
      </section>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம்</p>
            <p className="text-base text-ink mt-2">
              பிறப்பு நட்சத்திரம்: <strong>{result.birth.starTa}</strong> · தொடக்க அதிபதி: <strong>{result.birth.lordTa}</strong> · பிறப்பில் இருப்பு: <strong style={num}>{yrs(result.birth.balanceYears)}</strong>
            </p>
            <p className={`text-sm mt-2 ${result.applies.applies === false ? 'text-rose' : result.applies.applies ? 'text-teal' : 'text-ink-soft'}`}>
              {result.applies.applies === true && '✓ நூல் சொல்லும் நிபந்தனை இந்த ஜாதகத்தில் உள்ளது: '}
              {result.applies.applies === false && '✗ நூல் சொல்லும் நிபந்தனை இந்த ஜாதகத்தில் இல்லை: '}
              {result.applies.reasonTa}
            </p>
            <p className="text-[11px] text-ink-soft mt-1">பக்ஷம்: {result.facts.paksha === 'SHUKLA' ? 'சுக்ல' : 'கிருஷ்ண'} · பிறப்பு: {result.facts.day ? 'பகல்' : 'இரவு'} (சூரியன் 7-12 வீட்டில் எனில் பகல்) · 365.25 நாள் ஆண்டு.</p>
            <p className="text-[11px] text-ink-soft mt-1">{result.system.levelNoteTa}</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">மகா தசைகள் (ஒவ்வொன்றையும் அழுத்தினால் அந்தர தசை)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 520 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">அதிபதி</th><th className="py-1 pr-2">தொடக்கம்</th><th className="py-1 pr-2">முடிவு</th><th className="py-1">காலம்</th></tr></thead>
                <tbody>
                  {result.periods.map((p: any, i: number) => (
                    <Fragment key={i}>
                      <tr onClick={() => setOpen(open === i ? null : i)} className={`border-b border-line/40 cursor-pointer ${running(p) ? 'bg-rose-soft' : ''}`} style={num}>
                        <td className="py-1.5 pr-2 font-semibold text-ink">{p.lordTa}{running(p) && <span className="text-rose font-normal"> ← இப்போது</span>}</td>
                        <td className="py-1.5 pr-2 font-mono">{p.startDate}</td><td className="py-1.5 pr-2 font-mono">{p.endDate}</td><td className="py-1.5 text-ink-soft">{yrs(p.years)}</td>
                      </tr>
                      {open === i && p.children.map((c: any, j: number) => (
                        <tr key={`${i}-${j}`} className={`border-b border-line/20 ${running(c) ? 'bg-rose-soft' : 'bg-surface-2'}`} style={num}>
                          <td className="py-1 pr-2 pl-5 text-ink">{c.lordTa}{running(c) && <span className="text-rose"> ← இப்போது</span>}</td>
                          <td className="py-1 pr-2 font-mono">{c.startDate}</td><td className="py-1 pr-2 font-mono">{c.endDate}</td><td className="py-1 text-ink-soft">{yrs(c.years)}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">அந்தர தசை விம்சோத்தரி போலவே விகிதப்படி (பராசரர் இந்த தசைகளுக்குத் தனி விதி சொல்லவில்லை). பிறப்புக்கு முன் செலவான பகுதி மகா தசையின் இருப்பாகக் குறைக்கப்பட்டுள்ளது.</p>
          </section>
        </>
      )}
    </main>
  );
}
