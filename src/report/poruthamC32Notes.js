/**
 * K.S. Krishnamurti's Reader IV (corpus C32) as an optional second source for the ten poruthams: what it says against each of our
 * Kalaprakasika-based factors, and the exceptions and extra rules it adds. Nothing here changes a verdict, the passed count or the
 * level; the page shows it beside them, the way Sudamani is shown as a cross-check.
 *
 * Read from the page images of C32, printed pp.15-44 (printed = PDF - 3). The differences in the tables are pinned by
 * test-porutham-c32.js; docs/PORUTHAM-C32-COMPARISON.md lists them.
 *
 * Not used, because our input has no pada: the pada exceptions of Dina (second pariyaya, printed p.22), Rajju (pp.39-40) and the
 * four stars Moolam, Ashlesha, Jyeshta and Visakam (p.26). They appear as cautions when the stars concerned are present.
 *
 * Indices: stars 0-26 (Ashwini..Revati), rasis 0-11 (Aries..Pisces).
 */

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader IV: Marriage and Married Life',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C32_KP_Reader_IV_Marriage_Children_KSK.pdf',
  pageLocus: 'Opening chapter on Dasa Porutham, printed pp.15-44',
};

/** How each of our ten factors stands against C32 (asserted by test-porutham-c32.js). */
const COMPARISON = {
  DINA: { status: 'MATCHES', printedPages: '20-22, 24', summary: 'ஒன்பது நிலைகளும் நன்று/ஆகாது பிரிவும் அதே (2, 4, 6, 8, 9 நன்று; 3, 5, 7 ஆகாது); ஒரே நட்சத்திர தரம் இருநூல்களிலும் ஒன்றே. 22-ஆம் எண் பற்றி இந்நூலில் குறிப்பு இல்லை; 7-ஆம் நட்சத்திரம் (வதம்) பற்றிய காசியப்ப விதிவிலக்குகளை இது தருகிறது.' },
  GANA: { status: 'MATCHES', printedPages: '29', summary: 'ஒன்பது-ஒன்பது-ஒன்பது பிரிவு நட்சத்திரம் நட்சத்திரமாக அதே; நூல் தரும் இரு விதிவிலக்குகள் கீழே.' },
  MAHENDRA: { status: 'MATCHES', printedPages: '29-30', summary: '4, 7, 10, 13, 16, 19, 22, 25 — அதே. தினப் பொருத்தம் 7-ஐத் தள்ளுவதை இந்நூல் முரண்பாடாக அல்ல, வெவ்வேறு பலனாக விளக்குகிறது (தினம் = நலம்/ஆயுள்; மகேந்திரம் = சந்ததி).' },
  STREE_DEERGHA: { status: 'MATCHES', printedPages: '31', summary: '13 மற்றும் அதற்கு மேல்; சில முனிவர்கள் 8-இலிருந்து என்றும் கூறுவதாக இந்நூல் குறிக்கிறது.' },
  YONI: { status: 'DIVERGES', printedPages: '31-33', summary: 'மூன்று நட்சத்திரங்களில் வேறுபாடு: உத்திரம் = ஒட்டகம் (நம்மிடம் பசு); அவிட்டம், பூரட்டாதி = மனிதர் (நம்மிடம் சிங்கம்). பகை ஜோடிகளில் ஆடு–யானை (நம்மிடம் மான்–யானை, பாம்பு–கீரி).' },
  RASI: { status: 'MATCHES', printedPages: '33-34', summary: '2 முதல் 6 வரை ஆகாது; இந்நூல் ஆறாம் இடம் (ஷஷ்டாஷ்டகம்) உள்பட சில விதிவிலக்குகளைத் தருகிறது — கீழே.' },
  RASI_ADHIPATHI: { status: 'DIFFERENT_MODEL', printedPages: '34-35', summary: 'இரு ராசிநாதரும் ஒருவர் எனில் மிக நன்று, நண்பர் எனில் நன்று, நடுநிலை எனில் மத்திமம், பகை எனில் ஆகாது — நட்பு அட்டவணையுடன் (அச்சிட்டபடி). நம்முடைய "வேறு கிரகம்" சோதனை இதிலிருந்து வேறு.' },
  VASYA: { status: 'DIVERGES', printedPages: '36', summary: 'இடபத்துக்கு கடகம், துலாம் (நம்மிடம் கடகம், சிங்கம்); மற்ற பதினொன்றும் அதே.' },
  RAJJU: { status: 'MATCHES', printedPages: '37-41', summary: 'ஐந்து பிரிவுகளும் நட்சத்திரம் நட்சத்திரமாக அதே. ஒரே ரஜ்ஜு எனினும் ராசிநாதர் நண்பர், ஒரே ராசி, அல்லது ராசிகள் 7-ஆம் இடம் எனில் தோஷம் நீங்கும் என்கிறது — கீழே.' },
  VEDHA: { status: 'DIVERGES', printedPages: '41-42', summary: 'பரணிக்கு புனர்பூசம் அல்ல பூசம்; பூரம், உத்திரத்துக்கு வேதை இல்லை; நம்மிடமுள்ள ஹஸ்தம்–சதயம் போன்ற மூன்று ஜோடிகள் இதில் இல்லை.' },
};

const LORD_TA = ['சூரியன்', 'சந்திரன்', 'செவ்வாய்', 'புதன்', 'குரு', 'சுக்கிரன்', 'சனி'];
/** 0 Sun .. 6 Saturn: the lord of each rasi. */
const RASI_LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];
/** C32 printed p.35: each planet's friends, as printed (Sun Moon Mars Mercury Jupiter Venus Saturn = 0..6). */
const FRIENDS = [[1, 2, 4], [0, 3], [0, 1, 4], [6], [0, 1, 2], [3, 6], [3, 5]];
const friendly = (a, b) => a === b || (FRIENDS[a].includes(b) && FRIENDS[b].includes(a));

const STAR_TA = ['அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுசம்', 'கேட்டை', 'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'];
const RASI_TA = ['மேடம்', 'இடபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

const starCount = (from, to) => ((to - from + 27) % 27) + 1;
const rasiCount = (from, to) => ((to - from + 12) % 12) + 1;

/** printed p.29: the girl's star is Rakshasa; also needed by the Gana waiver. */
const RAKSHASA = [2, 8, 9, 13, 15, 17, 18, 22, 23];

/** printed pp.25-26 (Kasyapa), the boy's star being the 7th from the girl's. Every pair below is a 7th-star pair. */
const VATHAM_WARNED_GIRLS = [2, 8, 13, 16, 22, 23];
const VATHAM_APPROVED_GIRLS = [5, 10, 7];
const VATHAM_PAIRS = [
  [6, 12, 'happiness and the birth of children'], [17, 23, 'the opposite result'], [4, 10, 'she loses her husband early'],
  [12, 18, 'not to be ventured'], [3, 9, 'many children'], [24, 3, 'many issues'], [0, 6, 'daughters, one after another'],
  [26, 5, 'no understanding, hatred, a few separate'], [11, 17, 'no understanding, hatred, a few separate'],
  [15, 21, 'she will hate her husband'], [21, 0, 'she will divorce him'], [1, 7, 'fortunate'],
];
const VATHAM_PAIRS_TA = {
  'happiness and the birth of children': 'மகிழ்ச்சியும் குழந்தைப் பேறும்', 'the opposite result': 'எதிர்மறைப் பலன்',
  'she loses her husband early': 'கணவனை விரைவில் இழப்பாள்', 'not to be ventured': 'செய்யக்கூடாது', 'many children': 'பல குழந்தைகள்',
  'many issues': 'பல சந்ததி', 'daughters, one after another': 'தொடர்ந்து பெண் குழந்தைகள்',
  'no understanding, hatred, a few separate': 'புரிதலின்மை, வெறுப்பு, சிலர் பிரிவர்',
  'she will hate her husband': 'கணவனை வெறுப்பாள்', 'she will divorce him': 'மணவிலக்கு', fortunate: 'அதிர்ஷ்டம்',
};

/** printed p.28: with these stars (either partner) "one need not see dasa porutham at all"; the 7th-star rule still applies. */
const DASA_WAIVED_STARS = [4, 9, 11, 12, 14, 16, 20, 25];

/** printed p.42, Nadi. */
const NADI = { vama: [2, 3, 8, 9, 14, 15, 20, 21, 26], dakshina: [0, 5, 6, 11, 12, 17, 18, 23, 24], madhya: [1, 4, 7, 10, 13, 16, 19, 22, 25] };
const nadiOf = (s) => (NADI.vama.includes(s) ? 'vama' : NADI.dakshina.includes(s) ? 'dakshina' : 'madhya');
const NADI_TA = { vama: 'வாம பார்சுவம்', dakshina: 'தட்சிண பார்சுவம்', madhya: 'மத்திய' };

/** printed pp.42-43, gender of the stars. */
const FEMININE = [8, 9, 10, 11, 5, 1, 13, 14, 15, 19, 20, 17, 22, 21];
const EFFEMINATE = [4, 23, 18];
const genderOf = (s) => (FEMININE.includes(s) ? 'f' : EFFEMINATE.includes(s) ? 'e' : 'm');
const GENDER_TA = { f: 'பெண்', m: 'ஆண்', e: 'அலி' };

/** printed p.44, caste by rasi: 0 Brahmin, 1 Kshatriya, 2 Vaishya, 3 Sudra. */
const CASTE_OF_RASI = [2, 3, 2, 0, 1, 3, 1, 0, 1, 3, 2, 0];
const CASTE_TA = ['பிராமணம்', 'க்ஷத்திரியம்', 'வைசியம்', 'சூத்திரம்'];

/** Lords of the rasi pairs that C32 treats as one for the Shashta-ashtama waiver: Aries/Scorpio, Taurus/Libra (printed p.34). */
const sameLordRasis = (a, b) => RASI_LORD[a] === RASI_LORD[b];

/** The three Moon-sign conditions that waive Gana (p.29) and Rajju (p.39) dosha: same sign, friendly lords, Sama-saptama. */
function moonSignWaiver(girlRasi, boyRasi) {
  const reasons = [];
  if (girlRasi === boyRasi) reasons.push('இருவருக்கும் ஒரே சந்திர ராசி');
  const lg = RASI_LORD[girlRasi];
  const lb = RASI_LORD[boyRasi];
  if (girlRasi !== boyRasi && lg === lb) reasons.push(`இரு ராசிக்கும் ஒரே நாதன் (${LORD_TA[lg]})`);
  else if (friendly(lg, lb) && girlRasi !== boyRasi) reasons.push(`ராசிநாதர்கள் நண்பர்கள் (${LORD_TA[lg]}–${LORD_TA[lb]})`);
  if (rasiCount(girlRasi, boyRasi) === 7) reasons.push('ராசிகள் சம-சப்தமம் (ஏழாம் இடம்)');
  return reasons;
}

/**
 * @param girl,boy { nakshatraIndex, rasiIndex }
 * @param rows     the rows from calculateTamilPorutham (to know which factors failed)
 * @returns { source, comparison, notes[], extraFactors[] }
 *   notes: { id, kind: 'WAIVER'|'CAUTION'|'NOTE', text, printedPage }
 *   WAIVER means C32 says the dosha of a failed factor does not operate; the verdict above is unchanged.
 */
function c32Notes(girl, boy, rows) {
  const g = girl.nakshatraIndex;
  const b = boy.nakshatraIndex;
  const gr = girl.rasiIndex;
  const br = boy.rasiIndex;
  const failed = (id) => rows.some((r) => r.id === id && !r.result);
  const count = starCount(g, b);
  const notes = [];
  const add = (id, kind, text, printedPage) => notes.push({ id, kind, text, printedPage });

  // Gana
  if (failed('GANA')) {
    if (RAKSHASA.includes(g) && starCount(b, g) > 14) add('GANA', 'WAIVER', `மணமகள் இராட்சத கணம்; மணமகன் நட்சத்திரத்திலிருந்து மணமகள் நட்சத்திரம் ${starCount(b, g)}-ஆவது (14-க்கு மேல்) — கண தோஷம் நீங்கும் என்கிறது.`, '29');
    const why = moonSignWaiver(gr, br);
    if (why.length) add('GANA', 'WAIVER', `${why.join('; ')} — கணம் பொருந்தாவிடினும் ஏற்கலாம் என்கிறது.`, '29');
    if (!notes.some((n) => n.id === 'GANA')) add('GANA', 'NOTE', 'இந்நூலின் கண விதிவிலக்குகள் (மணமகள் இராட்சதம் & எண்ணிக்கை 14-க்கு மேல்; அல்லது ஒரே ராசி / நண்பர் ராசிநாதர் / சம-சப்தமம்) இந்த ஜோடிக்குப் பொருந்தவில்லை.', '29');
  }
  // Rajju
  if (failed('RAJJU')) {
    const why = moonSignWaiver(gr, br);
    if (why.length) add('RAJJU', 'WAIVER', `${why.join('; ')} — ஒரே ரஜ்ஜு தோஷம் இயங்காது என்கிறது.`, '39-40');
    else add('RAJJU', 'NOTE', 'ஒரே ரஜ்ஜு; இந்நூலின் ராசி விதிவிலக்குகள் (ஒரே ராசி / நண்பர் ராசிநாதர் / சம-சப்தமம்) பொருந்தவில்லை.', '39-40');
    if ([2, 11, 20, 6, 15, 24].includes(g) || [2, 11, 20, 6, 15, 24].includes(b)) {
      add('RAJJU', 'CAUTION', 'கார்த்திகை, உத்திரம், உத்திராடம், புனர்பூசம் (1-3 பாதம்), விசாகம் (4-ஆம் பாதம்), பூரட்டாதி (4-ஆம் பாதம்) ஆகியவற்றில் சில பாதங்களுக்கு இந்தத் தளர்வு பொருந்தாது என்று நூல் கூறுகிறது; பாதம் இங்கே கணக்கில் இல்லை.', '40');
    }
  }
  // Rasi
  const rc = rasiCount(gr, br);
  if (failed('RASI')) {
    if (rc === 6) {
      if (gr % 2 === 0) add('RASI', 'WAIVER', 'மணமகள் ஒற்றைப்படை (ஓஜ) ராசி — ஷஷ்டாஷ்டக தோஷம் இல்லை என்கிறது.', '34');
      else if (sameLordRasis(gr, br)) add('RASI', 'WAIVER', 'இரு ராசிநாதரும் ஒருவரே — ஷஷ்டாஷ்டக தோஷம் இல்லை என்கிறது.', '34');
      else add('RASI', 'NOTE', 'ஆறாம் இடம் (ஷஷ்டாஷ்டகம்); இந்நூலின் தளர்வுகள் பொருந்தவில்லை.', '33-34');
    }
    if (rc === 2 && [1, 3, 5, 7, 9, 11].includes(br)) add('RASI', 'WAIVER', 'மணமகன் ராசி இடபம், கடகம், கன்னி, விருச்சிகம், மகரம், மீனம் ஒன்று; மணமகள் ராசியிலிருந்து 2-ஆவது — தோஷம் நீங்கும் என்கிறது.', '34');
    if (rc === 5 && [0, 3].includes(gr)) add('RASI', 'WAIVER', 'மணமகள் மேடம் அல்லது கடகம்; மணமகன் ராசி 5-ஆவது — தோஷம் நீங்கும் என்கிறது.', '33');
    if (![2, 5, 6].includes(rc)) add('RASI', 'NOTE', 'இந்த இடைவெளிக்கு இந்நூலில் தளர்வு இல்லை.', '33-34');
  }
  // Dina: dasa-porutham waived stars, the 7th-star (Vatham) rule and the Kasyapa pairs
  if (DASA_WAIVED_STARS.includes(g) || DASA_WAIVED_STARS.includes(b)) {
    add('DINA', 'NOTE', 'மிருகசீரிடம், மகம், உத்திரம், அஸ்தம், சுவாதி, அனுசம், உத்திராடம், உத்திரட்டாதி இவற்றில் ஒன்று இருப்பின் தசப்பொருத்தமே பார்க்கத் தேவையில்லை என்கிறது; ஆனால் 7-ஆம் நட்சத்திர விதி கருதப்பட வேண்டும்.', '28');
  }
  if (count === 7) {
    if (VATHAM_WARNED_GIRLS.includes(g)) add('DINA', 'CAUTION', `மணமகன் நட்சத்திரம் மணமகளுக்கு 7-ஆவது (வதம்). மணமகள் ${STAR_TA[g]} — காசியப்பர் இவளுக்கு 7-ஆம் நட்சத்திரத்தினரை மணம் செய்யலாகாது (மணவாழ்வு மிகக் குறுகியது) என்கிறார்.`, '25');
    else if (VATHAM_APPROVED_GIRLS.includes(g)) add('DINA', 'NOTE', `மணமகள் ${STAR_TA[g]} — காசியப்பர் இவளுக்கு 7-ஆம் நட்சத்திரத்தை ஏற்கிறார்.`, '25');
    else add('DINA', 'NOTE', 'மணமகன் நட்சத்திரம் மணமகளுக்கு 7-ஆவது (வதம்); இந்நூல் இதைப் பொதுவாக ஏற்காவிடினும் காசியப்பரின் விலக்குகளைப் பார்க்கச் சொல்கிறது.', '24-26');
    const pair = VATHAM_PAIRS.find(([x, y]) => x === g && y === b);
    if (pair) add('DINA', 'NOTE', `காசியப்பர்: ${STAR_TA[g]} பெண் — ${STAR_TA[b]} ஆண்: ${VATHAM_PAIRS_TA[pair[2]]}.`, '25-26');
  }
  // Moolam, Ashlesha, Jyeshta, Visakam (girl)
  if ([18, 8, 17, 15].includes(g)) {
    add('DINA', 'CAUTION', `மணமகள் ${STAR_TA[g]}: குறிப்பிட்ட பாதத்தில் மட்டுமே தீங்கு (மூலம் 1: மாமனார்; ஆயில்யம் 1: மாமியார்; கேட்டை 1: கணவனின் மூத்த சகோதரன்; விசாகம் 4: இளைய மைத்துனன்). மற்ற பாதங்கள் தீங்கற்றவை; நூல் இதை நிராகரிக்க வேண்டாம் என்கிறது.`, '26-28');
  }

  // Extra factors that Kalaprakasika's pages (as we read them) do not give
  const extraFactors = [];
  const nG = nadiOf(g);
  const nB = nadiOf(b);
  extraFactors.push({
    id: 'NADI', name: 'நாடி', printedPage: '42',
    result: nG !== nB,
    note: `பெண்: ${NADI_TA[nG]}, ஆண்: ${NADI_TA[nB]}`,
    text: nG !== nB ? 'நாடிகள் வேறு — நூல் மிக நன்று என்கிறது.'
      : nG === 'madhya' ? 'இருவரும் மத்திய நாடி — கணவனுக்கு ஆகாது என்கிறது.' : 'ஒரே பார்சுவ நாடி — மணமகளுக்கு விரும்பத்தக்கதல்ல என்கிறது.',
  });
  const gG = genderOf(g);
  const gB = genderOf(b);
  extraFactors.push({
    id: 'STAR_GENDER', name: 'நட்சத்திரப் பாலினம்', printedPage: '42-43',
    result: !(gG === 'm' && gB === 'f'),
    note: `பெண்: ${GENDER_TA[gG]}, ஆண்: ${GENDER_TA[gB]}`,
    text: gG === 'f' && gB === 'm' ? 'மணமகன் ஆண் நட்சத்திரம், மணமகள் பெண் நட்சத்திரம் — திருப்திகரம்.'
      : gG === 'm' && gB === 'f' ? 'மணமகள் ஆண், மணமகன் பெண் நட்சத்திரம் — பொருந்தாது என்கிறது.'
        : gG === gB ? (gG === 'e' ? 'இருவரும் அலி நட்சத்திரம் — நூல் இந்தச் சேர்க்கையைக் கூறவில்லை.' : 'இருவரும் ஒரே பாலின நட்சத்திரம் — பொருந்தும் என்கிறது.')
          : 'ஒருவர் அலி நட்சத்திரம் — மத்திமம்.',
  });
  const cG = CASTE_OF_RASI[gr];
  const cB = CASTE_OF_RASI[br];
  extraFactors.push({
    id: 'CASTE_BY_RASI', name: 'ராசி வருணம்', printedPage: '44',
    result: !(cG < cB),
    note: `பெண்: ${CASTE_TA[cG]}, ஆண்: ${CASTE_TA[cB]}`,
    text: cG < cB ? 'மணமகள் ராசி உயர்ந்த வருணம் — மணமகன் உயர்ந்த வருணப் பெண்ணை மணக்கலாகாது என்கிறது.' : 'மணமகள் ராசி உயர்ந்த வருணம் அல்ல.',
  });

  return { source: SOURCE, comparison: COMPARISON, notes, extraFactors };
}

module.exports = { c32Notes, COMPARISON, SOURCE, friendly, moonSignWaiver, nadiOf, genderOf, VATHAM_PAIRS, DASA_WAIVED_STARS };
