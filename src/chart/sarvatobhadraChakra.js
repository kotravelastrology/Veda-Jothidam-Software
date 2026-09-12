const { attachSource } = require('../contracts/chartContext');
const { NAKSHATRA_NAMES } = require('../report/nakshatraExtras');

/**
 * Sarvatobhadra Chakra ("all-auspicious wheel") — a classical muhurta/prashna
 * grid used to check whether a chart's key points (Janma nakshatra, Lagna)
 * are under Vedha ("piercing") from a transiting or natal graha.
 *
 * Source: K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy,
 * "Saravatobhadra Chakra in Astrology", International Journal of Advanced
 * Trends in Engineering and Technology (IJATET), Vol.7 Issue.1, pp.45-54,
 * 2022 — a peer-reviewed paper that itself cites Narpati Jayacharya's
 * Swarodaya, Phaladeepika, Mansagri and Kumaraswamiyam as its classical
 * sources for the grid construction and Vedha rules.
 *
 * The paper's own 81-cell grid diagram did not survive plain-text extraction
 * intact (column misalignment), so rather than guess at the garbled cells,
 * every geometric rule used below (the clockwise border sequence, and the
 * Direct/Forward/Backward Vedha formulas) was independently re-derived from
 * the paper's own worked examples and cross-checked until all of them matched:
 *   - Krittika: direct=Shravana, forward=Vishakha, backward=Bharani (p.49)
 *   - Ashwini: direct=Purvaphalguni, forward=Rohini, backward=Jyeshta (p.48-49)
 *   - Swati: direct=Shatabhishak, forward=Jyeshta, backward=Rohini (p.49)
 *   - Purvashadha: direct=Ardra, forward=Uttara Bhadrapada, backward=Hasta (p.49)
 * All 12 forward/backward/direct values across these 4 examples match the
 * geometric rules implemented here exactly (see vedhaOf below).
 */
const SBC_SOURCE = {
  title: 'Saravatobhadra Chakra in Astrology',
  author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
  file: 'International Journal of Advanced Trends in Engineering and Technology (IJATET), Vol.7 Issue.1, pp.45-54, 2022',
  tradition: "Parashari / classical muhurta (paper cites Narpati Jayacharya's Swarodaya, Phaladeepika, Mansagri, Kumaraswamiyam)",
  convention: '28-nakshatra (27 + Abhijit) 9x9 border grid; Vedha = Direct (straight-across) / Forward / Backward (diagonal) piercing',
  pageLocus: 'pp.45-46 (grid construction) + pp.48-49 (Vedha worked examples, re-derived and cross-verified geometrically — see file header)',
};

const NATURAL_BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const NATURAL_MALEFICS = new Set(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

// 28-nakshatra clockwise border sequence starting at Krittika (East) — the
// standard 27-nakshatra cycle rotated to start at Krittika, with Abhijit
// inserted between Uttara Ashadha and Shravana (its classical position,
// spanning the last quarter of Uttara Ashadha to the start of Shravana).
const BORDER_SEQUENCE = (() => {
  const startIdx = NAKSHATRA_NAMES.indexOf('Krittika');
  const rotated = [...NAKSHATRA_NAMES.slice(startIdx), ...NAKSHATRA_NAMES.slice(0, startIdx)];
  const uAshadhaPos = rotated.indexOf('Uttara Ashadha');
  rotated.splice(uAshadhaPos + 1, 0, 'Abhijit');
  return rotated;
})();

// Grid coordinates: rows/cols 1-9; the four corners (1,1)/(1,9)/(9,1)/(9,9)
// are unoccupied. Edges are traversed Top(L->R), Right(T->B), Bottom(R->L),
// Left(B->T) — one continuous clockwise loop equal to BORDER_SEQUENCE.
function buildGrid() {
  const cell = {};
  const posOf = {};
  const place = (name, row, col, edge) => {
    cell[`${row},${col}`] = name;
    posOf[name] = { row, col, edge };
  };
  for (let i = 0; i < 7; i++) place(BORDER_SEQUENCE[i], 1, 2 + i, 'top');
  for (let i = 0; i < 7; i++) place(BORDER_SEQUENCE[7 + i], 2 + i, 9, 'right');
  for (let i = 0; i < 7; i++) place(BORDER_SEQUENCE[14 + i], 9, 8 - i, 'bottom');
  for (let i = 0; i < 7; i++) place(BORDER_SEQUENCE[21 + i], 8 - i, 1, 'left');
  return { cell, posOf };
}

const { cell: GRID_CELL, posOf: NAKSHATRA_POS } = buildGrid();

/**
 * Direct/Forward/Backward Vedha partner of a nakshatra.
 *  - Direct (straight across the centre): Top(1,c)<->Bottom(9,c) same column;
 *    Left(r,1)<->Right(r,9) same row.
 *  - Main-diagonal reflection (r,c)<->(c,r): connects Top<->Left, Bottom<->Right.
 *  - Anti-diagonal reflection (r,c)<->(10-c,10-r): connects Top<->Right, Bottom<->Left.
 *  - "Forward" reaches the clockwise-next edge (Top->Right, Right->Bottom,
 *    Bottom->Left, Left->Top); "Backward" reaches the clockwise-previous one.
 */
function vedhaOf(nakshatraName) {
  const pos = NAKSHATRA_POS[nakshatraName];
  if (!pos) return null;
  const { row: r, col: c, edge } = pos;

  const mainDiag = GRID_CELL[`${c},${r}`] ?? null;
  const antiDiag = GRID_CELL[`${10 - c},${10 - r}`] ?? null;

  let direct, forward, backward;
  if (edge === 'top') { direct = GRID_CELL[`9,${c}`]; forward = antiDiag; backward = mainDiag; }
  else if (edge === 'bottom') { direct = GRID_CELL[`1,${c}`]; forward = antiDiag; backward = mainDiag; }
  else if (edge === 'right') { direct = GRID_CELL[`${r},1`]; forward = mainDiag; backward = antiDiag; }
  else { direct = GRID_CELL[`${r},9`]; forward = mainDiag; backward = antiDiag; }

  return { direct, forward, backward };
}

function nakshatraOfLongitude(longitude) {
  const norm = ((longitude % 360) + 360) % 360;
  return NAKSHATRA_NAMES[Math.floor(norm / (360 / 27)) % 27];
}

/**
 * @param grahaLongitudes  { Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu } sidereal degrees
 * @param lagnaLongitude   sidereal degrees
 */
function calculateSarvatobhadraChakra(grahaLongitudes, lagnaLongitude) {
  try {
    if (!grahaLongitudes) {
      return attachSource({
        grid: [], grahaNakshatra: {}, lagnaNakshatra: null, janmaNakshatra: null,
        janmaVedha: null, lagnaVedha: null,
      }, SBC_SOURCE);
    }

    const occupants = {};
    const grahaNakshatra = {};
    for (const [graha, lon] of Object.entries(grahaLongitudes)) {
      if (typeof lon !== 'number') continue;
      const nak = nakshatraOfLongitude(lon);
      grahaNakshatra[graha] = nak;
      (occupants[nak] = occupants[nak] || []).push(graha);
    }
    let lagnaNakshatra = null;
    if (typeof lagnaLongitude === 'number') {
      lagnaNakshatra = nakshatraOfLongitude(lagnaLongitude);
      (occupants[lagnaNakshatra] = occupants[lagnaNakshatra] || []).push('Lagna');
    }

    const janmaNakshatra = grahaNakshatra.Moon || null;

    function describeVedhaPartner(partnerNak) {
      const grahasThere = occupants[partnerNak] || [];
      return {
        nakshatra: partnerNak,
        grahas: grahasThere,
        benefic: grahasThere.filter((g) => NATURAL_BENEFICS.has(g)),
        malefic: grahasThere.filter((g) => NATURAL_MALEFICS.has(g)),
      };
    }

    function vedhaReport(nakshatraName) {
      if (!nakshatraName) return null;
      const v = vedhaOf(nakshatraName);
      if (!v) return null;
      return {
        direct: describeVedhaPartner(v.direct),
        forward: describeVedhaPartner(v.forward),
        backward: describeVedhaPartner(v.backward),
      };
    }

    return attachSource({
      grid: BORDER_SEQUENCE.map((name) => ({
        name,
        ...NAKSHATRA_POS[name],
        occupants: occupants[name] || [],
      })),
      grahaNakshatra,
      lagnaNakshatra,
      janmaNakshatra,
      janmaVedha: vedhaReport(janmaNakshatra),
      lagnaVedha: (lagnaNakshatra && lagnaNakshatra !== janmaNakshatra) ? vedhaReport(lagnaNakshatra) : null,
    }, SBC_SOURCE);
  } catch (e) {
    return attachSource({
      grid: [], grahaNakshatra: {}, lagnaNakshatra: null, janmaNakshatra: null,
      janmaVedha: null, lagnaVedha: null, error: e.message,
    }, SBC_SOURCE);
  }
}

module.exports = {
  calculateSarvatobhadraChakra,
  BORDER_SEQUENCE,
  NAKSHATRA_POS,
  vedhaOf,
  SBC_SOURCE,
};
