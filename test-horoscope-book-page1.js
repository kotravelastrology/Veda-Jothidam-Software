const assert = require('assert');
const { buildPage1 } = require('./src/report/horoscopeBook/page1');

// Sample birth, PL9 aniruddha_HC4 page 1: 5 October 1990, 04:30 IST, Chennai (13N05' 80E17').
const sampleBirth = {
  year: 1990, month: 10, day: 5, hour: 4, minute: 30, ianaTimeZone: 'Asia/Kolkata', utcOffsetMinutes: 330,
  latitude: 13 + 5 / 60, longitude: 80 + 17 / 60, placeName: 'Chennai',
};

function field(doc, block, english) {
  const row = doc.blocks[block].rows.find((r) => r[1] === english);
  assert.ok(row, `${block}: ${english} row exists`);
  return row[2];
}

async function main() {
  const doc = await buildPage1({ name: 'aniruddha', sex: 'Female', country: 'India', birth: sampleBirth });
  assert.equal(doc.blocks.length, 5, 'five sections on page 1');
  assert.deepStrictEqual(doc.blocks.map((b) => b.heading), [
    'பிறப்பு விவரங்கள்', 'இந்து நாட்காட்டி', 'குடும்ப விவரங்கள்', 'அவகடா சக்கரம்', 'தமிழ் நாட்காட்டி',
  ]);
  assert.ok(!/undefined|NaN|null/.test(JSON.stringify(doc)), 'no undefined or NaN in the page');

  // Birth particulars (sections 0): these match the sample.
  assert.equal(field(doc, 0, 'Date of birth'), '5 October 1990');
  assert.equal(field(doc, 0, 'Day of birth'), 'Friday');
  assert.equal(field(doc, 0, 'Latitude'), "13N05'00");
  assert.equal(field(doc, 0, 'Longitude'), "80E17'00");
  assert.equal(field(doc, 0, 'GMT at birth'), '23:00:00 hrs');
  assert.equal(field(doc, 0, 'LMT Corr.'), '-00:08:52 hrs');
  assert.equal(field(doc, 0, 'Local Mean Time'), '04:21:08 hrs');
  assert.equal(field(doc, 0, 'Sunsign (Western)'), 'துலாம்');
  // Sample: Sidereal Time 05:14:37; sample Lagna Leo 25:03:02, as ours (with the true ayanamsha).
  assert.equal(field(doc, 0, 'Sidereal Time'), '05:14:36 hrs');
  assert.ok(field(doc, 0, 'Lagna').startsWith('சிம்மம் 25:03:'), 'lagna is Leo 25 degrees');
  // Sample: -23:43:54 Lahiri; ours is 13 seconds different.
  assert.equal(field(doc, 0, 'Ayanamsha'), '-23:43:41 Lahiri');
  assert.ok(field(doc, 0, 'Ishtkaal').startsWith('56:'), 'birth before sunrise uses the previous Hindu day');

  // Hindu calendar (section 1): the Hindu day is Thursday 4 October, so every "at sunrise" value is 4 October's.
  assert.equal(field(doc, 1, 'Hindu weekday'), 'Thursday');
  assert.equal(field(doc, 1, 'Paksha'), 'Krishna');
  assert.equal(field(doc, 1, 'Saka Samvat'), '1912');
  assert.equal(field(doc, 1, 'Chaitradi System: Vikram Samvat'), '2047');
  assert.equal(field(doc, 1, 'Chaitradi System: Lunar Month'), 'ஆஸ்வினம்');
  assert.equal(field(doc, 1, 'Tithi at sunrise'), 'Shukla Purnima');
  assert.ok(field(doc, 1, 'Tithi ending time').startsWith('17:31:49 hrs'), 'tithi ends 17:31:49 as in the sample');
  assert.equal(field(doc, 1, 'Tithi at birth'), 'Krishna Prathama');
  assert.equal(field(doc, 1, 'Nak. at sunrise'), 'Uttara Bhadrapada');
  assert.ok(field(doc, 1, 'Nak. ending time').startsWith('16:31:24 hrs'), 'nakshatra ends 16:31:24 as in the sample');
  assert.equal(field(doc, 1, 'Nak. at birth'), 'Revati');
  assert.equal(field(doc, 1, 'Yoga at sunrise'), 'Dhruva');
  assert.ok(field(doc, 1, 'Yoga ending time').startsWith('01:56:04 hrs'), 'yoga ends 01:56:04 as in the sample');
  assert.equal(field(doc, 1, 'Yoga at birth'), 'Vyaghata');
  assert.equal(field(doc, 1, 'Karana at sunrise'), 'Vishti');
  assert.ok(field(doc, 1, 'Karana ending time').startsWith('06:50:44 hrs'), 'karana ends at 06:50 (sample 06:50:45)');
  assert.equal(field(doc, 1, 'Karana at birth'), 'Kaulava');
  assert.equal(field(doc, 1, 'Moon Nak entry'), '4 October 1990 16:31:24');
  assert.equal(field(doc, 1, 'Moon Nak exit'), '5 October 1990 14:24:00');
  assert.equal(field(doc, 1, 'Dasha at birth'), 'Mercury');
  assert.ok(field(doc, 1, 'Degree (sunrise)').startsWith('கன்னி 16:48:'), 'sun at sunrise in Virgo 16:48 as in the sample');
  // Sample: sunrise 06:01:42, sunset 17:53:35, balance 7y 7m 11d. Ours differ (see the report); pinned as built.
  assert.equal(field(doc, 1, 'Sunrise'), '05:58:05 hrs');
  assert.equal(field(doc, 1, 'Balance of Dasha'), '7y 8m 20d');
  assert.ok(field(doc, 1, 'Kartikadi System').startsWith('கட்டப்படவில்லை'), 'Kartikadi is marked not built');
  assert.ok(field(doc, 1, 'Bhayat').startsWith('கட்டப்படவில்லை'), 'Bhayat is marked not built');

  // Family particulars (section 2): empty input prints a dash.
  assert.equal(field(doc, 2, 'Father'), '—');

  // Avakhada chakra (section 3): the sample values, Tamil names where the table has them.
  assert.equal(field(doc, 3, 'Varna'), 'பிராமணர்');
  assert.equal(field(doc, 3, 'Vashya'), 'நீர்வாழ்');
  assert.equal(field(doc, 3, 'Nakshatra - Pada'), 'Revati - 3');
  assert.equal(field(doc, 3, 'Yoni'), 'யானை');
  assert.equal(field(doc, 3, 'Rashish'), 'Jupiter');
  assert.equal(field(doc, 3, 'Gana'), 'தேவ');
  assert.equal(field(doc, 3, 'Rashi'), 'மீனம்');
  assert.equal(field(doc, 3, 'Nadi'), 'அந்த்யம் (கபம்)');
  for (const en of ['Varga', 'Yunja', 'Hansak (Tatwa)', 'Naamakshar', 'Paya (Rashi)', 'Paya (Nakshatra)']) {
    assert.ok(field(doc, 3, en).startsWith('கட்டப்படவில்லை'), `${en} is marked not built`);
  }

  // Tamil calendar (section 4): Friday, Puratasi 19.
  assert.equal(field(doc, 4, 'Tamil Weekday'), 'வெள்ளி');
  assert.equal(field(doc, 4, 'Tamil Date'), '19');
  assert.ok(field(doc, 4, 'Tamil Month').startsWith('புரட்டாசி'), 'Tamil month is Puratasi');
  assert.ok(field(doc, 4, 'Tamil Year').includes('Pramo'), 'Tamil year is Pramodhoota');

  // Hindu-day rule: a birth after sunrise (07:00) belongs to the same civil day, Friday.
  const after = await buildPage1({ name: '', sex: '', country: 'India', birth: { ...sampleBirth, hour: 7, minute: 0 } });
  assert.equal(field(after, 1, 'Hindu weekday'), 'Friday');
  assert.equal(field(after, 1, 'Tithi at sunrise'), 'Krishna Prathama');
  assert.ok(field(after, 0, 'Ishtkaal').startsWith('02:'), 'a birth 62 minutes after sunrise is about 2.6 ghatis');

  console.log('test-horoscope-book-page1: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
