'use client';

import { useState, FormEvent } from 'react';

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
}

export interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

export function BirthDataForm({ onSubmit, isLoading = false }: BirthDataFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    name: 'Test Person',
    fatherName: '',
    motherName: '',
    gender: 'male',
    dateOfBirth: '2009-06-21',
    timeOfBirth: '16:30',
    place: 'Erode',
    latitude: 11.341,
    longitude: 77.7172,
    utcOffset: 330,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
        if (!value || value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          const date = new Date(value);
          if (date > new Date()) {
            newErrors.dateOfBirth = 'Birth date cannot be in the future';
          }
        }
        break;
      case 'timeOfBirth':
        if (!value) {
          newErrors.timeOfBirth = 'Time of birth is required';
        }
        break;
      case 'place':
        if (!value || value.trim().length < 2) {
          newErrors.place = 'Place must be at least 2 characters';
        }
        break;
      case 'latitude':
        if (value === '' || isNaN(value) || value < -90 || value > 90) {
          newErrors.latitude = 'Latitude must be between -90 and 90';
        }
        break;
      case 'longitude':
        if (value === '' || isNaN(value) || value < -180 || value > 180) {
          newErrors.longitude = 'Longitude must be between -180 and 180';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = 'Time of birth is required';
    }

    if (!formData.place || formData.place.trim().length < 2) {
      newErrors.place = 'Place is required';
    }

    if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Invalid latitude';
    }

    if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Invalid longitude';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (touched[fieldName] && errors[fieldName]) {
      return <div className="mt-1 text-sm text-rose">{errors[fieldName]}</div>;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">பெயர் (Name)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Person's name"
          className={`w-full px-4 py-2 rounded-lg border ${
            touched.name && errors.name
              ? 'border-rose bg-rose-soft/10'
              : 'border-line bg-surface hover:border-ink-soft/30'
          } text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
        />
        {renderFieldError('name')}
      </div>

      {/* Optional Fields Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-2">பிதா பெயர் (Father's Name)</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-4 py-2 rounded-lg border border-line bg-surface hover:border-ink-soft/30 text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-soft mb-2">தாய் பெயர் (Mother's Name)</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-4 py-2 rounded-lg border border-line bg-surface hover:border-ink-soft/30 text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors"
          />
        </div>
      </div>

      {/* Gender Field */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">பாலினம் (Gender)</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-2 rounded-lg border border-line bg-surface hover:border-ink-soft/30 text-ink focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors cursor-pointer"
        >
          <option value="male">ஆண் (Male)</option>
          <option value="female">பெண் (Female)</option>
          <option value="other">மற்றவை (Other)</option>
        </select>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            தேதி (Date of Birth) <span className="text-rose">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 rounded-lg border ${
              touched.dateOfBirth && errors.dateOfBirth
                ? 'border-rose bg-rose-soft/10'
                : 'border-line bg-surface hover:border-ink-soft/30'
            } text-ink focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
          />
          {renderFieldError('dateOfBirth')}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            நேரம் (Time of Birth) <span className="text-rose">*</span>
          </label>
          <input
            type="time"
            name="timeOfBirth"
            value={formData.timeOfBirth}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 rounded-lg border ${
              touched.timeOfBirth && errors.timeOfBirth
                ? 'border-rose bg-rose-soft/10'
                : 'border-line bg-surface hover:border-ink-soft/30'
            } text-ink focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
          />
          {renderFieldError('timeOfBirth')}
        </div>
      </div>

      {/* Place Field */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          இடம் (Place) <span className="text-rose">*</span>
        </label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="City or place of birth"
          className={`w-full px-4 py-2 rounded-lg border ${
            touched.place && errors.place
              ? 'border-rose bg-rose-soft/10'
              : 'border-line bg-surface hover:border-ink-soft/30'
          } text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
        />
        {renderFieldError('place')}
      </div>

      {/* Coordinates Row */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          அட்சரேகை & தீர்க்கரேகை (Latitude & Longitude)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Latitude (-90 to 90)"
              step="0.0001"
              className={`w-full px-4 py-2 rounded-lg border ${
                touched.latitude && errors.latitude
                  ? 'border-rose bg-rose-soft/10'
                  : 'border-line bg-surface hover:border-ink-soft/30'
              } text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
            />
            {renderFieldError('latitude')}
          </div>

          <div>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Longitude (-180 to 180)"
              step="0.0001"
              className={`w-full px-4 py-2 rounded-lg border ${
                touched.longitude && errors.longitude
                  ? 'border-rose bg-rose-soft/10'
                  : 'border-line bg-surface hover:border-ink-soft/30'
              } text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors`}
            />
            {renderFieldError('longitude')}
          </div>
        </div>
      </div>

      {/* UTC Offset */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">UTC Offset (நிமிடங்கள்)</label>
        <input
          type="number"
          name="utcOffset"
          value={formData.utcOffset}
          onChange={handleChange}
          placeholder="Minutes (e.g., 330 for IST)"
          className="w-full px-4 py-2 rounded-lg border border-line bg-surface hover:border-ink-soft/30 text-ink placeholder-ink-soft/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/30 transition-colors"
        />
      </div>

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
