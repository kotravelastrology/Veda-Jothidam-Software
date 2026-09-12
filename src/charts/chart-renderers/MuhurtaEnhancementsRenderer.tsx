'use client';

import React, { useState } from 'react';
import styles from './MuhurtaEnhancements.module.css';

interface AuspiciousTime {
  activity: string;
  startTime: string;
  endTime: string;
  score: number;
  quality: string;
}

interface Remedy {
  name: string;
  description: string;
  difficulty: number;
  duration: string;
  benefit: string;
}

interface Activity {
  activity: string;
  timing: string;
}

interface Prediction {
  eventSuccess: number;
  karmaStrength: number;
  timing: string;
  bhuktiBenefit: string;
  daysActive: number;
}

interface MuhurtaEnhancementsData {
  muhurtaScore: number;
  timingQuality: string;
  auspiciousTimes: AuspiciousTime[];
  remedies: Remedy[];
  dos: Activity[];
  donts: Activity[];
  predictions: Prediction;
  source: { title: string; author: string; chapter: string };
}

export function MuhurtaEnhancementsRenderer({ data }: { data: MuhurtaEnhancementsData | null }) {
  const [showTab, setShowTab] = useState<'score' | 'times' | 'remedies' | 'guide'>('score');

  if (!data) {
    return <div className={styles.empty}>Muhurta Enhancements data unavailable</div>;
  }

  const qualityColor = {
    Excellent: '#28a745',
    Good: '#ffc107',
    Average: '#fd7e14',
    Poor: '#dc3545',
    Unfavorable: '#721c24'
  };

  const difficultyStars = (level: number) => '★'.repeat(level) + '☆'.repeat(3 - level);

  return (
    <div className={styles.container}>
      <h3>🕉️ Muhurta Enhancements (муकूर्त्त)</h3>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${showTab === 'score' ? styles.active : ''}`}
          onClick={() => setShowTab('score')}
        >
          Muhurta Score
        </button>
        <button
          className={`${styles.tab} ${showTab === 'times' ? styles.active : ''}`}
          onClick={() => setShowTab('times')}
        >
          Auspicious Times ({data.auspiciousTimes.length})
        </button>
        <button
          className={`${styles.tab} ${showTab === 'remedies' ? styles.active : ''}`}
          onClick={() => setShowTab('remedies')}
        >
          Remedies ({data.remedies.length})
        </button>
        <button
          className={`${styles.tab} ${showTab === 'guide' ? styles.active : ''}`}
          onClick={() => setShowTab('guide')}
        >
          Do's & Don'ts
        </button>
      </div>

      {/* Score Tab */}
      {showTab === 'score' && (
        <div className={styles.tabContent}>
          <div className={styles.scoreBox}>
            <div className={styles.scoreLarge} style={{ color: qualityColor[data.timingQuality] }}>
              {data.muhurtaScore.toFixed(0)}
            </div>
            <div className={styles.scoreLabel}>/100</div>
            <div
              className={styles.qualityBadge}
              style={{ backgroundColor: qualityColor[data.timingQuality] }}
            >
              {data.timingQuality}
            </div>
          </div>

          <div className={styles.scoreBar}>
            <div
              className={styles.scoreBarFill}
              style={{
                width: `${data.muhurtaScore}%`,
                backgroundColor: qualityColor[data.timingQuality]
              }}
            />
          </div>

          <div className={styles.predictions}>
            <h4>Predictions</h4>
            <div className={styles.predictionRow}>
              <span className={styles.label}>Event Success:</span>
              <span className={styles.value}>{data.predictions.eventSuccess}%</span>
            </div>
            <div className={styles.predictionRow}>
              <span className={styles.label}>Karma Strength:</span>
              <span className={styles.value}>{data.predictions.karmaStrength}%</span>
            </div>
            <div className={styles.predictionRow}>
              <span className={styles.label}>Current Bhukti:</span>
              <span className={styles.value}>{data.predictions.bhuktiBenefit}</span>
            </div>
            <div className={styles.predictionRow}>
              <span className={styles.label}>Days Active:</span>
              <span className={styles.value}>{data.predictions.daysActive} days</span>
            </div>
          </div>

          <div className={styles.timingRecommendation}>
            <p>{data.predictions.timing}</p>
          </div>
        </div>
      )}

      {/* Auspicious Times Tab */}
      {showTab === 'times' && (
        <div className={styles.tabContent}>
          <div className={styles.timesList}>
            {data.auspiciousTimes.map((time, idx) => (
              <div key={idx} className={styles.timeCard}>
                <div className={styles.timeActivity}>{time.activity}</div>
                <div className={styles.timeRange}>
                  🕐 {time.startTime} - {time.endTime}
                </div>
                <div className={styles.timeScore}>
                  <span className={styles.scoreNum}>{time.score.toFixed(0)}/100</span>
                  <span
                    className={styles.timeQuality}
                    style={{ backgroundColor: qualityColor[time.quality] }}
                  >
                    {time.quality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remedies Tab */}
      {showTab === 'remedies' && (
        <div className={styles.tabContent}>
          {data.remedies.length === 0 ? (
            <p className={styles.noRemedies}>✅ No remedies needed - excellent timing!</p>
          ) : (
            <div className={styles.remediesList}>
              {data.remedies.map((remedy, idx) => (
                <div key={idx} className={styles.remedyCard}>
                  <div className={styles.remedyName}>{remedy.name}</div>
                  <div className={styles.remedyDifficulty}>
                    Difficulty: {difficultyStars(remedy.difficulty)}
                  </div>
                  <div className={styles.remedyDescription}>{remedy.description}</div>
                  <div className={styles.remedyDetails}>
                    <span>Duration: {remedy.duration}</span>
                    <span>Benefit: {remedy.benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guide Tab */}
      {showTab === 'guide' && (
        <div className={styles.tabContent}>
          <div className={styles.guideSections}>
            <div className={styles.guideSection}>
              <h4>✅ Do's</h4>
              <ul className={styles.guidelist}>
                {data.dos.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.activity}</strong>
                    <span className={styles.guideTiming}> ({item.timing})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.guideSection}>
              <h4>❌ Don'ts</h4>
              <ul className={styles.guidelist}>
                {data.donts.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.activity}</strong>
                    <span className={styles.guideTiming}> ({item.timing})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className={styles.source}>
        <small>
          Source: {data.source.author}, {data.source.title}
        </small>
      </div>
    </div>
  );
}
