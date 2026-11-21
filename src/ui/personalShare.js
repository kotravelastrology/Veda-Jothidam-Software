/**
 * The text of "Today for you" (src/report/personalToday.js) for a message: the running periods, the Moon of the day against the birth star,
 * and Saturn's and Jupiter's houses from the birth Moon, in the words the card shows. The person's name is in the title so that they can
 * take it out before sending; no birth detail is in the text.
 */
const { dateTa } = require('./panchangamShare');

const ordinal = (n) => `${n}-ஆம்`;

/**
 * @param name the person's name (or any label), shown in the title
 * @param pt what personalToday() returns
 * @param dateIso 'YYYY-MM-DD', the day of `pt` where the person is (the device's date)
 * @returns {{ title: string, text: string }} for composeShareText() (src/ui/share.ts)
 */
function personalShareText(name, pt, dateIso) {
  const dasha = pt.dasha.map((d) => `${d.levelTa}: ${d.lordTa}`).join(' · ');
  const endOfFirst = pt.dasha[0] ? `${pt.dasha[0].levelTa} முடிவு: ${pt.dasha[0].end.split('-').reverse().join('-')}` : '';
  const moon = `${pt.moon.starTa} (${pt.janma.starTa}-இலிருந்து ${pt.moon.count}-ஆவது நட்சத்திரம், ${ordinal(pt.moon.tara)} தாரை ${pt.moon.taraTa}), ராசிக்கு ${ordinal(pt.moon.houseFromMoon)} வீடு`;
  const saturn = `${pt.saturn.rasiTa} — ராசிக்கு ${ordinal(pt.saturn.houseFromMoon)} வீடு${pt.saturn.sadeSati ? ` · சாடே சாதி: ${pt.saturn.sadeSati.nameTa}` : ''}`;
  const jupiter = `${pt.jupiter.rasiTa} — ராசிக்கு ${ordinal(pt.jupiter.houseFromMoon)} வீடு`;
  const lines = [`ஜன்ம ராசி ${pt.janma.rasiTa}, ஜன்ம நட்சத்திரம் ${pt.janma.starTa}`, dasha, endOfFirst, `சந்திரன் இன்று: ${moon}`, `சனி: ${saturn}`, `குரு: ${jupiter}`, '', 'நூல்கள் கூறும் நிலைகள் மட்டும்; தீர்ப்பு அல்ல.'];
  // empty lines are dropped, except the one blank line before the foot note (the last but one)
  const text = lines.filter((l, i) => l !== '' || i === lines.length - 2).join('\n');
  return { title: `✨ ${name} — இன்றைய நிலை (${dateTa(dateIso)})`, text };
}

module.exports = { personalShareText };
