/**
 * VJ-014 — ephemeris request isolation.
 *
 * Acceptance: simultaneous Lahiri/other method matches serialized fixtures.
 */
const assert = require('node:assert/strict');

const {
  withEphemeris, currentEphemerisSettings, assertEphemerisSettings, resetIsolationState,
} = require('./src/ephemeris/isolation');
const { calculateChart } = require('./src/ephemeris/swissEphemeris');
const {
  setSiderealMode, SiderealMode, calculatePosition, julianDay, CalculationFlag,
} = require('@swisseph/node');

const input = {
  year: 1990, month: 5, day: 15, hour: 10, minute: 30,
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
  houseSystem: 'Porphyrius',
};
const AYANAMSHAS = ['Lahiri', 'Raman', 'Krishnamurti', 'TrueCitra'];

// ------------------------------------------------- serialized fixtures --

// Computed one at a time, with nothing else running. These are the answers
// concurrency must reproduce.
const serial = {};
for (const ayanamsa of AYANAMSHAS) {
  const chart = calculateChart({ ...input, ayanamsa });
  serial[ayanamsa] = {
    sun: chart.positions.Sun.longitude,
    moon: chart.positions.Moon.longitude,
    ascendant: chart.houses.ascendant,
  };
}

// The methods must actually differ, or this test would pass vacuously.
assert.notEqual(serial.Lahiri.sun, serial.Raman.sun);
assert.ok(Math.abs(serial.Lahiri.sun - serial.Raman.sun) > 1,
  'Lahiri and Raman should differ by more than a degree, or the test proves nothing');

// ----------------------------------- the hazard this exists to prevent --

// Without isolation, an await between setting the mode and computing lets a
// concurrent request overwrite it. Demonstrated so the fix is not cargo cult.
const jd = julianDay(1990, 5, 15, 5.0);
const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal;
async function unprotected(ayanamsa) {
  setSiderealMode(SiderealMode[ayanamsa]);
  await new Promise((r) => setImmediate(r));
  return calculatePosition(jd, 0, flags).longitude;
}

(async () => {
  const [lahiriUnsafe, ramanUnsafe] = await Promise.all([
    unprotected('Lahiri'), unprotected('Raman'),
  ]);
  assert.equal(lahiriUnsafe, ramanUnsafe,
    'the unprotected path is expected to contaminate — if this ever stops being '
    + 'true the hazard changed and this test needs revisiting');
  assert.notEqual(lahiriUnsafe.toFixed(6), serial.Lahiri.sun.toFixed(6),
    'and the Lahiri request is expected to receive the wrong answer');

  resetIsolationState();

  // ------------------------------------- isolated concurrent requests --

  /** A realistic Server Action: set settings, await something, then compute. */
  const isolatedRequest = (ayanamsa) => withEphemeris({ ayanamsa }, async () => {
    await new Promise((r) => setImmediate(r));
    const chart = calculateChart({ ...input, ayanamsa });
    await new Promise((r) => setImmediate(r));
    assertEphemerisSettings({ ayanamsa });
    return {
      ayanamsa,
      sun: chart.positions.Sun.longitude,
      moon: chart.positions.Moon.longitude,
      ascendant: chart.houses.ascendant,
    };
  });

  // Many interleaved requests across all four methods, launched together.
  const wave = [];
  for (let round = 0; round < 8; round += 1) {
    for (const ayanamsa of AYANAMSHAS) wave.push(isolatedRequest(ayanamsa));
  }
  const results = await Promise.all(wave);
  assert.equal(results.length, 32);

  for (const r of results) {
    assert.equal(r.sun, serial[r.ayanamsa].sun,
      `${r.ayanamsa}: concurrent Sun ${r.sun} != serialized fixture ${serial[r.ayanamsa].sun}`);
    assert.equal(r.moon, serial[r.ayanamsa].moon, `${r.ayanamsa}: concurrent Moon differs`);
    assert.equal(r.ascendant, serial[r.ayanamsa].ascendant, `${r.ayanamsa}: concurrent ascendant differs`);
  }

  // Every method must have actually run, or the loop proved nothing.
  assert.equal(new Set(results.map((r) => r.ayanamsa)).size, AYANAMSHAS.length);

  // --------------------------------------------------- session behaviour --

  // Sessions serialise: a second session cannot start inside the first.
  const order = [];
  const a = withEphemeris({ ayanamsha: 'Lahiri' }, async () => {
    order.push('a:start');
    await new Promise((r) => setTimeout(r, 20));
    order.push('a:end');
  });
  const b = withEphemeris({ ayanamsha: 'Raman' }, async () => {
    order.push('b:start');
    order.push('b:end');
  });
  await Promise.all([a, b]);
  assert.deepEqual(order, ['a:start', 'a:end', 'b:start', 'b:end'],
    'sessions must not interleave');

  // A failing session must not poison the queue for later ones.
  await assert.rejects(withEphemeris({ ayanamsha: 'Lahiri' }, async () => {
    throw new Error('boom');
  }), /boom/);
  const after = await withEphemeris({ ayanamsha: 'Raman' }, async () => 'still works');
  assert.equal(after, 'still works', 'a rejected session must not block the queue');

  // Nested sessions reuse the outer one rather than deadlocking.
  const nested = await withEphemeris({ ayanamsha: 'Lahiri' }, async () =>
    withEphemeris({ ayanamsha: 'Lahiri' }, async () => 'nested ok'));
  assert.equal(nested, 'nested ok');

  // But a nested session asking for a different method is a bug, not a wish.
  await assert.rejects(
    withEphemeris({ ayanamsha: 'Lahiri' }, async () =>
      withEphemeris({ ayanamsha: 'Raman' }, async () => 'should not happen')),
    /nested ephemeris session/,
  );

  // An unsupported method is refused before anything global changes.
  await assert.rejects(withEphemeris({ ayanamsha: 'Bogus' }, async () => 'x'),
    /Unsupported ayanamsha/);

  // ------------------------------------------------- contamination guard --

  await withEphemeris({ ayanamsha: 'Lahiri' }, async () => {
    assert.equal(currentEphemerisSettings().ayanamsha, 'Lahiri');
    assert.ok(assertEphemerisSettings({ ayanamsha: 'Lahiri' }));
    assert.throws(() => assertEphemerisSettings({ ayanamsha: 'Raman' }),
      /ephemeris contamination/);
  });

  console.log(JSON.stringify({
    pass: true,
    methods: AYANAMSHAS,
    concurrentRequests: results.length,
    lahiriVsRamanDegrees: Number(Math.abs(serial.Lahiri.sun - serial.Raman.sun).toFixed(6)),
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
