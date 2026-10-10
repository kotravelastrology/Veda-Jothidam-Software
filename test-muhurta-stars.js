const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('./src/report/muhurtaStarTables');
const { muhurtaStarChecks, personalOf, lattaOf, lordsFriendly, taraOf, chandraOf, taraVerdict, chandraPresent, STAR_CUTS, MAX_DAYS } = require('./src/report/muhurtaStars');
const { kickedStar } = require('./src/report/lattaTables');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/muhurta-stars/books.json'), 'utf8'));
const plain = (o) => JSON.parse(JSON.stringify(o));

// ------------------------------------------------ the counts: Muhurta Chintamani VI.56 ---
{
  const V = FIX.verseMC_VI56;
  for (const [p, n] of Object.entries(V.backward)) assert.deepEqual([T.KICKS[p].count, T.KICKS[p].dir], [n, -1], p);
  for (const [p, n] of Object.entries(V.forward)) assert.deepEqual([T.KICKS[p].count, T.KICKS[p].dir], [n, 1], p);
  assert.deepEqual([...T.KICKERS].sort(), ['Jupiter', 'Mars', 'Mercury', 'Rahu', 'Saturn', 'Sun', 'Venus'], 'the Moon cannot kick her own star; no Ketu');
  // The books' worked examples.
  for (const e of FIX.examples) {
    const dir = e.rahu ? T.RAHU_DIRECTION[e.rahu].dir : T.KICKS[e.planet].dir;
    assert.equal(kickedStar(e.in, T.KICKS[e.planet].count, dir), e.kicks, `${e.book} p.${e.page}: ${e.planet} in ${e.in}`);
  }
  // Rangacharya's Swati: all eight kick it — with Rahu counted backward, against his own rule's wording.
  const R = FIX.rangacharyaSwati;
  for (const [p, s] of Object.entries(R.kickerStars)) assert.equal(kickedStar(s, T.KICKS[p].count, T.KICKS[p].dir), R.marriageStar, `Rangacharya: ${p}`);
  assert.notEqual(kickedStar(R.kickerStars.Rahu, 9, 1), R.marriageStar);
  // Shridhar's table: the kicked star counted forward (the star kicked from Ashwini, as a count).
  for (const [p, n] of Object.entries(FIX.shridharForwardEquivalents)) assert.equal(kickedStar(0, T.KICKS[p].count, T.KICKS[p].dir) + 1, n, `Shridhar's table: ${p}`);
}

// ------------------------------------------------ the quarter rules ---
{
  const kp = (o) => ({ Sun: 100, Mars: 100, Jupiter: 100, Saturn: 100, Mercury: 100, Venus: 100, Rahu: 100, ...o });
  // The Sun in Ashwini 1 kicks Uttaraphalguni (Joshi's example): pada 1 = same quarter and the 1st (forward).
  const h1 = lattaOf(44, kp({ Sun: 0 })).filter((h) => h.planet === 'Sun');
  assert.deepEqual(h1.map((h) => [h.sameQuarter, h.jvQuarter, h.kickerPada]), [[true, true, 1]]);
  const h2 = lattaOf(45, kp({ Sun: 0 })).filter((h) => h.planet === 'Sun');
  assert.deepEqual(h2.map((h) => [h.sameQuarter, h.jvQuarter]), [[false, false]], 'Uttaraphalguni 2: whole-star rule only');
  // The Sun in Ashwini 3: same quarter is pada 3; Jyotirvidabharana's is still pada 1.
  assert.deepEqual(lattaOf(46, kp({ Sun: 2 })).filter((h) => h.planet === 'Sun').map((h) => [h.sameQuarter, h.jvQuarter]), [[true, false]]);
  // Mercury (backward) — Jyotirvidabharana's is the last quarter.
  assert.deepEqual(lattaOf(3, kp({ Mercury: 24 })).filter((h) => h.planet === 'Mercury').map((h) => [h.jvQuarter, h.sameQuarter]), [[true, false]]);
  // Rahu in Ashwini: Poorvashadha backward, Ashlesha forward — each tagged.
  assert.deepEqual(lattaOf(76, kp({ Rahu: 0 })).filter((h) => h.planet === 'Rahu').map((h) => h.rahu), ['BACKWARD']);
  assert.deepEqual(lattaOf(32, kp({ Rahu: 0 })).filter((h) => h.planet === 'Rahu').map((h) => h.rahu), ['FORWARD']);
}

// ------------------------------------------------ the person's checks ---
{
  const K = FIX.kalyanramanPadas;
  const J = K.janma[0] * 4 + K.janma[1] - 1;
  const at = (star, pada) => star * 4 + pada - 1;
  assert.equal(personalOf(J, at(...K.pada88)).PADA_88, true, 'Aswini 1: Sravana 4 is the 88th');
  assert.equal(personalOf(J, at(...K.pada108)).PADA_108, true, 'Aswini 1: Revati 4 is the 108th');
  assert.deepEqual(plain(personalOf(J, J)), { JANMA: true, JANMA_PADA: true, PADA_88: false, PADA_108: false, VAINASHIKA: { STAR_23: false, STAR_22: false, PADA88_STAR: false } });
  // Vainashika: for a 1st-pada birth the 88th pada's star is the 22nd; for later padas the 23rd.
  assert.deepEqual(plain(personalOf(J, at(21, 1)).VAINASHIKA), { STAR_23: false, STAR_22: true, PADA88_STAR: true });
  assert.deepEqual(plain(personalOf(J + 1, at(22, 1)).VAINASHIKA), { STAR_23: true, STAR_22: false, PADA88_STAR: true });
  for (let s = 0; s < 27; s += 1) {
    const star88 = Math.floor(((s * 4) + 87) % 108 / 4);
    assert.equal(star88, (s + 21) % 27, 'pada 1 → 22nd');
    for (let q = 1; q < 4; q += 1) assert.equal(Math.floor(((s * 4 + q) + 87) % 108 / 4), (s + 22) % 27, 'padas 2-4 → 23rd');
  }
  const STARS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purvaphalguni', 'Uttaraphalguni', 'Hasta', 'Chitta', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
    'Purvashadha', 'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purvabhadrapada', 'Uttarabhadrapada', 'Revati'];
  assert.deepEqual([...T.VAINASHIKA.STAR_22.wilhelmExempt], FIX.wilhelmExemptStars.map((n) => STARS.indexOf(n)), 'Wilhelm\'s exceptions');
  // The remedy: lagna lord and 10th lord friends both ways, or one planet.
  assert.equal(lordsFriendly(7).friends, true, 'Scorpio: Mars and the Sun');
  assert.equal(lordsFriendly(5).friends, true, 'Virgo: Mercury both');
  assert.equal(lordsFriendly(0).friends, false, 'Aries: Mars and Saturn — neutral');
  assert.equal(lordsFriendly(4).friends, false, 'Leo: the Sun and Venus — enemies');
  assert.equal(lordsFriendly(8).friends, false, 'Sagittarius: Jupiter and Mercury');
}

// ------------------------------------------------ order by words; defaults are the first book's ---
{
  for (const [k, rank] of [['latta', T.LATTA_RANK], ['personal', T.PERSONAL_RANK]]) {
    assert.deepEqual(plain(rank.words), FIX.words[k]);
    assert.deepEqual([...rank.order], Object.keys(rank.words).sort((a, b) => rank.words[b] - rank.words[a]));
    assert.equal(rank.order[0], 'SHRIDHAR');
  }
  assert.deepEqual([T.RAHU_DIRECTION.default, T.PADA_RULES.default, T.VAINASHIKA.default], ['BACKWARD', 'WHOLE', 'STAR_23'], 'Shridhar\'s choices');
  const cites = [];
  const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
  walk(T);
  assert.ok(cites.length >= 20);
  for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);
  assert.ok(T.LATTA_SOURCES.MUHURTA_CHINTAMANI_64.pageLocus.includes('नेष्टोऽङ्घ्रिः खेटपत्समः'));
  assert.ok(T.LATTA_SOURCES.MUHURTA_CHINTAMANI.pageLocus.includes('स्वपृष्ठे'));
}

// ------------------------------------------------ Tara bala ---
{
  const sliceAt = (frac) => STAR_CUTS.findLastIndex((c) => frac >= c);
  for (const e of FIX.taraExamples) {
    const t = taraOf(e.janma, e.star, 0);
    assert.deepEqual([t.count, t.n], [e.count, e.tara], `${e.book}: ${e.note}`);
    if (e.cycle) assert.equal(t.cycle, e.cycle);
  }
  // Joshi's table for a Mrigashira birth, all 27 stars, and what he says to avoid under the thirds rule.
  const J = FIX.joshiMrigashira;
  J.triads.forEach((triad, c) => triad.forEach((_, i) => {
    const t = taraOf(J.janma, (J.janma + c * 9 + i) % 27, 0);
    assert.deepEqual([t.cycle, t.n], [c + 1, i + 1]);
  }));
  for (const star of J.fullyAvoid) {
    for (const f of [0, 0.4, 0.9]) assert.equal(taraVerdict(taraOf(J.janma, star, sliceAt(f)), 'T357', 'THIRDS'), 'REJECT', `star ${star}`);
  }
  for (const [star, third] of Object.entries(J.thirds)) {
    for (let k = 0; k < 3; k += 1) {
      const t = taraOf(J.janma, Number(star), sliceAt(k / 3 + 0.01));
      assert.equal(taraVerdict(t, 'T357', 'THIRDS'), k === third ? 'REJECT' : null, `Joshi: star ${star}, third ${k}`);
    }
  }
  // The second round under the quarter rule: Vipat's 1st, Pratyak's 4th, Vadha's 3rd pada (MC verse 13).
  const Q = FIX.secondRoundQuarters;
  assert.ok(T.TARA_SOURCES.MUHURTA_CHINTAMANI.pageLocus.includes(Q.MUHURTA_CHINTAMANI_verse));
  for (const [n, q] of [[3, Q.Vipat], [5, Q.Pratyak], [7, Q.Vadha]]) {
    for (let p = 1; p <= 4; p += 1) {
      const t = taraOf(0, 9 + n - 1, sliceAt((p - 1) / 4 + 0.01));
      assert.equal(t.cycle, 2);
      assert.equal(taraVerdict(t, 'T1357', 'QUARTERS'), p === q ? 'REJECT' : null, `tara ${n} pada ${p}`);
    }
    assert.equal(taraVerdict(taraOf(0, 18 + n - 1, 0), 'T1357', 'QUARTERS'), null, 'third round: no evil');
    assert.equal(taraVerdict(taraOf(0, 18 + n - 1, 0), 'T1357', 'FULL'), 'REJECT', 'Raman\'s advice: avoid always');
  }
  // The birth group: rejected in round 1 by the 1-3-5-7 reading, a caution later, nothing in the 3-5-7 reading.
  assert.equal(taraVerdict(taraOf(0, 0, 0), 'T1357', 'QUARTERS'), 'REJECT');
  assert.equal(taraVerdict(taraOf(0, 9, 0), 'T1357', 'QUARTERS'), 'CAUTION');
  assert.equal(taraVerdict(taraOf(0, 0, 0), 'T357', 'QUARTERS'), null);
  // Raman's urgent rule: only the first 7, 3, 8, 6 ghatis (of 60) of Janma, Vipat, Pratyak, Naidhana.
  for (const [n, g] of Object.entries(FIX.ramanGhatis)) {
    assert.equal(T.TARA_CYCLES.GHATI.ghatis[n], g);
    assert.equal(taraVerdict(taraOf(0, Number(n) - 1, sliceAt(0)), 'T1357', 'GHATI'), 'REJECT', `tara ${n} at its start`);
    assert.equal(taraVerdict(taraOf(0, Number(n) - 1, sliceAt(g / 60 + 0.001)), 'T1357', 'GHATI'), null, `tara ${n} after ${g} ghatis`);
  }
  // The star cuts include every boundary the rules use.
  for (const f of [3 / 60, 6 / 60, 7 / 60, 8 / 60, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4]) assert.ok(STAR_CUTS.includes(f), String(f));
  assert.deepEqual(plain(T.TARA_RANK.words), FIX.taraWords);
  assert.deepEqual([...T.TARA_RANK.order], Object.keys(FIX.taraWords).sort((a, b) => FIX.taraWords[b] - FIX.taraWords[a]));
  assert.deepEqual([T.TARA_BAD.default, T.TARA_CYCLES.default], ['T1357', 'QUARTERS'], 'Wilhelm\'s: 1, 3, 5, 7 unfavourable; the quarters in round 2');
}

// ------------------------------------------------ Chandra bala ---
{
  const V = FIX.moonVedha;
  assert.deepEqual(plain(T.MOON_VEDHA), Object.fromEntries(Object.entries(V.MC_p102).map(([h, v]) => [h, v])));
  assert.deepEqual(plain(T.MOON_VEDHA_BRIGHT), V.joshiBright);
  assert.notEqual(V.shridharBright5, V.joshiBright['5'], 'Shridhar differs on the 5th (recorded)');
  assert.deepEqual(Object.keys(T.MOON_VEDHA).map(Number).sort((a, b) => a - b), [...FIX.chandraLists.joshiGood].sort((a, b) => a - b));
  const none = { Sun: 0, Mars: 0, Jupiter: 0, Saturn: 0, Mercury: 0, Venus: 0, Rahu: 0, Ketu: 6 };
  // Natal Moon in Mesha. The Moon in the 3rd: good — unless a planet (not Mercury) is in the 9th.
  assert.equal(chandraPresent(chandraOf(0, 2, 'KRISHNA', 5, { ...none, Sun: 1 }), 'GOOD_LIST'), true);
  assert.equal(chandraPresent(chandraOf(0, 2, 'KRISHNA', 5, { ...none, Saturn: 8 }), 'GOOD_LIST'), false);
  assert.deepEqual(chandraOf(0, 2, 'KRISHNA', 5, { ...none, Mercury: 8, Sun: 1 }).vedhaBy, [], 'Mercury causes the Moon no vedha');
  // The 5th: good only in the bright half, unless a planet is in the 4th (Joshi).
  assert.equal(chandraPresent(chandraOf(0, 4, 'SHUKLA', 9, { ...none, Sun: 1 }), 'GOOD_LIST'), true);
  assert.equal(chandraPresent(chandraOf(0, 4, 'KRISHNA', 9, { ...none, Sun: 1 }), 'GOOD_LIST'), false);
  assert.equal(chandraPresent(chandraOf(0, 4, 'SHUKLA', 9, { ...none, Jupiter: 3 }), 'GOOD_LIST'), false);
  // The other readings by house alone.
  for (let h = 1; h <= 12; h += 1) {
    const c = chandraOf(0, h - 1, 'KRISHNA', 1, none);
    assert.equal(chandraPresent(c, 'BAD_6_8_12'), !FIX.chandraLists.raman.includes(h), `Raman ${h}`);
    assert.equal(chandraPresent(c, 'BAD_4_8'), !FIX.chandraLists.rangacharyaEvil.includes(h), `Rangacharya ${h}`);
    assert.equal(chandraPresent(c, 'BAD_4_8_12'), !FIX.chandraLists.kalyanraman.includes(h), `Kalyanraman ${h}`);
  }
  // Chandrashtama: Wilhelm's kinds by the tara count; the 8th never has Chandra bala.
  const W = FIX.wilhelmChandrashtama;
  for (const k of ['14', '15', '16', '17', '18']) {
    const c = chandraOf(0, 7, 'SHUKLA', Number(k), none);
    assert.equal(c.chandrashtama, k);
    assert.equal(T.CHANDRASHTAMA_KINDS[k].harmless, W.harmless.includes(Number(k)), W[k]);
    for (const r of T.CHANDRA_READINGS.order) assert.equal(chandraPresent(c, r), false);
  }
  assert.equal(chandraOf(0, 7, 'SHUKLA', 19, none).chandrashtama, 'THIRD');
  assert.deepEqual(plain(T.CHANDRA_RANK.words), FIX.chandraWords);
  assert.deepEqual([...T.CHANDRA_RANK.order], Object.keys(FIX.chandraWords).sort((a, b) => FIX.chandraWords[b] - FIX.chandraWords[a]));
  assert.equal(T.CHANDRA_READINGS.default, 'GOOD_LIST', 'Joshi first among the books that give a list');
}

// ------------------------------------------------ the windows, against the sky ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T00:00:00Z');
  const toMs = fromMs + 20 * DAY;
  const natal = 45.5; // Rohini 2
  const r = muhurtaStarChecks({ natalMoonLongitude: natal, fromMs, toMs, latitude: 11.34, longitude: 77.72, atMs: fromMs + DAY });
  assert.deepEqual([r.janma.starTa, r.janma.pada, r.janma.pada88.pada, r.janma.pada108.pada], ['ரோகிணி', 2, 1, 1]);
  // Contiguous, covering the period.
  assert.equal(Date.parse(r.segments[0].fromUtc), fromMs);
  assert.equal(Date.parse(r.segments[r.segments.length - 1].toUtc), toMs);
  for (let i = 1; i < r.segments.length; i += 1) assert.equal(r.segments[i].fromUtc, r.segments[i - 1].toUtc);
  assert.equal(r.segments.filter((s) => s.current).length, 1);
  // Every segment: recompute from the ephemeris at its middle.
  const jd = (ms) => ms / DAY + 2440587.5;
  const padaAt = (p, ms) => Math.floor(((p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : planetLongitude(jd(ms), p, 'Lahiri')) % 360 + 360) % 360 / (360 / 108)) % 108;
  for (const s of r.segments) {
    const a = Date.parse(s.fromUtc);
    const b = Date.parse(s.toUtc);
    const mid = (a + b) / 2;
    const mp = padaAt('Moon', mid);
    assert.equal(mp, s.star * 4 + s.pada - 1, s.fromUtc);
    const kp = Object.fromEntries(T.KICKERS.map((p) => [p, padaAt(p, mid)]));
    assert.deepEqual(plain(s.latta), plain(lattaOf(mp, kp)), `latta ${s.fromUtc}`);
    assert.deepEqual(plain(s.personal), plain(personalOf(Math.floor(natal / (360 / 108)), mp)), `personal ${s.fromUtc}`);
    // The Moon is in that pada just inside both ends (boundaries to the minute).
    if (b - a > 4 * 60000) {
      assert.equal(padaAt('Moon', a + 90000), mp, `start ${s.fromUtc}`);
      assert.equal(padaAt('Moon', b - 90000), mp, `end ${s.toUtc}`);
    }
    assert.equal(s.remedy88 !== null, s.personal.PADA_88);
    // Tara and Chandra: recomputed from the sky at the middle; each reading's verdict holds at both ends too.
    const moonLon = (ms) => ((planetLongitude(jd(ms), 'Moon', 'Lahiri') % 360) + 360) % 360;
    const sunLon = (ms) => ((planetLongitude(jd(ms), 'Sun', 'Lahiri') % 360) + 360) % 360;
    const STARW = 360 / 27;
    const taraAt = (ms) => {
      const l = moonLon(ms);
      const st = Math.floor(l / STARW);
      return taraOf(Math.floor(natal / STARW), st, STAR_CUTS.findLastIndex((c) => (l - st * STARW) / STARW >= c));
    };
    assert.equal(s.tara.count, taraAt(mid).count);
    const sign = (p, ms) => Math.floor((p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : planetLongitude(jd(ms), p, 'Lahiri')) / 30) % 12;
    const signs = Object.fromEntries(T.KICKERS.map((p) => [p, sign(p, mid)]));
    signs.Ketu = (signs.Rahu + 6) % 12;
    const paksha = ((moonLon(mid) - sunLon(mid) + 360) % 360) < 180 ? 'SHUKLA' : 'KRISHNA';
    assert.deepEqual(plain(s.chandra), plain(chandraOf(Math.floor(natal / 30), Math.floor(moonLon(mid) / 30), paksha, s.tara.count, signs)), `chandra ${s.fromUtc}`);
    if (b - a > 4 * 60000) {
      for (const ms of [a + 90000, b - 90000]) {
        const t = taraAt(ms);
        for (const bad of T.TARA_BAD.order) for (const cy of T.TARA_CYCLES.order) assert.equal(taraVerdict(t, bad, cy), s.taraVerdicts[bad][cy], `${s.fromUtc} ${bad}/${cy}`);
      }
    }
  }
  // Somewhere in 20 days the Moon passes the 88th pada; its remedy stretches tile it.
  const p88 = r.segments.filter((s) => s.personal.PADA_88);
  assert.ok(p88.length >= 1);
  for (const s of p88) {
    assert.equal(s.remedy88[0].fromUtc, s.fromUtc);
    assert.equal(s.remedy88[s.remedy88.length - 1].toUtc, s.toUtc);
    for (const x of s.remedy88) assert.deepEqual(plain({ ...x, fromUtc: 0, toUtc: 0 }), plain({ ...x, fromUtc: 0, toUtc: 0, ...lordsFriendly(x.lagna) }));
  }
  assert.throws(() => muhurtaStarChecks({ natalMoonLongitude: natal, fromMs, toMs: fromMs + (MAX_DAYS + 1) * DAY }));
}

console.log('test-muhurta-stars: all checks passed');
