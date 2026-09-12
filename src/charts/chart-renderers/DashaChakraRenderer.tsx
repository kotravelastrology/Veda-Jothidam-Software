'use client';

import React from 'react';
import styles from './DashaChakra.module.css';

interface DashaChakraData {
  grid: Array<{
    name: string;
    dashaLord: string;
    row: number;
    col: number;
    edge: string;
    occupants: string[];
  }>;
  centerCell: {
    dashaLord: string;
    row: number;
    col: number;
    edge: string;
  };
  grahaNakshatra: Record<string, string>;
  lagnaNakshatra: string | null;
  janmaNakshatra: string | null;
  currentMahadashaLord: string;
  source: { title: string; author: string; pageLocus: string };
}

const DASHA_COLORS: Record<string, string> = {
  Ketu: '#ff6b6b',
  Venus: '#ff9f43',
  Sun: '#f39c12',
  Moon: '#3498db',
  Mars: '#e74c3c',
  Rahu: '#9b59b6',
  Jupiter: '#2ecc71',
  Saturn: '#95a5a6',
  Mercury: '#1abc9c',
};

export function DashaChakraRenderer({ data }: { data: DashaChakraData | null }) {
  if (!data || !data.grid || data.grid.length === 0) {
    return <div className={styles.empty}>Dasha Chakra data unavailable</div>;
  }

  const cellMap = new Map(data.grid.map((cell) => [`${cell.row},${cell.col}`, cell]));

  const getDashaColor = (dashaLord: string | undefined) => {
    if (!dashaLord || dashaLord === 'Mixed') return '';
    return DASHA_COLORS[dashaLord] || '#ccc';
  };

  const renderGrid = () => {
    const rows = [];
    for (let r = 1; r <= 9; r++) {
      const cells = [];
      for (let c = 1; c <= 9; c++) {
        const key = `${r},${c}`;
        const cell = cellMap.get(key);
        const isCenter = r === 5 && c === 5;
        const isEmpty = !cell && !isCenter;
        const isJanma = cell?.name === data.janmaNakshatra;
        const isLagna = cell?.name === data.lagnaNakshatra;

        if (isCenter) {
          cells.push(
            <div
              key={key}
              className={`${styles.cell} ${styles.center}`}
              style={{ backgroundColor: getDashaColor(data.currentMahadashaLord) }}
              title={`Mahadasha: ${data.currentMahadashaLord}`}
            >
              <div className={styles.dashaLord}>{data.currentMahadashaLord.substring(0, 3)}</div>
            </div>
          );
        } else {
          cells.push(
            <div
              key={key}
              className={`${styles.cell} ${isEmpty ? styles.empty : ''} ${isJanma ? styles.janma : ''} ${isLagna ? styles.lagna : ''}`}
              style={cell ? { backgroundColor: getDashaColor(cell.dashaLord) + '11' } : {}}
              title={cell ? `${cell.name} (${cell.dashaLord}, ${cell.edge})` : 'Unoccupied'}
            >
              {cell && (
                <>
                  <div className={styles.nakshatra}>{cell.name.substring(0, 3)}</div>
                  {cell.occupants.length > 0 && (
                    <div className={styles.occupants}>
                      {cell.occupants.map((g) => (
                        <span key={g} className={styles.graha} title={g}>
                          {g.substring(0, 2)}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        }
      }
      rows.push(
        <div key={r} className={styles.row}>
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={styles.container}>
      <h3>⏱️ Dasha Chakra (Time-Based Muhurta Grid)</h3>

      <div className={styles.info}>
        <strong>Current Mahadasha:</strong> {data.currentMahadashaLord}
      </div>

      <div className={styles.gridContainer}>{renderGrid()}</div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.janma}`}></span> Janma Nakshatra (Moon)
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.lagna}`}></span> Lagna Nakshatra
        </div>
      </div>

      <div className={styles.dashaLegend}>
        <div className={styles.dashaLegendTitle}>Vimshottari Dasha Lords:</div>
        <div className={styles.dashaItems}>
          {Object.entries(DASHA_COLORS).map(([lord, color]) => (
            <div key={lord} className={styles.dashaItem}>
              <span className={styles.dashaDot} style={{ backgroundColor: color }}></span>
              {lord}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title} ({data.source.pageLocus})
        </small>
      </div>
    </div>
  );
}
