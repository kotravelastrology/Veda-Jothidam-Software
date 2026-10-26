/**
 * Arishta, arishta-bhanga, yogas and raja-bhanga of the annual chart, from Tajika Bhushana (Ganesha Daivajna; corpus C28), chapters 5 (end),
 * 6, 7 and the yoga chapter, printed pp.64-68 (printed = PDF - 4). Read on the page images 2026-10-26 (docs/TAJIKA-BHUSHANA-NOTES.md).
 *
 * Each rule is a condition the book states over the varsha chart. The result is HELD, NOT_HELD or UNKNOWN: UNKNOWN when the rule needs a thing
 * the verses do not define (an orb of combustion, a grade of strength, an aspect, the ithasala of Tajika) or that this module does not compute;
 * the part that can be decided is still reported in `detail`. No rule gives a verdict: where the book says "arishta", this says the condition holds.
 *
 * Convention used (not stated in these pages): "krura" (malefic) = Sun, Mars, Saturn, Rahu, Ketu; "saumya" (benefic) = Moon, Mercury, Jupiter, Venus.
 * Aspects are not computed (the book says "drishti" and these verses give no orb); where a verse needs a conjunction or an aspect, only the
 * conjunction (same sign) is tested and the rule is UNKNOWN unless the conjunction alone settles it.
 */
const RASI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const MALEFIC = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
const BENEFIC = ['Moon', 'Mercury', 'Jupiter', 'Venus'];
const KENDRA = [1, 4, 7, 10];
const KONA = [5, 9];
const PLANET_TA = { Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்', Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி', Rahu: 'ராகு', Ketu: 'கேது' };
const ta = (l) => l.map((p) => PLANET_TA[p] ?? p).join(', ') || '—';

const SOURCE = {
  title: 'Tajika Bhushana',
  author: 'Ganesha Daivajna',
  tradition: 'Tajika (Varshaphala)',
  file: 'C28_Tajika_Bhushana_Ganesha.pdf',
  pageLocus: 'Chapters 6 and 7 and the yoga chapter, printed pp.64-68: Arishta, Arishta-bhanga, Raja-yoga and Raja-bhanga',
};

function frame(v) {
  const g = v.varshaChart.grahas;
  const lagna = v.varshaChart.lagna.rasiIndex;
  const house = (sign) => ((sign - lagna + 12) % 12) + 1;
  const hOf = (p) => house(g[p].rasiIndex);
  const moonSign = g.Moon.rasiIndex;
  const fromMoon = (p) => ((g[p].rasiIndex - moonSign + 12) % 12) + 1;
  const natalLagna = (((v.muntha.rasiIndex - v.yearsElapsed) % 12) + 12) % 12;
  const lagnaLord = RASI_LORDS[lagna];
  const munthesha = v.muntha.lord;
  const eighthLord = RASI_LORDS[(lagna + 7) % 12];
  const ownedBy = (p) => Object.keys(g).filter((q) => g[q].rasiIndex === g[p].rasiIndex && q !== p);
  const inHouses = (list, hs) => list.filter((p) => hs.includes(hOf(p)));
  return { g, lagna, hOf, house, fromMoon, natalLagna, lagnaLord, munthesha, eighthLord, ownedBy, inHouses,
    mH: house(v.muntha.rasiIndex), mSign: v.muntha.rasiIndex, janmaH: house(natalLagna) };
}

const R = (id, group, verse, printedPage, titleTa, status, detail, evidence = {}) => ({ id, group, verse, printedPage, titleTa, status, detail, evidence });
const held = (b) => (b ? 'HELD' : 'NOT_HELD');

function rules(v) {
  const f = frame(v);
  const out = [];
  const withMuntha = Object.keys(f.g).filter((p) => f.g[p].rasiIndex === f.mSign);
  const mal = (l) => l.filter((p) => MALEFIC.includes(p));

  // ── Chapter 6: Arishta (printed 64-66)
  {
    const hemmed = f.inHouses(MALEFIC, [12]).length > 0 && f.inHouses(MALEFIC, [2]).length > 0;
    const inBad = f.inHouses(MALEFIC, [12, 6, 2, 8]);
    out.push(R('ARISHTA_5', 'arishta', 'v.5', '65', 'பாப கிரகங்களுக்கு நடுவே லக்னம்; பாப கிரகம் 12, 6, 2, 8-இல்', held(hemmed || inBad.length > 0),
      `லக்னத்துக்கு 12-இலும் 2-இலும் பாப கிரகம் (பாப கர்த்தரி): ${hemmed ? 'உள்ளது' : 'இல்லை'}; பாப கிரகம் 12, 6, 2, 8-இல்: ${ta(inBad)}. நூல்: வீடு, பெண் தொடர்பான இடையூறு; அரிஷ்டம்.`,
      { hemmed, malefics: inBad }));
  }
  {
    const bad = withMuntha.filter((p) => MALEFIC.includes(p));
    const inH = [6, 8, 12].includes(f.mH);
    out.push(R('ARISHTA_6', 'arishta', 'v.6', '65', 'முந்தா பாப கிரகத்துடன் 6, 8, 12-இல்', held(inH && bad.length > 0),
      `முந்தா வர்ஷ லக்னத்திலிருந்து ${f.mH}-ஆம் வீட்டில்; முந்தா ராசியில் உள்ள பாப கிரகங்கள்: ${ta(bad)}. நூல்: ஆயுதம், நெருப்பு பயம்; சனியுடன் எனில் வாதநோய் நிச்சயம்${withMuntha.includes('Saturn') && inH ? ' (சனி முந்தாவுடன்: உள்ளது)' : ''}.`,
      { munthaHouse: f.mH, malefics: bad, withSaturn: withMuntha.includes('Saturn') }));
  }
  {
    const bad = withMuntha.filter((p) => MALEFIC.includes(p));
    const eighthFromJanma = ((f.mSign - f.natalLagna + 12) % 12) + 1 === 8;
    const where = [7, 8, 4, 12, 6].includes(f.mH) || eighthFromJanma;
    out.push(R('ARISHTA_7', 'arishta', 'v.7', '66', 'முந்தா 7, 8, 4, 12, 6-இல் அல்லது ஜன்ம லக்னத்துக்கு 8-இல்', where ? 'UNKNOWN' : 'NOT_HELD',
      `முந்தா வர்ஷ லக்னத்திலிருந்து ${f.mH}-ஆம் வீட்டில்${eighthFromJanma ? '; ஜன்ம லக்னத்திலிருந்து 8-ஆம்' : ''}: இடம் ${where ? 'நூல் கூறும் இடமே' : 'நூல் கூறும் இடமல்ல'}. நூல்: பாப கிரகப் பார்வையுடன் எனில் மிக அரிஷ்டம், சுபருடன் எனில் குறைவு. பார்வை கணக்கிடப்படவில்லை; முந்தாவுடன் இணைந்த பாபர்: ${ta(bad)}.`,
      { munthaHouse: f.mH, eighthFromJanma, malefics: bad }));
  }
  {
    const set = [f.lagnaLord, f.munthesha, f.eighthLord];
    const names = ['லக்னாதிபதி', 'முந்தேசன்', '8-ஆம் அதிபதி'];
    const hits = set.map((p, i) => ({ p, role: names[i], fromLagna: f.hOf(p), fromMoon: f.fromMoon(p) }))
      .filter((x) => [6, 8, 12].includes(x.fromLagna) || [6, 8, 12].includes(x.fromMoon));
    out.push(R('ARISHTA_9', 'arishta', 'v.9', '66', 'லக்னாதிபதி, முந்தேசன் அல்லது 8-ஆம் அதிபதி லக்னத்துக்கோ சந்திரனுக்கோ 6, 8, 12-இல்', held(hits.length > 0),
      hits.length ? `${hits.map((x) => `${x.role} ${PLANET_TA[x.p]} (லக்னத்திலிருந்து ${x.fromLagna}, சந்திரனிலிருந்து ${x.fromMoon})`).join('; ')}. பழைய கணகர்கள்: மகா அரிஷ்டம்.` : `லக்னாதிபதி ${PLANET_TA[f.lagnaLord]}, முந்தேசன் ${PLANET_TA[f.munthesha]}, 8-ஆம் அதிபதி ${PLANET_TA[f.eighthLord]} — எதுவும் லக்னம்/சந்திரனிலிருந்து 6, 8, 12-இல் இல்லை.`,
      { hits }));
  }
  {
    const moonIn = [8, 1, 7, 6, 12].includes(f.hOf('Moon'));
    const jupWith = f.g.Jupiter.rasiIndex === f.g.Moon.rasiIndex;
    out.push(R('ARISHTA_3', 'arishta', 'v.3', '65', 'சந்திரன் 8, 1, 7, 6, 12-இல், குருவுடன் சேராமல், பார்வையின்றி', moonIn && !jupWith ? 'UNKNOWN' : 'NOT_HELD',
      `சந்திரன் வர்ஷ லக்னத்திலிருந்து ${f.hOf('Moon')}-ஆம் வீட்டில்; குருவுடன் ஒரே ராசி: ${jupWith ? 'ஆம்' : 'இல்லை'}. குருவின் பார்வை நூலில் வரையறுக்கப்படவில்லை, எனவே இடம் பொருந்தினால் "அறியப்படவில்லை". செவ்வாயுடன் எனில் நெருப்பு-ஆயுதத் துன்பம், சனியுடன் எனில் வாதநோய்.`,
      { moonHouse: f.hOf('Moon'), jupiterWith: jupWith }));
  }
  out.push(R('ARISHTA_8', 'arishta', 'v.8', '66', 'சந்திரன் 7-இல்; லக்னாதிபதியும் 8-ஆம் அதிபதியும் 8, 12, 6-இல்; அல்லது லக்னாதிபதியும் முந்தேசனும் 8-இல்',
    held((f.hOf('Moon') === 7 && [f.lagnaLord, f.eighthLord].every((p) => [8, 12, 6].includes(f.hOf(p)))) || [f.lagnaLord, f.munthesha].every((p) => f.hOf(p) === 8)),
    `சந்திரன் ${f.hOf('Moon')}-ஆம் வீட்டில்; லக்னாதிபதி ${PLANET_TA[f.lagnaLord]} ${f.hOf(f.lagnaLord)}-இல், 8-ஆம் அதிபதி ${PLANET_TA[f.eighthLord]} ${f.hOf(f.eighthLord)}-இல், முந்தேசன் ${PLANET_TA[f.munthesha]} ${f.hOf(f.munthesha)}-இல். நூல்: போரில் அரிஷ்டம்.`,
    {}));
  out.push(R('ARISHTA_1', 'arishta', 'v.1', '64', 'சுக்கிரனும் குருவும் பலவீனம், சந்திரன் நீசம்; 8-ஆம் அதிபதி லக்னத்தில், லக்னாதிபதி 8-இல், பாபர் பார்வையுடன்', 'UNKNOWN',
    `சந்திரன் நீச ராசியில் (விருச்சிகம்): ${f.g.Moon.rasiIndex === 7 ? 'ஆம்' : 'இல்லை'}; 8-ஆம் அதிபதி லக்னத்தில்: ${f.hOf(f.eighthLord) === 1 ? 'ஆம்' : 'இல்லை'}; லக்னாதிபதி 8-இல்: ${f.hOf(f.lagnaLord) === 8 ? 'ஆம்' : 'இல்லை'}. சுக்கிர-குரு பலவீனத்துக்கு வரம்பு நூலில் இல்லை; பாபப் பார்வை கணக்கிடப்படவில்லை. நூல்: பல நோய், பிரிவு; ஆயுதத்தால் மரணம்.`,
    { moonDebilitated: f.g.Moon.rasiIndex === 7, eighthLordInLagna: f.hOf(f.eighthLord) === 1, lagnaLordInEighth: f.hOf(f.lagnaLord) === 8 }));
  out.push(R('ARISHTA_2', 'arishta', 'v.2', '64', 'லக்னாதிபதி, முந்தேசன் சூரியனால் அஸ்தமனம் அல்லது சூரியப் பார்வை; ஜன்ம லக்னம் வர்ஷத்தில் 8-இல்', 'UNKNOWN',
    `ஜன்ம லக்னம் வர்ஷ லக்னத்திலிருந்து ${f.janmaH}-ஆம் வீட்டில் (8-ஆம் வீடா: ${f.janmaH === 8 ? 'ஆம்' : 'இல்லை'}); அஸ்தமன வரம்பு (ஓர்ப்) இந்தப் பக்கங்களில் இல்லை.`, { janmaLagnaHouse: f.janmaH }));

  // ── Chapter 7: Arishta-bhanga (printed 66-67)
  {
    const lordIn = [...KENDRA, ...KONA].includes(f.hOf(f.lagnaLord));
    const benIn = f.inHouses(BENEFIC, [...KENDRA, ...KONA]);
    out.push(R('BHANGA_1', 'arishta-bhanga', 'v.1', '66', 'லக்னாதிபதியும் சுபர்களும் கேந்திரம் அல்லது திரிகோணத்தில்', held(lordIn && benIn.length > 0),
      `லக்னாதிபதி ${PLANET_TA[f.lagnaLord]} ${f.hOf(f.lagnaLord)}-இல்; கேந்திர-திரிகோணத்தில் சுபர்: ${ta(benIn)}. குரு கேந்திரத்தில் வலிமையாக இருந்தால் அமங்கலமும் மங்கலம்: குரு ${f.hOf('Jupiter')}-இல்.`,
      { lagnaLordHouse: f.hOf(f.lagnaLord), benefics: benIn, jupiterInKendra: KENDRA.includes(f.hOf('Jupiter')) }));
  }
  {
    const crueFromLagna = f.inHouses(MALEFIC, [3, 11, 6]);
    const crueFromMoon = MALEFIC.filter((p) => [3, 11, 6].includes(f.fromMoon(p)));
    const kendraGV = ['Jupiter', 'Venus'].filter((p) => KENDRA.includes(f.hOf(p)));
    out.push(R('BHANGA_2', 'arishta-bhanga', 'v.2', '66', 'பாபர் லக்னம் அல்லது சந்திரனிலிருந்து 3, 11, 6-இல்', held(crueFromLagna.length > 0 || crueFromMoon.length > 0),
      `லக்னத்திலிருந்து 3, 11, 6-இல் பாபர்: ${ta(crueFromLagna)}; சந்திரனிலிருந்து: ${ta(crueFromMoon)}. (லக்னாதிபதி வலிமை, சுபப் பார்வை, ஜன்மத்தில் குரு/சுக்கிரன் கேந்திரத்தில் — இவை கணக்கிடப்படவில்லை.) வர்ஷத்தில் குரு/சுக்கிரன் கேந்திரத்தில்: ${ta(kendraGV)}.`,
      { fromLagna: crueFromLagna, fromMoon: crueFromMoon }));
  }
  out.push(R('BHANGA_3', 'arishta-bhanga', 'v.3', '67', 'லக்னாதிபதி சுபருடன் சேர்ந்து அல்லது சுபப் பார்வை; லக்னத்தில் வலிமையான குரு', 'UNKNOWN',
    `லக்னாதிபதி ${PLANET_TA[f.lagnaLord]} உடன் ஒரே ராசியில் சுபர்: ${ta(f.ownedBy(f.lagnaLord).filter((p) => BENEFIC.includes(p)))}; லக்னத்தில் குரு: ${f.hOf('Jupiter') === 1 ? 'ஆம்' : 'இல்லை'}. பார்வையும் வலிமையும் கணக்கிடப்படவில்லை.`, {}));

  // ── Yogas (printed 67-68)
  {
    const janmaLord = RASI_LORDS[f.natalLagna];
    const hits = ['Jupiter', janmaLord].filter((p) => [1, 3, 11, 4].includes(f.hOf(p)));
    out.push(R('YOGA_1', 'yoga', 'v.1', '67', 'குரு அல்லது ஜன்ம லக்னாதிபதி லக்னம், 3, 11, 4-இல்', held(hits.length > 0),
      `குரு ${f.hOf('Jupiter')}-இல்; ஜன்ம லக்னாதிபதி ${PLANET_TA[janmaLord]} ${f.hOf(janmaLord)}-இல். நூல்: பகைவர் நாசம், பொருள் கிடைத்தல்.`, { hits }));
  }
  {
    const fourth = RASI_LORDS[(f.lagna + 3) % 12];
    const ninth = RASI_LORDS[(f.lagna + 8) % 12];
    const second = RASI_LORDS[(f.lagna + 1) % 12];
    const a = f.hOf(fourth) === 4 && f.ownedBy(fourth).some((p) => BENEFIC.includes(p)) ;
    const b = [ninth, second].filter((p) => f.hOf(p) === 1);
    out.push(R('YOGA_2', 'yoga', 'v.2', '67', '4-ஆம் அதிபதி 4-இல் சுபருடன்; 9-ஆம் அல்லது 2-ஆம் அதிபதி லக்னத்தில்', held(a || b.length > 0),
      `4-ஆம் அதிபதி ${PLANET_TA[fourth]} ${f.hOf(fourth)}-இல்; 9-ஆம் அதிபதி ${PLANET_TA[ninth]} ${f.hOf(ninth)}-இல்; 2-ஆம் அதிபதி ${PLANET_TA[second]} ${f.hOf(second)}-இல். நூல்: மனைவி-மகனால் சுகம்; பொருளும் வாகனமும்.`, { fourthLord: fourth, ninthSecondInLagna: b }));
  }
  {
    const seventh = RASI_LORDS[(f.lagna + 6) % 12];
    out.push(R('YOGA_3', 'yoga', 'v.3', '67', '7-ஆம் அதிபதி லக்னத்தில் (புத்திர யோகம்)', held(f.hOf(seventh) === 1),
      `7-ஆம் அதிபதி ${PLANET_TA[seventh]} ${f.hOf(seventh)}-இல். (குருவின் பார்வை, செவ்வாய்-சூரியன்-சனி புதன்-சுக்கிரன்-குருவுடன் இத்தசாலம் — கணக்கிடப்படவில்லை.)`, { seventhLord: seventh }));
  }
  {
    const ben = BENEFIC.filter((p) => [...KENDRA, ...KONA].includes(f.hOf(p)));
    const crue = MALEFIC.filter((p) => [3, 6, 11].includes(f.hOf(p)));
    out.push(R('YOGA_4', 'yoga', 'v.4', '67', 'சுபர் கேந்திரம்/5/9-இல்; பாபர் 3, 6, 11-இல்', held(ben.length > 0 && crue.length > 0),
      `சுபர் கேந்திர-திரிகோணத்தில்: ${ta(ben)}; பாபர் 3, 6, 11-இல்: ${ta(crue)}. நூல்: பொருள், மணி, யானை, குதிரை, பொன் முதலியவை கிடைத்தல். (நூல் எத்தனை கிரகம் என்று கூறவில்லை; ஒன்றாவது இருந்தால் "உள்ளது" என்று கொள்கிறேன்.)`, { benefics: ben, malefics: crue }));
  }
  {
    const allBadIn = MALEFIC.filter((p) => ['Sun', 'Mars', 'Saturn'].includes(p)).every((p) => [3, 6, 11].includes(f.hOf(p)));
    const ben = BENEFIC.filter((p) => KENDRA.includes(f.hOf(p)));
    out.push(R('YOGA_6', 'yoga', 'v.6', '68', 'பாப கிரகங்கள் எல்லாம் 3, 6, 11-இல், சுபர் கேந்திரத்தில் (நீண்டகால லட்சுமி)', held(allBadIn && ben.length > 0),
      `சூரியன்-செவ்வாய்-சனி மூவரும் 3, 6, 11-இல்: ${allBadIn ? 'ஆம்' : 'இல்லை'}; கேந்திரத்தில் சுபர்: ${ta(ben)}. (ராகு-கேது இங்கு சேர்க்கப்படவில்லை: நூல் 'எல்லாக் க்ரூரர்' என்கிறது.)`, { benefics: ben }));
  }
  out.push(R('YOGA_5', 'yoga', 'v.5', '68', 'சனியும் சுக்கிரனும் அஸ்தமிக்காமல் சொந்த வீட்டில் அல்லது உச்சத்தில்', (() => {
    const ok = ['Saturn', 'Venus'].every((p) => [RASI_LORDS.indexOf(p), RASI_LORDS.lastIndexOf(p)].includes(f.g[p].rasiIndex) || (p === 'Saturn' ? f.g[p].rasiIndex === 6 : f.g[p].rasiIndex === 11));
    return ok ? 'UNKNOWN' : 'NOT_HELD';
  })(), `சனி ${f.hOf('Saturn')}-இல், சுக்கிரன் ${f.hOf('Venus')}-இல்; சொந்த வீடு அல்லது உச்சம் என்பதை மட்டுமே சோதிக்க முடிந்தது; அஸ்தமனம் (ஓர்ப் இல்லை) கணக்கிடப்படவில்லை. நூல்: மிலேச்சர் வழி மிகப் பேறு.`, {}));
  {
    const eleventh = RASI_LORDS[(f.lagna + 10) % 12];
    const inEleventh = f.hOf(eleventh) === 11;
    const exalted = f.g[eleventh].rasiIndex === ({ Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 })[eleventh];
    out.push(R('YOGA_LABHA', 'yoga', 'v.100', '64', '11-ஆம் அதிபதி 11-இல், சுபப் பார்வை/சேர்க்கை, உச்சம், சூரியனிடமிருந்து விலகி', inEleventh ? 'UNKNOWN' : 'NOT_HELD',
      `11-ஆம் அதிபதி ${PLANET_TA[eleventh]} ${f.hOf(eleventh)}-இல் (11-ஆம் வீடா: ${inEleventh ? 'ஆம்' : 'இல்லை'}); உச்சம்: ${exalted ? 'ஆம்' : 'இல்லை'}; சுபப் பார்வை-சேர்க்கை, சூரியனிடமிருந்து தூரம் (ஓர்ப் இல்லை) கணக்கிடப்படவில்லை. நூல்: குதிரை, யானை, நிலம், ஆபரணம், மனைவி, சுகம்.`, {}));
  }
  out.push(R('RAJABHANGA_1', 'raja-bhanga', 'v.1', '68', 'நீசமும் அஸ்தமனமுமான பாபர்: ராஜயோகம் அழிதல்; பாபர் நீசமாகி சுபர் பலமற்றாலும் அழிவு', 'UNKNOWN',
    `நீச ராசியில் உள்ள கிரகங்கள்: ${ta(Object.keys(f.g).filter((p) => ({ Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 })[p] === f.g[p].rasiIndex))}. அஸ்தமனமும் சுபரின் பலமின்மையும் நூலில் வரையறுக்கப்படவில்லை.`, {}));
  return out;
}

function evaluateVarshaYogas(v) {
  const list = rules(v);
  return {
    source: SOURCE,
    rules: list,
    summary: { held: list.filter((r) => r.status === 'HELD').length, unknown: list.filter((r) => r.status === 'UNKNOWN').length, notHeld: list.filter((r) => r.status === 'NOT_HELD').length },
    conventions: ['க்ரூரர் = சூரியன், செவ்வாய், சனி, ராகு, கேது; சௌம்யர் = சந்திரன், புதன், குரு, சுக்கிரன் (இப்பக்கங்களில் வரையறை இல்லை)', 'பார்வை, அஸ்தமன ஓர்ப், பலத்தின் தரம் கணக்கிடப்படவில்லை'],
  };
}

module.exports = { evaluateVarshaYogas, SOURCE, MALEFIC, BENEFIC };
