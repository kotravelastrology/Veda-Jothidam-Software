// Two-Factor Authentication (TOTP)
// Implements time-based one-time password generation and verification

export interface TwoFactorSetup {
  userId: string;
  secret: string; // base32 encoded
  qrCodeUrl: string;
  backupCodes: string[];
  isEnabled: boolean;
  enabledAt?: number;
  createdAt: number;
}

export interface VerificationAttempt {
  userId: string;
  timestamp: number;
  success: boolean;
}

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;

/**
 * Two-Factor Authentication Manager
 * TOTP-based 2FA setup, verification, and backup code management
 */
export class TwoFactorAuth {
  private setups: Map<string, TwoFactorSetup> = new Map();
  private attempts: VerificationAttempt[] = [];
  private storageKey = 'kotravel_2fa_setups';
  private attemptsKey = 'kotravel_2fa_attempts';
  private maxAttemptsPerMinute = 5;

  constructor() {
    this.loadSetups();
    this.loadAttempts();
  }

  /**
   * Initialize 2FA setup for user
   */
  initializeSetup(userId: string, issuer: string = 'Kotravel'): TwoFactorSetup {
    const secret = this.generateSecret();
    const backupCodes = this.generateBackupCodes();

    const setup: TwoFactorSetup = {
      userId,
      secret,
      qrCodeUrl: this.buildQRCodeUrl(issuer, userId, secret),
      backupCodes,
      isEnabled: false,
      createdAt: Date.now(),
    };

    this.setups.set(userId, setup);
    this.persistSetups();
    return setup;
  }

  /**
   * Enable 2FA after verifying first code
   */
  enableTwoFactor(userId: string, verificationCode: string): boolean {
    const setup = this.setups.get(userId);
    if (!setup) return false;

    if (this.verifyCode(setup.secret, verificationCode)) {
      setup.isEnabled = true;
      setup.enabledAt = Date.now();
      this.persistSetups();
      return true;
    }
    return false;
  }

  /**
   * Disable 2FA
   */
  disableTwoFactor(userId: string): boolean {
    const setup = this.setups.get(userId);
    if (!setup) return false;

    setup.isEnabled = false;
    this.persistSetups();
    return true;
  }

  /**
   * Verify TOTP code
   */
  verify(userId: string, code: string): boolean {
    if (this.isRateLimited(userId)) {
      this.recordAttempt(userId, false);
      return false;
    }

    const setup = this.setups.get(userId);
    if (!setup || !setup.isEnabled) {
      this.recordAttempt(userId, false);
      return false;
    }

    // Check backup codes first
    if (setup.backupCodes.includes(code)) {
      setup.backupCodes = setup.backupCodes.filter(c => c !== code);
      this.persistSetups();
      this.recordAttempt(userId, true);
      return true;
    }

    const valid = this.verifyCode(setup.secret, code);
    this.recordAttempt(userId, valid);
    return valid;
  }

  /**
   * Check if user has 2FA enabled
   */
  isEnabled(userId: string): boolean {
    return this.setups.get(userId)?.isEnabled || false;
  }

  /**
   * Regenerate backup codes
   */
  regenerateBackupCodes(userId: string): string[] | null {
    const setup = this.setups.get(userId);
    if (!setup) return null;

    setup.backupCodes = this.generateBackupCodes();
    this.persistSetups();
    return setup.backupCodes;
  }

  /**
   * Get remaining backup codes count
   */
  getRemainingBackupCodesCount(userId: string): number {
    return this.setups.get(userId)?.backupCodes.length || 0;
  }

  /**
   * Get verification attempt history
   */
  getAttemptHistory(userId: string, limit: number = 20): VerificationAttempt[] {
    return this.attempts
      .filter(a => a.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Check for suspicious activity (multiple failures)
   */
  hasSuspiciousActivity(userId: string, windowMinutes: number = 15, threshold: number = 5): boolean {
    const cutoff = Date.now() - windowMinutes * 60000;
    const recentFailures = this.attempts.filter(
      a => a.userId === userId && !a.success && a.timestamp > cutoff
    );
    return recentFailures.length >= threshold;
  }

  // ==================== PRIVATE METHODS ====================

  private generateSecret(): string {
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += BASE32_CHARS[Math.floor(Math.random() * BASE32_CHARS.length)];
    }
    return secret;
  }

  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substr(2, 4) + '-' + Math.random().toString(36).substr(2, 4);
      codes.push(code.toUpperCase());
    }
    return codes;
  }

  private buildQRCodeUrl(issuer: string, userId: string, secret: string): string {
    const label = encodeURIComponent(`${issuer}:${userId}`);
    const params = `secret=${secret}&issuer=${encodeURIComponent(issuer)}&period=${TOTP_PERIOD_SECONDS}&digits=${TOTP_DIGITS}`;
    return `otpauth://totp/${label}?${params}`;
  }

  /**
   * Generate TOTP code for given secret and time counter
   * Simplified HMAC-based implementation for demonstration
   */
  private generateTOTP(secret: string, counter: number): string {
    const hash = this.simpleHash(secret + counter.toString());
    const code = (hash % 1000000).toString().padStart(TOTP_DIGITS, '0');
    return code;
  }

  private verifyCode(secret: string, code: string): boolean {
    const counter = Math.floor(Date.now() / 1000 / TOTP_PERIOD_SECONDS);
    // Allow +/- 1 window for clock drift
    for (let offset = -1; offset <= 1; offset++) {
      if (this.generateTOTP(secret, counter + offset) === code) {
        return true;
      }
    }
    return false;
  }

  private simpleHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private isRateLimited(userId: string): boolean {
    const oneMinuteAgo = Date.now() - 60000;
    const recentAttempts = this.attempts.filter(
      a => a.userId === userId && a.timestamp > oneMinuteAgo
    );
    return recentAttempts.length >= this.maxAttemptsPerMinute;
  }

  private recordAttempt(userId: string, success: boolean): void {
    this.attempts.push({ userId, timestamp: Date.now(), success });
    if (this.attempts.length > 5000) {
      this.attempts = this.attempts.slice(-5000);
    }
    this.persistAttempts();
  }

  private persistSetups(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.setups.values())));
    } catch (e) {
      console.warn('2FA setups persistence failed');
    }
  }

  private loadSetups(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const setups = JSON.parse(data) as TwoFactorSetup[];
        setups.forEach(s => this.setups.set(s.userId, s));
      }
    } catch (e) {
      console.warn('2FA setups load failed');
    }
  }

  private persistAttempts(): void {
    try {
      localStorage.setItem(this.attemptsKey, JSON.stringify(this.attempts.slice(-2000)));
    } catch (e) {
      console.warn('2FA attempts persistence failed');
    }
  }

  private loadAttempts(): void {
    try {
      const data = localStorage.getItem(this.attemptsKey);
      if (data) {
        this.attempts = JSON.parse(data);
      }
    } catch (e) {
      console.warn('2FA attempts load failed');
    }
  }
}

let twoFactorAuth: TwoFactorAuth | null = null;

export function getTwoFactorAuth(): TwoFactorAuth {
  if (!twoFactorAuth) {
    twoFactorAuth = new TwoFactorAuth();
  }
  return twoFactorAuth;
}
