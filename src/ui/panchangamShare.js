/**
 * The text of a day's panchangam for a message (WhatsApp, a note): the day, the place and sunrise, the five limbs with the time each
 * ends, and the three inauspicious periods, as the home page's card shows them (app/todayActions.ts). Plain text, no links.
 */
const MONTHS_TA = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];

/** '2026-11-20' -> '20 நவம்பர் 2026' */
function dateTa(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return `${d} ${MONTHS_TA[m - 1]} ${y}`;
}

/**
 * @param today the object computeToday() returns: { date, placeName, weekdayTa, sunrise, tithi: { paksha, name, until }, nakshatra, yoga, karana: { name, until }, rahuKalam, yamagandam, gulikaKalam }
 * @returns {{ title: string, text: string }} for composeShareText() (src/ui/share.ts), which adds the program's name at the foot
 */
function panchangamShareText(today) {
  const until = (x) => (x.until ? ` (${x.until} வரை)` : '');
  const lines = [
    `📍 ${today.placeName} · 🌅 உதயம் ${today.sunrise}`,
    `திதி: ${today.tithi.paksha} ${today.tithi.name}${until(today.tithi)}`,
    `நட்சத்திரம்: ${today.nakshatra.name}${until(today.nakshatra)}`,
    `யோகம்: ${today.yoga.name}${until(today.yoga)}`,
    `கரணம்: ${today.karana.name}${until(today.karana)}`,
    `ராகு காலம்: ${today.rahuKalam}`,
    `எமகண்டம்: ${today.yamagandam}`,
    `குளிகை: ${today.gulikaKalam}`,
    '',
    'திருக்கணிதம் · Karanam Ramakumar, Panchangam Calculations',
  ];
  return { title: `🗓️ இன்றைய பஞ்சாங்கம் — ${today.weekdayTa}, ${dateTa(today.date)}`, text: lines.join('\n') };
}

module.exports = { panchangamShareText, dateTa, MONTHS_TA };
