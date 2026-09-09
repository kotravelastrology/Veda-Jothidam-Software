// Third-Party Connector
// Manages integrations with CRM, calendar, and email services

export type IntegrationProvider =
  | 'google_calendar' | 'outlook_calendar'
  | 'salesforce' | 'hubspot'
  | 'sendgrid' | 'mailchimp'
  | 'zapier' | 'slack';

export type IntegrationCategory = 'calendar' | 'crm' | 'email' | 'automation' | 'messaging';

export interface Integration {
  id: string;
  teamId: string;
  provider: IntegrationProvider;
  category: IntegrationCategory;
  isConnected: boolean;
  accessToken?: string; // encrypted server-side in production
  refreshToken?: string;
  expiresAt?: number;
  connectedBy: string;
  connectedAt: number;
  lastSyncAt?: number;
  syncStatus: 'idle' | 'syncing' | 'error';
  settings: Record<string, any>;
}

export interface SyncResult {
  integrationId: string;
  success: boolean;
  itemsSynced: number;
  errors: string[];
  timestamp: number;
}

const PROVIDER_CATEGORIES: Record<IntegrationProvider, IntegrationCategory> = {
  google_calendar: 'calendar',
  outlook_calendar: 'calendar',
  salesforce: 'crm',
  hubspot: 'crm',
  sendgrid: 'email',
  mailchimp: 'email',
  zapier: 'automation',
  slack: 'messaging',
};

/**
 * Third-Party Connector
 * Manages OAuth connections and data sync with external services
 */
export class ThirdPartyConnector {
  private integrations: Map<string, Integration> = new Map();
  private syncHistory: SyncResult[] = [];
  private storageKey = 'kotravel_integrations';
  private syncHistoryKey = 'kotravel_sync_history';

  constructor() {
    this.loadIntegrations();
    this.loadSyncHistory();
  }

  /**
   * Connect integration
   */
  connectIntegration(data: {
    teamId: string;
    provider: IntegrationProvider;
    connectedBy: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    settings?: Record<string, any>;
  }): Integration {
    const integration: Integration = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teamId: data.teamId,
      provider: data.provider,
      category: PROVIDER_CATEGORIES[data.provider],
      isConnected: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt,
      connectedBy: data.connectedBy,
      connectedAt: Date.now(),
      syncStatus: 'idle',
      settings: data.settings || {},
    };

    this.integrations.set(integration.id, integration);
    this.persistIntegrations();
    return integration;
  }

  /**
   * Get integration
   */
  getIntegration(id: string): Integration | null {
    return this.integrations.get(id) || null;
  }

  /**
   * Get team integrations
   */
  getTeamIntegrations(teamId: string): Integration[] {
    return Array.from(this.integrations.values()).filter(i => i.teamId === teamId);
  }

  /**
   * Get integrations by category
   */
  getByCategory(teamId: string, category: IntegrationCategory): Integration[] {
    return this.getTeamIntegrations(teamId).filter(i => i.category === category);
  }

  /**
   * Disconnect integration
   */
  disconnectIntegration(id: string): boolean {
    const integration = this.integrations.get(id);
    if (!integration) return false;

    integration.isConnected = false;
    integration.accessToken = undefined;
    integration.refreshToken = undefined;
    this.persistIntegrations();
    return true;
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(id: string): boolean {
    const integration = this.integrations.get(id);
    if (!integration || !integration.expiresAt) return false;
    return integration.expiresAt < Date.now() + 300000; // 5 min buffer
  }

  /**
   * Update tokens after refresh
   */
  updateTokens(id: string, accessToken: string, expiresAt: number, refreshToken?: string): boolean {
    const integration = this.integrations.get(id);
    if (!integration) return false;

    integration.accessToken = accessToken;
    integration.expiresAt = expiresAt;
    if (refreshToken) integration.refreshToken = refreshToken;
    this.persistIntegrations();
    return true;
  }

  /**
   * Sync calendar event (Muhurta/appointment)
   */
  async syncCalendarEvent(integrationId: string, event: {
    title: string;
    description: string;
    startTime: number;
    endTime: number;
    location?: string;
  }): Promise<SyncResult> {
    const integration = this.integrations.get(integrationId);
    const result: SyncResult = {
      integrationId,
      success: false,
      itemsSynced: 0,
      errors: [],
      timestamp: Date.now(),
    };

    if (!integration || !integration.isConnected) {
      result.errors.push('Integration not connected');
      this.recordSync(result);
      return result;
    }

    integration.syncStatus = 'syncing';
    try {
      // In production: call provider-specific API (Google Calendar API, Outlook Graph API)
      const endpoint = integration.provider === 'google_calendar'
        ? 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
        : 'https://graph.microsoft.com/v1.0/me/events';

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      result.success = true;
      result.itemsSynced = 1;
      integration.syncStatus = 'idle';
      integration.lastSyncAt = Date.now();
    } catch (error) {
      result.errors.push(String(error));
      integration.syncStatus = 'error';
    }

    this.persistIntegrations();
    this.recordSync(result);
    return result;
  }

  /**
   * Sync contact to CRM
   */
  async syncCRMContact(integrationId: string, contact: {
    name: string;
    email: string;
    phone?: string;
    birthChartId?: string;
  }): Promise<SyncResult> {
    const integration = this.integrations.get(integrationId);
    const result: SyncResult = {
      integrationId,
      success: false,
      itemsSynced: 0,
      errors: [],
      timestamp: Date.now(),
    };

    if (!integration || !integration.isConnected) {
      result.errors.push('Integration not connected');
      this.recordSync(result);
      return result;
    }

    try {
      // Production: call Salesforce/HubSpot API
      result.success = true;
      result.itemsSynced = 1;
      integration.lastSyncAt = Date.now();
    } catch (error) {
      result.errors.push(String(error));
    }

    this.persistIntegrations();
    this.recordSync(result);
    return result;
  }

  /**
   * Send email via integrated service
   */
  async sendEmail(integrationId: string, email: {
    to: string;
    subject: string;
    body: string;
    templateId?: string;
  }): Promise<SyncResult> {
    const integration = this.integrations.get(integrationId);
    const result: SyncResult = {
      integrationId,
      success: false,
      itemsSynced: 0,
      errors: [],
      timestamp: Date.now(),
    };

    if (!integration || !integration.isConnected) {
      result.errors.push('Integration not connected');
      this.recordSync(result);
      return result;
    }

    try {
      // Production: call SendGrid/Mailchimp API
      result.success = true;
      result.itemsSynced = 1;
    } catch (error) {
      result.errors.push(String(error));
    }

    this.recordSync(result);
    return result;
  }

  /**
   * Get sync history for integration
   */
  getSyncHistory(integrationId: string, limit: number = 50): SyncResult[] {
    return this.syncHistory
      .filter(s => s.integrationId === integrationId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get available providers by category
   */
  getAvailableProviders(category?: IntegrationCategory): IntegrationProvider[] {
    const all = Object.keys(PROVIDER_CATEGORIES) as IntegrationProvider[];
    return category ? all.filter(p => PROVIDER_CATEGORIES[p] === category) : all;
  }

  // ==================== PRIVATE METHODS ====================

  private recordSync(result: SyncResult): void {
    this.syncHistory.push(result);
    if (this.syncHistory.length > 1000) {
      this.syncHistory = this.syncHistory.slice(-1000);
    }
    this.persistSyncHistory();
  }

  private persistIntegrations(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.integrations.values())));
    } catch (e) {
      console.warn('Integrations persistence failed');
    }
  }

  private loadIntegrations(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const items = JSON.parse(data) as Integration[];
        items.forEach(i => this.integrations.set(i.id, i));
      }
    } catch (e) {
      console.warn('Integrations load failed');
    }
  }

  private persistSyncHistory(): void {
    try {
      localStorage.setItem(this.syncHistoryKey, JSON.stringify(this.syncHistory.slice(-500)));
    } catch (e) {
      console.warn('Sync history persistence failed');
    }
  }

  private loadSyncHistory(): void {
    try {
      const data = localStorage.getItem(this.syncHistoryKey);
      if (data) {
        this.syncHistory = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Sync history load failed');
    }
  }
}

let connector: ThirdPartyConnector | null = null;

export function getThirdPartyConnector(): ThirdPartyConnector {
  if (!connector) {
    connector = new ThirdPartyConnector();
  }
  return connector;
}
