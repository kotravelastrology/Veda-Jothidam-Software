'use client';

import { useEffect, useState } from 'react';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { computeSpecialLagnas } from './actions';
import { citeTa } from '@/src/sources/citeTa';

/**
 * BPHS chapter 5: Bhava Lagna (one sign per 5 ghatis from sunrise), Hora Lagna (per 2½ ghatis), Ghatika Lagna (per ghati) added to
 * the Sun's longitude at sunrise, and Varnada Lagna. The planets stay where they are at birth and are read in the houses counted
 * from each lagna (v.9: "prepare various Bhava charts with respect to each special ascendant"). The book does not define
 * sunrise; the two conventions are offered and the difference is stated.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };

function HouseGrid({ houses }: { houses: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-1 text-[11px] mt-2">
      {houses.map((h) => (
        <div key={h.house} className="border border-line rounded p-1.5 bg-surface-2">
          <div className="text-ink-soft">{h.house} · {h.signTa}</div>
          <div className="text-ink min-h-[1rem]">{h.planetsTa.join(', ') || '—'}</div>
        </div>
      ))}
    </div>
  );
}

export default function SpecialLagnasView() {
  const [party, setParty] = useState<Party | null>(null);
  const [kind, setKind] = useState<'visible' | 'geometric'>('visible');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeSpecialLagnas({ ...(party.kind === 'profile' ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input }), sunriseKind: kind })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, kind]);

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Special lagnas · BPHS chapter 5</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">சிறப்பு லக்னங்கள் — பராசரர் (BPHS அத்.5)</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          சூரிய உதயத்திலிருந்து பிறப்பு வரை: பாவ லக்னம் 5 கடிகைக்கு ஒரு ராசி, ஹோரா லக்னம் 2½ கடிகைக்கு ஒரு ராசி, கடிகா லக்னம் ஒரு கடிகைக்கு ஒரு ராசி (ஒரு விகடிகை = அரை டிகிரி); ஒவ்வொன்றும் உதயத்தில் சூரியனின் தீர்க்கத்துடன் கூட்டப்படுகிறது.
          கிரகங்கள் பிறப்பில் இருந்தபடியே இருக்கும்; ஒவ்வொரு லக்னத்திலிருந்தும் வீடுகள் எண்ணப்படுகின்றன (நூல் பா.9). வர்ணத லக்னம் பா.10-13 முறைப்படி.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <p className="text-xs text-ink-soft mb-2">நூல் "சூரிய உதயம்" என்பதை வரையறுக்கவில்லை. இரண்டு முறைகள்:</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setKind('visible')} className={`px-2 py-1 rounded border text-xs ${kind === 'visible' ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>தெரியும் உதயம் (நம் பஞ்சாங்கத்தின்)</button>
          <button type="button" onClick={() => setKind('geometric')} className={`px-2 py-1 rounded border text-xs ${kind === 'geometric' ? 'bg-ink text-surface border-ink' : 'bg-surface-2 border-line text-ink'}`}>வடிவியல் உதயம் (சூரிய மையம் அடிவானத்தில்; PL9 இதைப் பயன்படுத்துகிறது)</button>
        </div>
        <p className="text-[11px] text-ink-soft mt-2">வித்தியாசம் சில நிமிடங்கள்; ஆனால் கடிகா லக்னம் மணிக்கு 75° நகர்வதால் சில டிகிரி மாறும். பிறப்பு சூரிய உதயத்துக்கு முன் எனில் முந்தைய நாள் உதயம் எடுக்கப்படும்.</p>
      </section>

      <PartyChooser party={party} setParty={(x) => { setParty(x); if (!x) setResult(null); }} loading={loading} />
      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">{result.native.name ?? '(பெயர் இல்லை)'} · {result.native.date} {result.native.time} · {result.native.placeName ?? '—'}</h2>
            <p className="text-xs text-ink-soft">{result.native.method.ayanamsha} அயனாம்சம் · உதயத்திலிருந்து {Math.round(result.hoursSinceSunrise * 100) / 100} மணி ({Math.round(result.ghatis * 100) / 100} கடிகை) · உதயத்தில் சூரியன் {result.sunAtSunrise.toFixed(3)}°</p>
            <p className="text-[11px] text-ink-soft mt-1">{citeTa(result.source)}</p>
          </section>
          {result.lagnas.map((l: any) => (
            <section key={l.key} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
              <h3 className="font-semibold text-ink">{l.nameTa} — {l.signTa} <span style={num} className="font-mono text-ink-soft font-normal">{l.dms.d}°{String(l.dms.m).padStart(2, '0')}′{String(l.dms.s).padStart(2, '0')}″</span></h3>
              <HouseGrid houses={l.houses} />
            </section>
          ))}
          <section className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
            <h3 className="font-semibold text-ink">வர்ணத லக்னம் — {result.varnada.signTa}</h3>
            <p className="text-[11px] text-ink-soft">ஜென்ம லக்னத்துக்கும் ஹோரா லக்னத்துக்கும் எண்ணிக்கை {result.varnada.counts.join(' மற்றும் ')} → {result.varnada.total}; ஒற்றை எனில் மேஷத்திலிருந்து, இரட்டை எனில் மீனத்திலிருந்து பின்னோக்கி எண்ணிய ராசி.</p>
            <HouseGrid houses={result.varnada.houses} />
          </section>
        </>
      )}
    </main>
  );
}
