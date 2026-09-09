// SSO Manager
// Manages Single Sign-On (SAML/OAuth) configuration and authentication flow

export type SSOProvider = 'saml' | 'google' | 'microsoft' | 'okta' | 'auth0';

export interface SSOConfiguration {
  id: string;
  teamId: string;
  provider: SSOProvider;
  isEnabled: boolean;
  // SAML-specific
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  // OAuth-specific
  clientId?: string;
  clientSecret?: string; // stored hashed/encrypted server-side in production
  authorizationUrl?: string;
  tokenUrl?: string;
  // Common
  attributeMapping: {
    email: string;
    displayName: string;
    role?: string;
  };
  allowedDomains: string[];
  autoProvisionUsers: boolean;
  defaultRole: string;
  createdAt: number;
  updatedAt: number;
}

export interface SSOSession {
  sessionId: string;
  userId: string;
  provider: SSOProvider;
  ssoConfigId: string;
  idpSessionId?: string;
  createdAt: number;
  expiresAt: number;
}

/**
 * SSO Manager
 * Manages SAML/OAuth SSO configuration and session tracking
 */
export class SSOManager {
  private configurations: Map<string, SSOConfiguration> = new Map();
  private sessions: Map<string, SSOSession> = new Map();
  private configStorageKey = 'kotravel_sso_config';
  private sessionStorageKey = 'kotravel_sso_sessions';

  constructor() {
    this.loadConfigurations();
    this.loadSessions();
  }

  /**
   * Create SSO configuration
   */
  createConfiguration(data: Omit<SSOConfiguration, 'id' | 'createdAt' | 'updatedAt'>): SSOConfiguration {
    const config: SSOConfiguration = {
      ...data,
      id: `sso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.configurations.set(config.id, config);
    this.persistConfigurations();
    return config;
  }

  /**
   * Get team SSO configuration
   */
  getTeamConfiguration(teamId: string): SSOConfiguration | null {
    return Array.from(this.configurations.values()).find(c => c.teamId === teamId) || null;
  }

  /**
   * Update SSO configuration
   */
  updateConfiguration(id: string, updates: Partial<SSOConfiguration>): SSOConfiguration | null {
    const config = this.configurations.get(id);
    if (!config) return null;

    Object.assign(config, updates);
    config.updatedAt = Date.now();
    this.persistConfigurations();
    return config;
  }

  /**
   * Validate email domain against SSO config
   */
  isDomainAllowed(email: string, configId: string): boolean {
    const config = this.configurations.get(configId);
    if (!config || config.allowedDomains.length === 0) return true;

    const domain = email.split('@')[1]?.toLowerCase();
    return config.allowedDomains.some(d => d.toLowerCase() === domain);
  }

  /**
   * Generate SAML AuthnRequest URL (simplified)
   */
  generateSAMLRequestUrl(configId: string, relayState: string): string | null {
    const config = this.configurations.get(configId);
    if (!config || config.provider !== 'saml' || !config.ssoUrl) return null;

    const params = new URLSearchParams({
      SAMLRequest: this.buildSAMLRequest(config),
      RelayState: relayState,
    });

    return `${config.ssoUrl}?${params.toString()}`;
  }

  /**
   * Generate OAuth authorization URL
   */
  generateOAuthUrl(configId: string, redirectUri: string, state: string): string | null {
    const config = this.configurations.get(configId);
    if (!config || !config.authorizationUrl || !config.clientId) return null;

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state,
    });

    return `${config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Map IdP attributes to user profile
   */
  mapAttributes(configId: string, idpAttributes: Record<string, any>): {
    email: string;
    displayName: string;
    role?: string;
  } | null {
    const config = this.configurations.get(configId);
    if (!config) return null;

    return {
      email: idpAttributes[config.attributeMapping.email],
      displayName: idpAttributes[config.attributeMapping.displayName],
      role: config.attributeMapping.role ? idpAttributes[config.attributeMapping.role] : config.defaultRole,
    };
  }

  /**
   * Create SSO session
   */
  createSession(userId: string, provider: SSOProvider, ssoConfigId: string, durationHours: number = 8): SSOSession {
    const session: SSOSession = {
      sessionId: `ssosess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      provider,
      ssoConfigId,
      createdAt: Date.now(),
      expiresAt: Date.now() + durationHours * 3600000,
    };

    this.sessions.set(session.sessionId, session);
    this.persistSessions();
    return session;
  }

  /**
   * Validate session
   */
  isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return session ? session.expiresAt > Date.now() : false;
  }

  /**
   * Terminate session (SLO)
   */
  terminateSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Test SSO connection
   */
  async testConnection(configId: string): Promise<{ success: boolean; message: string }> {
    const config = this.configurations.get(configId);
    if (!config) return { success: false, message: 'Configuration not found' };

    if (config.provider === 'saml') {
      if (!config.entityId || !config.ssoUrl || !config.certificate) {
        return { success: false, message: 'Missing SAML configuration fields' };
      }
    } else {
      if (!config.clientId || !config.authorizationUrl) {
        return { success: false, message: 'Missing OAuth configuration fields' };
      }
    }

    return { success: true, message: 'Configuration is valid' };
  }

  // ==================== PRIVATE METHODS ====================

  private buildSAMLRequest(config: SSOConfiguration): string {
    // Simplified placeholder - production would build proper XML AuthnRequest
    const request = `<samlp:AuthnRequest EntityID="${config.entityId}"/>`;
    return btoa(request);
  }

  private persistConfigurations(): void {
    try {
      localStorage.setItem(this.configStorageKey, JSON.stringify(Array.from(this.configurations.values())));
    } catch (e) {
      console.warn('SSO config persistence failed');
    }
  }

  private loadConfigurations(): void {
    try {
      const data = localStorage.getItem(this.configStorageKey);
      if (data) {
        const configs = JSON.parse(data) as SSOConfiguration[];
        configs.forEach(c => this.configurations.set(c.id, c));
      }
    } catch (e) {
      console.warn('SSO config load failed');
    }
  }

  private persistSessions(): void {
    try {
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(Array.from(this.sessions.values())));
    } catch (e) {
      console.warn('SSO sessions persistence failed');
    }
  }

  private loadSessions(): void {
    try {
      const data = localStorage.getItem(this.sessionStorageKey);
      if (data) {
        const sessions = JSON.parse(data) as SSOSession[];
        sessions.forEach(s => this.sessions.set(s.sessionId, s));
      }
    } catch (e) {
      console.warn('SSO sessions load failed');
    }
  }
}

let ssoManager: SSOManager | null = null;

export function getSSOManager(): SSOManager {
  if (!ssoManager) {
    ssoManager = new SSOManager();
  }
  return ssoManager;
}
