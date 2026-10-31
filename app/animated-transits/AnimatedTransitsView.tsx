'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PartyChooser, type Party } from '@/src/ui/PartyChooser';
import { useChartParty, inputFromSaved } from '@/src/ui/chartParty';
import { houseFrom } from '@/src/report/transitHouse';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import { computeTransitMoment, stepTransitMoment, type PartyRef } from './actions';

/**
 * PL9's "Animated transits" (093 partner, 098, 099): the sky of a moment against the birth chart. The wheel has the birth chart inside and the
 * transits outside, the houses numbered from the birth lagna; the moment moves by PL9's units, forward or back, or runs by itself (Realtime,
 * or Animate stepping the chosen unit). Pure astronomy plus the pages' own rules: nothing is a verdict.
 *
 * Partner mode (/animated-transits?partner=1, PL9's "Animated Transit - Partner" worksheet, user guide ch.13): the native on the
 * left and the partner on the right under a yellow band, both read against the same sky, each from their own lagna. One moment,
 * one set of controls: the change time tool animates the transit over both.
 */

const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const NAK_TA = ['அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுசம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'];
const P_TA: Record<string, string> = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Lagna: 'லக்னம்' };
const P_SHORT: Record<string, string> = { Sun: 'சூ', Moon: 'சந்', Mars: 'செ', Mercury: 'பு', Jupiter: 'கு', Venus: 'சு', Saturn: 'சனி', Rahu: 'ரா', Ketu: 'கே', Lagna: 'லக்' };
const P_COLOR: Record<string, string> = { Sun: '#d97706', Moon: '#64748b', Mars: '#dc2626', Mercury: '#16a34a', Jupiter: '#ca8a04', Venus: '#db2777', Saturn: '#2563eb', Rahu: '#7c3aed', Ketu: '#0891b2', Lagna: '#111827' };
const LEVEL_TA: Record<string, string> = { Dasha: 'தசை', Bhukti: 'புக்தி', Antara: 'அந்தரம்', Sookshma: 'சூக்ஷ்மம்', Prana: 'பிராணன்' };
const UNITS: [string, string][] = [['10 Years', '10 ஆண்டு'], ['Year', 'ஆண்டு'], ['Month', 'மாதம்'], ['Week', 'வாரம்'], ['Day', 'நாள்'], ['Ascendant', 'லக்னம்'], ['Navamsha', 'நவாம்சம்'], ['Hours', 'மணி'], ['10 Minutes', '10 நிமிடம்'], ['Minutes', 'நிமிடம்'], ['10 Seconds', '10 விநாடி'], ['Seconds', 'விநாடி']];
const num = { fontVariantNumeric: 'tabular-nums' as const };
const pad = (n: number) => String(n).padStart(2, '0');
const dmsOf = (d: number) => { const m = Math.floor((d % 1) * 60); const s = Math.round((((d % 1) * 60) % 1) * 60); return `${Math.floor(d)}°${pad(m)}′${pad(s === 60 ? 59 : s)}″`; };
const refOf = (p: Party): PartyRef => (p.kind === 'profile' ? { profile: { profileId: p.profileId, revision: p.revision } } : { form: p.input });

/** Concentric wheel: houses from the birth lagna, counter-clockwise like PL9's, natal planets inside, transits outside. */
function Wheel({ natal, transit, label }: { natal: any; transit: any; label: string }) {
  const S = 420; const c = S / 2;
  // angle on the wheel: PL9 puts house 1 low on the right and numbers the houses counter-clockwise; the birth lagna is 35 degrees below the east
  const ang = (lon: number) => ((lon - natal.lagnaLongitude - 35) * Math.PI) / 180;
  const pt = (lon: number, r: number) => [c + r * Math.cos(ang(lon)), c - r * Math.sin(ang(lon))];
  const spread = (items: { id: string; lon: number }[], r: number) => {
    const sorted = [...items].sort((a, b) => a.lon - b.lon);
    const placed: { id: string; lon: number; shown: number }[] = [];
    for (const it of sorted) {
      let shown = it.lon;
      const prev = placed[placed.length - 1];
      if (prev && Math.abs(shown - prev.shown) < 7) shown = prev.shown + 7;
      placed.push({ ...it, shown });
    }
    return placed.map((p) => ({ ...p, xy: pt(p.shown, r), tick: [pt(p.lon, r - 8), pt(p.lon, r + 8)] }));
  };
  const natalItems = spread(Object.entries(natal.grahas).map(([id, g]: [string, any]) => ({ id, lon: g.longitude })).concat([{ id: 'Lagna', lon: natal.lagnaLongitude }]), 108);
  const transitItems = spread(transit.planets.map((p: any) => ({ id: p.planet, lon: p.longitude })).concat([{ id: 'Lagna', lon: transit.lagnaLongitude }]), 178);
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full max-w-md" role="img" aria-label={label}>
      <circle cx={c} cy={c} r={200} fill="none" stroke="currentColor" opacity={0.5} />
      <circle cx={c} cy={c} r={150} fill="none" stroke="currentColor" opacity={0.5} />
      <circle cx={c} cy={c} r={72} fill="none" stroke="currentColor" opacity={0.5} />
      {Array.from({ length: 12 }, (_, h) => {
        const lon = natal.lagnaLongitude + h * 30;
        const [x1, y1] = pt(lon, 72); const [x2, y2] = pt(lon, 200); const [tx, ty] = pt(lon + 15, 190);
        return (
          <g key={h}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" opacity={0.35} />
            <text x={tx} y={ty + 4} textAnchor="middle" fontSize="12" fill="currentColor" opacity={0.7}>{h + 1}</text>
          </g>
        );
      })}
      {natalItems.map((p) => (
        <g key={`n${p.id}`}>
          <line x1={p.tick[0][0]} y1={p.tick[0][1]} x2={p.tick[1][0]} y2={p.tick[1][1]} stroke={P_COLOR[p.id]} />
          <text x={p.xy[0]} y={p.xy[1] + 4} textAnchor="middle" fontSize="11" fill={P_COLOR[p.id]}>{P_SHORT[p.id]}</text>
        </g>
      ))}
      {transitItems.map((p) => (
        <g key={`t${p.id}`}>
          <line x1={p.tick[0][0]} y1={p.tick[0][1]} x2={p.tick[1][0]} y2={p.tick[1][1]} stroke={P_COLOR[p.id]} />
          <text x={p.xy[0]} y={p.xy[1] + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill={P_COLOR[p.id]}>{P_SHORT[p.id]}{transit.planets.find((q: any) => q.planet === p.id)?.retrograde && p.id !== 'Rahu' && p.id !== 'Ketu' ? 'வ' : ''}</text>
        </g>
      ))}
    </svg>
  );
}

function PartyPanel({ data, title, compact = false, partner = false }: { data: any; title: string; compact?: boolean; partner?: boolean }) {
  const g = data.gochara;
  return (
    <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
      <h2 className={`font-semibold text-ink ${partner ? 'bg-saffron/35 -mx-4 -mt-4 mb-2 px-4 py-2 rounded-t-2xl' : ''}`}>{title}: {data.native.name ?? '(பெயர் இல்லை)'}</h2>
      <p className="text-xs text-ink-soft mb-3">உள்வட்டம்: ஜன்ம ஜாதகம் · வெளிவட்டம்: கோசாரம் · வீடுகள் ஜன்ம லக்னத்திலிருந்து</p>
      <div className={`grid ${compact ? '' : 'lg:grid-cols-2'} gap-4`}>
        <div className="flex flex-col items-center gap-3">
          <Wheel natal={data.natal} transit={data.transit} label={title} />
          <VedicChartBox
            lagnaRasiIndex={data.natal.lagnaSign}
            grahas={Object.entries(data.natal.grahas).map(([id, gr]: [string, any]) => ({ id, rasiIndex: gr.rasiIndex, degreeInSign: gr.degreeInSign }))}
            transitGrahas={data.transit.planets.map((p: any) => ({ id: p.planet, rasiIndex: p.sign, degreeInSign: p.degree, retrograde: p.retrograde }))}
            title="கோசாரம் (தென்னிந்திய)" size={300}
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-ink mb-1">கோசார கிரகங்கள்</h3>
            <table className="w-full text-xs" style={num}>
              <thead><tr className="text-left text-ink-soft"><th>கிரகம்</th><th>தீர்க்கம்</th><th>ராசி</th><th title="இந்த ஜாதகரின் லக்னத்திலிருந்து">பாவம்</th><th>நட்சத்திரம்</th><th>பாதம்</th><th>அதிபதி</th></tr></thead>
              <tbody>
                <tr className="border-t border-line/40"><td className="py-0.5">லக்னம்</td><td>{dmsOf(data.transit.lagnaLongitude % 30)}</td><td>{SIGN_TA[data.transit.lagnaSign]}</td><td>{houseFrom(data.natal.lagnaSign, data.transit.lagnaSign)}</td><td colSpan={3} /></tr>
                {data.transit.planets.map((p: any) => (
                  <tr key={p.planet} className="border-t border-line/40">
                    <td className="py-0.5" style={{ color: P_COLOR[p.planet] }}>{P_TA[p.planet]}{p.retrograde && p.planet !== 'Rahu' && p.planet !== 'Ketu' ? ' (வ)' : ''}</td>
                    <td>{dmsOf(p.degree)}</td><td>{SIGN_TA[p.sign]}</td><td>{houseFrom(data.natal.lagnaSign, p.sign)}</td><td>{NAK_TA[p.nakshatraIndex]}</td><td>{p.pada}</td><td>{P_TA[p.nakshatraLord]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink mb-1">காக்ஷ்யா (ஜன்ம அஷ்டகவர்க்கத்தில்)</h3>
            <table className="w-full text-xs" style={num}>
              <thead><tr className="text-left text-ink-soft"><th>கிரகம்</th><th>ராசி</th><th>காக்ஷ்யா (அதிபதி)</th><th>பிந்து</th><th>பின்ன</th><th>சர்வ</th></tr></thead>
              <tbody>
                {data.kakshas.map((k: any) => (
                  <tr key={k.planet} className="border-t border-line/40">
                    <td className="py-0.5">{P_TA[k.planet]}</td><td>{SIGN_TA[k.sign]}</td><td>{k.kakshya} ({P_TA[k.lord]})</td>
                    <td className={k.bindu ? 'text-teal' : 'text-rose'}>{k.bindu ? 1 : 0}</td><td>{k.bhinna}</td><td>{k.sarva}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-0.5 text-xs">
            <dt className="text-ink-soft">தாரை</dt><dd>{g.tara.nameTa} ({g.tara.count}-ஆவது)</dd>
            <dt className="text-ink-soft">சந்திரன்</dt><dd>ஜன்ம சந்திரனிலிருந்து {g.chandraFromBirthMoon}-ஆம் ராசி</dd>
            <dt className="text-ink-soft">திதி</dt><dd>{g.tithi.paksha === 'SHUKLA' ? 'சுக்ல' : 'கிருஷ்ண'} {g.tithi.name}</dd>
            <dt className="text-ink-soft">யோகம் / கரணம்</dt><dd>{g.yoga.name} / {g.karana.name}</dd>
            <dt className="text-ink-soft">விம்சோத்தரி</dt><dd style={num}>{data.dashas.vimshottari.map((d: any) => P_TA[d.lord]).join(' – ')} <span className="text-ink-soft">({data.dashas.vimshottari.map((d: any) => LEVEL_TA[d.level]).join(' · ')})</span></dd>
            {data.dashas.yogini && <><dt className="text-ink-soft">யோகினி</dt><dd>{data.dashas.yogini.yoginiTa} ({P_TA[data.dashas.yogini.lord]})</dd></>}
            {data.dashas.ashtottari && <><dt className="text-ink-soft">அஷ்டோத்தரி</dt><dd>{P_TA[data.dashas.ashtottari.lord]}</dd></>}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function AnimatedTransitsView() {
  const partnerMode = useSearchParams().get('partner') === '1';
  const { party, setParty, recent } = useChartParty();
  const [partner, setPartner] = useState<Party | null>(null);
  const [usePartner, setUsePartner] = useState(partnerMode);
  // the menu goes from the plain page to the partner worksheet without leaving the route
  useEffect(() => { if (partnerMode) setUsePartner(true); }, [partnerMode]);
  const [atMs, setAtMs] = useState<number>(() => Date.now());
  const [place, setPlace] = useState({ latitude: '13.0827', longitude: '80.2707', offset: '330', name: 'சென்னை' });
  const [mode, setMode] = useState<'STOP' | 'REALTIME' | 'ANIMATE'>('STOP');
  const [animUnit, setAnimUnit] = useState('Day');
  const [speed, setSpeed] = useState(900);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const atRef = useRef(atMs);
  atRef.current = atMs;

  const placeObj = useCallback(() => ({ latitude: parseFloat(place.latitude), longitude: parseFloat(place.longitude), utcOffsetMinutes: parseInt(place.offset, 10), placeName: place.name }), [place]);

  const refresh = useCallback(async (ms: number) => {
    if (!party || busyRef.current) return;
    busyRef.current = true; setBusy(true); setError(null);
    try {
      const parties = [refOf(party), ...(usePartner && partner ? [refOf(partner)] : [])];
      setData(await computeTransitMoment({ parties, atMs: ms, place: placeObj() }));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setMode('STOP'); } finally { busyRef.current = false; setBusy(false); }
  }, [party, partner, usePartner, placeObj]);

  useEffect(() => { refresh(atMs); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [party, partner, usePartner]);

  const go = useCallback(async (unit: string, dir: 1 | -1) => {
    const next = await stepTransitMoment({ atMs: atRef.current, unit, direction: dir, place: placeObj() });
    setAtMs(next); atRef.current = next; refresh(next);
  }, [placeObj, refresh]);

  useEffect(() => {
    if (mode === 'STOP') return undefined;
    const id = setInterval(async () => {
      if (busyRef.current) return;
      if (mode === 'REALTIME') { const now = Date.now(); setAtMs(now); atRef.current = now; refresh(now); } else { await go(animUnit, 1); }
    }, mode === 'REALTIME' ? 2000 : speed);
    return () => clearInterval(id);
  }, [mode, animUnit, speed, go, refresh]);

  const off = parseInt(place.offset, 10) || 0;
  const local = new Date(atMs + off * 60000);
  const dateStr = `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`;
  const timeStr = `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(local.getUTCSeconds())}`;
  const setDateTime = (d: string, t: string) => {
    const [y, m, dd] = d.split('-').map(Number); const [h, mi, s] = t.split(':').map(Number);
    if (![y, m, dd, h, mi].every(Number.isFinite)) return;
    const ms = Date.UTC(y, m - 1, dd, h, mi, s || 0) - off * 60000;
    setAtMs(ms); refresh(ms);
  };
  const field = 'px-2 py-1.5 text-sm bg-surface border border-line rounded text-ink';

  return (
    <main className={`min-h-screen p-6 mx-auto ${usePartner ? 'max-w-[88rem]' : 'max-w-6xl'}`}>
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Animated transits · 093, 098, 099</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">{partnerMode ? 'அனிமேஷன் கோசாரம் — துணை (Partner)' : 'அனிமேஷன் கோசாரம்'}</h1>
        <p className="text-sm text-ink-soft mt-1 max-w-3xl">
          ஒரு தேதி-நேரத்தின் வானம் ஜன்ம ஜாதகத்துடன்: உள்வட்டத்தில் ஜன்ம கிரகங்கள், வெளிவட்டத்தில் கோசாரம். ஆண்டு, மாதம், நாள், மணி, லக்னம், நவாம்சம் என்ற அலகுகளில்
          முன்-பின் நகர்த்தலாம்; "நிகழ்நேரம்" தானாக இப்போதைக்கு வரும்; "அனிமேட்" தேர்ந்த அலகை ஒவ்வொரு அடியாகத் தானாக நகர்த்தும்.
        </p>
      </header>

      <PartyChooser party={party} setParty={setParty} loading={busy} />
      <label className="flex items-center gap-2 text-xs mb-2"><input type="checkbox" checked={usePartner} onChange={(e) => setUsePartner(e.target.checked)} /> துணையின் ஜாதகத்தையும் (093) அதே நேரத்தில் காட்டு</label>
      {usePartner && (
        <>
          <div className="bg-saffron/35 rounded-t-2xl px-4 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="font-semibold text-ink">துணை (Partner)</span>
            {!partner && recent.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPartner({ kind: 'form', input: inputFromSaved(c.birthData), label: c.name })}
                className="rounded-full bg-surface/70 px-2 py-0.5 text-ink hover:bg-surface"
              >{c.name}</button>
            ))}
            {party && partner && (
              <button type="button" onClick={() => { const first = party; setParty(partner); setPartner(first); }} className="ml-auto rounded-full bg-surface/70 px-2 py-0.5 text-ink hover:bg-surface">⇄ இருவரையும் மாற்று</button>
            )}
          </div>
          <PartyChooser party={partner} setParty={setPartner} loading={busy} />
        </>
      )}

      <section className="bg-surface border border-line rounded-2xl p-4 mb-4 text-sm">
        <div className="flex flex-wrap gap-4 items-end mb-3">
          <label className="text-xs text-ink-soft">தேதி<br /><input type="date" className={field} value={dateStr} onChange={(e) => setDateTime(e.target.value, timeStr)} /></label>
          <label className="text-xs text-ink-soft">நேரம்<br /><input type="time" step={1} className={field} value={timeStr} onChange={(e) => setDateTime(dateStr, e.target.value)} /></label>
          <label className="text-xs text-ink-soft">இடம்<br /><input className={`${field} w-28`} value={place.name} onChange={(e) => setPlace({ ...place, name: e.target.value })} /></label>
          <label className="text-xs text-ink-soft">அட்சம்<br /><input className={`${field} w-24`} value={place.latitude} onChange={(e) => setPlace({ ...place, latitude: e.target.value })} /></label>
          <label className="text-xs text-ink-soft">தீர்க்கம்<br /><input className={`${field} w-24`} value={place.longitude} onChange={(e) => setPlace({ ...place, longitude: e.target.value })} /></label>
          <label className="text-xs text-ink-soft">மண்டலம் (நிமிடம்)<br /><input className={`${field} w-20`} value={place.offset} onChange={(e) => setPlace({ ...place, offset: e.target.value })} /></label>
          <button type="button" className="px-2 py-1.5 rounded border border-line text-xs" onClick={() => { const now = Date.now(); setAtMs(now); refresh(now); }}>இப்போது</button>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 items-center mb-3">
          {UNITS.map(([u, ta]) => (
            <span key={u} className="flex items-center gap-1 text-xs">
              <button type="button" aria-label={`${ta} −`} disabled={!party} className="w-7 h-7 rounded border border-line disabled:opacity-40" onClick={() => go(u, -1)}>−</button>
              <span className="w-20 text-center text-ink">{ta}</span>
              <button type="button" aria-label={`${ta} +`} disabled={!party} className="w-7 h-7 rounded border border-line disabled:opacity-40" onClick={() => go(u, 1)}>+</button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 items-center text-xs">
          {([['STOP', 'நிறுத்து (கையால்)'], ['REALTIME', 'நிகழ்நேரம்'], ['ANIMATE', 'அனிமேட்']] as const).map(([m, l]) => (
            <label key={m} className="flex items-center gap-1"><input type="radio" name="mode" checked={mode === m} disabled={!party} onChange={() => setMode(m)} /> {l}</label>
          ))}
          <label className="flex items-center gap-1">அனிமேட் அலகு
            <select className={field} value={animUnit} onChange={(e) => setAnimUnit(e.target.value)}>{UNITS.map(([u, ta]) => <option key={u} value={u}>{ta}</option>)}</select>
          </label>
          <label className="flex items-center gap-1">வேகம்
            <select className={field} value={speed} onChange={(e) => setSpeed(parseInt(e.target.value, 10))}><option value={500}>வேகம்</option><option value={900}>நடுத்தரம்</option><option value={1800}>மெதுவாக</option></select>
          </label>
          {busy && <span className="text-ink-soft">கணக்கிடுகிறது…</span>}
        </div>
        {error && <p className="text-rose text-sm mt-2">⚠️ {error}</p>}
        {!party && <p className="text-[11px] text-ink-soft mt-2">முதலில் யாருடைய ஜாதகம் என்பதைத் தேர்வு செய்யுங்கள்.</p>}
      </section>

      {data && (
        <div className={data.parties.length > 1 ? 'grid gap-4 xl:grid-cols-2 items-start' : ''}>
          {data.parties.map((d: any, i: number) => (
            <PartyPanel key={i} data={d} title={i === 0 ? 'ஜாதகர்' : 'துணை'} compact={data.parties.length > 1} partner={i === 1} />
          ))}
        </div>
      )}
    </main>
  );
}
