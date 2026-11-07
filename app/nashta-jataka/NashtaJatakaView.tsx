'use client';

import { useEffect, useState } from 'react';
import { computeNashtaJataka } from './actions';
import { citeTa } from '@/src/sources/citeTa';
import { PageEyebrow } from '@/src/ui/PageEyebrow';

/**
 * Lost horoscopy (Nashta Jataka), BPHS ch.78: the birth moment of one who does not know it, from the chart of the moment of the question and the querist's approximate age.
 * Every step of the book is shown with what this chart gives; each year in the age window in which Jupiter stood where the book says is a candidate, and none is chosen.
 */

const num = { fontVariantNumeric: 'tabular-nums' as const };
const input = 'px-2 py-1 bg-surface-2 border border-line rounded text-ink';
const AYANA_TA: Record<string, string> = { uttara: 'உத்தராயணம் (சௌம்யாயனம்)', dakshina: 'தட்சிணாயனம் (யாம்யாயனம்)' };
const RITU_TA: Record<string, string> = { Vasanta: 'வசந்தம்', Grishma: 'கிரீஷ்மம்', Varsha: 'வர்ஷம்', Sharad: 'சரத்', Hemanta: 'ஹேமந்தம்', Shishira: 'சிசிரம்' };
const PLANET_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி' };

function loc(data: any, verses: string, page: string) {
  const source: any = { title: data.source.title, author: data.source.author };
  const where = verses === 'example' ? 'worked example' : verses === 'notes' ? "translator's notes" : `v.${verses}`;
  source.pageLocus = `Chapter 78 ${where}, printed ${page.includes('-') ? 'pp.' : 'p.'}${page}`;
  return citeTa(source);
}
const dmy = (iso: string) => iso.split('-').reverse().join('-');
const dms = (deg: number) => {
  const total = Math.round(deg * 3600);
  return `${Math.floor(total / 3600)}° ${String(Math.floor((total % 3600) / 60)).padStart(2, '0')}′ ${String(total % 60).padStart(2, '0')}″`;
};

export default function NashtaJatakaView() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [offset, setOffset] = useState('330');
  const [place, setPlace] = useState({ name: 'சென்னை', latitude: '13.0827', longitude: '80.2707' });
  const [ageMin, setAgeMin] = useState('25');
  const [ageMax, setAgeMax] = useState('30');
  const [otherBirth, setOtherBirth] = useState(false);
  const [bplace, setBplace] = useState({ name: '', latitude: '', longitude: '', offset: '330' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date(Date.now() + 330 * 60000).toISOString();
    setDate(now.slice(0, 10)); setTime(now.slice(11, 16));
  }, []);

  const run = () => {
    setLoading(true); setError(null);
    computeNashtaJataka({
      query: { date, time, utcOffsetMinutes: Number(offset) },
      place: { name: place.name, latitude: Number(place.latitude), longitude: Number(place.longitude) },
      age: { min: Number(ageMin), max: Number(ageMax) },
      ...(otherBirth ? { birthPlace: { name: bplace.name, latitude: Number(bplace.latitude), longitude: Number(bplace.longitude), utcOffsetMinutes: Number(bplace.offset) } } : {}),
    })
      .then(setResult)
      .catch((e) => { setError(e instanceof Error ? e.message : String(e)); setResult(null); })
      .finally(() => setLoading(false));
  };

  const s = result?.steps;
  const data = result?.data;
  const book = (k: string) => data.steps[k];
  const rows: [string, string, string, string][] = result ? [
    ['சம்வத்சரம் (பிறப்பில் குரு)', book('samvatsara').ta, `பிரசன்ன லக்னம் ${result.query.lagnaTa} ${dms(result.query.lagnaDegree)}; அதன் த்வாதசாம்சம் ${s.samvatsaraTa}. பிறப்பில் குரு ${s.samvatsaraTa} ராசியில்; வினவும்போது குரு ${result.query.jupiterTa} ராசியில் (${s.yearsBackToFirst} ஆண்டு முன்பு, அல்லது +12, +24 …).`, loc(data, book('samvatsara').verses, book('samvatsara').page)],
    ['அயனம்', book('ayana').ta, `லக்னம் ${dms(result.query.lagnaDegree)} → ${result.query.lagnaDegree < 15 ? 'முதல் பாதி' : 'இரண்டாம் பாதி'}: ${AYANA_TA[s.ayana]}.`, loc(data, book('ayana').verses, book('ayana').page)],
    ['ருது', book('ritu').ta, `லக்னம் விழும் த்ரேக்காணம் ${s.drekkanaSignTa}; அதிபதி ${PLANET_TA[s.drekkanaLord]} → ${RITU_TA[s.rituByLord]}.`, loc(data, book('ritu').verses, book('ritu').page)],
    ['அயனம்-ருது முரண்', book('contradiction').ta, s.exchanged
      ? `முரண் இருந்தது; ${PLANET_TA[s.drekkanaLord]}க்குப் பதில் ${PLANET_TA[s.usedLord]} → ${RITU_TA[s.ritu]}.`
      : s.contradiction ? `முரண் உள்ளது; இந்த அதிபதிக்கு நூல் இணை சொல்லவில்லை (அடுத்த படிகள் ${RITU_TA[s.ritu]} அடிப்படையில், நம்பகம் குறைவு).` : 'முரண் இல்லை.', loc(data, book('contradiction').verses, book('contradiction').page)],
    ['மாதம்', book('month').ta, `த்ரேக்காணத்தின் ${s.half === 0 ? 'முதல்' : 'பிற்'}பாதி → ${RITU_TA[s.ritu]} ருதுவின் ${s.half === 0 ? 'முதல்' : 'இரண்டாம்'} மாதம்: சூரியன் ${s.monthSignTa} ராசியில்.`, loc(data, book('month').verses, book('month').page)],
    ['சூரியனின் பாகை', book('sun').ta, `அரைத்-த்ரேக்காணத்தில் கடந்தது ${dms(s.expiredDegrees)} × 6 = ${dms(s.sunDegrees)}. பிறப்புச் சூரியன்: ${s.monthSignTa} ${dms(s.sunDegrees)}.`, loc(data, book('sun').verses, book('sun').page)],
  ] : [];

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-5">
        <PageEyebrow fallback="Lost Horoscopy" />
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">நஷ்ட ஜாதகம் — பிறந்த நேரம் தெரியாதபோது</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          பிருஹத் பராசர ஹோரா சாஸ்திரம் அத். 78: வினவும் நேரத்தின் பிரசன்ன லக்னத்திலிருந்தும் வினவுபவரின் தோராய வயதிலிருந்தும் பிறந்த ஆண்டு, அயனம், ருது, மாதம், சூரியனின் பாகை, இஷ்டகாலம் ஆகியவற்றை நூல் படிப்படியாகக் காண்கிறது.
          ஒவ்வொரு படியும் இங்கே நூலின் வரிகளுடன் காட்டப்படுகிறது; பிறந்த ஆண்டுகளில் எதையும் நாங்கள் தேர்ந்தெடுக்கவில்லை. இது முடிவு அல்ல — விசாரித்து உறுதிசெய்ய வேண்டிய வேட்பாளர்கள்.
        </p>
      </header>

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <h2 className="text-sm font-semibold text-ink mb-2">வினவிய கணம், வினவுபவரின் வயது</h2>
        <div className="flex flex-wrap gap-3 items-end text-xs">
          <label className="text-ink-soft">தேதி <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`ml-1 ${input}`} /></label>
          <label className="text-ink-soft">நேரம் <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`ml-1 ${input}`} /></label>
          <label className="text-ink-soft">இடம் <input value={place.name} onChange={(e) => setPlace({ ...place, name: e.target.value })} className={`ml-1 w-24 ${input}`} /></label>
          <label className="text-ink-soft">அட்சரேகை <input type="number" step="0.001" value={place.latitude} onChange={(e) => setPlace({ ...place, latitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
          <label className="text-ink-soft">தீர்க்கரேகை <input type="number" step="0.001" value={place.longitude} onChange={(e) => setPlace({ ...place, longitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
          <label className="text-ink-soft">UTC நிமிடம் <input type="number" step="30" value={offset} onChange={(e) => setOffset(e.target.value)} className={`ml-1 w-16 ${input}`} /></label>
          <label className="text-ink-soft">வயது (தோராயம்) <input type="number" min="0" max="120" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} className={`ml-1 w-14 ${input}`} /> – <input type="number" min="0" max="120" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} className={`w-14 ${input}`} /></label>
          <label className="text-ink-soft"><input type="checkbox" checked={otherBirth} onChange={(e) => setOtherBirth(e.target.checked)} className="mr-1" />பிறந்த இடம் வேறு</label>
          <button type="button" onClick={run} disabled={loading || !date || !time} className="px-3 py-1.5 rounded bg-ink text-surface font-semibold disabled:opacity-50">{loading ? 'கணக்கிடப்படுகிறது…' : 'பார்'}</button>
        </div>
        {otherBirth && (
          <div className="flex flex-wrap gap-3 items-end text-xs mt-2">
            <label className="text-ink-soft">பிறந்த இடம் <input value={bplace.name} onChange={(e) => setBplace({ ...bplace, name: e.target.value })} className={`ml-1 w-24 ${input}`} /></label>
            <label className="text-ink-soft">அட்சரேகை <input type="number" step="0.001" value={bplace.latitude} onChange={(e) => setBplace({ ...bplace, latitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
            <label className="text-ink-soft">தீர்க்கரேகை <input type="number" step="0.001" value={bplace.longitude} onChange={(e) => setBplace({ ...bplace, longitude: e.target.value })} className={`ml-1 w-20 ${input}`} /></label>
            <label className="text-ink-soft">UTC நிமிடம் <input type="number" step="30" value={bplace.offset} onChange={(e) => setBplace({ ...bplace, offset: e.target.value })} className={`ml-1 w-16 ${input}`} /></label>
          </div>
        )}
        <p className="text-[11px] text-ink-soft mt-2">பிறந்த இடத்தை நூல் குறிப்பிடவில்லை; வேறு இடம் தராவிட்டால் வினவிய இடத்தின் சூரிய உதயம் எடுக்கப்படுகிறது. சூரிய உதயம் என்பது மென் விளிம்பு (upper limb) உதயம்.</p>
      </section>

      {error && <p className="text-rose text-sm mb-4 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}

      {result && (
        <>
          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">நூலின் படிகள் — இந்தப் பிரசன்ன லக்னத்தில் ({dmy(result.query.date)} {result.query.time})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 720 }}>
                <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-2">படி</th><th className="py-1 pr-2">நூல்</th><th className="py-1 pr-2">இந்த ஜாதகத்தில்</th><th className="py-1">மூலம்</th></tr></thead>
                <tbody className="align-top">
                  {rows.map((r) => (
                    <tr key={r[0]} className="border-b border-line/40">
                      <td className="py-1.5 pr-2 font-semibold text-ink whitespace-nowrap">{r[0]}</td>
                      <td className="py-1.5 pr-2 text-ink-soft">{r[1]}</td>
                      <td className="py-1.5 pr-2 text-ink" style={num}>{r[2]}</td>
                      <td className="py-1.5 text-[11px] text-ink-soft">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink-soft mt-2">{data.ritusSource.ta} ({data.ritusSource.locus}).</p>
          </section>

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
            <h2 className="text-sm font-semibold text-ink mb-2">வயது {ageMin}–{ageMax}-இல் சூரியன் அந்த நிலையை அடையும் ஆண்டுகள் (குருவின் ராசி சரிபார்ப்புடன்)</h2>
            <p className="text-[11px] text-ink-soft mb-2">நூல் "பஞ்சாங்கத்தால் உறுதிசெய்யப்பட்டது" என்பதுபோல், அந்த நாளில் குரு {s.samvatsaraTa} ராசியில் இருந்த ஆண்டுகள் வேட்பாளர்கள். குரு ஒரு ராசியில் ஓராண்டுக்கு மேல் இருக்கலாம் என்பதால் ஒன்றுக்கு மேற்பட்ட ஆண்டுகள் வரலாம்.</p>
            <ul className="text-xs space-y-0.5" style={num}>
              {result.years.map((y: any) => (
                <li key={y.year} className={y.matches ? 'text-ink font-semibold' : 'text-ink-soft'}>
                  {y.year} · வயது {y.age.toFixed(1)} · குரு {y.jupiterSignTa} {y.matches ? '✔ பொருந்துகிறது' : '✗'}
                </li>
              ))}
            </ul>
            {result.viaTrikona && <p className="text-[11px] text-ink mt-2">{s.samvatsaraTa} ராசியில் குரு இருந்த ஆண்டு வயது எல்லைக்குள் இல்லை; நூல் (v.12) சொல்லும் மற்ற வாசிப்பாகக் குருவை பிரசன்ன லக்னத்திலிருந்து 5 அல்லது 9-ஆம் ராசியில் கொண்டு வேட்பாளர் தேடப்பட்டது.</p>}
            {result.candidates.length === 0 && <p className="text-xs text-rose mt-2">வயது எல்லைக்குள் பொருந்தும் ஆண்டு எதுவும் இல்லை; வயது எல்லையை விரிக்கவும்.</p>}
          </section>

          {result.candidates.map((c: any) => (
            <section key={c.year} className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
              <h2 className="font-semibold text-ink" style={num}>{dmy(c.date)} · {c.time} <span className="text-ink-soft font-normal text-xs">(வயது {c.ageYears.toFixed(1)})</span></h2>
              <p className="text-xs text-ink mt-1" style={num}>
                சூரிய உதயம் {dmy(c.sunriseDate)} {c.sunrise}; இஷ்டகாலம் <strong>{c.ghatikas} நாழிகை {c.palas} விநாழிகை</strong> உதயத்துக்குப் பின் (1 நாழிகை = 24 நிமிடம்).
                உதயத்தில் சூரியன் ராசிக்குள் {dms(c.sunAtSunrise % 30)}, ஒருநாள் நகர்ச்சி {dms(c.sunMotion)}.
                சூரியனின் சரியான நிலை அடையும் கணத்துடன் வேறுபாடு {Math.abs(c.exactDifferenceMinutes).toFixed(1)} நிமிடம்.
              </p>
              <p className="text-xs text-ink mt-1">
                அந்த நேரத்துக்கான ஜாதகம்: லக்னம் <strong>{c.lagnaTa}</strong> · சந்திரன் {c.moonSignTa}, {c.moonStarTa} · குரு {c.jupiterSignTa}.
              </p>
              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-ink-soft">{c.lagnaTa} லக்னத்தவரின் அடையாளங்கள் (மொழிபெயர்ப்பாளரின் குறிப்பு) — விசாரித்து உறுதிசெய்ய</summary>
                <p className="mt-1 text-ink">{result.lagnaNotes[c.lagnaSign].ta}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{data.lagnaNotes.source.ta} {loc(data, 'notes', result.lagnaNotes[c.lagnaSign].page)}</p>
              </details>
              <p className="text-[11px] text-ink-soft mt-2">இந்த நேரம் சூரியனின் நிலையிலிருந்து மட்டுமே பெறப்பட்டது; லக்ன அடையாளங்கள், வாழ்க்கை நிகழ்வுகள் மூலம் சரிபார்க்க வேண்டும் (ஜனன கால திருத்தம் கருவியைப் பார்க்கவும்).</p>
            </section>
          ))}

          <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-xs text-ink-soft">
            <p>{data.scopeTa}</p>
            <p className="mt-1">{data.closing.ta} ({loc(data, 'notes', data.closing.page)}).</p>
          </section>
        </>
      )}
    </main>
  );
}
