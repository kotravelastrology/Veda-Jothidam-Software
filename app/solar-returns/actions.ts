'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { calculateParashariChart } = require('../../src/chart/parashariChart');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  RETURN_KINDS, returnSeries, castAtBothPlaces, SIDEREAL_YEAR_DAYS,
} = require('../../src/report/solarReturns');

const DAY_MS = 86400000;

export interface ReturnQuery {
  birth: {
    year: number; month: number; day: number; hour: number; minute: number;
    latitude: number; longitude: number; utcOffsetMinutes: number; placeName?: string;
  };
  /** Where the native lives now, if it differs from the birthplace. */
  local?: {
    name?: string; latitude: number; longitude: number; utcOffsetMinutes: number;
  } | null;
  yearsElapsed: number;
  kind: 'annual' | 'monthly' | 'daily';
  count?: number;
  ayanamsha?: string;
}

/**
 * The solar-return series for a native, cast at the birthplace and, when one
 * is given, at where they live now.
 *
 * PL9 prints these as eighteen separate worksheets — Annual, Monthly and Daily
 * Solar, each in three layouts, each at both places. They are one calculation
 * with three step sizes and two sets of coordinates, so they are one page.
 */
export async function computeReturns(q: ReturnQuery) {
  const ayanamsha = q.ayanamsha ?? 'Lahiri';
  const kind = RETURN_KINDS[q.kind];
  if (!kind) throw new Error(`unknown return kind ${q.kind}`);

  const natalPlace = {
    name: q.birth.placeName ?? 'பிறந்த இடம்',
    latitude: q.birth.latitude,
    longitude: q.birth.longitude,
    utcOffsetMinutes: q.birth.utcOffsetMinutes,
  };

  const natal = calculateParashariChart({
    input: q.birth, ayanamsha, houseSystem: 'Placidus',
  });
  const natalSunLongitude = natal.grahas.Sun.longitude;

  const birthUtcMs = Date.UTC(
    q.birth.year, q.birth.month - 1, q.birth.day, q.birth.hour, q.birth.minute || 0,
  ) - (q.birth.utcOffsetMinutes || 0) * 60000;

  // The annual return this series hangs off. Monthly and daily steps are
  // measured from the year's own beginning, not from the birthday.
  const annual = returnSeries({
    natalSunLongitude,
    fromUtcMs: birthUtcMs + Math.max(0, q.yearsElapsed) * SIDEREAL_YEAR_DAYS * DAY_MS,
    kindId: 'annual', count: 1, ayanamsha,
  });
  const yearStartMs = annual.instants[0].utcMs;

  const series = q.kind === 'annual'
    ? annual
    : returnSeries({
      natalSunLongitude, fromUtcMs: yearStartMs, kindId: q.kind,
      count: Math.min(q.count ?? 12, 40), ayanamsha,
    });

  const charts = series.instants.map((i: any) => {
    const both = castAtBothPlaces({
      utcMs: i.utcMs, natalPlace, localPlace: q.local ?? null, ayanamsha, houseSystem: 'Placidus',
    });
    return {
      step: i.step,
      targetLongitude: i.targetLongitude,
      utcIso: i.utcIso,
      natal: {
        date: both.natal.localDate, time: both.natal.localTime,
        lagna: both.natal.lagna.rasi,
        lagnaDegree: both.natal.lagna.degreeInSign,
        place: both.natal.place.name,
      },
      local: both.local ? {
        date: both.local.localDate, time: both.local.localTime,
        lagna: both.local.lagna.rasi,
        lagnaDegree: both.local.lagna.degreeInSign,
        place: both.local.place.name,
      } : null,
      // Which grahas sit in a different house when the same moment is read
      // from the other place. This is the only thing that differs, and it is
      // the reason the pair is printed at all.
      housesMoved: both.local
        ? Object.keys(both.natal.grahas).filter(
          (id) => both.natal.grahas[id].house !== both.local!.grahas[id].house,
        )
        : [],
    };
  });

  // Consecutive gaps, so an uneven month or a 1.02-day "day" is visible rather
  // than surprising.
  const gapsDays = charts.slice(1).map((c: any, n: number) =>
    (Date.parse(c.utcIso) - Date.parse(charts[n].utcIso)) / DAY_MS);

  return JSON.parse(JSON.stringify({
    kind: q.kind,
    kindName: kind.name,
    kindNameTa: kind.nameTa,
    stepDegrees: kind.stepDegrees,
    convention: kind.convention,
    sourceStatus: kind.sourceStatus,
    natalSunLongitude,
    yearStart: new Date(yearStartMs).toISOString(),
    hasLocalPlace: Boolean(q.local),
    charts,
    gapsDays,
  }));
}
