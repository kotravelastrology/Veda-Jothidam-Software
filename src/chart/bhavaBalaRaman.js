/**
 * Bhava Bala as PL9 prints it (horoscope book page 11): the Bhavadhipati (house lord's) strength, the Bhava Digbala and the
 * Bhava Drigbala of Raman (Graha and Bhava Balas Art.131-133: his total is the sum of the first three), plus the two
 * BPHS rules of ch.27 vv.30-31 that PL9 adds: the planets in the bhava, and the day or night rising-sign bonus. The
 * bhava madhyas are the Sripati ones (sripatiBhava.js), which reproduce Raman's own midpoints (Example 59).
 */
const { RASI_LORD } = require('./karaka');
const { ramanBhavaDrishti } = require('./shadbala');

const RAMAN_DIG_SCALE = 10;
/** BPHS v.30: a bhava occupied by Jupiter or Mercury gets one rupa, one occupied by Saturn, Mars or the Sun loses one. */
const OCCUPANT_SHASHTIAMSAS = {
  Jupiter: 60, Mercury: 60, Saturn: -60, Mars: -60, Sun: -60,
};
/** BPHS v.31's rising-sign classes (rasi indices): Seershodaya rise by the head, Prishtodaya by the hind parts, Ubhayodaya both ways. */
const SEERSHODAYA = new Set([4, 5, 6, 7, 10]);
const PRISHTODAYA = new Set([0, 1, 3, 8, 9]);
const UBHAYODAYA = new Set([2, 11]);
const DAY_NIGHT_BONUS = 15;

function normalize(degrees) {
  return ((degrees % 360) + 360) % 360;
}

/**
 * The base of Raman's Digbala table (Art.131): 1 for Scorpio (Keeta); 7 for the human signs (Mithuna, Kanya, Thula, first
 * half of Dhanus, Kumbha); 4 for the quadrupeds (Mesha, Vrishabha, Simha, second half of Dhanus, first half of Makara); 10
 * for the watery signs (Kataka, second half of Makara, Meena).
 */
function digbalaBase(midpoint) {
  const rasi = Math.floor(normalize(midpoint) / 30);
  const within = normalize(midpoint) % 30;
  if (rasi === 7) return 1;
  if (rasi === 2 || rasi === 5 || rasi === 6 || rasi === 10 || (rasi === 8 && within < 15)) return 7;
  if (rasi === 3 || rasi === 11 || (rasi === 9 && within >= 15)) return 10;
  return 4;
}

/** Raman's Bhava Digbala (Art.131, Example 59): base minus the bhava's number, mod 12, folded past 6, times ten. */
function ramanBhavaDigbala(houseNumber, midpoint) {
  let distance = (((digbalaBase(midpoint) - houseNumber) % 12) + 12) % 12;
  if (distance > 6) distance = 12 - distance;
  return distance * RAMAN_DIG_SCALE;
}

/** BPHS v.31: 15 virupas for a bhava in a rising-sign class that matches the birth's part of day (Ubhayodaya for twilight). */
function dayNightBhava(midpoint, dayPart) {
  const rasi = Math.floor(normalize(midpoint) / 30);
  if (dayPart === 'day' && SEERSHODAYA.has(rasi)) return DAY_NIGHT_BONUS;
  if (dayPart === 'night' && PRISHTODAYA.has(rasi)) return DAY_NIGHT_BONUS;
  if (dayPart === 'twilight' && UBHAYODAYA.has(rasi)) return DAY_NIGHT_BONUS;
  return 0;
}

/**
 * Every bhava's strength, in Shashtiamsas. `middles` are the twelve bhava madhyas (bhava 1 first), `longitudes` the seven
 * classical planets' sidereal longitudes, `lordPinda` each planet's Raman Shadbala Pinda (Art.133: the Bhavadhipati Bala),
 * and `dayPart` 'day', 'night' or 'twilight'. The result has `raman` (lord + Digbala + Drigbala) and `total` (plus the
 * BPHS planets-in and day-night rules), so each bhava carries both.
 */
function ramanBhavaBala({
  middles, longitudes, isWaxingMoon, lordPinda, dayPart,
}) {
  return middles.map((midpoint, index) => {
    const house = index + 1;
    const rasiIndex = Math.floor(normalize(midpoint) / 30);
    const lord = RASI_LORD[rasiIndex];
    const fromLord = lordPinda[lord];
    const dig = ramanBhavaDigbala(house, midpoint);
    const drishti = ramanBhavaDrishti(midpoint, longitudes, isWaxingMoon);
    const raman = fromLord + dig + drishti;
    // A planet is in a bhava when it sits in the bhava's sign (PL9's reading on the sample: Mercury and the Sun, both in
    // Virgo, cancel in house II), not when it falls between the Sripati sandhis.
    const plantsIn = Object.keys(OCCUPANT_SHASHTIAMSAS).reduce((sum, planet) => (
      Math.floor(normalize(longitudes[planet]) / 30) === rasiIndex ? sum + OCCUPANT_SHASHTIAMSAS[planet] : sum
    ), 0);
    const dayNight = dayNightBhava(midpoint, dayPart);
    return {
      house, rasiIndex, lord, midpoint, fromLord, dig, drishti, raman, plantsIn, dayNight, total: raman + plantsIn + dayNight,
    };
  });
}

module.exports = {
  ramanBhavaBala, ramanBhavaDigbala, digbalaBase, dayNightBhava,
};
