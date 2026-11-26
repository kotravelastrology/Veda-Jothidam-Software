/**
 * K.S. Krishnamurti, Reader VI (C34), printed pp.144-153: "Strength of planets". K.P. does not grade a planet by exaltation or by being retrograde in a natal chart; what it does read is
 *  (1) the retrograde star: a planet standing in the constellation of a retrograde planet cannot give the matter in its period (pp.146-147), and
 *  (2) the planet in the constellation of an eclipsed planet: as the sub-lord of a cusp it gives the paragraph of that cusp in its dasa, bhukti or anthra (pp.151-152).
 * Rahu and Ketu are never counted as retrograde (p.146). The book gives no orb for "eclipsed", so the distance of the star lord from the Sun is shown and no planet is declared eclipsed;
 * the paragraph is the book's own wording for the case where it is. Conditions only, no verdicts.
 */
const { signifiersByHouse } = require('./kpHoraryTopics');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader VI: Horary Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C34_KP_Reader_VI_Horary_KSK.pdf',
  pageLocus: 'Retrograde and eclipsed planets, printed pp.145-152 (PDF page = printed + 19)',
};
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const NODES = ['Rahu', 'Ketu'];

// printed pp.151-152: "If a planet is deposited in the constellation of an eclipsed one and if it is the sub-lord of the ... cusp"
const ECLIPSE = [
  [1, 151, 'the native will be imprisoned; he will lead the life incognito; will suffer from fear, disease and anxiety, will participate in funeral rites; incur loss and may lose position too, will be unfortunate, etc.',
    'சிறைப்படுதல்; மறைந்த வாழ்வு; அச்சம், நோய், கவலை; இறுதிச் சடங்கில் பங்கு; இழப்பு, பதவி இழப்பு; துரதிர்ஷ்டம் முதலியன.'],
  [2, 151, 'Behaves stupidly in a public assembly, will be untrustworthy, will receive annoying letters, write bad ones or anonymous ones, suffer from eye troubles, will be foul-tongued, spend heavily, incur royal displeasure.',
    'பொதுக் கூட்டத்தில் மடத்தனமாக நடத்தல்; நம்பிக்கைக்கு உரியவரல்லர்; எரிச்சலூட்டும் கடிதங்களைப் பெறுதல், மோசமான அல்லது பெயரில்லாக் கடிதங்களை எழுதுதல்; கண் தொல்லை; கடுஞ்சொல்; அதிகச் செலவு; அரசின் அதிருப்தி.'],
  [3, 151, 'Demise of brother, evil advice, trouble through secret machination of internal enemies, humiliation, discomfiture and loss of pride thereby.',
    'சகோதரரின் மறைவு; தீய ஆலோசனை; உள்ளிருக்கும் பகைவரின் இரகசியச் சூழ்ச்சியால் தொல்லை; அவமானம், தடுமாற்றம், அதனால் பெருமை இழப்பு.'],
  [4, 151, 'Distress to mother, sickness to dear friends, danger to building, trouble due to the loss of cattle, danger from water and conveyance.',
    'தாய்க்குத் துன்பம்; அன்பான நண்பர்களுக்கு நோய்; கட்டிடத்துக்கு ஆபத்து; கால்நடை இழப்பால் தொல்லை; நீர், வாகனத்தால் ஆபத்து.'],
  [5, 151, 'Loss of a child, aberration of the mind, deception, wearisome wandering, trouble in the stomach, displeasure of the Government and bodily weakness.',
    'குழந்தை இழப்பு; மனக்குழப்பம்; ஏமாற்றம்; சோர்வூட்டும் அலைச்சல்; வயிற்றுத் தொல்லை; அரசின் அதிருப்தி; உடல் பலவீனம்.'],
  [6, 151, 'Will have troubles through thieves, will suffer reverse, defeat, will commit wicked acts, will do servile duties, will be despised, scandalised and injured.',
    'திருடர்களால் தொல்லை; பின்னடைவு, தோல்வி; தீய செயல்; அடிமைப் பணி; இகழ்ச்சி, அவதூறு, காயம்.'],
  [7, 151, 'Distress to son-in-law, separation from beloved, untoward results due to the troubles from the opposite sex, intrigues with wicked women, diseases in the private parts, ever wandering.',
    'மருமகனுக்குத் துன்பம்; அன்புக்குரியவரைப் பிரிதல்; எதிர்பாலினத்தால் தொல்லை, தகாத விளைவு; தீய பெண்களுடன் சூழ்ச்சி; மறைவிட நோய்; எப்போதும் அலைச்சல்.'],
  [8, 152, 'Excessive sorrow; want of sense, carnal appetite, jealousy, unconsciousness, poverty, fruitless rambling, sickness, humiliation and death.',
    'மிகுந்த துக்கம்; அறிவின்மை; காம வேட்கை; பொறாமை; மயக்கம்; வறுமை; பயனற்ற அலைச்சல்; நோய்; அவமானம்; மரணம்.'],
  [9, 152, 'Will incur the wrath of the deity or Guru or preceptor or father, suffer something untoward, trouble to wife and children, will do wicked acts, elder\'s demise, will suffer from poverty.',
    'தெய்வம், குரு, ஆசிரியர் அல்லது தந்தையின் கோபம்; தகாதது நேர்தல்; மனைவி, குழந்தைகளுக்குத் தொல்லை; தீய செயல்; பெரியவரின் மறைவு; வறுமை.'],
  [10, 152, 'Fruitless attempts, loss of honour, will become wicked, leave his permanent place, inauspicious happenings, will lead bad life, suffer troubles.',
    'பயனற்ற முயற்சி; மானம் இழப்பு; தீயவராதல்; நிலையான இடத்தை விட்டு நீங்குதல்; அமங்கல நிகழ்வுகள்; மோசமான வாழ்வு; தொல்லை.'],
  [11, 152, 'Bad news, trouble to elder brother, sickness to children, will suffer misery, deception and ear disease.',
    'கெட்ட செய்தி; மூத்த சகோதரருக்குத் தொல்லை; குழந்தைகளுக்கு நோய்; துன்பம், ஏமாற்றம், காது நோய்.'],
  [12, 152, 'Various diseases, dishonour, disappearance of wealth, detention, bondage.',
    'பல நோய்கள்; அவமானம்; செல்வம் மறைதல்; தடுப்புக்காவல்; கட்டுப்பாடு.'],
];

// printed pp.146-147: the matters and the houses whose significators are blocked by a retrograde star
const RETRO_TOPICS = [
  { id: 'MARRIAGE', houses: [2, 7, 11], page: 146, textTa: 'திருமணம்: 2, 7, 11-ஐக் குறிக்கும் கிரகம் வக்ர கிரகத்தின் நட்சத்திரத்தில் (தானே நேர்கதி அல்லது வக்ரம்) இருந்தால் அதன் தசா-புக்தியில் திருமணம் தராது.' },
  { id: 'DIVORCE', houses: [1, 6, 10], page: 147, textTa: 'விவாகரத்து: 1, 6, 10-ஐக் குறிக்கும் கிரகம் வக்ர நட்சத்திரத்தில் இருந்தால் பிரிய முடியாது.' },
  { id: 'IMPRISONMENT', houses: [3, 12], page: 147, textTa: 'சிறை: 3, 12-ஐக் குறிக்கும் கிரகம் வக்ர நட்சத்திரத்தில் இருந்தால் அதன் காலத்தில் கைது இல்லை; மற்றொரு குறிகாட்டி நேர்கதி நட்சத்திரத்தில் இருந்தால் அதன் காலத்தில் சிறை.' },
  { id: 'VICTORY', houses: [6, 11], page: 147, textTa: 'போட்டி, வழக்கு, தேர்தலில் வெற்றி: 6, 11-ஐக் குறிக்கும் கிரகம் வக்ர நட்சத்திரத்தில் இருந்தால் அதன் காலத்தில் வெற்றி இல்லை; நேர்கதி நட்சத்திரத்தில் இருக்கும் குறிகாட்டியின் காலத்தில் வெற்றி.' },
];

const angularSeparation = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

/** @param kp calculateKpSystem result */
function describeStrength(kp) {
  if (!kp?.available || !kp.houseSignificators) return { available: false };
  const pos = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  const retro = (n) => Boolean(pos[n]?.retrograde && !NODES.includes(n));
  const sig = signifiersByHouse(kp);
  const planets = kp.positions.map((p) => ({
    planet: p.name, planetTa: PLANET_TA[p.name], retrograde: retro(p.name), starLord: p.starLord, starLordTa: PLANET_TA[p.starLord], inRetrogradeStar: retro(p.starLord),
    bothRetrograde: retro(p.name) && retro(p.starLord),
  }));
  const topics = RETRO_TOPICS.map((t) => {
    const signifiers = [...new Set(t.houses.flatMap((h) => sig[h]?.all ?? []))].filter((n) => pos[n]);
    const blocked = signifiers.filter((n) => retro(pos[n].starLord));
    const free = signifiers.filter((n) => !retro(pos[n].starLord));
    return { id: t.id, houses: t.houses, page: t.page, textTa: t.textTa, blocked, free, status: blocked.length ? 'HELD' : 'NOT_HELD' };
  });
  // the marriage promise rule of p.146: the 7th cusp sub-lord retrograde and in a retrograde star, or direct with a retrograde star lord
  const sub7 = kp.cusps.find((c) => c.number === 7).sub;
  const marriage = {
    page: 146, subLord: sub7, subLordTa: PLANET_TA[sub7], starLord: pos[sub7].starLord, starLordTa: PLANET_TA[pos[sub7].starLord],
    subRetrograde: retro(sub7), starRetrograde: retro(pos[sub7].starLord),
    readingTa: retro(pos[sub7].starLord)
      ? (retro(sub7) ? 'நூல்: 7-ஆம் கஸ்ப் உப அதிபதி வக்ரமாகவும் வக்ர நட்சத்திரத்திலும் — திருமணமே இல்லை.' : 'நூல்: உப அதிபதி நேர்கதி, ஆனால் நட்சத்திர அதிபதி வக்ரம் — கேட்கும் அந்த நபருடன் திருமணம் இல்லை (திருமணமே இல்லை என்று பொருளல்ல).')
      : null,
  };
  const sun = pos.Sun;
  const eclipse = ECLIPSE.map(([cusp, page, en, ta]) => {
    const c = kp.cusps.find((x) => x.number === cusp);
    const star = pos[c.sub].starLord;
    const separation = star === 'Sun' || NODES.includes(star) ? null : angularSeparation(pos[star].longitude, sun.longitude);
    return {
      cusp, page, en, ta, subLord: c.sub, subLordTa: PLANET_TA[c.sub], starLord: star, starLordTa: PLANET_TA[star],
      separationFromSun: separation, sameSignAsSun: separation === null ? null : pos[star].sign === sun.sign,
    };
  });
  return {
    available: true, source: SOURCE, planets, topics, marriage, eclipse,
    notesTa: ['நூல் "கிரகம் வக்ர நட்சத்திரத்தில்" என்பதையே பார்க்கிறது; ராகு-கேது வக்ரமாகக் கணக்கிடப்படுவதில்லை (ப.146). "அஸ்தமனம்" எந்த அளவில் என்று நூல் சொல்வதில்லை, அதனால் நட்சத்திர அதிபதியின் சூரியனிலிருந்து தூரம் மட்டும் காட்டப்படுகிறது.'],
  };
}

module.exports = { describeStrength, SOURCE, ECLIPSE, RETRO_TOPICS };
