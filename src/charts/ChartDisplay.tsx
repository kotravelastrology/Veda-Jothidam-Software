'use client';

import { getChartById } from './chartTypes';
import { RasiChartRenderer } from './chart-renderers/RasiChartRenderer';
import { NavamshaChartRenderer } from './chart-renderers/NavamshaChartRenderer';
import { TransitChartRenderer } from './chart-renderers/TransitChartRenderer';
import { DivisionalChartRenderer } from './chart-renderers/DivisionalChartRenderer';
import { DashaTimelineRenderer } from './chart-renderers/DashaTimelineRenderer';
import { AshtakavargaHeatmapRenderer } from './chart-renderers/AshtakavargaHeatmapRenderer';
import { VargaChakraRenderer } from './chart-renderers/VargaChakraRenderer';
import { SudarshanaChakraRenderer } from './chart-renderers/SudarshanaChakraRenderer';
import { SynastryChartRenderer } from './chart-renderers/SynastryChartRenderer';
import { AspectMatrixRenderer } from './chart-renderers/AspectMatrixRenderer';
import { YogasAndDoshasRenderer } from './chart-renderers/YogasAndDoshasRenderer';
import { ShadBalaRenderer } from './chart-renderers/ShadBalaRenderer';
import { ChartComparisonDisplay } from './chart-renderers/ChartComparisonDisplay';
import { AspectOverlayRenderer } from './chart-renderers/AspectOverlayRenderer';
import { CompatibilityMatrix } from './chart-renderers/CompatibilityMatrix';
import { DashaOverlapAnalysis } from './chart-renderers/DashaOverlapAnalysis';
import { ComparisonInsights } from './chart-renderers/ComparisonInsights';

type ReportData = any;

interface ChartDisplayProps {
  chartId: string;
  report: ReportData;
}

export function ChartDisplay({ chartId, report }: ChartDisplayProps) {
  const chartType = getChartById(chartId);

  if (!chartType) {
    return (
      <div className="bg-surface border border-line rounded-lg p-8 text-center">
        <p className="text-ink-soft">Chart not found</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-lg p-6">
      {/* Chart Header */}
      <div className="mb-6 pb-4 border-b border-line">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{chartType.icon}</span>
          <div>
            <h3 className="text-2xl font-semibold text-ink">{chartType.label}</h3>
            <p className="text-sm text-ink-soft font-[family-name:var(--font-tamil-serif)]">
              {chartType.labelTamil}
            </p>
          </div>
        </div>
        <p className="text-sm text-ink-soft">{chartType.description}</p>
      </div>

      {/* Chart Content Area */}
      <div className="space-y-6">
        {chartId === 'D1-rasi' && <RasiChartRenderer report={report} />}
        {chartId === 'D9-navamsha' && <NavamshaChartRenderer report={report} />}
        {chartId === 'transit' && <TransitChartRenderer report={report} />}
        {['D2-hora', 'D7-saptamsha', 'D10-dasamsha', 'D12-dwadashamsha'].includes(chartId) && (
          <DivisionalChartRenderer report={report} chartId={chartId} />
        )}
        {chartId === 'dasha-vimsottari' && <DashaTimelineRenderer report={report} />}
        {chartId === 'ashtakavarga' && <AshtakavargaHeatmapRenderer report={report} />}
        {chartId === 'varga-chakra' && <VargaChakraRenderer report={report} />}
        {chartId === 'sudarshan-chakra' && <SudarshanaChakraRenderer report={report} />}
        {chartId === 'compatibility' && <SynastryChartRenderer report={report} />}
        {chartId === 'aspect-matrix' && <AspectMatrixRenderer report={report} />}
        {chartId === 'yogas' && <YogasAndDoshasRenderer report={report} />}
        {chartId === 'shadbala' && <ShadBalaRenderer report={report} />}
        {chartId === 'chart-comparison' && <ChartComparisonDisplay report={report} />}

        {/* Default placeholder for unimplemented charts */}
        {![
          'D1-rasi',
          'D9-navamsha',
          'D2-hora',
          'D7-saptamsha',
          'D10-dasamsha',
          'D12-dwadashamsha',
          'dasha-vimsottari',
          'transit',
          'ashtakavarga',
          'varga-chakra',
          'sudarshan-chakra',
          'compatibility',
          'aspect-matrix',
          'yogas',
          'shadbala',
          'chart-comparison',
        ].includes(chartId) && <ChartPlaceholder chartType={chartType} />}
      </div>
    </div>
  );
}

function ChartPlaceholder({ chartType }: { chartType: any }) {
  return (
    <div className="bg-gradient-to-br from-saffron/10 to-indigo/10 rounded-lg p-8 border border-dashed border-line text-center">
      <div className="text-5xl mb-4">{chartType.icon}</div>
      <h4 className="font-semibold text-ink mb-2">{chartType.label}</h4>
      <p className="text-sm text-ink-soft mb-4">{chartType.description}</p>
      <p className="text-xs text-ink-soft/60">
        ⭐ Chart rendering for {chartType.labelTamil} coming in next phase
      </p>
    </div>
  );
}
