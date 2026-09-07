'use client';

import React, { useMemo } from 'react';

interface InsightData {
  compatibilityScore?: number;
  aspectStrength?: number;
  gunaScore?: number;
  dashaStatus?: string;
  comparisonType: 'transit' | 'synastry' | 'varshaphala' | 'historical';
}

interface InsightReport {
  nativeChart: {
    name: string;
  };
  comparisonChart: {
    name: string;
  };
  analysisData: InsightData;
}

export function ComparisonInsights({ report }: { report: InsightReport }) {
  const { nativeChart, comparisonChart, analysisData } = report;

  // Generate insights based on compatibility metrics
  const insights = useMemo(() => {
    const results: Array<{
      category: string;
      title: string;
      icon: string;
      color: string;
      description: string;
      recommendations: string[];
    }> = [];

    const score = analysisData?.compatibilityScore || analysisData?.gunaScore || 50;
    const compType = analysisData?.comparisonType;

    // Overall Compatibility Insight
    if (score >= 32) {
      results.push({
        category: 'Compatibility',
        title: 'Excellent Match',
        icon: '✨',
        color: 'green',
        description: `${nativeChart.name} and ${comparisonChart.name} show excellent compatibility. Strong planetary harmony and favorable dasha combinations support this relationship.`,
        recommendations: [
          'Nurture the natural harmony',
          'Build on mutual strengths',
          'Celebrate compatible periods',
          'Plan major decisions during harmonious dashas',
        ],
      });
    } else if (score >= 27) {
      results.push({
        category: 'Compatibility',
        title: 'Good Compatibility',
        icon: '💫',
        color: 'emerald',
        description: `${nativeChart.name} and ${comparisonChart.name} demonstrate good compatibility with favorable planetary positions. Some areas require understanding and effort.`,
        recommendations: [
          'Communicate openly about differences',
          'Work through challenging periods together',
          'Leverage complementary strengths',
          'Practice patience during malefic dasha transits',
        ],
      });
    } else if (score >= 22) {
      results.push({
        category: 'Compatibility',
        title: 'Acceptable Compatibility',
        icon: '🤝',
        color: 'yellow',
        description: `${nativeChart.name} and ${comparisonChart.name} have acceptable compatibility. With mutual understanding and effort, this relationship can flourish despite some challenges.`,
        recommendations: [
          'Invest in mutual understanding',
          'Address core differences constructively',
          'Seek guidance during transition periods',
          'Focus on shared goals and values',
        ],
      });
    } else {
      results.push({
        category: 'Compatibility',
        title: 'Needs Work',
        icon: '⚠️',
        color: 'orange',
        description: `${nativeChart.name} and ${comparisonChart.name} face significant planetary challenges. However, awareness and dedicated effort can help navigate these complexities.`,
        recommendations: [
          'Seek professional astrological guidance',
          'Perform recommended remedies',
          'Be extra mindful during malefic periods',
          'Consider timing for important decisions',
        ],
      });
    }

    // Dasha-specific insights
    if (compType === 'synastry') {
      results.push({
        category: 'Relationship',
        title: 'Synastry Analysis',
        icon: '💕',
        color: 'pink',
        description: 'This is a synastry reading comparing two natal charts. Key compatibility factors include planetary overlays, aspect patterns, and Guna Milan scoring.',
        recommendations: [
          'Study planetary aspects between charts',
          'Identify strength and challenge areas',
          'Plan major relationship decisions',
          'Consider marriage compatibility through Guna Milan',
          'Perform strengthening remedies if needed',
        ],
      });
    } else if (compType === 'transit') {
      results.push({
        category: 'Current Period',
        title: 'Transit Influence',
        icon: '🌍',
        color: 'blue',
        description: 'This transit analysis shows current planetary influences on the natal chart. Transits provide timing for opportunities and challenges.',
        recommendations: [
          'Understand current dasha impact',
          'Plan activities aligned with transits',
          'Avoid starting new ventures during malefic periods',
          'Take advantage of benefic transit windows',
          'Update predictions as transits change',
        ],
      });
    } else if (compType === 'varshaphala') {
      results.push({
        category: 'Annual Period',
        title: 'Annual Chart Reading',
        icon: '📅',
        color: 'purple',
        description: 'Varshaphala analysis reveals themes and opportunities for the annual period starting from the lunar birthday.',
        recommendations: [
          'Understand annual theme and focus',
          'Plan year-long projects accordingly',
          'Monitor month-by-month transits',
          'Be mindful of challenging periods',
          'Maximize beneficial transit windows',
        ],
      });
    }

    // Growth and challenge periods
    if (score >= 27) {
      results.push({
        category: 'Growth Periods',
        title: 'Harmonious Windows',
        icon: '📈',
        color: 'green',
        description: 'Periods when both charts experience benefic influences. These windows are ideal for important decisions and relationship milestones.',
        recommendations: [
          'Schedule important conversations',
          'Plan romantic getaways',
          'Make major commitments',
          'Launch joint ventures',
          'Celebrate compatibility peaks',
        ],
      });
    }

    // Challenge periods
    if (score < 32) {
      results.push({
        category: 'Challenge Periods',
        title: 'Requires Awareness',
        icon: '🔄',
        color: 'red',
        description: 'Periods with malefic planetary influences. Awareness and preparation help navigate these times successfully.',
        recommendations: [
          'Practice patience and understanding',
          'Avoid major decisions if possible',
          'Perform strengthening remedies',
          'Seek guidance from guides/counselors',
          'Focus on communication',
          'Remember this phase is temporary',
        ],
      });
    }

    // Remedial measures
    results.push({
      category: 'Remedies & Solutions',
      title: 'Strengthening Practices',
      icon: '🛡️',
      color: 'indigo',
      description: 'Vedic remedies can strengthen weak planets and enhance compatibility. Choose those aligned with both charts.',
      recommendations: [
        'Chant mantras for weak planets',
        'Wear recommended gemstones',
        'Perform daily rituals (Puja)',
        'Observe fasting on auspicious days',
        'Donate to charity as per dasha',
        'Meditate on planetary deities',
      ],
    });

    return results;
  }, [nativeChart, comparisonChart, analysisData]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
      },
      emerald: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-700 dark:text-emerald-300',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-300',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
      },
      pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-200 dark:border-pink-800',
        text: 'text-pink-700 dark:text-pink-300',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
      },
      red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
      },
      indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-700 dark:text-indigo-300',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Detailed Comparison Insights</h2>
        <p className="text-indigo-100">
          Comprehensive analysis and recommendations for {nativeChart.name} and {comparisonChart.name}
        </p>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {insights.map((insight, idx) => {
          const colors = getColorClasses(insight.color);

          return (
            <div key={idx} className={`rounded-lg p-6 border ${colors.bg} ${colors.border}`}>
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{insight.icon}</span>
                <div className="flex-1">
                  <p className={`text-xs font-semibold uppercase tracking-wide ${colors.text} mb-1`}>
                    {insight.category}
                  </p>
                  <h3 className={`text-xl font-bold ${colors.text}`}>{insight.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-ink-soft mb-4 leading-relaxed">{insight.description}</p>

              {/* Recommendations */}
              <div>
                <p className="text-sm font-semibold text-ink mb-3">Recommendations:</p>
                <ul className="space-y-2">
                  {insight.recommendations.map((rec, ridx) => (
                    <li key={ridx} className="flex items-start gap-3">
                      <span className={`${colors.text} font-bold mt-0.5`}>→</span>
                      <span className="text-sm text-ink-soft">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span> Key Takeaways
        </h3>
        <ul className="space-y-3 text-sm text-ink-soft">
          <li className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
            <span>
              <strong>Awareness is Power:</strong> Understanding planetary influences helps navigate relationships with greater ease and purpose.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
            <span>
              <strong>No Chart is Perfect:</strong> Even challenging combinations can lead to growth and deep understanding with effort.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
            <span>
              <strong>Timing Matters:</strong> Major decisions are best made during benefic planetary periods for better outcomes.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
            <span>
              <strong>Remedies Work:</strong> Vedic practices strengthen weak planets and enhance compatibility when practiced consistently.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
            <span>
              <strong>Professional Guidance:</strong> A qualified astrologer can provide personalized recommendations tailored to your specific charts.
            </span>
          </li>
        </ul>
      </div>

      {/* Classical Reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-ink-soft">
          <strong>Sources:</strong> Brihat Parashara Hora Shastra (BPHS), Saravali, Hora Sara, and classical Vedic astrology texts on synastry,
          transits, and remedial measures.
        </p>
      </div>
    </div>
  );
}
