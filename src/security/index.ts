// Security Module
// Export all security hardening functionality

export {
  TwoFactorAuth,
  getTwoFactorAuth,
  type TwoFactorSetup,
  type VerificationAttempt,
} from './TwoFactorAuth';

export {
  EncryptionService,
  getEncryptionService,
  type EncryptedPayload,
} from './EncryptionService';

export {
  SecurityHeadersManager,
  getSecurityHeaders,
  type SecurityHeaderConfig,
} from './SecurityHeaders';

export {
  DataAnonymizer,
  getDataAnonymizer,
  type AnonymizationResult,
} from './DataAnonymizer';
