// App Signing and Certificate Configuration
// iOS and Android code signing setup

export interface CertificateInfo {
  id: string;
  name: string;
  type: 'development' | 'distribution' | 'ad-hoc';
  issuer: string;
  expirationDate: string;
  fingerprintSHA1: string;
  fingerprintSHA256: string;
}

export interface ProvisioningProfile {
  uuid: string;
  name: string;
  type: 'development' | 'distribution' | 'ad-hoc';
  teamId: string;
  bundleId: string;
  expirationDate: string;
  devicesCount?: number;
}

export interface SigningKey {
  alias: string;
  keyPassword: string;
  storePassword: string;
  keyAlgorithm: 'RSA' | 'EC';
  keySize: number;
  validityYears: number;
}

/**
 * iOS Code Signing Configuration
 */
export const iOSSigningConfig = {
  // Team ID (obtained from Apple Developer Account)
  teamId: 'XXXXXXXXXX',

  // Team Name
  teamName: 'Kotravel Astrology',

  // Development Team
  developmentTeamId: 'XXXXXXXXXX',

  // Distribution Certificate
  distributionCertificate: {
    id: 'ios_dist_cert_001',
    name: 'iOS Distribution: Kotravel Astrology',
    type: 'distribution' as const,
    issuer: 'Apple Worldwide Developer Relations Certification Authority',
    expirationDate: '2026-05-28',
    fingerprintSHA1: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD',
    fingerprintSHA256:
      'AABBCCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899',
  } as CertificateInfo,

  // Development Certificate
  developmentCertificate: {
    id: 'ios_dev_cert_001',
    name: 'iPhone Developer: Kotravel Support',
    type: 'development' as const,
    issuer: 'Apple Worldwide Developer Relations Certification Authority',
    expirationDate: '2026-05-28',
    fingerprintSHA1: 'BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE',
    fingerprintSHA256:
      'BBCCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899AA',
  } as CertificateInfo,

  // Push Notification Certificate
  pushNotificationCertificate: {
    id: 'ios_push_cert_001',
    name: 'Apple Push Notification service SSL Certificate',
    type: 'distribution' as const,
    issuer: 'Apple Worldwide Developer Relations Certification Authority',
    expirationDate: '2026-05-28',
    fingerprintSHA1: 'CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF',
    fingerprintSHA256:
      'CCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899AABB',
  } as CertificateInfo,

  // Provisioning Profiles
  provisioningProfiles: [
    {
      uuid: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      name: 'Kotravel Production',
      type: 'distribution' as const,
      teamId: 'XXXXXXXXXX',
      bundleId: 'com.kotravelastrology.vedic',
      expirationDate: '2026-05-28',
    } as ProvisioningProfile,
    {
      uuid: 'YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
      name: 'Kotravel Development',
      type: 'development' as const,
      teamId: 'XXXXXXXXXX',
      bundleId: 'com.kotravelastrology.vedic',
      expirationDate: '2026-05-28',
      devicesCount: 10,
    } as ProvisioningProfile,
  ],

  // Apple ID
  appleDeveloperId: 'developer@kotravelastrology.com',
  appSpecificPassword: 'xxxx-xxxx-xxxx-xxxx', // Generate from Apple ID settings

  // Keychain Configuration
  keychainProfile: 'Kotravel Production',
};

/**
 * Android Code Signing Configuration
 */
export const androidSigningConfig = {
  // Keystore File
  keystorePath: 'android/app/kotravel.jks',
  keystoreAlias: 'kotravel_key',
  keystorePassword: 'XXXXXXXXXX',

  // Signing Key
  signingKey: {
    alias: 'kotravel_key',
    keyPassword: 'XXXXXXXXXX',
    storePassword: 'XXXXXXXXXX',
    keyAlgorithm: 'RSA' as const,
    keySize: 2048,
    validityYears: 25,
  } as SigningKey,

  // Certificate Information
  certificate: {
    id: 'android_cert_001',
    name: 'Kotravel Astrology Release Key',
    type: 'distribution' as const,
    issuer: 'Kotravel Astrology',
    expirationDate: '2050-05-28',
    fingerprintSHA1: 'DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00',
    fingerprintSHA256:
      'DDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899AABBCC',
  } as CertificateInfo,

  // Google Play Console
  googlePlayServiceAccount: 'service-account@kotravelastrology.iam.gserviceaccount.com',
  googlePlayBundleId: 'com.kotravelastrology.vedic',

  // Signing Configurations
  signingConfigs: {
    debug: {
      keyAlias: 'androiddebugkey',
      keyPassword: 'android',
      storeFile: '$HOME/.android/debug.keystore',
      storePassword: 'android',
    },
    release: {
      keyAlias: 'kotravel_key',
      keyPassword: 'XXXXXXXXXX',
      storeFile: './kotravel.jks',
      storePassword: 'XXXXXXXXXX',
    },
  },
};

/**
 * Signing Configuration Export
 */
export const signingExportConfig = {
  // Export Path
  exportPath: './build/artifacts',

  // Filename Template
  filenameTemplate: 'Kotravel-{platform}-{version}-{buildNumber}',

  // Export Formats
  exportFormats: {
    ios: [
      'ipa', // App Store
      'app', // Ad Hoc / Enterprise
    ],
    android: [
      'apk', // Direct Install
      'aab', // Google Play (recommended)
      'apks', // Bundle
    ],
  },

  // Notarization (macOS requirement for iOS)
  notarizationConfig: {
    enabled: true,
    appleDeveloperId: 'developer@kotravelastrology.com',
    appSpecificPassword: 'xxxx-xxxx-xxxx-xxxx',
  },
};

/**
 * Certificate Management Helper
 */
export class CertificateManager {
  /**
   * Validate certificate expiration
   */
  static validateCertificateExpiry(cert: CertificateInfo): {
    isValid: boolean;
    daysUntilExpiry: number;
    warning: boolean;
  } {
    const expiryDate = new Date(cert.expirationDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isValid: daysUntilExpiry > 0,
      daysUntilExpiry,
      warning: daysUntilExpiry < 30,
    };
  }

  /**
   * Get certificate details
   */
  static getCertificateDetails(cert: CertificateInfo): string {
    const expiry = this.validateCertificateExpiry(cert);
    return `
Certificate: ${cert.name}
Type: ${cert.type}
Issuer: ${cert.issuer}
Expiration: ${cert.expirationDate}
Status: ${expiry.isValid ? '✓ Valid' : '✗ Expired'}
Days Remaining: ${expiry.daysUntilExpiry}
SHA1: ${cert.fingerprintSHA1}
SHA256: ${cert.fingerprintSHA256}
    `.trim();
  }

  /**
   * List all certificates
   */
  static listAllCertificates(): CertificateInfo[] {
    return [
      iOSSigningConfig.distributionCertificate,
      iOSSigningConfig.developmentCertificate,
      iOSSigningConfig.pushNotificationCertificate,
      androidSigningConfig.certificate,
    ];
  }

  /**
   * Check if any certificate is expiring soon
   */
  static checkExpiringCertificates(): CertificateInfo[] {
    return this.listAllCertificates().filter(cert => {
      const expiry = this.validateCertificateExpiry(cert);
      return expiry.warning;
    });
  }
}

/**
 * Build and Signing Workflow
 */
export const buildWorkflow = {
  // Pre-build Checks
  preChecks: [
    'Validate all certificates are valid',
    'Verify provisioning profiles are up-to-date',
    'Check build number is incremented',
    'Ensure version matches release notes',
    'Validate code signing configuration',
  ],

  // iOS Build Steps
  iosBuildSteps: [
    'Clean Xcode build folder',
    'Update CocoaPods dependencies',
    'Set code signing identity and provisioning profile',
    'Build for archiving',
    'Create .xcarchive file',
    'Export .ipa for App Store',
    'Notarize .ipa with Apple',
    'Validate .ipa with Apple tooling',
    'Upload to TestFlight or App Store Connect',
  ],

  // Android Build Steps
  androidBuildSteps: [
    'Clean Gradle build',
    'Update Android dependencies',
    'Increment build number',
    'Set signing configuration',
    'Run unit tests',
    'Build signed APK',
    'Build signed AAB (App Bundle)',
    'Validate signatures',
    'Upload to Google Play Console',
  ],

  // Post-build Verification
  postChecks: [
    'Verify app runs on device',
    'Check crash reporting is working',
    'Validate analytics are firing',
    'Test core features',
    'Verify permissions are correct',
    'Check app size is acceptable',
  ],

  // Deployment Steps
  deploymentSteps: [
    'Submit to App Store / Play Store',
    'Wait for store review',
    'Monitor crash reports',
    'Monitor user ratings',
    'Prepare release notes for next version',
  ],
};

/**
 * Security Best Practices
 */
export const securityBestPractices = {
  // Certificate Management
  certificateManagement: [
    'Store certificates in secure locations',
    'Use strong passwords for keystores',
    'Rotate certificates periodically',
    'Monitor certificate expiration dates',
    'Backup certificates securely',
    'Never commit certificates to version control',
  ],

  // Code Signing
  codeSigning: [
    'Use separate keys for development and production',
    'Enable automatic code signing where available',
    'Verify signatures before release',
    'Use timestamping servers',
    'Maintain certificate chain documentation',
  ],

  // Distribution Security
  distributionSecurity: [
    'Use official app stores only',
    'Enable two-factor authentication on app store accounts',
    'Use app-specific passwords (Apple)',
    'Implement IP whitelisting where available',
    'Monitor app update activity',
    'Use code obfuscation for production builds',
  ],
};
