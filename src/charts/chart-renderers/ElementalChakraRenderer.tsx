'use client';

import React, { useState } from 'react';
import styles from './ElementalChakra.module.css';

interface ElementalPair {
  graha1: string;
  graha2: string;
  element1: string;
  element2: string;
  compatibility: number;
  type: string;
}

interface ElementalChakraData {
  elementCounts: Record<string, number>;
  elementalStrength: Record<string, number>;
  elementalPairs: ElementalPair[];
  compatibilityMatrix: Record<string, Record<string, number>>;
  harmonies: ElementalPair[];
  conflicts: ElementalPair[];
  source: { title: string; author: string; chapter: string };
}

export function ElementalChakraRenderer({ data }: { data: ElementalChakraData | null }) {
  const [showType, setShowType] = useState<'all' | 'harmonies' | 'conflicts'>('all');

  if (!data) {
    return <div className={styles.empty}>Elemental Chakra data unavailable</div>;
  }

  const elementColors: Record<string, string> = {
    Fire: '#FF6B35',
    Earth: '#8B4513',
    Air: '#87CEEB',
    Water: '#4169E1'
  };

  const filteredPairs =
    showType === 'harmonies'
      ? data.harmonies
      : showType === 'conflicts'
        ? data.conflicts
        : data.elementalPairs;

  const compatColor = (compat: number): string => {
    if (compat > 50) return '#28a745'; // Green - harmonious
    if (compat >= -30) return '#ffc107'; // Yellow - neutral
    return '#dc3545'; // Red - conflicting
  };

  return (
    <div className={styles.container}>
      <h3>🔥 Elemental Chakra (पञ्चभूत)</h3>

      {/* Element Distribution */}
      <div className={styles.distribution}>
        <h4>Element Distribution</h4>
        <div className={styles.elementBars}>
          {Object.entries(data.elementalStrength).map(([element, strength]) => (
            <div key={element} className={styles.elementBar}>
              <div className={styles.elementName}>{element}</div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${strength}%`,
                    backgroundColor: elementColors[element]
                  }}
                />
              </div>
              <div className={styles.barLabel}>{data.elementCounts[element]} (${strength.toFixed(1)}%)</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility Matrix */}
      <div className={styles.matrixSection}>
        <h4>Element Compatibility Matrix</h4>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th></th>
              <th>Fire</th>
              <th>Earth</th>
              <th>Air</th>
              <th>Water</th>
            </tr>
          </thead>
          <tbody>
            {['Fire', 'Earth', 'Air', 'Water'].map(element1 => (
              <tr key={element1}>
                <th>{element1}</th>
                {['Fire', 'Earth', 'Air', 'Water'].map(element2 => {
                  const compat = data.compatibilityMatrix[element1][element2];
                  return (
                    <td
                      key={`${element1}-${element2}`}
                      className={styles.matrixCell}
                      style={{ backgroundColor: compatColor(compat) + '22', color: compatColor(compat) }}
                    >
                      {compat > 0 ? '+' : ''}{compat}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graha Pairs */}
      <div className={styles.pairsSection}>
        <h4>Graha Compatibility Pairs</h4>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${showType === 'all' ? styles.active : ''}`}
            onClick={() => setShowType('all')}
          >
            All ({data.elementalPairs.length})
          </button>
          <button
            className={`${styles.filterBtn} ${showType === 'harmonies' ? styles.active : ''}`}
            onClick={() => setShowType('harmonies')}
          >
            Harmonies ({data.harmonies.length})
          </button>
          <button
            className={`${styles.filterBtn} ${showType === 'conflicts' ? styles.active : ''}`}
            onClick={() => setShowType('conflicts')}
          >
            Conflicts ({data.conflicts.length})
          </button>
        </div>

        <div className={styles.pairsList}>
          {filteredPairs.map((pair, idx) => (
            <div key={idx} className={styles.pairRow}>
              <div className={styles.pairGrahas}>
                <span
                  className={styles.graha}
                  style={{ backgroundColor: elementColors[pair.element1] }}
                >
                  {pair.graha1}
                </span>
                <span className={styles.pairArrow}>⟷</span>
                <span
                  className={styles.graha}
                  style={{ backgroundColor: elementColors[pair.element2] }}
                >
                  {pair.graha2}
                </span>
              </div>
              <div className={styles.pairInfo}>
                <span className={styles.elements}>
                  {pair.element1} + {pair.element2}
                </span>
                <span
                  className={styles.compatibility}
                  style={{ backgroundColor: compatColor(pair.compatibility) + '33' }}
                >
                  {pair.compatibility > 0 ? '+' : ''}{pair.compatibility} ({pair.type})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title}
        </small>
      </div>
    </div>
  );
}
