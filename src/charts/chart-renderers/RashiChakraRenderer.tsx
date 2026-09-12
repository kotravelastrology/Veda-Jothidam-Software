'use client';

import React from 'react';
import styles from './RashiChakra.module.css';

interface RashiChakraData {
  grid: Array<{
    name: string;
    element: string;
    lord: string;
    row: number;
    col: number;
    edge: string;
    occupants: string[];
  }>;
  grahaRashi: Record<string, string>;
  lagnaRashi: string | null;
  source: { title: string; author: string; pageLocus: string };
}

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#ff6b6b',
  Earth: '#8b7355',
  Air: '#74b9ff',
  Water: '#0984e3',
};

export function RashiChakraRenderer({ data }: { data: RashiChakraData | null }) {
  if (!data || !data.grid || data.grid.length === 0) {
    return <div className={styles.empty}>Rashi Chakra data unavailable</div>;
  }

  const cellMap = new Map(data.grid.map((cell) => [`${cell.row},${cell.col}`, cell]));

  const getElementColor = (element: string | undefined) => {
    if (!element) return '#ccc';
    return ELEMENT_COLORS[element] || '#ccc';
  };

  const renderGrid = () => {
    const rows = [];
    for (let r = 1; r <= 9; r++) {
      const cells = [];
      for (let c = 1; c <= 9; c++) {
        const key = `${r},${c}`;
        const cell = cellMap.get(key);
        const isEmpty = !cell;
        const isLagna = cell?.name === data.lagnaRashi;

        cells.push(
          <div
            key={key}
            className={`${styles.cell} ${isEmpty ? styles.empty : ''} ${isLagna ? styles.lagna : ''}`}
            style={cell ? { borderColor: getElementColor(cell.element) } : {}}
            title={cell ? `${cell.name} (${cell.element}, ${cell.lord})` : 'Unoccupied'}
          >
            {cell && (
              <>
                <div className={styles.rashi}>{cell.name.substring(0, 3)}</div>
                <div className={styles.element} style={{ color: getElementColor(cell.element) }}>
                  {cell.element.substring(0, 1)}
                </div>
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
      <h3>🔄 Rashi Chakra (12-House Sign Grid)</h3>

      <div className={styles.info}>
        <strong>Lagna Rashi:</strong> {data.lagnaRashi}
      </div>

      <div className={styles.gridContainer}>{renderGrid()}</div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.cell} ${styles.lagna}`}></span> Lagna Rashi (Ascendant)
        </div>
      </div>

      <div className={styles.elementLegend}>
        <div className={styles.elementLegendTitle}>Elements:</div>
        <div className={styles.elementItems}>
          {Object.entries(ELEMENT_COLORS).map(([element, color]) => (
            <div key={element} className={styles.elementItem}>
              <span className={styles.elementDot} style={{ backgroundColor: color }}></span>
              {element}
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
