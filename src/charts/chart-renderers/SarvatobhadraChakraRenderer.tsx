'use client';

import React from 'react';
import styles from './SarvatobhadraChakra.module.css';

interface SarvatobhadraChakraData {
  grid: Array<{
    name: string;
    row: number;
    col: number;
    edge: string;
    occupants: string[];
  }>;
  grahaNakshatra: Record<string, string>;
  lagnaNakshatra: string | null;
  janmaNakshatra: string | null;
  janmaVedha: {
    direct: { nakshatra: string; malefic: string[] };
    forward: { nakshatra: string; malefic: string[] };
    backward: { nakshatra: string; malefic: string[] };
  } | null;
  lagnaVedha: {
    direct: { nakshatra: string; malefic: string[] };
    forward: { nakshatra: string; malefic: string[] };
    backward: { nakshatra: string; malefic: string[] };
  } | null;
  source: { title: string; author: string; pageLocus: string };
}

export function SarvatobhadraChakraRenderer({ data }: { data: SarvatobhadraChakraData | null }) {
  if (!data || !data.grid || data.grid.length === 0) {
    return <div className={styles.empty}>Sarvatobhadra Chakra data unavailable</div>;
  }

  const cellMap = new Map(data.grid.map((cell) => [`${cell.row},${cell.col}`, cell]));

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

        cells.push(
          <div
            key={key}
            className={`${styles.cell} ${isEmpty ? styles.empty : ''} ${isJanma ? styles.janma : ''} ${isLagna ? styles.lagna : ''}`}
            title={cell ? `${cell.name} (${cell.edge})` : 'Unoccupied'}
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

  const renderVedhaAlert = (vedhaName: string, vedha: any) => {
    if (!vedha) return null;

    const hasMalefic = (v: any) => v && v.malefic && v.malefic.length > 0;
    const directMalefic = hasMalefic(vedha.direct);
    const forwardMalefic = hasMalefic(vedha.forward);
    const backwardMalefic = hasMalefic(vedha.backward);

    if (!directMalefic && !forwardMalefic && !backwardMalefic) {
      return null; // No malefic Vedha
    }

    return (
      <div className={styles.vedhaAlert}>
        <strong>{vedhaName} Vedha Alerts:</strong>
        {directMalefic && (
          <div className={styles.vedhaLine}>
            <span className={styles.vedhaType}>Direct:</span> {vedha.direct.nakshatra} — Afflicted by{' '}
            {vedha.direct.malefic.join(', ')}
          </div>
        )}
        {forwardMalefic && (
          <div className={styles.vedhaLine}>
            <span className={styles.vedhaType}>Forward:</span> {vedha.forward.nakshatra} — Afflicted by{' '}
            {vedha.forward.malefic.join(', ')}
          </div>
        )}
        {backwardMalefic && (
          <div className={styles.vedhaLine}>
            <span className={styles.vedhaType}>Backward:</span> {vedha.backward.nakshatra} — Afflicted by{' '}
            {vedha.backward.malefic.join(', ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h3>🌀 Sarvatobhadra Chakra (Classical Muhurta Grid)</h3>

      <div className={styles.gridContainer}>{renderGrid()}</div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.janma}`}></span> Janma Nakshatra (Moon)
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.lagna}`}></span> Lagna Nakshatra
        </div>
      </div>

      <div className={styles.vedhaSection}>
        {renderVedhaAlert('Janma (Moon)', data.janmaVedha)}
        {data.lagnaNakshatra && data.lagnaNakshatra !== data.janmaNakshatra && renderVedhaAlert('Lagna', data.lagnaVedha)}
      </div>

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title} ({data.source.pageLocus})
        </small>
      </div>
    </div>
  );
}
