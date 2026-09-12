'use client';

import React, { useState } from 'react';
import styles from './PredictionEngine.module.css';

interface Prediction {
  type: string;
  description: string;
  predictedDate: string | Date;
  probability: number;
  strength: number;
  dashaLord: string;
  confidence: string;
}

interface TimelineEntry {
  date: string;
  event: string;
  probability: number;
  strength: number;
}

interface PredictionEngineData {
  events: Prediction[];
  timeline: TimelineEntry[];
  modelScores: Record<string, number>;
  overallAccuracy: number;
  confidence: string;
  source: { title: string; author: string; chapter: string };
}

export function PredictionEngineRenderer({ data }: { data: PredictionEngineData | null }) {
  const [showTab, setShowTab] = useState<'events' | 'timeline' | 'models'>('events');

  if (!data) {
    return <div className={styles.empty}>Prediction Engine data unavailable</div>;
  }

  const eventColors: Record<string, string> = {
    Career: '#FF6B35',
    Marriage: '#FF1493',
    Health: '#00CC88',
    Wealth: '#FFD700',
    Family: '#87CEEB',
    Education: '#9370DB',
    Travel: '#FF8C00',
    Spirituality: '#DDA0DD',
    Losses: '#DC143C',
    Success: '#32CD32'
  };

  const confidenceColor = {
    'Very High': '#28a745',
    'High': '#17a2b8',
    'Medium': '#ffc107',
    'Low': '#dc3545'
  };

  const confidenceEmoji = {
    'Very High': '⭐⭐⭐⭐',
    'High': '⭐⭐⭐',
    'Medium': '⭐⭐',
    'Low': '⭐'
  };

  return (
    <div className={styles.container}>
      <h3>🔮 Prediction Engine (ভবिष्यद्वाणी)</h3>

      {/* Accuracy Overview */}
      <div className={styles.accuracyBox}>
        <div className={styles.accuracyLabel}>Overall Accuracy</div>
        <div className={styles.accuracyScore}>{data.overallAccuracy.toFixed(0)}%</div>
        <div className={styles.accuracyBar}>
          <div
            className={styles.accuracyBarFill}
            style={{
              width: `${data.overallAccuracy}%`,
              backgroundColor: confidenceColor[data.confidence] || '#0066cc'
            }}
          />
        </div>
        <div className={styles.confidenceBadge} style={{ backgroundColor: confidenceColor[data.confidence] }}>
          {data.confidence} Confidence {confidenceEmoji[data.confidence]}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${showTab === 'events' ? styles.active : ''}`}
          onClick={() => setShowTab('events')}
        >
          Predicted Events ({data.events.length})
        </button>
        <button
          className={`${styles.tab} ${showTab === 'timeline' ? styles.active : ''}`}
          onClick={() => setShowTab('timeline')}
        >
          Timeline
        </button>
        <button
          className={`${styles.tab} ${showTab === 'models' ? styles.active : ''}`}
          onClick={() => setShowTab('models')}
        >
          Model Scores
        </button>
      </div>

      {/* Events Tab */}
      {showTab === 'events' && (
        <div className={styles.tabContent}>
          <div className={styles.eventsList}>
            {data.events.map((event, idx) => {
              const eventDate = typeof event.predictedDate === 'string'
                ? new Date(event.predictedDate)
                : event.predictedDate;
              return (
                <div key={idx} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <span
                      className={styles.eventType}
                      style={{ backgroundColor: eventColors[event.type] || '#999' }}
                    >
                      {event.type}
                    </span>
                    <span className={styles.eventDasha}>{event.dashaLord} Dasha</span>
                  </div>

                  <div className={styles.eventDescription}>{event.description}</div>

                  <div className={styles.eventMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.label}>Date:</span>
                      <span className={styles.value}>{eventDate.toLocaleDateString()}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Probability:</span>
                      <span className={styles.probability}>{event.probability}%</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Strength:</span>
                      <span className={styles.strength}>{event.strength}/100</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.label}>Confidence:</span>
                      <span className={styles.confidence} style={{ color: confidenceColor[event.confidence] }}>
                        {event.confidence}
                      </span>
                    </div>
                  </div>

                  <div className={styles.eventBar}>
                    <div
                      className={styles.eventBarFill}
                      style={{
                        width: `${event.probability}%`,
                        backgroundColor: eventColors[event.type] || '#999'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {showTab === 'timeline' && (
        <div className={styles.tabContent}>
          <div className={styles.timeline}>
            {data.timeline.map((entry, idx) => (
              <div key={idx} className={styles.timelineEntry}>
                <div className={styles.timelineDate}>{entry.date}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineEvent}>{entry.event}</div>
                  <div className={styles.timelineProb}>
                    Probability: {entry.probability}% | Strength: {entry.strength}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Models Tab */}
      {showTab === 'models' && (
        <div className={styles.tabContent}>
          <div className={styles.modelsList}>
            {Object.entries(data.modelScores).map(([model, score], idx) => (
              <div key={idx} className={styles.modelCard}>
                <div className={styles.modelName}>{model}</div>
                <div className={styles.modelScore}>
                  <span className={styles.scoreNumber}>{score.toFixed(0)}</span>
                  <span className={styles.scoreUnit}>/100</span>
                </div>
                <div className={styles.modelBar}>
                  <div
                    className={styles.modelBarFill}
                    style={{
                      width: `${score}%`,
                      backgroundColor: score >= 75 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
