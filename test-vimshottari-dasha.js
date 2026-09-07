const assert = require('node:assert/strict');
const {
  buildVimshottariDasha, birthNakshatraAndBalance, subPeriods, orderFrom,
  NAKSHATRA_LORDS, VIMSHOTTARI_YEARS, TOTAL_YEARS,
} = require('./src/dasha/vimshottariDasha');

const closeTo = (actual, expected, tolerance, msg) => {
  assert.ok(Math.abs(actual - expected) < tolerance, `${msg}: expected ~${expected}, got ${actual}`);
};

// Nakshatra-lord table (BPHS Ch.46, file pages 409-411): spot-check both ends and Mrigasira.
assert.equal(NAKSHATRA_LORDS[0], 'Ketu'); // Ashwini
assert.equal(NAKSHATRA_LORDS[4], 'Mars'); // Mrigasira
assert.equal(NAKSHATRA_LORDS[26], 'Mercury'); // Revati
assert.equal(NAKSHATRA_LORDS.length, 27);
assert.equal(Object.values(VIMSHOTTARI_YEARS).reduce((a, b) => a + b, 0), TOTAL_YEARS);

// orderFrom cycles the fixed 9-lord sequence starting from the given lord.
assert.deepEqual(orderFrom('Venus').slice(0, 3), ['Venus', 'Sun', 'Moon']);
assert.deepEqual(orderFrom('Mercury').slice(0, 2), ['Mercury', 'Ketu']);

// birthNakshatraAndBalance: at the exact start of a nakshatra, balance = full Mahadasha years.
const atStart = birthNakshatraAndBalance(4 * (360 / 27) + 1e-6); // just inside start of Mrigasira (index 4)
assert.equal(atStart.nakshatraIndex, 4);
assert.equal(atStart.lord, 'Mars');
closeTo(atStart.balanceYears, 7, 1e-4, 'full balance at nakshatra start');

// Halfway through Mrigasira -> half of Mars's 7 years remain.
const halfway = birthNakshatraAndBalance(4 * (360 / 27) + (360 / 27) / 2);
closeTo(halfway.balanceYears, 3.5, 1e-9, 'half balance at nakshatra midpoint');

// BPHS Ch.51 v.1 worked example: Antardasha of Venus in Mahadasha of Venus = 3y4m = 3.3333 years.
const venusInVenus = subPeriods('Venus', VIMSHOTTARI_YEARS.Venus, 0)[0];
assert.equal(venusInVenus.lord, 'Venus');
closeTo(venusInVenus.durationYears, 20 * 20 / 120, 1e-9, 'Antardasha of Venus in Venus Mahadasha');
closeTo(venusInVenus.durationYears * 12, 40, 1e-6, 'Antardasha of Venus in Venus = 3y4m = 40 months');

// BPHS Ch.51 v.1 worked example: Pratyantar Dasha of Venus in Antardasha of Venus (in Mahadasha of Venus)
// = 40 x 240 / 1440 months = 6 months 20 days.
const pratyantarVenusInVenus = subPeriods('Venus', venusInVenus.durationYears, 0)[0];
closeTo(pratyantarVenusInVenus.durationYears * 12, 6 + 20 / 30, 1e-6, 'Pratyantar Dasha of Venus in Venus/Venus = 6m20d');

// BPHS Ch.51 v.1 worked example: Antardasha of Mercury in Mahadasha of Saturn = 2y8m9d.
const mercuryInSaturn = subPeriods('Saturn', VIMSHOTTARI_YEARS.Saturn, 0)
  .find((p) => p.lord === 'Mercury');
const expectedYears = 2 + 8 / 12 + 9 / 365.25;
closeTo(mercuryInSaturn.durationYears, expectedYears, 0.01, 'Antardasha of Mercury in Saturn Mahadasha = 2y8m9d');

// buildVimshottariDasha: full 9-Mahadasha cycle spans exactly 120 years when
// birth falls exactly at a nakshatra boundary (full balance, no elapsed portion).
const jd0 = 2451545.0; // arbitrary reference epoch
const full = buildVimshottariDasha(jd0, 4 * (360 / 27) + 1e-6, 330, { depth: 1 });
assert.equal(full.dashas.length, 9);
closeTo(full.dashas[8].endYears, 120, 1e-4, 'nine Mahadashas sum to 120 years');
assert.equal(full.startingLord, 'Mars');
assert.equal(full.levelNames.length, 1);
assert.equal(full.source.convention, 'Vimshottari');

// Depth controls how many nested levels appear.
const depth2 = buildVimshottariDasha(jd0, 0, 330, { depth: 2 });
assert.ok(Array.isArray(depth2.dashas[0].Bhukti));
assert.equal(depth2.dashas[0].Bhukti.length, 9);
assert.equal(depth2.dashas[0].Antara, undefined);

const depth3 = buildVimshottariDasha(jd0, 0, 330, { depth: 3 });
assert.ok(Array.isArray(depth3.dashas[0].Bhukti[0].Antara));
assert.equal(depth3.dashas[0].Bhukti[0].Antara.length, 9);

// Every period carries calendar boundaries, never a bare number.
assert.ok(depth2.dashas[0].startLocal);
assert.ok(depth2.dashas[0].endLocal);
assert.ok(depth2.dashas[0].Bhukti[0].startLocal);

assert.throws(() => buildVimshottariDasha(jd0, 0, 330, { depth: 0 }), RangeError);
assert.throws(() => buildVimshottariDasha(jd0, 0, 330, { depth: 6 }), RangeError);

console.log(JSON.stringify({
  pass: true,
  startingLord: full.startingLord,
  firstMahadasha: depth2.dashas[0],
}, null, 2));
