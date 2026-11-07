/**
 * Arishta, arishta-bhanga, yogas, raja-bhanga and the mixed chapter (mishraka, printed 71-73) of the annual chart, from Tajika Bhushana (Ganesha Daivajna; corpus C28), chapters 5 (end),
 * 6, 7 and the yoga chapter, printed pp.64-68 (printed = PDF - 4). Read on the page images 2026-10-26 (docs/TAJIKA-BHUSHANA-NOTES.md).
 *
 * Each rule is a condition the book states over the varsha chart. The result is HELD, NOT_HELD or UNKNOWN: UNKNOWN when the rule needs a thing
 * the verses do not define (an orb of combustion, a grade of strength, an aspect, the ithasala of Tajika) or that this module does not compute;
 * the part that can be decided is still reported in `detail`. No rule gives a verdict: where the book says "arishta", this says the condition holds.
 *
 * Convention used (not stated in these pages): "krura" (malefic) = Sun, Mars, Saturn, Rahu, Ketu; "saumya" (benefic) = Moon, Mercury, Jupiter, Venus.
 * The mixed chapter (printed 71-73) does use aspects; there the aspect is the sign aspect of Tajika Bhushana ch.1 v.14 (printed p.4: the 3rd and 11th a quarter, the 4th and 10th a half,
 * the 5th and 9th three quarters, the 7th full; a full aspect or conjunction settles an "aspected or joined" condition, a partial share leaves it open) and the rules say so. In the older rules aspects are not computed (the book says "drishti" and these verses give no orb); where a verse needs a conjunction or an aspect, only the
 * conjunction (same sign) is tested and the rule is UNKNOWN unless the conjunction alone settles it.
 */
const { aspectShare } = require('./varsheshaBook');
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
  pageLocus: 'Chapters 6 and 7 and the yoga chapter, printed pp.64-68: Arishta, Arishta-bhanga, Raja-yoga and Raja-bhanga; the mixed chapter (mishrakadhyaya) printed pp.71-73',
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

  // ── The mixed chapter, printed 71-73 (mishrakadhyaya, 12 verses)
  {
    const SEVEN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const FALL = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
    const offices = {};
    for (const row of (v.varsheshaSelection?.book?.rows ?? [])) offices[row.planet] = row.offices ?? [];
    const haveOffices = Object.keys(offices).length > 0;
    const joinedMal = (p) => MALEFIC.filter((q) => q !== p && f.g[q].rasiIndex === f.g[p].rasiIndex);
    const aspBen = (sign) => BENEFIC.filter((q) => aspectShare(f.g[q].rasiIndex, sign) > 0 && f.g[q].rasiIndex !== sign);
    const aspMalOnSign = (sign) => MALEFIC.filter((q) => aspectShare(f.g[q].rasiIndex, sign) > 0 && f.g[q].rasiIndex !== sign);
    // a full aspect (the planet's own sign or the 7th) settles an "aspected or joined" condition; a partial share (a quarter, a half, three quarters) leaves it open
    const share = (q, sign) => aspectShare(f.g[q].rasiIndex, sign);
    const presence = (list, sign, except = null) => {
      let yes = false;
      let maybe = false;
      for (const q of list) {
        if (q === except) continue;
        const sh = share(q, sign);
        if (sh === 1) yes = true; else if (sh > 0) maybe = true;
      }
      return yes ? 'yes' : maybe ? 'maybe' : 'no';
    };
    const PRES_TA = { yes: 'உண்டு', maybe: 'பகுதிப் பார்வை மட்டும்', no: 'இல்லை' };
    const where = (p) => `${PLANET_TA[p]} ${f.hOf(p)}-இல்`;
    const lord = (n) => RASI_LORDS[(f.lagna + n - 1) % 12];
    const vp = v.varshesha ?? null;
    const lagnaSign = f.lagna;

    // v.1: a planet that is combust, with malefics (joined or aspecting), debilitated, not an office-holder or conquered is "destroyed" and gives suffering in its own dasha
    {
      const rows = SEVEN.map((p) => {
        const conds = [];
        if (f.g[p].rasiIndex === FALL[p]) conds.push('நீசம்');
        if (joinedMal(p).length) conds.push(`பாபருடன் சேர்க்கை (${ta(joinedMal(p))})`);
        const pres = presence(MALEFIC, f.g[p].rasiIndex, p);
        if (pres === 'yes') conds.push(`பாபர் முழுப் பார்வை (${ta(MALEFIC.filter((q) => q !== p && share(q, f.g[p].rasiIndex) === 1))})`);
        if (haveOffices && !(offices[p] && offices[p].length)) conds.push('அதிகாரம் இல்லை (ஐந்து அதிகாரிகளில் ஒருவரல்ல)');
        return { p, conds, partial: pres === 'maybe' };
      });
      const hit = rows.filter((r) => r.conds.length);
      out.push(R('MISHRA_1', 'mishraka', 'v.1', '71', 'அஸ்தமனம், பாப சேர்க்கை/பார்வை, நீசம், அதிகாரமின்மை, தோல்வி — அந்த கிரகம் "நஷ்டம்"; தன் தசையில் துன்பம்', hit.length ? 'HELD' : 'UNKNOWN',
        `${hit.length ? hit.map((r) => `${PLANET_TA[r.p]}: ${r.conds.join(', ')}`).join('; ') : 'சோதிக்கக்கூடிய நிபந்தனை எந்த கிரகத்துக்கும் இல்லை'}. பாபரின் பகுதிப் பார்வை மட்டும் உள்ளவை (முடிவை மாற்றவில்லை): ${ta(rows.filter((r) => r.partial && !r.conds.length).map((r) => r.p))}. அஸ்தமனம் (ஓர்ப் வரையறுக்கப்படவில்லை) மற்றும் "ஜித" (போரில் தோற்றது) சோதிக்கப்படவில்லை.${haveOffices ? '' : ' (அதிகாரிகள் இந்த முடிவில் இல்லை.)'} பாப கிரகங்கள்: சூரியன், செவ்வாய், சனி, ராகு, கேது; பார்வை: அத்.1 பா.14.`,
        { planets: hit.map((r) => ({ planet: r.p, conditions: r.conds })) }));
    }
    // v.2: a bhava aspected by benefics is strong, even by its own lord if the lord has an evil glance; with both, mixed; its increase by the strength
    {
      const rows = Array.from({ length: 12 }, (_, i) => {
        const sign = (lagnaSign + i) % 12;
        return { house: i + 1, ben: aspBen(sign), mal: aspMalOnSign(sign) };
      });
      out.push(R('MISHRA_2', 'mishraka', 'v.2', '71', 'பாவம் சுபப் பார்வையால் வலிமை; சுபம்-பாபம் இரண்டும் பார்த்தால் கலப்பு', 'UNKNOWN',
        `பாவங்களின் பார்வை (அத்.1 பா.14, எந்த அளவும்): ${rows.map((r) => `${r.house}: சுபர் ${ta(r.ben)} / பாபர் ${ta(r.mal)}${r.ben.length && r.mal.length ? ' → கலப்பு' : r.ben.length ? ' → வலிமை' : ''}`).join('; ')}. "அதன் அதிபதி தீய பார்வை" மற்றும் வளர்ச்சியின் அளவு பலத்தைப் பொறுத்தது (வரையறுக்கப்படவில்லை).`,
        { houses: rows }));
    }
    // v.3: Jupiter in the 1st or 3rd and the lord of the janma lagna in the 4th: enemies destroyed, wealth increases fully
    {
      const jupH = f.hOf('Jupiter');
      const janmaLord = RASI_LORDS[f.natalLagna];
      const ok = [1, 3].includes(jupH) && f.hOf(janmaLord) === 4;
      out.push(R('MISHRA_3', 'mishraka', 'v.3', '71', 'குரு 1 அல்லது 3-இல்; ஜன்ம லக்னாதிபதி 4-இல்: பகைவர் நாசம், முழுமையான தன வளர்ச்சி', held(ok),
        `குரு ${jupH}-இல்; ஜன்ம லக்னாதிபதி ${where(janmaLord)}.`, { jupiterHouse: jupH, janmaLagnaLordHouse: f.hOf(janmaLord) }));
    }
    // v.4: Jupiter the lord of the lagna and in the lagna, not aspected nor joined by malefics: much wealth from the king
    {
      const isLord = f.lagnaLord === 'Jupiter';
      const inLagna = f.hOf('Jupiter') === 1;
      const j = joinedMal('Jupiter');
      const a = presence(MALEFIC, f.g.Jupiter.rasiIndex, 'Jupiter');
      const status = !isLord || !inLagna || a === 'yes' ? 'NOT_HELD' : a === 'maybe' ? 'UNKNOWN' : 'HELD';
      out.push(R('MISHRA_4', 'mishraka', 'v.4', '72', 'லக்னாதிபதி குரு லக்னத்தில், பாபர் சேர்க்கை/பார்வை இன்றி: அரசால் அதிக தனம்', status,
        `லக்னாதிபதி ${PLANET_TA[f.lagnaLord]}; குரு ${f.hOf('Jupiter')}-இல்; பாபர் சேர்க்கை: ${ta(j)}; பாபர் முழுப் பார்வை/சேர்க்கை: ${PRES_TA[a]}.`, { lagnaLordIsJupiter: isLord, inLagna, joined: j, malefics: a }));
    }
    // v.5: the 2nd lord in the 2nd with Jupiter: wealth increases; the 5th lord in the 5th: happiness from brothers and sons
    {
      const l2 = lord(2);
      const l5 = lord(5);
      const wealth = f.hOf(l2) === 2 && (l2 === 'Jupiter' || f.g.Jupiter.rasiIndex === f.g[l2].rasiIndex);
      out.push(R('MISHRA_5A', 'mishraka', 'v.5', '72', '2-ஆம் அதிபதி 2-இல் குருவுடன்: தன வளர்ச்சி', held(wealth),
        `2-ஆம் அதிபதி ${where(l2)}; குரு ${f.hOf('Jupiter')}-இல். (2-ஆம் அதிபதியே குருவாக இருந்தால் சேர்க்கையாக எடுக்கப்பட்டது.)`, { secondLord: l2 }));
      out.push(R('MISHRA_5B', 'mishraka', 'v.5', '72', '5-ஆம் அதிபதி 5-இல்: சகோதரர், பிள்ளைகளால் சுகம்', held(f.hOf(l5) === 5),
        `5-ஆம் அதிபதி ${where(l5)}.`, { fifthLord: l5 }));
    }
    // v.6: Jupiter or Venus combust by the Sun and the Moon debilitated: calamity for people that year; worst with the debilitated Moon in the lagna
    {
      const moonDeb = f.g.Moon.rasiIndex === 7;
      out.push(R('MISHRA_6', 'mishraka', 'v.6', '72', 'குரு அல்லது சுக்கிரன் சூரியனால் அஸ்தமனம், சந்திரன் நீசம்: அந்த ஆண்டு மக்களுக்கு ஆபத்து; நீச சந்திரன் லக்னத்தில் எனில் மரண துல்யம்', moonDeb ? 'UNKNOWN' : 'NOT_HELD',
        `சந்திரன் நீசம் (விருச்சிகம்): ${moonDeb ? 'ஆம்' : 'இல்லை'}; சந்திரன் லக்னத்தில்: ${f.hOf('Moon') === 1 ? 'ஆம்' : 'இல்லை'}; குரு ${f.hOf('Jupiter')}-இல், சுக்கிரன் ${f.hOf('Venus')}-இல். சூரிய அஸ்தமனத்தின் ஓர்ப் வரையறுக்கப்படவில்லை, அதனால் அறியப்படவில்லை.`,
        { moonDebilitated: moonDeb, moonInLagna: f.hOf('Moon') === 1 }));
    }
    // v.7: the lagna lord in the 8th, joined or aspected by Mars: ailments of phlegm, bile and wind, and loss of wealth
    {
      const ll = f.lagnaLord;
      const in8 = f.hOf(ll) === 8;
      const sh = ll === 'Mars' ? 0 : share('Mars', f.g[ll].rasiIndex);
      out.push(R('MISHRA_7', 'mishraka', 'v.7', '72', 'லக்னாதிபதி 8-இல், செவ்வாயுடன் சேர்ந்து அல்லது செவ்வாய் பார்த்து: கபம்-பித்தம்-வாத நோய், தன நஷ்டம்', !in8 || ll === 'Mars' ? 'NOT_HELD' : sh === 1 ? 'HELD' : sh > 0 ? 'UNKNOWN' : 'NOT_HELD',
        `லக்னாதிபதி ${where(ll)}; செவ்வாயின் பார்வை/சேர்க்கை அளவு: ${sh === 1 ? 'முழு (சேர்க்கை அல்லது 7-ஆம்)' : sh > 0 ? `${sh} (பகுதி — முடிவு இல்லை)` : 'இல்லை'}.${ll === 'Mars' ? ' (லக்னாதிபதியே செவ்வாய்.)' : ''}`, { lagnaLordInEighth: in8, marsShare: sh }));
    }
    // v.8: the 7th lord strong, in the 7th, free from malefics' aspect and conjunction: daily pleasure from women and increase of wealth
    {
      const l7 = lord(7);
      const in7 = f.hOf(l7) === 7;
      const j = joinedMal(l7);
      const a = presence(MALEFIC, f.g[l7].rasiIndex, l7);
      out.push(R('MISHRA_8', 'mishraka', 'v.8', '72', '7-ஆம் அதிபதி வலிமையுடன் 7-இல், பாபர் சேர்க்கை/பார்வை இன்றி: தினமும் பெண் சுகம், செல்வ வளர்ச்சி', !in7 || a === 'yes' ? 'NOT_HELD' : 'UNKNOWN',
        `7-ஆம் அதிபதி ${where(l7)}; பாபர் சேர்க்கை: ${ta(j)}; பாபர் முழுப் பார்வை/சேர்க்கை: ${PRES_TA[a]}. "வலிமை" வரையறுக்கப்படவில்லை, அதனால் மற்ற நிபந்தனைகள் இருந்தாலும் அறியப்படவில்லை.`, { seventhLord: l7, inSeventh: in7, joined: j, malefics: a }));
    }
    // v.9: the lagna joined or aspected by cruel planets and not by benefics: forbidden food, distress from the slander of the wicked
    {
      const mj = MALEFIC.filter((q) => f.g[q].rasiIndex === lagnaSign);
      const bj = BENEFIC.filter((q) => f.g[q].rasiIndex === lagnaSign);
      const mp = presence(MALEFIC, lagnaSign);
      const bp = presence(BENEFIC, lagnaSign);
      const status = mp === 'no' || bp === 'yes' ? 'NOT_HELD' : mp === 'yes' && bp === 'no' ? 'HELD' : 'UNKNOWN';
      out.push(R('MISHRA_9', 'mishraka', 'v.9', '72', 'லக்னம் க்ரூரர் சேர்க்கை/பார்வை; சுபர் சேர்க்கை/பார்வை இன்மை: தகாத உணவு, தீயோர் அவதூறு', status,
        `லக்னத்தில் பாபர்: ${ta(mj)}, சுபர்: ${ta(bj)}; பாபர் முழுப் பார்வை/சேர்க்கை: ${PRES_TA[mp]}; சுபர்: ${PRES_TA[bp]}.`, { maleficsJoined: mj, beneficsJoined: bj, malefics: mp, benefics: bp }));
    }
    // v.10: the 7th lord weak: association with prostitutes; the 9th lord combust or joined with malefics: loss of caste
    {
      const l7 = lord(7);
      const l9 = lord(9);
      const j9 = joinedMal(l9);
      out.push(R('MISHRA_10A', 'mishraka', 'v.10', '73', '7-ஆம் அதிபதி பலவீனம்: தகாத பெண் தொடர்பு', 'UNKNOWN',
        `7-ஆம் அதிபதி ${where(l7)}. பலவீனத்தின் அளவு வரையறுக்கப்படவில்லை.`, { seventhLord: l7 }));
      out.push(R('MISHRA_10B', 'mishraka', 'v.10', '73', '9-ஆம் அதிபதி அஸ்தமனம் அல்லது பாபருடன்: ஜாதி/சமய நிலை தவறுதல்', j9.length ? 'HELD' : 'UNKNOWN',
        `9-ஆம் அதிபதி ${where(l9)}; பாபர் சேர்க்கை: ${ta(j9)}; அஸ்தமனம் சோதிக்கப்படவில்லை (ஓர்ப் வரையறுக்கப்படவில்லை).`, { ninthLord: l9, joined: j9 }));
    }
    // v.11: a weak Varshapati in the 8th, 6th or 12th: distress all year; a benefic Varshapati in a kendra, a kona or the 11th: joy all year
    {
      const h = vp ? f.hOf(vp) : null;
      const bad = h !== null && [8, 6, 12].includes(h);
      const good = vp !== null && BENEFIC.includes(vp) && [1, 4, 7, 10, 5, 9, 11].includes(h);
      out.push(R('MISHRA_11A', 'mishraka', 'v.11', '73', 'வர்ஷபதி பலவீனமாக 8, 6, 12-இல்: ஆண்டு முழுவதும் கஷ்டம்', vp && bad ? 'UNKNOWN' : 'NOT_HELD',
        vp ? `வர்ஷபதி ${where(vp)}. பலவீனம் வரையறுக்கப்படவில்லை; இடம் ${bad ? 'பொருந்துகிறது' : 'பொருந்தவில்லை'}.` : 'வர்ஷபதி இந்த முடிவில் இல்லை.', { varshapati: vp, house: h }));
      out.push(R('MISHRA_11B', 'mishraka', 'v.11', '73', 'சுப வர்ஷபதி கேந்திரம், கோணம் அல்லது 11-இல்: ஆண்டு முழுவதும் மகிழ்ச்சி', vp ? held(good) : 'UNKNOWN',
        vp ? `வர்ஷபதி ${where(vp)} (${BENEFIC.includes(vp) ? 'சுபர்' : 'பாபர்'}).` : 'வர்ஷபதி இந்த முடிவில் இல்லை.', { varshapati: vp, house: h }));
    }
    // v.12: a malefic Varshapati in the 11th, 3rd or 6th: auspicious year; powerless in the 12th or 8th: ruin of fortune
    {
      const h = vp ? f.hOf(vp) : null;
      const mal = vp !== null && MALEFIC.includes(vp);
      out.push(R('MISHRA_12A', 'mishraka', 'v.12', '73', 'பாப வர்ஷபதி 11, 3, 6-இல்: ஆண்டு சுபம்', vp ? held(mal && [11, 3, 6].includes(h)) : 'UNKNOWN',
        vp ? `வர்ஷபதி ${where(vp)} (${mal ? 'பாபர்' : 'சுபர்'}).` : 'வர்ஷபதி இந்த முடிவில் இல்லை.', { varshapati: vp, house: h }));
      out.push(R('MISHRA_12B', 'mishraka', 'v.12', '73', 'பலமற்ற பாப வர்ஷபதி 12 அல்லது 8-இல்: லக்ஷ்மி நாசம்', vp && mal && [12, 8].includes(h) ? 'UNKNOWN' : 'NOT_HELD',
        vp ? `வர்ஷபதி ${where(vp)}. பலமின்மை வரையறுக்கப்படவில்லை.` : 'வர்ஷபதி இந்த முடிவில் இல்லை.', { varshapati: vp, house: h }));
    }
  }
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
