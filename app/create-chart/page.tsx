'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChartForm from '@/app/components/ChartForm';
import { useChartForm } from '@/app/hooks/useChartForm';

/**
 * CreateChart Page
 *
 * Page for creating a new birth chart
 * Handles form submission and redirects to chart view on success
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

export default function CreateChartPage() {
  const router = useRouter();
  const { loading, error, success, submitChart, clearError } = useChartForm();
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdChartId, setCreatedChartId] = useState<string | null>(null);

  const handleSubmit = async (formData: ChartFormData) => {
    try {
      clearError();
      const chart = await submitChart(formData);

      setCreatedChartId(chart.id);
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/chart/${chart.id}`);
      }, 2000);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create chart:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md animate-pulse">
          <p className="font-semibold">ஜாதகம் வெற்றிகரமாக உருவாக்கப்பட்டது!</p>
          <p className="text-sm">Redirecting to chart view...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={clearError}
            className="text-xs mt-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          புதிய ஜாதகம் உருவாக்கவும்
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Create a new birth chart by entering your birth details
        </p>

        {/* Chart Form */}
        <ChartForm
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">தேவையான தகவல்</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-orange-600 mb-2">முக்கியமான புல்</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ பெயர் (Chart Name)</li>
                <li>✓ பிறந்த தேதி (Birth Date)</li>
                <li>✓ பிறந்த நேரம் (Birth Time)</li>
                <li>✓ பிறந்த இடம் (Birth Location)</li>
                <li>✓ ஆயத்தொலைவு (Coordinates)</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-orange-600 mb-2">விருப்பமான புல்</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>○ நேரமண்டபம் (Timezone)</li>
                <li>○ அயனாமசா (Ayanamsa)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 குறிப்பு</h4>
            <p className="text-sm text-blue-800">
              நீங்கள் சரியான பிறந்த நேரம் தெரியவில்லை என்றால், அதை பிறந்த நேரம் தெரியாத ஜாதகமாக கணக்கிடலாம்.
              ஒரு அறியப்பட்ட நகரத்தை தேர்ந்தெடுக்கவும், மற்றும் ஆயத்தொலைவு தானாக நிரப்பப்படும்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
