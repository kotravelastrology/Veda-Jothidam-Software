/**
 * Sahams (தஜக சகங்கள்) — Tajika sensitive points for the annual (Varshaphala)
 * chart. Rule: Saham = A − B + C  (day birth) / B − A + C  (night birth),
 * mod 360°, with +30° when C does NOT lie on the forward arc from B to A.
 *
 * Formula set adapted from the AstrologicLab sahams.ts engine (40 sahams,
 * cross-checked there against Tājika Nīlakaṇṭhī ch.4 and a Tamil textbook
 * "பாடம் 5: சகங்கள்"). Same disclosed simplifications carry over: "kariya
 * siddhi" reads bhava-lord as the planet's rasi-lord; the 7th-lord alt for
 * "vivaha" and the Aries/Scorpio alt for "aatral" are not implemented;
 * saham-of-saham refinements are omitted.
 */
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const RASI_NAMES = ['Mesha', 'Vrishabha', 'Mithuna', 'Karkataka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

function norm360(x) { return ((x % 360) + 360) % 360; }
function isBetweenCircular(c, a, b) {
  const aAdj = a < b ? a + 360 : a;
  return (c >= b && c <= aAdj) || (c + 360 >= b && c + 360 <= aAdj);
}

// Operand DSL: P(name) planet · LAGNA · LL lagna-lord · H(n) house cusp ·
// HL(n) lord of house n's rasi · RL(name) lord of planet's rasi · S(key) prior saham · D(deg) const
const P = (name) => ({ t: 'planet', name });
const LAGNA = { t: 'lagna' };
const LL = { t: 'lagnaLord' };
const H = (n) => ({ t: 'houseCusp', house: n });
const HL = (n) => ({ t: 'houseLord', house: n });
const RL = (name) => ({ t: 'rashiLordOf', planet: name });
const S = (key) => ({ t: 'saham', key });
const D = (deg) => ({ t: 'const', deg });

const SAHAM_DEFS = [
  { key: 'punya', name: 'புண்ணிய சகம் (Punya)', day: [P('Moon'), P('Sun'), LAGNA], night: [P('Sun'), P('Moon'), LAGNA] },
  { key: 'vidya', name: 'வித்யா சகம் (Vidya)', day: [P('Sun'), P('Moon'), LAGNA], night: [P('Moon'), P('Sun'), LAGNA] },
  { key: 'kirti', name: 'கீர்த்தி சகம் (Kirti)', day: [P('Jupiter'), S('punya'), LAGNA], night: [S('punya'), P('Jupiter'), LAGNA] },
  { key: 'mitra', name: 'நட்பு சகம் (Mitra)', day: [P('Jupiter'), S('punya'), P('Venus')], night: [S('punya'), P('Jupiter'), P('Venus')] },
  { key: 'mahatmya', name: 'பெருமை சகம் (Mahatmya)', day: [S('punya'), P('Mars'), LAGNA], night: [P('Mars'), S('punya'), LAGNA] },
  { key: 'asha', name: 'ஆசை சகம் (Asha)', day: [P('Saturn'), P('Mars'), LAGNA], night: [P('Mars'), P('Saturn'), LAGNA] },
  { key: 'aatral', name: 'ஆற்றல்/சாமர்த்ய சகம் (Samartha)', day: [P('Saturn'), P('Mars'), LAGNA], night: [P('Mars'), P('Saturn'), LAGNA] },
  { key: 'sagodhara', name: 'உடன்பிறப்பு சகம் (Bhratri)', day: [P('Jupiter'), P('Saturn'), LL], night: [P('Jupiter'), P('Saturn'), LL] },
  { key: 'gauravam', name: 'கௌரவ சகம் (Gaurava)', day: [P('Jupiter'), P('Moon'), P('Sun')], night: [P('Moon'), P('Jupiter'), P('Sun')] },
  { key: 'thagappan', name: 'தகப்பன் சகம் (Pitri)', day: [P('Saturn'), P('Sun'), LAGNA], night: [P('Sun'), P('Saturn'), LAGNA] },
  { key: 'raja', name: 'இராஜ்ய சகம் (Rajya)', day: [P('Sun'), P('Jupiter'), LAGNA], night: [P('Jupiter'), P('Sun'), LAGNA] },
  { key: 'thai', name: 'தாய் சகம் (Matri)', day: [P('Moon'), P('Venus'), LAGNA], night: [P('Venus'), P('Moon'), LAGNA] },
  { key: 'puthira', name: 'புத்திர சகம் (Putra)', day: [P('Jupiter'), P('Moon'), LAGNA], night: [P('Moon'), P('Jupiter'), LAGNA] },
  { key: 'ayul', name: 'ஆயுள் சகம் (Ayu)', day: [P('Saturn'), P('Jupiter'), LAGNA], night: [P('Jupiter'), P('Saturn'), LAGNA] },
  { key: 'kariya', name: 'காரிய சகம் (Karma)', day: [P('Mars'), P('Mercury'), LAGNA], night: [P('Mercury'), P('Mars'), LAGNA] },
  { key: 'vyadhi', name: 'வியாதி சகம் (Roga)', day: [LL, P('Moon'), LAGNA], night: [P('Moon'), LL, LAGNA] },
  { key: 'vazhakku', name: 'வழக்கு/கலக சகம் (Kalaha)', day: [P('Jupiter'), P('Mars'), LAGNA], night: [P('Mars'), P('Jupiter'), LAGNA] },
  { key: 'sastra', name: 'சாஸ்திர சகம் (Sastra)', day: [P('Jupiter'), P('Saturn'), P('Mercury')], night: [P('Saturn'), P('Jupiter'), P('Mercury')] },
  { key: 'uravinargal', name: 'உறவினர்கள் சகம் (Bandhu)', day: [P('Mercury'), P('Moon'), LAGNA], night: [P('Moon'), P('Mercury'), LAGNA] },
  { key: 'marana_simple', name: 'மரண சகம் — எளிய (Mrityu)', day: [H(8), P('Moon'), LAGNA], night: [H(8), P('Moon'), LAGNA] },
  { key: 'velinaattu', name: 'வெளிநாட்டு சகம் (Videsha)', day: [H(9), HL(9), LAGNA], night: [H(9), HL(9), LAGNA] },
  { key: 'panavarumana', name: 'பண வருமான சகம் (Dravya)', day: [H(2), HL(2), LAGNA], night: [H(2), HL(2), LAGNA] },
  { key: 'paradara', name: 'பரதார சகம் (Paradara)', day: [P('Venus'), P('Sun'), LAGNA], night: [P('Sun'), P('Venus'), LAGNA] },
  { key: 'vanika', name: 'வணிக சகம் (Vanik)', day: [P('Moon'), P('Mercury'), LAGNA], night: [P('Mercury'), P('Moon'), LAGNA] },
  { key: 'karyasiddhi', name: 'காரிய சித்தி சகம் (Karyasiddhi)', day: [P('Saturn'), P('Sun'), RL('Sun')], night: [P('Saturn'), P('Moon'), RL('Moon')] },
  { key: 'vivaha', name: 'விவாக சகம் (Vivaha)', day: [P('Venus'), P('Saturn'), LAGNA], night: [P('Saturn'), P('Venus'), LAGNA] },
  { key: 'thukka', name: 'துக்க/சங்கட சகம் (Shoka)', day: [P('Saturn'), P('Moon'), H(6)], night: [P('Moon'), P('Saturn'), H(6)] },
  { key: 'muyarchi', name: 'முயற்சி/அன்பு சகம் (Preeti)', day: [P('Venus'), P('Mars'), LAGNA], night: [P('Mars'), P('Venus'), LAGNA] },
  { key: 'kaadhal', name: 'காதல் சகம் (Kaama)', day: [S('sastra'), S('punya'), LAGNA], night: [S('sastra'), S('punya'), LAGNA] },
  { key: 'theeratha_viyadhi', name: 'தீராத வியாதி சகம் (Asadhya-Roga)', day: [P('Mars'), P('Saturn'), P('Mercury')], night: [P('Saturn'), P('Mars'), P('Mercury')] },
  { key: 'uthiyoga', name: 'உத்தியோக சகம் (Karmajiva)', day: [P('Mars'), P('Mercury'), H(10)], night: [P('Mercury'), P('Mars'), H(10)] },
  { key: 'sathuru', name: 'சத்துரு சகம் (Shatru)', day: [P('Mars'), P('Saturn'), LAGNA], night: [P('Saturn'), P('Mars'), LAGNA] },
  { key: 'kappal', name: 'கப்பல்/தூர தேச சகம் (Yatra)', day: [D(105), P('Saturn'), LAGNA], night: [P('Saturn'), D(105), LAGNA] },
  { key: 'siraivasa', name: 'சிறைவாச/பந்தன சகம் (Bandhana)', day: [S('punya'), P('Saturn'), LAGNA], night: [P('Saturn'), S('punya'), LAGNA] },
  { key: 'thurmarana', name: 'துர்மரண சகம் (Apamrityu)', day: [H(8), P('Mars'), P('Saturn')], night: [P('Mars'), H(8), P('Saturn')] },
  { key: 'sadhana', name: 'சாதனா சகம் (Sadhana)', day: [H(11), P('Moon'), P('Jupiter')], night: [P('Moon'), H(11), P('Jupiter')] },
  { key: 'soozhnilai', name: 'சூழ்நிலை/தர்சன சகம் (Darshana)', day: [H(4), H(12), P('Jupiter')], night: [H(12), H(4), P('Jupiter')] },
  { key: 'sora', name: 'சோர/திருட்டு சகம் (Chaura)', day: [H(12), HL(6), P('Saturn')], night: [HL(6), H(12), P('Saturn')] },
  { key: 'parigara', name: 'பரிகார சகம் (Parigraha)', day: [P('Jupiter'), HL(9), H(5)], night: [HL(9), P('Jupiter'), H(5)] },
  { key: 'vyapara', name: 'வியாபார சகம் (Vyapara)', day: [P('Mars'), P('Saturn'), LAGNA], night: [P('Mars'), P('Saturn'), LAGNA] },
  { key: 'labha', name: 'லாப சகம் (Labha)', day: [H(11), HL(11), LAGNA], night: [H(11), HL(11), LAGNA] },
];

/**
 * @param {{ lagnaLon:number, lagnaRasi0:number, cusps:number[],
 *           grahaLon:Record<string,number>, grahaRasi0:Record<string,number>,
 *           isDayBirth:boolean }} v  varsha chart facts
 */
function calculateSahams(v) {
  const lagnaLordName = RASI_LORDS[v.lagnaRasi0];
  const houseCusp = (h) => v.cusps[(h - 1) % v.cusps.length];
  const houseLordLon = (h) => v.grahaLon[RASI_LORDS[Math.floor(norm360(houseCusp(h)) / 30)]];
  const rashiLordLon = (name) => v.grahaLon[RASI_LORDS[v.grahaRasi0[name]]];

  const computed = {};
  const resolve = (op) => {
    switch (op.t) {
      case 'planet': return v.grahaLon[op.name];
      case 'lagna': return v.lagnaLon;
      case 'lagnaLord': return v.grahaLon[lagnaLordName];
      case 'houseCusp': return houseCusp(op.house);
      case 'houseLord': return houseLordLon(op.house);
      case 'rashiLordOf': return rashiLordLon(op.planet);
      case 'saham': return computed[op.key];
      case 'const': return op.deg;
      default: return 0;
    }
  };

  return SAHAM_DEFS.map((def) => {
    const [aOp, bOp, cOp] = v.isDayBirth ? def.day : def.night;
    const a = resolve(aOp), b = resolve(bOp), c = resolve(cOp);
    let value = norm360(a - b + c);
    const corrected = !isBetweenCircular(c, a, b);
    if (corrected) value = norm360(value + 30);
    computed[def.key] = value;
    const rasi0 = Math.floor(value / 30);
    return {
      key: def.key,
      name: def.name,
      longitude: Math.round(value * 100) / 100,
      rasi: RASI_NAMES[rasi0],
      degreeInSign: Math.round((value - rasi0 * 30) * 100) / 100,
      corrected,
    };
  });
}

module.exports = { calculateSahams };
