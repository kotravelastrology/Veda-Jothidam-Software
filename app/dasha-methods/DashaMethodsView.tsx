'use client';

import { useEffect, useState } from 'react';
import { loadDashaMethods } from './actions';

/**
 * VJ-027 — what this software knows about each dasha method, and how far that
 * knowledge has been checked.
 *
 * The page exists because "we have 4 dasha systems and PL9 has 23" is the
 * wrong way to read the gap. What matters is how many produce dates anyone
 * should act on. Showing the label beside each name makes that visible
 * instead of leaving a practitioner to assume every listed method is equal.
 */

type Level = 'VERIFIED' | 'SOURCED' | 'STRUCTURE_ONLY' | 'DECLARED';

interface Method {
  id: string;
  name: string;
  nameTa: string;
  family: string;
  level: Level;
  levelTa: string;
  levelNoteTa: string;
  promoted: boolean;
  implemented: boolean;
  workedExample: string | null;
  notes: string | null;
  source: { title: string; author: string | null; pageLocus: string; tradition: string } | null;
}

const LEVEL_CLASS: Record<Level, string> = {
  VERIFIED: 'bg-teal-soft text-teal',
  SOURCED: 'bg-amber-100 text-amber-800',
  STRUCTURE_ONLY: 'bg-orange-100 text-orange-800',
  DECLARED: 'bg-ink-soft/10 text-ink-soft',
};

const FAMILY_TA: Record<string, string> = {
  nakshatra: 'நட்சத்திர தசை',
  rasi: 'ராசி தசை',
};

function MethodRow({ m }: { m: Method }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border border-line rounded-xl bg-surface overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 hover:bg-ink-soft/5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-[family-name:var(--font-tamil-serif)] text-lg text-ink">
            {m.nameTa} <span className="text-sm text-ink-soft">{m.name}</span>
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded shrink-0 ${LEVEL_CLASS[m.level]}`}>
            {m.levelTa}
          </span>
        </div>
        <p className="text-xs text-ink-soft mt-1">
          {FAMILY_TA[m.family] ?? m.family}
          {m.promoted && ' · அறிக்கையில் பயன்படுத்தத் தகுந்தது'}
          {!m.implemented && ' · கணிக்கப்படவில்லை'}
        </p>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 text-xs leading-relaxed border-t border-line/60 space-y-2">
          <p className="text-ink-soft">{m.levelNoteTa}</p>
          {m.notes && <p className="text-ink">{m.notes}</p>}

          {m.source ? (
            <div>
              <p className="font-semibold text-ink">ஆதாரம்</p>
              <p className="text-ink-soft">{m.source.title}{m.source.author ? ` — ${m.source.author}` : ''}</p>
              <p className="text-ink-soft">{m.source.pageLocus}</p>
            </div>
          ) : (
            <p className="text-rose">ஆதார முத்திரை இல்லை.</p>
          )}

          <div>
            <p className="font-semibold text-ink">தனித்த worked example</p>
            <p className={m.workedExample ? 'text-teal' : 'text-ink-soft'}>
              {m.workedExample
                ? `fixtures/dashas/${m.workedExample}.json`
                : 'இல்லை — வெளியிடப்பட்ட ஒரு முடிவு இன்னும் மீளுருவாக்கப்படவில்லை.'}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

export default function DashaMethodsView() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [showAll, setShowAll] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashaMethods()
      .then((d: any) => { setMethods(d.methods); setSummary(d.summary); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const shown = showAll ? methods : methods.filter((m) => m.promoted);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Dasha methods</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          தசை முறைகள் — சரிபார்ப்பு நிலை
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஒவ்வொரு தசை முறையும் எந்த அளவுக்குச் சரிபார்க்கப்பட்டுள்ளது என்பது.
          எத்தனை முறைகள் உள்ளன என்பதல்ல முக்கியம் — எத்தனை முறைகளின் தேதிகளை
          நம்பி ஒருவர் செயல்படலாம் என்பதுதான்.
        </p>
      </header>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {summary && (
        <>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-4">
            {([
              ['சரிபார்க்கப்பட்டது', summary.byLevel.VERIFIED ?? 0, 'text-teal'],
              ['ஆதாரம் உண்டு', summary.byLevel.SOURCED ?? 0, 'text-amber-700'],
              ['அட்டவணை மட்டும்', summary.byLevel.STRUCTURE_ONLY ?? 0, 'text-orange-700'],
              ['செயல்படுத்தப்படவில்லை', summary.byLevel.DECLARED ?? 0, 'text-ink-soft'],
            ] as const).map(([label, value, cls]) => (
              <div key={label} className="border border-line rounded-lg py-2">
                <dd className={`text-2xl font-bold ${cls}`}>{value}</dd>
                <dt className="text-[11px] text-ink-soft">{label}</dt>
              </div>
            ))}
          </dl>

          <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-4">
            <strong>{summary.promoted} முறை</strong> மட்டுமே அறிக்கையில் தானாகப்
            பயன்படுத்தப்படும் — ஆதாரப் பக்கமும் தனித்த worked example-உம்
            உள்ளவை. மற்றவை வேண்டுமென்றே தடுக்கப்பட்டுள்ளன.
            <br />
            <strong>செயல்படுத்தப்படாதவை ஏன்:</strong> ஒரு நட்சத்திர தசைக்கு
            ஆண்டுகளின் அட்டவணை மட்டும் போதாது — பிறப்பு நட்சத்திரத்திலிருந்து
            தொடக்க அதிபதியைத் தீர்மானிக்கும் விதியும் வேண்டும். சரியான
            அட்டவணையுடன் தவறான தொடக்க விதி அமைந்தால், ஒவ்வொரு தேதியும்
            தவறாகும் — ஆனால் நம்பத்தகுந்ததாகவே தோன்றும். எனவே ஊகிக்காமல்
            விடப்பட்டுள்ளது.
          </p>

          <div className="flex gap-1 mb-3 text-xs">
            {([[true, `அனைத்தும் (${methods.length})`], [false, `பயன்படுத்தத் தகுந்தவை (${summary.promoted})`]] as const)
              .map(([v, l]) => (
                <button key={String(v)} type="button" onClick={() => setShowAll(v)}
                  className={`px-2 py-1 rounded ${showAll === v ? 'bg-saffron text-white' : 'bg-surface border border-line text-ink-soft'}`}>
                  {l}
                </button>
              ))}
          </div>
        </>
      )}

      <ul className="space-y-2">
        {shown.map((m) => <MethodRow key={m.id} m={m} />)}
      </ul>
    </main>
  );
}
