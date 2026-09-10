/**
 * குழந்தை பெயர் — nakshatra-pada name suggestions.
 *
 * The classical nāmakaraṇa chakra assigns each of the 27 nakshatras' 4 pādas a
 * starting syllable; a child is traditionally named beginning with the syllable
 * of the Moon's nakshatra-pāda at birth. Table + name bank ported verbatim from
 * the prior AstrologicLab `babynames` page (108-pāda chakra, cross-verified
 * against the STAR-family "DAILY LAGNA PADHA MUHURTH" workbook).
 *
 * The name bank is a curated sample, NOT exhaustive — many valid syllables have
 * few or no entries yet. This is a suggestion aid, not a prescription.
 */
const BABY_NAMES = require('./data/baby-names.json');

const NAKSHATRA_TA = [
  'அஸ்வினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];

// 108-pāda chakra: 27 nakshatras × 4 pādas → starting syllable (Tamil script).
const PADA_SYLLABLES_TA = [
  ['சு', 'ச', 'சீ', 'ஸ்'], ['லி', 'லு', 'லே', 'லோ'], ['அ', 'இ', 'உ', 'எ'],
  ['ஓ', 'வ', 'வி', 'வு'], ['வே', 'வோ', 'க', 'கி'], ['கு', 'க்', 'ஞ', 'ஓ'],
  ['கே', 'கோ', 'ஹ', 'ஹி'], ['ஹு', 'ஹே', 'ஹோ', 'ட'], ['டி', 'டு', 'டே', 'டோ'],
  ['ம', 'மி', 'மு', 'மே'], ['மோ', 'ட', 'டி', 'டு'], ['டே', 'டோ', 'ப', 'பி'],
  ['பு', 'ஷ', 'ண', 'ட'], ['பே', 'போ', 'ர', 'ரி'], ['ரு', 'ரே', 'ரோ', 'த'],
  ['தி', 'து', 'தே', 'தோ'], ['ந', 'நி', 'நு', 'நே'], ['நோ', 'ய', 'யி', 'யு'],
  ['யே', 'யோ', 'ப', 'பி'], ['பு', 'ஷ', 'ட', 'ட'], ['பே', 'போ', 'ஜ', 'ஜி'],
  ['ஜு', 'ஜே', 'ஜோ', 'க'], ['க', 'கி', 'கு', 'கே'], ['கோ', 'ஸ', 'ஸி', 'ஸு'],
  ['சே', 'சோ', 'த', 'தி'], ['து', 'ஞ', 'ண', 'த'], ['தே', 'தோ', 'ச', 'சி'],
];

const norm360 = (d) => ((d % 360) + 360) % 360;

/** Moon's sidereal longitude → { nakshatraIndex (0-26), pada (1-4) }. */
function nakshatraPada(moonLongitude) {
  const pos = norm360(moonLongitude);
  const nakshatraIndex = Math.floor(pos / (360 / 27)) % 27;
  const pada = Math.floor((pos % (360 / 27)) / (360 / 108)) + 1;
  return { nakshatraIndex, pada };
}

/**
 * @param q { nakshatraIndex 0-26, pada 1-4, gender 'boy'|'girl'|'both', search? }
 * @returns { nakshatra, pada, syllable, names:[{name, gender}], count }
 */
function suggestNames(q) {
  const ni = Math.max(0, Math.min(26, q.nakshatraIndex | 0));
  const pd = Math.max(1, Math.min(4, q.pada | 0));
  const syllable = PADA_SYLLABLES_TA[ni][pd - 1];
  const bank = BABY_NAMES[syllable] || { boy: [], girl: [] };
  const gender = q.gender === 'boy' || q.gender === 'girl' ? q.gender : 'both';

  let names = [];
  if (gender !== 'girl') names = names.concat(bank.boy.map((name) => ({ name, gender: 'boy' })));
  if (gender !== 'boy') names = names.concat(bank.girl.map((name) => ({ name, gender: 'girl' })));
  if (q.search) names = names.filter((n) => n.name.includes(q.search));

  return {
    nakshatraIndex: ni,
    nakshatra: NAKSHATRA_TA[ni],
    pada: pd,
    syllable,
    names,
    count: names.length,
  };
}

module.exports = {
  suggestNames, nakshatraPada,
  NAKSHATRA_TA, PADA_SYLLABLES_TA, BABY_NAMES,
};
