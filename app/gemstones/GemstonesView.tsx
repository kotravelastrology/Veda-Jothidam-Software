'use client';

import { useEffect, useState } from 'react';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { listCharts, searchCharts } from '../library/actions';
import { computeGems } from './actions';
import type { BirthFormInput } from '../report/actions';

/**
 * Gemstones — what three books say, side by side.
 *
 * The books do not share a method and disagree about particular gems for the
 * same Ascendant, so this page recommends nothing. Each book's answer is shown
 * with its page, and the places they agree and disagree are marked. A reader who
 * wants one answer has to choose a book; the page will not choose for them.
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

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Gemstones</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ரத்தினங்கள்</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          எந்த ரத்தினத்தை அணிவது என்பதற்கு நம்மிடம் உள்ள மூன்று நூல்கள் மூன்று வெவ்வேறு முறைகளைத் தருகின்றன, சில ரத்தினங்களில் முரண்படுகின்றன.
          அதனால் இங்கே எந்த ரத்தினமும் பரிந்துரைக்கப்படுவதில்லை — ஒவ்வொரு நூலின் பதிலும் அதன் பக்கத்துடன் அருகருகே காட்டப்படுகிறது; நூல்கள் ஒத்த, முரண்படும் இடங்கள் குறிக்கப்படுகின்றன.
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
            <p className="mt-2 text-ink">
              லக்ன அதிபதி <strong>{result.planetGems[result.lagnaLord].planetTa}</strong> — காபூர்: அவரது ரத்தினம்
              (<strong>{result.kapoor.rulingStone.gemTa}</strong>, {result.kapoor.rulingStone.gem}) "ஆளும் கல்".
              <span className="block text-[11px] text-ink-soft">{result.kapoor.page}</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              ஏழு ரத்தினங்களில்: ஒத்தவை {(result.agreementCounts.AGREE_FAVOURABLE ?? 0) + (result.agreementCounts.AGREE_UNFAVOURABLE ?? 0)} ·
              முரண்படுபவை {result.agreementCounts.DISAGREE ?? 0} · ஒரே நூல் சொல்வன {result.agreementCounts.ONE_SOURCE ?? 0} ·
              ஓரளவு {result.agreementCounts.PARTIAL ?? 0}.
            </p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-ink mb-2">இந்த லக்னத்துக்கு மூன்று நூல்கள்</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 860 }}>
                <thead>
                  <tr className="text-ink-soft border-b border-line text-left">
                    <th className="py-1 pr-2">கிரகம் · ரத்தினம்</th><th className="py-1 pr-2">ஆளும் பாவங்கள்</th>
                    <th className="py-1 pr-2">காபூர்</th><th className="py-1 pr-2">திலக் ராஜ்</th>
                    <th className="py-1 pr-2">ராஜ் குமார் (லக்னம்)</th><th className="py-1 pr-2">ராஜ் குமார் (சந்திர ராசி)</th><th className="py-1">ஒப்பீடு</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {result.rows.map((r: any) => (
                    <tr key={r.planet} className="border-b border-line/40">
                      <td className="py-2 pr-2 text-ink">
                        <strong>{r.planetTa}</strong> · {r.gemTa}<span className="block text-ink-soft">{r.gem}{r.alsoCalled ? ` (${r.alsoCalled})` : ''}</span>
                      </td>
                      <td className="py-2 pr-2 font-mono text-ink">{lords(r.actualLords)}</td>
                      <td className="py-2 pr-2">
                        <span className={`${r.kapoor.stance ? STANCE_CLS[r.kapoor.stance] : 'text-ink-soft'}`}>{r.kapoor.classTa}</span>
                      </td>
                      <td className="py-2 pr-2">
                        <span className={STANCE_CLS[r.tilakRaj.stance]}>{r.tilakRaj.textTa}</span>
                        <span className="block text-ink-soft mt-0.5">
                          நூல் சொல்லும் பாவங்கள்: {lords(r.tilakRaj.statedLords)}
                          {r.tilakRaj.omittedLords.length > 0 && ` · விட்டது: ${r.tilakRaj.omittedLords.join(', ')}`}
                          {r.tilakRaj.misstatedLords.length > 0 && <span className="text-rose"> · நூலின் பிழை: {r.tilakRaj.misstatedLords.join(', ')} (உண்மை {lords(r.actualLords)})</span>}
                        </span>
                      </td>
                      <td className="py-2 pr-2">
                        {r.rajKumarLagna.listed === null ? <span className="text-ink-soft">பட்டியலில் இல்லை</span>
                          : <span className={STANCE_CLS[r.rajKumarLagna.stance]}>{r.rajKumarLagna.listed === 'BENEFIC' ? 'சுபம்' : 'அசுபம்'}</span>}
                      </td>
                      <td className="py-2 pr-2">
                        {r.rajKumarMoon.listed === null ? <span className="text-ink-soft">பட்டியலில் இல்லை</span>
                          : <span className={STANCE_CLS[r.rajKumarMoon.stance]}>{r.rajKumarMoon.listed === 'BENEFIC' ? 'சுபம்' : 'அசுபம்'}</span>}
                      </td>
                      <td className="py-2"><span className={`text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap ${AGREEMENT[r.agreement].cls}`}>{AGREEMENT[r.agreement].label}</span></td>
                    </tr>
                  ))}
                  <tr className="border-b border-line/40">
                    <td className="py-2 pr-2 text-ink"><strong>{result.planetGems.Rahu.planetTa}</strong> · {result.nodes.rahu.gemTa}<span className="block text-ink-soft">{result.nodes.rahu.gem}</span></td>
                    <td className="py-2 pr-2 text-ink-soft">—</td><td className="py-2 pr-2 text-ink-soft">—</td>
                    <td className="py-2 pr-2" colSpan={3}>
                      <span className={STANCE_CLS[result.nodes.rahu.stance]}>
                        {result.nodes.rahu.status === 'FAV' ? 'இந்த லக்னத்துக்கு சாதகம்' : result.nodes.rahu.status === 'NOT_FOR_THIS_LAGNA' ? 'இந்த லக்னத்தினர் அணியக் கூடாது' : 'அவசியமில்லையெனில் அணியக் கூடாது'}
                      </span>
                      <span className="block text-ink-soft">{result.nodes.rahu.sourcePage}</span>
                    </td>
                    <td className="py-2 text-ink-soft">திலக் ராஜ் மட்டும்</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-2 text-ink"><strong>{result.planetGems.Ketu.planetTa}</strong> · {result.nodes.ketu.gemTa}<span className="block text-ink-soft">{result.nodes.ketu.gem}</span></td>
                    <td className="py-2 pr-2 text-ink-soft">—</td><td className="py-2 pr-2 text-ink-soft">—</td>
                    <td className="py-2 pr-2" colSpan={3}>
                      {result.nodes.ketu.ketuHouse !== null && (
                        <span className="text-ink">கேது {result.nodes.ketu.ketuHouse}-ஆம் இடத்தில் — {result.nodes.ketu.houseFavourable ? 'நூல் சொல்லும் 2, 3, 4, 5, 9, 10-ல் உள்ளது' : 'நூல் சொல்லும் 2, 3, 4, 5, 9, 10-ல் இல்லை'}. </span>
                      )}
                      <span className="text-ink-soft">{result.nodes.ketu.conditionNotJudged}.</span>
                      <span className="block text-ink-soft">{result.nodes.ketu.sourcePage}</span>
                    </td>
                    <td className="py-2 text-ink-soft">திலக் ராஜ் மட்டும்</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">
              திலக் ராஜ்: {result.tilakRajPage}. ராஜ் குமார்: {result.rajKumar.page}. காபூர் ஆளும் கல்: {result.kapoor.page}.
            </p>
            <p className="text-[11px] text-ink-soft mt-1">
              "ஒப்பீடு" நிரல் காபூர், திலக் ராஜ், ராஜ் குமார் (லக்ன வரிசை) ஆகியவற்றை மட்டுமே ஒப்பிடுகிறது; சந்திர ராசி வரிசை தனியாகக் காட்டப்படுகிறது, ஒப்பீட்டில் சேர்க்கப்படவில்லை.
              ராஜ் குமாரின் அட்டவணை "லக்னம் அல்லது சந்திர ராசி — எது வலிமையோ" என்கிறது; "வலிமை" என்பதை அவர் வரையறுக்கவில்லை, எனவே இரண்டு வரிசைகளும் காட்டப்படுகின்றன, ஒன்றைத் தேர்ந்தெடுக்கவில்லை.
              லக்னம்: சுபம் — {result.rajKumar.lagnaRow.benefic.join(', ') || '—'}; அசுபம் — {result.rajKumar.lagnaRow.malefic.join(', ') || '(அச்சில் வெற்று)'}.
              சந்திர ராசி: சுபம் — {result.rajKumar.moonRow.benefic.join(', ')}; அசுபம் — {result.rajKumar.moonRow.malefic.join(', ') || '(அச்சில் வெற்று)'}.
            </p>
          </section>

          {(['kapoor', 'tilakRaj', 'rajKumar'] as const).map((k) => (
            <details key={k} className="bg-surface border border-line rounded-2xl p-4 mb-3 text-sm">
              <summary className="cursor-pointer font-semibold text-ink">
                {k === 'kapoor' ? 'காபூர் — அவர் சொல்லும் விதிகள்' : k === 'tilakRaj' ? 'திலக் ராஜ் — முக்கிய குறிப்புகள்' : 'ராஜ் குமார் — அவர் சொல்லும் விதிகள் (இரண்டு முரண்படுகின்றன)'}
              </summary>
              <ul className="mt-2 space-y-2 text-xs">
                {result.rules[k].map((x: any) => (
                  <li key={x.id}><span className="text-ink">{x.textTa}</span><span className="block text-ink-soft">{x.title} — {x.page}</span></li>
                ))}
              </ul>
            </details>
          ))}

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
              <li><strong>ஒரே முறை இல்லை.</strong> காபூர்: லக்ன அதிபதியின் ரத்தினம் "ஆளும் கல்"; சுப பாவ அதிபதிகளை மட்டும் வலுப்படுத்த வேண்டும். திலக் ராஜ்: ஒவ்வொரு லக்னத்துக்கும் ஏழு ரத்தினங்களுக்கு தனித்தனித் தீர்ப்பு. ராஜ் குமார்: 1, 5, 9-ஆம் அதிபதிகள் (லக்னம் அல்லது சந்திர ராசியிலிருந்து); அதே நூலில் இன்னொரு இடத்தில் 1, 4, 5, 9, 10; பாரம்பரியக் கருத்து — கிரகத்தின் தசையில் மட்டுமே அணிவது.</li>
              <li><strong>நூல்களின் உள் முரண்:</strong> ராஜ் குமாரின் அட்டவணை 12 லக்னங்களில் 8-ல் 6/7/8/12-ஆம் அதிபதியாகவும் உள்ள ஒரு கிரகத்தின் ரத்தினத்தைச் "சுபம்" என்கிறது — அவரது முதல் விதி அதைத் தடுக்கிறது (கலப்பு அதிபத்தியத்தில் அவர் நல்ல பாவத்துக்கு முன்னுரிமை தருகிறார்). கடகத்தில் மாணிக்கம் அவரது இரண்டு விதிகளுக்கும் வெளியே உள்ளது (சூரியன் 2-ஆம் அதிபதி மட்டும்).</li>
              <li><strong>திலக் ராஜ் நூலின் பிழை:</strong> மீன லக்னத்தில் சுக்கிரனை 3, 7-ஆம் அதிபதி என்கிறார்; உண்மையில் 3, 8. சில இடங்களில் ஒரு அதிபத்தியத்தை விட்டுவிடுகிறார் (மேஷத்தில் செவ்வாய் 8, ரிஷபத்தில் சுக்கிரன் 6, கும்பத்தில் சனி 12, தனுசில் சந்திரன் 8). தனுசு லக்னத்தில் குருவின் உள்ளீட்டில் "Emerald" என்று அச்சுப் பிழை உள்ளது. இவையெல்லாம் வரிசையில் குறிக்கப்படுகின்றன.</li>
              <li><strong>காபூர் மொழிபெயர்ப்பு</strong> ஜாதக பாரிஜாத ஸ்லோகத்தில் சனியின் ரத்தினத்தை (நீலம்) விட்டுவிடுகிறது; ஸ்லோகம் அதைத் தருகிறது.</li>
              <li><strong>"வலிமை", யோககாரகன், அஸ்தமனம்</strong> ஆகியவற்றை நூல்கள் வரையறுக்கவில்லை; இங்கு மதிப்பிடப்படவில்லை. கலப்பு அதிபத்தியம் (எ.கா. 6-ஆம் பாவமும் 9-ஆம் பாவமும்) காபூரின் பொது விதியில் தீர்க்கப்படவில்லை; அவரது ஆசனவாரி உரைதான் தீர்மானிக்கும் — அது இங்கு குறியாக்கப்படவில்லை.</li>
              <li><strong>தமிழ் நூல்கள்:</strong> ரத்தினப் பெயர்கள் மட்டுமே (சாதக அலங்கார உரை, OCR); கிரகத்துக்கு ரத்தினம் ஒதுக்குவதோ தேர்வு விதியோ தமிழ் நூல்களில் காணப்படவில்லை — தமிழ் முறை எதுவும் இங்கு கொடுக்கப்படவில்லை.</li>
              <li><strong>இது பலன் வாக்குறுதி அல்ல.</strong> ரத்தினம் அணிவதால் பலன் கிடைக்கும் என்று இந்த மென்பொருள் கூறவில்லை. ரத்தினங்கள் விலை உயர்ந்தவை; வாங்கும் முன் நீங்கள் நம்பும் ஜோதிடரிடம் ஆலோசியுங்கள்.</li>
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
