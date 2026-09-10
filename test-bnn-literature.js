const assert = require('node:assert/strict');
const { buildReportData } = require('./src/report/reportData');
const { computeTransitPositions } = require('./src/report/transitPositions');
const {
  calculateBnnLiterature, fromReportData, contacts, ownedHouses, relationLabel, KARAKA_LITERATURE, PLANET_IDS,
} = require('./src/report/bnnLiterature');

// ── karaka literature table ─────────────────────────────────────────
assert.deepEqual(Object.keys(KARAKA_LITERATURE), PLANET_IDS);
for (const id of PLANET_IDS) {
  const k = KARAKA_LITERATURE[id];
  assert.ok(Array.isArray(k.pages) && k.pages.length);
  for (const field of ['rao', 'gemini', 'synthesis']) {
    assert.equal(k[field].length, 2, `${id}.${field} is [ta, en]`);
    assert.ok(k[field][0].length > 10 && k[field][1].length > 10);
  }
}

// ── relationLabel ──────────────────────────────────────────────────
assert.match(relationLabel(1, true), /conjunction/i);
assert.match(relationLabel(5, true), /trine/i);
assert.match(relationLabel(7, true), /opposite/i);
assert.match(relationLabel(3, true), /special aspect/i);

// ── ownedHouses: whole-sign lordships from a synthetic Ascendant ────
const natalMesha = [{ id: 'Ascendant', longitude: 5 }]; // Aries rising
assert.deepEqual(ownedHouses(natalMesha, 'Mars').sort((a, b) => a - b), [1, 8]);   // Aries + Scorpio
assert.deepEqual(ownedHouses(natalMesha, 'Saturn').sort((a, b) => a - b), [10, 11]); // Cap + Aqua

// ── contacts: a hand-built same-sign natal pair ────────────────────
const nat = [
  { id: 'Ascendant', longitude: 15 },
  { id: 'Sun', longitude: 40 },   // Taurus 10
  { id: 'Moon', longitude: 55 },  // Taurus 25  -> same sign as Sun
  { id: 'Mars', longitude: 200 }, // Libra
];
const conj = contacts(nat, [], 'natal');
assert.equal(conj.length, 1);
assert.equal(conj[0].from.id, 'Sun');
assert.equal(conj[0].to.id, 'Moon');
assert.equal(conj[0].offset, 1);
assert.ok(Math.abs(conj[0].gap - 15) < 0.001);

// Saturn transit at Taurus 5 -> same-sign contact with Sun & Moon, 3rd/10th etc.
const sat = contacts(nat, [{ id: 'Saturn', longitude: 35 }], 'Saturn');
assert.ok(sat.some((c) => c.to.id === 'Sun' && c.offset === 1));
assert.ok(sat.every((c) => [1, 3, 5, 7, 9, 10].includes(c.offset)));

// ── full engine off a real chart ──────────────────────────────────
const rd = buildReportData({
  name: 'Test', gender: 'male', year: 1990, month: 5, day: 15, hour: 7, minute: 30,
  ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330, latitude: 11.34, longitude: 77.72, placeName: 'Erode',
});
const tp = computeTransitPositions(new Date(), { latitude: 11.34, longitude: 77.72, ayanamsha: 'Lahiri', nodeType: 'mean' });
const input = fromReportData(rd, tp);
assert.ok(input.natal.find((p) => p.id === 'Ascendant'));
assert.equal(input.natal.filter((p) => PLANET_IDS.includes(p.id)).length, 9);
assert.ok(input.transit.length >= 7);
assert.ok(input.dashaLords.length >= 1);

const bnn = calculateBnnLiterature(input);
assert.equal(bnn.available, true);
assert.deepEqual(Object.keys(bnn.karakas), PLANET_IDS);
assert.ok(Array.isArray(bnn.natalConjunctions));
for (const kind of ['Saturn', 'Jupiter', 'Rahu', 'Ketu']) {
  assert.ok(Array.isArray(bnn.transitContacts[kind]), `${kind} contacts array`);
  for (const c of bnn.transitContacts[kind]) {
    assert.equal(c.from, kind);
    assert.ok(PLANET_IDS.includes(c.to));
    assert.ok(c.relation.ta && c.relation.en);
    assert.ok(typeof c.gap === 'number');
    assert.ok(c.natalHouse >= 1 && c.natalHouse <= 12);
    assert.ok(Array.isArray(c.ownedHouses));
    for (const r of c.readings) {
      assert.ok(r.source.title && r.source.page, 'every reading cites a source');
      assert.ok(r.support.ta || r.challenge.ta, 'reading has at least one branch');
    }
  }
}
assert.ok(bnn.caveat.ta && bnn.caveat.en);

// at least some contact should carry a reading (Sa/Ju always aspect several signs)
const anyReading = ['Saturn', 'Jupiter', 'Rahu', 'Ketu']
  .flatMap((k) => bnn.transitContacts[k])
  .some((c) => c.readings.length > 0);
assert.ok(anyReading, 'the engine produced at least one cited reading');

console.log(JSON.stringify({
  pass: true,
  natalConjunctions: bnn.natalConjunctions.length,
  saturn: bnn.transitContacts.Saturn.length,
  jupiter: bnn.transitContacts.Jupiter.length,
  rahu: bnn.transitContacts.Rahu.length,
  ketu: bnn.transitContacts.Ketu.length,
  dashaLords: input.dashaLords,
}, null, 2));
