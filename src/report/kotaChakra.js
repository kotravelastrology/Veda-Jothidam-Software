/**
 * Kota Chakra, the fort chakra of Narapati's Svarodaya (Narapatijayacarya, the chapter on the samachaturasra and
 * other kota chakras; Chaukhamba 1971 with Pt. Ganesh Datt Pathaka's Subodhini commentary, printed pp.226-240; the
 * scan is in the corpus as C48). Twenty-eight stars, Abhijit included, stand in three parts of the fort — outer (Bahya),
 * wall (Prakara) and inner (Madhya, four of whose stars are the pillars, Stambha) — and the planets standing in those
 * stars decide, by the verses, how the fort fares. Entry (Pravesha) and exit (Nirgama) stars are twelve each.
 *
 * What is built is the part that needs only which part of the fort each planet's star lies in, which does not depend on
 * how the chakra is turned by the fort's name (v.25-26). A rule is reported when its named placements all hold; the book
 * does not say which rule outweighs another, so none is chosen and no verdict is made. The reading of a person's
 * horoscope on this chakra is a modern use that is not in this book.
 */

const { divisionOf, NAK } = require('../dasha/bphsDashas');

const DATA = require('../../fixtures/kota-chakra/narapati.json');

const STAR_NAMES = Object.freeze(['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'PPhalguni', 'UPhalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'PAshadha', 'UAshadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'PBhadra', 'UBhadra', 'Revati']);
const PLANETS = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']);

const ZONE_OF = {};
for (const [zone, stars] of Object.entries(DATA.zones)) for (const s of stars) ZONE_OF[s] = zone;
const STAMBHA = new Set(Object.values(DATA.stambha));
const ENTRY = new Set(DATA.entry);

/** The fort star of a sidereal longitude (Abhijit between Uttarashada and Shravana as in BPHS). */
function starOf(longitude) {
  const { division } = divisionOf(longitude);
  return division === 'ABHIJIT' ? 'Abhijit' : STAR_NAMES[division];
}

/** Where a longitude stands in the fort: star, part of the fort, pillar, and entry or exit. */
function place(longitude) {
  const star = starOf(longitude);
  const pillar = STAMBHA.has(star);
  return { star, zone: ZONE_OF[star], pillar, gate: pillar ? 'STAMBHA' : (ENTRY.has(star) ? 'PRAVESHA' : 'NIRGAMA') };
}

const natureOf = (planet) => (DATA.natures.benefic.includes(planet) ? 'benefic' : 'malefic');

/** Count of planets of a nature (or the named ones) in a part of the fort. */
function count(placed, spec, zone) {
  const inZone = (p) => (zone === 'STAMBHA' ? p.pillar : (zone === 'ANY' ? true : p.zone === zone));
  if (typeof spec === 'string' && spec.startsWith('all:')) {
    const names = spec.slice(4).split(',');
    return names.filter((n) => placed.find((p) => p.planet === n && inZone(p))).length;
  }
  if (typeof spec === 'string' && spec.startsWith('planet:')) return placed.filter((p) => p.planet === spec.slice(7) && inZone(p)).length;
  if (spec === 'together') {
    const byStar = {};
    for (const p of placed) (byStar[p.star] ??= []).push(natureOf(p.planet));
    return Object.values(byStar).filter((ns) => ns.includes('benefic') && ns.includes('malefic')).length;
  }
  return placed.filter((p) => natureOf(p.planet) === spec && inZone(p)).length;
}

/** The planets' places and the rules whose conditions all hold. `longitudes` maps planet names to sidereal longitudes. */
function kotaChakra(longitudes) {
  const placed = PLANETS.filter((p) => longitudes[p] !== undefined).map((planet) => ({ planet, nature: natureOf(planet), longitude: longitudes[planet], ...place(longitudes[planet]) }));
  const matches = DATA.rules.filter((r) => r.conds.every(([spec, zone, min]) => count(placed, spec, zone) >= min));
  return { placed, matches, source: DATA.source, scope: DATA.scope, notNeeded: DATA.notNeeded };
}

module.exports = { DATA, STAR_NAMES, PLANETS, ZONE_OF, starOf, place, natureOf, kotaChakra };
