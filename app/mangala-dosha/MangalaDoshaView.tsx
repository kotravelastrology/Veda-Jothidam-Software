'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '../library/actions';
import { computeMangala, type MangalaSide } from './actions';
import type { BirthFormInput } from '../report/actions';

/**
 * Mangala (Kuja) dosha for a bride, a groom, or both.
 *
 * The books do not agree on the houses, nor on which cancellations apply, and
 * Vishnu Bhaskar contradicts himself between his chapter summary and his
 * detailed list. So the page shows each reading and each condition under its
 * own book and page, and never collapses them into one verdict. A condition
 * that needs a judgement the book leaves undefined ("strong", "powerful") is
 * left to the practitioner and labelled as such.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

const REF_TA: Record<string, string> = { LAGNA: 'லக்னம்', MOON: 'சந்திரன்', VENUS: 'சுக்கிரன்' };
const SRC_TA: Record<string, string> = {
  MANSAGARI: 'மானசாகரி (செய்யுளுடன் மொழிபெயர்ப்பாளர் குறிப்பு)',
  VISHNU_BHASKAR: 'விஷ்ணு பாஸ்கர்',
  BHAGAT: 'எஸ்.பி. பகத்',
};
const STATUS: Record<string, { label: string; cls: string }> = {
  MET: { label: 'பொருந்துகிறது', cls: 'bg-teal-soft text-teal' },
  NOT_MET: { label: 'பொருந்தவில்லை', cls: 'bg-surface-2 text-ink-soft' },
  JUDGEMENT: { label: 'உங்கள் தீர்ப்பு', cls: 'bg-amber-100 text-amber-800' },
  NOT_COMPUTED: { label: 'கணக்கிட இயலவில்லை', cls: 'bg-surface-2 text-ink-soft' },
  NEEDS_PARTNER: { label: 'துணை ஜாதகம் தேவை', cls: 'bg-surface-2 text-ink-soft' },
};

function toInput(bd: BirthData): BirthFormInput {
  return {
    name: bd.name, gender: bd.gender,
    year: parseInt(bd.dateOfBirth.split('-')[0]),
    month: parseInt(bd.dateOfBirth.split('-')[1]),
    day: parseInt(bd.dateOfBirth.split('-')[2]),
    hour: parseInt(bd.timeOfBirth.split(':')[0]),
    minute: parseInt(bd.timeOfBirth.split(':')[1]),
    placeName: bd.place, latitude: bd.latitude, longitude: bd.longitude,
    utcOffsetMinutes: bd.utcOffset, ianaTimeZone: 'Asia/Kolkata',
  };
}
const toSide = (p: Party | null): MangalaSide | null => (!p ? null
  : p.kind === 'profile' ? { profile: { profileId: p.profileId, revision: p.revision } } : { form: p.input });

function SidePicker({ title, party, rows, loading, onPick, onClear }: {
  title: string; party: Party | null; rows: LibraryRow[]; loading: boolean;
  onPick: (p: Party) => void; onClear: () => void;
}) {
  const [manual, setManual] = useState(false);
  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {party && <button type="button" onClick={onClear} className="text-xs text-ink-soft hover:text-rose">மாற்று</button>}
      </div>
      {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
        <>
          <BirthDataForm isLoading={loading}
            onSubmit={(bd) => onPick({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })} />
          <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">
            சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு
          </button>
        </>
      ) : (
        <>
          <ul className="max-h-44 overflow-y-auto divide-y divide-line/40 mb-2">
            {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
            {rows.map((r) => (
              <li key={r.profileId}>
                <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                  onClick={() => onPick({
                    kind: 'profile', profileId: r.profileId, revision: r.revision,
                    label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}`,
                  })}>
                  {r.name}
                  <span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">
            அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு
          </button>
        </>
      )}
    </div>
  );
}

function Chip({ status, negative }: { status: string; negative?: boolean }) {
  const s = STATUS[status] ?? STATUS.NOT_COMPUTED;
  if (negative && status === 'MET') {
    return <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-soft text-rose whitespace-nowrap font-semibold">நீக்காது — எச்சரிக்கை</span>;
  }
  return <span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${s.cls}`}>{s.label}</span>;
}

function Formation({ a }: { a: any }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ minWidth: 680 }}>
        <thead>
          <tr className="text-ink-soft border-b border-line text-left">
            <th className="py-1 pr-3">நூல்</th><th className="py-1 pr-3">இடங்கள்</th>
            <th className="py-1 pr-3">செவ்வாய் எங்கிருந்து எந்த இடம்</th><th className="py-1 pr-3">தோஷம்</th><th className="py-1">பக்கம்</th>
          </tr>
        </thead>
        <tbody className="align-top">
          {a.formation.map((r: any) => (
            <tr key={r.id} className="border-b border-line/40">
              <td className="py-1.5 pr-3 text-ink">{r.labelTa}{r.classical && <span className="ml-1 text-[10px] px-1 rounded bg-indigo-soft text-indigo">செய்யுள்</span>}</td>
              <td className="py-1.5 pr-3 font-mono text-ink">{r.houses.join(', ')}</td>
              <td className="py-1.5 pr-3">
                {r.perReference.map((p: any) => (
                  <span key={p.reference} className={`inline-block mr-2 ${p.present ? 'text-rose font-semibold' : 'text-ink-soft'}`}>
                    {REF_TA[p.reference]}: {p.marsHouse}
                  </span>
                ))}
                {r.otherMalefics.length > 0 && (
                  <span className="block text-ink-soft">மற்றவை: {r.otherMalefics.map((o: any) => `${o.graha} (${REF_TA[o.reference]} ${o.house})`).join(', ')}</span>
                )}
              </td>
              <td className="py-1.5 pr-3">
                <span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${r.present ? 'bg-rose-soft text-rose font-semibold' : 'bg-teal-soft text-teal'}`}>
                  {r.present ? 'தோஷம் உண்டு' : 'தோஷம் இல்லை'}
                </span>
              </td>
              <td className="py-1.5 text-ink-soft">{r.sourceTitle} — {r.sourcePage}<span className="block">{r.note}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Conditions({ a }: { a: any }) {
  const sources = Object.keys(a.summary);
  const group = (key: string) => a.conditions.filter((c: any) => c.source.key === key);
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 520 }}>
          <thead>
            <tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-3">நூல்</th><th className="py-1 pr-3">பொருந்துகிறது</th>
              <th className="py-1 pr-3">உங்கள் தீர்ப்பு</th><th className="py-1 pr-3">பொருந்தவில்லை</th>
              <th className="py-1 pr-3">இயலவில்லை</th><th className="py-1">துணை தேவை</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((k) => {
              const s = a.summary[k];
              return (
                <tr key={k} className="border-b border-line/40">
                  <td className="py-1.5 pr-3 text-ink">{SRC_TA[k] ?? k}</td>
                  <td className="py-1.5 pr-3 font-mono text-teal">{s.MET}{s.negativeMet > 0 && <span className="text-rose"> (+{s.negativeMet} எச்சரிக்கை)</span>}</td>
                  <td className="py-1.5 pr-3 font-mono text-amber-700">{s.JUDGEMENT}</td>
                  <td className="py-1.5 pr-3 font-mono text-ink-soft">{s.NOT_MET}</td>
                  <td className="py-1.5 pr-3 font-mono text-ink-soft">{s.NOT_COMPUTED}</td>
                  <td className="py-1.5 font-mono text-ink-soft">{s.NEEDS_PARTNER}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink-soft">
        நூல்களின் பட்டியல்கள் ஒன்றோடொன்று முரண்படுவதால் இவை ஒன்றாகக் கூட்டப்படவில்லை; "தோஷம் நீங்கியது" என்ற ஒரே தீர்ப்பும் தரப்படவில்லை.
      </p>
      {sources.map((k) => (
        <details key={k} className="border border-line rounded-xl p-2">
          <summary className="cursor-pointer text-sm font-semibold text-ink">{SRC_TA[k] ?? k} — {group(k).length} நிபந்தனைகள்</summary>
          <ul className="mt-2 divide-y divide-line/40">
            {group(k).map((c: any) => (
              <li key={c.id} className="py-2 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-ink">{c.ta}</span>
                  <Chip status={c.status} negative={c.negative} />
                </div>
                <span className="block text-ink-soft italic">{c.en}</span>
                {c.detail && <span className="block text-ink mt-0.5">→ {c.detail}</span>}
                <span className="block text-ink-soft mt-0.5">{c.source.title} — {c.page}{c.scope === 'PARTNER' ? ' · துணை ஜாதகம் தேவை' : ''}</span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

function Analysis({ title, party, a }: { title: string; party: any; a: any }) {
  const pctRows = a.intensity.perReference;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h2 className="font-semibold text-ink">{title}: {party.name ?? '(பெயர் இல்லை)'} · லக்னம் {a.lagnaTa} · செவ்வாய் {a.marsSignTa}</h2>
        <span className="text-xs text-ink-soft">{party.date} {party.time} · {party.placeName ?? '—'} · {party.method.ayanamsha} அயனாம்சம்</span>
      </div>

      <h3 className="text-xs font-semibold text-ink mb-1">உருவாக்கம் — ஒவ்வொரு நூலின் முறைப்படி</h3>
      {a.books && (
        <p className="text-[11px] text-ink-soft mb-1">
          நூல்களின் வரிசை (அதிகம் விளக்கும் நூல் முதலில்; {a.bookRankMeasureTa}):{' '}
          {a.books.map((b: any) => `${b.rank}. ${SRC_TA[b.key] ?? b.key} — ${b.words.toLocaleString('en-IN')} சொற்கள், ${b.range}`).join(' · ')}
        </p>
      )}
      <Formation a={a} />

      <h3 className="text-xs font-semibold text-ink mt-4 mb-1">தீவிரம் — விஷ்ணு பாஸ்கரின் இரு அளவுகள்</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ minWidth: 520 }}>
          <thead>
            <tr className="text-ink-soft border-b border-line text-left">
              <th className="py-1 pr-3">எங்கிருந்து</th><th className="py-1 pr-3">செவ்வாய் இடம்</th>
              <th className="py-1 pr-3">சதவீதம்</th><th className="py-1 pr-3">செவ்வாயின் அலகு</th><th className="py-1">மொத்த அலகு (கணக்கிட முடிந்தவை)</th>
            </tr>
          </thead>
          <tbody>
            {pctRows.map((p: any) => (
              <tr key={p.reference} className="border-b border-line/40">
                <td className="py-1.5 pr-3 text-ink">{REF_TA[p.reference]}</td>
                <td className="py-1.5 pr-3 font-mono">{p.marsHouse}</td>
                <td className="py-1.5 pr-3 font-mono">{p.percent !== null ? `${p.percent}%` : '—'}</td>
                <td className="py-1.5 pr-3 font-mono">{p.marsUnits}</td>
                <td className="py-1.5 font-mono">{p.totalUnits}{p.nodesNotCounted.length > 0 && <span className="text-ink-soft font-sans"> ({p.nodesNotCounted.join(', ')} சேர்க்கப்படவில்லை)</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink-soft mt-1">
        செவ்வாய் {a.intensity.marsDignity === 'EXAL' ? 'உச்சம்' : a.intensity.marsDignity === 'DEB' ? 'நீசம்' : a.intensity.marsDignity === 'OH' ? 'சொந்த வீடு' : a.intensity.marsDignity === 'FH' ? 'நட்பு வீடு' : a.intensity.marsDignity === 'EH' ? 'பகை வீடு' : 'சம வீடு'}.
        நூல் சொல்லாதவை: {a.intensity.notStatedTa.join('; ')}.
        <span className="block">{a.intensity.sourcePage}</span>
      </p>

      {a.results.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-ink mt-4 mb-1">பலன் — நூல் சொல்வது (செவ்வாய் இருக்கும் இடத்துக்கு)</h3>
          <ul className="space-y-1.5 text-xs">
            {a.results.map((r: any, i: number) => (
              <li key={i}>
                <span className="font-semibold text-ink">{REF_TA[r.reference]}லிருந்து {r.house}-ஆம் இடம் ({r.percent}%):</span>{' '}
                <span className="text-ink">{r.textTa}</span>
                <span className="block text-ink-soft">{r.page}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="text-xs font-semibold text-ink mt-4 mb-1">நீக்கும் நிபந்தனைகள் — ஒவ்வொரு நூலின் பட்டியல்</h3>
      <Conditions a={a} />
    </section>
  );
}

export default function MangalaDoshaView() {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [girl, setGirl] = useState<Party | null>(null);
  const [boy, setBoy] = useState<Party | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  // Whoever is chosen is computed at once; changing either side recomputes.
  useEffect(() => {
    if (!girl && !boy) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeMangala({ girl: toSide(girl), boy: toSide(boy) })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [girl, boy]);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Mangala (Kuja) dosha</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">மங்கள (செவ்வாய்) தோஷம்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          மணமகள், மணமகன் அல்லது இருவரின் ஜாதகத்தில் செவ்வாய் தோஷம். நூல்கள் இடங்களிலும் நீக்கும் நிபந்தனைகளிலும்
          ஒத்துப்போவதில்லை; அதனால் ஒவ்வொரு நூலின் முறையும் அதன் பக்கத்துடன் தனித்தனியாகக் காட்டப்படுகிறது — ஒரே தீர்ப்பு தரப்படுவதில்லை.
          ஒருவரை மட்டும் தேர்ந்தெடுத்தாலும் பார்க்கலாம்; இருவரையும் தேர்ந்தெடுத்தால் துணை ஜாதகம் தேவைப்படும் நிபந்தனைகளும் அலகு ஒப்பீடும் சேரும்.
        </p>
      </header>

      <input value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
        className="w-full mb-3 px-3 py-2 text-sm bg-surface border border-line rounded-xl text-ink" />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <SidePicker title="மணமகள் (Bride)" party={girl} rows={rows} loading={loading}
          onPick={(p) => setGirl(p)} onClear={() => setGirl(null)} />
        <SidePicker title="மணமகன் (Groom)" party={boy} rows={rows} loading={loading}
          onPick={(p) => setBoy(p)} onClear={() => setBoy(null)} />
      </div>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          {result.mode === 'PAIR' ? (
            <>
              <Analysis title="மணமகள்" party={result.girl.party} a={result.girl.analysis} />
              <Analysis title="மணமகன்" party={result.boy.party} a={result.boy.analysis} />
              <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
                <h2 className="font-semibold text-ink mb-2">இருவரின் அலகு ஒப்பீடு (விஷ்ணு பாஸ்கர்)</h2>
                <p className="text-ink">
                  மணமகள் <strong>{result.units.girl}</strong> · மணமகன் <strong>{result.units.boy}</strong> (லக்னத்திலிருந்து, கணக்கிட முடிந்த கிரகங்கள்).
                </p>
                <p className="text-ink mt-1">{result.units.verdict.textTa}</p>
                <p className="text-[11px] text-ink-soft mt-1">{result.units.sourcePage}</p>
                <p className="text-[11px] text-ink-soft">நூல் சொல்லாதவை: {result.units.notStatedTa.join('; ')}.</p>
                <ul className="mt-3 space-y-1.5 text-xs">
                  {result.pairGuidance.map((g: any, i: number) => (
                    <li key={i}>
                      <span className="text-ink">{g.textTa}</span>
                      {g.sources.map((s: any, j: number) => <span key={j} className="block text-ink-soft">{s.title} — {s.page}</span>)}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <Analysis title={result.side === 'GIRL' ? 'மணமகள்' : 'மணமகன்'} party={result.single.party} a={result.single.analysis} />
          )}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-1">பரிகாரம் — நூலில் பதிவானவை</h2>
            <p className="text-[11px] text-ink-soft mb-2">
              இவை ஒரு நூல் (எஸ்.பி. பகத்) குறிப்பிடும் வழக்கங்கள். இவை பலன் தரும் என்று இந்த மென்பொருள் கூறவில்லை; எதுவும் கணிக்கப்படவில்லை.
            </p>
            <p className="text-xs text-ink">{result.remedies.beforeMarriage.textTa}
              <span className="block text-ink-soft">{result.remedies.beforeMarriage.source.title} — {result.remedies.beforeMarriage.source.pageLocus}</span></p>
            <ul className="list-disc ml-5 text-xs text-ink mt-2">
              {result.remedies.afterMarriage.items.map((x: string, i: number) => <li key={i}>{x}</li>)}
            </ul>
            <p className="text-[11px] text-ink-soft mt-1">திருமணத்துக்குப் பின் செய்யக்கூடியவை — {result.remedies.afterMarriage.source.pageLocus}</p>
            <p className="text-xs text-ink mt-2">{result.remedies.yantra.textTa}
              <span className="block text-ink-soft">{result.remedies.yantra.source.pageLocus}</span></p>
          </section>

          <section className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-4 text-xs space-y-2">
            <p className="font-semibold">இந்தக் கணிப்பு எப்படிச் செய்யப்பட்டது — எது உறுதி, எது இல்லை</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>நூல்கள் ஒத்துப்போகவில்லை.</strong> மானசாகரி செய்யுள்: லக்னம், 12, 4, 7, 8 (2-ஆம் இடம் இல்லை). விஷ்ணு பாஸ்கர் தன் அத்தியாயச் சுருக்கத்தில் ஐந்து இடங்கள், அதே நூலின் விரிவான பட்டியலில் ஆறு இடங்கள் (2 சேர்த்து) மற்றும் சூரியனும் சேர்கிறது — அவரே தனக்கு முரண்படுகிறார். தென்னிந்தியாவில் லக்னத்துக்குப் பதிலாக 2-ஆம் இடம் என்று அவர் கூறுகிறார். பகத் ஆறு இடங்கள்.</li>
              <li><strong>தமிழ் நூல்:</strong> {(result.single ?? result.girl).analysis.tamilNotFound.noteTa}</li>
              <li><strong>நீக்கும் பட்டியல்கள்</strong> மானசாகரியில் மொழிபெயர்ப்பாளரின் சொந்தத் தொகுப்பு — அவரே "இவை புனிதமானவை அல்ல" என்கிறார். பகத், விஷ்ணு பாஸ்கர் பட்டியல்களும் தொகுப்புகளே; சில ஒன்றுக்கொன்று முரண்படுகின்றன (எ.கா. குரு பார்வை: விஷ்ணு பாஸ்கர் "நூல்கள்படி நீக்கும், அனுபவத்தில் அதிகரிக்கும்" என்கிறார்).</li>
              <li><strong>"பலமான", "குறையற்ற"</strong> போன்ற சொற்களை நூல்கள் வரையறுக்கவில்லை; அத்தகைய நிபந்தனைகள் "உங்கள் தீர்ப்பு" என்று விடப்படுகின்றன. அஸ்தமனம், ராகு-கேதுவின் பார்வை, அஷ்டகூட மதிப்பெண் ஆகியவை கணக்கிடப்படவில்லை.</li>
              <li><strong>"மாங்கலிக் அல்லாத"</strong> என்பதை விஷ்ணு பாஸ்கர் விளக்கவில்லை; அவரது ஒரு நிபந்தனையின் முரணைத் தவிர்க்க, செவ்வாய் அந்த இடங்களில் இல்லை என்று வாசிக்கப்பட்டது.</li>
              <li><strong>பிறந்த கிழமை</strong> சூரிய உதயம் முதல் கணக்கிடப்படுகிறது (உதயத்துக்கு முன் பிறந்தால் முந்தைய நாள்).</li>
              <li><strong>வயது வரம்பு:</strong> பகத் 27–32 வயதுக்கு முன் திருமணம் கூடாது என்கிறார்; விஷ்ணு பாஸ்கர் "28 வயதுக்குப் பின் தோஷம் முடியும் என்பது நூல்களால் ஆதரிக்கப்படவில்லை" என்கிறார் — இரண்டும் முரண்படுகின்றன.</li>
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
