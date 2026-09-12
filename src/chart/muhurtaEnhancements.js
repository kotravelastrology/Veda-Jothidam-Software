// Muhurta Enhancements - Auspicious timing, remedies, and event predictions
// Based on transit strength and classical muhurta principles

const TIMING_QUALITY = {
  Excellent: {
    minScore: 80,
    description: 'Highly auspicious timing',
    color: '#28a745'
  },
  Good: {
    minScore: 60,
    description: 'Generally favorable timing',
    color: '#ffc107'
  },
  Average: {
    minScore: 40,
    description: 'Moderately auspicious',
    color: '#fd7e14'
  },
  Poor: {
    minScore: 20,
    description: 'Inauspicious timing',
    color: '#dc3545'
  },
  Unfavorable: {
    minScore: 0,
    description: 'Very inauspicious',
    color: '#721c24'
  }
};

const REMEDIES = [
  {
    name: 'Mantra Chanting',
    description: 'Recite Gayatri or planet-specific mantras',
    difficulty: 1,
    duration: '40 days',
    benefit: 'Strengthens planetary positions'
  },
  {
    name: 'Gemstone Wearing',
    description: 'Wear appropriate gemstone for ruling planet',
    difficulty: 2,
    duration: 'Continuous',
    benefit: 'Amplifies positive planetary energy'
  },
  {
    name: 'Rituals & Pujas',
    description: 'Perform Graha Shanti puja for afflicted planets',
    difficulty: 3,
    duration: '1-3 months',
    benefit: 'Appeases planets and improves luck'
  },
  {
    name: 'Charity & Donation',
    description: 'Donate items/money associated with weak planets',
    difficulty: 1,
    duration: 'As needed',
    benefit: 'Reduces negative effects through karma'
  },
  {
    name: 'Fasting',
    description: 'Fast on days ruled by afflicted planets',
    difficulty: 2,
    duration: 'Weekly/Monthly',
    benefit: 'Purifies mind and balances energies'
  },
  {
    name: 'Yajnas (Fire Rituals)',
    description: 'Perform Vedic fire rituals for planetary strengthening',
    difficulty: 3,
    duration: '1 day to 1 month',
    benefit: 'Most powerful remedy for planetary doshas'
  }
];

const AUSPICIOUS_ACTIVITIES = {
  Marriage: { score: 85, duration: '2-4 hours' },
  HouseWarming: { score: 80, duration: '2-3 hours' },
  BusinessStart: { score: 75, duration: '1-2 hours' },
  Surgery: { score: 60, duration: '1-4 hours' },
  Travel: { score: 70, duration: 'Start time only' },
  Education: { score: 75, duration: '30 mins' },
  Investment: { score: 70, duration: '30 mins' },
  Naming: { score: 65, duration: '30 mins' }
};

function calculateMuhurtaScore(aspects) {
  let score = 50; // Base score

  // Analyze aspects
  if (!aspects || aspects.length === 0) {
    return score;
  }

  for (const aspect of aspects) {
    const strength = aspect.strength || 50;
    const type = aspect.aspectType;

    // Beneficial aspects increase score
    if (type === 'conjunction' || type === 'trine') {
      score += strength * 0.3;
    }
    // Neutral aspects maintain score
    else if (type === 'sextile') {
      score += strength * 0.15;
    }
    // Challenging aspects decrease score
    else if (type === 'square') {
      score -= strength * 0.2;
    } else if (type === 'opposition') {
      score -= strength * 0.25;
    }
  }

  return Math.max(0, Math.min(100, score));
}

function getTimingQuality(score) {
  for (const [quality, config] of Object.entries(TIMING_QUALITY)) {
    if (score >= config.minScore) {
      return quality;
    }
  }
  return 'Unfavorable';
}

function generateAuspiciousTimes(score) {
  const times = [];
  const today = new Date();

  // Generate 3 auspicious windows for different activities
  const activities = ['Marriage', 'BusinessStart', 'Travel'];

  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    const activityScore = (AUSPICIOUS_ACTIVITIES[activity]?.score || 70) + (score - 50) * 0.3;

    const startHour = 6 + i * 4;
    const startTime = new Date(today);
    startTime.setHours(startHour, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + 2);

    times.push({
      activity,
      startTime: startTime.toLocaleTimeString(),
      endTime: endTime.toLocaleTimeString(),
      score: Math.max(0, Math.min(100, activityScore)),
      quality: getTimingQuality(activityScore)
    });
  }

  return times;
}

function selectRemedies(score, aspectCount) {
  if (score >= 80) return []; // No remedies needed
  if (score >= 60) return REMEDIES.slice(0, 2); // Mild remedies
  if (score >= 40) return REMEDIES.slice(0, 4); // Moderate remedies
  return REMEDIES; // All remedies recommended
}

function calculateMuhurtaEnhancements(transitData) {
  const aspects = transitData.aspects || [];
  const bhuktis = transitData.bhuktis || [];

  // Calculate score
  const muhurtaScore = calculateMuhurtaScore(aspects);
  const timingQuality = getTimingQuality(muhurtaScore);

  // Generate auspicious times
  const auspiciousTimes = generateAuspiciousTimes(muhurtaScore);

  // Select remedies
  const remedies = selectRemedies(muhurtaScore, aspects.length);

  // Generate do's and don'ts
  const dos = [];
  const donts = [];

  if (muhurtaScore >= 70) {
    dos.push(
      { activity: 'Start important ventures', timing: 'Morning hours (6-10 AM)' },
      { activity: 'Launch new projects', timing: 'During Jupiter/Venus transits' },
      { activity: 'Make major decisions', timing: 'When Moon is waxing' }
    );
  } else {
    dos.push(
      { activity: 'Focus on personal development', timing: 'Any time' },
      { activity: 'Practice spiritual activities', timing: 'Sunset onwards' }
    );
  }

  if (muhurtaScore < 50) {
    donts.push(
      { activity: 'Avoid starting ventures', timing: 'Next 2-4 weeks' },
      { activity: 'Postpone major decisions', timing: 'Until score improves' },
      { activity: 'Delay surgeries/medical procedures', timing: 'If possible' }
    );
  }

  if (aspects.some(a => a.aspectType === 'opposition' || a.aspectType === 'square')) {
    donts.push(
      { activity: 'Avoid travel to unfamiliar places', timing: 'Current period' },
      { activity: 'Be cautious with finances', timing: 'During adverse aspects' }
    );
  }

  // Predictions
  const eventSuccess = Math.max(20, Math.min(95, muhurtaScore + 10));
  const karmaStrength = Math.max(30, Math.min(95, muhurtaScore));

  const predictions = {
    eventSuccess,
    karmaStrength,
    timing: muhurtaScore >= 70
      ? 'Excellent timing for important events'
      : muhurtaScore >= 50
        ? 'Moderate timing - suitable for regular activities'
        : 'Consider delaying major decisions',
    bhuktiBenefit: bhuktis[0]?.lord || 'Sun',
    daysActive: bhuktis[0]?.daysRemaining || 0
  };

  return {
    muhurtaScore,
    timingQuality,
    auspiciousTimes,
    remedies,
    dos,
    donts,
    predictions,
    source: {
      title: 'Brihat Parashara Hora Shastra',
      author: 'Sage Parashara',
      chapter: 'Muhurta (Auspicious Timing) Enhancements'
    }
  };
}

module.exports = {
  TIMING_QUALITY,
  REMEDIES,
  AUSPICIOUS_ACTIVITIES,
  calculateMuhurtaEnhancements
};
