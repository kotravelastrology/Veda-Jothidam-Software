// Integrations Module
// Export all advanced integration functionality

export {
  WebhookManager,
  getWebhookManager,
  type WebhookEvent,
  type WebhookSubscription,
  type WebhookDelivery,
} from './WebhookManager';

export {
  SSOManager,
  getSSOManager,
  type SSOProvider,
  type SSOConfiguration,
  type SSOSession,
} from './SSOManager';

export {
  ThirdPartyConnector,
  getThirdPartyConnector,
  type IntegrationProvider,
  type IntegrationCategory,
  type Integration,
  type SyncResult,
} from './ThirdPartyConnector';
