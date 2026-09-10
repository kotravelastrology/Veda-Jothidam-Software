const assert = require('node:assert/strict');
const { computeGocharaPhala, GOCHARA_BENEFIC } = require('./src/report/gocharaPhala');

// ── House from Moon; benefic-house classification (Phaladeepika 26.3-8) ─
// Natal Moon in Aries (rasi0 = 0). Put each graha where it should be benefic.
{
  const rows = computeGocharaPhala(0, {
    Sun: 2,      // house 3 from Moon -> Sun benefic (3,6,10,11)
    Moon: 0,     // house 1 -> Moon benefic (1,3,6,7,10,11)
    Mars: 5,     // house 6 -> Mars benefic (3,6,11)
    Jupiter: 1,  // house 2 -> Jupiter benefic (2,5,7,9,11)
    Venus: 11,   // house 12 -> Venus benefic (…12)
    Mercury: 1,  // house 2 -> Mercury benefic
    Saturn: 10,  // house 11 -> Saturn benefic
    Rahu: 2,     // house 3 -> Rahu benefic
    Ketu: 5,     // house 6 -> Ketu benefic
  });
  assert.equal(rows.length, 9);
  const by = Object.fromEntries(rows.map((r) => [r.graha, r]));
  assert.equal(by.Sun.houseFromMoon, 3);
  assert.equal(by.Sun.isBenefic, true);
  // vedha slot for Sun house 3 is house 9; nothing there -> "benefic"
  assert.equal(by.Sun.vedhaHouse, 9);
  assert.equal(by.Sun.verdict, 'benefic');
  assert.equal(by.Venus.houseFromMoon, 12);
  assert.ok(GOCHARA_BENEFIC.Venus.includes(12));
}

// ── Vedha: another graha in the paired obstruction house cancels it ────
{
  // Moon in Aries (0). Sun in house 3 (rasi 2) -> benefic, vedha house 9 (rasi 8).
  // Put Mars in rasi 8 (house 9) -> obstructs -> verdict "vedha".
  const rows = computeGocharaPhala(0, { Sun: 2, Mars: 8 });
  const sun = rows.find((r) => r.graha === 'Sun');
  assert.equal(sun.verdict, 'vedha');
  assert.deepEqual(sun.obstructedBy, ['Mars']);
}

// ── Father/son exemption: Saturn does NOT obstruct the Sun (and vice versa) ─
{
  const rows = computeGocharaPhala(0, { Sun: 2, Saturn: 8 }); // Saturn in Sun's vedha house
  const sun = rows.find((r) => r.graha === 'Sun');
  assert.equal(sun.verdict, 'benefic', 'Saturn is exempt from blocking the Sun');
  assert.deepEqual(sun.obstructedBy, []);
}
{
  // Moon<->Mercury exemption: Mercury in Moon's vedha house does not block the Moon.
  // Moon in house 3 from natal Moon? put natal Moon rasi 0, transit Moon rasi 2 (house 3),
  // vedha house 9 (rasi 8); Mercury in rasi 8 -> exempt.
  const rows = computeGocharaPhala(0, { Moon: 2, Mercury: 8 });
  const mo = rows.find((r) => r.graha === 'Moon');
  assert.equal(mo.verdict, 'benefic');
}

// ── Non-benefic house -> "neutral", no vedha considered ───────────────
{
  const rows = computeGocharaPhala(0, { Jupiter: 3 }); // house 4 -> not in Jupiter's benefic list
  assert.equal(rows[0].verdict, 'neutral');
  assert.equal(rows[0].isBenefic, false);
  assert.equal(rows[0].vedhaHouse, 0);
}

console.log(JSON.stringify({ pass: true }, null, 2));
