/**
 * எண் ஜோதிடம் (Numerology) — Chaldean name-number + Moolank (birth number)
 * / Bhagyank (destiny number), their compatibility, and the traditional
 * per-digit planet / day / colour / stone / career associations.
 *
 * Ported verbatim (Chaldean map, reduction, friend table, Tamil content)
 * from the prior AstrologicLab engine `src/lib/numerology.ts`, itself taken
 * from a reference Tamil astrology app (tamil_jathagam_v8.html). Pure string
 * math — no ephemeris. General-guidance level; the source carries the same
 * disclaimer.
 */

const CHALDEAN_MAP = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1, j: 1, k: 2, l: 3, m: 4,
  n: 5, o: 7, p: 8, q: 1, r: 2, s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7,
};

function reduceNum(n) {
  let x = n;
  while (x > 9) {
    x = String(x).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return x;
}

/** Chaldean name number. Non-letters stripped, case-insensitive. */
function chaldeanNameNumber(name) {
  const clean = String(name || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return null;
  let sum = 0;
  for (const ch of clean) sum += CHALDEAN_MAP[ch] || 0;
  return { compound: sum, single: reduceNum(sum) };
}

/** Moolank (birth/root number) = day-of-month, reduced. */
function moolankFromDay(day) {
  const d = parseInt(day, 10);
  if (!d) return null;
  return { day: d, single: reduceNum(d) };
}

/** Bhagyank (destiny number) = every digit of the full date, summed + reduced. */
function bhagyankFromDate(year, month, day) {
  const digits = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
  let sum = 0;
  for (const ch of digits) if (/[0-9]/.test(ch)) sum += parseInt(ch, 10);
  if (!sum) return null;
  return { compound: sum, single: reduceNum(sum) };
}

const NUMEROLOGY_INFO = {
  1: { planet: 'சூரியன்', trait: 'தலைமைத்துவம், சுயமரியாதை, தன்னம்பிக்கை, தலைமை பண்பு கொண்டவர்கள். சுதந்திரமாக செயல்பட விரும்புவார்கள்.' },
  2: { planet: 'சந்திரன்', trait: 'உணர்ச்சிப்பூர்வமானவர்கள், கூட்டு முயற்சியில் திறமை, அமைதியான இயல்பு, கலை ஆர்வம் கொண்டவர்கள்.' },
  3: { planet: 'வியாழன்', trait: 'அறிவு, கல்வி, தொடர்பு திறமை, நேர்மறை சிந்தனை, பேச்சுத்திறன் மிக்கவர்கள்.' },
  4: { planet: 'ராகு', trait: 'கடின உழைப்பு, நடைமுறை சிந்தனை, ஒழுங்கு, திட்டமிடல் திறன் கொண்டவர்கள். மாற்றங்களை விரும்புவார்கள்.' },
  5: { planet: 'புதன்', trait: 'புத்திசாலித்தனம், தொடர்பாடல் திறமை, வணிக ஆர்வம், விரைவான முடிவெடுக்கும் திறன்.' },
  6: { planet: 'சுக்கிரன்', trait: 'அழகியல் உணர்வு, அன்பு, குடும்ப பாசம், கலை/அழகு தொடர்பான ஆர்வம் கொண்டவர்கள்.' },
  7: { planet: 'கேது', trait: 'ஆன்மீக நாட்டம், ஆராய்ச்சி மனப்பான்மை, தனிமையை விரும்புதல், ஆழ்ந்த சிந்தனையாளர்கள்.' },
  8: { planet: 'சனி', trait: 'உறுதியான மனோபலம், நீண்டகால உழைப்பு, சவால்களை எதிர்கொள்ளும் திறன், நிர்வாக ஆற்றல்.' },
  9: { planet: 'செவ்வாய்', trait: 'தைரியம், போராட்ட குணம், மனிதநேயம், தலைமை மற்றும் சேவை மனப்பான்மை கொண்டவர்கள்.' },
};

const NUM_FRIEND = {
  1: [1, 2, 3, 5, 9], 2: [1, 2, 4, 7], 3: [1, 3, 5, 6, 9], 4: [2, 4, 5, 7, 8],
  5: [1, 3, 4, 5, 6], 6: [3, 5, 6, 9], 7: [2, 4, 7], 8: [4, 8], 9: [1, 3, 6, 9],
};

const NUM_LUCKY = {
  1: { day: 'ஞாயிறு', color: 'ஆரஞ்சு / தங்க நிறம்', stone: 'மாணிக்கம்', career: 'நிர்வாகம், தலைமைப் பொறுப்புகள், சுயதொழில்' },
  2: { day: 'திங்கள்', color: 'வெள்ளை / குளிர் நிறங்கள்', stone: 'முத்து', career: 'கலை, ஆலோசனை, கூட்டாண்மை தொழில்' },
  3: { day: 'வியாழன்', color: 'மஞ்சள் / ஊதா', stone: 'புஷ்பராகம்', career: 'கல்வி, சட்டம், ஆன்மீகம், பேச்சுத்திறன் தேவைப்படும் பணி' },
  4: { day: 'சனி', color: 'சாம்பல் / மின்னஞ்சி நீலம்', stone: 'கோமேதகம்', career: 'தொழில்நுட்பம், புதுமை, மாற்றம் சார்ந்த பணிகள்' },
  5: { day: 'புதன்', color: 'பச்சை', stone: 'மரகதம்', career: 'தகவல் தொடர்பு, வணிகம், ஊடகம்' },
  6: { day: 'வெள்ளி', color: 'நீலம் / இளஞ்சிவப்பு', stone: 'வைரம்', career: 'கலை, அழகுசாதனம், உணவு/விருந்தோம்பல் துறை' },
  7: { day: 'திங்கள்', color: 'கடல்பச்சை / வெள்ளை', stone: 'வைடூரியம்', career: 'ஆராய்ச்சி, ஆன்மீகம், தத்துவம்' },
  8: { day: 'சனி', color: 'கருப்பு / கடும் நீலம்', stone: 'நீலம்', career: 'நிர்வாகம், நீதித்துறை, நீண்டகால திட்டப்பணிகள்' },
  9: { day: 'செவ்வாய்', color: 'சிவப்பு', stone: 'பவளம்', career: 'இராணுவம், பொறியியல், விளையாட்டு, தலைமைத்துவம் தேவைப்படும் பணி' },
};

function moolankBhagyankCompatibility(moolankSingle, bhagyankSingle) {
  const isFriend = moolankSingle === bhagyankSingle
    || (NUM_FRIEND[moolankSingle] || []).includes(bhagyankSingle);
  return isFriend
    ? { verdict: 'நல்ல இணக்கம் (Friendly)', friendly: true }
    : { verdict: 'கவனம் தேவை (Watch)', friendly: false };
}

function friendlyNumbers(n) {
  return (NUM_FRIEND[n] || []).filter((x) => x !== n);
}

/** One call producing the full numerology block for the report. */
function calculateNumerology({ name, year, month, day }) {
  const nameNumber = chaldeanNameNumber(name);
  const moolank = moolankFromDay(day);
  const bhagyank = bhagyankFromDate(year, month, day);
  const compatibility = (moolank && bhagyank)
    ? moolankBhagyankCompatibility(moolank.single, bhagyank.single)
    : null;
  const detailFor = (single) => (single ? {
    single,
    ...NUMEROLOGY_INFO[single],
    lucky: NUM_LUCKY[single],
    friends: friendlyNumbers(single),
  } : null);
  return {
    nameNumber,
    moolank,
    bhagyank,
    compatibility,
    moolankDetail: detailFor(moolank && moolank.single),
    bhagyankDetail: detailFor(bhagyank && bhagyank.single),
    nameDetail: detailFor(nameNumber && nameNumber.single),
  };
}

module.exports = {
  calculateNumerology, chaldeanNameNumber, moolankFromDay, bhagyankFromDate,
  moolankBhagyankCompatibility, friendlyNumbers, NUMEROLOGY_INFO, NUM_LUCKY,
};
