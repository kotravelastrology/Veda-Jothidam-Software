/**
 * The houses K.S. Krishnamurti names for a horary question, from "Horary Astrology" (Reader VI, corpus C34). Only the questions whose houses the text states in so many
 * words are here; the book has about a hundred and ten. Each entry carries the printed page the page itself shows (printed = PDF - 19 up to about PDF 190, then PDF - 21), the houses,
 * and the reason the book gives for them, in my Tamil rendering. Nothing here is an answer: `analyseTopic` lists, for the houses of the question, which planets signify them
 * (the four levels of kpHouseSignificators.js), the sub-lord of each of those cusps and the houses it signifies, and which ruling planets signify them.
 */
const { MORE, EXTRA_RULES } = require('./kpHoraryMore');
const { C69_TOPICS } = require('./kpHoraryC69');

const BASE = [
  { id: 'MARRIAGE', titleTa: 'திருமணம்', houses: [2, 7, 11], page: 86, reasonTa: 'லக்னத்திலிருந்து 2, 7, 11-ஆம் வீடுகள்.' },
  { id: 'TRUNK_CALL', titleTa: 'தொலைபேசி அழைப்பு (டிரங்க் கால்) நடக்குமா', houses: [3, 9, 11], page: 124, reasonTa: '3, 9, 11-ஆம் வீடுகள். நூல் மேலும்: 11-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திர அதிபதி வக்ரமாக இருந்தால் பயன் இல்லை; 3-ஆம் கஸ்ப் உப அதிபதியின் நட்சத்திர அதிபதி வக்ரமாக இருந்தால் அழைப்பு நடக்காது; 9-ஆம் கஸ்ப் உப அதிபதி வக்ரமாக இருந்தால் மறுமுனையில் தொடர்பு கொள்ள முடியாது.' },
  { id: 'SERVANT_RETURN', titleTa: 'பணம் எடுத்துச் சென்ற வேலையாள் திரும்புவாரா', houses: [2, 6, 11], page: 129, reasonTa: 'பணம் பெறுவது 2; வேலையாள் 6; ஓடிப்போனால் 12; திரும்பி வந்து நியாயமான வரவு, மறுசேர்க்கை 11 — அதனால் 2, 6, 11.' },
  { id: 'DRUGS_REACH', titleTa: 'மருந்து சரியான இடத்தைச் சென்றடையுமா', houses: [4, 11], page: 133, reasonTa: 'சரியான இடத்தை அடைவது 4; எல்லோரும் விரும்புவது நிறைவேறுவது 11 — 4, 11.' },
  { id: 'REACH_DESTINATION', titleTa: 'போகுமிடத்தை அடைவோமா / வீடு சேருமா', houses: [4, 11], page: 135, reasonTa: 'முதன்மையாக 4, பிறகு 11; பயணம் செய்வோமா என்ற கேள்விக்கு 3-ஆம் வீடு.' },
  { id: 'INTERVIEW', titleTa: 'நேர்முகம்', houses: [3, 9, 11], page: 171, reasonTa: 'சந்திப்பு, நேர்காணல், பேச்சு 3; அதற்கு 3-ஆம் வீட்டிலிருந்து ஏழாவதான 9; நிறைவேற்றம் 11.' },
  { id: 'BUILD_HOUSE', titleTa: 'வீடு கட்டுதல்', houses: [4, 11, 12], page: 174, reasonTa: 'சொந்த வீடு, நிலம் 4; ஆசை நிறைவு 11; முதலீடு 12. கட்டி முடிந்த வீட்டை வாங்கினால் 6, 9-உம் (விற்பவர் 7; 6 அதன் 12-ஆம் வீடு).' },
  { id: 'COMPETITIVE_EXAM', titleTa: 'போட்டித் தேர்வு', houses: [4, 9, 11], page: 189, reasonTa: 'முதல், இரண்டாம், மூன்றாம் முயற்சி எதற்கும் 4, 9, 11.' },
  { id: 'LOTTERY', titleTa: 'லாட்டரியில் வெற்றி', houses: [2, 6, 11], page: 214, reasonTa: 'வங்கி நிலை உயர்வு 2; எதிரியின் இழப்பு 6; ஆதாயமும் ஆசை நிறைவும் 11.' },
  { id: 'HUSBAND_REUNION', titleTa: 'கணவருடன் சேர்ந்து குடும்ப வசதி பெறுதல்', houses: [2, 7, 11], page: 246, reasonTa: 'குடும்பம், வீட்டு வசதி 2; சட்டப்படி கணவர் 7; மறுசேர்க்கை, நிலையான உறவு 11.' },
  { id: 'HUSBAND_RETURN', titleTa: 'கணவர் திரும்பி வந்து சேர்வாரா', houses: [11, 7, 6], page: 251, reasonTa: 'திரும்பி வந்து சேர 11, 7, 6; பிரிவுக்கு 12, 7, 6.' },
  { id: 'SCHOLARSHIP_LOAN', titleTa: 'கல்வி உதவித்தொகை (திருப்ப வேண்டியது)', houses: [2, 6], page: 256, reasonTa: 'கடனுக்கு 2, 6; திருப்ப வேண்டாத நன்கொடை எனில் 2, 11.' },
  { id: 'SCHOLARSHIP_GIFT', titleTa: 'கல்வி உதவித்தொகை (திருப்ப வேண்டாதது)', houses: [2, 11], page: 256, reasonTa: 'திருப்ப வேண்டாத தொகை பரிசு போன்றது: 2, 11.' },
  { id: 'DONATION', titleTa: 'நன்கொடை கிடைக்குமா', houses: [2, 6, 11], page: 256, reasonTa: 'பணம் வந்து வங்கி நிலை உயர்வது 2; பிறர் தருவது 6; திருப்ப வேண்டாததால் ஆசை நிறைவு 11. (திருப்பிக் கொடுப்பது, கடன் தருவது 8, 12.)' },
  { id: 'OVERSEAS', titleTa: 'வெளிநாடு — எப்போது', houses: [3, 9, 12], page: 262, reasonTa: 'வெளிநாட்டுக்கு 3, 9, 12.' },
  { id: 'FOREIGN_ASSIGNMENT', titleTa: 'வெளிநாட்டுப் பணி', houses: [3, 9, 12], page: 301, reasonTa: 'செல்லும் காலத்துக்கு 3, 9, 12; பணியைக் குறிப்பது 6.' },
  { id: 'MISSING_RETURN', titleTa: 'காணாமல் போனவர் திரும்புதல்', houses: [2, 8, 11], page: 310, reasonTa: 'குடும்பம் 2; 8; திரும்புதல், மறுசேர்க்கை 11.' },
];

const TOPICS = [
  ...BASE.map((t) => ({ ...t, rules: EXTRA_RULES[t.id] ?? [] })),
  ...MORE.map(([id, titleTa, houses, page, reasonTa, rules]) => ({ id, titleTa, houses, page, reasonTa, rules })),
  ...C69_TOPICS,
];
const BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
const BAD = [6, 8, 12];

/** The planets that signify each house, from the four-level table of kpSystem.js. */
function signifiersByHouse(kp) {
  const out = {};
  for (const row of kp.houseSignificators ?? []) {
    out[row.house] = { level1: row.level1 ?? [], level2: row.level2 ?? [], level3: row.level3 ?? [], level4: row.level4 ?? [], all: [...new Set([...(row.level1 ?? []), ...(row.level2 ?? []), ...(row.level3 ?? []), ...(row.level4 ?? [])])] };
  }
  return out;
}

/**
 * One stated condition (kpHoraryMore.js): the sub-lord of the cusp (via 'SUB') or the lord of the star it stands in (via 'STAR') signifies all of `all`, one of `any`, and for `bm` also the badhaka or
 * the maraka house; `direct` also asks the sub-lord and its star lord not to be retrograde (the nodes are not counted as retrograde).
 */
function evaluateRule(kp, rule) {
  const sig = signifiersByHouse(kp);
  const planet = (n) => kp.positions.find((p) => p.name === n);
  const signifies = (name) => Object.keys(sig).map(Number).filter((h) => sig[h].all.includes(name));
  const cusp = kp.cusps.find((c) => c.number === rule.cusp);
  const sub = cusp.sub;
  const star = planet(sub)?.starLord;
  const who = rule.via === 'STAR' ? star : sub;
  const houses = signifies(who);
  const retro = (n) => Boolean(planet(n)?.retrograde && !['Rahu', 'Ketu'].includes(n));
  const bmSet = [kp.obstruction?.badhaka, ...(kp.obstruction?.maraka ?? [])].filter(Boolean);
  const hasAll = rule.all.every((h) => houses.includes(h));
  const hasAny = rule.any.length === 0 || rule.any.some((h) => houses.includes(h));
  const hasBm = !rule.bm || bmSet.some((h) => houses.includes(h));
  const isDirect = !rule.direct || (!retro(sub) && !retro(star));
  return {
    textTa: rule.textTa, cusp: rule.cusp, via: rule.via, subLord: sub, starLord: star, planet: who, houses, status: hasAll && hasAny && hasBm && isDirect ? 'HELD' : 'NOT_HELD',
    detail: { all: rule.all, any: rule.any, bm: rule.bm ? bmSet : null, direct: rule.direct, subRetrograde: retro(sub), starRetrograde: retro(star) },
  };
}

/** @param kp calculateKpSystem result of the horary chart, ruling the object of kpHorary.horaryRulingPlanets */
function analyseTopic(kp, ruling, topicId) {
  const topic = BY_ID[topicId];
  if (!topic) throw new Error(`unknown question: ${topicId}`);
  const sig = signifiersByHouse(kp);
  const signifies = (planet) => Object.keys(sig).map(Number).filter((h) => sig[h].all.includes(planet));
  const cusp = (n) => kp.cusps.find((c) => c.number === n);
  const rowFor = (planet) => ({ planet, houses: signifies(planet), topicHouses: signifies(planet).filter((h) => topic.houses.includes(h)), badHouses: signifies(planet).filter((h) => BAD.includes(h)) });
  const significators = [...new Set(topic.houses.flatMap((h) => sig[h]?.all ?? []))].map(rowFor);
  const cusps = topic.houses.map((h) => {
    const c = cusp(h);
    return { house: h, sign: c.sign, subLord: c.sub, starLord: c.starLord, subLordSignifies: signifies(c.sub), signifiesTopic: signifies(c.sub).filter((x) => topic.houses.includes(x)) };
  });
  const rulingRows = ruling.planets.map((r) => ({ ...r, ...rowFor(r.planet) }));
  // the trunk-call text names three retrograde conditions (printed p.124)
  const planet = (n) => kp.positions.find((p) => p.name === n);
  const retro = (n) => Boolean(planet(n)?.retrograde && !['Rahu', 'Ketu'].includes(n));
  const extra = [];
  if (topicId === 'TRUNK_CALL') {
    const starOfSub = (h) => cusp(h).sub && planet(cusp(h).sub)?.starLord;
    extra.push(
      { id: 'T11', textTa: '11-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திர அதிபதி வக்ரம்: நூல் — அழைப்பால் பயன் இல்லை', status: retro(starOfSub(11)) ? 'HELD' : 'NOT_HELD', detail: { star: starOfSub(11) } },
      { id: 'T3', textTa: '3-ஆம் கஸ்ப் உப அதிபதி நிற்கும் நட்சத்திர அதிபதி வக்ரம்: நூல் — அழைப்பு நடக்காது', status: retro(starOfSub(3)) ? 'HELD' : 'NOT_HELD', detail: { star: starOfSub(3) } },
      { id: 'T9', textTa: '9-ஆம் கஸ்ப் உப அதிபதி வக்ரம்: நூல் — மறுமுனையில் தொடர்பு கொள்ள முடியாது', status: retro(cusp(9).sub) ? 'HELD' : 'NOT_HELD', detail: { sub: cusp(9).sub } },
    );
  }
  const rules = (topic.rules ?? []).map((r) => evaluateRule(kp, r));
  return { topic, significators, cusps, ruling: rulingRows, extra, rules };
}

module.exports = { TOPICS, BY_ID, analyseTopic, signifiersByHouse, evaluateRule };
