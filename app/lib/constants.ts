/**
 * Application Constants
 * Shared constants for form options, validation rules, and system settings
 */

// Ayanamsa systems (different zodiac correction methods)
export const AYANAMSA_OPTIONS = [
  { value: 'lahiri', label: 'Lahiri (Default)', tamil: 'லாहिरी' },
  { value: 'raman', label: 'Raman', tamil: 'ராமன்' },
  { value: 'kp', label: 'K.P. (Krishnamurti)', tamil: 'கே.பி.' },
  { value: 'true_citra', label: 'True Citra', tamil: 'உண்மை சித்ரா' },
];

// Timezone options
export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)', tamil: 'இந்திய நேரம்' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)', tamil: 'சிங்கப்பூர் நேரம்' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)', tamil: 'துபாய் நேரம்' },
  { value: 'UTC', label: 'UTC (Universal)', tamil: 'பொதுவான நேரம்' },
  { value: 'America/New_York', label: 'America/New_York (EST)', tamil: 'நியூயார்க் நேரம்' },
  { value: 'Europe/London', label: 'Europe/London (GMT)', tamil: 'லண்டன் நேரம்' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT)', tamil: 'சிட்னி நேரம்' },
];

// Node type options
export const NODE_TYPE_OPTIONS = [
  { value: 'mean', label: 'Mean Node (Default)', tamil: 'சராசரி முனை' },
  { value: 'true', label: 'True Node', tamil: 'உண்மையான முனை' },
];

// Zodiac signs
export const ZODIAC_SIGNS = [
  { name: 'Aries', tamil: 'மேஷம்', symbol: '♈' },
  { name: 'Taurus', tamil: 'ரிஷபம்', symbol: '♉' },
  { name: 'Gemini', tamil: 'மிதுனம்', symbol: '♊' },
  { name: 'Cancer', tamil: 'கர்கடகம்', symbol: '♋' },
  { name: 'Leo', tamil: 'சிம்ஹம்', symbol: '♌' },
  { name: 'Virgo', tamil: 'கன்னர', symbol: '♍' },
  { name: 'Libra', tamil: 'துலாம்', symbol: '♎' },
  { name: 'Scorpio', tamil: 'வृश्చिকम्', symbol: '♏' },
  { name: 'Sagittarius', tamil: 'தனुஷ்', symbol: '♐' },
  { name: 'Capricorn', tamil: 'மकरम्', symbol: '♑' },
  { name: 'Aquarius', tamil: 'कुम्भम्', symbol: '♒' },
  { name: 'Pisces', tamil: 'मीनम्', symbol: '♓' },
];

// Planet symbols and names
export const PLANETS = [
  { name: 'Sun', tamil: 'சூரியன்', symbol: '☉' },
  { name: 'Moon', tamil: 'சந்திரன்', symbol: '☽' },
  { name: 'Mars', tamil: 'செவ்வாய்', symbol: '♂' },
  { name: 'Mercury', tamil: 'புதன்', symbol: '☿' },
  { name: 'Jupiter', tamil: 'குரு', symbol: '♃' },
  { name: 'Venus', tamil: 'சுக்கிரன்', symbol: '♀' },
  { name: 'Saturn', tamil: 'சனி', symbol: '♄' },
  { name: 'Rahu', tamil: 'ராகு', symbol: '☢' },
  { name: 'Ketu', tamil: 'கேது', symbol: '☬' },
];

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  CHARTS: {
    CREATE: `${API_BASE_URL}/charts/create`,
    GET: (id: string) => `${API_BASE_URL}/charts/${id}`,
    LIST: `${API_BASE_URL}/charts`,
    UPDATE: (id: string) => `${API_BASE_URL}/charts/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/charts/${id}`,
  },
  CONSULTATIONS: {
    CREATE: (chartId: string) => `${API_BASE_URL}/charts/${chartId}/consultations`,
    GET: (chartId: string, id: string) => `${API_BASE_URL}/charts/${chartId}/consultations/${id}`,
    LIST: (chartId: string) => `${API_BASE_URL}/charts/${chartId}/consultations`,
    UPDATE: (chartId: string, id: string) => `${API_BASE_URL}/charts/${chartId}/consultations/${id}`,
    DELETE: (chartId: string, id: string) => `${API_BASE_URL}/charts/${chartId}/consultations/${id}`,
  },
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required | இந்த புல தேவை',
  INVALID_EMAIL: 'Invalid email address | தவறான மின்னஞ்சல் முகவரி',
  INVALID_DATE: 'Invalid date format | தவறான தேதி வடிவம்',
  INVALID_TIME: 'Invalid time format | தவறான நேர வடிவம்',
  INVALID_LATITUDE: 'Latitude must be between -90 and 90 | அட்சரேகை -90 முதல் 90 வரை இருக்க வேண்டும்',
  INVALID_LONGITUDE: 'Longitude must be between -180 and 180 | தீர்க்ஷரேகை -180 முதல் 180 வரை இருக்க வேண்டும்',
  INVALID_COORDINATES: 'Invalid coordinates | தவறான ஆயத்தொலைவு',
  NAME_TOO_LONG: 'Name is too long (max 255 characters) | பெயர் மிக நீளமாக உள்ளது (அதிகம் 255 எழுத்துக்கள்)',
  PLACE_TOO_LONG: 'Location name is too long (max 100 characters) | இட பெயர் மிக நீளமாக உள்ளது',
};

// UI Constants
export const FORM_CLASSES = {
  CONTAINER: 'w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md',
  TITLE: 'text-2xl font-bold mb-6 text-center text-gray-800',
  FORM: 'space-y-4',
  FORM_GROUP: 'flex flex-col',
  LABEL: 'block text-sm font-medium text-gray-700 mb-1',
  INPUT_BASE: 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500',
  INPUT_ERROR: 'border-red-500',
  INPUT_VALID: 'border-gray-300',
  ERROR_TEXT: 'text-red-500 text-sm mt-1',
  BUTTON_SUBMIT: 'w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  GRID_2: 'grid grid-cols-2 gap-4',
};

// Coordinate defaults (for popular cities)
export const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  'Chennai, India': { lat: 13.0827, lon: 80.2707 },
  'Mumbai, India': { lat: 19.0760, lon: 72.8777 },
  'Delhi, India': { lat: 28.7041, lon: 77.1025 },
  'Bangalore, India': { lat: 12.9716, lon: 77.5946 },
  'Kolkata, India': { lat: 22.5726, lon: 88.3639 },
  'Singapore': { lat: 1.3521, lon: 103.8198 },
  'London, UK': { lat: 51.5074, lon: -0.1278 },
  'New York, USA': { lat: 40.7128, lon: -74.0060 },
  'Sydney, Australia': { lat: -33.8688, lon: 151.2093 },
};
