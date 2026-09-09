// Security Headers
// Defines and validates security headers, CORS policy, and CSP rules

export interface SecurityHeaderConfig {
  contentSecurityPolicy: Record<string, string[]>;
  corsAllowedOrigins: string[];
  corsAllowedMethods: string[];
  hstsMaxAge: number;
  frameOptions: 'DENY' | 'SAMEORIGIN';
  referrerPolicy: string;
  permissionsPolicy: Record<string, string[]>;
}

/**
 * Security Headers Manager
 * Generates recommended HTTP security headers and validates configuration
 */
export class SecurityHeadersManager {
  private config: SecurityHeaderConfig;

  constructor(customConfig?: Partial<SecurityHeaderConfig>) {
    this.config = {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'strict-dynamic'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
      },
      corsAllowedOrigins: ['https://kotravel.com', 'https://app.kotravel.com'],
      corsAllowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      hstsMaxAge: 31536000, // 1 year
      frameOptions: 'DENY',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        camera: ['self'],
        microphone: [],
        geolocation: ['self'],
        payment: [],
      },
      ...customConfig,
    };
  }

  /**
   * Generate all recommended security headers
   */
  generateHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': this.buildCSPHeader(),
      'Strict-Transport-Security': `max-age=${this.config.hstsMaxAge}; includeSubDomains; preload`,
      'X-Frame-Options': this.config.frameOptions,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': this.config.referrerPolicy,
      'Permissions-Policy': this.buildPermissionsPolicyHeader(),
      'X-XSS-Protection': '1; mode=block',
      'X-DNS-Prefetch-Control': 'off',
    };
  }

  /**
   * Validate if origin is allowed for CORS
   */
  isOriginAllowed(origin: string): boolean {
    return this.config.corsAllowedOrigins.includes(origin);
  }

  /**
   * Generate CORS headers for a validated origin
   */
  generateCORSHeaders(origin: string): Record<string, string> | null {
    if (!this.isOriginAllowed(origin)) return null;

    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': this.config.corsAllowedMethods.join(', '),
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Webhook-Signature',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };
  }

  /**
   * Add allowed origin
   */
  addAllowedOrigin(origin: string): void {
    if (!this.config.corsAllowedOrigins.includes(origin)) {
      this.config.corsAllowedOrigins.push(origin);
    }
  }

  /**
   * Remove allowed origin
   */
  removeAllowedOrigin(origin: string): void {
    this.config.corsAllowedOrigins = this.config.corsAllowedOrigins.filter(o => o !== origin);
  }

  /**
   * Add CSP directive source
   */
  addCSPSource(directive: string, source: string): void {
    if (!this.config.contentSecurityPolicy[directive]) {
      this.config.contentSecurityPolicy[directive] = [];
    }
    if (!this.config.contentSecurityPolicy[directive].includes(source)) {
      this.config.contentSecurityPolicy[directive].push(source);
    }
  }

  /**
   * Validate a request against security policy
   */
  validateRequest(headers: Record<string, string>): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    const origin = headers['origin'] || headers['Origin'];
    if (origin && !this.isOriginAllowed(origin)) {
      issues.push(`Origin '${origin}' is not in allowlist`);
    }

    const contentType = headers['content-type'] || headers['Content-Type'];
    if (contentType && !contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
      issues.push(`Unexpected content-type: ${contentType}`);
    }

    return { valid: issues.length === 0, issues };
  }

  /**
   * Get current configuration
   */
  getConfig(): SecurityHeaderConfig {
    return { ...this.config };
  }

  // ==================== PRIVATE METHODS ====================

  private buildCSPHeader(): string {
    return Object.entries(this.config.contentSecurityPolicy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  private buildPermissionsPolicyHeader(): string {
    return Object.entries(this.config.permissionsPolicy)
      .map(([feature, allowlist]) => {
        const sources = allowlist.map(s => (s === 'self' ? 'self' : `"${s}"`)).join(' ');
        return `${feature}=(${sources})`;
      })
      .join(', ');
  }
}

let securityHeaders: SecurityHeadersManager | null = null;

export function getSecurityHeaders(): SecurityHeadersManager {
  if (!securityHeaders) {
    securityHeaders = new SecurityHeadersManager();
  }
  return securityHeaders;
}
