/**
 * KP Muhurat — event-specific special conditions (the ~35 prose branches the
 * legacy catalog attaches to particular events, beyond the generic cusp/DBAS
 * favorable-house rule). Ported from kp_muhurat/events.py
 * `evaluate_special_conditions` (27 event branches; two events — Second
 * Marriage, Adopting a Child — carry 2-3 checks each, giving ~35 rows).
 *
 * A condition is either:
 *  - Mandatory (`affectsResult: true`) — gates the event's overall grade
 *    (kpEvents.gradeEvent): a red mandatory condition forces RED; DARK_GREEN
 *    additionally requires every mandatory condition to be darkgreen.
 *  - Advisory (`affectsResult: false`) — shown for context, does not change
 *    the grade.
 *
 * These are the ORIGINAL catalog's prose rules — not independently
 * classically re-derived here; ported verbatim from the source engine,
 * screenshot-validated there against the legacy application's own output.
 */
const { planetSignificators, houseForLongitude, obstructionHouses, SIGN_LORDS } = require('./kpSystem');

const STATUS_TA = {
  'Strong': 'வலுவான ஆதரவு', 'Partial': 'பகுதி ஆதரவு', 'Not supporting': 'ஆதரவு இல்லை',
  'Suitable Lagna': 'ஏற்ற லக்னம்', 'Chara Lagna - avoid': 'சர லக்னம் — தவிர்க்கவும்',
  'Required lord present': 'தேவையான அதிபதி உள்ளது', 'Required lord absent': 'தேவையான அதிபதி இல்லை',
  'All required houses': 'அனைத்து தேவையான பாவங்களும்', 'Partial support': 'பகுதி ஆதரவு',
  'No required-house support': 'தேவையான பாவ ஆதரவு இல்லை', 'Adjustment applied': 'சரிசெய்தல் செய்யப்பட்டது',
  'Not required': 'தேவையில்லை', 'House 7 signified': '7-ஆம் பாவம் குறிக்கப்படுகிறது',
  'House 7 not signified': '7-ஆம் பாவம் குறிக்கப்படவில்லை',
  'Required connection present': 'தேவையான தொடர்பு உள்ளது', 'Required connection absent': 'தேவையான தொடர்பு இல்லை',
  'Best preference met': 'சிறந்த விருப்பம் பொருந்துகிறது', 'Preference not met': 'விருப்பம் பொருந்தவில்லை',
  'No prohibited connection': 'தடுக்கப்பட்ட தொடர்பு இல்லை', 'Prohibited connection': 'தடுக்கப்பட்ட தொடர்பு',
  'Allowed combination present': 'அனுமதிக்கப்பட்ட சேர்க்கை உள்ளது', 'Combination review needed': 'சேர்க்கை மீள் ஆய்வு தேவை',
  'Needs manual confirmation': 'கைமுறை உறுதிப்படுத்தல் தேவை', 'Indication present': 'குறிப்பு உள்ளது',
  'Indication absent': 'குறிப்பு இல்லை', 'Preferred lord present': 'விருப்பமான அதிபதி உள்ளது',
  'Core and bonus complete': 'முதன்மை + கூடுதல் முழுமை', 'Core complete': 'முதன்மை முழுமை',
  'Core condition not met': 'முதன்மை நிபந்தனை பூர்த்தியாகவில்லை', 'Rahu absent': 'ராகு இல்லை',
  'Rahu prohibited': 'ராகு தடுக்கப்பட்டுள்ளது', 'Mercury absent': 'புதன் இல்லை', 'Mercury prohibited': 'புதன் தடுக்கப்பட்டுள்ளது',
};

function _reasonTa(objectLabel, sig, hits) {
  const sigText = (sig || []).map(String).join(', ') || 'இல்லை';
  const hitText = (hits || []).map(String).join(', ') || 'இல்லை';
  return `${objectLabel} — குறிக்கும்: ${sigText}; பொருந்தியவை: ${hitText}.`;
}

/**
 * @param event { name, remarks } (from kpEvents.loadEvents())
 * @param kp    output of calculateKpSystem
 * @returns list of { condition, scope, affectsResult, object, significators,
 *   required, hits, code, label, labelTa, color, reason, reasonTa }
 */
function evaluateSpecialConditions(event, kp) {
  const checks = [];
  const cusps = kp.cusps;
  const sub = (n) => cusps[n - 1].sub;
  const byName = Object.fromEntries(kp.positions.map((p) => [p.name, p]));
  const push = (row) => checks.push(row);

  const advisoryOneOf = (condition, objectLabel, lord, allowed, requiredList) => {
    const hit = allowed.includes(lord);
    push({
      condition, scope: 'Advisory', affectsResult: false, object: objectLabel,
      significators: [lord], required: requiredList, hits: hit ? [lord] : [],
      code: hit ? 'Y' : 'P', label: hit ? 'Preferred lord present' : 'Preference not met',
      color: hit ? 'darkgreen' : 'green',
      reason: `${objectLabel} sub lord is ${lord}. ${requiredList.join(' or ')} preferred by the legacy remark; another lord does not automatically reject the muhurat.`,
    });
  };

  if (event.name === 'Political Career') {
    const required = [1, 6, 9, 10, 11];
    for (const lord of ['Jupiter', 'Mercury', 'Mars', 'Saturn']) {
      const houses = planetSignificators(lord, kp);
      const hits = houses.filter((h) => required.includes(h));
      const all = required.every((h) => houses.includes(h));
      const code = all ? 'Y' : hits.length ? 'P' : 'N';
      push({
        condition: `${lord} should strongly signify 1, 6, 9, 10, 11`, scope: 'Advisory', affectsResult: false,
        object: lord, significators: houses, required, hits,
        code, label: all ? 'Strong' : hits.length ? 'Partial' : 'Not supporting',
        color: all ? 'darkgreen' : hits.length ? 'green' : 'red',
        reason: `${lord} signifies ${houses.join(', ') || 'no houses'}; required-house hits: ${hits.join(', ') || 'none'}.`,
      });
    }
  } else if (event.name === 'Surgical Operation') {
    const obs = obstructionHouses(cusps);
    const suitable = obs.modality !== 'Movable';
    push({
      condition: 'Avoid Chara (movable) Lagna when sufficient time is available', scope: 'Advisory', affectsResult: false,
      object: 'Ascendant', significators: [obs.ascendantSign], required: ['Fixed or Dual'], hits: [obs.modality],
      code: suitable ? 'Y' : 'N', label: suitable ? 'Suitable Lagna' : 'Chara Lagna - avoid',
      color: suitable ? 'darkgreen' : 'red',
      reason: `Ascendant is ${obs.ascendantSign}, a ${obs.modality} sign. ` + (suitable
        ? 'It satisfies the non-Chara preference.'
        : 'Legacy surgical-operation guidance says to avoid Chara Lagna when another time can be selected.'),
    });
  } else if (event.name === 'Attainment of Siddhi Initiation') {
    const allowed = ['Ketu', 'Saturn'];
    for (const n of [1, 11]) {
      const lord = sub(n);
      const suitable = allowed.includes(lord);
      push({
        condition: `Cusp ${n} sub lord must be Ketu or Saturn`, scope: 'Mandatory', affectsResult: true,
        object: `Cusp ${n}`, significators: [lord], required: allowed, hits: suitable ? [lord] : [],
        code: suitable ? 'Y' : 'N', label: suitable ? 'Required lord present' : 'Required lord absent',
        color: suitable ? 'darkgreen' : 'red',
        reason: `Cusp ${n} sub lord is ${lord}; allowed lords are Ketu and Saturn.`,
      });
    }
  } else if (event.name === 'Launching Astrology web site') {
    const lord = sub(5);
    const allowed = ['Mercury', 'Jupiter', 'Saturn'];
    const lordOk = allowed.includes(lord);
    push({
      condition: 'Cusp 5 sub lord must be Mercury, Jupiter or Saturn', scope: 'Advisory', affectsResult: false,
      object: 'Cusp 5 Sub Lord', significators: [lord], required: allowed, hits: lordOk ? [lord] : [],
      code: lordOk ? 'Y' : 'N', label: lordOk ? 'Required lord present' : 'Required lord absent',
      color: lordOk ? 'darkgreen' : 'red',
      reason: `Cusp 5 sub lord is ${lord}; allowed lords are Mercury, Jupiter and Saturn.`,
    });
    const houses = planetSignificators(lord, kp);
    const required = [5, 9, 10, 11];
    const hits = houses.filter((h) => required.includes(h));
    const all = required.every((h) => houses.includes(h));
    push({
      condition: 'Cusp 5 sub lord should signify 5, 9, 10, 11', scope: 'Advisory', affectsResult: false,
      object: lord, significators: houses, required, hits,
      code: all ? 'Y' : hits.length ? 'P' : 'N',
      label: all ? 'All required houses' : hits.length ? 'Partial support' : 'No required-house support',
      color: all ? 'darkgreen' : hits.length ? 'green' : 'red',
      reason: `${lord} signifies ${houses.join(', ') || 'no houses'}; required-house hits: ${hits.join(', ') || 'none'}.`,
    });
  } else if (['Foreign Settlement', 'Going Abroad', 'Migrating to a Foreign Country'].includes(event.name)) {
    const obs = obstructionHouses(cusps);
    const dual = obs.modality === 'Dual';
    push({
      condition: 'For Dual Lagna, exclude house 9 from Ascendant sub-lord analysis', scope: 'Rule adjustment', affectsResult: true,
      object: 'Ascendant', significators: [obs.ascendantSign], required: ['Dual-sign adjustment'],
      hits: dual ? ['House 9 excluded'] : ['Not applicable'],
      code: dual ? 'Y' : '-', label: dual ? 'Adjustment applied' : 'Not required', color: dual ? 'darkgreen' : 'green',
      reason: `Ascendant is ${obs.ascendantSign} (${obs.modality}). ` + (dual
        ? 'House 9 has been excluded from the Cusp 1 favorable-house comparison.'
        : 'The special exclusion applies only to a Dual Lagna.'),
    });
  } else if (event.name === 'Second Marriage') {
    const secondLord = sub(2);
    const secondHouses = planetSignificators(secondLord, kp);
    const secondOk = secondHouses.includes(7);
    push({
      condition: 'Cusp 2 sub lord must signify house 7', object: 'Cusp 2', scope: 'Mandatory', affectsResult: true,
      significators: secondHouses, required: [7], hits: secondOk ? [7] : [],
      code: secondOk ? 'Y' : 'N', label: secondOk ? 'House 7 signified' : 'House 7 not signified',
      color: secondOk ? 'darkgreen' : 'red',
      reason: `Cusp 2 sub lord ${secondLord} signifies ${secondHouses.join(', ') || 'no houses'}.`,
    });
    // The catalog contains a second "Second Marriage" event with only the
    // mandatory Cusp-2 rule — do not silently add the extra checks there.
    if (!/7th Sub lord/.test(event.remarks || '')) {
      // fallthrough — nothing more to add for this variant
    } else {
      const seventhLord = sub(7);
      const seventhPlanet = byName[seventhLord];
      const dualSigns = new Set(['Gemini', 'Virgo', 'Sagittarius', 'Pisces']);
      const mercury = seventhLord === 'Mercury';
      const dualConnection = !!(seventhPlanet && dualSigns.has(seventhPlanet.sign));
      const seventhOk = mercury || dualConnection;
      const connection = mercury ? 'Mercury' : dualConnection ? `Dual sign ${seventhPlanet.sign}` : 'No Mercury/dual-sign connection';
      push({
        condition: 'Cusp 7 sub lord must be Mercury or connected to a Dual sign', object: 'Cusp 7',
        scope: 'Advisory', affectsResult: false,
        significators: [seventhLord, seventhPlanet ? seventhPlanet.sign : 'Unknown sign'],
        required: ['Mercury or Dual sign'], hits: seventhOk ? [connection] : [],
        code: seventhOk ? 'Y' : 'N', label: seventhOk ? 'Required connection present' : 'Required connection absent',
        color: seventhOk ? 'darkgreen' : 'red',
        reason: `Cusp 7 sub lord is ${seventhLord}; ${connection}.`,
      });
      const ninthLord = sub(9);
      const ninthHouses = planetSignificators(ninthLord, kp);
      const ninthRequired = [2, 9, 11];
      const ninthHits = ninthHouses.filter((h) => ninthRequired.includes(h));
      const ninthAll = ninthRequired.every((h) => ninthHouses.includes(h));
      push({
        condition: 'Cusp 9 sub lord should signify 2, 9, 11', object: 'Cusp 9', scope: 'Advisory', affectsResult: false,
        significators: ninthHouses, required: ninthRequired, hits: ninthHits,
        code: ninthAll ? 'Y' : ninthHits.length ? 'P' : 'N',
        label: ninthAll ? 'All required houses' : ninthHits.length ? 'Partial support' : 'No required-house support',
        color: ninthAll ? 'darkgreen' : ninthHits.length ? 'green' : 'red',
        reason: `Cusp 9 sub lord ${ninthLord} signifies ${ninthHouses.join(', ') || 'no houses'}; required-house hits: ${ninthHits.join(', ') || 'none'}.`,
      });
    }
  } else if (event.name === 'Propose Marriage for a Girl/Boy') {
    advisoryOneOf('Best when Cusp 5 sub lord is Venus', 'Cusp 5', sub(5), ['Venus'], ['Venus']);
  } else if (event.name === 'Partnership in Business') {
    advisoryOneOf('Best when Cusp 5 sub lord is Jupiter', 'Cusp 5', sub(5), ['Jupiter'], ['Jupiter']);
  } else if (['Speculative gain in Stock Market', 'Start Stock Market Business'].includes(event.name)) {
    const prohibited = [8, 12];
    for (const n of [5, 11]) {
      const lord = sub(n);
      const houses = planetSignificators(lord, kp);
      const hits = houses.filter((h) => prohibited.includes(h));
      const suitable = !hits.length;
      push({
        condition: `Cusp ${n} sub lord must have no connection with houses 8 or 12`, scope: 'Mandatory', affectsResult: true,
        object: `Cusp ${n}`, significators: houses, required: ['No 8/12 connection'], hits,
        code: suitable ? 'Y' : 'N', label: suitable ? 'No prohibited connection' : 'Prohibited connection',
        color: suitable ? 'darkgreen' : 'red',
        reason: `Cusp ${n} sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; 8/12 hits: ${hits.join(', ') || 'none'}.`,
      });
    }
  } else if (event.name === 'Gambling ( Horse Race/Car Race,...)') {
    for (const n of [5, 11]) {
      const lord = sub(n);
      const houses = planetSignificators(lord, kp);
      const hits = houses.includes(12) ? [12] : [];
      const suitable = !hits.length;
      push({
        condition: `Cusp ${n} sub lord must have no connection with house 12`, scope: 'Mandatory', affectsResult: true,
        object: `Cusp ${n}`, significators: houses, required: ['No house 12 connection'], hits,
        code: suitable ? 'Y' : 'N', label: suitable ? 'No prohibited connection' : 'House 12 connection',
        color: suitable ? 'darkgreen' : 'red',
        reason: `Cusp ${n} sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; house 12 hit: ${hits.length ? 'yes' : 'no'}.`,
      });
    }
  } else if (event.name === 'Lanuch oneself as Cinema Actor') {
    const lord = sub(5);
    const suitable = lord === 'Venus';
    push({
      condition: 'Cusp 5 sub lord must be Venus', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 5', significators: [lord], required: ['Venus'], hits: suitable ? [lord] : [],
      code: suitable ? 'Y' : 'N', label: suitable ? 'Required lord present' : 'Required lord absent',
      color: suitable ? 'darkgreen' : 'red',
      reason: `Cusp 5 sub lord is ${lord}; the legacy event requires Venus.`,
    });
  } else if (event.name === 'Upanayan Sanskar ( Sacred Thread Cermony)') {
    advisoryOneOf('Cusp 5 sub lord should be Jupiter', 'Cusp 5', sub(5), ['Jupiter'], ['Jupiter']);
  } else if (event.name === 'Start Work as Professional Astrologer' && /5 CSL MUST/.test(event.remarks || '')) {
    const allowed = ['Jupiter', 'Saturn', 'Mercury'];
    const fifthLord = sub(5);
    const fifthOk = allowed.includes(fifthLord);
    push({
      condition: 'Cusp 5 sub lord must be Jupiter, Saturn or Mercury', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 5', significators: [fifthLord], required: allowed, hits: fifthOk ? [fifthLord] : [],
      code: fifthOk ? 'Y' : 'N', label: fifthOk ? 'Required lord present' : 'Required lord absent',
      color: fifthOk ? 'darkgreen' : 'red',
      reason: `Cusp 5 sub lord is ${fifthLord}; allowed lords are Jupiter, Saturn and Mercury.`,
    });
    const ninthLord = sub(9);
    const ninthOk = allowed.includes(ninthLord);
    push({
      condition: 'Cusp 9 sub lord should be Jupiter, Saturn or Mercury', scope: 'Advisory', affectsResult: false,
      object: 'Cusp 9', significators: [ninthLord], required: allowed, hits: ninthOk ? [ninthLord] : [],
      code: ninthOk ? 'Y' : 'P', label: ninthOk ? 'Preferred lord present' : 'Preference not met',
      color: ninthOk ? 'darkgreen' : 'green',
      reason: `Cusp 9 sub lord is ${ninthLord}. Jupiter, Saturn or Mercury is preferred; another lord does not by itself reject the muhurat.`,
    });
  } else if (event.name === 'Joining in Job/Service' && /6th CSL should be Saturn/.test(event.remarks || '')) {
    advisoryOneOf('Cusp 6 sub lord should be Saturn', 'Cusp 6', sub(6), ['Saturn'], ['Saturn']);
  } else if (event.name === 'Adopting a Child') {
    const periods = require('./kpSystem').vimshottariLevels(
      kp.positions.find((p) => p.name === 'Moon').longitude, 4,
    );
    const levelNames = ['Dasa', 'Bhukti', 'Antara', 'Sukshma'];
    const core = [2, 4, 8];
    const bonus = [6, 10];
    periods.forEach((lord, i) => {
      const houses = planetSignificators(lord, kp);
      const coreHits = houses.filter((h) => core.includes(h));
      const bonusHits = houses.filter((h) => bonus.includes(h));
      const coreComplete = core.every((h) => houses.includes(h));
      const bonusComplete = bonus.every((h) => houses.includes(h));
      const code = coreComplete && bonusComplete ? 'Y' : coreComplete ? 'P' : 'N';
      push({
        condition: `${levelNames[i]} should signify core 2,4,8; additional 6,10 is good`, scope: 'Advisory', affectsResult: false,
        object: levelNames[i], significators: houses, required: ['Core 2,4,8', 'Bonus 6,10'],
        hits: [`Core: ${coreHits.join(',') || '-'}`, `Bonus: ${bonusHits.join(',') || '-'}`],
        code, label: coreComplete && bonusComplete ? 'Core and bonus complete' : coreComplete ? 'Core complete' : 'Core condition not met',
        color: coreComplete && bonusComplete ? 'darkgreen' : coreComplete ? 'green' : 'amber',
        reason: `${levelNames[i]} lord ${lord} signifies ${houses.join(', ') || 'no houses'}; core hits: ${coreHits.join(', ') || 'none'}; bonus hits: ${bonusHits.join(', ') || 'none'}.`,
      });
    });
  } else if (event.name === 'Marriage / Re-union with Partner') {
    const seventhLord = sub(7);
    const seventhPlanet = byName[seventhLord];
    const mercuryStar = !!(seventhPlanet && seventhPlanet.starLord === 'Mercury');
    push({
      condition: "Verify whether Cusp 7 sub lord's Star Lord is Mercury", scope: 'Advisory', affectsResult: false,
      object: 'Cusp 7', significators: [seventhLord, seventhPlanet ? seventhPlanet.starLord : 'Unknown'],
      required: ['Star Lord Mercury'], hits: mercuryStar ? ['Mercury'] : [],
      code: mercuryStar ? 'Y' : 'N', label: mercuryStar ? 'Indication present' : 'Indication absent',
      color: mercuryStar ? 'darkgreen' : 'amber',
      reason: `Cusp 7 sub lord is ${seventhLord}; its Star Lord is ${seventhPlanet ? seventhPlanet.starLord : 'unknown'}.`,
    });
    for (const n of [2, 9]) {
      const lord = sub(n);
      const houses = planetSignificators(lord, kp);
      const connected = houses.includes(2);
      push({
        condition: `Verify whether Cusp ${n} sub lord is related to house 2`, scope: 'Advisory', affectsResult: false,
        object: `Cusp ${n}`, significators: houses, required: [2], hits: connected ? [2] : [],
        code: connected ? 'Y' : 'N', label: connected ? 'Indication present' : 'Indication absent',
        color: connected ? 'darkgreen' : 'amber',
        reason: `Cusp ${n} sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; house 2 connection: ${connected ? 'yes' : 'no'}.`,
      });
    }
  } else if (['Higher Education (Ph.D, IAS, ...)', 'Higher Education (Master, Ph.D, IAS, ...)'].includes(event.name)) {
    for (const n of [4, 9, 11]) advisoryOneOf(`Cusp ${n} sub lord should be Jupiter or Mercury`, `Cusp ${n}`, sub(n), ['Jupiter', 'Mercury'], ['Jupiter', 'Mercury']);
  } else if (event.name === 'Start Spiritual Life & Divine Worship') {
    advisoryOneOf('Cusp 9 sub lord should be Saturn', 'Cusp 9', sub(9), ['Saturn'], ['Saturn']);
  } else if (event.name === 'Popularity/Success in Politics') {
    for (const n of [9, 10]) advisoryOneOf(`Cusp ${n} sub lord should be Saturn or Mars`, `Cusp ${n}`, sub(n), ['Saturn', 'Mars'], ['Saturn', 'Mars']);
  } else if (event.name === 'Start Research Group/ Internet Research group') {
    advisoryOneOf('Cusp 9 sub lord should be Saturn', 'Cusp 9', sub(9), ['Saturn'], ['Saturn']);
  } else if (event.name === 'For Getting Promotion') {
    const lord = sub(10);
    const houses = planetSignificators(lord, kp);
    const combos = [[2, 6], [6, 10], [2, 6, 10], [10, 11], [6, 11], [2, 10, 11], [6, 10, 11]];
    const matched = combos.filter((c) => c.every((h) => houses.includes(h)));
    const suitable = matched.length > 0;
    push({
      condition: 'Cusp 10 sub lord should signify one legacy promotion-house combination', scope: 'Advisory', affectsResult: false,
      object: 'Cusp 10', significators: houses, required: combos.map((c) => c.join('+')), hits: matched.map((c) => c.join('+')),
      code: suitable ? 'Y' : 'N', label: suitable ? 'Allowed combination present' : 'Combination review needed',
      color: suitable ? 'darkgreen' : 'amber',
      reason: `Cusp 10 sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; matched combinations: ${matched.map((c) => c.join('+')).join(', ') || 'none'}.`,
    });
  } else if (event.name === 'Sexual intercourse to conceive') {
    advisoryOneOf('Cusp 5 sub lord is best when Jupiter', 'Cusp 5', sub(5), ['Jupiter'], ['Jupiter']);
    push({
      condition: 'Couple must be medically fit; manual confirmation is required', scope: 'Manual prerequisite', affectsResult: false,
      object: 'Medical fitness', significators: [], required: ['Confirmation from an appropriate medical professional'], hits: [],
      code: '?', label: 'Needs manual confirmation', color: 'amber',
      reason: 'The legacy remark says this muhurat is valid only if the couple are medically fit. The astrology application cannot determine medical fitness and is not a substitute for professional medical advice.',
    });
  } else if (event.name === 'Purchase of Fridge') {
    advisoryOneOf('Cusp 4 sub lord should be Saturn', 'Cusp 4', sub(4), ['Saturn'], ['Saturn']);
  } else if (event.name === 'Purchase of Vehicle') {
    advisoryOneOf('Cusp 4 sub lord should be Venus', 'Cusp 4', sub(4), ['Venus'], ['Venus']);
  } else if (event.name === 'Purchase of land/Construction House') {
    const cuspLords = { 4: sub(4), 11: sub(11) };
    for (const [purpose, preferredLord] of [['House construction', 'Mars'], ['Land purchase', 'Saturn']]) {
      const hits = Object.entries(cuspLords).filter(([, lord]) => lord === preferredLord).map(([n, lord]) => `Cusp ${n}: ${lord}`);
      const preferred = hits.length > 0;
      push({
        condition: `Cusp 4 or Cusp 11 sub lord should be ${preferredLord} for ${purpose}`, scope: 'Advisory', affectsResult: false,
        object: purpose, significators: Object.entries(cuspLords).map(([n, lord]) => `Cusp ${n}: ${lord}`),
        required: [preferredLord], hits,
        code: preferred ? 'Y' : 'P', label: preferred ? 'Preferred lord present' : 'Preference not met',
        color: preferred ? 'darkgreen' : 'green',
        reason: `Cusp 4 sub lord is ${cuspLords[4]} and Cusp 11 sub lord is ${cuspLords[11]}. ${preferredLord} is preferred for ${purpose} by the legacy remark; its absence does not automatically reject the muhurat.`,
      });
    }
  } else if (event.name === 'Admission in College') {
    advisoryOneOf('Cusp 9 sub lord is best when Jupiter or Mercury', 'Cusp 9', sub(9), ['Jupiter', 'Mercury'], ['Jupiter', 'Mercury']);
  } else if (event.name === 'Admission in School') {
    advisoryOneOf('Cusp 4 sub lord is best when Jupiter or Mercury', 'Cusp 4', sub(4), ['Jupiter', 'Mercury'], ['Jupiter', 'Mercury']);
  } else if (event.name === 'Sign a contract or agreement') {
    const lord = sub(3);
    const houses = planetSignificators(lord, kp);
    const required = [3, 11];
    const hits = houses.filter((h) => required.includes(h));
    const suitable = hits.length > 0;
    push({
      condition: 'Cusp 3 sub lord must signify house 3 or 11', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 3', significators: houses, required, hits,
      code: suitable ? 'Y' : 'N', label: suitable ? 'Required house signified' : 'Required house absent',
      color: suitable ? 'darkgreen' : 'red',
      reason: `Cusp 3 sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; house 3/11 hits: ${hits.join(', ') || 'none'}.`,
    });
  } else if (event.name === 'Publishing a Book') {
    const allowed = ['Mercury', 'Jupiter'];
    const cuspLords = { 3: sub(3), 11: sub(11) };
    const hits = Object.entries(cuspLords).filter(([, lord]) => allowed.includes(lord)).map(([n, lord]) => `Cusp ${n}: ${lord}`);
    const suitable = hits.length > 0;
    push({
      condition: 'Mercury or Jupiter must be sub lord of Cusp 3 or Cusp 11', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 3 / Cusp 11', significators: Object.entries(cuspLords).map(([n, lord]) => `Cusp ${n}: ${lord}`),
      required: allowed, hits,
      code: suitable ? 'Y' : 'N', label: suitable ? 'Required lord present' : 'Required lord absent',
      color: suitable ? 'darkgreen' : 'red',
      reason: `Cusp 3 sub lord is ${cuspLords[3]} and Cusp 11 sub lord is ${cuspLords[11]}; Mercury/Jupiter present in at least one required cusp: ${suitable ? 'yes' : 'no'}.`,
    });
  } else if (event.name === 'Take Sanyas (Renounce Worldly Pursuits)') {
    const allowed = ['Saturn', 'Ketu'];
    for (const n of [12, 9]) {
      const lord = sub(n);
      const suitable = allowed.includes(lord);
      push({
        condition: `Cusp ${n} sub lord must be Saturn or Ketu`, scope: 'Mandatory', affectsResult: true,
        object: `Cusp ${n}`, significators: [lord], required: allowed, hits: suitable ? [lord] : [],
        code: suitable ? 'Y' : 'N', label: suitable ? 'Required lord present' : 'Required lord absent',
        color: suitable ? 'darkgreen' : 'red',
        reason: `Cusp ${n} sub lord is ${lord}; allowed lords are Saturn and Ketu.`,
      });
    }
  } else if (event.name === 'Surrender to Police') {
    const lord = sub(12);
    const notRahu = lord !== 'Rahu';
    push({
      condition: 'Cusp 12 sub lord must not be Rahu', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 12 Lord', significators: [lord], required: ['Not Rahu'], hits: notRahu ? [] : ['Rahu'],
      code: notRahu ? 'Y' : 'N', label: notRahu ? 'Rahu absent' : 'Rahu prohibited', color: notRahu ? 'darkgreen' : 'red',
      reason: `Cusp 12 sub lord is ${lord}; the legacy event prohibits Rahu.`,
    });
    const houses = planetSignificators(lord, kp);
    const prohibited = [2, 3, 8, 12];
    const hits = houses.filter((h) => prohibited.includes(h));
    const suitable = !hits.length;
    push({
      condition: 'Cusp 12 sub lord must not signify 2, 3, 8 or 12', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 12 Houses', significators: houses, required: ['No 2/3/8/12 connection'], hits,
      code: suitable ? 'Y' : 'N', label: suitable ? 'No prohibited connection' : 'Prohibited connection', color: suitable ? 'darkgreen' : 'red',
      reason: `Cusp 12 sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; prohibited hits: ${hits.join(', ') || 'none'}.`,
    });
  } else if (event.name === 'To return After Release on bail') {
    const lord = sub(12);
    const notMercury = lord !== 'Mercury';
    push({
      condition: 'Cusp 12 sub lord must not be Mercury', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 12 Lord', significators: [lord], required: ['Not Mercury'], hits: notMercury ? [] : ['Mercury'],
      code: notMercury ? 'Y' : 'N', label: notMercury ? 'Mercury absent' : 'Mercury prohibited', color: notMercury ? 'darkgreen' : 'red',
      reason: `Cusp 12 sub lord is ${lord}; the legacy event prohibits Mercury.`,
    });
    const houses = planetSignificators(lord, kp);
    const prohibited = [2, 3, 8, 12];
    const hits = houses.filter((h) => prohibited.includes(h));
    const suitable = !hits.length;
    push({
      condition: 'Cusp 12 sub lord must not signify 2, 3, 8 or 12', scope: 'Mandatory', affectsResult: true,
      object: 'Cusp 12 Houses', significators: houses, required: ['No 2/3/8/12 connection'], hits,
      code: suitable ? 'Y' : 'N', label: suitable ? 'No prohibited connection' : 'Prohibited connection', color: suitable ? 'darkgreen' : 'red',
      reason: `Cusp 12 sub lord ${lord} signifies ${houses.join(', ') || 'no houses'}; prohibited hits: ${hits.join(', ') || 'none'}.`,
    });
  }

  for (const row of checks) {
    row.labelTa = STATUS_TA[row.label] || row.label;
    row.reasonTa = _reasonTa(row.object, row.significators, row.hits);
  }
  return checks;
}

module.exports = { evaluateSpecialConditions };
