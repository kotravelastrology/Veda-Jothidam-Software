/**
 * K.S. Krishnamurti, Reader IV (C32), printed pp.86-97, "To find out the physical feature and characteristic of the partner": note the sub-lord of the 7th cusp
 * (of the 2nd cusp for a second marriage), the sign in which it stands, and read the planet's twelve-sign paragraph (kpPartnerTables.js).
 *
 * The book words each planet's heading as "if the sub-lord of the seventh cusp is <planet> and it is deposited in <sign>, or the lord of the constellation is <planet> in which
 * sublord of 7 is in" and, under Mars, "if Mars would be occupying the following signs or if the sublord is in the constellations of Mars which is in". So there are two readings
 * and both are given:
 *  - the sub-lord itself, in the sign it occupies;
 *  - the lord of the constellation the sub-lord stands in (its star lord), in the sign that planet occupies (the Mars heading), and, where the sub-lord's own sign is a different sign,
 *    the paragraph of the star lord for the sub-lord's sign too (the general sentence: "find out in which sign the sub-lord is posited").
 * Rahu and Kethu (printed p.97): the result is read from the planet conjoined with the node; if none, from the planet that aspects it; if none is conjoined and none aspects, from the
 * lord of the star the node is in. Aspects (the book says "Western aspect" with no orb) are not computed, so the aspect step is reported, not taken.
 *
 * Nothing here is a verdict: the paragraphs are the book's own descriptions of a partner and are given as printed with a Tamil rendering.
 */
const T = require('./kpPartnerTables');
const { RASI_TA: SIGN_TA } = require('../sources/tamilNames');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader IV: Marriage and Married Life',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C32_KP_Reader_IV_Marriage_Children_KSK.pdf',
  pageLocus: 'Partner description tables, printed pp.86-97 (PDF page = printed + 3)',
};
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };

function entry(planet, sign) {
  const i = T.SIGNS.indexOf(sign);
  if (i < 0 || !T.TABLE[planet]) return null;
  const e = T.TABLE[planet][i];
  return { planet, planetTa: PLANET_TA[planet], sign, signTa: SIGN_TA[i], page: e.page, en: e.en, ta: e.ta };
}

/** The planet(s) whose paragraph is read when the sub-lord or star lord is a node. */
function resolveNode(node, positions) {
  const me = positions[node];
  const conjoined = Object.values(positions).filter((p) => p.name !== node && !['Rahu', 'Ketu'].includes(p.name) && p.sign === me.sign).map((p) => p.name);
  if (conjoined.length) return { planets: conjoined, how: 'conjoined', noteTa: `${PLANET_TA[node]} ${conjoined.map((p) => PLANET_TA[p]).join(', ')} உடன் சேர்ந்துள்ளது: நூல் விதிப்படி அந்தக் கிரகத்தின் பலன் (ப.97)` };
  const star = me.starLord;
  return {
    planets: ['Rahu', 'Ketu'].includes(star) ? [] : [star], how: 'star',
    noteTa: `${PLANET_TA[node]} உடன் சேர்ந்த கிரகம் இல்லை; அடுத்த படி "பார்க்கும் கிரகம்" (மேற்கத்திய பார்வை, ஓர்ப் இல்லை — கணக்கிடப்படவில்லை); கடைசிப் படி: அது நிற்கும் நட்சத்திர அதிபதி ${PLANET_TA[star]} (ப.97)`,
    aspectStepNotComputed: true,
  };
}

function readingsFor(cuspNo, kp, positions) {
  const cusp = kp.cusps.find((c) => c.number === cuspNo);
  const sub = cusp.sub;
  const out = [];
  const add = (basis, basisTa, planet, sign) => {
    if (['Rahu', 'Ketu'].includes(planet)) {
      const r = resolveNode(planet, positions);
      out.push({ basis, basisTa, node: planet, nodeTa: PLANET_TA[planet], via: r.how, noteTa: r.noteTa, aspectStepNotComputed: Boolean(r.aspectStepNotComputed),
        entries: r.planets.map((p) => entry(p, positions[p].sign)).filter(Boolean) });
      return;
    }
    const e = entry(planet, sign);
    if (e) out.push({ basis, basisTa, entries: [e] });
  };
  add('SUBLORD', `${cuspNo}-ஆம் கஸ்ப் உப அதிபதி ${PLANET_TA[sub]} தானே, தான் நிற்கும் ராசியில்`, sub, positions[sub].sign);
  const star = positions[sub].starLord;
  if (star !== sub) {
    add('STARLORD_OWN_SIGN', `உப அதிபதி நிற்கும் நட்சத்திர அதிபதி ${PLANET_TA[star]}, அவர் நிற்கும் ராசியில் (செவ்வாய் தலைப்பின் சொற்கள்)`, star, positions[star].sign);
    if (!['Rahu', 'Ketu'].includes(star) && positions[sub].sign !== positions[star].sign) {
      add('STARLORD_SUB_SIGN', `நட்சத்திர அதிபதி ${PLANET_TA[star]}, உப அதிபதி நிற்கும் ராசியில் ("உப அதிபதி எந்த ராசியில்" என்ற பொது வாக்கியம்)`, star, positions[sub].sign);
    }
  }
  return {
    cusp: cuspNo, subLord: sub, subLordTa: PLANET_TA[sub], starLord: positions[sub].starLord, starLordTa: PLANET_TA[positions[sub].starLord],
    subLordSign: positions[sub].sign, subLordSignTa: SIGN_TA[T.SIGNS.indexOf(positions[sub].sign)], readings: out,
  };
}

/** @param kp the object returned by calculateKpSystem */
function describePartner(kp) {
  if (!kp?.available) return { available: false };
  const positions = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  return {
    available: true,
    source: SOURCE,
    first: readingsFor(7, kp, positions),
    second: readingsFor(2, kp, positions),
    notesTa: [
      'முதல் துணைக்கு 7-ஆம் கஸ்ப்; இரண்டாம் துணைக்கு (இரண்டு திருமணங்கள் இருந்தால்) 2-ஆம் கஸ்ப் (ப.86).',
      'நூல் இதை "மிகச் சரியான முறை" என்கிறது; பத்தி நூலில் உள்ளபடியே (ஆங்கிலம்) தரப்படுகிறது, தமிழ் என் மொழிபெயர்ப்பு.',
      'இது தீர்ப்பு அல்ல: நூலின் விளக்கம் மட்டும்; ஜோதிடருக்கு உதவும் குறிப்பு.',
    ],
  };
}

module.exports = { describePartner, entry, resolveNode, SOURCE };
