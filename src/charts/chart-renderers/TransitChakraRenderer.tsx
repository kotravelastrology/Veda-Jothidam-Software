'use client';

import React, { useState } from 'react';
import styles from './TransitChakra.module.css';

interface Transit {
  planet: string;
  natalLongitude: number;
  transitLongitude: number;
  movement: number;
  direction: string;
  natalHouse: number;
  transitHouse: number;
}

interface Aspect {
  transitPlanet: string;
  natalPlanet: string;
  aspectType: string;
  orb: number;
  influence: string;
  strength: number;
}

interface TransitHouse {
  number: number;
  planetsHere: string[];
  strength: number;
}

interface Bhukti {
  lord: string;
  startDate: string | Date;
  endDate: string | Date;
  daysRemaining: number;
}

interface TransitChakraData {
  natalPositions: Record<string, { longitude: number; house: number }>;
  transitPositions: Record<string, { longitude: number; house: number; movement: number; direction: string }>;
  transitHouses: TransitHouse[];
  transits: Transit[];
  aspects: Aspect[];
  bhuktis: Bhukti[];
  generatedAt: string;
  source: { title: string; author: string; chapter: string };
}

export function TransitChakraRenderer({ data }: { data: TransitChakraData | null }) {
  const [showTab, setShowTab] = useState<'transits' | 'aspects' | 'houses' | 'bhukti'>('transits');

  if (!data) {
    return <div className={styles.empty}>Transit Chakra data unavailable</div>;
  }

  const planetColors: Record<string, string> = {
    Sun: '#FFD700',
    Moon: '#E0E0E0',
    Mars: '#FF6347',
    Mercury: '#87CEEB',
    Jupiter: '#FFB347',
    Venus: '#FFB6C1',
    Saturn: '#808080',
    Rahu: '#8B4513',
    Ketu: '#4B0082'
  };

  const aspectColors: Record<string, string> = {
    conjunction: '#FF6347',
    opposition: '#FF6347',
    square: '#FF8C00',
    trine: '#32CD32',
    sextile: '#87CEEB'
  };

  const generatedDate = new Date(data.generatedAt);

  return (
    <div className={styles.container}>
      <h3>🌍 Transit Chakra (गोचार)</h3>

      <div className={styles.timestamp}>
        <small>Generated: {generatedDate.toLocaleString()}</small>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${showTab === 'transits' ? styles.active : ''}`}
          onClick={() => setShowTab('transits')}
        >
          Transit Positions ({data.transits.length})
        </button>
        <button
          className={`${styles.tab} ${showTab === 'aspects' ? styles.active : ''}`}
          onClick={() => setShowTab('aspects')}
        >
          Aspects ({data.aspects.length})
        </button>
        <button
          className={`${styles.tab} ${showTab === 'houses' ? styles.active : ''}`}
          onClick={() => setShowTab('houses')}
        >
          Houses
        </button>
        <button
          className={`${styles.tab} ${showTab === 'bhukti' ? styles.active : ''}`}
          onClick={() => setShowTab('bhukti')}
        >
          Current Period
        </button>
      </div>

      {/* Transits Tab */}
      {showTab === 'transits' && (
        <div className={styles.tabContent}>
          <h4>Current Transit Positions</h4>
          <div className={styles.transitList}>
            {data.transits.map((t, idx) => (
              <div key={idx} className={styles.transitRow}>
                <div
                  className={styles.planetBadge}
                  style={{ backgroundColor: planetColors[t.planet] || '#999' }}
                >
                  {t.planet}
                </div>
                <div className={styles.transitInfo}>
                  <div>
                    <strong>Natal:</strong> House {t.natalHouse} @ {t.natalLongitude.toFixed(1)}°
                  </div>
                  <div>
                    <strong>Transit:</strong> House {t.transitHouse} @ {t.transitLongitude.toFixed(1)}°
                  </div>
                  <div>
                    <strong>Movement:</strong> {t.movement.toFixed(1)}° ({t.direction})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aspects Tab */}
      {showTab === 'aspects' && (
        <div className={styles.tabContent}>
          <h4>Transit-to-Natal Aspects</h4>
          <div className={styles.aspectsList}>
            {data.aspects.map((a, idx) => (
              <div key={idx} className={styles.aspectRow}>
                <div className={styles.aspectPlanets}>
                  <span
                    className={styles.tPlanet}
                    style={{ backgroundColor: planetColors[a.transitPlanet] || '#999' }}
                  >
                    {a.transitPlanet}
                  </span>
                  <span
                    className={styles.aspectBadge}
                    style={{ backgroundColor: aspectColors[a.aspectType] || '#999' }}
                  >
                    {a.aspectType.toUpperCase()}
                  </span>
                  <span
                    className={styles.nPlanet}
                    style={{ backgroundColor: planetColors[a.natalPlanet] || '#999' }}
                  >
                    {a.natalPlanet}
                  </span>
                </div>
                <div className={styles.aspectDetail}>
                  <div>{a.influence}</div>
                  <div className={styles.orbLabel}>
                    Orb: {a.orb.toFixed(1)}° | Strength: {a.strength}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Houses Tab */}
      {showTab === 'houses' && (
        <div className={styles.tabContent}>
          <h4>Transit Houses</h4>
          <div className={styles.houseGrid}>
            {data.transitHouses.map((h, idx) => (
              <div
                key={idx}
                className={styles.houseBox}
                style={{ opacity: 0.6 + h.strength / 500 }}
              >
                <div className={styles.houseNum}>{h.number}</div>
                <div className={styles.housePlanets}>
                  {h.planetsHere.length > 0
                    ? h.planetsHere.map(p => (
                        <span
                          key={p}
                          className={styles.housePlanet}
                          style={{ backgroundColor: planetColors[p] }}
                        >
                          {p}
                        </span>
                      ))
                    : 'Empty'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bhukti Tab */}
      {showTab === 'bhukti' && (
        <div className={styles.tabContent}>
          <h4>Current Dasha Period (Bhukti)</h4>
          {data.bhuktis.map((b, idx) => {
            const start = typeof b.startDate === 'string' ? new Date(b.startDate) : b.startDate;
            const end = typeof b.endDate === 'string' ? new Date(b.endDate) : b.endDate;
            return (
              <div key={idx} className={styles.bhuktiBox}>
                <div className={styles.bhuktiLord}>
                  <strong>{b.lord} Bhukti</strong>
                </div>
                <div className={styles.bhuktiDates}>
                  {start.toLocaleDateString()} to {end.toLocaleDateString()}
                </div>
                <div className={styles.bhuktiDays}>
                  <strong>{b.daysRemaining} days remaining</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title} ({data.source.chapter})
        </small>
      </div>
    </div>
  );
}
