/**
 * K.S. Krishnamurti, Reader VI (C34), printed pp.154-159: "How long will one live?", "What about ailment?", "Cure when?" and "Accident",
 * read in the horary chart of a number (src/report/kpHorary.js). As every other page of the program shows such passages: the book's
 * conditions, and whether this chart holds each of them; no verdict, no date of death is calculated.
 *  - badhaka house by the ascendant's sign (movable 11, fixed 9, common 7), maraka houses 2 and 7 (p.154);
 *  - the ascendant's sub-lord and the star it stands in: star lord a significator of badhaka / maraka, of 6, of 8; the sub-lord itself a
 *    significator of 12 (p.155);
 *  - the significators of death (a)-(d) of p.157 (the occupants of those houses, the planets in their stars, the lords and the planets in
 *    the lords' stars); (e), "conjoined with or aspected by them", is not computed: the book gives no orb;
 *  - ailment (p.158): the ascendant's sub-lord in the star of an occupant of 1 or 11, or of a significator of 1 and 6; the 6th cusp's
 *    sub-lord in the star of a significator of 6 and 1 and not of 11; Saturn (chronic), Mars (acute), Mercury (complications) taken only
 *    where the sub-lord or its star lord is that planet — "connected in any manner" is not defined in the book;
 *  - cure: the significators of 5 and 11 (p.158); accident: the 8th cusp's sub-lord in the star of a significator of 8, with 6, 12,
 *    badhaka / maraka (p.159).
 * The worked example of p.156 (number 246, 24-10-1967, 5.30 P.M.) is reproduced in test-kp-longevity.js.
 */
const { signifiersByHouse } = require('./kpHoraryTopics');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader VI: Horary Astrology',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C34_KP_Reader_VI_Horary_KSK.pdf',
  pageLocus: 'How long will one live?, ailment, cure, accident, printed pp.154-159 (PDF page = printed + 19)',
};
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const BADHAKA = { Movable: 11, Fixed: 9, Dual: 7 };
const MOVABLE = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
const FIXED = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];
const modality = (sign) => (MOVABLE.includes(sign) ? 'Movable' : FIXED.includes(sign) ? 'Fixed' : 'Dual');

/** @param kp the horary chart's calculateKpSystem result */
function describeLongevity(kp) {
  if (!kp?.available || !kp.houseSignificators) return { available: false };
  const pos = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  const sig = signifiersByHouse(kp);
  const signifies = (name, h) => Boolean(sig[h]?.all.includes(name));
  const housesOf = (name) => Object.keys(sig).map(Number).filter((h) => signifies(name, h)).sort((a, b) => a - b);
  const cusp = (n) => kp.cusps.find((c) => c.number === n);
  const ta = (n) => PLANET_TA[n] ?? n;

  const ascSign = cusp(1).sign;
  const badhaka = BADHAKA[modality(ascSign)];
  const maraka = [2, 7];
  const deathHouses = [...new Set([badhaka, ...maraka])].sort((a, b) => a - b);

  const sub = cusp(1).sub;
  const star = pos[sub].starLord;
  const starHouses = housesOf(star);
  const held = (yes) => (yes ? 'HELD' : 'NOT_HELD');
  const life = [
    { id: 'SHORT', page: 155, status: held(deathHouses.some((h) => signifies(star, h))),
      en: 'If he is deposited in the constellation of the significators of badhakasthana and marakasthana the life will be short after the time of judgment.',
      ta: 'லக்ன உப அதிபதி பாதக, மாரக ஸ்தானக் குறிகாட்டியின் நட்சத்திரத்தில் இருந்தால் தீர்ப்பு நேரத்துக்குப் பின் ஆயுள் நீண்டதல்ல (நூல்).' },
    { id: 'DISEASE', page: 155, status: held(signifies(star, 6)),
      en: 'If sub-lord of the ascendant were to be in the constellation of the significator of sixth house, the person will suffer from disease but will not succumb to it.',
      ta: 'உப அதிபதி 6-ஆம் வீட்டுக் குறிகாட்டியின் நட்சத்திரத்தில்: நோய் வரும், ஆனால் அதற்கு இரையாக மாட்டார் (நூல்).' },
    { id: 'ACCIDENT', page: 155, status: held(signifies(star, 8)),
      en: 'If the sub-lord of the ascendant is deposited in the constellation of the significator of the 8th house, he will meet with accident.',
      ta: 'உப அதிபதி 8-ஆம் வீட்டுக் குறிகாட்டியின் நட்சத்திரத்தில்: விபத்து (நூல்).' },
    { id: 'BED', page: 155, status: held(signifies(sub, 12)),
      en: 'If the sub-lord of the ascendant in the Horary Chart is the significator of the 12th house, he will be in bed for long period and may be admitted in a hospital.',
      ta: 'லக்ன உப அதிபதியே 12-ஆம் வீட்டுக் குறிகாட்டி: நீண்ட நாள் படுக்கை, மருத்துவமனையில் சேர்க்கப்படலாம் (நூல்).' },
  ];
  // (a)-(d) of p.157 for the badhaka and maraka houses
  const deathSignificators = deathHouses.map((h) => ({
    house: h, occupants: sig[h]?.level2 ?? [], inOccupantsStars: sig[h]?.level1 ?? [], lord: sig[h]?.level4 ?? [], inLordsStars: sig[h]?.level3 ?? [],
  }));

  // ailment, p.158
  const starOccupies = [1, 11].includes(pos[star].house);
  const sub6 = cusp(6).sub;
  const star6 = pos[sub6].starLord;
  const nature = (names) => {
    const out = [];
    if (names.includes('Saturn')) out.push({ planet: 'Saturn', en: 'the disease is a chronic one', ta: 'நாள்பட்ட நோய்' });
    if (names.includes('Mars')) out.push({ planet: 'Mars', en: 'it is an acute disease', ta: 'கடுமையான (திடீர்) நோய்' });
    if (names.includes('Mercury')) out.push({ planet: 'Mercury', en: 'Mercury shows complications', ta: 'சிக்கல்கள்' });
    return out;
  };
  const ailment = [
    { id: 'HEALTH_GOOD', page: 158, status: held(starOccupies),
      en: 'Health is generally good if the sub-lord of the ascendant is deposited in the constellation of the planet occupying the house 1 or 11.',
      ta: 'லக்ன உப அதிபதி 1 அல்லது 11-இல் நிற்கும் கிரகத்தின் நட்சத்திரத்தில் இருந்தால் பொதுவாக உடல்நலம் நன்று (நூல்).' },
    { id: 'DISEASE_1_6', page: 158, status: held(signifies(star, 1) && signifies(star, 6)),
      en: 'If the sub-lord of the ascendant is deposited in the constellation of a planet which is the significator of 1 and 6, one will suffer from disease during its periods and sub-periods.',
      ta: 'லக்ன உப அதிபதி 1, 6 இரண்டுக்கும் குறிகாட்டியான கிரகத்தின் நட்சத்திரத்தில்: அதன் தசா-புக்திகளில் நோய் (நூல்).' },
    { id: 'SIXTH_SUB', page: 158, status: held(signifies(star6, 6) && signifies(star6, 1) && !signifies(star6, 11)),
      en: 'If the sub-lord of the 6th house is deposited in the constellation of a planet which is the significator of the 6 and 1 and not of 11, then the sub-lord, during its sub-period, will give the disease.',
      ta: '6-ஆம் கஸ்ப் உப அதிபதி 6, 1-க்குக் குறிகாட்டியான, 11-க்கு அல்லாத கிரகத்தின் நட்சத்திரத்தில்: அதன் புக்தியில் நோய் (நூல்).' },
  ];

  // accident, p.159
  const sub8 = cusp(8).sub;
  const star8 = pos[sub8].starLord;
  const acc = signifies(star8, 8);
  const accident = [
    { id: 'ACCIDENT_8', page: 159, status: held(acc), en: 'The sub-lord of the 8th house is to be deposited in the constellation of the planet which is the significator of the 8th house.', ta: '8-ஆம் கஸ்ப் உப அதிபதி 8-ஆம் வீட்டுக் குறிகாட்டியின் நட்சத்திரத்தில் — விபத்து (நூல்).' },
    { id: 'FEVER', page: 159, status: held(acc && signifies(star8, 6)), en: 'If the significator happens to be also the significator of the 6th house, then he will have fever, etc., following the accident.', ta: 'அதுவே 6-க்கும் குறிகாட்டியானால் விபத்தைத் தொடர்ந்து காய்ச்சல் முதலியன (நூல்).' },
    { id: 'HOSPITAL', page: 159, status: held(acc && signifies(star8, 12)), en: 'If the same sub-lord is in the star of a planet who is also the significator of the 12th, he will be admitted in a hospital.', ta: '12-க்கும் குறிகாட்டியானால் மருத்துவமனையில் சேர்க்கப்படுவார் (நூல்).' },
    { id: 'SUCCUMB', page: 159, status: held(acc && deathHouses.some((h) => signifies(star8, h))), en: 'If the sub-lord happens to be the significator of Bathaka Sthana and Maraka Sthana, he will succumb to it, provided his longevity is not further more promised.', ta: 'பாதக, மாரக ஸ்தானக் குறிகாட்டியானால், ஆயுள் மேலும் வாக்களிக்கப்படாவிட்டால் தாங்க மாட்டார் (நூல்).' },
  ];

  return {
    available: true, source: SOURCE,
    ascendant: { sign: ascSign, modality: modality(ascSign), badhaka, maraka },
    subLord: sub, subLordTa: ta(sub), starLord: star, starLordTa: ta(star), starLordHouses: starHouses, subLordHouses: housesOf(sub),
    life, deathSignificators,
    ailment, ailmentNature: nature([sub, star]), sixth: { subLord: sub6, subLordTa: ta(sub6), starLord: star6, starLordTa: ta(star6), nature: nature([sub6, star6]) },
    cure: { page: 158, significators5: sig[5]?.all ?? [], significators11: sig[11]?.all ?? [],
      ta: 'குணம்: நோய் தரும் 6-ஆம் வீட்டுக் குறிகாட்டியின் காலத்துக்குப் பின் 5 அல்லது 11-ஆம் வீட்டுக் குறிகாட்டியின் காலம் வரும்போது; ஆயுள் வாக்களிக்கப்பட்டிருந்தால் மட்டுமே மீள்வார் (நூல்).' },
    accident: { subLord: sub8, subLordTa: ta(sub8), starLord: star8, starLordTa: ta(star8), rules: accident },
    notesTa: [
      'நூல் சொல்லும் நிபந்தனைகள் இந்த ஜாதகத்தில் உள்ளனவா என்பது மட்டும்; ஆயுள், மரண நாள் எதுவும் கணிக்கப்படவில்லை. நூல் தீர்ப்பு நேரத்து ஆளும் கிரகங்களைக் கொண்டு உறுதி செய்யச் சொல்கிறது.',
      '(e) "சேர்க்கை அல்லது பார்வையால் தொடர்பு" கணிக்கப்படவில்லை — நூல் ஓர்ப் தரவில்லை. நோயின் தன்மை (சனி, செவ்வாய், புதன்) உப அதிபதி அல்லது அதன் நட்சத்திர அதிபதியே அந்தக் கிரகமாக இருக்கும்போது மட்டும் காட்டப்படுகிறது.',
    ],
  };
}

module.exports = { describeLongevity, SOURCE, BADHAKA };
