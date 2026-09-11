'use client';

import { SouthIndianChart } from '../kattam/SouthIndianChart';
import { fromVargas, GRAHA_TA_FULL } from '../kattam/rasiNames';

interface VargaChakraRendererProps {
  report: any;
}

// The full BPHS Shodasavarga (16 divisions) — D9 significance folded in here
// too (its own dedicated page is Charts → Navamsha D9).
const VARGAS = [
  { key: 'D1', tamil: 'ராசி', significance: 'Birth Chart' },
  { key: 'D2', tamil: 'ஹோரா', significance: 'Wealth' },
  { key: 'D3', tamil: 'த்ரேக்காண', significance: 'Siblings' },
  { key: 'D4', tamil: 'சதுர்த்தாம்ச', significance: 'Property' },
  { key: 'D7', tamil: 'சப்தாம்ச', significance: 'Children' },
  { key: 'D9', tamil: 'நவாம்ச', significance: 'Marriage' },
  { key: 'D10', tamil: 'தசாம்ச', significance: 'Career' },
  { key: 'D12', tamil: 'த்வாதசாம்ச', significance: 'Parents' },
  { key: 'D16', tamil: 'ஷோடசாம்ச', significance: 'Vehicles' },
  { key: 'D20', tamil: 'விம்சாம்ச', significance: 'Spiritual' },
  { key: 'D24', tamil: 'சதுர்விம்சாம்ச', significance: 'Education' },
  { key: 'D27', tamil: 'சப்தவிம்சாம்ச', significance: 'Strength' },
  { key: 'D30', tamil: 'திரிம்சாம்ச', significance: 'Misfortune' },
  { key: 'D40', tamil: 'கவேதாம்ச', significance: 'Maternal legacy' },
  { key: 'D45', tamil: 'அக்ஷவேதாம்ச', significance: 'Paternal legacy' },
  { key: 'D60', tamil: 'ஷஷ்டியாம்ச', significance: 'Past karma' },
];

export function VargaChakraRenderer({ report }: VargaChakraRendererProps) {
  const lagnaHora = report.vargas?.Lagna?.D2?.lord;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-soft/30 to-purple-soft/30 rounded-lg p-6 border-l-4 border-indigo">
        <h3 className="text-xl font-bold text-ink mb-2">வர்க்க சக்கரம் (Varga Chakra — 16 Divisional Charts)</h3>
        <p className="text-sm text-ink-soft">
          BPHS-ன் முழு ஷோடசவர்க்கம் (16 வகுப்புகள்) — ஒவ்வொன்றும் ஒரு உண்மையான தென்னிந்திய கட்டமாக, D1-ன் அதே
          கிரக தரவிலிருந்து ஈவு-பிரிவு வழி கணக்கிடப்பட்டது (BPHS Ch.6 vv.1-41).
        </p>
      </div>

      {/* 16 real mini chart boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {VARGAS.map((v) => {
          if (v.key === 'D2') {
            return (
              <div key="D2" className="bg-surface-soft rounded-lg p-4 border border-line flex flex-col items-center justify-center text-center">
                <div className="font-bold text-ink">D2 · {v.tamil}</div>
                <div className="text-xs text-ink-soft mb-2">{v.significance}</div>
                <p className="text-xs text-ink-soft">
                  ராசி இல்லை — சூரிய/சந்திர ஹோரை அதிபதி மட்டும் (BPHS 6.5-6)
                </p>
                <div className="text-sm text-indigo font-semibold mt-1">
                  லக்னம்: {lagnaHora === 'Sun' ? 'சூரிய ஹோரை' : lagnaHora === 'Moon' ? 'சந்திர ஹோரை' : '—'}
                </div>
              </div>
            );
          }
          const box = fromVargas(report.vargas, v.key);
          if (!box) return null;
          return (
            <div key={v.key} className="bg-surface-soft rounded-lg p-3 border border-line flex flex-col items-center">
              <div className="text-sm font-bold text-ink">{v.key} · {v.tamil}</div>
              <div className="text-xs text-ink-soft mb-2">{v.significance}</div>
              <SouthIndianChart lagnaRasiIndex={box.lagnaRasiIndex} grahas={box.grahas} size={220} />
            </div>
          );
        })}
      </div>

      {/* Interpretation Tip */}
      <div className="bg-gradient-to-r from-teal-soft/10 to-cyan-soft/10 rounded-lg p-4 border-l-4 border-teal">
        <div className="text-sm">
          <div className="font-semibold text-ink mb-2">💡 Reading Varga Chakra</div>
          <div className="text-ink-soft space-y-1">
            <p>• D1-ல் பலம் D-chart-லும் தொடருமானால் அந்த காரகத்துவம் உறுதிப்படும் (Vargottama sāmya).</p>
            <p>• ஒவ்வொரு D-chart-ஐயும் தனித்தனியே திறந்து காண — Charts → D2 முதல் D60 வரை.</p>
            <p>• {GRAHA_TA_FULL.Sun ?? 'Sun'}/{GRAHA_TA_FULL.Moon ?? 'Moon'} போன்ற கிரகங்களின் D-chart நிலை D1 உடன் ஒப்பிட்டு பார்க்கவும்.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
