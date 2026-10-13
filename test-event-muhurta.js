const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./src/report/eventMuhurtaTables');
const {
  panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, kumbhaCount, rejects, guruCodes, raviCodes, inHarishayana, isVishti,
  pieceCodes, stretchCodes, relOf, KAALA_DAY, VAAR_RAHU, venusBlind,
} = require('./src/report/eventMuhurta');
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

// ------------------------------------------------ travel: the tables against the books ---
const TR = E.EVENTS.TRAVEL;
const TF = FIX.travel;
const STAR_N = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati'];
const SIGN_N = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const MONTH_N = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvin', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
const DAY_N = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const idx = (list, n) => { const i = list.indexOf(n); assert.ok(i >= 0, `name ${n}`); return i; };
const stars = (ns) => sorted(ns.map((n) => (n === 'Abhijit' ? 'ABHIJIT' : idx(STAR_N, n))));
const days = (ns) => sorted(ns.map((n) => idx(DAY_N, n)));
const signsOf = (ns) => sorted(ns.map((n) => idx(SIGN_N, n)));
const ofMap = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, sorted([...v])]));
{
  assert.deepEqual({ ...E.RANK.TRAVEL.words }, TF.words);
  assert.deepEqual([...TR.order], Object.keys(TF.words).sort((a, b) => TF.words[b] - TF.words[a]));
  assert.equal(TR.default, TF.default);
  for (const b of TR.order) {
    assert.ok(resolveByTitle(E.SOURCES.TRAVEL[b].title), `registered: ${b}`);
    assert.ok(TR[b].linesTa.length > 0, `${b} described`);
  }
  // Stars.
  const S = TF.stars;
  assert.deepEqual(sorted(TR.SHRIDHAR.nak.good), stars(S.SHRIDHAR_benefic));
  assert.deepEqual(sorted(TR.MUHURTA_CHINTAMANI.nak.good), stars(S.MC_sloka9));
  assert.deepEqual(TR.MUHURTA_CHINTAMANI.nak.mid.length, 0, 'MC: the rest are avoided');
  assert.deepEqual(sorted(TR.WILHELM.nak.good), stars(S.WILHELM_most));
  assert.deepEqual(sorted(TR.WILHELM.nak.mid), stars(S.WILHELM_middling));
  assert.deepEqual(sorted(TR.JOSHI.nak.good), stars(S.JOSHI_best));
  assert.deepEqual(sorted(TR.JOSHI.nak.mid), stars(S.JOSHI_KR_medium));
  assert.deepEqual(sorted(TR.KALYANRAMAN.nak.good), stars(S.KR_best));
  assert.deepEqual(sorted(TR.KALYANRAMAN.nak.mid), stars([...S.JOSHI_KR_medium, 'Moola']), 'Moola: "best" in his note — middling (our reading)');
  assert.deepEqual(sorted(TR.RAMAN.nak.good), stars(S.RAMAN_good));
  for (const s of stars(S.RAMAN_never)) assert.ok(!TR.RAMAN.nak.good.includes(s) && !TR.RAMAN.nak.mid.includes(s) && TR.RAMAN.nakAfter[s] === undefined, `Raman never ${s}`);
  assert.deepEqual(sorted(TR.RANGACHARYA.nak.good), stars(S.RANGACHARYA_excellent_favoured));
  assert.deepEqual(sorted(TR.RANGACHARYA.nak.mid), stars(S.RANGACHARYA_mediocre));
  for (const s of stars(S.RANGACHARYA_avoid)) assert.ok(!TR.RANGACHARYA.nak.good.includes(s) && !TR.RANGACHARYA.nak.mid.includes(s));
  const ghatis = (m) => Object.fromEntries(Object.entries(m).map(([n, g]) => [idx(STAR_N, n), g]));
  assert.deepEqual({ ...TR.MUHURTA_CHINTAMANI.nakAfter }, ghatis(TF.ghatis_MC_sloka12));
  for (const b of ['SHRIDHAR', 'JOSHI', 'KALYANRAMAN']) assert.deepEqual({ ...TR[b].nakAfter }, ghatis(TF.ghatis_MC_sloka12), `${b} cites MC's ghatis`);
  assert.deepEqual({ ...TR.WILHELM.nakAfter }, ghatis(TF.ghatis_WILHELM));
  // Tithis.
  const T = TF.tithis;
  assert.deepEqual(sorted(TR.MUHURTA_CHINTAMANI.tithi), [...Array(30).keys()].map((i) => i + 1).filter((t) => !T.MC_sloka9_avoid.includes(t)));
  assert.deepEqual(sorted(TR.SHRIDHAR.tithi), sorted(T.SHRIDHAR_beneficial));
  assert.deepEqual(sorted(TR.SHRIDHAR.tithiNot), sorted(T.SHRIDHAR_failure_p616));
  assert.deepEqual(sorted(TR.WILHELM.tithi), sorted(T.WILHELM_favorable));
  assert.deepEqual([...TR.WILHELM.tithiMid], [16], 'Krishna 1 middling');
  for (const b of ['JOSHI', 'KALYANRAMAN']) assert.deepEqual(sorted(TR[b].tithi), sorted(T.JOSHI_KR_good), b);
  assert.deepEqual(sorted(TR.RAMAN.tithiNot), sorted(T.RAMAN_avoid_any_cost));
  assert.deepEqual(sorted(TR.RANGACHARYA.tithiNot), sorted(T.RANGACHARYA_avoid));
  assert.deepEqual(sorted(TR.RANGACHARYA.tithi), sorted(T.RANGACHARYA_favoured));
  assert.deepEqual(sorted(TR.VASHISTHA.tithi), sorted(T.VASHISTHA));
  // Weekdays.
  const W = TF.weekdays;
  assert.deepEqual(sorted(TR.SHRIDHAR.vara.good), days(W.SHRIDHAR_benefic));
  for (const v of days(W.SHRIDHAR_malefic_p616)) assert.ok(!TR.SHRIDHAR.vara.good.includes(v) && !TR.SHRIDHAR.vara.mid.includes(v));
  assert.deepEqual(sorted(TR.JOSHI.vara.good), days(W.JOSHI_best));
  assert.deepEqual(sorted(TR.JOSHI.vara.mid), days(W.JOSHI_medium));
  assert.deepEqual(sorted(TR.RANGACHARYA.vara.good), days(W.RANGACHARYA_good));
  // The direction tables.
  assert.deepEqual(ofMap(E.TITHI_DIR8), ofMap(TF.tithi_shoola_8));
  const kp = Object.fromEntries(Object.entries(TF.yogini_KP_wilhelm).map(([d, ts]) => [d, ts.map((t) => (t[0] === 'S' ? 0 : 15) + Number(t.slice(1)))]));
  assert.deepEqual(ofMap(E.YOGINI_KP), ofMap(kp));
  const dayMap = (m) => Object.fromEntries(Object.entries(m).map(([d, ns]) => [d, days(ns)]));
  const spread = (m) => ({ E: m.E, SE: m.E, S: m.S, SW: m.S, W: m.W, NW: m.W, N: m.N, NE: m.N });
  assert.deepEqual(ofMap(TR.MUHURTA_CHINTAMANI.vaarShoola[0].map), spread(dayMap(TF.vaar_shoola_MC)), 'four directions over eight');
  assert.deepEqual(ofMap(TR.JOSHI.vaarShoola[0].map), dayMap(TF.vaar_shoola_JOSHI_11_2));
  assert.deepEqual(ofMap(TR.KALYANRAMAN.vaarShoola[0].map), dayMap(TF.vaar_shoola_KR_MC_table));
  assert.deepEqual(ofMap(TR.SHRIDHAR.vaarShoola[1].map), dayMap(TF.kona_SHRIDHAR));
  assert.deepEqual(ofMap(TR.WILHELM.vaarShoola[1].map), dayMap(TF.kantaka));
  const rel = (m) => Object.fromEntries(Object.entries(m).map(([d, g]) => [idx(DAY_N, d), g]));
  assert.deepEqual({ ...TR.WILHELM.vaarShoola[0].release }, rel(TF.release_KP));
  assert.deepEqual({ ...TR.SHRIDHAR.vaarShoola[0].release }, rel(TF.release_SHRIDHAR_23_3));
  for (const [d, n] of Object.entries(TF.nak_shoola_MC)) assert.deepEqual([...TR.MUHURTA_CHINTAMANI.nakShoola[d]], [idx(STAR_N, n)]);
  const D8 = E.DIRECTIONS.order;
  for (const [d, k] of Object.entries(TF.kaala_day)) assert.equal(D8[KAALA_DAY[idx(DAY_N, d)]], k);
  for (const [d, p] of Object.entries(TF.pasha_day)) assert.equal(D8[(KAALA_DAY[idx(DAY_N, d)] + 4) % 8], p);
  for (const [d, k] of Object.entries(TF.vaar_rahu)) assert.equal(D8[VAAR_RAHU[idx(DAY_N, d)]], k);
  assert.deepEqual(JSON.parse(JSON.stringify(E.LALATIKA)), TF.lalatika);
  assert.deepEqual(JSON.parse(JSON.stringify(TR.KALYANRAMAN.lalatika)), { ...TF.lalatika, ...TF.lalatika_KR_as_printed });
  // Ghaata.
  const GH = TF.ghata;
  assert.deepEqual([...E.GHATA.nak], SIGN_N.map((s) => idx(STAR_N, GH.nak[s])));
  const CLASS_N = ['Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Poorna'];
  assert.deepEqual([...E.GHATA.tithiClass], SIGN_N.map((s) => CLASS_N.findIndex((c) => GH.tithi[c].includes(s))));
  assert.deepEqual([...E.GHATA.vara], SIGN_N.map((s) => DAY_N.findIndex((d) => GH.vara[d].includes(s))));
  assert.deepEqual([...E.GHATA.lagna], GH.lagna_MC_sloka33.map((n) => n - 1));
  assert.deepEqual([...E.GHATA.lagnaRangacharya], SIGN_N.map((s) => idx(SIGN_N, GH.lagna_RANGACHARYA[s])));
  assert.deepEqual([...E.GHATA.moon], SIGN_N.map((s) => idx(SIGN_N, GH.moon_WILHELM[s])));
  const pada = (m) => SIGN_N.map((s) => idx(STAR_N, m[s][0]) * 4 + m[s][1] - 1);
  assert.deepEqual([...E.GHATA.padaWilhelm], pada(GH.pada_WILHELM));
  assert.deepEqual([...E.GHATA.padaKR], pada({ ...GH.pada_WILHELM, ...GH.pada_KR_JOSHI_differ }));
  assert.deepEqual([...E.GHATA.padaVashistha], pada({ ...GH.pada_WILHELM, ...GH.pada_VASHISTHA_differ }));
  assert.deepEqual([...E.GHATA.monthShridhar], SIGN_N.map((s) => idx(MONTH_N, GH.month_SHRIDHAR_23_1[s])));
  assert.deepEqual([...E.GHATA.monthKR], GH.month_JOSHI_11_6.map((m) => idx(MONTH_N, m)));
  // Kaala Shoola, Vashistha's lagnas by tithi, the houses, the lagnas, the Sun's signs.
  const K = TF.kaal_shoola_MC;
  assert.deepEqual(E.KAAL_SHOOLA.day.map((g) => sorted(g.map((x) => (x === 'ABHIJIT' ? 99 : x)))), [K.day1, K.day2, K.day3].map((g) => sorted(g.map((n) => (n === 'Abhijit' ? 99 : idx(STAR_N, n))))));
  assert.deepEqual(E.KAAL_SHOOLA.night.map((g) => sorted(g)), [K.night1, K.night2, K.night3].map(stars));
  assert.deepEqual(sorted(E.KAAL_SHOOLA.always), stars(K.always));
  const LT = TF.lagna_tithi_VASHISTHA;
  assert.deepEqual(TR.VASHISTHA.lagnaTithi.map((g) => sorted(g)), ['Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Poorna'].map((c) => sorted(LT[c].map((n) => n - 1))));
  const houses = (list) => Object.fromEntries(list.flatMap(([ps, hs]) => ps.map((p) => [p, sorted(hs)])));
  assert.deepEqual(houses(TR.MUHURTA_CHINTAMANI.notIn), ofMap(TF.houses_MC_sloka56));
  assert.deepEqual(houses(TR.SHRIDHAR.notIn), ofMap(TF.houses_MC_sloka56), 'Shridhar quotes MC 11/56');
  assert.deepEqual(houses(TR.WILHELM.notIn), ofMap(TF.houses_WILHELM));
  const LG = TF.lagnas;
  assert.deepEqual(sorted(TR.SHRIDHAR.lagna.good), signsOf(LG.SHRIDHAR_not_prishtodaya_aquarius_pisces));
  assert.deepEqual(sorted(TR.WILHELM.lagna.good), signsOf(LG.WILHELM_most));
  assert.deepEqual(sorted(TR.WILHELM.lagna.mid), signsOf(LG.WILHELM_middling));
  assert.deepEqual(sorted(TR.RAMAN.lagna.good), signsOf(LG.RAMAN));
  assert.deepEqual(sorted(TR.RANGACHARYA.lagna.good), signsOf(LG.RANGACHARYA_good));
  for (const b of TR.order.filter((x) => TR[x].sunSign)) assert.deepEqual(sorted(TR[b].sunSign.good), signsOf(TF.sun_signs.best), `${b}: the Sun's best signs`);
  for (const s of signsOf(TF.sun_signs.MC_long)) assert.ok(TR.MUHURTA_CHINTAMANI.sunSign.mid.includes(s));
  for (const s of signsOf(TF.sun_signs.VASHISTHA_inauspicious)) assert.ok(!TR.VASHISTHA.sunSign.mid.includes(s) && !TR.VASHISTHA.sunSign.good.includes(s));
}

// ------------------------------------------------ travel: the codes ---
{
  const sky = { Sun: 9, Moon: 9, Mars: 2, Mercury: 9, Jupiter: 3, Venus: 8, Saturn: 11, Rahu: 11, Ketu: 5 };
  const base = {
    star: 12, tithi: 2, month: 10, sunSign: 9, sunStar: 21, sunDeg: 5, yoga: 3, yogaHalf: 6, vishti: false, sankranti: false, taraCount: 2,
    signs: sky, navs: { Sun: 1, Jupiter: 2, Moon: 3 }, moonPada: 50, natalMoon: 1, natalLagna: 6, vedha: {}, bana: false,
    dir: null, starFrac: 0.5, rahuCount: 5, venus: { east: true, sign: 8, star: 19 },
  };
  const has = (b, x, c) => pieceCodes(TR[b], { ...base, ...x }).includes(c);
  // Yogini (MC XI.34 note): on the 1st she is east — in front going east, on the left going south.
  assert.equal(relOf(0, 2), 6);
  assert.ok(has('MUHURTA_CHINTAMANI', { tithi: 1, dir: 0 }, 'YOGINI') && has('MUHURTA_CHINTAMANI', { tithi: 1, dir: 2 }, 'YOGINI'));
  assert.ok(!has('MUHURTA_CHINTAMANI', { tithi: 1, dir: 4 }, 'YOGINI') && !has('MUHURTA_CHINTAMANI', { tithi: 1, dir: 6 }, 'YOGINI'));
  // Shridhar keeps her on the left: the right is barred instead.
  assert.ok(has('SHRIDHAR', { tithi: 1, dir: 6 }, 'YOGINI') && !has('SHRIDHAR', { tithi: 1, dir: 2 }, 'YOGINI'));
  // Joshi marks her: a secondary rule.
  assert.ok(has('JOSHI', { tithi: 1, dir: 0 }, 'YOGINI_MID') && !has('JOSHI', { tithi: 1, dir: 0 }, 'YOGINI'));
  // Wilhelm's Kalaprakasika table too: Krishna 6 (21) east.
  assert.ok(has('WILHELM', { tithi: 21, dir: 0 }, 'YOGINI_MID') && !has('MUHURTA_CHINTAMANI', { tithi: 21, dir: 0 }, 'YOGINI'));
  // MC's Rahu example (XI.14 note): Rahu in Swati — Ashwini is Grasta (the 15th), Bharani Mrita (16th), Revati Jeeva (14th, Abhijit counted).
  const ex = TF.rahu_example_MC_sloka14;
  const r28 = (n) => { const i = idx(STAR_N, n); return i <= 20 ? i : i + 1; };
  const count = (moon) => ((r28(moon) - r28(ex.rahu) + 28) % 28) + 1;
  assert.deepEqual([count(ex.kartari), count(ex.jeeva_first), count(ex.jeeva_last), count(ex.grasta), count(ex.mrita_first), count(ex.mrita_last)], [1, 2, 14, 15, 16, 28]);
  assert.ok(has('MUHURTA_CHINTAMANI', { rahuCount: 15 }, 'RAHU_PAKSHA_MID') && has('JOSHI', { rahuCount: 15 }, 'RAHU_PAKSHA_MID'), 'Joshi rejects Grasta, but marks Rahu altogether');
  assert.ok(has('MUHURTA_CHINTAMANI', { rahuCount: 16 }, 'RAHU_PAKSHA') && !has('MUHURTA_CHINTAMANI', { rahuCount: 14 }, 'RAHU_PAKSHA'));
  // The cruel stars' ghatis: Krittika (2) for 21 of 60.
  assert.ok(has('MUHURTA_CHINTAMANI', { star: 2, starFrac: 0.3 }, 'NAK_GHATI') && has('MUHURTA_CHINTAMANI', { star: 2, starFrac: 21 / 60 }, 'NAK_LATE_MID'));
  assert.ok(has('MUHURTA_CHINTAMANI', { star: 5 }, 'NAK'), 'Ardra: no ghatis');
  // Parigha: the Moon in Ardra going west (Shridhar's own example); Pushya is free (MC XI.38).
  assert.ok(has('SHRIDHAR', { star: 5, dir: 4 }, 'PARIGHA') && !has('SHRIDHAR', { star: 5, dir: 0 }, 'PARIGHA'));
  assert.ok(!has('MUHURTA_CHINTAMANI', { star: 7, dir: 4 }, 'PARIGHA'));
  // The Moon in Aries (east): behind going west, on the left going south, on the right going north.
  const aries = { signs: { ...sky, Moon: 0 }, moonPada: 9 };
  assert.ok(has('SHRIDHAR', { ...aries, dir: 4 }, 'CHANDRA_DIR') && has('SHRIDHAR', { ...aries, dir: 2 }, 'CHANDRA_DIR'));
  assert.ok(!has('SHRIDHAR', { ...aries, dir: 6 }, 'CHANDRA_DIR') && !has('SHRIDHAR', { ...aries, dir: 0 }, 'CHANDRA_DIR'));
  // Venus a morning star (east): in front going east or south-east — not while the Moon is in Revati … Krittika 1 (blind).
  assert.ok(has('MUHURTA_CHINTAMANI', { dir: 1 }, 'VENUS_FRONT') && has('SHRIDHAR', { dir: 4 }, 'VENUS_FRONT'), 'Shridhar\'s print puts her west');
  assert.ok(venusBlind(104) && venusBlind(8) && !venusBlind(9));
  assert.ok(!has('MUHURTA_CHINTAMANI', { dir: 0, moonPada: 105 }, 'VENUS_FRONT'));
  // Tithi classes: Poorna north, Rikta and the new Moon any way.
  assert.ok(has('SHRIDHAR', { tithi: 5, dir: 6 }, 'TITHI_DIR') && !has('SHRIDHAR', { tithi: 5, dir: 0 }, 'TITHI_DIR'));
  assert.ok(has('SHRIDHAR', { tithi: 19, dir: 3 }, 'TITHI_DIR') && has('SHRIDHAR', { tithi: 30, dir: 3 }, 'TITHI_DIR'));
  // Shridhar's tithis three ways; the 30th is the north-east's Shoola.
  assert.ok(has('SHRIDHAR', { tithi: 7 }, 'TITHI_MID') && has('SHRIDHAR', { tithi: 6 }, 'TITHI') && !has('SHRIDHAR', { tithi: 2 }, 'TITHI'));
  assert.ok(has('SHRIDHAR', { tithi: 30, dir: 7 }, 'TITHI_SHOOLA') && !has('SHRIDHAR', { tithi: 15, dir: 7 }, 'TITHI_SHOOLA'));
  // Panchaka south (Raman, Shridhar); the Sun's middle third of Leo (Wilhelm, marked).
  assert.ok(has('RAMAN', { signs: { ...sky, Moon: 10 }, dir: 3 }, 'PANCHAKA_SOUTH') && !has('RAMAN', { signs: { ...sky, Moon: 10 }, dir: 0 }, 'PANCHAKA_SOUTH'));
  assert.ok(has('WILHELM', { sunSign: 4, sunDeg: 15 }, 'SUN_MID_THIRD_MID'));
  // Ghaata for a Taurus birth Moon: Hasta, Poorna, Chitra 2 (Joshi) / Magha 2 (Wilhelm), Virgo.
  assert.ok(has('RANGACHARYA', { star: 12 }, 'GHATA_NAK') && has('RANGACHARYA', { tithi: 25 }, 'GHATA_TITHI'));
  assert.ok(has('JOSHI', { moonPada: 53 }, 'GHATA_PADA_MID') && has('WILHELM', { moonPada: 37 }, 'GHATA_PADA_MID'));
  assert.ok(has('VASHISTHA', { signs: { ...sky, Moon: 5 } }, 'GHATA_MOON'));
  // Mahadala (MC XI.25): the Moon's star the 7th from the Sun's (remainder 0).
  assert.ok(has('MUHURTA_CHINTAMANI', { sunStar: 0, star: 6 }, 'MAHADALA') && !has('MUHURTA_CHINTAMANI', { sunStar: 0, star: 4 }, 'MAHADALA'));

  // Lagna stretches: a Leo lagna on a Monday.
  const m = {
    lagna: 4, nav: 4, signs: sky, natalLagna: 6, natalMoon: 1, combust: {}, retro: {}, dayPart: 1, nightPart: 0, pradosha: false,
    tithi: 2, star: 12, abhijit: false, dir: 0, ghatis: 5, abhijitMuhurta: false,
  };
  const sc = (b, x = {}, vara = 1) => stretchCodes(TR[b], { ...m, ...x }, vara);
  // The Vaar Shoola: Monday east lifts after 8 ghatis (Kalaprakasika), 20 (Shridhar's table); never for MC.
  assert.ok(sc('RAMAN').includes('VAAR_SHOOLA') && !sc('RAMAN', { ghatis: 8.5 }).includes('VAAR_SHOOLA'));
  assert.ok(sc('SHRIDHAR', { ghatis: 8.5 }).includes('VAAR_SHOOLA') && !sc('SHRIDHAR', { ghatis: 20.5 }).includes('VAAR_SHOOLA'));
  assert.ok(sc('MUHURTA_CHINTAMANI', { ghatis: 40 }).includes('VAAR_SHOOLA'));
  // Wilhelm: the weekday's lord in an upachaya lifts the weekday and its Shoola (the Moon in the 3rd from Leo; in the 5th it does not).
  const moon5 = sc('WILHELM', { signs: { ...sky, Moon: 8 } });
  assert.ok(moon5.includes('VARA') && moon5.includes('VAAR_SHOOLA_MID'));
  assert.ok(!sc('WILHELM').includes('VARA'), 'the Moon in Capricorn: the 6th from Leo');
  const moon3 = sc('WILHELM', { signs: { ...sky, Moon: 6 } });
  assert.ok(!moon3.includes('VARA') && !moon3.includes('VAAR_SHOOLA_MID'));
  // Kaala and Paasha on Sunday: north and south.
  assert.ok(sc('MUHURTA_CHINTAMANI', { dir: 6 }, 0).includes('KAALA_PASHA') && sc('MUHURTA_CHINTAMANI', { dir: 2 }, 0).includes('KAALA_PASHA'));
  assert.ok(!sc('MUHURTA_CHINTAMANI', { dir: 0 }, 0).includes('KAALA_PASHA'));
  // Ayana: both luminaries in Capricorn — east and north; south is against it; Vashistha's spring lifts it.
  assert.ok(!sc('MUHURTA_CHINTAMANI', { dir: 0 }).includes('AYANA') && sc('MUHURTA_CHINTAMANI', { dir: 2 }).includes('AYANA'));
  const split = { signs: { ...sky, Moon: 3 } };
  assert.ok(sc('MUHURTA_CHINTAMANI', { ...split, dir: 2, dayPart: 0, nightPart: 2 }).includes('AYANA') === false, 'by night the Moon\'s (southern) course');
  assert.ok(sc('MUHURTA_CHINTAMANI', { ...split, dir: 2, dayPart: 2 }).includes('AYANA'), 'by day the Sun\'s');
  assert.ok(!sc('VASHISTHA', { signs: { ...sky, Sun: 0, Moon: 0 }, dir: 2 }).includes('AYANA'), 'spring: all four directions');
  // Lalatika: the Sun in the lagna going east.
  assert.ok(sc('MUHURTA_CHINTAMANI', { signs: { ...sky, Sun: 4 } }).includes('LALATIKA'));
  // Kaala Shoola: Rohini in the first third of the day; Hasta never; Abhijit in the last third.
  assert.ok(sc('MUHURTA_CHINTAMANI', { star: 3, dayPart: 1 }).includes('KAAL_SHOOLA') && !sc('MUHURTA_CHINTAMANI', { star: 3, dayPart: 4 }).includes('KAAL_SHOOLA'));
  assert.ok(!sc('MUHURTA_CHINTAMANI', { star: 12, dayPart: 4 }).includes('KAAL_SHOOLA'));
  assert.ok(sc('MUHURTA_CHINTAMANI', { star: 20, abhijit: true, dayPart: 4 }).includes('KAAL_SHOOLA'));
  assert.ok(sc('MUHURTA_CHINTAMANI', { star: 9, dayPart: 0, nightPart: 2 }).includes('KAAL_SHOOLA'), 'Magha at midnight');
  // Sarvanka (MC's example: 5th, Wednesday, Hasta — 22: no remainder zero); the 7th makes 24 (by 8).
  const sv = TF.sarvanka_example_MC_sloka24;
  assert.deepEqual([7, 8, 3].map((k) => (sv.tithi + idx(DAY_N, sv.weekday) + 1 + idx(STAR_N, sv.star) + 1) % k), sv.remainders_7_8_3);
  assert.ok(!sc('MUHURTA_CHINTAMANI', { tithi: 5 }, 3).includes('SARVANKA') && sc('MUHURTA_CHINTAMANI', { tithi: 7 }, 3).includes('SARVANKA'));
  // Raman's panchaka example (Aslesha, the 13th, Virgo, Sunday: 29, remainder 2, Agni) — marked; Chora (6) rejects.
  assert.ok(sc('RAMAN', { star: 8, tithi: 13, lagna: 5 }, 0).includes('YATRA_PANCHAKA_MID'));
  assert.ok(sc('RAMAN', { star: 8, tithi: 17, lagna: 5 }, 0).includes('YATRA_PANCHAKA'));
  // Abhijit muhurta south; the digdwar lagna behind (Leo going west) and on the left (Leo going south: Shridhar marks, Joshi rejects).
  assert.ok(sc('MUHURTA_CHINTAMANI', { abhijitMuhurta: true, dir: 3 }).includes('ABHIJIT_SOUTH'));
  assert.ok(sc('MUHURTA_CHINTAMANI', { dir: 4 }).includes('DIGDWAR_LAGNA') && !sc('MUHURTA_CHINTAMANI', { dir: 2 }).includes('DIGDWAR_LAGNA'));
  assert.ok(sc('SHRIDHAR', { dir: 2 }).includes('DIGDWAR_LAGNA_MID') && sc('JOSHI', { dir: 2 }).includes('DIGDWAR_LAGNA'));
  // A retrograde planet in a kendra (Saturn in Pisces is the 8th from Leo — Mars in Gemini the 11th): none; Jupiter retrograde in Cancer (12th): none; Mercury retrograde in the 7th: yes.
  assert.ok(!sc('MUHURTA_CHINTAMANI', { retro: { Saturn: true, Jupiter: true } }).includes('RETRO_KENDRA'));
  assert.ok(sc('MUHURTA_CHINTAMANI', { retro: { Mercury: true }, signs: { ...sky, Mercury: 10 } }).includes('RETRO_KENDRA'));
  // Without a direction, no direction rule.
  assert.ok(!sc('MUHURTA_CHINTAMANI', { dir: null }).some((c) => ['VAAR_SHOOLA', 'KAALA_PASHA', 'AYANA', 'LALATIKA', 'DIGDWAR_LAGNA'].includes(c)));
  assert.ok(!pieceCodes(TR.SHRIDHAR, { ...base, dir: null, tithi: 1 }).some((c) => ['YOGINI', 'TITHI_SHOOLA', 'TITHI_DIR', 'CHANDRA_DIR', 'PARIGHA', 'VENUS_FRONT'].includes(c)));
}

// ------------------------------------------------ travel: the engine ---
{
  const DAY = 86400000;
  const fromMs = Date.parse('2026-10-10T18:30:00Z');
  const r = muhurtaStarChecks({ natalMoonLongitude: 45.5, natalLagnaLongitude: 200, fromMs, toMs: fromMs + 20 * DAY, latitude: 13.08, longitude: 80.27, direction: 'SE' });
  assert.equal(r.direction, 'SE');
  assert.throws(() => muhurtaStarChecks({ natalMoonLongitude: 45.5, fromMs, toMs: fromMs + DAY, direction: 'UP' }));
  const jd = (ms) => ms / DAY + 2440587.5;
  const L360 = (x) => ((x % 360) + 360) % 360;
  const lonOf = (p, ms) => L360(p === 'Rahu' ? nodeLongitude(jd(ms), 'Lahiri', 'mean') : planetLongitude(jd(ms), p, 'Lahiri'));
  const elong = (ms) => L360(lonOf('Moon', ms) - lonOf('Sun', ms));
  const tithiEdge = (ms, dir) => {
    const k = Math.floor(elong(ms) / 12);
    let a = ms; let b = ms + dir * 1.2 * DAY;
    for (let i = 0; i < 45; i += 1) { const c = (a + b) / 2; if (Math.floor(elong(c) / 12) === k) a = c; else b = c; }
    return a;
  };
  const ABH = [276 + 40 / 60, 280 + 53 / 60 + 20 / 3600];
  const star28 = (lon) => { const s = Math.floor(lon / (360 / 27)); return lon >= ABH[0] && lon < ABH[1] ? 21 : s <= 20 ? s : s + 1; };
  let n = 0; const seen = {};
  for (const s of r.segments) {
    if (Date.parse(s.toUtc) - Date.parse(s.fromUtc) < 2 * 60000) continue;
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    const signs = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'].map((p) => [p, Math.floor(lonOf(p, mid) / 30)]));
    signs.Ketu = (signs.Rahu + 6) % 12;
    const padaOf = (p) => Math.floor(lonOf(p, mid) / (10 / 3)) % 108;
    const moon = lonOf('Moon', mid);
    const x = {
      star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar, sunDeg: Math.floor(lonOf('Sun', mid)) % 30,
      yoga: Math.floor(L360(moon + lonOf('Sun', mid)) / (360 / 27)), vishti: isVishti(Math.floor(elong(mid) / 6)),
      sankranti: Math.floor(lonOf('Sun', tithiEdge(mid, -1) + 1000) / 30) !== Math.floor(lonOf('Sun', tithiEdge(mid, 1) - 1000) / 30),
      taraCount: s.tara.count, signs, navs: { Sun: padaOf('Sun') % 12, Jupiter: padaOf('Jupiter') % 12, Moon: padaOf('Moon') % 12 },
      moonPada: s.star * 4 + s.pada - 1, natalMoon: 1, natalLagna: 6, vedha: {}, bana: false,
      dir: 1, starFrac: (moon % (360 / 27)) / (360 / 27), yogaHalf: Math.floor(L360(moon + lonOf('Sun', mid)) / (180 / 27)),
      rahuCount: ((star28(moon) - star28(lonOf('Rahu', mid)) + 28) % 28) + 1,
      venus: { east: ((lonOf('Venus', mid) - lonOf('Sun', mid) + 540) % 360) - 180 < 0, sign: signs.Venus, star: Math.floor(lonOf('Venus', mid) / (360 / 27)) },
    };
    for (const b of TR.order) {
      assert.deepEqual(s.ev.TRAVEL[b], pieceCodes(TR[b], x), `travel ${b} ${s.fromUtc}`);
      for (const c of s.ev.TRAVEL[b]) seen[c] = true;
    }
    n += 1;
  }
  assert.ok(n > 100, `${n} pieces`);
  for (const c of ['YOGINI', 'CHANDRA_DIR', 'PARIGHA', 'RAHU_PAKSHA', 'TITHI_DIR', 'NAK_GHATI', 'NAK_LATE_MID']) assert.ok(seen[c], `seen ${c}`);
}

console.log('test-event-muhurta: all checks passed');
