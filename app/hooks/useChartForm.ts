/**
 * useChartForm - Custom Hook for Chart Form Management
 *
 * Handles form state, validation, and submission logic
 */

import { useState } from 'react';
import { ENDPOINTS } from '@/app/lib/constants';

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

interface ChartFormError {
  [key: string]: string;
}

interface UseChartFormReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  submitChart: (data: ChartFormData) => Promise<any>;
  clearError: () => void;
  clearSuccess: () => void;
}

export function useChartForm(): UseChartFormReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitChart = async (data: ChartFormData): Promise<any> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get access token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found. Please login first.');
      }

      // Format data for API
      const payload = {
        name: data.name.trim(),
        birth_date: data.birth_date,
        birth_time: data.birth_time,
        birth_location: data.birth_location.trim(),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        timezone: data.timezone,
        ayanamsa: data.ayanamsa,
      };

      // Submit to API
      const response = await fetch(ENDPOINTS.CHARTS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to create chart';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccess(true);
      return result.chart;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while creating the chart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(false);

  return {
    loading,
    error,
    success,
    submitChart,
    clearError,
    clearSuccess,
  };
}
