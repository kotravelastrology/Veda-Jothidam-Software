'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadGlossary } from './actions';

/**
 * VJ-026 — the source-aware glossary.
 *
 * This page used to list invented articles: titles nobody wrote, dates nobody
 * published, and attributions to living authors who had no part in them. It is
 * now the other thing entirely — every entry names a Tamil term, the module
 * that implements the rule behind it, and the exact page the engine cites,
 * read out of the code rather than retyped here.
 *
 * A term whose locator is still unverified says so on its face. Presenting
 * those as checked would be the same defect as the invented articles, only
 * harder to notice.
 */

interface Rights {
  status: 'PERMITTED' | 'RESTRICTED' | 'UNVERIFIED';
  mayShip: boolean;
  mayQuoteShort: boolean;
  note: string;
  verified: boolean;
  toConfirm: string | null;
}

interface SourceRow {
  id: string; title: string; titleTa: string;
  author: string | null; file: string | null; tradition: string; rights: Rights;
}

interface Term {
  id: string;
  ta: string;
  translit: string;
  en: string;
  meaning: string;
  module: string;
  pageLocus: string;
  locatorComplete: boolean;
  citedAt: string;
  source: SourceRow;
}

const RIGHTS_TA: Record<Rights['status'], string> = {
  PERMITTED: 'அனுமதிக்கப்பட்டது',
  RESTRICTED: 'பதிப்புரிமை உள்ளது — மேற்கோள் மட்டும்',
  UNVERIFIED: 'உரிமை சரிபார்க்கப்படவில்லை',
};

const RIGHTS_CLASS: Record<Rights['status'], string> = {
  PERMITTED: 'bg-teal-soft text-teal',
  RESTRICTED: 'bg-amber-100 text-amber-800',
  UNVERIFIED: 'bg-rose-soft text-rose',
};

function TermCard({ t }: { t: Term }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border border-line rounded-xl bg-surface overflow-hidden">
      <button
        type="button" onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 hover:bg-ink-soft/5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-[family-name:var(--font-tamil-serif)] text-lg text-ink">{t.ta}</span>
          <span className="text-xs text-ink-soft shrink-0">{t.translit} · {t.en}</span>
        </div>
        <p className="text-sm text-ink-soft mt-1">{t.meaning}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-ink-soft/10 text-ink-soft font-mono">
            {t.module}
          </span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded ${
            t.locatorComplete ? 'bg-teal-soft text-teal' : 'bg-rose-soft text-rose'}`}>
            {t.locatorComplete ? '✓ பக்கம் சரிபார்க்கப்பட்டது' : '⚠ பக்கம் சரிபார்க்கப்படவில்லை'}
          </span>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 text-xs leading-relaxed border-t border-line/60 pt-3 space-y-2">
          <div>
            <p className="font-semibold text-ink">விதி எங்கே உள்ளது</p>
            <p className="font-mono text-ink-soft">{t.citedAt}</p>
          </div>

          <div>
            <p className="font-semibold text-ink">ஆதாரம்</p>
            <p className="text-ink">{t.source.titleTa}</p>
            <p className="text-ink-soft">{t.source.title}</p>
            {t.source.author && <p className="text-ink-soft">{t.source.author}</p>}
            <p className="text-ink-soft">மரபு: {t.source.tradition}</p>
          </div>

          <div>
            <p className="font-semibold text-ink">பக்கக் குறிப்பு</p>
            <p className={t.locatorComplete ? 'text-ink' : 'text-rose'}>{t.pageLocus}</p>
            {!t.locatorComplete && (
              <p className="text-rose mt-1">
                அத்தியாயமும் செய்யுளும் அறியப்பட்டுள்ளன; அச்சிடப்பட்ட பக்கம் இதுவரை
                கண்ணால் சரிபார்க்கப்படவில்லை.
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold text-ink">மறுவிநியோக உரிமை</p>
            <span className={`inline-block text-[11px] px-1.5 py-0.5 rounded ${RIGHTS_CLASS[t.source.rights.status]}`}>
              {RIGHTS_TA[t.source.rights.status]}
            </span>
            <p className="text-ink-soft mt-1">{t.source.rights.note}</p>
            {t.source.rights.toConfirm && (
              <p className="text-amber-700 mt-1">உறுதி செய்ய வேண்டியது: {t.source.rights.toConfirm}</p>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function LearningResourcesView() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [query, setQuery] = useState('');
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'terms' | 'sources'>('terms');

  useEffect(() => {
    loadGlossary()
      .then((g: any) => { setTerms(g.terms); setSources(g.sources); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      if (sourceId && t.source.id !== sourceId) return false;
      if (verifiedOnly && !t.locatorComplete) return false;
      if (!q) return true;
      return [t.ta, t.translit, t.en, t.meaning, t.module]
        .some((f) => f.toLowerCase().includes(q));
    });
  }, [terms, query, sourceId, verifiedOnly]);

  const unverified = terms.filter((t) => !t.locatorComplete).length;

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Glossary</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          சொல் · விதி · ஆதாரம்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          ஒவ்வொரு தமிழ்ச் சொல்லுக்கும் — அதைப் பயன்படுத்தும் விதி எந்தக் கோப்பில்
          உள்ளது, அந்த விதி எந்த நூலின் எந்தப் பக்கத்தைச் சுட்டுகிறது, அந்த நூலை
          மறுவிநியோகம் செய்ய முடியுமா என்பதும்.
        </p>
      </header>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      <div className="flex gap-1 mb-4 text-sm">
        {([['terms', `சொற்கள் (${terms.length})`], ['sources', `நூல்கள் (${sources.length})`]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)}
            className={`px-3 py-1.5 rounded-lg ${tab === k ? 'bg-saffron text-white' : 'bg-surface border border-line text-ink-soft'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'terms' && (
        <>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="தமிழ்ச் சொல் / transliteration / English / module"
            className="w-full mb-3 px-3 py-2 text-sm bg-surface border border-line rounded-xl text-ink"
          />
          <div className="flex flex-wrap gap-1.5 mb-3 text-xs items-center">
            <button type="button" onClick={() => setSourceId(null)}
              className={`px-2 py-1 rounded ${!sourceId ? 'bg-saffron text-white' : 'bg-surface border border-line text-ink-soft'}`}>
              அனைத்து நூல்கள்
            </button>
            {sources.map((s) => (
              <button key={s.id} type="button" onClick={() => setSourceId(s.id)}
                className={`px-2 py-1 rounded ${sourceId === s.id ? 'bg-saffron text-white' : 'bg-surface border border-line text-ink-soft'}`}>
                {s.titleTa}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1.5 text-ink-soft cursor-pointer">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
              சரிபார்க்கப்பட்ட பக்கம் மட்டும்
            </label>
          </div>

          {unverified > 0 && !verifiedOnly && (
            <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 mb-3">
              <strong>{unverified} சொல்</strong> — அவற்றின் விதிக்கு அத்தியாயமும் செய்யுளும்
              அறியப்பட்டுள்ளன, ஆனால் அச்சிடப்பட்ட பக்கம் இதுவரை கண்ணால்
              சரிபார்க்கப்படவில்லை. அவை ⚠ குறியுடன் காட்டப்படுகின்றன.
            </p>
          )}

          <ul className="space-y-2">
            {shown.map((t) => <TermCard key={t.id} t={t} />)}
          </ul>
          {shown.length === 0 && <p className="text-sm text-ink-soft">பொருத்தமான சொல் இல்லை.</p>}
        </>
      )}

      {tab === 'sources' && (
        <ul className="space-y-3">
          {sources.map((s) => (
            <li key={s.id} className="border border-line rounded-xl bg-surface p-4 text-sm">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-[family-name:var(--font-tamil-serif)] text-lg text-ink">{s.titleTa}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded shrink-0 ${RIGHTS_CLASS[s.rights.status]}`}>
                  {RIGHTS_TA[s.rights.status]}
                </span>
              </div>
              <p className="text-ink-soft text-xs">{s.title}</p>
              {s.author && <p className="text-ink-soft text-xs">{s.author}</p>}
              {s.file && <p className="text-ink-soft text-xs font-mono">{s.file}</p>}
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs mt-2">
                <dt className="text-ink-soft">மரபு</dt><dd className="text-ink">{s.tradition}</dd>
                <dt className="text-ink-soft">பயன்பாட்டில் உள்ள சொற்கள்</dt>
                <dd className="text-ink">{terms.filter((t) => t.source.id === s.id).length}</dd>
                <dt className="text-ink-soft">செயலியுடன் வழங்கலாமா</dt>
                <dd className={s.rights.mayShip ? 'text-teal' : 'text-rose'}>
                  {s.rights.mayShip ? 'ஆம்' : 'இல்லை'}
                </dd>
                <dt className="text-ink-soft">சிறு மேற்கோள்</dt>
                <dd className={s.rights.mayQuoteShort ? 'text-teal' : 'text-rose'}>
                  {s.rights.mayQuoteShort ? 'ஆம்' : 'இல்லை'}
                </dd>
              </dl>
              <p className="text-ink-soft text-xs mt-2">{s.rights.note}</p>
              {s.rights.toConfirm && (
                <p className="text-amber-700 text-xs mt-1">
                  <strong>உறுதி செய்ய வேண்டியது:</strong> {s.rights.toConfirm}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
