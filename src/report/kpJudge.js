/**
 * K.S. Krishnamurti, Reader VI (C34), printed pp.107-121: the sub-lord of a cusp stands in the constellation of a planet; the sign that planet occupies selects the book's paragraph
 * (appearance and character from the ascendant, health and disease from the 6th cusp, finance and fortune from the 2nd, romance from the 5th and, for the partner, the 7th).
 * Descriptions as printed, not predictions. When the star lord is a node the book gives no sign paragraph for it here, so none is chosen and that is reported.
 */
const T = require('./kpJudgeTables');
const { describeStrength } = require('./kpStrength');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader VI: Horary Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C34_KP_Reader_VI_Horary_KSK.pdf',
  pageLocus: 'Signs and how to judge, printed pp.107-115; what the twelve houses signify, printed pp.116-121 (PDF page = printed + 19)',
};
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const SIGN_TA = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'];

function readCategory(id, cusp, kp, positions) {
  const cat = T.CATEGORIES[id];
  const sub = kp.cusps.find((c) => c.number === cusp).sub;
  const star = positions[sub].starLord;
  const base = { id, titleTa: cat.titleTa, cusp, subLord: sub, subLordTa: PLANET_TA[sub], starLord: star, starLordTa: PLANET_TA[star] };
  if (['Rahu', 'Ketu'].includes(star)) return { ...base, entry: null, noteTa: 'நட்சத்திர அதிபதி ராகு/கேது: இந்தப் பகுதியில் நூல் ராசி பத்தி தரவில்லை; தேர்வு செய்யப்படவில்லை.' };
  const sign = positions[star].sign;
  const i = T.SIGNS.indexOf(sign);
  const r = cat.rows[i];
  return { ...base, sign, signTa: SIGN_TA[i], entry: { page: r.page, en: r.en, ta: r.ta } };
}

/** @param kp calculateKpSystem result */
function describeJudge(kp) {
  if (!kp?.available) return { available: false };
  const positions = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  return {
    available: true,
    source: SOURCE,
    notesTa: ['லக்ன (தோற்றம், குணம்), 6 (உடல்நலம்), 2 (பணம்), 5 (காதல்), 7 (துணை) கஸ்ப்களின் உப அதிபதி நிற்கும் நட்சத்திரத்தின் அதிபதி எந்த ராசியில் உள்ளாரோ அந்த ராசிக்கான நூலின் பத்தி இது. விளக்கம் மட்டுமே; முடிவு அல்ல.'],
    strength: describeStrength(kp),
    houses: T.HOUSES,
    classes: T.CLASSES,
    readings: [
      readCategory('APPEARANCE', 1, kp, positions), readCategory('CHARACTER', 1, kp, positions), readCategory('HEALTH', 6, kp, positions),
      readCategory('FINANCE', 2, kp, positions), readCategory('ROMANCE', 5, kp, positions), { ...readCategory('ROMANCE', 7, kp, positions), titleTa: 'துணையின் காதல் குணம் (7-ஆம் கஸ்ப்)' },
    ],
  };
}

module.exports = { describeJudge, SOURCE, SIGN_TA };
