/**
 * கிரக அவஸ்தைகள் (planetary states), BPHS ch.45 (Santhanam, file 612; Girish Chand Vol.1, printed pp.619-625):
 * Bālādi (5), Jāgradādi (3), Dīptādi (9), Lajjitādi (6, a set) and Śayanādi (12). Adapted to Kotravel's English graha
 * keys and its shadbala EXALTATION / MOOLATRIKONA / OWN_SIGNS, the planetaryRelationship helpers, and the rasi aspects.
 *
 * The nodes (Rahu, Ketu) take Jāgradādi, Bālādi and Śayanādi, which BPHS gives for every planet. Their Dīptādi and
 * Lajjitādi are null: BPHS gives no exaltation, own or moolatrikona sign for them.
 */
const { EXALTATION, MOOLATRIKONA, OWN_SIGNS } = require('../chart/shadbala');
const { naturalRelation, compoundRelationship } = require('../chart/planetaryRelationship');

const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const CLASSICAL_7 = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const NODES = ['Rahu', 'Ketu'];
const ALL_9 = [...CLASSICAL_7, ...NODES];
const WAR_PLANETS = new Set(['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const BENEFICS = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
const MALEFICS = ['Sun', 'Mars', 'Saturn'];
const WATERY_SIGNS = new Set([3, 7, 11]);
// BPHS planet numbers for Śayanādi: Sun 1 ... Saturn 7, Rahu 8, Ketu 9.
const PLANET_SERIAL = { Sun: 1, Moon: 2, Mars: 3, Mercury: 4, Jupiter: 5, Venus: 6, Saturn: 7, Rahu: 8, Ketu: 9 };
// Rasi aspects (BPHS): every graha aspects the 7th; the others aspect the 4th and 8th (Mars), 5th and 9th (Jupiter),
// 3rd and 10th (Saturn).
const SPECIAL_ASPECT_OFFSETS = { Mars: [3, 7], Jupiter: [4, 8], Saturn: [2, 9] };

const norm360 = (d) => ((d % 360) + 360) % 360;
const sign0 = (lon) => Math.floor(norm360(lon) / 30);
const degInSign = (lon) => norm360(lon) % 30;
const isDignified = (p) => Object.prototype.hasOwnProperty.call(EXALTATION, p);
const exaltSign = (p) => EXALTATION[p].sign;
const debilSign = (p) => (EXALTATION[p].sign + 6) % 12;
const mtSign = (p) => (MOOLATRIKONA[p] ? MOOLATRIKONA[p].sign : null);
const isOwnLike = (p, s) => (isDignified(p) && s === exaltSign(p)) || s === mtSign(p) || (OWN_SIGNS[p] || []).includes(s);

const JAGRADADI = { awake: 'ஜாக்ரத் (விழிப்பு)', dream: 'ஸ்வப்ன (கனவு)', sleep: 'சுஷுப்தி (உறக்கம்)' };

// ── Jāgradādi (BPHS v.5): own or exaltation sign = awake; friend's or neutral's = dreaming; enemy's or debilitation = asleep.
function jagradadi(planet, s) {
  if (isOwnLike(planet, s)) return JAGRADADI.awake;
  if (isDignified(planet) && s === debilSign(planet)) return JAGRADADI.sleep;
  const rel = planet === RASI_LORDS[s] ? 'friend' : naturalRelation(planet, RASI_LORDS[s]);
  return rel === 'enemy' ? JAGRADADI.sleep : JAGRADADI.dream;
}

// ── Bālādi (BPHS v.3): 5 states, 6 degrees each; odd (1-indexed) signs run Bāla to Mṛta, even signs reverse.
const BALADI = ['பால (குழந்தை)', 'குமார (இளைஞன்)', 'யுவ (வாலிபன்)', 'வ்ருத்த (முதியவர்)', 'ம்ருத (இறந்த)'];
function baladi(s, deg) {
  const part = Math.min(Math.floor(deg / 6), 4);
  const oddSign = s % 2 === 0; // 0-indexed even = 1-indexed odd
  return oddSign ? BALADI[part] : BALADI[4 - part];
}

// ── Dīptādi (BPHS v.8-10). Each state is one label; the order below is the one the sample page reads by.
const DEEPTADI = {
  deepta: 'தீப்த (உச்சம்)', khala: 'கல (நீசம்)', vikala: 'விகல (அஸ்தமனம்)', swastha: 'ஸ்வஸ்த (சொந்த வீடு)',
  pramudita: 'பிரமுதித (மகிழ்ச்சி)', shanta: 'சாந்த (நட்பு)', dina: 'தீன (சமம்)', dukhita: 'துக்கித (பகை)',
  nipidita: 'நிபீடித (கிரக யுத்தம்)',
};

const isFriendly = (tier) => tier === 'friend' || tier === 'greatFriend';
const isHostile = (tier) => tier === 'enemy' || tier === 'greatEnemy';

/** Each graha's rasi, for the temporary (horoscopic) part of the compound relation. */
const rasiPositions = (lonByPlanet) => Object.fromEntries(
  Object.keys(lonByPlanet).filter((p) => lonByPlanet[p] !== undefined).map((p) => [p, sign0(lonByPlanet[p])]),
);

/**
 * The compound (natural + temporary) tier of `planet` towards `other`, the five-tier relation of BPHS v.57-58. Dīptādi and
 * Lajjitādi read the friend and enemy signs through it, because BPHS names the "extreme friend" and "extreme enemy" states.
 */
const tierTo = (planet, other, positions) => compoundRelationship(planet, other, positions);

function deeptadi(planet, lonByPlanet) {
  if (!isDignified(planet)) return null;
  const lon = lonByPlanet[planet];
  const s = sign0(lon);
  const positions = rasiPositions(lonByPlanet);
  // war-defeat: another tara-graha in the same sign within 1deg, this one further along
  if (WAR_PLANETS.has(planet)) {
    for (const o of CLASSICAL_7) {
      if (o !== planet && WAR_PLANETS.has(o) && sign0(lonByPlanet[o]) === s
        && Math.abs(lon - lonByPlanet[o]) <= 1 && lon > lonByPlanet[o]) return DEEPTADI.nipidita;
    }
  }
  // Exaltation and debilitation come before combustion: Venus in Virgo, with the Sun in the same sign, reads Khala.
  if (s === exaltSign(planet)) return DEEPTADI.deepta;
  if (s === debilSign(planet)) return DEEPTADI.khala;
  // combust: non-Sun within 10deg of Sun in the same sign
  if (planet !== 'Sun' && sign0(lonByPlanet.Sun) === s && Math.abs(lon - lonByPlanet.Sun) <= 10) return DEEPTADI.vikala;
  if (isOwnLike(planet, s)) return DEEPTADI.swastha;
  const tier = tierTo(planet, RASI_LORDS[s], positions);
  if (tier === 'greatFriend') return DEEPTADI.pramudita;
  if (tier === 'friend') return DEEPTADI.shanta;
  if (tier === 'neutral') return DEEPTADI.dina;
  return DEEPTADI.dukhita;
}

// ── Śayanādi (BPHS v.30-37): twelve states, read from {(S·P·N) + (A + G + R)} mod 12.
//  S = the planet's nakshatra serial (1-27), P = its planet number (Sun 1 ... Ketu 9), N = its navamsha number (1-9, each
//  3°20′ of its sign), A = the janma nakshatra serial, G = the ishta ghaṭis (ghaṭis since sunrise, a remainder counted as one
//  more), R = the lagna rāśi serial (Aries 1). A remainder of 0 is the twelfth state, Nidrā.
const SHAYANADI_NAMES = [
  'சயன (உறக்கம்)', 'உபவேசன (அமர்தல்)', 'நேத்ரபாணி (விழிப்பு)', 'பிரகாசன (முழு விழிப்பு)',
  'கமனேச்சா (செல்ல ஆசை)', 'கமனாவஸ்தா (பயணம்)', 'சபாவாஸ (அவையில்)', 'ஆகமன (திரும்புதல்)',
  'போஜன (உணவு)', 'ந்ருத்யாலிப்சா (நடன ஆசை)', 'கௌதுக (மகிழ்ச்சி)', 'நித்ரா (உறக்கம்)',
];

function shayanadi(planet, lon, moonNakSerial, ghatisSinceSunrise, lagnaRasiSerial) {
  const S = Math.floor(norm360(lon) / (360 / 27)) + 1;
  const P = PLANET_SERIAL[planet];
  const N = Math.min(9, Math.floor(degInSign(lon) / (30 / 9)) + 1);
  const G = Math.ceil(ghatisSinceSunrise - 1e-9);
  const rem = (S * P * N + moonNakSerial + G + lagnaRasiSerial) % 12;
  const index = rem === 0 ? 12 : rem;
  return { index, name: SHAYANADI_NAMES[index - 1] };
}

// ── Lajjitādi (BPHS v.11-18): six states, each a condition of its own, so a planet can show several. The sign's lord is
// read by the compound tier (as Dīptādi); planets in conjunction or aspect by natural friendship, which is how PL9 reads
// the Sun's Mudita from the Moon's aspect. Mudita is read as either condition ("friend's sign" or "in conjunction with
// Jupiter"), as the previous engine read it. Kshobhita needs the Sun, a malefic aspect and an enemy aspect.
const LAJJITADI = {
  lajjit: 'லஜ்ஜித (வெட்கம்)', kshudhit: 'க்ஷுதித (பசி)', garvit: 'கர்வித (பெருமிதம்)', trashit: 'த்ரிஷித (தாகம்)',
  mudit: 'முதித (மகிழ்ச்சி)', kshobhit: 'க்ஷோபித (கொந்தளிப்பு)',
};
const LAJJITADI_ORDER = ['lajjit', 'kshudhit', 'garvit', 'trashit', 'mudit', 'kshobhit'];

function aspectedSigns(planet, rasi0) {
  const offsets = [6, ...(SPECIAL_ASPECT_OFFSETS[planet] || [])];
  return new Set(offsets.map((o) => (rasi0 + o) % 12));
}

function lajjitadi(planet, lonByPlanet, lagnaRasi0) {
  if (!isDignified(planet)) return null;
  const lon = lonByPlanet[planet];
  const s = sign0(lon);
  const positions = rasiPositions(lonByPlanet);
  const houseNum = ((s - lagnaRasi0 + 12) % 12) + 1;
  const others = CLASSICAL_7.filter((o) => o !== planet && lonByPlanet[o] !== undefined);
  const sameSign = (name) => lonByPlanet[name] !== undefined && sign0(lonByPlanet[name]) === s;
  const conj = (name) => name !== planet && sameSign(name);
  // Planets in conjunction or aspect are read by their natural friendship; the sign's lord by the compound tier.
  const natural = (name) => naturalRelation(planet, name);
  const aspBy = (name) => name !== planet && lonByPlanet[name] !== undefined
    && aspectedSigns(name, sign0(lonByPlanet[name])).has(s);
  const aspectedByEnemy = others.some((o) => aspBy(o) && natural(o) === 'enemy');
  const aspectedByBenefic = BENEFICS.some((b) => aspBy(b));
  const signLordTier = planet === RASI_LORDS[s] ? 'own' : tierTo(planet, RASI_LORDS[s], positions);

  const states = [];
  if (houseNum === 5 && ['Rahu', 'Ketu', 'Saturn', 'Mars'].some((n) => sameSign(n))) states.push('lajjit');
  if (isHostile(signLordTier) || others.some((o) => conj(o) && natural(o) === 'enemy') || aspectedByEnemy || conj('Saturn')) {
    states.push('kshudhit');
  }
  if (s === exaltSign(planet) || s === mtSign(planet)) states.push('garvit');
  if (WATERY_SIGNS.has(s) && aspectedByEnemy && !aspectedByBenefic) states.push('trashit');
  if (isFriendly(signLordTier) || others.some((o) => (conj(o) || aspBy(o)) && natural(o) === 'friend') || conj('Jupiter')) {
    states.push('mudit');
  }
  if (conj('Sun') && others.some((o) => aspBy(o) && MALEFICS.includes(o)) && aspectedByEnemy) states.push('kshobhit');
  return LAJJITADI_ORDER.filter((k) => states.includes(k)).map((k) => LAJJITADI[k]);
}

/**
 * @param grahaLongitudes { Sun..Saturn, and optionally Rahu, Ketu : sidereal longitude }
 * @param opts.moonNakSerial   janma-nakshatra serial (1-27), for Śayanādi
 * @param opts.ghatisSinceSunrise  ghaṭis since sunrise (1 = 24 min); a birth before sunrise counts from the sunrise before
 * @param opts.lagnaRasi0      Lagna rāśi index (0-11)
 */
function calculateAvasthas(grahaLongitudes, opts = {}) {
  const { moonNakSerial, ghatisSinceSunrise, lagnaRasi0 } = opts;
  const canShayana = Number.isFinite(moonNakSerial) && Number.isFinite(ghatisSinceSunrise) && Number.isFinite(lagnaRasi0);
  const planets = ALL_9.filter((p) => grahaLongitudes[p] !== undefined);
  return {
    available: true,
    rows: planets.map((p) => {
      const lon = grahaLongitudes[p];
      const lajjitaStates = canShayana ? lajjitadi(p, grahaLongitudes, lagnaRasi0) : null;
      const row = {
        planet: p,
        jagradadi: jagradadi(p, sign0(lon)),
        baladi: baladi(sign0(lon), degInSign(lon)),
        deeptadi: deeptadi(p, grahaLongitudes),
      };
      if (canShayana) {
        row.shayanadi = shayanadi(p, lon, moonNakSerial, ghatisSinceSunrise, lagnaRasi0 + 1).name;
        row.lajjitadiStates = lajjitaStates;
        row.lajjitadi = lajjitaStates === null ? null : lajjitaStates.join(' · ');
      }
      return row;
    }),
    hasFullSet: canShayana,
  };
}

module.exports = {
  calculateAvasthas, jagradadi, baladi, deeptadi, shayanadi, lajjitadi,
  JAGRADADI, BALADI, DEEPTADI, LAJJITADI, SHAYANADI_NAMES,
};
