const { attachSource, sourceRequired } = require('../contracts/chartContext');

const BPHS_KARAKA_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Karakatwa, Ch.32',
};

/**
 * Naisargika (constant) Karaka per planet — BPHS Ch.32 v.22-24, file page
 * 267 / printed page 257 — the table its own Notes call "as normally
 * discussed in standard literature on astrology". Rahu/Ketu excluded, same
 * as the chapter's own scope for this table.
 *
 * A second, distinct table also appears in the same chapter (v.18-21, file
 * page 266-267 / printed page 256-257): it uses a "stronger of Sun/Venus"
 * and "stronger of Moon/Mars" comparative rule for father/mother, gives
 * Jupiter=paternal grandfather (not children), Venus=husband (not spouse
 * generally), Saturn=sons (not longevity), and includes a Ketu row. BPHS
 * does not reconcile the two verse-sets itself. Per this project's
 * source-divergence rule, only the verse the source's own commentary marks
 * as the standard convention (v.22-24) is implemented; v.18-21 is recorded
 * here, not blended in, pending an explicit convention decision if the
 * Owner wants it exposed as a named alternative.
 */
const NAISARGIKA_KARAKA = {
  Sun: 'Father', Moon: 'Mother', Mars: 'Siblings', Mercury: 'Maternal relatives',
  Jupiter: 'Children', Venus: 'Spouse', Saturn: 'Longevity',
};

/**
 * Bhava (house) Karaka — BPHS Ch.32 v.31-34, file page 271 / printed page
 * 261: the planet whose "portfolio" each house's core matter falls under,
 * independent of who rules or occupies that house in a given chart.
 */
const BHAVA_KARAKA = {
  1: 'Sun', 2: 'Jupiter', 3: 'Mars', 4: 'Moon', 5: 'Jupiter', 6: 'Mars',
  7: 'Venus', 8: 'Saturn', 9: 'Jupiter', 10: 'Mercury', 11: 'Jupiter', 12: 'Saturn',
};

/** Standard rasi rulership (Aries..Pisces), used only for Yoga Karaka's kendra/trikona lordship check — not a BPHS-Ch.32-specific rule, universal across Parashari sources. */
const RASI_LORD = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter',
];
const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];

function rasiOfHouse(houseNumber, lagnaRasiIndex) {
  return (lagnaRasiIndex + houseNumber - 1) % 12;
}

/**
 * Yoga Karaka — BPHS Ch.32 v.25-30, file page 267-268 / printed page 257-258:
 * a planet ruling both a kendra (1st/4th/7th/10th) and a trikona (1st/5th/
 * 9th) sign, counted from Lagna, becomes an especially significant "mutual
 * co-worker" planet for that chart. Pure rasi-lordship logic — asks which
 * sign a planet rules, not which house a planet occupies, so it has no
 * dependency on S6's still-open Sripati Bhava question.
 */
function calculateYogaKarakas(lagnaRasiIndex) {
  const kendraLords = new Set(KENDRA_HOUSES.map((h) => RASI_LORD[rasiOfHouse(h, lagnaRasiIndex)]));
  const trikonaLords = new Set(TRIKONA_HOUSES.map((h) => RASI_LORD[rasiOfHouse(h, lagnaRasiIndex)]));
  return [...kendraLords].filter((planet) => trikonaLords.has(planet));
}

/**
 * S8 — Karaka references (WORKFLOW-REGISTER-001 S8; PLAN-001 item 8,
 * "source-attested significations"). `lagnaRasiIndex` (0-based, from
 * `calculateParashariChart`) is only needed for Yoga Karaka; the
 * Naisargika and Bhava tables are constants.
 *
 * Chara Karaka (BPHS Ch.32 v.1-17: Atmakaraka and 7-8 variable,
 * degree-ranked significators) is deliberately NOT implemented, even though
 * it appears in this same admitted BPHS copy: it is the defining technique
 * of Jaimini Jyotish, and PLAN-001 defers Jaimini Jyotish pending separate
 * future authorization. Implementing it here would quietly cross that
 * boundary just because the verses happen to sit in the same book.
 */
function calculateKarakas(lagnaRasiIndex) {
  return attachSource({
    naisargika: NAISARGIKA_KARAKA,
    bhava: BHAVA_KARAKA,
    yoga: calculateYogaKarakas(lagnaRasiIndex),
    charaKaraka: sourceRequired(
      'Chara Karaka (v.1-17 of this same chapter) is the defining Jaimini Jyotish technique; PLAN-001 defers Jaimini '
      + 'Jyotish pending separate future authorization, so it is not implemented here despite being textually present',
    ),
  }, {
    ...BPHS_KARAKA_SOURCE,
    pageLocus: 'file pages 264-271 / printed pages 254-261 (Ch.32 v.18-34: constant, house and yoga karakas) — S8',
  });
}

module.exports = {
  calculateKarakas,
  calculateYogaKarakas,
  NAISARGIKA_KARAKA,
  BHAVA_KARAKA,
  RASI_LORD,
  rasiOfHouse,
};
