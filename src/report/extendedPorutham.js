/**
 * விரிவான 15 நட்சத்திரப் பொருத்தம் (Extended 15-item Porutham) — a SECOND,
 * separate matching system alongside the classical 10 Dasakoot
 * ([[tamilPorutham.js]]), ported from the prior AstrologicLab
 * `matching/MatchingResults.tsx` `calcExtendedPorutham` (source: the
 * "Marriage" reference workbook, rows 228-264 / MarriageCalc per-nakshatra
 * attribute tables FM3:GF29 and related columns).
 *
 * DISCLOSED SIMPLIFICATIONS (carried over from the source, not resolved
 * here): "ஏக தினம்" uses a fixed special-nakshatra list — the source
 * workbook's nested dasha/position exception branches were never fully
 * traced there. "நாடி", "பஞ்சபூதம்", "பஞ்சபட்சி" and "விருட்சம்" reuse the
 * SAME already-verified per-nakshatra logic used elsewhere in Kotravel
 * ([[classicalMuhurta.js]]'s Pañca-pakṣi bird table) rather than a second,
 * slightly-different-looking source table for the same underlying concept.
 *
 * Inputs are each native's Moon nakshatra index (0-26), Moon/Sun rasi index
 * and longitude (for waxing/waning paksha). Convention: "girl" = bride,
 * "boy" = groom (asymmetric rules, several counted from the girl's star).
 */
const { naturalRelation } = require('../chart/planetaryRelationship');
const { birthBird, pakshaFromElongation, BIRD_TA, BIRD_ORDER } = require('./classicalMuhurta');

const norm360 = (d) => ((d % 360) + 360) % 360;

// நட்சத்திர ஜாதி: 6-tier cycle.
const NAK_JATHI_NAMES = ['பிராமணம்', 'க்ஷத்திரியம்', 'வைசியம்', 'சூத்திரம்', 'பஞ்சமம்', 'சங்கரம்'];

// நட்சத்திர கோத்திரம்: 7 rishi-gothra groups.
const GOTHRAM_BOUNDS = [
  [3, 'மரீசி'], [7, 'அத்ரி'], [11, 'வசிஷ்டர்'], [15, 'புலஸ்தியர்'],
  [19, 'அங்கிரஸர்'], [23, 'புலஹர்'], [26, 'க்ருது'], [27, 'க்ருது'],
];
function gothram(nak0) {
  for (const [upTo, name] of GOTHRAM_BOUNDS) if (nak0 < upTo) return name;
  return 'க்ருது';
}

// சந்திரயோக அதிபதி: 8-planet cycle.
const CHANDRA_YOGA_PLANET = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];
const TAMIL_BY_GRAHA = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு',
};
function chandraYogaMaitri(p1, p2) {
  if (p1 === p2) return 'நட்பு';
  if (p1 === 'Rahu' || p2 === 'Rahu') return 'சமம்';   // outside BPHS naisargika maitri's 7 grahas
  const rel = naturalRelation(p1, p2);
  return rel === 'friend' ? 'நட்பு' : rel === 'enemy' ? 'பகை' : 'சமம்';
}

// யோகினி திசை: 8-direction cycle.
const YOGINI_DIRECTION = ['கிழக்கு', 'தென்கிழக்கு', 'தெற்கு', 'தென்மேற்கு', 'மேற்கு', 'வடமேற்கு', 'வடக்கு', 'வடகிழக்கு'];

// லிங்கம் (நட்சத்திர பாலினம்): explicit 27-value list.
const LINGAM_GENDER = [
  'ஆண்', 'பெண்', 'ஆண்', 'ஆண்', 'அலி', 'பெண்', 'ஆண்', 'ஆண்', 'ஆண்', 'பெண்', 'பெண்', 'பெண்',
  'ஆண்', 'பெண்', 'பெண்', 'பெண்', 'ஆண்', 'பெண்', 'அலி', 'பெண்', 'பெண்', 'ஆண்', 'பெண்', 'அலி',
  'ஆண்', 'ஆண்', 'பெண்',
];

// Viruksham (tree): [name, isHardwood(vyiram/milkless)].
const NAKSHATRA_TREE = [
  ['எட்டி', true], ['நெல்லி', true], ['அத்தி', false], ['நாவல்', false], ['கருங்காலி', true],
  ['செங்கால்', true], ['மூங்கில்', true], ['அரசு', false], ['புன்னை', false], ['ஆல்', false],
  ['பலா', false], ['அலரி', false], ['ஆத்தி', false], ['வில்வம்', true], ['மருது', true],
  ['விளா', true], ['மகிழ்', false], ['பராசு', false], ['சண்பகம்', false], ['வஞ்சி', false],
  ['பலா', false], ['எருக்கு', false], ['வன்னி', true], ['கடம்பு', true], ['வேம்பு', false],
  ['மகிழ்', false], ['இலுப்பை', false],
];

// Pancha Bhootam (element): 0 Earth,1 Water,2 Fire,3 Air,4 Ether.
const NAKSHATRA_BHOOTAM = [
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4,
];
const BHOOTAM_NAMES = ['மண்', 'நீர்', 'நெருப்பு', 'காற்று', 'ஆகாயம்'];

// Nadi: 0 Aadi, 1 Madhya, 2 Antya.
const NAKSHATRA_NADI = [
  0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1,
];
const NADI_NAMES = ['ஆதி', 'மத்தி', 'அந்தி'];

// Bird enmity — paksha-dependent 5-cycle of enemy pairs (indices into BIRD_ORDER
// = ['vulture','owl','crow','cock','peacock']).
const WAXING_BIRD_ENEMY_PAIRS = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 4]];
const WANING_BIRD_ENEMY_PAIRS = [[0, 1], [0, 3], [1, 4], [2, 3], [2, 4]];
function birdsAreEnemies(bird1, waxing1, bird2, waxing2) {
  const i1 = BIRD_ORDER.indexOf(bird1);
  const i2 = BIRD_ORDER.indexOf(bird2);
  const pairs1 = waxing1 ? WAXING_BIRD_ENEMY_PAIRS : WANING_BIRD_ENEMY_PAIRS;
  const pairs2 = waxing2 ? WAXING_BIRD_ENEMY_PAIRS : WANING_BIRD_ENEMY_PAIRS;
  const hits = (pairs) => pairs.some(([a, b]) => (a === i1 && b === i2) || (a === i2 && b === i1));
  return hits(pairs1) || hits(pairs2);
}

// "ஒரே நாள்" (Yeka Dinam) special-nakshatra list — disclosed simplification.
const YEKA_DINAM_NAKSHATRAS = new Set([3, 5, 7, 9, 12, 21]); // Rohini, Ardra, Pushya, Magha, Hasta, Shravana

// தசா சந்தி — birth Mahadasha lord cycle (Ketu-first Vimshottari order).
const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
function birthMahaLord(nak0) { return DASHA_ORDER[nak0 % 9]; }

/**
 * @param girl/boy { nakshatraIndex, rasiIndex, moonLongitude, sunLongitude }
 * @returns { rows: [{name, verdict, note}], passed, total, level }
 */
function calculateExtendedPorutham(girl, boy) {
  const girlNak = girl.nakshatraIndex;
  const boyNak = boy.nakshatraIndex;
  const dist = ((boyNak - girlNak + 27) % 27) + 1;      // girl -> boy count, 1-27
  const distRev = ((girlNak - boyNak + 27) % 27) + 1;   // boy -> girl count, 1-27
  const rows = [];

  // 1. ஏக தினம்
  const yekaOk = YEKA_DINAM_NAKSHATRAS.has(girlNak) && YEKA_DINAM_NAKSHATRAS.has(boyNak);
  rows.push({ name: 'ஏக தினம்', verdict: yekaOk ? 'உத்தமம்' : 'பொருந்தாதது', note: 'சிறப்பு நட்சத்திர பட்டியலில் இருவரும் உள்ளனரா' });

  // 2. ராசி வர்ணம் — rank(rasi0) = (rasi0+9)%4, 0 highest .. 3 lowest.
  const varnamNames = ['பிராமணர்', 'க்ஷத்திரியர்', 'வைஷியர்', 'சூத்திரர்'];
  const girlVarnam = (girl.rasiIndex + 9) % 4;
  const boyVarnam = (boy.rasiIndex + 9) % 4;
  rows.push({
    name: 'ராசி வர்ணம்',
    verdict: boyVarnam === girlVarnam ? 'உத்தமம்' : boyVarnam > girlVarnam ? 'மத்திமம்' : 'பொருந்தாதது',
    note: `பெண்: ${varnamNames[girlVarnam]}, ஆண்: ${varnamNames[boyVarnam]}`,
  });

  // 3. நட்சத்திர ஜாதி
  const girlJ = girlNak % 6;
  const boyJ = boyNak % 6;
  rows.push({ name: 'நட்சத்திர ஜாதி', verdict: girlJ === boyJ ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${NAK_JATHI_NAMES[girlJ]}, ஆண்: ${NAK_JATHI_NAMES[boyJ]}` });

  // 4. நட்சத்திர கோத்திரம் — must DIFFER
  const gG = gothram(girlNak);
  const gB = gothram(boyNak);
  rows.push({ name: 'நட்சத்திர கோத்திரம்', verdict: gG !== gB ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${gG}, ஆண்: ${gB}` });

  // 5. சந்திரயோக வர்க்கம் — adhipati planets must be friendly
  const cyG = CHANDRA_YOGA_PLANET[girlNak % 8];
  const cyB = CHANDRA_YOGA_PLANET[boyNak % 8];
  const cyRel = chandraYogaMaitri(cyG, cyB);
  rows.push({
    name: 'சந்திரயோக வர்க்கம்',
    verdict: cyRel === 'நட்பு' ? 'உத்தமம்' : cyRel === 'சமம்' ? 'மத்திமம்' : 'பொருந்தாதது',
    note: `பெண்: ${TAMIL_BY_GRAHA[cyG]}, ஆண்: ${TAMIL_BY_GRAHA[cyB]}`,
  });

  // 6. யோகினி பொருத்தம் — same direction
  const yG = YOGINI_DIRECTION[girlNak % 8];
  const yB = YOGINI_DIRECTION[boyNak % 8];
  rows.push({ name: 'யோகினி பொருத்தம்', verdict: yG === yB ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${yG}, ஆண்: ${yB}` });

  // 7. ஆய பொருத்தம் — fails only when nakshatra-distance is exactly 24
  rows.push({ name: 'ஆய பொருத்தம்', verdict: dist !== 24 ? 'உத்தமம்' : 'பொருந்தாதது', note: `எண்: ${dist}` });

  // 8. விருட்ச பொருத்தம் — fails only when BOTH trees are hardwood/milkless
  const [gTree, gHard] = NAKSHATRA_TREE[girlNak % 27];
  const [bTree, bHard] = NAKSHATRA_TREE[boyNak % 27];
  rows.push({ name: 'விருட்ச பொருத்தம்', verdict: !(gHard && bHard) ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${gTree}, ஆண்: ${bTree}` });

  // 9. பஞ்சபட்சி பொருத்தம் — paksha-dependent bird + paksha-dependent enemy table
  const gWaxing = pakshaFromElongation(girl.moonLongitude, girl.sunLongitude) === 'shukla';
  const bWaxing = pakshaFromElongation(boy.moonLongitude, boy.sunLongitude) === 'shukla';
  const gBird = birthBird(girlNak, gWaxing ? 'shukla' : 'krishna');
  const bBird = birthBird(boyNak, bWaxing ? 'shukla' : 'krishna');
  const birdBad = birdsAreEnemies(gBird, gWaxing, bBird, bWaxing);
  rows.push({
    name: 'பஞ்சபட்சி பொருத்தம்', verdict: !birdBad ? 'உத்தமம்' : 'பொருந்தாதது',
    note: `பெண்: ${BIRD_TA[gBird]} (${gWaxing ? 'வளர்பிறை' : 'தேய்பிறை'}), ஆண்: ${BIRD_TA[bBird]} (${bWaxing ? 'வளர்பிறை' : 'தேய்பிறை'})`,
  });

  // 10. லிங்க பொருத்தம் — same nakshatra-gender category
  const lG = LINGAM_GENDER[girlNak % 27];
  const lB = LINGAM_GENDER[boyNak % 27];
  rows.push({ name: 'லிங்க பொருத்தம்', verdict: lG === lB ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${lG}, ஆண்: ${lB}` });

  // 11. விருத்தி பொருத்தம் — MOD(dist*12,9): both sides ==9 -> உத்தமம், both ==6 -> மத்திமம்
  const vG = (dist * 12) % 9;
  const vB = (distRev * 12) % 9;
  rows.push({
    name: 'விருத்தி பொருத்தம்',
    verdict: (vG === 9 && vB === 9) ? 'உத்தமம்' : (vG === 6 && vB === 6) ? 'மத்திமம்' : 'பொருந்தாதது',
    note: `எண்: ${dist}/${distRev}`,
  });

  // 12. ஆயுள் பொருத்தம் — smaller |dist*7-27| favoured; pass if boy's <= girl's
  const aG = Math.abs(dist * 7 - 27);
  const aB = Math.abs(distRev * 7 - 27);
  rows.push({ name: 'ஆயுள் பொருத்தம்', verdict: aB <= aG ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${aG}, ஆண்: ${aB}` });

  // 13. தசா சந்தி — birth Mahadasha lords must differ
  const dG = birthMahaLord(girlNak);
  const dB = birthMahaLord(boyNak);
  rows.push({ name: 'தசா சந்தி', verdict: dG !== dB ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${TAMIL_BY_GRAHA[dG]}, ஆண்: ${TAMIL_BY_GRAHA[dB]}` });

  // 14. நாடி பொருத்தம் — must differ
  const nG = NAKSHATRA_NADI[girlNak % 27];
  const nB = NAKSHATRA_NADI[boyNak % 27];
  rows.push({ name: 'நாடி பொருத்தம்', verdict: nG !== nB ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${NADI_NAMES[nG]}, ஆண்: ${NADI_NAMES[nB]}` });

  // 15. பஞ்சபூதம் — same element, or the classical Water/Fire pairing
  const bhG = NAKSHATRA_BHOOTAM[girlNak % 27];
  const bhB = NAKSHATRA_BHOOTAM[boyNak % 27];
  const bhOk = bhG === bhB || (bhG === 1 && bhB === 2) || (bhG === 2 && bhB === 1);
  rows.push({ name: 'பஞ்சபூதம்', verdict: bhOk ? 'உத்தமம்' : 'பொருந்தாதது', note: `பெண்: ${BHOOTAM_NAMES[bhG]}, ஆண்: ${BHOOTAM_NAMES[bhB]}` });

  const passed = rows.filter((r) => r.verdict === 'உத்தமம்').length;
  const partial = rows.filter((r) => r.verdict === 'மத்திமம்').length;
  const level = passed >= 12 ? 'உத்தமம்' : passed + partial >= 10 ? 'மத்திமம்' : passed + partial >= 7 ? 'சாதாரணம்' : 'குறைவு';

  return { rows, passed, partial, total: rows.length, level };
}

module.exports = { calculateExtendedPorutham };
