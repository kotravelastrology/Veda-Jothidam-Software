const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./src/report/eventMuhurtaTables');
const {
  panchangaCodes, varaCodes, lagnaCodes, doorCodes, withDoorStars, kumbhaCount, rejects, guruCodes, raviCodes, inHarishayana, isVishti,
  pieceCodes, stretchCodes, relOf, KAALA_DAY, VAAR_RAHU, venusBlind, isSthiraKarana,
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

// ------------------------------------------------ vidyarambha: the tables against the books ---
const VR = E.EVENTS.VIDYARAMBHA;
const VF = FIX.vidyarambha;
{
  assert.deepEqual({ ...E.RANK.VIDYARAMBHA.words }, VF.words);
  assert.deepEqual([...VR.order], Object.keys(VF.words).sort((a, b) => VF.words[b] - VF.words[a]));
  assert.equal(VR.default, VF.default);
  for (const b of VR.order) {
    assert.ok(resolveByTitle(E.SOURCES.VIDYARAMBHA[b].title), `registered: ${b}`);
    assert.ok(VR[b].linesTa.length > 0, `${b} described`);
    assert.ok(VR[b].empty.includes(8), `${b}: the 8th empty`);
  }
  const S = VF.stars;
  assert.deepEqual(sorted(E.AKSHARA_10), stars(S.MC_sloka37));
  for (const b of ['MUHURTA_CHINTAMANI', 'SHRIDHAR']) assert.deepEqual(sorted(VR[b].nak.good), stars(S[b === 'SHRIDHAR' ? 'SHRIDHAR' : 'MC_sloka37']), b);
  assert.deepEqual(sorted(VR.KALYANRAMAN.nak.good), stars(S.KR_table_with_Abhijit));
  assert.ok(VR.KALYANRAMAN.abhijitOk && VR.VASHISTHA.abhijitOk && VR.JOSHI.abhijitOk && VR.AGARWAL.abhijitOk && !VR.WILHELM.abhijitOk);
  assert.deepEqual(sorted(VR.WILHELM.nak.good), stars(S.WILHELM_favorable));
  assert.deepEqual(sorted(VR.WILHELM.nak.mid), stars(S.WILHELM_middling));
  assert.deepEqual(sorted(VR.VASHISTHA.nak.good), stars(S.VASHISTHA_with_Abhijit));
  for (const b of ['JOSHI', 'AGARWAL']) assert.deepEqual(sorted(VR[b].nak.good), stars(S.JOSHI_AGARWAL_with_Abhijit), b);
  assert.deepEqual(sorted(VR.RAMAN.nak.good), stars(S.RAMAN));
  assert.deepEqual(sorted(VR.RANGACHARYA.nak.good), stars(S.RANGACHARYA_as_printed.map((n) => (n === 'Mithuna' ? 'Ardra' : n))), 'Rangacharya\'s "Mithuna": Ardra (our reading)');
  const T = VF.tithis;
  assert.deepEqual(sorted(VR.MUHURTA_CHINTAMANI.tithi), E.bothPakshas(T.MC_sloka37).filter((t) => t !== 15));
  for (const b of ['KALYANRAMAN', 'AGARWAL', 'JOSHI', 'RANGACHARYA']) assert.deepEqual(sorted(VR[b].tithi), E.bothPakshas(T.most_books), b);
  for (const t of T.KR_reject.filter(Number.isInteger)) assert.ok(!VR.KALYANRAMAN.tithi.includes(t), `KR rejects ${t}`);
  assert.deepEqual(sorted(VR.SHRIDHAR.tithi), sorted(T.SHRIDHAR_table), 'the bright half (Acharya Shridhar)');
  assert.deepEqual(sorted(VR.SHRIDHAR.tithiNot), sorted([...E.bothPakshas(T.SHRIDHAR_markandeya_leave.filter((t) => t !== 15)), 15, 30]));
  assert.deepEqual(sorted(VR.WILHELM.tithi), sorted([...T.WILHELM_favorable, 17, 18, 20]), 'the first five of the dark half');
  assert.deepEqual(sorted(VR.WILHELM.tithiMid), sorted(T.WILHELM_middling));
  assert.deepEqual(sorted(VR.VASHISTHA.tithi), sorted(T.VASHISTHA_shukla));
  assert.ok(!VR.RAMAN.tithi, 'Raman gives no tithis');
  const W = VF.weekdays;
  assert.deepEqual(sorted(VR.KALYANRAMAN.vara.good), days(W.KR_in_general_p100.good));
  for (const v of days(W.KR_in_general_p100.avoid)) assert.ok(!VR.KALYANRAMAN.vara.good.includes(v) && !VR.KALYANRAMAN.vara.mid.includes(v));
  assert.deepEqual(sorted(VR.KALYANRAMAN.vara.mid), days(['Sun']), 'Sunday: "some hesitation"');
  assert.deepEqual(sorted(VR.WILHELM.vara.good), days(W.WILHELM.most));
  assert.deepEqual(sorted(VR.WILHELM.vara.mid), days(W.WILHELM.middling));
  assert.deepEqual(sorted(VR.VASHISTHA.vara.mid), days(W.VASHISTHA.medium));
  for (const b of ['SHRIDHAR', 'AGARWAL', 'JOSHI', 'RAMAN', 'RANGACHARYA']) assert.deepEqual(sorted(VR[b].vara.good), days(W.MON_WED_THU_FRI), b);
  assert.deepEqual(sorted(VR.MUHURTA_CHINTAMANI.vara.good), days(['Wed', 'Thu', 'Fri']), '"सतां दिने" (our reading)');
  const allYogas = [...Array(27).keys()];
  assert.deepEqual(sorted(VR.KALYANRAMAN.yogaNot), allYogas.filter((y) => !VF.kr_good_yogas_1based.includes(y + 1)));
  const L = VF.lagnas;
  const signs1 = (ns) => sorted(ns.map((n) => n - 1));
  for (const b of ['MUHURTA_CHINTAMANI', 'JOSHI', 'VASHISTHA', 'AGARWAL']) assert.deepEqual(sorted(VR[b].lagna.good), signs1(L.MC_JOSHI_VASHISTHA_AGARWAL_SHRIDHAR), b);
  assert.deepEqual(sorted([...VR.SHRIDHAR.lagna.good, ...VR.SHRIDHAR.lagna.mid]), signs1(L.MC_JOSHI_VASHISTHA_AGARWAL_SHRIDHAR), 'Shridhar: Taurus middling ("fixed prohibited")');
  assert.deepEqual(sorted(VR.KALYANRAMAN.lagna.good), signs1(L.KR_general_good_chara));
  for (const s of signs1(L.KR_fixed_reject)) assert.ok(!VR.KALYANRAMAN.lagna.good.includes(s) && !VR.KALYANRAMAN.lagna.mid.includes(s));
  assert.deepEqual(sorted(VR.WILHELM.lagna.good), signs1(L.WILHELM_dual_best));
  assert.deepEqual(sorted(VR.RANGACHARYA.lagna.good), signs1(L.RANGACHARYA_commended));
  assert.deepEqual(sorted(VR.RANGACHARYA.lagna.mid), signs1(L.RANGACHARYA_mediocre));
  assert.equal(idx(MONTH_N, VF.vijayadashami_KR.month), 6);
}

// ------------------------------------------------ vidyarambha: the codes ---
{
  const sky = { Sun: 9, Moon: 2, Mars: 2, Mercury: 9, Jupiter: 3, Venus: 8, Saturn: 11, Rahu: 11, Ketu: 5 };
  const x = { star: 12, tithi: 2, month: 10, sunSign: 9, sunStar: 21, sunDeg: 5, yoga: 3, signs: sky, navs: { Sun: 1, Jupiter: 2, Moon: 3 }, moonPada: 50, natalMoon: 1, taraCount: 2, karanaFixed: false, moonAbhijit: false };
  const pc = (b, y = {}) => pieceCodes(VR[b], { ...x, ...y });
  assert.deepEqual(pc('KALYANRAMAN'), []);
  assert.ok(pc('KALYANRAMAN', { sunSign: 10 }).includes('SUN_SIGN'), 'the Kumbha month');
  assert.ok(pc('KALYANRAMAN', { karanaFixed: true }).includes('STHIRA_KARANA'));
  assert.ok(isSthiraKarana(0) && isSthiraKarana(57) && isSthiraKarana(59) && !isSthiraKarana(56) && !isSthiraKarana(1));
  // Abhijit: the Moon in Uttarashadha's 4th quarter is good for Kalyanraman, not for MC.
  assert.ok(pc('KALYANRAMAN', { star: 20, moonAbhijit: true }).length === 0 && pc('KALYANRAMAN', { star: 20 }).includes('NAK'));
  assert.ok(pc('MUHURTA_CHINTAMANI', { star: 20, moonAbhijit: true }).includes('NAK'));
  // Vijayadashami's day: nothing else for Kalyanraman — even a star he does not list or the Kumbha month; not for Wilhelm.
  assert.deepEqual(pc('KALYANRAMAN', { vijaya: true, star: 1, sunSign: 10 }), []);
  assert.ok(pc('KALYANRAMAN', { star: 1 }).includes('NAK') && pc('WILHELM', { vijaya: true, star: 1 }).includes('NAK'));
  // Shridhar's tithis: the bright 2nd good, the dark 2nd middling, the 6th rejected.
  assert.ok(!pc('SHRIDHAR').some((c) => c.startsWith('TITHI')) && pc('SHRIDHAR', { tithi: 17 }).includes('TITHI_MID') && pc('SHRIDHAR', { tithi: 6 }).includes('TITHI'));
  // Wilhelm: the dark half after its 5th rejected; the 7th middling.
  assert.ok(pc('WILHELM', { tithi: 22 }).includes('TITHI') && pc('WILHELM', { tithi: 7 }).includes('TITHI_MID'));

  // A Gemini lagna on a Wednesday forenoon (Venus in the 7th, Jupiter in the 2nd): Wilhelm's dual sign; Kalyanraman's middling.
  const m = { lagna: 2, nav: 2, signs: sky, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 12, month: 10, navSigns: { Sun: 5, Mars: 7 } };
  const sc = (b, y = {}, vara = 3) => stretchCodes(VR[b], { ...m, ...y }, vara);
  assert.ok(!sc('WILHELM').includes('LAGNA') && sc('KALYANRAMAN').includes('LAGNA_MID'));
  assert.ok(sc('KALYANRAMAN', { lagna: 1 }).includes('LAGNA'), 'Taurus: fixed, rejected');
  assert.ok(sc('KALYANRAMAN', { combust: { Mercury: true } }).includes('MERC_SET'));
  // Malefics in the 2nd or 5th (Kalyanraman): Mars in Cancer is the 2nd from Gemini.
  assert.ok(sc('KALYANRAMAN', { signs: { ...sky, Mars: 3 } }).includes('IN_Mars_2'));
  // The night: Kalyanraman allows its last third; Wilhelm none.
  assert.ok(!sc('KALYANRAMAN', { dayPart: 0, nightPart: 3 }).includes('NIGHT') && sc('KALYANRAMAN', { dayPart: 0, nightPart: 1 }).includes('NIGHT'));
  assert.ok(sc('WILHELM', { dayPart: 0, nightPart: 3 }).includes('NIGHT') && sc('KALYANRAMAN', { dayPart: 4 }).includes('DAY_PART'));
  // Shridhar: the Sun or Mars in the lagna's navamsa sign.
  assert.ok(sc('SHRIDHAR', { navSigns: { Sun: 2, Mars: 7 } }).includes('SUN_MARS_NAV') && !sc('SHRIDHAR').includes('SUN_MARS_NAV'));
  // Mercury, Jupiter or Venus in the 9th (Kalyanraman, Raman, Agarwal, Rangacharya): marked when none is; Joshi's 7th or 10th.
  assert.ok(sc('RAMAN').includes('BEN_HOUSE_MID') && !sc('RAMAN', { signs: { ...sky, Jupiter: 10 } }).includes('BEN_HOUSE_MID'));
  assert.ok(!sc('JOSHI').includes('BEN_HOUSE_MID'), 'Venus in Sagittarius: the 7th from Gemini');
  assert.deepEqual(sc('KALYANRAMAN', { vijaya: true, lagna: 1, dayPart: 0, nightPart: 1 }), [], 'Vijayadashami');
}

// ------------------------------------------------ vidyarambha: the engine ---
{
  const DAY = 86400000;
  // A window holding Vijayadashami 2026 (Ashvin Shukla 10).
  const fromMs = Date.parse('2026-10-15T18:30:00Z');
  const r = muhurtaStarChecks({ natalMoonLongitude: 45.5, natalLagnaLongitude: 200, fromMs, toMs: fromMs + 12 * DAY, latitude: 13.08, longitude: 80.27 });
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
  // Vijayadashami's day at Chennai, from the sky: Ashvin Shukla 10's span and the sunrises around it.
  const s10 = r.segments.find((s) => s.month === 6 && s.tithi === 10);
  const s10From = tithiEdge(Date.parse(s10.fromUtc) + 60000, -1);
  const s10To = tithiEdge(Date.parse(s10.fromUtc) + 60000, 1);
  const rises = [];
  for (let k = -3; k < 16; k += 1) rises.push((sunriseJulianDay(jd(fromMs) + k, 13.08, 80.27) - 2440587.5) * DAY);
  rises.sort((a, b) => a - b);
  const inside = rises.filter((x) => x >= s10From && x < s10To);
  const vStart = inside.length ? (s10To - inside[0] >= 144 * 60000 ? inside[0] : rises.filter((x) => x < inside[0]).pop()) : rises.filter((x) => x <= s10From).pop();
  const vEnd = rises.find((x) => x > vStart + 3600000);
  // 2026: Dashami runs from the evening of 20 October past the 21st's sunrise — the 21st is the day.
  assert.equal(new Date(vStart + 5.5 * 3600000).toISOString().slice(0, 10), '2026-10-21');
  let vijaya = 0; let n = 0;
  for (const s of r.segments) {
    if (Date.parse(s.toUtc) - Date.parse(s.fromUtc) < 2 * 60000) continue;
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    const moon = lonOf('Moon', mid);
    const inV = mid >= vStart && mid < vEnd;
    const signs = Object.fromEntries(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'].map((p) => [p, Math.floor(lonOf(p, mid) / 30)]));
    signs.Ketu = (signs.Rahu + 6) % 12;
    const inAbhijit = (l) => l >= 276 + 40 / 60 && l < 280 + 53 / 60 + 20 / 3600;
    const x = {
      star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar, sunDeg: lonOf('Sun', mid) % 30,
      yoga: Math.floor(L360(moon + lonOf('Sun', mid)) / (360 / 27)), vishti: isVishti(Math.floor(elong(mid) / 6)), karanaFixed: isSthiraKarana(Math.floor(elong(mid) / 6)),
      moonAbhijit: inAbhijit(moon), taraCount: s.tara.count, signs, moonPada: s.star * 4 + s.pada - 1, natalMoon: 1,
      sankranti: Math.floor(lonOf('Sun', tithiEdge(mid, -1) + 1000) / 30) !== Math.floor(lonOf('Sun', tithiEdge(mid, 1) - 1000) / 30),
      navs: { Moon: (s.star * 4 + s.pada - 1) % 12 }, vijaya: inV,
      // Agriculture: the karana; the Sun's, Rahu's, Venus's and Mercury's stars for the chakras.
      karana: Math.floor(elong(mid) / 6), janmaStar: Math.floor(45.5 / (360 / 27)),
      planetStars: Object.fromEntries(['Sun', 'Rahu', 'Venus', 'Mercury'].map((p) => [p, { star: Math.floor(lonOf(p, mid) / (360 / 27)), abhijit: inAbhijit(lonOf(p, mid)) }])),
    };
    for (const b of VR.order) assert.deepEqual(s.ev.VIDYARAMBHA[b], pieceCodes(VR[b], x), `vidyarambha ${b} ${s.fromUtc}`);
    // Every act from business on, and every one added since, takes these inputs.
    for (const ev of E.EVENTS.order.filter((e) => !['GRIHA_PRAVESHA', 'UPANAYANA', 'TRAVEL', 'VIDYARAMBHA', 'EDUCATION'].includes(e))) {
      for (const b of E.EVENTS[ev].order) assert.deepEqual(s.ev[ev][b], pieceCodes(E.EVENTS[ev][b], x), `${ev} ${b} ${s.fromUtc}`);
    }
    if (inV) {
      vijaya += 1;
      assert.deepEqual(s.ev.VIDYARAMBHA.KALYANRAMAN, []);
      for (const st of s.lagnas) assert.deepEqual(r.eventTable[st[10]].VIDYARAMBHA.KALYANRAMAN, []);
    }
    n += 1;
  }
  assert.ok(vijaya > 0 && n > 50, `${vijaya} pieces on Vijayadashami of ${n}`);
  // The education event's pieces, recomputed too.
  for (const s of r.segments) {
    if (Date.parse(s.toUtc) - Date.parse(s.fromUtc) < 2 * 60000) continue;
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    const x = {
      star: s.star, tithi: s.tithi, month: s.month, sunSign: s.sunSign, sunStar: s.sunStar,
      sankranti: Math.floor(lonOf('Sun', tithiEdge(mid, -1) + 1000) / 30) !== Math.floor(lonOf('Sun', tithiEdge(mid, 1) - 1000) / 30),
      taraCount: s.tara.count, signs: { Moon: Math.floor(lonOf('Moon', mid) / 30) }, natalMoon: 1, moonPada: s.star * 4 + s.pada - 1,
      moonAbhijit: lonOf('Moon', mid) >= 276 + 40 / 60 && lonOf('Moon', mid) < 280 + 53 / 60 + 20 / 3600,
    };
    for (const b of E.EVENTS.EDUCATION.order) assert.deepEqual(s.ev.EDUCATION[b], pieceCodes(E.EVENTS.EDUCATION[b], x), `education ${b} ${s.fromUtc}`);
  }
  // The evening of the 20th — Dashami already running, but not its day — keeps the book's rules: the night's first third.
  const eve = r.segments.find((s) => s.month === 6 && s.tithi === 10 && Date.parse(s.toUtc) <= vStart);
  assert.ok(eve && eve.lagnas.some((st) => r.eventTable[st[10]].VIDYARAMBHA.KALYANRAMAN.includes('NIGHT')), 'the 20th evening is not Vijayadashami');
}

// A general-list reading (the book has no section; its star-class lists name the act): stars, Abhijit, weekdays.
const generalLists = (EV, XF) => {
  for (const [b, f] of Object.entries(XF.general_lists)) {
    const r = EV[b];
    assert.ok(EV.order.includes(b) && r.noteTa.startsWith('பொதுப் பட்டியல்') && !r.linesTa, `${b}: a general-list reading`);
    assert.deepEqual(sorted(r.nak.good), stars(f.stars), `${b}: stars`);
    assert.deepEqual(sorted(r.nak.mid), stars(f.stars_mid ?? []), `${b}: middling stars`);
    assert.equal(Boolean(r.abhijitOk), Boolean(f.abhijit), `${b}: Abhijit`);
    if (f.weekdays) assert.deepEqual(sorted(r.vara.good), days(f.weekdays), `${b}: weekdays`);
    else assert.equal(r.vara, undefined, `${b}: no weekday rule`);
  }
};

// ------------------------------------------------ education: the tables against the books ---
const ED = E.EVENTS.EDUCATION;
const EF = FIX.education;
{
  assert.deepEqual({ ...E.RANK.EDUCATION.words }, EF.words);
  assert.deepEqual([...ED.order], Object.keys(EF.words).sort((a, b) => EF.words[b] - EF.words[a]));
  assert.equal(ED.default, EF.default);
  for (const b of ED.order) assert.ok(resolveByTitle(E.SOURCES.EDUCATION[b].title), `registered: ${b}`);
  for (const b of ED.order.filter((b) => !EF.general_lists[b])) assert.ok(ED[b].linesTa.length > 0, `${b} described`);
  generalLists(ED, EF);
  const S = EF.stars;
  assert.deepEqual(sorted(ED.WILHELM.nak.good), stars(S.WILHELM_best));
  assert.deepEqual(sorted(ED.WILHELM.nak.mid), stars(S.WILHELM_middling));
  assert.deepEqual(sorted(ED.SHRIDHAR.nak.good), stars(S.SHRIDHAR_best));
  for (const s of stars(S.SHRIDHAR_MC_avoid)) assert.ok(!ED.SHRIDHAR.nak.good.includes(s) && !ED.SHRIDHAR.nak.mid.includes(s));
  assert.equal(ED.SHRIDHAR.nak.good.length + ED.SHRIDHAR.nak.mid.length + S.SHRIDHAR_MC_avoid.length, 27, '"balance can be used"');
  assert.deepEqual(sorted(E.EDUCATION_16), stars(S.MC_sloka38));
  assert.deepEqual(sorted(ED.MUHURTA_CHINTAMANI.nak.good), stars(S.MC_sloka38));
  assert.deepEqual(sorted(ED.KALYANRAMAN.nak.good), stars(S.KR_table_with_Abhijit));
  assert.ok(ED.KALYANRAMAN.abhijitOk);
  assert.deepEqual(sorted(ED.JOSHI.nak.good), stars(S.JOSHI));
  assert.deepEqual(sorted(ED.VASHISTHA.nak.good), [...Array(27).keys()].filter((s) => !stars(S.VASHISTHA_avoid).includes(s)));
  assert.deepEqual(sorted(ED.RANGACHARYA.nak.good), stars(S.RANGACHARYA));
  const T = EF.tithis;
  assert.deepEqual(sorted(ED.WILHELM.tithi), E.bothPakshas(T.WILHELM_favorable));
  assert.deepEqual(sorted(ED.WILHELM.tithiMid), E.bothPakshas(T.WILHELM_middling));
  for (const t of T.WILHELM_avoid) assert.ok(ED.WILHELM.tithiNot.includes(t));
  assert.deepEqual(sorted(ED.SHRIDHAR.tithi), T.SHRIDHAR_favourable_BH);
  for (const t of E.bothPakshas([...T.SHRIDHAR_avoid, ...T.SHRIDHAR_17_11_3])) assert.ok(ED.SHRIDHAR.tithiNot.includes(t), `Shridhar avoids ${t}`);
  for (const b of ['MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(ED[b].tithi), E.bothPakshas(T.MC_KR_JOSHI), b);
  assert.deepEqual(sorted(ED.KALYANRAMAN.tithiMid), E.bothPakshas(T.KR_some_accept));
  assert.deepEqual(sorted(ED.VASHISTHA.tithi), T.VASHISTHA_shukla);
  assert.deepEqual(sorted(ED.RANGACHARYA.tithi), sorted([16, ...E.bothPakshas(T.RANGACHARYA_good)]));
  for (const t of E.bothPakshas(T.RANGACHARYA_avoid)) assert.ok(ED.RANGACHARYA.tithiNot.includes(t));
  const W = EF.weekdays;
  for (const v of days(W.WILHELM_avoid)) assert.ok(!ED.WILHELM.vara.good.includes(v) && !ED.WILHELM.vara.mid.includes(v));
  assert.deepEqual(sorted(ED.SHRIDHAR.vara.good), days(W.SHRIDHAR_best));
  assert.deepEqual(sorted(ED.MUHURTA_CHINTAMANI.vara.good), days(W.MC_sloka38));
  for (const b of ['JOSHI', 'KALYANRAMAN', 'RANGACHARYA']) {
    assert.deepEqual(sorted(ED[b].vara.good), days(W.JOSHI_KR_RANGACHARYA.best), b);
    assert.deepEqual(sorted(ED[b].vara.mid), days(W.JOSHI_KR_RANGACHARYA.medium), b);
  }
  assert.deepEqual(sorted(ED.VASHISTHA.vara.good), days(W.VASHISTHA));
  const L = EF.lagnas;
  for (const b of ['WILHELM', 'SHRIDHAR']) assert.ok(sorted(ED[b].lagna.good).join() === '2,5,8,11' && sorted(ED[b].lagna.mid).join() === '0,3,6,9', b);
  for (const b of ['JOSHI', 'KALYANRAMAN']) assert.deepEqual(sorted(ED[b].lagna.good), L.JOSHI_KR_movable.map((n) => n - 1), b);
  assert.deepEqual(sorted(ED.VASHISTHA.lagna.good), L.VASHISTHA_fixed_not_aquarius.map((n) => n - 1));
  assert.deepEqual(sorted(ED.RANGACHARYA.lagna.good), sorted(L.RANGACHARYA_movable_dual.map((n) => n - 1)));
  for (const b of ['WILHELM', 'SHRIDHAR']) assert.deepEqual(sorted(ED[b].navNot), [0, 7, 9, 10], `${b}: the navamsas of Mars and Saturn`);
  assert.deepEqual(sorted(E.MATRIKA_GOOD), [...Array(27).keys()].map((i) => i + 1).filter((n) => !EF.matrika_JV_unfavourable_from_sun.includes(n)));
}

// ------------------------------------------------ education: the codes ---
{
  const x = { star: 12, tithi: 2, month: 10, sunSign: 9, sunStar: 0, taraCount: 2, signs: { Moon: 5 }, natalMoon: 1, moonPada: 50 };
  const pc = (b, y = {}) => pieceCodes(ED[b], { ...x, ...y });
  assert.deepEqual(pc('WILHELM'), []);
  assert.ok(pc('WILHELM', { tithi: 1 }).includes('ANADHYAYA') && pc('WILHELM', { tithi: 12 }).includes('TITHI_MID') && pc('WILHELM', { tithi: 7 }).includes('TITHI_MID'));
  assert.ok(pc('WILHELM', { tithi: 22 }).includes('GALAGRAHA'), 'Krishna 7');
  // Matrika (J.V., Shridhar): Hasta is the 13th from Ashwini — unfavourable, marked.
  assert.ok(pc('SHRIDHAR', { sunStar: 0 }).includes('MATRIKA_MID') && !pc('SHRIDHAR', { sunStar: 4 }).some((c) => c.startsWith('MATRIKA')));
  assert.ok(pc('SHRIDHAR', { star: 1 }).includes('NAK') && pc('SHRIDHAR', { star: 9 }).includes('NAK_MID'), 'Bharani avoided (MC); Magha "can be used"');
  assert.ok(pc('JOSHI', { taraCount: 3 }).includes('TARA_NOT') && pc('JOSHI', { signs: { Moon: 4 } }).includes('CHANDRA'), 'the 3rd tara; the Moon 4th from the birth Moon');
  // A Gemini lagna, its navamsa in Aries (Mars's): Wilhelm and Shridhar reject the navamsa; a benefic in the 3rd for Shridhar.
  const sky = { Sun: 9, Moon: 5, Mars: 10, Mercury: 9, Jupiter: 3, Venus: 8, Saturn: 11, Rahu: 11, Ketu: 5 };
  const m = { lagna: 2, nav: 0, signs: sky, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 12, month: 10 };
  const sc = (b, y = {}, vara = 3) => stretchCodes(ED[b], { ...m, ...y }, vara);
  assert.ok(sc('WILHELM').includes('NAV_NOT') && sc('SHRIDHAR').includes('NAV_NOT') && !sc('WILHELM', { nav: 2 }).includes('NAV_NOT'));
  assert.ok(sc('SHRIDHAR', { signs: { ...sky, Jupiter: 4 } }).includes('IN_Jupiter_3'), 'a benefic in the 3rd "obstructs"');
  assert.ok(sc('WILHELM', { signs: { ...sky, Mars: 5 } }).includes('IN_Mars_4'), 'a malefic in the 4th');
  assert.ok(sc('WILHELM', {}, 1).includes('VARA') && !sc('WILHELM', {}, 0).includes('VARA'), 'Monday avoided, Sunday not');
  assert.ok(sc('MUHURTA_CHINTAMANI', { lagna: 0 }).includes('LAGNA_LORD_MID') && !sc('MUHURTA_CHINTAMANI').includes('LAGNA_LORD_MID'));
  assert.ok(sc('WILHELM', { dayPart: 4 }).includes('DAY_PART') && sc('WILHELM', { dayPart: 0, nightPart: 3 }).includes('NIGHT'));
}

// ------------------------------------------------ business: the tables against the books ---
const BU = E.EVENTS.BUSINESS;
const BF = FIX.business;
{
  assert.deepEqual({ ...E.RANK.BUSINESS.words }, BF.words);
  assert.deepEqual([...BU.order], Object.keys(BF.words).sort((a, b) => BF.words[b] - BF.words[a]));
  assert.equal(BU.default, BF.default);
  for (const b of BU.order) assert.ok(resolveByTitle(E.SOURCES.BUSINESS[b].title), `registered: ${b}`);
  generalLists(BU, BF);
  for (const b of BU.order.filter((b) => !BF.general_lists[b])) {
    assert.ok(BU[b].linesTa.length > 0, `${b} described`);
    assert.equal(Boolean(BU[b].abhijitOk), BF.abhijit.includes(b), `${b}: Abhijit`);
    for (const v of days(BF.weekdays.all_avoid)) assert.ok(!BU[b].vara.good.includes(v) && !BU[b].vara.mid.includes(v), `${b}: Tuesday`);
    assert.equal(BU[b].vara.good.length, 6, `${b}: all the other days`);
    if (b !== 'RANGACHARYA') assert.deepEqual(sorted(BU[b].lagna.good), [...Array(12).keys()].filter((s) => !BF.lagna_avoid.all_but_RANGACHARYA.map((n) => n - 1).includes(s)), `${b}: not Aquarius`);
    for (const t of E.bothPakshas(BF.tithis.rikta_avoid)) assert.ok(!BU[b].tithi.includes(t), `${b}: rikta ${t}`);
    assert.deepEqual([...BU[b].beneficIn], BF.places.benefics_in, b);
    assert.deepEqual([...BU[b].benHouse.planets], BF.places.in_lagna[b === 'VASHISTHA' ? 'VASHISTHA' : 'others'], b);
    assert.deepEqual([...BU[b].benHouse.houses], [1]);
    if (b === 'VASHISTHA') assert.deepEqual([...BU[b].empty], BF.places.VASHISTHA_empty);
    else assert.deepEqual(BU[b].notIn.map(([p, h]) => [[...p], [...h]]), [[['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], BF.places.malefics_not_in]], b);
  }
  const S = BF.stars;
  assert.deepEqual(sorted(BU.VASHISTHA.nak.good), stars(S.VASHISTHA));
  assert.deepEqual(sorted(E.SHOP_STARS), stars(S.MC_mitra_dhruva_kshipra));
  for (const b of ['KALYANRAMAN', 'JOSHI', 'SHRIDHAR', 'MUHURTA_CHINTAMANI']) assert.deepEqual(sorted(BU[b].nak.good), stars(S[S.KR_JOSHI_SHRIDHAR]), b);
  assert.deepEqual(sorted(BU.WILHELM.nak.good), stars(S.WILHELM));
  assert.deepEqual(sorted(BU.RANGACHARYA.nak.good), stars(S.RANGACHARYA_fixed_soft));
  const T = BF.tithis;
  assert.deepEqual(sorted(BU.VASHISTHA.tithi), T.VASHISTHA_shukla_and_15);
  assert.deepEqual(sorted(BU.KALYANRAMAN.tithi), sorted([...E.bothPakshas(T.KR).filter((t) => t !== 15 && t !== 30), 15]), 'KR: both pakshas, the full Moon');
  for (const b of ['WILHELM', 'JOSHI', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA']) assert.deepEqual(sorted(BU[b].tithi), [...Array(30).keys()].map((i) => i + 1).filter((t) => !E.bothPakshas(T.rikta_avoid).includes(t)), b);
  const V = BF.VASHISTHA_more;
  const R = BU.VASHISTHA;
  assert.ok(R.jupVenNotSet && R.harishayana === V.chaturmas && R.vishti === V.bhadra && R.holi && R.masa.strict);
  assert.deepEqual(sorted(R.masa.good), [...Array(12).keys()].filter((mo) => mo !== 9), 'Pausha (the 10th month) avoided');
  assert.deepEqual(sorted(R.yogaNot), [12, 16, 26], 'Vyaghata, Vyatipata, Vaidhriti');
}

// ------------------------------------------------ business: the codes ---
{
  // Chitra (every book's), Shukla 2, Margashirsha.
  const x = { star: 13, tithi: 2, month: 8, sunSign: 7, sunStar: 16, taraCount: 2, signs: { Moon: 5 }, natalMoon: 1, moonPada: 52, yoga: 0, vishti: false };
  const pc = (b, y = {}) => pieceCodes(BU[b], { ...x, ...y });
  const BS = BU.order.filter((b) => !BF.general_lists[b]);
  for (const b of BS) assert.deepEqual(pc(b), [], b);
  for (const b of BS) assert.ok(pc(b, { tithi: 9 }).includes('TITHI'), `${b}: rikta`);
  // Vashistha alone: Krishna tithis, Pausha, Chaturmas, the three yogas, Bhadra, Holi.
  assert.ok(pc('VASHISTHA', { tithi: 17 }).includes('TITHI') && !pc('JOSHI', { tithi: 17 }).includes('TITHI'));
  assert.ok(pc('VASHISTHA', { month: 9 }).includes('MASA') && !pc('KALYANRAMAN', { month: 9 }).includes('MASA'));
  assert.ok(pc('VASHISTHA', { month: 3, tithi: 12 }).includes('HARISHAYANA') && pc('VASHISTHA', { month: 7, tithi: 2 }).includes('HARISHAYANA'), 'Ashadha Shukla 12, Kartika Shukla 2: Hari sleeps');
  assert.ok(pc('VASHISTHA', { yoga: 16 }).includes('YOGA') && pc('VASHISTHA', { vishti: true }).includes('VISHTI'));
  assert.ok(pc('VASHISTHA', { month: 11, tithi: 15 }).includes('BHURUDAN') && !pc('VASHISTHA', { month: 10, tithi: 15 }).includes('BHURUDAN'));
  assert.ok(!pc('KALYANRAMAN', { month: 11, tithi: 15 }).includes('BHURUDAN'), 'Holi: Vashistha only');
  // Stars: Pushya for MC's group, not Vashistha's; Abhijit for the five.
  assert.ok(pc('VASHISTHA', { star: 7 }).includes('NAK') && !pc('MUHURTA_CHINTAMANI', { star: 7 }).includes('NAK'));
  assert.ok(!pc('JOSHI', { star: 21, moonAbhijit: true }).includes('NAK') && pc('WILHELM', { star: 21, moonAbhijit: true }).includes('NAK'));
  // A Gemini lagna: the Moon and Venus away, Mars in the 8th (Capricorn), Jupiter in the 2nd.
  const sky = { Sun: 6, Moon: 5, Mars: 9, Mercury: 6, Jupiter: 3, Venus: 7, Saturn: 11, Rahu: 11, Ketu: 5 };
  const m = { lagna: 2, nav: 4, signs: sky, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 12, month: 7 };
  const sc = (b, y = {}, vara = 3) => stretchCodes(BU[b], { ...m, ...y }, vara);
  assert.ok(sc('JOSHI').includes('IN_Mars_8') && sc('VASHISTHA').includes('EMPTY_8'));
  assert.ok(sc('JOSHI').includes('MOON_VENUS_LAGNA_MID') && sc('VASHISTHA').includes('MOON_MERC_LAGNA_MID'));
  assert.ok(!sc('JOSHI', { signs: { ...sky, Venus: 2 } }).includes('MOON_VENUS_LAGNA_MID') && !sc('VASHISTHA', { signs: { ...sky, Mercury: 2 } }).includes('MOON_MERC_LAGNA_MID'));
  assert.ok(sc('WILHELM').includes('BENEFIC_PLACE_MID'));
  // Mercury in the 12th: a planet, not a malefic — Vashistha rejects, the others do not.
  const merc12 = { signs: { ...sky, Mars: 4, Mercury: 1 } };
  assert.ok(sc('VASHISTHA', merc12).includes('EMPTY_12') && !sc('JOSHI', merc12).some((c) => c.startsWith('IN_')));
  assert.ok(sc('SHRIDHAR', { lagna: 10 }).includes('LAGNA') && !sc('RANGACHARYA', { lagna: 10 }).includes('LAGNA'), 'Aquarius');
  assert.ok(sc('VASHISTHA', { combust: { Venus: true } }).includes('JUP_VEN_SET') && !sc('JOSHI', { combust: { Venus: true } }).includes('JUP_VEN_SET'));
  assert.ok(sc('JOSHI', {}, 2).includes('VARA') && !sc('JOSHI', {}, 6).includes('VARA'), 'Tuesday');
  for (const c of ['MOON_VENUS_LAGNA_MID', 'MOON_MERC_LAGNA_MID', 'BHURUDAN']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ old house: the tables against the books ---
const OH = E.EVENTS.OLD_HOUSE;
const OF = FIX.old_house;
const GP = E.EVENTS.GRIHA_PRAVESHA;
{
  assert.deepEqual({ ...E.RANK.OLD_HOUSE.words }, OF.words);
  assert.deepEqual([...OH.order], Object.keys(OF.words).sort((a, b) => OF.words[b] - OF.words[a]));
  assert.equal(OH.default, OF.default);
  const mo = (ns) => sorted(ns.map((n) => idx(MONTH_N, n)));
  assert.deepEqual(sorted(E.OLD_HOUSE_MONTHS), mo(OF.months_added));
  assert.deepEqual(sorted(E.OLD_HOUSE_STARS), stars(OF.stars_added));
  for (const b of OH.order) assert.ok(resolveByTitle(E.SOURCES.OLD_HOUSE[b].title), `registered: ${b}`);
  for (const b of OH.order.filter((b) => !OF.own[b])) {
    const n = GP[b];
    const o = OH[b];
    // The new house's months (good and middling) and the three more; its stars and the four more.
    assert.deepEqual(sorted(o.masa.good), sorted([...new Set([...n.masa.good, ...n.masa.mid, ...mo(OF.months_added)])]), `${b} months`);
    assert.deepEqual(o.masa.mid, []);
    assert.deepEqual(sorted(o.nak.good), sorted([...new Set([...n.nak.good, ...stars(OF.stars_added)])]), `${b} stars`);
    for (const st of stars(OF.stars_added)) assert.ok(!o.nak.mid.includes(st));
    // Combustion not considered; no Uttarayana rule (the added months are Dakshinayana).
    assert.equal(o.jupVenNotSet, undefined, `${b}: combustion`);
    assert.equal(o.uttarayana, undefined, `${b}: Uttarayana`);
    // Everything else is the new house's.
    for (const k of Object.keys(n).filter((k) => !['masa', 'nak', 'uttarayana', 'jupVenNotSet', 'labelTa'].includes(k))) assert.deepEqual(o[k], n[k], `${b}.${k}`);
  }
  assert.ok(OF.combustion_not_considered.every((b) => GP[b].jupVenNotSet), 'the books that lift combustion had it for a new house');
  assert.deepEqual(mo(OF.JOSHI_months_listed), sorted(OH.JOSHI.masa.good), 'Joshi lists the seven months');
  // Raman's own rules: four weekdays, Rikta rejected, no month or star rule.
  const R = OH.RAMAN;
  assert.deepEqual(R.vara, { good: OF.own.RAMAN.weekdays.map((w) => DAY_N.indexOf(w)), mid: [] });
  assert.deepEqual([...Array(30).keys()].map((i) => i + 1).filter((t) => !R.tithi.includes(t)), [4, 9, 14, 19, 24, 29]);
  assert.ok(!R.masa && !R.nak && !R.lagna, 'Raman: no month, star or lagna rule');
  for (const st of [...stars(OF.SHRIDHAR_BS), ...stars(OF.SHRIDHAR_MG)]) assert.ok(OH.SHRIDHAR.nak.good.includes(st), `Shridhar: B.S. / M.G. star ${STAR_N[st]}`);
}

// ------------------------------------------------ old house: the codes ---
{
  // Kartika, Shukla 2, Pushya (counted 9th from the Sun's Swati: Kumbha good), a Wednesday.
  const x = { star: 7, tithi: 2, month: 7, sunSign: 6, sunStar: 25, taraCount: 2, signs: { Moon: 3 }, natalMoon: 1, moonPada: 28 };
  for (const b of OH.order.filter((b) => !OF.own[b])) {
    const n = pieceCodes(GP[b], x);
    const o = pieceCodes(OH[b], x);
    assert.ok(!o.some((c) => c.startsWith('MASA') || c.startsWith('NAK') || c.startsWith('UTTARAYANA')), `old ${b}: ${o}`);
    assert.ok(n.some((c) => c.startsWith('MASA') || c.startsWith('UTTARAYANA') || c.startsWith('NAK')), `new ${b}: ${n}`);
  }
  // Jupiter or Venus combust: the new house rejects (where the book says so), the old does not.
  const m = { lagna: 1, nav: 1, signs: { Sun: 6, Moon: 3, Mars: 0, Mercury: 6, Jupiter: 6, Venus: 4, Saturn: 11, Rahu: 9, Ketu: 3 }, natalLagna: 6, natalMoon: 1, combust: { Jupiter: true }, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 7, month: 7 };
  for (const b of OF.combustion_not_considered) {
    assert.ok(stretchCodes(GP[b], m, 3).includes('JUP_VEN_SET') && !stretchCodes(OH[b], m, 3).includes('JUP_VEN_SET'), b);
  }
}

// ------------------------------------------------ medicine: the tables against the books ---
const MD = E.EVENTS.MEDICINE;
const MF = FIX.medicine;
const ALL30 = [...Array(30).keys()].map((i) => i + 1);
const range12 = [...Array(12).keys()].map((i) => i + 1);
{
  assert.deepEqual({ ...E.RANK.MEDICINE.words }, MF.words);
  assert.deepEqual([...MD.order], Object.keys(MF.words).sort((a, b) => MF.words[b] - MF.words[a]));
  assert.equal(MD.default, MF.default);
  for (const b of MD.order) assert.ok(resolveByTitle(E.SOURCES.MEDICINE[b].title), `registered: ${b}`);
  generalLists(MD, MF);
  for (const b of MD.order.filter((b) => !MF.general_lists[b])) {
    assert.ok(MD[b].linesTa.length > 0, `${b} described`);
    assert.equal(Boolean(MD[b].abhijitOk), MF.abhijit.includes(b), `${b}: Abhijit`);
    if (b !== 'RAMAN') assert.deepEqual(sorted(MD[b].lagna.good), MF.lagna_dual.map((n) => n - 1), `${b}: dual lagna`);
    if (!['RAMAN', 'VASHISTHA'].includes(b)) assert.deepEqual({ ...MD[b].benHouse, houses: [...MD[b].benHouse.houses], planets: [...MD[b].benHouse.planets] }, { houses: [1], planets: MF.benefics_in_lagna, code: 'BEN_LAGNA_MID' }, b);
  }
  const S = MF.stars;
  assert.deepEqual(sorted(MD.WILHELM.nak.good), stars(S.WILHELM_favorable));
  assert.deepEqual(sorted(MD.WILHELM.nak.mid), stars(S.WILHELM_mediocre));
  assert.deepEqual(sorted(E.MEDICINE_13), stars(S.MC_laghu_mridu_chara_moola));
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA']) assert.deepEqual(sorted(MD[b].nak.good), stars(S.MC_laghu_mridu_chara_moola), b);
  assert.deepEqual(sorted(MD.KALYANRAMAN.nak.good), stars(S.KR_table));
  assert.deepEqual(sorted(MD.SHRIDHAR.nak.mid), stars(S.SHRIDHAR_KP_fixed));
  assert.deepEqual(sorted(MD.RAMAN.nak.good), stars(S.RAMAN_chronic));
  assert.deepEqual(sorted(MD.VASHISTHA.nak.good), stars(S.VASHISTHA));
  const T = MF.tithis;
  const notOf = (ns) => ALL30.filter((t) => !E.bothPakshas(ns.filter((n) => n < 15)).includes(t) && !ns.filter((n) => n >= 15).includes(t));
  assert.deepEqual(sorted(MD.WILHELM.tithi), notOf(T.WILHELM_avoid));
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA']) assert.deepEqual(sorted(MD[b].tithi), notOf(T.MC_SHRIDHAR_RANGACHARYA_avoid), b);
  for (const b of ['KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(MD[b].tithi), E.bothPakshas(T.KR_JOSHI), b);
  assert.deepEqual(sorted(MD.VASHISTHA.tithi), sorted(T.VASHISTHA_K1_and_shukla));
  const W = MF.weekdays;
  assert.deepEqual(sorted(MD.WILHELM.vara.good), days(W.WILHELM));
  assert.deepEqual(sorted(MD.SHRIDHAR.vara.good), days(W.SHRIDHAR));
  assert.deepEqual(sorted(MD.SHRIDHAR.vara.mid), days(W.SHRIDHAR_JV_also));
  assert.deepEqual(sorted(MD.MUHURTA_CHINTAMANI.vara.good), days(W.MC));
  for (const b of ['KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(MD[b].vara.good), days(W.KR_JOSHI), b);
  assert.deepEqual(sorted(MD.KALYANRAMAN.vara.mid), days(W.KR_MC_also));
  assert.deepEqual(sorted(MD.VASHISTHA.vara.good), days(W.VASHISTHA));
  assert.deepEqual(sorted(MD.RANGACHARYA.vara.good), days(W.RANGACHARYA_good));
  assert.deepEqual(sorted(MD.RANGACHARYA.vara.mid), days(W.RANGACHARYA_printed_good_and_never));
  const Y = MF.empty;
  for (const b of ['WILHELM', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI']) assert.deepEqual([...MD[b].empty], Y.WILHELM_SHRIDHAR_MC_KR_JOSHI, b);
  assert.deepEqual([...MD.RANGACHARYA.empty], Y.RANGACHARYA);
  const [[p1, h1], [p2, h2, mid2]] = MD.VASHISTHA.notIn;
  assert.deepEqual([[...p1], sorted(h1)], [['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'], sorted(Y.VASHISTHA_free_of_affliction)]);
  assert.ok(mid2 && [...p2].join() === [...p1].join() && sorted([...h1, ...h2]).join() === sorted([...new Set(Y.VASHISTHA_note)]).join(), 'the note: the rest marked');
  for (const b of ['WILHELM', 'SHRIDHAR', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA']) assert.deepEqual([...MD[b].taraNot], [1], `${b}: the Janma star`);
  assert.ok(MD.KALYANRAMAN.secondary.includes('TARA_NOT') && MD.KALYANRAMAN.secondary.includes('LAGNA'), 'KR: MC\'s rules in his notes, marked');
}

// ------------------------------------------------ surgery: the tables against the books ---
const SU = E.EVENTS.SURGERY;
const SF = FIX.surgery;
{
  assert.deepEqual({ ...E.RANK.SURGERY.words }, SF.words);
  assert.deepEqual([...SU.order], Object.keys(SF.words).sort((a, b) => SF.words[b] - SF.words[a]));
  assert.equal(SU.default, SF.default);
  for (const b of SU.order) assert.ok(resolveByTitle(E.SOURCES.SURGERY[b].title), `registered: ${b}`);
  generalLists(SU, SF);
  for (const b of SU.order.filter((b) => !SF.general_lists[b])) {
    assert.ok(SU[b].linesTa.length > 0, `${b} described`);
    assert.equal((SU[b].empty ?? []).includes(8), SF.eighth_empty.includes(b), `${b}: the 8th`);
  }
  const S = SF.stars;
  assert.deepEqual(sorted(E.SHARP_STARS), stars(S.sharp_WILHELM_RAMAN_KP));
  for (const b of ['WILHELM', 'RAMAN']) assert.deepEqual(sorted(SU[b].nak.good), stars(S.sharp_WILHELM_RAMAN_KP), b);
  assert.deepEqual(sorted(SU.WILHELM.nak.mid), stars(S.WILHELM_then));
  assert.deepEqual(sorted(SU.SHRIDHAR.nak.good), sorted([...new Set([...stars(S.SHRIDHAR_BJS), ...stars(S.sharp_WILHELM_RAMAN_KP)])]));
  assert.deepEqual(sorted(SU.VASHISTHA.nak.good), stars(S.VASHISTHA));
  assert.deepEqual(sorted(SU.KALYANRAMAN.nak.good), stars(S.KR));
  assert.equal(SU.RANGACHARYA.nak, undefined);
  const T = SF.tithis;
  for (const b of ['WILHELM', 'RAMAN', 'SHRIDHAR']) assert.deepEqual(sorted(SU[b].tithi), E.bothPakshas(T.rikta), b);
  assert.deepEqual(sorted(SU.WILHELM.tithiMid), E.bothPakshas(T.WILHELM_then));
  assert.deepEqual(sorted(SU.WILHELM.tithiNot), sorted([...E.bothPakshas(T.WILHELM_avoid.filter((t) => t < 15)), 15, 30]));
  assert.deepEqual(sorted([...SU.VASHISTHA.tithi, ...SU.VASHISTHA.tithiMid]), sorted(E.bothPakshas(T.rikta)), 'Vashistha: Shukla Rikta, Krishna middling');
  assert.deepEqual(sorted(SU.KALYANRAMAN.tithi), sorted([...E.bothPakshas(T.KR.filter((t) => t < 15)), 15]));
  const W = SF.weekdays;
  assert.deepEqual(sorted(SU.WILHELM.vara.good), days(W.WILHELM_best));
  assert.deepEqual(sorted([...SU.WILHELM.vara.good, ...SU.WILHELM.vara.mid]), [...Array(7).keys()].filter((v) => !days(W.WILHELM_not).includes(v)));
  assert.deepEqual(sorted(SU.RAMAN.vara.good), days(W.RAMAN));
  for (const b of ['SHRIDHAR', 'RANGACHARYA']) assert.deepEqual(sorted(SU[b].vara.good), days(W.SHRIDHAR_KP_RANGACHARYA), b);
  assert.deepEqual(sorted(SU.VASHISTHA.vara.good), days(W.VASHISTHA));
  assert.deepEqual(sorted(SU.KALYANRAMAN.vara.good), days(W.KR));
  for (const b of ['WILHELM', 'SHRIDHAR']) assert.deepEqual(sorted(SU[b].lagna.good), SF.lagnas_WILHELM_SHRIDHAR.map((n) => n - 1), b);
  const M = SF.moon_from_birth_moon_avoid;
  assert.deepEqual([...SU.WILHELM.chandra.mid], M.WILHELM_best_not);
  assert.deepEqual(range12.filter((h) => !SU.RAMAN.chandra.good.includes(h)), M.RAMAN);
  assert.deepEqual(range12.filter((h) => !SU.SHRIDHAR.chandra.good.includes(h)), M.SHRIDHAR);
  assert.equal(SU.WILHELM.marsSaturn, 'INFLUENCE');
  assert.equal(SU.RAMAN.marsSaturn, 'MUTUAL');
}

// ------------------------------------------------ medicine and surgery: the codes ---
{
  // Chitra, Shukla 2, a Monday's piece; the birth Moon in Taurus, the Moon in Virgo (the 5th).
  const x = { star: 13, tithi: 2, month: 8, sunSign: 7, sunStar: 16, taraCount: 5, signs: { Sun: 7, Moon: 5, Mars: 2, Mercury: 7, Jupiter: 3, Venus: 6, Saturn: 11, Rahu: 9, Ketu: 3 }, natalMoon: 1, moonPada: 52, yoga: 0, vishti: false };
  const pc = (ev, b, y = {}) => pieceCodes(E.EVENTS[ev][b], { ...x, ...y });
  const MS = MD.order.filter((b) => !MF.general_lists[b]);
  for (const b of MS) assert.deepEqual(pc('MEDICINE', b), [], `medicine ${b}`);
  for (const b of MS.filter((b) => b !== 'RAMAN')) assert.ok(pc('MEDICINE', b, { tithi: 9 }).includes('TITHI'), `${b}: Navami`);
  assert.ok(pc('MEDICINE', 'WILHELM', { star: 3 }).includes('NAK_MID') && pc('MEDICINE', 'JOSHI', { star: 3 }).includes('NAK'), 'Rohini: mediocre (Kalaprakasika) / not listed');
  assert.ok(pc('MEDICINE', 'WILHELM', { taraCount: 1 }).includes('TARA_NOT') && pc('MEDICINE', 'KALYANRAMAN', { taraCount: 1 }).includes('TARA_NOT_MID'), 'the Janma star: rejected; KR\'s note marks it');
  assert.ok(!pc('MEDICINE', 'JOSHI', { star: 20, moonAbhijit: true }).includes('NAK') && pc('MEDICINE', 'RANGACHARYA', { star: 20, moonAbhijit: true }).includes('NAK'), 'Abhijit: named by Joshi, not Rangacharya');
  assert.ok(pc('MEDICINE', 'VASHISTHA', { vishti: true }).includes('VISHTI') && !pc('MEDICINE', 'WILHELM', { vishti: true }).includes('VISHTI'));
  assert.ok(pc('MEDICINE', 'VASHISTHA', { tithi: 17 }).includes('TITHI') && !pc('MEDICINE', 'VASHISTHA', { tithi: 16 }).includes('TITHI'), 'Krishna 1 only');
  // Surgery: Moola, Shukla 4.
  const sx = { star: 18, tithi: 4 };
  for (const b of ['WILHELM', 'RAMAN', 'SHRIDHAR']) assert.deepEqual(pc('SURGERY', b, sx), [], `surgery ${b}`);
  assert.ok(pc('SURGERY', 'WILHELM', { ...sx, star: 2 }).includes('NAK_MID') && pc('SURGERY', 'WILHELM', { ...sx, tithi: 3 }).includes('TITHI_MID'));
  assert.ok(pc('SURGERY', 'WILHELM', { ...sx, tithi: 8 }).includes('TITHI') && pc('SURGERY', 'WILHELM', { ...sx, tithi: 2 }).includes('TITHI_MID'), 'the 8th avoided; the 2nd middling');
  assert.ok(pc('SURGERY', 'RAMAN', { ...sx, tithi: 19 }).includes('KRISHNA_MID') && pc('SURGERY', 'RAMAN', { ...sx, tithi: 3 }).includes('TITHI'));
  assert.ok(pc('SURGERY', 'VASHISTHA', { star: 17, tithi: 24 }).includes('TITHI_MID') && !pc('SURGERY', 'VASHISTHA', { star: 17, tithi: 9 }).includes('TITHI_MID'));
  // The Moon in the birth Moon's sign: Wilhelm marks, Raman rejects; the 8th from it: Shridhar rejects.
  assert.ok(pc('SURGERY', 'WILHELM', { ...sx, signs: { ...x.signs, Moon: 1 } }).includes('CHANDRA_MID') && pc('SURGERY', 'RAMAN', { ...sx, signs: { ...x.signs, Moon: 1 } }).includes('CHANDRA'));
  assert.ok(pc('SURGERY', 'SHRIDHAR', { ...sx, signs: { ...x.signs, Moon: 8 } }).includes('CHANDRA') && !pc('SURGERY', 'WILHELM', { ...sx, signs: { ...x.signs, Moon: 8 } }).some((c) => c.startsWith('CHANDRA')));
  // Mars and Saturn: together (Wilhelm only); Saturn 7th from Mars (both); Saturn 4th from Mars — Mars aspects Saturn, Saturn Mars (10th): mutual.
  const ms = (mars, sat) => ({ ...sx, signs: { ...x.signs, Mars: mars, Saturn: sat } });
  assert.ok(pc('SURGERY', 'WILHELM', ms(2, 2)).includes('MARS_SATURN') && !pc('SURGERY', 'RAMAN', ms(2, 2)).includes('MARS_SATURN_MUTUAL'));
  assert.ok(pc('SURGERY', 'WILHELM', ms(2, 8)).includes('MARS_SATURN') && pc('SURGERY', 'RAMAN', ms(2, 8)).includes('MARS_SATURN_MUTUAL'));
  assert.ok(pc('SURGERY', 'RAMAN', ms(2, 5)).includes('MARS_SATURN_MUTUAL') && pc('SURGERY', 'WILHELM', ms(2, 5)).includes('MARS_SATURN'));
  assert.ok(!pc('SURGERY', 'RAMAN', ms(2, 9)).includes('MARS_SATURN_MUTUAL') && !pc('SURGERY', 'WILHELM', ms(2, 9)).includes('MARS_SATURN'), 'Saturn 8th from Mars: Mars aspects it, not Saturn Mars');
  // The lagna: Gemini; Jupiter (Cancer) 2nd, Venus (Libra) 5th, Saturn (Pisces) 10th, Rahu (Capricorn) 8th, Ketu (Cancer) 2nd, the Sun and Mercury (Scorpio) 6th, Mars in the lagna, the Moon (Virgo) 4th.
  const m = { lagna: 2, nav: 4, signs: x.signs, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 13, month: 8 };
  const sc = (ev, b, y = {}, vara = 1) => stretchCodes(E.EVENTS[ev][b], { ...m, ...y }, vara);
  assert.ok(sc('MEDICINE', 'WILHELM').includes('EMPTY_8') && sc('MEDICINE', 'WILHELM').includes('BEN_LAGNA_MID'));
  assert.ok(sc('MEDICINE', 'KALYANRAMAN').includes('EMPTY_8_MID') && !sc('MEDICINE', 'KALYANRAMAN').includes('EMPTY_8'), 'KR: MC\'s rules marked');
  assert.ok(sc('MEDICINE', 'VASHISTHA').includes('IN_Rahu_8') && sc('MEDICINE', 'VASHISTHA').includes('IN_Mars_1') && sc('MEDICINE', 'VASHISTHA').includes('IN_Sun_6_MID'));
  assert.ok(sc('MEDICINE', 'RANGACHARYA').includes('EMPTY_6') && !sc('MEDICINE', 'RANGACHARYA').includes('EMPTY_8'));
  assert.ok(sc('MEDICINE', 'JOSHI', { lagna: 0 }).includes('LAGNA') && sc('MEDICINE', 'WILHELM', { lagna: 0 }).includes('LAGNA_MID'));
  assert.ok(sc('MEDICINE', 'RANGACHARYA', {}, 4).includes('VARA') && sc('MEDICINE', 'RANGACHARYA', {}, 0).includes('VARA_MID'), 'Thursday not printed; Sunday both ways');
  assert.ok(!sc('MEDICINE', 'WILHELM', { signs: { ...x.signs, Jupiter: 2 } }).includes('BEN_LAGNA_MID'));
  assert.ok(sc('SURGERY', 'WILHELM').includes('EMPTY_8') && !sc('SURGERY', 'WILHELM').includes('EMPTY_7_MID'));
  assert.ok(sc('SURGERY', 'WILHELM', {}, 2).includes('LAGNA_MID') && !sc('SURGERY', 'WILHELM', { lagna: 5 }, 2).includes('LAGNA_MID'), 'Gemini middling; Virgo best');
  assert.ok(sc('SURGERY', 'WILHELM', {}, 0).includes('VARA') && sc('SURGERY', 'WILHELM', {}, 1).includes('VARA_MID') && !sc('SURGERY', 'WILHELM', {}, 6).some((c) => c.startsWith('VARA')));
  // Rangacharya: the Sun in the 6th — a malefic there, no mark; the Sun (6th) and the Moon (4th) not both in kendras — marked.
  assert.ok(!sc('SURGERY', 'RANGACHARYA', {}, 2).includes('MALEFIC_6_MID') && sc('SURGERY', 'RANGACHARYA', {}, 2).includes('SUN_MOON_KENDRA_MID'));
  assert.ok(sc('SURGERY', 'RANGACHARYA', { signs: { ...x.signs, Sun: 5 } }, 2).includes('MALEFIC_6_MID') && !sc('SURGERY', 'RANGACHARYA', { signs: { ...x.signs, Sun: 5 } }, 2).includes('SUN_MOON_KENDRA_MID'));
  assert.ok(sc('SURGERY', 'SHRIDHAR', { lagna: 3 }).includes('LAGNA_LORD_MID') && sc('SURGERY', 'SHRIDHAR', { lagna: 2 }).includes('LAGNA'));
  for (const c of ['EMPTY_6', 'EMPTY_7', 'BEN_LAGNA_MID', 'MARS_SATURN', 'MARS_SATURN_MUTUAL', 'MALEFIC_6_MID', 'SUN_MOON_KENDRA_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ only the chosen act is computed (2026-10-14) ---
{
  const base = { natalMoonLongitude: 45.5, natalLagnaLongitude: 200, fromMs: Date.parse('2027-01-19T18:30:00Z'), toMs: Date.parse('2027-01-21T18:30:00Z'), latitude: 13.08, longitude: 80.27 };
  const all = muhurtaStarChecks(base);
  const one = muhurtaStarChecks({ ...base, events: ['SURGERY'] });
  const none = muhurtaStarChecks({ ...base, events: ['MARRIAGE'] });
  assert.deepEqual(all.events, [...E.EVENTS.order]);
  assert.deepEqual(one.events, ['SURGERY']);
  assert.deepEqual(none.events, [], 'marriage has no act rules of its own');
  for (const s of one.segments) assert.deepEqual(Object.keys(s.ev), ['SURGERY']);
  // The same codes as the full run, piece by piece and stretch by stretch.
  const at = (r, ms) => r.segments.find((s) => Date.parse(s.fromUtc) <= ms && ms < Date.parse(s.toUtc));
  for (const s of one.segments) {
    const mid = (Date.parse(s.fromUtc) + Date.parse(s.toUtc)) / 2;
    assert.deepEqual(s.ev.SURGERY, at(all, mid).ev.SURGERY, s.fromUtc);
    for (const st of s.lagnas) {
      // A stretch's ends are seconds from the period's start.
      const t = base.fromMs + ((st[0] + st[1]) / 2) * 1000;
      const full = at(all, t).lagnas.find((x) => base.fromMs + x[0] * 1000 <= t && t < base.fromMs + x[1] * 1000);
      assert.deepEqual(one.eventTable[st[10]].SURGERY, all.eventTable[full[10]].SURGERY);
    }
  }
  assert.ok(one.segments.length <= all.segments.length, 'fewer or as many pieces');
  // Only the chosen act's tables go to the page.
  const lg = one.books.lagna;
  assert.deepEqual(Object.keys(lg.eventSources).sort(), ['MONTHS', 'SURGERY', 'VISHTI']);
  assert.deepEqual(lg.eventRules.order, ['SURGERY']);
  assert.ok(lg.eventRules.SURGERY && !lg.eventRules.TRAVEL && lg.eventNotesTa.SURGERY && !lg.eventNotesTa.TRAVEL && lg.eventRank.SURGERY);
}

// ------------------------------------------------ recovery bath: the tables against the books ---
const RS = E.EVENTS.ROGA_SNANA;
const RF = FIX.roga_snana;
{
  assert.deepEqual({ ...E.RANK.ROGA_SNANA.words }, RF.words);
  assert.deepEqual([...RS.order], Object.keys(RF.words).sort((a, b) => RF.words[b] - RF.words[a]));
  assert.equal(RS.default, RF.default);
  for (const b of RS.order) {
    assert.ok(resolveByTitle(E.SOURCES.ROGA_SNANA[b].title), `registered: ${b}`);
    assert.ok(RS[b].linesTa.length > 0, `${b} described`);
  }
  const S = RF.stars;
  const all27 = [...Array(27).keys()];
  const mc18 = all27.filter((st) => !stars(S.MC_SHRIDHAR_RANGACHARYA_avoid9).includes(st));
  assert.equal(mc18.length, 18);
  assert.deepEqual(sorted(E.BATH_MC_18), mc18);
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA']) assert.deepEqual(sorted(RS[b].nak.good), mc18, b);
  for (const b of ['KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(RS[b].nak.good), stars(S.KR_JOSHI_18), b);
  for (const b of ['WILHELM', 'RAMAN', 'AGARWAL']) assert.deepEqual(sorted(RS[b].nak.good), stars(S.WILHELM_RAMAN_AGARWAL_13), b);
  assert.deepEqual(sorted(RS.WILHELM.nak.mid), stars(S.WILHELM_middling));
  const T = RF.tithis;
  const ALL = [...Array(30).keys()].map((i) => i + 1);
  const not = (ns) => ALL.filter((t) => !E.bothPakshas(ns.filter((n) => n < 15)).includes(t) && !ns.includes(t));
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA']) assert.deepEqual(sorted(RS[b].tithi), E.bothPakshas(T.rikta), b);
  for (const b of ['WILHELM', 'RAMAN']) assert.deepEqual(sorted(RS[b].tithi), not(T.WILHELM_RAMAN_avoid), b);
  assert.deepEqual(sorted(RS.AGARWAL.tithi), not(T.AGARWAL_avoid));
  const W = RF.weekdays;
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA']) assert.deepEqual(sorted(RS[b].vara.good), days(W.MC_school), b);
  assert.deepEqual(sorted(RS.WILHELM.vara.good), days(W.WILHELM_good));
  for (const v of days(W.WILHELM_very_bad)) assert.ok(!RS.WILHELM.vara.good.includes(v) && !RS.WILHELM.vara.mid.includes(v));
  assert.deepEqual(sorted(RS.RAMAN.vara.good), days(W.RAMAN));
  assert.deepEqual(sorted(RS.AGARWAL.vara.good), days(W.AGARWAL));
  for (const b of RF.lagna_movable) assert.deepEqual(sorted(RS[b].lagna.good), [0, 3, 6, 9], b);
  // Wilhelm: the signs of Mars, Mercury, Jupiter that are not movable; their navamsas marked.
  const lordSigns = { Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11] };
  const ws = RF.WILHELM_lagna_lords.flatMap((p) => lordSigns[p]);
  assert.deepEqual(sorted(RS.WILHELM.lagna.good), sorted(ws.filter((x) => ![0, 3, 6, 9].includes(x))));
  assert.deepEqual(sorted(RS.WILHELM.navMid), sorted(ws));
  assert.deepEqual([...RS.WILHELM.taraNot], RF.WILHELM_tara_avoid);
  for (const b of RS.order) assert.equal(Boolean(RS[b].chandra) && !RS[b].chandra.good.includes(8), RF.chandrashtama_avoid.includes(b), `${b}: Chandrashtama`);
  for (const b of RF.malefics_kendra_kona_11) assert.deepEqual(sorted(RS[b].maleficIn), [1, 4, 5, 7, 9, 10, 11], b);
  for (const b of RF.malefics_kendra_kona) assert.deepEqual(sorted(RS[b].maleficIn), [1, 4, 5, 7, 9, 10], b);
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'RANGACHARYA', 'KALYANRAMAN']) assert.deepEqual([...RS[b].moonWeak.houses], RF.moon_weak_houses, b);
}

// ------------------------------------------------ recovery bath: the codes ---
{
  // Moola, Shukla 4, the birth Moon in Taurus, the Moon in Sagittarius (the 8th: Chandrashtama, and "weak" from it).
  const x = { star: 18, tithi: 4, month: 7, sunSign: 6, sunStar: 14, taraCount: 2, signs: { Moon: 8 }, natalMoon: 1, moonPada: 72 };
  const pc = (b, y = {}) => pieceCodes(RS[b], { ...x, ...y });
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'JOSHI', 'RANGACHARYA']) assert.deepEqual(pc(b), [], b);
  for (const b of ['WILHELM', 'RAMAN']) assert.ok(pc(b).includes('TITHI') && pc(b).includes('CHANDRA'), `${b}: Rikta, Chandrashtama`);
  assert.ok(pc('AGARWAL').includes('CHANDRA') && pc('AGARWAL', { tithi: 16 }).includes('TITHI'));
  // Shridhar wants the Moon 4th, 8th or 12th from the birth Moon: the 5th is marked.
  assert.ok(pc('SHRIDHAR', { signs: { Moon: 5 } }).includes('MOON_NOT_WEAK_MID') && !pc('MUHURTA_CHINTAMANI', { signs: { Moon: 5 } }).includes('MOON_NOT_WEAK_MID'));
  assert.ok(pc('WILHELM', { tithi: 2, signs: { Moon: 5 }, taraCount: 3 }).includes('TARA_NOT') && pc('WILHELM', { tithi: 2, signs: { Moon: 5 }, star: 16 }).includes('NAK_MID'));
  assert.ok(pc('KALYANRAMAN', { star: 6 }).length === 0 && pc('MUHURTA_CHINTAMANI', { star: 6 }).includes('NAK'), 'Punarvasu: in the printed 18, out of MC\'s');
  // A Cancer lagna: the Moon (Sagittarius) 6th; malefics — the Sun (Libra) 4th, Mars (Aries) 10th, Saturn (Pisces) 9th.
  const m = { lagna: 3, nav: 3, signs: { Sun: 6, Moon: 8, Mars: 0, Mercury: 6, Jupiter: 2, Venus: 5, Saturn: 11, Rahu: 9, Ketu: 3 }, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 4, star: 18, month: 7 };
  const sc = (b, y = {}, vara = 2) => stretchCodes(RS[b], { ...m, ...y }, vara);
  assert.ok(!sc('MUHURTA_CHINTAMANI').includes('MALEFIC_PLACE_MID') && sc('MUHURTA_CHINTAMANI').includes('MOON_NOT_WEAK_MID'), 'MC: malefics placed; the Moon 6th from the lagna — not weak');
  assert.ok(!sc('MUHURTA_CHINTAMANI', { signs: { ...m.signs, Moon: 10 } }).includes('MOON_NOT_WEAK_MID'), 'the Moon 8th from the lagna');
  assert.ok(sc('KALYANRAMAN', { signs: { ...m.signs, Moon: 10 } }).includes('MOON_WEAK_MID') && !sc('KALYANRAMAN').includes('MOON_WEAK_MID'), 'KR: the Moon must not be weak');
  assert.ok(sc('WILHELM').includes('MALEFIC_PLACE_MID') && sc('WILHELM').includes('LAGNA'), 'Wilhelm: malefics not in 3 and 6; Cancer movable');
  assert.ok(sc('WILHELM', { lagna: 5 }).filter((c) => c.startsWith('LAGNA')).length === 0 && sc('WILHELM', { lagna: 4 }).includes('LAGNA_MID'));
  assert.ok(sc('WILHELM', { lagna: 5, nav: 1 }).includes('NAV_MID') && !sc('WILHELM', { lagna: 5, nav: 2 }).includes('NAV_MID'));
  assert.ok(sc('WILHELM', {}, 1).includes('VARA') && sc('WILHELM', {}, 0).includes('VARA_MID') && sc('MUHURTA_CHINTAMANI', {}, 5).includes('VARA'));
  assert.ok(sc('JOSHI', { lagna: 1 }).includes('LAGNA'));
  for (const c of ['MOON_NOT_WEAK_MID', 'MOON_WEAK_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ the other acts (2026-10-14 on): the tables against the books ---
// Each act's fixture block (`acts`) is transcribed from the pages; the tables are written separately and must agree.
{
  const tset = (o) => sorted([...new Set([
    ...E.bothPakshas(o.both ?? []), ...(o.shukla ?? []), ...(o.krishna ?? []).map((n) => n + 15),
    ...(o.full_moon ? [15] : []), ...(o.new_moon ? [30] : []),
  ])]);
  const signsOf = (ns) => sorted(ns.map((n) => n - 1));
  const RULE_KEYS_IGNORED = ['labelTa', 'booksTa', 'noteTa', 'linesTa', 'digdwar'];
  const KARANA_N = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];
  const YOGA_N = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
    'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
  for (const [ev, A] of Object.entries(FIX.acts ?? {})) {
    const T = E.EVENTS[ev];
    assert.ok(T, `${ev}: an event`);
    assert.deepEqual({ ...E.RANK[ev].words }, A.words, `${ev}: words`);
    assert.deepEqual([...T.order], Object.keys(A.words).sort((a, b) => A.words[b] - A.words[a]), `${ev}: most explaining first`);
    assert.equal(T.default, A.default, `${ev}: default`);
    assert.ok(E.RANK[ev].measureTa && E.NOTES_TA[ev] && T.labelTa, `${ev}: measure, notes, label`);
    assert.deepEqual(Object.keys(A.books).sort(), [...T.order].sort(), `${ev}: books`);
    for (const [b, f] of Object.entries(A.books)) {
      const r = T[b];
      const at = `${ev}.${b}`;
      assert.ok(resolveByTitle(E.SOURCES[ev][b].title) && E.SOURCES[ev][b].pageLocus.length > 20, `${at}: source`);
      assert.deepEqual(Object.keys(r).filter((k) => !RULE_KEYS_IGNORED.includes(k)).sort(), [...f.keys].sort(), `${at}: rule keys`);
      if (f.stars) {
        assert.deepEqual(sorted(r.nak.good), stars(f.stars), `${at}: stars`);
        assert.deepEqual(sorted(r.nak.mid), stars(f.stars_mid ?? []), `${at}: middling stars`);
      }
      assert.equal(Boolean(r.abhijitOk), Boolean(f.abhijit), `${at}: Abhijit`);
      if (f.tithis) assert.deepEqual(sorted(r.tithi), tset(f.tithis), `${at}: tithis`);
      if (f.tithis_mid) assert.deepEqual(sorted(r.tithiMid), tset(f.tithis_mid), `${at}: middling tithis`);
      if (f.tithis_not) assert.deepEqual(sorted(r.tithiNot), tset(f.tithis_not), `${at}: tithis avoided`);
      if (f.weekdays) {
        assert.deepEqual(sorted(r.vara.good), days(f.weekdays), `${at}: weekdays`);
        assert.deepEqual(sorted(r.vara.mid), days(f.weekdays_mid ?? []), `${at}: middling weekdays`);
      }
      if (f.lagnas) {
        assert.deepEqual(sorted(r.lagna.good), signsOf(f.lagnas), `${at}: lagnas`);
        assert.deepEqual(sorted(r.lagna.mid), signsOf(f.lagnas_mid ?? []), `${at}: middling lagnas`);
        assert.equal(Boolean(r.lagna.natalMoonOk), Boolean(f.lagna_natal_moon), `${at}: the birth Moon's sign rising`);
      }
      if (f.empty) assert.deepEqual([...r.empty], f.empty, `${at}: empty houses`);
      if (f.nav_marked) assert.deepEqual(sorted(r.navMid), signsOf(f.nav_marked), `${at}: navamsas marked`);
      if (f.not_in) assert.deepEqual(r.notIn.map(([p, h, mid]) => [[...p], [...h], Boolean(mid)]), f.not_in, `${at}: planets kept out`);
      if (f.nav_good) assert.deepEqual(sorted(r.navGood), signsOf(f.nav_good), `${at}: navamsas`);
      if (f.benefic_in) assert.deepEqual(sorted(r.beneficIn), sorted(f.benefic_in), `${at}: benefics' places`);
      if (f.malefic_in) assert.deepEqual(sorted(r.maleficIn), sorted(f.malefic_in), `${at}: malefics' places`);
      if (f.yogas_not) assert.deepEqual(sorted(r.yogaNot), sorted(f.yogas_not.map((n) => YOGA_N.indexOf(n))), `${at}: yogas`);
      for (const k of ['vishti', 'sankranti']) assert.equal(Boolean(r[k]), Boolean(f[k]), `${at}: ${k}`);
      // Agriculture's rules: taras, chakras, months, karanas, the Sun's star, the Moon's navamsa, the weekday lord's lagna.
      if (f.tara_not) assert.deepEqual([...r.taraNot], f.tara_not, `${at}: taras`);
      if (f.empty_pref) assert.deepEqual([...r.emptyPref], f.empty_pref, `${at}: houses preferably empty`);
      if (f.nav_not) assert.deepEqual(sorted(r.navNot), signsOf(f.nav_not), `${at}: navamsas avoided`);
      if (f.star_count) assert.deepEqual(r.starCount.map((c) => ({ from: c.from, of: c.of, good: [...c.good], code: c.code, ...(c.mark ? { mark: true } : {}) })), f.star_count, `${at}: chakras`);
      if (f.months) {
        const mo = (ns) => sorted(ns.map((n) => idx(MONTH_N, n)));
        assert.deepEqual({ good: sorted(r.masa.good), mid: sorted(r.masa.mid), strict: r.masa.strict }, { good: mo(f.months.good), mid: mo(f.months.mid), strict: f.months.strict }, `${at}: months`);
      }
      if (f.karana_only) assert.deepEqual([...r.karanaOnly], f.karana_only.map((k) => idx(KARANA_N, k)), `${at}: karanas`);
      if (f.sun_star_not) assert.deepEqual(sorted(r.sunStarNot), stars(f.sun_star_not), `${at}: the Sun's star`);
      if (f.moon_nav_good) assert.deepEqual([...Array(12).keys()].filter((s) => !r.moonNavMid.not.includes(s)), signsOf(f.moon_nav_good), `${at}: the Moon's navamsa`);
      assert.equal(r.varaLordLagna, f.vara_lord_lagna, `${at}: the weekday lord's lagna`);
      if (f.uttarayana || f.months === undefined) { /* the months are checked above */ }
      assert.equal(r.uttarayana, f.uttarayana, `${at}: Uttarayana`);
      if (f.sun_sign) assert.deepEqual({ good: sorted(r.sunSign.good), mid: sorted(r.sunSign.mid) }, { good: signsOf(f.sun_sign.good), mid: signsOf(f.sun_sign.mid ?? []) }, `${at}: the Sun's sign`);
      if (f.janma_count) assert.deepEqual([...r.janmaCount.good], f.janma_count, `${at}: the janma-star count`);
      if (f.conj) {
        const want = Array.isArray(f.conj) ? { planets: f.conj, with: f.conj } : f.conj;
        assert.deepEqual({ planets: [...r.conj.planets], with: [...r.conj.with] }, want, `${at}: conjunctions`);
      }
      if (f.pada_only) assert.deepEqual([...r.padaOnly], f.pada_only, `${at}: padas`);
      if (f.lagna_birth) assert.deepEqual({ houses: [...r.lagnaBirth.houses], from: r.lagnaBirth.from }, { houses: f.lagna_birth, from: 'EITHER' }, `${at}: the lagna from the birth sign`);
      assert.equal(Boolean(r.nripBana), Boolean(f.nrip_bana), `${at}: Nrip-Baana`);
      assert.equal(Boolean(r.rajaPanchaka), Boolean(f.raja_panchaka), `${at}: Raja-Panchaka`);
      assert.equal(Boolean(r.harishayana), Boolean(f.harishayana), `${at}: Hari-shayana`);
      if (f.lagna_alt) assert.deepEqual({ houses: [...r.lagna.alt.houses], moon: r.lagna.alt.from === 'MOON' }, { houses: f.lagna_alt, moon: Boolean(f.lagna_alt_moon) }, `${at}: the lagna from the birth sign`);
      else assert.equal(r.lagna?.alt, undefined, `${at}: no lagna from the birth sign`);
      if (f.general_list) assert.ok(r.noteTa.startsWith('பொதுப் பட்டியல்'), `${at}: a general-list reading`);
    }
  }
}

// ------------------------------------------------ agriculture: the new keys' behaviour ---
{
  const { starCountFrom } = require('./src/report/eventMuhurta');
  // The count: the Sun's star is 1; with Abhijit the 28 run Ashwini … Uttarashadha (0-20), Abhijit (21), Shravana … Revati (22-27).
  assert.equal(starCountFrom({ star: 0 }, { star: 2 }, 27), 3);
  assert.equal(starCountFrom({ star: 25 }, { star: 0 }, 27), 3, 'wraps round the 27: Uttarabhadra 1, Revati 2, Ashwini 3');
  assert.equal(starCountFrom({ star: 0 }, { star: 20, moonAbhijit: false }, 28), 21);
  assert.equal(starCountFrom({ star: 0 }, { star: 20, moonAbhijit: true }, 28), 22, 'Abhijit takes the 22nd');
  assert.equal(starCountFrom({ star: 0 }, { star: 21 }, 28), 23, 'Shravana follows Abhijit');
  assert.equal(starCountFrom({ star: 20, abhijit: true }, { star: 21 }, 28), 2, 'from Abhijit');

  const PL = E.EVENTS.PLOUGHING;
  // MC's Hala chakra (28 with Abhijit): 1-8 and 18-25 from the Sun's star are good (3 bad before, 8, 9, 8).
  const ploughing = (b, count) => pieceCodes(PL[b], { star: (count - 1) % 27, sunStar: 0, planetStars: { Sun: { star: 0, abhijit: false } }, moonAbhijit: false, tithi: 2, month: 0, signs: {}, navs: {}, taraCount: 2 });
  const halaMC = (n) => ploughing('MUHURTA_CHINTAMANI', n).includes('HALA_CHAKRA');
  for (const n of [1, 5, 8, 18, 21]) assert.ok(!halaMC(n), `MC: ${n} from the Sun is good`);
  for (const n of [9, 10, 14, 17, 26]) assert.ok(halaMC(n), `MC: ${n} from the Sun is bad`);
  // Kalyanraman's note 14: the Sun's star and the 6-8, 14-16, 22-24th are rejected.
  const halaKR = (n) => ploughing('KALYANRAMAN', n).includes('HALA_CHAKRA');
  for (const n of [1, 6, 7, 8, 14, 15, 16, 22, 23, 24]) assert.ok(halaKR(n), `KR: ${n} rejected`);
  for (const n of [2, 5, 9, 13, 17, 21, 25, 27]) assert.ok(!halaKR(n), `KR: ${n} accepted`);
  // Wilhelm's (Kalaprakasika): 3-7, 11-15, 19, 20, 24-26 good.
  const halaW = (n) => ploughing('WILHELM', n).includes('HALA_CHAKRA');
  for (const n of [3, 7, 11, 15, 19, 20, 24, 26]) assert.ok(!halaW(n), `Wilhelm: ${n} good`);
  for (const n of [1, 2, 8, 16, 21, 27]) assert.ok(halaW(n), `Wilhelm: ${n} bad`);

  // Rahu's chakra: 9-11, 13-15, 17-19, 21-23 from Rahu's star (sowing).
  const SO = E.EVENTS.SOWING;
  const sowing = (b, count, extra = {}) => pieceCodes(SO[b], { star: (count - 1 + 5) % 27, tithi: 2, month: 0, signs: {}, navs: {}, taraCount: 2, moonAbhijit: false, sunStar: 0,
    planetStars: { Sun: { star: 0 }, Rahu: { star: 5 }, Venus: { star: 5 }, Mercury: { star: 5 } }, ...extra });
  for (const n of [9, 11, 13, 17, 23]) assert.ok(!sowing('MUHURTA_CHINTAMANI', n).includes('RAHU_CHAKRA'), `Rahu ${n}`);
  for (const n of [1, 8, 12, 16, 20, 24, 27]) assert.ok(sowing('MUHURTA_CHINTAMANI', n).includes('RAHU_CHAKRA'), `Rahu ${n} bad`);
  // Kalyanraman marks it; Shridhar's Srīpati table (7-18 from Rahu) rejects, his Venus table (7-18) marks.
  assert.ok(sowing('KALYANRAMAN', 1).includes('RAHU_CHAKRA_MID') && !sowing('KALYANRAMAN', 1).includes('RAHU_CHAKRA'));
  assert.ok(sowing('SHRIDHAR', 3).includes('RAHU_CHAKRA') && sowing('SHRIDHAR', 3).includes('VENUS_CHAKRA_MID'));
  // The Sun's days: Agni Nakshatra (20° to 43°20′), Bhu-rajasvala (Gemini 6°40′ to 9°40′), no new grain with the Sun in Vishakha.
  const agni = (deg) => pieceCodes(SO.KALYANRAMAN, { star: 3, tithi: 2, month: 0, sunSign: Math.floor(deg / 30), sunDeg: deg % 30, signs: {}, navs: {}, taraCount: 2, moonAbhijit: false, sunStar: 0, planetStars: { Rahu: { star: 0 } } }).includes('AGNI_NAKSHATRA');
  assert.ok(agni(25) && agni(40) && !agni(19) && !agni(44), 'Bharani 20° to Rohini 43°20′');
  const bhu = (sunSign, sunDeg) => pieceCodes(SO.SHRIDHAR, { star: 3, tithi: 3, month: 0, sunSign, sunDeg, signs: {}, navs: {}, taraCount: 2, moonAbhijit: false, sunStar: 0, planetStars: { Rahu: { star: 0 }, Venus: { star: 0 } } }).includes('BHU_RAJASVALA');
  assert.ok(bhu(2, 7) && bhu(2, 9) && !bhu(2, 6) && !bhu(2, 9.8) && !bhu(1, 7));
  const NG = E.EVENTS.NEW_GRAIN;
  const grain = (sunStar, count) => pieceCodes(NG.SHRIDHAR, { star: (count - 1 + 3) % 27, tithi: 2, month: 0, sunStar, signs: {}, navs: {}, taraCount: 2, moonAbhijit: false, planetStars: { Mercury: { star: 3 } } });
  assert.ok(grain(15, 1).includes('SUN_STAR') && !grain(14, 1).includes('SUN_STAR'), 'the Sun in Vishakha (15)');
  // Navanna chakra from Mercury's star: 1-15, 21-24, 27 good.
  for (const n of [1, 15, 21, 24, 27]) assert.ok(!grain(14, n).includes('NAVANNA_CHAKRA'), `Navanna ${n}`);
  for (const n of [16, 20, 25, 26]) assert.ok(grain(14, n).includes('NAVANNA_CHAKRA'), `Navanna ${n} bad`);
  // Kalyanraman's karanas (ploughing): Bava, Balava, Gara only; the fixed ones never.
  const kar = (k) => pieceCodes(PL.KALYANRAMAN, { star: 3, tithi: 2, month: 0, signs: {}, navs: {}, taraCount: 2, moonAbhijit: false, sunStar: 0, planetStars: { Sun: { star: 0 } }, karana: k }).includes('KARANA');
  assert.ok(!kar(1) && !kar(2) && !kar(5), 'Bava, Balava, Gara (the 2nd karana is Balava: k = 1)');
  assert.ok(kar(3) && kar(4) && kar(6) && kar(0) && kar(57), 'Kaulava, Taitila, Vanija, Vishti, the fixed karanas');
  // The lagna owned by the weekday's lord: Raman, Agarwal require it; Wilhelm marks.
  const m = { lagna: 1, nav: 0, signs: {}, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 2, star: 3, month: 0 };
  const lordLagna = (b, vara) => stretchCodes(SO[b], m, vara);
  assert.ok(!lordLagna('RAMAN', 5).includes('VARA_LORD_LAGNA') && lordLagna('RAMAN', 2).includes('VARA_LORD_LAGNA'), 'Taurus: Venus (Friday)');
  assert.ok(lordLagna('WILHELM', 2).includes('VARA_LORD_LAGNA_MID') && !lordLagna('WILHELM', 2).includes('VARA_LORD_LAGNA'));
  // The chakras' names are in Tamil for the page.
  for (const c of ['HALA_CHAKRA', 'RAHU_CHAKRA', 'VENUS_CHAKRA', 'VRIKSHA_CHAKRA', 'NAVANNA_CHAKRA', 'BHU_RAJASVALA', 'AGNI_NAKSHATRA', 'KARANA', 'VARA_LORD_LAGNA', 'SUN_STAR', 'JUP_LAGNA_MID', 'JUP_4_MID', 'SAT_4_MID', 'JMV_LAGNA_MID', 'BEN_4_10_MID']) assert.ok(E.CODE_TA[c], c);
  for (const c of ['HALA_CHAKRA', 'RAHU_CHAKRA', 'VENUS_CHAKRA', 'VRIKSHA_CHAKRA', 'NAVANNA_CHAKRA']) assert.ok(E.CHAKRA_TA[c], c);
}

// ------------------------------------------------ government, service and legal acts: the new keys' behaviour ---
{
  const JS = E.EVENTS.JOIN_SERVICE;
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // Nrip-Baana: the Sun in the 5th, 14th or 23rd degree (4°-5°, 13°-14°, 22°-23°).
  const nrip = (deg) => pieceCodes(JS.SHRIDHAR, { ...base, sunDeg: deg }).includes('NRIP_BANA');
  assert.ok(nrip(4.2) && nrip(13.9) && nrip(22.5) && !nrip(5.2) && !nrip(14.1) && !nrip(3.9) && !nrip(23.1));
  assert.ok(!pieceCodes(JS.KALYANRAMAN, { ...base, sunDeg: 4.2 }).includes('NRIP_BANA'), 'Shridhar only');
  // Raja-Panchaka: the tithi (1-30) + the lagna (Aries 1), by 9 leaving 4 — Shridhar's joining service.
  const m = { lagna: 0, nav: 0, signs: {}, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 3, star: 12, month: 1 };
  const raja = (tithi, lagna) => stretchCodes(JS.SHRIDHAR, { ...m, tithi, lagna }, 1).includes('RAJA_PANCHAKA');
  assert.ok(raja(3, 0) && raja(12, 0) && raja(2, 1) && !raja(3, 1) && !raja(4, 0));
  // Shridhar's employing a servant: the day's star from the janma star among the 28 (Abhijit in): 1-7 and 15-21 are good.
  const ES = E.EVENTS.EMPLOY_SERVANT;
  const emp = (count, extra = {}) => pieceCodes(ES.SHRIDHAR, { ...base, janmaStar: 0, star: (count - 1) % 27, ...extra }).includes('JANMA_BODY');
  for (const n of [1, 7, 15, 21]) assert.ok(!emp(n), `janma count ${n} good`);
  for (const n of [8, 14, 22, 27]) assert.ok(emp(n), `janma count ${n} bad`);
  assert.ok(!emp(21, { star: 20 }) && emp(22, { star: 20, moonAbhijit: true }), 'Abhijit is the 22nd of the 28');
  assert.ok(!pieceCodes(ES.SHRIDHAR, { ...base }).includes('JANMA_BODY'), 'no janma star, no verdict');
  // Mars, Saturn, Rahu together: the peace books reject any two in one sign.
  const CP = E.EVENTS.COMPROMISE;
  const peace = (signs) => pieceCodes(CP.RAMAN, { ...base, signs, star: 3, tithi: 3 }).includes('CONJ');
  assert.ok(peace({ Mars: 2, Saturn: 2, Rahu: 7 }) && peace({ Mars: 2, Saturn: 5, Rahu: 2 }) && peace({ Mars: 1, Saturn: 4, Rahu: 4 }) && !peace({ Mars: 1, Saturn: 2, Rahu: 3 }));
  // Kalyanraman's compromise: Taitila only (the 4th movable karana: k = 22 is Taitila — (k-1) % 7 = 3).
  const kc = (k) => pieceCodes(CP.KALYANRAMAN, { ...base, star: 16, tithi: 8, karana: k }).includes('KARANA');
  assert.ok(!kc(4) && !kc(11) && kc(1) && kc(5) && kc(57));
  // The lagna counted from the birth sign: coronation signs 3/6/10/11 from the natal Moon (Wilhelm) and from the natal lagna or Moon (MC).
  const AO = E.EVENTS.ASSUMING_OFFICE;
  const lagnaOf = (b, lagna, natalMoon, natalLagna) => stretchCodes(AO[b], { ...m, lagna, natalMoon, natalLagna, tithi: 2 }, 1).includes('LAGNA');
  // MC (from the birth lagna or the birth Moon): Aries is the 3rd from Aquarius (Moon) — good; from Aries / Taurus it is the 1st / 12th — not.
  assert.ok(!lagnaOf('MUHURTA_CHINTAMANI', 0, 10, 4) && lagnaOf('MUHURTA_CHINTAMANI', 0, 0, 1), 'MC: the 3rd from the Moon, or not');
  assert.ok(!lagnaOf('MUHURTA_CHINTAMANI', 0, 4, 10), 'MC: or the 3rd from the birth lagna');
  // Wilhelm (Upachaya signs from the Moon only): Capricorn is the 10th from Aries — good; from Virgo the 5th — not, whatever the birth lagna.
  assert.ok(!lagnaOf('WILHELM', 9, 0, 5) && lagnaOf('WILHELM', 9, 5, 5) && lagnaOf('WILHELM', 9, 5, 0), 'Wilhelm: from the Moon only');
  // The codes' names in Tamil.
  for (const c of ['NRIP_BANA', 'RAJA_PANCHAKA', 'JANMA_BODY', 'CONJ', 'JUP_7_MID', 'SAT_6_MID', 'SUN_MARS_3_10_11_MID', 'SUN_MARS_10_11_MID', 'VEN_MOON_1_4_MID', 'VEN_MOON_LAGNA_MID', 'SUN_10_11_MID',
    'SAT_11_MID', 'SAT_6_11_MID', 'VEN_MOON_4_MID', 'JUP_TRIKONA_MID', 'JUP_KONA_MID', 'SAT_UPACHAYA_12_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ money and trade acts: the new keys' behaviour ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  const m = { lagna: 0, nav: 0, signs: {}, natalLagna: 6, natalMoon: 1, combust: {}, dayPart: 1, nightPart: 0, pradosha: false, tithi: 3, star: 12, month: 1 };
  // Raman's borrowing: the Moon with Mars or Saturn — but Mars with Saturn alone is not his rule.
  const BM = E.EVENTS.BORROW_MONEY.RAMAN;
  const borrow = (signs) => pieceCodes(BM, { ...base, star: 0, signs }).includes('CONJ');
  assert.ok(borrow({ Moon: 3, Mars: 3, Saturn: 8 }), 'the Moon with Mars');
  assert.ok(borrow({ Moon: 3, Mars: 8, Saturn: 3 }), 'the Moon with Saturn');
  assert.ok(!borrow({ Moon: 1, Mars: 5, Saturn: 5 }), 'Mars with Saturn is not the rule');
  // Raman's recovering money due: the muhurta lagna not the 8th or 9th from the birth lagna or Moon.
  const CM = E.EVENTS.COLLECT_MONEY.RAMAN;
  const far = (lagna, natalLagna, natalMoon) => stretchCodes(CM, { ...m, lagna, natalLagna, natalMoon, star: 2 }, 1).includes('LAGNA_BIRTH');
  assert.ok(far(7, 0, 0), 'Scorpio is the 8th from Aries');
  assert.ok(far(8, 0, 0), 'Sagittarius is the 9th from Aries');
  assert.ok(far(7, 2, 0), 'the 8th from the birth Moon counts too');
  assert.ok(!far(6, 0, 0) && !far(9, 0, 0), 'the 7th and the 10th are free');
  // Wilhelm's paying debts: Rikta tithis are the best, the 6th, 8th and 12th rejected, the rest middling.
  const RD = E.EVENTS.REPAY_DEBT.WILHELM;
  const tc = (tithi) => pieceCodes(RD, { ...base, star: 0, tithi });
  assert.ok(!tc(4).includes('TITHI') && !tc(4).includes('TITHI_MID'), 'the 4th is best');
  assert.ok(tc(6).includes('TITHI') && tc(23).includes('TITHI'), 'the 6th of either half rejected');
  assert.ok(tc(2).includes('TITHI_MID'), 'the others middling');
  // The codes' names in Tamil.
  for (const c of ['MERC_589_MID', 'BEN_5_9_MID', 'MAL_8_MID', 'JUP_SAT_LAGNA_MID', 'MARS_6_MID', 'VENUS_10_MID',
    'MARS_SAT_3_11_MID', 'MERC_KENDRA_MID', 'LAGNA_BIRTH']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ land and property acts: the handful of earth ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // Wilhelm's land contestation: Bharani, Ardra, Visakha or Hasta, and only their 4th pada.
  const LP = E.EVENTS.LAND_POSSESSION.WILHELM;
  const pada = (star, quarter) => pieceCodes(LP, { ...base, star, moonPada: star * 4 + quarter - 1 });
  assert.ok(!pada(1, 4).includes('PADA') && !pada(1, 4).includes('NAK'), 'Bharani, 4th pada');
  for (const q of [1, 2, 3]) assert.ok(pada(1, q).includes('PADA'), `Bharani pada ${q} rejected`);
  assert.ok(pada(0, 4).includes('NAK'), 'Ashwini is not one of the four');
  assert.ok(!pieceCodes(E.EVENTS.LAND_POSSESSION.SHRIDHAR, { ...base, star: 0, moonPada: 1 }).includes('PADA'), 'no pada rule in the K.P. list');
  // The four division books agree on the stars, tithis and weekdays.
  const D = E.EVENTS.DIVIDE_PROPERTY;
  for (const b of ['KALYANRAMAN', 'JOSHI', 'WILHELM']) {
    assert.deepEqual(sorted(D[b].nak.good), sorted(D.WILHELM.nak.good), `${b}: the same fifteen stars`);
    assert.deepEqual(sorted(D[b].tithi), sorted(D.WILHELM.tithi), `${b}: the same tithis`);
    assert.deepEqual(sorted(D[b].vara.good), sorted(D.WILHELM.vara.good), `${b}: the same weekdays`);
  }
  // The codes' names in Tamil.
  for (const c of ['PADA', 'SUN_KETU_LAGNA_MID', 'MARS_11_MID', 'MARS_4_MID', 'JUP_KENDRA_KONA_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ house building: the earth's sleep and the Vastu chakra ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // The earth sleeps when the Moon's star is the 5th, 7th, 9th, 12th, 19th or 26th from the Sun's — all four digging books.
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'WILHELM']) {
    const r = E.EVENTS.DIGGING[b];
    const at = (n) => pieceCodes(r, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } }).includes('BHU_SHAYANA');
    for (const n of [5, 7, 9, 12, 19, 26]) assert.ok(at(n), `${b}: the earth sleeps at ${n}`);
    for (const n of [1, 4, 8, 13, 27]) assert.ok(!at(n), `${b}: awake at ${n}`);
  }
  // The Vastu chakra: the 8th to the 18th star from the Sun's (Shridhar, Kalyanraman, Joshi).
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI']) {
    const r = E.EVENTS.CONSTRUCTION_START[b];
    const at = (n) => pieceCodes(r, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } }).includes('VASTU_CHAKRA');
    for (const n of [8, 12, 18]) assert.ok(!at(n), `${b}: the Vastu chakra allows ${n}`);
    for (const n of [1, 7, 19, 27]) assert.ok(at(n), `${b}: the Vastu chakra rejects ${n}`);
  }
  // The six books that print the same thirteen stars for starting a house.
  const S13 = sorted(E.EVENTS.CONSTRUCTION_START.MUHURTA_CHINTAMANI.nak.good);
  for (const b of ['SHRIDHAR', 'JOSHI', 'KALYANRAMAN']) {
    assert.deepEqual(sorted(E.EVENTS.CONSTRUCTION_START[b].nak.good), S13, `${b}: the same thirteen stars`);
  }
  for (const c of ['BHU_SHAYANA', 'VASTU_CHAKRA']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ house building, part 2: the Stambha, Dwar and Tadag chakras ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  const from0 = (r, n, abhijit = false) => pieceCodes(r, { ...base, sunStar: 0, star: n - 1, moonAbhijit: abhijit, planetStars: { Sun: { star: 0 } } });
  // Shridhar's Stambha chakra counts the 28 with Abhijit: only the 7th to the 26th (the centre) are good.
  const P = E.EVENTS.PILLARS.SHRIDHAR;
  assert.ok(from0(P, 3).includes('STAMBHA_CHAKRA') && from0(P, 28).includes('STAMBHA_CHAKRA'), 'the base and the top reject');
  assert.ok(!from0(P, 10).includes('STAMBHA_CHAKRA'), 'the centre passes');
  // Shridhar's Dwar chakra (27): the 5th to the 12th and the 21st to the 23rd are rejected.
  const D = E.EVENTS.DOOR_FRAME.SHRIDHAR;
  for (const n of [6, 12, 22]) assert.ok(from0(D, n).includes('DWAR_CHAKRA'), `the door rejects ${n}`);
  for (const n of [2, 14, 26]) assert.ok(!from0(D, n).includes('DWAR_CHAKRA'), `the door allows ${n}`);
  // Shridhar's Tadag chakra (28 with Abhijit): the 5th and the 6th give no water, the 7th to the 10th good water.
  const W = E.EVENTS.WELL_TANK.SHRIDHAR;
  for (const n of [1, 5, 12, 24]) assert.ok(from0(W, n).includes('TADAG_CHAKRA'), `the tank rejects ${n}`);
  for (const n of [3, 8, 18]) assert.ok(!from0(W, n).includes('TADAG_CHAKRA'), `the tank allows ${n}`);
  // Wilhelm and Raman give the same eight stars for the door frame.
  assert.deepEqual(sorted(E.EVENTS.DOOR_FRAME.WILHELM.nak.good), sorted(E.EVENTS.DOOR_FRAME.RAMAN.nak.good), 'the same door-frame stars');
  // Kalyanraman and Joshi give the same nine upward-looking stars for the pillars.
  assert.deepEqual(sorted(E.EVENTS.PILLARS.KALYANRAMAN.nak.good), sorted(E.EVENTS.PILLARS.JOSHI.nak.good), 'the same pillar stars');
  for (const c of ['STAMBHA_CHAKRA', 'DWAR_CHAKRA', 'TADAG_CHAKRA', 'VENUS_LAGNA_MID', 'JUP_MERC_LAGNA_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ the religious family: the Katha and Agni chakras ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // B.J.S.'s Katha chakra: the day's star counted from Jupiter's. The print calls only the 13th to the
  // 20th bad (death, fear from the ruler), so only those are rejected; 21-24, which it leaves unnamed, are not.
  const D = E.EVENTS.DISCOURSE.SHRIDHAR;
  const katha = (n) => pieceCodes(D, { ...base, star: n - 1, planetStars: { Jupiter: { star: 0 } } }).includes('KATHA_CHAKRA');
  for (const n of [13, 16, 17, 20]) assert.ok(katha(n), `the Katha chakra rejects ${n}`);
  for (const n of [1, 4, 8, 12, 21, 24, 25, 27]) assert.ok(!katha(n), `the Katha chakra allows ${n}`);
  // The Agni chakra: blocks of three from the Sun's star to the Sun, Mercury, Venus, Saturn, the Moon,
  // Mars, Jupiter, Rahu, Ketu — only the benefics' blocks pass. Shridhar and his root text agree.
  assert.deepEqual(E.EVENTS.HAVAN.SHRIDHAR.starCount, E.EVENTS.HAVAN.MUHURTA_CHINTAMANI.starCount, 'the same Agni chakra');
  const H = E.EVENTS.HAVAN.MUHURTA_CHINTAMANI;
  const agni = (n) => pieceCodes(H, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } }).includes('AGNI_CHAKRA');
  for (const n of [4, 8, 14, 20]) assert.ok(!agni(n), `the Agni chakra allows ${n}`);  // Mercury, Venus, Moon, Jupiter
  for (const n of [1, 3, 11, 17, 25, 27]) assert.ok(agni(n), `the Agni chakra rejects ${n}`);  // Sun, Saturn, Mars, Rahu, Ketu
  // Four books print the same ten stars for the fire, and the same ten stand under performing a havan.
  const FIRE10 = sorted(E.EVENTS.AGNYADHANA.MUHURTA_CHINTAMANI.nak.good);
  assert.equal(FIRE10.length, 10, 'ten stars for the fire');
  for (const b of ['SHRIDHAR', 'WILHELM', 'KALYANRAMAN']) {
    assert.deepEqual(sorted(E.EVENTS.AGNYADHANA[b].nak.good), FIRE10, `${b}: the same ten stars`);
  }
  for (const b of ['WILHELM', 'KALYANRAMAN']) {
    assert.deepEqual(sorted(E.EVENTS.HAVAN[b].nak.good), FIRE10, `${b}: one fire reading under both acts`);
  }
  // Kalyanraman's print makes the four signs the others bar the only good ones — kept as printed.
  const WATER = [3, 9, 10, 11];
  for (const b of ['MUHURTA_CHINTAMANI', 'SHRIDHAR', 'WILHELM']) {
    const good = E.EVENTS.AGNYADHANA[b].lagna.good;
    for (const s of WATER) assert.ok(!good.includes(s), `${b}: bars sign ${s + 1}`);
  }
  assert.deepEqual(sorted(E.EVENTS.AGNYADHANA.KALYANRAMAN.lagna.good), WATER, 'Kalyanraman keeps only those four');
  // Wilhelm prints one section for initiation into or beginning a mantra: it stands under both acts.
  assert.deepEqual(E.EVENTS.MANTRA_SADHANA.WILHELM.nak.good, E.EVENTS.MANTRA_DEEKSHA.WILHELM.nak.good, 'one mantra reading under both');
  // Joshi names these acts only in his list of acts barred while Jupiter or Venus is combust.
  for (const ev of ['HAVAN', 'AGNYADHANA', 'MANTRA_DEEKSHA', 'DEITY_INSTALL']) {
    assert.ok(E.EVENTS[ev].JOSHI.jupVenNotSet, `${ev}: Joshi's combustion bar`);
    assert.ok(!E.EVENTS[ev].JOSHI.nak, `${ev}: Joshi gives no star list`);
  }
  for (const c of ['KATHA_CHAKRA', 'AGNI_CHAKRA', 'HAVAN_FIRE']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ animals: the Ashva chakra and the books that agree ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // Daivyaga Manohar's Ashva chakra (Shridhar 26.3, Joshi p.102): the Moon's star from the Sun's among
  // the 28 with Abhijit - the first 15 good, the next 11 bad, the last 2 good again.
  for (const b of ['SHRIDHAR', 'JOSHI']) {
    const r = E.EVENTS.HORSE[b];
    const at = (n) => pieceCodes(r, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } }).includes('ASHVA_CHAKRA');
    for (const n of [1, 8, 15]) assert.ok(!at(n), `${b}: the Ashva chakra allows ${n}`);
    for (const n of [16, 18, 20]) assert.ok(at(n), `${b}: the Ashva chakra rejects ${n}`);
    const atAbhijit = pieceCodes(r, { ...base, sunStar: 20, star: 20, moonAbhijit: true, planetStars: { Sun: { star: 20, abhijit: false } } });
    assert.ok(!atAbhijit.includes('ASHVA_CHAKRA'), `${b}: Abhijit itself is the 2nd count and passes`);
    assert.equal(r.starCount[0].of, 28, `${b}: Abhijit is counted`);
  }
  // The root sloka's ten horse stars (M.C. 2/10) are what Shridhar and Joshi print as nine plus Abhijit.
  const MC_H = sorted(E.EVENTS.HORSE.MUHURTA_CHINTAMANI.nak.good);
  for (const b of ['SHRIDHAR', 'JOSHI']) {
    assert.deepEqual(sorted(E.EVENTS.HORSE[b].nak.good), MC_H, `${b}: the same horse stars`);
  }
  // Wilhelm and Kalyanraman print the same eighteen stars for poultry.
  assert.deepEqual(sorted(E.EVENTS.POULTRY.WILHELM.nak.good), sorted(E.EVENTS.POULTRY.KALYANRAMAN.nak.good), 'the same poultry stars');
  assert.equal(E.EVENTS.POULTRY.WILHELM.nak.good.length, 18, 'eighteen poultry stars');
  // Kalyanraman, Joshi and Wilhelm print the same six stars for fish farming; Shridhar's four are a subset.
  const KF = sorted(E.EVENTS.FISH_FARM.KALYANRAMAN.nak.good);
  assert.deepEqual(sorted(E.EVENTS.FISH_FARM.JOSHI.nak.good), KF, 'Joshi: the same fish stars');
  assert.deepEqual(sorted(E.EVENTS.FISH_FARM.WILHELM.nak.good), KF, 'Wilhelm: the same fish stars');
  for (const n of E.EVENTS.FISH_FARM.SHRIDHAR.nak.good) assert.ok(KF.includes(n), 'Shridhar fish star is in the six');
  // Fish farming is the one animal act where three books call Mars's day good.
  for (const b of ['KALYANRAMAN', 'SHRIDHAR', 'JOSHI']) {
    assert.ok(E.EVENTS.FISH_FARM[b].vara.good.includes(2), `${b}: Tuesday is good for fish`);
  }
  for (const b of ['SHRIDHAR', 'JOSHI', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN']) {
    assert.ok(!E.EVENTS.HORSE[b].vara.good.includes(2), `${b}: Tuesday is barred for horses`);
  }
  // Hunting turns the rules over: the Tikshna stars and the Rikta tithis are the good ones.
  const H = E.EVENTS.HUNTING.KALYANRAMAN;
  for (const n of [5, 8, 17, 18]) assert.ok(H.nak.good.includes(n), `hunting wants star ${n}`);
  for (const t of [4, 9, 14]) assert.ok(H.tithi.includes(t), `hunting wants tithi ${t}`);
  assert.deepEqual(sorted(E.EVENTS.HUNTING.SHRIDHAR.vara.good), [0, 2, 6], "Shridhar's malefic weekdays");
  // Four books agree that the animal's own yoni star, plus the Chara stars, suit keeping a pet; the
  // Chintamani drops Shravana from its own Chara five because the same sloka bars it.
  const MC_P = E.EVENTS.PET_ANIMALS.MUHURTA_CHINTAMANI.nak.good;
  assert.ok(!MC_P.includes(21), 'the Chintamani bars Shravana');
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI']) {
    assert.ok(E.EVENTS.PET_ANIMALS[b].nak.good.includes(21), `${b}: keeps Shravana`);
    assert.deepEqual(E.EVENTS.PET_ANIMALS[b].lagna.good, [1, 2, 3, 5, 6, 8, 11], `${b}: the same benefic lagnas`);
  }
  for (const c of ['ASHVA_CHAKRA']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ war and state: where the books agree, and where they invert ---
{
  // Three books print the same twelve Akul stars, the same Jaya tithis and the same two weekdays for an army.
  const AK = sorted(E.EVENTS.ARMY_RAISE.SHRIDHAR.nak.good);
  assert.equal(AK.length, 12, 'twelve Akul stars');
  for (const b of ['WILHELM', 'KALYANRAMAN']) {
    assert.deepEqual(sorted(E.EVENTS.ARMY_RAISE[b].nak.good), AK, `${b}: the same army stars`);
    assert.deepEqual(sorted(E.EVENTS.ARMY_RAISE[b].tithi), sorted(E.EVENTS.ARMY_RAISE.SHRIDHAR.tithi), `${b}: the same Jaya tithis`);
    assert.deepEqual(sorted(E.EVENTS.ARMY_RAISE[b].vara.good), [0, 2], `${b}: Sunday and Tuesday`);
  }
  // Shridhar and Wilhelm print the same ten stars for an army camp.
  assert.deepEqual(sorted(E.EVENTS.ARMY_CAMP.SHRIDHAR.nak.good), sorted(E.EVENTS.ARMY_CAMP.WILHELM.nak.good), 'the same camp stars');
  // Minting coins: four books print the same four star families, reject Monday and Saturday, and
  // want Jupiter and Venus out of combustion.
  const MC_COIN = sorted(E.EVENTS.MINT_COINS.MUHURTA_CHINTAMANI.nak.good);
  for (const b of ['KALYANRAMAN', 'SHRIDHAR', 'WILHELM']) {
    const r = E.EVENTS.MINT_COINS[b];
    assert.deepEqual(sorted(r.nak.good), MC_COIN, `${b}: the same coin stars`);
    assert.ok(!r.vara.good.includes(1) && !r.vara.good.includes(6), `${b}: Monday and Saturday are out`);
    assert.ok(r.jupVenNotSet, `${b}: Jupiter and Venus must not be combust`);
  }
  // A treaty: Pushya and Anuradha in every book, the 8th and 12th tithi, and the Taitila karana.
  for (const b of E.EVENTS.TREATY.order) {
    const r = E.EVENTS.TREATY[b];
    const good = [...r.nak.good, ...(r.nak.mid ?? [])];
    for (const n of [7, 16]) assert.ok(good.includes(n), `${b}: keeps star ${n}`);
    if (r.karanaOnly) assert.deepEqual(r.karanaOnly, [3], `${b}: the Taitila karana`);
    for (const t of [8, 12]) assert.ok(r.tithi.includes(t), `${b}: keeps tithi ${t}`);
  }
  // Wilhelm says the only four stars Kalaprakasika and the Chintamani agree on are the best for
  // bearing a weapon: Ashwini, Chitra, Jyeshtha and Revati.
  assert.deepEqual(sorted(E.EVENTS.WEAPON_WEAR.WILHELM.nak.good), [0, 13, 17, 26], "Wilhelm's four agreed stars");
  // Making a weapon and catching a thief both want the stars every other act bars.
  for (const [ev, b] of [['WEAPON_MAKE', 'MUHURTA_CHINTAMANI'], ['CATCH_THIEF', 'SHRIDHAR']]) {
    const good = E.EVENTS[ev][b].nak.good;
    for (const n of [5, 8, 17, 18]) assert.ok(good.includes(n), `${ev}: wants Tikshna star ${n}`);
  }
  // The Rikta tithis, barred nearly everywhere, are the good ones for weapons and for a thief.
  for (const [ev, b] of [['WEAPON_MAKE', 'SHRIDHAR'], ['WEAPON_WEAR', 'WILHELM'], ['MISSILE_SETUP', 'KALYANRAMAN'], ['CATCH_THIEF', 'KALYANRAMAN']]) {
    for (const t of [4, 9, 14]) assert.ok(E.EVENTS[ev][b].tithi.includes(t), `${ev}/${b}: Rikta tithi ${t} is good`);
  }
  // ... and the Chintamani bars them for bearing a weapon, which is the contradiction the notes name.
  for (const t of [4, 9, 14]) assert.ok(!E.EVENTS.WEAPON_WEAR.MUHURTA_CHINTAMANI.tithi.includes(t), `the Chintamani bars tithi ${t}`);
  // Kalyanraman's thief list and Wilhelm's stealing list are the same eleven stars.
  const KT = sorted(E.EVENTS.CATCH_THIEF.KALYANRAMAN.nak.good);
  assert.equal(KT.length, 11, 'eleven thief stars');
  const WT = sorted([...E.EVENTS.CATCH_THIEF.WILHELM.nak.good, ...E.EVENTS.CATCH_THIEF.WILHELM.nak.mid]);
  for (const n of KT) assert.ok(WT.includes(n), `Wilhelm also keeps thief star ${n}`);
  for (const c of ['MARS_1_10_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ crafts: the books that print one and the same list ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // The Chintamani bars eight stars for a boat; the nineteen that remain are exactly the nineteen
  // Wilhelm names one by one.
  const B19 = sorted(E.EVENTS.BOAT_SHIP.MUHURTA_CHINTAMANI.nak.good);
  assert.equal(B19.length, 19, 'nineteen boat stars');
  assert.deepEqual(sorted(E.EVENTS.BOAT_SHIP.WILHELM.nak.good), B19, "Wilhelm's list is the Chintamani's complement");
  for (const n of [1, 2, 3, 5, 8, 9, 15, 17]) assert.ok(!B19.includes(n), `star ${n} is one of the eight barred`);
  // Weaving: four books, the same eleven stars (the five Chara, the four Mridu, Rohini, Jyeshtha).
  const W11 = sorted(E.EVENTS.WEAVING.KALYANRAMAN.nak.good);
  assert.equal(W11.length, 11, 'eleven weaving stars');
  for (const b of ['SHRIDHAR', 'JOSHI', 'WILHELM']) {
    assert.deepEqual(sorted(E.EVENTS.WEAVING[b].nak.good), W11, `${b}: the same weaving stars`);
  }
  // Pottery: four books, the same ten stars, and three of them want a movable lagna.
  const P10 = sorted(E.EVENTS.POTTERY.KALYANRAMAN.nak.good);
  assert.equal(P10.length, 10, 'ten pottery stars');
  for (const b of ['JOSHI', 'WILHELM', 'SHRIDHAR']) {
    assert.deepEqual(sorted(E.EVENTS.POTTERY[b].nak.good), P10, `${b}: the same pottery stars`);
    assert.deepEqual(sorted(E.EVENTS.POTTERY[b].lagna.good), [0, 3, 6, 9], `${b}: a movable lagna`);
  }
  // Learning a craft: three books, the same sixteen stars, and all three want Mercury or Jupiter
  // in the lagna or the 10th.
  const C16 = sorted(E.EVENTS.CRAFT_LEARN.WILHELM.nak.good);
  assert.equal(C16.length, 16, 'sixteen craft stars');
  for (const b of ['KALYANRAMAN', 'MUHURTA_CHINTAMANI']) {
    assert.deepEqual(sorted(E.EVENTS.CRAFT_LEARN[b].nak.good), C16, `${b}: the same craft stars`);
  }
  for (const b of ['WILHELM', 'MUHURTA_CHINTAMANI']) {
    assert.deepEqual(E.EVENTS.CRAFT_LEARN[b].want[0].houses, [1, 10], `${b}: Mercury or Jupiter in the 1st or 10th`);
  }
  // Stonework: Kalyanraman and Joshi print the same fifteen.
  assert.deepEqual(sorted(E.EVENTS.SCULPTURE.KALYANRAMAN.nak.good), sorted(E.EVENTS.SCULPTURE.JOSHI.nak.good), 'the same stone stars');
  // Shridhar's Shilpa count is marked, not a bar: only four counts of 27 pass, so it must not reject a day.
  const SH = E.EVENTS.SCULPTURE.SHRIDHAR;
  assert.equal(SH.starCount[0].mark, true, 'the Shilpa count is marked');
  const at = (n) => pieceCodes(SH, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } });
  assert.ok(!at(2).includes('SHILPA_COUNT_MID'), 'the 2nd count passes');
  assert.ok(at(3).includes('SHILPA_COUNT_MID'), 'the 3rd count is marked, not rejected');
  for (const c of ['MERC_JUP_1_10_MID', 'SHILPA_COUNT_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ crafts part 2: the Khatwa and grinding chakras ---
{
  const base = { star: 12, tithi: 2, month: 1, sunSign: 9, sunStar: 21, sunDeg: 10, taraCount: 2, moonAbhijit: false, signs: {}, navs: {}, planetStars: {}, karana: 3 };
  // Wilhelm and Joshi print the same twelve leather stars, which are Shridhar's shoe list.
  assert.deepEqual(sorted(E.EVENTS.LEATHER.WILHELM.nak.good), sorted(E.EVENTS.LEATHER.JOSHI.nak.good), 'the same leather stars');
  for (const n of E.EVENTS.LEATHER.WILHELM.nak.good) {
    assert.ok(E.EVENTS.LEATHER.SHRIDHAR.nak.good.includes(n), `Shridhar also keeps leather star ${n}`);
  }
  // A salon: three books, the same thirteen stars with Abhijit among them.
  const S13 = sorted(E.EVENTS.SALON.KALYANRAMAN.nak.good);
  assert.equal(S13.length, 12, 'twelve salon stars besides Abhijit');
  for (const b of ['SHRIDHAR', 'JOSHI']) {
    assert.deepEqual(sorted(E.EVENTS.SALON[b].nak.good), S13, `${b}: the same salon stars`);
    assert.ok(E.EVENTS.SALON[b].abhijitOk, `${b}: Abhijit counts`);
  }
  // Wine: three books, the same ten - the four Tikshna, the five Ugra and Shatabhisha, the very
  // stars the rest of the table bars. Shridhar wants the tithis the others reject.
  const W10 = sorted(E.EVENTS.WINE.KALYANRAMAN.nak.good);
  assert.equal(W10.length, 10, 'ten wine stars');
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI']) {
    assert.deepEqual(sorted(E.EVENTS.WINE[b].nak.good), W10, `${b}: the same wine stars`);
  }
  for (const t of [4, 9, 14]) {
    assert.ok(E.EVENTS.WINE.SHRIDHAR.tithi.includes(t), `Shridhar wants wine tithi ${t}`);
    assert.ok(!E.EVENTS.WINE.KALYANRAMAN.tithi.includes(t), `Kalyanraman bars wine tithi ${t}`);
  }
  // B.J.S.'s Khatwa chakra for a bed: the 5th to the 12th and the 24th to the 27th from the Sun's.
  const BED = E.EVENTS.BED_MAKING.SHRIDHAR;
  const khatwa = (n) => pieceCodes(BED, { ...base, sunStar: 0, star: n - 1, planetStars: { Sun: { star: 0 } } }).includes('KHATWA_CHAKRA');
  for (const n of [5, 9, 12, 24, 27]) assert.ok(khatwa(n), `the Khatwa chakra rejects ${n}`);
  for (const n of [1, 4, 13, 20, 23]) assert.ok(!khatwa(n), `the Khatwa chakra allows ${n}`);
  // The grinding mill is the only chakra in the table counted from Saturn's star.
  const MILL = E.EVENTS.GRINDING_MILL.SHRIDHAR;
  assert.equal(MILL.starCount[0].from, 'Saturn', 'counted from Saturn');
  const mill = (n) => pieceCodes(MILL, { ...base, star: n - 1, planetStars: { Saturn: { star: 0 } } }).includes('CHAKKI_CHAKRA');
  for (const n of [5, 8, 17, 19, 25, 27]) assert.ok(mill(n), `the mill chakra rejects ${n}`);
  for (const n of [1, 4, 9, 16, 20, 23, 24]) assert.ok(!mill(n), `the mill chakra allows ${n}`);
  // Shridhar's dairy combinations and Wilhelm's are the same: Cancer lagna, a Chara star, Monday
  // and Wednesday, with Jyeshtha, Krittika and Vishakha beside them.
  for (const b of ['SHRIDHAR', 'WILHELM']) {
    assert.deepEqual(E.EVENTS.DAIRY[b].lagna.good, [3], `${b}: a Cancer lagna`);
    assert.ok(E.EVENTS.DAIRY[b].vara.good.includes(1) && E.EVENTS.DAIRY[b].vara.good.includes(3), `${b}: Monday and Wednesday`);
  }
  for (const n of E.EVENTS.DAIRY.WILHELM.nak.good) {
    const S = E.EVENTS.DAIRY.SHRIDHAR;
    assert.ok(S.nak.good.includes(n) || S.nak.mid.includes(n), `Shridhar also keeps dairy star ${n}`);
  }
  // Every code a reading emits must have a Tamil label, marked ones under their _MID name.
  for (const ev of E.EVENTS.order ?? Object.keys(E.EVENTS)) {
    const e = E.EVENTS[ev];
    if (!e || !e.order) continue;
    for (const b of e.order) {
      for (const c of E.EVENTS[ev][b].starCount ?? []) {
        assert.ok(E.CODE_TA[c.mark ? `${c.code}_MID` : c.code], `${ev}/${b}: ${c.code} has a label`);
      }
    }
  }
  for (const c of ['KHATWA_CHAKRA', 'CHAKKI_CHAKRA', 'HALA_CHAKRA_MID', 'VRIKSHA_CHAKRA_MID']) assert.ok(E.CODE_TA[c], c);
}

// ------------------------------------------------ the "one book" switch: every reading id maps to a book ---
{
  // The page's one-book mode resolves an act's reading by the book it belongs to. A reading id is
  // either a book id itself or a second reading from that book, which BOOK_OF maps back. If a new
  // variant id is ever added without a BOOK_OF entry, one-book mode would silently skip that act.
  const ids = new Set();
  for (const ev of E.EVENTS.order ?? Object.keys(E.EVENTS)) {
    const e = E.EVENTS[ev];
    if (!e || !e.order) continue;
    for (const id of e.order) ids.add(id);
  }
  const bookOf = (id) => E.BOOK_OF[id] ?? id;
  for (const id of ids) {
    assert.ok(E.BOOK_TA[bookOf(id)], `${id} resolves to a book with a name (BOOK_TA / BOOK_OF)`);
  }
  // Every named book is actually used by some act, so the switch offers nothing dead.
  const used = new Set([...ids].map(bookOf));
  for (const b of Object.keys(E.BOOK_TA)) assert.ok(used.has(b), `${b} is used by at least one act`);
  // The books with a second reading resolve to themselves, not to a separate entry in the switch.
  for (const [variant, base] of Object.entries(E.BOOK_OF)) {
    assert.ok(!E.BOOK_TA[variant], `${variant} is not offered as its own book`);
    assert.ok(E.BOOK_TA[base], `${variant} maps to a named book`);
  }
  // Shridhar is the book the owner reads first; these are the acts he is silent on, which
  // one-book mode has to name rather than leave blank.
  const silent = [...(E.EVENTS.order ?? Object.keys(E.EVENTS))].filter((ev) => {
    const e = E.EVENTS[ev];
    return e && e.order && !e.order.some((id) => bookOf(id) === 'SHRIDHAR');
  });
  assert.ok(silent.length > 0 && silent.length < 40, `Shridhar is silent on ${silent.length} acts`);
}

// ------------------------------------------------ the last readings: adoption, sports, the short ones ---
{
  // Four books print the same eight stars and the same four weekdays for adopting a child.
  const A8 = sorted(E.EVENTS.ADOPTION.KALYANRAMAN.nak.good);
  assert.equal(A8.length, 8, 'eight adoption stars');
  for (const b of ['SHRIDHAR', 'JOSHI', 'WILHELM']) {
    assert.deepEqual(sorted(E.EVENTS.ADOPTION[b].nak.good), A8, `${b}: the same adoption stars`);
    assert.deepEqual(sorted(E.EVENTS.ADOPTION[b].vara.good), [0, 2, 4, 5], `${b}: Sunday, Tuesday, Thursday, Friday`);
  }
  // Kalyanraman and Joshi print the same tithis; Shridhar's differ, which the notes name.
  assert.deepEqual(sorted(E.EVENTS.ADOPTION.KALYANRAMAN.tithi), sorted(E.EVENTS.ADOPTION.JOSHI.tithi), 'the same adoption tithis');
  assert.notDeepEqual(sorted(E.EVENTS.ADOPTION.SHRIDHAR.tithi), sorted(E.EVENTS.ADOPTION.JOSHI.tithi), "Shridhar's adoption tithis differ");
  // Sports: three books, all on the Tikshna and Ugra family that the rest of the table bars.
  for (const b of E.EVENTS.SPORTS.order) {
    const good = E.EVENTS.SPORTS[b].nak.good;
    for (const n of [8, 9, 17, 18]) assert.ok(good.includes(n), `SPORTS/${b}: wants star ${n}`);
  }
  // The shortest readings in the table say exactly what the books say and nothing more.
  assert.deepEqual(sorted(E.EVENTS.SALT.SHRIDHAR.nak.good), [1, 3, 21], 'salt: Bharani, Rohini, Shravana');
  assert.deepEqual(E.EVENTS.SALT.SHRIDHAR.vara.good, [6], 'salt: Saturday alone');
  assert.deepEqual(E.EVENTS.LATHE.SHRIDHAR.nak.good, [26], 'lathe: Revati alone');
  assert.deepEqual(E.EVENTS.LATHE.SHRIDHAR.vara.good, [0], 'lathe: Sunday alone');
  assert.deepEqual(E.EVENTS.LATHE.SHRIDHAR.lagna.good, [4], 'lathe: Leo alone');
  // A reading may carry no star list at all, where the book gives none.
  assert.ok(!E.EVENTS.LIBRARY.SHRIDHAR.nak, 'the library reading names no star');
  assert.deepEqual(E.EVENTS.LIBRARY.SHRIDHAR.vara.good, [4], 'the library wants Thursday');
  assert.ok(!E.EVENTS.OATH_MASS.SHRIDHAR.nak, 'the cabinet oath names no star');
  assert.deepEqual(E.EVENTS.OATH_MASS.SHRIDHAR.empty, [8], 'the cabinet oath wants the 8th empty');
  // Every act in the table has a label, a default its own order contains, and a source per book.
  const acts = (E.EVENTS.order ?? Object.keys(E.EVENTS)).filter((k) => E.EVENTS[k] && E.EVENTS[k].order);
  assert.ok(acts.length >= 113, `the whole table: ${acts.length} acts`);
  for (const ev of acts) {
    const e = E.EVENTS[ev];
    assert.ok(e.labelTa, `${ev} has a Tamil label`);
    assert.ok(e.order.includes(e.default), `${ev}: the default is one of its books`);
    assert.ok(E.NOTES_TA[ev] && E.NOTES_TA[ev].length > 0, `${ev} has notes`);
    for (const b of e.order) assert.ok(E.SOURCES[ev][b], `${ev}/${b} has a source`);
  }
}

// ------------------------------------------------ samskaras, part 1: conception to the first solid food ---
{
  // Conception: Shridhar, Rangacharya and the Chintamani print the same eleven stars.
  const G11 = sorted(E.EVENTS.GARBHADHANA.SHRIDHAR.nak.good);
  assert.equal(G11.length, 11, 'eleven conception stars');
  for (const b of ['RANGACHARYA', 'MUHURTA_CHINTAMANI']) {
    assert.deepEqual(sorted(E.EVENTS.GARBHADHANA[b].nak.good), G11, `${b}: the same conception stars`);
  }
  // Seemanta: four books print the same ten stars (the four Dhruva and the same six).
  const SE = sorted(E.EVENTS.SEEMANTA.SHRIDHAR.nak.good);
  assert.equal(SE.length, 10, 'ten seemanta stars');
  for (const b of ['MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI']) {
    assert.deepEqual(sorted(E.EVENTS.SEEMANTA[b].nak.good), SE, `${b}: the same seemanta stars`);
  }
  // ... and five books call Sunday, Tuesday and Thursday the days; Raman alone bars Sunday and Tuesday.
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI', 'RANGACHARYA']) {
    assert.deepEqual(sorted(E.EVENTS.SEEMANTA[b].vara.good), [0, 2, 4], `${b}: Sunday, Tuesday, Thursday`);
  }
  const RV = E.EVENTS.SEEMANTA.RAMAN.vara.good;
  assert.ok(!RV.includes(0) && !RV.includes(2), 'Raman bars Sunday and Tuesday');
  assert.ok(RV.includes(4), 'but Thursday is common to all six');
  // Naming, the jatakarma and the first food share one sixteen-star family.
  const S16 = sorted(E.EVENTS.JATAKARMA.SHRIDHAR.nak.good);
  assert.equal(S16.length, 16, 'sixteen stars');
  for (const b of ['MUHURTA_CHINTAMANI', 'KALYANRAMAN']) {
    assert.deepEqual(sorted(E.EVENTS.JATAKARMA[b].nak.good), S16, `JATAKARMA/${b}: the same sixteen`);
  }
  assert.deepEqual(sorted(E.EVENTS.NAMAKARANA.SHRIDHAR.nak.good), S16, 'naming: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.SHRIDHAR.nak.good), S16, 'first food: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.RANGACHARYA.nak.good), S16, 'first food, Rangacharya: the same sixteen');
  // The first food: Shridhar, Rangacharya and Raman all want the 10th house empty, and the
  // Chintamani and Rangacharya print the same weekday and lagna bars.
  for (const b of ['SHRIDHAR', 'RANGACHARYA', 'RAMAN']) {
    assert.ok(E.EVENTS.ANNAPRASHANA[b].empty.includes(10), `${b}: the 10th house empty`);
  }
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.MUHURTA_CHINTAMANI.vara.good), sorted(E.EVENTS.ANNAPRASHANA.RANGACHARYA.vara.good), 'the same weekdays');
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.MUHURTA_CHINTAMANI.lagna.good), sorted(E.EVENTS.ANNAPRASHANA.RANGACHARYA.lagna.good), 'the same lagnas');
  // The Janma star: most books bar it, Rangacharya alone allows it - kept as printed.
  for (const b of ['SHRIDHAR', 'WILHELM']) {
    assert.deepEqual(E.EVENTS.ANNAPRASHANA[b].taraNot, [1], `${b}: the Janma star is barred`);
  }
  assert.ok(!E.EVENTS.ANNAPRASHANA.RANGACHARYA.taraNot, 'Rangacharya does not bar the Janma star');
  // Naming: Shridhar, Wilhelm and Raman print the same Jupiter-and-malefic-in-11th combination.
  for (const b of ['SHRIDHAR', 'WILHELM', 'RAMAN']) {
    assert.ok(E.EVENTS.NAMAKARANA[b].want, `${b}: the Jupiter combination is marked`);
  }
  // Jatakarma and naming are one sloka in the Chintamani and one section in Wilhelm, and the
  // tables say so: Wilhelm's reading is the same under both.
  assert.deepEqual(sorted(E.EVENTS.JATAKARMA.WILHELM.nak.good), sorted(E.EVENTS.NAMAKARANA.WILHELM.nak.good), 'one Wilhelm reading under both');
  // The first outing: four books now (Joshi and Wilhelm have their own passages).
  assert.equal(E.EVENTS.NISHKRAMANA.order.length, 4, 'four books for the first outing');
  // Second reading (2026-10-20): conception is five books against Kalyanraman's seventeen, and Kalyanraman is the
  // most-explained book, so he is the default; the other five print Shridhar's eleven.
  for (const b of ['JOSHI', 'WILHELM']) assert.deepEqual(sorted(E.EVENTS.GARBHADHANA[b].nak.good), G11, `${b}: the same conception stars`);
  assert.equal(E.EVENTS.GARBHADHANA.KALYANRAMAN.nak.good.length, 17, 'Kalyanraman: seventeen conception stars');
  assert.equal(E.EVENTS.GARBHADHANA.default, 'KALYANRAMAN', 'the most-explained book leads conception');
  assert.deepEqual(sorted(E.EVENTS.NAMAKARANA.KALYANRAMAN.nak.good), S16, 'naming, Kalyanraman: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.NAMAKARANA.JOSHI.nak.good), S16, 'naming, Joshi: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.JATAKARMA.JOSHI.nak.good), S16, 'jatakarma, Joshi: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.KALYANRAMAN.nak.good), S16, 'first food, Kalyanraman: the same sixteen');
  assert.deepEqual(sorted(E.EVENTS.ANNAPRASHANA.JOSHI.nak.good), S16, 'first food, Joshi: the same sixteen');
  assert.deepEqual(E.EVENTS.ANNAPRASHANA.KALYANRAMAN.taraNot, [3, 5, 7], 'Kalyanraman bars the 3rd, 5th and 7th stars');
}

// ------------------------------------------------ samskaras, part 2: hair, ears, the end of study, rites after death, mother and child ---
{
  const NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati'];
  const st = (...ns) => sorted(ns.map((n) => NAMES.indexOf(n)));
  const MON4 = [1, 3, 4, 5];
  const ev = (a, b) => E.EVENTS[a][b];
  // Tonsure: six books; Kalyanraman (the most explained) leads; his nine best are Wilhelm's nine best.
  assert.equal(E.EVENTS.CHUDAKARANA.order.length, 6, 'tonsure: six books');
  assert.equal(E.EVENTS.CHUDAKARANA.default, 'KALYANRAMAN');
  assert.deepEqual(sorted(ev('CHUDAKARANA', 'KALYANRAMAN').nak.good), sorted(ev('CHUDAKARANA', 'WILHELM').nak.good), 'tonsure: the same nine best stars');
  assert.equal(ev('CHUDAKARANA', 'KALYANRAMAN').nak.good.length, 9);
  // The Chintamani and Joshi print the same twelve (Mridu without Anuradha, Chara, Laghu, Jyeshtha); Shridhar's eleven lack Jyeshtha.
  assert.deepEqual(sorted(ev('CHUDAKARANA', 'JOSHI').nak.good), sorted(ev('CHUDAKARANA', 'MUHURTA_CHINTAMANI').nak.good), 'tonsure: the same twelve');
  assert.equal(ev('CHUDAKARANA', 'MUHURTA_CHINTAMANI').nak.good.length, 12);
  assert.deepEqual(sorted(ev('CHUDAKARANA', 'SHRIDHAR').nak.good), sorted(ev('CHUDAKARANA', 'MUHURTA_CHINTAMANI').nak.good.filter((n) => n !== 17)), 'Shridhar: the same twelve without Jyeshtha');
  assert.ok(ev('CHUDAKARANA', 'SHRIDHAR').nak.mid.includes(17), 'Shridhar: Jyeshtha is middling');
  // Every tonsure book allows Monday, Wednesday, Thursday and Friday and the same 8th-house rule.
  for (const b of E.EVENTS.CHUDAKARANA.order) assert.deepEqual(sorted(ev('CHUDAKARANA', b).vara.good), MON4, `tonsure ${b}: the four days`);
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI', 'RANGACHARYA']) assert.ok(ev('CHUDAKARANA', b).empty.includes(8), `tonsure ${b}: the 8th empty`);
  // Aquarius is barred outright where lagnas are listed (Shridhar, Kalyanraman, Wilhelm, Rangacharya).
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'WILHELM', 'RANGACHARYA']) assert.ok(!ev('CHUDAKARANA', b).lagna.good.includes(10) && !ev('CHUDAKARANA', b).lagna.mid.includes(10), `tonsure ${b}: Aquarius barred`);
  // The Chintamani, Kalyanraman, Rangacharya and Joshi: Rangacharya takes only the bright fortnight.
  assert.ok(ev('CHUDAKARANA', 'RANGACHARYA').tithi.every((t) => t <= 15), 'Rangacharya: bright fortnight only');
  assert.ok(ev('CHUDAKARANA', 'WILHELM').tithi.includes(17) && ev('CHUDAKARANA', 'WILHELM').tithi.includes(18), 'Wilhelm: the first five of the dark fortnight');
  // Shaving: Shridhar bars the five stars the books bar for repeated shaving; the other books follow the tonsure.
  for (const n of st('Krittika', 'Anuradha', 'Rohini', 'Magha', 'UPhalguni')) {
    const r = ev('SHAVING', 'SHRIDHAR').nak;
    assert.ok(!r.good.includes(n) && !r.mid.includes(n), `shaving: ${NAMES[n]} barred by Shridhar`);
  }
  assert.deepEqual(sorted(ev('SHAVING', 'MUHURTA_CHINTAMANI').nak.good), sorted(ev('CHUDAKARANA', 'MUHURTA_CHINTAMANI').nak.good), 'shaving: the Chintamani follows its tonsure');
  assert.deepEqual(sorted(ev('SHAVING', 'JOSHI').nak.good), sorted(ev('CHUDAKARANA', 'JOSHI').nak.good), 'shaving: Joshi follows his tonsure');
  assert.equal(E.EVENTS.SHAVING.order.length, 5, 'shaving: five books');
  // Ear piercing: the Chintamani, Joshi, Wilhelm and Rangacharya all allow Wednesday, Thursday, Friday; Rangacharya bars the malefic days only.
  assert.equal(E.EVENTS.KARNAVEDHA.order.length, 6, 'ear piercing: six books');
  assert.equal(ev('KARNAVEDHA', 'KALYANRAMAN').nak.good.length, 14, 'Kalyanraman: fourteen stars');
  assert.ok(ev('KARNAVEDHA', 'KALYANRAMAN').abhijitOk, 'Kalyanraman counts Abhijit');
  for (const b of ['MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI', 'WILHELM']) assert.equal(ev('KARNAVEDHA', b).harishayana, true, `ear piercing ${b}: the sleeping months`);
  assert.deepEqual(sorted(ev('KARNAVEDHA', 'RANGACHARYA').vara.good), [1, 3, 4, 5], 'Rangacharya: not Sunday, Tuesday, Saturday');
  assert.deepEqual(sorted(ev('KARNAVEDHA', 'KALYANRAMAN').lagna.good), [1, 6, 8, 11], 'Kalyanraman: Taurus, Libra, Sagittarius, Pisces');
  // Keshanta: all four books say "as for tonsure", so each is that book's own tonsure reading.
  for (const b of ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'KALYANRAMAN', 'JOSHI']) {
    assert.deepEqual(sorted(ev('KESHANTA', b).nak.good), sorted(ev('CHUDAKARANA', b).nak.good), `keshanta ${b}: the tonsure stars`);
    assert.deepEqual(sorted(ev('KESHANTA', b).tithi), sorted(ev('CHUDAKARANA', b).tithi), `keshanta ${b}: the tonsure tithis`);
  }
  // Samavartana: Kalyanraman, Shridhar, Wilhelm - Kalyanraman and Shridhar both allow Sunday.
  assert.equal(E.EVENTS.SAMAVARTANA.order.length, 3);
  for (const b of E.EVENTS.SAMAVARTANA.order) assert.ok(ev('SAMAVARTANA', b).vara.good.includes(0), `samavartana ${b}: Sunday allowed`);
  // Ankurarpana is Shridhar's alone.
  assert.deepEqual(E.EVENTS.ANKURARPANA.order, ['SHRIDHAR']);
  assert.equal(ev('ANKURARPANA', 'SHRIDHAR').nak.good.length, 16, 'seeds: sixteen stars');
  // Rites after death: three books, one list of nine, and the Panchaka stars are not in it.
  for (const b of E.EVENTS.PRET_KRIYA.order) {
    assert.deepEqual(sorted(ev('PRET_KRIYA', b).nak.good), st('Hasta', 'Ashwini', 'Pushya', 'Ashlesha', 'Moola', 'Mrigashira', 'Shravana', 'Ardra', 'Swati'), `rites after death ${b}`);
    for (const n of st('Dhanishtha', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati')) assert.ok(!ev('PRET_KRIYA', b).nak.good.includes(n), `Panchaka star ${NAMES[n]} barred`);
  }
  // The dummy's cremation: Shridhar bars the dark fortnight, the Chintamani the bright one, Wilhelm asks for the dark one - as printed.
  assert.ok(ev('PUTTAL_DAHA', 'SHRIDHAR').tithi.every((t) => t <= 15), 'Shridhar: bright fortnight only');
  assert.ok(ev('PUTTAL_DAHA', 'MUHURTA_CHINTAMANI').tithi.every((t) => t > 15), 'the Chintamani: dark fortnight only');
  assert.ok(ev('PUTTAL_DAHA', 'WILHELM').tithi.every((t) => t > 15), 'Wilhelm: dark fortnight only');
  for (const b of E.EVENTS.PUTTAL_DAHA.order) {
    assert.deepEqual(ev('PUTTAL_DAHA', b).taraNot, [1, 5, 10, 14, 19, 23], `dummy ${b}: the performer's taras`);
    assert.equal(ev('PUTTAL_DAHA', b).uttarayana, 'REQUIRED', `dummy ${b}: Uttarayana`);
    assert.ok(!ev('PUTTAL_DAHA', b).vara.good.includes(5) && !ev('PUTTAL_DAHA', b).vara.good.includes(2) && !ev('PUTTAL_DAHA', b).vara.good.includes(6), `dummy ${b}: Friday, Tuesday, Saturday barred`);
  }
  // Bath after menses: the Chintamani adds Jyeshtha to Shridhar's ten.
  assert.deepEqual(sorted(ev('BATH_AFTER_MENSES', 'MUHURTA_CHINTAMANI').nak.good), sorted([...ev('BATH_AFTER_MENSES', 'SHRIDHAR').nak.good, 17]), 'bath after menses: Jyeshtha added');
  // Bath after delivery: five books print the same ten stars and Sunday, Tuesday, Thursday.
  const SU = st('Rohini', 'UPhalguni', 'UAshadha', 'UBhadra', 'Revati', 'Mrigashira', 'Hasta', 'Swati', 'Ashwini', 'Anuradha');
  for (const b of E.EVENTS.SUTIKA_SNANA.order) {
    assert.deepEqual(sorted(ev('SUTIKA_SNANA', b).nak.good), SU, `bath after delivery ${b}: the same ten`);
    assert.deepEqual(sorted(ev('SUTIKA_SNANA', b).vara.good), [0, 2, 4], `bath after delivery ${b}: Sunday, Tuesday, Thursday`);
  }
  assert.equal(E.EVENTS.SUTIKA_SNANA.order.length, 5);
  assert.deepEqual(sorted(ev('SUTIKA_SNANA', 'MUHURTA_CHINTAMANI').vara.mid), [1, 5], 'the Chintamani: Monday and Friday middling');
  // First breast feeding: Wilhelm and Joshi print the same six stars.
  assert.deepEqual(sorted(ev('BREAST_FEEDING', 'WILHELM').nak.good), sorted(ev('BREAST_FEEDING', 'JOSHI').nak.good), 'breast feeding: the same six');
  assert.equal(ev('BREAST_FEEDING', 'JOSHI').nak.good.length, 6);
  // First milk: Shridhar bars ten stars and Magha as downward-looking; Wilhelm admits Magha.
  for (const n of st('Bharani', 'Krittika', 'Ardra', 'Ashlesha', 'Moola', 'Jyeshtha', 'Vishakha', 'PPhalguni', 'PAshadha', 'PBhadra', 'Magha')) assert.ok(!ev('FIRST_MILK', 'SHRIDHAR').nak.good.includes(n), `first milk: Shridhar bars ${NAMES[n]}`);
  assert.ok(ev('FIRST_MILK', 'WILHELM').nak.good.includes(NAMES.indexOf('Magha')), 'first milk: Wilhelm admits Magha');
  // Water worship: three books, one reading.
  for (const b of E.EVENTS.JALA_PUJA.order) {
    assert.deepEqual(sorted(ev('JALA_PUJA', b).nak.good), st('Shravana', 'Pushya', 'Punarvasu', 'Mrigashira', 'Hasta', 'Moola', 'Anuradha'), `water worship ${b}`);
    assert.deepEqual(sorted(ev('JALA_PUJA', b).vara.good), [1, 3, 4], `water worship ${b}: Monday, Wednesday, Thursday`);
    assert.equal(ev('JALA_PUJA', b).masa.good.length, 10, `water worship ${b}: Chaitra and Pausha barred`);
  }
  // First bed: the Khatwa chakra, and Shridhar alone.
  assert.deepEqual(E.EVENTS.CHILD_BED.order, ['SHRIDHAR']);
  assert.equal(ev('CHILD_BED', 'SHRIDHAR').starCount[0].code, 'KHATWA_CHAKRA');
  // The cradle: five books print the same eleven stars and the same chakra (1-5 and 21-27 from the Sun's star).
  const ELEVEN = st('Ashwini', 'Rohini', 'Mrigashira', 'Pushya', 'UPhalguni', 'Hasta', 'Chitra', 'Anuradha', 'UAshadha', 'UBhadra', 'Revati');
  assert.equal(E.EVENTS.DOLAROHANA.order.length, 5);
  for (const b of E.EVENTS.DOLAROHANA.order) {
    assert.deepEqual(sorted(ev('DOLAROHANA', b).nak.good), ELEVEN, `cradle ${b}: the same eleven`);
    assert.deepEqual(ev('DOLAROHANA', b).starCount[0].good, [1, 2, 3, 4, 5, 21, 22, 23, 24, 25, 26, 27], `cradle ${b}: the chakra`);
    assert.equal(ev('DOLAROHANA', b).starCount[0].code, 'DOLA_CHAKRA');
  }
  assert.equal(ev('DOLAROHANA', 'KALYANRAMAN').starCount[0].mark, true, 'Kalyanraman gives the chakra as "another school" - marked');
  assert.ok(!ev('DOLAROHANA', 'SHRIDHAR').starCount[0].mark, 'Shridhar gives it as a rule');
  // Sitting on the earth: four books, one ten; Shridhar says fixed signs, the Chintamani and Wilhelm movable.
  const B10 = st('Hasta', 'Ashwini', 'Pushya', 'Rohini', 'UPhalguni', 'UAshadha', 'UBhadra', 'Mrigashira', 'Anuradha', 'Jyeshtha');
  for (const b of E.EVENTS.BHUMYUPAVESHANA.order) assert.deepEqual(sorted(ev('BHUMYUPAVESHANA', b).nak.good), B10, `earth ${b}: the same ten`);
  assert.deepEqual(sorted(ev('BHUMYUPAVESHANA', 'SHRIDHAR').lagna.good), [1, 4, 7, 10], 'Shridhar: fixed signs');
  for (const b of ['MUHURTA_CHINTAMANI', 'WILHELM']) assert.deepEqual(sorted(ev('BHUMYUPAVESHANA', b).lagna.good), [0, 3, 6, 9], `${b}: movable signs`);
  // First betel: Shridhar's thirteen are inside the Chintamani's seventeen.
  assert.equal(ev('CHILD_BETEL', 'MUHURTA_CHINTAMANI').nak.good.length, 17);
  assert.equal(ev('CHILD_BETEL', 'SHRIDHAR').nak.good.length, 13);
  for (const n of ev('CHILD_BETEL', 'SHRIDHAR').nak.good) assert.ok(ev('CHILD_BETEL', 'MUHURTA_CHINTAMANI').nak.good.includes(n), `betel: ${NAMES[n]} in both`);
  // The cradle chakra's label is in the table.
  assert.ok(E.CODE_TA.DOLA_CHAKRA && E.CODE_TA.DOLA_CHAKRA_MID, 'the cradle chakra has Tamil labels');
  // Every group name in the table has at least one act.
  const acts2 = Object.keys(E.EVENTS).filter((k) => E.EVENTS[k] && E.EVENTS[k].order);
  assert.ok(acts2.length >= 137, `the whole table now has ${acts2.length} acts`);
}

// ------------------------------------------------ the marriage companions: engagement to re-marriage ---
{
  const NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati'];
  const st = (...ns) => sorted(ns.map((n) => NAMES.indexOf(n)));
  const ev = (a, b) => E.EVENTS[a][b];
  const same = (a, bs, what) => { for (const b of bs) assert.deepEqual(sorted(ev(a, b).nak.good), sorted(ev(a, bs[0]).nak.good), `${a}/${b}: ${what}`); };
  // Choosing the bride: the Chintamani, Wilhelm and Joshi print the same nine stars plus the eleven marriage stars.
  same('KANYA_VARANA', ['MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI'], 'the same seventeen');
  assert.equal(ev('KANYA_VARANA', 'JOSHI').nak.good.length, 17);
  assert.equal(ev('KANYA_VARANA', 'SHRIDHAR').nak.good.length, 18, 'Shridhar: eighteen');
  assert.deepEqual(sorted(ev('KANYA_VARANA', 'MUHURTA_CHINTAMANI').vara.good), [0, 1, 3, 4, 5, 6], 'the Chintamani bars only Tuesday');
  // Choosing the bridegroom: the Chintamani and Wilhelm print the same eight; Joshi adds the marriage stars; Shridhar adds Moola, drops Chitra and Mrigashira.
  same('VARA_VARANA', ['MUHURTA_CHINTAMANI', 'WILHELM'], 'the same eight');
  assert.equal(ev('VARA_VARANA', 'WILHELM').nak.good.length, 8);
  for (const n of ev('VARA_VARANA', 'MUHURTA_CHINTAMANI').nak.good) assert.ok(ev('VARA_VARANA', 'JOSHI').nak.good.includes(n), `Joshi includes ${NAMES[n]}`);
  assert.equal(ev('VARA_VARANA', 'JOSHI').nak.good.length, 15);
  assert.ok(ev('VARA_VARANA', 'SHRIDHAR').nak.good.includes(NAMES.indexOf('Moola')) && !ev('VARA_VARANA', 'SHRIDHAR').nak.good.includes(NAMES.indexOf('Chitra')) && !ev('VARA_VARANA', 'SHRIDHAR').nak.good.includes(NAMES.indexOf('Mrigashira')), 'Shridhar groom list');
  assert.deepEqual(sorted(ev('VARA_VARANA', 'VASHISTHA').vara.good), [0, 3, 5], 'Vashistha: Sunday, Wednesday, Friday');
  assert.equal(ev('VARA_VARANA', 'VASHISTHA').masa.good.length, 6, 'Vashistha: six months');
  // Invitations: Shridhar and Wilhelm print the same eight stars.
  same('INVITATION_LETTERS', ['SHRIDHAR', 'WILHELM'], 'the same eight');
  assert.deepEqual(ev('INVITATION_LETTERS', 'SHRIDHAR').empty, [5]);
  // Mandap: Shridhar bars Tuesday; the Chintamani gives the eleven marriage stars.
  assert.ok(!ev('MANDAP', 'SHRIDHAR').vara.good.includes(2), 'no first pillar on Tuesday');
  assert.equal(ev('MANDAP', 'MUHURTA_CHINTAMANI').nak.good.length, 11);
  // The bride's first entry: four books print one list of sixteen; the Chintamani and Joshi bar Tuesday and Sunday, Shridhar and Wilhelm Tuesday and Saturday.
  same('VADHU_PRAVESHA', ['SHRIDHAR', 'MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI'], 'the same sixteen');
  assert.equal(ev('VADHU_PRAVESHA', 'SHRIDHAR').nak.good.length, 16);
  for (const b of ['MUHURTA_CHINTAMANI', 'JOSHI']) assert.deepEqual(sorted(ev('VADHU_PRAVESHA', b).vara.good), [1, 3, 4, 5, 6].filter((d) => d !== 0 && d !== 2), `${b}: Tuesday and Sunday barred`);
  for (const b of ['SHRIDHAR', 'WILHELM']) assert.ok(!ev('VADHU_PRAVESHA', b).vara.good.includes(2) && !ev('VADHU_PRAVESHA', b).vara.good.includes(6), `${b}: Tuesday and Saturday barred`);
  assert.deepEqual(ev('VADHU_PRAVESHA', 'SHRIDHAR').lagna.good, [1, 4, 7, 10], 'Shridhar: fixed signs');
  // The bride's second entry: the Chintamani, Wilhelm and Joshi print the same seventeen; Shridhar has Ardra where they have Chitra.
  same('DWIRAGAMANA', ['MUHURTA_CHINTAMANI', 'WILHELM', 'JOSHI'], 'the same seventeen');
  assert.equal(ev('DWIRAGAMANA', 'MUHURTA_CHINTAMANI').nak.good.length, 17);
  assert.deepEqual(sorted(ev('DWIRAGAMANA', 'SHRIDHAR').nak.good), sorted(ev('DWIRAGAMANA', 'MUHURTA_CHINTAMANI').nak.good.filter((n) => n !== NAMES.indexOf('Chitra')).concat([NAMES.indexOf('Ardra')])), 'Shridhar: Ardra for Chitra');
  for (const b of E.EVENTS.DWIRAGAMANA.order) assert.deepEqual(sorted(ev('DWIRAGAMANA', b).sunSign.good), [0, 7, 10], `${b}: the Sun in Aries, Scorpio or Aquarius`);
  for (const b of ['SHRIDHAR', 'WILHELM', 'JOSHI']) assert.deepEqual(sorted(ev('DWIRAGAMANA', b).lagna.good), [1, 2, 5, 6, 11], `${b}: five lagnas`);
  // The first sexual union: Shridhar, Wilhelm and Raman print the same eleven and the same six middling; Joshi six; Kalyanraman seventeen.
  same('NISHEKA', ['SHRIDHAR', 'WILHELM', 'RAMAN'], 'the same eleven');
  for (const b of ['SHRIDHAR', 'WILHELM', 'RAMAN']) assert.deepEqual(sorted(ev('NISHEKA', b).nak.mid), st('Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Chitra', 'Dhanishtha'), `${b}: the same six middling`);
  assert.equal(ev('NISHEKA', 'SHRIDHAR').nak.good.length, 11);
  assert.equal(ev('NISHEKA', 'JOSHI').nak.good.length, 6);
  assert.equal(ev('NISHEKA', 'KALYANRAMAN').nak.good.length, 17, 'Kalyanraman gives conception and nisheka as one section');
  assert.deepEqual(sorted(ev('NISHEKA', 'KALYANRAMAN').nak.good), sorted(ev('GARBHADHANA', 'KALYANRAMAN').nak.good), 'the same reading under both');
  for (const b of ['SHRIDHAR', 'WILHELM', 'RAMAN']) assert.deepEqual(ev('NISHEKA', b).taraNot, [1, 10, 19], `${b}: Janma, 10th and 19th`);
  // First cooking and the first return: Shridhar alone.
  assert.equal(ev('FIRST_COOKING', 'SHRIDHAR').nak.good.length, 13);
  assert.deepEqual(E.EVENTS.FIRST_RETURN.order, ['SHRIDHAR']);
  assert.equal(ev('FIRST_RETURN', 'SHRIDHAR').nak.good.length, 18, 'eighteen stars remain after the nine barred');
  // Re-marriage: the two Patt Shuddhi chakras, both from the Sun's star.
  assert.deepEqual(ev('REMARRIAGE', 'SHRIDHAR').starCount.map((c) => c.code), ['RUDRA_PATT', 'BRAHMA_PATT']);
  assert.equal(ev('REMARRIAGE', 'SHRIDHAR').nak.good.length, 10);
  // Love marriage: no star list at all, only the Tripadi chakra counted of 28.
  assert.ok(!ev('LOVE_MARRIAGE', 'JOSHI').nak, 'love marriage names no star');
  assert.equal(ev('LOVE_MARRIAGE', 'JOSHI').starCount[0].of, 28);
  assert.deepEqual(ev('LOVE_MARRIAGE', 'JOSHI').starCount[0].good, [5, 6, 10, 12, 13, 14, 15, 22, 23, 24, 26, 27, 28]);
  for (const c of ['RUDRA_PATT', 'BRAHMA_PATT', 'TRIPADI_CHAKRA']) assert.ok(E.CODE_TA[c], `${c} has a Tamil label`);
  const acts3 = Object.keys(E.EVENTS).filter((k) => E.EVENTS[k] && E.EVENTS[k].order);
  assert.ok(acts3.length >= 148, `the whole table now has ${acts3.length} acts`);
}

// ------------------------------------------------ learning by subject ---
{
  const NAMES = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati'];
  const st = (...ns) => sorted(ns.map((n) => NAMES.indexOf(n)));
  const ev = (a, b) => E.EVENTS[a][b];
  const good = (a, b) => sorted(ev(a, b).nak.good);
  const same = (a, bs, what) => { for (const b of bs) assert.deepEqual(good(a, b), good(a, bs[0]), `${a}/${b}: ${what}`); };
  // Mathematics: four books print one list of eighteen and Sunday, Wednesday.
  same('LEARN_MATHEMATICS', ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA'], 'the same eighteen');
  assert.equal(good('LEARN_MATHEMATICS', 'JOSHI').length, 18);
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'VASHISTHA']) assert.deepEqual(sorted(ev('LEARN_MATHEMATICS', b).vara.good), [0, 3], `${b}: Sunday and Wednesday`);
  assert.deepEqual(good('LEARN_MATHEMATICS', 'RANGACHARYA'), st('Shatabhisha', 'PBhadra', 'Anuradha', 'Ardra', 'Revati', 'Hasta', 'Pushya'));
  // Astrology: Kalyanraman and Vashistha print the same eight; Wilhelm's eight contain Raman's seven.
  same('LEARN_ASTROLOGY', ['KALYANRAMAN', 'VASHISTHA'], 'the same eight');
  assert.equal(good('LEARN_ASTROLOGY', 'KALYANRAMAN').length, 8);
  for (const n of good('LEARN_ASTROLOGY', 'RAMAN')) assert.ok(good('LEARN_ASTROLOGY', 'WILHELM').includes(n), `Wilhelm has Raman's ${NAMES[n]}`);
  assert.equal(good('LEARN_ASTROLOGY', 'WILHELM').length, 8);
  assert.deepEqual(sorted(ev('LEARN_ASTROLOGY', 'KALYANRAMAN').vara.good), [3, 4], 'Wednesday and Thursday');
  // Vedas and grammar: Shridhar, Kalyanraman and Joshi print the same thirteen (plus Abhijit); Wilhelm's grammar is eight.
  same('LEARN_VEDAS_GRAMMAR', ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI'], 'the same thirteen');
  assert.equal(good('LEARN_VEDAS_GRAMMAR', 'KALYANRAMAN').length, 13);
  assert.ok(ev('LEARN_VEDAS_GRAMMAR', 'KALYANRAMAN').abhijitOk && ev('LEARN_VEDAS_GRAMMAR', 'JOSHI').abhijitOk, 'Abhijit counts');
  assert.ok(ev('LEARN_VEDAS_GRAMMAR', 'KALYANRAMAN').anadhyaya, 'Anadhyaya days barred');
  assert.deepEqual(good('LEARN_VEDAS_GRAMMAR', 'WILHELM'), st('Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Dhanishtha', 'Revati'));
  assert.equal(good('LEARN_VEDAS_GRAMMAR', 'RAMAN').length, 7);
  // Vedarambha: Kalyanraman and Joshi both print seventeen; Wilhelm and Shridhar's regular study carry the Anadhyaya rule.
  assert.equal(good('VEDARAMBHA', 'KALYANRAMAN').length, 17);
  assert.equal(good('VEDARAMBHA', 'JOSHI').length, 17);
  assert.deepEqual(ev('VEDARAMBHA', 'KALYANRAMAN').tithi, [2, 3, 5, 7, 10, 11, 13], 'Kalyanraman: bright fortnight only');
  for (const b of ['WILHELM', 'SHRIDHAR', 'KALYANRAMAN']) assert.ok(ev('VEDARAMBHA', b).anadhyaya, `${b}: Anadhyaya`);
  assert.equal(good('VEDARAMBHA', 'WILHELM').length, 11);
  assert.deepEqual(ev('VEDARAMBHA', 'WILHELM').lagna.good, [2, 5, 8, 11], 'Wilhelm: dual signs');
  // Philosophy: Shridhar, Kalyanraman and Joshi print the same seventeen and the same four weekdays.
  same('LEARN_PHILOSOPHY', ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI'], 'the same seventeen');
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(ev('LEARN_PHILOSOPHY', b).vara.good), [1, 3, 4, 5], `${b}: Monday, Wednesday, Thursday, Friday`);
  // Logic: three different lists, the Rangacharya ten being Wilhelm's eleven without Rohini.
  assert.deepEqual(good('LEARN_LOGIC', 'RANGACHARYA'), sorted(good('LEARN_LOGIC', 'WILHELM').filter((n) => n !== NAMES.indexOf('Rohini'))));
  assert.equal(good('LEARN_LOGIC', 'RAMAN').length, 6);
  // Medicine: Kalyanraman and Joshi the same fifteen; Shridhar, Rangacharya the sixteen with Jyeshtha; Vashistha alone has Bharani.
  same('LEARN_MEDICINE', ['KALYANRAMAN', 'JOSHI'], 'the same fifteen');
  same('LEARN_MEDICINE', ['SHRIDHAR', 'RANGACHARYA'], 'the same sixteen');
  assert.equal(good('LEARN_MEDICINE', 'SHRIDHAR').length, 16);
  assert.ok(good('LEARN_MEDICINE', 'VASHISTHA').includes(NAMES.indexOf('Bharani')) && !good('LEARN_MEDICINE', 'VASHISTHA').includes(NAMES.indexOf('Mrigashira')), 'Vashistha: Bharani for Mrigashira');
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI', 'RANGACHARYA', 'VASHISTHA']) assert.deepEqual(sorted(ev('LEARN_MEDICINE', b).vara.good), [0, 1, 2], `${b}: Sunday, Monday, Tuesday`);
  // Arms: Shridhar, Kalyanraman and Joshi print the same sixteen and Sunday, Tuesday, Friday.
  same('LEARN_ARMS', ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI'], 'the same sixteen');
  for (const b of ['SHRIDHAR', 'KALYANRAMAN', 'JOSHI']) assert.deepEqual(sorted(ev('LEARN_ARMS', b).vara.good), [0, 2, 5], `${b}: Sunday, Tuesday, Friday`);
  // Music and dance: Shridhar and Joshi the same twelve; Rangacharya's eleven are Shridhar's dance-and-singing list.
  same('LEARN_MUSIC_DANCE', ['SHRIDHAR', 'JOSHI'], 'the same twelve');
  assert.equal(good('LEARN_MUSIC_DANCE', 'RANGACHARYA').length, 11);
  assert.equal(good('LEARN_MUSIC_DANCE', 'KALYANRAMAN').length, 12);
  // Instruments, other religions, languages, law.
  assert.deepEqual(sorted(ev('LEARN_INSTRUMENTS', 'SHRIDHAR').vara.good), [1, 5], 'Monday and Friday');
  for (const n of good('LEARN_INSTRUMENTS', 'KALYANRAMAN')) assert.ok(good('LEARN_INSTRUMENTS', 'SHRIDHAR').includes(n) || n === NAMES.indexOf('Jyeshtha'), `${NAMES[n]} also in Shridhar's list`);
  same('LEARN_OTHER_RELIGIONS', ['KALYANRAMAN', 'JOSHI'], 'the same eight');
  assert.equal(good('LEARN_OTHER_RELIGIONS', 'SHRIDHAR').length, 9);
  same('LEARN_FOREIGN_LANGUAGES', ['KALYANRAMAN', 'JOSHI'], 'the same twelve');
  assert.ok(!ev('LEARN_FOREIGN_LANGUAGES', 'JOSHI').vara.good.includes(4) && !ev('LEARN_FOREIGN_LANGUAGES', 'SHRIDHAR').vara.good.includes(4), 'Thursday barred for languages');
  same('LEARN_LAW', ['KALYANRAMAN', 'JOSHI'], 'the same eleven');
  assert.equal(good('LEARN_LAW', 'SHRIDHAR').length, 10);
  // Writing: Shridhar, Kalyanraman and Wilhelm print the same ten; Rangacharya's ten differ.
  same('START_WRITING', ['SHRIDHAR', 'KALYANRAMAN', 'WILHELM'], 'the same ten');
  assert.ok(ev('START_WRITING', 'SHRIDHAR').galagraha, 'Galagraha tithis barred');
  assert.ok(good('START_WRITING', 'RANGACHARYA').includes(NAMES.indexOf('Revati')) && !good('START_WRITING', 'RANGACHARYA').includes(NAMES.indexOf('Moola')));
  // The Kalyanraman-only subjects: one book each, and the counts are as printed.
  const KR1 = { LEARN_NUMEROLOGY: 16, LEARN_WATER_DIVINING: 6, LEARN_COMPUTING: 3, LEARN_POSITIVE_SCIENCES: 4, LEARN_CULINARY_STATECRAFT: 5, LEARN_PHRENOLOGY: 4, LEARN_SHUDRA_MANTRAS: 9 };
  for (const [a, n] of Object.entries(KR1)) {
    assert.deepEqual(E.EVENTS[a].order, ['KALYANRAMAN'], `${a}: one book`);
    assert.equal(good(a, 'KALYANRAMAN').length, n, `${a}: ${n} stars`);
    assert.deepEqual(sorted(ev(a, 'KALYANRAMAN').vara.good), [0, 1, 3, 4, 5], `${a}: five weekdays`);
  }
  assert.deepEqual(good('LEARN_HIGHER_STUDIES', 'KALYANRAMAN'), st('Rohini'), 'Rohini specially');
  assert.equal(ev('LEARN_HIGHER_STUDIES', 'KALYANRAMAN').nak.mid.length, 26, 'every other star middling');
  const acts4 = Object.keys(E.EVENTS).filter((k) => E.EVENTS[k] && E.EVENTS[k].order);
  assert.ok(acts4.length >= 170, `the whole table now has ${acts4.length} acts`);
}

console.log('test-event-muhurta: all checks passed');
