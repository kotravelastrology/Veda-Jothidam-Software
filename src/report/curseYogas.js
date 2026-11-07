/**
 * Curses of the previous birth, BPHS ch.83 (Santhanam, vol.2, printed pp.985-1002; fixture fixtures/curses/bphs-83.json): the yogas of the chart that the chapter says show a curse
 * (of a serpent, the father, the mother, a brother, the maternal uncle, a Brahmin, the wife, departed ancestors) ending in want of a male issue, read condition by condition.
 *
 * A yoga is a list of conditions, each written as a short string and read as true, false or unknown (strength and combustion are not checked, so those conditions are unknown):
 *   X@a,b      the planet X (or lordN, the lord of the Nth house, or Gulika) stands in house a or b from the Lagna
 *   X+Y+...    the planets stand in one sign (two names for one planet, as the Lagna lord Mars with Mars, do not count)
 *   occ:H=a,b  every planet named stands in house H;  occ:H=mal / occ:H=ben  some malefic / benefic does
 *   asp:X>Y    X (a planet, or mal for any of the Sun, Mars and Saturn) aspects Y (a planet, lordN or hN, a house), aspects counted by signs as in BPHS ch.26
 *   kartari:Y  Y (a planet, lordN or hN) stands between malefics (a malefic in the 12th and in the 2nd from its sign)
 *   deb:X      X stands in its sign of debilitation;  nav:X=Y  X stands in a Navamsha owned by Y (a planet, lordN or mal)
 *   insign:X=Y X stands in a sign owned by Y (a planet or mal);  inim:X  X stands in a sign of a natural enemy
 *   withmal:X / withben:X  a malefic / benefic other than X stands in X's sign;  aspdeb:X  X is aspected by a planet that is debilitated
 *   sign:hN=a,b  the sign of house N is one of those;  lord:hN=P  the lord of house N is P;  exch:a,b  the lords of houses a and b stand in each other's houses
 *   any:a,b,c@h  one of the planets stands in house h;  waning  the Moon is waning
 *   weak:X / strong:X / combust:X  not checked
 * A condition may also be { or: [[...], [...]] }, true when one list of conditions is.
 */
const { DEBILITATION } = require('../chart/shadbala');
const { NATURAL_ENEMIES } = require('../chart/planetaryRelationship');
const { navamshaSign } = require('./specialPoints');
const { aspects } = require('./pravrajyaYoga');
const N = require('../sources/tamilNames');
const DATA = require('../../fixtures/curses/bphs-83.json');

const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);
const ASPECTING_MALEFICS = Object.freeze(['Sun', 'Mars', 'Saturn']);
const BENEFICS = Object.freeze(['Moon', 'Mercury', 'Jupiter', 'Venus']);
const SEVEN = Object.freeze(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']);
const ALL = Object.freeze([...SEVEN, 'Rahu', 'Ketu']);
const SIGN_NAMES = Object.freeze(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']);
const UNKNOWN = 'unknown';

/**
 * @param f { signs: {Sun..Ketu: 0-11}, longitudes: {Sun..Saturn}, lagnaSign, gulikaSign }
 * @returns an object with `eval(atom)`: true, false or 'unknown'
 */
function reader(f) {
  const { signs, lagnaSign } = f;
  const houseOf = (sign) => ((sign - lagnaSign + 12) % 12) + 1;
  const signOfHouse = (h) => (lagnaSign + h - 1) % 12;
  /** The sign of an entity: a planet, Gulika, lordN, or hN (a house). */
  const signOf = (e) => {
    if (signs[e] !== undefined) return signs[e];
    if (e === 'Gulika') return f.gulikaSign;
    let m = /^lord(\d+)$/.exec(e);
    if (m) return signs[SIGN_LORD[signOfHouse(Number(m[1]))]];
    m = /^h(\d+)$/.exec(e);
    if (m) return signOfHouse(Number(m[1]));
    throw new Error(`unknown entity ${e}`);
  };
  /** The planet an entity names (lordN is the lord of the Nth house). */
  const planetOf = (e) => {
    const m = /^lord(\d+)$/.exec(e);
    return m ? SIGN_LORD[signOfHouse(Number(m[1]))] : e;
  };
  const occupants = (sign) => ALL.filter((p) => signs[p] === sign);
  const isMal = (p) => MALEFICS.includes(p);
  const longitudeOf = (p) => f.longitudes[p];
  const ownerMatches = (owner, who) => (who === 'mal' ? MALEFICS.includes(owner) : owner === planetOf(who));

  const atom = (s) => {
    if (typeof s === 'object') return orOf(s.or);
    let m;
    if ((m = /^(weak|strong|combust):/.exec(s))) return UNKNOWN;
    if (s === 'waning') return ((longitudeOf('Moon') - longitudeOf('Sun')) % 360 + 360) % 360 > 180;
    if ((m = /^(\w+)@([\d,]+)$/.exec(s))) return m[2].split(',').map(Number).includes(houseOf(signOf(m[1])));
    if ((m = /^any:([\w,]+)@(\d+)$/.exec(s))) return m[1].split(',').some((p) => houseOf(signs[p]) === Number(m[2]));
    if ((m = /^occ:(\d+)=(.+)$/.exec(s))) {
      const here = occupants(signOfHouse(Number(m[1])));
      if (m[2] === 'mal') return here.some(isMal);
      if (m[2] === 'ben') return here.some((p) => BENEFICS.includes(p));
      return m[2].split(',').every((p) => here.includes(p));
    }
    if ((m = /^asp:(\w+)>(\w+)$/.exec(s))) {
      const target = signOf(m[2]);
      const who = m[1] === 'mal' ? ASPECTING_MALEFICS : [planetOf(m[1])];
      return who.some((p) => SEVEN.includes(p) && p !== planetOf(m[2]) && aspects(p, signs[p], target));
    }
    if ((m = /^kartari:(\w+)$/.exec(s))) {
      const sign = signOf(m[1]);
      return occupants((sign + 11) % 12).some(isMal) && occupants((sign + 1) % 12).some(isMal);
    }
    if ((m = /^deb:(\w+)$/.exec(s))) { const p = planetOf(m[1]); return DEBILITATION[p] ? signs[p] === DEBILITATION[p].sign : false; }
    if ((m = /^nav:(\w+)=(\w+)$/.exec(s))) return ownerMatches(SIGN_LORD[navamshaSign(longitudeOf(planetOf(m[1])))], m[2]);
    if ((m = /^insign:(\w+)=(\w+)$/.exec(s))) return ownerMatches(SIGN_LORD[signs[planetOf(m[1])]], m[2]);
    if ((m = /^inim:(\w+)$/.exec(s))) { const p = planetOf(m[1]); return NATURAL_ENEMIES[p] ? NATURAL_ENEMIES[p].includes(SIGN_LORD[signs[p]]) : false; }
    if ((m = /^withmal:(\w+)$/.exec(s))) return occupants(signOf(m[1])).some((p) => isMal(p) && p !== planetOf(m[1]));
    if ((m = /^withben:(\w+)$/.exec(s))) return occupants(signOf(m[1])).some((p) => BENEFICS.includes(p) && p !== planetOf(m[1]));
    if ((m = /^aspdeb:(\w+)$/.exec(s))) {
      const p = planetOf(m[1]);
      return SEVEN.some((q) => q !== p && DEBILITATION[q] && signs[q] === DEBILITATION[q].sign && aspects(q, signs[q], signs[p]));
    }
    if ((m = /^sign:h(\d+)=([\w,]+)$/.exec(s))) return m[2].split(',').includes(SIGN_NAMES[signOfHouse(Number(m[1]))]);
    if ((m = /^lord:h(\d+)=(\w+)$/.exec(s))) return SIGN_LORD[signOfHouse(Number(m[1]))] === m[2];
    if ((m = /^exch:(\d+),(\d+)$/.exec(s))) {
      const [a, b] = [Number(m[1]), Number(m[2])];
      return houseOf(signs[SIGN_LORD[signOfHouse(a)]]) === b && houseOf(signs[SIGN_LORD[signOfHouse(b)]]) === a;
    }
    if ((m = /^([\w]+(?:\+[\w]+)+)$/.exec(s))) {
      const names = m[1].split('+');
      const planets = names.map(planetOf);
      if (new Set(planets).size !== planets.length) return false; // a planet is not 'with' itself
      const sg = names.map(signOf);
      return sg.every((x) => x === sg[0]);
    }
    throw new Error(`unknown condition ${JSON.stringify(s)}`);
  };
  const andOf = (list) => {
    let out = true;
    for (const a of list) {
      const v = atom(a);
      if (v === false) return false;
      if (v === UNKNOWN) out = UNKNOWN;
    }
    return out;
  };
  const orOf = (alts) => {
    let out = false;
    for (const l of alts) {
      const v = andOf(l);
      if (v === true) return true;
      if (v === UNKNOWN) out = UNKNOWN;
    }
    return out;
  };
  return { atom, andOf, orOf };
}

/**
 * One yoga read: 'held' when every condition is true, 'unknown' when none is false but some are not checked (or only the translator's looser reading holds), 'not-checked' when
 * the yoga is nothing but strength or combustion, else 'not-held'.
 * @returns {{ status: 'held'|'unknown'|'not-checked'|'not-held', loose?: boolean, unchecked: string[] }}
 */
function readYoga(r, yoga) {
  const v = r.andOf(yoga.atoms);
  const unchecked = yoga.atoms.filter((a) => typeof a === 'string' && /^(weak|strong|combust):/.test(a));
  if (unchecked.length === yoga.atoms.length) return { status: 'not-checked', unchecked }; // nothing but strength or combustion to read
  if (v === true) return { status: 'held', unchecked };
  if (v === UNKNOWN) return { status: 'unknown', unchecked };
  if (yoga.loose && r.andOf(yoga.loose) === true) return { status: 'unknown', loose: true, unchecked };
  return { status: 'not-held', unchecked };
}

/** Every yoga of the chapter read against `facts`: [{ id, n, status, loose?, unchecked }], the general ones of v.7-8 first (id GENERAL). */
function evaluate(facts) {
  const r = reader(facts);
  const out = DATA.general.yogas.map((y) => ({ id: 'GENERAL', n: y.n, ...readYoga(r, y) }));
  for (const c of DATA.curses) for (const y of c.yogas) out.push({ id: c.id, n: y.n, ...readYoga(r, y) });
  return out;
}

const PLANET_TA = N.PLANET_TA;
const entityTa = (e) => {
  const m = /^lord(\d+)$/.exec(e);
  if (m) return `${m[1]}-ஆம் அதிபதி`;
  const h = /^h(\d+)$/.exec(e);
  if (h) return `${h[1]}-ஆம் வீடு`;
  return e === 'Gulika' ? 'குளிகன்' : PLANET_TA[e] ?? e;
};
const houses = (s) => s.split(',').map((x) => `${x}`).join(' அல்லது ');
const planetsTa = (s) => s.split(',').map(entityTa).join(', ');
const ownerTa = (e) => (e === 'mal' ? 'பாவி' : entityTa(e));

/** A condition in Tamil. */
function describe(a) {
  if (typeof a === 'object') return `(${a.or.map((l) => l.map(describe).join(' மற்றும் ')).join(' அல்லது ')})`;
  let m;
  if ((m = /^weak:(\w+)$/.exec(a))) return `${entityTa(m[1])} வலிமையற்றது (சோதிக்கப்படவில்லை)`;
  if ((m = /^strong:([\w,]+)$/.exec(a))) return `${planetsTa(m[1])} வலிமையுடன் (சோதிக்கப்படவில்லை)`;
  if ((m = /^combust:(\w+)$/.exec(a))) return `${entityTa(m[1])} அஸ்தங்கம் (சோதிக்கப்படவில்லை)`;
  if (a === 'waning') return 'சந்திரன் தேய்பிறை';
  if ((m = /^(\w+)@([\d,]+)$/.exec(a))) return `${entityTa(m[1])} ${houses(m[2])}-ஆம் வீட்டில்`;
  if ((m = /^any:([\w,]+)@(\d+)$/.exec(a))) return `${planetsTa(m[1])} ஆகியவற்றில் ஒருவர் ${m[2]}-ஆம் வீட்டில்`;
  if ((m = /^occ:(\d+)=(.+)$/.exec(a))) return m[2] === 'mal' ? `${m[1]}-ஆம் வீட்டில் பாவி` : m[2] === 'ben' ? `${m[1]}-ஆம் வீட்டில் சுபர்` : `${m[1]}-ஆம் வீட்டில் ${planetsTa(m[2])}`;
  if ((m = /^asp:(\w+)>(\w+)$/.exec(a))) return `${ownerTa(m[1])} பார்வை ${entityTa(m[2])} மீது`;
  if ((m = /^kartari:(\w+)$/.exec(a))) return `${entityTa(m[1])} பாவிகளுக்கு நடுவில்`;
  if ((m = /^deb:(\w+)$/.exec(a))) return `${entityTa(m[1])} நீச ராசியில்`;
  if ((m = /^nav:(\w+)=(\w+)$/.exec(a))) return `${entityTa(m[1])} ${ownerTa(m[2])} நவாம்சத்தில்`;
  if ((m = /^insign:(\w+)=(\w+)$/.exec(a))) return `${entityTa(m[1])} ${ownerTa(m[2])} ராசியில்`;
  if ((m = /^inim:(\w+)$/.exec(a))) return `${entityTa(m[1])} பகை ராசியில்`;
  if ((m = /^withmal:(\w+)$/.exec(a))) return `${entityTa(m[1])} பாவியுடன் சேர்ந்து`;
  if ((m = /^withben:(\w+)$/.exec(a))) return `${entityTa(m[1])} சுபருடன் சேர்ந்து`;
  if ((m = /^aspdeb:(\w+)$/.exec(a))) return `${entityTa(m[1])} நீச கிரகத்தால் பார்க்கப்படுகிறார்`;
  if ((m = /^sign:h(\d+)=([\w,]+)$/.exec(a))) return `${m[1]}-ஆம் வீடு ${m[2].split(',').map((s) => N.RASI_TA[SIGN_NAMES.indexOf(s)]).join(' அல்லது ')}`;
  if ((m = /^lord:h(\d+)=(\w+)$/.exec(a))) return `${m[1]}-ஆம் அதிபதி ${entityTa(m[2])}`;
  if ((m = /^exch:(\d+),(\d+)$/.exec(a))) return `${m[1]}-ஆம், ${m[2]}-ஆம் அதிபதிகளுக்கிடையில் வீடு பரிவர்த்தனை`;
  if ((m = /^([\w]+(?:\+[\w]+)+)$/.exec(a))) return `${m[1].split('+').map(entityTa).join(' + ')} ஒரே ராசியில்`;
  return a;
}

module.exports = { DATA, SIGN_NAMES, MALEFICS, BENEFICS, reader, readYoga, evaluate, describe };
