/**
 * Graha aspects for the horoscope book's page 12 (PL9 sample aniruddha_HC4, "Aspects on Planets and Bhavas").
 *
 * The fraction of an aspect is the slab of its house, BPHS ch.26 v.2-5 (Santhanam, printed p.255): 3rd and 10th 1/4, 5th
 * and 9th 1/2, 4th and 8th 3/4, the 7th full. Every graha has the full 7th, and Mars (4th, 8th), Jupiter (5th, 9th) and
 * Saturn (3rd, 10th) have their special aspects, which PL9 prints as full.
 *
 * The value in virupas (60 = one rupa) is the BPHS ch.26 aspectual value: the general six rules of v.6-8 (see
 * aspectStrength.js) and the special cases of v.9-12, which replace them for the sign-counts and angles they name
 * (printed pp.256-257). Mars: 1.5 times the degrees plus 15 above two signs (60-90), 60 - degrees at three and seven signs,
 * one rupa at six. Jupiter: half the degrees plus 45 at three and seven signs, 60 - degrees at four and eight. Saturn: 60
 * minus half the excess over two signs (60-90), degrees plus 30 above eight signs (240-270).
 *
 * The nodes, which BPHS ch.26 gives no drishti, are what Parashara's Light prints on three printouts: Rahu and Ketu aspect as Jupiter does, the 7th and the
 * special 5th and 9th, by Jupiter's rules above (Arjun: Ketu on the Sun at 144.2 degrees is 60 - 24.2 = 35.8, PL9 35; Rahu on Saturn at 122.7 is 57).
 */
const { drishtiPinda } = require('./aspectStrength');

const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const GRAHAS = [...SEVEN, 'Rahu', 'Ketu'];
const SLAB_BY_HOUSE = { 3: '1/4', 10: '1/4', 5: '1/2', 9: '1/2', 4: '3/4', 8: '3/4', 7: '4/4' };
const SPECIAL_HOUSES = { Mars: [4, 8], Jupiter: [5, 9], Saturn: [3, 10], Rahu: [5, 9], Ketu: [5, 9] };

const norm = (d) => ((d % 360) + 360) % 360;
const signOf = (lon) => Math.floor(norm(lon) / 30);

/** The house (1-12) that `pointLon` falls in, counted from the aspector's sign. */
function houseFrom(aspectorLon, pointLon) {
  return ((signOf(pointLon) - signOf(aspectorLon) + 12) % 12) + 1;
}

/** The fraction of the aspect from `aspector` on a point `house` houses away, or null when it is not an aspect. */
function aspectFraction(aspector, house) {
  if ((SPECIAL_HOUSES[aspector] || []).includes(house)) return '4/4';
  return SLAB_BY_HOUSE[house] || null;
}

/**
 * The aspectual value in virupas of `aspector` on a point at `angle` degrees ahead of it (BPHS ch.26 v.6-12). The special
 * cases are checked first, by the angle's sign-count, as the verses give them.
 */
function aspectVirupa(aspector, angle) {
  const d = norm(angle);
  const s = Math.floor(d / 30);
  const r = d % 30;
  if (aspector === 'Mars') {
    if (d > 60 && d < 90) return r * 1.5 + 15;
    if (s === 3 || s === 7) return 60 - r;
    if (s === 6) return 60;
  }
  if (aspector === 'Jupiter' || aspector === 'Rahu' || aspector === 'Ketu') {
    if (s === 3 || s === 7) return r / 2 + 45;
    if (s === 4 || s === 8) return 60 - r;
  }
  if (aspector === 'Saturn') {
    // Parashara's Light's Saturn below his 3rd house: twice the degrees over thirty (38.4 degrees is 16, 57.3 is 54 on Arjun's page; the general rule gives 4 and 13), and twice the degrees under three hundred
    if (d >= 30 && d <= 60) return (d - 30) * 2;
    if (d >= 270 && d < 300) return (300 - d) * 2; // and the same from the other side (meera: Saturn 276.2 degrees from the Sun is 47, 292.5 from Venus 15)
    if (d > 60 && d < 90) return 60 - (d - 60) / 2;
    if (d > 240 && d < 270) return r + 30;
  }
  return drishtiPinda(d);
}

/** One aspect cell: { fraction, virupa } in whole virupas as PL9 prints them. Only the slab houses are aspects; others are null. */
function aspectCell(aspector, aspectorLon, pointLon) {
  const house = houseFrom(aspectorLon, pointLon);
  const fraction = aspectFraction(aspector, house);
  const virupa = Math.floor(aspectVirupa(aspector, norm(pointLon - aspectorLon)));
  // a point off the slab houses still has its angular value, which PL9 prints under a dash (Sun on Jupiter at 163 degrees: "- (26)")
  if (fraction === null) return virupa > 0 ? { fraction: '-', virupa } : null;
  return { fraction, virupa };
}

/**
 * Aspects on planets: rows are the aspected grahas, columns the aspecting grahas. A node as aspector is null (not built);
 * the diagonal is null.
 */
function aspectsOnPlanets(longitudes) {
  return GRAHAS.map((aspected) => ({
    aspected,
    cells: GRAHAS.map((aspector) => {
      if (aspector === aspected) return null;
      return aspectCell(aspector, longitudes[aspector], longitudes[aspected]);
    }),
  }));
}

/**
 * Aspects on bhavas: `points` are the twelve bhava points (the cusps, one per house, in order from the first). Returns
 * one row per bhava, with the virupa from each aspecting graha (fractions are not printed for bhavas, as PL9 does not).
 */
function aspectsOnBhavas(longitudes, points) {
  return points.map((pointLon, i) => ({
    house: i + 1,
    cells: GRAHAS.map((aspector) => {
      const virupa = Math.floor(aspectVirupa(aspector, norm(pointLon - longitudes[aspector])));
      return virupa === 0 ? null : virupa;
    }),
  }));
}

module.exports = { aspectFraction, aspectVirupa, aspectsOnPlanets, aspectsOnBhavas, GRAHAS, SEVEN };
