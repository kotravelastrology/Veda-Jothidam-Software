'use client';

import React, { useState } from 'react';
import styles from './DivisionalCharts.module.css';

interface DChartPlacement {
  longitude: number;
  division: number;
  degreesInDivision: number;
  degreesPerDivision: number;
  dchartName: string;
}

interface DivisionalChartsData {
  divisionalCharts: Record<string, Record<number, DChartPlacement>>;
  source: { title: string; author: string; pageLocus: string };
}

export function DivisionalChartsRenderer({ data }: { data: DivisionalChartsData | null }) {
  const [selectedDChart, setSelectedDChart] = useState(9); // Default to D9 (Navamsha)

  if (!data || !data.divisionalCharts) {
    return <div className={styles.empty}>Divisional Charts data unavailable</div>;
  }

  const mainCharts = [1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 27, 30, 60];
  const chartPlacements = data.divisionalCharts;

  const renderSelectedChart = () => {
    const rows = [];

    for (const [graha, placements] of Object.entries(chartPlacements)) {
      const placement = placements[selectedDChart];
      if (!placement) continue;

      rows.push(
        <div key={graha} className={styles.placementRow}>
          <div className={styles.grahaName}>{graha}</div>
          <div className={styles.placementInfo}>
            <span className={styles.chartName}>{placement.dchartName}</span>
            <span className={styles.division}>Div {placement.division + 1}</span>
            <span className={styles.degrees}>{placement.degreesInDivision.toFixed(2)}°</span>
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={styles.container}>
      <h3>📊 Divisional Charts (D1-D60)</h3>

      <div className={styles.info}>
        <strong>Select D-Chart:</strong>
        <div className={styles.chartButtons}>
          {mainCharts.map(d => (
            <button
              key={d}
              className={`${styles.chartBtn} ${selectedDChart === d ? styles.active : ''}`}
              onClick={() => setSelectedDChart(d)}
            >
              D{d}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.placements}>{renderSelectedChart()}</div>

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title} ({data.source.pageLocus})
        </small>
      </div>
    </div>
  );
}
