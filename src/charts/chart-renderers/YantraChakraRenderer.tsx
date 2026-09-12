'use client';

import React from 'react';
import styles from './YantraChakra.module.css';

interface YantraChakraData {
  zones: Array<{
    name: string;
    direction: string;
    element: string;
    strength: number;
    lord: string;
    occupants: string[];
  }>;
  grahaPlacements: Record<string, string[]>;
  zoneStrengths: Record<string, number>;
  source: { title: string; author: string; pageLocus: string };
}

const DIRECTION_COLORS: Record<string, string> = {
  Center: '#FFD700',
  East: '#87CEEB',
  SE: '#FF6347',
  South: '#8B4513',
  SW: '#4169E1',
  West: '#20B2AA',
  NW: '#9370DB',
  North: '#87CEEB',
  NE: '#FF69B4',
};

export function YantraChakraRenderer({ data }: { data: YantraChakraData | null }) {
  if (!data || !data.zones || data.zones.length === 0) {
    return <div className={styles.empty}>Yantra Chakra data unavailable</div>;
  }

  const renderYantra = () => {
    // 3x3 grid representing 9 zones
    // Center at [1,1], Cardinals at [0,1], [2,1], [1,0], [1,2], Ordinals at corners
    const grid: Record<string, any> = {};

    // Map zones to grid positions
    const zonePositions: Record<string, [number, number]> = {
      'Rudra': [0, 0],      // NE
      'Soma': [0, 1],       // N
      'Vayu': [0, 2],       // NW
      'Indra': [1, 2],      // E
      'Brahma': [1, 1],     // Center
      'Varuna': [1, 0],     // W
      'Agni': [2, 2],       // SE
      'Yama': [2, 1],       // S
      'Pitri': [2, 0]       // SW
    };

    for (const zone of data.zones) {
      const [row, col] = zonePositions[zone.name] || [1, 1];
      grid[`${row},${col}`] = zone;
    }

    const rows = [];
    for (let r = 0; r < 3; r++) {
      const cells = [];
      for (let c = 0; c < 3; c++) {
        const key = `${r},${c}`;
        const zone = grid[key];
        const color = zone ? DIRECTION_COLORS[zone.direction] : '#f5f5f5';
        const strength = zone ? data.zoneStrengths[zone.name] || 0 : 0;

        cells.push(
          <div
            key={key}
            className={`${styles.yantricell} ${zone ? styles.occupied : styles.empty}`}
            style={{
              backgroundColor: zone ? `${color}40` : '#f5f5f5',
              borderColor: color,
              opacity: zone ? 0.5 + (strength / 200) : 0.5
            }}
            title={zone ? `${zone.name} (${zone.direction}, Strength: ${strength}%)` : 'Empty'}
          >
            {zone && (
              <>
                <div className={styles.zoneName}>{zone.name}</div>
                <div className={styles.strength}>{strength}%</div>
                {zone.occupants.length > 0 && (
                  <div className={styles.occupants}>
                    {zone.occupants.map((g: string) => (
                      <span key={g} className={styles.graha} title={g}>
                        {g.substring(0, 1)}
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
        <div key={r} className={styles.yantrarow}>
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className={styles.container}>
      <h3>✨ Yantra Chakra (Sacred Geometric Grid)</h3>

      <div className={styles.info}>
        <strong>9-Zone Yantra:</strong> Center (Brahma) + 8 Directions (Cardinals & Ordinals)
      </div>

      <div className={styles.yantraContainer}>{renderYantra()}</div>

      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <strong>Zone Types:</strong>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.badge} style={{ backgroundColor: DIRECTION_COLORS.Center }}></span>
              Center (100% base strength)
            </div>
            <div className={styles.legendItem}>
              <span className={styles.badge} style={{ backgroundColor: DIRECTION_COLORS.East }}></span>
              Cardinals (85% base strength)
            </div>
            <div className={styles.legendItem}>
              <span className={styles.badge} style={{ backgroundColor: DIRECTION_COLORS.NE }}></span>
              Ordinals (70% base strength)
            </div>
          </div>
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
