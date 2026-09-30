'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { fromParashariChart } from '@/src/charts/kattam/rasiNames';
import { useWorkspace } from '@/src/workspace/workspaceContext';
import { listCharts, searchCharts, openChart } from '../library/actions';
import { computePorutham, computePoruthamForProfiles } from './actions';
import type { BirthFormInput } from '../report/actions';

const SIGN_TA = ['மேஷ', 'ரிஷப', 'மிது', 'கடக', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மகர', 'கும்ப', 'மீன'];

interface LibraryRow {
  profileId: string;
  revision: number;
  name: string;
  birthDate: string;
  placeName: string | null;
}

/** A side of the match: either a saved profile or details typed into the form. */
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

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

/**
 * Picks one side of the match from the VJ-011 library, or falls back to typing
 * the birth details. The two sides are chosen independently so a match is
 * always between two named people rather than two anonymous forms.
 */
function PartyPicker({
  title, party, rows, disabledProfileId, onPick, onClear, loading,
}: {
  title: string;
  party: Party | null;
  rows: LibraryRow[];
  disabledProfileId: string | null;
  onPick: (p: Party) => void;
  onClear: () => void;
  loading: boolean;
}) {
  const [manual, setManual] = useState(false);

  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {party && (
          <button type="button" onClick={onClear} className="text-xs text-ink-soft hover:text-rose">
            மாற்று
          </button>
        )}
      </div>

      {party ? (
        <p className="text-sm text-teal">✓ {party.label}</p>
      ) : manual ? (
        <>
          <BirthDataForm
            isLoading={loading}
            onSubmit={(bd) => onPick({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })}
          />
          <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">
            சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு
          </button>
        </>
      ) : (
        <>
          <ul className="max-h-56 overflow-y-auto divide-y divide-line/40 mb-2">
            {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
            {rows.map((r) => {
              const taken = r.profileId === disabledProfileId;
              return (
                <li key={r.profileId}>
                  <button
                    type="button"
                    disabled={taken}
                    title={taken ? 'இந்தச் சுயவிவரம் மறுபக்கத்தில் தேர்ந்தெடுக்கப்பட்டுள்ளது' : undefined}
                    onClick={() => onPick({
                      kind: 'profile', profileId: r.profileId, revision: r.revision,
                      label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}`,
                    })}
                    className={`w-full text-left py-1.5 text-sm ${
                      taken ? 'text-ink-soft/40 cursor-not-allowed' : 'text-ink hover:text-saffron'}`}
                  >
                    {r.name}
                    <span className="text-xs text-ink-soft block">
                      {r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}
                      {taken ? ' · மறுபக்கத்தில் உள்ளது' : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">
            அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Location, date and method for one side. A match read a week later has to say
 * whose it is and what it was computed under — two charts saved under
 * different ayanamshas can land on different Moon nakshatras.
 */
function PartyCard({ title, meta }: { title: string; meta: any }) {
  if (!meta) return null;
  return (
    <div className="bg-surface border border-line rounded-2xl p-4 text-sm">
      <p className="text-xs uppercase tracking-wide text-ink-soft mb-1">{title}</p>
      <p className="text-ink font-medium">
        {meta.name ?? '(பெயர் இல்லை)'}
        {meta.source === 'library' && meta.revision != null && (
          <span className="text-xs text-ink-soft font-normal"> · திருத்தம் v{meta.revision}</span>
        )}
      </p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
        <dt className="text-ink-soft">நாள் / நேரம்</dt>
        <dd className="text-ink">{meta.date} · {meta.time} (UTC{meta.utcOffset})</dd>
        <dt className="text-ink-soft">இடம்</dt>
        <dd className="text-ink">
          {meta.placeName ?? '—'} · {meta.latitude}, {meta.longitude}
        </dd>
        <dt className="text-ink-soft">முறை</dt>
        <dd className="text-ink">
          {meta.method.ayanamsha} அயனாம்சம் · {meta.method.houseSystem} · {meta.method.nodeType} node
        </dd>
        <dt className="text-ink-soft">மூலம்</dt>
        <dd className="text-ink">{meta.source === 'library' ? 'சேமித்த சுயவிவரம்' : 'நேரடிப் படிவம்'}</dd>
      </dl>
    </div>
  );
}

/**
 * How a factor compares with the one primary text held for it. Shown on the
 * row itself, not only when opened: a client looking at a ✓ should not need to
 * click to learn whether the classical text agrees.
 */
const SOURCE_CHIP: Record<string, { label: string; cls: string }> = {
  MATCHES_SOURCE: { label: 'நூலுடன் ஒத்தது', cls: 'bg-teal-soft text-teal' },
  DIVERGES_FROM_SOURCE: { label: 'நூலுடன் வேறுபடுகிறது', cls: 'bg-amber-100 text-amber-800' },
  DIFFERENT_MODEL: { label: 'வேறு அமைப்பு', cls: 'bg-ink-soft/10 text-ink-soft' },
};

/** One porutham with its reasoning opened out. */
function FactorRow({ r }: { r: any }) {
  const [open, setOpen] = useState(false);
  const chip = SOURCE_CHIP[r.sourceStatus];
  return (
    <>
      <tr className="border-b border-line/40">
        <td className="py-1.5">
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-left hover:text-saffron">
            <span className="text-ink-soft mr-1">{open ? '▾' : '▸'}</span>{r.name}
          </button>
          {chip && (
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap ${chip.cls}`}>
              {chip.label}{r.sourceComparison?.isError ? ' · பிழை' : ''}
            </span>
          )}
        </td>
        <td className="py-1.5 text-center">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${r.result ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>
            {r.result ? '✓ பொருந்தும்' : '✗ இல்லை'}
          </span>
        </td>
        <td className="py-1.5 pl-4 text-ink-soft">{r.note}</td>
      </tr>
      {open && (
        <tr className="border-b border-line/40 bg-surface-2/40">
          <td colSpan={3} className="py-2 px-3 text-xs leading-relaxed">
            <p className="text-ink-soft"><span className="font-semibold text-ink">எதைக் குறிக்கிறது:</span> {r.governs}</p>
            <p className="text-ink-soft mt-1"><span className="font-semibold text-ink">விதி:</span> {r.rule}</p>
            <p className="text-ink mt-1"><span className="font-semibold">இந்த ஜோடிக்கு:</span> {r.why}</p>
            {r.sourceComparison && (
              <p className={`mt-1 ${r.sourceStatus === 'MATCHES_SOURCE' ? 'text-teal' : 'text-amber-700'}`}>
                <span className="font-semibold">
                  சூடாமணி உள்ளமுடையான் (செய்யுள் {r.sourceComparison.verses}, அச்சுப் பக்கம் {r.sourceComparison.printedPages ?? r.sourceComparison.printedPage}):
                </span>{' '}
                {r.sourceComparison.summary}
              </p>
            )}
            {r.divergence && (
              <p className="mt-1 text-amber-700">
                <span className="font-semibold">இந்தக் கணிப்பின் வேறுபாடு:</span> {r.divergence}
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function PoruthamView() {
  const { activeProfile } = useWorkspace();
  const [rowsLib, setRowsLib] = useState<LibraryRow[]>([]);
  const [girl, setGirl] = useState<Party | null>(null);
  const [boy, setBoy] = useState<Party | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRowsLib(r))
      .catch(() => setRowsLib([]));
  }, [query]);

  // The workspace's active profile seeds the bride side, so arriving from
  // another page does not mean picking the same person again.
  //
  // The seed is confirmed against the library first. The active profile is
  // remembered in browser storage and can outlive the record it names — a
  // deleted or restored-over profile would otherwise show a green tick here
  // and fail only when the match was run.
  useEffect(() => {
    if (!activeProfile || girl) return;
    let cancelled = false;
    openChart(activeProfile.profileId, activeProfile.revision)
      .then((p: any) => {
        if (cancelled || !p) return;
        setGirl({
          kind: 'profile', profileId: p.profileId, revision: p.revision,
          label: `${p.name} · ${p.birthDate}${p.placeName ? ` · ${p.placeName}` : ''}`,
        });
      })
      .catch(() => { /* the picker below still works */ });
    return () => { cancelled = true; };
  }, [activeProfile, girl]);

  const run = async () => {
    if (!girl || !boy) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      if (girl.kind === 'profile' && boy.kind === 'profile') {
        setResult(await computePoruthamForProfiles(
          { profileId: girl.profileId, revision: girl.revision },
          { profileId: boy.profileId, revision: boy.revision },
        ));
      } else if (girl.kind === 'form' && boy.kind === 'form') {
        setResult(await computePorutham(girl.input, boy.input));
      } else {
        setError('இரு பக்கமும் ஒரே வகையில் இருக்க வேண்டும் — இரண்டும் சேமித்த '
          + 'சுயவிவரங்கள், அல்லது இரண்டும் நேரடிப் படிவங்கள்.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const girlProfileId = girl?.kind === 'profile' ? girl.profileId : null;
  const boyProfileId = boy?.kind === 'profile' ? boy.profileId : null;

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Marriage Matching</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">திருமணப் பொருத்தம்</h1>
        <p className="text-sm text-ink-soft mt-1">
          10 தச கூட பொருத்தங்கள் — சந்திர நட்சத்திரம் / ராசி அடிப்படையில். இடதுபுறம் மணமகள், வலதுபுறம் மணமகன்.
        </p>
      </header>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
        className="w-full mb-3 px-3 py-2 text-sm bg-surface border border-line rounded-xl text-ink"
      />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <PartyPicker
          title="மணமகள் (Bride)" party={girl} rows={rowsLib} loading={loading}
          disabledProfileId={boyProfileId}
          onPick={(p) => { setGirl(p); setResult(null); setError(null); }}
          onClear={() => { setGirl(null); setResult(null); }}
        />
        <PartyPicker
          title="மணமகன் (Groom)" party={boy} rows={rowsLib} loading={loading}
          disabledProfileId={girlProfileId}
          onPick={(p) => { setBoy(p); setResult(null); setError(null); }}
          onClear={() => { setBoy(null); setResult(null); }}
        />
      </div>

      <button
        type="button" onClick={run} disabled={!girl || !boy || loading}
        className="mb-4 px-4 py-2 rounded-xl bg-saffron text-white text-sm font-semibold disabled:opacity-40"
      >
        {loading ? 'கணக்கிடப்படுகிறது…' : 'பொருத்தம் பார்'}
      </button>

      {!girl || !boy ? (
        <p className="text-sm text-ink-soft mb-4">இரு நபர்களையும் தேர்ந்தெடுக்கவும்.</p>
      ) : null}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result?.parties && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <PartyCard title="மணமகள்" meta={result.parties.girl} />
          <PartyCard title="மணமகன்" meta={result.parties.boy} />
        </div>
      )}

      {result?.girlChart && result?.boyChart && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col items-center">
            <VedicChartBox {...fromParashariChart(result.girlChart)} title="மணமகள் ராசி கட்டம் (D1)" size={340} />
          </div>
          <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col items-center">
            <VedicChartBox {...fromParashariChart(result.boyChart)} title="மணமகன் ராசி கட்டம் (D1)" size={340} />
          </div>
        </div>
      )}

      {result && (
        <div className="bg-surface border border-line rounded-2xl p-5">
          <div className="flex items-baseline justify-between mb-4">
            <div className="text-sm text-ink-soft">
              மணமகள்: <span className="text-ink font-medium">{result.girl.nakshatra}</span> / {SIGN_TA[result.girl.rasiIndex]}
              {' · '}மணமகன்: <span className="text-ink font-medium">{result.boy.nakshatra}</span> / {SIGN_TA[result.boy.rasiIndex]}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-saffron">{result.passed}/{result.total}</div>
              <div className="text-xs text-ink-soft">{result.level}</div>
            </div>
          </div>

          {/* How the rules behind this score compare with the one primary text
              held for them. The score is only as good as its rules, so the
              count sits beside it rather than in a footnote. The figures come
              from the result, never from this file, so they cannot go stale. */}
          {result.sourceSummary && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-4 space-y-1.5">
              <p>
                <strong>இந்த மதிப்பெண் ஒரு நூலால் உறுதிப்படுத்தப்படவில்லை.</strong> பத்து
                பொருத்தங்களின் விதிகளையும் சூடாமணி உள்ளமுடையான் (தஞ்சாவூர் சரசுவதி மகால்
                பதிப்பு) நூலின் அச்சிட்ட பக்கங்களுடன் ஒப்பிட்டதில்:
              </p>
              <p className="font-medium">
                {result.sourceSummary.matches} ஒத்தது · {result.sourceSummary.diverges} வேறுபடுகிறது ·{' '}
                {result.sourceSummary.differentModel} வேறு அமைப்பு (ஒப்பிட முடியாது)
              </p>
              <p>
                இது ஒரு நூல் மட்டுமே; வேறு மரபுகள் இதிலிருந்து வேறுபடலாம், நீங்கள் பின்பற்றும்
                விதி இதுவாக இருக்க வேண்டியதில்லை. ஆனால் &ldquo;வேறுபடுகிறது&rdquo; என்றால், நம்மிடம்
                உள்ள நூல்களில் எதுவும் இந்த விதியை உறுதிப்படுத்தவில்லை என்று பொருள். கணத்தின்
                வகைப்பாட்டில் உள்ள 8 நட்சத்திரப் பிழை மரபு வேறுபாடு அல்ல — திருத்த
                வேண்டியது. ஒவ்வொரு பொருத்தத்தையும் திறந்தால் நூல் என்ன சொல்கிறது என்பது தெரியும்.
              </p>
            </div>
          )}

          <table className="w-full text-sm">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">பொருத்தம்</th><th className="text-center py-1">முடிவு</th><th className="text-left py-1 pl-4">விவரம்</th>
            </tr></thead>
            <tbody>
              {result.rows.map((r: any) => <FactorRow key={r.id ?? r.name} r={r} />)}
            </tbody>
          </table>
        </div>
      )}

      {result?.extended && (
        <div className="bg-surface border border-line rounded-2xl p-5 mt-4">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">விரிவான நட்சத்திரப் பொருத்தம் (15)</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-saffron">{result.extended.passed}/{result.extended.total}</div>
              <div className="text-xs text-ink-soft">{result.extended.level}{result.extended.partial ? ` (+${result.extended.partial} மத்திமம்)` : ''}</div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">பொருத்தம்</th><th className="text-center py-1">முடிவு</th><th className="text-left py-1 pl-4">விவரம்</th>
            </tr></thead>
            <tbody>
              {result.extended.rows.map((r: any) => (
                <tr key={r.name} className="border-b border-line/40">
                  <td className="py-1.5">{r.name}</td>
                  <td className="py-1.5 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      r.verdict === 'உத்தமம்' ? 'bg-teal-soft text-teal' : r.verdict === 'மத்திமம்' ? 'bg-amber-100 text-amber-700' : 'bg-rose-soft text-rose'
                    }`}>
                      {r.verdict}
                    </span>
                  </td>
                  <td className="py-1.5 pl-4 text-ink-soft">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[11px] text-ink-soft mt-3">
            10 தச கூடத்திலிருந்து தனியான, இரண்டாவது 15-உறுப்பு பொருத்த முறை (ஏக தினம் · ராசி வர்ணம் · நட்சத்திர ஜாதி/கோத்திரம் ·
            சந்திரயோக வர்க்கம் · யோகினி · ஆய · விருட்சம் · பஞ்சபட்சி · லிங்கம் · விருத்தி · ஆயுள் · தசா சந்தி · நாடி · பஞ்சபூதம்).
            &ldquo;ஏக தினம்&rdquo; ஒரு எளிமைப்படுத்தப்பட்ட பட்டியல் (மூல நூலின் தசை/நிலை விதிவிலக்குகள் முழுமையாகக் கண்டறியப்படவில்லை).
            இதற்கும் செம்மையான ஆதாரம் நிலுவையில் உள்ளது.
          </p>
        </div>
      )}
    </main>
  );
}
