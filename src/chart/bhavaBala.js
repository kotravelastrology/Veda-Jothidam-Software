const { attachSource } = require('../contracts/chartContext');
const { RASI_LORD, BHAVA_KARAKA, rasiOfHouse } = require('./karaka');

const VINAY_ADITYA_BHAVA_BALA_SOURCE = {
  title: 'Practical Ashtakavarga',
  author: 'Vinay Aditya',
  file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
  tradition: 'Parashari',
  convention: 'Ashtakavarga-based Bhava Bala, Ch.4',
};

/**
 * Bhava Bala (house strength) — *Practical Ashtakavarga*, Ch.4, file page 23
 * / printed page 15 (visually verified this stage): "whether a house is
 * powerful or not, as far as Ashtakavarga is concerned, we should see by:
 * 1. The sarvashtaka bindus earned by the sign falling in the house. 2. The
 * sarvashtaka and the bhinnashtaka bindus of the lord of the house where it
 * is placed. 3. The sarvashtaka and the bhinnashtaka bindus of the karaka
 * of the house." Like S9's transit rule from the same book, this is stated
 * as three factors to weigh, not a single combining formula — so all three
 * are returned side by side rather than collapsed into an invented score.
 */
function evaluateBhavaBala(houseNumber, lagnaRasiIndex, rasiPositions, ashtakavarga) {
  const houseRasiIndex = rasiOfHouse(houseNumber, lagnaRasiIndex);
  const houseSarvaBindus = ashtakavarga.sarva[houseRasiIndex];

  const lordPlanet = RASI_LORD[houseRasiIndex];
  const lordRasiIndex = rasiPositions[lordPlanet];
  const lord = {
    planet: lordPlanet,
    sarvaBindus: ashtakavarga.sarva[lordRasiIndex],
    bhinnaBindus: ashtakavarga.bhinna[lordPlanet]?.[lordRasiIndex],
  };

  const karakaPlanet = BHAVA_KARAKA[houseNumber];
  const karakaRasiIndex = rasiPositions[karakaPlanet];
  const karaka = {
    planet: karakaPlanet,
    sarvaBindus: ashtakavarga.sarva[karakaRasiIndex],
    bhinnaBindus: ashtakavarga.bhinna[karakaPlanet]?.[karakaRasiIndex],
  };

  return {
    rasiIndex: houseRasiIndex, houseSarvaBindus, lord, karaka,
  };
}

/**
 * S10 addition — Bhava Bala for all 12 houses. `rasiPositions` is the same
 * `{ Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna }` map used by
 * S9's Ashtakavarga and S8's Karaka; `ashtakavarga` is the birth chart's own
 * `calculateAshtakavarga(...)` result. Where a house's lord or karaka is
 * Rahu/Ketu, `bhinnaBindus` comes back `undefined` (Ashtakavarga's own
 * source excludes the nodes) rather than a fabricated number — no house in
 * this chart's registered Karaka table (S8) currently names a node as
 * karaka, but a lord check is possible in principle for a future scheme.
 */
function calculateBhavaBala(lagnaRasiIndex, rasiPositions, ashtakavarga) {
  const houses = {};
  for (let houseNumber = 1; houseNumber <= 12; houseNumber += 1) {
    houses[houseNumber] = evaluateBhavaBala(houseNumber, lagnaRasiIndex, rasiPositions, ashtakavarga);
  }
  return attachSource({ houses }, {
    ...VINAY_ADITYA_BHAVA_BALA_SOURCE,
    pageLocus: 'file page 23 / printed page 15 (Ch.4) — S10',
  });
}

module.exports = { calculateBhavaBala, evaluateBhavaBala };
