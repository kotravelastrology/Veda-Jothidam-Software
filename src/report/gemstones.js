/**
 * Gemstones — what each book says to wear for a given chart.
 *
 * PL9 has gem worksheets (Gem Recommendations, Lucky Stone, Gem Stone #1/#2).
 * The books held give three different methods and disagree about particular
 * gems for the same Ascendant, so this does not recommend a gem. It shows each
 * book's answer for the chart's Ascendant (and, where the book says so, Moon
 * sign), each with its page, lays them side by side, and says where they agree.
 *
 * Nothing here is a prediction, and no benefit is claimed for wearing a gem.
 *
 * What is computed is only what the books' own rules need: the houses each
 * planet rules from the Ascendant (and from the Moon sign), whether it is
 * exalted or debilitated when the chart is given, and a lookup of each book's
 * table. The books' qualifications — "if the planet is strong", "after
 * considering all aspects" — are shown as the book's text, not decided.
 */

const { RASI_LORD } = require('../chart/karaka');
const { EXALTATION, DEBILITATION, OWN_SIGNS } = require('../chart/shadbala');
const { UnsupportedInputError } = require('../contracts/chartContext');
const T = require('./gemstoneTables');

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const GEM_PLANET = {
  Ruby: 'Sun', Pearl: 'Moon', 'White pearl': 'Moon', 'Red coral': 'Mars', Coral: 'Mars', Emerald: 'Mercury',
  'Yellow sapphire': 'Jupiter', Diamond: 'Venus', 'Blue sapphire': 'Saturn',
};
const DUSTHANA = [6, 8, 12];

const assertSign = (n, what) => {
  if (!Number.isInteger(n) || n < 0 || n > 11) throw new UnsupportedInputError(`${what} must be an integer 0-11`, what);
};

/** The houses each planet rules, counted from `pointSign`. Rahu and Ketu rule none. */
function lordships(pointSign) {
  assertSign(pointSign, 'pointSign');
  const out = {};
  for (const p of T.PLANETS) out[p] = [];
  for (let house = 1; house <= 12; house += 1) out[RASI_LORD[(pointSign + house - 1) % 12]].push(house);
  return out;
}

/** The Tamil sentence for one of Tilak Raj's entries, built from its fields so it cannot drift from them. */
function describeEntry(e, planet) {
  const pTa = T.PLANET_TA[planet];
  const parts = [T.VERDICTS[e.v].ta];
  const when = [];
  if (e.dasha) when.push(`${pTa} தசையில்`);
  if (e.houses) when.push(`${pTa} ${e.houses.join(', ')}-ஆம் இடத்தில் இருந்தால்`);
  if (e.own && e.exalted) when.push('சொந்த ராசி அல்லது உச்சத்தில்');
  else if (e.own) when.push('சொந்த ராசியில் இருந்தால்');
  if (when.length) parts.push(when.join('; '));
  if (e.with?.length) parts.push(`${e.with.map((g) => T.PLANET_GEMS[g].ta).join(' + ')} உடன் சேர்த்து`);
  if (e.eyeTrouble) parts.push('கண் நோய் இருந்தால் அணியலாம்');
  if (e.extremeNeed) parts.push('தீவிரத் தேவையில் மட்டும்');
  if (e.duhsthana) parts.push('நூல்: "துஸ்தான அதிபதி"');
  if (e.printedAsEmerald) parts.push('நூலில் இங்கு "Emerald" என்று அச்சிடப்பட்டுள்ளது — அச்சுப் பிழையாகத் தோன்றுகிறது');
  return parts.join(' — ');
}

/** Raj Kumar's two lordship rules, evaluated for a point of count. Strength and yogakaraka are not judged. */
function rajKumarRules(pointSign, rasi) {
  const lords = lordships(pointSign);
  return T.PLANETS.map((p) => {
    const has = (set) => lords[p].some((h) => set.includes(h));
    const dignity = rasi
      ? (EXALTATION[p].sign === rasi[p] ? 'EXALTED' : DEBILITATION[p].sign === rasi[p] ? 'DEBILITATED' : OWN_SIGNS[p].includes(rasi[p]) ? 'OWN' : null)
      : null;
    return {
      planet: p, houses: lords[p], dignity,
      rule123: has([1, 5, 9]),
      rule45910: has([1, 4, 5, 9, 10]),
      forbiddenLords: has([6, 7, 8, 12]),
      conflict: has([1, 5, 9]) && has([6, 7, 8, 12]),
    };
  });
}

function kapoorClass(planet, lagna, houses) {
  if (RASI_LORD[lagna] === planet) return 'RULING';
  if (houses.length === 0) return 'NO_LORDSHIP';
  if (houses.every((h) => DUSTHANA.includes(h))) return 'DUSTHANA_ONLY';
  if (houses.some((h) => DUSTHANA.includes(h))) return 'MIXED_LORDSHIP';
  return 'AUSPICIOUS_ONLY';
}
const KAPOOR_CLASS_TA = {
  RULING: 'லக்ன அதிபதி — "ஆளும் கல்"; எந்தத் தசையிலும் அணியலாம்',
  AUSPICIOUS_ONLY: 'சுப பாவங்களின் அதிபதி — வலுப்படுத்தலாம்',
  DUSTHANA_ONLY: '6/8/12-ஆம் அதிபதி மட்டும் — ஒருபோதும் வலுப்படுத்தக் கூடாது (விதிவிலக்கான சூழலில் மட்டும்)',
  MIXED_LORDSHIP: 'சுப பாவமும் 6/8/12-ம் சேர்ந்த அதிபதி — நூலின் பொது விதி தெளிவாக இல்லை; அவரது ஆசனவாரி உரையைப் பார்க்கவும்',
  NO_LORDSHIP: 'அதிபதி அல்லாதவர்',
};

const stanceOf = (v) => T.VERDICTS[v].stance;

/**
 * @param lagna  Ascendant sign 0-11
 * @param moon   Moon sign 0-11 (for Raj Kumar's "Ascendant or Moon sign")
 * @param rasi   optional sign of each graha (for exaltation and Ketu's house)
 */
function gemReading({ lagna, moon, rasi = null }) {
  assertSign(lagna, 'lagna');
  assertSign(moon, 'moon');
  if (rasi) for (const g of [...T.PLANETS, 'Rahu', 'Ketu']) assertSign(rasi[g], `rasi.${g}`);

  const lords = lordships(lagna);
  const lagnaLord = RASI_LORD[lagna];
  const kapoorRow = T.KAPOOR_RULING_STONE.table[lagna];
  const tr = T.TILAK_RAJ_BY_SIGN[lagna];
  const rkLagna = T.RAJ_KUMAR_TABLE.rows[lagna];
  const rkMoon = T.RAJ_KUMAR_TABLE.rows[moon];
  const rkStance = (row, planet) => {
    const listedIn = (list) => list.some((g) => GEM_PLANET[g] === planet);
    return listedIn(row.benefic) ? 'BENEFIC' : listedIn(row.malefic) ? 'MALEFIC' : null;
  };

  const rows = T.PLANETS.map((planet) => {
    const entry = tr[planet];
    const actual = lords[planet];
    const kClass = kapoorClass(planet, lagna, actual);
    const kStance = kClass === 'RULING' ? 'FAV' : kClass === 'DUSTHANA_ONLY' ? 'UNFAV' : null;
    const trStance = stanceOf(entry.v);
    const lg = rkStance(rkLagna, planet);
    const mn = rkStance(rkMoon, planet);
    const rkLagnaStance = lg === 'BENEFIC' ? 'FAV' : lg === 'MALEFIC' ? 'UNFAV' : null;
    const spoken = [kStance, trStance, rkLagnaStance].filter(Boolean);
    const set = new Set(spoken);
    let agreement;
    if (set.has('FAV') && set.has('UNFAV')) agreement = 'DISAGREE';
    else if (spoken.length <= 1) agreement = spoken.length === 0 ? 'NONE' : 'ONE_SOURCE';
    else if (set.size === 1) agreement = set.has('FAV') ? 'AGREE_FAVOURABLE' : 'AGREE_UNFAVOURABLE';
    else agreement = 'PARTIAL';
    return {
      planet, planetTa: T.PLANET_TA[planet],
      gem: T.PLANET_GEMS[planet].en, gemTa: T.PLANET_GEMS[planet].ta, alsoCalled: T.PLANET_GEMS[planet].alsoCalled ?? null,
      actualLords: actual,
      kapoor: { class: kClass, classTa: KAPOOR_CLASS_TA[kClass], stance: kStance },
      tilakRaj: {
        verdict: entry.v, verdictTa: T.VERDICTS[entry.v].ta, textTa: describeEntry(entry, planet), stance: trStance,
        statedLords: entry.lords,
        omittedLords: actual.filter((x) => !entry.lords.includes(x)),
        misstatedLords: entry.lords.filter((x) => !actual.includes(x)),
        dasha: Boolean(entry.dasha),
      },
      rajKumarLagna: { listed: lg, stance: rkLagnaStance },
      rajKumarMoon: { listed: mn, stance: mn === 'BENEFIC' ? 'FAV' : mn === 'MALEFIC' ? 'UNFAV' : null },
      agreement,
    };
  });

  // Rahu and Ketu: only Tilak Raj gives a rule.
  const N = T.TILAK_RAJ_NODES;
  const gomedStatus = N.gomed.favourableLagnas.includes(lagna) ? 'FAV'
    : N.gomed.notLagnas.includes(lagna) ? 'NOT_FOR_THIS_LAGNA' : 'NOT_UNLESS_ESSENTIAL';
  const ketuHouse = rasi ? ((rasi.Ketu - lagna + 12) % 12) + 1 : null;
  const nodes = {
    rahu: {
      gem: T.PLANET_GEMS.Rahu.en, gemTa: T.PLANET_GEMS.Rahu.ta, status: gomedStatus,
      stance: gomedStatus === 'FAV' ? 'FAV' : 'UNFAV', textTa: N.gomed.textTa,
      sourcePage: N.gomed.source.pageLocus,
    },
    ketu: {
      gem: T.PLANET_GEMS.Ketu.en, gemTa: T.PLANET_GEMS.Ketu.ta, ketuHouse,
      houseFavourable: ketuHouse === null ? null : N.catsEye.favourableKetuHouses.includes(ketuHouse),
      conditionNotJudged: 'கேது பாதகம்/பலவீனம்/அஸ்தமனம் என்பது மதிப்பிடப்படவில்லை',
      textTa: N.catsEye.textTa, sourcePage: N.catsEye.source.pageLocus,
    },
  };

  const counts = rows.reduce((a, r) => { a[r.agreement] = (a[r.agreement] ?? 0) + 1; return a; }, {});

  return {
    lagna, lagnaTa: RASI_TA[lagna], moon, moonTa: RASI_TA[moon], lagnaLord,
    planetGems: Object.fromEntries(Object.entries(T.PLANET_GEMS).map(([p, g]) => [p, { ...g, planetTa: T.PLANET_TA[p] }])),
    planetGemsSource: { title: T.PLANET_GEMS_SOURCE.title, page: T.PLANET_GEMS_SOURCE.pageLocus },
    tamilNamesNote: T.TAMIL_NAMES_NOTE,
    kapoor: {
      rulingStone: { planet: kapoorRow.lord, gem: kapoorRow.gem, gemTa: T.PLANET_GEMS[kapoorRow.lord].ta },
      page: T.KAPOOR_RULING_STONE.source.pageLocus,
    },
    rows, nodes, agreementCounts: counts,
    rajKumar: {
      lagnaRow: { benefic: rkLagna.benefic, malefic: rkLagna.malefic },
      moonRow: { benefic: rkMoon.benefic, malefic: rkMoon.malefic },
      rulesFromLagna: rajKumarRules(lagna, rasi), rulesFromMoon: rajKumarRules(moon, rasi),
      notes: T.RAJ_KUMAR_TABLE.notes, page: T.RAJ_KUMAR_TABLE.source.pageLocus,
      notJudged: ['"வலிமையான" (Ascendant அல்லது Moon sign — எது வலிமை)', 'யோககாரகன்', 'அஸ்தமனம்'],
    },
    tilakRajPage: T.TILAK_RAJ_SOURCE.pageLocus,
    rules: {
      kapoor: T.RULES.kapoor.map((r) => ({ id: r.id, textTa: r.textTa, page: r.source.pageLocus, title: r.source.title })),
      rajKumar: T.RULES.rajKumar.map((r) => ({ id: r.id, textTa: r.textTa, page: r.source.pageLocus, title: r.source.title })),
      tilakRaj: T.RULES.tilakRaj.map((r) => ({ id: r.id, textTa: r.textTa, page: r.source.pageLocus, title: r.source.title })),
    },
  };
}

module.exports = {
  gemReading, lordships, describeEntry, kapoorClass, rajKumarRules, GEM_PLANET, RASI_TA, KAPOOR_CLASS_TA,
  PLANETS: T.PLANETS, TILAK_RAJ_BY_SIGN: T.TILAK_RAJ_BY_SIGN, VERDICTS: T.VERDICTS,
};
