const assert = require('node:assert/strict');
const { julianDay } = require('@swisseph/node');
const {
  calculateShadbala, uchchaBala, ojhayugmarasyamsaBala, kendradiBala, drekkanaBala,
  digBala, naisargikaBala, pakshaBala, tribhagaBala, nathonnataBala, saptavargajaBala, drikBala,
  varshaLord, masaLord, dinaLord, horaLord, computeVarshaMasaDinaHoraLords, ayanaBala,
  NAISARGIKA_RANK, MOOLATRIKONA, SAPTAVARGAJA_POINTS, ABBREVIATED_AHARGANA_EPOCH_JD,
} = require('./src/chart/shadbala');

const close = (actual, expected, tolerance, msg) => {
  assert.ok(Math.abs(actual - expected) < tolerance, `${msg}: expected ~${expected}, got ${actual}`);
};

// BPHS's own worked example (file page 219): Sun at Pisces 12d15' (=342.25 deg),
// debilitation Libra 10d (=190 deg) -> 152.25/3 = 50.75 Virupas.
close(uchchaBala('Sun', 11 * 30 + 12.25), 50.75, 1e-6, 'Uchcha Bala worked example');

// Naisargika Bala reproduces the book's own printed Rupa figures exactly.
close(naisargikaBala('Sun'), 60, 1e-9, 'Naisargika Bala Sun');
close(naisargikaBala('Moon'), 60 * 0.857, 0.01, 'Naisargika Bala Moon');
close(naisargikaBala('Saturn'), 60 * 0.143, 0.01, 'Naisargika Bala Saturn');
assert.equal(Object.keys(NAISARGIKA_RANK).length, 7);

// Ojhayugmarasyamsa Bala: Jupiter (favours odd) in an odd rasi(0=Aries) and odd
// navamsa gets both 15s = 30; in an even rasi and even navamsa gets 0.
assert.equal(ojhayugmarasyamsaBala('Jupiter', 0, 0), 30);
assert.equal(ojhayugmarasyamsaBala('Jupiter', 1, 1), 0);
// Venus (favours even) is the mirror image.
assert.equal(ojhayugmarasyamsaBala('Venus', 1, 1), 30);
assert.equal(ojhayugmarasyamsaBala('Venus', 0, 0), 0);

// Kendradi Bala: angle=60, succedent=30, cadent=15, counted from Lagna's own rasi.
assert.equal(kendradiBala(0, 0), 60); // same sign as Lagna -> house 1 (angle)
assert.equal(kendradiBala(3, 0), 60); // house 4 (angle)
assert.equal(kendradiBala(1, 0), 30); // house 2 (succedent)
assert.equal(kendradiBala(2, 0), 15); // house 3 (cadent)

// Drekkana Bala: male planet (Sun) in 1st decanate; female (Moon) in 2nd; neuter (Saturn) in 3rd.
assert.equal(drekkanaBala('Sun', 2), 15);
assert.equal(drekkanaBala('Sun', 15), 0);
assert.equal(drekkanaBala('Moon', 15), 15);
assert.equal(drekkanaBala('Saturn', 25), 15);
assert.equal(drekkanaBala('Saturn', 2), 0);

// Dig Bala: Sun/Mars strong at MC, zero at IC; Saturn strong at Descendant, zero at Ascendant
// (BPHS: "Saturn in the descendant" is his strong point, per the ascendant being deducted from his longitude).
const angles = { ascendant: 10, mc: 100 };
close(digBala('Sun', 100, angles), 60, 1e-6, 'Sun Dig Bala at MC');
close(digBala('Sun', 280, angles), 0, 1e-6, 'Sun Dig Bala at IC'); // IC = mc+180 = 280
close(digBala('Saturn', 190, angles), 60, 1e-6, 'Saturn Dig Bala at Descendant'); // Descendant = asc+180 = 190
close(digBala('Saturn', 10, angles), 0, 1e-6, 'Saturn Dig Bala at Ascendant');

// Paksha Bala: full moon (180 deg apart) -> benefics 60, malefics 0, Moon 120 (doubled).
close(pakshaBala('Jupiter', 0, 180), 60, 1e-6, 'benefic Paksha Bala at full moon');
close(pakshaBala('Sun', 0, 180), 0, 1e-6, 'malefic Paksha Bala at full moon');
close(pakshaBala('Moon', 0, 180), 120, 1e-6, 'Moon Paksha Bala doubled at full moon');
// New moon (0 deg apart) -> benefics 0, malefics 60.
close(pakshaBala('Venus', 100, 100), 0, 1e-6, 'benefic Paksha Bala at new moon');
close(pakshaBala('Mars', 100, 100), 60, 1e-6, 'malefic Paksha Bala at new moon');

// Tribhaga Bala: Jupiter always 60; the day/night third's own lord gets 60, others 0.
assert.equal(tribhagaBala('Jupiter', true, 0), 60);
assert.equal(tribhagaBala('Jupiter', false, 2), 60);
assert.equal(tribhagaBala('Mercury', true, 0), 60); // 1st day third -> Mercury
assert.equal(tribhagaBala('Sun', true, 0), 0);
assert.equal(tribhagaBala('Saturn', true, 2), 60); // 3rd day third -> Saturn
assert.equal(tribhagaBala('Mars', false, 2), 60); // 3rd night third -> Mars
assert.equal(tribhagaBala('Venus', false, 1), 60); // 2nd night third -> Venus

// Nathonnata Bala: at exact local midnight, night planets (Moon/Mars/Saturn)
// are at their maximum (60) and day planets (Sun/Jupiter/Venus) at their
// minimum (0); at exact noon it is the reverse. Mercury is always 60.
const midnightJd = 2451545.0;
close(nathonnataBala('Moon', midnightJd, midnightJd), 60, 1e-9, 'Moon Nathonnata at midnight');
close(nathonnataBala('Mars', midnightJd, midnightJd), 60, 1e-9, 'Mars Nathonnata at midnight');
close(nathonnataBala('Saturn', midnightJd, midnightJd), 60, 1e-9, 'Saturn Nathonnata at midnight');
close(nathonnataBala('Sun', midnightJd, midnightJd), 0, 1e-9, 'Sun Nathonnata at midnight');
close(nathonnataBala('Jupiter', midnightJd, midnightJd), 0, 1e-9, 'Jupiter Nathonnata at midnight');
close(nathonnataBala('Mercury', midnightJd, midnightJd), 60, 1e-9, 'Mercury always full Nathonnata');
const noonJd = midnightJd + 0.5;
close(nathonnataBala('Moon', noonJd, midnightJd), 0, 1e-9, 'Moon Nathonnata at noon');
close(nathonnataBala('Sun', noonJd, midnightJd), 60, 1e-9, 'Sun Nathonnata at noon');
close(nathonnataBala('Mercury', noonJd, midnightJd), 60, 1e-9, 'Mercury always full Nathonnata (noon too)');

// Moolatrikona table reproduces the book's own worked splits (v.51-54): e.g.
// "the first one third of Sagittarius" for Jupiter = 0-10 degrees; Venus
// "divides Libra into two halves" = 0-15/15-30.
close(MOOLATRIKONA.Jupiter.to - MOOLATRIKONA.Jupiter.from, 10, 1e-9, 'Jupiter Moolatrikona is one third of a sign');
close(MOOLATRIKONA.Venus.to - MOOLATRIKONA.Venus.from, 15, 1e-9, 'Venus Moolatrikona is half a sign');
assert.equal(SAPTAVARGAJA_POINTS.moolatrikona, 45);
assert.equal(SAPTAVARGAJA_POINTS.own, 30);
assert.equal(SAPTAVARGAJA_POINTS.greatEnemy, 2);

// Saptavargaja Bala: hand-worked example, Sun at Leo 25 deg (own-sign portion
// of Leo, outside the 0-20 deg Moolatrikona band) with every other planet
// placed conjunct in Leo too (so every pairwise temporary relationship is
// "same sign" = enemy per v.56, isolating the natural-relationship half of
// each dignity call). Hand-derived per-varga dignities: D1=own(30, via the
// Moolatrikona-sign-but-outside-band fallback), D2=Hora lord Moon-> neutral
// (10), D3=Aries/Mars-> neutral(10), D7=Capricorn/Saturn-> greatEnemy(2),
// D9=Scorpio/Mars-> neutral(10), D12=Gemini/Mercury-> enemy(4),
// D30=Libra/Venus-> greatEnemy(2). Sum = 30+10+10+2+10+4+2 = 68.
const allInLeo = {
  Sun: 4, Moon: 4, Mars: 4, Mercury: 4, Jupiter: 4, Venus: 4, Saturn: 4,
};
assert.equal(saptavargajaBala('Sun', 4, 25, allInLeo), 68);

// Drik Bala: hand-worked example isolating every branch of v.19's rule --
// Moon waning (malefic here), Mars malefic, Mercury's aspect happens to land
// in the dead zone (0, so it doesn't matter that it's a "full add" planet),
// Jupiter full-add, Venus benefic (quarter), Saturn malefic with its own
// special-aspect bonus also active. Hand-derived per-aspector contributions
// on the Sun: Moon -10, Mars -5, Mercury 0, Jupiter +45, Venus +5, Saturn -20
// -> net 15.
const drikChart = {
  Sun: 0, Moon: 190, Mars: 100, Mercury: 50, Jupiter: 150, Venus: 200, Saturn: 280,
};
close(drikBala('Sun', drikChart, false), 15, 1e-9, 'hand-worked Drik Bala on the Sun');

// Ayana Bala: hand-verified against the chapter's own printed "Speculum of
// Ayana Bala" table (visually re-rendered from the PDF), with the
// mis-transcribed "+23d27'" header removed from the formula. Using Mars
// (Northern Kranti = plus, not doubled) isolates the raw table match.
close(ayanaBala('Mars', 47 / 60), 1.0, 0.01, 'Speculum 0d47\' -> 1.00 (Mars, Northern = plus)');
close(ayanaBala('Mars', 1 + 34 / 60), 2.0, 0.01, 'Speculum 1d34\' -> 2.00');
close(ayanaBala('Mars', 5 + 10 / 60), 6.6, 0.01, 'Speculum 5d10\' -> 6.6');
close(ayanaBala('Mars', 7.5), 9.6, 0.01, 'Speculum 7d30\' -> 9.6');
// The Sun's result is doubled (v.15-17 Notes' own explicit rule).
close(ayanaBala('Sun', 47 / 60), 2.0, 0.01, "Sun's Ayana Bala is doubled");
// Moon/Saturn: Southern Kranti (negative number here) counts as plus; Northern (positive) counts as minus.
close(ayanaBala('Moon', -(47 / 60)), 1.0, 0.01, 'Moon Southern Kranti -> plus');
close(ayanaBala('Moon', 47 / 60), -1.0, 0.01, 'Moon Northern Kranti -> minus');
// Mercury is always plus regardless of hemisphere.
close(ayanaBala('Mercury', -(47 / 60)), 1.0, 0.01, 'Mercury Southern Kranti -> still plus');
close(ayanaBala('Mercury', 47 / 60), 1.0, 0.01, 'Mercury Northern Kranti -> still plus');

// Varsha-Masa-Dina-Hora Bala: reproduce BPHS's own fully worked example
// (v.13 Notes, June 1 1984) exactly -- Ahargana 65295 -> Varsha lord
// Jupiter (Thursday), Masa lord Venus (Friday), Dina lord Venus (Friday).
assert.equal(varshaLord(65295), 'Jupiter', "BPHS's own worked Varsha lord");
assert.equal(masaLord(65295), 'Venus', "BPHS's own worked Masa lord");
assert.equal(dinaLord(65295), 'Venus', "BPHS's own worked Dina lord (Friday)");
// The epoch constant reproduces the book's own two independently-read table
// rows exactly: Jan 0 1984 -> 65142, Jan 0 1860 -> 19852.
const jan0 = (year) => julianDay(year, 1, 1, 0) - 1;
close(jan0(1984) - ABBREVIATED_AHARGANA_EPOCH_JD, 65142, 1e-6, 'Abbreviated Ahargana, Jan 0 1984');
close(jan0(1860) - ABBREVIATED_AHARGANA_EPOCH_JD, 19852, 1e-6, 'Abbreviated Ahargana, Jan 0 1860 (independent cross-check)');
// Hora lord: the standard Chaldean sequence for Sunday is Sun, Venus,
// Mercury, Moon, Saturn, Jupiter, Mars (repeating) -- a universally-known,
// independently-checkable sequence, not just this book's own claim.
assert.equal(horaLord('Sun', 1), 'Sun', "1st Hora is always the day lord's own");
assert.equal(horaLord('Sun', 2), 'Venus', '2nd Hora of Sunday (Chaldean order)');
assert.equal(horaLord('Sun', 3), 'Mercury', '3rd Hora of Sunday (Chaldean order)');
assert.equal(horaLord('Sun', 4), 'Moon', '4th Hora of Sunday (Chaldean order)');
assert.equal(horaLord('Sun', 7), 'Mars', '7th Hora of Sunday (Chaldean order)');
assert.equal(horaLord('Sun', 8), 'Sun', 'Hora sequence repeats every 7');
// computeVarshaMasaDinaHoraLords end-to-end: Jan 1, 2000 is a real, widely-known Saturday.
const y2kLords = computeVarshaMasaDinaHoraLords(
  julianDay(2000, 1, 1, -5.5 + 12), 13.0827, 80.2707, julianDay(2000, 1, 1, -5.5),
);
assert.equal(y2kLords.dina, 'Saturn', 'Jan 1 2000 was a real-world Saturday');

// Full calculateShadbala: structural checks on a real chart.
const chartInput = {
  longitudes: {
    Sun: 342.25, Moon: 100, Mars: 50, Mercury: 200, Jupiter: 30, Venus: 280, Saturn: 150,
  },
  lagnaRasiIndex: 0,
  ascendant: 10,
  mc: 100,
  birthJd: 2451544.5833333335, // 2000-01-01 07:30 IST -- consistent with year/month/day/utcOffsetMinutes below
  latitude: 13.0827,
  longitude: 80.2707,
  year: 2000,
  month: 1,
  day: 1,
  utcOffsetMinutes: 330,
};
const shadbala = calculateShadbala(chartInput);
close(shadbala.perPlanet.Sun.sthana.uchchaBala, 50.75, 1e-6, 'integration: Sun Uchcha Bala');
close(
  shadbala.perPlanet.Sun.sthanaBala,
  shadbala.perPlanet.Sun.sthana.uchchaBala
    + shadbala.perPlanet.Sun.sthana.ojhayugmarasyamsaBala
    + shadbala.perPlanet.Sun.sthana.kendradiBala
    + shadbala.perPlanet.Sun.sthana.drekkanaBala
    + shadbala.perPlanet.Sun.sthana.saptavargajaBala,
  1e-9,
  'sthanaBala sums all five now-resolved components',
);
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.sthana.saptavargajaBala)); // now computed, not refused
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.kaala.ayanaBala)); // now computed, not refused
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.kaala.nathonnataBala)); // now computed, not refused
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.kaala.varshaMasaDinaHoraBala)); // now computed, not refused
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.drikBala)); // now computed, not refused
assert.ok(Number.isFinite(shadbala.perPlanet.Sun.yuddhaBala)); // now computed, not refused
// Sun never participates in Graha Yuddha (v.9 excludes luminaries) -- must be exactly 0, not merely finite.
assert.equal(shadbala.perPlanet.Sun.yuddhaBala, 0, "Sun's Yuddha Bala is exactly 0 (luminaries excluded)");
assert.equal(shadbala.perPlanet.Moon.yuddhaBala, 0, "Moon's Yuddha Bala is exactly 0 (luminaries excluded)");
// Yuddha Bala deltas must always net to zero across all 7 planets: every war
// transfers points from loser to winner, nothing is created or destroyed.
const totalYuddha = Object.values(shadbala.perPlanet).reduce((sum, p) => sum + p.yuddhaBala, 0);
close(totalYuddha, 0, 1e-9, 'Yuddha Bala deltas net to zero across all planets');
assert.equal(shadbala.perPlanet.Sun.shadbalaTotal.status, 'SOURCE_REQUIRED');
assert.equal(shadbala.perPlanet.Sun.cheshtaBala, shadbala.perPlanet.Sun.kaala.ayanaBala); // Sun's Cheshta = Ayana Bala (v.15-17)
assert.equal(shadbala.perPlanet.Moon.cheshtaBala, shadbala.perPlanet.Moon.kaala.pakshaBala); // Moon's = Paksha Bala (v.18)
// Cheshta Bala for the 5 planets (Mars, Mercury, Jupiter, Venus, Saturn) is now computable via v.24-25
assert.ok(Number.isFinite(shadbala.perPlanet.Mars.cheshtaBala), 'Mars Cheshta Bala is finite');
assert.ok(Number.isFinite(shadbala.perPlanet.Mercury.cheshtaBala), 'Mercury Cheshta Bala is finite');
assert.ok(Number.isFinite(shadbala.perPlanet.Jupiter.cheshtaBala), 'Jupiter Cheshta Bala is finite');
assert.ok(Number.isFinite(shadbala.perPlanet.Venus.cheshtaBala), 'Venus Cheshta Bala is finite');
assert.ok(Number.isFinite(shadbala.perPlanet.Saturn.cheshtaBala), 'Saturn Cheshta Bala is finite');
close(
  shadbala.perPlanet.Sun.kaalaBala,
  shadbala.perPlanet.Sun.kaala.pakshaBala + shadbala.perPlanet.Sun.kaala.tribhagaBala
    + shadbala.perPlanet.Sun.kaala.nathonnataBala + shadbala.perPlanet.Sun.kaala.varshaMasaDinaHoraBala
    + shadbala.perPlanet.Sun.kaala.ayanaBala,
  1e-9,
  'kaalaBala sums all five now-resolved Kaala sub-components',
);
// Exactly one planet gets Varsha lord, one gets Masa lord (possibly same planet as Dina/Hora); the total
// Virupas awarded across all 7 planets must equal the fixed scale's sum (15+30+45+60=150), never more or less.
const totalVMDH = Object.values(shadbala.perPlanet).reduce((sum, p) => sum + p.kaala.varshaMasaDinaHoraBala, 0);
assert.equal(totalVMDH, 150, 'Varsha+Masa+Dina+Hora Virupas are each awarded to exactly one planet');
assert.equal(shadbala.source.tradition, 'Parashari');
assert.equal(Object.keys(shadbala.perPlanet).length, 7);

console.log(JSON.stringify({ pass: true, sunShadbala: shadbala.perPlanet.Sun, moonCheshta: shadbala.perPlanet.Moon.cheshtaBala }, null, 2));
