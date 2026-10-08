'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateChart } = require('../../src/ephemeris/swissEphemeris');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sunriseJulianDay, sunsetJulianDay } = require('../../src/ephemeris/siderealPositions');

const NAK_TA = [
  'அசுவினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];
const RASI_TA = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
  'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்',
];
const GRAHA_TA: Record<string, string> = {
  Sun: 'சூரியன்', Moon: 'சந்திரன்', Mars: 'செவ்வாய்', Mercury: 'புதன்',
  Jupiter: 'குரு', Venus: 'சுக்கிரன்', Saturn: 'சனி',
};

const norm = (d: number) => ((d % 360) + 360) % 360;

/** Degrees as 12°34'56" — the form a birth record is read in. */
function dms(value: number) {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = Math.round((((abs - d) * 60) - m) * 60);
  return `${sign}${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

export interface SkyQuery {
  year: number; month: number; day: number; hour: number; minute: number;
  latitude: number; longitude: number; utcOffsetMinutes: number;
  placeName?: string;
  ayanamsha?: string; houseSystem?: string;
}

/**
 * The astronomy behind a chart.
 *
 * Everything here comes from `calculateChart`, which already computes
 * celestial latitude, distance and longitude speed for all seven classical
 * grahas — and then `calculateParashariChart` keeps only the longitude and
 * throws the rest away. Nothing in the product displayed any of it until now;
 * this is presentation over data the engine was already producing.
 *
 * Retrogression is read from the sign of `longitudeSpeed`, which is the
 * quantity that defines it: a graha moving backwards through the zodiac has a
 * negative rate of change in longitude. It is derived here rather than
 * asserted, so there is nothing to source beyond the ephemeris itself.
 *
 * Rahu and Ketu are absent on purpose: `positions` covers the seven visible
 * bodies, and the nodes are computed separately as a geometric point with no
 * distance or celestial latitude of their own.
 */
export async function computeSky(q: SkyQuery) {
  const settings = {
    ayanamsha: q.ayanamsha ?? 'Lahiri',
    houseSystem: q.houseSystem ?? 'Porphyrius',
    nodeType: 'mean',
  };

  const chart = calculateChart({
    year: q.year, month: q.month, day: q.day,
    hour: q.hour + (q.minute ?? 0) / 60,
    latitude: q.latitude, longitude: q.longitude,
    utcOffsetMinutes: q.utcOffsetMinutes,
    ...settings,
  });

  const jdMidnight = chart.julianDay - (q.hour + (q.minute ?? 0) / 60 - q.utcOffsetMinutes / 60) / 24;
  let sunrise = null;
  let sunset = null;
  try {
    const sr = sunriseJulianDay(jdMidnight, q.latitude, q.longitude);
    const ss = sunsetJulianDay(sr, q.latitude, q.longitude);
    const local = (jd: number) => {
      const ms = (jd - 2440587.5) * 86400000 + q.utcOffsetMinutes * 60000;
      return new Date(ms).toISOString().slice(11, 16);
    };
    sunrise = local(sr);
    sunset = local(ss);
  } catch { /* a polar latitude may have neither; the page says so */ }

  const bodies = Object.entries(chart.positions).map(([id, p]: [string, any]) => {
    const lon = norm(p.longitude);
    const nakIndex = Math.floor(lon / (360 / 27)) % 27;
    const intoNak = lon - nakIndex * (360 / 27);
    const pada = Math.floor(intoNak / (360 / 108)) + 1;
    const rasiIndex = Math.floor(lon / 30);
    return {
      id,
      nameTa: GRAHA_TA[id] ?? id,
      longitude: lon,
      longitudeDms: dms(lon),
      rasi: RASI_TA[rasiIndex],
      degreeInSign: dms(lon - rasiIndex * 30),
      nakshatra: NAK_TA[nakIndex],
      pada,
      celestialLatitude: p.latitude,
      celestialLatitudeDms: dms(p.latitude),
      distanceAu: p.distance,
      speedPerDay: p.longitudeSpeed,
      // The definition, not a lookup: a body moving backwards through the
      // zodiac has a negative rate of change in longitude.
      retrograde: p.longitudeSpeed < 0,
      latitudeSpeed: p.latitudeSpeed,
    };
  });

  return JSON.parse(JSON.stringify({
    engine: chart.engine,
    engineVersion: chart.engineVersion,
    julianDay: chart.julianDay,
    settings: { ...settings, ayanamsha: chart.ayanamsa ?? settings.ayanamsha },
    place: {
      name: q.placeName ?? null,
      latitude: `${Math.abs(q.latitude).toFixed(4)}°${q.latitude < 0 ? 'S' : 'N'}`,
      longitude: `${Math.abs(q.longitude).toFixed(4)}°${q.longitude < 0 ? 'W' : 'E'}`,
      utcOffsetMinutes: q.utcOffsetMinutes,
    },
    moment: {
      date: `${q.year}-${String(q.month).padStart(2, '0')}-${String(q.day).padStart(2, '0')}`,
      time: `${String(q.hour).padStart(2, '0')}:${String(q.minute ?? 0).padStart(2, '0')}`,
      sunrise, sunset,
    },
    angles: {
      ascendant: dms(norm(chart.houses.ascendant)),
      mc: dms(norm(chart.houses.mc)),
      armc: dms(norm(chart.houses.armc)),
      vertex: dms(norm(chart.houses.vertex)),
      // `chart.houses.houseSystem` is Swiss Ephemeris's single-letter code
      // ('O' for Porphyrius), which is right for the library and useless on
      // screen. The requested name is what the practitioner chose.
      houseSystem: settings.houseSystem,
      houseSystemCode: chart.houses.houseSystem,
      ayanamsaApplied: chart.houses.ayanamsaApplied,
    },
    // Swiss Ephemeris returns cusps 1-indexed with an unused slot 0, so a
    // naive map would report thirteen houses.
    cusps: (chart.houses.cusps ?? [])
      .slice(chart.houses.cusps?.length === 13 ? 1 : 0)
      .map((c: number, i: number) => ({
        house: i + 1, longitude: dms(norm(c)), rasi: RASI_TA[Math.floor(norm(c) / 30)],
      })),
    bodies,
    /** Stated rather than silently omitted. */
    notComputed: [
      'ராகு / கேது — இவை கணிதப் புள்ளிகள்; தூரமோ வான் அட்சரேகையோ இல்லை',
      'நிலவின் கலை (phase), கிரகண விவரங்கள்',
      'வான் நேர்க்கோட்டு (declination) — shadbala உள்ளே கணிக்கப்படுகிறது, தனியாக வெளியிடப்படவில்லை',
    ],
  }));
}
