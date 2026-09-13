'use client';

import React, { useState } from 'react';
import {
  AYANAMSA_OPTIONS,
  TIMEZONE_OPTIONS,
  FORM_CLASSES,
  VALIDATION_MESSAGES,
  CITY_COORDINATES,
} from '@/app/lib/constants';

/**
 * ChartForm - Birth Chart Creation Form Component
 *
 * Features:
 * - Bilingual support (English/Tamil)
 * - Form validation with error display
 * - Responsive layout (mobile-first)
 * - Auto-populate coordinates from city names
 * - Ayanamsa and timezone selection
 */

interface ChartFormData {
  name: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  latitude: string;
  longitude: string;
  timezone: string;
  ayanamsa: string;
}

interface ChartFormErrors {
  [key: string]: string;
}

interface ChartFormProps {
  onSubmit: (data: ChartFormData) => Promise<void>;
  initialData?: Partial<ChartFormData>;
  loading?: boolean;
}

export default function ChartForm({
  onSubmit,
  initialData,
  loading: externalLoading = false,
}: ChartFormProps) {
  const [formData, setFormData] = useState<ChartFormData>({
    name: initialData?.name || '',
    birth_date: initialData?.birth_date || '',
    birth_time: initialData?.birth_time || '12:00:00',
    birth_location: initialData?.birth_location || 'Chennai, India',
    latitude: initialData?.latitude || '13.0827',
    longitude: initialData?.longitude || '80.2707',
    timezone: initialData?.timezone || 'Asia/Kolkata',
    ayanamsa: initialData?.ayanamsa || 'lahiri',
  });

  const [errors, setErrors] = useState<ChartFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: ChartFormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'பெயர் தேவை (Chart name required)';
    } else if (formData.name.length > 255) {
      newErrors.name = VALIDATION_MESSAGES.NAME_TOO_LONG;
    }

    // Validate birth date
    if (!formData.birth_date) {
      newErrors.birth_date = 'தேதி தேவை (Birth date required)';
    } else {
      const birthDate = new Date(formData.birth_date);
      if (isNaN(birthDate.getTime())) {
        newErrors.birth_date = VALIDATION_MESSAGES.INVALID_DATE;
      }
    }

    // Validate birth time
    if (!formData.birth_time) {
      newErrors.birth_time = 'நேரம் தேவை (Birth time required)';
    }

    // Validate birth location
    if (!formData.birth_location.trim()) {
      newErrors.birth_location = 'இடம் தேவை (Birth location required)';
    } else if (formData.birth_location.length > 100) {
      newErrors.birth_location = VALIDATION_MESSAGES.PLACE_TOO_LONG;
    }

    // Validate latitude
    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = VALIDATION_MESSAGES.INVALID_LATITUDE;
      }
    }

    // Validate longitude
    if (formData.longitude) {
      const lon = parseFloat(formData.longitude);
      if (isNaN(lon) || lon < -180 || lon > 180) {
        newErrors.longitude = VALIDATION_MESSAGES.INVALID_LONGITUDE;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Auto-populate coordinates if known city
    if (name === 'birth_location' && CITY_COORDINATES[value]) {
      const { lat, lon } = CITY_COORDINATES[value];
      setFormData((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lon.toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      // Form submission handled by parent component
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <div className={FORM_CLASSES.CONTAINER}>
      <h2 className={FORM_CLASSES.TITLE}>
        புதிய ஜாதகம் (New Birth Chart)
      </h2>

      {errors.submit && (
        <div className="p-4 bg-red-100 border border-red-400 rounded-md mb-4">
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={FORM_CLASSES.FORM}>
        {/* Chart Name */}
        <div className={FORM_CLASSES.FORM_GROUP}>
          <label htmlFor="name" className={FORM_CLASSES.LABEL}>
            பெயர் (Chart Name) *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${FORM_CLASSES.INPUT_BASE} ${
              errors.name ? FORM_CLASSES.INPUT_ERROR : FORM_CLASSES.INPUT_VALID
            }`}
            placeholder="உங்கள் பெயர் (Your name)"
            disabled={isLoading}
          />
          {errors.name && <p className={FORM_CLASSES.ERROR_TEXT}>{errors.name}</p>}
        </div>

        {/* Birth Date and Time */}
        <div className={FORM_CLASSES.GRID_2}>
          <div className={FORM_CLASSES.FORM_GROUP}>
            <label htmlFor="birth_date" className={FORM_CLASSES.LABEL}>
              பிறந்த தேதி (Birth Date) *
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className={`${FORM_CLASSES.INPUT_BASE} ${
                errors.birth_date ? FORM_CLASSES.INPUT_ERROR : FORM_CLASSES.INPUT_VALID
              }`}
              disabled={isLoading}
            />
            {errors.birth_date && (
              <p className={FORM_CLASSES.ERROR_TEXT}>{errors.birth_date}</p>
            )}
          </div>

          <div className={FORM_CLASSES.FORM_GROUP}>
            <label htmlFor="birth_time" className={FORM_CLASSES.LABEL}>
              பிறந்த நேரம் (Birth Time) *
            </label>
            <input
              type="time"
              id="birth_time"
              name="birth_time"
              value={formData.birth_time}
              onChange={handleChange}
              className={`${FORM_CLASSES.INPUT_BASE} ${FORM_CLASSES.INPUT_VALID}`}
              disabled={isLoading}
            />
            {errors.birth_time && (
              <p className={FORM_CLASSES.ERROR_TEXT}>{errors.birth_time}</p>
            )}
          </div>
        </div>

        {/* Birth Location */}
        <div className={FORM_CLASSES.FORM_GROUP}>
          <label htmlFor="birth_location" className={FORM_CLASSES.LABEL}>
            பிறந்த இடம் (Birth Location) *
          </label>
          <input
            type="text"
            id="birth_location"
            name="birth_location"
            value={formData.birth_location}
            onChange={handleChange}
            className={`${FORM_CLASSES.INPUT_BASE} ${
              errors.birth_location ? FORM_CLASSES.INPUT_ERROR : FORM_CLASSES.INPUT_VALID
            }`}
            placeholder="Chennai, India"
            list="city-list"
            disabled={isLoading}
          />
          <datalist id="city-list">
            {Object.keys(CITY_COORDINATES).map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
          {errors.birth_location && (
            <p className={FORM_CLASSES.ERROR_TEXT}>{errors.birth_location}</p>
          )}
        </div>

        {/* Coordinates */}
        <div className={FORM_CLASSES.GRID_2}>
          <div className={FORM_CLASSES.FORM_GROUP}>
            <label htmlFor="latitude" className={FORM_CLASSES.LABEL}>
              அட்சரேகை (Latitude) *
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="0.0001"
              className={`${FORM_CLASSES.INPUT_BASE} ${
                errors.latitude ? FORM_CLASSES.INPUT_ERROR : FORM_CLASSES.INPUT_VALID
              }`}
              placeholder="13.0827"
              disabled={isLoading}
            />
            {errors.latitude && (
              <p className={FORM_CLASSES.ERROR_TEXT}>{errors.latitude}</p>
            )}
          </div>

          <div className={FORM_CLASSES.FORM_GROUP}>
            <label htmlFor="longitude" className={FORM_CLASSES.LABEL}>
              தீர்க்ஷரேகை (Longitude) *
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="0.0001"
              className={`${FORM_CLASSES.INPUT_BASE} ${
                errors.longitude ? FORM_CLASSES.INPUT_ERROR : FORM_CLASSES.INPUT_VALID
              }`}
              placeholder="80.2707"
              disabled={isLoading}
            />
            {errors.longitude && (
              <p className={FORM_CLASSES.ERROR_TEXT}>{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* Timezone */}
        <div className={FORM_CLASSES.FORM_GROUP}>
          <label htmlFor="timezone" className={FORM_CLASSES.LABEL}>
            நேரமண்டபம் (Timezone)
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className={`${FORM_CLASSES.INPUT_BASE} ${FORM_CLASSES.INPUT_VALID}`}
            disabled={isLoading}
          >
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ayanamsa */}
        <div className={FORM_CLASSES.FORM_GROUP}>
          <label htmlFor="ayanamsa" className={FORM_CLASSES.LABEL}>
            அயனாமசா (Ayanamsa)
          </label>
          <select
            id="ayanamsa"
            name="ayanamsa"
            value={formData.ayanamsa}
            onChange={handleChange}
            className={`${FORM_CLASSES.INPUT_BASE} ${FORM_CLASSES.INPUT_VALID}`}
            disabled={isLoading}
          >
            {AYANAMSA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={FORM_CLASSES.BUTTON_SUBMIT}
        >
          {isLoading ? 'ஜாதகம் கணக்கிடுகிறது...' : 'ஜாதகம் கணக்கிடு'}
        </button>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          * = தேவையான புலங்கள் (Required fields)
        </p>
      </form>
    </div>
  );
}
