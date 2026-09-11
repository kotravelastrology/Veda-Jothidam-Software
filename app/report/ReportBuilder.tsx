'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { computeReport, type BirthFormInput } from './actions';
import { BirthDataForm, type BirthData } from '@/src/ui/BirthDataForm';
import { ChartTypeSelector } from '@/src/charts/ChartTypeSelector';
import { ChartDisplay } from '@/src/charts/ChartDisplay';
import { getChartById, type ChartCategory } from '@/src/charts/chartTypes';
import { getChartLibrary } from '@/src/portal/ChartLibraryManager';
import { useSettings } from '@/src/ui/SettingsPanel';

// Settings values (lowercase UI keys) → the governed chart-context names
// (@swisseph/node SiderealMode / HouseSystem keys) the engine expects.
const AYANAMSHA_MAP: Record<string, string> = {
  lahiri: 'Lahiri', raman: 'Raman', krishnamurti: 'Krishnamurti', truecitra: 'TrueCitra',
};
const HOUSE_SYSTEM_MAP: Record<string, string> = {
  porphyrius: 'Porphyrius', placidus: 'Placidus', whole: 'WholeSign', equal: 'Equal', koch: 'Koch',
};

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
  { id: 'altDashas', label: 'மாற்று தசைகள் (யோகினி / அஷ்டோத்தரி)' },
  { id: 'kalachakraDasha', label: 'காலச்சக்கர தசை' },
  { id: 'varga', label: 'வர்க்க அட்டவணை (16)' },
  { id: 'ashtakavarga', label: 'அஷ்டகவர்க்கம்' },
  { id: 'ashtakavargaDetail', label: 'அஷ்டகவர்க்கம் - விரிவுபடுத்தப்பட்ட பார்வை' },
  { id: 'ashtakavargaShodhana', label: 'அஷ்டகவர்க்கம் — சோதனை / பிண்டம்' },
  { id: 'transit', label: 'இன்றைய கோசரம் (Transit)' },
  { id: 'gocharaPhala', label: 'சந்திர கோசார பலன் + வேதை' },
  { id: 'grahaBala', label: 'கிரக பலம் (சட்பலம்)' },
  { id: 'bhavaBala', label: 'பாவ பலம்' },
  { id: 'shodasaBala', label: 'சோடச பலம்' },
  { id: 'nabhasaYoga', label: 'நபஸ யோகங்கள்' },
  { id: 'karaka', label: 'காரகங்கள்' },
  { id: 'ayurdaya', label: 'ஆயுர்தாயம்' },
  { id: 'jaimini', label: 'ஜைமினி ஜோதிடம்' },
  { id: 'avasthas', label: 'கிரக அவஸ்தைகள்' },
  { id: 'nakshatraExtras', label: 'நட்சத்திரக் கூறுகள்' },
  { id: 'upagraha', label: 'உபகிரகங்கள்' },
  { id: 'numerology', label: 'எண் ஜோதிடம்' },
  { id: 'nadi', label: 'பிருகு நந்தி நாடி' },
  { id: 'bnnLiterature', label: 'பிருகு நந்தி நாடி — இலக்கியம்' },
  { id: 'bhriguProgressions', label: 'பிருகு சக்கர / சரள பத்ததி' },
  { id: 'kp', label: 'KP ஜோதிடம்' },
  { id: 'kpEvents', label: 'KP முகூர்த்தம் (80 நிகழ்வு)' },
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
        <dt className="text-ink-soft">அயனாம்சம் / பாவம்</dt>
        <dd>{report.chart.ayanamsha} · {report.chart.houseSystem} · {report.chart.nodeType === 'true' ? 'true node' : 'mean node'}</dd>
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

function AyurdayaSection({ report }: { report: ReportData }) {
  const a = (report as any).ayurdaya;
  if (!a?.available) return null;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">ஆயுர்தாயம்</h2>
      <p className="text-sm mb-2">
        <span className="text-ink-soft">முறை: </span><span className="font-medium">{a.systemTa}</span>
        <span className="text-ink-soft"> (லக்னம் {a.strengths.lagna} · சூரியன் {a.strengths.sun} · சந்திரன் {a.strengths.moon})</span>
      </p>
      <table className="w-full text-sm max-w-2xl">
        <thead><tr className="text-ink-soft border-b border-line">
          <th className="text-left py-1">கிரகம்</th><th className="text-right py-1">அடிப்படை</th>
          <th className="text-right py-1">நிகர</th><th className="text-left py-1 pl-3">ஹரணம்</th>
        </tr></thead>
        <tbody>
          {a.contributions.map((c: any) => (
            <tr key={c.planet} className="border-b border-line/40">
              <td className="py-1">{POINT_LABEL[c.planet] ?? c.planet}</td>
              <td className="py-1 text-right tabular-nums text-ink-soft">{c.basicYears.toFixed(2)}</td>
              <td className="py-1 text-right tabular-nums font-medium">{c.netYears.toFixed(2)}</td>
              <td className="py-1 pl-3 text-xs text-ink-soft">{c.reason}</td>
            </tr>
          ))}
          <tr className="border-b border-line/40">
            <td className="py-1">லக்னம்</td><td /><td className="py-1 text-right tabular-nums font-medium">{a.ascendantYears.toFixed(2)}</td><td />
          </tr>
        </tbody>
      </table>
      <p className="text-sm mt-2">
        மொத்தம்: <span className="font-semibold">{a.totalSaura}</span> சவுர ஆண்டு
        <span className="text-ink-soft"> ({a.totalSavana} சாவன) · </span>
        <span className="font-medium text-saffron">{a.category}</span>
      </p>
      <p className="text-[11px] text-ink-soft mt-2">
        BPHS ச.43 — 3 முறை (பிண்டாயு/நைசர்க்காயு/அம்சாயு), லக்னம்/சூரியன்/சந்திரன் பலத்தால் தேர்வு · 4 ஹரணத்தில் மிக உயர்ந்தது மட்டும்.
        முந்தைய AstrologicLab ayurdaya engine-லிருந்து port. வெளிப்படுத்தப்பட்ட எளிமைப்படுத்தல்கள் உள்ளன — சோதனை மட்டுமே.
      </p>
    </div>
  );
}

function GocharaPhalaSection({ report }: { report: ReportData }) {
  const g = (report as any).gocharaPhala;
  if (!g?.available) return null;
  const style: Record<string, string> = { benefic: 'text-teal', vedha: 'text-rose', neutral: 'text-ink-soft' };
  const label: Record<string, string> = { benefic: 'சுபம்', vedha: 'வேதை (தடை)', neutral: 'நடுநிலை' };
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">சந்திர கோசார பலன் + வேதை</h2>
      <p className="text-sm text-ink-soft mb-2">ஜன்ம ராசி (சந்திரன்): <span className="text-ink font-medium">{RASI_SHORT[g.moonRasi] ?? g.moonRasi}</span> — இன்றைய கோசாரம் அதிலிருந்து.</p>
      <table className="w-full text-sm max-w-lg">
        <thead><tr className="text-ink-soft border-b border-line">
          <th className="text-left py-1">கிரகம்</th><th className="text-center py-1">பாவம்</th>
          <th className="text-left py-1">பலன்</th><th className="text-left py-1">வேதை</th>
        </tr></thead>
        <tbody>
          {g.rows.map((r: any) => (
            <tr key={r.graha} className="border-b border-line/40">
              <td className="py-1">{POINT_LABEL[r.graha] ?? r.graha}</td>
              <td className="py-1 text-center">{r.houseFromMoon}</td>
              <td className={`py-1 ${style[r.verdict]}`}>{label[r.verdict]}</td>
              <td className="py-1 text-ink-soft text-xs">
                {r.isBenefic ? `${r.vedhaHouse}வது` : '—'}
                {r.obstructedBy.length > 0 && ` · ${r.obstructedBy.map((x: string) => POINT_LABEL[x] ?? x).join(', ')}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] text-ink-soft mt-2">
        பலதீபிகா ச.26 v.3-8 — சந்திரனிலிருந்து சுப கோசார பாவங்கள் + இணை வேதை பாவம் (சூரியன்↔சனி, சந்திரன்↔புதன் விதிவிலக்கு).
        முந்தைய AstrologicLab gocharaPhala engine-லிருந்து port.
      </p>
    </div>
  );
}

function AshtakavargaShodhanaSection({ report }: { report: ReportData }) {
  const sh = (report as any).ashtakavargaShodhana;
  if (!sh?.available) return null;
  const planets = Object.keys(sh.pinda);
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">அஷ்டகவர்க்கம் — சோதனை &amp; பிண்டம்</h2>
      <p className="text-xs font-semibold text-ink-soft mb-1">சோதனை பிறகு பிந்துக்கள் (திரிகோண + ஏகாதிபத்ய குறைப்பு)</p>
      <div className="overflow-x-auto mb-4">
        <table className="text-xs">
          <tbody>
            {planets.map((p) => (
              <tr key={p} className="border-b border-line/40">
                <td className="py-1 pr-3 font-medium">{POINT_LABEL[p] ?? p}</td>
                {sh.reduced[p].map((b: number, i: number) => (
                  <td key={i} className={`py-1 px-1.5 text-center ${b === 0 ? 'text-ink-soft/40' : 'text-ink'}`}>{b}</td>
                ))}
                <td className="py-1 pl-2 text-ink-soft">Σ{sh.reduced[p].reduce((a: number, b: number) => a + b, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs font-semibold text-ink-soft mb-1">பிண்டம் (Rāśi / Graha / Sodhya)</p>
      <table className="text-sm">
        <thead><tr className="text-ink-soft border-b border-line">
          <th className="text-left py-1 pr-4">கிரகம்</th><th className="text-right py-1 pr-4">ராசி பிண்டம்</th>
          <th className="text-right py-1 pr-4">கிரக பிண்டம்</th><th className="text-right py-1">சோத்ய பிண்டம்</th>
        </tr></thead>
        <tbody>
          {planets.map((p) => (
            <tr key={p} className="border-b border-line/40">
              <td className="py-1 pr-4">{POINT_LABEL[p] ?? p}</td>
              <td className="py-1 pr-4 text-right tabular-nums">{sh.pinda[p].rashiPinda}</td>
              <td className="py-1 pr-4 text-right tabular-nums">{sh.pinda[p].grahaPinda}</td>
              <td className="py-1 text-right tabular-nums font-semibold text-saffron">{sh.pinda[p].sodhyaPinda}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] text-ink-soft mt-2">
        BPHS ச.66 — திரிகோண சோதனை (குழு-குறைந்தபட்சம்) + ஏகாதிபத்ய சோதனை (சொந்த-ஜோடி வித்தியாசம்); பிண்டம் = Σ(பிந்து × குணகாரம்).
        முந்தைய AstrologicLab ashtakavarga engine-லிருந்து port.
      </p>
    </div>
  );
}

function DetailedAshtakavargaSection({ report }: { report: ReportData }) {
  const [expandedTab, setExpandedTab] = useState<'summary' | 'heatmap' | 'chakra'>('summary');

  const sarva = report.ashtakavarga.sarva as number[];
  const bhinna = report.ashtakavarga.bhinna as Record<string, number[]>;

  const sarvaTotal = (sarva || []).reduce((a, b) => a + b, 0);
  const sarvaAvg = sarvaTotal / 12;

  const heatmapData = Object.entries(bhinna).map(([planet, bindus]) => ({
    planet,
    bindus,
    total: bindus.reduce((a, b) => a + b, 0),
  }));

  const chakraGroups = [
    { name: 'Kendra (H1, H4, H7, H10)', indices: [0, 3, 6, 9], label: 'கோண' },
    { name: 'Panapara (H2, H5, H8, H11)', indices: [1, 4, 7, 10], label: 'পনপர' },
    { name: 'Apoklima (H3, H6, H9, H12)', indices: [2, 5, 8, 11], label: 'অপোক्लिम' },
  ];

  const chakraData = chakraGroups.map(group => ({
    ...group,
    total: group.indices.reduce((sum, idx) => sum + (sarva[idx] || 0), 0),
  }));

  const maxChancha = Math.max(...chakraData.map(c => c.total));

  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">அஷ்டகவர்க்கம் - விரிவுபடுத்தப்பட்ட பார்வை</h2>
      <p className="text-sm text-ink-soft mb-4">பிந்து வலிமை (Heatmap), பாவ குழுக்கள் (Chancha Chakra), மற்றும் விரிவான பகுப்பாய்வு</p>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4 border-b border-line">
        <button
          onClick={() => setExpandedTab('summary')}
          className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
            expandedTab === 'summary'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          சுருக்கம்
        </button>
        <button
          onClick={() => setExpandedTab('heatmap')}
          className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
            expandedTab === 'heatmap'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          பிந்து உஷ்ணசக்திப்படம்
        </button>
        <button
          onClick={() => setExpandedTab('chakra')}
          className={`px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
            expandedTab === 'chakra'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          பாவ குழுக்கள்
        </button>
      </div>

      {/* Summary Tab */}
      {expandedTab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-saffron-soft rounded-lg p-4 border border-saffron/30">
            <p className="text-sm font-semibold text-ink mb-2">சர்வாஷ்டகவர்க்கம் சுருக்கம்</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-ink-soft">மொத்த பிந்து</span><br /><span className="font-mono font-bold text-lg">{sarvaTotal}</span></div>
              <div><span className="text-ink-soft">சராசரி</span><br /><span className="font-mono font-bold text-lg">{sarvaAvg.toFixed(2)}</span></div>
              <div><span className="text-ink-soft">அதிகபட்சம்</span><br /><span className="font-mono font-bold text-lg">{Math.max(...sarva)}</span></div>
              <div><span className="text-ink-soft">குறைந்தபட்சம்</span><br /><span className="font-mono font-bold text-lg">{Math.min(...sarva)}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Tab */}
      {expandedTab === 'heatmap' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-saffron-soft">
                <th className="py-2 px-2 text-left font-semibold">கிரகம்</th>
                {sarva.map((_, i) => (
                  <th key={i} className="py-1 px-1 text-center">{RASI_SHORT[Object.keys(RASI_SHORT)[i]]}</th>
                ))}
                <th className="py-2 px-2 text-right font-semibold">மொத்தம்</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.planet} className="border-b border-line/50">
                  <td className="py-2 px-2 font-semibold">{POINT_LABEL[row.planet] || row.planet}</td>
                  {row.bindus.map((bindu, i) => {
                    const intensity = bindu / 8;
                    const bgColor = bindu === 0 ? 'bg-bg' : `bg-saffron/[${Math.min(intensity, 1)}]`;
                    return (
                      <td key={i} className={`py-1 px-1 text-center text-xs font-mono ${bgColor}`}>
                        {bindu}
                      </td>
                    );
                  })}
                  <td className="py-2 px-2 text-right font-mono font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Chakra Tab */}
      {expandedTab === 'chakra' && (
        <div className="space-y-4">
          {chakraData.map((chakra) => (
            <div key={chakra.name} className="border border-line rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-ink">{chakra.name}</p>
                  <p className="text-xs text-ink-soft">{chakra.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg">{chakra.total}</p>
                  <p className="text-xs text-ink-soft">{((chakra.total / sarvaTotal) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full bg-line rounded-full h-2">
                <div
                  className="bg-saffron h-2 rounded-full transition-all"
                  style={{ width: `${(chakra.total / maxChancha) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
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

const UPAGRAHA_LABEL: Record<string, string> = {
  Dhuma: 'தூமன்', Vyatipata: 'வியதீபாதன்', Parivesha: 'பரிவேஷன்',
  Indrachapa: 'இந்திரசாபம்', Upaketu: 'உபகேது', Gulika: 'குளிகன்', Mandi: 'மாந்தி',
};

function UpagrahaSection({ report }: { report: ReportData }) {
  const up = (report as any).upagraha;
  if (!up?.upagrahas) return null;
  const rows = Object.entries(up.upagrahas) as [string, any][];
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">உபகிரகங்கள்</h2>
      <table className="w-full text-sm max-w-lg">
        <thead>
          <tr className="text-ink-soft border-b border-line">
            <th className="text-left py-1">உபகிரகம்</th>
            <th className="text-left py-1">ராசி</th>
            <th className="text-right py-1">பாகை</th>
            <th className="text-left py-1 pl-3">அதிபதி</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, v]) => (
            <tr key={name} className="border-b border-line/50">
              <td className="py-1">{UPAGRAHA_LABEL[name] ?? name}</td>
              <td className="py-1">{RASI_SHORT[v.rasi] ?? v.rasi}</td>
              <td className="py-1 text-right tabular-nums">{v.degreeInSign.toFixed(2)}°</td>
              <td className="py-1 pl-3 text-ink-soft">{POINT_LABEL[v.parent] ?? v.parent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-ink-soft mt-2">
        தூமன்–உபகேது சூரிய தீர்க்கத்திலிருந்து (BPHS ச.3). குளிகன்/மாந்தி: பலதீபிகா ச.25 —
        {' '}{up.birthPeriod === 'night' ? 'இரவு' : 'பகல்'} பிறப்பு, லக்ன உதயம்.
      </p>
    </div>
  );
}

function NumerologySection({ report }: { report: ReportData }) {
  const n = (report as any).numerology;
  if (!n) return null;
  const Card = ({ title, num, detail }: { title: string; num: any; detail: any }) => (
    <div className="border border-line rounded-lg p-3">
      <p className="text-ink-soft text-xs mb-1">{title}</p>
      <p className="text-2xl font-bold text-saffron">{num?.single ?? '–'}
        {num?.compound && num.compound !== num.single && <span className="text-sm text-ink-soft"> ({num.compound})</span>}
      </p>
      {detail && (
        <div className="text-xs text-ink-soft mt-1 space-y-0.5">
          <p><span className="text-ink">அதிபதி:</span> {detail.planet}</p>
          <p><span className="text-ink">நல்ல நாள்:</span> {detail.lucky?.day} · <span className="text-ink">நிறம்:</span> {detail.lucky?.color}</p>
          <p><span className="text-ink">கல்:</span> {detail.lucky?.stone}</p>
        </div>
      )}
    </div>
  );
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">எண் ஜோதிடம்</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
        <Card title="மூலாங்கம் (பிறந்த தேதி)" num={n.moolank} detail={n.moolankDetail} />
        <Card title="பாக்யாங்கம் (முழு தேதி)" num={n.bhagyank} detail={n.bhagyankDetail} />
        <Card title="பெயர் எண் (Chaldean)" num={n.nameNumber} detail={n.nameDetail} />
      </div>
      {n.compatibility && (
        <p className="text-sm mt-3">
          <span className="text-ink-soft">மூலாங்கம் ↔ பாக்யாங்கம்: </span>
          <span className={n.compatibility.friendly ? 'text-teal font-medium' : 'text-rose font-medium'}>
            {n.compatibility.verdict}
          </span>
        </p>
      )}
      {n.moolankDetail && (
        <p className="text-xs text-ink-soft mt-2 max-w-2xl">{n.moolankDetail.trait}</p>
      )}
      <p className="text-[11px] text-ink-soft mt-2">
        Chaldean எண் முறை + மூலாங்கம்/பாக்யாங்கம் — பொது வழிகாட்டுதல் மட்டுமே.
      </p>
    </div>
  );
}

const NADI_PATTERN_LABEL: Record<string, string> = {
  '1579': '1·5·7·9', '159': '1·5·9', '311': '3·11', '10': '10',
};

function NadiCombinationSection({ report }: { report: ReportData }) {
  const nadi = (report as any).nadi;
  const [view, setView] = useState<'A' | 'B'>('A');
  const [pattern, setPattern] = useState<string>('1579');
  const [mode, setMode] = useState<'AP' | 'BP'>('AP');
  if (!nadi?.available) {
    return (
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">பிருகு நந்தி நாடி</h2>
        <p className="text-sm text-ink-soft">இந்த அட்சரேகையில் Placidus பாவம் கிடைக்கவில்லை — நாடி சேர்க்கை காட்ட முடியவில்லை.</p>
      </div>
    );
  }
  const bPattern = pattern === '311' || pattern === '10' ? '1579' : pattern;
  const aData = nadi.nadiCombinations?.[pattern]?.[mode];
  const bData = nadi.bhavaCombinations?.[bPattern]?.[mode];
  const pct = (v: number) => (
    <span className={v >= 75 ? 'text-teal font-semibold' : v >= 40 ? 'text-ink' : 'text-ink-soft'}>{v}%</span>
  );

  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">பிருகு நந்தி நாடி</h2>
      <div className="flex flex-wrap gap-2 mb-3 text-xs print:hidden">
        <div className="flex rounded overflow-hidden border border-line">
          {(['A', 'B'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-2 py-1 ${view === v ? 'bg-saffron text-ink' : 'bg-surface text-ink-soft'}`}>
              {v === 'A' ? 'கிரக சேர்க்கை (A)' : 'பாவ சேர்க்கை (B)'}
            </button>
          ))}
        </div>
        <select value={pattern} onChange={(e) => setPattern(e.target.value)}
          className="px-2 py-1 bg-surface border border-line rounded text-ink">
          {(view === 'A' ? ['1579', '159', '311', '10'] : ['1579', '159']).map((p) => (
            <option key={p} value={p}>{NADI_PATTERN_LABEL[p]}</option>
          ))}
        </select>
        <div className="flex rounded overflow-hidden border border-line">
          {(['AP', 'BP'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-2 py-1 ${mode === m ? 'bg-saffron text-ink' : 'bg-surface text-ink-soft'}`}>
              {m === 'AP' ? 'AP (பரிவர்த்தனை)' : 'BP'}
            </button>
          ))}
        </div>
      </div>

      {view === 'A' && aData?.available && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ink-soft border-b border-line">
                <th className="text-left py-1">கிரகம்</th>
                <th className="text-left py-1">அடுத்து</th>
                <th className="text-right py-1">மீதம்</th>
                <th className="text-left py-1 pl-4">சேரும் கிரகங்கள் (%)</th>
              </tr>
            </thead>
            <tbody>
              {aData.rows.map((row: any) => (
                <tr key={row.id} className="border-b border-line/40 align-top">
                  <td className="py-1.5 font-medium">{POINT_LABEL[row.id] ?? row.id}{row.retrograde && <span className="text-rose"> ℞</span>}</td>
                  <td className="py-1.5 text-ink-soft">{POINT_LABEL[row.next] ?? row.next}</td>
                  <td className="py-1.5 text-right tabular-nums text-ink-soft">{row.remaining}%</td>
                  <td className="py-1.5 pl-4">
                    {row.planets.slice(0, 6).map((e: any, i: number) => (
                      <span key={i} className="inline-block mr-3 whitespace-nowrap">
                        {POINT_LABEL[e.id] ?? e.id}{e.aspect ? `·${e.aspect}` : ''} {pct(e.percentage)}
                      </span>
                    ))}
                    {row.planets.length === 0 && <span className="text-ink-soft">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'B' && bData?.available && (
        <div className="overflow-x-auto">
          {bData.exchanges?.length > 0 && (
            <p className="text-xs text-ink-soft mb-2">பரிவர்த்தனை: {bData.exchanges.map((x: string[]) => x.map((p) => POINT_LABEL[p] ?? p).join('↔')).join(', ')}</p>
          )}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-ink-soft border-b border-line">
                <th className="text-left py-1">பாவம்</th>
                <th className="text-left py-1 pl-4">செயல்படுத்தும் கிரகங்கள் (%)</th>
              </tr>
            </thead>
            <tbody>
              {bData.rows.map((row: any) => (
                <tr key={row.house} className="border-b border-line/40 align-top">
                  <td className="py-1.5 font-medium">{row.house}</td>
                  <td className="py-1.5 pl-4">
                    {row.planets.slice(0, 7).map((e: any, i: number) => (
                      <span key={i} className="inline-block mr-3 whitespace-nowrap">
                        {POINT_LABEL[e.id] ?? e.id}{e.aspect ? `·${e.aspect}` : ''}{e.overlap ? '⁺' : ''} {pct(e.percentage)}
                      </span>
                    ))}
                    {row.planets.length === 0 && <span className="text-ink-soft">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-ink-soft mt-2">
        R. G. Rao பிருகு நந்தி நாடி முறை · KP-Placidus பாவ இடைவெளிகள் · AP = பரிவர்த்தனை (mutual sign-lord exchange) பொருந்திய பிறகு.
        முந்தைய kottravel-Nadi engine-லிருந்து port செய்யப்பட்டது.
      </p>
    </div>
  );
}

const SIGN_TA = ['மேஷ', 'ரிஷப', 'மிது', 'கடக', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மகர', 'கும்ப', 'மீன'];

function BnnLiteratureSection({ report }: { report: ReportData }) {
  const b = (report as any).bnnLiterature;
  const [tab, setTab] = useState<'karakas' | 'natal' | 'Saturn' | 'Jupiter' | 'Rahu' | 'Ketu'>('karakas');
  if (!b?.available) return null;

  const contactCard = (c: any) => (
    <article key={`${c.from}-${c.to}-${c.offset}`} className="border border-line rounded p-3 mb-2 bg-surface">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="font-medium text-ink">{c.fromTa} {tab === 'natal' ? '+' : '→'} {c.toTa}</h4>
        <span className="text-xs text-ink-soft">{c.relation.ta} · {c.gap}°</span>
      </div>
      <p className="text-[11px] text-ink-soft mb-1">
        பிறப்புப் பாவம் {c.natalHouse} · அதிபத்தியம் {c.ownedHouses.join(', ') || '—'}
        {c.dashaLordMatch.length ? ` · ${c.dashaLordMatch.join(' + ')} அதிபதி` : ''}
      </p>
      {c.readings.length === 0 && <p className="text-xs text-ink-soft">இந்தத் தொடர்புக்கு நூல் உரை இல்லை.</p>}
      {c.readings.map((r: any, i: number) => (
        <div key={i} className="text-sm mt-1.5">
          {r.support.ta && <p className="text-emerald-700"><b>வாய்ப்பு / மாற்றம்: </b>{r.support.ta}</p>}
          {r.challenge.ta && <p className="text-rose-700"><b>சவால் / சரிசெய்தல்: </b>{r.challenge.ta}</p>}
          <p className="text-[11px] text-ink-soft">
            {r.basis === 'lord' ? `${r.house}-ஆம் பாவ அதிபதி · ` : r.basis === 'matrix' ? 'நூல் சுருக்கம் · ' : ''}
            {r.source.title} · PDF {r.source.page}
          </p>
          {r.method && <p className="text-[11px] text-ink-soft italic">{r.method.ta}</p>}
        </div>
      ))}
    </article>
  );

  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">பிருகு நந்தி நாடி — இலக்கியம்</h2>
      <div className="flex flex-wrap gap-1 mb-3 text-xs print:hidden">
        {([['karakas', 'காரக இலக்கியம்'], ['natal', 'பிறப்பு இணைவுகள்'], ['Saturn', 'சனி கோச்சாரம்'], ['Jupiter', 'குரு கோச்சாரம்'], ['Rahu', 'ராகு கோச்சாரம்'], ['Ketu', 'கேது கோச்சாரம்']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-2 py-1 rounded ${tab === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>

      {tab === 'karakas' && (
        <div className="space-y-3">
          {Object.entries(b.karakas).map(([id, k]: [string, any]) => (
            <details key={id} className="border border-line rounded p-3 bg-surface">
              <summary className="font-medium text-ink cursor-pointer">{id} <span className="text-xs text-ink-soft">PDF {k.pages.join(', ')}</span></summary>
              <div className="text-sm mt-2 space-y-1.5">
                <p><b className="text-ink-soft">Rao: </b>{k.rao[0]}</p>
                <p><b className="text-ink-soft">Character: </b>{k.gemini[0]}</p>
                <p><b className="text-ink-soft">இணைப்பு: </b>{k.synthesis[0]}</p>
              </div>
            </details>
          ))}
        </div>
      )}

      {tab === 'natal' && (
        b.natalConjunctions.length
          ? b.natalConjunctions.map(contactCard)
          : <p className="text-sm text-ink-soft">இந்த ஜாதகத்தில் ஒரே ராசி கிரக இணைவு இல்லை.</p>
      )}

      {['Saturn', 'Jupiter', 'Rahu', 'Ketu'].includes(tab) && (
        b.transitContacts[tab]?.length
          ? b.transitContacts[tab].map(contactCard)
          : <p className="text-sm text-ink-soft">இன்றைய கோச்சாரத்தில் {tab} தொடர்பு இல்லை.</p>
      )}

      <p className="text-[11px] text-ink-soft mt-3">
        <b>மேலும் மதிப்பிட வேண்டியவை: </b>{b.caveat.ta}
        {' '}முந்தைய kottravel-Nadi nadi-literature.js / transit-insights.js-லிருந்து port.
      </p>
    </div>
  );
}

function BhriguProgressionSection({ report }: { report: ReportData }) {
  const bp = (report as any).bhriguProgressions;
  if (!bp?.available) return null;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">பிருகு சக்கர / சரள பத்ததி</h2>

      <div className="text-sm mb-3">
        <span className="text-ink-soft">நடப்பு வயது ஆண்டு: </span>
        <span className="font-semibold text-saffron">{bp.runningYear}</span>
        <span className="text-ink-soft"> · செயல்படும் BCP பாவம்: </span>
        <span className="font-semibold">{bp.bcpHouse}</span>
        <span className="text-ink-soft"> · சுழற்சி அதிபதி: </span>
        <span>{POINT_LABEL[bp.bcpCycleRuler] ?? bp.bcpCycleRuler ?? '—'}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-ink-soft mb-1">BCP வயது அட்டவணை</p>
          <table className="text-xs w-full max-w-xs">
            <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">ஆண்டு</th><th className="text-left py-1">பாவம்</th><th className="text-left py-1">சுழற்சி</th></tr></thead>
            <tbody>
              {bp.bcpTable.map((r: any) => (
                <tr key={r.year} className={r.current ? 'bg-saffron/10 font-semibold' : ''}>
                  <td className="py-0.5">{r.year}{r.current ? ' ·நடப்பு' : ''}</td>
                  <td className="py-0.5">{r.house}</td>
                  <td className="py-0.5">{POINT_LABEL[r.cycleRuler] ?? r.cycleRuler ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {bp.dashaBcpFocus && (
            <p className="text-xs text-ink-soft mt-2">
              தசை–BCP மையம்: {POINT_LABEL[bp.dashaBcpFocus.mahadashaLord] ?? bp.dashaBcpFocus.mahadashaLord} →
              {' '}{SIGN_TA[bp.dashaBcpFocus.focusSign]} → {POINT_LABEL[bp.dashaBcpFocus.focusSignLord] ?? bp.dashaBcpFocus.focusSignLord}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-ink-soft mb-1">BSP விதிகள் (வயது → பாவம்)</p>
          <table className="text-xs w-full">
            <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">#</th><th className="text-left py-1">கிரகம்</th><th className="text-left py-1">வயது</th><th className="text-left py-1">பாவம் → ராசி</th></tr></thead>
            <tbody>
              {bp.bsp.map((r: any) => (
                <tr key={r.no} className={r.active ? 'bg-saffron/10 font-semibold' : ''}>
                  <td className="py-0.5">{r.no}</td>
                  <td className="py-0.5">{POINT_LABEL[r.planet] ?? r.planet}</td>
                  <td className="py-0.5">{r.age}{r.active ? ' ·நடப்பு' : ''}</td>
                  <td className="py-0.5">{r.house} → {r.targetSign != null ? SIGN_TA[r.targetSign] : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold text-ink-soft mb-1">ஜீவ – சரீரம்</p>
        <table className="text-xs">
          <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1 pr-4">கிரகம்</th><th className="text-left py-1 pr-4">ஜீவம்</th><th className="text-left py-1">சரீரம்</th></tr></thead>
          <tbody>
            {bp.jeeva.map((r: any) => (
              <tr key={r.id}>
                <td className="py-0.5 pr-4">{POINT_LABEL[r.id] ?? r.id}</td>
                <td className="py-0.5 pr-4">{POINT_LABEL[r.jeeva] ?? r.jeeva}</td>
                <td className="py-0.5">{POINT_LABEL[r.sharira] ?? r.sharira}{r.own ? ' (சுய நட்சத்திரம்)' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-ink-soft mt-2">
        BCP: 1 ஆண்டு = 1 பாவம் · BSP: வயது→பாவ செயல்பாட்டு விதிகள் · முந்தைய kottravel-Nadi engine-லிருந்து port.
        ஆய்வு உதவி — தானாக உறுதியான பலன் அல்ல.
      </p>
    </div>
  );
}

function KpSystemSection({ report }: { report: ReportData }) {
  const kp = (report as any).kp;
  const [tab, setTab] = useState<'planets' | 'cusps' | 'sig'>('planets');
  if (!kp?.available) return null;
  const chain = (o: any, levels: string[]) => levels.map((k) => POINT_LABEL[o[k]] ?? o[k]).join(' · ');
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">KP ஜோதிடம் (கிருஷ்ணமூர்த்தி பத்ததி)</h2>

      <div className="text-sm mb-3 space-y-1">
        <div>
          <span className="text-ink-soft">ஆளும் கிரகங்கள் (Ruling Planets): </span>
          {kp.rulingPlanets.factors.map((f: string[], i: number) => (
            <span key={i} className="mr-2">{f[0].replace(/ Lord$/, '')}: <span className="font-medium">{POINT_LABEL[f[1]] ?? f[1]}</span></span>
          ))}
        </div>
        <div>
          <span className="text-ink-soft">தனித்த வரிசை: </span>
          <span className="font-medium text-saffron">{kp.rulingPlanets.unique.map((p: string) => POINT_LABEL[p] ?? p).join(' → ')}</span>
        </div>
        <div className="text-ink-soft">
          பாதக பாவம் ({kp.obstruction.modality}): <span className="text-ink">{kp.obstruction.badhaka}</span> · மாரக: 2, 7
        </div>
      </div>

      <div className="flex gap-1 mb-2 text-xs print:hidden">
        {([['planets', 'கிரகங்கள்'], ['cusps', 'பாவ சந்திகள்'], ['sig', 'சூசகர்கள்']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-2 py-1 rounded ${tab === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>

      <div className="overflow-x-auto">
        {tab === 'planets' && (
          <table className="w-full text-xs">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">கிரகம்</th><th className="text-left py-1">ராசி</th><th className="text-left py-1">நட்சத்திரம்</th><th className="text-center py-1">பாவம்</th>
              <th className="text-left py-1">ராசி·நட்·துணை·துணை²·துணை³</th>
            </tr></thead>
            <tbody>
              {kp.positions.map((p: any) => (
                <tr key={p.name} className="border-b border-line/40">
                  <td className="py-1">{POINT_LABEL[p.name] ?? p.name}{p.retrograde && <span className="text-rose"> ℞</span>}</td>
                  <td className="py-1">{p.sign.slice(0, 3)} {p.degreeInSign.toFixed(2)}°</td>
                  <td className="py-1">{p.nakshatra}-{p.pada}</td>
                  <td className="py-1 text-center">{p.house}</td>
                  <td className="py-1">{chain(p, ['signLord', 'starLord', 'sub', 'subSub', 'subSubSub'])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'cusps' && (
          <table className="w-full text-xs">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">பாவம்</th><th className="text-left py-1">ராசி</th><th className="text-left py-1">நட்சத்திரம்</th>
              <th className="text-left py-1">ராசி·நட்·துணை·துணை²</th>
            </tr></thead>
            <tbody>
              {kp.cusps.map((c: any) => (
                <tr key={c.number} className="border-b border-line/40">
                  <td className="py-1">{c.number}</td>
                  <td className="py-1">{c.sign.slice(0, 3)} {c.degreeInSign.toFixed(2)}°</td>
                  <td className="py-1">{c.nakshatra}</td>
                  <td className="py-1">{chain(c, ['signLord', 'starLord', 'sub', 'subSub'])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === 'sig' && (
          <table className="w-full text-xs">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">கிரகம்</th><th className="text-left py-1">அமர்ந்த</th><th className="text-left py-1">சொந்த</th>
              <th className="text-left py-1">நட்·அமர்</th><th className="text-left py-1">நட்·சொந்த</th><th className="text-left py-1">மொத்தம் (4-fold)</th>
            </tr></thead>
            <tbody>
              {kp.significators.map((s: any) => (
                <tr key={s.name} className="border-b border-line/40">
                  <td className="py-1">{POINT_LABEL[s.name] ?? s.name}</td>
                  <td className="py-1">{s.occupied ?? '—'}</td>
                  <td className="py-1">{s.owned.join(',') || '—'}</td>
                  <td className="py-1">{s.starOccupied ?? '—'}</td>
                  <td className="py-1">{s.starOwned.join(',') || '—'}</td>
                  <td className="py-1 font-medium">{s.total.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-[11px] text-ink-soft mt-2">
        கிருஷ்ணமூர்த்தி அயனாம்சம் + Placidus பாவ சந்திகள் (report அமைப்பைப் பொருட்படுத்தாமல்) · விம்சோத்தரி விகிதத்தில் நட்சத்திர உட்பிரிவு.
        முந்தைய kp-muhurat engine-லிருந்து port.
      </p>
    </div>
  );
}

function AltDashaSection({ report }: { report: ReportData }) {
  const alt = (report as any).altDashas;
  const [sys, setSys] = useState<'yogini' | 'ashtottari'>('yogini');
  if (!alt) return null;
  const data = alt[sys];
  const nowMs = Date.now();
  const curIdx = data.periods.findIndex((p: any) => p.startMs <= nowMs && nowMs < p.endMs);
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">மாற்று தசைகள்</h2>
      <div className="flex gap-1 mb-3 text-xs print:hidden">
        {([['yogini', 'யோகினி (36)'], ['ashtottari', 'அஷ்டோத்தரி (108)']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setSys(k)}
            className={`px-2 py-1 rounded ${sys === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-ink-soft border-b border-line">
          <th className="text-left py-1">{sys === 'yogini' ? 'யோகினி' : ''}</th>
          <th className="text-left py-1">அதிபதி</th>
          <th className="text-right py-1">ஆண்டு</th>
          <th className="text-left py-1 pl-4">காலம்</th>
          <th className="text-left py-1 pl-3">நடப்பு உட்பிரிவு</th>
        </tr></thead>
        <tbody>
          {data.periods.slice(0, sys === 'yogini' ? 12 : 8).map((p: any, i: number) => {
            const isCur = i === curIdx;
            const curSub = isCur ? p.subs.find((s: any) => s.startMs <= nowMs && nowMs < s.endMs) : null;
            return (
              <tr key={i} className={`border-b border-line/40 ${isCur ? 'bg-saffron/10 font-semibold' : ''}`}>
                <td className="py-1">{sys === 'yogini' ? p.yoginiTa : '—'}</td>
                <td className="py-1">{POINT_LABEL[p.lord] ?? p.lord}</td>
                <td className="py-1 text-right tabular-nums">{p.years}</td>
                <td className="py-1 pl-4 text-ink-soft">{p.start} → {p.end}</td>
                <td className="py-1 pl-3 text-ink-soft">
                  {curSub ? `${sys === 'yogini' ? curSub.yoginiTa + ' / ' : ''}${POINT_LABEL[curSub.lord] ?? curSub.lord} (${curSub.start}→${curSub.end})` : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sys === 'ashtottari' && <p className="text-[11px] text-ink-soft mt-2">{data.note}</p>}
      <p className="text-[11px] text-ink-soft mt-1">முந்தைய AstrologicLab engine-லிருந்து port · 365.25-நாள் ஆண்டு.</p>
    </div>
  );
}

function KalachakraDashaSection({ report }: { report: ReportData }) {
  const k = (report as any).kalachakraDasha;
  const [open, setOpen] = useState<number | null>(null);
  if (!k?.available) return null;
  const nowMs = Date.now();
  const curIdx = k.mahas.findIndex((m: any) => m.startMs <= nowMs && nowMs < m.endMs);
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">காலச்சக்கர தசை</h2>
      <p className="text-sm text-ink-soft mb-3">
        ஜன்ம நட்சத்திரம் <span className="text-ink font-medium">{k.nakshatra}</span> பாதம் {k.pada}
        {' · '}{k.roleTa} · <span className="text-ink font-medium">{k.directionTa}</span>
        {' · தொடக்க ராசி '}<span className="text-ink font-medium">{k.startRasi}</span>
        {' · மொத்தம் '}{k.totalYears} ஆண்டுகள்
      </p>
      <table className="w-full text-sm">
        <thead><tr className="text-ink-soft border-b border-line">
          <th className="text-left py-1">ராசி</th><th className="text-left py-1">அதிபதி</th>
          <th className="text-right py-1">ஆண்டு</th><th className="text-left py-1 pl-4">காலம்</th>
          <th className="text-left py-1 pl-3">உடல் / உயிர் ராசி</th>
        </tr></thead>
        <tbody>
          {k.mahas.map((m: any, i: number) => (
            <Fragment key={i}>
              <tr
                className={`border-b border-line/40 cursor-pointer hover:bg-surface-soft/50 ${i === curIdx ? 'bg-saffron/10 font-semibold' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <td className="py-1">{open === i ? '▾' : '▸'} {m.rasi}</td>
                <td className="py-1">{m.lordTa}</td>
                <td className="py-1 text-right tabular-nums">{m.years}</td>
                <td className="py-1 pl-4 text-ink-soft">{m.start} → {m.end}</td>
                <td className="py-1 pl-3 text-ink-soft">{m.dehaRasi} / {m.jeevaRasi}</td>
              </tr>
              {open === i && (
                <tr>
                  <td colSpan={5} className="bg-surface-soft/30 px-3 py-2">
                    <table className="w-full text-xs">
                      <thead><tr className="text-ink-soft border-b border-line/50">
                        <th className="text-left py-1">Bhukti ராசி</th><th className="text-left py-1">அதிபதி</th>
                        <th className="text-right py-1">ஆண்டு</th><th className="text-left py-1 pl-4">காலம்</th>
                      </tr></thead>
                      <tbody>
                        {m.Bhukti.map((b: any, j: number) => {
                          const isCurB = i === curIdx && b.startMs <= nowMs && nowMs < b.endMs;
                          return (
                            <tr key={j} className={`border-b border-line/20 ${isCurB ? 'bg-saffron/20 font-semibold' : ''}`}>
                              <td className="py-0.5">{b.rasi}</td>
                              <td className="py-0.5">{b.lordTa}</td>
                              <td className="py-0.5 text-right tabular-nums">{b.years}</td>
                              <td className="py-0.5 pl-4 text-ink-soft">{b.start} → {b.end}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <p className="text-[11px] text-ink-soft mt-2">
        {k.source}. நட்சத்திரம் சவ்ய(வலவோட்டு)/அபசவ்யம்(இடவோட்டு) என வகைப்படும்; 108-பாத அட்டவணை வழி தொடக்க ராசி + திசை நிர்ணயிக்கப்படும்.
        Bhukti (உட்பிரிவு) நடை மூல நூலின் 8 சவ்ய மகா-தசைகளுக்கு (மேஷம்-விருச்சிகம்) நேரடியாக எழுதப்பட்டது; மீதமுள்ள 4
        (தனுசு/மகரம்/கும்பம்/மீனம்) அதே பட்டியலை நேரடியாக மீள்பயன்படுத்துகின்றன (மூலநூல் கூற்றுப்படி); அபசவ்ய நடை ஒவ்வொரு
        ராசியின் சவ்ய நடையின் துல்லிய தலைகீழ் வரிசை. அந்தரம் (3rd level) இன்னும் கணக்கிடப்படவில்லை.
      </p>
    </div>
  );
}

const KP_GRADE_STYLE: Record<string, string> = {
  DARK_GREEN: 'bg-teal text-white', GREEN: 'bg-teal-soft text-teal',
  RED: 'bg-rose-soft text-rose', REVIEW: 'bg-surface-soft text-ink-soft',
};

function KpEventsSection({ report }: { report: ReportData }) {
  const ke = (report as any).kpEvents;
  const [filter, setFilter] = useState<'all' | 'GREEN' | 'RED'>('all');
  const [open, setOpen] = useState<string | null>(null);
  if (!ke?.available) return null;
  const list = ke.events.filter((e: any) =>
    filter === 'all' ? true : filter === 'GREEN' ? (e.grade.code === 'GREEN' || e.grade.code === 'DARK_GREEN') : e.grade.code === 'RED');
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">KP முகூர்த்தம் — நிகழ்வுப் பொருத்தம்</h2>
      <div className="flex gap-1 mb-3 text-xs print:hidden">
        {([['all', `அனைத்து (${ke.count})`], ['GREEN', 'ஏற்றவை'], ['RED', 'தவிர்க்க']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-2 py-1 rounded ${filter === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>
      <div className="max-h-[28rem] overflow-y-auto border border-line rounded-lg divide-y divide-line/50">
        {list.map((e: any) => (
          <div key={e.key}>
            <button onClick={() => setOpen(open === e.key ? null : e.key)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-surface-soft/50">
              <span className="flex-1">{e.nameTa || e.name}</span>
              <span className="text-xs text-ink-soft tabular-nums">{e.grade.passed}/{e.grade.total}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${KP_GRADE_STYLE[e.grade.code]}`}>{e.grade.labelTa}</span>
            </button>
            {open === e.key && (
              <div className="px-3 pb-2 text-xs bg-surface-soft/30">
                {e.remarks && <p className="text-ink-soft italic mb-1">{e.remarks}</p>}
                <table className="w-full">
                  <tbody>
                    {e.rows.map((r: any, i: number) => (
                      <tr key={i} className="border-b border-line/30">
                        <td className="py-0.5 pr-2">{r.target}</td>
                        <td className="py-0.5 pr-2">{POINT_LABEL[r.subLord] ?? r.subLord}</td>
                        <td className="py-0.5 pr-2 text-ink-soft">→ {r.significators.join(',') || '—'}</td>
                        <td className="py-0.5 pr-2 text-ink-soft">✓{r.favorable.join(',') || '–'} ✗{r.unfavorable.join(',') || '–'}</td>
                        <td className={`py-0.5 ${r.color === 'red' ? 'text-rose' : 'text-teal'}`}>{r.resultCode} {r.statusTa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!!e.specialConditions?.length && (
                  <div className="mt-2">
                    <p className="text-ink-soft font-semibold mb-1">சிறப்பு நிபந்தனைகள் (special conditions)</p>
                    <table className="w-full">
                      <tbody>
                        {e.specialConditions.map((s: any, i: number) => (
                          <tr key={i} className="border-b border-line/30">
                            <td className="py-0.5 pr-2 w-24">{s.object}</td>
                            <td className="py-0.5 pr-2 text-ink-soft">{s.condition}</td>
                            <td className={`py-0.5 whitespace-nowrap ${s.color === 'red' ? 'text-rose' : s.color === 'amber' ? 'text-amber-600' : 'text-teal'}`}>
                              {s.code} {s.labelTa}{s.affectsResult ? ' *' : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[10px] text-ink-soft mt-0.5">* = கட்டாயம் (grade-ஐ பாதிக்கிறது); மற்றவை ஆலோசனை மட்டும்.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-ink-soft mt-2">
        80-நிகழ்வு KP legacy catalog · பாவ சந்தி துணை-அதிபதி (rules 1-12) + ஜனன DBAS (101-104) சூசகங்கள் vs சாதக/பாதக பாவங்கள்
        + நிகழ்வு-சார் சிறப்பு நிபந்தனைகள் (grade-ஐ பாதிக்கும் கட்டாய நிபந்தனைகள் உட்பட). நேரம்-scan (sub-lord transition search):
        Tools → KP Muhurta Time Scan. (kp-muhurat engine port)
      </p>
    </div>
  );
}

function NakshatraExtrasSection({ report }: { report: ReportData }) {
  const n = (report as any).nakshatraExtras;
  if (!n?.available) return null;
  const sh = n.shashtiamsa || {};
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">நட்சத்திரக் கூறுகள்</h2>
      <div className="text-sm mb-3 space-y-1">
        <div>ஜன்ம நட்சத்திரம்: <span className="font-medium">{n.janmaNakshatra}</span> — பாதம் {n.janmaPada}</div>
        <div>பெயர் எழுத்து (name syllable): <span className="font-medium text-saffron">{n.nameSyllable}</span>
          <span className="text-ink-soft"> · 4 பாத எழுத்துகள்: {n.nakshatraSyllables.join(' · ')}</span></div>
        {n.todayTaraBala && (
          <div>இன்று ({n.todayNakshatra}) தாரா பலம்: <span className={n.todayTaraBala.favorable ? 'text-teal font-medium' : 'text-rose font-medium'}>
            {n.todayTaraBala.nameTa}</span> <span className="text-ink-soft">(#{n.todayTaraBala.distance})</span></div>
        )}
      </div>
      <p className="text-xs font-semibold text-ink-soft mb-1">ஷஷ்டியம்சம் (D60) அதிதேவதை</p>
      <table className="w-full text-sm max-w-md">
        <tbody>
          {Object.entries(sh).map(([id, d]: [string, any]) => (
            <tr key={id} className="border-b border-line/40">
              <td className="py-1">{POINT_LABEL[id] ?? id}</td>
              <td className="py-1">#{d.number} {d.nameTa}</td>
              <td className={`py-1 text-xs ${d.benefic ? 'text-teal' : 'text-rose'}`}>{d.benefic ? 'சுபம்' : 'பாபம்'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {(report as any).nakshatraExtras?.nadiamsa && (
        <>
          <p className="text-xs font-semibold text-ink-soft mb-1 mt-4">நாடியம்சம் (Deva Keralam 150/ராசி · 1800 மொத்தம்)</p>
          <table className="w-full text-xs max-w-lg">
            <thead><tr className="text-ink-soft border-b border-line">
              <th className="text-left py-1">கிரகம்</th><th className="text-right py-1">பகுதி</th>
              <th className="text-left py-1">பெயர்</th><th className="text-left py-1">கலா</th>
            </tr></thead>
            <tbody>
              {Object.entries((report as any).nakshatraExtras.nadiamsa).map(([id, n]: [string, any]) => (
                <tr key={id} className="border-b border-line/40">
                  <td className="py-1">{POINT_LABEL[id] ?? id}</td>
                  <td className="py-1 text-right tabular-nums">{n.nameIndex}/150</td>
                  <td className="py-1">{n.name ?? <span className="text-ink-soft/50">—</span>}</td>
                  <td className="py-1 text-ink-soft">{n.kala}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <p className="text-[11px] text-ink-soft mt-2">
        தாரா பலம் 9-மடங்கு · 108-பாத பெயர் எழுத்து · D60 அதிதேவதை (BPHS ச.6 v.32) · நாடியம்சம் (Deva Keralam) — முந்தைய AstrologicLab-லிருந்து port.
        நாடியம்ச பெயர்கள் OCR-ல் தெளிவானவை மட்டுமே; மற்றவை "—".
      </p>
    </div>
  );
}

function AvasthaSection({ report }: { report: ReportData }) {
  const a = (report as any).avasthas;
  if (!a?.available) return null;
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">கிரக அவஸ்தைகள்</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-ink-soft border-b border-line">
            <th className="text-left py-1">கிரகம்</th><th className="text-left py-1">ஜாக்ரதாதி</th>
            <th className="text-left py-1">பாலாதி</th><th className="text-left py-1">தீப்தாதி</th>
            {a.hasFullSet && <><th className="text-left py-1">சயனாதி</th><th className="text-left py-1">லஜ்ஜிதாதி</th></>}
          </tr></thead>
          <tbody>
            {a.rows.map((r: any) => (
              <tr key={r.planet} className="border-b border-line/40">
                <td className="py-1.5">{POINT_LABEL[r.planet] ?? r.planet}</td>
                <td className="py-1.5">{r.jagradadi}</td>
                <td className="py-1.5">{r.baladi}</td>
                <td className="py-1.5">{r.deeptadi}</td>
                {a.hasFullSet && <><td className="py-1.5">{r.shayanadi}</td><td className="py-1.5">{r.lajjitadi}</td></>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-ink-soft mt-2">
        5 அவஸ்தை முறை (ஜாக்ரதாதி 3 · பாலாதி 5 · தீப்தாதி 9 · சயனாதி 12 · லஜ்ஜிதாதி 6).
        சயனாதி = (S·P·c)+(A+G+R) mod 12; லஜ்ஜிதாதி = வெளிப்படுத்தப்பட்ட synthesis (இணைப்பு/திருஷ்டி/நிலை).
        முந்தைய AstrologicLab avasthas engine-லிருந்து port.
      </p>
    </div>
  );
}

function JaiminiSection({ report }: { report: ReportData }) {
  const j = (report as any).jaimini;
  const [tab, setTab] = useState<'karakas' | 'arudha' | 'chara' | 'rasi' | 'drishti' | 'lagnas'>('karakas');
  const [rasiSys, setRasiSys] = useState<string>('sthira');
  if (!j?.available) return null;
  const nowMs = Date.now();
  const curD = j.charaDasha.periods.findIndex((p: any) => p.startMs <= nowMs && nowMs < p.endMs);
  const RASI_DASHA_LABEL: Record<string, string> = {
    sthira: 'ஸ்திர', shoola: 'சூல (நிர்யாண)', kendradi: 'கேந்திராதி', manduka: 'மண்டூக',
    trikona: 'திரிகோண', brahma: 'பிரம்ம', karaka: 'காரக', yogardha: 'யோகார்த்த', navamsa: 'நவாம்ச',
    varnada: 'வர்னாட்',
  };
  const rd = j.rasiDashas?.[rasiSys];
  return (
    <div className="mb-8">
      <h2 className="font-[family-name:var(--font-tamil-serif)] text-xl font-semibold mb-3 text-ink">ஜைமினி ஜோதிடம்</h2>
      <div className="flex gap-1 mb-3 text-xs print:hidden">
        {([['karakas', 'சர காரகர்'], ['arudha', 'ஆருடம் A1-A12'], ['lagnas', '18 விசேஷ லக்னம்'], ['chara', 'சர (நாராயண) தசை'], ['rasi', 'மற்ற ராசி தசைகள்'], ['drishti', 'ராசி திருஷ்டி']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-2 py-1 rounded ${tab === k ? 'bg-saffron text-ink' : 'bg-surface border border-line text-ink-soft'}`}>{l}</button>
        ))}
      </div>

      {tab === 'rasi' && j.rasiDashas && (
        <>
          <select value={rasiSys} onChange={(e) => setRasiSys(e.target.value)}
            className="px-2 py-1 mb-2 bg-surface border border-line rounded text-ink text-xs">
            {Object.keys(RASI_DASHA_LABEL).map((k) => <option key={k} value={k}>{RASI_DASHA_LABEL[k]}</option>)}
          </select>
          {rd && (
            <>
              <p className="text-xs text-ink-soft mb-2">
                திசை: {rd.direction === 'direct' ? 'நேர்' : 'எதிர்'}
                {rd.startRasi && ` · தொடக்கம் ${RASI_SHORT[rd.startRasi] ?? rd.startRasi}`}
                {rd.brahmaRasi && ` · பிரம்ம ${RASI_SHORT[rd.brahmaRasi] ?? rd.brahmaRasi}`}
                {rd.atmakaraka && ` · ஆத்மகாரகன் ${POINT_LABEL[rd.atmakaraka] ?? rd.atmakaraka}`}
              </p>
              <table className="text-sm w-full max-w-lg">
                <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">ராசி</th><th className="text-right py-1">ஆண்டு</th><th className="text-left py-1 pl-4">காலம்</th></tr></thead>
                <tbody>
                  {rd.periods.map((d: any, i: number) => {
                    const cur = d.startMs <= nowMs && nowMs < d.endMs;
                    return (
                      <tr key={i} className={`border-b border-line/40 ${cur ? 'bg-saffron/10 font-semibold' : ''}`}>
                        <td className="py-1">{RASI_SHORT[d.rasi] ?? d.rasi}{cur ? ' ·நடப்பு' : ''}</td>
                        <td className="py-1 text-right tabular-nums">{d.years}</td>
                        <td className="py-1 pl-4 text-ink-soft">{d.start} → {d.end}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      {tab === 'karakas' && (
        <div className="grid md:grid-cols-2 gap-6">
          <table className="text-sm w-full">
            <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">சர காரகன்</th><th className="text-left py-1">கிரகம்</th><th className="text-right py-1">பாகை</th></tr></thead>
            <tbody>
              {j.charaKarakas.map((k: any) => (
                <tr key={k.role} className="border-b border-line/40">
                  <td className="py-1">{k.roleTa}</td>
                  <td className="py-1">{POINT_LABEL[k.planet] ?? k.planet}</td>
                  <td className="py-1 text-right tabular-nums">{k.degreeInSign}°</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-sm">
            <p className="text-ink-soft mb-1">கார்காம்சம் (Karkamsha)</p>
            <p>ஆத்மகாரகன் <span className="font-medium">{POINT_LABEL[j.karkamsha.atmakaraka] ?? j.karkamsha.atmakaraka}</span> → நவாம்சம் <span className="font-medium">{RASI_SHORT[j.karkamsha.rasi] ?? j.karkamsha.rasi}</span></p>
            <p className="mt-1">இஷ்ட தேவதை: <span className="text-saffron">{j.karkamsha.ishtaDevata.devata}</span> ({POINT_LABEL[j.karkamsha.ishtaDevata.planet] ?? j.karkamsha.ishtaDevata.planet})</p>
            <p>தர்ம தேவதை: <span className="text-saffron">{j.karkamsha.dharmaDevata.devata}</span> ({POINT_LABEL[j.karkamsha.dharmaDevata.planet] ?? j.karkamsha.dharmaDevata.planet})</p>
          </div>
        </div>
      )}

      {tab === 'arudha' && (
        <table className="text-sm w-full max-w-md">
          <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">பதம்</th><th className="text-left py-1">ராசி</th></tr></thead>
          <tbody>
            {j.bhavaArudhas.map((a: any) => (
              <tr key={a.label} className="border-b border-line/40">
                <td className="py-1">{a.label}</td>
                <td className="py-1">{RASI_SHORT[a.rasi] ?? a.rasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'chara' && (
        <>
          <p className="text-xs text-ink-soft mb-2">திசை: {j.charaDasha.direction === 'direct' ? 'நேர்' : 'எதிர்'}</p>
          <table className="text-sm w-full">
            <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">ராசி</th><th className="text-right py-1">ஆண்டு</th><th className="text-left py-1 pl-4">காலம்</th></tr></thead>
            <tbody>
              {j.charaDasha.periods.map((d: any, i: number) => (
                <tr key={i} className={`border-b border-line/40 ${i === curD ? 'bg-saffron/10 font-semibold' : ''}`}>
                  <td className="py-1">{RASI_SHORT[d.rasi] ?? d.rasi}{i === curD ? ' ·நடப்பு' : ''}</td>
                  <td className="py-1 text-right tabular-nums">{d.years}</td>
                  <td className="py-1 pl-4 text-ink-soft">{d.start} → {d.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'lagnas' && (
        j.specialLagnas ? (
          <table className="text-sm w-full max-w-2xl">
            <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">#</th><th className="text-left py-1">லக்னம்</th><th className="text-left py-1">ராசி</th><th className="text-left py-1">பொருள்</th></tr></thead>
            <tbody>
              {j.specialLagnas.map((l: any) => (
                <tr key={l.key} className="border-b border-line/40">
                  <td className="py-1 text-ink-soft tabular-nums">{l.number}</td>
                  <td className="py-1">{l.name}</td>
                  <td className="py-1 font-medium">{RASI_SHORT[l.rasi] ?? l.rasi}</td>
                  <td className="py-1 text-ink-soft text-xs">{l.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-ink-soft">சூரிய உதய நேரத் தரவு இல்லாததால் கணக்கிட முடியவில்லை.</p>
      )}

      {tab === 'drishti' && (
        <table className="text-sm w-full">
          <thead><tr className="text-ink-soft border-b border-line"><th className="text-left py-1">ராசி</th><th className="text-left py-1">வகை</th><th className="text-left py-1">பார்க்கும் ராசிகள்</th></tr></thead>
          <tbody>
            {j.rashiDrishti.map((r: any) => (
              <tr key={r.rasiIndex} className="border-b border-line/40">
                <td className="py-1">{RASI_SHORT[r.rasi] ?? r.rasi}</td>
                <td className="py-1 text-ink-soft">{r.type}</td>
                <td className="py-1">{r.aspects.map((a: string) => RASI_SHORT[a] ?? a).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-[11px] text-ink-soft mt-2">
        சர காரகன் = ராசிக்குள் அதிக பாகை வரிசை · ஆருட பதம் 1st/7th விதிவிலக்குடன் · சர தசை: ஒற்றை/இரட்டை லக்னம் → நேர்/எதிர் திசை.
        முந்தைய AstrologicLab jaimuni engine-லிருந்து port.
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
  ashtakavargaDetail: DetailedAshtakavargaSection,
  ashtakavargaShodhana: AshtakavargaShodhanaSection,
  transit: TransitSection,
  gocharaPhala: GocharaPhalaSection,
  grahaBala: GrahaBalaSection,
  bhavaBala: BhavaBalaSection,
  shodasaBala: ShodasaBalaSection,
  nabhasaYoga: NabhasaYogaSection,
  karaka: KarakaSection,
  ayurdaya: AyurdayaSection,
  jaimini: JaiminiSection,
  avasthas: AvasthaSection,
  nakshatraExtras: NakshatraExtrasSection,
  upagraha: UpagrahaSection,
  numerology: NumerologySection,
  nadi: NadiCombinationSection,
  bnnLiterature: BnnLiteratureSection,
  bhriguProgressions: BhriguProgressionSection,
  kp: KpSystemSection,
  kpEvents: KpEventsSection,
  altDashas: AltDashaSection,
  kalachakraDasha: KalachakraDashaSection,
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
  const { settings } = useSettings();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, true])),
  );
  const [order, setOrder] = useState<string[]>(SECTIONS.map((s) => s.id));
  const [selectedChartId, setSelectedChartId] = useState<string>('D1-rasi');
  const [initialChartCategory, setInitialChartCategory] = useState<ChartCategory | undefined>(undefined);
  const [loadedBirthData, setLoadedBirthData] = useState<Partial<BirthData> | null>(null);
  const [reportLayout, setReportLayout] = useState<'single' | 'two' | 'three'>('single');

  // Windows menu (Cascade / Tile Horizontally / Tile Vertically) sets this via a
  // localStorage flag + a custom event; apply it to the analysis-section grid.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kotravel_report_layout');
      if (saved === 'single' || saved === 'two' || saved === 'three') setReportLayout(saved);
    } catch { /* ignore */ }
    const onLayout = (e: Event) => {
      const mode = (e as CustomEvent).detail;
      if (mode === 'single' || mode === 'two' || mode === 'three') setReportLayout(mode);
    };
    window.addEventListener('kotravel:report-layout', onLayout);
    return () => window.removeEventListener('kotravel:report-layout', onLayout);
  }, []);

  // Deep-link support: /report?chart=<chartId> jumps straight to that chart's
  // category and pre-selects it once a report is available (menu bar navigation).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chartParam = params.get('chart');
    if (chartParam) {
      const match = getChartById(chartParam);
      if (match) {
        setSelectedChartId(match.id);
        setInitialChartCategory(match.category);
      }
    }
  }, []);

  // Deep-link support: /report?section=<sectionId> scrolls to that section of the
  // generated report (Reports menu navigation). Waits until the report renders.
  useEffect(() => {
    if (!report) return;
    const sectionParam = new URLSearchParams(window.location.search).get('section');
    if (!sectionParam) return;
    const el = document.getElementById(`section-${sectionParam}`);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [report]);

  // /report?print=1 without ?load: pull the working chart from the stash so
  // File → Print from another page still has something to print.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') !== '1' || params.get('load')) return;
    try {
      const stash = JSON.parse(localStorage.getItem('kotravel_current_chart') || 'null');
      if (stash?.birthData?.dateOfBirth) {
        setLoadedBirthData(stash.birthData);
        handleFormSubmit(stash.birthData);
      }
    } catch { /* no stash */ }
  }, []);

  // /report?print=1: once the report has rendered, fire the print dialog once.
  const printedRef = useRef(false);
  useEffect(() => {
    if (!report || printedRef.current) return;
    if (new URLSearchParams(window.location.search).get('print') !== '1') return;
    printedRef.current = true;
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, [report]);

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

  const handleFormSubmit = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);
    try {
      const formInput: BirthFormInput = {
        name: birthData.name,
        gender: birthData.gender,
        year: parseInt(birthData.dateOfBirth.split('-')[0]),
        month: parseInt(birthData.dateOfBirth.split('-')[1]),
        day: parseInt(birthData.dateOfBirth.split('-')[2]),
        hour: parseInt(birthData.timeOfBirth.split(':')[0]),
        minute: parseInt(birthData.timeOfBirth.split(':')[1]),
        placeName: birthData.place,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        utcOffsetMinutes: birthData.utcOffset,
        ianaTimeZone: 'Asia/Kolkata',
        ayanamsha: AYANAMSHA_MAP[settings.ayanamsha] ?? 'Lahiri',
        houseSystem: HOUSE_SYSTEM_MAP[settings.houseSystem] ?? 'Porphyrius',
        nodeType: settings.nodeType === 'true' ? 'true' : 'mean',
      };
      const result = await computeReport(formInput);
      setReport(result);
      // Bridge for the global menu bar (File > Save / Export, Edit > Notes / Events).
      // Preserve notes/events/libraryId when the same person's chart is recalculated.
      try {
        let prior: any = null;
        try { prior = JSON.parse(localStorage.getItem('kotravel_current_chart') || 'null'); } catch { /* ignore */ }
        const samePerson = prior?.birthData
          && prior.birthData.dateOfBirth === birthData.dateOfBirth
          && prior.birthData.timeOfBirth === birthData.timeOfBirth
          && (prior.birthData.name || '') === (birthData.name || '');
        localStorage.setItem('kotravel_current_chart', JSON.stringify({
          birthData,
          selectedChartId,
          savedAt: Date.now(),
          notes: samePerson ? prior.notes : undefined,
          events: samePerson ? prior.events : undefined,
          libraryId: samePerson ? prior.libraryId : undefined,
        }));
      } catch { /* storage unavailable — non-fatal */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Deep-link: /report?load=<chartId> pulls a saved chart from the library
  // (File → Open / Recent Charts), fills the form and calculates it.
  useEffect(() => {
    const loadId = new URLSearchParams(window.location.search).get('load');
    if (!loadId) return;
    const saved = getChartLibrary().getChart(loadId);
    if (!saved) {
      setError('That saved chart could not be found — it may have been deleted.');
      return;
    }
    const bd: BirthData = {
      name: saved.birthData.name || '',
      fatherName: '',
      motherName: '',
      gender: (saved.birthData as any).gender || 'male',
      dateOfBirth: saved.birthData.dateOfBirth,
      timeOfBirth: saved.birthData.timeOfBirth,
      place: saved.birthData.place,
      latitude: saved.birthData.latitude,
      longitude: saved.birthData.longitude,
      utcOffset: saved.birthData.utcOffset,
    };
    setLoadedBirthData(bd);
    if (saved.chartTypes?.[0]) {
      const match = getChartById(saved.chartTypes[0]);
      if (match) {
        setSelectedChartId(match.id);
        setInitialChartCategory(match.category);
      }
    }
    // Seed the working-chart stash with this chart's saved notes/events so
    // Edit → Notes / Events show them (handleFormSubmit will preserve them).
    try {
      localStorage.setItem('kotravel_current_chart', JSON.stringify({
        birthData: bd, selectedChartId: saved.chartTypes?.[0] ?? 'D1-rasi',
        savedAt: Date.now(), notes: saved.notes, events: saved.events, libraryId: saved.id,
      }));
    } catch { /* non-fatal */ }
    handleFormSubmit(bd);
  }, []);

  return (
    <main className="min-h-screen">
      <header className="bg-gradient-to-br from-indigo-soft via-bg to-saffron-soft px-6 py-8 border-b border-line print:hidden">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">S12 · Report Builder</p>
          <h1 className="font-[family-name:var(--font-tamil-serif)] text-3xl font-bold text-ink">ஜாதக அறிக்கை உருவாக்கி</h1>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-8 print:hidden">
        <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
          <BirthDataForm onSubmit={handleFormSubmit} isLoading={loading} initialData={loadedBirthData} />
        </div>
        {error && <p className="text-rose text-sm mb-4">⚠️ பிழை: {error}</p>}

      </section>

      {report && (
        <>
          {/* Chart Type Selector */}
          <section className="max-w-4xl mx-auto px-6 py-8 print:hidden">
            <div className="bg-surface border border-line rounded-2xl p-6">
              <h2 className="font-[family-name:var(--font-tamil-serif)] text-2xl font-bold mb-6 text-ink">
                ⭐ அட்டவணைகளைத் தேர்ந்தெடுக்கவும் (Select Chart Type)
              </h2>
              <ChartTypeSelector
                selectedChartId={selectedChartId}
                onChartSelect={setSelectedChartId}
                initialCategory={initialChartCategory}
              />
            </div>
          </section>

          {/* Chart Display */}
          <section className="max-w-4xl mx-auto px-6 py-8 print:hidden">
            <ChartDisplay chartId={selectedChartId} report={report} />
          </section>

          {/* Report Analysis Sections */}
          <section className={`${reportLayout === 'single' ? 'max-w-3xl' : reportLayout === 'two' ? 'max-w-6xl' : 'max-w-7xl'} mx-auto px-6 py-8`}>
            <div className="bg-surface border border-line rounded-2xl p-5 mb-6">
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
            <div
              className={
                reportLayout === 'single'
                  ? ''
                  : reportLayout === 'two'
                    ? 'grid gap-6 md:grid-cols-2 items-start'
                    : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start'
              }
            >
              {order.filter((id) => enabled[id]).map((id) => {
                const Renderer = SECTION_RENDERERS[id];
                return (
                  <div key={id} id={`section-${id}`} className="scroll-mt-4">
                    <Renderer report={report} />
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
