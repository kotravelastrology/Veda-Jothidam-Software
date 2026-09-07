const assert = require('node:assert/strict');
const {
  calculateVargas, calculateHora, calculateTrimsamsa, calculateShashtiamsa,
} = require('./src/chart/vargaChart');

// Rasi indices: Aries=0, Taurus=1, Gemini=2, Cancer=3, Leo=4, Virgo=5, Libra=6,
// Scorpio=7, Sagittarius=8, Capricorn=9, Aquarius=10, Pisces=11.

function vargaSign(rasiIndex, degreeInSign, key) {
  const vargas = calculateVargas(rasiIndex, degreeInSign);
  return vargas[key].sign;
}

// D1 Rashi: always the sign itself, regardless of degree.
assert.equal(vargaSign(3, 17.5, 'D1'), 'Karkataka');

// D3 Drekkana (BPHS table): Aries's three decanates are Aries, Leo, Sagittarius (1st,5th,9th).
assert.equal(vargaSign(0, 2, 'D3'), 'Mesha');
assert.equal(vargaSign(0, 12, 'D3'), 'Simha');
assert.equal(vargaSign(0, 22, 'D3'), 'Dhanu');

// D4 Chathurthamsa (BPHS example): "The four Chathurthamsa of Aries are Aries, Cancer, Libra and Capricorn."
assert.equal(vargaSign(0, 1, 'D4'), 'Mesha');
assert.equal(vargaSign(0, 9, 'D4'), 'Karkataka');
assert.equal(vargaSign(0, 16, 'D4'), 'Tula');
assert.equal(vargaSign(0, 23, 'D4'), 'Makara');

// D7 Saptamsa (BPHS example): odd sign (Aries) starts from itself; even sign (Taurus) starts
// from the 7th thereof (Scorpio, Sagittarius, Capricorn ...).
assert.equal(vargaSign(0, 1, 'D7'), 'Mesha');
assert.equal(vargaSign(0, 5, 'D7'), 'Vrishabha');
assert.equal(vargaSign(1, 1, 'D7'), 'Vrischika');
assert.equal(vargaSign(1, 5, 'D7'), 'Dhanu');

// D9 Navamsa (BPHS example, v.12): Aries (movable) from itself; Taurus (fixed) from Capricorn;
// Gemini (dual) from Libra.
assert.equal(vargaSign(0, 1, 'D9'), 'Mesha');
assert.equal(vargaSign(1, 1, 'D9'), 'Makara');
assert.equal(vargaSign(2, 1, 'D9'), 'Tula');

// D10 Dashamsa: odd sign from itself, even sign from the 9th thereof.
assert.equal(vargaSign(0, 1, 'D10'), 'Mesha');
assert.equal(vargaSign(1, 1, 'D10'), 'Makara'); // Taurus(1) + 9th offset(8) = 9 = Capricorn

// D12 Dvadasamsa (BPHS example): Aries's 12 divisions in order are Aries..Pisces sequentially.
assert.equal(vargaSign(0, 1, 'D12'), 'Mesha');
assert.equal(vargaSign(0, 8, 'D12'), 'Karkataka'); // 4th division (7.5-10 deg range) -> Cancer

// D16 Shodasamsa (BPHS example): movable from Aries, fixed from Leo, dual from Sagittarius.
assert.equal(vargaSign(0, 1, 'D16'), 'Mesha'); // Aries movable -> starts Aries
assert.equal(vargaSign(1, 1, 'D16'), 'Simha'); // Taurus fixed -> starts Leo
assert.equal(vargaSign(2, 1, 'D16'), 'Dhanu'); // Gemini dual -> starts Sagittarius

// D20 Vimsamsa (BPHS example): movable from Aries, fixed from Sagittarius, dual from Leo.
assert.equal(vargaSign(0, 1, 'D20'), 'Mesha');
assert.equal(vargaSign(1, 1, 'D20'), 'Dhanu');
assert.equal(vargaSign(2, 1, 'D20'), 'Simha');

// D24 Chaturvimsamsa: odd sign from Leo, even sign from Cancer.
assert.equal(vargaSign(0, 1, 'D24'), 'Simha');
assert.equal(vargaSign(1, 1, 'D24'), 'Karkataka');

// D27 Saptavimsamsa: fire signs from Aries, earth from Cancer, air from Libra, water from Capricorn.
assert.equal(vargaSign(0, 1, 'D27'), 'Mesha'); // Aries (fire)
assert.equal(vargaSign(1, 1, 'D27'), 'Karkataka'); // Taurus (earth)
assert.equal(vargaSign(2, 1, 'D27'), 'Tula'); // Gemini (air)
assert.equal(vargaSign(3, 1, 'D27'), 'Makara'); // Cancer (water)

// D40 Khavedamsa: odd sign from Aries, even sign from Libra.
assert.equal(vargaSign(0, 0.1, 'D40'), 'Mesha');
assert.equal(vargaSign(1, 0.1, 'D40'), 'Tula');

// D45 Akshavedamsa: movable from Aries, fixed from Leo, dual from Sagittarius.
assert.equal(vargaSign(0, 0.1, 'D45'), 'Mesha');
assert.equal(vargaSign(1, 0.1, 'D45'), 'Simha');
assert.equal(vargaSign(2, 0.1, 'D45'), 'Dhanu');

// D2 Hora (BPHS v.5-6): odd sign 0-15 deg -> Sun, 15-30 -> Moon; even sign reversed.
assert.equal(calculateHora(0, 5), 'Sun'); // Aries (odd), first half
assert.equal(calculateHora(0, 20), 'Moon'); // Aries (odd), second half
assert.equal(calculateHora(1, 5), 'Moon'); // Taurus (even), first half
assert.equal(calculateHora(1, 20), 'Sun'); // Taurus (even), second half

// D30 Trimsamsa (BPHS table): Aries (odd) degree bands -> Aries/Aquarius/Sagittarius/Gemini/Libra.
assert.equal(calculateTrimsamsa(0, 2), 0); // 0-5 -> Aries
assert.equal(calculateTrimsamsa(0, 7), 10); // 5-10 -> Aquarius
assert.equal(calculateTrimsamsa(0, 15), 8); // 10-18 -> Sagittarius
assert.equal(calculateTrimsamsa(0, 22), 2); // 18-25 -> Gemini
assert.equal(calculateTrimsamsa(0, 28), 6); // 25-30 -> Libra
// Taurus (even) degree bands -> Taurus/Virgo/Pisces/Capricorn/Scorpio.
assert.equal(calculateTrimsamsa(1, 2), 1);
assert.equal(calculateTrimsamsa(1, 30 - 0.01), 7); // just under 30 -> Scorpio

// D60 Shashtiamsa (BPHS worked example, printed page 55): Venus at Capricorn 13d25' -> Pisces.
const capricorn = 9;
const degree = 13 + 25 / 60;
assert.equal(calculateShashtiamsa(capricorn, degree), 11); // Pisces

// attachSource provenance is present on the full result.
const full = calculateVargas(0, 10);
assert.equal(full.source.tradition, 'Parashari');
assert.equal(Object.keys(full).filter((k) => k.startsWith('D')).length, 16);

console.log(JSON.stringify({ pass: true, aries10deg: full }, null, 2));
