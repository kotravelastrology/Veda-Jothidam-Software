'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '../library/actions';
import { computeGems } from './actions';
import type { BirthFormInput } from '../report/actions';

/**
 * Gemstones — what three books say, side by side, the most-explained book first.
 *
 * The books do not share a method and disagree about particular gems for the
 * same Ascendant, so this page recommends nothing. The owner asked (2026-10-03)
 * for the book that explains most to come first; the engine returns the books
 * in that order with the measure, and every section below follows it.
 */

interface LibraryRow {
  profileId: string; revision: number; name: string; birthDate: string; placeName: string | null;
}
type Party =
  | { kind: 'profile'; profileId: string; revision: number; label: string }
  | { kind: 'form'; input: BirthFormInput; label: string };

const AGREEMENT: Record<string, { label: string; cls: string }> = {
  AGREE_FAVOURABLE: { label: 'நூல்கள் ஒத்தன — சாதகம்', cls: 'bg-teal-soft text-teal' },
  AGREE_UNFAVOURABLE: { label: 'நூல்கள் ஒத்தன — சாதகமற்றது', cls: 'bg-rose-soft text-rose' },
  DISAGREE: { label: 'நூல்கள் முரண்படுகின்றன', cls: 'bg-amber-100 text-amber-800' },
  PARTIAL: { label: 'ஓரளவு ஒத்தது', cls: 'bg-surface-2 text-ink-soft' },
  ONE_SOURCE: { label: 'ஒரு நூல் மட்டுமே சொல்கிறது', cls: 'bg-surface-2 text-ink-soft' },
  NONE: { label: 'எந்த நூலும் சொல்லவில்லை', cls: 'bg-surface-2 text-ink-soft' },
};
const STANCE_CLS: Record<string, string> = { FAV: 'text-teal', UNFAV: 'text-rose', COND: 'text-amber-700' };
const NODE_STATUS_TA: Record<string, string> = {
  MET: 'நிபந்தனை பொருந்துகிறது — அதன் தசையில்',
  JUDGE: 'தீர்மானிக்க முடியவில்லை',
  NOT_MET: 'நிபந்தனை பொருந்தவில்லை',
  NEEDS_CHART: 'ஜாதகம் தேவை',
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

const lords = (l: number[]) => (l.length ? l.join(', ') : '—');
const Stance = ({ s, children }: { s: string | null; children: ReactNode }) => (
  <span className={s ? STANCE_CLS[s] : 'text-ink-soft'}>{children}</span>
);
const Page = ({ children }: { children: ReactNode }) => <span className="block text-[11px] text-ink-soft mt-0.5">{children}</span>;

function BookHeading({ book }: { book: any }) {
  return (
    <header className="mb-3">
      <h2 className="text-base font-semibold text-ink">
        <span className="font-mono text-saffron mr-1">{book.rank}.</span>{book.nameTa}
        <span className="text-xs font-normal text-ink-soft"> — {book.title} ({book.author})</span>
      </h2>
      <p className="text-[11px] text-ink-soft">{book.whatTa} · {book.words.toLocaleString('en-IN')} சொற்கள், {book.range}</p>
    </header>
  );
}

function KapoorCard({ row }: { row: any }) {
  const k = row.kapoor;
  return (
    <article className="border border-line rounded-xl p-3 text-xs space-y-1.5">
      <h3 className="text-sm text-ink"><strong>{row.planetTa}</strong> · {row.gemTa} <span className="text-ink-soft">· {lords(row.actualLords)}-ஆம் அதிபதி</span></h3>
      <p className="text-sm"><Stance s={k.stance}>{k.verdictTa}</Stance>
        {k.status === 'CASE' && k.verdict !== k.base && <span className="text-ink-soft"> (பொது நிலை: {k.baseTa})</span>}
        {k.dashaEmphasis && <span className="text-ink-soft"> · {row.planetTa} தசையில் கூடுதல் பலன் என்கிறது</span>}
      </p>
      {k.reasonsTa.length > 0 && <p className="text-ink-soft">காரணம் (நூல்): {k.reasonsTa.join('; ')}</p>}
      {k.casesTa.length > 0 && (
        <div>
          <p className="text-ink-soft">நூலின் நிபந்தனைகள் (வரிசைப்படி):</p>
          <ol className="list-decimal ml-5 text-ink">{k.casesTa.map((c: string, i: number) => <li key={i} className={k.matchedCase === i ? 'font-semibold' : ''}>{c}</li>)}</ol>
          <p className="text-ink">{k.evaluationTa ?? 'ஜாதகம் இல்லாமல் நிபந்தனையைச் சரிபார்க்க முடியாது.'}</p>
        </div>
      )}
      {k.withTa && <p className="text-ink">சேர்த்து அணிய: {k.withTa}{k.alsoTa && <span className="text-ink-soft"> (அல்லது {k.alsoTa})</span>}</p>}
      {k.resultsTa.length > 0 && <p className="text-ink-soft">நூல் சொல்லும் பலன்: {k.resultsTa.join(', ')}</p>}
      {k.extrasTa.map((x: string, i: number) => <p key={i} className="text-ink-soft">{x}</p>)}
      {k.notJudgedTa.length > 0 && <p className="text-amber-800">மதிப்பிடப்படவில்லை: {k.notJudgedTa.join('; ')}</p>}
      {k.slipTa && <p className="text-rose">நூலின் அச்சுப் பிழை: {k.slipTa}</p>}
      {(k.misstatedLords.length > 0 || k.omittedLords.length > 0) && (
        <p className="text-ink-soft">நூல் சொல்லும் அதிபத்தியம்: {lords(k.statedLords)}{k.omittedLords.length > 0 && ` · விட்டது: ${k.omittedLords.join(', ')}`}</p>
      )}
      <Page>{k.page}</Page>
    </article>
  );
}

export default function GemstonesView() {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [query, setQuery] = useState('');
  const [party, setParty] = useState<Party | null>(null);
  const [manual, setManual] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (query.trim() ? searchCharts(query.trim(), 25) : listCharts(50))
      .then((r: any) => setRows(r)).catch(() => setRows([]));
  }, [query]);

  useEffect(() => {
    if (!party) { setResult(null); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    computeGems(party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } } : { form: party.input })
      .then((r) => { if (!cancelled) setResult(r); })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setResult(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party]);

  const book = (key: string) => result?.books.find((b: any) => b.key === key);
  const sections: Record<string, () => ReactNode> = {
    kapoor: () => (
      <>
        <p className="text-sm text-ink mb-3">
          லக்ன அதிபதி <strong>{result.planetGems[result.lagnaLord].planetTa}</strong> — அவரது ரத்தினம் <strong>{result.kapoor.rulingStone.gemTa}</strong> "ஆளும் கல்" (எந்தத் தசையிலும்).
          <Page>{result.kapoor.page}</Page>
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {result.rows.map((r: any) => <KapoorCard key={r.planet} row={r} />)}
        </div>
        <div className="border border-line rounded-xl p-3 text-xs mt-3 space-y-1">
          <h3 className="text-sm text-ink"><strong>ராகு, கேது</strong> · கோமேதகம், வைடூரியம்</h3>
          <p className="text-ink">{result.kapoor.nodes.textTa}</p>
          {(['rahu', 'ketu'] as const).map((n) => (
            <p key={n}>
              <strong>{n === 'rahu' ? 'ராகு' : 'கேது'}:</strong>{' '}
              <Stance s={result.nodes[n].kapoor.stance}>{NODE_STATUS_TA[result.nodes[n].kapoor.status]}</Stance>
              {result.nodes[n].kapoor.whyTa && <span className="text-ink-soft"> — {result.nodes[n].kapoor.whyTa}</span>}
            </p>
          ))}
          <p className="text-ink-soft">{result.kapoor.nodes.countingTa}</p>
          <Page>{result.kapoor.nodes.page}</Page>
        </div>
        <RulesList list={result.rules.kapoor} title="அவரது பொது விதிகள்" />
        <p className="text-[11px] text-ink-soft mt-2">{result.kapoor.sectionPage}</p>
      </>
    ),
    tilakRaj: () => (
      <>
        <div className="text-xs text-ink mb-3 space-y-1">
          <p>
            இந்த லக்னத்துக்கு: ஜீவன ரத்தினம் <strong>{result.planetGems[result.tilakRaj.ratna.jeevan].ta}</strong> ·
            காரக ரத்தினம் <strong>{result.planetGems[result.tilakRaj.ratna.karaka].ta}</strong> ·
            பாக்கிய ரத்தினம் <strong>{result.planetGems[result.tilakRaj.ratna.bhagya].ta}</strong>
            <Page>{result.tilakRaj.ratnaPage}</Page>
          </p>
          <p>
            யோககாரகர்: {result.tilakRaj.planetClass.yogakaraka.map((p: string) => result.planetGems[p].planetTa).join(', ')} ·
            பாப / மாரகர்: {result.tilakRaj.planetClass.malefic.map((p: string) => result.planetGems[p].planetTa).join(', ')}
            <Page>{result.tilakRaj.planetClassPage}</Page>
          </p>
        </div>
        <ul className="divide-y divide-line/40 text-xs">
          {result.rows.map((r: any) => (
            <li key={r.planet} className="py-2">
              <strong className="text-ink">{r.planetTa}</strong> · {r.gemTa}
              {r.tilakRaj.ratnaRoleTa && <span className="text-ink-soft"> · {r.tilakRaj.ratnaRoleTa}</span>}
              <span className="block"><Stance s={r.tilakRaj.stance}>{r.tilakRaj.textTa}</Stance></span>
              <span className="block text-ink-soft">
                நூல் சொல்லும் அதிபத்தியம்: {lords(r.tilakRaj.statedLords)}
                {r.tilakRaj.omittedLords.length > 0 && ` · விட்டது: ${r.tilakRaj.omittedLords.join(', ')}`}
                {r.tilakRaj.misstatedLords.length > 0 && <span className="text-rose"> · நூலின் பிழை: {r.tilakRaj.misstatedLords.join(', ')} (உண்மை {lords(r.actualLords)})</span>}
              </span>
              {r.tilakRaj.notesTa.map((n: string, i: number) => <span key={i} className="block text-amber-800">{n}</span>)}
            </li>
          ))}
          <li className="py-2">
            <strong className="text-ink">ராகு</strong> · கோமேதகம் — <Stance s={result.nodes.rahu.stance}>
              {result.nodes.rahu.status === 'FAV' ? 'இந்த லக்னத்துக்குச் சாதகம்' : result.nodes.rahu.status === 'NOT_FOR_THIS_LAGNA' ? 'இந்த லக்னத்தினர் அணியக் கூடாது' : 'அவசியமில்லையெனில் அணியக் கூடாது'}
            </Stance>
            <Page>{result.nodes.rahu.sourcePage}</Page>
          </li>
          <li className="py-2">
            <strong className="text-ink">கேது</strong> · வைடூரியம் —{' '}
            {result.nodes.ketu.ketuHouse !== null
              ? <span className="text-ink">கேது {result.nodes.ketu.ketuHouse}-ஆம் இடத்தில்; நூல் சொல்லும் 2, 3, 4, 5, 9, 10-ல் {result.nodes.ketu.houseFavourable ? 'உள்ளது' : 'இல்லை'}. </span>
              : null}
            <span className="text-ink-soft">{result.nodes.ketu.conditionNotJudged}.</span>
            <Page>{result.nodes.ketu.sourcePage}</Page>
          </li>
        </ul>
        <p className="text-[11px] text-ink-soft mt-2">{result.tilakRaj.page}</p>
        <RulesList list={result.rules.tilakRaj} title="அவரது பொது விதிகள்" />
      </>
    ),
    rajKumar: () => (
      <>
        <div className="text-xs text-ink mb-3 space-y-1">
          <p>அட்டவணை, லக்னம் ({result.lagnaTa}): சுபம் — {result.rajKumar.lagnaRow.benefic.join(', ') || '—'}; அசுபம் — {result.rajKumar.lagnaRow.malefic.join(', ') || '(அச்சில் வெற்று)'}</p>
          <p>அட்டவணை, சந்திர ராசி ({result.moonTa}): சுபம் — {result.rajKumar.moonRow.benefic.join(', ')}; அசுபம் — {result.rajKumar.moonRow.malefic.join(', ') || '(அச்சில் வெற்று)'}</p>
          <p className="text-ink-soft">அட்டவணை "லக்னம் அல்லது சந்திர ராசி — எது வலிமையோ" என்கிறது; "வலிமை"யை அவர் வரையறுக்கவில்லை, எனவே இரண்டும் காட்டப்படுகின்றன.</p>
          <Page>{result.rajKumar.page}</Page>
        </div>
        <h3 className="text-sm font-semibold text-ink mb-1">"யார் அணியலாம்" — ஒவ்வொரு ரத்தினத்துக்கும்</h3>
        <ul className="divide-y divide-line/40 text-xs">
          {result.rows.map((r: any) => (
            <li key={r.planet} className="py-2">
              <strong className="text-ink">{r.planetTa}</strong> · {r.gemTa} — <span className="text-ink">{r.rajKumarWho.statusTa}</span>
              {r.rajKumarWho.flagsTa.map((f: string, i: number) => <span key={i} className={`block ${/முரண்/.test(f) ? 'text-amber-800' : 'text-ink-soft'}`}>{f}</span>)}
              <details className="mt-1"><summary className="cursor-pointer text-ink-soft">நூல் சொல்வது</summary><p className="text-ink mt-1">{r.rajKumarWho.textTa}</p><Page>{r.rajKumarWho.page}</Page></details>
            </li>
          ))}
          {(['rahu', 'ketu'] as const).map((n) => (
            <li key={n} className="py-2">
              <strong className="text-ink">{n === 'rahu' ? 'ராகு · கோமேதகம்' : 'கேது · வைடூரியம்'}</strong>
              <p className="text-ink mt-1">{result.nodes[n].rajKumar.textTa}</p>
              <Page>{result.nodes[n].rajKumar.page}</Page>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-ink-soft mt-1">{result.rajKumar.whoPage}</p>
        <details className="mt-3 text-xs">
          <summary className="cursor-pointer font-semibold text-ink">தொல்லை தரும் தசைக்கு "எதிர் ரத்தினம்"</summary>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
            {result.rajKumar.counter.map((c: any) => <li key={c.dashaLord}>{c.dashaLordTa} தசை → {c.gemTa}{c.alt ? ` / ${c.alt}` : ''}</li>)}
            <li>பொதுவாக → {result.rajKumar.counterGeneralTa}</li>
          </ul>
          <Page>{result.rajKumar.counterPage}</Page>
        </details>
        <RulesList list={result.rules.rajKumar} title="அவரது விதிகள் (இரண்டு முரண்படுகின்றன)" />
      </>
    ),
  };

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Gemstones</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ரத்தினங்கள்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          எந்த ரத்தினத்தை அணிவது என்பதற்கு நம்மிடம் உள்ள மூன்று நூல்கள் மூன்று வெவ்வேறு முறைகளைத் தருகின்றன, சில ரத்தினங்களில் முரண்படுகின்றன.
          அதனால் இங்கே எந்த ரத்தினமும் பரிந்துரைக்கப்படுவதில்லை. ஒவ்வொரு நூலின் பதிலும் அதன் பக்கத்துடன் காட்டப்படுகிறது — ரத்தினத் தேர்வை அதிகம் விளக்கும் நூல் முதலில்.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold text-ink">யாருக்கு?</h2>
          {party && <button type="button" onClick={() => { setParty(null); setResult(null); }} className="text-xs text-ink-soft hover:text-rose">மாற்று</button>}
        </div>
        {party ? <p className="text-sm text-teal">✓ {party.label}</p> : manual ? (
          <>
            <BirthDataForm isLoading={loading}
              onSubmit={(bd) => setParty({ kind: 'form', input: toInput(bd), label: bd.name || 'படிவ விவரம்' })} />
            <button type="button" onClick={() => setManual(false)} className="text-xs text-ink-soft mt-2 underline">சேமித்த சுயவிவரங்களிலிருந்து தேர்ந்தெடு</button>
          </>
        ) : (
          <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="சேமித்த சுயவிவரங்களில் தேடு (பெயர் / இடம்)"
              className="w-full mb-2 px-3 py-2 text-sm bg-surface-2 border border-line rounded-xl text-ink" />
            <ul className="max-h-44 overflow-y-auto divide-y divide-line/40 mb-2">
              {rows.length === 0 && <li className="text-xs text-ink-soft py-2">சேமித்த சுயவிவரம் இல்லை.</li>}
              {rows.map((r) => (
                <li key={r.profileId}>
                  <button type="button" className="w-full text-left py-1.5 text-sm text-ink hover:text-saffron"
                    onClick={() => setParty({ kind: 'profile', profileId: r.profileId, revision: r.revision, label: `${r.name} · ${r.birthDate}${r.placeName ? ` · ${r.placeName}` : ''}` })}>
                    {r.name}<span className="text-xs text-ink-soft block">{r.birthDate}{r.placeName ? ` · ${r.placeName}` : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setManual(true)} className="text-xs text-ink-soft underline">அல்லது பிறப்பு விவரத்தை நேரடியாக உள்ளிடு</button>
          </>
        )}
      </section>

      {loading && <p className="text-sm text-ink-soft mb-4">கணக்கிடப்படுகிறது…</p>}
      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink">
              {result.native.name ?? '(பெயர் இல்லை)'} · லக்னம் {result.lagnaTa} · சந்திர ராசி {result.moonTa}
            </h2>
            <p className="text-xs text-ink-soft">{result.native.date} {result.native.time} · {result.native.placeName ?? '—'} · {result.native.method.ayanamsha} அயனாம்சம்</p>
            <p className="mt-2 text-xs text-ink-soft">
              ஏழு ரத்தினங்களில் மூன்று நூல்களும்: ஒத்தவை {(result.agreementCounts.AGREE_FAVOURABLE ?? 0) + (result.agreementCounts.AGREE_UNFAVOURABLE ?? 0)} ·
              முரண்படுபவை {result.agreementCounts.DISAGREE ?? 0} · ஒரே நூல் சொல்வன {result.agreementCounts.ONE_SOURCE ?? 0} ·
              ஓரளவு {result.agreementCounts.PARTIAL ?? 0}.
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-1">நூல்களின் வரிசை</h2>
            <p className="text-ink-soft mb-2">அளவுகோல்: {result.bookRank.measureTa}.</p>
            <ol className="space-y-1">
              {result.books.map((b: any) => (
                <li key={b.key} className="text-ink">
                  <span className="font-mono text-saffron mr-1">{b.rank}.</span><strong>{b.nameTa}</strong> — {b.words.toLocaleString('en-IN')} சொற்கள் ({b.range}): <span className="text-ink-soft">{b.whatTa}</span>
                </li>
              ))}
            </ol>
            <p className="text-ink-soft mt-2">
              {result.bookRank.alternative.measureTa}: காபூர் {result.bookRank.alternative.words.kapoor.toLocaleString('en-IN')},
              ராஜ் குமார் {result.bookRank.alternative.words.rajKumar.toLocaleString('en-IN')}, திலக் ராஜ் {result.bookRank.alternative.words.tilakRaj.toLocaleString('en-IN')} — {result.bookRank.alternative.noteTa}
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">இந்த ஜாதகத்துக்கு மூன்று நூல்கள் — சுருக்கம்</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 860 }}>
                <thead>
                  <tr className="text-ink-soft border-b border-line text-left">
                    <th className="py-1 pr-2">கிரகம் · ரத்தினம்</th><th className="py-1 pr-2">ஆளும் பாவங்கள்</th>
                    {result.books.map((b: any) => <th key={b.key} className="py-1 pr-2">{b.rank}. {b.nameTa}{b.key === 'rajKumar' ? ' (லக்னம்)' : ''}</th>)}
                    <th className="py-1 pr-2">ராஜ் குமார் (சந்திர ராசி)</th><th className="py-1">ஒப்பீடு</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {result.rows.map((r: any) => {
                    const cell: Record<string, ReactNode> = {
                      kapoor: <Stance s={r.kapoor.stance}>{r.kapoor.verdictTa}</Stance>,
                      tilakRaj: <Stance s={r.tilakRaj.stance}>{r.tilakRaj.verdictTa}</Stance>,
                      rajKumar: r.rajKumarLagna.listed === null ? <span className="text-ink-soft">பட்டியலில் இல்லை</span>
                        : <Stance s={r.rajKumarLagna.stance}>{r.rajKumarLagna.listed === 'BENEFIC' ? 'சுபம்' : 'அசுபம்'}</Stance>,
                    };
                    return (
                      <tr key={r.planet} className="border-b border-line/40">
                        <td className="py-2 pr-2 text-ink"><strong>{r.planetTa}</strong> · {r.gemTa}<span className="block text-ink-soft">{r.gem}{r.alsoCalled ? ` (${r.alsoCalled})` : ''}</span></td>
                        <td className="py-2 pr-2 font-mono text-ink">{lords(r.actualLords)}</td>
                        {result.books.map((b: any) => <td key={b.key} className="py-2 pr-2">{cell[b.key]}</td>)}
                        <td className="py-2 pr-2">{r.rajKumarMoon.listed === null ? <span className="text-ink-soft">பட்டியலில் இல்லை</span>
                          : <Stance s={r.rajKumarMoon.stance}>{r.rajKumarMoon.listed === 'BENEFIC' ? 'சுபம்' : 'அசுபம்'}</Stance>}</td>
                        <td className="py-2"><span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${AGREEMENT[r.agreement].cls}`}>{AGREEMENT[r.agreement].label}</span></td>
                      </tr>
                    );
                  })}
                  {(['rahu', 'ketu'] as const).map((n) => {
                    const node = result.nodes[n];
                    const cell: Record<string, ReactNode> = {
                      kapoor: <Stance s={node.kapoor.stance}>{NODE_STATUS_TA[node.kapoor.status]}</Stance>,
                      tilakRaj: n === 'rahu'
                        ? <Stance s={node.stance}>{node.status === 'FAV' ? 'சாதகம்' : node.status === 'NOT_FOR_THIS_LAGNA' ? 'அணியக் கூடாது' : 'அவசியமில்லையெனில் கூடாது'}</Stance>
                        : node.houseFavourable === null ? <span className="text-ink-soft">ஜாதகம் தேவை</span>
                          : <Stance s={node.houseFavourable ? 'COND' : 'UNFAV'}>{node.houseFavourable ? 'இடம் பொருந்துகிறது (மற்ற நிபந்தனை மதிப்பிடப்படவில்லை)' : 'இடம் பொருந்தவில்லை'}</Stance>,
                      rajKumar: <span className="text-ink-soft">தசை / புத்தியில் மட்டும்</span>,
                    };
                    return (
                      <tr key={n} className="border-b border-line/40">
                        <td className="py-2 pr-2 text-ink"><strong>{n === 'rahu' ? 'ராகு' : 'கேது'}</strong> · {node.gemTa}<span className="block text-ink-soft">{node.gem}</span></td>
                        <td className="py-2 pr-2 text-ink-soft">—</td>
                        {result.books.map((b: any) => <td key={b.key} className="py-2 pr-2">{cell[b.key]}</td>)}
                        <td className="py-2 pr-2 text-ink-soft">—</td>
                        <td className="py-2"><span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${AGREEMENT[node.agreement].cls}`}>{AGREEMENT[node.agreement].label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">
              "ஒப்பீடு" நிரல் காபூர், திலக் ராஜ், ராஜ் குமாரின் லக்ன வரிசை ஆகியவற்றை ஒப்பிடுகிறது; சந்திர ராசி வரிசை தனியாகக் காட்டப்படுகிறது.
              ஒவ்வொரு நூலின் முழு விளக்கமும் கீழே, அதே வரிசையில்.
            </p>
          </section>

          {result.books.map((b: any) => (
            <section key={b.key} className="bg-surface border border-line rounded-2xl p-4 mb-4">
              <BookHeading book={book(b.key)} />
              {sections[b.key]()}
            </section>
          ))}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs">
            <h2 className="text-sm font-semibold text-ink mb-1">அணியும் முறை — மூன்று நூல்கள்</h2>
            <p className="text-ink-soft mb-2">எடை, உலோகம், விரல், நாள், சேர்க்கக் கூடாத ரத்தினங்கள் — மூன்று நூல்களும் பெரும்பாலானவற்றில் வேறுபடுகின்றன. எடை ஒவ்வொரு நூலின் அலகிலேயே (கேரட் / ரத்தி); மாற்றுக் கணக்கு எந்த நூலிலும் இல்லை, அதனால் செய்யப்படவில்லை.</p>
            {result.wearing.map((w: any) => (
              <details key={w.planet} className="border-t border-line/40 py-2">
                <summary className="cursor-pointer text-ink"><strong>{w.gemTa}</strong> ({w.planetTa}) — எடை: {result.books.map((b: any) => `${b.nameTa} ${w.books[b.key].weightTa.split(' — ')[0]}`).join(' · ')}</summary>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full" style={{ minWidth: 640 }}>
                    <thead><tr className="text-ink-soft text-left border-b border-line"><th className="py-1 pr-2 w-24"></th>{result.books.map((b: any) => <th key={b.key} className="py-1 pr-2">{b.rank}. {b.nameTa}</th>)}</tr></thead>
                    <tbody className="align-top">
                      {([['weightTa', 'எடை'], ['metalTa', 'உலோகம்'], ['fingerTa', 'விரல்'], ['whenTa', 'எப்போது'], ['notWithTa', 'சேர்க்கக் கூடாதவை'], ['lifeTa', 'பயன் ஆயுள்'], ['substitutesTa', 'மாற்றுக் கல்'], ['extraTa', 'குறிப்பு']] as const).map(([f, label]) => (
                        <tr key={f} className="border-b border-line/30">
                          <td className="py-1 pr-2 text-ink-soft">{label}</td>
                          {result.books.map((b: any) => <td key={b.key} className="py-1 pr-2 text-ink">{w.books[b.key][f] ?? <span className="text-ink-soft">—</span>}</td>)}
                        </tr>
                      ))}
                      <tr><td className="py-1 pr-2 text-ink-soft">பக்கம்</td>{result.books.map((b: any) => <td key={b.key} className="py-1 pr-2 text-[11px] text-ink-soft">{w.books[b.key].page}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
            <ul className="mt-2 space-y-1">
              {result.books.map((b: any) => (
                <li key={b.key} className="text-ink"><strong>{b.nameTa}:</strong> {result.wearingGeneral[b.key].textTa}<Page>{result.wearingGeneral[b.key].page}</Page></li>
              ))}
            </ul>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="font-semibold text-ink mb-2">கிரகத்துக்கான ரத்தினம்</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 420 }}>
                <tbody>
                  {Object.entries(result.planetGems).map(([p, g]: [string, any]) => (
                    <tr key={p} className="border-b border-line/40">
                      <td className="py-1.5 pr-3 text-ink">{g.planetTa}</td>
                      <td className="py-1.5 pr-3 text-ink">{g.ta}</td>
                      <td className="py-1.5 text-ink-soft">{g.en}{g.alsoCalled ? ` · ${g.alsoCalled}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">{result.planetGemsSource.title} — {result.planetGemsSource.page}</p>
            <p className="text-[11px] text-ink-soft mt-1">{result.tamilNamesNote}</p>
          </section>

          <section className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-4 text-xs space-y-2">
            <p className="font-semibold">இந்தப் பக்கம் எப்படிச் செயல்படுகிறது — எது உறுதி, எது இல்லை</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>ஒரே முறை இல்லை.</strong> காபூர்: ஒவ்வொரு ரத்தினத்துக்கும் ஒவ்வொரு லக்னத்துக்கும் தனிப் பத்தி; லக்ன அதிபதியின் ரத்தினம் "ஆளும் கல்". திலக் ராஜ்: லக்னவாரித் தீர்ப்பு, ஜீவன/காரக/பாக்கிய ரத்தினங்கள். ராஜ் குமார்: சுப/அசுப அட்டவணை (லக்னம் அல்லது சந்திர ராசி), ஒவ்வொரு ரத்தினத்துக்கும் "யார் அணியலாம்", இரண்டு முரண்படும் அதிபத்திய விதிகள், தசையில் மட்டும் என்ற பாரம்பரியக் கருத்து.</li>
              <li><strong>வரிசை:</strong> ரத்தினத் தேர்வை அதிகம் விளக்கும் நூல் முதலில் (உரிமையாளர் அறிவுறுத்தல், 2026-10-03). அளவுகோல் மேலே — சொற்களின் எண்ணிக்கை; இது நூலின் சரி/தவறு பற்றிய தீர்ப்பு அல்ல.</li>
              <li><strong>காபூரின் நடைமுறை அவரது விதியைவிடக் கடுமையானது:</strong> அவரது பொது விதி 6, 8, 12-ஐ மட்டுமே அசுபம் என்கிறது; ஆனால் லக்னவாரிப் பத்திகளில் 6/8/12-க்கு அதிபதியல்லாத 41 கிரக-லக்ன இணைகளில் 16-ஐ (3-ஆம் பாவம், மாரக 2, 7 காரணமாக) அவர் அறிவுறுத்தவில்லை.</li>
              <li><strong>நூல்களின் அச்சுப் பிழைகள்</strong> (பக்கப் படத்தில் சரிபார்த்தவை): காபூர் — தனுசு லக்ன அதிபதியைச் "செவ்வாய்" என்கிறார் (ப.80); கும்பத்துக்குக் குருவை "2, 12-ஆம் அதிபதி" என்கிறார், உண்மையில் 2, 11 (ப.92); ரிஷபத்துக்கு "லக்ன அதிபதியின் ரத்தினம் மரகதம்" என்கிறார், உண்மையில் வைரம் (ப.96). திலக் ராஜ் — மீனத்தில் சுக்கிரன் "3, 7" (உண்மையில் 3, 8); தனுசில் குருவுக்கு "Emerald"; சூரியனின் எடை "314 ரத்தி" (3¼ எனப் படிக்கப்பட்டது). இவை திருத்தப்படவில்லை, குறிக்கப்படுகின்றன.</li>
              <li><strong>நூல்களுக்குள் முரண்கள்:</strong> திலக் ராஜின் ப.20 விதி 2, 12-ஆம் அதிபதிகளின் ரத்தினத்தைத் தடுக்கிறது, ஆனால் அவரது 10 லக்னவாரித் தீர்ப்புகள் அவற்றைச் சாதகம் என்கின்றன. ராஜ் குமாரின் அட்டவணை 12 லக்னங்களில் 8-ல் 6/7/8/12-ஆம் அதிபதியின் ரத்தினத்தைச் "சுபம்" என்கிறது; அவரது "யார் அணியலாம்" பகுதியில் 7 இடங்களில் தன் விதியுடனே முரண்படுகிறது (எ.கா. நீலத்துக்கு மேஷம் "குறைந்த அளவில்" பட்டியலிலும் "தவிர்க்க" பட்டியலிலும்). "சேர்க்கக் கூடாது" பட்டியல்கள் சில இடங்களில் ஒரு பக்கம் மட்டும் சொல்லப்படுகின்றன.</li>
              <li><strong>மதிப்பிடப்படாதவை:</strong> "பாதிப்பு" (affliction), அஸ்தமனம், "வலிமை", ஆயுள், நோய், முதுமை, "நல்ல நிலை" — நூல்கள் இவற்றை வரையறுக்கவில்லை அல்லது இவை ஜாதகத்துக்கு வெளியே உள்ளவை. ஒவ்வொரு இடத்திலும் "மதிப்பிடப்படவில்லை" என்று குறிக்கப்படுகிறது.</li>
              <li><strong>ரத்தினப் பெயர்கள்:</strong> காபூர் ப.12-ல் ஜாதக பாரிஜாத ஸ்லோகமும் அதன் ஆங்கில மொழிபெயர்ப்பும் ஒன்பது ரத்தினங்களையும் தருகின்றன; ப.76-ல் மீண்டும் வரும் மொழிபெயர்ப்பு சனியின் ரத்தினத்தை விட்டுவிடுகிறது.</li>
              <li><strong>தமிழ் நூல்கள்:</strong> ரத்தினப் பெயர்கள் மட்டுமே (சாதக அலங்கார உரை, OCR); கிரகத்துக்கு ரத்தினம் ஒதுக்குவதோ தேர்வு விதியோ தமிழ் நூல்களில் காணப்படவில்லை — தமிழ் முறை எதுவும் இங்கு கொடுக்கப்படவில்லை.</li>
              <li><strong>இது பலன் வாக்குறுதி அல்ல.</strong> நூல்கள் சொல்லும் பலன்கள் அந்த நூலின் சொற்களாக மட்டுமே காட்டப்படுகின்றன; ரத்தினம் அணிவதால் பலன் கிடைக்கும் என்று இந்த மென்பொருள் கூறவில்லை. ரத்தினங்கள் விலை உயர்ந்தவை; வாங்கும் முன் நீங்கள் நம்பும் ஜோதிடரிடம் ஆலோசியுங்கள்.</li>
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

function RulesList({ list, title }: { list: any[]; title: string }) {
  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer font-semibold text-ink">{title}</summary>
      <ul className="mt-2 space-y-2">
        {list.map((x) => (
          <li key={x.id}><span className="text-ink">{x.textTa}</span><span className="block text-ink-soft">{x.title} — {x.page}</span></li>
        ))}
      </ul>
    </details>
  );
}
