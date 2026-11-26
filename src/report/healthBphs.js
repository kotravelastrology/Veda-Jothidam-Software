/**
 * Health in Brihat Parashara Hora Shastra (R. Santhanam's translation, corpus C23; printed page = PDF page - 10), read on the page images 2026-10-26:
 *
 *  - ch.3 v.31 (printed p.15): the seven dhatus, bones, blood, marrow, skin, fat, semen and muscles, are denoted by the Sun to Saturn;
 *  - ch.4 v.4-4.5 (printed p.27): the limbs of Kalapurusha by the twelve signs, counted from the ascending sign (the sthoola, "broad", scheme); "for the sookshma
 *    (minute) scheme of limbs the 36 decanates are resorted to";
 *  - ch.12 (Effects of the First House) v.12-15 (printed pp.94-96): decanates and bodily limbs: the limbs that the houses stand for when the first, the second or the
 *    third decanate of the sign ascends, the visible half of the horoscope (already risen) the left side of the body, the invisible half the right; the ascendant's and the
 *    seventh house's two halves are the two sides; v.15: a malefic in a limb gives ulcers or scars, a benefic a mark (like moles). v.11 says the effects of the ascendant are
 *    to be applied to the Moon as well, so both are given;
 *  - Effects of the Sixth House v.9-28 (printed pp.116-120): diseases in general (9-12.5), the timing of illness (13-19.5) and unfortunate years (20-28), each a
 *    condition over the rasi chart with the ages the book names.
 *
 * Every rule is a condition the book states; the result is HELD, NOT_HELD or UNKNOWN and carries the ages and the harm exactly as the book words them. No rule is a
 * prediction: where the book says "will suffer", this says that the condition holds. The Tamil is my rendering of the printed English.
 *
 * Conventions that are mine, said on the page: malefic = Sun, Mars, Saturn, Rahu, Ketu (the Moon and Mercury are not counted); "inimical" is the natural enmity of
 * planetaryRelationship.js; houses are whole signs from the ascendant; the 8th lord and the 6th lord are those of the sign (Mars for Scorpio, Saturn for Aquarius).
 * Not applied: the Moon read in the place of the ascendant for the rules of the sixth house; the diseases the book assigns "by the respective significator and
 * Bhavas for relatives" (the note on printed p.116); Dr. Cornell's lists of diseases by planet that the translator quotes on printed pp.116-118 (a modern medical list,
 * not the sage's).
 */
const { naturalRelation } = require('../chart/planetaryRelationship');
const { OWN_SIGNS, EXALTATION } = require('../chart/shadbala');
const { RASI_TA: SIGN_TA } = require('../sources/tamilNames');

const SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  tradition: 'Parashari',
  file: 'C23_BPHS_Santhanam.pdf',
  pageLocus: 'Chapter 3 v.31 printed p.15; chapter 4 v.4-4.5 printed p.27; Effects of the First House v.11-15 printed pp.94-96; Effects of the Sixth House v.9-28 printed pp.116-120',
};

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது', Mandi: 'மாந்தி' };
const LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const MALEFIC = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
const ta = (l) => l.map((p) => PLANET_TA[p] ?? p).join(', ') || '—';
const norm = (x) => ((x % 360) + 360) % 360;

// ── ch.3 v.31
const DHATU = [
  ['Sun', 'Bones', 'எலும்பு'], ['Moon', 'Blood', 'இரத்தம்'], ['Mars', 'Marrow', 'மஜ்ஜை'], ['Mercury', 'Skin', 'தோல்'],
  ['Jupiter', 'Fat', 'கொழுப்பு'], ['Venus', 'Semen', 'விந்து'], ['Saturn', 'Muscles', 'தசை'],
];

// ── ch.4 v.4-4.5: the limbs of Kalapurusha, the 1st sign from the ascendant being the head
const STHOOLA = [
  ['Head', 'தலை'], ['Face', 'முகம்'], ['Arms', 'கைகள்'], ['Heart', 'இதயம்'], ['Stomach', 'வயிறு'], ['Hip', 'இடுப்பு'],
  ['Space below navel', 'தொப்புளுக்குக் கீழ்'], ['Privities', 'மறைவிடம்'], ['Thighs', 'தொடைகள்'], ['Knees', 'முழங்கால்கள்'], ['Ankles', 'கணுக்கால்கள்'], ['Feet', 'பாதங்கள்'],
];

// ── Effects of the First House v.12-14: seven limbs in the order of the houses for each decanate that ascends
const SOOKSHMA = [
  [['Head', 'தலை'], ['Eye', 'கண்'], ['Ear', 'காது'], ['Nostril (nose)', 'மூக்கு'], ['Temple', 'நெற்றிப் பொட்டு'], ['Chin', 'தாடை'], ['Face', 'முகம்']],
  [['Neck', 'கழுத்து'], ['Shoulder', 'தோள்'], ['Arm', 'கை'], ['Side of trunk', 'விலா/உடல் பக்கம்'], ['Heart', 'இதயம்'], ['Stomach', 'வயிறு'], ['Navel', 'தொப்புள்']],
  [['Pelvis', 'இடுப்பெலும்பு'], ['Anus/Penis', 'குதம்/ஆண்குறி'], ['Testicle', 'விரை'], ['Thigh', 'தொடை'], ['Knee', 'முழங்கால்'], ['Calf', 'கெண்டைக்கால்'], ['Foot', 'பாதம்']],
];

/** The limb a house stands for under the sookshma scheme: { limb, limbTa, side: 'LEFT'|'RIGHT'|'BOTH' }. Houses 12..8 are the left (risen), 2..6 the right, 1 and 7 both. */
function sookshmaLimb(house, decanate) {
  const k = house === 1 ? 0 : house === 7 ? 6 : house <= 6 ? house - 1 : 13 - house;
  const side = house === 1 || house === 7 ? 'BOTH' : house <= 6 ? 'RIGHT' : 'LEFT';
  const [limb, limbTa] = SOOKSHMA[decanate][k];
  return { limb, limbTa, side };
}
const SIDE_TA = { LEFT: 'இடது', RIGHT: 'வலது', BOTH: 'இரு பக்கமும்' };

/** The side of the body for a planet in the ascendant's or the seventh sign: the risen portion is the left, the portion yet to rise the right. */
function halfSide(house, lon, refLon) {
  if (house !== 1 && house !== 7) return null;
  const ref = house === 1 ? norm(refLon) : norm(refLon + 180);
  const sign = Math.floor(ref / 30);
  const p = norm(lon);
  if (Math.floor(p / 30) !== sign) return null;
  const before = p < ref;
  // in the ascendant's sign the longitudes below the ascendant have risen; in the seventh sign those above the descendant have
  return house === 1 ? (before ? 'LEFT' : 'RIGHT') : (before ? 'RIGHT' : 'LEFT');
}

/**
 * The limbs of one reference point (the ascendant, or the Moon as the book allows).
 * @param ref { sign, longitude }, planets { name: { longitude } }
 */
function limbsFor(ref, planets) {
  const decanate = Math.floor((norm(ref.longitude) % 30) / 10);
  const rows = Array.from({ length: 12 }, (_, i) => {
    const house = i + 1;
    const sign = (ref.sign + i) % 12;
    const s = sookshmaLimb(house, decanate);
    return { house, sign, signTa: SIGN_TA[sign], sthoola: STHOOLA[i][0], sthoolaTa: STHOOLA[i][1], sookshma: s.limb, sookshmaTa: s.limbTa, side: s.side, sideTa: SIDE_TA[s.side] };
  });
  const placed = PLANETS.map((name) => {
    const p = planets[name];
    if (!p) return null;
    const house = ((Math.floor(norm(p.longitude) / 30) - ref.sign + 12) % 12) + 1;
    const row = rows[house - 1];
    const half = halfSide(house, p.longitude, ref.longitude);
    const side = half ?? row.side;
    const malefic = MALEFIC.includes(name);
    return {
      planet: name, planetTa: PLANET_TA[name], house, sthoola: row.sthoola, sthoolaTa: row.sthoolaTa, sookshma: row.sookshma, sookshmaTa: row.sookshmaTa, side, sideTa: SIDE_TA[side],
      malefic, benefic: ['Jupiter', 'Venus'].includes(name),
      markTa: malefic ? 'பாபர்: புண் அல்லது தழும்பு (பா.15)' : ['Jupiter', 'Venus'].includes(name) ? 'சுபர்: மச்சம் போன்ற குறி (பா.15)' : null,
    };
  }).filter(Boolean);
  return { decanate: decanate + 1, rows, planets: placed };
}

/** ch.3 v.31 with the state of each planet in the chart (sign, house, dignity); the book gives no measure of "afflicted", so none is applied. */
function dhatus(facts) {
  return DHATU.map(([planet, en, taName]) => {
    const p = facts.planets[planet];
    const sign = Math.floor(norm(p.longitude) / 30);
    const dignity = EXALTATION[planet].sign === sign ? 'EXALTED' : (EXALTATION[planet].sign + 6) % 12 === sign ? 'DEBILITATED' : OWN_SIGNS[planet].includes(sign) ? 'OWN' : null;
    return {
      planet, planetTa: PLANET_TA[planet], dhatu: en, dhatuTa: taName, sign, signTa: SIGN_TA[sign], house: ((sign - facts.lagnaSign + 12) % 12) + 1,
      dignity, dignityTa: { EXALTED: 'உச்சம்', DEBILITATED: 'நீசம்', OWN: 'ஆட்சி' }[dignity] ?? null,
      withMalefics: MALEFIC.filter((q) => q !== planet && Math.floor(norm(facts.planets[q].longitude) / 30) === sign),
    };
  });
}

// ── the Sixth House chapter v.9-28
const R = (id, group, verse, page, titleTa, resultTa, status, detailTa, evidence = {}) => ({ id, group, verse, printedPage: page, titleTa, resultTa, status, detailTa, evidence });
const held = (b) => (b ? 'HELD' : 'NOT_HELD');

const GENERAL = {
  Sun: 'கட்டிகள், காய்ச்சல்', Mars: 'இரத்தக் குழாய்களில் வீக்கமும் கடினமும், காயங்கள், ஆயுத அடி', Mercury: 'பித்த நோய்', Jupiter: 'நோய் அழிவு',
  Venus: 'பெண்கள் மூலம் நோய்', Saturn: 'வாத நோய்', Rahu: 'தாழ்ந்த குலத்தவரால் ஆபத்து', Ketu: 'தொப்புள் நோய்', Moon: 'நீர் மற்றும் கப நோய்கள் (மூழ்குதல், இருமல், காசம், ஆஸ்துமா, நுரையீரல்)',
};

function sixthHouseRules(f) {
  const out = [];
  const sign = (p) => Math.floor(norm(f.planets[p].longitude) / 30);
  const house = (p) => ((sign(p) - f.lagnaSign + 12) % 12) + 1;
  const lordOf = (n) => LORD[(f.lagnaSign + n - 1) % 12];
  const l1 = lordOf(1);
  const l5 = lordOf(5);
  const l6 = lordOf(6);
  const l8 = lordOf(8);
  const l11 = lordOf(11);
  const l12 = lordOf(12);
  const same = (a, b) => sign(a) === sign(b);
  const withIn = (p) => PLANETS.filter((q) => q !== p && same(p, q));
  const exchange = (a, b) => a !== b && LORD[sign(a)] === b && LORD[sign(b)] === a;
  const w = (p) => `${PLANET_TA[p]} ${house(p)}-இல்`;

  // 9-12.5 diseases in general: the lords of the 6th and 8th in the ascendant along with a planet
  {
    const both = house(l6) === 1 && house(l8) === 1;
    const inAsc = PLANETS.filter((p) => house(p) === 1 && p !== l6 && p !== l8);
    out.push(R('SIX_9', 'general', 'v.9-12.5', '116', '6-ஆம், 8-ஆம் அதிபதிகள் லக்னத்தில், ஒரு கிரகத்துடன்', both && inAsc.length ? inAsc.map((p) => `${PLANET_TA[p]}: ${GENERAL[p]}`).join('; ') : 'சூரியன்: கட்டிகள், காய்ச்சல்; செவ்வாய்: இரத்தக் குழாய் நோய், காயம்; புதன்: பித்தம்; குரு: நோய் நீங்கல்; சுக்கிரன்: பெண்கள் மூலம்; சனி: வாதம்; ராகு: தாழ்ந்த குலத்தவரால் ஆபத்து; கேது: தொப்புள் நோய்; சந்திரன்: நீர்-கப நோய்கள்',
      both ? (inAsc.length ? 'HELD' : 'UNKNOWN') : 'NOT_HELD',
      `6-ஆம் அதிபதி ${w(l6)}, 8-ஆம் அதிபதி ${w(l8)}; லக்னத்தில் உள்ள மற்ற கிரகங்கள்: ${ta(inAsc)}. நூல்: அந்த கிரகத்துக்கு உரிய நோய். (உறவினருக்கு: அவரவர் காரகர், பாவத்தை லக்னமாக எடுக்க வேண்டும் — கணக்கிடப்படவில்லை.)`,
      { sixthLord: l6, eighthLord: l8, inAscendant: inAsc }));
  }
  // 13: Saturn with Rahu while the 6th lord and 6th house are conjunct with malefics: ill throughout life
  {
    const satRahu = same('Saturn', 'Rahu');
    const sixSign = (f.lagnaSign + 5) % 12;
    const malInSix = MALEFIC.filter((p) => sign(p) === sixSign);
    const malWithLord = MALEFIC.filter((p) => p !== l6 && same(p, l6));
    out.push(R('SIX_13', 'timing', 'v.13-19.5', '118', 'சனி ராகுவுடன்; 6-ஆம் அதிபதியும் 6-ஆம் வீடும் பாபருடன்', 'வாழ்நாள் முழுவதும் நோய்', held(satRahu && malInSix.length > 0 && malWithLord.length > 0),
      `சனி-ராகு சேர்க்கை: ${satRahu ? 'ஆம்' : 'இல்லை'}; 6-ஆம் வீட்டில் பாபர்: ${ta(malInSix)}; 6-ஆம் அதிபதி ${PLANET_TA[l6]} உடன் பாபர்: ${ta(malWithLord)}.`, { saturnWithRahu: satRahu, inSixth: malInSix, withSixthLord: malWithLord }));
  }
  // 14: Mars in the 6th while the 6th lord is in the 8th: severe fever at 6 and 12
  out.push(R('SIX_14', 'timing', 'v.13-19.5', '118', 'செவ்வாய் 6-இல்; 6-ஆம் அதிபதி 8-இல்', '6-ஆம், 12-ஆம் வயதில் கடும் காய்ச்சல்', held(house('Mars') === 6 && house(l6) === 8),
    `செவ்வாய் ${house('Mars')}-இல்; 6-ஆம் அதிபதி ${w(l6)}.`, { marsHouse: house('Mars'), sixthLordHouse: house(l6) }));
  // 15: Moon in Sagittarius/Pisces while Jupiter in the 6th: leprosy at 19 and 22
  out.push(R('SIX_15', 'timing', 'v.13-19.5', '118', 'சந்திரன் தனுசு/மீனத்தில்; குரு 6-இல்', '19-ஆம், 22-ஆம் வயதில் தோல் நோய் (குஷ்டம்)', held([8, 11].includes(sign('Moon')) && house('Jupiter') === 6),
    `சந்திரன் ${SIGN_TA[sign('Moon')]}; குரு ${house('Jupiter')}-இல்.`, { moonSign: sign('Moon'), jupiterHouse: house('Jupiter') }));
  // 16: Rahu in the 6th, the ascendant lord in the 8th, Mandi in an angle: consumption at 26
  {
    const mandiHouse = f.mandiLongitude == null ? null : ((Math.floor(norm(f.mandiLongitude) / 30) - f.lagnaSign + 12) % 12) + 1;
    const core = house('Rahu') === 6 && house(l1) === 8;
    out.push(R('SIX_16', 'timing', 'v.13-19.5', '118', 'ராகு 6-இல்; லக்னாதிபதி 8-இல்; மாந்தி கேந்திரத்தில்', '26-ஆம் வயதில் க்ஷயம் (காசநோய்)', mandiHouse === null && core ? 'UNKNOWN' : held(core && [1, 4, 7, 10].includes(mandiHouse)),
      `ராகு ${house('Rahu')}-இல்; லக்னாதிபதி ${w(l1)}; மாந்தி ${mandiHouse ?? 'தெரியவில்லை'}-இல்.`, { rahuHouse: house('Rahu'), ascendantLordHouse: house(l1), mandiHouse }));
  }
  // 17: the lords of the 6th and 12th in exchange of their signs: spleenic disorders at 29 and 30
  out.push(R('SIX_17', 'timing', 'v.13-19.5', '118', '6-ஆம், 12-ஆம் அதிபதிகள் ராசி பரிவர்த்தனை', '29-ஆம், 30-ஆம் வயதில் மண்ணீரல் நோய்', held(exchange(l6, l12)),
    `6-ஆம் அதிபதி ${w(l6)}, 12-ஆம் அதிபதி ${w(l12)}.`, { sixthLord: l6, twelfthLord: l12 }));
  // 18: Saturn and the Moon together in the 6th: blood leprosy at 45
  out.push(R('SIX_18', 'timing', 'v.13-19.5', '118', 'சனியும் சந்திரனும் 6-இல் சேர்ந்து', '45-ஆம் வயதில் இரத்த குஷ்டம்', held(house('Saturn') === 6 && house('Moon') === 6),
    `சனி ${house('Saturn')}-இல், சந்திரன் ${house('Moon')}-இல்.`, { saturnHouse: house('Saturn'), moonHouse: house('Moon') }));
  // 19: Saturn with an inimical planet while the ascendant lord is in the ascendant: windy disorders at 59
  {
    const foes = withIn('Saturn').filter((q) => PLANETS.slice(0, 7).includes(q) && naturalRelation('Saturn', q) === 'enemy');
    out.push(R('SIX_19', 'timing', 'v.13-19.5', '118', 'சனி பகை கிரகத்துடன்; லக்னாதிபதி லக்னத்தில்', '59-ஆம் வயதில் வாத நோய்', held(foes.length > 0 && house(l1) === 1),
      `சனியுடன் உள்ள பகை கிரகங்கள் (இயற்கைப் பகை): ${ta(foes)}; லக்னாதிபதி ${w(l1)}.`, { enemiesWithSaturn: foes, ascendantLordHouse: house(l1) }));
  }
  // 20-22: unfortunate years
  out.push(R('SIX_20', 'years', 'v.20-22', '119', 'சந்திரன் 6-ஆம் அதிபதியுடன்; 8-ஆம் அதிபதி 6-இல்; 12-ஆம் அதிபதி லக்னத்தில்', '8-ஆம் வயதில் விலங்குகளால் தொல்லை', held(l6 !== 'Moon' && same('Moon', l6) && house(l8) === 6 && house(l12) === 1),
    `சந்திரன்-6-ஆம் அதிபதி சேர்க்கை: ${same('Moon', l6) && l6 !== 'Moon' ? 'ஆம்' : 'இல்லை'}; 8-ஆம் அதிபதி ${w(l8)}; 12-ஆம் அதிபதி ${w(l12)}.`, {}));
  {
    const eighthFromRahu = (sign('Rahu') + 7) % 12;
    out.push(R('SIX_21', 'years', 'v.20-22', '119', 'ராகு 6-இல்; சனி அந்த ராகுவிலிருந்து 8-இல்', '1, 2-ஆம் வயதில் நெருப்பு ஆபத்து; 3-ஆம் வயதில் பறவைகளால் தீங்கு', held(house('Rahu') === 6 && sign('Saturn') === eighthFromRahu),
      `ராகு ${house('Rahu')}-இல்; சனி ராகுவிலிருந்து ${((sign('Saturn') - sign('Rahu') + 12) % 12) + 1}-ஆம் ராசியில்.`, {}));
  }
  // 23-25
  {
    const sunH = house('Sun');
    const moonFromSun = ((sign('Moon') - sign('Sun') + 12) % 12) + 1;
    out.push(R('SIX_23', 'years', 'v.23-25', '119', 'சூரியன் 6 அல்லது 8-இல்; சந்திரன் அந்த சூரியனிலிருந்து 12-இல்', '5-ஆம், 9-ஆம் வயதில் நீரால் ஆபத்து', held([6, 8].includes(sunH) && moonFromSun === 12),
      `சூரியன் ${sunH}-இல்; சந்திரன் சூரியனிலிருந்து ${moonFromSun}-ஆம் ராசியில்.`, {}));
  }
  out.push(R('SIX_24', 'years', 'v.23-25', '119', 'சனி 8-இல்; செவ்வாய் 7-இல்', '10-ஆம், 30-ஆம் வயதில் அம்மை', held(house('Saturn') === 8 && house('Mars') === 7),
    `சனி ${house('Saturn')}-இல், செவ்வாய் ${house('Mars')}-இல்.`, {}));
  {
    const d9 = (p) => (typeof f.navamshaSign === 'function' ? f.navamshaSign(p) : null);
    const rahuWith8 = same(l8, 'Rahu') && l8 !== 'Rahu';
    const place = [2, 4, 5, 11, 12].includes(house(l8));
    const navamshaHouse = f.navamshaLagnaSign == null || d9(l8) === null ? null : ((d9(l8) - f.navamshaLagnaSign + 12) % 12) + 1;
    out.push(R('SIX_25', 'years', 'v.23-25', '119', '8-ஆம் அதிபதி ராகுவுடன் 2, 4, 5, 11, 12-இல்; நவாம்சத்தில் 8-இல்', '18-ஆம், 22-ஆம் வயதில் இரத்தக் குழாய் வீக்கம், சிறுநீர் நோய்', navamshaHouse === null ? 'UNKNOWN' : held(rahuWith8 && place && navamshaHouse === 8),
      `8-ஆம் அதிபதி ${w(l8)}; ராகுவுடன் சேர்க்கை: ${rahuWith8 ? 'ஆம்' : 'இல்லை'}; நவாம்சத்தில் நவாம்ச லக்னத்திலிருந்து ${navamshaHouse ?? '—'}-ஆம் இடம். (நூலின் குறிப்பு: 2, 4, 5, 11, 12-ஆம் இடங்கள்.)`, { eighthLordHouse: house(l8), navamshaHouse }));
  }
  // 26
  out.push(R('SIX_26', 'years', 'v.26', '119', '11-ஆம், 6-ஆம் அதிபதிகள் ராசி பரிவர்த்தனை', '31-ஆம் வயதில் பகைவரால் பொருள் இழப்பு', held(exchange(l11, l6)),
    `11-ஆம் அதிபதி ${w(l11)}, 6-ஆம் அதிபதி ${w(l6)}.`, {}));
  // 27
  out.push(R('SIX_27', 'years', 'v.27', '119', '5-ஆம் அதிபதி 6-இல்; 6-ஆம் அதிபதி குருவுடன்; 12-ஆம் அதிபதி லக்னத்தில்', 'சொந்த மகன்கள் பகைவர்களாவர்', held(house(l5) === 6 && same(l6, 'Jupiter') && l6 !== 'Jupiter' && house(l12) === 1),
    `5-ஆம் அதிபதி ${w(l5)}; 6-ஆம் அதிபதி ${w(l6)} (குருவுடன்: ${same(l6, 'Jupiter') && l6 !== 'Jupiter' ? 'ஆம்' : 'இல்லை'}); 12-ஆம் அதிபதி ${w(l12)}.`, {}));
  // 28
  out.push(R('SIX_28', 'years', 'v.28', '120', 'லக்னாதிபதியும் 6-ஆம் அதிபதியும் ராசி பரிவர்த்தனை', '10-ஆம், 19-ஆம் வயதில் நாயிடமிருந்து பயம்', held(exchange(l1, l6)),
    `லக்னாதிபதி ${w(l1)}, 6-ஆம் அதிபதி ${w(l6)}.`, {}));
  return out;
}

/**
 * @param facts { lagnaSign, lagnaLongitude, planets: { Sun..Ketu: { longitude } }, mandiLongitude?, navamshaSign: (planet) => sign, navamshaLagnaSign? }
 */
function evaluateHealth(facts) {
  const moonSign = Math.floor(norm(facts.planets.Moon.longitude) / 30);
  const rules = sixthHouseRules(facts);
  return {
    source: SOURCE,
    dhatus: dhatus(facts),
    limbs: {
      lagna: limbsFor({ sign: facts.lagnaSign, longitude: facts.lagnaLongitude }, facts.planets),
      moon: limbsFor({ sign: moonSign, longitude: facts.planets.Moon.longitude }, facts.planets),
    },
    rules,
    summary: { held: rules.filter((r) => r.status === 'HELD').length, notHeld: rules.filter((r) => r.status === 'NOT_HELD').length, unknown: rules.filter((r) => r.status === 'UNKNOWN').length },
    conventions: [
      'பாப கிரகங்கள் = சூரியன், செவ்வாய், சனி, ராகு, கேது; சுபர் (உறுப்புக் குறிக்கு) = குரு, சுக்கிரன் (என் மரபு)',
      'வீடுகள் லக்னத்திலிருந்து முழு ராசி; "பகை" = இயற்கைப் பகை',
      'நூல் "நோய் வரும்" என்பதை இங்கே "நிபந்தனை உள்ளது" என்று மட்டும் காட்டுகிறோம்; வயது நூலில் உள்ளபடி',
    ],
  };
}

module.exports = { evaluateHealth, limbsFor, dhatus, sookshmaLimb, halfSide, sixthHouseRules, SOURCE, STHOOLA, SOOKSHMA, DHATU, MALEFIC };
