const {
  calculatePosition, setSiderealMode, Planet, SiderealMode, CalculationFlag,
} = require('@swisseph/node');

const BPHS_WAR_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Graha Yuddha (Planetary War), Ch.79 v.9 (Sannyasa Yoga context) + Ch.27 v.20',
};

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}
function angularDiff180(a, b) {
  const diff = normalizeDegrees(a - b);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Only the 5 "starry planets" (Mars to Saturn) can be at war -- v.9 names
 * them explicitly, and Ch.27 v.20 independently scopes its own Yuddha Bala
 * adjustment the same way ("between 2 planets from Mars to Saturn"). The
 * luminaries never participate, per both passages agreeing on this point.
 */
const WAR_ELIGIBLE_PLANETS = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
/** v.9's own stated orb: "within one degree of each other". */
const WAR_ORB_DEGREES = 1;

const SWISS_PLANET = {
  Mars: Planet.Mars, Mercury: Planet.Mercury, Jupiter: Planet.Jupiter, Venus: Planet.Venus, Saturn: Planet.Saturn,
};
/**
 * Ecliptic (celestial) latitude of a war-eligible planet -- distinct from
 * geographic latitude and from equatorial declination. This project's chart
 * pipeline (`parashariChart.js`) keeps only longitude from `calculatePosition`
 * (Rasi/Bhava placement never needed latitude before), so it is fetched here
 * directly rather than plumbing it through every existing chart consumer.
 */
function eclipticLatitude(planet, jd) {
  setSiderealMode(SiderealMode.Lahiri);
  const flags = CalculationFlag.SwissEphemeris | CalculationFlag.Sidereal;
  return calculatePosition(jd, SWISS_PLANET[planet], flags).latitude;
}

/**
 * Graha Yuddha (Planetary War): v.9 (file p.776-777, printed p.769-770,
 * within the Sannyasa Yoga chapter, but describing planetary war generally)
 * -- "There is planetary war if Mars, Mercury, Jupiter, Venus and Saturn are
 * together (within one degree of each other), Venus is the conqueror
 * whether he is in North or South, but amongst the other four only one, who
 * is in the North is the Conqueror." This is the one place in this admitted
 * BPHS copy where Parashara's own verse (not translator commentary or a
 * cited third party) gives a complete, computable war-detection and
 * winner rule, and it matches Ch.27 v.20's own scope (Mars-to-Saturn only).
 *
 * A second passage in this same book (translator's general Notes, file
 * p.100, in the unrelated "Judgement of Houses" chapter) gives a
 * *different* rule -- "lesser longitude wins," and explicitly includes the
 * luminaries -- which contradicts both this verse and Ch.27's own stated
 * scope; it is recorded here as a known divergence and NOT adopted, per
 * this project's source-divergence policy (one explicit default, named
 * alternatives kept separate, never silently blended).
 *
 * A third passage (the same translator's Notes, immediately following)
 * cites a modern researcher (the late C.G. Rajan) refining the rule to
 * "same longitude to the minute, same latitude hemisphere, higher latitude
 * wins" -- the translator explicitly endorses this ("we are well guided by
 * the elaboration of Mr. Rajan") as consistent with, not contrary to,
 * Parashara's verse. Rajan's own worked example (Mars vs Saturn, 03:47 IST
 * 15 Dec 1925: Saturn's stated +2 deg 25' latitude beats Mars's +0 deg 21')
 * was reproduced with a modern sidereal-Lahiri ephemeris: Mars +0.36 deg,
 * Saturn +2.08 deg -- both positive (North) and Saturn clearly higher,
 * confirming the winner Rajan's account itself declares, even though the
 * exact degree/minute figures differ slightly (expected for a computation
 * republished from a ~1925-era source using older tables). This project
 * adopts the verse's own 1-degree orb (not Rajan's tighter same-minute
 * figure) as the default, since it is Parashara's own stated number; the
 * "higher latitude wins" / "Venus always wins" *direction* is common to
 * both the verse and Rajan's endorsed refinement, so no real choice is
 * being forced there.
 */
function warWinner(planetA, planetB, longitudes, jd) {
  if (!WAR_ELIGIBLE_PLANETS.includes(planetA) || !WAR_ELIGIBLE_PLANETS.includes(planetB)) return null;
  if (angularDiff180(longitudes[planetA], longitudes[planetB]) > WAR_ORB_DEGREES) return null;
  if (planetA === 'Venus') return planetA;
  if (planetB === 'Venus') return planetB;
  return eclipticLatitude(planetA, jd) >= eclipticLatitude(planetB, jd) ? planetA : planetB;
}

module.exports = {
  WAR_ELIGIBLE_PLANETS,
  WAR_ORB_DEGREES,
  eclipticLatitude,
  warWinner,
  BPHS_WAR_SOURCE,
};
