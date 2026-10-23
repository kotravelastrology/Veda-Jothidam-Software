'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  runResearchCohort, saveResearchCohort, listResearchCohorts,
  deleteResearchCohort, replayResearchCohort, type CohortSettings,
} from './actions';

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const GRAHA_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const RASI_TA = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
  'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்',
];
const NAKSHATRA_TA = [
  'அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];

type Clause =
  | { kind: 'grahaInHouse'; graha: string; house: number }
  | { kind: 'grahaInRasi'; graha: string; rasi: number }
  | { kind: 'grahaInNakshatra'; graha: string; nakshatra: number }
  | { kind: 'lagnaRasi'; rasi: number }
  | { kind: 'conjunct'; grahas: [string, string] }
  | { kind: 'navamsaRasi'; graha: string; rasi: number }
  | { kind: 'sarvaAtLeast'; rasi: number; bindus: number };

const CLAUSE_LABELS: Record<Clause['kind'], string> = {
  grahaInHouse: 'கிரகம் — பாவம்',
  grahaInRasi: 'கிரகம் — ராசி',
  grahaInNakshatra: 'கிரகம் — நட்சத்திரம்',
  lagnaRasi: 'லக்ன ராசி',
  conjunct: 'சேர்க்கை',
  navamsaRasi: 'நவாம்ச ராசி',
  sarvaAtLeast: 'சர்வாஷ்டகவர்க்கம் ≥',
};

const blank = (kind: Clause['kind']): Clause => {
  switch (kind) {
    case 'grahaInHouse': return { kind, graha: 'Mars', house: 7 };
    case 'grahaInRasi': return { kind, graha: 'Mars', rasi: 0 };
    case 'grahaInNakshatra': return { kind, graha: 'Moon', nakshatra: 0 };
    case 'lagnaRasi': return { kind, rasi: 0 };
    case 'conjunct': return { kind, grahas: ['Sun', 'Moon'] };
    case 'navamsaRasi': return { kind, graha: 'Venus', rasi: 0 };
    case 'sarvaAtLeast': return { kind, rasi: 0, bindus: 30 };
    default: return { kind: 'lagnaRasi', rasi: 0 };
  }
};

const Select = ({ value, onChange, children }: any) => (
  <select value={value} onChange={onChange}
    className="px-2 py-1 text-sm bg-surface border border-line rounded text-ink">
    {children}
  </select>
);

function ClauseEditor({ c, onChange, onRemove }: {
  c: Clause; onChange: (c: Clause) => void; onRemove: () => void;
}) {
  const grahaSelect = (value: string, set: (g: string) => void) => (
    <Select value={value} onChange={(e: any) => set(e.target.value)}>
      {GRAHAS.map((g) => <option key={g} value={g}>{GRAHA_TA[g]}</option>)}
    </Select>
  );
  const rasiSelect = (value: number, set: (r: number) => void) => (
    <Select value={value} onChange={(e: any) => set(Number(e.target.value))}>
      {RASI_TA.map((r, i) => <option key={r} value={i}>{r}</option>)}
    </Select>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 bg-surface border border-line rounded-xl px-3 py-2">
      <Select value={c.kind} onChange={(e: any) => onChange(blank(e.target.value))}>
        {Object.entries(CLAUSE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </Select>

      {c.kind === 'grahaInHouse' && <>
        {grahaSelect(c.graha, (graha) => onChange({ ...c, graha }))}
        <Select value={c.house} onChange={(e: any) => onChange({ ...c, house: Number(e.target.value) })}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}ஆம் பாவம்</option>)}
        </Select>
      </>}

      {(c.kind === 'grahaInRasi' || c.kind === 'navamsaRasi') && <>
        {grahaSelect(c.graha, (graha) => onChange({ ...c, graha }))}
        {rasiSelect(c.rasi, (rasi) => onChange({ ...c, rasi }))}
      </>}

      {c.kind === 'grahaInNakshatra' && <>
        {grahaSelect(c.graha, (graha) => onChange({ ...c, graha }))}
        <Select value={c.nakshatra} onChange={(e: any) => onChange({ ...c, nakshatra: Number(e.target.value) })}>
          {NAKSHATRA_TA.map((n, i) => <option key={n} value={i}>{n}</option>)}
        </Select>
      </>}

      {c.kind === 'lagnaRasi' && rasiSelect(c.rasi, (rasi) => onChange({ ...c, rasi }))}

      {c.kind === 'conjunct' && <>
        {grahaSelect(c.grahas[0], (g) => onChange({ ...c, grahas: [g, c.grahas[1]] }))}
        {grahaSelect(c.grahas[1], (g) => onChange({ ...c, grahas: [c.grahas[0], g] }))}
      </>}

      {c.kind === 'sarvaAtLeast' && <>
        {rasiSelect(c.rasi, (rasi) => onChange({ ...c, rasi }))}
        <input type="number" min={0} max={56} value={c.bindus}
          onChange={(e) => onChange({ ...c, bindus: Number(e.target.value) })}
          className="w-20 px-2 py-1 text-sm bg-surface border border-line rounded text-ink" />
        <span className="text-xs text-ink-soft">பிந்து</span>
      </>}

      <button type="button" onClick={onRemove} className="ml-auto text-xs text-ink-soft hover:text-rose">
        நீக்கு
      </button>
    </div>
  );
}

export default function ResearchView() {
  const [clauses, setClauses] = useState<Clause[]>([blank('grahaInHouse')]);
  const [settings, setSettings] = useState<CohortSettings>({
    ayanamsha: 'Lahiri', houseSystem: 'Porphyrius', nodeType: 'mean',
  });
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const predicate = clauses.length === 1 ? clauses[0] : { kind: 'and', of: clauses };

  const refresh = useCallback(() => {
    listResearchCohorts().then(setSaved).catch(() => setSaved([]));
  }, []);
  useEffect(refresh, [refresh]);

  const run = async () => {
    setBusy(true); setError(null); setStatus(null);
    try {
      setResult(await runResearchCohort(predicate, settings));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!name.trim()) { setStatus('ஒரு பெயர் தேவை'); return; }
    try {
      await saveResearchCohort({
        name: name.trim(), predicate, settings,
        signature: result?.signature ?? null, counts: result?.counts,
      });
      setName(''); setStatus('சேமிக்கப்பட்டது'); refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  const replay = async (cohortId: string) => {
    setBusy(true); setError(null);
    try {
      const r = await replayResearchCohort(cohortId);
      setResult(r);
      setStatus(r.unchanged === null ? 'முதல் இயக்கம் — ஒப்பிட முந்தைய கையொப்பம் இல்லை'
        : r.unchanged ? 'கையொப்பம் மாறவில்லை — அதே உறுப்பினர்கள்'
          : 'கையொப்பம் மாறியுள்ளது — உறுப்பினர்கள் அல்லது திருத்தங்கள் மாறியுள்ளன');
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Research</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஆராய்ச்சி — சேமித்த குழுக்கள்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          நூலகத்தில் உள்ள ஜாதகங்களில் ஒரு நிபந்தனைக்குப் பொருந்துபவற்றைக் கண்டறியும் முறை.
          ஒவ்வொரு குழுவும் ஒரு கையொப்பத்தைச் (signature) சுமக்கிறது — அதே கேள்வியை
          மீண்டும் இயக்கினால் உறுப்பினர்கள் மாறியுள்ளார்களா என்பதைத் துல்லியமாகச் சொல்ல.
        </p>
      </header>

      <section className="mb-4">
        <div className="space-y-2 mb-2">
          {clauses.map((c, i) => (
            <ClauseEditor
              key={i} c={c}
              onChange={(next) => setClauses(clauses.map((x, j) => (j === i ? next : x)))}
              onRemove={() => setClauses(clauses.filter((_, j) => j !== i))}
            />
          ))}
        </div>
        <button type="button" onClick={() => setClauses([...clauses, blank('lagnaRasi')])}
          className="text-xs text-ink-soft underline">
          + மேலும் ஒரு நிபந்தனை (அனைத்தும் பொருந்த வேண்டும்)
        </button>
      </section>

      <section className="flex flex-wrap items-end gap-3 mb-4 text-sm">
        <label><span className="block text-ink-soft text-xs mb-1">அயனாம்சம்</span>
          <Select value={settings.ayanamsha} onChange={(e: any) => setSettings({ ...settings, ayanamsha: e.target.value })}>
            {['Lahiri', 'Raman', 'KP'].map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </label>
        <label><span className="block text-ink-soft text-xs mb-1">பாவ முறை</span>
          <Select value={settings.houseSystem} onChange={(e: any) => setSettings({ ...settings, houseSystem: e.target.value })}>
            {['Porphyrius', 'WholeSign', 'Placidus'].map((h) => <option key={h} value={h}>{h}</option>)}
          </Select>
        </label>
        <button type="button" onClick={run} disabled={busy || clauses.length === 0}
          className="px-4 py-2 rounded-xl bg-saffron text-white font-semibold disabled:opacity-40">
          {busy ? 'தேடுகிறது…' : 'தேடு'}
        </button>
      </section>

      {/* The settings are part of the question, not a display preference. */}
      <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-4">
        இந்தத் தேடல் <strong>அனைத்து ஜாதகங்களுக்கும் ஒரே அயனாம்சத்தையே</strong> பயன்படுத்துகிறது.
        ஒரு ஜாதகம் Lahiri-இலும் இன்னொன்று Raman-இலும் சேமிக்கப்பட்டிருந்தால், அவற்றை
        அவரவர் அமைப்பில் ஒப்பிடுவது இரு வெவ்வேறு மரபுகளை ஒப்பிடுவதாகும் — ஒரு கிரகம்
        பாவ எல்லையின் இருபுறமும் விழக்கூடும். வேறு அமைப்பில் சேமிக்கப்பட்ட உறுப்பினர்கள்
        கீழே குறிக்கப்படுகிறார்கள்.
      </p>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}
      {status && <p className="text-sm mb-4 text-ink-soft">{status}</p>}

      {result && (
        <section className="bg-surface border border-line rounded-2xl p-5 mb-5">
          <p className="text-sm text-ink mb-1">{result.description}</p>
          <p className="text-xs text-ink-soft mb-3 font-mono">
            signature {result.signature} · {result.settings.ayanamsha} · {result.settings.houseSystem}
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mb-4">
            {([
              ['பொருந்தியவை', result.counts.matched, 'text-saffron'],
              ['பொருந்தாதவை', result.counts.unmatched, 'text-ink'],
              ['கணிக்க முடியாதவை', result.counts.failed, result.counts.failed ? 'text-rose' : 'text-ink-soft'],
              ['பரிசீலித்தவை', result.counts.examined, 'text-ink'],
              ['விகிதம்', `${(result.counts.rate * 100).toFixed(1)}%`, 'text-ink'],
            ] as const).map(([label, value, cls]) => (
              <div key={label} className="border border-line rounded-lg py-2">
                <dd className={`text-xl font-bold ${cls}`}>{value}</dd>
                <dt className="text-[11px] text-ink-soft">{label}</dt>
              </div>
            ))}
          </dl>

          {result.counts.settingsMismatched > 0 && (
            <p className="text-xs text-amber-700 mb-3">
              {result.counts.settingsMismatched} உறுப்பினர் தாம் சேமிக்கப்பட்ட அமைப்பில் அல்லாமல்
              இந்தத் தேடலின் அமைப்பில் கணிக்கப்பட்டுள்ளனர்.
            </p>
          )}

          <ul className="divide-y divide-line/40 text-sm">
            {result.members.map((m: any) => (
              <li key={m.profileId} className="py-1.5 flex items-baseline justify-between gap-3">
                <span className="text-ink">{m.name}</span>
                <span className="text-xs text-ink-soft">
                  {m.birthDate}{m.placeName ? ` · ${m.placeName}` : ''} · v{m.revision}
                  {!m.settingsMatchProfile && <span className="text-amber-700"> · வேறு அமைப்பு</span>}
                </span>
              </li>
            ))}
          </ul>
          {result.members.length === 0 && <p className="text-sm text-ink-soft">பொருந்தும் ஜாதகம் இல்லை.</p>}

          {result.failures?.length > 0 && (
            <div className="mt-3 text-xs text-rose">
              <p className="font-semibold">கணிக்க முடியாதவை (பொருந்தாதவை அல்ல):</p>
              {result.failures.map((f: any) => (
                <p key={f.profileId}>{f.name} — {f.reason}</p>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="இந்தக் குழுவுக்கு ஒரு பெயர்"
              className="flex-1 px-3 py-1.5 text-sm bg-surface border border-line rounded-lg text-ink" />
            <button type="button" onClick={save}
              className="px-3 py-1.5 text-sm rounded-lg border border-line text-ink hover:bg-ink-soft/5">
              சேமி
            </button>
          </div>
        </section>
      )}

      {saved.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink mb-2">சேமித்த குழுக்கள்</h2>
          <ul className="space-y-2">
            {saved.map((c) => (
              <li key={c.cohortId} className="bg-surface border border-line rounded-xl p-3 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-ink font-medium">{c.name}</span>
                  <span className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => replay(c.cohortId)} disabled={busy}
                      className="text-xs text-saffron hover:underline disabled:opacity-40">
                      மீண்டும் இயக்கு
                    </button>
                    <button type="button" onClick={() => deleteResearchCohort(c.cohortId).then(refresh)}
                      className="text-xs text-ink-soft hover:text-rose">நீக்கு</button>
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-0.5">{c.description}</p>
                <p className="text-[11px] text-ink-soft font-mono mt-0.5">
                  {c.settings.ayanamsha} · {c.settings.houseSystem}
                  {c.lastSignature
                    ? ` · கடைசி signature ${c.lastSignature} · ${c.lastCounts?.matched ?? '?'} உறுப்பினர்`
                    : ' · இன்னும் இயக்கப்படவில்லை'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
