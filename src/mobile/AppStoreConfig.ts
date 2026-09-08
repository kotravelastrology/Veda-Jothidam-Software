// App Store Distribution Configuration
// iOS App Store and Google Play Store settings

export interface AppStoreMetadata {
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  supportUrl: string;
  privacyUrl: string;
  releaseNotes: string;
}

export interface AppStoreScreenshot {
  title: string;
  description: string;
  imagePath: string;
  language: string;
}

export interface AppStoreReview {
  version: string;
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  reviewDate?: string;
  reviewNotes?: string;
}

/**
 * iOS App Store Configuration
 */
export const iOSAppStoreConfig = {
  // Bundle Identifier
  bundleId: 'com.kotravelastrology.vedic',

  // App Name
  appName: 'Kotravel Vedic Astrology',

  // Short Description (max 30 characters)
  tagline: 'Vedic Astrology Companion',

  // Full Description (max 4000 characters)
  description: `Kotravel brings authentic Vedic astrology to your iPhone and iPad.

  Features:
  • Precise Birth Chart Calculation (Rasi, Navamsha, 16 Divisional Charts)
  • Planetary Strength Analysis (Shadbala System)
  • Dasha Period Predictions (Vimsottari, Ashtottari)
  • Transit Analysis with Real-time Calculations
  • Muhurta Finder for Auspicious Timings
  • Classical Reference Library (BPHS, Phaladeepika)
  • Compatibility Analysis (Match-making)
  • Professional Report Generation
  • Multi-language Support (English, Tamil)
  • Offline Mode Support

  Kotravel uses classical Vedic astrology principles with modern technology. All calculations are based on authentic Sanskrit texts and verifiable astronomical data.`,

  // Keywords
  keywords: [
    'vedic astrology',
    'birth chart',
    'dasha',
    'transits',
    'horoscope',
    'kundli',
    'muhurta',
    'jyotish',
    'astrological calculator',
    'compatibility',
  ],

  // Support Information
  supportEmail: 'support@kotravelastrology.com',
  supportUrl: 'https://kotravelastrology.com/support',
  privacyUrl: 'https://kotravelastrology.com/privacy',
  termsUrl: 'https://kotravelastrology.com/terms',

  // Minimum OS Version
  minimumOsVersion: '14.0',

  // Device Family
  deviceFamily: ['iphone', 'ipad'],

  // Categories
  categories: ['Lifestyle', 'Reference'],

  // Age Rating
  ageRating: '4+',

  // Screenshots (required for App Store)
  screenshots: [
    {
      title: 'Birth Chart',
      description: 'Detailed Rasi and Navamsha charts with planetary positions',
      imagePath: 'assets/screenshots/ios/chart.png',
      language: 'en-US',
    },
    {
      title: 'Dasha Analysis',
      description: 'Life period predictions based on Vimsottari Dasha',
      imagePath: 'assets/screenshots/ios/dasha.png',
      language: 'en-US',
    },
    {
      title: 'Transit Predictions',
      description: 'Real-time planetary transit analysis',
      imagePath: 'assets/screenshots/ios/transits.png',
      language: 'en-US',
    },
    {
      title: 'Muhurta Finder',
      description: 'Find auspicious times for important events',
      imagePath: 'assets/screenshots/ios/muhurta.png',
      language: 'en-US',
    },
  ] as AppStoreScreenshot[],

  // Preview Video (optional)
  previewVideoPath: 'assets/videos/preview.mp4',

  // Release Notes
  releaseNotes: `Version 1.0.0 - Launch Release

  🎉 Initial Release
  • Complete Vedic Astrology Calculator
  • Birth Chart with 16 Divisional Charts
  • Dasha and Transit Analysis
  • Classical Reference Library
  • Muhurta Finder
  • Multi-language Support
  • Offline Mode
  • Professional Reports

  Thank you for downloading Kotravel!`,

  // Contact Information
  contactName: 'Kotravel Support',
  contactEmail: 'support@kotravelastrology.com',
  contactPhone: '+91-XXXX-XXXX-XXXX',
};

/**
 * Android Google Play Store Configuration
 */
export const androidPlayStoreConfig = {
  // Package Name
  packageName: 'com.kotravelastrology.vedic',

  // App Name
  appName: 'Kotravel Vedic Astrology',

  // Short Description (max 80 characters)
  tagline: 'Vedic Astrology Companion',

  // Full Description (max 4000 characters)
  description: `Kotravel brings authentic Vedic astrology to your Android device.

  Features:
  • Precise Birth Chart Calculation (Rasi, Navamsha, 16 Divisional Charts)
  • Planetary Strength Analysis (Shadbala System)
  • Dasha Period Predictions (Vimsottari, Ashtottari)
  • Transit Analysis with Real-time Calculations
  • Muhurta Finder for Auspicious Timings
  • Classical Reference Library (BPHS, Phaladeepika)
  • Compatibility Analysis (Match-making)
  • Professional Report Generation
  • Multi-language Support (English, Tamil)
  • Offline Mode Support

  All calculations based on classical Vedic astrology principles.`,

  // Keywords
  keywords: 'vedic astrology, kundli, horoscope, dasha, transits, muhurta',

  // Support Information
  supportEmail: 'support@kotravelastrology.com',
  supportUrl: 'https://kotravelastrology.com/support',
  privacyUrl: 'https://kotravelastrology.com/privacy',
  websiteUrl: 'https://kotravelastrology.com',

  // Minimum API Level
  minimumApiLevel: 31, // Android 12

  // Target API Level
  targetApiLevel: 34, // Android 14

  // Categories
  categories: ['LIFESTYLE'],

  // Content Rating
  contentRating: 'Everyone',

  // Screenshots (required for Play Store)
  screenshots: [
    {
      title: 'Birth Chart',
      description: 'Detailed Rasi and Navamsha charts',
      imagePath: 'assets/screenshots/android/chart.png',
      language: 'en-US',
    },
    {
      title: 'Dasha Timeline',
      description: 'Life period predictions',
      imagePath: 'assets/screenshots/android/dasha.png',
      language: 'en-US',
    },
    {
      title: 'Transit Analysis',
      description: 'Planetary transit predictions',
      imagePath: 'assets/screenshots/android/transits.png',
      language: 'en-US',
    },
    {
      title: 'Muhurta Finder',
      description: 'Auspicious timing finder',
      imagePath: 'assets/screenshots/android/muhurta.png',
      language: 'en-US',
    },
  ] as AppStoreScreenshot[],

  // Feature Graphic (1024x500px)
  featureGraphicPath: 'assets/graphics/feature-graphic.png',

  // Preview Video (optional)
  previewVideoPath: 'assets/videos/preview.mp4',

  // Release Notes
  releaseNotes: `Version 1.0.0 - Launch Release

  🎉 Initial Release
  • Complete Vedic Astrology Calculator
  • Birth Chart with 16 Divisional Charts
  • Dasha and Transit Analysis
  • Classical Reference Library
  • Muhurta Finder
  • Multi-language Support
  • Offline Mode
  • Professional Reports

  Thank you for using Kotravel!`,

  // Contact Information
  contactName: 'Kotravel Support',
  contactEmail: 'support@kotravelastrology.com',
  contactPhone: '+91-XXXX-XXXX-XXXX',

  // Permissions
  permissions: [
    'android.permission.INTERNET',
    'android.permission.CAMERA',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.ACCESS_COARSE_LOCATION',
    'android.permission.READ_CALENDAR',
    'android.permission.WRITE_CALENDAR',
    'android.permission.READ_CONTACTS',
  ],
};

/**
 * Shared App Store Configuration
 */
export const sharedAppStoreConfig = {
  // Version Management
  version: '1.0.0',
  buildNumber: '1',

  // Release Schedule
  releaseDate: new Date('2025-06-01'),
  estimatedReviewTime: '1-3 business days',

  // Pricing
  price: 0, // Free app
  currency: 'USD',
  inAppPurchases: [
    {
      id: 'premium_subscription_monthly',
      name: 'Premium Monthly',
      price: 9.99,
      description: 'Full access to premium features',
      duration: '1 month',
    },
    {
      id: 'premium_subscription_annual',
      name: 'Premium Yearly',
      price: 89.99,
      description: 'Full access to premium features (Best value)',
      duration: '1 year',
    },
  ],

  // Marketing Assets
  appIcon: 'assets/icon/app-icon-1024.png',
  appIconSmall: 'assets/icon/app-icon-180.png',
  splashScreen: 'assets/splash/splash-screen.png',
  brandColor: '#D4A574',

  // Legal Information
  company: 'Kotravel Astrology',
  companyAddress: 'Chennai, Tamil Nadu, India',
  companyEmail: 'info@kotravelastrology.com',
  companyWebsite: 'https://kotravelastrology.com',

  // Compliance
  dataPrivacy: {
    collectedData: ['Birth details', 'Location (optional)', 'Device info'],
    dataUsage: 'For astrological calculations and personalized analysis',
    dataSharing: 'No third-party sharing',
    dataRetention: 'User-controlled deletion',
  },

  // Review Information
  reviewNotes: `This is an astrology app that provides personalized birth chart analysis, planetary predictions, and classical reference materials.

  All calculations are based on traditional Vedic astrology principles and historical astronomical data. The app includes educational content about classical Indian astrology texts.

  The app uses device location (with user permission) for timezone calculations and requires internet connectivity for cloud features.`,

  // Test Accounts (for testing in-app purchases)
  testAccounts: [
    {
      email: 'test@kotravelastrology.com',
      password: 'TestPassword123!',
      role: 'tester',
    },
  ],

  // Staging Environment
  stagingApiUrl: 'https://staging-api.kotravelastrology.com',
  productionApiUrl: 'https://api.kotravelastrology.com',

  // Analytics
  enableAnalytics: true,
  enableCrashReporting: true,
  enablePerformanceMonitoring: true,
};

/**
 * Version Release History
 */
export const releaseHistory: AppStoreReview[] = [
  {
    version: '1.0.0',
    status: 'approved',
    submissionDate: '2025-05-25',
    reviewDate: '2025-05-28',
    reviewNotes: 'Approved for production release',
  },
];

/**
 * Helper functions for app store submission
 */
export const AppStoreHelpers = {
  /**
   * Validate app metadata
   */
  validateMetadata: (metadata: AppStoreMetadata): string[] => {
    const errors: string[] = [];

    if (!metadata.title || metadata.title.length < 3) {
      errors.push('App title must be at least 3 characters');
    }
    if (!metadata.description || metadata.description.length < 100) {
      errors.push('Description must be at least 100 characters');
    }
    if (metadata.keywords.length < 3) {
      errors.push('At least 3 keywords are required');
    }

    return errors;
  },

  /**
   * Get app store URL
   */
  getAppStoreUrl: (platform: 'ios' | 'android'): string => {
    const appId = platform === 'ios' ? 'id1234567890' : 'com.kotravelastrology.vedic';
    const baseUrl =
      platform === 'ios'
        ? 'https://apps.apple.com/app/'
        : 'https://play.google.com/store/apps/details?id=';

    return `${baseUrl}${appId}`;
  },

  /**
   * Generate marketing copy
   */
  generateMarketingCopy: (): string => {
    return `🌟 Discover Your Cosmic Blueprint with Kotravel

Your personal Vedic astrology companion powered by classical calculations and ancient wisdom.

✨ Key Features:
• Precise Birth Chart Analysis
• Life Period Predictions (Dasha)
• Real-time Transit Analysis
• Auspicious Timing Finder
• Classical Reference Library
• Professional Reports

Download now and unlock the secrets of your cosmic destiny!`;
  },
};
