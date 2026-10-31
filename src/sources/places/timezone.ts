// Historical Time Zone & DST Engine (WBS-003) — Developed by Kottravel Astrology.
//
// Single source of truth for historical UTC offsets: given coordinates and a civil
// date/time, resolve the IANA zone and the exact historical offset (including DST
// and pre-standardization local mean times) using the platform's embedded IANA
// Time Zone Database via the Intl API (evidence source: tzdata, runtime-versioned;
// e.g. Node exposes process.versions.tz).
//
// Scope boundary (WBS-003): time resolution ONLY. No Julian Day, no ephemeris, no
// houses, no astrology. Consumers (WBS-001 onward) convert civil birth time to UTC
// through this engine and never hand-enter offsets again.

import { WORLD_PLACES, type Place } from "./location";

export interface ZoneResolution {
  zoneId: string;
  method: "curated" | "approximate"; // approximate = longitude estimate, flagged
}

export const MIN_UTC_OFFSET_MINUTES = -12 * 60;
export const MAX_UTC_OFFSET_MINUTES = 14 * 60;
export const MIN_GOVERNED_TZ_YEAR = 1850;
export const MAX_GOVERNED_TZ_YEAR = 2100;

export type AmbiguousTimeChoice = "earlier" | "later";
export type TimeResolutionMode = "resolved" | "selected" | "overridden";
export type TimeAdjustment = "standard" | "daylight" | "wartime" | "historical" | "override";

export interface TimeRuleProvenance {
  readonly provider: "IANA Time Zone Database" | "user override";
  readonly databaseVersion?: string;
  readonly zoneId: string;
  readonly ruleLabel: string;
  readonly adjustment: TimeAdjustment;
  readonly resolutionMode: TimeResolutionMode;
  readonly ambiguityChoice?: AmbiguousTimeChoice;
}

export interface TimeCandidate {
  readonly choice: AmbiguousTimeChoice;
  readonly utcMs: number;
  readonly offsetMinutes: number;
  readonly ruleLabel: string;
  readonly adjustment: Exclude<TimeAdjustment, "override">;
}

export type UtcConversion =
  | {
      readonly status: "ok";
      readonly utcMs: number;
      readonly offsetMinutes: number;
      readonly zoneId: string;
      readonly provenance: Readonly<TimeRuleProvenance>;
    }
  | {
      readonly status: "ambiguous";
      readonly zoneId: string;
      readonly candidates: readonly [TimeCandidate, TimeCandidate];
    }
  | {
      readonly status: "nonexistent";
      readonly zoneId: string;
      readonly offsetsAroundGap: readonly [number, number];
    }
  | {
      readonly status: "invalid";
      readonly zoneId: string;
      readonly errors: readonly string[];
    };

export interface CivilTimeResolutionOptions {
  readonly ambiguityChoice?: AmbiguousTimeChoice;
  readonly offsetOverrideMinutes?: number;
  /** Permit an explicit fixed offset outside the governed IANA year range. */
  readonly allowExtendedOffset?: boolean;
}

// --- Zone resolution (coordinates → IANA zone) -------------------------------------
// Curated mapping for the governed location database's countries/regions. This
// table maps political regions, not geometry; arbitrary coordinates outside the
// curated regions fall back to a longitude estimate that is explicitly flagged.

interface ZoneRule {
  zoneId: string;
  match: (lat: number, lng: number) => boolean;
}

const ZONE_RULES: ZoneRule[] = [
  // Indian subcontinent (India: single zone)
  { zoneId: "Asia/Kolkata", match: (la, ln) => la >= 6 && la <= 37 && ln >= 68 && ln <= 97.5 && !(la >= 26.3 && la <= 30.5 && ln >= 80 && ln <= 88.3) && !(la <= 10 && ln >= 79.5 && ln <= 82) },
  { zoneId: "Asia/Kathmandu", match: (la, ln) => la >= 26.3 && la <= 30.5 && ln >= 80 && ln <= 88.3 },
  { zoneId: "Asia/Colombo", match: (la, ln) => la >= 5.8 && la <= 10 && ln >= 79.5 && ln <= 82 },
  { zoneId: "Asia/Dubai", match: (la, ln) => la >= 22 && la <= 26.5 && ln >= 51 && ln <= 56.5 },
  { zoneId: "Asia/Singapore", match: (la, ln) => la >= 1 && la <= 1.6 && ln >= 103.5 && ln <= 104.2 },
  { zoneId: "Asia/Kuala_Lumpur", match: (la, ln) => la >= 1 && la <= 7 && ln >= 99.5 && ln <= 104.5 },
  // UK & Ireland region
  { zoneId: "Europe/London", match: (la, ln) => la >= 49.8 && la <= 61 && ln >= -8.5 && ln <= 2 },
  // North America (coarse longitudinal bands within the continent's latitudes)
  { zoneId: "America/New_York", match: (la, ln) => la >= 24 && la <= 50 && ln >= -83 && ln <= -66 },
  { zoneId: "America/Chicago", match: (la, ln) => la >= 24 && la <= 50 && ln > -103 && ln < -83 },
  { zoneId: "America/Denver", match: (la, ln) => la >= 24 && la <= 50 && ln > -115 && ln <= -103 },
  { zoneId: "America/Los_Angeles", match: (la, ln) => la >= 24 && la <= 50 && ln >= -125 && ln <= -115 },
  { zoneId: "America/Toronto", match: (la, ln) => la > 41.5 && la <= 57 && ln >= -90 && ln <= -74 },
  // Australia
  { zoneId: "Australia/Sydney", match: (la, ln) => la >= -38 && la <= -28 && ln >= 141 && ln <= 154 },
  { zoneId: "Australia/Melbourne", match: (la, ln) => la >= -39.2 && la < -36 && ln >= 141 && ln <= 150 },
  { zoneId: "Australia/Perth", match: (la, ln) => la >= -36 && la <= -13 && ln >= 112 && ln <= 129 },
];

function catalogueZoneFor(place: Place): string | null {
  switch (place.country) {
    case "India": return "Asia/Kolkata";
    case "Sri Lanka": return "Asia/Colombo";
    case "Nepal": return "Asia/Kathmandu";
    case "UAE": return "Asia/Dubai";
    case "Singapore": return "Asia/Singapore";
    case "Malaysia": return "Asia/Kuala_Lumpur";
    case "UK": return "Europe/London";
    case "Canada": return "America/Toronto";
    case "USA":
      if (place.admin === "New York") return "America/New_York";
      if (place.admin === "Illinois") return "America/Chicago";
      if (place.admin === "California" || place.admin === "Oregon") return "America/Los_Angeles";
      return null;
    case "Australia":
      if (place.admin === "NSW") return "Australia/Sydney";
      if (place.admin === "Victoria") return "Australia/Melbourne";
      if (place.admin === "WA") return "Australia/Perth";
      return null;
    default:
      return null;
  }
}

const CATALOGUE_ZONE_BY_COORDINATE = new Map(
  WORLD_PLACES.map((place) => [
    `${place.lat},${place.lng}`,
    catalogueZoneFor(place),
  ] as const),
);

/**
 * Exact IANA identity for a governed catalogue coordinate.
 *
 * This deliberately does not use proximity or political bounding rectangles:
 * an arbitrary coordinate is not silently promoted to a governed place.
 */
export function catalogueTimeZoneId(lat: number, lng: number): string | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return CATALOGUE_ZONE_BY_COORDINATE.get(`${lat},${lng}`) ?? null;
}

/** Resolve coordinates to an IANA zone. Curated regions resolve exactly; anything
 *  else gets a flagged longitude-band estimate (Etc/GMT±N — NO DST, NO history). */
export function resolveTimeZone(lat: number, lng: number): ZoneResolution {
  const catalogueZone = catalogueTimeZoneId(lat, lng);
  if (catalogueZone) return { zoneId: catalogueZone, method: "curated" };
  // Order matters: more specific carve-outs (Melbourne before Sydney box overlap
  // is avoided by disjoint latitudes; Nepal/Colombo carved out of the India box).
  for (const rule of [
    ZONE_RULES.find((r) => r.zoneId === "Asia/Kathmandu")!,
    ZONE_RULES.find((r) => r.zoneId === "Asia/Colombo")!,
    ZONE_RULES.find((r) => r.zoneId === "Asia/Singapore")!,
    ...ZONE_RULES,
  ]) {
    if (rule.match(lat, lng)) return { zoneId: rule.zoneId, method: "curated" };
  }
  // Longitude fallback: nearest whole-hour nautical zone. Explicitly approximate.
  const hours = Math.round(lng / 15);
  const sign = hours >= 0 ? "-" : "+"; // Etc/GMT signs are POSIX-inverted
  return { zoneId: `Etc/GMT${sign}${Math.abs(hours)}`, method: "approximate" };
}

// --- Historical offset lookup ------------------------------------------------------

const fmtCache = new Map<string, Intl.DateTimeFormat>();
const labelFmtCache = new Map<string, Intl.DateTimeFormat>();

function offsetFormatter(zoneId: string): Intl.DateTimeFormat {
  let fmt = fmtCache.get(zoneId);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", { timeZone: zoneId, timeZoneName: "longOffset" });
    fmtCache.set(zoneId, fmt);
  }
  return fmt;
}

function labelFormatter(zoneId: string): Intl.DateTimeFormat {
  let fmt = labelFmtCache.get(zoneId);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", { timeZone: zoneId, timeZoneName: "long" });
    labelFmtCache.set(zoneId, fmt);
  }
  return fmt;
}

/** Historical UTC offset (minutes east of UTC, seconds-precise zones rounded to
 *  the nearest minute) in effect in `zoneId` at the given UTC instant. */
export function utcOffsetMinutes(zoneId: string, utcMs: number): number {
  const parts = offsetFormatter(zoneId).formatToParts(new Date(utcMs));
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  // "GMT", "GMT+5:30", "GMT+05:30", "GMT+05:21:10"
  const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  const minutes = Number(m[2]) * 60 + Number(m[3] ?? 0) + Number(m[4] ?? 0) / 60;
  return sign * Math.round(minutes * 60) / 60;
}

/**
 * The civil (wall-clock) date and time at `zoneId` for a given UTC instant.
 *
 * This is the inverse direction of `localCivilToUtc` and introduces no new
 * timezone policy: it applies the offset that `utcOffsetMinutes` already
 * resolves for that instant, then reads the shifted value's calendar fields.
 * Surfaces that must ask "what is the local date/time AT THIS PLACE right now"
 * use it instead of the viewer's own browser clock.
 */
export function civilDateTimeInZone(
  zoneId: string,
  utcMs: number,
): { date: string; time: string; offsetMinutes: number } {
  const offsetMinutes = utcOffsetMinutes(zoneId, utcMs);
  const shifted = new Date(utcMs + offsetMinutes * 60_000);
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return {
    date: `${pad(shifted.getUTCFullYear(), 4)}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`,
    time: `${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`,
    offsetMinutes,
  };
}

/**
 * Offset to use when presenting an event instant for a stored place.
 *
 * A birth-time offset is only a legacy fallback. When the stored place carries
 * an IANA zone, the rule in force at the EVENT instant is resolved again so a
 * later timing/calendar surface cannot silently reuse a historical birth-time
 * offset across DST, wartime or permanent rule changes.
 */

export function eventUtcOffsetMinutes(
  zoneId: string | undefined,
  utcMs: number,
  legacyOffsetMinutes = 330,
): number {
  return zoneId ? utcOffsetMinutes(zoneId, utcMs) : legacyOffsetMinutes;
}

/** Provenance for the IANA rule actually in force at an already-known instant. */
export function timeRuleAtInstant(zoneId: string, utcMs: number): Readonly<TimeRuleProvenance> {
  const label = ruleLabel(zoneId, utcMs);
  return Object.freeze({
    provider: "IANA Time Zone Database",
    databaseVersion: tzDatabaseVersion(),
    zoneId,
    ruleLabel: label,
    adjustment: adjustmentAt(zoneId, utcMs, label),
    resolutionMode: "resolved",
  });
}

export function isValidUtcOffsetMinutes(value: number): boolean {
  return Number.isInteger(value)
    && value >= MIN_UTC_OFFSET_MINUTES
    && value <= MAX_UTC_OFFSET_MINUTES;
}

export function isTimeResolutionMode(value: string): value is TimeResolutionMode {
  return value === "resolved" || value === "selected" || value === "overridden";
}

export function isTimeAdjustment(value: string): value is TimeAdjustment {
  return value === "standard" || value === "daylight" || value === "wartime"
    || value === "historical" || value === "override";
}

function offsetRuleLabel(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const absolute = Math.abs(offsetMinutes);
  return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}

function ruleLabel(zoneId: string, utcMs: number): string {
  return labelFormatter(zoneId).formatToParts(new Date(utcMs))
    .find((part) => part.type === "timeZoneName")?.value ?? zoneId;
}

function within(utcMs: number, start: string, end: string): boolean {
  return utcMs >= Date.parse(start) && utcMs < Date.parse(end);
}

/**
 * Bounded wartime classification derived from IANA tzdata 2026b source rules.
 * The numerical offset still comes from Intl/tzdata; these intervals only give
 * the otherwise anonymous historical adjustment an honest consumer-facing name.
 */
function isRecognisedWartime(zoneId: string, utcMs: number): boolean {
  if (zoneId === "Asia/Kolkata") {
    return within(utcMs, "1941-09-30T18:30:00Z", "1942-05-14T17:30:00Z")
      || within(utcMs, "1942-08-31T18:30:00Z", "1945-10-14T17:30:00Z");
  }
  if (["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"].includes(zoneId)) {
    return within(utcMs, "1942-02-09T07:00:00Z", "1945-09-30T07:00:00Z");
  }
  if (zoneId === "Europe/London") {
    return within(utcMs, "1940-02-25T02:00:00Z", "1945-10-07T02:00:00Z");
  }
  return false;
}

function adjustmentAt(zoneId: string, utcMs: number, label: string): Exclude<TimeAdjustment, "override"> {
  if (isRecognisedWartime(zoneId, utcMs)) return "wartime";
  if (/daylight|summer/i.test(label)) return "daylight";
  const year = new Date(utcMs).getUTCFullYear();
  if (year < 1900 || /mean time/i.test(label)) return "historical";
  return "standard";
}

function candidateAt(zoneId: string, wallAsUtc: number, offsetMinutes: number): Omit<TimeCandidate, "choice"> | null {
  const utcMs = wallAsUtc - offsetMinutes * 60_000;
  if (utcOffsetMinutes(zoneId, utcMs) !== offsetMinutes) return null;
  const label = ruleLabel(zoneId, utcMs);
  return { utcMs, offsetMinutes, ruleLabel: label, adjustment: adjustmentAt(zoneId, utcMs, label) };
}

function candidateOffsets(zoneId: string, wallAsUtc: number): number[] {
  // Sampling both sides of the civil claim captures ordinary one-hour changes,
  // half-hour changes (e.g. Lord Howe) and historical date-line jumps without
  // inventing an instant. Every candidate is subsequently verified at itself.
  const probes = [
    -48, -24, -12, -6, -3, -2, -1, -0.5,
    0,
    0.5, 1, 2, 3, 6, 12, 24, 48,
  ];
  return [...new Set(probes.map((hours) => utcOffsetMinutes(zoneId, wallAsUtc + hours * 3_600_000)))];
}

// --- Civil (wall-clock) → UTC conversion -------------------------------------------

/**
 * Convert a civil date/time in `zoneId` to UTC, historically correct.
 *
 * DST edge policy:
 *  - an overlap returns both candidates and NO selected instant unless the
 *    person supplies `ambiguityChoice`;
 *  - a gap returns `nonexistent` and NO fabricated/projected instant;
 *  - a validated explicit offset is distinguishable as `overridden`.
 */
export function localCivilToUtc(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:MM or HH:MM:SS
  zoneId: string,
  options: CivilTimeResolutionOptions = {},
): UtcConversion {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) errors.push("date must be YYYY-MM-DD");
  if (!/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr)) errors.push("time must be HH:MM or HH:MM:SS");
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi, s] = `${timeStr}:00`.split(":").map(Number);
  const usesExtendedOffset = options.allowExtendedOffset === true
    && options.offsetOverrideMinutes !== undefined;
  if (!Number.isInteger(y)
    || (!usesExtendedOffset && (y < MIN_GOVERNED_TZ_YEAR || y > MAX_GOVERNED_TZ_YEAR))) {
    errors.push(`date must be within the governed tzdata range ${MIN_GOVERNED_TZ_YEAR}-${MAX_GOVERNED_TZ_YEAR}`);
  }
  const dateProbe = new Date(Date.UTC(y, mo - 1, d));
  if (Number.isFinite(dateProbe.getTime())
    && (dateProbe.getUTCFullYear() !== y || dateProbe.getUTCMonth() !== mo - 1 || dateProbe.getUTCDate() !== d)) {
    errors.push(`date ${dateStr} does not exist`);
  }
  if (!Number.isInteger(h) || !Number.isInteger(mi) || !Number.isInteger(s)
    || h < 0 || h > 23 || mi < 0 || mi > 59 || s < 0 || s > 59) {
    errors.push(`time ${timeStr} is out of range`);
  }
  try {
    offsetFormatter(zoneId);
    labelFormatter(zoneId);
  } catch {
    errors.push(`time zone ${zoneId} is not supported`);
  }
  if (errors.length) return { status: "invalid", zoneId, errors };

  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi, s);

  if (options.offsetOverrideMinutes !== undefined) {
    if (!isValidUtcOffsetMinutes(options.offsetOverrideMinutes)) {
      return {
        status: "invalid",
        zoneId,
        errors: [`offset override must be an integer from ${MIN_UTC_OFFSET_MINUTES} to ${MAX_UTC_OFFSET_MINUTES} minutes`],
      };
    }
    const offsetMinutes = options.offsetOverrideMinutes;
    return {
      status: "ok",
      utcMs: wallAsUtc - offsetMinutes * 60_000,
      offsetMinutes,
      zoneId,
      provenance: Object.freeze({
        provider: "user override",
        zoneId,
        ruleLabel: offsetRuleLabel(offsetMinutes),
        adjustment: "override",
        resolutionMode: "overridden",
      }),
    };
  }

  const candidates = candidateOffsets(zoneId, wallAsUtc)
    .map((offset) => candidateAt(zoneId, wallAsUtc, offset))
    .filter((candidate): candidate is Omit<TimeCandidate, "choice"> => candidate !== null)
    .filter((candidate, index, all) => all.findIndex((other) => other.utcMs === candidate.utcMs) === index)
    .sort((a, b) => a.utcMs - b.utcMs);

  if (candidates.length === 0) {
    const around = candidateOffsets(zoneId, wallAsUtc).sort((a, b) => a - b);
    return {
      status: "nonexistent",
      zoneId,
      offsetsAroundGap: [around[0], around[around.length - 1]],
    };
  }

  if (candidates.length > 1) {
    const pair: readonly [TimeCandidate, TimeCandidate] = [
      { ...candidates[0], choice: "earlier" },
      { ...candidates[candidates.length - 1], choice: "later" },
    ];
    if (!options.ambiguityChoice) return { status: "ambiguous", zoneId, candidates: pair };
    const selected = options.ambiguityChoice === "earlier" ? pair[0] : pair[1];
    return {
      status: "ok",
      utcMs: selected.utcMs,
      offsetMinutes: selected.offsetMinutes,
      zoneId,
      provenance: Object.freeze({
        provider: "IANA Time Zone Database",
        databaseVersion: tzDatabaseVersion(),
        zoneId,
        ruleLabel: selected.ruleLabel,
        adjustment: selected.adjustment,
        resolutionMode: "selected",
        ambiguityChoice: selected.choice,
      }),
    };
  }

  const selected = candidates[0];
  return {
    status: "ok",
    utcMs: selected.utcMs,
    offsetMinutes: selected.offsetMinutes,
    zoneId,
    provenance: Object.freeze({
      provider: "IANA Time Zone Database",
      databaseVersion: tzDatabaseVersion(),
      zoneId,
      ruleLabel: selected.ruleLabel,
      adjustment: selected.adjustment,
      resolutionMode: "resolved",
    }),
  };
}

/** One-call convenience: coordinates + civil time → UTC (with zone provenance). */
export function resolveBirthInstant(
  dateStr: string,
  timeStr: string,
  lat: number,
  lng: number,
  options: CivilTimeResolutionOptions = {},
): UtcConversion & { method: ZoneResolution["method"] } {
  const { zoneId, method } = resolveTimeZone(lat, lng);
  return { ...localCivilToUtc(dateStr, timeStr, zoneId, options), method };
}

/** Runtime tzdata version (evidence provenance; Node only — undefined in browsers). */
export function tzDatabaseVersion(): string | undefined {
  return typeof process !== "undefined" ? (process.versions as Record<string, string>).tz : undefined;
}
