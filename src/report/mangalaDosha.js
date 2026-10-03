/**
 * Mangala (Kuja) dosha — consideration, cancellation and matching.
 *
 * PL9 has three worksheets for it (Mangala Considerations, Mangala
 * Cancellation, Mangala Results and Remedies) and the repo had one line
 * (`doshas.js`: Mars in 1/2/4/7/8/12), cited to "a popular convention" with no
 * page. This module replaces the line with what the books actually say, and is
 * careful about two things.
 *
 * ## The books do not agree, so nothing is merged
 *
 * Formation has four readings (`mangalaDoshaTables.js`). Every cancellation is a
 * practitioner's rule from one named book and page, evaluated *per source*; the
 * lists contradict each other in places, so there is no single "cancelled"
 * verdict, and none is invented.
 *
 * ## What a condition can come out as
 *
 *   MET           the geometry the book states holds in this chart.
 *   NOT_MET       it does not.
 *   JUDGEMENT     the geometry holds, but the book also says the planet must be
 *                 "strong"/"powerful", which the book does not define and this
 *                 code does not guess. The practitioner decides.
 *   NOT_COMPUTED  an input is missing — node aspects, combustion, an Ashtakoota
 *                 score, a navamsa — and the reason is given.
 *
 * Conditions that need the partner's chart report `NEEDS_PARTNER` until one is
 * supplied.
 *
 * Everything works on plain "facts" (sign of each graha, Lagna sign, a few
 * flags), so the rules are tested on hand-built charts, and a chart adapter
 * (`factsFromChart`) is the only part that touches the ephemeris.
 */

const { EXALTATION, DEBILITATION, OWN_SIGNS } = require('../chart/shadbala');
const { RASI_LORD } = require('../chart/karaka');
const { naturalRelation } = require('../chart/planetaryRelationship');
const { VEDIC_ASPECTS } = require('../chart/aspectMatrix');
const { UnsupportedInputError } = require('../contracts/chartContext');
const { GANA_OF } = require('./poruthamTables');
const T = require('./mangalaDoshaTables');

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const MALEFICS = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
const SIGN = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
  Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
};
const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
const KETU_STARS = [0, 9, 18]; // Ashwini, Magha, Mula
const JYESHTHA = 17;
const MOOLA = 18;
const MOVABLE = [0, 3, 6, 9];
const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

const MET = (detail) => ({ status: 'MET', detail });
const NOT_MET = (detail) => ({ status: 'NOT_MET', detail });
const JUDGEMENT = (detail) => ({ status: 'JUDGEMENT', detail });
const NOT_COMPUTED = (detail) => ({ status: 'NOT_COMPUTED', detail });
const NEEDS_PARTNER = () => ({ status: 'NEEDS_PARTNER', detail: 'இந்த நிபந்தனைக்குத் துணையின் ஜாதகம் தேவை' });
const yes = (b, detail) => (b ? MET(detail) : NOT_MET(detail));

// -------------------------------------------------------------------- facts --

/**
 * @param lagna       Lagna sign, 0-11
 * @param rasi        sign index of each of the nine grahas
 * @param nakshatra   { Mars, Moon } star index 0-26 (optional)
 * @param retrograde  { Mars, Saturn, ... } booleans (optional)
 * @param gender      'female' | 'male' | null — a few rules differ by sex
 * @param weekday     0 = Sunday … 6 = Saturday, the Vedic day of birth (optional)
 */
function buildFacts({ lagna, rasi, nakshatra = {}, retrograde = {}, gender = null, weekday = null }) {
  if (!Number.isInteger(lagna) || lagna < 0 || lagna > 11) {
    throw new UnsupportedInputError('lagna must be an integer 0-11', 'lagna');
  }
  for (const g of GRAHAS) {
    if (!Number.isInteger(rasi?.[g]) || rasi[g] < 0 || rasi[g] > 11) {
      throw new UnsupportedInputError(`rasi.${g} must be an integer 0-11`, g);
    }
  }
  const refRasi = (ref) => (ref === 'LAGNA' ? lagna : rasi[ref === 'MOON' ? 'Moon' : 'Venus']);
  const houseFrom = (ref, g) => ((rasi[g] - refRasi(ref) + 12) % 12) + 1;
  const houseOf = (g) => houseFrom('LAGNA', g);
  const aspectsSign = (g, toSign) => {
    const set = VEDIC_ASPECTS[g];
    if (!set) return null; // Rahu and Ketu: no sourced aspect rule
    return set.includes(((toSign - rasi[g] + 12) % 12) + 1);
  };
  return Object.freeze({
    lagna, rasi: Object.freeze({ ...rasi }), nakshatra: Object.freeze({ ...nakshatra }),
    retrograde: Object.freeze({ ...retrograde }), gender, weekday,
    refRasi, houseFrom, houseOf,
    sameSign: (a, b) => rasi[a] === rasi[b],
    aspectsSign, aspectsGraha: (from, to) => aspectsSign(from, rasi[to]),
    lordOfHouse: (h) => RASI_LORD[(lagna + h - 1) % 12],
    maleficsIn: (ref, houses, among = MALEFICS) => among.filter((g) => houses.includes(houseFrom(ref, g))),
  });
}

/** exalted, debilitated, own, friend, neutral or enemy sign (natural friendship). */
function dignityOf(planet, signIndex) {
  if (EXALTATION[planet]?.sign === signIndex) return 'EXAL';
  if (DEBILITATION[planet]?.sign === signIndex) return 'DEB';
  if (OWN_SIGNS[planet]?.includes(signIndex)) return 'OH';
  const rel = naturalRelation(planet, RASI_LORD[signIndex]);
  return { friend: 'FH', neutral: 'NH', enemy: 'EH' }[rel];
}

// -------------------------------------------------------------- formation ---

/**
 * Mars's house from each point of count, under each reading. Every reading is
 * reported, whether or not it finds the dosha, so the disagreement is data.
 */
function considerFormation(f) {
  // In the owner's book order: the book that explains most first.
  return T.BOOK_RANK.readingOrder.map((id) => T.READINGS[id]).map((r) => {
    const perReference = r.references.map((ref) => {
      const house = f.houseFrom(ref, 'Mars');
      return { reference: ref, marsHouse: house, present: r.houses.includes(house) };
    });
    // The other malefics are counted only by the readings that count them.
    const others = r.references.flatMap((ref) => r.otherMalefics
      .filter((g) => r.houses.includes(f.houseFrom(ref, g)))
      .map((g) => ({ reference: ref, graha: g, house: f.houseFrom(ref, g) })));
    return {
      id: r.id, label: r.label, labelTa: r.labelTa, houses: r.houses, references: r.references,
      classical: r.classical, note: r.note,
      sourceTitle: r.source.title, sourcePage: r.source.pageLocus,
      perReference,
      present: perReference.some((p) => p.present),
      presentFromLagna: perReference.find((p) => p.reference === 'LAGNA').present,
      otherMalefics: others,
    };
  });
}

/** Vishnu Bhaskar's percentage and units for Mars, from each point of count. */
function considerIntensity(f) {
  const marsSign = f.rasi.Mars;
  const marsDignity = dignityOf('Mars', marsSign);
  const out = { marsDignity, perReference: [], notStated: T.UNITS.notStated, notStatedTa: T.UNITS.notStatedTa };
  for (const ref of ['LAGNA', 'MOON', 'VENUS']) {
    const house = f.houseFrom(ref, 'Mars');
    const percent = T.INTENSITY_PERCENT.percent[house] ?? null;
    const group = [7, 8].includes(house) ? 'houses7_8' : [1, 2, 12, 4].includes(house) ? 'houses1_2_12_4' : null;
    const units = {};
    if (group) units.Mars = T.UNITS[group].Mars[marsDignity];
    // Saturn and the Sun have a dignity row; the nodes do not, so they are left out.
    for (const [g, col] of [['Saturn', 'SaturnNodes'], ['Sun', 'Sun']]) {
      const gh = f.houseFrom(ref, g);
      const gGroup = [7, 8].includes(gh) ? 'houses7_8' : [1, 2, 12, 4].includes(gh) ? 'houses1_2_12_4' : null;
      if (gGroup) units[g] = T.UNITS[gGroup][col][dignityOf(g, f.rasi[g])];
    }
    const nodesInRelevant = ['Rahu', 'Ketu'].filter((g) => [7, 8, 1, 2, 12, 4].includes(f.houseFrom(ref, g)));
    out.perReference.push({
      reference: ref, marsHouse: house, percent, units,
      marsUnits: units.Mars ?? 0,
      totalUnits: Object.values(units).reduce((a, b) => a + b, 0),
      nodesNotCounted: nodesInRelevant,
    });
  }
  out.sourcePage = T.INTENSITY_PERCENT.source.pageLocus;
  out.unitsSourcePage = T.UNITS.source.pageLocus;
  return out;
}

// ----------------------------------------------------------- cancellations --

/**
 * Each condition: where it is stated (source key + page), what it says, and a
 * test. `scope` is NATIVE (this chart alone) or PARTNER (needs both charts).
 * `ref` for partner tests: (mine, theirs) — "mine" is the chart being read.
 */
const C = [];
const add = (c) => C.push(Object.freeze(c));

const MARS = 'Mars';
const marsIn = (f, signs) => signs.includes(f.rasi.Mars);
const h = (f) => f.houseOf(MARS);
const inRelevant = (f) => [1, 2, 4, 7, 8, 12].includes(h(f));

// ---- Mansagari, translator's list (printed pp.795-796) -------------------
const MP = (item, pdf) => `printed p.${pdf === 230 ? 795 : 796} (PDF ${pdf}), translator's list, item ${item}`;
add({
  id: 'MAN_I', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(i)', 230),
  en: 'Saturn in the 12th, 1st, 4th, 7th or 8th',
  ta: 'சனி 12, 1, 4, 7 அல்லது 8-ஆம் இடத்தில்',
  test: (f) => yes([12, 1, 4, 7, 8].includes(f.houseOf('Saturn')), `சனி ${f.houseOf('Saturn')}-ஆம் இடம்`),
});
add({
  id: 'MAN_II', source: 'MANSAGARI', scope: 'PARTNER', page: MP('(ii)', 230),
  en: 'Saturn, Mars, Rahu, Ketu or the Sun in one of those five houses, in both horoscopes',
  ta: 'சனி, செவ்வாய், ராகு, கேது, சூரியன் ஆகியவற்றில் ஒன்று அந்த ஐந்து இடங்களில், இரு ஜாதகத்திலும்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const a = f.maleficsIn('LAGNA', [12, 1, 4, 7, 8]);
    const b = p.maleficsIn('LAGNA', [12, 1, 4, 7, 8]);
    return yes(a.length > 0 && b.length > 0, `இந்த ஜாதகம்: ${a.join(', ') || '—'} · துணை: ${b.join(', ') || '—'}`);
  },
});
add({
  id: 'MAN_III_A', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(iii)', 230),
  en: 'Powerful Jupiter and Venus aspect the 7th from the Ascendant',
  ta: 'பலமான குருவும் சுக்கிரனும் லக்னத்திலிருந்து 7-ஆம் இடத்தைப் பார்க்கிறார்கள்',
  test: (f) => {
    const seventh = (f.lagna + 6) % 12;
    const both = f.aspectsSign('Jupiter', seventh) && f.aspectsSign('Venus', seventh);
    return both ? JUDGEMENT('இருவரும் 7-ஆம் இடத்தைப் பார்க்கிறார்கள்; "பலமான" என்பதை நூல் வரையறுக்கவில்லை') : NOT_MET('இருவரும் 7-ஆம் இடத்தைப் பார்க்கவில்லை');
  },
});
add({
  id: 'MAN_III_B', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(iii)', 230),
  en: 'Retrograde Mars in debilitation, or in an inimical sign, or combust',
  ta: 'வக்கிர செவ்வாய் நீசத்தில், பகை ராசியில், அல்லது அஸ்தமனத்தில்',
  test: (f) => {
    if (!f.retrograde.Mars) return NOT_MET('செவ்வாய் வக்கிரம் அல்ல');
    const d = dignityOf(MARS, f.rasi.Mars);
    if (d === 'DEB' || d === 'EH') return MET(d === 'DEB' ? 'வக்கிர செவ்வாய் நீசம்' : 'வக்கிர செவ்வாய் பகை ராசியில்');
    return JUDGEMENT('வக்கிர செவ்வாய்; நீசம்/பகை இல்லை — அஸ்தமனம் மதிப்பிடப்படவில்லை (எல்லை நூலில் இல்லை)');
  },
});
add({
  id: 'MAN_IV', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(iv)', 230),
  en: 'Mars in a kendra in its own sign or its sign of exaltation',
  ta: 'செவ்வாய் கேந்திரத்தில் சொந்த அல்லது உச்ச ராசியில்',
  test: (f) => yes(KENDRA.includes(h(f)) && marsIn(f, [SIGN.Aries, SIGN.Scorpio, SIGN.Capricorn]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'MAN_V', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(v)', 231),
  en: 'Mars in Cancer or Capricorn (Jataka Chandrika)',
  ta: 'செவ்வாய் கடகம் அல்லது மகரத்தில் (ஜாதக சந்திரிகை)',
  test: (f) => yes(marsIn(f, [SIGN.Cancer, SIGN.Capricorn]), RASI_TA[f.rasi.Mars]),
});
add({
  id: 'MAN_VI', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(vi)', 231),
  en: 'Mars conjunct the Moon or Jupiter',
  ta: 'செவ்வாய் சந்திரன் அல்லது குருவுடன் சேர்க்கை',
  test: (f) => yes(f.sameSign(MARS, 'Moon') || f.sameSign(MARS, 'Jupiter'),
    [f.sameSign(MARS, 'Moon') && 'சந்திரனுடன்', f.sameSign(MARS, 'Jupiter') && 'குருவுடன்'].filter(Boolean).join(', ') || 'சேர்க்கை இல்லை'),
});
add({
  id: 'MAN_VII', source: 'MANSAGARI', scope: 'PARTNER', page: MP('(vii)', 231),
  en: 'Both the boy and the girl have a similar Kuja dosha',
  ta: 'ஆணுக்கும் பெண்ணுக்கும் ஒரே மாதிரியான செவ்வாய் தோஷம்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const a = [1, 4, 7, 8, 12].includes(f.houseOf(MARS));
    const b = [1, 4, 7, 8, 12].includes(p.houseOf(MARS));
    return yes(a && b, `இந்த ஜாதகத்தில் செவ்வாய் ${f.houseOf(MARS)}-ஆம் இடம் · துணையில் ${p.houseOf(MARS)}-ஆம் இடம் ("ஒரே மாதிரி" என்பது இருவருக்கும் தோஷம் உள்ளது என்று கொள்ளப்பட்டது)`);
  },
});
add({
  id: 'MAN_VIII', source: 'MANSAGARI', scope: 'NATIVE', page: MP('(viii)', 231),
  en: 'Mars in its own sign, where that sign is the 12th or 8th house',
  ta: 'செவ்வாய் சொந்த ராசியில், அந்த ராசி 12 அல்லது 8-ஆம் இடமாக இருக்கும்போது',
  test: (f) => yes(marsIn(f, [SIGN.Aries, SIGN.Scorpio]) && [12, 8].includes(h(f)), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'MAN_STRONG_BENEFIC', source: 'MANSAGARI', scope: 'NATIVE', page: 'printed p.795 (PDF 230), the paragraph before the list',
  en: 'Mars under the full aspect of an unblemished benefic, with the Ascendant, the 7th lord and the Moon strong',
  ta: 'குறையற்ற சுபரின் முழுப் பார்வை செவ்வாயின் மீது; லக்னம், 7-ஆம் அதிபதி, சந்திரன் பலமாக',
  test: () => NOT_COMPUTED('"குறையற்ற", "பலமான" என்பவற்றை நூல் வரையறுக்கவில்லை; எது சுபர் என்பதும் தெளிவில்லை'),
});

// ---- S.P. Bhagat (printed p.117, plus Characteristics on p.116) ----------
const BP = (n) => `Chapter 28, printed p.117 (PDF 118), cancellation item ${n}`;
add({
  id: 'BHA_2', source: 'BHAGAT', scope: 'NATIVE', page: BP(2),
  en: 'Mars in its own sign (Aries, Scorpio), exalted (Capricorn) or in a sign of his friends (Sun, Jupiter, Moon)',
  ta: 'செவ்வாய் சொந்த (மேஷம், விருச்சிகம்), உச்ச (மகரம்) அல்லது நண்பர்களின் (சூரியன், குரு, சந்திரன்) ராசியில்',
  test: (f) => yes(marsIn(f, [SIGN.Aries, SIGN.Scorpio, SIGN.Capricorn, SIGN.Leo, SIGN.Sagittarius, SIGN.Pisces, SIGN.Cancer]),
    RASI_TA[f.rasi.Mars] + (f.rasi.Mars === SIGN.Cancer ? ' (சந்திரனின் ராசி என்பதால் நூல் இதை நண்பர் வீடாகக் கொள்கிறது; இது செவ்வாயின் நீசமும் ஆகும்)' : '')),
});
add({
  id: 'BHA_3', source: 'BHAGAT', scope: 'NATIVE', page: BP(3),
  en: 'Mars in the 2nd house, in Gemini or Virgo', ta: 'செவ்வாய் 2-ஆம் இடத்தில், மிதுனம் அல்லது கன்னியில்',
  test: (f) => yes(h(f) === 2 && marsIn(f, [SIGN.Gemini, SIGN.Virgo]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'BHA_4', source: 'BHAGAT', scope: 'NATIVE', page: BP(4),
  en: 'Mars in the 4th house, in Aries or Scorpio', ta: 'செவ்வாய் 4-ஆம் இடத்தில், மேஷம் அல்லது விருச்சிகத்தில்',
  test: (f) => yes(h(f) === 4 && marsIn(f, [SIGN.Aries, SIGN.Scorpio]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'BHA_5', source: 'BHAGAT', scope: 'NATIVE', page: BP(5),
  en: 'Mars in the 7th house, in Cancer or Capricorn', ta: 'செவ்வாய் 7-ஆம் இடத்தில், கடகம் அல்லது மகரத்தில்',
  test: (f) => yes(h(f) === 7 && marsIn(f, [SIGN.Cancer, SIGN.Capricorn]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'BHA_6', source: 'BHAGAT', scope: 'NATIVE', page: BP(6),
  en: 'Mars in the 8th house, in Sagittarius or Pisces', ta: 'செவ்வாய் 8-ஆம் இடத்தில், தனுசு அல்லது மீனத்தில்',
  test: (f) => yes(h(f) === 8 && marsIn(f, [SIGN.Sagittarius, SIGN.Pisces]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'BHA_7', source: 'BHAGAT', scope: 'NATIVE', page: BP(7),
  en: 'Mars in the 12th house, in Taurus or Libra', ta: 'செவ்வாய் 12-ஆம் இடத்தில், ரிஷபம் அல்லது துலாத்தில்',
  test: (f) => yes(h(f) === 12 && marsIn(f, [SIGN.Taurus, SIGN.Libra]), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'BHA_8', source: 'BHAGAT', scope: 'NATIVE', page: BP(8),
  en: 'Cancer or Leo Ascendant (Mars is a yogakaraka, so no dosha wherever it stands)', ta: 'கடகம் அல்லது சிம்ம லக்னம் (செவ்வாய் யோககாரகன்; எங்கிருந்தாலும் தோஷம் இல்லை)',
  test: (f) => yes([SIGN.Cancer, SIGN.Leo].includes(f.lagna), `லக்னம் ${RASI_TA[f.lagna]}`),
});
add({
  id: 'BHA_9', source: 'BHAGAT', scope: 'NATIVE', page: BP(9),
  en: 'Aquarius Ascendant, with Mars in the 4th or 8th house', ta: 'கும்ப லக்னம், செவ்வாய் 4 அல்லது 8-ஆம் இடத்தில்',
  test: (f) => yes(f.lagna === SIGN.Aquarius && [4, 8].includes(h(f)), `லக்னம் ${RASI_TA[f.lagna]}, செவ்வாய் ${h(f)}-ஆம் இடம்`),
});
add({
  id: 'BHA_10', source: 'BHAGAT', scope: 'NATIVE', page: BP(10),
  en: 'Jupiter or Venus in the Ascendant', ta: 'குரு அல்லது சுக்கிரன் லக்னத்தில்',
  test: (f) => yes([f.houseOf('Jupiter'), f.houseOf('Venus')].includes(1), `குரு ${f.houseOf('Jupiter')}-ஆம், சுக்கிரன் ${f.houseOf('Venus')}-ஆம் இடம்`),
});
add({
  id: 'BHA_11', source: 'BHAGAT', scope: 'NATIVE', page: BP(11),
  en: 'Mars in conjunction with, or aspected by, Jupiter or the Moon', ta: 'செவ்வாய் குரு அல்லது சந்திரனுடன் சேர்க்கை அல்லது அவர்களால் பார்க்கப்படுதல்',
  test: (f) => {
    const parts = [];
    for (const g of ['Jupiter', 'Moon']) {
      if (f.sameSign(MARS, g)) parts.push(`${g} சேர்க்கை`);
      if (f.aspectsGraha(g, MARS)) parts.push(`${g} பார்வை`);
    }
    return yes(parts.length > 0, parts.join(', ') || 'இல்லை');
  },
});
add({
  id: 'BHA_12', source: 'BHAGAT', scope: 'NATIVE', page: BP(12),
  en: 'Mars in conjunction with, or aspected by, the Sun, Mercury, Saturn or Rahu', ta: 'செவ்வாய் சூரியன், புதன், சனி அல்லது ராகுவுடன் சேர்க்கை அல்லது பார்வை',
  test: (f) => {
    const parts = [];
    for (const g of ['Sun', 'Mercury', 'Saturn']) {
      if (f.sameSign(MARS, g)) parts.push(`${g} சேர்க்கை`);
      if (f.aspectsGraha(g, MARS)) parts.push(`${g} பார்வை`);
    }
    if (f.sameSign(MARS, 'Rahu')) parts.push('ராகு சேர்க்கை');
    if (parts.length) return MET(parts.join(', '));
    return NOT_COMPUTED('ராகுவின் பார்வைக்கு நூல் விதி தரவில்லை; சேர்க்கை எதுவும் இல்லை — பார்வை சரிபார்க்க முடியவில்லை');
  },
});
add({
  id: 'BHA_TUESDAY', source: 'BHAGAT', scope: 'NATIVE', page: 'Chapter 28, printed p.116 (PDF 117), Characteristics 4',
  en: 'A Manglik person born on a Tuesday: the effects are nullified', ta: 'செவ்வாய்க் கிழமையில் பிறந்த மாங்கலிக் நபருக்கு பாதிப்பு நீங்கும்',
  test: (f) => (f.weekday === null ? NOT_COMPUTED('பிறந்த கிழமை கணக்கிடப்படவில்லை')
    : yes(f.weekday === 2, `பிறந்த வாரம்: ${['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'][f.weekday]} (சூரிய உதயம் முதல்)`)),
});
add({
  id: 'BHA_BOTH', source: 'BHAGAT', scope: 'PARTNER', page: 'Chapter 28, printed p.116 (PDF 117), Characteristics 5',
  en: 'Marriage between two Manglik individuals cancels the negative effects', ta: 'இரு மாங்கலிக் நபர்களின் திருமணம் தீய பலன்களை நீக்கும்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const mine = anyReadingFromAnyReference(f, 'BHAGAT');
    const theirs = anyReadingFromAnyReference(p, 'BHAGAT');
    return yes(mine && theirs, `இந்த ஜாதகம்: ${mine ? 'தோஷம்' : 'இல்லை'} · துணை: ${theirs ? 'தோஷம்' : 'இல்லை'} (பகத் முறைப்படி)`);
  },
});

// ---- Vishnu Bhaskar, native's chart (printed pp.99-100) -------------------
const VP = (page) => `Chapter 9 §VII.5, printed p.${page} (PDF page ${page - 86} of volume-1 part 02), "By planetary position in Native's chart"`;
add({
  id: 'VB_A', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in Aries Lagna; Sagittarius in 12H; Scorpio in 4H; Capricorn in 7H; or Cancer in 8H',
  ta: 'மேஷ லக்னத்தில் செவ்வாய்; 12-ல் தனுசு; 4-ல் விருச்சிகம்; 7-ல் மகரம்; அல்லது 8-ல் கடகம்',
  test: (f) => yes(
    (h(f) === 1 && marsIn(f, [SIGN.Aries])) || (h(f) === 12 && marsIn(f, [SIGN.Sagittarius]))
    || (h(f) === 4 && marsIn(f, [SIGN.Scorpio])) || (h(f) === 7 && marsIn(f, [SIGN.Capricorn]))
    || (h(f) === 8 && marsIn(f, [SIGN.Cancer])), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'VB_B', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in 12H in Venus\'s or Mercury\'s sign; 2H in Mercury\'s or Mars\'s; 4H in Mars\'s or Venus\'s; 7H exalted or debilitated; 8H in Jupiter\'s sign',
  ta: 'செவ்வாய் 12-ல் சுக்கிர/புத ராசியில்; 2-ல் புத/செவ் ராசியில்; 4-ல் செவ்/சுக்கிர ராசியில்; 7-ல் உச்சம்/நீசம்; 8-ல் குரு ராசியில்',
  test: (f) => yes(
    (h(f) === 12 && marsIn(f, [SIGN.Taurus, SIGN.Libra, SIGN.Gemini, SIGN.Virgo]))
    || (h(f) === 2 && marsIn(f, [SIGN.Gemini, SIGN.Virgo, SIGN.Aries, SIGN.Scorpio]))
    || (h(f) === 4 && marsIn(f, [SIGN.Aries, SIGN.Scorpio, SIGN.Taurus, SIGN.Libra]))
    || (h(f) === 7 && marsIn(f, [SIGN.Capricorn, SIGN.Cancer]))
    || (h(f) === 8 && marsIn(f, [SIGN.Sagittarius, SIGN.Pisces])), `${h(f)}-ஆம் இடம், ${RASI_TA[f.rasi.Mars]}`),
});
add({
  id: 'VB_C', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars conjunct a strong Moon, Mercury, Venus or Rahu', ta: 'செவ்வாய் பலமான சந்திரன், புதன், சுக்கிரன் அல்லது ராகுவுடன்',
  test: (f) => {
    const who = ['Moon', 'Mercury', 'Venus', 'Rahu'].filter((g) => f.sameSign(MARS, g));
    return who.length ? JUDGEMENT(`சேர்க்கை: ${who.join(', ')}; "பலமான" என்பதை நூல் வரையறுக்கவில்லை`) : NOT_MET('சேர்க்கை இல்லை');
  },
});
add({
  id: 'VB_D', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in the 5th or 11th sign', ta: 'செவ்வாய் 5 அல்லது 11-ஆம் ராசியில் (சிம்மம், கும்பம்)',
  test: (f) => yes(marsIn(f, [SIGN.Leo, SIGN.Aquarius]), RASI_TA[f.rasi.Mars]),
});
add({
  id: 'VB_E', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in Lagna, when Lagna is the 4th or 5th sign', ta: 'செவ்வாய் லக்னத்தில், லக்னம் கடகம் அல்லது சிம்மம்',
  test: (f) => yes(h(f) === 1 && [SIGN.Cancer, SIGN.Leo].includes(f.lagna), `${h(f)}-ஆம் இடம், லக்னம் ${RASI_TA[f.lagna]}`),
});
add({
  id: 'VB_F', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in the sign of Mars, Saturn, the Sun or Jupiter', ta: 'செவ்வாய் செவ்வாய், சனி, சூரியன் அல்லது குருவின் ராசியில்',
  test: (f) => yes(marsIn(f, [SIGN.Aries, SIGN.Scorpio, SIGN.Capricorn, SIGN.Aquarius, SIGN.Leo, SIGN.Sagittarius, SIGN.Pisces]), RASI_TA[f.rasi.Mars]),
});
add({
  id: 'VB_G', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Jupiter in a kendra or trikona (for females), or a strong Moon', ta: 'குரு கேந்திரம்/திரிகோணத்தில் (பெண்ணுக்கு), அல்லது பலமான சந்திரன்',
  test: (f) => {
    if (f.gender !== 'female') return NOT_COMPUTED(f.gender === 'male' ? 'இந்த விதி பெண்ணுக்கானது' : 'பாலினம் தெரியவில்லை');
    return yes([...KENDRA, 5, 9].includes(f.houseOf('Jupiter')), `குரு ${f.houseOf('Jupiter')}-ஆம் இடம் ("அல்லது பலமான சந்திரன்" சோதிக்கப்படவில்லை)`);
  },
});
add({
  id: 'VB_H', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Aspect of Jupiter on Mars', ta: 'செவ்வாயின் மீது குருவின் பார்வை',
  test: (f) => yes(f.aspectsGraha('Jupiter', MARS), 'குருவின் பார்வை'),
});
add({
  id: 'VB_I', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars exchanges signs with Saturn or Jupiter', ta: 'செவ்வாய் சனி அல்லது குருவுடன் ராசி பரிவர்த்தனை',
  test: (f) => {
    const lord = (s) => RASI_LORD[s];
    const swap = (g) => lord(f.rasi[MARS]) === g && lord(f.rasi[g]) === MARS;
    return yes(swap('Saturn') || swap('Jupiter'), swap('Saturn') ? 'சனியுடன்' : swap('Jupiter') ? 'குருவுடன்' : 'இல்லை');
  },
});
add({
  id: 'VB_J', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in a movable sign, or Mars or Saturn retrograde', ta: 'செவ்வாய் சர ராசியில், அல்லது செவ்வாய்/சனி வக்கிரம்',
  test: (f) => {
    const parts = [];
    if (MOVABLE.includes(f.rasi.Mars)) parts.push('சர ராசி');
    if (f.retrograde.Mars) parts.push('செவ்வாய் வக்கிரம்');
    if (f.retrograde.Saturn) parts.push('சனி வக்கிரம்');
    return yes(parts.length > 0, parts.join(', ') || 'இல்லை');
  },
});
add({
  id: 'VB_K', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Venus in the 2nd and a strong Moon in a kendra', ta: 'சுக்கிரன் 2-ஆம் இடத்தில், பலமான சந்திரன் கேந்திரத்தில்',
  test: (f) => {
    const geo = f.houseOf('Venus') === 2 && KENDRA.includes(f.houseOf('Moon'));
    return geo ? JUDGEMENT('சுக்கிரன் 2-ல்; சந்திரன் கேந்திரத்தில்; "பலமான" என்பது வரையறுக்கப்படவில்லை') : NOT_MET(`சுக்கிரன் ${f.houseOf('Venus')}-ஆம், சந்திரன் ${f.houseOf('Moon')}-ஆம் இடம்`);
  },
});
add({
  id: 'VB_L', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Mars in Ketu\'s nakshatra (Ashwini, Magha, Mula)', ta: 'செவ்வாய் கேதுவின் நட்சத்திரத்தில் (அசுவினி, மகம், மூலம்)',
  test: (f) => (f.nakshatra.Mars === undefined ? NOT_COMPUTED('செவ்வாயின் நட்சத்திரம் கொடுக்கப்படவில்லை')
    : yes(KETU_STARS.includes(f.nakshatra.Mars), `நட்சத்திர எண் ${f.nakshatra.Mars + 1}`)),
});
add({
  id: 'VB_M', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(99),
  en: 'Retrograde Mars or Saturn in the relevant bhava', ta: 'வக்கிர செவ்வாய் அல்லது சனி தொடர்புடைய பாவத்தில்',
  test: (f) => {
    const relevant = [12, 1, 2, 4, 7, 8];
    const parts = [];
    if (f.retrograde.Mars && relevant.includes(h(f))) parts.push('வக்கிர செவ்வாய்');
    if (f.retrograde.Saturn && relevant.includes(f.houseOf('Saturn'))) parts.push('வக்கிர சனி');
    return yes(parts.length > 0, parts.join(', ') || 'இல்லை');
  },
});
add({
  id: 'VB_N', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(100),
  en: 'Strong 7th lord and Venus in the 7th, or aspecting it', ta: 'பலமான 7-ஆம் அதிபதியும் சுக்கிரனும் 7-ல் அல்லது அதைப் பார்க்கிறார்கள்',
  test: (f) => {
    const seventh = (f.lagna + 6) % 12;
    const venus = f.houseOf('Venus') === 7 || f.aspectsSign('Venus', seventh);
    return venus ? JUDGEMENT('சுக்கிரன் 7-ஆம் இடத்தில்/பார்வையில்; 7-ஆம் அதிபதியின் பலம் மதிப்பிடப்படவில்லை') : NOT_MET('சுக்கிரன் 7-ஆம் இடத்துடன் தொடர்பு இல்லை');
  },
});
add({
  id: 'VB_O', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(100),
  en: 'Mars in Venus\'s sign and a strong 7th lord in a kendra or trikona', ta: 'செவ்வாய் சுக்கிர ராசியில்; பலமான 7-ஆம் அதிபதி கேந்திரம்/திரிகோணத்தில்',
  test: (f) => {
    if (!marsIn(f, [SIGN.Taurus, SIGN.Libra])) return NOT_MET(`செவ்வாய் ${RASI_TA[f.rasi.Mars]}`);
    const lord7 = f.lordOfHouse(7);
    const ok = [...KENDRA, ...TRIKONA].includes(f.houseOf(lord7));
    return ok ? JUDGEMENT(`7-ஆம் அதிபதி ${lord7} ${f.houseOf(lord7)}-ஆம் இடத்தில்; பலம் மதிப்பிடப்படவில்லை`) : NOT_MET(`7-ஆம் அதிபதி ${lord7} ${f.houseOf(lord7)}-ஆம் இடத்தில்`);
  },
});
add({
  id: 'VB_P', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(100),
  en: 'The dispositor of Mars in a kendra or trikona from Lagna or the Moon, or Mars a yogakaraka', ta: 'செவ்வாய் நிற்கும் ராசி அதிபதி லக்னம்/சந்திரனிலிருந்து கேந்திர, திரிகோணத்தில்; அல்லது செவ்வாய் யோககாரகன்',
  test: (f) => {
    const disp = RASI_LORD[f.rasi.Mars];
    const fromLagna = [...KENDRA, ...TRIKONA].includes(f.houseFrom('LAGNA', disp));
    const fromMoon = [...KENDRA, ...TRIKONA].includes(f.houseFrom('MOON', disp));
    if (fromLagna || fromMoon) return MET(`அதிபதி ${disp}: லக்னத்திலிருந்து ${f.houseFrom('LAGNA', disp)}-ஆம், சந்திரனிலிருந்து ${f.houseFrom('MOON', disp)}-ஆம் இடம் ("யோககாரகன்" பகுதி சோதிக்கப்படவில்லை)`);
    return NOT_MET(`அதிபதி ${disp}: லக்னத்திலிருந்து ${f.houseFrom('LAGNA', disp)}-ஆம், சந்திரனிலிருந்து ${f.houseFrom('MOON', disp)}-ஆம் இடம்`);
  },
});
add({
  id: 'VB_Q', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(100),
  en: 'Lords of the malefics in their own houses, provided the 7th lord and Venus are not in the 6th, 8th or 12th', ta: 'பாப கிரகங்களின் அதிபதிகள் சொந்த வீட்டில், 7-ஆம் அதிபதியும் சுக்கிரனும் 6/8/12-ல் இல்லாதபோது',
  test: () => NOT_COMPUTED('"பாப கிரகங்களின் அதிபதிகள் சொந்த வீட்டில்" என்பதன் பொருள் தெளிவாக இல்லை'),
});
add({
  id: 'VB_R', source: 'VISHNU_BHASKAR', scope: 'NATIVE', page: VP(100),
  en: 'Strong Venus and 7th lord aspecting or conjunct the 7th; or in good houses with the 7th aspected by a benefic', ta: 'பலமான சுக்கிரனும் 7-ஆம் அதிபதியும் 7-ஆம் இடத்தைப் பார்க்கிறார்கள்/சேர்கிறார்கள்',
  test: () => NOT_COMPUTED('"பலமான" மற்றும் "நல்ல இடம்" என்பவை நூலில் வரையறுக்கப்படவில்லை'),
});

// ---- Vishnu Bhaskar, partner's chart (printed p.100) ----------------------
const VPP = (what) => `Chapter 9 §VII.9, printed p.100 (PDF page 14 of volume-1 part 02), "Kuja Dosha mitigation: by planetary position in partner's chart" — ${what}`;
const hasDoshaFromLagna = (f) => [12, 1, 2, 4, 7, 8].includes(f.houseOf(MARS));
add({
  id: 'VBP_1', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('Mars in Lagna / 7H, or 2H / 8H'),
  en: 'Mars in Lagna in one chart and in the 7th in the other; or in the 2nd of one and the 8th of the other',
  ta: 'ஒருவருக்கு செவ்வாய் லக்னத்தில், மற்றவருக்கு 7-ல்; அல்லது ஒருவருக்கு 2-ல், மற்றவருக்கு 8-ல்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const a = f.houseOf(MARS); const b = p.houseOf(MARS);
    const hit = (a === 1 && b === 7) || (a === 7 && b === 1) || (a === 2 && b === 8) || (a === 8 && b === 2);
    return yes(hit, `இந்த ஜாதகம் ${a}-ஆம் இடம் · துணை ${b}-ஆம் இடம்`);
  },
});
add({
  id: 'VBP_2', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('Mars in 7H/8H, Sat+Rah or Sat+Sun in the partner\'s 7H/8H'),
  en: 'Mars in the 7th or 8th, with Saturn+Rahu or Saturn+Sun together in the partner\'s 7th or 8th',
  ta: 'செவ்வாய் 7 அல்லது 8-ல்; துணைக்கு சனி+ராகு அல்லது சனி+சூரியன் சேர்ந்து 7 அல்லது 8-ல்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    if (![7, 8].includes(f.houseOf(MARS))) return NOT_MET(`செவ்வாய் ${f.houseOf(MARS)}-ஆம் இடம்`);
    const sat = p.houseOf('Saturn');
    const together = [7, 8].includes(sat) && (p.houseOf('Rahu') === sat || p.houseOf('Sun') === sat);
    return yes(together, `துணைக்கு சனி ${sat}-ஆம் இடம்`);
  },
});
add({
  id: 'VBP_3', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('equal number of malefics'),
  en: 'An equal number of malefics (from Lagna or the Moon) in the 12th, Lagna, 2nd or 4th in both partners',
  ta: 'இருவருக்கும் லக்னம் அல்லது சந்திரனிலிருந்து 12, 1, 2, 4-ல் சம எண்ணிக்கையிலான பாப கிரகங்கள்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const parts = [];
    for (const ref of ['LAGNA', 'MOON']) {
      const a = f.maleficsIn(ref, [12, 1, 2, 4]).length;
      const b = p.maleficsIn(ref, [12, 1, 2, 4]).length;
      if (a === b && a > 0) parts.push(`${ref === 'LAGNA' ? 'லக்னம்' : 'சந்திரன்'}: ${a} = ${b}`);
    }
    return yes(parts.length > 0, parts.join(' · ') || 'சம எண்ணிக்கை இல்லை (அல்லது இருவருக்கும் பூஜ்யம்)');
  },
});
add({
  id: 'VBP_4', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('Jyeshtha or Moola'),
  en: 'A 50-80% dosha in a person not born in Jyeshtha or Moola is cancelled by a non-Manglik partner born in Jyeshtha or Moola',
  ta: '50–80% தோஷமுள்ள, கேட்டை/மூலத்தில் பிறக்காத நபருக்கு: கேட்டை அல்லது மூலத்தில் பிறந்த மாங்கலிக் அல்லாத துணை',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    if (f.nakshatra.Moon === undefined || p.nakshatra.Moon === undefined) return NOT_COMPUTED('சந்திரனின் நட்சத்திரம் தேவை');
    const pct = T.INTENSITY_PERCENT.percent[f.houseOf(MARS)];
    const mineOk = pct >= 50 && pct <= 80 && ![JYESHTHA, MOOLA].includes(f.nakshatra.Moon);
    const theirsOk = !hasDoshaFromLagna(p) && [JYESHTHA, MOOLA].includes(p.nakshatra.Moon);
    return yes(mineOk && theirsOk, `இந்த ஜாதகம்: ${pct ?? 0}% · துணை: ${hasDoshaFromLagna(p) ? 'தோஷம் உண்டு' : 'தோஷம் இல்லை'}`);
  },
});
/**
 * The precondition shared by items 5A-5G: "one malefic in 12H/Lagna/2H or 4H in
 * one's chart and other is non-mangali". The book does not say what makes the
 * partner non-mangali. Item 5G has the non-mangali partner holding a malefic in
 * the same bhava, which is contradictory if non-mangali meant "no malefic in
 * those houses at all"; so non-mangali is read here as "Mars is not in those
 * houses", leaving the partner free to hold other malefics. A reading, stated.
 */
const oneSided = (f, p) => {
  const here = f.maleficsIn('LAGNA', [12, 1, 2, 4]);
  const partnerNonMangali = ![12, 1, 2, 4].includes(p.houseOf(MARS));
  return { here, ok: here.length === 1 && partnerNonMangali };
};
const VPC = (what) => VPP(`one malefic in 12H/Lagna/2H/4H against a non-Manglik, cancelled if: ${what}`);
add({
  id: 'VBP_5A', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('Lagna or Moon sign same or 1/7'),
  en: 'One malefic in 12/1/2/4 here and none in the partner: Lagna or Moon sign of either the same, or 1st/7th to each other',
  ta: 'ஒருவருக்கு 12/1/2/4-ல் ஒரு பாப கிரகம், மற்றவருக்கு இல்லை: இருவரின் லக்னம் அல்லது சந்திர ராசி ஒன்றே அல்லது 1/7',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const o = oneSided(f, p);
    if (!o.ok) return NOT_MET('இந்த நிபந்தனைக்கு முன் தேவை: இங்கு சரியாக ஒரு பாப கிரகம், துணைக்கு இல்லை');
    const rel = (a, b) => { const d = (a - b + 12) % 12; return d === 0 || d === 6; };
    const lag = rel(f.lagna, p.lagna); const moon = rel(f.rasi.Moon, p.rasi.Moon);
    return yes(lag || moon, `லக்னம் ${lag ? 'ஒன்று/7' : 'இல்லை'} · சந்திர ராசி ${moon ? 'ஒன்று/7' : 'இல்லை'}`);
  },
});
add({
  id: 'VBP_5B', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('Moon sign same, different nakshatra'),
  en: '… the Moon sign is the same but the nakshatras differ', ta: '… சந்திர ராசி ஒன்று, நட்சத்திரம் வேறு',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    if (!oneSided(f, p).ok) return NOT_MET('முன் நிபந்தனை இல்லை');
    if (f.nakshatra.Moon === undefined || p.nakshatra.Moon === undefined) return NOT_COMPUTED('நட்சத்திரம் தேவை');
    return yes(f.rasi.Moon === p.rasi.Moon && f.nakshatra.Moon !== p.nakshatra.Moon, 'சந்திர ராசி/நட்சத்திர ஒப்பீடு');
  },
});
add({
  id: 'VBP_5C', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('Ashtakoota >= 24'),
  en: '… the Ashtakoota (nakshatra compatibility) points are 24 or more', ta: '… அஷ்டகூட (நட்சத்திரப் பொருத்த) புள்ளிகள் 24 அல்லது அதிகம்',
  test: (f, p) => (!p ? NEEDS_PARTNER() : NOT_COMPUTED('அஷ்டகூட மதிப்பெண் இந்த மென்பொருளில் இல்லை (பத்துப் பொருத்தம் வேறு அமைப்பு; போலியான அஷ்டகூடம் நீக்கப்பட்டது)')),
});
add({
  id: 'VBP_5D', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('same nakshatra, different signs'),
  en: '… the nakshatra is the same but the signs differ', ta: '… நட்சத்திரம் ஒன்று, ராசி வேறு',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    if (!oneSided(f, p).ok) return NOT_MET('முன் நிபந்தனை இல்லை');
    if (f.nakshatra.Moon === undefined || p.nakshatra.Moon === undefined) return NOT_COMPUTED('நட்சத்திரம் தேவை');
    return yes(f.nakshatra.Moon === p.nakshatra.Moon && f.rasi.Moon !== p.rasi.Moon, 'நட்சத்திரம்/ராசி ஒப்பீடு');
  },
});
add({
  id: 'VBP_5E', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('only malefics in kendra and trikona of the other'),
  en: '… only malefics in the kendras and trikonas of the other', ta: '… மற்றவரின் கேந்திர, திரிகோணங்களில் பாப கிரகங்கள் மட்டும்',
  test: (f, p) => (!p ? NEEDS_PARTNER() : NOT_COMPUTED('நூலின் வாசகம் ("only malefics in Kendra and Tikona of the other") யாருடைய ஜாதகம், எந்த இடம் என்று தெளிவாக இல்லை')),
});
add({
  id: 'VBP_5F', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('Deva gana Mangali, Rakshasa gana non-Mangali'),
  en: '… the Manglik is of Deva gana and the non-Manglik of Rakshasa gana', ta: '… மாங்கலிக் தேவ கணம், மற்றவர் ராட்சத கணம்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const o = oneSided(f, p);
    if (!o.ok) return NOT_MET('முன் நிபந்தனை இல்லை');
    if (f.nakshatra.Moon === undefined || p.nakshatra.Moon === undefined) return NOT_COMPUTED('நட்சத்திரம் தேவை');
    const a = GANA_OF[f.nakshatra.Moon]; const b = GANA_OF[p.nakshatra.Moon];
    return yes(a === 'deva' && b === 'rakshasa', `இந்த ஜாதகம்: ${a} · துணை: ${b} (கண அட்டவணை: காலப்பிரகாசிகை)`);
  },
});
add({
  id: 'VBP_5G', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPC('non-Manglik has a malefic in a similar bhava'),
  en: '… the non-Manglik has a malefic in the same bhava', ta: '… மாங்கலிக் அல்லாதவருக்கும் அதே பாவத்தில் ஒரு பாப கிரகம்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const o = oneSided(f, p);
    if (!o.ok) return NOT_MET('முன் நிபந்தனை இல்லை');
    const mine = o.here[0];
    const house = f.houseOf(mine);
    const theirs = p.maleficsIn('LAGNA', [house], MALEFICS.filter((g) => g !== MARS));
    return yes(theirs.length > 0, `இங்கு ${mine} ${house}-ஆம் இடம்; துணை: ${theirs.join(', ') || 'அந்த இடத்தில் பாப கிரகம் இல்லை'} (மாங்கலிக் அல்லாத = செவ்வாய் அந்த இடங்களில் இல்லை என்று வாசிக்கப்பட்டது)`);
  },
});
add({
  id: 'VBP_NOT_78', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('7H and 8H do not cancel'),
  en: 'Mars in the 7th of one and in the 8th of the other does NOT cancel; the one with Mars in the 8th is in danger',
  ta: 'ஒருவருக்கு செவ்வாய் 7-ல், மற்றவருக்கு 8-ல் இருந்தால் தோஷம் நீங்காது; 8-ல் உள்ளவருக்கு ஆபத்து',
  negative: true,
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const a = f.houseOf(MARS); const b = p.houseOf(MARS);
    return yes((a === 7 && b === 8) || (a === 8 && b === 7), `${a}-ஆம் இடம் · ${b}-ஆம் இடம்`);
  },
});
add({
  id: 'VBP_NOT_SAME', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: VPP('same house does not cancel'),
  en: 'Mars in the same house in both does NOT cancel; Mars in the 8th of both affects sex life and longevity of both',
  ta: 'இருவருக்கும் செவ்வாய் ஒரே இடத்தில் இருந்தால் நீங்காது; இருவருக்கும் 8-ல் என்றால் இருவரின் ஆயுளும் தாம்பத்தியமும் பாதிக்கும்',
  negative: true,
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const a = f.houseOf(MARS); const b = p.houseOf(MARS);
    return yes(a === b && [12, 1, 2, 4, 7, 8].includes(a), `${a}-ஆம் இடம் · ${b}-ஆம் இடம்`);
  },
});
add({
  id: 'VBP_MS', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: 'Chapter 9 §VII.10, printed p.100 (PDF page 14 of volume-1 part 02), Mars and Saturn',
  en: 'Mars and Saturn conjunct, or 1/7 to each other, is cancelled if the partner has the same combination',
  ta: 'செவ்வாய்-சனி சேர்க்கை அல்லது 1/7: துணைக்கும் அதே அமைப்பு இருந்தால் நீங்கும்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const combo = (x) => { const d = (x.rasi.Mars - x.rasi.Saturn + 12) % 12; return d === 0 || d === 6; };
    return yes(combo(f) && combo(p), `இந்த ஜாதகம்: ${combo(f) ? 'உண்டு' : 'இல்லை'} · துணை: ${combo(p) ? 'உண்டு' : 'இல்லை'}`);
  },
});
add({
  id: 'VBP_RM', source: 'VISHNU_BHASKAR', scope: 'PARTNER', page: 'Chapter 9 §VII.10, printed p.100 (PDF page 14 of volume-1 part 02), Rahu + Mars',
  en: 'Rahu+Mars in the 7th/8th is cancelled by Rahu+Mars in the partner\'s Lagna/2nd',
  ta: 'ராகு+செவ்வாய் 7/8-ல்: துணைக்கு ராகு+செவ்வாய் லக்னம்/2-ல் இருந்தால் நீங்கும்',
  test: (f, p) => {
    if (!p) return NEEDS_PARTNER();
    const mine = f.sameSign(MARS, 'Rahu') && [7, 8].includes(f.houseOf(MARS));
    const theirs = p.sameSign(MARS, 'Rahu') && [1, 2].includes(p.houseOf(MARS));
    return yes(mine && theirs, `இந்த ஜாதகம்: ${mine ? 'உண்டு' : 'இல்லை'} · துணை: ${theirs ? 'உண்டு' : 'இல்லை'}`);
  },
});

const CONDITIONS = Object.freeze(C);

function anyReadingFromAnyReference(f, readingId) {
  const r = T.READINGS[readingId];
  return r.references.some((ref) => r.houses.includes(f.houseFrom(ref, MARS)));
}

// ----------------------------------------------------------------- analysis --

function sourceOf(key) {
  const s = T.SOURCES[key];
  return { key, title: s.title, author: s.author };
}

/** Evaluates every condition of the requested scope against a chart (and partner). */
function evaluateConditions(f, partner = null) {
  return CONDITIONS.map((c) => {
    let r;
    try {
      r = c.test(f, partner);
    } catch (e) {
      r = NOT_COMPUTED(`கணக்கிட முடியவில்லை: ${e.message}`);
    }
    return {
      id: c.id, source: sourceOf(c.source), scope: c.scope, negative: Boolean(c.negative),
      page: c.page, en: c.en, ta: c.ta, status: r.status, detail: r.detail ?? null,
    };
  });
}

/** Counts per source, per status — never a single verdict. */
function summarise(evals) {
  // Keys in the owner's book order, so every per-book list on the page follows it.
  const out = {};
  for (const { key } of T.BOOK_RANK.order) if (evals.some((e) => e.source.key === key)) out[key] = undefined;
  for (const e of evals) {
    const k = e.source.key;
    out[k] ??= { MET: 0, NOT_MET: 0, JUDGEMENT: 0, NOT_COMPUTED: 0, NEEDS_PARTNER: 0, negativeMet: 0 };
    if (e.negative && e.status === 'MET') out[k].negativeMet += 1;
    else out[k][e.status] += 1;
  }
  return out;
}

function resultsFor(f) {
  const seen = new Set();
  const out = [];
  for (const ref of ['LAGNA', 'MOON', 'VENUS']) {
    const house = f.houseFrom(ref, MARS);
    const r = T.RESULTS_BY_HOUSE[house];
    if (r && !seen.has(`${ref}${house}`)) {
      seen.add(`${ref}${house}`);
      out.push({ reference: ref, house, percent: r.percent, textTa: r.textTa, page: r.page });
    }
  }
  return out;
}

/** One chart: formation under every reading, intensity, results, cancellations. */
function analyseChart(f, partner = null) {
  const evals = evaluateConditions(f, partner);
  return {
    marsSign: f.rasi.Mars, marsSignTa: RASI_TA[f.rasi.Mars],
    lagna: f.lagna, lagnaTa: RASI_TA[f.lagna],
    formation: considerFormation(f),
    intensity: considerIntensity(f),
    results: resultsFor(f),
    tamilNotFound: T.TAMIL_NOT_FOUND,
    conditions: evals,
    summary: summarise(evals),
    books: T.BOOK_RANK.order.map((b, i) => ({ ...b, rank: i + 1, title: T.SOURCES[b.key].title })),
    bookRankMeasureTa: T.BOOK_RANK.measureTa,
  };
}

/**
 * Two charts. Vishnu Bhaskar's unit comparison (p.99 §4): similar units are
 * excellent, the male's 25% higher is satisfactory, the female's higher is not
 * good. "Similar" is not defined in numbers, so a male above the female by less
 * than 25% is reported as such and left to judgement.
 */
function analysePair(girl, boy) {
  const g = analyseChart(girl, boy);
  const b = analyseChart(boy, girl);
  const gu = g.intensity.perReference.find((p) => p.reference === 'LAGNA');
  const bu = b.intensity.perReference.find((p) => p.reference === 'LAGNA');
  const gUnits = gu.totalUnits; const bUnits = bu.totalUnits;
  let verdict;
  if (gUnits === 0 && bUnits === 0) verdict = { code: 'BOTH_ZERO', textTa: 'இருவருக்கும் லக்னத்திலிருந்து அலகுகள் இல்லை' };
  else if (gUnits > bUnits) verdict = { code: 'FEMALE_HIGHER', textTa: 'பெண்ணின் அலகு ஆணின் அலகை விட அதிகம் — நூல்: பொருத்தத்துக்கு நன்றல்ல' };
  else if (bUnits >= gUnits * 1.25) verdict = { code: 'MALE_25_PERCENT_MORE', textTa: 'ஆணின் அலகு 25% அல்லது அதிகம் — நூல்: திருப்தியான பொருத்தம்' };
  else if (bUnits === gUnits) verdict = { code: 'EQUAL', textTa: 'அலகுகள் சமம் — நூல்: சிறந்த பொருத்தம்' };
  else verdict = { code: 'BETWEEN', textTa: 'ஆணின் அலகு அதிகம், ஆனால் 25%-க்குக் குறைவு; "ஏறக்குறைய சமம்" என்பதற்கு நூல் எண் வரையறை தரவில்லை — உங்கள் தீர்ப்பு' };
  return {
    girl: g, boy: b,
    units: { girl: gUnits, boy: bUnits, marsGirl: gu.marsUnits, marsBoy: bu.marsUnits, verdict,
      sourcePage: T.UNITS.source.pageLocus, notStated: T.UNITS.notStated, notStatedTa: T.UNITS.notStatedTa },
    guidance: [T.GUIDANCE.bothManglikOk, T.GUIDANCE.delayYears].map((x) => ({
      textTa: x.textTa, sources: x.sources.map((s) => ({ title: s.title, page: s.pageLocus })),
    })),
  };
}

// ------------------------------------------------------------ chart adapter --

const { planetLongitude, sunriseJulianDay } = require('../ephemeris/siderealPositions');

/** Is the planet moving backwards at this instant? (longitude a day apart) */
function isRetrograde(julianDay, planet, ayanamsha) {
  const before = planetLongitude(julianDay - 0.5, planet, ayanamsha);
  const after = planetLongitude(julianDay + 0.5, planet, ayanamsha);
  return ((after - before + 540) % 360) - 180 < 0;
}

/**
 * The Vedic weekday of birth: the day runs from one sunrise to the next, so a
 * birth before sunrise belongs to the previous civil day. 0 = Sunday.
 */
function vedicWeekday({ julianDay, latitude, longitude, utcOffsetMinutes }) {
  const midnight = Math.floor(julianDay - 0.5) + 0.5;
  let sunrise = null;
  for (const k of [-1, 0]) {
    const s = sunriseJulianDay(midnight + k, latitude, longitude);
    if (s <= julianDay && (sunrise === null || s > sunrise)) sunrise = s;
  }
  if (sunrise === null) return null;
  const localDay = Math.floor(sunrise + 0.5 + (utcOffsetMinutes ?? 0) / 1440);
  return (localDay + 1) % 7;
}

/**
 * Facts from a computed Parashari chart. `input` is the birth input the chart
 * was cast from (for the place and the clock); `gender` is optional.
 */
function factsFromChart(chart, { input, gender = null }) {
  const rasi = {};
  for (const g of GRAHAS) rasi[g] = chart.grahas[g].rasiIndex;
  const star = (g) => Math.floor(chart.grahas[g].longitude / (360 / 27)) % 27;
  const retrograde = {};
  for (const g of ['Mars', 'Saturn', 'Jupiter', 'Venus', 'Mercury']) {
    retrograde[g] = isRetrograde(chart.julianDay, g, chart.ayanamsha);
  }
  return buildFacts({
    lagna: chart.lagna.rasiIndex, rasi,
    nakshatra: { Mars: star('Mars'), Moon: star('Moon') },
    retrograde, gender,
    weekday: input ? vedicWeekday({
      julianDay: chart.julianDay, latitude: input.latitude, longitude: input.longitude,
      utcOffsetMinutes: input.utcOffsetMinutes,
    }) : null,
  });
}

module.exports = {
  factsFromChart, isRetrograde, vedicWeekday,
  buildFacts, dignityOf, considerFormation, considerIntensity, evaluateConditions,
  analyseChart, analysePair, summarise, CONDITIONS, GRAHAS, MALEFICS, SIGN, RASI_TA,
  READINGS: T.READINGS, REMEDIES: T.REMEDIES, GUIDANCE: T.GUIDANCE,
};
