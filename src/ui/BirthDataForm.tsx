'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { localCivilToUtc, resolveTimeZone } from '@/src/sources/places/timezone';
import { PlaceSearchInput } from './PlaceSearchInput';
import { useSettings } from './SettingsPanel';

export interface BirthData {
  name: string;
  fatherName: string;
  motherName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  timeOfBirth: string;
  place: string;
  latitude: number;
  longitude: number;
  utcOffset: number;
  /** The IANA zone of the place (Asia/Kolkata, Europe/London…), when it is known. */
  timeZone?: string;
}

export interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
  initialData?: Partial<BirthData> | null;
}

/** "+5:30", "-4:00", "+5:21" for an offset in minutes. */
export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? '-' : '+';
  const m = Math.round(Math.abs(minutes));
  return `${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

const ADJUSTMENT_TA: Record<string, string> = {
  wartime: 'போர்க்கால நேரம் (War time)',
  daylight: 'பகல் சேமிப்பு நேரம் (DST)',
  historical: 'பழைய உள்ளூர் நேரம் (local mean time)',
};

const field = 'w-full px-4 py-2 rounded-lg border text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors';
const ok = 'border-line bg-surface hover:border-ink-soft/30';
const bad = 'border-rose bg-rose-soft/10';

export function BirthDataForm({ onSubmit, isLoading = false, initialData = null }: BirthDataFormProps) {
  const { settings } = useSettings();
  const home = settings.astrologerPlace;
  const [formData, setFormData] = useState<BirthData>({
    name: '',
    fatherName: '',
    motherName: '',
    gender: 'male',
    dateOfBirth: '',
    timeOfBirth: '',
    place: home.name,
    latitude: home.latitude,
    longitude: home.longitude,
    utcOffset: 330,
    timeZone: home.timeZone,
    ...(initialData ?? {}),
  });
  // A chart saved before the atlas keeps the offset it was saved with until the astrologer accepts the IANA one
  const [autoOffset, setAutoOffset] = useState(() => !(initialData && initialData.utcOffset != null && !initialData.timeZone));
  const [showCoordinates, setShowCoordinates] = useState(false);

  // Populate the form when a saved chart is loaded (File → Open / Recent Charts)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      setAutoOffset(!(initialData.utcOffset != null && !initialData.timeZone));
    }
  }, [initialData]);

  // A new chart starts at the astrologer's place once the settings are read
  useEffect(() => {
    if (initialData) return;
    setFormData((prev) => (prev.dateOfBirth || prev.name ? prev : { ...prev, place: home.name, latitude: home.latitude, longitude: home.longitude, timeZone: home.timeZone }));
  }, [home.name, home.latitude, home.longitude, home.timeZone, initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // The zone of the place (the atlas's, else from the coordinates) and the offset in force at the birth (IANA history: war time, DST)
  const zone = useMemo(
    () => (formData.timeZone ? { zoneId: formData.timeZone, method: 'curated' as const } : resolveTimeZone(formData.latitude, formData.longitude)),
    [formData.timeZone, formData.latitude, formData.longitude],
  );
  const resolved = useMemo(() => {
    if (!formData.dateOfBirth || !formData.timeOfBirth) return null;
    return localCivilToUtc(formData.dateOfBirth, formData.timeOfBirth, zone.zoneId, { ambiguityChoice: 'earlier' });
  }, [formData.dateOfBirth, formData.timeOfBirth, zone.zoneId]);
  const resolvedOffset = resolved?.status === 'ok' ? resolved.offsetMinutes : null;

  useEffect(() => {
    if (autoOffset && resolvedOffset != null) setFormData((prev) => (prev.utcOffset === resolvedOffset ? prev : { ...prev, utcOffset: resolvedOffset }));
  }, [autoOffset, resolvedOffset]);

  const clearError = (name: string) => {
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
      // coordinates typed by hand: the zone comes from them, not from an atlas place
      ...(name === 'latitude' || name === 'longitude' ? { timeZone: undefined } : {}),
    }));
    clearError(name);
  };

  // Handle field blur (mark as touched)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof BirthData]);
  };

  // Validate individual field
  const validateField = (name: string, value: any) => {
    const newErrors: Record<string, string> = {};
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) newErrors.name = 'பெயர் குறைந்தது 2 எழுத்து (Name must be at least 2 characters)';
        break;
      case 'dateOfBirth':
        if (!value) newErrors.dateOfBirth = 'பிறந்த தேதி தேவை (Date of birth is required)';
        else if (new Date(value) > new Date()) newErrors.dateOfBirth = 'எதிர்காலத் தேதி கூடாது (Birth date cannot be in the future)';
        break;
      case 'timeOfBirth':
        if (!value) newErrors.timeOfBirth = 'பிறந்த நேரம் தேவை (Time of birth is required)';
        break;
      case 'place':
        if (!value || value.trim().length < 2) newErrors.place = 'ஊர் தேவை (Place is required)';
        break;
      case 'latitude':
        if (value === '' || isNaN(value) || value < -90 || value > 90) newErrors.latitude = 'Latitude must be between -90 and 90';
        break;
      case 'longitude':
        if (value === '' || isNaN(value) || value < -180 || value > 180) newErrors.longitude = 'Longitude must be between -180 and 180';
        break;
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'பெயர் தேவை (Name is required)';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'பிறந்த தேதி தேவை (Date of birth is required)';
    if (!formData.timeOfBirth) newErrors.timeOfBirth = 'பிறந்த நேரம் தேவை (Time of birth is required)';
    if (!formData.place || formData.place.trim().length < 2) newErrors.place = 'ஊர் தேவை (Place is required)';
    if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) newErrors.latitude = 'Invalid latitude';
    if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) newErrors.longitude = 'Invalid longitude';
    if (!Number.isFinite(formData.utcOffset)) newErrors.utcOffset = 'UTC offset தேவை';
    setErrors(newErrors);
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(newErrors).map((k) => [k, true])) }));
    if (newErrors.latitude || newErrors.longitude) setShowCoordinates(true);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) onSubmit({ ...formData, timeZone: zone.method === 'curated' ? zone.zoneId : undefined });
  };

  const renderFieldError = (fieldName: string) => {
    if (touched[fieldName] && errors[fieldName]) return <div className="mt-1 text-sm text-rose">{errors[fieldName]}</div>;
    return null;
  };

  const adjustment = resolved?.status === 'ok' ? resolved.provenance.adjustment : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">பெயர் (Name) <span className="text-rose">*</span></label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="ஜாதகரின் பெயர் (Person's name)"
          className={`${field} ${touched.name && errors.name ? bad : ok}`}
        />
        {renderFieldError('name')}
      </div>

      {/* Gender and the optional names */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">பாலினம் (Gender)</label>
          <select name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} className={`${field} ${ok} cursor-pointer`}>
            <option value="male">ஆண் (Male)</option>
            <option value="female">பெண் (Female)</option>
            <option value="other">மற்றவை (Other)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-2">தந்தை பெயர் (Father)</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="விருப்பம் (Optional)" className={`${field} ${ok}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-2">தாய் பெயர் (Mother)</label>
          <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="விருப்பம் (Optional)" className={`${field} ${ok}`} />
        </div>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">தேதி (Date of Birth) <span className="text-rose">*</span></label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} onBlur={handleBlur}
            className={`${field} ${touched.dateOfBirth && errors.dateOfBirth ? bad : ok}`} />
          {renderFieldError('dateOfBirth')}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-2">நேரம் (Time of Birth) <span className="text-rose">*</span></label>
          <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleChange} onBlur={handleBlur}
            className={`${field} ${touched.timeOfBirth && errors.timeOfBirth ? bad : ok}`} />
          {renderFieldError('timeOfBirth')}
        </div>
      </div>

      {/* Place: the atlas fills the coordinates and the time zone */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">பிறந்த ஊர் (Place) <span className="text-rose">*</span></label>
        <PlaceSearchInput
          inputName="place"
          value={formData.place}
          onText={(text) => { setFormData((prev) => ({ ...prev, place: text })); clearError('place'); }}
          onPick={(p) => {
            setFormData((prev) => ({ ...prev, place: p.name, latitude: p.latitude, longitude: p.longitude, timeZone: p.timeZone }));
            setAutoOffset(true);
            clearError('place'); clearError('latitude'); clearError('longitude');
          }}
          className={`${field} ${touched.place && errors.place ? bad : ok}`}
        />
        {renderFieldError('place')}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-saffron/15 px-2.5 py-1 text-ink tabular-nums">
            {Number.isFinite(formData.latitude) ? formData.latitude.toFixed(4) : '—'}°, {Number.isFinite(formData.longitude) ? formData.longitude.toFixed(4) : '—'}°
          </span>
          <span className={`rounded-full px-2.5 py-1 tabular-nums ${zone.method === 'approximate' ? 'bg-rose/15 text-rose' : 'bg-teal/15 text-teal'}`} title={zone.zoneId}>
            UTC {Number.isFinite(formData.utcOffset) ? formatOffset(formData.utcOffset) : '—'} · {zone.zoneId}{zone.method === 'approximate' ? ' (தோராயம்)' : ''}
          </span>
          {adjustment && ADJUSTMENT_TA[adjustment] && (
            <span className="rounded-full bg-indigo/15 px-2.5 py-1 text-indigo">{ADJUSTMENT_TA[adjustment]}</span>
          )}
          <button type="button" onClick={() => setShowCoordinates((s) => !s)} className="text-saffron hover:underline">
            {showCoordinates ? 'மறை' : 'அட்ச/தீர்க்க ரேகை, நேர மண்டலம் மாற்று'}
          </button>
        </div>
        {!autoOffset && resolvedOffset != null && resolvedOffset !== formData.utcOffset && (
          <div className="mt-2 rounded-lg border border-rose/40 bg-rose/10 p-2 text-xs text-ink">
            சேமித்த நேர வித்தியாசம் UTC {formatOffset(formData.utcOffset)}; இந்த ஊருக்கும் தேதிக்கும் IANA நேர மண்டலப்படி UTC {formatOffset(resolvedOffset)}
            {adjustment && ADJUSTMENT_TA[adjustment] ? ` (${ADJUSTMENT_TA[adjustment]})` : ''}.
            <button type="button" onClick={() => setAutoOffset(true)} className="ml-2 font-semibold text-saffron hover:underline">IANA படி திருத்து</button>
          </div>
        )}
        {resolved && resolved.status === 'nonexistent' && (
          <p className="mt-2 text-xs text-rose">இந்த நேரம் அந்த ஊரில் இல்லை (கடிகாரம் முன்னே நகர்த்தப்பட்ட நேரம்). நேரத்தையோ UTC offset-ஐயோ சரிபார்க்கவும்.</p>
        )}
      </div>

      {/* Coordinates and offset by hand (a village not in the atlas, or a saved chart's own offset) */}
      {showCoordinates && (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-line bg-bg p-3 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">அட்சரேகை (Latitude)</label>
            <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} onBlur={handleBlur} step="0.0001"
              className={`${field} ${touched.latitude && errors.latitude ? bad : ok}`} />
            {renderFieldError('latitude')}
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">தீர்க்கரேகை (Longitude)</label>
            <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} onBlur={handleBlur} step="0.0001"
              className={`${field} ${touched.longitude && errors.longitude ? bad : ok}`} />
            {renderFieldError('longitude')}
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-soft mb-1">UTC Offset (நிமிடங்கள்)</label>
            <input type="number" name="utcOffset" value={formData.utcOffset}
              onChange={(e) => { setAutoOffset(false); handleChange(e); }}
              placeholder="330 = IST" className={`${field} ${ok}`} />
            <label className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-soft">
              <input type="checkbox" checked={autoOffset} onChange={(e) => setAutoOffset(e.target.checked)} className="accent-saffron" />
              IANA நேர மண்டலப்படி தானாக
            </label>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-saffron text-ink rounded-lg font-semibold hover:bg-saffron/90 disabled:bg-ink-soft/30 disabled:text-ink-soft/50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'ஜாதகம் கணக்கிடுகிறது...' : 'ஜாதகம் கணக்கிடு (Calculate Chart)'}
      </button>
    </form>
  );
}
