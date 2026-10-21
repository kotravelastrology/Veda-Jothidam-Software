'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeBphsRashiDasha, loadBphsRashiDeclared, loadBphsRashiSystems } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * The sign dashas of BPHS chapter 46 with a complete printed rule: Chara, Sthira (Brahma Graha), Yogardha and
 * Mandooka. The book gives no balance at birth — each runs from birth. Dashas the book does not state completely are
 * listed below with the reason, not built.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const yrs = (y: number) => `${y} ஆண்டு`;

export default function BphsRashiDashasView() {
  const [systems, setSystems] = useState<any[]>([]);
  const [declared, setDeclared] = useState<Record<string, string>>({});
  const [system, setSystem] = useState('chara');
  const [party, setParty] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBphsRashiSystems().then(setSystems).catch((e) => setError(String(e)));
    loadBphsRashiDeclared().then(setDeclared).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeBphsRashiDasha({ ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }), system })
      .then((r) => { if (!cancelled) setResult(r); })
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
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">BPHS chapter 46 sign dashas</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ராசி தசைகள் — பராசரர் (BPHS அத்.46)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          சர, ஸ்திர, யோகார்த்த, மண்டூக, தீர்க்க, லக்னாதி தசைகள் — நூலில் அச்சிட்ட விதிப்படி. லக்னாதி தவிர மற்றவை பிறப்பிலிருந்தே தொடங்கும் (இருப்பு இல்லை); லக்னாதியில் முதல் தசையின் இருப்பு உண்டு. நூலின் எடுத்துக்காட்டு அட்டவணையுடன் ஒத்துப்போகாத கட்டங்கள் (சர: விருச்சிகம், மகரம்; யோகார்த்த: சிம்மம்) சோதனைக் கோப்பில் பதிவு செய்யப்பட்டுள்ளன.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {systems.map((s) => (
            <button key={s.id} type="button" onClick={() => setSystem(s.id)}
              className={`px-2 py-1 rounded border text-xs ${system === s.id ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>{s.nameTa}</button>
          ))}
        </div>
        {sys && <p className="text-[11px] text-ink-soft">{citeTa(sys.source)}</p>}
      </section>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
          <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
          <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம் · லக்னம்: {result.lagnaTa}</p>
          {result.brahma && (
            <p className="text-sm text-ink mt-2">
              பிரம்ம கிரகம்: <strong>{result.brahma.planetTa ?? '—'}</strong>{result.brahma.signTa && <> ({result.brahma.signTa})</>} · கணக்கு வீடு: {result.brahma.baseTa}
            </p>
          )}
          {result.reasonTa && <p className="text-sm text-rose mt-2">{result.reasonTa}</p>}
          {result.startTa && <p className="text-sm text-ink mt-2">தொடக்கம்: <strong>{result.startTa}</strong> · {result.forward ? 'முன்னோக்கி' : 'பின்னோக்கி'}</p>}
          {result.periods.length > 0 && (
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs" style={{ minWidth: 480 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">ராசி</th><th className="py-1 pr-2">தொடக்கம்</th><th className="py-1 pr-2">முடிவு</th><th className="py-1">காலம்</th></tr></thead>
                <tbody>
                  {result.periods.map((p: any, i: number) => (
                    <tr key={i} className={`border-b border-line/40 ${running(p) ? 'bg-rose-soft' : ''}`} style={num}>
                      <td className="py-1.5 pr-2 font-semibold text-ink">{p.signTa}{running(p) && <span className="text-rose font-normal"> ← இப்போது</span>}{p.targetTa && <span className="text-ink-soft font-normal"> (எண்ணிய வீடு {p.targetTa})</span>}</td>
                      <td className="py-1.5 pr-2 font-mono">{p.startDate}</td><td className="py-1.5 pr-2 font-mono">{p.endDate}</td><td className="py-1.5 text-ink-soft">{yrs(p.years)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-[11px] text-ink-soft mt-2">365.25 நாள் ஆண்டு; இரண்டு சுற்றுகள் காட்டப்படுகின்றன (நூல்: "முடிந்ததும் அதே வரிசை மீண்டும்").</p>
        </section>
      )}

      <section className="bg-surface border border-line rounded-2xl p-4 text-sm">
        <h2 className="text-sm font-semibold text-ink mb-2">இங்கே கட்டப்படாதவை — காரணம்</h2>
        <ul className="text-xs text-ink-soft space-y-1">
          {Object.entries(declared).map(([k, v]) => <li key={k}><strong className="text-ink">{k}</strong>: {v}</li>)}
        </ul>
      </section>
    </main>
  );
}
