/**
 * K.S. Krishnamurti, Reader IV "Marriage and Married Life" (corpus C32), as rules over the KP chart that kpSystem.js builds.
 * Each rule is a condition the book states, with the printed page; the engine reports HELD, NOT_HELD or UNKNOWN and the planets and
 * houses behind it. It never gives a verdict, a date or a prediction: where the book says "will", this says "the condition holds".
 *
 * "Signifies" is the book's own list (printed pp.110, 118, 187): a planet signifies a house when it stands in the star of an occupant
 * of that house, occupies it, stands in the star of its owner, or owns it, which is houseSignificators' four levels.
 *
 * Not applied, because the book gives no measure: conjunction and aspect (the book says "Western aspects" without an orb), the
 * agent rule for Rahu and Kethu (printed p.121, which needs conjunction), and the sex of the child (printed p.211: "no rule applicable
 * in all cases"). Rules whose wording needs the Mars dosha live in mangalaDosha.js; dasa sandhi, eka-dasa and "karako bhava nasaya"
 * are rejected by the author and are not rules.
 *
 * Input: the object returned by calculateKpSystem.
 */

const { describePartner } = require('./kpPartnerDescription');
const { describeJudge } = require('./kpJudge');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader IV: Marriage and Married Life',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C32_KP_Reader_IV_Marriage_Children_KSK.pdf',
  pageLocus: 'Marriage, divorce and children chapters',
};

const DUAL_SIGNS = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
const BARREN_SIGNS = ['Aries', 'Leo', 'Gemini', 'Virgo'];
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const ptaList = (l) => l.map((p) => PLANET_TA[p] ?? p).join(', ');
const hl = (l) => [...l].sort((a, b) => a - b).join(', ');

/** The twelfth and the eighth house counted from house n (the book's "12 to n" and "8 to n"). */
const twelfthFrom = (n) => ((n - 2 + 12) % 12) + 1;
const eighthFrom = (n) => ((n + 6) % 12) + 1;

function context(kp) {
  const planets = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  const cusps = Object.fromEntries(kp.cusps.map((c) => [c.number, c]));
  const sigRows = Object.fromEntries(kp.houseSignificators.map((h) => [h.house, h]));
  const signifies = (name) => {
    const out = [];
    for (let h = 1; h <= 12; h += 1) {
      const r = sigRows[h];
      if (r && [r.level1, r.level2, r.level3, r.level4].some((l) => l.includes(name))) out.push(h);
    }
    return out;
  };
  /** planets that signify any house of `houses` */
  const significatorsOf = (houses) => Object.keys(planets).filter((n) => signifies(n).some((h) => houses.includes(h)));
  const subLordOf = (cuspNo) => cusps[cuspNo].sub;
  const starLordOfPlanet = (n) => planets[n].starLord;
  const dualOrMercury = (n) => n === 'Mercury' || DUAL_SIGNS.includes(planets[n].sign);
  return { planets, cusps, sigRows, signifies, significatorsOf, subLordOf, starLordOfPlanet, dualOrMercury, kp };
}

const held = (v) => (v ? 'HELD' : 'NOT_HELD');

function rule(id, group, title, pages, status, detail, evidence = {}, extra = {}) {
  return { id, group, titleTa: title, printedPages: pages, status, detailTa: detail, evidence, ...extra };
}

function marriageRules(c) {
  const out = [];
  const sub7 = c.subLordOf(7);
  const sig7 = c.signifies(sub7);
  const hit = sig7.filter((h) => [2, 7, 11].includes(h));
  out.push(rule('M_PROMISE', 'marriage', 'திருமணம் உறுதியா (7-ஆம் கஸ்ப் உப-அதிபதி)', '106, 121', held(hit.length > 0),
    `7-ஆம் கஸ்ப்பின் உப-அதிபதி ${PLANET_TA[sub7]}; அது குறிக்கும் பாவங்கள்: ${hl(sig7) || '—'}. 2, 7, 11-இல் ${hit.length ? hl(hit) + ' உள்ளன' : 'எதுவும் இல்லை'}.`,
    { subLord: sub7, signifies: sig7, matching: hit }));
  const bad = sig7.filter((h) => [4, 6, 10].includes(h));
  out.push(rule('M_DENIAL', 'marriage', 'திருமணத் தடை (உப-அதிபதி 4, 6, 10-உடன் தொடர்பு)', '106', held(bad.length > 0),
    `நூலின் எளிய விதி: 7-ஆம் கஸ்ப் உப-அதிபதி 4, 6, 10-ஆம் பாவங்களுடன் தொடர்புடையதெனில் திருமணம் மறுக்கப்படும். இங்கு ${PLANET_TA[sub7]} குறிப்பவற்றில் 4/6/10: ${bad.length ? hl(bad) : 'இல்லை'}.${hit.length && bad.length ? ' (2/7/11 உம் உண்டு — நூல் இரண்டையும் ஒப்பிடும் முறையைத் தரவில்லை; முடிவு தரப்படவில்லை.)' : ''}`,
    { subLord: sub7, signifies: sig7, matching: bad }));

  const star7 = c.starLordOfPlanet(sub7);
  const second7 = c.dualOrMercury(sub7) || c.dualOrMercury(star7);
  out.push(rule('M_SECOND_7', 'marriage', 'இரண்டாம் திருமணம் (7-ஆம் கஸ்ப்)', '181', held(second7),
    `7-ஆம் கஸ்ப் உப-அதிபதி ${PLANET_TA[sub7]} (ராசி ${c.planets[sub7].sign}); அது நிற்கும் நட்சத்திரத்தின் அதிபதி ${PLANET_TA[star7]} (ராசி ${c.planets[star7].sign}). உப-அதிபதி அல்லது நட்சத்திர அதிபதி புதன் அல்லது இருசுவபாவ ராசியில் இருந்தால் இரண்டாம் திருமணம் உறுதி என்கிறது.`,
    { subLord: sub7, starLord: star7, signs: [c.planets[sub7].sign, c.planets[star7].sign] }));
  const sub6 = c.subLordOf(6);
  const star6 = c.starLordOfPlanet(sub6);
  const second6 = c.dualOrMercury(sub6) || c.dualOrMercury(star6);
  out.push(rule('M_SECOND_6_AS_PRINTED', 'marriage', 'இரண்டாம் திருமணம் (6-ஆம் கஸ்ப் — நூலில் அச்சிட்டபடி)', '182', held(second6),
    `ப.182-இல் இதே விதி "6-ஆம் கஸ்ப் உப-அதிபதி" என்று தொடங்கி பின்னர் 7-ஆம் கஸ்ப் என்று முடிகிறது; நூலில் முரண். அச்சிட்டபடி 6-ஆம் கஸ்ப்புக்கும் கணக்கிடப்பட்டது: உப-அதிபதி ${PLANET_TA[sub6]} (ராசி ${c.planets[sub6].sign}), நட்சத்திர அதிபதி ${PLANET_TA[star6]}.`,
    { subLord: sub6, starLord: star6 }, { printedContradiction: true }));

  const sat = c.planets.Saturn;
  const moon = c.planets.Moon;
  const a = sat.starLord === 'Moon' && sat.sub === 'Saturn';
  const b = moon.starLord === 'Saturn' && moon.sub === 'Moon';
  const houseOk = [1, 3, 6, 7, 10].includes(sat.house);
  out.push(rule('M_PUNARPHOO', 'marriage', 'புனர்பூ (சனி–சந்திரன் தொடர்பு: திருமணத்தில் தடங்கல்)', '78', held((a || b) && houseOk),
    `சனி சந்திரனின் நட்சத்திரத்தில், சனியின் உப-பிரிவில் இருக்க வேண்டும்: ${a ? 'ஆம்' : 'இல்லை'}; அல்லது சந்திரன் சனியின் நட்சத்திரத்தில், சந்திரன் உப-பிரிவில்: ${b ? 'ஆம்' : 'இல்லை'}; மேலும் சனி 1, 3, 6, 7, 10-ஆம் பாவத்தில் இருக்க வேண்டும் (இங்கு ${sat.house}): ${houseOk ? 'ஆம்' : 'இல்லை'}.`,
    { saturnInMoonStarAndOwnSub: a, moonInSaturnStarAndOwnSub: b, saturnHouse: sat.house }));

  const satSig = c.signifies('Saturn');
  const satHit = satSig.filter((h) => [2, 7, 11].includes(h));
  out.push(rule('M_SATURN_DELAY', 'marriage', 'சனி 2, 7, 11-உடன் தொடர்பு (தாமதம்)', '107', held(satHit.length > 0),
    `சனி குறிக்கும் பாவங்கள்: ${hl(satSig) || '—'}. 2, 7, 11-உடன் தொடர்பு உள்ளதெனில் ஒவ்வொரு காலத்திலும் தாமதம் என்கிறது. (சனி இவற்றைப் பார்வை மட்டும் செய்தால் மறுப்பு என்றும் நூல் கூறுகிறது — பார்வை கணக்கிடப்படவில்லை.)`,
    { signifies: satSig, matching: satHit }));

  const happy = ['Jupiter', 'Venus'].includes(sub7) && sig7.some((h) => [2, 11].includes(h));
  out.push(rule('M_HAPPY_SUB', 'marriage', 'இனிய மணவாழ்வு (7-ஆம் கஸ்ப் உப-அதிபதி குரு அல்லது சுக்கிரன்)', '80', held(happy),
    `7-ஆம் கஸ்ப் உப-அதிபதி குரு அல்லது சுக்கிரனாக இருந்து 2 அல்லது 11-ஐக் குறிக்க வேண்டும். இங்கு ${PLANET_TA[sub7]}; குறிப்பவை ${hl(sig7) || '—'}.`,
    { subLord: sub7, signifies: sig7 }));

  const sub4 = c.subLordOf(4);
  const sig4 = c.signifies(sub4);
  const career = sig4.filter((h) => [4, 8, 12].includes(h));
  out.push(rule('M_CAREER_WIFE', 'marriage', 'பணிபுரியும் துணை (4-ஆம் கஸ்ப் உப-அதிபதி)', '98', held(career.length > 0),
    `4-ஆம் கஸ்ப் உப-அதிபதி ${PLANET_TA[sub4]}; 4, 8 அல்லது 12-ஐக் குறித்தால் பணிபுரியும் துணை. இங்கு குறிப்பவை ${hl(sig4) || '—'}.`,
    { subLord: sub4, signifies: sig4, matching: career }));

  // age difference by the lords of the 7th cusp (printed p.84)
  const ageOf = (p) => (p === 'Saturn' ? 'MUCH' : ['Jupiter', 'Venus', 'Sun'].includes(p) ? 'PROPER' : ['Mars', 'Mercury', 'Moon'].includes(p) ? 'LITTLE' : 'NODE');
  const ageTa = { MUCH: 'வயது வேறுபாடு அதிகம் (துணை முதிர்ந்தவர்)', PROPER: 'தகுந்த வயது வேறுபாடு', LITTLE: 'வயது வேறுபாடு மிகக் குறைவு (துணை இளையவர்)', NODE: 'ராகு/கேது — அவை குறிக்கும் கிரகத்தைப் பார்த்துப் படிக்க வேண்டும்' };
  out.push(rule('M_AGE', 'marriage', 'துணையின் வயது வேறுபாடு (7-ஆம் கஸ்ப் நட்சத்திர/உப-அதிபதி)', '84', 'INFO',
    `நட்சத்திர அதிபதி ${PLANET_TA[c.cusps[7].starLord]}: ${ageTa[ageOf(c.cusps[7].starLord)]}; உப-அதிபதி ${PLANET_TA[sub7]}: ${ageTa[ageOf(sub7)]}.`,
    { starLord: c.cusps[7].starLord, subLord: sub7 }));
  return out;
}

function divorceRules(c) {
  const out = [];
  const union = c.significatorsOf([2, 7, 11]);
  const apart = c.significatorsOf([1, 6, 10, 12]);
  const both = union.filter((p) => apart.includes(p));
  out.push(rule('D_SEPARATION', 'divorce', 'பிரிவு (2, 7, 11-இன் காரகர்கள் 1, 6, 10, 12-இன் காரகர்களுமானால்)', '191-192', held(both.length > 0),
    `2, 7, 11-ஐக் குறிக்கும் கிரகங்கள்: ${ptaList(union) || '—'}; 1, 6, 10, 12-ஐக் குறிப்பவை: ${ptaList(apart) || '—'}; இரண்டிலும் உள்ளவை: ${ptaList(both) || 'இல்லை'}. நூல்: இவை இருந்தால் பிரிவு நிச்சயம்; அது விவாகரத்துக்கும் வழிவகுக்கலாம். (இது எந்தக் காலத்தில் என்பதை தசா-புக்தி-அந்தரம் தீர்மானிக்கும் — கீழே.)`,
    { union, apart, both }));
  const sig7 = c.significatorsOf([7]);
  const leaves = sig7.filter((p) => { const s = c.signifies(p); return s.includes(6) && s.includes(9); });
  out.push(rule('D_WIFE_LEAVES', 'divorce', 'மனைவி விட்டுச் செல்லுதல் (7-இன் காரகர் 6, 9-உம்)', '192', held(leaves.length > 0),
    `7-ஐக் குறிக்கும் கிரகங்களில் 6 மற்றும் 9 இரண்டையும் குறிப்பவை: ${ptaList(leaves) || 'இல்லை'}.`, { significatorsOf7: sig7, matching: leaves }));
  const reunion = c.significatorsOf([1, 5, 7, 11]);
  out.push(rule('D_REUNION', 'divorce', 'மீண்டும் சேர்தல் (1, 5, 7, 11)', '192', 'INFO',
    `1, 5, 7, 11-ஐக் குறிக்கும் கிரகங்கள்: ${ptaList(reunion) || '—'}.`, { significators: reunion }));
  return out;
}

function childRules(c) {
  const out = [];
  const jup = c.signifies('Jupiter');
  out.push(rule('C_JUPITER', 'children', 'குரு (குழந்தைகளின் தலைமைக் காரகன்) 2, 5, 11-ஐக் குறிக்கிறதா', '210', held(jup.some((h) => [2, 5, 11].includes(h))),
    `குரு குறிக்கும் பாவங்கள்: ${hl(jup) || '—'}.`, { signifies: jup }));
  const judge = (cuspNo, id, label, pages) => {
    const sub = c.subLordOf(cuspNo);
    const star = c.starLordOfPlanet(sub);
    const sig = c.signifies(sub);
    const sigStar = c.signifies(star);
    const promise = sig.filter((h) => [2, 5, 11].includes(h));
    const twelfth = twelfthFrom(cuspNo);
    const eighth = eighthFrom(cuspNo);
    const against = sig.filter((h) => [twelfth, eighth].includes(h));
    const abortive = sub === 'Ketu' || star === 'Ketu';
    out.push(rule(`${id}_PROMISE`, 'children', `${label}: உப-அதிபதி 2, 5, 11-ஐக் குறிக்கிறதா`, pages, held(promise.length > 0),
      `${cuspNo}-ஆம் கஸ்ப் உப-அதிபதி ${PLANET_TA[sub]} (அது நிற்கும் நட்சத்திர அதிபதி ${PLANET_TA[star]}); குறிக்கும் பாவங்கள்: ${hl(sig) || '—'}; 2/5/11: ${promise.length ? hl(promise) : 'இல்லை'}.`,
      { subLord: sub, starLord: star, signifies: sig, starLordSignifies: sigStar, matching: promise }));
    const againstTa = against.length
      ? `${twelfth}-ஆம் (இந்த பாவத்துக்கு 12-ஆவது) அல்லது ${eighth}-ஆம் (8-ஆவது) பாவத்தைக் குறிப்பது: ${hl(against)}`
      : `${twelfth}/${eighth}-ஆம் பாவத்தைக் குறிக்கவில்லை`;
    out.push(rule(`${id}_AGAINST`, 'children', `${label}: தடைக் குறிகள்`, pages, held(against.length > 0 || abortive),
      `உப-அதிபதி ${againstTa}; கருச்சிதைவுக் கிரகமான கேது உப-அதிபதியோ அதன் நட்சத்திர அதிபதியோ: ${abortive ? 'ஆம்' : 'இல்லை'}. (நூலின் "12 to ${cuspNo}", "8 to ${cuspNo}" என்ற சுருக்கத்தை நானே பாவ எண்ணாக மாற்றியுள்ளேன்.)`,
      { twelfthFrom: twelfth, eighthFrom: eighth, matching: against, abortiveNode: abortive }, { derivedShorthand: true }));
    out.push(rule(`${id}_BARREN`, 'children', `${label}: உப-அதிபதி மலட்டு ராசியில்`, '212, 224', held(BARREN_SIGNS.includes(c.planets[sub].sign)),
      `உப-அதிபதி ${PLANET_TA[sub]} நிற்கும் ராசி ${c.planets[sub].sign}; நூலின் மலட்டு ராசிகள்: மேடம், சிம்மம், மிதுனம், கன்னி.`, { sign: c.planets[sub].sign }));
  };
  judge(11, 'C_MALE_11', 'ஆண் (11-ஆம் கஸ்ப் முதலில்)', '224');
  judge(5, 'C_5', '5-ஆம் கஸ்ப் (பெண்ணுக்கு; ஆணுக்கு இரண்டாவது)', '211, 224');

  const first = [];
  for (const n of ['Saturn', 'Rahu', 'Ketu']) {
    const p = c.planets[n];
    if (p.house !== 1) continue;
    const s = p.sub;
    const owned = c.kp.cusps.filter((cu) => cu.signLord === s).map((cu) => cu.number);
    const occ = c.kp.positions.find((q) => q.name === s)?.house;
    const hitH = [occ, ...owned].filter((h) => [1, 4, 10].includes(h));
    if (hitH.length) first.push({ planet: n, subLord: s, houses: [...new Set(hitH)] });
  }
  out.push(rule('C_FIRST_ISSUE', 'children', 'முதல் குழந்தை (லக்னத்தில் சனி/ராகு/கேது)', '242', held(first.length > 0),
    first.length
      ? `லக்னத்தில் நிற்கும் ${first.map((f) => `${PLANET_TA[f.planet]} (உப-அதிபதி ${PLANET_TA[f.subLord]}: ${hl(f.houses)}-ஆம் பாவத்தில் நிற்கிறது/ஆள்கிறது)`).join('; ')} — நூல்: முதல் குழந்தை குறுகிய ஆயுள் அல்லது கரு கலைதல்.`
      : 'லக்னத்தில் சனி/ராகு/கேது இல்லை, அல்லது அவற்றின் உப-அதிபதி 1, 4, 10-இல் நிற்கவும் ஆளவும் இல்லை.',
    { first }));
  return out;
}

const ASC_SUB = {
  1: 'கௌரவம், நீண்ட ஆயுள், நல்ல உடல்நலம், நல்லிணக்கம்', 2: 'கடின உழைப்பு, தொழில்வழிப் பணம்', 3: 'மன வளர்ச்சி, குறுகிய பயணங்கள், உறவு-அண்டையுடன் நட்பு; வெற்றியில் தாமதம்',
  4: 'நிலம், கட்டடம், வாகனம், கல்வி; தாயுடன் நல்லுறவு', 5: 'விளையாட்டு, இசை, ஊகம்; குழந்தைகளைப் பற்றிய கவலை', 6: 'நோய், பிறருக்கு இழப்பு தரும் செயல், மனக்கசப்பு (6 தீய பாவம்)',
  7: 'நல்ல துணை, வழக்குகள், இல்லற மகிழ்ச்சி', 8: 'மறைபொருள் அனுபவம், இயற்கையற்ற முடிவு, விபத்து, மரபுவழிப் பொருள் தடைகளுடன் (8 தீய பாவம்)', 9: 'நீண்ட பயணம், சமயம், உயர்கல்வி, தீர்க்கதரிசனக் கனவு',
  10: 'புகழ், பெரும் வெற்றி, உயர் பதவி, பரம்பரைச் சொத்து', 11: 'எல்லா வெற்றியும், நண்பர்கள்', 12: 'மறைந்த துன்பம், மறை பகைவர், சிறைப் பயம் (12 தீய பாவம்)',
};

function otherRules(c) {
  const out = [];
  const sub1 = c.subLordOf(1);
  const sig1 = c.signifies(sub1);
  out.push(rule('ASC_SUB', 'character', 'லக்ன உப-அதிபதி: வாழ்க்கை இயல்பு', '247-249', 'INFO',
    `லக்ன உப-அதிபதி ${PLANET_TA[sub1]}; குறிக்கும் பாவங்கள் ${hl(sig1) || '—'}. நூலின் பொருள்: ${sig1.map((h) => `${h}: ${ASC_SUB[h]}`).join(' · ') || '—'}. (6, 8, 12 லக்னம் குறிக்கும் விஷயங்களைக் கெடுக்கும்.)`,
    { subLord: sub1, signifies: sig1, evilHouses: sig1.filter((h) => [6, 8, 12].includes(h)) }));

  const GEM = { Sun: 'மாணிக்கம் (Ruby)', Moon: 'முத்து (Pearl)', Mars: 'பவளம் (Coral)', Mercury: 'மரகதம் (Emerald)', Jupiter: 'புஷ்பராகம் (Topaz)', Venus: 'வைரம் (Diamond)', Saturn: 'நீலம் (Sapphire)', Rahu: 'கோமேதகம் அல்லது டர்க்கொய்ஸ் (Agate/Turquoise)', Ketu: 'கோமேதகம் அல்லது டர்க்கொய்ஸ் (Agate/Turquoise)' };
  const sub11 = c.subLordOf(11);
  const sig11 = c.signifies(sub11);
  const rows = [sub1, sub11].map((p, i) => {
    const sg = i === 0 ? sig1 : sig11;
    const bad = sg.filter((h) => [6, 8, 12].includes(h));
    return { cusp: i === 0 ? 1 : 11, subLord: p, gem: GEM[p], rejected: bad.length > 0, badHouses: bad };
  });
  out.push(rule('GEM', 'gem', 'ரத்தினம் (1, 11-ஆம் கஸ்ப் உப-அதிபதிகள்)', '279-280', 'INFO',
    rows.map((r) => `${r.cusp}-ஆம் கஸ்ப் உப-அதிபதி ${PLANET_TA[r.subLord]}: ${r.rejected ? `6/8/12-உடன் தொடர்பு (${hl(r.badHouses)}) — நூல்: இந்த நிறத்தை விலக்க வேண்டும்` : `ரத்தினம் ${r.gem}`}`).join('; ') + '.',
    { rows }));
  return out;
}

/** For each running period lord (dasa, bhukti, antara, sookshma), the houses of `houses` it signifies. */
function periodSignificators(kp, houses) {
  const c = context(kp);
  const names = ['தசை', 'புக்தி', 'அந்தரம்', 'சூக்ஷ்மம்'];
  return (kp.dbas ?? []).map((lord, i) => {
    const s = c.signifies(lord).filter((h) => houses.includes(h));
    return { level: names[i] ?? `நிலை ${i + 1}`, lord, signifies: s, connected: s.length > 0 };
  });
}

/** The book: an event comes in the conjoined periods of the significators (printed pp.107, 128, 195). */
function evaluateKpMarriage(kp) {
  if (!kp?.available || !kp.houseSignificators) return { available: false };
  const c = context(kp);
  const rules = [...marriageRules(c), ...divorceRules(c), ...childRules(c), ...otherRules(c)];
  return {
    available: true,
    source: SOURCE,
    rules,
    partner: describePartner(kp),
    judge: describeJudge(kp),
    periods: {
      marriage: periodSignificators(kp, [2, 7, 11]),
      children: periodSignificators(kp, [2, 5, 11]),
      separation: periodSignificators(kp, [1, 6, 10, 12]),
    },
    notApplied: [
      'ராகு/கேது முகவர் விதி (ப.121) — இணைவு கணக்கிடப்படவில்லை',
      'பார்வை சார்ந்த நிபந்தனைகள் — நூல் "மேற்கத்திய பார்வை" என்கிறது, ஓர்ப் தரவில்லை',
      'குழந்தையின் பாலினம் — நூல்: "எல்லா நிலைகளுக்கும் பொருந்தும் விதி இல்லை" (ப.211)',
      'தசாசந்தி, ஏக தசை, காரகோ பாவ நாசாய — ஆசிரியர் இவற்றை நிராகரிக்கிறார்',
    ],
  };
}

module.exports = { evaluateKpMarriage, periodSignificators, SOURCE, twelfthFrom, eighthFrom };
