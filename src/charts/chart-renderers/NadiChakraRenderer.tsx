'use client';

import React from 'react';
import styles from './NadiChakra.module.css';

interface NadiChakraData {
  grid: Array<{
    name: string;
    nadi: string;
    row: number;
    col: number;
    edge: string;
    occupants: string[];
  }>;
  grahaNakshatra: Record<string, string>;
  lagnaNakshatra: string | null;
  janmaNakshatra: string | null;
  source: { title: string; author: string; pageLocus: string };
}

export function NadiChakraRenderer({ data }: { data: NadiChakraData | null }) {
  if (!data || !data.grid || data.grid.length === 0) {
    return <div className={styles.empty}>Nadi Chakra data unavailable</div>;
  }

  const cellMap = new Map(data.grid.map((cell) => [`${cell.row},${cell.col}`, cell]));

  const getNadiColor = (nadi: string | undefined) => {
    switch (nadi) {
      case 'Ida':
        return styles.ida;
      case 'Pingala':
        return styles.pingala;
      case 'Sushumna':
        return styles.sushumna;
      default:
        return '';
    }
  };

  const renderGrid = () => {
    const rows = [];
    for (let r = 1; r <= 9; r++) {
      const cells = [];
      for (let c = 1; c <= 9; c++) {
        const key = `${r},${c}`;
        const cell = cellMap.get(key);
        const isEmpty = !cell;
        const isJanma = cell?.name === data.janmaNakshatra;
        const isLagna = cell?.name === data.lagnaNakshatra;
        const nadiClass = cell ? getNadiColor(cell.nadi) : '';

        cells.push(
          <div
            key={key}
            className={`${styles.cell} ${isEmpty ? styles.empty : ''} ${isJanma ? styles.janma : ''} ${isLagna ? styles.lagna : ''} ${nadiClass}`}
            title={cell ? `${cell.name} (${cell.nadi}, ${cell.edge})` : 'Unoccupied'}
          >
            {cell && (
              <>
                <div className={styles.nakshatra}>{cell.name.substring(0, 3)}</div>
                {cell.occupants.length > 0 && (
                  <div className={styles.occupants}>
                    {cell.occupants.map((g) => (
                      <span key={g} className={styles.graha}>
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
      <h3>🌀 Nadi Chakra (Nadi-Classified Muhurta Grid)</h3>

      <div className={styles.gridContainer}>{renderGrid()}</div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.janma}`}></span> Janma Nakshatra (Moon)
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.lagna}`}></span> Lagna Nakshatra
        </div>
      </div>

      <div className={styles.nadiLegend}>
        <div className={styles.nadiItem}>
          <span className={`${styles.nadiDot} ${styles.ida}`}></span> Ida Nadi (Lunar)
        </div>
        <div className={styles.nadiItem}>
          <span className={`${styles.nadiDot} ${styles.pingala}`}></span> Pingala Nadi (Solar)
        </div>
        <div className={styles.nadiItem}>
          <span className={`${styles.nadiDot} ${styles.sushumna}`}></span> Sushumna Nadi (Central)
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
