const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const D = require('./src/report/marriageDoshaTables');
const M = require('./src/report/marriageDoshas');
const S = require('./src/report/saptashalakaTables');
const { muhurtaStarChecks, moonInAbhijit, STAR_CUTS } = require('./src/report/muhurtaStars');
const { planetLongitude, nodeLongitude } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/marriage-doshas/books.json'), 'utf8'));
const plain = (o) => JSON.parse(JSON.stringify(o));
const sorted = (a) => [...a].sort((x, y) => x - y);

/** A sky with every planet far away (Aries 1st pada) unless given; stars at their 1st pada. */
const sky = ({ moon = 0, sun = 0, yoga = 1, tithi = 1, planets = {}, paataEnds = [], sunDeg = 5 } = {}) => {
  const P = { Sun: sun, Mars: 106, Mercury: 106, Jupiter: 106, Venus: 106, Saturn: 106, Rahu: 106, Ketu: 106, ...planets };
  return {
    moon: { pada: moon, abhijit: false }, sun: { pada: P.Sun, deg: sunDeg, abhijit: false },
    planets: Object.fromEntries(Object.entries(P).map(([p, pada]) => [p, { pada, abhijit: pada === 83 }])),
    yoga, tithi, paataEnds,
  };
};

// ------------------------------------------------ the ten, the five ---
{
  const O = FIX.tenInOrder;
  assert.deepEqual(['LATTA', ...D.DOSHAS], O.order);
  // The five by name (Shridhar, Joshi) are Vashistha's 3, 4, 6, 8, 10; in Agarwal's own order his 8th is Upagraha (noted).
  for (const names of Object.values(O.seriousByName)) assert.deepEqual([...D.SERIOUS], names);
  assert.deepEqual([...D.SERIOUS], O.seriousByNumber.map((n) => O.vashisthaOrder[n - 1]));
  assert.equal(O.order[O.seriousByNumber[3] - 1], 'UPAGRAHA');
  assert.ok(D.RULES.FIVE_AND_SIX.textTa.includes('8-வதாக உபக்கிரக'), 'the discrepancy is told');
}

// ------------------------------------------------ Paata ---
{
  for (const e of FIX.paataNarada) assert.deepEqual(sorted(M.paataOf(sky({ sun: e.sun * 4 })).naradaStars), sorted(e.struck), `${e.book}: ${e.note}`);
  // Shridhar counts to Swati where the others count to Chitra.
  for (const e of FIX.paataSwati) {
    const struck = sorted([...Array(27).keys()].filter((m) => M.paataOf(sky({ sun: e.sun * 4, moon: m * 4 })).readings.NARADA_SWATI));
    assert.deepEqual(struck, sorted(e.struck), `${e.book}: ${e.note}`);
  }
  // Joshi's Table 6.2 is the same rule turned round: the Sun's stars that strike a marriage star.
  const J = FIX.joshiTable62;
  const strikers = [...Array(27).keys()].filter((s) => M.paataOf(sky({ sun: s * 4, moon: J.marriageStar * 4 })).readings.NARADA);
  assert.deepEqual(sorted(strikers), sorted(J.sunStars), J.note);
  // The yoga-end reading: whole passage, or only the pada the Moon was in when the yoga ended.
  const ends = [{ yoga: 26, moonPada: 38 }];
  assert.deepEqual(M.paataOf(sky({ moon: 36, paataEnds: ends })).readings.YOGA_END, [26]);
  assert.equal(M.paataOf(sky({ moon: 36, paataEnds: ends })).readings.YOGA_END_PADA, null);
  assert.deepEqual(M.paataOf(sky({ moon: 38, paataEnds: ends })).readings.YOGA_END_PADA, [26]);
  // The Narada targets are the six yogas' own numbers (Ashlesha 9 = Shoola 9 … Revati 27 = Vaidhriti 27), but for Shravana/Sadhya.
  assert.deepEqual(sorted(D.NARADA_TARGETS.CHITRA.map((t) => t + 1)), [9, 10, 14, 17, 22, 27]);
  assert.deepEqual(sorted(D.PAATA_YOGAS.map((y) => y + 1)), [9, 10, 14, 17, 22, 27]);
}

// ------------------------------------------------ Yuti ---
{
  const s = sky({ moon: 12, planets: { Venus: 14, Jupiter: 15, Mars: 5 } }); // the Moon in Rohini 1 (Taurus); Venus Rohini 3, Jupiter Rohini 4; Mars Bharani 2 (Aries)
  const y = M.yutiOf(s);
  assert.deepEqual([...y.readings.SIGN_ANY].sort(), ['Jupiter', 'Venus']);
  assert.deepEqual(y.readings.SIGN_MC, ['Venus'], 'Muhurta Chintamani: Jupiter brings happiness');
  assert.deepEqual([...y.readings.STAR].sort(), ['Jupiter', 'Venus']);
  assert.equal(y.moonDignity, 'EXALTED');
  // Same star, different sign: Krittika straddles Aries and Taurus.
  const k = M.yutiOf(sky({ moon: 9, planets: { Mars: 8 } })); // the Moon in Krittika 2 (Taurus), Mars in Krittika 1 (Aries)
  assert.deepEqual(k.readings.STAR, ['Mars']);
  assert.deepEqual(k.starOtherSign, ['Mars']);
  assert.equal(k.readings.SIGN_ANY, null);
}

// ------------------------------------------------ Vedha ---
{
  // The fourteen Pancha Shalaka pairs as Shridher names them; Muhurta Chintamani's eight among them.
  for (const [, a, , b] of FIX.panchaShridhar) { assert.equal(D.PANCHA[a], b); assert.equal(D.PANCHA[b], a); }
  assert.equal(Object.keys(D.PANCHA).length, 28);
  // Sapta Shalaka: the straight-line partners of the chakra on /gochara-vedha.
  const ours = (c) => (c <= 26 ? c + 1 : c - 27);
  for (let c = 1; c <= 28; c += 1) assert.equal(D.SAPTA[ours(c)], ours(S.straightPartner(c)), `sapta ${c}`);
  // Shridhar: the two agree on 20 stars and differ on 8.
  assert.equal([...Array(28).keys()].filter((k) => D.PANCHA[k] !== D.SAPTA[k]).length, 8);
  // Muhurta Chintamani: married in Anuradha, no planet in Bharani; a malefic strikes the whole star.
  const V = FIX.vedha;
  for (let q = 0; q < 4; q += 1) assert.deepEqual(M.vedhaOf(sky({ moon: V.mcAnuradha.marriageStar * 4 + q, planets: { Saturn: V.mcAnuradha.planetStar * 4 } })).readings.PANCHA, ['Saturn']);
  // A benefic strikes only the facing quarter: Uttarashadha's 4th → Mrigashira's 1st, its 2nd → Mrigashira's 3rd.
  const Q = V.mcQuarter;
  for (let mp = 16; mp < 20; mp += 1) {
    assert.equal(Boolean(M.vedhaOf(sky({ moon: mp, planets: { Jupiter: Q.planetPada } })).readings.PANCHA), mp === Q.moonPadaHit, `Jupiter 83, Moon ${mp}`);
    assert.equal(Boolean(M.vedhaOf(sky({ moon: mp, planets: { Jupiter: Q.planetPada2 } })).readings.PANCHA), mp === Q.moonPadaHit2, `Jupiter 81, Moon ${mp}`);
  }
  // That 4th quarter is Abhijit too: the planet there strikes Rohini (whole star) as well.
  for (let q = 0; q < 4; q += 1) assert.deepEqual(M.vedhaOf(sky({ moon: 12 + q, planets: { Jupiter: 83 } })).readings.PANCHA, ['Jupiter'], `Rohini ${q + 1}`);
  assert.deepEqual(D.ABHIJIT, S.ABHIJIT, 'Muhurta Chintamani\'s span = Charak\'s');
}

// ------------------------------------------------ Jamitra ---
{
  for (const e of FIX.jamitra55) {
    const j = M.jamitraOf(sky({ planets: { Saturn: e.planetPada } }));
    assert.ok(j.lagnaNavamsas[e.lagnaPada].includes('Saturn'), `${e.book}: ${e.note}`);
    assert.equal(e.planetPada - e.lagnaPada, 54);
  }
  // From the Moon: the 7th sign, the 55th navamsa, the 14th star; Mercury is exempt from the first two.
  // The Moon in Ashwini 1; Mars in Chitra 3 (Libra, the 55th navamsa), Mercury in Chitra 4 (Libra), Saturn in Chitra 2 (Virgo).
  const j = M.jamitraOf(sky({ moon: 0, planets: { Mars: 54, Mercury: 55, Saturn: 53, Ketu: 46 } }));
  assert.deepEqual(j.readings.SEVENTH, ['Mars']);
  assert.deepEqual(j.readings.NAVAMSA_55, ['Mars']);
  assert.deepEqual(j.readings.STAR_14, ['Mars', 'Saturn'], 'Chitra, the 14th star');
  assert.equal(j.mercurySeventh, true);
  assert.equal(M.jamitraOf(sky({ moon: 0, planets: { Jupiter: 52 } })).readings.STAR_14, null, 'only malefics in the 14th star');
}

// ------------------------------------------------ Bana ---
{
  for (const [bana, degs] of Object.entries(FIX.banaTable)) {
    if (bana === 'page') continue;
    for (let d = 0; d < 30; d += 1) {
      const b = M.banaOf(sky({ sunDeg: d }));
      assert.equal(b.byDegree.present.includes(bana), degs.includes(d), `${bana} ${d}`);
    }
  }
  for (const e of FIX.banaExamples) {
    const b = M.banaOf(sky({ sunDeg: e.deg }));
    assert.deepEqual(b.byDegree.present, [e.bana], e.book);
    assert.deepEqual(D.BANAS.map((x) => (e.deg + D.BANA_ADD[x]) % 9), e.remainders);
    assert.equal(b.byDegree.sashalya, e.sashalya);
  }
  // Wilhelm counts 0-1° as the first degree.
  assert.equal(M.banaOf(sky({ sunDeg: 0 })).readings.SUN_DEGREE_ORDINAL, 'MRITYU');
  assert.equal(M.banaOf(sky({ sunDeg: 1 })).readings.SUN_DEGREE, 'MRITYU');
  for (const e of FIX.banaTithiLagna) assert.ok(M.banaOf(sky({ tithi: e.tithi })).lagnas[e.bana].includes(e.lagna), `${e.book}: tithi ${e.tithi}, lagna ${e.lagna}`);
  assert.equal(M.banaOf(sky()).readings.TITHI_LAGNA, 'LAGNA');
}

// ------------------------------------------------ Ekargala ---
{
  assert.deepEqual(plain(D.MURDHA), Object.fromEntries(Object.entries(FIX.murdha).filter(([k]) => k !== '_note')));
  // Shridhar's rule for the top star gives the books' table.
  for (const y of D.EVIL_YOGAS) {
    const n = y + 1;
    assert.equal(D.MURDHA[y] + 1, n % 2 ? (n + 1) / 2 : (n + 28) / 2, `yoga ${n}`);
  }
  for (const e of FIX.ekargala) {
    const r = M.ekargalaOf(sky({ yoga: e.yoga, sun: e.sun * 4, moon: e.moon * 4 })).readings;
    for (const id of e.present) assert.ok(r[id], `${e.book}: ${id} — ${e.note}`);
    for (const id of e.absent || []) assert.equal(r[id], null, `${e.book}: not ${id}`);
  }
  assert.equal(M.ekargalaOf(sky({ yoga: 8, sun: 13 * 4, moon: 22 * 4 })).count28, 11, 'Rangacharya: 11, counting Abhijit');
  assert.deepEqual([...D.EKARGALA_EXEMPT], FIX.ekargalaExempt.stars);
  // No evil yoga, no Ekargala.
  for (const id of D.READINGS.EKARGALA.order) assert.equal(M.ekargalaOf(sky({ yoga: 1, sun: 13 * 4, moon: 22 * 4 })).readings[id], null);
}

// ------------------------------------------------ Upagraha ---
{
  assert.deepEqual(sorted(D.UPAGRAHA_13), sorted(FIX.upagraha.MC_verse), 'Muhurta Chintamani sloka 63');
  assert.deepEqual(sorted(D.UPAGRAHA_MP), sorted(FIX.upagraha.MP));
  for (let c = 1; c <= 27; c += 1) {
    const u = M.upagrahaOf(sky({ sun: 0, moon: (c - 1) * 4 }));
    assert.equal(u.count, c);
    assert.equal(Boolean(u.readings.UPA13), FIX.upagraha.MC_verse.includes(c), `count ${c}`);
    assert.equal(Boolean(u.readings.UPA13_QUARTER), Boolean(u.readings.UPA13), 'both in the 1st pada');
    assert.equal(M.upagrahaOf(sky({ sun: 1, moon: (c - 1) * 4 })).readings.UPA13_QUARTER, null, 'different padas');
  }
}

// ------------------------------------------------ Kranti-samya ---
{
  const pairs = FIX.kranti.MC_verse.map(([a, b]) => sorted([a, b]).join('-')).sort();
  assert.deepEqual(D.KRANTI_PAIRS.map(([a, b]) => sorted([a, b]).join('-')).sort(), pairs);
  assert.deepEqual(FIX.kranti.agarwal1based.map(([a, b]) => sorted([a - 1, b - 1]).join('-')).sort(), pairs, 'Agarwal\'s 1/5, 2/10 …');
  for (let a = 0; a < 12; a += 1) for (let b = 0; b < 12; b += 1) {
    const k = M.krantiOf(sky({ sun: a * 9, moon: b * 9 })).readings.SIGN_PAIRS;
    assert.equal(Boolean(k), pairs.includes(sorted([a, b]).join('-')) && a !== b, `${a}-${b}`);
  }
}

// ------------------------------------------------ Dagdha tithi ---
{
  for (const [sign1, t, half] of FIX.dagdhaVashistha) {
    const sun = (sign1 - 1) * 9;
    const shukla = M.dagdhaOf(sky({ sun, tithi: t }));
    const krishna = M.dagdhaOf(sky({ sun, tithi: 15 + t }));
    assert.equal(shukla.readings.BOTH, t);
    assert.equal(krishna.readings.BOTH, t);
    assert.equal(Boolean(shukla.readings.BY_SIGN), half === 'S', `Vashistha sign ${sign1}`);
    assert.equal(Boolean(krishna.readings.BY_SIGN), half === 'K', `Vashistha sign ${sign1}`);
    assert.equal(M.dagdhaOf(sky({ sun, tithi: t + 1 })).readings.BOTH, null);
  }
}

// ------------------------------------------------ the rule; order by words; sources ---
{
  const all = Object.fromEntries(D.DOSHAS.map((d) => [d, { readings: { X: true } }]));
  const none = Object.fromEntries(D.DOSHAS.map((d) => [d, { readings: {} }]));
  const chosen = Object.fromEntries(D.DOSHAS.map((d) => [d, 'X']));
  const some = (list) => Object.fromEntries(D.DOSHAS.map((d) => [d, { readings: list.includes(d) ? { X: true } : {} }]));
  assert.equal(M.dashaVerdict(none, chosen, false, 'ALL_TEN').reject, false);
  assert.equal(M.dashaVerdict(none, chosen, true, 'ALL_TEN').reject, true, 'Latta alone');
  assert.equal(M.dashaVerdict(some(['PAATA', 'EKARGALA', 'UPAGRAHA', 'JAMITRA']), chosen, false, 'SIX_OF_TEN').reject, false, 'four present: six avoided');
  assert.equal(M.dashaVerdict(some(['PAATA', 'EKARGALA', 'UPAGRAHA', 'JAMITRA']), chosen, true, 'SIX_OF_TEN').reject, true, 'five present');
  assert.equal(M.dashaVerdict(some(['KRANTI']), chosen, false, 'SIX_OF_TEN').reject, false);
  assert.equal(M.dashaVerdict(some(['KRANTI']), chosen, false, 'FIVE').reject, true);
  assert.equal(M.dashaVerdict(some(['KRANTI']), chosen, false, 'FIVE_AND_SIX').reject, true);
  assert.equal(M.dashaVerdict(all, chosen, true, 'NONE').reject, false);
  // A lagna-dependent reading is not counted.
  assert.equal(M.dashaVerdict({ ...none, BANA: { readings: { X: 'LAGNA' } } }, chosen, false, 'ALL_TEN').reject, false);

  for (const [k, words] of Object.entries(FIX.words)) {
    assert.deepEqual(plain(D.RANK[k].words), words, k);
    assert.deepEqual([...D.RANK[k].order], Object.keys(words).sort((a, b) => words[b] - words[a]), k);
  }
  for (const [k, id] of Object.entries(FIX.defaults)) assert.equal(k === 'RULE' ? D.RULES.default : D.READINGS[k].default, id, k);
  for (const d of D.DOSHAS) {
    assert.deepEqual([...D.READINGS[d].order].sort(), Object.keys(D.READINGS[d]).filter((k) => !['default', 'order'].includes(k)).sort(), d);
    assert.ok(D.READINGS[d].order.includes(D.READINGS[d].default), d);
    assert.equal(D.RANK[d].order[0], Object.keys(D.SOURCES[d])[0], `${d}: sources listed most-explained first`);
    for (const b of D.RANK[d].order) assert.ok(D.SOURCES[d][b], `${d}: ${b} cited`);
  }
  const cites = [];
  const walk = (o) => { if (o && typeof o === 'object') { if (typeof o.pageLocus === 'string') cites.push(o); Object.values(o).forEach(walk); } };
  walk(D);
  assert.ok(cites.length >= 60);
  for (const c of cites) assert.ok(resolveByTitle(c.title), `registered: ${c.title}`);
  // The Sanskrit verses quoted are the printed ones.
  assert.ok(D.SOURCES.PAATA.MUHURTA_CHINTAMANI.pageLocus.includes('हर्षणवैधृतिसाध्यव्यतिपातकगण्डशूलयोगानाम्'));
  assert.ok(D.SOURCES.KRANTI.MUHURTA_CHINTAMANI.pageLocus.includes('पञ्चास्याजौ गोमृगौ तौलिकुम्भौ'));
  assert.ok(D.SOURCES.UPAGRAHA.MUHURTA_CHINTAMANI.pageLocus.includes('शराष्टदिक्छक्रनगातिधृत्यस्तिथिर्धृतिश्च'));
  assert.ok(D.SOURCES.JAMITRA.MUHURTA_CHINTAMANI.pageLocus.includes('बाणाशुगमितलवगे'));
}

// ------------------------------------------------ Shridhar's worked example: Paata on 1998-12-09 ---
{
  const ist = (s) => Date.parse(`${s}:00+05:30`);
  const E = FIX.shridharPaataExample;
  const r = muhurtaStarChecks({ natalMoonLongitude: 200, fromMs: ist('1998-12-08T12:00'), toMs: ist('1998-12-11T00:00') });
  const at = (ms) => r.segments.find((s) => Date.parse(s.fromUtc) <= ms && ms < Date.parse(s.toUtc));
  const within = (a, b, mins) => Math.abs(a - b) <= mins * 60000;
  // Struck through the Moon's whole passage through Magha; with the pada reading, only Magha's 3rd.
  const magha = r.segments.filter((s) => s.star === E.moonStar);
  assert.ok(within(Date.parse(magha[0].fromUtc), ist(E.maghaFromIST), 15), `Magha from ${magha[0].fromUtc}`);
  assert.ok(within(Date.parse(magha[magha.length - 1].toUtc), ist(E.maghaToIST), 15), `Magha to ${magha[magha.length - 1].toUtc}`);
  for (const s of magha) {
    assert.ok(s.doshas.PAATA.readings.YOGA_END, s.fromUtc);
    assert.ok(s.doshas.PAATA.yogaEnds.some((e) => e.yoga === 26 && e.moonPada === E.moonPada));
    assert.equal(Boolean(s.doshas.PAATA.readings.YOGA_END_PADA), s.star * 4 + s.pada - 1 === E.moonPada, s.fromUtc);
  }
  const p3 = magha.filter((s) => s.pada === 3);
  assert.ok(within(Date.parse(p3[0].fromUtc), ist(E.pada3FromIST), 15) && within(Date.parse(p3[p3.length - 1].toUtc), ist(E.pada3ToIST), 15));
  // Vaidhriti ends within the 3rd pada, near Shridhar's 13:07.
  const before = at(ist(E.vaidhritiEndIST) - 20 * 60000);
  assert.equal(before.doshas.EKARGALA.yoga, 26);
  assert.notEqual(at(ist(E.vaidhritiEndIST) + 20 * 60000).doshas.EKARGALA.yoga, 26);
}

// ------------------------------------------------ the windows, against the sky ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T00:00:00Z');
  const toMs = fromMs + 20 * DAY;
  const r = muhurtaStarChecks({ natalMoonLongitude: 45.5, fromMs, toMs, latitude: 11.34, longitude: 77.72 });
  const jd = (ms) => ms / DAY + 2440587.5;
  const lon = (p, ms) => ((p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : p === 'Ketu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') + 180 : planetLongitude(jd(ms), p, 'Lahiri')) % 360 + 360) % 360;
  const padaOf = (l) => Math.floor(l / (10 / 3)) % 108;
  const STARW = 360 / 27;
  const inAbh = (l) => l >= D.ABHIJIT.from && l < D.ABHIJIT.to;
  const yogaAt = (ms) => Math.floor(((lon('Moon', ms) + lon('Sun', ms)) % 360) / STARW) % 27;
  // The yoga ends inside the Moon's passage through a star, found by stepping every 10 minutes and bisecting to a second.
  const passageCache = new Map();
  const endsIn = (ms) => {
    const star = Math.floor(lon('Moon', ms) / STARW);
    const edge = (dir) => {
      let t = ms;
      while (Math.floor(lon('Moon', t + dir * 600000) / STARW) === star) t += dir * 600000;
      let a = t; let b = t + dir * 600000;
      while (Math.abs(b - a) > 1000) { const m = (a + b) / 2; if (Math.floor(lon('Moon', m) / STARW) === star) a = m; else b = m; }
      return a;
    };
    const from = edge(-1);
    const key = Math.round(from / 60000);
    if (!passageCache.has(key)) {
      const to = edge(1);
      const out = [];
      for (let t = from; t < to; t += 600000) {
        const t2 = Math.min(t + 600000, to);
        if (yogaAt(t2) !== yogaAt(t)) {
          let a = t; let b = t2;
          while (b - a > 1000) { const m = (a + b) / 2; if (yogaAt(m) === yogaAt(t)) a = m; else b = m; }
          if (D.PAATA_YOGAS.includes(yogaAt(t))) out.push({ yoga: yogaAt(t), moonPada: padaOf(lon('Moon', a)) });
        }
      }
      passageCache.set(key, out);
    }
    return passageCache.get(key);
  };
  const skyAt = (ms) => {
    const m = lon('Moon', ms);
    const st = Math.floor(m / STARW);
    const slice = STAR_CUTS.findLastIndex((c) => (m - st * STARW) / STARW >= c);
    assert.equal(moonInAbhijit(st, slice), inAbh(m), `the Moon's Abhijit at ${new Date(ms).toISOString()}`);
    return {
      moon: { pada: padaOf(m), abhijit: inAbh(m) },
      sun: { pada: padaOf(lon('Sun', ms)), deg: Math.floor(lon('Sun', ms)) % 30, abhijit: inAbh(lon('Sun', ms)) },
      planets: Object.fromEntries(M.PLANETS.map((p) => [p, { pada: padaOf(lon(p, ms)), abhijit: inAbh(lon(p, ms)) }])),
      yoga: yogaAt(ms),
      tithi: Math.floor(((lon('Moon', ms) - lon('Sun', ms) + 360) % 360) / 12) + 1,
      paataEnds: endsIn(ms),
    };
  };
  let checked = 0;
  for (const s of r.segments) {
    const a = Date.parse(s.fromUtc);
    const b = Date.parse(s.toUtc);
    if (b - a <= 4 * 60000) continue;
    for (const ms of [a + 90000, b - 90000]) {
      const want = M.marriageDoshasOf(skyAt(ms));
      for (const d of D.DOSHAS) {
        for (const id of D.READINGS[d].order) {
          assert.deepEqual(plain(s.doshas[d].readings[id] ?? null), plain(want[d].readings[id]), `${s.fromUtc} ${d}.${id}`);
        }
      }
      checked += 1;
    }
    assert.equal(s.tithi, Math.floor(((lon('Moon', (a + b) / 2) - lon('Sun', (a + b) / 2) + 360) % 360) / 12) + 1);
    // The lagna lists are the planets' (Jamitra) and the tithi's (Bana).
    const L = r.jamitraLagnas[s.doshas.JAMITRA.lagnaRef];
    assert.deepEqual(plain(L), plain([M.jamitraOf(skyAt((a + b) / 2)).lagnaSigns, M.jamitraOf(skyAt((a + b) / 2)).lagnaNavamsas]));
    assert.deepEqual(plain(r.books.dasha.banaLagnas[s.tithi - 1]), plain(M.banaOf(skyAt((a + b) / 2)).lagnas));
  }
  assert.ok(checked > 300, `checked ${checked}`);
  // Each evil occurs somewhere in 20 days under its default reading.
  for (const d of D.DOSHAS) {
    if (d === 'DAGDHA' || d === 'KRANTI') continue; // these two depend on the month
    assert.ok(r.segments.some((s) => s.doshas[d].readings[D.READINGS[d].default]), `${d} somewhere`);
  }
}

console.log('test-marriage-doshas: all checks passed');
