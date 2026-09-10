'use client';

import { useState } from 'react';

interface ToolsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const COMMON_LOCATIONS: Location[] = [
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
];

function LocationFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const filtered = COMMON_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Search Location</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="City name..."
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        />
      </div>

      <div className="max-h-48 overflow-y-auto border border-line rounded">
        {filtered.length > 0 ? (
          filtered.map((loc) => (
            <button
              key={loc.name}
              onClick={() => setSelectedLocation(loc)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-saffron/10 border-b border-line-soft last:border-b-0 ${
                selectedLocation?.name === loc.name ? 'bg-saffron/20 text-saffron' : 'text-ink'
              }`}
            >
              <div className="font-medium">{loc.name}</div>
              <div className="text-xs text-ink-soft">
                {loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E • {loc.timezone}
              </div>
            </button>
          ))
        ) : (
          <div className="p-3 text-sm text-ink-soft text-center">No locations found</div>
        )}
      </div>

      {selectedLocation && (
        <div className="p-3 bg-saffron/10 border border-saffron/30 rounded text-sm">
          <div className="font-medium text-ink">{selectedLocation.name}</div>
          <div className="text-xs text-ink-soft mt-1">
            Lat: {selectedLocation.latitude.toFixed(4)}°
            <br />
            Long: {selectedLocation.longitude.toFixed(4)}°
            <br />
            TZ: {selectedLocation.timezone}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeZoneConverter() {
  const [utcTime, setUtcTime] = useState(new Date().toISOString().slice(0, 16));
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  const timezones = [
    { value: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
    { value: 'UTC', label: 'UTC (UTC+0:00)' },
    { value: 'Europe/London', label: 'GMT/BST (UTC+0:00/+1:00)' },
    { value: 'America/New_York', label: 'EST/EDT (UTC-5:00/-4:00)' },
    { value: 'Asia/Singapore', label: 'SGT (UTC+8:00)' },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">UTC Time</label>
        <input
          type="datetime-local"
          value={utcTime}
          onChange={(e) => setUtcTime(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">Convert to Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-3 bg-saffron/10 border border-saffron/30 rounded text-sm">
        <div className="font-medium text-ink">Converted Time</div>
        <div className="text-xs text-ink-soft mt-1">
          {new Date(utcTime).toLocaleString('en-US', { timeZone: timezone })}
        </div>
      </div>
    </div>
  );
}

function AyanamshaCalculator() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const calculateAyanamsha = (selectedDate: string) => {
    const baseAyanamsha = 23.84; // Lahiri 1950
    const daysPerYear = 365.25;
    const precessionRate = 50.256 / 3600; // Seconds per year

    const baseDate = new Date('1950-01-01');
    const targetDate = new Date(selectedDate);
    const yearsDiff = (targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24 * daysPerYear);

    return baseAyanamsha + yearsDiff * precessionRate;
  };

  const ayanamsha = calculateAyanamsha(date);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        />
      </div>

      <div className="p-3 bg-saffron/10 border border-saffron/30 rounded text-sm">
        <div className="font-medium text-ink">Lahiri Ayanamsha</div>
        <div className="text-2xl font-bold text-saffron mt-2">{ayanamsha.toFixed(4)}°</div>
        <div className="text-xs text-ink-soft mt-2">
          Based on Lahiri 1950 epoch with precession rate
        </div>
      </div>
    </div>
  );
}

function DateConverter() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const convertDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00Z');
    const days = Math.floor((date.getTime() - new Date('1900-01-01').getTime()) / (1000 * 60 * 60 * 24));

    // JD calculation
    const a = (14 - (date.getMonth() + 1)) / 12;
    const y = date.getFullYear() + 4800 - Math.floor(a);
    const m = (date.getMonth() + 1) + 12 * a - 3;
    const jd = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    return { days, jd };
  };

  const converted = convertDate(selectedDate);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        />
      </div>

      <div className="p-3 bg-saffron/10 border border-saffron/30 rounded text-sm">
        <div className="font-medium text-ink mb-2">Conversion Results</div>
        <div className="text-xs text-ink-soft space-y-1">
          <div>Days since 1900-01-01: <span className="text-saffron font-medium">{converted.days}</span></div>
          <div>Julian Day Number: <span className="text-saffron font-medium">{converted.jd}</span></div>
        </div>
      </div>
    </div>
  );
}

// ── KP Horary 1–249 ──────────────────────────────────────────────────────
// Pure arithmetic (no ephemeris): the 249 Sign–Star–Sub intervals are the
// 13 sign boundaries + 27 nakshatra starts + 9 Vimshottari-proportional sub
// boundaries per nakshatra. Ported from the prior kp-muhurat-workspace
// (birth_chart_app.py horary_number_detail).
const KP_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const KP_SIGN_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const KP_NAKS = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const KP_VIM_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const KP_VIM_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

function kpDetailAt(lon: number) {
  const l = ((lon % 360) + 360) % 360;
  const span = 360 / 27;
  const nak = Math.min(Math.floor(l / span), 26);
  const starLord = KP_VIM_ORDER[nak % 9];
  const within = l - nak * span;
  let elapsed = 0;
  const first = KP_VIM_ORDER.indexOf(starLord);
  for (let step = 0; step < 9; step += 1) {
    const lord = KP_VIM_ORDER[(first + step) % 9];
    const sub = span * KP_VIM_YEARS[lord] / 120;
    if (within < elapsed + sub + 1e-10) return { nakshatra: KP_NAKS[nak], starLord, subLord: lord };
    elapsed += sub;
  }
  return { nakshatra: KP_NAKS[nak], starLord, subLord: KP_VIM_ORDER[(first + 8) % 9] };
}

const KP_249_INTERVALS = (() => {
  const span = 360 / 27;
  const set = new Set<number>();
  for (let s = 0; s <= 12; s += 1) set.add(s * 30);
  for (let nak = 0; nak < 27; nak += 1) {
    const start = nak * span;
    set.add(start);
    const first = KP_VIM_ORDER.indexOf(KP_VIM_ORDER[nak % 9]);
    let cursor = start;
    for (let step = 0; step < 9; step += 1) {
      cursor += span * KP_VIM_YEARS[KP_VIM_ORDER[(first + step) % 9]] / 120;
      set.add(Math.round(cursor * 1e10) / 1e10);
    }
  }
  const pts = [...set].sort((a, b) => a - b);
  const iv: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i += 1) if (pts[i + 1] - pts[i] > 1e-8) iv.push([pts[i], pts[i + 1]]);
  return iv;
})();

function dms(v: number) {
  const d = Math.floor(v);
  const mF = (v - d) * 60;
  const m = Math.floor(mF);
  const s = Math.round((mF - m) * 60);
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

function kpHoraryNumber(n: number) {
  if (!Number.isInteger(n) || n < 1 || n > 249) return null;
  const [start, end] = KP_249_INTERVALS[n - 1];
  const mid = (start + end) / 2;
  const detail = kpDetailAt(mid);
  const signIndex = Math.floor(mid / 30);
  return {
    number: n,
    startLongitude: dms(start),
    endLongitude: dms(end),
    sign: KP_SIGNS[signIndex],
    signLord: KP_SIGN_LORDS[signIndex],
    ...detail,
  };
}

function KpHoraryNumberTool() {
  const [num, setNum] = useState('1');
  const n = parseInt(num, 10);
  const detail = kpHoraryNumber(n);
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink mb-2">KP Horary Number (1–249)</label>
        <input
          type="number" min={1} max={249} value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-ink-soft/10 border border-line rounded focus:outline-none focus:border-saffron"
        />
      </div>
      {detail ? (
        <div className="p-3 bg-saffron/10 border border-saffron/30 rounded text-sm">
          <div className="font-medium text-ink mb-2">எண் {detail.number} — Sign · Star · Sub</div>
          <div className="text-xs text-ink-soft space-y-1">
            <div>பகுதி: <span className="text-ink">{detail.startLongitude} – {detail.endLongitude}</span></div>
            <div>ராசி: <span className="text-saffron font-medium">{detail.sign}</span> (அதிபதி {detail.signLord})</div>
            <div>நட்சத்திரம்: <span className="text-ink">{detail.nakshatra}</span></div>
            <div>நட்சத்திர அதிபதி: <span className="text-saffron font-medium">{detail.starLord}</span></div>
            <div>துணை அதிபதி (Sub Lord): <span className="text-saffron font-medium">{detail.subLord}</span></div>
          </div>
          <p className="text-[11px] text-ink-soft mt-2">
            துல்லிய 1–249 Sign–Star–Sub பகுதி. முழு Horary cusp பலன் தனி கட்டம். (kp-muhurat engine port)
          </p>
        </div>
      ) : (
        <p className="text-sm text-rose">1 முதல் 249 வரை ஒரு எண் தேவை.</p>
      )}
    </div>
  );
}

export function ToolsPanel({ isOpen, onClose }: ToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<'location' | 'timezone' | 'ayanamsha' | 'date' | 'kphorary'>('location');

  if (!isOpen) return null;

  const tabs = [
    { id: 'location', label: 'Location Finder', component: LocationFinder },
    { id: 'timezone', label: 'Time Zone Converter', component: TimeZoneConverter },
    { id: 'ayanamsha', label: 'Ayanamsha Calculator', component: AyanamshaCalculator },
    { id: 'date', label: 'Date Converter', component: DateConverter },
    { id: 'kphorary', label: 'KP Horary (1–249)', component: KpHoraryNumberTool },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-surface border border-line rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-line bg-surface">
          <h2 className="text-lg font-bold text-ink">Tools</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-3 border-b border-line bg-surface overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-sm font-medium rounded whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-saffron text-ink'
                  : 'bg-ink-soft/10 text-ink hover:bg-ink-soft/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'location' && <LocationFinder />}
          {activeTab === 'timezone' && <TimeZoneConverter />}
          {activeTab === 'ayanamsha' && <AyanamshaCalculator />}
          {activeTab === 'date' && <DateConverter />}
          {activeTab === 'kphorary' && <KpHoraryNumberTool />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-line bg-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded bg-saffron text-ink hover:bg-saffron/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
