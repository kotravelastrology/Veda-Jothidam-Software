'use client';

import { useState } from 'react';
import Link from 'next/link';
import { computeReport, type BirthFormInput } from './actions';

const VARGA_KEYS = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];
const CHART_POINTS = ['Lagna', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const RASI_SHORT: Record<string, string> = {
  Mesha: 'மேஷ', Vrishabha: 'ரிஷ', Mithuna: 'மிது', Karkataka: 'கடக',
  Simha: 'சிம்', Kanya: 'கன்னி', Tula: 'துலா', Vrischika: 'விரு',
  Dhanu: 'தனு', Makara: 'மகர', Kumbha: 'கும்ப', Meena: 'மீன',
};
const POINT_LABEL: Record<string, string> = {
  Lagna: 'லக்னம்', Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்',
  Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி',
  Rahu: 'ராகு', Ketu: 'கேது',
};

type ReportData = Awaited<ReturnType<typeof computeReport>>;

interface SectionDef {
  id: string;
  label: string;
}
const SECTIONS: SectionDef[] = [
  { id: 'profile', label: 'பிறப்பு விவரங்கள்' },
  { id: 'lagnaGraha', label: 'லக்னம் & கிரக நிலைகள்' },
  { id: 'dasha', label: 'விம்சோத்தரி தசா' },
  { id: 'varga', label: 'வர்க்க அட்டவணை (16)' },
  { id: 'ashtakavarga', label: 'அஷ்டகவர்க்கம்' },
  { id: 'transit', label: 'இன்றைய கோசரம் (Transit)' },
  { id: 'grahaBala', label: 'கிரக பலம் (சட்பலம்)' },
  { id: 'bhavaBala', label: 'பாவ பலம்' },
  { id: 'shodasaBala', label: 'சோடச பலம்' },
  { id: 'nabhasaYoga', label: 'நபஸ யோகங்கள்' },
  { id: 'karaka', label: 'காரகங்கள்' },
];

function SourceRequiredBadge({ reason }: { reason?: string }) {
  return (
    <span className="inline-block rounded border border-dashed border-ink-soft/40 px-2 py-0.5 text-xs text-ink-soft" title={reason}>
      ஆதாரம் தேவை
    </span>
  );
}

function ProfileSection({ report }: { report: ReportData }) {
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">பிறப்பு விவரங்கள்</h2>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-ink-soft">பெயர்</dt><dd>{report.profile.name}</dd>
        <dt className="text-ink-soft">பாலினம்</dt><dd>{report.profile.gender || '-'}</dd>
        <dt className="text-ink-soft">தேதி/நேரம்</dt>
        <dd>{report.input.year}-{String(report.input.month).padStart(2, '0')}-{String(report.input.day).padStart(2, '0')} {String(report.input.hour).padStart(2, '0')}:{String(report.input.minute).padStart(2, '0')}</dd>
        <dt className="text-ink-soft">இடம்</dt><dd>{report.input.placeName ?? `${report.input.latitude}, ${report.input.longitude}`}</dd>
        <dt className="text-ink-soft">Chart ID</dt><dd className="font-mono text-xs">{report.profile.chartId}</dd>
      </dl>
    </div>
  );
}

function LagnaGrahaSection({ report }: { report: ReportData }) {
  const rows = [
    ['Lagna', { ...report.chart.lagna, house: 1 }],
    ...Object.entries(report.chart.grahas as Record<string, { rasi: string; degreeInSign: number; house: number }>),
  ] as [string, { rasi: string; degreeInSign: number; house: number }][];
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">லக்னம் & கிரக நிலைகள்</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-line text-left text-ink-soft">
            <th className="py-1 pr-3">புள்ளி</th><th className="py-1 pr-3">ராசி</th><th className="py-1 pr-3">பாகை</th><th className="py-1">பாவம்</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([point, data]) => (
            <tr key={point} className="border-b border-line/50">
              <td className="py-1 pr-3">{POINT_LABEL[point] ?? point}</td>
              <td className="py-1 pr-3 text-saffron font-semibold">{data.rasi}</td>
              <td className="py-1 pr-3 font-mono">{data.degreeInSign.toFixed(2)}°</td>
              <td className="py-1 font-mono text-indigo">{data.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-ink-soft mt-2">
        (பாவம் — Sripati Paddhati · ராகு/கேது — Mean Node)
      </p>
    </div>
  );
}

function DashaSection({ report }: { report: ReportData }) {
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">விம்சோத்தரி தசா</h2>
      <p className="text-xs text-ink-soft mb-2">தொடக்க தசாநாதன்: {report.dasha.startingLord}</p>
      <div className="space-y-2">
        {(report.dasha.dashas as Array<{ lord: string; startLocal: string; endLocal: string; Bhukti: Array<{ lord: string; startLocal: string; endLocal: string }> }>).map((d, i) => (
          <details key={i} className="border border-line rounded-lg px-3 py-2">
            <summary className="cursor-pointer font-semibold text-saffron flex justify-between">
              <span>{d.lord}</span>
              <span className="font-mono text-xs text-ink-soft">{d.startLocal.slice(0, 10)} – {d.endLocal.slice(0, 10)}</span>
            </summary>
            <table className="w-full text-xs mt-2">
              <tbody>
                {d.Bhukti.map((b, j) => (
                  <tr key={j} className="border-t border-line/50">
                    <td className="py-1 pr-3">{b.lord}</td>
                    <td className="py-1 font-mono text-ink-soft">{b.startLocal.slice(0, 10)} – {b.endLocal.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        ))}
      </div>
    </div>
  );
}

function VargaSection({ report }: { report: ReportData }) {
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">வர்க்க அட்டவணை</h2>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft">
              <th className="py-1 pr-2">புள்ளி</th>
              {VARGA_KEYS.map((k) => <th key={k} className="py-1 px-1 font-mono">{k}</th>)}
            </tr>
          </thead>
          <tbody>
            {CHART_POINTS.map((point) => {
              const vargaSet = (report.vargas as Record<string, Record<string, { sign?: string; lord?: string }>>)[point];
              return (
                <tr key={point} className="border-b border-line/50">
                  <td className="py-1 pr-2 font-semibold">{POINT_LABEL[point]}</td>
                  {VARGA_KEYS.map((k) => (
                    <td key={k} className="py-1 px-1 text-saffron">
                      {vargaSet[k].sign ? RASI_SHORT[vargaSet[k].sign as string] : vargaSet[k].lord}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AshtakavargaSection({ report }: { report: ReportData }) {
  const sarva = report.ashtakavarga.sarva as number[];
  const bhinna = report.ashtakavarga.bhinna as Record<string, number[]>;
  const vargas = report.vargas as Record<string, Record<string, { sign?: string }>>;

  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">அஷ்டகவர்க்கம்</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-line">
        <button
          onClick={(e) => {
            const tabs = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-btn]') || []) as HTMLButtonElement[];
            tabs.forEach(t => t.classList.remove('border-b-2', 'border-saffron'));
            (e.currentTarget as HTMLButtonElement).classList.add('border-b-2', 'border-saffron');

            const contents = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-content]') || []) as HTMLDivElement[];
            contents.forEach(c => c.classList.add('hidden'));
            document.querySelector('[data-tab-content="sarva"]')?.classList.remove('hidden');
          }}
          data-tab-btn="sarva"
          className="px-3 py-2 text-sm font-semibold border-b-2 border-saffron text-saffron"
        >
          சர்வாஷ்டகவர்க்கம்
        </button>
        <button
          onClick={(e) => {
            const tabs = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-btn]') || []) as HTMLButtonElement[];
            tabs.forEach(t => t.classList.remove('border-b-2', 'border-saffron'));
            (e.currentTarget as HTMLButtonElement).classList.add('border-b-2', 'border-saffron');

            const contents = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-content]') || []) as HTMLDivElement[];
            contents.forEach(c => c.classList.add('hidden'));
            document.querySelector('[data-tab-content="bhinna"]')?.classList.remove('hidden');
          }}
          data-tab-btn="bhinna"
          className="px-3 py-2 text-sm font-semibold text-ink-soft"
        >
          கிரக பலம்
        </button>
        <button
          onClick={(e) => {
            const tabs = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-btn]') || []) as HTMLButtonElement[];
            tabs.forEach(t => t.classList.remove('border-b-2', 'border-saffron'));
            (e.currentTarget as HTMLButtonElement).classList.add('border-b-2', 'border-saffron');

            const contents = (e.currentTarget.parentElement?.parentElement?.querySelectorAll('[data-tab-content]') || []) as HTMLDivElement[];
            contents.forEach(c => c.classList.add('hidden'));
            document.querySelector('[data-tab-content="chakra"]')?.classList.remove('hidden');
          }}
          data-tab-btn="chakra"
          className="px-3 py-2 text-sm font-semibold text-ink-soft"
        >
          பாவ குழுக்கள்
        </button>
      </div>

      {/* Sarvashtakavarga Tab */}
      <div data-tab-content="sarva" className="mb-6">
        <div className="flex items-end gap-1 h-32 mb-4">
          {sarva.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end">
              <span className="text-xs font-mono">{v}</span>
              <div className="w-full bg-saffron rounded-t" style={{ height: `${(v / Math.max(...sarva)) * 100}%` }} />
              <span className="text-[10px] text-ink-soft mt-1">{RASI_SHORT[Object.keys(RASI_SHORT)[i]]}</span>
            </div>
          ))}
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft"><th className="py-1">புள்ளி</th><th className="py-1">மதிப்பு</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-line/50"><td className="py-1">மொத்த பிந்து</td><td className="py-1 font-mono">{sarva.reduce((a, b) => a + b, 0)}</td></tr>
            <tr className="border-b border-line/50"><td className="py-1">சராசரி</td><td className="py-1 font-mono">{(sarva.reduce((a, b) => a + b, 0) / 12).toFixed(2)}</td></tr>
            <tr className="border-b border-line/50"><td className="py-1">அதிகபட்சம்</td><td className="py-1 font-mono">{Math.max(...sarva)}</td></tr>
            <tr><td className="py-1">குறைந்தபட்சம்</td><td className="py-1 font-mono">{Math.min(...sarva)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Bhinnashtakavarga Tab */}
      <div data-tab-content="bhinna" className="hidden mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft"><th className="py-1">கிரகம்</th><th className="py-1">மொத்த பிந்து</th></tr>
          </thead>
          <tbody>
            {Object.entries(bhinna).map(([planet, bindus]) => (
              <tr key={planet} className="border-b border-line/50">
                <td className="py-1">{POINT_LABEL[planet] ?? planet}</td>
                <td className="py-1 font-mono">{bindus.reduce((a, b) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chancha Chakra Tab */}
      <div data-tab-content="chakra" className="hidden mb-6">
        <p className="text-xs text-ink-soft mb-2">பாவங்களின் குழுக்கள்: கேந்திரம் (1,4,7,10), பணபாரம் (2,5,8,11), அபக்லிமம் (3,6,9,12)</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft"><th className="py-1">குழு</th><th className="py-1">பாவங்கள்</th><th className="py-1">மொத்தம்</th></tr>
          </thead>
          <tbody>
            <tr className="border-b border-line/50">
              <td className="py-1">கேந்திரம்</td>
              <td className="py-1 font-mono">1, 4, 7, 10</td>
              <td className="py-1 font-mono">{[sarva[0], sarva[3], sarva[6], sarva[9]].reduce((a, b) => a + b, 0)}</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1">பணபாரம்</td>
              <td className="py-1 font-mono">2, 5, 8, 11</td>
              <td className="py-1 font-mono">{[sarva[1], sarva[4], sarva[7], sarva[10]].reduce((a, b) => a + b, 0)}</td>
            </tr>
            <tr>
              <td className="py-1">அபக்லிமம்</td>
              <td className="py-1 font-mono">3, 6, 9, 12</td>
              <td className="py-1 font-mono">{[sarva[2], sarva[5], sarva[8], sarva[11]].reduce((a, b) => a + b, 0)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SARVA_TONE: Record<string, string> = {
  Auspicious: 'text-teal', Average: 'text-ink-soft', Inauspicious: 'text-rose', 'Very inauspicious': 'text-rose',
};
const BHINNA_TONE: Record<string, string> = {
  Magnificent: 'text-teal', Remarkable: 'text-teal', Fortunate: 'text-teal', Advantageous: 'text-teal',
  Average: 'text-ink-soft', Tolerable: 'text-ink-soft', Mediocre: 'text-rose', Adverse: 'text-rose', Calamitous: 'text-rose',
};

function TransitSection({ report }: { report: ReportData }) {
  const perPlanet = report.transit.perPlanet as Record<string, {
    rasi: string; bhinnaBindus: number; bhinnaClassification: string; sarvaBindus: number; sarvaClassification: string;
  }>;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">இன்றைய கோசரம் (Transit)</h2>
      <p className="text-xs text-ink-soft mb-2">பிறந்த ஜாதகத்தின் அஷ்டகவர்க்கத்தின் அடிப்படையில், இன்று ஒவ்வொரு கிரகமும் நடக்கும் ராசியின் பிந்து மதிப்பீடு.</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line text-left text-ink-soft">
            <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ராசி</th>
            <th className="py-1 pr-2">சொந்த பிந்து</th><th className="py-1">சர்வ பிந்து</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(perPlanet).map(([planet, r]) => (
            <tr key={planet} className="border-b border-line/50">
              <td className="py-1 pr-2">{POINT_LABEL[planet] ?? planet}</td>
              <td className="py-1 pr-2 text-saffron font-semibold">{r.rasi}</td>
              <td className={`py-1 pr-2 ${BHINNA_TONE[r.bhinnaClassification] ?? ''}`}>{r.bhinnaBindus} · {r.bhinnaClassification}</td>
              <td className={`py-1 ${SARVA_TONE[r.sarvaClassification] ?? ''}`}>{r.sarvaBindus} · {r.sarvaClassification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SHADBALA_MINIMUM_RUPAS: Record<string, number> = {
  Sun: 6.5, Moon: 6.0, Mars: 5.0, Mercury: 7.0, Jupiter: 6.5, Venus: 5.5, Saturn: 5.0,
};

function GrahaBalaSection({ report }: { report: ReportData }) {
  const perPlanet = report.shadbala.perPlanet as Record<string, {
    sthanaBala: number; digBala: number; kaalaBala: number; naisargikaBala: number;
    cheshtaBala: number | { reason: string };
    drikBala: number; yuddhaBala: number;
    kaala: {
      pakshaBala: number; tribhagaBala: number; nathonnataBala: number;
      varshaMasaDinaHoraBala: number; ayanaBala: number;
    };
  }>;
  const partialTotals = Object.fromEntries(
    Object.entries(perPlanet).map(([planet, p]) => [
      planet,
      p.sthanaBala + p.digBala + p.kaalaBala + p.naisargikaBala + p.drikBala + p.yuddhaBala
        + (typeof p.cheshtaBala === 'number' ? p.cheshtaBala : 0),
    ]),
  );
  const minimumVirupas = Object.fromEntries(
    Object.entries(SHADBALA_MINIMUM_RUPAS).map(([p, r]) => [p, r * 60]),
  );
  const scaleMax = Math.max(...Object.values(partialTotals), ...Object.values(minimumVirupas));
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-1 text-ink">கிரக பலம் (சட்பலம்)</h2>
      <p className="text-xs text-ink-soft mb-3">
        கீழே உள்ளது கிடைத்த கூறுகளின் பகுதித் தொகை — முழு சட்பலம் அல்ல (சில கூறுகள் இன்னும் ஆதாரம் தேவை நிலையில் உள்ளன).
        குத்திடும் கோடு (┊) — Parashara&apos;s Light 9 பாணியில், BPHS Ch.27-ன் குறைந்தபட்ச பலம் எல்லையைக் காட்டுகிறது (இன்னும் முழுமையாகாத தொகையுடன் ஒப்பிட மட்டும், தீர்ப்பாக அல்ல).
      </p>
      <div className="space-y-2 mb-4">
        {Object.entries(partialTotals).map(([planet, total]) => (
          <div key={planet} className="flex items-center gap-2">
            <span className="w-16 text-xs">{POINT_LABEL[planet] ?? planet}</span>
            <div className="relative flex-1 bg-surface-2 rounded h-4 overflow-hidden">
              <div className="bg-saffron h-full rounded" style={{ width: `${(total / scaleMax) * 100}%` }} />
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-indigo/70"
                style={{ left: `${(minimumVirupas[planet] / scaleMax) * 100}%` }}
                title={`குறைந்தபட்ச பலம்: ${SHADBALA_MINIMUM_RUPAS[planet]} ரூபா`}
              />
            </div>
            <span className="w-14 text-xs font-mono text-right">{total.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <details className="text-xs">
        <summary className="cursor-pointer text-saffron font-semibold mb-2">கூறு வாரியாக பார்க்க</summary>
        <table className="w-full mt-2">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft">
              <th className="py-1 pr-2">கிரகம்</th><th className="py-1 pr-2">ஸ்தானம்</th><th className="py-1 pr-2">திக்</th>
              <th className="py-1 pr-2">காலம்</th><th className="py-1 pr-2">நைசர்கிகம்</th><th className="py-1 pr-2">சேஷ்டா*</th>
              <th className="py-1 pr-2">திருக்</th><th className="py-1">யுத்தம்</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(perPlanet).map(([planet, p]) => (
              <tr key={planet} className="border-b border-line/50">
                <td className="py-1 pr-2">{POINT_LABEL[planet] ?? planet}</td>
                <td className="py-1 pr-2 font-mono">{p.sthanaBala.toFixed(1)}</td>
                <td className="py-1 pr-2 font-mono">{p.digBala.toFixed(1)}</td>
                <td className="py-1 pr-2 font-mono">{p.kaalaBala.toFixed(1)}</td>
                <td className="py-1 pr-2 font-mono">{p.naisargikaBala.toFixed(1)}</td>
                <td className="py-1 pr-2">
                  {typeof p.cheshtaBala === 'number' ? p.cheshtaBala.toFixed(1) : <SourceRequiredBadge reason={p.cheshtaBala.reason} />}
                </td>
                <td className="py-1 pr-2 font-mono">{p.drikBala.toFixed(1)}</td>
                <td className="py-1 font-mono">{p.yuddhaBala.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-ink-soft mt-2">* சேஷ்டா — சந்திரனுக்கு மட்டும் முழுமையானது (அவளுடைய பட்சபலமே); மற்ற 6 கிரகங்களுக்கும் Seeghrocha (பண்டைய கோள் நடுநிலை வேக மாதிரி) தேவை. ஸ்தானம், காலம் (அயனபலம் உட்பட), திருக் மற்றும் யுத்த பலம் — இவை அனைத்தும் இப்போது முழுமையானவை (யுத்த பலம் — கிரக யுத்தம் நடந்தால் மட்டும் பூஜ்ஜியமற்ற மதிப்பு காட்டும்).</p>

        <p className="text-saffron font-semibold mt-4 mb-2">காலம் பலம் — கூறு வாரியாக (Parashara&apos;s Light 9-ன் Detailed Shad Bala அறிக்கை பாணியில், கூறுகள் வரிசையாக)</p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-line text-left text-ink-soft">
              <th className="py-1 pr-2">கூறு</th>
              {Object.keys(perPlanet).map((planet) => (
                <th key={planet} className="py-1 px-1">{POINT_LABEL[planet] ?? planet}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([
              ['நத-உன்னதம்', (p: (typeof perPlanet)[string]) => p.kaala.nathonnataBala],
              ['பட்சம்', (p: (typeof perPlanet)[string]) => p.kaala.pakshaBala],
              ['திரிபாகம்', (p: (typeof perPlanet)[string]) => p.kaala.tribhagaBala],
              ['வர்ஷ/மாஸ/தின/ஹோரா', (p: (typeof perPlanet)[string]) => p.kaala.varshaMasaDinaHoraBala],
              ['அயனம்', (p: (typeof perPlanet)[string]) => p.kaala.ayanaBala],
            ] as const).map(([label, getValue]) => (
              <tr key={label} className="border-b border-line/50">
                <td className="py-1 pr-2">{label}</td>
                {Object.values(perPlanet).map((p, i) => (
                  <td key={i} className="py-1 px-1 font-mono">{getValue(p).toFixed(1)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function BhavaBalaSection({ report }: { report: ReportData }) {
  const houses = report.bhavaBala.houses as Record<string, {
    houseSarvaBindus: number;
    lord: { planet: string; sarvaBindus: number; bhinnaBindus?: number };
    karaka: { planet: string; sarvaBindus: number; bhinnaBindus?: number };
  }>;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-1 text-ink">பாவ பலம்</h2>
      <p className="text-xs text-ink-soft mb-3">பாவத்தின் சர்வ பிந்து, அதன் அதிபதியின் பிந்து, அதன் காரகனின் பிந்து — மூன்றும் தனித்தனியே.</p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-line text-left text-ink-soft">
            <th className="py-1 pr-2">பாவம்</th><th className="py-1 pr-2">சர்வ பிந்து</th>
            <th className="py-1 pr-2">அதிபதி</th><th className="py-1">காரகன்</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(houses).map(([house, h]) => (
            <tr key={house} className="border-b border-line/50">
              <td className="py-1 pr-2">{house}</td>
              <td className="py-1 pr-2 font-mono">{h.houseSarvaBindus}</td>
              <td className="py-1 pr-2">
                {POINT_LABEL[h.lord.planet] ?? h.lord.planet} ({h.lord.sarvaBindus}{h.lord.bhinnaBindus !== undefined ? `/${h.lord.bhinnaBindus}` : ''})
              </td>
              <td className="py-1">
                {POINT_LABEL[h.karaka.planet] ?? h.karaka.planet} ({h.karaka.sarvaBindus}{h.karaka.bhinnaBindus !== undefined ? `/${h.karaka.bhinnaBindus}` : ''})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShodasaBalaSection() {
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-2 text-ink">சோடச பலம் (Vimshopaka Bala)</h2>
      <div className="rounded-xl border border-dashed border-ink-soft/40 px-4 py-3 text-sm text-ink-soft">
        <SourceRequiredBadge reason="16 வர்க்க charts-ன் dignity-அடிப்படையிலான point table (Vimshopaka Bala) இன்னும் நம் corpus-ல் exact-ஆக verify செய்யப்படவில்லை." />
        <p className="mt-2">D1-D16 வர்க்கங்கள் மேலே (வர்க்க அட்டவணை) ஏற்கனவே கிடைக்கின்றன — point-table verify ஆன பிறகு இங்கு மொத்த மதிப்பு காட்டப்படும்.</p>
      </div>
    </div>
  );
}

function NabhasaYogaSection({ report }: { report: ReportData }) {
  const yogas = report.nabhasaYoga.yogas as Array<{ name: string; category: string }>;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">நபஸ யோகங்கள்</h2>
      {yogas.length === 0 ? (
        <p className="text-sm text-ink-soft">எந்த நபஸ யோகமும் இல்லை.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {yogas.map((y, i) => (
            <span key={i} className="rounded-full bg-indigo-soft text-indigo px-3 py-1 text-sm">
              {y.name} <span className="text-xs opacity-70">({y.category})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function KarakaSection({ report }: { report: ReportData }) {
  const naisargika = report.karaka.naisargika as Record<string, string>;
  const bhava = report.karaka.bhava as Record<string, string>;
  const yoga = report.karaka.yoga as string[];
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">காரகங்கள்</h2>
      <div className="grid grid-cols-2 gap-6 text-sm mb-4">
        <div>
          <p className="font-semibold text-ink-soft mb-1">நைசர்கிக காரகம் (கிரகம் → விஷயம்)</p>
          <table className="w-full text-xs">
            <tbody>
              {Object.entries(naisargika).map(([planet, matter]) => (
                <tr key={planet} className="border-b border-line/50">
                  <td className="py-1 pr-2">{POINT_LABEL[planet] ?? planet}</td>
                  <td className="py-1 text-saffron">{matter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="font-semibold text-ink-soft mb-1">பாவ காரகம் (பாவம் → கிரகம்)</p>
          <table className="w-full text-xs">
            <tbody>
              {Object.entries(bhava).map(([house, planet]) => (
                <tr key={house} className="border-b border-line/50">
                  <td className="py-1 pr-2">{house}</td>
                  <td className="py-1 text-saffron">{POINT_LABEL[planet] ?? planet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm mb-2">
        <span className="font-semibold text-ink-soft">யோக காரகம்: </span>
        {yoga.length === 0 ? 'இல்லை' : yoga.map((p) => POINT_LABEL[p] ?? p).join(', ')}
      </p>
      <p className="text-xs text-ink-soft">
        சார காரகம் (Atmakaraka etc.): <SourceRequiredBadge reason={(report.karaka.charaKaraka as { reason: string }).reason} /> — இது Jaimini Jyotish முறை, தற்போது ஒத்திவைக்கப்பட்டுள்ளது.
      </p>
    </div>
  );
}

const SECTION_RENDERERS: Record<string, React.ComponentType<{ report: ReportData }>> = {
  profile: ProfileSection,
  lagnaGraha: LagnaGrahaSection,
  dasha: DashaSection,
  varga: VargaSection,
  ashtakavarga: AshtakavargaSection,
  transit: TransitSection,
  grahaBala: GrahaBalaSection,
  bhavaBala: BhavaBalaSection,
  shodasaBala: ShodasaBalaSection,
  nabhasaYoga: NabhasaYogaSection,
  karaka: KarakaSection,
};

export default function ReportBuilder() {
  const [form, setForm] = useState<BirthFormInput>({
    name: '', gender: 'female',
    year: 1990, month: 1, day: 1, hour: 12, minute: 0,
    ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
    latitude: 13.0827, longitude: 80.2707, placeName: 'சென்னை',
  });
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, true])),
  );
  const [order, setOrder] = useState<string[]>(SECTIONS.map((s) => s.id));

  const move = (id: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const idx = prev.indexOf(id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await computeReport(form);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-br from-indigo-soft via-bg to-saffron-soft px-6 py-8 border-b border-line print:hidden">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">S12 · Report Builder</p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஜாதக அறிக்கை உருவாக்கி</h1>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-8 print:hidden">
        <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-surface border border-line rounded-2xl p-5 mb-6">
          <label className="col-span-2 text-sm">பெயர்
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">பாலினம்
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg">
              <option value="female">பெண்</option>
              <option value="male">ஆண்</option>
              <option value="other">மற்றவை</option>
            </select>
          </label>
          <label className="text-sm">இடம் பெயர்
            <input value={form.placeName} onChange={(e) => setForm({ ...form, placeName: e.target.value })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">தேதி
            <input type="date" required
              onChange={(e) => {
                const [y, m, d] = e.target.value.split('-').map(Number);
                setForm({ ...form, year: y, month: m, day: d });
              }}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">நேரம்
            <input type="time" required
              onChange={(e) => {
                const [h, min] = e.target.value.split(':').map(Number);
                setForm({ ...form, hour: h, minute: min });
              }}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">அட்சரேகை (latitude)
            <input type="number" step="0.0001" value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm">தீர்க்கரேகை (longitude)
            <input type="number" step="0.0001" value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <label className="text-sm col-span-2">UTC offset (நிமிடங்கள்)
            <input type="number" value={form.utcOffsetMinutes}
              onChange={(e) => setForm({ ...form, utcOffsetMinutes: Number(e.target.value) })}
              className="mt-1 w-full rounded border border-line px-2 py-1 bg-bg" />
          </label>
          <button type="submit" disabled={loading}
            className="col-span-2 mt-2 rounded-lg bg-saffron text-white font-semibold py-2 disabled:opacity-50">
            {loading ? 'கணக்கிடுகிறது…' : 'ஜாதகம் கணக்கிடு'}
          </button>
        </form>
        {error && <p className="text-rose text-sm mb-4">பிழை: {error}</p>}

        {report && (
          <div className="bg-surface border border-line rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-ink">அறிக்கை பிரிவுகள்</h3>
            <ul className="space-y-2">
              {order.map((id, i) => {
                const def = SECTIONS.find((s) => s.id === id)!;
                return (
                  <li key={id} className="flex items-center gap-3">
                    <input type="checkbox" checked={enabled[id]} onChange={(e) => setEnabled({ ...enabled, [id]: e.target.checked })} />
                    <span className="flex-1 text-sm">{def.label}</span>
                    <button type="button" onClick={() => move(id, -1)} disabled={i === 0} className="text-ink-soft disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => move(id, 1)} disabled={i === order.length - 1} className="text-ink-soft disabled:opacity-30">↓</button>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-3 mt-4 print:hidden">
              <button type="button" onClick={() => window.print()}
                className="rounded-lg bg-indigo text-white font-semibold py-2 px-4">
                அச்சிடு / PDF ஆக சேமி
              </button>
              <Link href="/consultation"
                className="rounded-lg bg-teal text-white font-semibold py-2 px-4">
                தனிப்பட்ட ஆலோசனை வேண்டுமா?
              </Link>
            </div>
          </div>
        )}
      </section>

      {report && (
        <section className="max-w-3xl mx-auto px-6 py-8">
          {order.filter((id) => enabled[id]).map((id) => {
            const Renderer = SECTION_RENDERERS[id];
            return <Renderer key={id} report={report} />;
          })}
        </section>
      )}
    </main>
  );
}
