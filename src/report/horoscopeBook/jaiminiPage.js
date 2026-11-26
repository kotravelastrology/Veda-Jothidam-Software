/**
 * Horoscope book, page 47 (PL9 sample aniruddha_HC4, "Jaimini System"): the Chara Karakas (Atmakaraka to Darakaraka, by degree in the sign),
 * the Navamsha chart, the Karakamsha marked on the birth chart, the Swamsha (the Karakamsha's sign in the Navamsha chart), the Upapada Lagna, the
 * Arudha padas, and the special lagnas and points. From jaimini.js (Jaimini Upadesa Sutras, Rath; the Chara Karaka of the planet of the highest
 * degree in its sign, Rahu left out) and the book's own chart helpers. Each builder returns a Promise of { title, subtitle, blocks }.
 */
const { withBirth, gridCells, vargaPlacements, bodiesOf } = require('./charts');
const { calculateJaimini } = require('../jaimini');
const { sunriseBefore } = require('../../chart/sunriseBefore');
const N = require('../../sources/tamilNames');

const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ROLE_AB = { Atmakaraka: 'AK', Amatyakaraka: 'AmK', Bhratrikaraka: 'BK', Matrikaraka: 'MK', Putrakaraka: 'PK', Gnatikaraka: 'GK', Darakaraka: 'DK' };
const ABBR = { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' };
const ALL = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const pad = (n) => String(n).padStart(2, '0');
const dm = (deg) => `${pad(Math.floor(deg))}:${pad(Math.floor((deg % 1) * 60))}`;

async function buildJaiminiSystem({ name = '', birth }) {
  return withBirth(birth, ({ chart, gulika, bodies }) => {
    const sr = sunriseBefore(chart.julianDay, birth.latitude, birth.longitude, chart.ayanamsha, 'geometric');
    const j = calculateJaimini({
      lagnaLongitude: chart.lagna.longitude,
      grahaLongitudes: Object.fromEntries(ALL.map((p) => [p, chart.grahas[p].longitude])),
      birthMs: (chart.julianDay - 2440587.5) * 86400000,
      sunLongitudeAtSunrise: sr.sunLongitudeAtSunrise, hoursSinceSunrise: sr.hoursSinceSunrise,
    });
    const birthCells = gridCells(bodies.map((b) => ({ sign: Math.floor(b.lon / 30), label: b.abbr })));
    const navamsha = gridCells(vargaPlacements(bodies, 'D9'));
    const karakamsha = birthCells.map((c) => [...c]);
    karakamsha[j.karkamsha.rasiIndex].push('KL');
    const upapadaSign = j.bhavaArudhas.find((a) => a.house === 12).rasiIndex;
    const upapada = birthCells.map((c) => [...c]);
    upapada[upapadaSign].push('UL');
    const swamsha = navamsha.map((c) => [...c]);
    swamsha[j.karkamsha.rasiIndex].push('SL');
    const arudhaLagna = j.bhavaArudhas.find((a) => a.house === 1);
    return {
      title: `ஜாதகம் — ${name}`.trim(),
      subtitle: `${birth.placeName} · ${birth.day} ${MONTH_EN[birth.month - 1]} ${birth.year}`,
      blocks: [
        {
          kind: 'table', heading: 'Chara Karakas', columns: ['Karaka', 'Planet', 'Degree in sign'],
          rows: j.charaKarakas.map((k) => [`${ROLE_AB[k.role]} (${k.role})`, `${N.PLANET_TA[k.planet]} (${ABBR[k.planet]})`, dm(k.degreeInSign)]),
        },
        { kind: 'signGrid', heading: 'Navamsha', cells: navamsha },
        { kind: 'signGrid', heading: 'Karakamsha (in Birth Chart) — KL', cells: karakamsha },
        { kind: 'signGrid', heading: 'Swamsha (in Navamsha) — SL', cells: swamsha },
        { kind: 'signGrid', heading: 'Upapada Lagna (in Birth Chart) — UL', cells: upapada },
        {
          kind: 'table', heading: 'Arudha padas (counted from the Lagna)', columns: ['Pada', 'Sign'],
          rows: j.bhavaArudhas.map((a) => [a.label, N.RASI_TA[a.rasiIndex]]),
        },
        {
          kind: 'table', heading: 'Special Points', columns: ['Point', 'Sign'],
          rows: [
            ['Karakamsha (Atmakaraka in Navamsha)', N.RASI_TA[j.karkamsha.rasiIndex]],
            ['Arudha Lagna', N.RASI_TA[arudhaLagna.rasiIndex]],
            ['Upapada Lagna (A12)', N.RASI_TA[upapadaSign]],
            ...(j.specialLagnas ?? []).map((l) => [l.name, N.RASI_TA[l.rasiIndex]]),
            ['Ishta Devata', `${j.karkamsha.ishtaDevata.devata} (${N.RASI_TA[j.karkamsha.ishtaDevata.rasiIndex]}, ${N.PLANET_TA[j.karkamsha.ishtaDevata.planet] ?? j.karkamsha.ishtaDevata.planet})`],
          ],
        },
        { kind: 'text', heading: 'Jaimini Aspects', text: 'Aspects between planets in dual signs: Su-Mo-Me-Ve-Sa. Aspects between planets in movable and fixed signs: Ju-Ma, Ra-Ma, Ke-Ma.' },
      ],
    };
  });
}

module.exports = { buildJaiminiSystem };
