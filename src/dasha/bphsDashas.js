/**
 * The nakshatra dashas of Brihat Parashara Hora Shastra chapter 46 verses 17-43, other than Vimshottari
 * (R. Santhanam's translation, `C23_BPHS_Santhanam.pdf`: PDF page = printed page + 7; printed pp.409-417).
 *
 * Seven of them are Vimshottari's construction with other numbers: a fixed cycle of lords, the years of each, and a
 * start rule "count from [a star] to the birth star (inclusive), divide by [7 or 8]; the remainder names the lord".
 * Each star has one lord and the cycle repeats along the 27 stars; the first period is the birth lord's balance.
 * Ashtottari is different: eight lords hold blocks of 3 or 4 of 28 divisions (Abhijit between Uttarashada and
 * Sravana), a star's share being the lord's years over the block's stars. Shastihayani's table is incomplete in the
 * printed book (see `SHASTIHAYANI`), Kala and Chakra are not nakshatra dashas.
 *
 * Every rule is as printed. Where the printed worked example does not agree with the printed rule (Chaturashiti-sama)
 * both are kept and the page says so.
 */

const { createDashaTable } = require('./nakshatraDashaEngine');

const BPHS = Object.freeze({
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
});
const locus = (verses, printed, quote) => Object.freeze({ ...BPHS, pageLocus: `Chapter 46 verses ${verses}, printed pp.${printed} (PDF ${printed.split('-').map((p) => Number(p) + 7).join('-')}): ${quote}` });

const NAK = Object.freeze({
  Ashwini: 0, Bharani: 1, Krittika: 2, Rohini: 3, Mrigashira: 4, Ardra: 5, Punarvasu: 6, Pushya: 7, Ashlesha: 8, Magha: 9,
  PPhalguni: 10, UPhalguni: 11, Hasta: 12, Chitra: 13, Swati: 14, Vishakha: 15, Anuradha: 16, Jyeshtha: 17, Moola: 18,
  PAshadha: 19, UAshadha: 20, Shravana: 21, Dhanishta: 22, Shatabhisha: 23, PBhadra: 24, UBhadra: 25, Revati: 26,
});

/**
 * The seven "count and divide" systems. `from`: the star counted from; `dir`: 'TO_BIRTH' counts from `from` to the birth
 * star, 'FROM_BIRTH' from the birth star to `from` (Dwadashottari: "from Janma Nakshatra to Revati"), both inclusive.
 */
const SYSTEMS = Object.freeze({
  shodashottari: {
    nameTa: 'ஷோடசோத்தரி', from: NAK.Pushya, dir: 'TO_BIRTH', mod: 8,
    cycle: ['Sun', 'Mars', 'Jupiter', 'Saturn', 'Ketu', 'Moon', 'Mercury', 'Venus'], years: [11, 12, 13, 14, 15, 16, 17, 18],
    source: locus('24-26', '410-411', '"Count the number of Nakshatras from Pushyami to the Janma Nakshatra. Divide this number by 8. The remainder will indicate the Dasha of the Sun, Mars, Jupiter, Saturn, Ketu, Moon, Mercury and Venus ... of 11, 12, 13, 14, 15, 16, 17 and 18 years"'),
    whenTa: 'லக்னம் சந்திரனின் ஹோரையில் + கிருஷ்ண பக்ஷம், அல்லது சூரியனின் ஹோரையில் + சுக்ல பக்ஷம்',
  },
  dwadashottari: {
    nameTa: 'த்வாதசோத்தரி', from: NAK.Revati, dir: 'FROM_BIRTH', mod: 8,
    cycle: ['Sun', 'Jupiter', 'Ketu', 'Mercury', 'Rahu', 'Mars', 'Saturn', 'Moon'], years: [7, 9, 11, 13, 15, 17, 19, 21],
    source: locus('27-28', '411', '"Count from Janma Nakshatra to Revti. Divide this number by 8. ... The Dasha order is the Sun, Jupiter, Ketu, Mercury, Rahu, Mars, Saturn, Moon ... 7, 9, 11, 13, 15, 17, 19 and 21 years"'),
    whenTa: 'லக்னம் சுக்கிரனின் நவாம்சத்தில்',
  },
  panchottari: {
    nameTa: 'பஞ்சோத்தரி', from: NAK.Anuradha, dir: 'TO_BIRTH', mod: 7,
    cycle: ['Sun', 'Mercury', 'Saturn', 'Mars', 'Venus', 'Moon', 'Jupiter'], years: [12, 13, 14, 15, 16, 17, 18],
    source: locus('29-31', '411-412', '"Count from Anuradha up to the Janma Nakshatra and divide the number by 7 ... The order of the Dasha lords is the Sun, Mercury, Saturn, Mars, Venus, Moon and Jupiter ... 12, 13, 14, 15, 16, 17 and 18 years"; example: Mrigasira, Mercury'),
    whenTa: 'லக்னம் கடகம், அல்லது கடக துவாதசாம்சத்தில்',
    example: { birthStar: NAK.Mrigashira, firstLord: 'Mercury' },
  },
  shatabdika: {
    nameTa: 'சதாப்திகா', from: NAK.Revati, dir: 'TO_BIRTH', mod: 7,
    cycle: ['Sun', 'Moon', 'Venus', 'Mercury', 'Jupiter', 'Mars', 'Saturn'], years: [5, 5, 10, 10, 20, 20, 30],
    source: locus('32-34', '413', '"Count from Revti to the Janma Nakshatra and divide this number by seven ... the Sun, the Moon, Venus, Mercury, Jupiter, Mars, and Saturn. Their Dasha ... 5, 5, 10, 10, 20, 20 and 30 years"; example: Mrigasira, Mars'),
    whenTa: 'லக்னம் வர்கோத்தமம்',
    example: { birthStar: NAK.Mrigashira, firstLord: 'Mars' },
  },
  'chaturashiti-sama': {
    nameTa: 'சதுராசீதி சம', from: NAK.Swati, dir: 'TO_BIRTH', mod: 7,
    cycle: ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'], years: [12, 12, 12, 12, 12, 12, 12],
    source: locus('35-36', '413-414', '"Count from Swati to the Janma Nakshatra and divide this number by 7 ... the Sun, The Moon, Mars, Mercury, Jupiter, Venus and Saturn ... The Dasha of each planet is of 12 years"; example: Mrigasira, "the lord of the first Dasha is of Mars"'),
    whenTa: '10-ஆம் அதிபதி 10-ஆம் வீட்டில்',
    // The rule gives Mercury (count 18, remainder 4) for Mrigasira; the printed example says Mars.
    example: { birthStar: NAK.Mrigashira, firstLord: 'Mars', disagrees: true },
  },
  'dwisaptati-sama': {
    nameTa: 'த்விசப்ததி சம', from: NAK.Moola, dir: 'TO_BIRTH', mod: 8,
    cycle: ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'], years: [9, 9, 9, 9, 9, 9, 9, 9],
    source: locus('37-39', '414', '"Count from Moola to Janma Nakshatra and divide the number by 8 ... The Sun, the Moon, Mars, Mercury, Jupiter, Venus, Saturn and Rahu (Ketu has no Dasha) ... all the eight planets, have Dasha of 9 years each"'),
    whenTa: 'லக்னாதிபதி லக்னத்தில் அல்லது 7-ஆம் வீட்டில்',
  },
  'shattrimshat-sama': {
    nameTa: 'ஷட்த்ரிம்சத் சம', from: NAK.Shravana, dir: 'TO_BIRTH', mod: 8,
    cycle: ['Moon', 'Sun', 'Jupiter', 'Mars', 'Mercury', 'Saturn', 'Venus', 'Rahu'], years: [1, 2, 3, 4, 5, 6, 7, 8],
    source: locus('42-43', '416', '"Count from Sravana to the Janma Nakshatra and divide the number by 8 ... The Moon, the Sun, Jupiter, Mars, Mercury, Saturn, Venus and Rahu. Their Dasha will be 1, 2, 3, 4, 5, 6, 7, 8 years"; example: Mrigasira, Jupiter, 3 years'),
    whenTa: 'பகலில் பிறந்து லக்னம் சூரியனின் ஹோரையில்; இரவில் பிறந்து லக்னம் சந்திரனின் ஹோரையில்',
    example: { birthStar: NAK.Mrigashira, firstLord: 'Jupiter' },
  },
});

/** The count (inclusive, 1-27) the book makes for a birth star. */
function countFor(system, birthStar) {
  const s = SYSTEMS[system];
  const n = s.dir === 'TO_BIRTH' ? ((birthStar - s.from + 27) % 27) + 1 : ((s.from - birthStar + 27) % 27) + 1;
  return n;
}
/** The lord the rule names for a birth star. */
function lordOf(system, birthStar) {
  const s = SYSTEMS[system];
  const r = countFor(system, birthStar) % s.mod || s.mod;
  return s.cycle[r - 1];
}

const TABLES = Object.fromEntries(Object.entries(SYSTEMS).map(([id, s]) => {
  const years = Object.fromEntries(s.cycle.map((l, i) => [l, s.years[i]]));
  return [id, createDashaTable({
    id, cycle: s.cycle, years, totalYears: s.years.reduce((a, b) => a + b, 0), lordOfNakshatra: (n) => lordOf(id, n),
  })];
}));

// --------------------------------------------------------------------------- Ashtottari ---
const ABHIJIT = 'ABHIJIT';
/** The 28 divisions in dasha order, lord by lord (the printed Ashtottari Dasha Table, p.410). */
const ASHTOTTARI_BLOCKS = Object.freeze([
  { lord: 'Sun', years: 6, parts: [NAK.Ardra, NAK.Punarvasu, NAK.Pushya, NAK.Ashlesha] },
  { lord: 'Moon', years: 15, parts: [NAK.Magha, NAK.PPhalguni, NAK.UPhalguni] },
  { lord: 'Mars', years: 8, parts: [NAK.Hasta, NAK.Chitra, NAK.Swati, NAK.Vishakha] },
  { lord: 'Mercury', years: 17, parts: [NAK.Anuradha, NAK.Jyeshtha, NAK.Moola] },
  { lord: 'Saturn', years: 10, parts: [NAK.PAshadha, NAK.UAshadha, ABHIJIT, NAK.Shravana] },
  { lord: 'Jupiter', years: 19, parts: [NAK.Dhanishta, NAK.Shatabhisha, NAK.PBhadra] },
  { lord: 'Rahu', years: 12, parts: [NAK.UBhadra, NAK.Revati, NAK.Ashwini, NAK.Bharani] },
  // The printed table heads this column "Ketu"; the text names Venus ("Ketu having been denied this privilege").
  { lord: 'Venus', years: 21, parts: [NAK.Krittika, NAK.Rohini, NAK.Mrigashira] },
]);
const STAR_DEG = 360 / 27;
/** Abhijit is the 4th pada of Uttarashada and the first 1/15 of Sravana (p.409): 276°40′ to 280°53′20″. */
const ABHIJIT_FROM = NAK.UAshadha * STAR_DEG + 0.75 * STAR_DEG;
const ABHIJIT_TO = NAK.Shravana * STAR_DEG + STAR_DEG / 15;

/** The division a longitude is in: a star index 0-26 or ABHIJIT, with the fraction of that division elapsed. */
function divisionOf(longitude) {
  const lon = ((longitude % 360) + 360) % 360;
  let star = Math.floor(lon / STAR_DEG) % 27;
  let from = star * STAR_DEG;
  let to = from + STAR_DEG;
  if (star === NAK.UAshadha && lon >= ABHIJIT_FROM) return { division: ABHIJIT, fraction: (lon - ABHIJIT_FROM) / (ABHIJIT_TO - ABHIJIT_FROM) };
  if (star === NAK.Shravana && lon < ABHIJIT_TO) return { division: ABHIJIT, fraction: (lon - ABHIJIT_FROM) / (ABHIJIT_TO - ABHIJIT_FROM) };
  if (star === NAK.UAshadha) to = ABHIJIT_FROM;
  if (star === NAK.Shravana) from = ABHIJIT_TO;
  return { division: star, fraction: (lon - from) / (to - from) };
}

/** Ashtottari's balance at birth: the part of the lord's years not yet spent in the block (BPHS p.409-410 and the example). */
function ashtottariBalance(longitude) {
  const { division, fraction } = divisionOf(longitude);
  const block = ASHTOTTARI_BLOCKS.find((b) => b.parts.includes(division));
  const share = block.years / block.parts.length;
  const position = block.parts.indexOf(division);
  const expired = share * (position + fraction);
  return {
    nakshatraIndex: division === ABHIJIT ? NAK.UAshadha : division, division, lord: block.lord, elapsedFraction: fraction,
    totalYears: block.years, share, expiredYears: expired, balanceYears: block.years - expired,
  };
}
const ASHTOTTARI = createDashaTable({
  id: 'ashtottari', cycle: ASHTOTTARI_BLOCKS.map((b) => b.lord),
  years: Object.fromEntries(ASHTOTTARI_BLOCKS.map((b) => [b.lord, b.years])), totalYears: 108,
  lordOfNakshatra: (n) => ASHTOTTARI_BLOCKS.find((b) => b.parts.includes(n)).lord,
  balanceAt: ashtottariBalance,
});
const ASHTOTTARI_SOURCE = locus('17-23', '409-410', '"Ashtottari Dasha, when Rahu not being in Lagna, in any other Kendra or Trikona to the lord of the Ascendant. From 4 Nakshatras from Aridra commences the Dasha of the Sun, from 3 Nakshatras after that ... the Moon; 4 ... Mars ... 3 ... Mercury ... 4 ... Saturn ... 3 ... Jupiter ... Rahu ... Sukra"; durations 6, 15, 8, 17, 10, 19, 12, 21; "Ashtottari Dasha Table", Abhijit "the 4th Pada of uttarashada plus the 15th part of the beginning of Sravan"; the Uttarashada example');
const ASHTOTTARI_WHEN_TA = 'ராகு லக்னாதிபதியிலிருந்து கேந்திரம், திரிகோணத்தில் இல்லாதபோது; பகலில் கிருஷ்ண பக்ஷத்தில், இரவில் சுக்ல பக்ஷத்தில் பிறந்தவருக்கு (ஸ்லோ.23)';

// ------------------------------------------------------------------------ Shastihayani ---
/**
 * The printed table (p.416) is cut off at the right edge of the scan, and the retyped text that completes it
 * (verses 40-41) gives 27 divisions with Abhijit counted and Chitra named nowhere. The Sun is said to rule 4 stars in
 * the example (the Santhanam table prints three). Both editions disagree, so no table is entered here.
 */
const SHASTIHAYANI_PROBLEM_TA = 'அச்சிட்ட அட்டவணை ஸ்கேனின் வலது ஓரத்தில் வெட்டப்பட்டுள்ளது (சனி, ராகு நிரல்கள் இல்லை); வேறொரு பதிப்பின் முழு உரையில் சித்திரை எங்குமில்லை, அபிஜித் உள்ளது. எடுத்துக்காட்டு சூரியனுக்கு 4 நட்சத்திரம் என்கிறது (சந்தானம் அட்டவணையில் 3). எனவே அட்டவணை எழுதப்படவில்லை.';

// --------------------------------------------------------------------------- when each applies ---
const SIGN_LORD = Object.freeze(['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']);
const norm360 = (d) => ((d % 360) + 360) % 360;
const navamshaSign = (lon) => Math.floor(norm360(lon) / (30 / 9)) % 12;
/** The hora of the Lagna: in an odd sign the Sun's for the first 15 degrees, the Moon's for the second; in an even sign the reverse. */
const horaOf = (lon) => { const sign = Math.floor(norm360(lon) / 30); const first = norm360(lon) % 30 < 15; return (sign % 2 === 0) === first ? 'Sun' : 'Moon'; };

/**
 * The condition each system names for whom it suits (the verses), worked out for one chart; the book states them as "suitable",
 * and Parashara adds that Vimshottari is the main dasha for all. `applies` is true / false, or null when the chart facts needed are absent.
 * @param facts { lagnaLongitude, signs: { Sun..Ketu: sign 0-11 }, paksha: 'SHUKLA'|'KRISHNA', day: boolean }
 */
function applicability(system, facts) {
  const lagna = facts.lagnaLongitude;
  const ls = Math.floor(norm360(lagna) / 30);
  const house = (sign) => ((sign - ls + 12) % 12) + 1;
  const yes = (applies, reasonTa) => ({ applies, reasonTa });
  switch (system) {
    case 'shodashottari': {
      const h = horaOf(lagna);
      const ok = (h === 'Moon' && facts.paksha === 'KRISHNA') || (h === 'Sun' && facts.paksha === 'SHUKLA');
      return yes(ok, `லக்னம் ${h === 'Sun' ? 'சூரியனின்' : 'சந்திரனின்'} ஹோரையில்; ${facts.paksha === 'SHUKLA' ? 'சுக்ல' : 'கிருஷ்ண'} பக்ஷம்`);
    }
    case 'dwadashottari': {
      const n = navamshaSign(lagna);
      return yes(n === 1 || n === 6, `லக்ன நவாம்சம் ${n === 1 ? 'ரிஷபம்' : n === 6 ? 'துலாம்' : 'வேறு ராசி'} (சுக்கிரனின் வீடுகள் ரிஷபம், துலாம்)`);
    }
    case 'panchottari': {
      const ok = ls === 3 && norm360(lagna) % 30 < 2.5;
      return yes(ok, ls === 3 ? 'லக்னம் கடகம்; கடக துவாதசாம்சம் = கடகத்தின் முதல் 2½°' : 'லக்னம் கடகம் அல்ல');
    }
    case 'shatabdika': {
      const ok = navamshaSign(lagna) === ls;
      return yes(ok, ok ? 'லக்னம் வர்கோத்தமம் (ராசியும் நவாம்சமும் ஒன்றே)' : 'லக்னம் வர்கோத்தமம் அல்ல');
    }
    case 'chaturashiti-sama': {
      const tenth = SIGN_LORD[(ls + 9) % 12];
      const at = facts.signs[tenth];
      return yes(house(at) === 10, `10-ஆம் அதிபதி ${tenth} ${house(at)}-ஆம் வீட்டில்`);
    }
    case 'dwisaptati-sama': {
      const lord = SIGN_LORD[ls];
      const h = house(facts.signs[lord]);
      return yes(h === 1 || h === 7, `லக்னாதிபதி ${lord} ${h}-ஆம் வீட்டில்`);
    }
    case 'shattrimshat-sama': {
      const h = horaOf(lagna);
      const ok = (facts.day && h === 'Sun') || (!facts.day && h === 'Moon');
      return yes(ok, `${facts.day ? 'பகல்' : 'இரவு'} பிறப்பு; லக்னம் ${h === 'Sun' ? 'சூரியனின்' : 'சந்திரனின்'} ஹோரையில்`);
    }
    case 'ashtottari': {
      const lord = SIGN_LORD[ls];
      const fromLord = ((facts.signs.Rahu - facts.signs[lord] + 12) % 12) + 1;
      const rahuOk = house(facts.signs.Rahu) !== 1 && ![1, 4, 7, 10, 5, 9].includes(fromLord);
      const extra = (facts.day && facts.paksha === 'KRISHNA') || (!facts.day && facts.paksha === 'SHUKLA');
      return yes(rahuOk, `ராகு லக்னாதிபதி ${lord} இலிருந்து ${fromLord}-ஆம் வீட்டில் (லக்னத்திலிருந்து ${house(facts.signs.Rahu)}); ${extra ? 'ஸ்லோ.23: பகல் கிருஷ்ணபக்ஷம் / இரவு சுக்லபக்ஷம் — ஆம்' : 'ஸ்லோ.23: பகல் கிருஷ்ணபக்ஷம் / இரவு சுக்லபக்ஷம் அல்ல'}`);
    }
    default:
      return yes(null, 'நிபந்தனை இல்லை');
  }
}

module.exports = {
  applicability, horaOf, navamshaSign, SIGN_LORD,
  BPHS, NAK, SYSTEMS, TABLES, countFor, lordOf, ASHTOTTARI, ASHTOTTARI_BLOCKS, ASHTOTTARI_SOURCE, ASHTOTTARI_WHEN_TA,
  ashtottariBalance, divisionOf, ABHIJIT, ABHIJIT_FROM, ABHIJIT_TO, SHASTIHAYANI_PROBLEM_TA,
};
