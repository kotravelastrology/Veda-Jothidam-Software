/**
 * VJ-028 — the research predicate language.
 *
 * A cohort is "the charts in my library where X". This is X: a small,
 * explicitly-typed tree over facts the engines actually compute, and nothing
 * else. There is deliberately no free-text or expression form — a predicate
 * that could say anything could not be replayed, hashed, or shown back to the
 * practitioner in words.
 *
 * Every predicate here reads a fact from `chartFacts()`. If the engine does
 * not compute something, there is no predicate for it: there is no
 * retrograde test, because `calculateParashariChart` returns no retrograde
 * flag. (The ephemeris layer beneath it *does* compute `longitudeSpeed`, whose
 * sign is what retrogression means — `/astronomy` reads it directly. Adding
 * the predicate is therefore a matter of carrying that field up through
 * `chartFacts`, not of inventing anything.) Until it is carried up, a
 * predicate that guessed at it would quietly produce a cohort whose
 * membership meant nothing.
 */

const { UnsupportedInputError } = require('../contracts/chartContext');

const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const RASI_TA = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
  'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்',
];
const GRAHA_TA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது',
};
const NAKSHATRA_TA = [
  'அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];

const isInt = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;

/**
 * Each predicate declares how to validate itself, how to evaluate it, and how
 * to say it in Tamil. Keeping the three together means a new predicate cannot
 * be added that the UI can describe but the validator does not check.
 */
const KINDS = {
  grahaInHouse: {
    fields: ['graha', 'house'],
    check: (p) => {
      if (!GRAHAS.includes(p.graha)) throw new UnsupportedInputError(`unknown graha ${p.graha}`, 'graha');
      if (!isInt(p.house, 1, 12)) throw new UnsupportedInputError('house must be 1-12', 'house');
    },
    test: (p, f) => f.grahas[p.graha].house === p.house,
    describe: (p) => `${GRAHA_TA[p.graha]} ${p.house}ஆம் பாவத்தில்`,
  },
  grahaInRasi: {
    fields: ['graha', 'rasi'],
    check: (p) => {
      if (!GRAHAS.includes(p.graha)) throw new UnsupportedInputError(`unknown graha ${p.graha}`, 'graha');
      if (!isInt(p.rasi, 0, 11)) throw new UnsupportedInputError('rasi must be 0-11', 'rasi');
    },
    test: (p, f) => f.grahas[p.graha].rasiIndex === p.rasi,
    describe: (p) => `${GRAHA_TA[p.graha]} ${RASI_TA[p.rasi]} ராசியில்`,
  },
  grahaInNakshatra: {
    fields: ['graha', 'nakshatra'],
    check: (p) => {
      if (!GRAHAS.includes(p.graha)) throw new UnsupportedInputError(`unknown graha ${p.graha}`, 'graha');
      if (!isInt(p.nakshatra, 0, 26)) throw new UnsupportedInputError('nakshatra must be 0-26', 'nakshatra');
    },
    test: (p, f) => f.grahas[p.graha].nakshatraIndex === p.nakshatra,
    describe: (p) => `${GRAHA_TA[p.graha]} ${NAKSHATRA_TA[p.nakshatra]} நட்சத்திரத்தில்`,
  },
  lagnaRasi: {
    fields: ['rasi'],
    check: (p) => { if (!isInt(p.rasi, 0, 11)) throw new UnsupportedInputError('rasi must be 0-11', 'rasi'); },
    test: (p, f) => f.lagna.rasiIndex === p.rasi,
    describe: (p) => `${RASI_TA[p.rasi]} லக்னம்`,
  },
  conjunct: {
    fields: ['grahas'],
    check: (p) => {
      if (!Array.isArray(p.grahas) || p.grahas.length !== 2) {
        throw new UnsupportedInputError('conjunct takes exactly two grahas', 'grahas');
      }
      for (const g of p.grahas) {
        if (!GRAHAS.includes(g)) throw new UnsupportedInputError(`unknown graha ${g}`, 'grahas');
      }
      if (p.grahas[0] === p.grahas[1]) {
        throw new UnsupportedInputError('a graha is not conjunct itself', 'grahas');
      }
    },
    test: (p, f) => f.grahas[p.grahas[0]].rasiIndex === f.grahas[p.grahas[1]].rasiIndex,
    describe: (p) => `${GRAHA_TA[p.grahas[0]]}–${GRAHA_TA[p.grahas[1]]} சேர்க்கை`,
  },
  navamsaRasi: {
    fields: ['graha', 'rasi'],
    check: (p) => {
      if (!GRAHAS.includes(p.graha)) throw new UnsupportedInputError(`unknown graha ${p.graha}`, 'graha');
      if (!isInt(p.rasi, 0, 11)) throw new UnsupportedInputError('rasi must be 0-11', 'rasi');
    },
    test: (p, f) => f.navamsa[p.graha] === p.rasi,
    describe: (p) => `நவாம்சத்தில் ${GRAHA_TA[p.graha]} ${RASI_TA[p.rasi]} ராசியில்`,
  },
  sarvaAtLeast: {
    fields: ['rasi', 'bindus'],
    check: (p) => {
      if (!isInt(p.rasi, 0, 11)) throw new UnsupportedInputError('rasi must be 0-11', 'rasi');
      if (!isInt(p.bindus, 0, 56)) throw new UnsupportedInputError('bindus must be 0-56', 'bindus');
    },
    test: (p, f) => f.sarva[p.rasi] >= p.bindus,
    describe: (p) => `${RASI_TA[p.rasi]} ராசியில் சர்வாஷ்டகவர்க்கம் ${p.bindus}+`,
  },
  and: {
    fields: ['of'],
    combinator: true,
    test: (p, f, evaluate) => p.of.every((sub) => evaluate(sub, f)),
    describe: (p, describe) => p.of.map(describe).join(' மற்றும் '),
  },
  or: {
    fields: ['of'],
    combinator: true,
    test: (p, f, evaluate) => p.of.some((sub) => evaluate(sub, f)),
    describe: (p, describe) => `(${p.of.map(describe).join(' அல்லது ')})`,
  },
  not: {
    fields: ['of'],
    unary: true,
    test: (p, f, evaluate) => !evaluate(p.of, f),
    describe: (p, describe) => `${describe(p.of)} — இல்லாதவை`,
  },
};

const MAX_DEPTH = 8;

/**
 * Rejects anything that is not a well-formed predicate, before a cohort runs.
 *
 * Unknown fields are an error rather than being ignored: a typo in a field
 * name would otherwise silently widen the cohort, and the run would look
 * successful.
 */
function assertPredicate(p, depth = 0, path = 'predicate') {
  if (depth > MAX_DEPTH) {
    throw new UnsupportedInputError(`${path}: nested deeper than ${MAX_DEPTH}`, 'depth');
  }
  if (!p || typeof p !== 'object' || Array.isArray(p)) {
    throw new UnsupportedInputError(`${path} must be an object`, 'predicate');
  }
  const kind = KINDS[p.kind];
  if (!kind) {
    throw new UnsupportedInputError(`${path}: unknown predicate kind ${JSON.stringify(p.kind)}`, 'kind');
  }
  const allowed = new Set(['kind', ...kind.fields]);
  for (const key of Object.keys(p)) {
    if (!allowed.has(key)) {
      throw new UnsupportedInputError(`${path}: unexpected field ${key} on ${p.kind}`, key);
    }
  }
  for (const field of kind.fields) {
    if (p[field] === undefined) {
      throw new UnsupportedInputError(`${path}: ${p.kind} requires ${field}`, field);
    }
  }

  if (kind.combinator) {
    if (!Array.isArray(p.of) || p.of.length < 1) {
      throw new UnsupportedInputError(`${path}: ${p.kind} needs at least one operand`, 'of');
    }
    p.of.forEach((sub, i) => assertPredicate(sub, depth + 1, `${path}.of[${i}]`));
  } else if (kind.unary) {
    assertPredicate(p.of, depth + 1, `${path}.of`);
  } else {
    kind.check(p);
  }
  return p;
}

function evaluate(p, facts) {
  return KINDS[p.kind].test(p, facts, evaluate);
}

/** The predicate in Tamil, so a saved cohort can be read back by a person. */
function describePredicate(p) {
  return KINDS[p.kind].describe(p, describePredicate);
}

/**
 * Key-order-independent text for hashing, so two predicates that differ only
 * in how their fields were typed out are the same cohort.
 */
function canonicalisePredicate(p) {
  if (Array.isArray(p)) return p.map(canonicalisePredicate);
  if (p && typeof p === 'object') {
    return Object.fromEntries(
      Object.keys(p).sort().map((k) => [k, canonicalisePredicate(p[k])]),
    );
  }
  return p;
}

module.exports = {
  KINDS, GRAHAS, RASI_TA, GRAHA_TA, NAKSHATRA_TA, MAX_DEPTH,
  assertPredicate, evaluate, describePredicate, canonicalisePredicate,
};
