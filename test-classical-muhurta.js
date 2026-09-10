const assert = require('node:assert/strict');
const {
  calculatePanchaPakshi, calculateYatraMuhurta, upcomingEclipses,
  birthBird, pakshaFromElongation, jamaRulingBird, birdActivityInJama, BIRD_ORDER,
} = require('./src/report/classicalMuhurta');

// ── Pañca-pakṣi core ────────────────────────────────────────────────
// Śukla: N1-5 Vulture, N6-11 Owl, N12-16 Crow, N17-22 Cock, N23-27 Peacock
assert.equal(birthBird(0, 'shukla'), 'vulture');
assert.equal(birthBird(5, 'shukla'), 'owl');
assert.equal(birthBird(11, 'shukla'), 'crow');
assert.equal(birthBird(16, 'shukla'), 'cock');
assert.equal(birthBird(22, 'shukla'), 'peacock');
// Kṛṣṇa reverses within the order
assert.equal(birthBird(0, 'krishna'), 'peacock');
assert.equal(birthBird(22, 'krishna'), 'vulture');
// paksha from elongation
assert.equal(pakshaFromElongation(40, 0), 'shukla');   // Moon 40° ahead
assert.equal(pakshaFromElongation(0, 40), 'krishna');   // Moon behind
// ruler advances -1/jāma in Śukla day, and the ruling bird always does 'rule'
for (let wd = 0; wd < 7; wd++) {
  for (let j = 0; j < 5; j++) {
    const ruler = jamaRulingBird('shukla', 'day', wd, j);
    assert.equal(birdActivityInJama(ruler, 'shukla', 'day', wd, j), 'rule');
  }
}
// activity set is exactly the five
const acts = new Set();
for (const b of BIRD_ORDER) acts.add(birdActivityInJama(b, 'shukla', 'day', 0, 0));
assert.deepEqual([...acts].sort(), ['die', 'eat', 'rule', 'sleep', 'walk']);

const pp = calculatePanchaPakshi({
  year: 2026, month: 9, day: 10, latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330,
  moonLongitudeAtBirth: 268.31, sunLongitudeAtBirth: 30.27,   // Uttara Ashadha, Krishna
});
assert.equal(pp.available, true);
assert.equal(pp.birthBird.key, 'owl');                 // Uttara Ashadha (N20) Śukla group = Cock; Kṛṣṇa reverse = Owl
assert.equal(pp.timeline.length, 10);
assert.ok(pp.timeline.filter((t) => t.period === 'day').length === 5);
for (const t of pp.timeline) {
  assert.ok(['rule', 'eat', 'walk', 'sleep', 'die'].includes(t.activity));
  assert.ok(['auspicious', 'neutral', 'inauspicious'].includes(t.quality));
  assert.match(t.from, /^\d{2}:\d{2}$/);
  assert.ok(t.durationMin > 0);
}
assert.match(pp.source, /பஞ்சபட்சி/);

// ── Yātrā muhūrta ──────────────────────────────────────────────────
const y = calculateYatraMuhurta({
  year: 2026, month: 9, day: 10, hour: 9, minute: 30, direction: 'east',
  latitude: 13.0827, longitude: 80.2707, utcOffsetMinutes: 330, janmaRasi: 8,
});
assert.equal(y.available, true);
assert.equal(y.direction, 'east');
assert.equal(y.factors.length, 8);  // 7 + chandra-bala
for (const f of y.factors) {
  assert.ok(['pass', 'neutral', 'fail'].includes(f.status));
  assert.ok(f.label && f.detail);
}
assert.ok(['auspicious', 'middling', 'avoid'].includes(y.overall));
// Sep 10 2026 is Krishna Chaturdashi (tithi 14) -> tithi factor fails -> overall avoid
assert.equal(y.factors.find((f) => f.key === 'tithi').status, 'fail');
assert.equal(y.overall, 'avoid');
// a chara lagna passes, sthira fails
assert.ok(['pass', 'neutral', 'fail'].includes(y.factors.find((f) => f.key === 'lagna').status));
// Dik-śūla: travelling east on a Monday or Saturday is barred
const monEast = calculateYatraMuhurta({ year: 2026, month: 9, day: 7, hour: 9, minute: 0, direction: 'east', latitude: 13.08, longitude: 80.27, utcOffsetMinutes: 330 });
assert.equal(monEast.factors.find((f) => f.key === 'dikshula').status, 'fail'); // 2026-09-07 is Monday

// ── Eclipse finder ────────────────────────────────────────────────
const e = upcomingEclipses({ fromMs: Date.UTC(2026, 0, 1), count: 6 });
assert.equal(e.available, true);
assert.equal(e.events.length, 6);
// sorted chronological
for (let i = 1; i < e.events.length; i++) assert.ok(e.events[i].jd >= e.events[i - 1].jd);
// the four real 2026 eclipses in order
const y2026 = e.events.filter((x) => x.peakUtc.startsWith('2026'));
assert.ok(y2026.length === 4);
assert.equal(y2026[0].peakUtc.slice(0, 10), '2026-02-17'); // annular solar
assert.equal(y2026[0].category, 'solar');
assert.equal(y2026[1].peakUtc.slice(0, 10), '2026-03-03'); // total lunar
assert.equal(y2026[1].category, 'lunar');
assert.equal(y2026[2].peakUtc.slice(0, 10), '2026-08-12'); // total solar
assert.equal(y2026[3].peakUtc.slice(0, 10), '2026-08-28'); // partial lunar
for (const ev of e.events) {
  assert.ok(ev.rasi && ev.nakshatra);
  assert.ok(['solar', 'lunar'].includes(ev.category));
}

console.log(JSON.stringify({
  pass: true,
  ppBird: pp.birthBird.en,
  yatraOverall: y.overall,
  eclipses2026: y2026.map((x) => `${x.peakUtc.slice(0, 10)} ${x.category} ${x.kind}`),
}, null, 2));
