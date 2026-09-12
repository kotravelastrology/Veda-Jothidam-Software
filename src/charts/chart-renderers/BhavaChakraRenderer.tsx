'use client';

import React from 'react';
import styles from './BhavaChakra.module.css';

interface HouseData {
  number: number;
  name: string;
  domainEn: string;
  domainTa: string;
  strength: number;
  planetsHere: string[];
}

interface PlanetaryPlacement {
  name: string;
  house: number;
  longitude: number;
  degreesInHouse: number;
  houseSignName: string;
}

interface BhavaChakraData {
  houses: HouseData[];
  planetaryPlacements: Record<string, PlanetaryPlacement>;
  source: { title: string; author: string; chapter: string };
}

export function BhavaChakraRenderer({ data }: { data: BhavaChakraData | null }) {
  if (!data || !data.houses) {
    return <div className={styles.empty}>Bhava Chakra data unavailable</div>;
  }

  const strengthColor = (strength: number): string => {
    if (strength >= 70) return '#28a745'; // Strong
    if (strength >= 50) return '#ffc107'; // Moderate
    if (strength >= 30) return '#fd7e14'; // Weak
    return '#dc3545'; // Very weak
  };

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

  return (
    <div className={styles.container}>
      <h3>🏠 Bhava Chakra (12 Houses)</h3>

      <div className={styles.houseGrid}>
        {data.houses.map(house => (
          <div key={house.number} className={styles.houseCard}>
            <div className={styles.houseNumber}>{house.number}</div>
            <div className={styles.houseName}>{house.name}</div>
            <div className={styles.houseDomain}>{house.domainEn}</div>

            <div className={styles.strengthBar}>
              <div
                className={styles.strengthFill}
                style={{
                  width: `${house.strength}%`,
                  backgroundColor: strengthColor(house.strength)
                }}
              />
            </div>
            <div className={styles.strengthLabel}>{house.strength.toFixed(0)}</div>

            {house.planetsHere.length > 0 && (
              <div className={styles.planetsList}>
                {house.planetsHere.map(planet => (
                  <span
                    key={planet}
                    className={styles.planet}
                    style={{ backgroundColor: planetColors[planet] || '#999' }}
                  >
                    {planet}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.placements}>
        <h4>📍 Planetary Placements</h4>
        {Object.entries(data.planetaryPlacements).map(([graha, placement]) => (
          <div key={graha} className={styles.placementRow}>
            <span
              className={styles.grahaIndicator}
              style={{ backgroundColor: planetColors[graha] || '#999' }}
            />
            <div className={styles.placementInfo}>
              <strong>{graha}</strong>
              <span className={styles.house}>House {placement.house}</span>
              <span className={styles.degree}>{placement.degreesInHouse.toFixed(1)}° in {placement.houseSignName}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title}
        </small>
      </div>
    </div>
  );
}
