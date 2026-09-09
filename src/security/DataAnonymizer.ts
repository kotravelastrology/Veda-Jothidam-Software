// Data Anonymizer
// Anonymizes and pseudonymizes personal data for privacy compliance (GDPR/DPDP)

export interface AnonymizationResult {
  originalFieldCount: number;
  anonymizedFieldCount: number;
  fieldsProcessed: string[];
}

const PII_FIELD_PATTERNS = [
  'email', 'phone', 'name', 'address', 'ssn', 'passport',
  'dateOfBirth', 'birthDate', 'latitude', 'longitude',
];

/**
 * Data Anonymizer
 * Provides anonymization, pseudonymization, and PII detection
 * for compliance with privacy regulations (GDPR, India's DPDP Act)
 */
export class DataAnonymizer {
  private pseudonymMap: Map<string, string> = new Map();

  /**
   * Anonymize a birth chart record for analytics/sharing
   */
  anonymizeChartData(chart: Record<string, any>): Record<string, any> {
    const anonymized = { ...chart };

    if (anonymized.birthData) {
      anonymized.birthData = {
        ...anonymized.birthData,
        name: this.pseudonymize(anonymized.birthData.name || ''),
        // Keep date/time/location as they're needed for chart calculation
        // but strip direct identifiers
      };
    }

    delete anonymized.userId;
    delete anonymized.notes;

    return anonymized;
  }

  /**
   * Pseudonymize a value (consistent mapping, reversible with key)
   */
  pseudonymize(value: string): string {
    if (!value) return value;

    if (this.pseudonymMap.has(value)) {
      return this.pseudonymMap.get(value)!;
    }

    const pseudonym = `Person_${this.simpleHash(value).toString(16).slice(0, 8)}`;
    this.pseudonymMap.set(value, pseudonym);
    return pseudonym;
  }

  /**
   * Fully anonymize (irreversible) a value
   */
  anonymize(value: string, preserveLength: boolean = false): string {
    if (!value) return value;
    return preserveLength ? '*'.repeat(value.length) : '[REDACTED]';
  }

  /**
   * Mask email address (keep domain visible)
   */
  maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return this.anonymize(email);

    const maskedLocal = local.length > 2
      ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
      : '*'.repeat(local.length);

    return `${maskedLocal}@${domain}`;
  }

  /**
   * Mask phone number (keep last 4 digits)
   */
  maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return '*'.repeat(digits.length);

    const visible = digits.slice(-4);
    return '*'.repeat(digits.length - 4) + visible;
  }

  /**
   * Detect PII fields in an object
   */
  detectPIIFields(obj: Record<string, any>): string[] {
    const detected: string[] = [];

    const scan = (data: Record<string, any>, prefix: string = '') => {
      Object.entries(data).forEach(([key, value]) => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        const lowerKey = key.toLowerCase();

        if (PII_FIELD_PATTERNS.some(pattern => lowerKey.includes(pattern.toLowerCase()))) {
          detected.push(fieldPath);
        }

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          scan(value, fieldPath);
        }
      });
    };

    scan(obj);
    return detected;
  }

  /**
   * Anonymize object by removing/masking detected PII fields
   */
  anonymizeObject(obj: Record<string, any>): { result: Record<string, any>; audit: AnonymizationResult } {
    const piiFields = this.detectPIIFields(obj);
    const result = JSON.parse(JSON.stringify(obj));

    piiFields.forEach(fieldPath => {
      const parts = fieldPath.split('.');
      let target = result;
      for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
        if (!target) return;
      }
      const lastKey = parts[parts.length - 1];
      if (target && target[lastKey] !== undefined) {
        target[lastKey] = this.anonymize(String(target[lastKey]));
      }
    });

    return {
      result,
      audit: {
        originalFieldCount: Object.keys(obj).length,
        anonymizedFieldCount: piiFields.length,
        fieldsProcessed: piiFields,
      },
    };
  }

  /**
   * Generate anonymized export for research/analytics purposes
   */
  generateAnonymizedDataset(records: Record<string, any>[]): Record<string, any>[] {
    return records.map(record => this.anonymizeObject(record).result);
  }

  /**
   * Right to erasure (GDPR Article 17) - purge user data
   */
  generateErasureManifest(userId: string, dataStores: string[]): {
    userId: string;
    dataStores: string[];
    requestedAt: number;
    estimatedCompletionTime: number;
  } {
    return {
      userId,
      dataStores,
      requestedAt: Date.now(),
      estimatedCompletionTime: Date.now() + 30 * 86400000, // 30 days per GDPR
    };
  }

  /**
   * Clear pseudonym mapping (for testing/reset)
   */
  clearPseudonymMap(): void {
    this.pseudonymMap.clear();
  }

  // ==================== PRIVATE METHODS ====================

  private simpleHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

let dataAnonymizer: DataAnonymizer | null = null;

export function getDataAnonymizer(): DataAnonymizer {
  if (!dataAnonymizer) {
    dataAnonymizer = new DataAnonymizer();
  }
  return dataAnonymizer;
}
