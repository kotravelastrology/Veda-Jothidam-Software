const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./src/report/eventMuhurtaTables');
const { panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, kumbhaCount, rejects, guruCodes, raviCodes, inHarishayana, isVishti } = require('./src/report/eventMuhurta');
const { muhurtaStarChecks } = require('./src/report/muhurtaStars');
const { planetLongitude, nodeLongitude, sunriseJulianDay, sunsetJulianDay } = require('./src/ephemeris/siderealPositions');
const { resolveByTitle } = require('./src/sources/registry');

const FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/event-muhurta/books.json'), 'utf8'));
const G = E.EVENTS.GRIHA_PRAVESHA;
const sorted = (a) => [...a].sort((x, y) => x - y);

// ------------------------------------------------ the tables against the books ---
{
  assert.deepEqual({ ...E.RANK.GRIHA_PRAVESHA.words }, FIX.words);
  assert.deepEqual([...G.order], Object.keys(FIX.words).sort((a, b) => FIX.words[b] - FIX.words[a]));
  assert.equal(G.default, FIX.default);
  assert.ok(E.SOURCES.GRIHA_PRAVESHA.MUHURTA_CHINTAMANI.pageLocus.includes(FIX.mcSloka13_1));
  for (const b of G.order) {
    assert.ok(resolveByTitle(E.SOURCES.GRIHA_PRAVESHA[b].title), `registered: ${b}`);
    if (G[b].masa) for (const m of FIX.months_best_all) assert.ok(G[b].masa.good.includes(m), `${b} month ${m}`);
  }
  const S = FIX.stars;
  assert.deepEqual(sorted(G.SHRIDHAR.nak.good), sorted(S.SHRIDHAR));
  assert.deepEqual(sorted(G.MUHURTA_CHINTAMANI.nak.good), sorted(S.MUHURTA_CHINTAMANI));
  assert.deepEqual(sorted(G.WILHELM.nak.good), sorted(S.WILHELM_best));
  assert.deepEqual(sorted(G.WILHELM.nak.mid), sorted(S.WILHELM_middling));
  assert.deepEqual(sorted(G.RAMAN.nak.good), sorted(S.RAMAN_best));
  assert.deepEqual(sorted(G.RAMAN.nak.mid), sorted(S.RAMAN_permissible));
  assert.deepEqual(sorted(G.KALYANRAMAN.nak.good), sorted(S.KALYANRAMAN_counted));
  assert.deepEqual(sorted(G.RANGACHARYA.nak.good), sorted(S.RANGACHARYA));
  assert.deepEqual(sorted(G.VASHISTHA.nak.good), sorted(S.VASHISTHA_as_printed));
  assert.deepEqual(sorted(G.AGARWAL.nak.good), sorted(S.AGARWAL));
  const T = FIX.tithis;
  for (const b of ['SHRIDHAR', 'WILHELM', 'RAMAN', 'VASHISTHA']) assert.deepEqual(sorted(G[b].tithi), sorted(T[b]), `${b} tithis`);
  assert.deepEqual([...G.JOSHI.tithi], E.bothPakshas(T.JOSHI_paksha));
  assert.deepEqual([...G.AGARWAL.tithi], E.bothPakshas(T.AGARWAL_paksha));
  assert.ok(!G.JOSHI.tithi.includes(30) && G.JOSHI.tithi.includes(15), 'the 15th is the full Moon only');
  for (const t of T.MC_avoid) assert.ok(!G.MUHURTA_CHINTAMANI.tithi.includes(t));
  assert.equal(G.MUHURTA_CHINTAMANI.tithi.length, 30 - T.MC_avoid.length);
  assert.deepEqual(sorted(G.SHRIDHAR.vara.good), sorted(FIX.weekdays.SHRIDHAR_good));
  assert.deepEqual(sorted(G.SHRIDHAR.vara.mid), sorted(FIX.weekdays.SHRIDHAR_middling));
  for (const v of FIX.weekdays.MC_avoid) assert.ok(!G.MUHURTA_CHINTAMANI.vara.good.includes(v));
  assert.deepEqual([...G.MUHURTA_CHINTAMANI.kumbha], FIX.kumbhaGood_MC);
  for (const d of E.DOORS.order) {
    assert.deepEqual([...E.DOORS.tithi[d]], FIX.doors[d].tithi);
    assert.deepEqual([...E.DOORS.sun[d]], FIX.doors[d].sun);
  }
  // The four door directions share the 27 stars out (Krittika-Ashlesha east, Magha-Vishakha south, Anuradha-Shravana west, Dhanishta-Bharani north).
  assert.deepEqual(sorted(E.DOORS.order.flatMap((d) => E.DOORS.stars[d])), [...Array(27).keys()]);
}

// ------------------------------------------------ the codes ---
{
  // Rohini, Shukla 2nd, Vaishakha, the Sun in Aries in Revati (Rohini the 4th from it — the pitcher's east: bad).
  const x = { star: 3, tithi: 2, month: 1, sunSign: 0, sunStar: 26 };
  assert.equal(kumbhaCount(26, 3), 5);
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, x), ['KUMBHA']);
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, { ...x, sunStar: 24 }), [], 'Rohini the 7th from Purva Bhadrapada: the south');
  assert.deepEqual(panchangaCodes(G.RANGACHARYA, { ...x, sunStar: 24 }), [], 'his count: the 7th is good too');
  assert.deepEqual(panchangaCodes(G.MUHURTA_CHINTAMANI, { ...x, sunStar: 24, month: 0, sunSign: 11 }), ['MASA'], 'Chaitra');
  assert.deepEqual(panchangaCodes(G.MUHURTA_CHINTAMANI, { ...x, sunStar: 24, month: 7, sunSign: 6 }), ['MASA', 'UTTARAYANA'], 'Kartika, the Sun in Libra');
  assert.deepEqual(panchangaCodes(G.SHRIDHAR, { ...x, sunStar: 24, month: 7, sunSign: 6 }), ['MASA_MID', 'UTTARAYANA_MID']);
  assert.deepEqual(panchangaCodes(G.WILHELM, { ...x, sunStar: 24, star: 7 }), ['NAK_MID'], 'Pushya middling; the 12th from Purva Bhadrapada, the west: good');
  assert.deepEqual(panchangaCodes(G.WILHELM, { ...x, sunStar: 24, star: 9 }), ['NAK'], 'Magha: not listed (the 13th, the west)');
  assert.deepEqual(rejects(['NAK_MID', 'VARA_MID']), []);
  assert.deepEqual(varaCodes(G.SHRIDHAR, 6), ['VARA_MID']);
  assert.deepEqual(varaCodes(G.SHRIDHAR, 2), ['VARA']);
  assert.deepEqual(varaCodes(G.RANGACHARYA, 2), [], 'he gives no weekdays');

  // A Taurus lagna with the 4th and 8th empty, benefics in 1/2/5, malefics in 3/6/11.
  const signs = { Sun: 3, Moon: 2, Mars: 6, Mercury: 1, Jupiter: 2, Venus: 5, Saturn: 11, Rahu: 9, Ketu: 3 };
  const m = { lagna: 1, nav: 2, signs, natalLagna: 6, natalMoon: 10, combust: { Jupiter: false, Venus: false } };
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, m), []);
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, { ...m, combust: { Jupiter: true } }), ['JUP_VEN_SET']);
  assert.deepEqual(lagnaCodes(G.SHRIDHAR, { ...m, signs: { ...signs, Rahu: 4, Ketu: 10 } }), ['EMPTY_4']);
  assert.deepEqual(lagnaCodes(G.WILHELM, { ...m, signs: { ...signs, Rahu: 4, Ketu: 10 } }), ['EMPTY_4_MID'], 'Wilhelm: the 4th "a good principle"');
  assert.deepEqual(lagnaCodes(G.WILHELM, { ...m, nav: 0 }), ['NAV'], 'an Aries navamsa: a malefic\'s');
  // A movable lagna: only with a Taurus navamsa (Shridhar/K.P., Wilhelm, Raman); never for MC; Joshi by the birth upachaya.
  const aries = { ...m, lagna: 0, signs: { ...signs }, natalLagna: 9, natalMoon: 7 };
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...aries, nav: 1 }).every((c) => c !== 'LAGNA'));
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...aries, nav: 2 }).includes('LAGNA'));
  assert.ok(lagnaCodes(G.MUHURTA_CHINTAMANI, { ...aries, nav: 1 }).includes('LAGNA'), 'Aries is the 4th from Capricorn — and movable');
  assert.ok(!lagnaCodes(G.JOSHI, { ...aries, natalLagna: 10 }).includes('LAGNA'), 'Aries the 3rd from Aquarius');
  assert.ok(lagnaCodes(G.KALYANRAMAN, { ...aries, natalLagna: 10, natalMoon: 0 }).includes('LAGNA'), 'Kalyanraman counts from the Moon only');
  assert.ok(!lagnaCodes(G.RANGACHARYA, { ...aries, nav: 2, natalLagna: 10 }).includes('LAGNA'), 'a cardinal lagna with a benefic navamsa, 3rd from birth');
  assert.ok(lagnaCodes(G.RANGACHARYA, { ...aries, nav: 0, natalLagna: 10 }).includes('LAGNA'));
  assert.ok(lagnaCodes(G.SHRIDHAR, { ...m, lagna: 2 }).includes('LAGNA_MID'), 'a dual lagna: middling');

  // The door: tithi class, the Sun on the left, the door's stars.
  assert.deepEqual(doorCodes(G.SHRIDHAR, 'E', { tithi: 20, sunHouse: 9 }), [], 'Krishna 5th is a Poorna tithi');
  assert.deepEqual(doorCodes(G.SHRIDHAR, 'E', { tithi: 2, sunHouse: 3 }), ['TITHI_DOOR', 'SUN_LEFT']);
  assert.deepEqual(doorCodes(G.RAMAN, 'E', { tithi: 2, sunHouse: 3 }), [], 'Raman gives no door rules');
  assert.deepEqual(doorCodes(G.SHRIDHAR, null, { tithi: 2, sunHouse: 3 }), []);
  assert.deepEqual(withDoorStars(G.MUHURTA_CHINTAMANI, 'E', ['NAK', 'TITHI'], 2), ['TITHI'], 'Krittika faces an eastern door');
  assert.deepEqual(withDoorStars(G.MUHURTA_CHINTAMANI, 'W', ['NAK'], 2), ['NAK']);
  assert.deepEqual(withDoorStars(G.WILHELM, 'E', ['NAK'], 2), ['NAK'], 'Wilhelm: facing the door is only "more favorable"');
}

// ------------------------------------------------ upanayana: the tables against the books ---
const U = E.EVENTS.UPANAYANA;
const UF = FIX.upanayana;
{
  assert.deepEqual({ ...E.RANK.UPANAYANA.words }, UF.words);
  assert.deepEqual([...U.order], Object.keys(UF.words).sort((a, b) => UF.words[b] - UF.words[a]));
  assert.equal(U.default, UF.default);
  for (const b of U.order) {
    assert.ok(resolveByTitle(E.SOURCES.UPANAYANA[b].title), `registered: ${b}`);
    assert.ok(U[b].linesTa.length > 0, `${b} described`);
    assert.ok(U[b].dayParts, `${b}: the night rejected (our reading for the books that do not say)`);
  }
  assert.ok(resolveByTitle(E.SOURCES.VISHTI.title));
  assert.deepEqual([...E.SIXTEEN], UF.sixteen_KR_p103);
  for (const b of ['KALYANRAMAN', 'JOSHI', 'RANGACHARYA', 'RAMAN', 'AGARWAL']) assert.deepEqual(sorted(U[b].nak.good), UF.sixteen_KR_p103, `${b}: the sixteen`);
  for (const b of ['SHRIDHAR', 'WILHELM']) {
    assert.deepEqual(sorted([...U[b].nak.good, ...U[b].nak.mid]), UF.sixteen_KR_p103);
    assert.deepEqual([...U[b].nak.mid], UF.stars.middling_some_SHRIDHAR_WILHELM);
  }
  assert.deepEqual(sorted(U.MUHURTA_CHINTAMANI.nak.good), sorted(UF.stars.MC_sloka40));
  assert.deepEqual(sorted(U.VASHISTHA.nak.good), sorted(UF.stars.VASHISTHA));
  const T = UF.tithis;
  for (const b of ['KALYANRAMAN', 'JOSHI', 'AGARWAL']) assert.deepEqual(sorted(U[b].tithi), sorted(T.KR_JOSHI_AGARWAL), b);
  assert.deepEqual(sorted(U.SHRIDHAR.tithi), sorted(T.SHRIDHAR_auspicious));
  assert.deepEqual(sorted(U.WILHELM.tithi), sorted(T.WILHELM_best));
  assert.deepEqual(sorted(U.WILHELM.tithiMid), sorted(T.WILHELM_middling));
  assert.deepEqual(sorted(U.MUHURTA_CHINTAMANI.tithi), sorted([...T.MC_sloka40, ...T.MC_krishna_first_third]));
  assert.deepEqual(sorted(U.RAMAN.tithi), sorted(T.RAMAN));
  assert.deepEqual(sorted(U.RANGACHARYA.tithi), sorted(T.RANGACHARYA_good));
  for (const t of T.RANGACHARYA_mediocre) assert.ok(U.RANGACHARYA.tithiMid.includes(t));
  assert.deepEqual(sorted(U.VASHISTHA.tithi), sorted(T.VASHISTHA));
  assert.deepEqual(E.ANADHYAYA_MONTH.map((x) => [...x]), UF.anadhyaya_month_tithi);
  assert.deepEqual(sorted(E.GALAGRAHA), sorted(UF.galagraha));
  assert.deepEqual([...U.SHRIDHAR.taraNot], UF.tara.SHRIDHAR_all);
  assert.deepEqual([...U.SHRIDHAR.taraMid], UF.tara.SHRIDHAR_some);
  assert.deepEqual([...U.WILHELM.taraNot], UF.tara.WILHELM);
  for (const b of Object.keys(UF.lagnas)) assert.deepEqual(sorted(U[b.replace('_best', '')].lagna.good), sorted(UF.lagnas[b]), b);
  const K = UF.KR_table_p123;
  assert.deepEqual(sorted(U.KALYANRAMAN.chandra.good), K.Moon.favourable);
  assert.deepEqual([...U.KALYANRAMAN.chandra.mid], K.Moon.mediocre);
  for (const [p, rule] of [['Sun', U.KALYANRAMAN.ravi], ['Jupiter', U.KALYANRAMAN.guru]]) {
    assert.deepEqual(sorted(rule.good), K[p].favourable, p);
    assert.deepEqual(sorted(rule.mid), K[p].mediocre, p);
    assert.deepEqual([...Array(12).keys()].map((i) => i + 1).filter((h) => !rule.good.includes(h) && !rule.mid.includes(h)), K[p].unfavourable, p);
  }
  const V = UF.RANGACHARYA_vimsopaka_p80;
  assert.deepEqual({ ...U.RANGACHARYA.points.vimsi }, V.vimsi);
  assert.equal(Object.values(V.vimsi).reduce((s, x) => s + x, 0), 20, 'the shares make twenty');
  for (const p of Object.keys(V.evil)) assert.deepEqual(sorted(U.RANGACHARYA.points.bad[p]), sorted(V.evil[p]), p);
  const YOGA_NAMES = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
  assert.deepEqual(sorted(E.YOGAS_SHRIDHAR), sorted(UF.yogas_SHRIDHAR_17_9_9.map((n) => YOGA_NAMES.indexOf(n))));
}

// ------------------------------------------------ upanayana: the rules ---
{
  // Vishti (Shridhar §6.3): half-tithi k = (tithi - 1) * 2 + half.
  for (let t = 1; t <= 30; t += 1) {
    assert.equal(isVishti((t - 1) * 2), UF.vishti_SHRIDHAR_6_3.first_half.includes(t), `first half of ${t}`);
    assert.equal(isVishti((t - 1) * 2 + 1), UF.vishti_SHRIDHAR_6_3.second_half.includes(t), `second half of ${t}`);
  }
  // Harishayana: Ashadha Shukla 11 to Kartika Shukla 11.
  assert.equal(inHarishayana(3, 10), false);
  assert.equal(inHarishayana(3, 11), true);
  assert.equal(inHarishayana(5, 20), true);
  assert.equal(inHarishayana(7, 10), true);
  assert.equal(inHarishayana(7, 11), false);

  // A piece: Rohini (count 9 from a Revati birth star), Shukla 2, Vaishakha, the Sun in Aries; the birth Moon in Aries.
  const signs = { Sun: 0, Moon: 1, Mars: 4, Mercury: 11, Jupiter: 10, Venus: 11, Saturn: 6, Rahu: 9, Ketu: 3 };
  const x = { star: 3, tithi: 2, month: 1, sunSign: 0, sunStar: 1, sunDeg: 5, yoga: 3, vishti: false, sankranti: false, taraCount: 5, signs, navs: { Sun: 1, Jupiter: 4, Moon: 1 }, moonPada: 13, natalMoon: 0, vedha: { PANCHA: false, SAPTA: false }, bana: false };
  // Jupiter in Aquarius, the 11th from Aries: good for every book that judges him.
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, x), []);
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, x), [], 'Kalyanraman: all well');
  assert.deepEqual(panchangaCodes(U.WILHELM, x), ['TARA_NOT'], 'Wilhelm: the 5th star from birth');
  assert.deepEqual(panchangaCodes(U.SHRIDHAR, x), ['TARA_MID'], 'Shridhar: the 5th — "some feel to avoid"');
  assert.deepEqual(panchangaCodes(U.SHRIDHAR, { ...x, taraCount: 10, yoga: 26, vishti: true, bana: true }), ['TARA_NOT', 'YOGA', 'VISHTI', 'BANA']);
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, month: 2, tithi: 2 }), ['ANADHYAYA'], 'Jyeshtha Shukla 2');
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, sankranti: true }), ['SANKRANTI']);
  assert.deepEqual(panchangaCodes(U.MUHURTA_CHINTAMANI, { ...x, tithi: 16 }), ['ANADHYAYA'], 'Krishna 1: in the first third, but Anadhyaya');
  assert.deepEqual(panchangaCodes(U.MUHURTA_CHINTAMANI, { ...x, tithi: 1 }), ['TITHI', 'ANADHYAYA', 'GALAGRAHA'], 'Shukla 1');
  assert.deepEqual(panchangaCodes(U.RAMAN, { ...x, tithi: 16 }), [], 'Raman names no Anadhyaya');
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, month: 4, sunSign: 3, tithi: 2 }), ['MASA', 'SUN_SIGN', 'HARISHAYANA']);
  assert.deepEqual(panchangaCodes(U.SHRIDHAR, { ...x, sunSign: 9, month: 10, taraCount: 2 }), ['SUN_SIGN_MID'], 'the Sun in Capricorn: middling');
  // Kalyanraman's Sapta Shalaka vedha; Shridhar's Pancha Shalaka.
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, vedha: { PANCHA: true, SAPTA: false } }), []);
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, vedha: { PANCHA: false, SAPTA: true } }), ['VEDHA']);
  // The 8th from the birth Moon (Scorpio): Venus alone may be there.
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, signs: { ...signs, Venus: 7 } }), []);
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, signs: { ...signs, Saturn: 7 } }), ['NATAL_8']);
  // Joshi: the Moon in a navamsa of Mercury, Jupiter or Venus — her own only in the 4th quarters of Punarvasu and Shravana.
  assert.deepEqual(panchangaCodes(U.JOSHI, x), ['CHANDRA_MID'], 'the Moon in the 2nd: medium');
  assert.deepEqual(panchangaCodes(U.JOSHI, { ...x, navs: { ...x.navs, Moon: 3 }, moonPada: 15 }), ['CHANDRA_MID', 'MOON_NAV']);
  assert.deepEqual(panchangaCodes(U.JOSHI, { ...x, star: 21, navs: { ...x.navs, Moon: 3 }, moonPada: 87 }), ['CHANDRA_MID'], 'Shravana 4');
  assert.deepEqual(panchangaCodes(U.JOSHI, { ...x, navs: { ...x.navs, Moon: 0 } }), ['CHANDRA_MID', 'MOON_NAV'], 'an Aries navamsa: Mars\'s');
  // Conjunction: the Moon with Saturn; the nodes are not in MC V.52's list.
  assert.ok(panchangaCodes(U.JOSHI, { ...x, signs: { ...signs, Saturn: 1 } }).includes('CONJ'));
  assert.ok(!panchangaCodes(U.JOSHI, { ...x, signs: { ...signs, Rahu: 1, Ketu: 7 } }).includes('CONJ'));
  // Kalyanraman's own reading leaves out item 8 ("Others want …").
  assert.deepEqual(panchangaCodes(U.KALYANRAMAN, { ...x, signs: { ...signs, Saturn: 1 }, navs: { ...x.navs, Moon: 3 }, moonPada: 15 }), []);

  // Guru: Jupiter in Scorpio, the 8th from Aries — bad; vargottama, or in a friend's navamsa (Kalyanraman), condones it.
  const g = (o) => ({ ...x, signs: { ...signs, ...o.signs }, navs: { ...x.navs, ...o.navs }, month: o.month ?? 1, sunSign: o.sunSign ?? 0 });
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 1 } })), ['GURU']);
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 7 } })), [], 'vargottama');
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 4 } })), [], 'a Leo navamsa');
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 1 }, month: 0 })), [], 'Chaitra');
  assert.deepEqual(guruCodes(U.SHRIDHAR.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 1 }, month: 0 })), ['GURU'], 'Shridhar: Chaitra only with the Sun in Pisces');
  assert.deepEqual(guruCodes(U.SHRIDHAR.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 1 }, month: 0, sunSign: 11 })), []);
  assert.deepEqual(guruCodes(U.SHRIDHAR.guru, g({ signs: { Jupiter: 7 }, navs: { Jupiter: 11 } })), [], 'a friend\'s sign with his own navamsa');
  // Jupiter in Gemini (the 3rd), an enemy's sign: bad even in a good place; in Cancer always well.
  assert.deepEqual(guruCodes(U.WILHELM.guru, g({ signs: { Jupiter: 2 }, navs: { Jupiter: 1 } })), ['GURU']);
  assert.deepEqual(guruCodes(U.WILHELM.guru, g({ signs: { Jupiter: 3 }, navs: { Jupiter: 1 } })), []);
  assert.deepEqual(guruCodes(U.JOSHI.guru, g({ signs: { Jupiter: 2 }, navs: { Jupiter: 1 } })), ['GURU_MID'], 'Joshi: the 3rd is medium');
  // Shridhar's vedha: Jupiter in Aquarius, the 2nd from Capricorn, struck from the 12th (Sagittarius).
  const cap = { ...x, natalMoon: 9, signs: { ...signs, Jupiter: 10, Saturn: 6 }, navs: { ...x.navs, Jupiter: 1 } };
  assert.deepEqual(guruCodes(U.SHRIDHAR.guru, cap), []);
  assert.deepEqual(guruCodes(U.SHRIDHAR.guru, { ...cap, signs: { ...cap.signs, Saturn: 8 } }), ['GURU_MID']);
  assert.deepEqual(guruCodes(U.KALYANRAMAN.guru, { ...cap, signs: { ...cap.signs, Saturn: 8 } }), [], 'Kalyanraman gives no vedha');

  // Ravi: the Sun in Taurus (the 2nd from Aries) — middling; in Cancer (a friend's) — good; after his 13th degree the next place counts.
  const r = (sun, deg = 5, natalMoon = 0) => ({ ...x, natalMoon, sunDeg: deg, signs: { ...signs, Sun: sun }, navs: { ...x.navs, Sun: 0 } });
  assert.deepEqual(raviCodes(U.KALYANRAMAN.ravi, r(1)), ['RAVI_MID']);
  assert.deepEqual(raviCodes(U.KALYANRAMAN.ravi, r(3)), []);
  assert.deepEqual(raviCodes(U.KALYANRAMAN.ravi, r(6)), ['RAVI_MID'], 'Libra, the 7th');
  assert.deepEqual(raviCodes(U.SHRIDHAR.ravi, r(1, 14, 10)), ['RAVI'], 'Taurus the 4th from Aquarius; Gemini the 5th — not good');
  assert.deepEqual(raviCodes(U.SHRIDHAR.ravi, r(9, 14, 5)), [], 'Capricorn the 5th from Virgo, past the 13th, Aquarius the 6th');
  assert.deepEqual(raviCodes(U.SHRIDHAR.ravi, r(9, 10, 5)), ['RAVI_MID']);
}

// ------------------------------------------------ upanayana: the lagna ---
{
  // A Taurus lagna: the Moon in Taurus (the 1st), Jupiter in Cancer (3rd), Venus in Pisces (11th), the Sun in Aries (12th).
  const signs = { Sun: 0, Moon: 1, Mars: 10, Mercury: 11, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 4, Ketu: 10 };
  const m = { lagna: 1, nav: 1, signs, natalLagna: 6, natalMoon: 0, combust: { Mercury: false, Jupiter: false, Venus: false }, dayPart: 1, pradosha: false, tithi: 2, star: 3, vara: 4 };
  const codes = (b, o = {}) => lagnaCodes(U[b], { ...m, ...o, signs: { ...signs, ...o.signs } });
  assert.deepEqual(codes('KALYANRAMAN').filter((c) => !c.endsWith('_MID')), ['IN_Jupiter_3', 'IN_Moon_1'], 'Jupiter in the 3rd; the Moon in the lagna');
  assert.ok(!codes('WILHELM').includes('IN_Moon_1'), 'Wilhelm: the Moon exalted in the lagna is allowed');
  assert.ok(codes('MUHURTA_CHINTAMANI').every((c) => c !== 'IN_Moon_1_MID'));
  assert.ok(codes('MUHURTA_CHINTAMANI', { lagna: 4, nav: 1, signs: { Moon: 4 } }).includes('IN_Moon_1_MID'), 'MC: the Moon in a Leo lagna — not auspicious, marked');
  // Cancer rising with the Moon and Jupiter there and the Sun, Mars, Saturn in 3, 6, 11 (Raman, Kalyanraman).
  const cancer = { lagna: 3, signs: { Moon: 3, Jupiter: 3, Sun: 5, Mars: 8, Saturn: 1 } };
  assert.ok(!codes('RAMAN', cancer).includes('IN_Moon_1'));
  assert.ok(codes('RAMAN', { ...cancer, signs: { ...cancer.signs, Jupiter: 4 } }).includes('IN_Moon_1'));
  // The 8th: Venus alone for Kalyanraman.
  assert.ok(!codes('KALYANRAMAN', { signs: { Venus: 8 } }).includes('EMPTY_8'));
  assert.ok(codes('KALYANRAMAN', { signs: { Mercury: 8 } }).includes('EMPTY_8'));
  assert.ok(codes('RAMAN', { signs: { Venus: 8 } }).includes('EMPTY_8'));
  // Malefics in the angles (Shridhar, Wilhelm, Raman): the Sun in the 10th from Taurus.
  assert.ok(codes('SHRIDHAR', { signs: { Sun: 10 } }).includes('IN_Sun_10'));
  // Shridhar's navamsas: Cancer prohibited; Wilhelm only marks a malefic's.
  assert.ok(codes('SHRIDHAR', { nav: 3 }).includes('NAV'));
  assert.ok(codes('WILHELM', { nav: 0 }).includes('NAV_MID') && !codes('WILHELM', { nav: 0 }).includes('NAV'));
  // The day: night rejects; MC's second third is middling, the last rejected; Shridhar wants the forenoon.
  assert.ok(codes('MUHURTA_CHINTAMANI', { dayPart: 0 }).includes('NIGHT'));
  assert.ok(codes('MUHURTA_CHINTAMANI', { dayPart: 3 }).includes('DAY_PART_MID'));
  assert.ok(codes('MUHURTA_CHINTAMANI', { dayPart: 4 }).includes('DAY_PART'));
  assert.ok(codes('SHRIDHAR', { dayPart: 3 }).includes('DAY_PART'));
  assert.ok(!codes('SHRIDHAR', { dayPart: 2 }).includes('DAY_PART'));
  assert.ok(codes('SHRIDHAR', { pradosha: true }).includes('PRADOSHA'));
  assert.ok(!codes('RAMAN', { pradosha: true }).includes('PRADOSHA'), 'Raman names no Pradosha');
  // Weekdays: Wednesday with Mercury combust; Monday in the dark half.
  assert.deepEqual(varaCodes(U.KALYANRAMAN, 3, { combust: { Mercury: true }, tithi: 2 }), ['WED_COMBUST']);
  assert.deepEqual(varaCodes(U.SHRIDHAR, 1, { combust: {}, tithi: 18 }), ['VARA_MID', 'MON_KRISHNA']);
  // Agarwal's roga panchaka: Shukla 2 + Sunday (1) + Ashwini (1) + Cancer (4) = 8.
  assert.ok(codes('AGARWAL', { tithi: 2, vara: 0, star: 0, lagna: 3 }).includes('ROGA_PANCHAKA'));
  assert.ok(!codes('AGARWAL', { tithi: 2, vara: 0, star: 0, lagna: 4 }).includes('ROGA_PANCHAKA'));
  // Rangacharya's vimsopaka for this sky from Taurus: Sun 12 (−3.5), Moon 1 (−5), Mars 10 (−1.5), Mercury 11 (+2),
  // Jupiter 3 (+3), Venus 11 (+2), Saturn 6 (+1.5), Rahu 4 (−1.5) = −3: below 5.
  assert.ok(codes('RANGACHARYA').includes('POINTS'));
  // The Sun and the Moon in the 3rd instead (+3.5, +5): 14 — not even middling.
  const better = codes('RANGACHARYA', { signs: { Sun: 3, Moon: 3 } });
  assert.ok(!better.includes('POINTS') && !better.includes('POINTS_MID'), 'Sun and Moon in the 3rd: 14');
  assert.ok(codes('RANGACHARYA', { signs: { Moon: 3 } }).includes('POINTS_MID'), 'the Moon alone in the 3rd: 7, middling');
  assert.ok(codes('RANGACHARYA', { signs: { Sun: 3 } }).includes('POINTS'), 'the Sun alone in the 3rd: 4');
}

// ------------------------------------------------ the engine ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T18:30:00Z');
  const r = muhurtaStarChecks({ natalMoonLongitude: 45.5, natalLagnaLongitude: 200, fromMs, toMs: fromMs + 40 * DAY, latitude: 13.08, longitude: 80.27 });
  const jd = (ms) => ms / DAY + 2440587.5;
  const sunSign = (ms) => Math.floor(planetLongitude(jd(ms), 'Sun', 'Lahiri') / 30);
  const elong = (ms) => ((planetLongitude(jd(ms), 'Moon', 'Lahiri') - planetLongitude(jd(ms), 'Sun', 'Lahiri')) % 360 + 360) % 360;
  for (const s of r.segments) {
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    // The month: back to the last new moon (elongation through 0), the Sun's sign there, plus one.
    let t = mid;
    while (elong(t) > 1) t -= Math.min(elong(t), 30) / 13 * DAY * 0.9;
    let lo = t - DAY; let hi = t;
    while (elong(lo) < 180) lo -= DAY;
    for (let k = 0; k < 40; k += 1) { const c = (lo + hi) / 2; if (elong(c) > 180) lo = c; else hi = c; }
    assert.equal(s.month, (sunSign(hi) + 1) % 12, `month at ${s.fromUtc}`);
    assert.equal(s.sunSign, sunSign(mid));
    for (const b of G.order) assert.deepEqual(s.ev.GRIHA_PRAVESHA[b], panchangaCodes(G[b], { star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar }), `${b} ${s.fromUtc}`);
  }
  // Mid-October 2026 is Ashvin (the new moon of 10 October with the Sun in Virgo), then Kartika.
  assert.equal(r.segments.find((s) => s.fromUtc.startsWith('2026-10-15')).month, 6);
  assert.equal(r.segments.find((s) => s.fromUtc.startsWith('2026-11-15')).month, 7);
  assert.ok(r.eventTable.length > 0 && r.segments.every((s) => s.lagnas.every((x) => Number.isInteger(x[10]))));

  // Upanayana: every book's codes for each piece, from the sky at its middle.
  const lonOf = (p, ms) => ((p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : planetLongitude(jd(ms), p, 'Lahiri')) % 360 + 360) % 360;
  // The end (dir 1) or start (dir −1) of the tithi running at ms.
  const tithiEdge = (ms, dir) => {
    const k = Math.floor(elong(ms) / 12);
    let a = ms; let b = ms + dir * 1.2 * DAY;
    for (let i = 0; i < 45; i += 1) { const c = (a + b) / 2; if (Math.floor(elong(c) / 12) === k) a = c; else b = c; }
    return a;
  };
  let sankrantis = 0;
  for (const s of r.segments) {
    // Boundaries are found to seconds: a piece of a few seconds may sit astride one.
    if (Date.parse(s.toUtc) - Date.parse(s.fromUtc) < 2 * 60000) continue;
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    const signs = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'].map((p) => [p, Math.floor(lonOf(p, mid) / 30)]));
    signs.Ketu = (signs.Rahu + 6) % 12;
    const padaOf = (p) => Math.floor(lonOf(p, mid) / (10 / 3)) % 108;
    const sankranti = sunSign(tithiEdge(mid, -1) + 1000) !== sunSign(tithiEdge(mid, 1) - 1000);
    if (sankranti) sankrantis += 1;
    const x = {
      star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar, sunDeg: Math.floor(lonOf('Sun', mid)) % 30,
      yoga: Math.floor(((lonOf('Moon', mid) + lonOf('Sun', mid)) % 360) / (360 / 27)), vishti: isVishti(Math.floor(elong(mid) / 6)), sankranti,
      taraCount: s.tara.count, signs, navs: { Sun: padaOf('Sun') % 12, Jupiter: padaOf('Jupiter') % 12, Moon: padaOf('Moon') % 12 },
      moonPada: s.star * 4 + s.pada - 1, natalMoon: 1,
      vedha: { PANCHA: Boolean(s.doshas.VEDHA.readings.PANCHA), SAPTA: Boolean(s.doshas.VEDHA.readings.SAPTA) }, bana: Boolean(s.doshas.BANA.readings.SUN_DEGREE),
    };
    for (const b of U.order) assert.deepEqual(s.ev.UPANAYANA[b], panchangaCodes(U[b], x), `upanayana ${b} ${s.fromUtc}`);
  }
  assert.ok(sankrantis >= 1, 'the Sun changes sign in 40 days');

  // The part of the day and Pradosha for each lagna stretch, from sunrise and sunset at Chennai.
  const toMs = (j) => (j - 2440587.5) * DAY;
  const riseBefore = (ms) => {
    const r1 = sunriseJulianDay(jd(ms) - 1, 13.08, 80.27);
    const r2 = sunriseJulianDay(r1 + 0.01, 13.08, 80.27);
    return r2 <= jd(ms) ? r2 : r1;
  };
  const base = Date.parse(r.fromUtc);
  let pradoshas = 0; let checked = 0;
  for (const s of r.segments) {
    for (const st of s.lagnas) {
      if (st[1] - st[0] < 120) continue;
      const mid = base + ((st[0] + st[1]) / 2) * 1000;
      const rise = riseBefore(mid);
      const set = sunsetJulianDay(rise, 13.08, 80.27);
      const next = sunriseJulianDay(set + 0.01, 13.08, 80.27);
      const f = (jd(mid) - rise) / (set - rise);
      const part = jd(mid) >= set ? 0 : f < 1 / 3 ? 1 : f < 1 / 2 ? 2 : f < 2 / 3 ? 3 : 4;
      const k = Math.floor(elong(toMs(rise)) / 12);
      const n = (k % 15) + 1;
      const lim = { 12: 2, 6: 1.5, 3: 1 }[n];
      const pradosha = lim !== undefined && tithiEdge(toMs(rise), 1) < toMs(set) + lim * (toMs(next) - toMs(set)) / 4;
      const w = r.eventTable[st[10]].UPANAYANA.WILHELM;
      assert.equal(w.includes('NIGHT'), part === 0, `night ${new Date(mid).toISOString()}`);
      assert.equal(w.includes('DAY_PART'), part === 3 || part === 4, `part ${part} ${new Date(mid).toISOString()}`);
      assert.equal(w.includes('PRADOSHA'), pradosha, `pradosha ${new Date(mid).toISOString()}`);
      if (pradosha) pradoshas += 1;
      checked += 1;
    }
  }
  assert.ok(checked > 1000 && pradoshas > 0, `${checked} stretches, ${pradoshas} on Pradosha days`);
}

console.log('test-event-muhurta: all checks passed');
