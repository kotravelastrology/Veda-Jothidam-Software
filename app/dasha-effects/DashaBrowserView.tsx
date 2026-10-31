'use client';

import { useEffect, useMemo, useState } from 'react';
import { PartyChooser } from '@/src/ui/PartyChooser';
import { useSettings, toEngineOptions, toDashaOptions } from '@/src/ui/SettingsPanel';
import { useChartParty, writeStash } from '@/src/ui/chartParty';
import { DashaEffectCard } from '@/app/components/DashaEffectCard';
import { citeTa } from '@/src/sources/citeTa';
import { ABBR } from '@/src/worksheet/dashaList';
import { chainAt, columns, localText, MAX_LEVELS } from '@/src/dasha/dashaDrill';
import { WorksheetChart, type ChartEntry, type HouseBadge } from '../worksheet/WorksheetChart';
import { DIGNITY_TA, PLANET_COLOR, TONE_CLASS } from '../worksheet/worksheetStyle';
import { computeDashaBrowser, computeDashaMoment } from './actions';

/**
 * PL9's Dasha Effects Browser (user guide ch.8, "Dasha browser"): pick a dasha period, level by level, and see the sky when
 * it begins beside the birth chart, with what the classics say of the lords of that period. Columns of the nine periods, one
 * per level (PL9 offers five); a click on a period selects it and opens the nine inside it. The chart has the birth chart in
 * black and the planets at the period's start in red. The effects are BPHS chapters 47 and 48 for each lord of the period.
 */

const LEVEL_TA = ['தசை', 'புக்தி', 'அந்தரம்', 'சூக்ஷ்மம்', 'பிராணம்'];

interface Period { lord: string; startJd: number; endJd: number; selected?: boolean; current?: boolean }

const dmy = (text: string) => { const [y, m, d] = text.slice(0, 10).split('-'); return `${d}-${m}-${y}`; };

export default function DashaBrowserView() {
  const { settings } = useSettings();
  const { party, setParty, isNew } = useChartParty();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState(3);
  const [path, setPath] = useState<string[]>([]);
  const [nowJd, setNowJd] = useState<number | null>(null);
  const [moment, setMoment] = useState<any[] | null>(null);

  useEffect(() => { setNowJd(Date.now() / 86400000 + 2440587.5); }, []);

  // One calculation for the person; the browser divides the periods itself
  useEffect(() => {
    if (!party) { setData(null); setPath([]); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    const base = party.kind === 'profile'
      ? { profile: { profileId: party.profileId, revision: party.revision } }
      : { form: party.input, engine: toEngineOptions(settings) };
    computeDashaBrowser({ ...base, dashaOptions: toDashaOptions(settings) })
      .then((r) => { if (!cancelled) { setData(r); setPath([]); } })
      .catch((e) => { if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [party, settings.ayanamsha, settings.houseSystem, settings.nodeType, settings.dashaYearDays, settings.dashaBalance]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (data) writeStash(data.birth); }, [data]);

  // The first view is the period running now, as deep as the levels asked for
  const mahadashas: Period[] = data?.mahadashas ?? [];
  useEffect(() => {
    if (!data || nowJd == null || path.length > 0) return;
    setPath(chainAt(mahadashas, nowJd, levels).map((p) => p.lord));
  }, [data, nowJd]); // eslint-disable-line react-hooks/exhaustive-deps

  const cols = useMemo(() => (data && nowJd != null ? columns(mahadashas, path, levels, nowJd) : []), [data, path, levels, nowJd]); // eslint-disable-line react-hooks/exhaustive-deps
  /** The periods along the selected path, mahadasha first. */
  const chain: Period[] = useMemo(() => {
    const result: Period[] = [];
    cols.forEach((c, i) => { const sel = c.periods.find((p: Period) => p.selected && path[i] === p.lord); if (sel && i === result.length) result.push(sel); });
    return result;
  }, [cols, path]);
  const deepest = chain[chain.length - 1];

  // The sky when the selected period begins
  useEffect(() => {
    if (!data || !deepest) { setMoment(null); return; }
    let cancelled = false;
    computeDashaMoment({ engine: data.engine, jd: deepest.startJd, natalLagnaSign: data.lagnaRasiIndex })
      .then((m) => { if (!cancelled) setMoment(m); })
      .catch(() => { if (!cancelled) setMoment(null); });
    return () => { cancelled = true; };
  }, [data, deepest?.lord, deepest?.startJd]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (level: number, lord: string) => setPath((prev) => [...prev.slice(0, level), lord]);
  const toNow = () => { if (nowJd != null && data) setPath(chainAt(mahadashas, nowJd, levels).map((p) => p.lord)); };
  const changeLevels = (n: number) => {
    setLevels(n);
    if (nowJd != null && data && path.length === 0) setPath(chainAt(mahadashas, nowJd, n).map((p) => p.lord));
  };

  const natalOf = (planet: string) => data?.natal.find((f: any) => f.id === planet);
  const momentOf = (planet: string) => moment?.find((f: any) => f.id === planet);
  const offset = data?.utcOffsetMinutes ?? 0;

  const chartView = useMemo(() => {
    if (!data) return null;
    const entries: ChartEntry[][] = Array.from({ length: 12 }, () => []);
    for (const f of data.natal) entries[f.rasiIndex].push({ abbr: f.abbr });
    entries[data.lagnaRasiIndex].unshift({ abbr: 'As' });
    for (const f of moment ?? []) entries[f.rasiIndex].push({ abbr: f.abbr, transit: true });
    const badges: HouseBadge[] = Array.from({ length: 12 }, (_, rasi) => ({ house: ((rasi - data.lagnaRasiIndex + 12) % 12) + 1 }));
    return { entries, badges };
  }, [data, moment]);

  // -------------------------------------------------------------------- no chart yet
  if (!party) {
    return (
      <main className="min-h-screen p-6 max-w-3xl mx-auto">
        <header className="text-center mb-6 pt-4">
          <p className="text-4xl mb-2" aria-hidden>🔭</p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">தசா பலன் உலாவி</h1>
          <p className="text-sm text-ink-soft mt-2 max-w-xl mx-auto">
            தசை, புக்தி, அந்தரம்… ஒவ்வொரு நிலையாகத் தேர்ந்தெடுத்தால் அந்தக் காலம் தொடங்கும் நாளின் கோசாரம் ஜாதகத்துடன் ஒரே கட்டத்தில் தெரியும்; அந்தக் காலத்தின் அதிபதிகளைப் பற்றி BPHS என்ன சொல்கிறது என்பதும்.
          </p>
        </header>
        <PartyChooser party={party} setParty={setParty} loading={loading} startManual={isNew} />
        {error && <p className="text-rose text-sm bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}
      </main>
    );
  }

  const md = chain[0]; const ad = chain[1];
  const pair = md && ad && data ? (() => {
    const a = natalOf(md.lord); const b = natalOf(ad.lord);
    if (!a || !b) return null;
    const sign = ((b.rasiIndex - a.rasiIndex + 12) % 12) + 1;
    const count = ((b.star27 - a.star27 + 27) % 27) + 1;
    const tara = data.taras[(count - 1) % 9];
    return { sign, count, tara };
  })() : null;

  const effectOf = (planet: string) => data?.effects.planets.find((p: any) => p.planet === planet);

  return (
    <main className="min-h-screen p-3 sm:p-5 max-w-[88rem] mx-auto">
      <header className="mb-3 rounded-2xl border border-line bg-surface p-3 sm:p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Dasha Effects Browser</p>
            <h1 className="font-[family-name:var(--font-tamil-serif)] text-xl font-bold text-ink">தசா பலன் உலாவி — {data?.native.name ?? party.label}</h1>
            <p className="text-xs text-ink-soft tabular-nums">{data ? `${data.native.date} · ${data.native.time} · ${data.native.placeName ?? '—'} · தசை ஆண்டு ${data.dashaYearDays} நாள்` : 'கணக்கிடப்படுகிறது…'}</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-ink-soft" role="group" aria-label="நிலைகளின் எண்ணிக்கை">
              <span>நிலைகள்</span>
              {Array.from({ length: MAX_LEVELS }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => changeLevels(n)}
                  aria-pressed={levels === n}
                  className={`size-7 rounded-full border text-xs ${levels === n ? 'bg-saffron text-ink border-saffron font-semibold' : 'border-line bg-surface text-ink hover:border-saffron'}`}
                >{n}</button>
              ))}
            </div>
            <button type="button" onClick={toNow} className="px-3 py-1 rounded-full border border-line bg-surface text-xs text-ink hover:border-saffron hover:bg-saffron/10">⏱ நடப்புக் காலம்</button>
            <button type="button" onClick={() => setParty(null)} className="px-3 py-1 rounded-full border border-line bg-surface text-xs text-ink hover:border-saffron hover:bg-saffron/10">↻ மாற்று</button>
          </div>
        </div>
        {chain.length > 0 && (
          <p className="mt-2 text-sm text-ink" aria-live="polite">
            {chain.map((p, i) => (
              <span key={i}>
                {i > 0 && <span className="text-ink-soft"> › </span>}
                <span className="font-semibold" style={{ color: PLANET_COLOR[ABBR[p.lord]] }}>{data.planetTa[p.lord]}</span>
                <span className="text-[10px] text-ink-soft"> ({LEVEL_TA[i]})</span>
              </span>
            ))}
            {deepest && <span className="text-xs text-ink-soft tabular-nums"> · {dmy(localText(deepest.startJd, offset))} → {dmy(localText(deepest.endJd, offset))}</span>}
          </p>
        )}
      </header>

      {error && <p className="text-rose text-sm mb-3 bg-rose-soft rounded-xl p-3">⚠️ {error}</p>}
      {loading && !data && <p className="text-sm text-ink-soft p-4">கணக்கிடப்படுகிறது…</p>}

      {data && (
        <div className="grid gap-3 xl:grid-cols-12">
          {/* the periods, a column per level */}
          <section className="xl:col-span-5 bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <header className="px-3 py-2 border-b border-line bg-gradient-to-r from-saffron/20 via-saffron/5 to-transparent">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-sm font-semibold text-ink">காலங்கள் — ஒவ்வொரு நிலையிலும் ஒன்றைத் தேர்ந்தெடு</h2>
            </header>
            <div className="p-3 flex gap-2 overflow-x-auto">
              {cols.map((c, i) => (
                <div key={c.level} className="min-w-[8.5rem] flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft mb-1">{c.level}. {LEVEL_TA[i]}</p>
                  <ul className="space-y-1">
                    {c.periods.map((p: Period) => (
                      <li key={`${p.lord}-${p.startJd}`}>
                        <button
                          type="button"
                          onClick={() => choose(i, p.lord)}
                          aria-pressed={Boolean(p.selected)}
                          className={`w-full text-left rounded-lg border px-2 py-1 leading-tight transition ${p.selected ? 'border-saffron bg-saffron/25 shadow-sm' : 'border-line bg-surface hover:border-saffron/60 hover:bg-saffron/10'}`}
                        >
                          <span className="flex items-center justify-between gap-1">
                            <span className="text-sm font-semibold" style={{ color: PLANET_COLOR[ABBR[p.lord]] }}>{data.planetTa[p.lord]}</span>
                            {p.current && <span className="text-[9px] rounded-full bg-rose/15 text-rose px-1.5">நடப்பு</span>}
                          </span>
                          <span className="block text-[10px] text-ink-soft tabular-nums">{dmy(localText(p.startJd, offset))}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* the sky when the period begins, beside the birth chart */}
          <section className="xl:col-span-3 bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <header className="px-3 py-2 border-b border-line bg-gradient-to-r from-saffron/20 via-saffron/5 to-transparent">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-sm font-semibold text-ink">தொடக்கத்தில் கோசாரம்</h2>
            </header>
            <div className="p-3">
              {chartView && (
                <WorksheetChart
                  lagnaRasiIndex={data.lagnaRasiIndex}
                  entriesByRasi={chartView.entries}
                  badges={chartView.badges}
                  dense
                  center={
                    <div className="leading-snug">
                      <p className="text-[11px] font-semibold text-ink">{deepest ? `${chain.map((p) => ABBR[p.lord]).join('-')}` : '—'}</p>
                      {deepest && <p className="text-[10px] text-ink-soft tabular-nums">{dmy(localText(deepest.startJd, offset))}</p>}
                      <p className="text-[10px] text-ink-soft mt-1"><span className="text-ink">கருப்பு</span> ஜாதகம் · <span className="text-rose italic">சிவப்பு</span> கோசாரம்</p>
                    </div>
                  }
                />
              )}
              {moment && (
                <table className="w-full text-[11px] mt-3">
                  <thead><tr className="text-ink-soft border-b border-line text-left"><th className="py-1 pr-1 font-medium"></th><th className="py-1 pr-1 font-medium">ராசி</th><th className="py-1 pr-1 font-medium">பாவம்</th><th className="py-1 font-medium">நிலை</th></tr></thead>
                  <tbody>
                    {moment.map((m: any) => {
                      const d = m.dignity ? DIGNITY_TA[m.dignity] : null;
                      const isLord = chain.some((p) => p.lord === m.id);
                      return (
                        <tr key={m.id} className={`border-b border-line/40 ${isLord ? 'bg-saffron/15 font-semibold' : ''}`}>
                          <td className="py-0.5 pr-1" style={{ color: PLANET_COLOR[m.abbr] }}>{m.abbr}</td>
                          <td className="py-0.5 pr-1">{m.signTa}</td>
                          <td className="py-0.5 pr-1 tabular-nums">{m.house}</td>
                          <td className={`py-0.5 ${d ? TONE_CLASS[d.tone] : 'text-ink-soft'}`}>{d?.label ?? '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <p className="text-[10px] text-ink-soft mt-2">பாவம் = பிறப்பு லக்னத்திலிருந்து. நிலை = அந்த ராசியில் உச்சம், ஆட்சி, நீசம் மட்டும். தேர்ந்த காலத்தின் அதிபதிகள் மஞ்சள் வரியில்.</p>
            </div>
          </section>

          {/* what the classics say of the lords of the period */}
          <section className="xl:col-span-4 bg-surface border border-line rounded-2xl overflow-hidden shadow-sm">
            <header className="px-3 py-2 border-b border-line bg-gradient-to-r from-saffron/20 via-saffron/5 to-transparent">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-sm font-semibold text-ink">பலன் — நூல்கள் சொல்வது</h2>
            </header>
            <div className="p-3 max-h-[70vh] overflow-y-auto">
              {pair && (
                <div className="rounded-xl border border-line bg-surface-2/50 p-3 mb-3 text-xs">
                  <p className="font-semibold text-ink mb-1">{data.planetTa[md.lord]} → {data.planetTa[ad.lord]}</p>
                  <p className="text-ink">
                    ராசி தூரம்: <strong className="tabular-nums">{pair.sign}</strong>
                    {[6, 8, 12].includes(pair.sign) && <span className="text-rose"> — Parashara&apos;s Light பயனர் கையேடு 6, 8, 12-ஐ சாதகமற்றது என்கிறது</span>}
                  </p>
                  <p className="text-ink">
                    நட்சத்திர தூரம்: <strong className="tabular-nums">{pair.count}</strong> → {pair.tara.n}-ஆம் தாரை ({pair.tara.pulippaniTa}, புலிப்பாணி: {pair.tara.pulippaniResultTa})
                  </p>
                  <p className="text-[10px] text-ink-soft mt-1">{citeTa({ ...data.taraSource })} · எண்ணிக்கை மகா தசை நாதனின் நட்சத்திரத்திலிருந்து புக்தி நாதனின் நட்சத்திரம் வரை, இரண்டும் சேர்த்து.</p>
                </div>
              )}
              {chain.slice(0, 2).map((p, i) => {
                const n = natalOf(p.lord); const m = momentOf(p.lord); const effect = effectOf(p.lord);
                const d = n?.dignity ? DIGNITY_TA[n.dignity] : null;
                return (
                  <div key={`${p.lord}-${i}`}>
                    <p className="text-xs text-ink mb-1">
                      <strong>{data.planetTa[p.lord]}</strong> ({LEVEL_TA[i]}) — பிறப்பு ஜாதகத்தில் {n?.house}-ஆம் வீடு ({n?.signTa}){d && <span className={TONE_CLASS[d.tone]}>, {d.label}</span>}
                      {n?.lordOf.length > 0 && <>; ஆளும் வீடுகள்: {n.lordOf.join(', ')}</>}
                      {m && <span className="text-ink-soft"> · காலத் தொடக்கத்தில் {m.house}-ஆம் வீடு ({m.signTa})</span>}
                    </p>
                    {effect && <DashaEffectCard p={effect} effects={data.effects} title={`${effect.planetTa} தசை — BPHS அத்.47, 48`} />}
                  </div>
                );
              })}
              {chain.length === 0 && <p className="text-sm text-ink-soft">ஒரு தசையைத் தேர்ந்தெடுங்கள்.</p>}
              <p className="text-[10px] text-ink-soft">
                {citeTa(data.effects.source)} · BPHS பலன்களைக் கிரகத்தின் தசைக்கும் அது ஆளும் வீடுகளுக்கும் தருகிறது; இங்கே தேர்ந்த காலத்தின் தசை, புக்தி அதிபதிகளுக்குத் தனித்தனியாகக் காட்டப்படுகிறது. புக்திக்கென்றே தனிப் பாடல்கள் இன்னும் சேர்க்கப்படவில்லை; ஆழமான நிலைகளுக்கு அதிபதியின் இடம் மட்டும் மேலே உள்ளது.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
