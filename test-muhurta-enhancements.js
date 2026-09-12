const assert = require('node:assert/strict');
const { calculateMuhurtaEnhancements, REMEDIES, TIMING_QUALITY } = require('./src/chart/muhurtaEnhancements');

// --- Timing quality definitions ---
assert.ok(TIMING_QUALITY, 'TIMING_QUALITY exists');
assert.equal(Object.keys(TIMING_QUALITY).length, 5, '5 timing quality levels');
assert.ok(TIMING_QUALITY.Excellent, 'Excellent quality exists');
assert.ok(TIMING_QUALITY.Good, 'Good quality exists');
assert.ok(TIMING_QUALITY.Average, 'Average quality exists');
assert.ok(TIMING_QUALITY.Poor, 'Poor quality exists');
assert.ok(TIMING_QUALITY.Unfavorable, 'Unfavorable quality exists');

// Verify quality score ranges
assert.ok(TIMING_QUALITY.Excellent.minScore >= 80, 'Excellent starts at 80+');
assert.ok(TIMING_QUALITY.Poor.minScore < 40, 'Poor below 40');
assert.ok(TIMING_QUALITY.Unfavorable.minScore < 20, 'Unfavorable below 20');

// --- Remedies definitions ---
assert.ok(REMEDIES, 'REMEDIES exists');
assert.ok(Array.isArray(REMEDIES), 'REMEDIES is array');
assert.ok(REMEDIES.length > 0, 'REMEDIES has entries');

// Verify remedy structure
const remedy = REMEDIES[0];
assert.ok(remedy.name, 'Remedy has name');
assert.ok(remedy.description, 'Remedy has description');
assert.ok(typeof remedy.difficulty !== 'undefined', 'Remedy has difficulty');

// --- Muhurta Enhancements calculation ---
const transitData = {
  aspects: [
    { transitPlanet: 'Sun', natalPlanet: 'Moon', aspectType: 'conjunction', strength: 100 },
    { transitPlanet: 'Mars', natalPlanet: 'Saturn', aspectType: 'square', strength: 60 },
    { transitPlanet: 'Jupiter', natalPlanet: 'Venus', aspectType: 'trine', strength: 70 }
  ],
  bhuktis: [
    {
      lord: 'Jupiter',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      daysRemaining: 20
    }
  ]
};

const enhancements = calculateMuhurtaEnhancements(transitData);

// Basic structure
assert.ok(enhancements, 'Enhancements data calculated');
assert.ok(typeof enhancements.muhurtaScore === 'number', 'Muhurta score is number');
assert.ok(enhancements.muhurtaScore >= 0 && enhancements.muhurtaScore <= 100, 'Score 0-100');
assert.ok(enhancements.timingQuality, 'Timing quality exists');
assert.ok(enhancements.auspiciousTimes, 'Auspicious times exist');
assert.ok(enhancements.remedies, 'Remedies array exists');
assert.ok(enhancements.predictions, 'Predictions exist');

// Verify auspicious times
assert.ok(Array.isArray(enhancements.auspiciousTimes), 'Auspicious times is array');
for (const time of enhancements.auspiciousTimes) {
  assert.ok(time.activity, 'Time has activity');
  assert.ok(time.startTime, 'Time has start');
  assert.ok(time.endTime, 'Time has end');
  assert.ok(typeof time.score !== 'undefined', 'Time has score');
}

// Verify remedies
assert.ok(Array.isArray(enhancements.remedies), 'Remedies is array');
for (const r of enhancements.remedies) {
  assert.ok(r.name, 'Remedy has name');
  assert.ok(r.purpose, 'Remedy has purpose');
}

// Verify predictions
assert.ok(enhancements.predictions.eventSuccess, 'Has event success prediction');
assert.ok(enhancements.predictions.karmaStrength, 'Has karma strength');
assert.ok(enhancements.predictions.timing, 'Has timing prediction');

// Verify do's and don'ts
assert.ok(Array.isArray(enhancements.dos), 'Do\'s is array');
assert.ok(Array.isArray(enhancements.donts), 'Don\'ts is array');
for (const d of enhancements.dos) {
  assert.ok(d.activity, 'Do has activity');
  assert.ok(d.timing, 'Do has timing');
}

// Verify source
assert.ok(enhancements.source, 'Source exists');
assert.ok(enhancements.source.title, 'Source has title');

console.log(JSON.stringify({
  pass: true,
  muhurtaScore: enhancements.muhurtaScore.toFixed(1),
  timingQuality: enhancements.timingQuality,
  auspiciousTimes: enhancements.auspiciousTimes.length,
  recommendedRemedies: enhancements.remedies.length,
  eventSuccessProbability: enhancements.predictions.eventSuccess + '%',
  karmaStrength: enhancements.predictions.karmaStrength + '%',
  dos: enhancements.dos.length,
  donts: enhancements.donts.length
}, null, 2));
