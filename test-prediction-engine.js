const assert = require('node:assert/strict');
const { calculatePredictions, EVENT_TYPES, PREDICTION_MODELS } = require('./src/chart/predictionEngine');

// --- Event types definition ---
assert.ok(EVENT_TYPES, 'EVENT_TYPES exists');
assert.equal(Object.keys(EVENT_TYPES).length, 10, '10 event types defined');

// Verify event type structure
assert.ok(EVENT_TYPES.Career, 'Career events exist');
assert.ok(EVENT_TYPES.Marriage, 'Marriage events exist');
assert.ok(EVENT_TYPES.Health, 'Health events exist');
assert.ok(EVENT_TYPES.Wealth, 'Wealth events exist');
assert.ok(EVENT_TYPES.Family, 'Family events exist');

for (const [type, config] of Object.entries(EVENT_TYPES)) {
  assert.ok(config.name, `${type} has name`);
  assert.ok(config.indicators, `${type} has indicators`);
}

// --- Prediction models definition ---
assert.ok(PREDICTION_MODELS, 'PREDICTION_MODELS exists');
assert.ok(PREDICTION_MODELS.length > 0, 'Models exist');

// Verify model structure
const model = PREDICTION_MODELS[0];
assert.ok(model.name, 'Model has name');
assert.ok(model.description, 'Model has description');
assert.ok(typeof model.weight !== 'undefined', 'Model has weight');

// --- Predictions calculation ---
const chartData = {
  lagna: { rasi: 'Taurus', rasiIndex: 1 },
  grahas: {
    Sun: { rasi: 'Aries', rasiIndex: 0 },
    Moon: { rasi: 'Sagittarius', rasiIndex: 8 },
    Mars: { rasi: 'Scorpio', rasiIndex: 7 },
    Mercury: { rasi: 'Aries', rasiIndex: 0 },
    Jupiter: { rasi: 'Gemini', rasiIndex: 2 },
    Venus: { rasi: 'Taurus', rasiIndex: 1 },
    Saturn: { rasi: 'Capricorn', rasiIndex: 9 },
    Rahu: { rasi: 'Cancer', rasiIndex: 3 },
    Ketu: { rasi: 'Capricorn', rasiIndex: 9 }
  }
};

const dashaData = {
  dashas: [
    { lord: 'Sun', startLocal: '2025-01-01', endLocal: '2035-01-01' },
    { lord: 'Moon', startLocal: '2035-01-01', endLocal: '2045-06-01' },
    { lord: 'Mars', startLocal: '2045-06-01', endLocal: '2052-06-01' }
  ]
};

const muhurtaData = {
  muhurtaScore: 75,
  predictions: {
    eventSuccess: 80,
    karmaStrength: 75
  }
};

const predictions = calculatePredictions(chartData, dashaData, muhurtaData);

// Basic structure
assert.ok(predictions, 'Predictions calculated');
assert.ok(predictions.events, 'Events array exists');
assert.ok(Array.isArray(predictions.events), 'Events is array');
assert.ok(predictions.timeline, 'Timeline exists');
assert.ok(predictions.modelScores, 'Model scores exist');
assert.ok(predictions.overallAccuracy, 'Overall accuracy exists');

// Verify events
assert.ok(predictions.events.length > 0, 'Has predicted events');
for (const event of predictions.events) {
  assert.ok(event.type, 'Event has type');
  assert.ok(event.description, 'Event has description');
  assert.ok(event.predictedDate, 'Event has date');
  assert.ok(typeof event.probability !== 'undefined', 'Event has probability');
  assert.ok(typeof event.strength !== 'undefined', 'Event has strength');
  assert.ok(event.dashaLord, 'Event linked to dasha lord');
}

// Verify timeline
assert.ok(Array.isArray(predictions.timeline), 'Timeline is array');

// Verify model scores
assert.ok(typeof predictions.modelScores === 'object', 'Model scores is object');
assert.ok(Object.keys(predictions.modelScores).length > 0, 'Has model scores');

// Verify overall accuracy (0-100)
assert.ok(typeof predictions.overallAccuracy === 'number', 'Accuracy is number');
assert.ok(predictions.overallAccuracy >= 0 && predictions.overallAccuracy <= 100, 'Accuracy 0-100');

// Verify confidence levels
assert.ok(predictions.confidence, 'Confidence level exists');
assert.ok(['Low', 'Medium', 'High', 'Very High'].includes(predictions.confidence), 'Valid confidence');

// Verify source
assert.ok(predictions.source, 'Source exists');
assert.ok(predictions.source.title, 'Source has title');

console.log(JSON.stringify({
  pass: true,
  predictedEvents: predictions.events.length,
  overallAccuracy: predictions.overallAccuracy.toFixed(1),
  confidence: predictions.confidence,
  modelCount: Object.keys(predictions.modelScores).length,
  eventTypes: Array.from(new Set(predictions.events.map(e => e.type))),
  topEvent: predictions.events[0] ? {
    type: predictions.events[0].type,
    description: predictions.events[0].description,
    probability: predictions.events[0].probability + '%'
  } : null
}, null, 2));
