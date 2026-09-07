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

export function ToolsPanel({ isOpen, onClose }: ToolsPanelProps) {
  const [activeTab, setActiveTab] = useState<'location' | 'timezone' | 'ayanamsha' | 'date'>('location');

  if (!isOpen) return null;

  const tabs = [
    { id: 'location', label: 'Location Finder', component: LocationFinder },
    { id: 'timezone', label: 'Time Zone Converter', component: TimeZoneConverter },
    { id: 'ayanamsha', label: 'Ayanamsha Calculator', component: AyanamshaCalculator },
    { id: 'date', label: 'Date Converter', component: DateConverter },
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
