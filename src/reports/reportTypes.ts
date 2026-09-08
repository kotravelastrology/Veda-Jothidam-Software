// Report Types and Templates for Vedic Astrology

export interface ReportConfig {
  includeChart: boolean;
  includePlanetaryPositions: boolean;
  includeDasha: boolean;
  includeTransits: boolean;
  includeYogasAndDoshas: boolean;
  includeShadbala: boolean;
  includeCompatibility: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'html' | 'excel';
  language: 'english' | 'tamil';
}

export interface HoroscopeReport {
  nativeName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  lagna: string;
  moon: string;
  sun: string;
  overview: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface DashaReport {
  nativeName: string;
  startDate: string;
  endDate: string;
  periods: DashaPeriod[];
  interpretation: string;
  upcomingEvents: string[];
}

export interface DashaPeriod {
  lord: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  interpretation: string;
  subPeriods?: SubPeriod[];
}

export interface SubPeriod {
  lord: string;
  startDate: string;
  endDate: string;
  interpretation: string;
}

export interface TransitReport {
  nativeName: string;
  dateOfReport: string;
  currentTransits: PlanetTransit[];
  upcomingTransits: PlanetTransit[];
  analysis: string;
  recommendations: string[];
}

export interface PlanetTransit {
  planet: string;
  currentSign: string;
  natalSign: string;
  influence: string;
  startDate: string;
  endDate: string;
  strengthLevel: 'strong' | 'moderate' | 'weak';
}

export interface CompatibilityReport {
  person1Name: string;
  person2Name: string;
  gunaScore: number;
  gunaDetail: GunaAnalysis;
  overallScore: number;
  analysis: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

export interface GunaAnalysis {
  varnaGuna: number;
  vasya: number;
  tara: number;
  yoni: number;
  graha: number;
  gana: number;
  bhakoot: number;
  nadi: number;
}

// Default Report Templates
export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  includeChart: true,
  includePlanetaryPositions: true,
  includeDasha: true,
  includeTransits: true,
  includeYogasAndDoshas: true,
  includeShadbala: true,
  includeCompatibility: false,
  includeRecommendations: true,
  format: 'pdf',
  language: 'english',
};

export const COMPREHENSIVE_REPORT_CONFIG: ReportConfig = {
  includeChart: true,
  includePlanetaryPositions: true,
  includeDasha: true,
  includeTransits: true,
  includeYogasAndDoshas: true,
  includeShadbala: true,
  includeCompatibility: true,
  includeRecommendations: true,
  format: 'pdf',
  language: 'english',
};

export const QUICK_REPORT_CONFIG: ReportConfig = {
  includeChart: true,
  includePlanetaryPositions: true,
  includeDasha: false,
  includeTransits: true,
  includeYogasAndDoshas: false,
  includeShadbala: false,
  includeCompatibility: false,
  includeRecommendations: true,
  format: 'pdf',
  language: 'english',
};

export const TRANSIT_REPORT_CONFIG: ReportConfig = {
  includeChart: false,
  includePlanetaryPositions: true,
  includeDasha: false,
  includeTransits: true,
  includeYogasAndDoshas: false,
  includeShadbala: false,
  includeCompatibility: false,
  includeRecommendations: true,
  format: 'pdf',
  language: 'english',
};

export const COMPATIBILITY_REPORT_CONFIG: ReportConfig = {
  includeChart: false,
  includePlanetaryPositions: false,
  includeDasha: false,
  includeTransits: false,
  includeYogasAndDoshas: false,
  includeShadbala: false,
  includeCompatibility: true,
  includeRecommendations: true,
  format: 'pdf',
  language: 'english',
};

// Report Templates for different languages
export const REPORT_TEMPLATES = {
  horoscope: {
    english: {
      title: 'Vedic Horoscope Report',
      sections: ['Overview', 'Strengths', 'Challenges', 'Recommendations'],
    },
    tamil: {
      title: 'வேத ஜாதக அறிக்கை',
      sections: ['பொதுவான விபரம்', 'பலம்கள்', 'சவால்கள்', 'பரிந்துரைகள்'],
    },
  },
  dasha: {
    english: {
      title: 'Dasha Prediction Report',
      sections: ['Dasha Timeline', 'Period Interpretation', 'Upcoming Events'],
    },
    tamil: {
      title: 'தசா ஜாதக அறிக்கை',
      sections: ['தசா காலம்', 'பெரிய பலன்கள்', 'வரவிருக்கும் நிகழ்வுகள்'],
    },
  },
  transit: {
    english: {
      title: 'Transit Analysis Report',
      sections: ['Current Transits', 'Upcoming Transits', 'Analysis', 'Guidance'],
    },
    tamil: {
      title: 'கோச்சர ஆய்வு அறிக்கை',
      sections: ['தற்போதைய கோச்சரம்', 'வரவிருக்கும் கோச்சரம்', 'ஆய்வு', 'வழிகாட்டுதல்'],
    },
  },
  compatibility: {
    english: {
      title: 'Compatibility Report',
      sections: ['Guna Analysis', 'Overall Score', 'Strengths', 'Challenges', 'Recommendations'],
    },
    tamil: {
      title: 'பொருத்தப்பு அறிக்கை',
      sections: ['குண விश்லேஷணம்', 'மொத்த மதிப்பு', 'பலம்கள்', 'சவால்கள்', 'பரிந்துரைகள்'],
    },
  },
};

// Export formats
export interface ExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'excel' | 'html';
  filename: string;
  includeWatermark: boolean;
  compressImages: boolean;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'pdf',
  filename: 'kotravel-report',
  includeWatermark: true,
  compressImages: true,
};
