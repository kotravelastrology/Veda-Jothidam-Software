/**
 * BPHS ch.80 (src/report/femaleHoroscopy.js, fixture bphs-80.json): the fixture's shape and each rule on charts worked by hand.
 */
const assert = require('node:assert/strict');
const F = require('./src/report/femaleHoroscopy');

const D = F.DATA;
assert.ok(D.source.title && D.source.pageLocus && D.scope.length > 300 && D.principle.ta.length > 100);
assert.deepEqual(Object.keys(D.trimsamsa.table), ['Mars', 'Mercury', 'Venus', 'Moon', 'Sun', 'Jupiter', 'Saturn']);
for (const [owner, row] of Object.entries(D.trimsamsa.table)) assert.deepEqual(Object.keys(row), ['Mars', 'Venus', 'Mercury', 'Jupiter', 'Saturn'], owner);
assert.equal(D.trimsamsa.table.Mars.Mars, 'திருமணத்துக்கு முன் ஒரு ஆணுடன் தகாத உறவு');
assert.equal(D.trimsamsa.table.Saturn.Jupiter, 'கணவனிடம் பக்தி உடையவள்');
assert.deepEqual(Object.keys(D.seventhOwners).sort(), ['Jupiter', 'Mars', 'Mercury', 'Moon', 'Saturn', 'Sun', 'Venus']);
assert.deepEqual(Object.keys(D.eighth).filter((k) => !['verses', 'page'].includes(k)), ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu']);
for (const [id, r] of Object.entries(D.rules)) {
  const [a, b] = r.page.split('-').map(Number);
  assert.ok(a >= 953 && (b ?? a) <= 965 && r.ta.length > 30 && r.verses, id);
}

// a chart worked by hand: Aries Lagna; Sun 1st, Moon 4th, Mars 7th, Mercury 10th, Jupiter 5th, Venus 11th, Saturn 8th, Rahu 3rd, Ketu 9th
const base = () => ({
  signs: { Sun: 0, Moon: 3, Mars: 6, Mercury: 9, Jupiter: 4, Venus: 10, Saturn: 7, Rahu: 2, Ketu: 8 },
  longitudes: { Sun: 5, Moon: 94, Mars: 185, Mercury: 275, Jupiter: 125, Venus: 305, Saturn: 215 },
  lagnaSign: 0, lagnaLongitude: 5, vara: 4, nakshatra: 5, tithi: 5,
});
const rows = (f) => Object.fromEntries(F.evaluate(f).map((r) => [r.id, r]));
const st = (f) => Object.fromEntries(F.evaluate(f).map((r) => [r.id, r.status]));
let r = rows(base());

// v.5-7: Aries (odd) Lagna and Cancer (even) Moon are mixed
assert.equal(r.SIGN_NATURE.status, 'held');
assert.equal(r.SIGN_NATURE.effect, D.signNature.mixed.ta);
let f = base(); f.signs.Moon = 1;
assert.equal(rows(f).SIGN_NATURE.effect, D.signNature.mixed.ta);
f = { ...base(), lagnaSign: 1, lagnaLongitude: 35 }; f.signs.Moon = 3;
assert.equal(rows(f).SIGN_NATURE.effect, D.signNature.even.ta, 'Taurus and Cancer are both even signs');
f = base(); f.signs.Moon = 4;
assert.equal(rows(f).SIGN_NATURE.effect, D.signNature.odd.ta, 'Aries and Leo are both odd');

// v.8-16: the Trimsamsa: Aries 5 deg (an odd sign) is Mars's first 5 degrees and Aries's lord is Mars: the first line of the table
f = base(); f.lagnaLongitude = 3;
assert.equal(rows(f).TRIMSAMSA_LAGNA.effect, D.trimsamsa.table.Mars.Mars);
// the Moon at Cancer 4 deg (94): an even sign, 0-5 Venus; Cancer's lord is the Moon
assert.equal(rows(base()).TRIMSAMSA_MOON.effect, D.trimsamsa.table.Moon.Venus);

// v.17-21 on the 7th (Libra): Mars there
r = rows(base());
assert.deepEqual(['SEVENTH_EMPTY', 'SEVENTH_MOVABLE', 'SEVENTH_MARS', 'SEVENTH_MALEFIC', 'SEVENTH_SUN', 'SEVENTH_BENEFIC', 'SEVENTH_MIXED', 'SEVENTH_MERCURY_SATURN'].map((k) => r[k].status),
  ['not-held', 'held', 'held', 'held', 'not-held', 'not-held', 'not-held', 'not-held'], 'Libra is movable; Mars in the 7th is a malefic there');
f = base(); f.signs.Venus = 6;
r = rows(f);
assert.equal(r.SEVENTH_MIXED.status, 'held');
assert.equal(r.SEVENTH_BENEFIC.status, 'held');
f = base(); f.signs.Mars = 5; // nothing in Libra, and Jupiter in Leo reaches only Sagittarius, Aquarius and Aries
r = rows(f);
assert.equal(r.SEVENTH_EMPTY.status, 'held');
f = base(); f.signs.Mars = 5; f.signs.Mercury = 6; f.signs.Saturn = 6;
assert.equal(rows(f).SEVENTH_MERCURY_SATURN.status, 'held');

// Mars in the Navamsha of Venus and Venus in the Navamsha of Mars (v.17-21)
f = base(); f.longitudes.Mars = 0.5; f.longitudes.Venus = 0.5; // both in Aries's first navamsha, Aries: Mars's own, not Venus's
assert.equal(rows(f).MARS_VENUS_NAVAMSA.status, 'not-held');
// (a case that cannot arise from the two lines below was dropped)
f = base(); f.longitudes.Mars = 60 + 0.5; // Gemini's first navamsha is Libra, Venus's
f.longitudes.Venus = 210 + 0.5; // Scorpio's first navamsha is Cancer, not Mars's
assert.equal(rows(f).MARS_VENUS_NAVAMSA.status, 'not-held');
f = base(); f.longitudes.Mars = 60 + 0.5; f.longitudes.Venus = 0.5; // Venus in Aries's first navamsha, Aries; Mars in Libra's
assert.equal(rows(f).MARS_VENUS_NAVAMSA.status, 'held');

// v.22-25 and v.35: the 7th sign Libra (Venus's) and the setting Navamsha at Aries 5 + 180 = Libra 5: the 2nd navamsha of Libra, Aquarius? (Libra starts Libra: 0-3.33 Libra, 3.33-6.67 Scorpio)
r = rows(base());
assert.ok(/துலாம் \(அதிபதி சுக்கிரன்\): கணவன் அதிர்ஷ்டசாலி/.test(r.SEVENTH_SIGN.detail));
assert.ok(/அஸ்தமன நவாம்சம் விருச்சிகம் \(அதிபதி செவ்வாய்\)/.test(r.SEVENTH_SIGN.detail), 'Libra 5 deg is in the Scorpio navamsha');
assert.equal(r.NAVAMSA7.status, 'held');
assert.equal(r.NAVAMSA7.effect, 'பெண்ணுறுப்பில் நோய்');

// v.26-33: Saturn in the 8th (Scorpio)
r = rows(base());
assert.equal(r.EIGHTH_SATURN.status, 'held');
assert.equal(r.EIGHTH_SATURN.effect, D.eighth.Saturn);
assert.equal(r.EIGHTH_SUN.status, 'not-held');

// v.34: Moon, Venus with Mars in one sign, and a malefic in or aspecting the 5th
f = base(); f.signs.Moon = 6; f.signs.Venus = 6;
assert.equal(rows(f).BARREN_34.status, 'held', 'Moon, Venus and Mars in Libra, and Saturn in Scorpio aspects the 5th (Leo) by its 10th');

// v.36-37 on a Gemini Lagna
f = { ...base(), lagnaSign: 2, lagnaLongitude: 65 }; f.signs.Venus = 2; f.signs.Moon = 2;
assert.equal(rows(f).LAGNA_VENUS_MOON.status, 'held');
f.signs.Mercury = 2;
assert.equal(rows(f).LAGNA_MOON_MERCURY_VENUS.status, 'held');
f = base(); f.signs.Jupiter = 0;
assert.equal(rows(f).LAGNA_JUPITER.status, 'held');

// v.38: the 8th Leo with the Sun and Moon
f = { ...base(), lagnaSign: 9, lagnaLongitude: 275 }; f.signs.Sun = 4; f.signs.Moon = 4; // Capricorn Lagna: the 8th is Leo
assert.equal(rows(f).EIGHTH_SUN_MOON.status, 'held');
f = { ...base(), lagnaSign: 10, lagnaLongitude: 305 }; f.signs.Mercury = 5; f.signs.Moon = 5; // Aquarius Lagna: the 8th is Virgo
assert.equal(rows(f).EIGHTH_MERCURY_MOON.status, 'held');

// v.39: an Aries Lagna with the Moon and Venus in it and Mars aspecting it
f = base(); f.signs.Moon = 0; f.signs.Venus = 0; f.signs.Mars = 6; // Mars in Libra aspects the 7th (Aries)
assert.equal(rows(f).BARREN_39.status, 'held');
f.signs.Mars = 4; f.signs.Saturn = 4; f.signs.Sun = 4; // from Leo, Saturn reaches Libra, Aquarius, Taurus, Mars Scorpio, Aquarius, Pisces and the Sun Aquarius: none Aries
assert.equal(rows(f).BARREN_39.status, 'not-held');

// v.41: Jupiter, Venus and Mars in the 8th; or Mars and Saturn
f = base(); f.signs.Mars = 7;
assert.equal(rows(f).NO_CONCEPTION_41.status, 'held', 'Mars and Saturn in Scorpio, the 8th from Aries');

// v.43: Visha Kanya by weekday, star and tithi (Sunday, Ashlesha 8, 2nd tithi; the tithi counted in either half)
f = base(); f.vara = 0; f.nakshatra = 8; f.tithi = 2;
assert.equal(rows(f).VISHA_KANYA_43.status, 'held');
f.tithi = 17;
assert.equal(rows(f).VISHA_KANYA_43.status, 'held', 'the 2nd tithi of the dark half');
f.nakshatra = 9;
assert.equal(rows(f).VISHA_KANYA_43.status, 'not-held');
f = base(); f.vara = 6; f.nakshatra = 2; f.tithi = 7;
assert.equal(rows(f).VISHA_KANYA_43.status, 'held', 'Saturday, Krittika, 7th');
f = base(); f.vara = 2; f.nakshatra = 23; f.tithi = 12;
assert.equal(rows(f).VISHA_KANYA_43.status, 'held', 'Tuesday, Shatabhisha, 12th');
f.vara = 3;
assert.equal(rows(f).VISHA_KANYA_43.status, 'not-held');

// v.47: Mars in the 7th from Aries with no benefic with it or aspecting it
r = rows(base());
assert.equal(r.WIDOW_47.status, 'held', 'Mars alone in Libra; Jupiter in Leo does not aspect Libra (Leo to Libra is the 3rd)');
f = base(); f.signs.Venus = 6;
assert.equal(rows(f).WIDOW_47.status, 'not-held', 'Venus with Mars');

// v.50-51: a Taurus Lagna in Saturn's navamsha with Venus and Saturn aspecting each other
f = { ...base(), lagnaSign: 1, lagnaLongitude: 30 + 1 }; // Taurus 1 deg: the first navamsha of an earth sign is Capricorn, Saturn's
f.signs.Venus = 0; f.signs.Saturn = 6; // Venus in Aries, Saturn in Libra: the 7th from each other
f.longitudes.Venus = 10; f.longitudes.Saturn = 190;
assert.equal(rows(f).LUST_50.status, 'held');
f.lagnaLongitude = 30 + 28; // the 9th navamsha is Virgo, Mercury's
assert.equal(rows(f).LUST_50.status, 'not-held');

// v.53-54: a malefic in the 7th and a planet in the 8th; a benefic alone in the 8th
r = rows(base());
assert.equal(r.ASCETIC_53.status, 'held', 'Mars in the 7th, Saturn in the 8th');
assert.equal(r.DIES_BEFORE_54.status, 'not-held');
f = base(); f.signs.Saturn = 2; f.signs.Moon = 7; f.signs.Sun = 2; f.signs.Mars = 9; // the Moon alone in Scorpio; Mars in Capricorn and Saturn and the Sun in Gemini do not aspect it
assert.equal(rows(f).DIES_BEFORE_54.status, 'held');

// the rest: not checked or unclear
assert.equal(r.DEAD_CHILD_40.status, 'not-checked');
assert.equal(r.EQUAL_55.status, 'not-checked');
assert.equal(r.LEARNED_52.status, 'not-held', 'an odd Lagna');
f = { ...base(), lagnaSign: 1, lagnaLongitude: 35 };
assert.equal(rows(f).LEARNED_52.status, 'unknown', 'an even Lagna: strength is not checked');
// every row carries its rule text and its citation
for (const row of F.evaluate(base())) assert.ok(row.text.length > 20 && row.verses && /^9[5-6]\d/.test(row.page.split('-')[0]), row.id);
console.log('test-female-horoscopy: all assertions passed');
