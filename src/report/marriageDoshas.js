/**
 * The nine marriage evils besides Latta, for one moment's sky (tables in
 * `marriageDoshaTables.js`). Pure: the engine in `muhurtaStars.js` builds the
 * sky for each piece of the period and calls `marriageDoshasOf`.
 *
 * A sky:
 *   moon, sun:  { pada 0-107, abhijit } (sun also deg — completed degrees in its sign)
 *   planets:    { Sun, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu: { pada, abhijit } }
 *   yoga 0-26, tithi 1-30
 *   paataEnds:  the ends of the Paata yogas while the Moon is in this passage
 *               through its star: [{ yoga, moonPada }]
 *
 * Each evil returns { readings: { id: detail | null }, ...what to show }: a
 * detail (truthy) when the evil is present under that reading. A reading that
 * depends on the lagna returns 'LAGNA' and lists the lagnas instead.
 */

const T = require('./marriageDoshaTables');

const PLANETS = ['Sun', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const star27 = (pada) => Math.floor(pada / 4);
const signOf = (pada) => Math.floor(pada / 9);
const quarterOf = (pada) => (pada % 4) + 1;
/** The 28-star scheme: Abhijit (21) carved out of Uttarashadha and Shravana. */
const star28 = (pada, abhijit) => {
  if (abhijit) return 21;
  const s = star27(pada);
  return s <= 20 ? s : s + 1;
};
const count = (from, to, n) => ((to - from + n) % n) + 1;
const hit = (list) => (list.length ? list : null);

function paataOf(sky) {
  const moon = star27(sky.moon.pada);
  const sun = star27(sky.sun.pada);
  const struck = (targets) => targets.map((t) => (t - sun + 27) % 27);
  const narada = struck(T.NARADA_TARGETS.CHITRA);
  const swati = struck(T.NARADA_TARGETS.SWATI);
  const ends = sky.paataEnds.map((e) => e.yoga);
  const endsHere = sky.paataEnds.filter((e) => e.moonPada === sky.moon.pada).map((e) => e.yoga);
  return {
    readings: {
      YOGA_END: hit(ends),
      YOGA_END_PADA: hit(endsHere),
      NARADA: narada.includes(moon) ? 'NARADA' : null,
      NARADA_SWATI: swati.includes(moon) ? 'NARADA' : null,
      NARADA_QUARTER: narada.includes(moon) && quarterOf(sky.moon.pada) === quarterOf(sky.sun.pada) ? 'NARADA' : null,
    },
    yogaEnds: sky.paataEnds,
    naradaStars: narada,
  };
}

function yutiOf(sky) {
  const moonSign = signOf(sky.moon.pada);
  const moonStar = star27(sky.moon.pada);
  const inSign = PLANETS.filter((p) => signOf(sky.planets[p].pada) === moonSign);
  const inStar = PLANETS.filter((p) => star27(sky.planets[p].pada) === moonStar);
  return {
    readings: {
      SIGN_ANY: hit(inSign),
      SIGN_MC: hit(inSign.filter((p) => p !== 'Mercury' && p !== 'Jupiter')),
      STAR: hit(inStar),
    },
    inSign, inStar,
    starOtherSign: inStar.filter((p) => signOf(sky.planets[p].pada) !== moonSign),
    // Own (Cancer), exaltation (Taurus) or a friend's sign (the Sun's, Mercury's) — BPHS natural friends, our reading.
    moonDignity: moonSign === 3 ? 'OWN' : moonSign === 1 ? 'EXALTED' : [4, 2, 5].includes(moonSign) ? 'FRIEND' : null,
  };
}

/**
 * The chakra stars a body stands on. In Abhijit's span it stands on Abhijit
 * and also on its own star: Muhurta Chintamani's own example has a planet in
 * Uttarashadha's 4th quarter — inside Abhijit — strike Mrigashira, Uttarashadha's
 * partner (our reading: both).
 */
const chakraStars = (pada, abhijit) => {
  const s = star27(pada);
  const own = s <= 20 ? s : s + 1;
  return abhijit ? [own, 21] : [own];
};

/** Planets across the chakra line from the Moon; a benefic only in the facing quarter (1-4, 2-3), except across Abhijit. */
function vedhaBy(sky, pairs) {
  const moonStars = chakraStars(sky.moon.pada, sky.moon.abhijit);
  return PLANETS.filter((p) => {
    const pl = sky.planets[p];
    const plStars = chakraStars(pl.pada, pl.abhijit);
    return moonStars.some((m) => plStars.some((q) => {
      if (pairs[m] !== q) return false;
      if (T.MALEFICS.includes(p) || m === 21 || q === 21) return true;
      return quarterOf(sky.moon.pada) + quarterOf(pl.pada) === 5;
    }));
  });
}

function vedhaOf(sky) {
  const pancha = vedhaBy(sky, T.PANCHA);
  const sapta = vedhaBy(sky, T.SAPTA);
  return { readings: { PANCHA: hit(pancha), BOTH: hit([...new Set([...pancha, ...sapta])]), SAPTA: hit(sapta) } };
}

function jamitraOf(sky) {
  const moonSign = signOf(sky.moon.pada);
  const others = PLANETS.filter((p) => p !== 'Mercury');
  const seventh = others.filter((p) => signOf(sky.planets[p].pada) === (moonSign + 6) % 12);
  const nav55 = others.filter((p) => sky.planets[p].pada === (sky.moon.pada + 54) % 108);
  const star14 = T.MALEFICS.filter((p) => star27(sky.planets[p].pada) === (star27(sky.moon.pada) + 13) % 27);
  // From the lagna: the lagna signs with a planet in the 7th, and the lagna navamsas (padas) facing a planet's.
  const lagnaSigns = {};
  const lagnaNavamsas = {};
  for (const p of PLANETS) {
    const ls = (signOf(sky.planets[p].pada) + 6) % 12;
    (lagnaSigns[ls] = lagnaSigns[ls] || []).push(p);
    const ln = (sky.planets[p].pada + 54) % 108;
    (lagnaNavamsas[ln] = lagnaNavamsas[ln] || []).push(p);
  }
  return {
    readings: { SEVENTH: hit(seventh), NAVAMSA_55: hit(nav55), STAR_14: hit(star14) },
    mercurySeventh: signOf(sky.planets.Mercury.pada) === (moonSign + 6) % 12,
    lagnaSigns, lagnaNavamsas,
  };
}

/** The banas the Sun's degree makes (deg as counted) and the Sashalya check. */
function banasOfDegree(deg) {
  const rem = Object.fromEntries(T.BANAS.map((b) => [b, (deg + T.BANA_ADD[b]) % 9]));
  return { present: T.BANAS.filter((b) => rem[b] === 5), sashalya: T.BANAS.reduce((s, b) => s + rem[b], 0) % 9 === 5 };
}

function banaOf(sky) {
  const done = banasOfDegree(sky.sun.deg);
  const ordinal = banasOfDegree(sky.sun.deg + 1);
  // Tithi + lagna: the lagna numbers (1 = Aries) giving each bana with this tithi.
  const lagnas = Object.fromEntries(T.BANAS.map((b) => [b, [...Array(12).keys()].map((i) => i + 1).filter((l) => (sky.tithi + l) % 9 === T.BANA_TITHI_LAGNA[b] % 9)]));
  return {
    readings: {
      SUN_DEGREE: done.present.includes('MRITYU') ? 'MRITYU' : null,
      SUN_DEGREE_ORDINAL: ordinal.present.includes('MRITYU') ? 'MRITYU' : null,
      TITHI_LAGNA: 'LAGNA',
    },
    sunDeg: sky.sun.deg, byDegree: done, byOrdinal: ordinal, lagnas,
  };
}

function ekargalaOf(sky) {
  const evil = T.EVIL_YOGAS.includes(sky.yoga);
  const s27 = star27(sky.sun.pada);
  const m27 = star27(sky.moon.pada);
  const s28 = star28(sky.sun.pada, sky.sun.abhijit);
  const m28 = star28(sky.moon.pada, sky.moon.abhijit);
  // Same line of the chakra: equal distances from the top star either way; with 28 ends the top and bottom too.
  const sameLine = (s, m, top, n) => s !== m && ((s - top + n) % n === (top - m + n) % n || (n === 28 && ((s - top + n) % n) + ((m - top + n) % n) === 14 && (s === top || m === top)));
  const top = T.MURDHA[sky.yoga];
  const wTop = (sky.yoga + T.WILHELM_YOGA_STAR) % 27;
  const c28 = count(s28, m28, 28);
  const c27 = count(s27, m27, 27);
  const exempt = T.EKARGALA_EXEMPT.includes(m27);
  return {
    readings: {
      KHARJURA_28: evil && sameLine(s28, m28, top, 28) ? 'LINE' : null,
      KHARJURA_27: evil && sameLine(s27, m27, top, 27) ? 'LINE' : null,
      ODD_COUNT: evil && c28 % 2 === 1 ? c28 : null,
      ODD_COUNT_27: evil && c27 % 2 === 1 ? c27 : null,
      WILHELM: evil && !exempt && sameLine(s27, m27, wTop, 27) ? 'LINE' : null,
    },
    yoga: sky.yoga, evil, top: evil ? top : null, count28: c28, count27: c27, exempt,
  };
}

function upagrahaOf(sky) {
  const c = count(star27(sky.sun.pada), star27(sky.moon.pada), 27);
  const c28 = count(star28(sky.sun.pada, sky.sun.abhijit), star28(sky.moon.pada, sky.moon.abhijit), 28);
  const sameQuarter = quarterOf(sky.moon.pada) === quarterOf(sky.sun.pada);
  return {
    readings: {
      UPA13: T.UPAGRAHA_13.includes(c) ? c : null,
      UPA13_QUARTER: T.UPAGRAHA_13.includes(c) && sameQuarter ? c : null,
      UPA13_ABHIJIT: T.UPAGRAHA_13.includes(c28) ? c28 : null,
      UPA8: T.UPAGRAHA_MP.includes(c) ? c : null,
    },
    count: c, count28: c28, sameQuarter,
  };
}

function krantiOf(sky) {
  const a = signOf(sky.sun.pada);
  const b = signOf(sky.moon.pada);
  const pair = T.KRANTI_PAIRS.find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return { readings: { SIGN_PAIRS: pair ? pair : null }, sunSign: a, moonSign: b };
}

function dagdhaOf(sky) {
  const sunSign = signOf(sky.sun.pada);
  const pakshaTithi = ((sky.tithi - 1) % 15) + 1;
  const paksha = sky.tithi <= 15 ? 'SHUKLA' : 'KRISHNA';
  const burnt = T.DAGDHA_TITHI[sunSign];
  const both = pakshaTithi === burnt;
  // Odd signs (Aries, Gemini ...) the bright half, even signs the dark.
  const bySign = both && paksha === (sunSign % 2 === 0 ? 'SHUKLA' : 'KRISHNA');
  return { readings: { BOTH: both ? burnt : null, BY_SIGN: bySign ? burnt : null }, sunSign, burnt, pakshaTithi, paksha };
}

const OF = { PAATA: paataOf, YUTI: yutiOf, VEDHA: vedhaOf, JAMITRA: jamitraOf, BANA: banaOf, EKARGALA: ekargalaOf, UPAGRAHA: upagrahaOf, KRANTI: krantiOf, DAGDHA: dagdhaOf };

function marriageDoshasOf(sky) {
  return Object.fromEntries(T.DOSHAS.map((d) => [d, OF[d](sky)]));
}

/**
 * The ten under the chosen readings and rule. `chosen` maps each evil to a
 * reading id; `latta` is whether Latta counts (from the page's Latta switches).
 * Readings that depend on the lagna are not counted.
 */
function dashaVerdict(doshas, chosen, latta, ruleId) {
  const present = T.DOSHAS.filter((d) => {
    const v = doshas[d].readings[chosen[d]];
    return v && v !== 'LAGNA';
  });
  const all = latta ? ['LATTA', ...present] : present;
  const serious = present.filter((d) => T.SERIOUS.includes(d));
  const reject = ruleId === 'NONE' ? false
    : ruleId === 'ALL_TEN' ? all.length > 0
      : ruleId === 'FIVE' ? serious.length > 0
        : ruleId === 'FIVE_AND_SIX' ? serious.length > 0 || all.length > 4
          : all.length > 4;
  return { present: all, serious, reject };
}

module.exports = { marriageDoshasOf, dashaVerdict, paataOf, yutiOf, vedhaOf, jamitraOf, banaOf, ekargalaOf, upagrahaOf, krantiOf, dagdhaOf, star28, PLANETS };
