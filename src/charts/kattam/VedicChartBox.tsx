'use client';

import { useEffect, useState } from 'react';
import { SouthIndianChart, type VedicChartProps } from './SouthIndianChart';
import { NorthIndianChart } from './NorthIndianChart';
import { loadChartStyle, saveChartStyle, type ChartStyle } from './rasiNames';

/**
 * The chart-box every page should use: a real fixed-grid South Indian chart
 * or a real diamond North Indian chart, switchable — matching the
 * reference apps (kp-muhurat-workspace's South/North tabs; the Jamakkol
 * Kotlin app and AstrologicLab's own JamakkolChartBox for the South Indian
 * convention itself). The choice persists across the whole site
 * (localStorage), so picking a style once applies everywhere.
 */
export function VedicChartBox(props: VedicChartProps) {
  const [style, setStyle] = useState<ChartStyle>('south');
  useEffect(() => { setStyle(loadChartStyle()); }, []);
  const choose = (s: ChartStyle) => { setStyle(s); saveChartStyle(s); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 mb-2 text-xs print:hidden">
        <button type="button" onClick={() => choose('south')}
          className={`px-2 py-1 rounded ${style === 'south' ? 'bg-saffron text-ink' : 'bg-surface-soft border border-line text-ink-soft'}`}>
          தென்னிந்திய கட்டம்
        </button>
        <button type="button" onClick={() => choose('north')}
          className={`px-2 py-1 rounded ${style === 'north' ? 'bg-saffron text-ink' : 'bg-surface-soft border border-line text-ink-soft'}`}>
          வட இந்திய கட்டம்
        </button>
      </div>
      {style === 'south' ? <SouthIndianChart {...props} /> : <NorthIndianChart {...props} />}
    </div>
  );
}
