'use client';

import { useCallback, useEffect, useState } from 'react';
import { VedicChartBox } from '@/src/charts/kattam/VedicChartBox';
import type { ChartGraha } from '@/src/charts/kattam/rasiNames';
import { useActiveBirthInput } from '@/src/workspace/useActiveBirthInput';
import { computeEvidenceSnapshot, citeEvidenceInConsultation } from './actions';

type Panel = 'natal' | 'varga' | 'bala';

const fmtDeg = (d: number) => {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round((((d - deg) * 60) - min) * 60);
  return `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`;
};

export default function EvidenceView() {
  const { profile, input } = useActiveBirthInput();
  const [snapshot, setSnapshot] = useState<any>(null);
  const [panel, setPanel] = useState<Panel>('natal');
  const [varga, setVarga] = useState('D9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cited, setCited] = useState<string[]>([]);
  const [citeSummary, setCiteSummary] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const compute = useCallback(async (birthInput: any) => {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await computeEvidenceSnapshot(birthInput));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (input) compute(input); }, [input, compute]);

  const cite = async () => {
    if (!profile || !snapshot || cited.length === 0 || !citeSummary.trim()) {
      setStatus('ஒரு விதியையும் சுருக்கத்தையும் தேர்ந்தெடுக்கவும்');
      return;
    }
    try {
      const r = await citeEvidenceInConsultation({
        profileId: profile.profileId,
        revision: profile.revision,
        snapshot,
        ruleIds: cited,
        summary: citeSummary,
      });
      setStatus(`ஆலோசனை பதிவானது · snapshot ${snapshot.snapshotId.slice(0, 8)} · v${r.revision}`);
      setCited([]);
      setCiteSummary('');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  if (!profile) {
    return (
      <main className="min-h-screen p-6 max-w-5xl mx-auto">
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink mb-2">
          ஆதாரப் பலகைகள்
        </h1>
        <p className="text-sm text-ink-soft">
          ஒரு ஜாதகத்தைத் திறக்கவும் — <kbd className="font-mono text-xs">Ctrl+K</kbd>
        </p>
      </main>
    );
  }

  const v = snapshot?.values;
  const grahas: ChartGraha[] = v
    ? v.natal.map((g: any) => ({
      id: g.id,
      rasiIndex: panel === 'varga' ? v.vargas[g.id][varga].signIndex : g.rasiIndex,
      degreeInSign: panel === 'varga' ? undefined : g.degreeInSign,
    }))
    : [];
  const lagnaRasiIndex = v
    ? (panel === 'varga' ? v.lagnaVargas[varga].signIndex : v.lagna.rasiIndex)
    : 0;

  return (
    <main className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Evidence</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">
          ஆதாரப் பலகைகள்
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          {profile.name} (v{profile.revision}) — மூன்று பலகைகளும் <strong>ஒரே</strong> snapshot-இலிருந்து
          படிக்கின்றன, எனவே கட்டம், அட்டவணை, அறிக்கை மூன்றிலும் ஒரே எண்.
        </p>
      </header>

      {snapshot && (
        <p className="font-mono text-[11px] text-ink-soft mb-4 break-all">
          snapshot {snapshot.snapshotId.slice(0, 16)}… · {snapshot.settings.ayanamsha} ·
          {' '}{snapshot.settings.houseSystem} · engine {snapshot.engineVersion}
        </p>
      )}

      {error && <div className="bg-rose/10 border border-rose rounded-lg p-4 mb-4 text-sm text-rose">{error}</div>}
      {loading && <p className="text-sm text-ink-soft">கணக்கிடுகிறது…</p>}

      {v && (
        <>
          <div className="flex gap-2 mb-4 border-b border-line">
            {([['natal', 'ஜனன நிலை'], ['varga', 'வர்கம்'], ['bala', 'பலம்']] as Array<[Panel, string]>)
              .map(([id, label]) => (
                <button key={id} onClick={() => setPanel(id)}
                  className={`px-4 py-2 border-b-2 text-sm transition ${
                    panel === id ? 'border-saffron text-saffron' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}>{label}</button>
              ))}
            {panel === 'varga' && (
              <select value={varga} onChange={(e) => setVarga(e.target.value)}
                className="ml-auto my-1 px-2 py-1 bg-ink-soft/10 border border-line rounded text-sm">
                {v.vargaKeys.map((k: string) => <option key={k} value={k}>{k}</option>)}
              </select>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chart rendering */}
            {panel !== 'bala' && (
              <div className="bg-surface border border-line rounded-2xl p-6 flex justify-center">
                <VedicChartBox
                  lagnaRasiIndex={lagnaRasiIndex}
                  grahas={grahas}
                  title={panel === 'varga' ? varga : 'D1'}
                />
              </div>
            )}

            {/* Table rendering of the same numbers */}
            <div className="bg-surface border border-line rounded-2xl p-6 overflow-x-auto">
              {panel === 'natal' && (
                <table className="w-full text-sm">
                  <thead><tr className="text-xs uppercase text-ink-soft border-b border-line">
                    <th className="text-left py-2 pr-3">கிரகம்</th><th className="text-left pr-3">ராசி</th>
                    <th className="text-right pr-3">பாகை</th><th className="text-right">பாவம்</th>
                  </tr></thead>
                  <tbody>
                    {v.natal.map((g: any) => (
                      <tr key={g.id} className="border-b border-line/30">
                        <td className="py-1.5 pr-3 font-medium text-ink">{g.id}</td>
                        <td className="pr-3 text-ink-soft">{g.rasi}</td>
                        <td className="pr-3 text-right tabular-nums text-ink-soft">{fmtDeg(g.degreeInSign)}</td>
                        <td className="text-right tabular-nums text-ink-soft">{g.house}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {panel === 'varga' && (
                <table className="w-full text-sm">
                  <thead><tr className="text-xs uppercase text-ink-soft border-b border-line">
                    <th className="text-left py-2 pr-3">கிரகம்</th><th className="text-left">{varga} ராசி</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-b border-line/30">
                      <td className="py-1.5 pr-3 font-medium text-ink">Lagna</td>
                      <td className="text-ink-soft">{v.lagnaVargas[varga].sign}</td>
                    </tr>
                    {v.natal.map((g: any) => (
                      <tr key={g.id} className="border-b border-line/30">
                        <td className="py-1.5 pr-3 font-medium text-ink">{g.id}</td>
                        <td className="text-ink-soft">{v.vargas[g.id][varga].sign}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {panel === 'bala' && (
                <>
                  <h3 className="text-sm font-semibold text-ink mb-3">Sarvashtakavarga</h3>
                  <table className="w-full text-sm mb-6">
                    <thead><tr className="text-xs uppercase text-ink-soft border-b border-line">
                      <th className="text-left py-2">ராசி</th><th className="text-right">பிந்து</th>
                    </tr></thead>
                    <tbody>
                      {v.ashtakavarga.sarva.map((n: number, i: number) => (
                        <tr key={i} className="border-b border-line/30">
                          <td className="py-1 text-ink-soft">{v.natal[0] && i}</td>
                          <td className="text-right tabular-nums text-ink">{n}</td>
                        </tr>
                      ))}
                      <tr><td className="py-1 font-semibold text-ink">மொத்தம்</td>
                        <td className="text-right font-semibold tabular-nums text-ink">{v.ashtakavarga.total}</td></tr>
                    </tbody>
                  </table>

                  <h3 className="text-sm font-semibold text-ink mb-3">Shadbala (Sthana / Dig)</h3>
                  <table className="w-full text-sm">
                    <thead><tr className="text-xs uppercase text-ink-soft border-b border-line">
                      <th className="text-left py-2 pr-3">கிரகம்</th>
                      <th className="text-right pr-3">Sthana</th><th className="text-right">Dig</th>
                    </tr></thead>
                    <tbody>
                      {Object.entries(v.shadbala).map(([id, b]: [string, any]) => (
                        <tr key={id} className="border-b border-line/30">
                          <td className="py-1.5 pr-3 font-medium text-ink">{id}</td>
                          <td className="pr-3 text-right tabular-nums text-ink-soft">{b.sthanaBala.toFixed(2)}</td>
                          <td className="text-right tabular-nums text-ink-soft">{b.digBala.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-ink-soft mt-3">
                    Shadbala மொத்தம் காட்டப்படவில்லை — BPHS-இன் Ayana Bala வசனமும் அட்டவணையும்
                    ஒத்துப்போகாததால் engine அதை <code>SOURCE_REQUIRED</code> ஆக வைத்திருக்கிறது.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Evidence: where each panel's numbers come from */}
          <section className="mt-6 bg-surface border border-line rounded-2xl p-6">
            <h2 className="font-semibold text-ink mb-4">ஆதாரம்</h2>
            <div className="space-y-2">
              {snapshot.evidence.map((e: any) => (
                <label key={e.ruleId} className="flex items-start gap-3 border-b border-line/30 pb-2">
                  <input type="checkbox" className="mt-1"
                    checked={cited.includes(e.ruleId)}
                    onChange={(ev) => setCited((prev) => ev.target.checked
                      ? [...prev, e.ruleId] : prev.filter((r) => r !== e.ruleId))} />
                  <span>
                    <span className="text-sm font-medium text-ink">{e.name}</span>
                    <span className="block font-mono text-[11px] text-ink-soft">
                      {e.status === 'SOURCE_REQUIRED' ? 'ஆதாரம் தேவை' : `${e.source.title} — ${e.source.pageLocus}`}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <input value={citeSummary} onChange={(e) => setCiteSummary(e.target.value)}
                placeholder="ஆலோசனைச் சுருக்கம்"
                className="flex-1 px-3 py-2 bg-ink-soft/10 border border-line rounded text-sm" />
              <button onClick={cite}
                className="px-4 py-2 bg-green text-white rounded font-medium text-sm">
                தேர்ந்தெடுத்த ஆதாரத்துடன் பதிவு செய்
              </button>
            </div>
            {status && <p className="text-xs text-ink-soft mt-2 break-all">{status}</p>}
          </section>
        </>
      )}
    </main>
  );
}
