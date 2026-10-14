/**
 * Solar returns — annual, monthly, daily, at the natal and the local place.
 *
 * The solver is checked independently: for each instant it returns, the
 * ephemeris is asked back where the Sun actually was, and that must be the
 * target longitude. A test that only compared the solver against itself would
 * prove it is deterministic, not that it is right.
 *
 * The conventions behind the monthly and daily steps are a different kind of
 * claim and are tested as such — that they are declared, labelled, and gated.
 */
const assert = require('node:assert/strict');

const {
  RETURN_KINDS, KIND_IDS, SIDEREAL_YEAR_DAYS,
  sunSiderealLongitude, findSunAtLongitude, returnSeries,
  castReturnChart, castAtBothPlaces, assertReturnPromotable,
} = require('./src/report/solarReturns');

const DAY_MS = 86400000;
const CHENNAI = { name: 'சென்னை', latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330 };
const LONDON = { name: 'London', latitude: 51.5072, longitude: -0.1276, utcOffsetMinutes: 60 };

const birthUtc = Date.UTC(1990, 4, 15, 10, 30) - 330 * 60000;
const natalSun = sunSiderealLongitude(birthUtc);

const wrapped = (a, b) => Math.abs((((a - b + 180) % 360) + 360) % 360 - 180);
/** Under a thousandth of a degree is under four arcseconds. */
const ARCSEC_TOL = 1e-3;

// ------------------------------------------- the solver lands where it says --

assert.ok(natalSun > 30 && natalSun < 31, `natal Sun ${natalSun}`);

for (const target of [natalSun, 0, 90.5, 180, 359.99]) {
  const at = findSunAtLongitude(target, birthUtc + 1000 * DAY_MS);
  const actual = sunSiderealLongitude(at);
  assert.ok(wrapped(actual, target) < ARCSEC_TOL,
    `asked for ${target}°, landed at ${actual}° (${new Date(at).toISOString()})`);
}

// Searching from a different starting point finds a crossing that is still a
// crossing — the Sun reaches every longitude once a year.
const early = findSunAtLongitude(natalSun, birthUtc + 400 * DAY_MS);
const late = findSunAtLongitude(natalSun, birthUtc + 4000 * DAY_MS);
assert.ok(wrapped(sunSiderealLongitude(early), natalSun) < ARCSEC_TOL);
assert.ok(wrapped(sunSiderealLongitude(late), natalSun) < ARCSEC_TOL);
// ...and those crossings are a whole number of years apart.
const yearsBetween = (late - early) / (SIDEREAL_YEAR_DAYS * DAY_MS);
assert.ok(Math.abs(yearsBetween - Math.round(yearsBetween)) < 0.01,
  `two returns should be a whole number of years apart, got ${yearsBetween}`);

assert.throws(() => findSunAtLongitude('x', birthUtc), /targetLongitude must be a number/);
assert.throws(() => findSunAtLongitude(0, NaN), /nearUtcMs must be a number/);

// ------------------------------------------------------- annual return ------

const annual = returnSeries({
  natalSunLongitude: natalSun, fromUtcMs: birthUtc + 35 * SIDEREAL_YEAR_DAYS * DAY_MS,
  kindId: 'annual', count: 3,
});
assert.equal(annual.instants.length, 3);
for (const i of annual.instants) {
  assert.ok(wrapped(sunSiderealLongitude(i.utcMs), natalSun) < ARCSEC_TOL,
    'every annual return puts the Sun back at its natal longitude');
}
// Consecutive annual returns are one sidereal year apart.
for (let n = 1; n < annual.instants.length; n += 1) {
  const gap = (annual.instants[n].utcMs - annual.instants[n - 1].utcMs) / DAY_MS;
  assert.ok(Math.abs(gap - SIDEREAL_YEAR_DAYS) < 0.05, `annual gap ${gap} days`);
}

// ------------------------------------------------------ monthly returns -----

const monthly = returnSeries({
  natalSunLongitude: natalSun, fromUtcMs: annual.instants[0].utcMs,
  kindId: 'monthly', count: 13,
});

for (const i of monthly.instants) {
  assert.ok(wrapped(sunSiderealLongitude(i.utcMs), i.targetLongitude) < ARCSEC_TOL,
    `monthly step ${i.step}: Sun not at its target`);
}

// The invariant that makes 30° the right step: twelve of them close the circle,
// so step 12 is the *next annual return* and nothing else.
const twelfth = monthly.instants[12];
assert.ok(wrapped(twelfth.targetLongitude, natalSun) < 1e-9,
  'the twelfth 30° step returns to the natal longitude');
const nextAnnual = annual.instants[1];
assert.ok(Math.abs(twelfth.utcMs - nextAnnual.utcMs) < 60000,
  'the twelfth monthly return and the next annual return are the same instant');

// The months are not equal in length: the Sun covers 30° faster near
// perihelion. A solver that assumed equal months would be wrong by days.
const gaps = monthly.instants.slice(1).map((i, n) => (i.utcMs - monthly.instants[n].utcMs) / DAY_MS);
assert.ok(Math.max(...gaps) - Math.min(...gaps) > 1.5,
  `solar months should differ in length; spread was ${(Math.max(...gaps) - Math.min(...gaps)).toFixed(2)} days`);
assert.ok(Math.min(...gaps) > 28 && Math.max(...gaps) < 33, `month lengths ${gaps.map((g) => g.toFixed(1))}`);

// ------------------------------------------------------- daily returns ------

const daily = returnSeries({
  natalSunLongitude: natalSun, fromUtcMs: annual.instants[0].utcMs,
  kindId: 'daily', count: 6,
});
for (const i of daily.instants) {
  assert.ok(wrapped(sunSiderealLongitude(i.utcMs), i.targetLongitude) < ARCSEC_TOL,
    `daily step ${i.step}: Sun not at its target`);
}
const dayGaps = daily.instants.slice(1).map((i, n) => (i.utcMs - daily.instants[n].utcMs) / DAY_MS);
for (const g of dayGaps) assert.ok(g > 0.97 && g < 1.03, `daily gap ${g} days`);

// Steps are solved from the mean rate each time, not chained from the last
// solved instant, so error cannot accumulate along a long series.
const far = returnSeries({
  natalSunLongitude: natalSun, fromUtcMs: annual.instants[0].utcMs, kindId: 'daily', count: 2,
});
assert.ok(Math.abs(far.instants[1].utcMs - daily.instants[1].utcMs) < 1000);

// --------------------------------------------- conventions are declared -----

assert.deepEqual(KIND_IDS, ['annual', 'monthly', 'daily']);
for (const id of KIND_IDS) {
  const k = RETURN_KINDS[id];
  assert.ok(k.nameTa && /[஀-௿]/.test(k.nameTa), `${id}: a Tamil name`);
  assert.ok(k.convention && k.convention.length > 40, `${id}: the step must be stated in words`);
  assert.ok(k.stepDegrees > 0);
}

// The annual return is unambiguous and needs no text. The other two are
// conventions nobody has checked, and they are gated accordingly.
assert.equal(RETURN_KINDS.annual.sourceStatus, 'VERIFIED');
assert.doesNotThrow(() => assertReturnPromotable('annual'));
for (const id of ['monthly', 'daily']) {
  assert.equal(RETURN_KINDS[id].sourceStatus, 'CONVENTION_UNVERIFIED');
  assert.throws(() => assertReturnPromotable(id), /not source-verified/);
  assert.doesNotThrow(() => assertReturnPromotable(id, { allowUnverified: true }));
}
assert.throws(() => assertReturnPromotable('weekly'), /unknown return kind/);

// Twelve monthly steps of 30° is a closed circle, and the daily step is one
// sidereal year divided by its own length. Both are asserted so the declared
// convention and the arithmetic cannot drift apart.
assert.equal(RETURN_KINDS.monthly.stepDegrees * 12, 360);
assert.ok(Math.abs(RETURN_KINDS.daily.stepDegrees * SIDEREAL_YEAR_DAYS - 360) < 1e-9);

assert.throws(() => returnSeries({ natalSunLongitude: 0, fromUtcMs: 0, kindId: 'nope' }), /unknown return kind/);
assert.throws(() => returnSeries({ natalSunLongitude: 0, fromUtcMs: 0, kindId: 'annual', count: 0 }), /count must be/);

// ------------------------------------------- natal place vs local place -----

const both = castAtBothPlaces({
  utcMs: annual.instants[0].utcMs, natalPlace: CHENNAI, localPlace: LONDON,
});

// Same moment: the grahas are where they are, wherever you stand.
for (const id of Object.keys(both.natal.grahas)) {
  assert.ok(Math.abs(both.natal.grahas[id].longitude - both.local.grahas[id].longitude) < 1e-9,
    `${id} must have the same longitude at both places`);
}
// ...but the Lagna and therefore every house-based reading differ. That is the
// entire reason PL9 prints the pair.
assert.ok(Math.abs(both.natal.lagna.longitude - both.local.lagna.longitude) > 1,
  'a different place must give a different Lagna');
assert.notEqual(both.natal.localTime, both.local.localTime, 'different zones read different clocks');

const housesDiffer = Object.keys(both.natal.grahas)
  .some((id) => both.natal.grahas[id].house !== both.local.grahas[id].house);
assert.ok(housesDiffer, 'a different Lagna must move at least one graha to another house');

// A local place is optional: with none, only the natal-place chart is cast.
const natalOnly = castAtBothPlaces({ utcMs: annual.instants[0].utcMs, natalPlace: CHENNAI });
assert.equal(natalOnly.local, null);
assert.ok(natalOnly.natal.lagna.rasi);

assert.throws(() => castReturnChart({ utcMs: 0, place: { latitude: 1 } }), /needs latitude and longitude/);

// The ayanamsha is honoured. sunSiderealLongitude once passed a misspelt key to
// the ephemeris (ayanamsha for ayanamsa), which was ignored, so every crossing
// was found under Lahiri whatever was asked for — silently, because Lahiri is
// also the default. Raman sits about 1.4 degrees past Lahiri; a return found
// under Raman must be where the Sun is at the natal Raman longitude.
{
  const t0 = Date.UTC(2020, 5, 1);
  const lah = sunSiderealLongitude(t0, 'Lahiri');
  const ram = sunSiderealLongitude(t0, 'Raman');
  const diff = ((ram - lah + 540) % 360) - 180;
  assert.ok(diff > 1.0 && diff < 2.0, `Raman is about 1.4 degrees past Lahiri, got ${diff.toFixed(3)}`);

  const target = sunSiderealLongitude(Date.UTC(1990, 4, 15, 5), 'Raman');
  const r = returnSeries({
    natalSunLongitude: target, fromUtcMs: Date.UTC(2020, 4, 15), kindId: 'annual', count: 1, ayanamsha: 'Raman',
  });
  const back = sunSiderealLongitude(r.instants[0].utcMs, 'Raman');
  assert.ok(Math.abs(((back - target + 540) % 360) - 180) < 1e-3,
    'the Sun under Raman is at the natal Raman longitude at the return found under Raman');
  const asLahiri = returnSeries({
    natalSunLongitude: target, fromUtcMs: Date.UTC(2020, 4, 15), kindId: 'annual', count: 1, ayanamsha: 'Lahiri',
  });
  assert.ok(Math.abs(asLahiri.instants[0].utcMs - r.instants[0].utcMs) > 0.5 * 86400000,
    'the same target longitude is reached on a different day under a different ayanamsha');
}

console.log(JSON.stringify({
  pass: true,
  natalSun: Number(natalSun.toFixed(6)),
  annual: annual.instants.map((i) => i.utcIso.slice(0, 16)),
  monthLengthDays: gaps.map((g) => Number(g.toFixed(2))),
  dailyGapDays: dayGaps.map((g) => Number(g.toFixed(4))),
  natalLagna: both.natal.lagna.rasi,
  localLagna: both.local.lagna.rasi,
  gated: KIND_IDS.filter((id) => RETURN_KINDS[id].sourceStatus !== 'VERIFIED'),
}, null, 2));
