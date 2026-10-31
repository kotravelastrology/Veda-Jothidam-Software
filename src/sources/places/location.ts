// Worldwide Location Engine (WBS-002) — Developed by Kottravel Astrology.
//
// Governed location resolution: a structured, offline-first place database with
// canonical names, aliases (including Tamil), country tags and verified-range
// coordinates; deterministic resolution with explicit duplicate handling; and a
// legacy-compatible view for existing consumers (BirthForm/matching/panchangam/
// marriage-muhurta pages).
//
// Scope boundary (WBS-002): location → coordinates ONLY. No time-zone or UTC
// offset logic lives here — that is WBS-003.

export interface Place {
  name: string; // canonical English name
  aliases: string[]; // alternate spellings incl. Tamil script
  country: string;
  admin?: string; // state/province, for duplicate disambiguation
  lat: number;
  lng: number;
}

export const PLACE_ATLAS_DATASET_ID = "astrologiclab-world-places";
export const PLACE_ATLAS_DATASET_VERSION = "wbs-002/2.0.0";

export type PlaceSource = "curated" | "online" | "gps" | "manual";

export function isPlaceSource(value: string): value is PlaceSource {
  return value === "curated" || value === "online" || value === "gps" || value === "manual";
}

/** Provenance that remains attached to a selected place after lookup. */
export interface PlaceRecordProvenance {
  readonly source: PlaceSource;
  readonly provider: string;
  readonly recordId?: string;
  readonly datasetId?: string;
  readonly datasetVersion?: string;
  readonly canonicalName?: string;
  readonly country?: string;
  readonly admin?: string;
}

export type ResolveStatus = "exact" | "candidates" | "ambiguous" | "not_found";

export interface ResolveResult {
  status: ResolveStatus;
  candidates: Place[]; // deterministic order; best first
}

// --- Canonical worldwide database -------------------------------------------------
// Legacy coordinates are preserved verbatim (golden-baseline compatibility: the
// Erode reference 11.341/77.7172 must never drift). Alias rows of the legacy list
// (Tiruchy, Tanjore, Pondicherry, …) are folded into `aliases`.

export const WORLD_PLACES: Place[] = [
  // Tamil Nadu
  { name: "Chennai", aliases: ["சென்னை", "Madras"], country: "India", admin: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", aliases: ["கோயம்புத்தூர்"], country: "India", admin: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", aliases: ["மதுரை"], country: "India", admin: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { name: "Tiruchirappalli", aliases: ["Tiruchy", "Trichy", "திருச்சி"], country: "India", admin: "Tamil Nadu", lat: 10.7905, lng: 78.7047 },
  { name: "Salem", aliases: ["சேலம்"], country: "India", admin: "Tamil Nadu", lat: 11.6643, lng: 78.146 },
  { name: "Tirunelveli", aliases: ["திருநெல்வேலி"], country: "India", admin: "Tamil Nadu", lat: 8.7139, lng: 77.7567 },
  { name: "Tiruppur", aliases: ["திருப்பூர்"], country: "India", admin: "Tamil Nadu", lat: 11.1085, lng: 77.3411 },
  { name: "Vellore", aliases: ["வேலூர்"], country: "India", admin: "Tamil Nadu", lat: 12.9165, lng: 79.1325 },
  { name: "Thanjavur", aliases: ["Tanjore", "தஞ்சாவூர்"], country: "India", admin: "Tamil Nadu", lat: 10.787, lng: 79.1378 },
  { name: "Erode", aliases: ["ஈரோடு"], country: "India", admin: "Tamil Nadu", lat: 11.341, lng: 77.7172 },
  { name: "Tiruvannamalai", aliases: ["திருவண்ணாமலை"], country: "India", admin: "Tamil Nadu", lat: 12.2253, lng: 79.0747 },
  { name: "Dindigul", aliases: ["திண்டுக்கல்"], country: "India", admin: "Tamil Nadu", lat: 10.3624, lng: 77.9695 },
  { name: "Kanchipuram", aliases: ["காஞ்சிபுரம்"], country: "India", admin: "Tamil Nadu", lat: 12.8185, lng: 79.7044 },
  { name: "Kumbakonam", aliases: ["கும்பகோணம்"], country: "India", admin: "Tamil Nadu", lat: 10.9602, lng: 79.3845 },
  { name: "Nagercoil", aliases: ["நாகர்கோவில்"], country: "India", admin: "Tamil Nadu", lat: 8.1833, lng: 77.4119 },
  { name: "Puducherry", aliases: ["Pondicherry", "புதுச்சேரி"], country: "India", admin: "Puducherry", lat: 11.9416, lng: 79.8083 },
  { name: "Cuddalore", aliases: ["கடலூர்"], country: "India", admin: "Tamil Nadu", lat: 11.748, lng: 79.7714 },
  { name: "Ramanathapuram", aliases: ["ராமநாதபுரம்"], country: "India", admin: "Tamil Nadu", lat: 9.3762, lng: 78.8306 },
  { name: "Rameswaram", aliases: ["ராமேஸ்வரம்"], country: "India", admin: "Tamil Nadu", lat: 9.2876, lng: 79.3129 },
  { name: "Nagapattinam", aliases: ["நாகப்பட்டினம்"], country: "India", admin: "Tamil Nadu", lat: 10.7631, lng: 79.8429 },
  { name: "Karur", aliases: ["கரூர்"], country: "India", admin: "Tamil Nadu", lat: 10.957, lng: 78.0806 },
  { name: "Villupuram", aliases: ["விழுப்புரம்"], country: "India", admin: "Tamil Nadu", lat: 11.9401, lng: 79.4928 },
  { name: "Sivagangai", aliases: ["சிவகங்கை"], country: "India", admin: "Tamil Nadu", lat: 9.8485, lng: 78.4801 },
  { name: "Virudhunagar", aliases: ["விருதுநகர்"], country: "India", admin: "Tamil Nadu", lat: 9.5852, lng: 77.9624 },
  { name: "Krishnagiri", aliases: ["கிருஷ்ணகிரி"], country: "India", admin: "Tamil Nadu", lat: 12.5266, lng: 78.2137 },
  { name: "Dharmapuri", aliases: ["தர்மபுரி"], country: "India", admin: "Tamil Nadu", lat: 12.1278, lng: 78.1574 },
  { name: "Namakkal", aliases: ["நாமக்கல்"], country: "India", admin: "Tamil Nadu", lat: 11.2189, lng: 78.167 },
  { name: "Ariyalur", aliases: ["அரியலூர்"], country: "India", admin: "Tamil Nadu", lat: 11.1404, lng: 79.0755 },
  { name: "Perambalur", aliases: ["பெரம்பலூர்"], country: "India", admin: "Tamil Nadu", lat: 11.2332, lng: 78.8803 },
  { name: "Thoothukudi", aliases: ["Tuticorin", "தூத்துக்குடி"], country: "India", admin: "Tamil Nadu", lat: 8.7642, lng: 78.1348 },
  { name: "Kallakurichi", aliases: ["கள்ளக்குறிச்சி"], country: "India", admin: "Tamil Nadu", lat: 11.7382, lng: 78.9601 },
  { name: "Ranipet", aliases: ["இராணிப்பேட்டை"], country: "India", admin: "Tamil Nadu", lat: 12.9226, lng: 79.3321 },
  { name: "Chengalpattu", aliases: ["செங்கல்பட்டு"], country: "India", admin: "Tamil Nadu", lat: 12.6921, lng: 79.9762 },
  { name: "Mayiladuthurai", aliases: ["மயிலாடுதுறை"], country: "India", admin: "Tamil Nadu", lat: 11.1018, lng: 79.6508 },
  { name: "Hosur", aliases: ["ஓசூர்"], country: "India", admin: "Tamil Nadu", lat: 12.7409, lng: 77.8253 },
  { name: "Udhagamandalam", aliases: ["Ooty", "உதகமண்டலம்", "ஊட்டி"], country: "India", admin: "Tamil Nadu", lat: 11.4102, lng: 76.695 },
  { name: "Kodaikanal", aliases: ["கொடைக்கானல்"], country: "India", admin: "Tamil Nadu", lat: 10.2381, lng: 77.4892 },
  { name: "Pollachi", aliases: ["பொள்ளாச்சி"], country: "India", admin: "Tamil Nadu", lat: 10.6617, lng: 77.0036 },
  { name: "Mettupalayam", aliases: ["மேட்டுப்பாளையம்"], country: "India", admin: "Tamil Nadu", lat: 11.2991, lng: 76.9399 },
  { name: "Palani", aliases: ["பழனி"], country: "India", admin: "Tamil Nadu", lat: 10.4497, lng: 77.5254 },
  { name: "Sivakasi", aliases: ["சிவகாசி"], country: "India", admin: "Tamil Nadu", lat: 9.4533, lng: 77.7974 },
  { name: "Karaikudi", aliases: ["காரைக்குடி"], country: "India", admin: "Tamil Nadu", lat: 10.0742, lng: 78.7721 },
  { name: "Musiri", aliases: ["முசிறி"], country: "India", admin: "Tamil Nadu", lat: 10.9452, lng: 78.4396 },
  { name: "Papanasam", aliases: ["பாபநாசம்"], country: "India", admin: "Tamil Nadu", lat: 10.9267, lng: 79.2723 },
  { name: "Srirangam", aliases: ["ஸ்ரீரங்கம்"], country: "India", admin: "Tamil Nadu", lat: 10.8616, lng: 78.6936 },
  { name: "Velankanni", aliases: ["வேளாங்கண்ணி"], country: "India", admin: "Tamil Nadu", lat: 10.6812, lng: 79.8527 },
  { name: "Courtallam", aliases: ["குற்றாலம்"], country: "India", admin: "Tamil Nadu", lat: 8.9328, lng: 77.2716 },
  // Kerala
  { name: "Thiruvananthapuram", aliases: ["Trivandrum"], country: "India", admin: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi", aliases: ["Cochin"], country: "India", admin: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Kozhikode", aliases: ["Calicut"], country: "India", admin: "Kerala", lat: 11.2588, lng: 75.7804 },
  { name: "Thrissur", aliases: [], country: "India", admin: "Kerala", lat: 10.5276, lng: 76.2144 },
  { name: "Kollam", aliases: [], country: "India", admin: "Kerala", lat: 8.8932, lng: 76.6141 },
  { name: "Palakkad", aliases: [], country: "India", admin: "Kerala", lat: 10.7867, lng: 76.6548 },
  // Karnataka
  { name: "Bengaluru", aliases: ["Bangalore"], country: "India", admin: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru", aliases: ["Mysore"], country: "India", admin: "Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Mangaluru", aliases: ["Mangalore"], country: "India", admin: "Karnataka", lat: 12.9141, lng: 74.856 },
  { name: "Hubli", aliases: [], country: "India", admin: "Karnataka", lat: 15.3647, lng: 75.124 },
  // Andhra & Telangana
  { name: "Hyderabad", aliases: [], country: "India", admin: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Visakhapatnam", aliases: ["Vizag"], country: "India", admin: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Vijayawada", aliases: [], country: "India", admin: "Andhra Pradesh", lat: 16.5062, lng: 80.648 },
  { name: "Guntur", aliases: [], country: "India", admin: "Andhra Pradesh", lat: 16.3008, lng: 80.4428 },
  { name: "Tirupati", aliases: [], country: "India", admin: "Andhra Pradesh", lat: 13.6288, lng: 79.4192 },
  // Rest of India
  { name: "Mumbai", aliases: ["Bombay"], country: "India", admin: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Pune", aliases: [], country: "India", admin: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Delhi", aliases: ["New Delhi"], country: "India", admin: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Kolkata", aliases: ["Calcutta"], country: "India", admin: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", aliases: [], country: "India", admin: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", aliases: [], country: "India", admin: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Jaipur", aliases: [], country: "India", admin: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", aliases: [], country: "India", admin: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Nagpur", aliases: [], country: "India", admin: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Bhopal", aliases: [], country: "India", admin: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Indore", aliases: [], country: "India", admin: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Chandigarh", aliases: [], country: "India", admin: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Varanasi", aliases: ["Kashi", "Benares"], country: "India", admin: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Prayagraj", aliases: ["Allahabad"], country: "India", admin: "Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
  { name: "Patna", aliases: [], country: "India", admin: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Bhubaneswar", aliases: [], country: "India", admin: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Guwahati", aliases: [], country: "India", admin: "Assam", lat: 26.1445, lng: 91.7362 },
  // Sri Lanka
  { name: "Colombo", aliases: ["கொழும்பு"], country: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
  { name: "Jaffna", aliases: ["யாழ்ப்பாணம்"], country: "Sri Lanka", lat: 9.6615, lng: 80.0255 },
  { name: "Kandy", aliases: ["கண்டி"], country: "Sri Lanka", lat: 7.2906, lng: 80.6337 },
  // Nepal
  { name: "Kathmandu", aliases: [], country: "Nepal", lat: 27.7172, lng: 85.324 },
  // UAE
  { name: "Dubai", aliases: ["துபாய்"], country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Abu Dhabi", aliases: [], country: "UAE", lat: 24.4539, lng: 54.3773 },
  // Singapore & Malaysia
  { name: "Singapore", aliases: ["சிங்கப்பூர்"], country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Kuala Lumpur", aliases: [], country: "Malaysia", lat: 3.139, lng: 101.6869 },
  // UK
  { name: "London", aliases: ["இலண்டன்"], country: "UK", admin: "England", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", aliases: [], country: "UK", admin: "England", lat: 53.4808, lng: -2.2426 },
  { name: "Birmingham", aliases: [], country: "UK", admin: "England", lat: 52.4862, lng: -1.8904 },
  // USA
  { name: "New York", aliases: ["NYC"], country: "USA", admin: "New York", lat: 40.7128, lng: -74.006 },
  { name: "Chicago", aliases: [], country: "USA", admin: "Illinois", lat: 41.8781, lng: -87.6298 },
  { name: "Los Angeles", aliases: ["LA"], country: "USA", admin: "California", lat: 34.0522, lng: -118.2437 },
  { name: "Salem", aliases: [], country: "USA", admin: "Oregon", lat: 44.9429, lng: -123.0351 },
  // Canada (duplicate-name coverage: London, Ontario)
  { name: "Toronto", aliases: [], country: "Canada", admin: "Ontario", lat: 43.6532, lng: -79.3832 },
  { name: "London", aliases: [], country: "Canada", admin: "Ontario", lat: 42.9849, lng: -81.2453 },
  // Australia
  { name: "Sydney", aliases: [], country: "Australia", admin: "NSW", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", aliases: [], country: "Australia", admin: "Victoria", lat: -37.8136, lng: 144.9631 },
  { name: "Perth", aliases: [], country: "Australia", admin: "WA", lat: -31.9523, lng: 115.8613 },
];

// --- Normalization ----------------------------------------------------------------

/** Normalize a place query: NFC, lowercase, trimmed, collapsed spaces, latin diacritics stripped. */
export function normalizePlaceName(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip latin combining diacritics only
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// --- Validation -------------------------------------------------------------------

/** Validate geographic coordinates (finite; lat in [-90,90], lng in [-180,180]). */
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// --- Resolution -------------------------------------------------------------------

type Rank = 0 | 1 | 2 | 3;

function matchRank(place: Place, q: string): Rank | null {
  if (normalizePlaceName(place.name) === q) return 0;
  if (place.aliases.some((a) => normalizePlaceName(a) === q)) return 1;
  if (normalizePlaceName(place.name).startsWith(q)) return 2;
  if (
    normalizePlaceName(place.name).includes(q) ||
    place.aliases.some((a) => normalizePlaceName(a).includes(q))
  )
    return 3;
  return null;
}

export interface ResolveOptions {
  country?: string; // restrict to a country
  region?: string; // restrict to an admin region or country
  limit?: number; // max candidates (default 8)
}

/**
 * Resolve a consumer-entered place to coordinates, deterministically.
 *
 * status: "exact"      — a single best full-name/alias match
 *         "candidates" — partial matches requiring an explicit selection
 *         "ambiguous"  — multiple places share the queried name (duplicates are
 *                        returned, best-ranked first, for explicit disambiguation)
 *         "not_found"  — nothing matches offline (caller may fall back to the
 *                        online provider)
 */
export function resolvePlace(query: string, options: ResolveOptions = {}): ResolveResult {
  const q = normalizePlaceName(query);
  if (!q) return { status: "not_found", candidates: [] };
  const limit = Math.max(1, Math.floor(options.limit ?? 8));
  const country = options.country ? normalizePlaceName(options.country) : "";
  const region = options.region ? normalizePlaceName(options.region) : "";

  const ranked: { place: Place; rank: Rank }[] = [];
  for (const place of WORLD_PLACES) {
    if (country && normalizePlaceName(place.country) !== country) continue;
    if (
      region &&
      normalizePlaceName(place.country) !== region &&
      normalizePlaceName(place.admin ?? "") !== region
    ) continue;
    const rank = matchRank(place, q);
    if (rank !== null) ranked.push({ place, rank });
  }
  ranked.sort(
    (a, b) =>
      a.rank - b.rank ||
      a.place.country.localeCompare(b.place.country) ||
      a.place.name.localeCompare(b.place.name) ||
      (a.place.admin ?? "").localeCompare(b.place.admin ?? ""),
  );

  const fullMatches = ranked.filter((r) => r.rank <= 1);
  if (fullMatches.length === 1) {
    return { status: "exact", candidates: [fullMatches[0].place] };
  }
  if (fullMatches.length > 1) {
    // A limit must never hide a same-name candidate from the person.
    return { status: "ambiguous", candidates: fullMatches.map((r) => r.place) };
  }

  const candidates = ranked.slice(0, limit).map((r) => r.place);
  if (candidates.length === 0) return { status: "not_found", candidates: [] };
  // Partial names always produce candidates for explicit selection. They never
  // silently become a resolved location, even when only one row matched.
  return { status: "candidates", candidates };
}

// --- Legacy compatibility ---------------------------------------------------------

export interface LegacyCity {
  name: string;
  canonicalName: string;
  lat: number;
  lng: number;
  country?: string;
  admin?: string;
  provenance: PlaceRecordProvenance;
}

/** Stable provenance for one row of the governed offline atlas. */
export function curatedPlaceProvenance(place: Place): PlaceRecordProvenance {
  const recordId = [place.name, place.admin ?? "", place.country]
    .map(normalizePlaceName)
    .join("|");
  return Object.freeze({
    source: "curated",
    provider: "AstrologicLab governed offline place atlas",
    recordId,
    datasetId: PLACE_ATLAS_DATASET_ID,
    datasetVersion: PLACE_ATLAS_DATASET_VERSION,
    canonicalName: place.name,
    country: place.country,
    admin: place.admin,
  });
}

function legacyRow(place: Place, name: string): LegacyCity {
  return {
    name,
    canonicalName: place.name,
    lat: place.lat,
    lng: place.lng,
    country: place.country,
    admin: place.admin,
    provenance: curatedPlaceProvenance(place),
  };
}

/**
 * Legacy view reproducing the historical CITIES shape: one row per canonical name
 * and per English alias (Tamil-script aliases are search-only). Existing pages
 * (BirthForm, matching, panchangam, marriage-muhurta) consume this unchanged.
 */
export function legacyCityView(): LegacyCity[] {
  const rows: LegacyCity[] = [];
  for (const p of WORLD_PLACES) {
    rows.push(legacyRow(p, p.name));
    for (const alias of p.aliases) {
      if (/^[\x20-\x7e]+$/.test(alias)) rows.push(legacyRow(p, alias));
    }
  }
  return rows;
}

/** Offline search returning legacy-shaped rows (deduped by display name). */
export function searchLegacyView(query: string, limit = 8, region?: string): LegacyCity[] {
  const result = resolvePlace(query, { limit, region });
  const { candidates } = result;
  const seen = new Set<string>();
  const rows: LegacyCity[] = [];
  for (const p of candidates) {
    const label = p.admin && candidates.some((o) => o !== p && o.name === p.name)
      ? `${p.name} (${p.admin}, ${p.country})`
      : p.name;
    if (!seen.has(label)) {
      seen.add(label);
      rows.push(legacyRow(p, label));
    }
    // An ambiguity is a safety boundary: caller limits must never conceal an
    // equally named candidate. Partial-result lists may still be bounded.
    if (result.status !== "ambiguous" && rows.length >= limit) break;
  }
  return rows;
}

/** Construct a direct-coordinate or GPS selection, refusing invalid values. */
export function coordinatePlace(
  label: string,
  lat: number,
  lng: number,
  source: "manual" | "gps",
): LegacyCity {
  if (!validateCoordinates(lat, lng)) {
    throw new RangeError("place coordinates are out of range");
  }
  const name = label.trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  return {
    name,
    canonicalName: name,
    lat,
    lng,
    provenance: Object.freeze({
      source,
      provider: source === "gps" ? "browser geolocation" : "person-entered coordinates",
      canonicalName: name,
    }),
  };
}

export interface NominatimPlaceRow {
  readonly place_id?: number;
  readonly osm_type?: string;
  readonly osm_id?: number;
  readonly display_name: string;
  readonly lat: string;
  readonly lon: string;
  readonly address?: Readonly<Record<string, string>>;
}

/** Map a provider row without accepting invalid coordinates. */
export function nominatimPlace(row: NominatimPlaceRow): LegacyCity | null {
  const lat = Number(row.lat);
  const lng = Number(row.lon);
  if (!validateCoordinates(lat, lng)) return null;
  const address = row.address ?? {};
  const canonicalName = address.city || address.town || address.village ||
    address.municipality || address.county || row.display_name.split(",")[0];
  const country = address.country;
  const admin = address.state || address.region || address.province || address.county;
  const name = [canonicalName, admin, country].filter(Boolean).join(", ");
  const providerRecord = row.osm_type && row.osm_id !== undefined
    ? `${row.osm_type}:${row.osm_id}`
    : row.place_id !== undefined ? `place:${row.place_id}` : undefined;
  return {
    name,
    canonicalName,
    lat,
    lng,
    country,
    admin,
    provenance: Object.freeze({
      source: "online",
      provider: "OpenStreetMap Nominatim",
      recordId: providerRecord,
      canonicalName,
      country,
      admin,
    }),
  };
}

/**
 * Build the anonymous online lookup URL. The function accepts only place and
 * region text, so a person's name or profile identity cannot enter the request.
 */
export function nominatimSearchUrl(query: string, region = ""): string {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "20");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("q", [query.trim(), region.trim()].filter(Boolean).join(", "));
  return url.toString();
}
