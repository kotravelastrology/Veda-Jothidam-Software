/**
 * Gemstones — what each book says to wear for a given chart.
 *
 * PL9 has gem worksheets (Gem Recommendations, Lucky Stone, Gem Stone #1/#2).
 * The books held give three different methods and disagree about particular
 * gems for the same Ascendant, so this does not recommend a gem. It shows each
 * book's answer for the chart, each with its page, lays them side by side, and
 * says where they agree.
 *
 * The books come back in the order the owner set on 2026-10-03 — the book that
 * explains most first (`BOOK_RANK` in gemstoneTables.js holds the measure).
 *
 * Nothing here is a prediction, and no benefit is claimed for wearing a gem.
 * Where a book names results, they are returned as that book's words.
 *
 * What is computed is only what the books' own rules need: the houses each
 * planet rules from the Ascendant (and from the Moon sign), where each planet
 * stands, whether it is in its own sign, exalted or debilitated, and which
 * planets share a sign. The books' qualifications that need judgement — "if
 * the planet is afflicted", "if the chart shows long life", "the stronger of
 * Ascendant and Moon sign" — are named as not judged, not decided.
 */

const { RASI_LORD } = require('../chart/karaka');
const { EXALTATION, DEBILITATION, OWN_SIGNS } = require('../chart/shadbala');
const { UnsupportedInputError } = require('../contracts/chartContext');
const T = require('./gemstoneTables');
const KB = require('./gemstoneKapoor');
const { WEARING, UNIT_TA } = require('./gemstoneWearing');

const RASI_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];
const GEM_PLANET = {
  Ruby: 'Sun', Pearl: 'Moon', 'White pearl': 'Moon', 'Red coral': 'Mars', Coral: 'Mars', Emerald: 'Mercury',
  'Yellow sapphire': 'Jupiter', Diamond: 'Venus', 'Blue sapphire': 'Saturn',
};
const DUSTHANA = [6, 8, 12];
const KENDRA = [1, 4, 7, 10];
const BOOK_NAME_TA = { kapoor: 'காபூர்', tilakRaj: 'திலக் ராஜ்', rajKumar: 'ராஜ் குமார்' };

const assertSign = (n, what) => {
  if (!Number.isInteger(n) || n < 0 || n > 11) throw new UnsupportedInputError(`${what} must be an integer 0-11`, what);
};

/** The houses each planet rules, counted from `pointSign`. Rahu and Ketu rule none. */
function lordships(pointSign) {
  assertSign(pointSign, 'pointSign');
  const out = {};
  for (const p of T.PLANETS) out[p] = [];
  for (let house = 1; house <= 12; house += 1) out[RASI_LORD[(pointSign + house - 1) % 12]].push(house);
  return out;
}

/** Where a planet stands, counted from the Ascendant, and its dignity there. Null without a chart. */
function placement(planet, lagna, rasi) {
  if (!rasi) return null;
  const sign = rasi[planet];
  const house = ((sign - lagna + 12) % 12) + 1;
  const graha = T.PLANETS.includes(planet);
  return {
    sign, signTa: RASI_TA[sign], house,
    own: graha ? OWN_SIGNS[planet].includes(sign) : false,
    exalted: graha ? EXALTATION[planet].sign === sign : false,
    debilitated: graha ? DEBILITATION[planet].sign === sign : false,
  };
}

/** The Tamil sentence for one of Tilak Raj's entries, built from its fields so it cannot drift from them. */
function describeEntry(e, planet) {
  const pTa = T.PLANET_TA[planet];
  const parts = [T.VERDICTS[e.v].ta];
  const when = [];
  if (e.dasha) when.push(`${pTa} தசையில்`);
  if (e.houses) when.push(`${pTa} ${e.houses.join(', ')}-ஆம் இடத்தில் இருந்தால்`);
  if (e.own && e.exalted) when.push('சொந்த ராசி அல்லது உச்சத்தில்');
  else if (e.own) when.push('சொந்த ராசியில் இருந்தால்');
  if (when.length) parts.push(when.join('; '));
  if (e.with?.length) parts.push(`${e.with.map((g) => T.PLANET_GEMS[g].ta).join(' + ')} உடன் சேர்த்து`);
  if (e.eyeTrouble) parts.push('கண் நோய் இருந்தால் அணியலாம்');
  if (e.extremeNeed) parts.push('தீவிரத் தேவையில் மட்டும்');
  if (e.duhsthana) parts.push('நூல்: "துஸ்தான அதிபதி"');
  if (e.printedAsEmerald) parts.push('நூலில் இங்கு "Emerald" என்று அச்சிடப்பட்டுள்ளது — அச்சுப் பிழையாகத் தோன்றுகிறது');
  return parts.join(' — ');
}

/** Raj Kumar's two lordship rules, evaluated for a point of count. Strength and yogakaraka are not judged. */
function rajKumarRules(pointSign, rasi) {
  const lords = lordships(pointSign);
  return T.PLANETS.map((p) => {
    const has = (set) => lords[p].some((h) => set.includes(h));
    const dignity = rasi
      ? (EXALTATION[p].sign === rasi[p] ? 'EXALTED' : DEBILITATION[p].sign === rasi[p] ? 'DEBILITATED' : OWN_SIGNS[p].includes(rasi[p]) ? 'OWN' : null)
      : null;
    return {
      planet: p, houses: lords[p], dignity,
      rule123: has([1, 5, 9]),
      rule45910: has([1, 4, 5, 9, 10]),
      forbiddenLords: has([6, 7, 8, 12]),
      conflict: has([1, 5, 9]) && has([6, 7, 8, 12]),
    };
  });
}

/**
 * Kapoor's general rule (printed pp.77-78), as a class. Used by the test to set
 * his own per-Ascendant paragraphs against it; the page shows the paragraphs.
 */
function kapoorClass(planet, lagna, houses) {
  if (RASI_LORD[lagna] === planet) return 'RULING';
  if (houses.length === 0) return 'NO_LORDSHIP';
  if (houses.every((h) => DUSTHANA.includes(h))) return 'DUSTHANA_ONLY';
  if (houses.some((h) => DUSTHANA.includes(h))) return 'MIXED_LORDSHIP';
  return 'AUSPICIOUS_ONLY';
}

const fill = (s, planet) => s.replaceAll('{p}', T.PLANET_TA[planet]);
const gemNames = (planets) => planets.map((p) => T.PLANET_GEMS[p].ta).join(', ');

function caseMatches(c, planet, place, rasi) {
  if (c.at && !c.at.includes(place.house)) return false;
  if (c.own && !place.own) return false;
  if (c.exalted && !place.exalted) return false;
  if (c.withPlanet && rasi[c.withPlanet] !== rasi[planet]) return false;
  if (c.withAny && !c.withAny.some((q) => rasi[q] === rasi[planet])) return false;
  return true;
}

function describeCase(c, planet) {
  const pTa = T.PLANET_TA[planet];
  const where = [];
  if (c.at) where.push(`${c.at.join(', ')}-ஆம் இடத்தில்`);
  if (c.own) where.push('சொந்த ராசியில்');
  if (c.exalted) where.push('உச்சத்தில்');
  if (c.withPlanet) where.push(`${T.PLANET_TA[c.withPlanet]} சேர்க்கையுடன்`);
  if (c.withAny) where.push(`${c.withAny.map((q) => T.PLANET_TA[q]).join(' அல்லது ')} சேர்க்கையுடன்`);
  return `${pTa} ${where.join(' ')} இருந்தால் — ${fill(KB.KAPOOR_VERDICTS[c.v].ta, planet)}`;
}

/** Kapoor's paragraph for this planet and Ascendant, with its condition settled against the chart where it can be. */
function kapoorReading(planet, lagna, rasi, actualLords) {
  const e = KB.KAPOOR_BY_GEM[planet][lagna];
  const place = placement(planet, lagna, rasi);
  let verdict = e.v;
  let matched = null;
  if (e.cases && place) {
    const i = e.cases.findIndex((c) => caseMatches(c, planet, place, rasi));
    if (i >= 0) { matched = i; verdict = e.cases[i].v; }
  }
  let stance = KB.KAPOOR_VERDICTS[verdict].stance;
  let status = e.cases ? (place ? (matched === null ? 'NO_CASE' : 'CASE') : 'NEEDS_CHART') : 'PLAIN';
  if (status === 'NEEDS_CHART') stance = 'COND';
  if (status === 'NO_CASE' && e.notJudged?.includes('WELL_PLACED')) stance = 'COND';

  const extras = [];
  if (e.charm) extras.push(KB.KAPOOR_EXTRA_TA.charm);
  if (e.must) extras.push(fill(KB.KAPOOR_EXTRA_TA[`must:${e.must}`], planet));
  if (e.alwaysIf) extras.push(KB.KAPOOR_EXTRA_TA[`alwaysIf:${e.alwaysIf}`]);
  if (e.outsideDashaIf) extras.push(KB.KAPOOR_EXTRA_TA[`outsideDashaIf:${e.outsideDashaIf}`]);
  if (e.evenOwn) extras.push(KB.KAPOOR_EXTRA_TA.evenOwn);
  if (e.dashaAllowed) extras.push(KB.KAPOOR_EXTRA_TA.dashaAllowed);
  if (e.note) extras.push(KB.KAPOOR_EXTRA_TA[e.note]);
  for (const c of e.cites ?? []) extras.push(KB.KAPOOR_EXTRA_TA[c]);

  let evaluationTa = null;
  if (e.cases && place) {
    const where = `${T.PLANET_TA[planet]} ${place.house}-ஆம் இடத்தில் (${place.signTa}${place.own ? ', சொந்த ராசி' : ''}${place.exalted ? ', உச்சம்' : ''}${place.debilitated ? ', நீசம்' : ''})`;
    evaluationTa = matched === null
      ? `இந்த ஜாதகத்தில் ${where} — நூல் சொல்லும் நிலைகள் எதுவும் இல்லை.`
      : `இந்த ஜாதகத்தில் ${where} — நிபந்தனை ${matched + 1} பொருந்துகிறது.`;
  }

  let verdictTa = fill(KB.KAPOOR_VERDICTS[verdict].ta, planet);
  if (status === 'NO_CASE' && verdict === 'ONLY_THESE') verdictTa += ' — இந்த ஜாதகத்தில் அந்த நிலைகள் இல்லை';
  if (status === 'NEEDS_CHART') verdictTa += ' — நிபந்தனையைச் சரிபார்க்க ஜாதகம் தேவை';

  return {
    verdict, base: e.v, verdictTa, baseTa: fill(KB.KAPOOR_VERDICTS[e.v].ta, planet),
    stance, status, matchedCase: matched,
    casesTa: (e.cases ?? []).map((c) => describeCase(c, planet)),
    evaluationTa,
    dashaEmphasis: Boolean(e.dasha),
    with: e.with ?? [], withTa: e.with ? gemNames(e.with) : null,
    also: e.also ?? [], alsoTa: e.also ? gemNames(e.also) : null,
    reasonsTa: (e.reasons ?? []).map((r) => KB.KAPOOR_REASONS_TA[r]),
    resultsTa: (e.results ?? []).map((r) => KB.KAPOOR_RESULTS_TA[r]),
    notJudgedTa: (e.notJudged ?? []).map((n) => KB.KAPOOR_NOT_JUDGED_TA[n]),
    extrasTa: extras,
    slipTa: e.slip ? KB.KAPOOR_SLIPS[e.slip].ta : null,
    statedLords: e.lords,
    omittedLords: actualLords.filter((x) => !e.lords.includes(x)),
    misstatedLords: e.lords.filter((x) => !actualLords.includes(x)),
    page: `printed p.${e.page}`,
  };
}

/** Kapoor's rule for Rahu's and Ketu's gems (printed p.99), settled against the chart. */
function kapoorNodes(lagna, rasi) {
  const lords = lordships(lagna);
  const lordOf = (h) => RASI_LORD[(lagna + h - 1) % 12];
  const trineLords = [...new Set([1, 5, 9].map(lordOf))];
  const yogakarakas = T.PLANETS.filter((p) => lords[p].some((h) => [4, 7, 10].includes(h)) && lords[p].some((h) => [5, 9].includes(h)));
  const one = (node) => {
    if (!rasi) return { status: 'NEEDS_CHART', stance: 'COND', house: null, with: [] };
    const house = ((rasi[node] - lagna + 12) % 12) + 1;
    const conj = T.PLANETS.filter((p) => rasi[p] === rasi[node]);
    const inHouse = KB.KAPOOR_NODES.houses.includes(house);
    const withTrineLord = conj.filter((p) => trineLords.includes(p));
    const withYogakaraka = conj.filter((p) => yogakarakas.includes(p));
    const withOther = conj.filter((p) => !withTrineLord.includes(p) && !withYogakaraka.includes(p) && lords[p].some((h) => !DUSTHANA.includes(h)));
    const status = inHouse || withTrineLord.length || withYogakaraka.length ? 'MET' : withOther.length ? 'JUDGE' : 'NOT_MET';
    const why = [];
    if (inHouse) why.push(`${house}-ஆம் இடத்தில் உள்ளது`);
    if (withTrineLord.length) why.push(`திரிகோண அதிபதி ${withTrineLord.map((p) => T.PLANET_TA[p]).join(', ')} சேர்க்கை`);
    if (withYogakaraka.length) why.push(`யோககாரகர் ${withYogakaraka.map((p) => T.PLANET_TA[p]).join(', ')} சேர்க்கை`);
    if (status === 'JUDGE') why.push(`${withOther.map((p) => T.PLANET_TA[p]).join(', ')} சேர்க்கை — அவர் "சுப பாவ அதிபதியா" என்பதை நூல் வரையறுக்கவில்லை`);
    if (status === 'NOT_MET') why.push(`${house}-ஆம் இடம்; நூல் சொல்லும் இடமோ சேர்க்கையோ இல்லை`);
    return { status, stance: status === 'MET' ? 'FAV' : status === 'JUDGE' ? 'COND' : 'UNFAV', house, with: conj, whyTa: why.join('; ') };
  };
  return {
    rahu: one('Rahu'), ketu: one('Ketu'),
    trineLords, yogakarakas,
    textTa: KB.KAPOOR_NODES.textTa, page: KB.KAPOOR_NODES.source.pageLocus,
    countingTa: 'திரிகோணம் = 1, 5, 9; யோககாரகர் = ஒரு கேந்திரம் (4, 7, 10), ஒரு திரிகோணம் (5, 9) இரண்டுக்கும் அதிபதி — காபூர் தன் உதாரணங்களில் யோககாரகர் என்று அழைப்பவை (கடகம், சிம்மத்துக்குச் செவ்வாய்; மகரம், கும்பத்துக்குச் சுக்கிரன்; துலாத்துக்குச் சனி) இந்த வரையறையுடன் பொருந்துகின்றன.',
  };
}

/** Raj Kumar's "who should wear" for this planet and Ascendant. */
function rajKumarWho(planet, lagna, rasi, actualLords, moonSign) {
  const w = T.RAJ_KUMAR_WHO[planet];
  const place = placement(planet, lagna, rasi);
  const inList = (k) => (w[k] ?? []).includes(lagna);
  const named = ['good', 'ownOrExalted', 'limited', 'not'].filter(inList);
  let status;
  if (named.length > 1) status = 'CONTRADICTS';
  else if (inList('good')) status = 'GOOD';
  else if (inList('ownOrExalted')) status = place ? ((place.own || place.exalted) ? 'GOOD' : 'CONDITION_NOT_MET') : 'NEEDS_CHART';
  else if (inList('limited')) status = 'LIMITED';
  else if (inList('not')) status = 'NOT';
  else status = planet === 'Jupiter' ? 'RULE_ONLY' : 'NOT_NAMED';

  const flags = [];
  if (named.length > 1) flags.push(`இதே பகுதியில் இந்த லக்னம் "${named.map((k) => RK_LIST_TA[k]).join('" , "')}" இரண்டிலும் உள்ளது — நூலுக்குள் முரண்.`);
  const lordClash = (w.avoidIfLordOf ?? []).filter((h) => actualLords.includes(h));
  if (lordClash.length && ['GOOD', 'LIMITED', 'NEEDS_CHART', 'CONTRADICTS'].includes(status)) {
    flags.push(`அதே பகுதி: ${T.PLANET_TA[planet]} ${w.avoidIfLordOf.join(', ')}-ஆம் அதிபதியாக இருந்தால் அணியக் கூடாது — இங்கு ${lordClash.join(', ')}-ஆம் அதிபதி. நூலுக்குள் முரண்.`);
  }
  if (place) {
    if (w.avoidIfHouse?.includes(place.house)) flags.push(`${T.PLANET_TA[planet]} ${place.house}-ஆம் இடத்தில் — நூல்: ${w.avoidIfHouse.join(', ')}-ல் இருந்தால் அணியக் கூடாது.`);
    if (w.avoidIf?.includes('DEBILITATED') && place.debilitated) flags.push(`${T.PLANET_TA[planet]} நீசம் — நூல்: நீசமெனில் அணியக் கூடாது.`);
    if (w.extraIf && (place.exalted || (place.own && KENDRA.includes(place.house)))) {
      flags.push(place.exalted ? `${T.PLANET_TA[planet]} உச்சம் — நூல்: கூடுதல் நன்மை.` : `${T.PLANET_TA[planet]} கேந்திரத்தில் சொந்த ராசியில் (பஞ்ச மகாபுருஷ யோகம்) — நூல்: கூடுதல் நன்மை.`);
    }
    if (w.notUnless && status === 'NOT') {
      const moonKendra = moonSign === null ? false : KENDRA.includes(((rasi.Jupiter - moonSign + 12) % 12) + 1);
      const ok = place.exalted || place.own || moonKendra;
      flags.push(ok
        ? `ஆனால் குரு ${place.exalted ? 'உச்சம்' : place.own ? 'சொந்த ராசி' : 'சந்திரனிலிருந்து கேந்திரத்தில் (கஜகேசரி; "நல்ல" என்பது மதிப்பிடப்படவில்லை)'} — நூல்: குரு தசை / புத்தியில் அணியலாம்.`
        : 'குரு உச்சம், சொந்த ராசி, கஜகேசரி எதுவும் இல்லை.');
    }
    if (planet === 'Saturn' && place.house === 1 && [8, 11, 10, 9, 6].includes(place.sign)) flags.push('லக்னத்தில் சனி — நூல் மேற்கோள் காட்டும் பிருஹஜ்ஜாதக நிலை: மிக நன்மை என்கிறது.');
    if (planet === 'Saturn' && place.house === 7) flags.push('சனி 7-ல் திக்பலம் — நூல்: கூடுதல் நன்மை.');
  }
  return { status, statusTa: RK_STATUS_TA[status], flagsTa: flags, textTa: w.textTa, page: w.page };
}
const RK_LIST_TA = { good: 'ஏற்றது', ownOrExalted: 'சொந்த/உச்சத்தில் ஏற்றது', limited: 'குறைந்த அளவில்', not: 'கூடாது' };
const RK_STATUS_TA = {
  GOOD: 'இந்த லக்னத்துக்கு ஏற்றது என்று பெயரிட்டுள்ளது',
  CONDITION_NOT_MET: 'சொந்த / உச்ச ராசியில் இருந்தால் மட்டும் — இங்கு இல்லை',
  NEEDS_CHART: 'சொந்த / உச்ச ராசியில் இருந்தால் மட்டும் — ஜாதகம் தேவை',
  LIMITED: 'குறைந்த அளவில் / தசையில் மட்டும்',
  NOT: 'இந்த லக்னத்துக்குக் கூடாது என்கிறது',
  CONTRADICTS: 'இந்த லக்னத்தை ஏற்றது, கூடாது இரண்டிலும் சொல்கிறது',
  RULE_ONLY: 'லக்னப் பட்டியல் இல்லை — "சுப பாவ அதிபதி" என்ற விதி மட்டும்',
  NOT_NAMED: 'இந்த லக்னத்தைக் குறிப்பிடவில்லை',
};

/** Tilak Raj's per-Ascendant tables and the general rules on printed p.20, for one planet. */
function tilakRajExtras(planet, lagna, rasi, actualLords, stance) {
  const ratnaRow = T.TILAK_RAJ_RATNA.rows[lagna];
  const role = ['jeevan', 'karaka', 'bhagya'].find((k) => ratnaRow[k] === planet) ?? null;
  const cls = T.TILAK_RAJ_PLANET_CLASS.rows[lagna];
  const listed = cls.yogakaraka.includes(planet) ? 'YOGAKARAKA' : cls.malefic.includes(planet) ? 'MALEFIC' : null;
  const place = placement(planet, lagna, rasi);
  const notes = [];
  if (role && place && (place.own || place.exalted)) notes.push(`${place.own ? 'சொந்த ராசியில்' : 'உச்சத்தில்'} உள்ளது — நூல் (ப.20): ஏற்கனவே வலிமை, ரத்தினம் தேவையில்லை.`);
  if (role && place?.debilitated) notes.push('திரிகோண அதிபதி நீசம் — நூல் (ப.20): அவரது ரத்தினம் கூடாது.');
  const rule212 = actualLords.filter((h) => h === 2 || h === 12);
  if (rule212.length && stance === 'FAV') notes.push(`இதே நூல் ப.20: 2, 12-ஆம் அதிபதிகளின் ரத்தினம் கூடாது — இங்கு ${rule212.join(', ')}-ஆம் அதிபதி, ஆனால் லக்னவாரித் தீர்ப்பு சாதகம். நூலுக்குள் முரண்.`);
  const classConflict = (listed === 'YOGAKARAKA' && stance === 'UNFAV') || (listed === 'MALEFIC' && stance === 'FAV');
  if (classConflict) notes.push(`இதே நூலின் ப.21 அட்டவணை இவரை "${listed === 'YOGAKARAKA' ? 'யோககாரகர்' : 'பாப / மாரகர்'}" என்கிறது; லக்னவாரித் தீர்ப்பு அதற்கு எதிர். நூலுக்குள் முரண்.`);
  return { ratnaRole: role, ratnaRoleTa: role ? RATNA_TA[role] : null, classListed: listed, classConflict, rule212Clash: rule212.length > 0 && stance === 'FAV', notesTa: notes };
}
const RATNA_TA = { jeevan: 'ஜீவன ரத்தினம் (லக்ன அதிபதி)', karaka: 'காரக ரத்தினம் (5-ஆம் அதிபதி)', bhagya: 'பாக்கிய ரத்தினம் (9-ஆம் அதிபதி)' };

const stanceOf = (v) => T.VERDICTS[v].stance;

function agreementOf(stances) {
  const spoken = stances.filter(Boolean);
  const set = new Set(spoken);
  if (set.has('FAV') && set.has('UNFAV')) return 'DISAGREE';
  if (spoken.length <= 1) return spoken.length === 0 ? 'NONE' : 'ONE_SOURCE';
  if (set.size === 1) return set.has('FAV') ? 'AGREE_FAVOURABLE' : set.has('UNFAV') ? 'AGREE_UNFAVOURABLE' : 'PARTIAL';
  return 'PARTIAL';
}

/** 3.25 -> "3¼": the books print quarters and halves as fractions. */
function fmtWeight(n) {
  const whole = Math.floor(n);
  const frac = { 0: '', 0.25: '¼', 0.5: '½', 0.75: '¾' }[Math.round((n - whole) * 100) / 100];
  if (frac === undefined) return String(n);
  return `${whole > 0 ? whole : ''}${frac}` || '0';
}

function wearingRows() {
  const order = [...T.PLANETS, 'Rahu', 'Ketu'];
  return order.map((planet) => ({
    planet, planetTa: T.PLANET_TA[planet], gemTa: T.PLANET_GEMS[planet].ta,
    books: Object.fromEntries(T.BOOK_RANK.order.map(({ key }) => {
      const g = WEARING[key].gems[planet];
      const amount = g.weight.max ? `${fmtWeight(g.weight.min)}-${fmtWeight(g.weight.max)}` : `≥ ${fmtWeight(g.weight.min)}`;
      const weightTa = `${amount} ${UNIT_TA[g.weight.unit]}${g.weight.printed ? ` (அச்சில் "${g.weight.printed}")` : ''}${g.weight.note ? ` — ${g.weight.note}` : ''}`;
      return [key, {
        weight: g.weight, weightTa, metalTa: g.metal, fingerTa: g.finger, whenTa: g.when,
        notWith: g.notWith, notWithTa: gemNames(g.notWith) + (g.lostLine ? ' … (PDF-ல் ஒரு வரி விடுபட்டுள்ளது)' : ''),
        goodWithTa: g.goodWith ? gemNames(g.goodWith) : null,
        lifeTa: g.life ?? null, substitutesTa: g.substitutes ?? null, extraTa: g.extraTa ?? null,
        page: key === 'rajKumar' ? `PDF ${g.page}` : `printed p.${g.page}`,
      }];
    })),
  }));
}

/**
 * @param lagna  Ascendant sign 0-11
 * @param moon   Moon sign 0-11 (for Raj Kumar's "Ascendant or Moon sign")
 * @param rasi   optional sign of each graha (for the books' placement conditions)
 */
function gemReading({ lagna, moon, rasi = null }) {
  assertSign(lagna, 'lagna');
  assertSign(moon, 'moon');
  if (rasi) for (const g of [...T.PLANETS, 'Rahu', 'Ketu']) assertSign(rasi[g], `rasi.${g}`);

  const lords = lordships(lagna);
  const lagnaLord = RASI_LORD[lagna];
  const kapoorRow = T.KAPOOR_RULING_STONE.table[lagna];
  const tr = T.TILAK_RAJ_BY_SIGN[lagna];
  const rkLagna = T.RAJ_KUMAR_TABLE.rows[lagna];
  const rkMoon = T.RAJ_KUMAR_TABLE.rows[moon];
  const rkStance = (row, planet) => {
    const listedIn = (list) => list.some((g) => GEM_PLANET[g] === planet);
    return listedIn(row.benefic) ? 'BENEFIC' : listedIn(row.malefic) ? 'MALEFIC' : null;
  };

  const rows = T.PLANETS.map((planet) => {
    const entry = tr[planet];
    const actual = lords[planet];
    const kapoor = kapoorReading(planet, lagna, rasi, actual);
    const trStance = stanceOf(entry.v);
    const lg = rkStance(rkLagna, planet);
    const mn = rkStance(rkMoon, planet);
    const rkLagnaStance = lg === 'BENEFIC' ? 'FAV' : lg === 'MALEFIC' ? 'UNFAV' : null;
    return {
      planet, planetTa: T.PLANET_TA[planet],
      gem: T.PLANET_GEMS[planet].en, gemTa: T.PLANET_GEMS[planet].ta, alsoCalled: T.PLANET_GEMS[planet].alsoCalled ?? null,
      actualLords: actual, place: placement(planet, lagna, rasi),
      kapoor,
      tilakRaj: {
        verdict: entry.v, verdictTa: T.VERDICTS[entry.v].ta, textTa: describeEntry(entry, planet), stance: trStance,
        statedLords: entry.lords,
        omittedLords: actual.filter((x) => !entry.lords.includes(x)),
        misstatedLords: entry.lords.filter((x) => !actual.includes(x)),
        dasha: Boolean(entry.dasha),
        ...tilakRajExtras(planet, lagna, rasi, actual, trStance),
      },
      rajKumarLagna: { listed: lg, stance: rkLagnaStance },
      rajKumarMoon: { listed: mn, stance: mn === 'BENEFIC' ? 'FAV' : mn === 'MALEFIC' ? 'UNFAV' : null },
      rajKumarWho: rajKumarWho(planet, lagna, rasi, actual, rasi ? rasi.Moon : null),
      agreement: agreementOf([kapoor.stance, trStance, rkLagnaStance]),
    };
  });

  // Rahu and Ketu: Kapoor and Tilak Raj give a rule from the chart; Raj Kumar says only "in their dasha".
  const N = T.TILAK_RAJ_NODES;
  const gomedStatus = N.gomed.favourableLagnas.includes(lagna) ? 'FAV'
    : N.gomed.notLagnas.includes(lagna) ? 'NOT_FOR_THIS_LAGNA' : 'NOT_UNLESS_ESSENTIAL';
  const ketuHouse = rasi ? ((rasi.Ketu - lagna + 12) % 12) + 1 : null;
  const kn = kapoorNodes(lagna, rasi);
  const ketuFav = ketuHouse === null ? null : N.catsEye.favourableKetuHouses.includes(ketuHouse);
  const nodes = {
    rahu: {
      gem: T.PLANET_GEMS.Rahu.en, gemTa: T.PLANET_GEMS.Rahu.ta, status: gomedStatus,
      stance: gomedStatus === 'FAV' ? 'FAV' : 'UNFAV', textTa: N.gomed.textTa,
      sourcePage: N.gomed.source.pageLocus,
      kapoor: kn.rahu, rajKumar: { textTa: T.RAJ_KUMAR_WHO.Rahu.textTa, page: T.RAJ_KUMAR_WHO.Rahu.page },
      agreement: agreementOf([kn.rahu.stance, gomedStatus === 'FAV' ? 'FAV' : 'UNFAV']),
    },
    ketu: {
      gem: T.PLANET_GEMS.Ketu.en, gemTa: T.PLANET_GEMS.Ketu.ta, ketuHouse,
      houseFavourable: ketuFav,
      conditionNotJudged: 'கேது பாதகம்/பலவீனம்/அஸ்தமனம் என்பது மதிப்பிடப்படவில்லை',
      textTa: N.catsEye.textTa, sourcePage: N.catsEye.source.pageLocus,
      kapoor: kn.ketu, rajKumar: { textTa: T.RAJ_KUMAR_WHO.Ketu.textTa, page: T.RAJ_KUMAR_WHO.Ketu.page },
      agreement: agreementOf([kn.ketu.stance, ketuFav === null ? null : ketuFav ? 'COND' : 'UNFAV']),
    },
  };

  const counts = rows.reduce((a, r) => { a[r.agreement] = (a[r.agreement] ?? 0) + 1; return a; }, {});
  const books = T.BOOK_RANK.order.map((b, i) => ({
    key: b.key, rank: i + 1, nameTa: BOOK_NAME_TA[b.key], title: T.SOURCES[{ kapoor: 'KAPOOR', tilakRaj: 'TILAK_RAJ', rajKumar: 'RAJ_KUMAR' }[b.key]].title,
    author: T.SOURCES[{ kapoor: 'KAPOOR', tilakRaj: 'TILAK_RAJ', rajKumar: 'RAJ_KUMAR' }[b.key]].author,
    words: b.words, range: b.range, whatTa: b.whatTa,
  }));
  const pack = (r) => ({ id: r.id, textTa: r.textTa, page: r.source.pageLocus, title: r.source.title });

  return {
    lagna, lagnaTa: RASI_TA[lagna], moon, moonTa: RASI_TA[moon], lagnaLord,
    books,
    bookRank: { measureTa: T.BOOK_RANK.measureTa, decided: T.BOOK_RANK.decided, alternative: T.BOOK_RANK.alternative },
    planetGems: Object.fromEntries(Object.entries(T.PLANET_GEMS).map(([p, g]) => [p, { ...g, planetTa: T.PLANET_TA[p] }])),
    planetGemsSource: { title: T.PLANET_GEMS_SOURCE.title, page: T.PLANET_GEMS_SOURCE.pageLocus },
    tamilNamesNote: T.TAMIL_NAMES_NOTE,
    kapoor: {
      rulingStone: { planet: kapoorRow.lord, gem: kapoorRow.gem, gemTa: T.PLANET_GEMS[kapoorRow.lord].ta },
      page: T.KAPOOR_RULING_STONE.source.pageLocus,
      sectionPage: KB.KAPOOR_SECTION.pageLocus,
      nodes: { trineLords: kn.trineLords, yogakarakas: kn.yogakarakas, textTa: kn.textTa, page: kn.page, countingTa: kn.countingTa },
    },
    rows, nodes, agreementCounts: counts,
    tilakRaj: {
      page: T.TILAK_RAJ_SOURCE.pageLocus,
      ratna: T.TILAK_RAJ_RATNA.rows[lagna], ratnaPage: T.TILAK_RAJ_RATNA.source.pageLocus,
      planetClass: T.TILAK_RAJ_PLANET_CLASS.rows[lagna], planetClassPage: T.TILAK_RAJ_PLANET_CLASS.source.pageLocus,
    },
    tilakRajPage: T.TILAK_RAJ_SOURCE.pageLocus,
    rajKumar: {
      lagnaRow: { benefic: rkLagna.benefic, malefic: rkLagna.malefic },
      moonRow: { benefic: rkMoon.benefic, malefic: rkMoon.malefic },
      rulesFromLagna: rajKumarRules(lagna, rasi), rulesFromMoon: rajKumarRules(moon, rasi),
      notes: T.RAJ_KUMAR_TABLE.notes, page: T.RAJ_KUMAR_TABLE.source.pageLocus,
      whoPage: T.RAJ_KUMAR_WHO_SOURCE.pageLocus,
      counter: T.RAJ_KUMAR_COUNTER.rows.map((r) => ({ ...r, dashaLordTa: T.PLANET_TA[r.dashaLord], gemTa: T.PLANET_GEMS[r.gemOf].ta })),
      counterGeneralTa: T.PLANET_GEMS[T.RAJ_KUMAR_COUNTER.general].ta,
      counterPage: T.RAJ_KUMAR_COUNTER.source.pageLocus,
      notJudged: ['"வலிமையான" (Ascendant அல்லது Moon sign — எது வலிமை)', 'யோககாரகன்', 'அஸ்தமனம்'],
    },
    wearing: wearingRows(),
    wearingGeneral: Object.fromEntries(T.BOOK_RANK.order.map(({ key }) => [key, { textTa: WEARING[key].general, page: WEARING[key].source.pageLocus }])),
    rules: {
      kapoor: T.RULES.kapoor.map(pack),
      tilakRaj: T.RULES.tilakRaj.map(pack),
      rajKumar: T.RULES.rajKumar.map(pack),
    },
  };
}

module.exports = {
  gemReading, lordships, placement, describeEntry, kapoorClass, kapoorReading, kapoorNodes, rajKumarRules, rajKumarWho,
  agreementOf, GEM_PLANET, RASI_TA, PLANETS: T.PLANETS, TILAK_RAJ_BY_SIGN: T.TILAK_RAJ_BY_SIGN, VERDICTS: T.VERDICTS,
};
