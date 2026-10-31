/**
 * The Tamil names of the signs, the nakshatras and the weekdays, in one place: every page and report reads them from here, so a
 * name is spelt the same way everywhere. Index 0 is Aries, Ashwini and Sunday. The spellings are those of the common Tamil
 * panchangam (அசுவினி, கார்த்திகை, அஸ்தம், அனுஷம்). Tables transcribed from a book keep the book's own spelling and do not use these.
 */

const RASI_TA = Object.freeze(['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்']);

/** Short forms for chart boxes and narrow tables. */
const RASI_TA_SHORT = Object.freeze(['மேஷ', 'ரிஷப', 'மிது', 'கட', 'சிம்', 'கன்னி', 'துலா', 'விரு', 'தனு', 'மக', 'கும்ப', 'மீன']);

const NAKSHATRA_TA = Object.freeze([
  'அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்',
  'மகம்', 'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
]);

const WEEKDAY_TA = Object.freeze(['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி']);

/** The fifteen tithis of a paksha; the 15th is பௌர்ணமி in the bright half and அமாவாசை in the dark half (see tithiTa). */
const TITHI_TA = Object.freeze([
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி',
  'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி', 'பௌர்ணமி',
]);

const YOGA_TA = Object.freeze([
  'விஷ்கம்பம்', 'பிரீதி', 'ஆயுஷ்மான்', 'சௌபாக்கியம்', 'சோபனம்', 'அதிகண்டம்', 'சுகர்மம்', 'திருதி', 'சூலம்', 'கண்டம்',
  'விருத்தி', 'துருவம்', 'வியாகாதம்', 'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி', 'வியதீபாதம்', 'வரீயான்', 'பரிகம்', 'சிவம்',
  'சித்தம்', 'சாத்தியம்', 'சுபம்', 'சுக்லம்', 'பிரம்மம்', 'ஐந்திரம்', 'வைதிருதி',
]);

/** By the engine's (English) karana name. */
const KARANA_TA = Object.freeze({
  Bava: 'பவம்', Balava: 'பாலவம்', Kaulava: 'கௌலவம்', Taitila: 'தைதுலம்', Garaja: 'கரசை', Vanija: 'வணிசை', Vishti: 'விஷ்டி (பத்திரை)',
  Kimstughna: 'கிம்ஸ்துக்னம்', Shakuni: 'சகுனி', Chatushpada: 'சதுஷ்பாதம்', Naga: 'நாகவம்',
});

/**
 * A tithi by its index in the month (0-29, 0 = Shukla Prathama) as the panchangam writes it: the paksha and the name.
 * @param {number} index
 */
function tithiTa(index) {
  const i = ((index % 30) + 30) % 30;
  if (i === 29) return { paksha: 'தேய்பிறை', name: 'அமாவாசை' };
  return { paksha: i < 15 ? 'வளர்பிறை' : 'தேய்பிறை', name: TITHI_TA[i % 15] };
}

module.exports = { RASI_TA, RASI_TA_SHORT, NAKSHATRA_TA, WEEKDAY_TA, TITHI_TA, YOGA_TA, KARANA_TA, tithiTa };
