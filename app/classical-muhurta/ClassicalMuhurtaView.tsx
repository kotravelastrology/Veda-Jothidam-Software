'use client';

import { useEffect, useState } from 'react';
import { computePanchaPakshi, computeYatra, computeEclipses } from './actions';

const NAKSHATRAS = [
  'அசுவினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்',
  'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'ஹஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்',
  'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];
const RASIS = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const DIRS: Array<{ k: 'east' | 'south' | 'west' | 'north'; ta: string }> = [
  { k: 'east', ta: 'கிழக்கு' }, { k: 'south', ta: 'தெற்கு' }, { k: 'west', ta: 'மேற்கு' }, { k: 'north', ta: 'வடக்கு' },
];
const CH = 13.0827;
const CL = 80.2707;

const Q_STYLE: Record<string, string> = {
  auspicious: 'text-emerald-700', neutral: 'text-amber-700', inauspicious: 'text-rose-700',
  pass: 'text-emerald-700', fail: 'text-rose-700', avoid: 'text-rose-700', middling: 'text-amber-700',
};

export default function ClassicalMuhurtaView() {
  const [tab, setTab] = useState<'panchapakshi' | 'yatra' | 'eclipse'>('panchapakshi');
  const today = new Date().toISOString().slice(0, 10);

  // Pañca-pakṣi
  const [ppDate, setPpDate] = useState(today);
  const [birthNak, setBirthNak] = useState(0);
  const [birthPaksha, setBirthPaksha] = useState<'shukla' | 'krishna'>('shukla');
  const [pp, setPp] = useState<any>(null);

  // Yātrā
  const [yDate, setYDate] = useState(today);
  const [yTime, setYTime] = useState('09:30');
  const [yDir, setYDir] = useState<'east' | 'south' | 'west' | 'north'>('east');
  const [janmaRasi, setJanmaRasi] = useState<number | ''>('');
  const [yatra, setYatra] = useState<any>(null);

  // Eclipse
  const [ecl, setEcl] = useState<any>(null);

  useEffect(() => {
    const [y, m, d] = ppDate.split('-').map(Number);
    computePanchaPakshi({
      year: y, month: m, day: d, latitude: CH, longitude: CL, utcOffsetMinutes: 330,
      birthNakshatra: birthNak, birthPaksha,
    }).then(setPp);
  }, [ppDate, birthNak, birthPaksha]);

  useEffect(() => {
    const [y, m, d] = yDate.split('-').map(Number);
    const [hh, mm] = yTime.split(':').map(Number);
    computeYatra({
      year: y, month: m, day: d, hour: hh, minute: mm, direction: yDir,
      latitude: CH, longitude: CL, utcOffsetMinutes: 330,
      janmaRasi: janmaRasi === '' ? undefined : Number(janmaRasi),
    }).then(setYatra);
  }, [yDate, yTime, yDir, janmaRasi]);

  useEffect(() => { if (tab === 'eclipse' && !ecl) computeEclipses(Date.now(), 10).then(setEcl); }, [tab, ecl]);

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-1">Classical muhurta</p>
        <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">பாரம்பரிய முகூர்த்தம்</h1>
        <p className="text-sm text-ink-soft mt-1">பஞ்சபட்சி · யாத்ரா முகூர்த்தம் · கிரகணம் (சென்னை)</p>
      </header>

      <div className="flex gap-1 mb-4 text-xs">
        {([['panchapakshi', 'பஞ்சபட்சி'], ['yatra', 'யாத்ரா முகூர்த்தம்'], ['eclipse', 'கிரகணம்']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-3 py-1.5 rounded ${tab === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>

      {tab === 'panchapakshi' && (
        <section>
          <div className="flex flex-wrap gap-2 mb-3 text-sm">
            <input type="date" value={ppDate} onChange={(e) => setPpDate(e.target.value)}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink" />
            <select value={birthNak} onChange={(e) => setBirthNak(Number(e.target.value))}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink">
              {NAKSHATRAS.map((n, i) => <option key={i} value={i}>ஜன்ம நட்சத்திரம்: {n}</option>)}
            </select>
            <select value={birthPaksha} onChange={(e) => setBirthPaksha(e.target.value as any)}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink">
              <option value="shukla">சுக்ல பக்ஷம்</option>
              <option value="krishna">கிருஷ்ண பக்ஷம்</option>
            </select>
          </div>
          {pp && (
            <>
              <p className="text-sm mb-2">
                உங்கள் பறவை: <b className="text-ink">{pp.birthBird.ta} ({pp.birthBird.en})</b> ·
                இன்றைய பக்ஷம் {pp.dayPaksha === 'shukla' ? 'சுக்ல' : 'கிருஷ்ண'} · சூ.உதயம் {pp.sunrise} · சூ.அஸ்தமனம் {pp.sunset}
              </p>
              <table className="w-full text-sm">
                <thead><tr className="text-ink-soft border-b border-line">
                  <th className="text-left py-1">ஜாமம்</th><th className="text-left py-1">நேரம்</th>
                  <th className="text-left py-1">செயல்</th><th className="text-left py-1">ஆளும் பறவை</th>
                </tr></thead>
                <tbody>
                  {pp.timeline.map((t: any, i: number) => (
                    <tr key={i} className="border-b border-line/40">
                      <td className="py-1">{t.period === 'day' ? 'பகல்' : 'இரவு'} {t.jama}</td>
                      <td className="py-1 text-ink-soft">{t.from}–{t.to}</td>
                      <td className={`py-1 font-medium ${Q_STYLE[t.quality]}`}>{t.activityTa} ({t.activityEn}) · {t.durationMin}′</td>
                      <td className="py-1 text-ink-soft">{t.rulingBirdTa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-ink-soft mt-2">{pp.source}</p>
            </>
          )}
        </section>
      )}

      {tab === 'yatra' && (
        <section>
          <div className="flex flex-wrap gap-2 mb-3 text-sm">
            <input type="date" value={yDate} onChange={(e) => setYDate(e.target.value)}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink" />
            <input type="time" value={yTime} onChange={(e) => setYTime(e.target.value)}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink" />
            <select value={yDir} onChange={(e) => setYDir(e.target.value as any)}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink">
              {DIRS.map((d) => <option key={d.k} value={d.k}>{d.ta}</option>)}
            </select>
            <select value={janmaRasi} onChange={(e) => setJanmaRasi(e.target.value === '' ? '' : Number(e.target.value))}
              className="px-2 py-1.5 rounded border border-line bg-surface text-ink">
              <option value="">ஜன்ம ராசி (விருப்பம்)</option>
              {RASIS.map((r, i) => <option key={i} value={i}>{r}</option>)}
            </select>
          </div>
          {yatra && (
            <>
              <p className="text-sm mb-2">
                {yatra.directionTa} திசைப் பயணம் — <b className={Q_STYLE[yatra.overall]}>
                  {yatra.overall === 'auspicious' ? 'உத்தமம்' : yatra.overall === 'middling' ? 'மத்திமம்' : 'தவிர்க்கவும்'}
                </b>
              </p>
              <table className="w-full text-sm">
                <tbody>
                  {yatra.factors.map((f: any) => (
                    <tr key={f.key} className="border-b border-line/40">
                      <td className="py-1 w-32">{f.label}</td>
                      <td className={`py-1 w-16 font-medium ${Q_STYLE[f.status]}`}>
                        {f.status === 'pass' ? '✓' : f.status === 'fail' ? '✕' : '○'} {f.status}
                      </td>
                      <td className="py-1 text-ink-soft">{f.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-ink-soft mt-2">{yatra.source}</p>
            </>
          )}
        </section>
      )}

      {tab === 'eclipse' && (
        <section>
          {!ecl && <p className="text-sm text-ink-soft">கணக்கிடுகிறது…</p>}
          {ecl && (
            <>
              <table className="w-full text-sm">
                <thead><tr className="text-ink-soft border-b border-line">
                  <th className="text-left py-1">உச்ச நேரம் (UTC)</th><th className="text-left py-1">வகை</th>
                  <th className="text-left py-1">ராசி / நட்சத்திரம்</th>
                </tr></thead>
                <tbody>
                  {ecl.events.map((e: any, i: number) => (
                    <tr key={i} className="border-b border-line/40">
                      <td className="py-1">{e.peakUtc.replace(' UTC', '')}</td>
                      <td className="py-1">{e.categoryTa} — {e.kindTa}</td>
                      <td className="py-1 text-ink-soft">{e.rasi} · {e.nakshatra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-ink-soft mt-2">{ecl.note} {ecl.source}</p>
            </>
          )}
        </section>
      )}

      <p className="text-[11px] text-ink-soft mt-6">முந்தைய AstrologicLab src/timing/* -லிருந்து port செய்யப்பட்டது.</p>
    </main>
  );
}
