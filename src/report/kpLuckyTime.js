/**
 * K.S. Krishnamurti, Reader V "Transit" (corpus C33), printed pp.219-234, "Lucky timings": to begin a thing at a good moment, take the planets that signify the houses of that
 * matter (and none of the houses the book names to avoid), then choose (1) the period, a dasa-bhukti-anthra whose three lords are such planets, (2) the day, the Moon in the star and sub of
 * such planets, and (3) the minute, the ascendant in a sign, star and sub of such planets. The book says "significators of the houses 6 and 11 ... not connected with 8 and 12", so a planet
 * qualifies here when it signifies at least one of the houses to take and none of the houses to avoid (the four levels of kpHouseSignificators.js).
 *
 * The list is the book's own: each entry names the houses as printed. The conditions are listed, not promised: the book itself says the moment helps only where the horoscope allows (pp.223, 229).
 * Pages 195-218 (cards, horse racing) work the same method on a gambler's own chart and are not separate entries.
 */
const { signifiersByHouse } = require('./kpHoraryTopics');
const { rulingRisingMoments, rulingTransitMoments } = require('./kpRulingTime');

const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader V: Transit (Gochara Phala Nirnayam)',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C33_KP_Reader_V_Transit_KSK.pdf',
  pageLocus: 'Lucky timings, printed pp.219-234',
};

// [id, Tamil title, page, houses to take, houses to avoid, which parts of the moment the book asks for, note in Tamil]
const PARTS_ALL = ['dasha', 'moon', 'ascendant'];
const PARTS_MA = ['moon', 'ascendant'];
const T = (id, titleTa, page, take, avoid, parts, noteTa) => ({ id, titleTa, page, take, avoid, parts, noteTa });
const TOPICS = [
  T('TREASURE', 'புதையல் எடுக்கத் தொடங்க', 219, [2, 4, 6, 11], [8, 12], ['dasha', 'moon'], 'நூல்: 11-ஆம் கஸ்ப் உப அதிபதி சனியுடனும் 4, 6-உடனும் தொடர்பு உள்ளவருக்கு மட்டுமே; சந்திரன் சனியுடனும் தொடர்புள்ள நட்சத்திரத்தில் செல்ல வேண்டும்; தசை-புக்தி-அந்தரம்-சூக்ஷ்மம் அனைத்தும் இவர்களாக.'),
  T('SICK_CHILD', 'நோயுற்ற குழந்தைக்குச் சிகிச்சை தொடங்க', 220, [1, 5, 11], [], PARTS_ALL, 'நூல்: தசை-புக்தி அதிபதி நிற்கும் நட்சத்திரம்-உபத்தில் சந்திரன் செல்லும் நாள்; லக்ன ராசி-நட்சத்திர-உப அதிபதிகள் 1, 5, 11-ஐக் குறிப்பவர்.'),
  T('ACTRESS', 'நடிகையாக வளர', 220, [5, 6, 10, 11], [], PARTS_ALL, 'நூல்: 10-ஆம் கஸ்ப் உப அதிபதி வலுவாக இருந்தால் புகழ்; 2, 11-ஆம் உப அதிபதிகள் ஆதாயம்.'),
  T('TENDER', 'ஒப்பந்தப் பணிக்கு டெண்டர் அளிக்க', 221, [3, 6, 9, 11], [], PARTS_MA, ''),
  T('FILM_SHOOT', 'திரைப்பட ஒளிப்பதிவு தொடங்க', 221, [6, 10, 11], [8, 12], PARTS_MA, 'ஒவ்வொரு நடிகரின் தொடக்கத்துக்கும் இதே.'),
  T('FILM_RELEASE', 'திரைப்படம் வெளியிட', 221, [2, 6, 11], [8, 12], PARTS_MA, ''),
  T('LOTTERY_TICKET', 'லாட்டரி சீட்டு வாங்க', 221, [2, 3, 6, 11], [8, 12], PARTS_ALL, 'நூல்: சரியான ஜாதகம் இல்லாதவர் பிரச்னக் கணக்கில் வீடுகளைக் குறிப்பவர்களை எடுக்க; உண்மையான சீட்டுக் கடையில் வாங்க.'),
  T('OVERDRAFT', 'வங்கி மேலாளரைச் சந்தித்து ஓவர்டிராப்ட் கேட்க', 223, [3, 6, 9, 11], [], PARTS_ALL, ''),
  T('BANK_ACCOUNT', 'வங்கிக் கணக்குத் தொடங்க', 225, [3, 6, 11], [8, 12], PARTS_ALL, 'நூல்: 8, 12-ஐக் குறிப்பவர்களின் காலத்தில் தொடங்கினால் சேமிப்பு நிற்காது.'),
  T('CID_WORK', 'திருடனைப் பிடிக்கும் புலன்விசாரணை தொடங்க', 226, [6, 10, 11], [], PARTS_MA, 'நூல்: இவர்கள் 5, 9-ஐயும் குறித்தால் 5, 9-ஐக் குறிக்காத இணைந்த காலம் வரை திருடன் தப்புவான்.'),
  T('COURT_FILING', 'நீதிமன்றத்தில் வழக்குத் தொடர', 227, [6, 11], [8, 12], PARTS_MA, 'நூல் எச்சரிக்கை: வழக்கு வெற்றி என்று எழுத்தில் தரக்கூடாது (ப.227).'),
  T('STRIKE_NOTICE', 'நியாயமான கோரிக்கைக்கு வேலைநிறுத்த அறிவிப்பு', 228, [6, 11], [8, 12], PARTS_MA, 'தலைவரின் ஜாதகத்தின்படி.'),
  T('MANTRA', 'சித்திக்கு மந்திரம் தொடங்க', 228, [10, 11], [], PARTS_MA, ''),
  T('MUSIC', 'இசைக் கலையைத் தொடங்க', 228, [2, 3, 5, 10, 11], [], ['dasha'], ''),
  T('DONATION', 'நன்கொடை கேட்க (கொடுப்பவரின் ஜாதகம்)', 228, [8, 12], [], PARTS_MA, 'நூல்: கொடுப்பவரின் 8, 12-ஐக் குறிப்பவர்கள்; அவரின் ஜாதகத்தை இங்கு கொடுக்க.'),
  T('AGREEMENT', 'ஒப்பந்தத்தில் கையெழுத்திட', 229, [2, 6, 11], [5, 8, 12], PARTS_ALL, 'நூல்: 6, 11 (அல்லது 2, 6, 11) வெற்றி-இலாபம்; 5, 8, 12 இடையூறு.'),
  T('LOVE_MEETING', 'காதலரைச் சந்திக்க', 231, [1, 5, 7, 11], [4, 6, 10], ['moon', 'ascendant'], 'நூல்: 1, 7, 11 — நீங்கள் முன்னெடுப்பவர்; 5, 7, 11 — மற்றவர் முன்னெடுப்பவர்; 4, 6, 10 நாளைத் தவிர்க்க.'),
  T('PARENTS_CONSENT', 'காதலுக்குப் பெற்றோர் சம்மதிக்க (பேச்சு)', 232, [3, 5, 9, 11], [8, 10, 12], PARTS_MA, ''),
  T('ENTER_HOUSE', 'புதிய வீட்டில் குடியேற', 232, [2, 4, 11], [5, 8, 12], PARTS_MA, ''),
  T('TAKE_VEHICLE', 'வாகனம் பெற்றுக்கொள்ள', 233, [2, 4, 11], [3, 10], PARTS_MA, 'நூல்: லக்னம் 9-ஆம் வீட்டு உபத்தில் இருந்தால் வாகனம் பழுது; 12-இல் செலவு; 3, 12-இல் திருட்டு.'),
  T('SCHOLARSHIP_LETTER', 'கல்வி உதவித்தொகை விண்ணப்பம் கையெழுத்திட', 233, [3, 6, 9, 11], [], PARTS_MA, ''),
  T('PASSPORT', 'கடவுச்சீட்டுக்கு விண்ணப்பிக்க', 233, [3, 9, 11, 12], [], PARTS_MA, ''),
  T('COLLEGE_ADMISSION', 'கல்லூரி சேர்க்கை விண்ணப்பம்', 234, [4, 9, 11], [], PARTS_MA, ''),
  T('LEAVE_FOR_AIRPORT', 'விமான நிலையத்துக்குப் புறப்பட', 234, [3, 9, 11], [], PARTS_MA, ''),
  T('CONCEIVE', 'குழந்தைப்பேறுக்காக இல்லறம்', 234, [2, 5, 11], [1, 4, 10], PARTS_ALL, 'நூல் ஆய்வுக் குறிப்பு: குழந்தை விதியில் உள்ளவர்களுக்கு மட்டும் (ப.234).'),
];
const BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** The planets that signify at least one house to take and none to avoid. */
function eligiblePlanets(kp, topic) {
  const sig = signifiersByHouse(kp);
  const houses = (name) => Object.keys(sig).map(Number).filter((h) => sig[h].all.includes(name));
  return kp.positions.map((p) => p.name).map((name) => ({ name, houses: houses(name) }))
    .filter((p) => p.houses.some((h) => topic.take.includes(h)) && !p.houses.some((h) => topic.avoid.includes(h)));
}

/** The dasa-bhukti-anthra periods (a tree from buildVimshottariDasha with depth 3) whose three lords are all eligible, clipped to [fromJd, toJd]. */
function eligiblePeriods(vim, names, fromJd, toJd) {
  const ok = new Set(names);
  const out = [];
  for (const d of vim.dashas) {
    if (!ok.has(d.lord) || d.endJulianDay < fromJd || d.startJulianDay > toJd) continue;
    for (const b of d.Bhukti ?? []) {
      if (!ok.has(b.lord) || b.endJulianDay < fromJd || b.startJulianDay > toJd) continue;
      for (const a of b.Antara ?? []) {
        if (!ok.has(a.lord) || a.endJulianDay < fromJd || a.startJulianDay > toJd) continue;
        out.push({ lords: [d.lord, b.lord, a.lord], startJd: Math.max(a.startJulianDay, fromJd), endJd: Math.min(a.endJulianDay, toJd) });
      }
    }
  }
  // neighbouring antaras of the same three-lord chain do not touch, so no merging is needed
  return out;
}

/**
 * @param kp the native's calculateKpSystem result
 * @param vim buildVimshottariDasha(..., { depth: 3 })
 * @param opts { topicId, fromJd, days = 1, latitude, longitude } the span for periods is [fromJd, fromJd + days]; the Moon and the ascendant are taken from fromJd for `moonDays` and `ascHours`
 */
function luckyTime(kp, vim, { topicId, fromJd, days = 30, ascHours = 24, latitude, longitude }) {
  const topic = BY_ID[topicId];
  if (!topic) throw new Error(`unknown matter: ${topicId}`);
  const eligible = eligiblePlanets(kp, topic);
  const names = eligible.map((e) => e.name);
  const out = { topic, eligible, periods: null, moon: null, ascendant: null };
  if (topic.parts.includes('dasha')) out.periods = eligiblePeriods(vim, names, fromJd, fromJd + days);
  if (topic.parts.includes('moon') || topic.parts.includes('ascendant')) {
    const moon = rulingTransitMoments(names, { body: 'Moon', fromJd, days: Math.max(ascHours / 24, 1), requireSign: false });
    out.moon = moon.bySub.flatMap((r) => r.times.map((t) => ({ starLord: r.starLord, subLord: r.subLord, from: r.from, to: r.to, enterJd: t.enterJd, leaveJd: t.leaveJd })))
      .sort((a, b) => a.enterJd - b.enterJd);
  }
  if (topic.parts.includes('ascendant')) {
    const asc = rulingRisingMoments(names, { latitude, longitude, fromJd, hours: ascHours });
    const inMoon = (s, e) => (out.moon ?? []).some((m) => s < (m.leaveJd ?? Infinity) && e > m.enterJd);
    out.ascendant = asc.bySub.flatMap((r) => r.jds.map((jd, i) => ({ signLord: r.signLord, starLord: r.starLord, subLord: r.subLord, from: r.from, to: r.to, startJd: jd, endJd: r.ends[i], withinMoonWindow: inMoon(jd, r.ends[i]) })))
      .sort((a, b) => a.startJd - b.startJd);
  }
  return out;
}

module.exports = { TOPICS, BY_ID, SOURCE, eligiblePlanets, eligiblePeriods, luckyTime };
