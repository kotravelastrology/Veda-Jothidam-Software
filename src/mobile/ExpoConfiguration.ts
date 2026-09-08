// Expo Build and Deployment Configuration
// app.json and eas.json equivalent configuration

export interface ExpoAppConfig {
  name: string;
  slug: string;
  version: string;
  orientation: string;
  icon: string;
  userInterfaceStyle: string;
  backgroundColor: string;
  splash: {
    image: string;
    resizeMode: string;
    backgroundColor: string;
  };
  assetBundlePatterns: string[];
  ios: any;
  android: any;
  web: any;
  plugins: any[];
  extra: any;
}

export interface EASBuildConfig {
  build: any;
  submit: any;
  credentials: any;
}

/**
 * Expo app.json Configuration
 */
export const expoAppConfig: ExpoAppConfig = {
  name: 'Kotravel Vedic Astrology',
  slug: 'kotravel-astrology',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  backgroundColor: '#f9f9f9',

  // Splash Screen
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },

  // Asset Bundles
  assetBundlePatterns: [
    '**/*',
  ],

  // iOS Configuration
  ios: {
    supportsTabletMode: true,
    isTabletOnly: false,
    bundleIdentifier: 'com.kotravelastrology.vedic',
    buildNumber: '1',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Kotravel uses your location to calculate timezone for accurate astrological calculations.',
      NSCameraUsageDescription:
        'Kotravel uses camera to capture birth certificate for chart creation.',
      NSContactsUsageDescription:
        'Kotravel accesses contacts to share readings with friends and family.',
      NSCalendarsUsageDescription:
        'Kotravel accesses calendar to display astrological events.',
      NSPhotoLibraryUsageDescription:
        'Kotravel accesses photo library for profile picture and chart sharing.',
      NSMicrophoneUsageDescription:
        'Kotravel uses microphone for voice notes in readings.',
      UIRequiresFullScreen: false,
      UIStatusBarStyle: 'default',
    },
    requireFullScreen: false,
    entitlements: {
      'com.apple.developer.appkit.access-app-data': true,
      'com.apple.developer.push-notifications': 'production',
    },
  },

  // Android Configuration
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#f9f9f9',
    },
    package: 'com.kotravelastrology.vedic',
    versionCode: 1,
    permissions: [
      'INTERNET',
      'CAMERA',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'READ_CALENDAR',
      'WRITE_CALENDAR',
      'READ_CONTACTS',
      'RECORD_AUDIO',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
    usesCleartextTraffic: false,
  },

  // Web Configuration
  web: {
    favicon: './assets/favicon.png',
    bundle: true,
    output: 'server',
  },

  // Plugins
  plugins: [
    'expo-camera',
    'expo-contacts',
    'expo-calendar',
    'expo-location',
    'expo-notifications',
    'expo-av',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
        android: {
          enableProguard: true,
        },
      },
    ],
  ],

  // Extra Configuration
  extra: {
    apiUrl: 'https://api.kotravelastrology.com',
    appName: 'Kotravel',
    version: '1.0.0',
    buildNumber: '1',
    eas: {
      projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    },
  },
};

/**
 * EAS Build Configuration (eas.json)
 */
export const easBuildConfig: EASBuildConfig = {
  // Build Profiles
  build: {
    // Development Build
    development: {
      developmentClient: true,
      distribution: 'internal',
      android: {
        buildType: 'apk',
        gradleCommand: ':app:assembleDebug',
      },
      ios: {
        buildConfiguration: 'Debug',
      },
    },

    // Preview Build
    preview: {
      distribution: 'internal',
      android: {
        buildType: 'apk',
      },
      ios: {
        buildConfiguration: 'Release',
      },
    },

    // Production Build for App Store
    production: {
      distribution: 'store',
      android: {
        buildType: 'aab',
        gradleCommand: ':app:bundleRelease',
      },
      ios: {
        buildConfiguration: 'Release',
      },
    },

    // Enterprise Build
    enterprise: {
      distribution: 'internal',
      buildNumber: 1,
      android: {
        buildType: 'apk',
      },
      ios: {
        buildConfiguration: 'Release',
        buildNumberOffset: 0,
      },
    },
  },

  // Submit Configuration (for automatic submission to stores)
  submit: {
    // Android Submission
    production_android: {
      androidReleaseType: 'aab',
      track: 'production',
    },

    // iOS Submission
    production_ios: {
      appleId: 'developer@kotravelastrology.com',
      ascAppId: '1234567890',
      appleTeamId: 'XXXXXXXXXX',
    },

    // Internal Testing (TestFlight for iOS, Internal Testing for Android)
    internal: {
      androidReleaseType: 'aab',
      track: 'internal',
      appleId: 'developer@kotravelastrology.com',
    },
  },

  // Credentials
  credentials: {
    manager: 'github', // Use GitHub for credential management

    // iOS Credentials
    ios: {
      provisioning_profile_specifier: 'Kotravel Production',
      team_id: 'XXXXXXXXXX',
      signingCertificate: 'ios_dist_cert_001',
    },

    // Android Credentials
    android: {
      keystore: {
        keystorePath: 'android/app/kotravel.jks',
        keystoreAlias: 'kotravel_key',
        keystorePassword: 'XXXXXXXXXX',
        keyPassword: 'XXXXXXXXXX',
      },
      googlePlay: {
        serviceAccountKeyPath: 'secrets/google-play-service-account.json',
      },
    },
  },
};

/**
 * Build Environment Variables
 */
export const buildEnvironmentVariables = {
  development: {
    API_URL: 'https://staging-api.kotravelastrology.com',
    ENABLE_DEBUG: 'true',
    ENABLE_PERFORMANCE_MONITORING: 'false',
    LOG_LEVEL: 'debug',
  },

  staging: {
    API_URL: 'https://staging-api.kotravelastrology.com',
    ENABLE_DEBUG: 'false',
    ENABLE_PERFORMANCE_MONITORING: 'true',
    LOG_LEVEL: 'info',
  },

  production: {
    API_URL: 'https://api.kotravelastrology.com',
    ENABLE_DEBUG: 'false',
    ENABLE_PERFORMANCE_MONITORING: 'true',
    LOG_LEVEL: 'warn',
  },
};

/**
 * Build Workflow Configuration
 */
export const buildWorkflowConfig = {
  // Pre-build Actions
  preBuild: [
    'npm ci',
    'expo prebuild --clean',
    'Update version number',
    'Generate app icons',
  ],

  // Build Actions
  build: {
    ios: [
      'eas build --platform ios --profile production',
      'Wait for build completion',
      'Download .ipa file',
      'Validate with Apple tooling',
    ],
    android: [
      'eas build --platform android --profile production',
      'Wait for build completion',
      'Download .aab file',
      'Validate signatures',
    ],
  },

  // Submission Actions
  submit: {
    ios: [
      'eas submit --platform ios --latest',
      'Monitor submission status',
      'Wait for App Store review',
      'Coordinate with marketing team',
    ],
    android: [
      'eas submit --platform android --latest',
      'Monitor Play Store submission',
      'Wait for approval',
      'Release to production',
    ],
  },

  // Post-release Actions
  postRelease: [
    'Tag release in git',
    'Update changelog',
    'Notify stakeholders',
    'Monitor crash reports',
    'Monitor user reviews',
    'Prepare next release notes',
  ],
};

/**
 * Fastlane Configuration Helper
 */
export const fastlaneConfig = {
  // iOS Fastlane Configuration
  ios: {
    teamId: 'XXXXXXXXXX',
    appIdentifier: 'com.kotravelastrology.vedic',
    appleId: 'developer@kotravelastrology.com',
    itcTeamId: 'XXXXXXXXXX',
    appStoreConnectApiKeyPath: 'fastlane/AuthKey_XXXXXXXXXX.p8',
  },

  // Android Fastlane Configuration
  android: {
    packageName: 'com.kotravelastrology.vedic',
    keyPath: 'android/app/kotravel.jks',
    keyAlias: 'kotravel_key',
    googlePlayServiceAccountPath: 'fastlane/service-account.json',
  },

  // Fastlane Lanes
  lanes: [
    'ios beta - Build and submit to TestFlight',
    'ios release - Build and submit to App Store',
    'android beta - Build and submit to Play Store internal testing',
    'android release - Build and submit to Play Store production',
    'bump_version - Bump version number and build number',
    'generate_certificates - Generate and update certificates',
  ],
};

/**
 * Continuous Integration Configuration
 */
export const ciConfiguration = {
  // GitHub Actions Workflow
  githubActions: {
    name: 'Build and Release',
    triggers: ['on push to main branch', 'manual trigger'],
    jobs: [
      'build-ios',
      'build-android',
      'test',
      'submit-testflight',
      'submit-play-store',
    ],
  },

  // CI Environment Variables
  secrets: [
    'EXPO_TOKEN',
    'APPLE_ID',
    'APPLE_TEAM_ID',
    'APPLE_APP_SPECIFIC_PASSWORD',
    'ANDROID_KEYSTORE',
    'ANDROID_KEYSTORE_PASSWORD',
    'GOOGLE_PLAY_SERVICE_ACCOUNT_JSON',
    'SENTRY_DSN',
  ],
};

/**
 * Monitoring and Analytics Configuration
 */
export const monitoringConfig = {
  // Sentry Error Tracking
  sentry: {
    enabled: true,
    dsn: 'https://[email-removed]@[email-removed].ingest.sentry.io/[email-removed]',
    tracesSampleRate: 0.1,
    environment: 'production',
  },

  // Firebase Analytics
  firebase: {
    enabled: true,
    apiKey: 'XXXXXXXXXX',
    projectId: 'kotravel-astrology',
    appId: 'XXXXXXXXXX',
  },

  // App Performance Monitoring
  performanceMonitoring: {
    enabled: true,
    samplingRate: 0.1,
    slowNetworkThreshold: 2000, // ms
  },
};
