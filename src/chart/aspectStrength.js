const BPHS_ASPECT_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Evaluation of Planetary Aspects, Ch.26',
};

function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Drishti Pinda (aspectual value), Ch.26 v.6-8 plus the translator's own
 * "Rule 1-6" restatement of the same verses (file p.209-210, printed p.199-
 * 200). `angle` is the forward angular distance from the aspecting planet to
 * the aspected point (aspected longitude - aspector longitude, normalized to
 * 0-360). The six rules form one continuous, verified triangular speculum:
 * 0 at conjunction (0deg) and again at 300deg, rising to a peak of exactly 60
 * Virupas at opposition (180deg, the "7th house" full aspect every planet
 * has per v.2-5). Hand-checked against two rows of the chapter's own printed
 * "Speculum of Aspectual Values" table: 47deg -> 8.50 ((47-30)/2), and
 * 64deg -> 19.00 ((64-60)+15) -- both match exactly.
 */
function drishtiPinda(angle) {
  const a = normalizeDegrees(angle);
  if (a < 30 || a >= 300) return 0;
  if (a < 60) return (a - 30) / 2;
  if (a < 90) return (a - 60) + 15;
  if (a < 120) return (120 - a) / 2 + 30;
  if (a < 150) return 150 - a;
  if (a < 180) return (a - 150) * 2;
  return (300 - a) / 2;
}

/**
 * Special extra-aspect bonuses for Mars/Jupiter/Saturn, Ch.26 v.9-12 and the
 * translator's Notes restatement (file p.210-211): these three planets'
 * special aspects (Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th) are
 * boosted so they read as a full (or near-full) aspect there, on top of the
 * ordinary speculum value every planet already gets at that angle.
 */
function specialAspectBonus(aspectorPlanet, angle) {
  const a = normalizeDegrees(angle);
  if (aspectorPlanet === 'Mars' && ((a >= 90 && a < 120) || (a >= 210 && a < 249))) return 15;
  if (aspectorPlanet === 'Jupiter' && ((a >= 120 && a < 150) || (a >= 240 && a < 270))) return 30;
  if (aspectorPlanet === 'Saturn' && ((a >= 60 && a < 90) || (a >= 270 && a < 300))) return 45;
  return 0;
}

/** Net aspectual value of `aspectorPlanet` (at `aspectorLongitude`) on a point at `aspectedLongitude`. */
function aspectualValue(aspectorPlanet, aspectorLongitude, aspectedLongitude) {
  const angle = aspectedLongitude - aspectorLongitude;
  return drishtiPinda(angle) + specialAspectBonus(aspectorPlanet, angle);
}

module.exports = {
  drishtiPinda,
  specialAspectBonus,
  aspectualValue,
  BPHS_ASPECT_SOURCE,
};
